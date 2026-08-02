/* ===== Logique pure du générateur de devis (testable avec node) ===== */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.Logique = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  function nb(x) {
    var n = parseFloat(x);
    return isNaN(n) ? 0 : n;
  }

  function calculHT(lignes) {
    return (lignes || []).reduce(function (s, l) {
      return s + nb(l.quantite) * nb(l.prixUnitaire);
    }, 0);
  }

  function calculTVA(lignes, taux) {
    return calculHT(lignes) * nb(taux) / 100;
  }

  function calculTTC(lignes, taux) {
    var ht = calculHT(lignes);
    return ht + ht * nb(taux) / 100;
  }

  function prochainNumero(seq, annee) {
    var a = String(annee);
    var n = (seq && seq[a]) ? seq[a] + 1 : 1;
    var nouvelleSeq = {};
    for (var k in (seq || {})) { if (Object.prototype.hasOwnProperty.call(seq, k)) nouvelleSeq[k] = seq[k]; }
    nouvelleSeq[a] = n;
    return { numero: 'DEV-' + a + '-' + String(n).padStart(3, '0'), seq: nouvelleSeq };
  }

  function validerDevis(d) {
    var erreurs = [];
    if (!d || !d.client || !String(d.client.nom || '').trim()) {
      erreurs.push('Le nom du client est requis.');
    }
    var lignes = (d && d.lignes) || [];
    if (!lignes.length) {
      erreurs.push('Ajoutez au moins une prestation.');
    }
    lignes.forEach(function (l, i) {
      if (!String(l.libelle || '').trim()) {
        erreurs.push('Ligne ' + (i + 1) + ' : le libellé est requis.');
      }
      if (nb(l.quantite) <= 0) {
        erreurs.push('Ligne ' + (i + 1) + ' : la quantité doit être supérieure à 0.');
      }
      if (nb(l.prixUnitaire) < 0) {
        erreurs.push('Ligne ' + (i + 1) + ' : le prix unitaire ne peut pas être négatif.');
      }
    });
    var taux = nb(d && d.tvaTaux);
    if (taux < 0 || taux > 100) {
      erreurs.push('Le taux de TVA doit être entre 0 et 100 %.');
    }
    return { ok: erreurs.length === 0, erreurs: erreurs };
  }

  function echapper(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function formaterMontant(n, devise) {
    var v = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 }).format(nb(n));
    return v + ' ' + (devise || '€');
  }

  function dateDuJour() {
    return new Date().toISOString().slice(0, 10);
  }

  return {
    nb: nb,
    calculHT: calculHT,
    calculTVA: calculTVA,
    calculTTC: calculTTC,
    prochainNumero: prochainNumero,
    validerDevis: validerDevis,
    echapper: echapper,
    formaterMontant: formaterMontant,
    dateDuJour: dateDuJour
  };
});
