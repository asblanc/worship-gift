# 🎤 Runbook — Grand concert Gospel (sécurité & disponibilité)

Guide opérationnel pour que le site tienne la charge, reste disponible et
sécurisé pendant l'événement (forte affluence + risque d'attaque).

> Principe directeur : **le tunnel billetterie ne doit jamais tomber**
> (`/billetterie` → `/billetterie/[slug]/reserver` → `/billetterie/checkout`
> → paiement CMI → `/billetterie/success`).

---

## 1. Défenses déjà en place (rappel technique)

| Domaine | Mesure |
|--------|--------|
| Anti-DDoS applicatif | Rate-limit par IP : orders 10/min, contact 5/min, cmi-init 15/min, validation billets 60/min. **Distribué via Upstash** si configuré, sinon repli mémoire. |
| En-têtes | CSP stricte, **HSTS**, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy, Permissions-Policy. |
| Paiement | Vérification du **HASH CMI** au callback (rejet si `HASH_INVALID`). Client `service_role` isolé côté serveur. |
| Admin | Routes protégées par `app_metadata.role === "admin"` (non modifiable par l'utilisateur). |
| Cron | `/api/cron/event-reminders` protégé par `CRON_SECRET` (Bearer). |
| Perf | Pages vitrine en **statique** (home, galerie, billetterie, contact) → servies par le CDN, insensibles à la charge DB. |

---

## 2. Checklist J-7 (préparation)

### Variables d'environnement (Vercel → Production)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` ← **active le rate-limit distribué** (créer une base gratuite sur upstash.com)
- [ ] `CRON_SECRET` (valeur aléatoire : `openssl rand -hex 32`)
- [ ] `RESEND_API_KEY`, `RESEND_FROM` (domaine vérifié), `CONTACT_EMAIL=contact@worship-gift.com`
- [ ] `PAYMENT_ENV=prod` + `CMI_CLIENT_ID`, `CMI_STORE_KEY`, `CMI_CALLBACK_URL` (URL prod réelle)
- [ ] `NEXT_PUBLIC_SITE_URL=https://www.worship-gift.com`
- [ ] Vérifier que la boîte **contact@worship-gift.com** reçoit bien (test réel).

### Supabase
- [ ] **RLS activé** sur TOUTES les tables (commandes, billets…) ; policies vérifiées (un user ne lit que ses données).
- [ ] Utiliser le **connection pooler** (mode *transaction*, port 6543) pour les requêtes serverless — évite l'épuisement des connexions sous charge.
- [ ] Vérifier le **plan** (le plan gratuit a des limites de connexions/CPU) → passer au plan payant si affluence attendue > quelques centaines de simultanés.
- [ ] Activer les **sauvegardes / PITR**.

### Vercel
- [ ] Plan **Pro** (concurrence de fonctions + Firewall avancé).
- [ ] **Vercel Firewall** : créer une règle de *rate-limit edge* sur `/api/*` (ex. 100 req/min/IP) — filtre AVANT même d'atteindre les fonctions.
- [ ] Repérer où activer l'**Attack Challenge Mode** (Settings → Firewall) pour l'activer en 1 clic le jour J si attaque.
- [ ] Vérifier les **alertes** (email/Slack) sur erreurs & usage.

### Paiement
- [ ] Faire une **transaction réelle de test** en prod (petit montant) de bout en bout, puis rembourser.
- [ ] Confirmer que le callback CMI arrive et met la commande à `paid`.

---

## 3. Checklist J-1 → J-H (gel & bascule)

- [ ] **Gel du code** : aucun déploiement la veille/le jour J, sauf hotfix validé.
- [ ] Confirmer que le dernier déploiement est **READY** et le noter comme point de **rollback**.
- [ ] Test de charge léger sur les endpoints clés (`k6`, `autocannon`) : `/billetterie`, `POST /api/orders`, `POST /api/payment/cmi/init`.
- [ ] Vérifier Upstash actif (les 429 doivent apparaître au-delà des seuils lors du test).
- [ ] Astreinte : au moins 1 personne dispo avec accès Vercel + Supabase pendant l'événement.

---

## 4. Pendant l'événement (monitoring)

**À surveiller en continu :**
- Vercel **Observability** : taux de 5xx, latence p95, nombre d'invocations, fonctions en erreur.
- Supabase : **connexions actives**, CPU, requêtes lentes.
- Logs `/api/payment/cmi/callback` : ratio succès/échec paiement.

**Seuils d'alerte (exemples) :** 5xx > 2 %, latence p95 > 2 s, connexions DB > 80 % du quota.

**Si pic de trafic légitime :** les pages vitrine (CDN) tiennent seules ; surveiller surtout la DB et le paiement. Augmenter le plan Supabase si besoin.

---

## 5. En cas d'attaque / d'incident

| Symptôme | Action immédiate |
|----------|------------------|
| Trafic anormal / DDoS | Vercel → Firewall → **Attack Challenge Mode ON** ; ajouter une règle bloquant l'IP/région source. |
| Pic d'abus sur une API | Baisser temporairement les seuils de rate-limit (code) OU règle Firewall edge. |
| DB saturée | Vérifier le pooler ; upgrade plan Supabase ; couper temporairement les features non critiques. |
| Bug bloquant après deploy | Vercel → Deployments → **Promote** le dernier déploiement stable (rollback instantané, ~10 s). |
| Paiement KO | Vérifier clés CMI + URL callback ; basculer un canal de secours (virement/WhatsApp) annoncé sur la page. |

**Rollback :** Vercel garde l'historique — « Promote to Production » sur un ancien déploiement rétablit la version précédente sans rebuild.

---

## 6. Après l'événement
- [ ] Repasser `PAYMENT_ENV` si besoin, désactiver l'Attack Challenge Mode.
- [ ] Revue des logs / incidents, ajuster les seuils de rate-limit.
- [ ] Export des commandes/billets pour comptabilité.

---

### Limites connues (transparence)
- Le rate-limit **mémoire** (sans Upstash) ne protège pas contre un DDoS distribué → **configurer Upstash** est la principale action à ne pas oublier.
- La protection volumétrique réelle se joue au niveau **edge (Vercel Firewall)**, pas dans le code applicatif.
