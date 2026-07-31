# Campagne Meta — Concert Jonathan Gambela (11 octobre 2026)

Feuille de route de paramétrage. Tout est prêt à recopier dans le
Gestionnaire de publicités. Les champs marqués 🔴 demandent une décision
de ta part.

**Rappel des données de l'événement**
Concert Live de Jonathan Gambela · 11 octobre 2026, 15h00 · Casablanca
Standard 200 · VIP 500 · Duo VIP 800 · Gold 1000 · Duo Gold 1600 MAD
WhatsApp : +212 605 426 406 · Site : www.worship-gift.com

---

## 0. Avant de lancer — les 4 points bloquants

| # | À faire | Qui |
|---|---|---|
| 1 | Mail au prestataire billetteries.ma (suivi des ventes) | 🔴 toi |
| 2 | Token Conversions API + vérification du domaine sur Vercel | 🔴 toi (je redéploie) |
| 3 | 🔴 **Préciser la salle du concert** — le site n'indique que « Casablanca ». Les gens ne réservent pas sans savoir où | toi |
| 4 | 4-5 vidéos verticales 9:16 | 🔴 toi |
| 5 | Compte Instagram professionnel relié à la Page Facebook | toi |

Le point 3 est sous-estimé : une pub d'événement sans lieu précis perd
une part importante de ses conversions. À corriger dans
`src/lib/events-config.ts` (champ `location`) — dis-le-moi, c'est 1 minute.

---

## 1. Structure des campagnes

Trois campagnes, créées dans cet ordre.

### Campagne A — WhatsApp (le moteur des ventes)

| Champ | Valeur |
|---|---|
| Objectif | **Interactions** → *Messages* |
| Destination | **WhatsApp** |
| Optimisation | Conversations démarrées |
| Budget | 🔴 CBO au niveau campagne, voir §4 |
| Calendrier | Dès maintenant → 11 octobre |
| Lieu | Casablanca +50 km, + Rabat, + Mohammedia |
| Âge | 18-55 |
| Langue | Français |
| Ciblage détaillé | **Aucun au départ** — audience large, laisse l'algorithme |
| Placements | Advantage+ (automatiques) |
| Message pré-rempli | `Bonjour, je souhaite des informations sur le concert de Jonathan Gambela du 11 octobre à Casablanca.` |

C'est la campagne qui produira des ventes en premier : le paiement à la
livraison via WhatsApp correspond à la façon dont on achète au Maroc, et
aucune mesure externe n'est nécessaire — tout se compte dans Meta.

### Campagne B — Conversions site (le panier moyen)

| Champ | Valeur |
|---|---|
| Objectif | **Ventes** |
| Ensemble de données | Pixel de Keyann Wellborn Olivier C… (`439132812615919`) |
| Évènement de conversion | **`Lead`** ← surtout pas « Achat », voir §5 |
| URL de destination | `https://www.worship-gift.com/billetterie` |
| Optimisation | Conversions |
| Fenêtre d'attribution | 7 jours après clic, 1 jour après vue |
| Ciblage | identique à la campagne A |

Le site vend les formules VIP et Gold, ce qu'un message WhatsApp ne fait
pas. C'est là que se joue ton panier moyen (500 à 1600 MAD).

⚠️ Ne lance cette campagne que si ton budget permet ~50 `Lead` par semaine
(voir §4). En dessous, elle restera bloquée en apprentissage.

### Campagne C — Retargeting (à activer semaine 3)

| Champ | Valeur |
|---|---|
| Objectif | Ventes → évènement `Lead` |
| Audiences | voir §3 |
| Budget | ~20 % du total |
| Fréquence à surveiller | rester sous 4 |

Sur un événement daté, c'est presque toujours la campagne la plus
rentable du dispositif.

---

## 2. Les textes de pub — prêts à copier

5 angles. Lance-les **tous en même temps** dans un seul ensemble de
publicités, laisse Meta arbitrer, coupe les deux plus faibles après 5-7
jours.

### Angle 1 — Ferveur / émotion
> **Texte principal**
> Le 11 octobre, Casablanca va vibrer. 🔥
>
> Jonathan Gambela sur scène, en live, pour une soirée d'adoration comme tu n'en as jamais vécu.
> Des voix, une louange, une salle entière debout.
>
> Places à partir de 200 MAD — paiement à la livraison possible.
>
> **Titre** : Jonathan Gambela en concert à Casablanca
> **Description** : 11 octobre 2026 · Places limitées
> **CTA** : Réserver

### Angle 2 — L'artiste
> **Texte principal**
> Tu écoutes Jonathan Gambela depuis des années.
> Le 11 octobre, tu vas le vivre en vrai. 🎤
>
> Un concert live de gospel et d'adoration, au cœur du mouvement Worship Gift.
> Casablanca · 11 octobre 2026 · 15h00
>
> **Titre** : Jonathan Gambela — Live à Casablanca
> **Description** : À partir de 200 MAD
> **CTA** : En savoir plus

### Angle 3 — Le Meet & Greet (pousse le haut de gamme)
> **Texte principal**
> Et si tu rencontrais Jonathan Gambela ? 📸
>
> La formule Gold, c'est le premier rang face à la scène, une collation premium, un Meet & Greet et une photo souvenir avec lui.
>
> Elles partent vite. 11 octobre, Casablanca.
>
> **Titre** : Formule Gold — Meet & Greet inclus
> **Description** : Places VVIP en nombre très limité
> **CTA** : Réserver

### Angle 4 — Lever le frein du paiement
> **Texte principal**
> Pas de carte bancaire ? Aucun problème. 🚚
>
> Réserve ta place pour le concert de Jonathan Gambela et paie **en espèces à la livraison**. Un agent passe encaisser, tu reçois ton billet numérique.
>
> Simple, sans risque. 11 octobre, Casablanca.
>
> **Titre** : Réserve maintenant, paie à la livraison
> **Description** : Billet numérique avec QR code
> **CTA** : Envoyer un message *(campagne WhatsApp)*

### Angle 5 — Urgence (à garder pour les 3 dernières semaines)
> **Texte principal**
> ⏳ Plus que quelques jours avant le concert de Jonathan Gambela.
>
> Les formules VIP et Gold sont presque parties. Ne reste pas dehors le 11 octobre.
>
> **Titre** : Dernières places disponibles
> **Description** : Concert du 11 octobre · Casablanca
> **CTA** : Réserver

**Règle sur l'urgence** : n'écris « dernières places » que si c'est vrai.
Meta sanctionne les allégations trompeuses, et ton public le voit.

---

## 3. Audiences à créer

Gestionnaire de publicités → **Audiences** → Créer une audience personnalisée.

| Nom | Source | Règle | Durée |
|---|---|---|---|
| `WG — Visiteurs billetterie` | Site web | URL contient `billetterie` | 30 j |
| `WG — Intention forte` | Site web | Évènement `AddToCart` | 14 j |
| `WG — Ont commandé` | Site web | Évènement `Lead` | 30 j |
| `WG — Vidéo 50 %` | Vidéo | a regardé ≥ 50 % | 30 j |
| `WG — Engagement Insta/FB` | Compte | toute interaction | 90 j |

**Retargeting** : cible `Intention forte` + `Visiteurs billetterie`, en
**excluant** `Ont commandé`. Sans cette exclusion tu paies pour reparler à
des gens qui ont déjà acheté.

**Audience similaire** : dès que `Ont commandé` atteint ~100 personnes,
crée un lookalike 1 % Maroc. C'est ton levier de scaling — ne le crée pas
avant, il serait construit sur du bruit.

---

## 4. Budget 🔴

Le seul chiffre que je ne peux pas décider à ta place.

**Règle de décision :**

| Budget quotidien | Ce que tu fais |
|---|---|
| < 150 MAD/jour | **Campagne A (WhatsApp) uniquement.** Pas de campagne conversions : pas assez de volume, elle resterait en apprentissage |
| 150-400 MAD/jour | A (50 %) + B (30 %) + C (20 %) à partir de la semaine 3 |
| > 400 MAD/jour | Les 3 campagnes dès la semaine 2, + lookalike plus tôt |

**Répartition dans le temps — la plus importante :**

| Période | Part du budget total |
|---|---|
| Août (sem. 1-3) | 15 % — on construit les audiences |
| Septembre (sem. 4-7) | 25 % — montée en puissance |
| 20 sept → 11 oct | **60 %** — le sprint |

Sur un concert, l'essentiel des billets se vend dans les 15 derniers
jours. Ne dépense pas ton budget en août.

---

## 5. Les 5 erreurs à ne pas commettre

1. **Optimiser sur « Achat ».** Les achats en ligne se font sur
   billetteries.ma, invisibles pour ton pixel. L'algorithme ne recevrait
   aucun signal. → optimise sur **`Lead`**.
2. **Toucher au budget pendant l'apprentissage.** Toute modification
   relance la phase d'apprentissage. Ne touche à rien pendant 4 jours.
3. **Couper une pub trop tôt.** Attends 3 jours et ~1000 impressions
   avant de juger.
4. **Trop d'ensembles de publicités.** 1 ou 2 maximum au départ. Diviser
   le budget divise l'apprentissage.
5. **Une seule créa.** C'est la première cause d'échec. 4-5 variantes,
   toujours.

---

## 6. Ce que tu surveilles, et quand

**Tous les 2 jours, 3 chiffres seulement :**
- **Coût par résultat** (par conversation ou par `Lead`)
- **Fréquence** — au-dessus de 4, ton audience est saturée, élargis ou change de créa
- **CTR** — sous 1 %, le problème vient de la créa, pas du ciblage

**Chaque semaine :**
- Vérifier dans le Gestionnaire d'évènements que `Lead` remonte bien
- Croiser avec les commandes réelles dans `/admin/orders`
- Récupérer l'export des ventes du prestataire (si demande C acceptée)

Le vrai indicateur reste le nombre de billets vendus, pas le tableau de
bord Meta. Compare toujours les deux.

---

## 7. Où j'interviens, où tu interviens

**Moi (dis-le-moi et c'est fait) :**
- UTM sur les liens vers billetteries.ma
- Redéploiement après ajout des variables Meta
- Correction de la salle du concert dans la config
- Vérification technique que les évènements remontent
- Ajustements du site selon ce que révèlent les données

**Toi, obligatoirement :**
- Créer les campagnes dans le Gestionnaire de publicités
- Fournir les créatifs (vidéos)
- Décider du budget
- Le mail au prestataire
- Le token Conversions API et la vérification du domaine
- Répondre aux messages WhatsApp — c'est là que se concluent les ventes
