# Mini-spec — Générateur de devis (V1)

> Phase 3 — Brief produit (mode léger) · 2026-08-02 · **En attente validation Ams**

## Objectif

Un outil **local** qui génère des devis PDF professionnels en < 5 min, avec numérotation automatique, calculs exacts et historique consultable.

## Utilisateur

Ams (mono-utilisateur, Mac + Windows possible). Pas de comptes, pas de partage.

## Parcours principal

1. Ouvrir l'outil (double-clic sur `index.html` — aucun serveur ni install).
2. « Nouveau devis » → formulaire : client (nom, contact), prestations (libellé, quantité, prix unitaire), taux TVA, notes/conditions.
3. Enregistrer → numéro auto `DEV-2026-001`, date du jour, totaux calculés.
4. « Exporter PDF » → impression navigateur propre (print CSS), téléchargement/sauvegarde.
5. Retrouver dans la liste, changer le statut (brouillon / envoyé / accepté / refusé).

## Écrans (3, non triviaux)

| Écran | Contenu |
|---|---|
| **Liste devis** | Tableau : n°, client, date, montant TTC, statut · bouton Nouveau · recherche par client/n° |
| **Formulaire devis** | Client (nom*, contact), lignes prestations* (libellé, qté > 0, PU), taux TVA (défaut configurable : 18 % Guinée / 20 % France / 0 %), notes, conditions de paiement (libre) · boutons Enregistrer / Exporter PDF |
| **Aperçu / export** | Aperçu dans le navigateur (onglet print) + PDF via impression |

## Données (JSON local, `data/devis.json`)

- Devis : `{ id, numero, date, client {nom, contact}, lignes [{libelle, quantite, prixUnitaire}], tvaTaux, notes, conditions, statut, dateMAJ }`
- Réglage : `{ tvaParDefaut, nom, contactAms }` (configurable dans l'app, stocké à côté)

## Règles métier

- Numérotation : `DEV-YYYY-NNN` (séquence annuelle, jamais réutilisée)
- Calculs : HT = Σ (qté × PU) · TVA = HT × taux · **TTC = HT + TVA**
- Champs requis : nom client, ≥ 1 prestation, quantités > 0 → message d'erreur clair sinon
- Persistance : tout est enregistré à la sauvegarde, rechargeable à la réouverture

## Hors périmètre V1

Factures · relances · compta · multi-utilisateurs · cloud · paiement en ligne · modèles multiples · signature numérique

## Benchmark rapide (Phase 2)

| Solution | Forces | Limites pour le besoin | Score |
|---|---|---|---|
| **Coover** (gratuit en ligne) | Gratuit, sans inscription, PDF | Cloud, conforme France (pas Guinée), réforme 2026/27 | 7/10 |
| **Zoho Invoice** (gratuit 1 user) | Complet, devis + factures | Compte + cloud, surdimensionné, données hors machine | 7/10 |
| **Qonto Facturation** (gratuit) | Illimité, mobile + web | Compte bancaire/cloud, orienté France | 6/10 |
| Modèles Word/Excel | Gratuit, hors-ligne | Manuel, zéro automatisation (situation actuelle) | 3/10 |

Aucun concurrent > 8/10 pour le besoin (local, simple, TVA configurable, conditions mobile money) → **Go** confirmé.

## Critères d'acceptation (recette Phase 9)

- [ ] Devis créé → n° auto correct (DEV-2026-001 puis +1), date du jour
- [ ] Calculs exacts sur 3 cas test (TVA 0 %, 18 %, 20 % ; plusieurs lignes)
- [ ] Champs requis : erreur claire si client vide ou 0 ligne ou qté ≤ 0
- [ ] PDF exporté proprement lisible (en-tête, tableau, totaux, conditions)
- [ ] Devis rechargé depuis la liste avec toutes ses données
- [ ] Statut modifiable et persisté
- [ ] Données conservées après fermeture/réouverture du navigateur
- [ ] Taux TVA par défaut modifiable dans les réglages

## Prochaine étape

Phase 6 — `docs/PLAN_DEV.md` (stack : web local HTML/CSS/JS sans dépendance, PDF via print CSS — à confirmer en Phase 6).
