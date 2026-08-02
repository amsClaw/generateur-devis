# Rétrospective — Test terrain Process AAS V0.2.1

> Projet test : générateur de devis (mode léger) · 2026-08-02 · Livrable obligatoire (§7 du process)

## Verdict du test

**🟢 RÉUSSI** — 0 friction bloquante, 1 friction mineure (≤ 5 requis), 2 validations Ams conformes au §9 (mini-spec + recette), 0 boucle agent (cas 3), 0 livrable manquant, 0 dépassement de périmètre V1.

## Ce qui a bien fonctionné

- **Templates actionnables** : chaque prompt a produit le livrable attendu sans improvisation (B1 respecté — un seul prompt, une seule source de vérité).
- **Points de validation bien placés** : 2 seulement en mode léger (mini-spec, recette), conditions observables (B3) respectées à chaque fois.
- **Transitions claires** (B2) : aucun doute sur l'enchaînement des phases ni sur quoi faire en cas de correction.
- **Séparation logique pure / UI** (`logique.js` en UMD) : 25 tests node exécutés avant toute vérification navigateur → confiance élevée à coût ~0.
- **Vérification réelle** : le parcours navigateur complet (création, persistance, édition, recherche, PDF, réglages) a validé le comportement, pas seulement la compilation.
- **Mode léger resté léger** : 3 livrables clés (IDEE / MINI_SPEC / PLAN_DEV) + recette — zéro surdocumentation.
- **Journal de friction à chaud** : la seule friction a été captée immédiatement, avec correction suggérée.

## Ce qui pourrait être amélioré

- **Chronométrage des phases** (friction #1) : impossible en mode conversation (pas de début/fin nets). → V0.3 : marqueurs de temps dans le process, ou exécution en session dédiée.
- **Phase 0.5 non exercée** : une seule idée candidate → pas de sélection d'opportunité. À tester sur un vrai arbitrage multi-idées.

## Prompts les plus efficaces

1. `IDEATION_PROJET_LEGER.md` — structure décisionnelle 1 page, Go/No-Go immédiat
2. Cycle de développement avec tests + vérification navigateur — détecte les vrais bugs
3. Prompt de recette (critères d'acceptation vérifiables) — recette rapide et sans ambiguïté

## Patterns à réutiliser

- **Logique pure UMD + tests node avant UI** (coût ~0, fiabilité élevée)
- **Vérification navigateur automatisée** comme étape systématique de recette (browser + console)
- **Journal de friction** noté à chaud, 1 ligne = 1 friction, jamais édité après coup

## Leçons pour le prochain projet

- Exécuter le process en **session dédiée** si les temps par phase sont un critère de mesure.
- Le **mode semi-automatique** est le bon rythme : l'agent avance, Ams valide court.
- Prochain terrain à valider : le **mode complet** (triage avec données sensibles) — candidat naturel : relance paiements WhatsApp ou le prochain projet client.

## Suite (boucle I4)

- [x] Rétrospective écrite
- [ ] Mettre à jour `PROJECTS_INDEX.md` avec les leçons (fait en parallèle)
- [x] Verdict → créer la tâche « Intégrer §12 → V0.3 » (voir NEXT_STEPS du projet AAS)
- [ ] V0.3 : intégrer §12 (D1-D9) + corriger friction #1 (marqueurs de temps)
