/* ===== Tests des fonctions pures — exécution : node test-logic.js ===== */
var L = require('./logique.js');
var tests = [];
function t(nom, cond) { tests.push({ nom: nom, ok: !!cond }); }

/* --- calculs --- */
t('HT simple (2 × 100 = 200)', L.calculHT([{ quantite: 2, prixUnitaire: 100 }]) === 200);
t('HT multi-lignes (250)', L.calculHT([
  { quantite: 2, prixUnitaire: 100 },
  { quantite: 1, prixUnitaire: 50 }
]) === 250);
t('HT lignes vides = 0', L.calculHT([]) === 0);
t('HT valeurs invalides → 0', L.calculHT([{ quantite: 'abc', prixUnitaire: 10 }]) === 0);
t('TVA 18 % (100 → 18)', L.calculTVA([{ quantite: 1, prixUnitaire: 100 }], 18) === 18);
t('TVA 20 % (100 → 20)', L.calculTVA([{ quantite: 1, prixUnitaire: 100 }], 20) === 20);
t('TVA 0 % = 0', L.calculTVA([{ quantite: 1, prixUnitaire: 100 }], 0) === 0);
t('TTC 18 % (2 × 100 → 236)', L.calculTTC([{ quantite: 2, prixUnitaire: 100 }], 18) === 236);

/* --- numérotation --- */
var p1 = L.prochainNumero({}, 2026);
t('1er devis année → DEV-2026-001', p1.numero === 'DEV-2026-001');
var p2 = L.prochainNumero(p1.seq, 2026);
t('2e devis même année → DEV-2026-002', p2.numero === 'DEV-2026-002');
var p3 = L.prochainNumero(p2.seq, 2027);
t('changement d année → DEV-2027-001', p3.numero === 'DEV-2027-001');
var p4 = L.prochainNumero({ 2026: 41 }, 2026);
t('séquence continue (42)', p4.numero === 'DEV-2026-042');
t('seq préservée entre appels', p2.seq[2026] === 2 && p1.seq[2026] === 1);

/* --- validation --- */
var devisOK = { client: { nom: 'École X' }, lignes: [{ libelle: 'Site vitrine', quantite: 1, prixUnitaire: 50000 }], tvaTaux: 18 };
t('devis valide accepté', L.validerDevis(devisOK).ok === true);
t('client requis', L.validerDevis({ client: { nom: '   ' }, lignes: devisOK.lignes, tvaTaux: 18 }).ok === false);
t('au moins 1 ligne', L.validerDevis({ client: { nom: 'X' }, lignes: [], tvaTaux: 18 }).ok === false);
t('libellé requis', L.validerDevis({ client: { nom: 'X' }, lignes: [{ libelle: ' ', quantite: 1, prixUnitaire: 10 }], tvaTaux: 18 }).ok === false);
t('quantité > 0', L.validerDevis({ client: { nom: 'X' }, lignes: [{ libelle: 'a', quantite: 0, prixUnitaire: 10 }], tvaTaux: 18 }).ok === false);
t('prix négatif refusé', L.validerDevis({ client: { nom: 'X' }, lignes: [{ libelle: 'a', quantite: 1, prixUnitaire: -5 }], tvaTaux: 18 }).ok === false);
t('TVA hors bornes refusée', L.validerDevis({ client: { nom: 'X' }, lignes: [{ libelle: 'a', quantite: 1, prixUnitaire: 5 }], tvaTaux: 120 }).ok === false);
t('2 erreurs remontées (client + ligne)', L.validerDevis({ client: { nom: '' }, lignes: [], tvaTaux: 18 }).erreurs.length === 2);

/* --- échappement (sécurité XSS) --- */
t('échappement HTML/XSS', L.echapper('<script>alert(1)</script>') === '&lt;script&gt;alert(1)&lt;/script&gt;');
t('échappement guillemets', L.echapper('a"b\'c') === 'a&quot;b&#39;c');

/* --- divers --- */
t('date du jour ISO (AAAA-MM-JJ)', /^\d{4}-\d{2}-\d{2}$/.test(L.dateDuJour()));
t('formatage montant FR (se termine par devise, contient la valeur)', (function () {
  var s = L.formaterMontant(1234.5, '€');
  return s.indexOf('€') > 0 && s.indexOf('234,5') > 0;
})());

var echec = tests.filter(function (x) { return !x.ok; });
console.log('Tests : ' + (tests.length - echec.length) + '/' + tests.length + ' OK');
echec.forEach(function (x) { console.log('  ❌ ' + x.nom); });
process.exit(echec.length ? 1 : 0);
