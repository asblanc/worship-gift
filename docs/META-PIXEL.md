# Meta Pixel & Conversions API — Worship Gift

Pixel : **439132812615919** (« Pixel de Keyann Wellborn Olivier C… »)
Site : `https://www.worship-gift.com`

---

## 1. Ce qui est installé dans le code

| Fichier | Rôle |
|---|---|
| `src/components/MetaPixel.tsx` | Charge `fbevents.js` + `PageView` (inline, rendu serveur) et renvoie un `PageView` à chaque navigation interne |
| `src/lib/meta-pixel.ts` | Helpers navigateur : `trackMeta()`, `metaContentParams()`, `newMetaEventId()` |
| `src/lib/meta-capi.server.ts` | Conversions API côté serveur (SHA-256 sur email/téléphone/nom) |
| `next.config.ts` | CSP élargie à `connect.facebook.net` + `www.facebook.com` |
| `src/app/layout.tsx` | Montage du pixel + balise de vérification de domaine |

Le pixel est **désactivé tant que `NEXT_PUBLIC_META_PIXEL_ID` est absent** :
aucun script Meta n'est alors chargé (même logique que Google Analytics).

---

## 2. Variables d'environnement (Vercel → Settings → Environment Variables)

| Variable | Valeur | Obligatoire |
|---|---|---|
| `NEXT_PUBLIC_META_PIXEL_ID` | `439132812615919` | ✅ oui |
| `META_CAPI_ACCESS_TOKEN` | jeton Conversions API | ⚠️ fortement recommandé |
| `NEXT_PUBLIC_META_DOMAIN_VERIFICATION` | code de la méta-balise | recommandé (iOS) |
| `META_TEST_EVENT_CODE` | `TESTxxxxx` | uniquement pendant les tests |
| `META_GRAPH_VERSION` | `v23.0` (défaut) | non |

**Appliquer aux 3 environnements** (Production, Preview, Development), puis
**redéployer** — les variables `NEXT_PUBLIC_*` sont figées au build.

### Générer le jeton Conversions API
Gestionnaire d'évènements → le pixel → **Paramètres** → *Conversions API* →
**Générer un token d'accès**. Ce jeton reste **serveur uniquement** (jamais de
préfixe `NEXT_PUBLIC_`, jamais commité).

### Vérifier le domaine
Business Manager → **Sécurité de la marque** → **Domaines** → ajouter
`worship-gift.com` → méthode « méta-balise » → copier la valeur du
`content="…"` dans `NEXT_PUBLIC_META_DOMAIN_VERIFICATION`.
Sans ça, impossible de configurer les évènements agrégés → perte de mesure
sur tout le trafic iOS.

---

## 3. Évènements envoyés

| Évènement Meta | Déclencheur | Où |
|---|---|---|
| `PageView` | chaque page, y compris navigations internes | global |
| `ViewContent` | ouverture de la page de réservation | `/billetterie/[slug]/reserver` |
| `AddToCart` | choix d'une formule (Standard, VIP, Gold…) | `TicketTiers`, page réservation |
| `InitiateCheckout` | clic sur « Payer en ligne » → billetteries.ma | accueil, billetterie, formules, réservation |
| `Lead` | **commande à la livraison enregistrée** (pixel **+ serveur**) | `/api/orders` |
| `Contact` | clic WhatsApp flottant, formulaire de contact | global, `/contact` |
| `Purchase` | commande passée à `paid` (tunnel CMI) | `/billetterie/success` |

Tous les évènements à valeur portent `value` (en MAD, pas en centimes),
`currency: "MAD"`, `content_ids`, `contents`, `num_items` — c'est ce format
que l'algorithme Meta exploite pour l'optimisation par valeur.

### Déduplication pixel ↔ serveur
`Lead` et `InitiateCheckout` issus de `/api/orders` sont envoyés **deux fois** :
une fois par le navigateur, une fois par le serveur, avec le **même `event_id`**
(généré par `newMetaEventId()` et transmis dans le corps de la requête).
Meta ne les compte qu'une seule fois. C'est ce qui permet de récupérer les
30-40 % de conversions perdues à cause des bloqueurs de pub et d'iOS.

---

## 4. ⚠️ Limite importante pour le paramétrage de la campagne

Le **paiement en ligne se fait sur `billetteries.ma`**, un domaine tiers sur
lequel nous ne pouvons pas poser le pixel. Conséquence directe :

> **`Purchase` n'est PAS mesurable pour les ventes en ligne.**
> Le dernier signal côté Worship Gift est `InitiateCheckout`.

Deux options pour la campagne :

1. **Optimiser sur `Lead`** (recommandé au démarrage) — la commande
   « paiement à la livraison » est enregistrée chez nous, donc mesurée de bout
   en bout, pixel **et** Conversions API. Signal fiable à 100 %.
2. **Optimiser sur `InitiateCheckout`** si l'objectif est de pousser le
   paiement en ligne — plus de volume, mais signal moins qualifié.

Pour récupérer `Purchase` sur les ventes en ligne, il faudrait demander à
billetteries.ma d'ajouter notre pixel sur leur page de confirmation, ou de
rediriger vers `/billetterie/success?order=…` après paiement.

---

## 5. Vérifier que ça fonctionne

### a) Extension Meta Pixel Helper (Chrome)
1. Installer *Meta Pixel Helper*.
2. Ouvrir `https://www.worship-gift.com` → l'icône doit afficher
   **1 pixel trouvé · 439132812615919 · PageView**.
3. Naviguer vers *Billetterie* → un nouveau `PageView`.
4. Cliquer une formule (« À la livraison ») → `AddToCart`.
5. Sur la page de réservation → `ViewContent`.
6. Remplir nom + téléphone → « Paiement à la livraison » → `Lead`.

### b) Test Events (le plus fiable, inclut le serveur)
Gestionnaire d'évènements → le pixel → onglet **Tester les évènements**.
Coller l'URL du site, naviguer : les évènements apparaissent en temps réel.
Pour tester aussi la Conversions API, renseigner temporairement
`META_TEST_EVENT_CODE` avec le code affiché dans cet onglet — les évènements
serveur s'y afficheront avec la mention *Serveur*, et les paires dédupliquées
seront signalées **« Déduplication : oui »**.
👉 **Retirer `META_TEST_EVENT_CODE` après le test** : tant qu'il est défini,
les évènements serveur ne comptent pas dans les vraies statistiques.

### c) Qualité de l'appariement
Après 24-48 h : Gestionnaire d'évènements → onglet **Aperçu** → *Note de
qualité de l'appariement des évènements*. Viser **6/10 minimum** sur `Lead`.
Le téléphone et l'email hachés (déjà envoyés) sont les principaux leviers.

### d) Contrôle rapide en console navigateur
```js
typeof fbq          // "function" → le pixel est chargé
document.cookie     // doit contenir _fbp (et _fbc si arrivée depuis une pub)
```
Si `fbq` est `undefined` : vérifier que `NEXT_PUBLIC_META_PIXEL_ID` est bien
défini **et que le site a été redéployé après l'ajout**.

---

## 6. Paramétrage recommandé de la campagne

- **Objectif** : Ventes (ou Prospects si optimisation sur `Lead`).
- **Évènement de conversion** : `Lead` — voir §4.
- **Évènements agrégés (iOS)** : après vérification du domaine, classer dans
  cet ordre : `Purchase` > `Lead` > `InitiateCheckout` > `AddToCart` >
  `ViewContent` > `Contact` > `PageView`.
- **Audiences personnalisées** à créer (elles se remplissent dès maintenant) :
  - visiteurs `/billetterie*` sur 30 j → retargeting ;
  - `AddToCart` sans `Lead` sur 14 j → relance « il reste des places » ;
  - `Lead` (30 j) → à **exclure** des campagnes d'acquisition.
- **Audience similaire (lookalike)** : à créer sur la base `Lead` dès ~100
  évènements accumulés — c'est le principal levier de scaling.
- **Fenêtre d'attribution** : 7 jours après clic / 1 jour après vue.
- Laisser tourner ≥ 3-4 jours sans modifier le budget : la phase
  d'apprentissage demande ~50 conversions par ensemble de publicités.
