# Plan de dev — Générateur de devis (V1)

> Phase 6 (architecture) + Phase 7 (backlog) — mode léger · 2026-08-02 · Base validée : `docs/MINI_SPEC.md`

## Stack (justifiée)

**HTML + CSS + JavaScript pur, aucune dépendance, zéro install.**
- Fonctionne en double-cliquant `app/index.html` (file://) sur Mac **et** Windows
- Pas de framework, pas de build, pas de serveur → rien à maintenir, rien qui casse
- PDF via le dialogue d'impression du navigateur (print CSS, format A4) — zéro dépendance PDF
- Le seul risque de cette stack : le stockage (voir ci-dessous)

## Décision de stockage (documentée — écart assumé vs mini-spec)

La mini-spec disait « JSON local `data/devis.json` ». En pur file://, le navigateur **ne peut pas écrire** dans un fichier sans permissions spéciales. Choix V1 :

- **Stockage principal : `localStorage`** (persiste dans le navigateur, rechargeable, zéro friction)
- **Export / import JSON** : bouton « Sauvegarder » → télécharge `devis.json` ; « Restaurer » → recharge un fichier. C'est la sauvegarde réelle et portable.

→ Critères d'acceptation respectés (persistance après fermeture, rechargement). À noter en observation dans la recette.

## Structure

```
generateur-devis/
├── README.md, docs/…
└── app/
    ├── index.html      ← application (3 vues : liste / formulaire / aperçu-print)
    ├── styles.css      ← styles écran + styles print (A4)
    └── app.js          ← logique : données, numérotation, calculs, rendu, export/import
```

## Modèle de données (localStorage clé `devis.app.v1`)

```js
{
  reglages: { nom: "Ams", contact: "", tvaParDefaut: 18 },
  devis: [
    { id: "d_1725…", numero: "DEV-2026-001", date: "2026-08-02",
      client: { nom: "…", contact: "…" },
      lignes: [{ libelle: "…", quantite: 1, prixUnitaire: 50000 }],
      tvaTaux: 18, notes: "…", conditions: "…", statut: "brouillon", dateMAJ: "…" }
  ]
}
```

## Règles d'implémentation

- **Fonctions pures testables** : `calculHT(lignes)`, `calculTVA(lignes, taux)`, `calculTTC(...)`, `prochainNumero(devis, annee)` → testables avec node sans navigateur
- Numérotation : `DEV-YYYY-NNN` où NNN = nombre de devis de l'année + 1 (jamais réutilisé)
- Rendu par re-render de l'état (état → DOM), pas de mutations dispersées
- Validation formulaire : client nom requis, ≥ 1 ligne, quantités > 0, PU ≥ 0
- Print : vue dédiée cachée à l'écran, visible en print (ou contenu print CSS) — en-tête (nom, contact, n°, date), tableau, totaux HT/TVA/TTC, conditions, statut

## Backlog V1 (stories 1-4h, critères d'entrée/sortie)

| Story | Entrée | Sortie (critère de sortie) |
|---|---|---|
| **S1 — Squelette app + vues** | mini-spec écrans | index.html/styles.css/app.js chargés, navigation liste↔formulaire fonctionnelle |
| **S2 — Modèle + logique pure** | S1 | fonctions calculs/numérotation en place, tests node verts |
| **S3 — Formulaire devis** | S1, S2 | ajout/suppression lignes, validation, erreurs claires, enregistrement |
| **S4 — Liste + recherche + statuts** | S2 | tableau, recherche client/n°, changement de statut persisté |
| **S5 — Aperçu + export PDF** | S1 | impression A4 propre : en-tête, tableau, totaux, conditions |
| **S6 — Réglages + export/import JSON** | S2 | TVA par défaut modifiable, identité Ams, sauvegarde/restauration devis.json |
| **S7 — Tests + revue + docs** | S2 | tests node exécutés, revue code (I6), README app, guide 2 lignes |

## Tests

- `app/test-logic.js` : tests node des fonctions pures (calculs 3 cas TVA, numérotation, validation)
- Manuel (recette) : parcours UI complet + impression PDF (vérifié par Ams)

## Hors périmètre technique V1

Routeur, framework, base de données, serveur, PWA, comptes, cloud, facturation.

## Risques / anti-surarchitecture

- Ne pas ajouter de dépendance « pour plus tard » (YAGNI)
- localStorage lié au navigateur : documenter l'export/import comme réflexe de sauvegarde
- print CSS à tester sur Chrome (Mac/Windows) — cible principale ; Safari en second

## Déploiement

Aucun (outil local). « Livraison » = copie du dossier `app/`. Sauvegarde = export JSON.
