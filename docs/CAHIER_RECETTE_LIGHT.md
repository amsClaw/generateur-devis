# Cahier de recette light — Générateur de devis (V1)

> Phase 9 · 2026-08-02 · **En attente de validation Ams** (le seul critère non vérifiable automatiquement : l'impression PDF physique)

## Comment lancer l'app

Double-cliquer sur **`app/index.html`** (Mac ou Windows) — aucun serveur, aucune installation. Navigateur conseillé : Chrome.

## Résultats des tests automatisés

| # | Critère d'acceptation (mini-spec) | Résultat | Preuve |
|---|---|---|---|
| 1 | N° auto correct (DEV-2026-001 puis +1) + date du jour | ✅ OK | Test node + navigateur : DEV-2026-001 créé, date 2026-08-02 |
| 2 | Calculs exacts (TVA 0/18/20 %, plusieurs lignes) | ✅ OK | 25/25 tests node ; cas réel : 650 000 HT + 18 % = 767 000 TTC |
| 3 | Erreur claire si client vide, 0 ligne, qté ≤ 0 | ✅ OK | « Le nom du client est requis. Ligne 1 : le libellé est requis. » |
| 4 | PDF propre (en-tête, tableau, totaux, conditions) | ⏳ **À vérifier par toi** | Zone print vérifiée (contenu complet + window.print) — rendu papier à confirmer |
| 5 | Devis rechargé depuis la liste avec toutes ses données | ✅ OK | Réouverture après rechargement page : données intactes |
| 6 | Statut modifiable et persisté | ✅ OK | envoyé → sauvegardé → relu (test navigateur) |
| 7 | Données conservées après fermeture/réouverture | ✅ OK | localStorage vérifié après rechargement complet |
| 8 | TVA par défaut modifiable dans les réglages | ✅ OK | Réglages → TVA par défaut appliquée au formulaire |

**Observations du test :**
- Stockage : l'app utilise localStorage + export/import `devis.json` (écart documenté dans PLAN_DEV — en file://, un navigateur ne peut pas écrire de fichier sans permission ; l'export manuel sert de sauvegarde).
- Champ TVA vide = 0 % (silencieux) — acceptable en V1.

## Parcours de recette manuelle (~5 min, toi)

1. Double-clique sur `app/index.html` → l'app s'ouvre sur la liste
2. Vérifie que le devis d'exemple **DEV-2026-001** (École Test Conakry) est là
3. Clique **+ Nouveau devis** → remplis un client + 1-2 prestations → vérifie les totaux en direct
4. Clique **💾 Enregistrer** → le devis apparaît dans la liste avec un n° auto
5. Sur un devis, clique **🖨️ Exporter PDF** → choisis « Enregistrer au format PDF » dans le dialogue d'impression → ouvre le PDF et vérifie : en-tête (nom/contact), tableau des prestations, totaux HT/TVA/TTC, conditions
6. Change le statut d'un devis (ouvrir → statut → enregistrer) → vérifie qu'il est conservé
7. Va dans **Réglages** → modifie la devise (ex. GNF) et la TVA par défaut → **Enregistrer** → vérifie l'effet sur un nouveau devis
8. Bonus : **⬇️ Exporter** → un fichier `devis.json` se télécharge → **⬆️ Restaurer** ce même fichier → tes devis reviennent

## Verdict

- [ ] **Validé** — l'app répond au besoin, tous les critères OK
- [ ] **Validé avec ajustements** (préciser lesquels)
- [ ] **Corrections nécessaires** (bugs listés ci-dessous)

## Bugs / ajustements notés par Ams

| # | Description | Gravité | Correction |
|---|---|---|---|
| | | | |
