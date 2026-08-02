# Journal de friction — Test du Process AAS V0.2.1

> Règle : 1 friction = 1 ligne, notée à chaud (jamais de rattrapage en fin de session). Ne jamais éditer une ligne existante : ajouter une nouvelle ligne avec le statut.

| # | Date | Phase | Friction observée | Gravité (Bloquant/Majeur/Mineur) | Correction suggérée | Statut |
|---|------|-------|-------------------|----------------------------------|---------------------|--------|
| 1 | 2026-08-02 | 0-3 | Chronométrage des phases impossible en mode conversation (pas de début/fin nets) — le plan de test demande des temps par phase | Mineur | V0.3 : prévoir des marqueurs de temps dans le process (ex. « noter l'heure au démarrage de chaque phase ») ou une session dédiée | Ouvert |

## Mesures du test

| Mesure | Valeur |
|--------|--------|
| Temps par phase (0-9) | n/d — impossible en mode conversation (friction #1) |
| Validations Ams demandées | 2/2 conformes (mini-spec + recette) |
| Coût API total | ~0,44 $ (session complète 20260801_234259_f5005a : 495 appels, 99 M tokens dont 98,8 M en cache — deepseek-v4-flash) |
| Boucles agent (cas 3) | 0 |
| Frictions bloquantes | 0 |
| Frictions mineures | 1 (chronométrage) |

## Verdict du test

**🟢 RÉUSSI** (2026-08-02) — 0 friction bloquante, 1 mineure (≤ 5) → passage en V0.3 (intégrer §12 + corriger friction #1).
