# Idée — Générateur de devis

> Phase 1 — Idéation (mode léger) · Agent Produit & Communication · 2026-08-02

## Problème

Ams doit produire des devis pour ses clients PME (sites vitrines, CRM école, digitalisation de processus). Fait aujourd'hui à la main (Word/Pages/Excel) : reformatage à chaque fois, risques d'erreurs de calcul et de numérotation, historique difficile à retrouver. Douleur : 30-60 min par devis et une image pas toujours professionnelle.

## Cible

Ams lui-même (freelance / activité PME). Mono-utilisateur, local, pas de multi-école ni de partage client.

## Solution minimale (V1)

Un outil local qui permet de :
1. Créer un devis : client (nom, contact), prestations (libellé, quantité, prix unitaire), taux de TVA configurable (Guinée 18 % / France 20 %), conditions et notes.
2. Numéroter automatiquement (`DEV-2026-001`…), dates auto.
3. Calculer automatiquement HT / TVA / TTC.
4. Exporter un **PDF propre et professionnel**.
5. Lister l'historique des devis (statut : brouillon / envoyé / accepté / refusé).

## Résultat observable

Un devis PDF professionnel généré en **moins de 5 minutes** (vs 30-60 min aujourd'hui), numérotation sans erreur, montants justes par construction, historique consultable en 1 clic.

## Hors périmètre V1

- ❌ Facturation / génération de factures (à partir du devis) — plus tard
- ❌ Relances automatiques (couvert par le skill invoice-chase / projet relance WhatsApp)
- ❌ Comptabilité, export compta
- ❌ Multi-utilisateurs, cloud, paiement en ligne
- ❌ Modèles de devis multiples / marque blanche

## Gain attendu

- **Temps** : ~50 min économisées par devis
- **Cohérence** : numérotation et calculs automatiques, zéro erreur
- **Professionnalisme** : PDF propre et homogène → meilleure image vis-à-vis des clients
- **Base réutilisable** : les données devis serviront plus tard pour les factures

## Recommandation (Go / No-Go / À clarifier)

**GO** — besoin réel et récurrent, implémentation courte (outil local), zéro coût, motivation forte. Hypothèses : < 3 non prouvées (usage perso avéré, besoin répétitif confirmé, stack simple).

## Questions ouvertes

- Format : web local (HTML/JS, navigateur) vs script Python ? → tranché en Phase 6
- Faut-il un aperçu avant export PDF, ou génération directe ? → tranché en Phase 6
- Champs client minimum : nom + contact suffisant en V1 ?
