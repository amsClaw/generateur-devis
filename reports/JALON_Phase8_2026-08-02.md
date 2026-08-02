# Jalon Phase 8 — Développement (2026-08-02)

> Format jalon (m3) · Projet : générateur-devis · Mode léger · Agent : Hermes

## 1. Ce qui a été fait (stories terminées)

Toutes les stories S1-S7 du backlog (PLAN_DEV.md) livrées en une passe :

- **S1** — Squelette app : `app/index.html` (3 vues : liste / formulaire / réglages), `app/styles.css` (écran + print A4), `app/app.js`
- **S2** — Logique pure séparée : `app/logique.js` (UMD : calculs, numérotation, validation, échappement) + `app/test-logic.js`
- **S3** — Formulaire : lignes dynamiques, validation avec erreurs claires, enregistrement
- **S4** — Liste : tri par n°, recherche client/n°, changement de statut, ouverture, suppression
- **S5** — Aperçu/export PDF : zone print dédiée, `window.print()`, mise en page A4
- **S6** — Réglages (identité, TVA par défaut, devise) + export/import `devis.json`
- **S7** — Tests + revue + docs

## 2. Vérifications réelles (pas seulement « ça marche »)

| Vérification | Résultat |
|---|---|
| `node --check` app.js + logique.js | OK (syntaxe valide) |
| `node test-logic.js` | **25/25 OK** (calculs HT/TVA/TTC 3 taux, numérotation 4 cas, validation 8 cas, échappement XSS, dates, formatage) |
| Ouverture `index.html` dans un navigateur (file://) | Charge sans erreur console (0 erreur JS) |
| Création devis complet (2 lignes, TVA 18 %) | DEV-2026-001, date du jour, HT 650 000 → TVA 117 000 → TTC 767 000 € exacts |
| Persistance | Devis toujours présent après rechargement complet de la page |
| Recherche | Filtre « Conakry » → 1 ligne ; recherche par n° fonctionnelle |
| Édition | Modification prix 500 000 → 550 000 → TTC recalculé 826 000 €, statut conservé |
| Validation | Formulaire vide → « Le nom du client est requis. Ligne 1 : le libellé est requis. » |
| Aperçu PDF | Zone print contient titre, n°, client, totaux, conditions ; `window.print()` déclenché |
| Réglages | Devise € → GNF sauvegardée puis réinitialisée ; TVA par défaut 18 % appliquée au formulaire |

## 3. Revue de code (prompt I6)

| Fichier:Ligne | Type | Gravité | Description | Correction |
|---|---|---|---|---|
| app.js (devis-pdf) | Qualité | Mineur | Un devis non enregistré exporté en PDF affiche « — » comme numéro | Documenté : exporter d'abord, ou V1.1 (auto-save avant print) |
| app.js (f-tva vide) | Qualité | Mineur | Champ TVA vide → traité comme 0 % silencieusement | Acceptable en V1 ; à noter dans la doc |
| app.js / index.html | Sécurité | OK | Toutes les saisies utilisateur échappées (`echapper`) avant innerHTML ; aucun secret, aucun réseau, aucune lib externe | — |
| logique.js | Tests | OK | 25 tests unitaires couvrant calculs, numérotation, validation, XSS | — |

Aucun bug bloquant, aucune faille de sécurité détectée.

## 4. Ce qui reste

- Recette manuelle Ams (Phase 9) : impression PDF physique, parcours réel
- V1.1 (suggestions) : dupliquer un devis, auto-save avant print, modèle de devis personnalisable

## 5. Décision attendue

Continuer vers Phase 9 (recette) — en cours.
