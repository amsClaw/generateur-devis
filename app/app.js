/* ===== Générateur de devis — interface (localStorage, rendu, print) ===== */
(function () {
  'use strict';
  var L = window.Logique;
  var CLE = 'devis.app.v1';

  var etat = {
    reglages: { nom: 'Ams', contact: '', tvaParDefaut: 18, devise: '€' },
    devis: [],
    seq: {},
    vue: 'liste',
    devisCourant: null,
    filtre: ''
  };

  /* ---------- stockage ---------- */
  function charger() {
    try {
      var brut = localStorage.getItem(CLE);
      if (!brut) return;
      var d = JSON.parse(brut);
      if (d.reglages) etat.reglages = Object.assign({}, etat.reglages, d.reglages);
      if (Array.isArray(d.devis)) etat.devis = d.devis;
      if (d.seq) etat.seq = d.seq;
    } catch (e) {
      console.error('Chargement impossible :', e);
    }
  }

  function sauver() {
    localStorage.setItem(CLE, JSON.stringify({ reglages: etat.reglages, devis: etat.devis, seq: etat.seq }));
  }

  function $id(id) { return document.getElementById(id); }
  function montant(n) { return L.formaterMontant(n, etat.reglages.devise); }

  /* ---------- navigation ---------- */
  function afficherVue(vue) {
    etat.vue = vue;
    ['liste', 'formulaire', 'reglages'].forEach(function (v) {
      $id('vue-' + v).hidden = (v !== vue);
    });
    document.querySelectorAll('#nav .nav-btn').forEach(function (b) {
      var act = b.getAttribute('data-action') === ('vue-' + vue) ||
        (vue === 'formulaire' && b.getAttribute('data-action') === 'vue-formulaire-nouveau');
      b.classList.toggle('actif', act);
    });
    if (vue === 'liste') rendreListe();
    if (vue === 'reglages') rendreReglages();
  }

  /* ---------- liste ---------- */
  function devisFiltres() {
    var f = etat.filtre.trim().toLowerCase();
    if (!f) return etat.devis;
    return etat.devis.filter(function (d) {
      return String(d.numero).toLowerCase().indexOf(f) >= 0 ||
        String((d.client && d.client.nom) || '').toLowerCase().indexOf(f) >= 0;
    });
  }

  function rendreListe() {
    var liste = devisFiltres();
    var tbody = $id('corps-liste');
    tbody.innerHTML = '';
    $id('liste-vide').hidden = liste.length > 0;
    liste.slice().sort(function (a, b) {
      return String(b.numero).localeCompare(String(a.numero));
    }).forEach(function (d) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td>' + L.echapper(d.numero) + '</td>' +
        '<td>' + L.echapper((d.client && d.client.nom) || '—') + '</td>' +
        '<td>' + L.echapper(d.date || '') + '</td>' +
        '<td class="droite">' + montant(L.calculTTC(d.lignes, d.tvaTaux)) + '</td>' +
        '<td>' + L.echapper(d.statut || 'brouillon') + '</td>' +
        '<td class="droite">' +
        '<button class="mini" data-action="devis-ouvrir" data-id="' + d.id + '" title="Ouvrir">✏️</button>' +
        '<button class="mini" data-action="devis-pdf-id" data-id="' + d.id + '" title="Exporter PDF">🖨️</button>' +
        '<button class="mini danger" data-action="devis-supprimer" data-id="' + d.id + '" title="Supprimer">🗑️</button>' +
        '</td>';
      tbody.appendChild(tr);
    });
  }

  /* ---------- formulaire ---------- */
  function nouvelleLigne() { return { libelle: '', quantite: 1, prixUnitaire: 0 }; }

  function ouvrirFormulaire(id) {
    etat.devisCourant = id || null;
    var d = id ? etat.devis.find(function (x) { return x.id === id; }) : null;
    $id('titre-formulaire').textContent = d ? ('Devis ' + d.numero) : 'Nouveau devis';
    $id('f-client-nom').value = d ? (d.client.nom || '') : '';
    $id('f-client-contact').value = d ? (d.client.contact || '') : '';
    $id('f-tva').value = d ? d.tvaTaux : etat.reglages.tvaParDefaut;
    $id('f-notes').value = d ? (d.notes || '') : '';
    $id('f-conditions').value = d ? (d.conditions || '') : '';
    $id('f-statut').value = d ? (d.statut || 'brouillon') : 'brouillon';
    var lignes = (d && d.lignes.length) ? d.lignes : [nouvelleLigne()];
    rendreLignes(lignes);
    $id('erreurs-form').hidden = true;
    afficherVue('formulaire');
  }

  function rendreLignes(lignes) {
    var tbody = $id('corps-lignes');
    tbody.innerHTML = '';
    lignes.forEach(function (l, i) {
      var tr = document.createElement('tr');
      tr.innerHTML =
        '<td><input class="ligne-libelle" data-idx="' + i + '" value="' + L.echapper(l.libelle) + '" placeholder="Prestation…"></td>' +
        '<td><input class="ligne-quantite" data-idx="' + i + '" type="number" min="0" step="any" value="' + L.nb(l.quantite) + '"></td>' +
        '<td><input class="ligne-prix" data-idx="' + i + '" type="number" min="0" step="any" value="' + L.nb(l.prixUnitaire) + '"></td>' +
        '<td class="droite ligne-total">' + montant(L.calculHT([l])) + '</td>' +
        '<td><button type="button" class="ligne-retirer" data-action="ligne-retirer" data-idx="' + i + '" title="Retirer">✕</button></td>';
      tbody.appendChild(tr);
    });
    recalculerTotaux();
  }

  function lignesDepuisDom() {
    var lignes = [];
    document.querySelectorAll('#corps-lignes tr').forEach(function (tr) {
      var lib = tr.querySelector('.ligne-libelle');
      var qte = tr.querySelector('.ligne-quantite');
      var prix = tr.querySelector('.ligne-prix');
      lignes.push({
        libelle: lib ? lib.value : '',
        quantite: L.nb(qte ? qte.value : 0),
        prixUnitaire: L.nb(prix ? prix.value : 0)
      });
    });
    return lignes;
  }

  function recalculerTotaux() {
    var lignes = lignesDepuisDom();
    var taux = L.nb($id('f-tva').value);
    $id('total-ht').textContent = montant(L.calculHT(lignes));
    $id('total-tva').textContent = montant(L.calculTVA(lignes, taux));
    $id('total-ttc').textContent = montant(L.calculTTC(lignes, taux));
    document.querySelectorAll('#corps-lignes tr').forEach(function (tr, i) {
      var cell = tr.querySelector('.ligne-total');
      if (cell && lignes[i]) cell.textContent = montant(L.calculHT([lignes[i]]));
    });
  }

  function collecterFormulaire() {
    var devis = {
      client: {
        nom: $id('f-client-nom').value.trim(),
        contact: $id('f-client-contact').value.trim()
      },
      lignes: lignesDepuisDom(),
      tvaTaux: L.nb($id('f-tva').value),
      notes: $id('f-notes').value.trim(),
      conditions: $id('f-conditions').value.trim(),
      statut: $id('f-statut').value
    };
    var v = L.validerDevis(devis);
    if (!v.ok) {
      var box = $id('erreurs-form');
      box.innerHTML = '<ul>' + v.erreurs.map(function (e) {
        return '<li>' + L.echapper(e) + '</li>';
      }).join('') + '</ul>';
      box.hidden = false;
      return null;
    }
    return devis;
  }

  function enregistrer() {
    var devis = collecterFormulaire();
    if (!devis) return;
    var existant = etat.devisCourant ? etat.devis.find(function (x) { return x.id === etat.devisCourant; }) : null;
    if (existant) {
      Object.assign(existant, devis, { dateMAJ: new Date().toISOString() });
    } else {
      var annee = new Date().getFullYear();
      var p = L.prochainNumero(etat.seq, annee);
      etat.seq = p.seq;
      etat.devis.unshift({
        id: 'd_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        numero: p.numero,
        date: L.dateDuJour(),
        dateMAJ: new Date().toISOString(),
        statut: devis.statut,
        client: devis.client,
        lignes: devis.lignes,
        tvaTaux: devis.tvaTaux,
        notes: devis.notes,
        conditions: devis.conditions
      });
    }
    sauver();
    etat.devisCourant = null;
    afficherVue('liste');
  }

  /* ---------- réglages ---------- */
  function rendreReglages() {
    $id('r-nom').value = etat.reglages.nom || '';
    $id('r-contact').value = etat.reglages.contact || '';
    $id('r-devise').value = etat.reglages.devise || '€';
    $id('r-tva').value = etat.reglages.tvaParDefaut;
  }

  function sauverReglages() {
    etat.reglages.nom = $id('r-nom').value.trim() || 'Ams';
    etat.reglages.contact = $id('r-contact').value.trim();
    etat.reglages.devise = $id('r-devise').value.trim() || '€';
    etat.reglages.tvaParDefaut = L.nb($id('r-tva').value);
    sauver();
    alert('Réglages enregistrés ✅');
  }

  /* ---------- export / import JSON ---------- */
  function exporterJson() {
    var donnees = {
      reglages: etat.reglages,
      devis: etat.devis,
      seq: etat.seq,
      exporteLe: new Date().toISOString()
    };
    var blob = new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'devis.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importerJson(fichier) {
    var lecteur = new FileReader();
    lecteur.onload = function () {
      try {
        var d = JSON.parse(lecteur.result);
        if (!d || !Array.isArray(d.devis)) throw new Error('format invalide');
        etat.devis = d.devis;
        etat.reglages = Object.assign({}, etat.reglages, d.reglages || {});
        etat.seq = d.seq || {};
        sauver();
        alert('Restauration OK : ' + d.devis.length + ' devis chargés ✅');
        rendreReglages();
      } catch (e) {
        alert('Fichier invalide : ce n\'est pas un export devis.json valide.');
      }
    };
    lecteur.readAsText(fichier);
  }

  /* ---------- PDF (impression navigateur) ---------- */
  function docDevisHTML(d) {
    var r = etat.reglages;
    var lignesHtml = d.lignes.map(function (l) {
      return '<tr><td>' + L.echapper(l.libelle) + '</td>' +
        '<td class="droite">' + L.nb(l.quantite) + '</td>' +
        '<td class="droite">' + montant(l.prixUnitaire) + '</td>' +
        '<td class="droite">' + montant(L.calculHT([l])) + '</td></tr>';
    }).join('');
    return '<div class="doc-devis">' +
      '<div class="doc-en-tete">' +
        '<div class="bloc">' +
          '<div class="doc-titre">DEVIS</div>' +
          '<div class="doc-numero">' + L.echapper(d.numero) + '</div>' +
          '<div class="doc-societe">' + L.echapper(r.nom || '') + '<br>' + L.echapper(r.contact || '') + '</div>' +
        '</div>' +
        '<div class="doc-dates">' +
          'Date : ' + L.echapper(d.date || '') + '<br>' +
          'Client : ' + L.echapper((d.client && d.client.nom) || '') + '<br>' +
          ((d.client && d.client.contact) ? 'Contact : ' + L.echapper(d.client.contact) + '<br>' : '') +
          'Statut : <span class="doc-statut">' + L.echapper(d.statut || 'brouillon') + '</span>' +
        '</div>' +
      '</div>' +
      '<table>' +
        '<thead><tr><th>Prestation</th><th class="droite">Qté</th><th class="droite">Prix unitaire</th><th class="droite">Total HT</th></tr></thead>' +
        '<tbody>' + lignesHtml + '</tbody>' +
      '</table>' +
      '<div class="doc-totaux">' +
        '<div>Total HT : ' + montant(L.calculHT(d.lignes)) + '</div>' +
        '<div>TVA (' + L.nb(d.tvaTaux) + ' %) : ' + montant(L.calculTVA(d.lignes, d.tvaTaux)) + '</div>' +
        '<div class="ttc">Total TTC : ' + montant(L.calculTTC(d.lignes, d.tvaTaux)) + '</div>' +
      '</div>' +
      (d.notes ? '<div class="doc-conditions"><strong>Notes :</strong><br>' + L.echapper(d.notes).replace(/\n/g, '<br>') + '</div>' : '') +
      (d.conditions ? '<div class="doc-conditions"><strong>Conditions de paiement :</strong><br>' + L.echapper(d.conditions).replace(/\n/g, '<br>') + '</div>' : '') +
      '</div>';
  }

  function exporterPDF(devis) {
    $id('print-area').innerHTML = docDevisHTML(devis);
    window.print();
  }

  /* ---------- événements ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest ? e.target.closest('[data-action]') : null;
    if (!el) return;
    var action = el.getAttribute('data-action');
    var id = el.getAttribute('data-id');
    var idx = el.getAttribute('data-idx');

    switch (action) {
      case 'vue-liste':
        afficherVue('liste');
        break;
      case 'vue-formulaire-nouveau':
        ouvrirFormulaire(null);
        break;
      case 'vue-reglages':
        afficherVue('reglages');
        break;
      case 'ligne-ajouter': {
        var lignes = lignesDepuisDom();
        lignes.push(nouvelleLigne());
        rendreLignes(lignes);
        break;
      }
      case 'ligne-retirer': {
        var ls = lignesDepuisDom();
        ls.splice(Number(idx), 1);
        rendreLignes(ls.length ? ls : [nouvelleLigne()]);
        break;
      }
      case 'devis-ouvrir':
        ouvrirFormulaire(id);
        break;
      case 'devis-pdf-id': {
        var d = etat.devis.find(function (x) { return x.id === id; });
        if (d) exporterPDF(d);
        break;
      }
      case 'devis-supprimer': {
        var cible = etat.devis.find(function (x) { return x.id === id; });
        if (cible && confirm('Supprimer le devis ' + cible.numero + ' ?')) {
          etat.devis = etat.devis.filter(function (x) { return x.id !== id; });
          sauver();
          rendreListe();
        }
        break;
      }
      case 'devis-pdf': {
        var b = collecterFormulaire();
        if (b) {
          var existant = etat.devisCourant ? etat.devis.find(function (x) { return x.id === etat.devisCourant; }) : null;
          b.numero = existant ? existant.numero : '—';
          b.date = existant ? existant.date : L.dateDuJour();
          exporterPDF(b);
        }
        break;
      }
      case 'exporter-json':
        exporterJson();
        break;
      case 'importer-json':
        $id('fichier-import').click();
        break;
      case 'sauver-reglages':
        sauverReglages();
        break;
    }
  });

  document.addEventListener('input', function (e) {
    if (e.target.id === 'recherche') {
      etat.filtre = e.target.value;
      rendreListe();
      return;
    }
    if (e.target.closest && e.target.closest('#form-devis')) recalculerTotaux();
  });

  document.addEventListener('change', function (e) {
    if (e.target.id === 'fichier-import' && e.target.files && e.target.files[0]) {
      importerJson(e.target.files[0]);
      e.target.value = '';
    }
  });

  $id('form-devis').addEventListener('submit', function (e) {
    e.preventDefault();
    enregistrer();
  });

  /* ---------- init ---------- */
  charger();
  afficherVue('liste');
})();
