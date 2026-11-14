/* Le script de la page de vérification (tests.html).

   Il vivait dans la page ; il est ici pour que tests.html puisse déclarer la
   même règle de sécurité du contenu qu'index.html — rien d'autre que les
   fichiers du projet — sans avoir à tenir à jour l'empreinte d'un script en
   ligne de cent cinquante lignes.

   Les tableaux sont construits nœud par nœud, avec textContent : ce qui s'y
   écrit vient du registre, donc du projet lui-même, mais une page qui sert à
   vérifier ne doit pas dépendre de cette hypothèse. */
(function () {
  'use strict';
  var MARQUEURS = ['NaN', 'undefined', 'Infinity', '[object'];

  function vider(noeud) {
    while (noeud.firstChild) noeud.removeChild(noeud.firstChild);
  }

  /** Ajoute une cellule à une ligne de tableau. */
  function cellule(tr, texte, classe) {
    var td = document.createElement('td');
    if (classe) td.className = classe;
    td.textContent = String(texte);
    tr.appendChild(td);
    return td;
  }

  /* --- La justesse : on recalcule la réponse depuis l'énoncé ---------- */

  function oracle(graines) {
    var corps = document.getElementById('lignes-oracle');
    var details = [];
    var recalculesEnTout = 0, fauxEnTout = 0, inconnusEnTout = 0, couverts = 0;
    vider(corps);

    CM2.registre.liste().forEach(function (spec) {
      if (!ORACLE.aUneRegle(spec.id)) return;
      couverts++;
      var recalcules = 0, faux = 0, inconnus = 0, horsCas = 0;

      for (var g = 0; g < graines; g++) {
        var ex;
        try {
          ex = CM2.registre.produire(spec.id, g);
        } catch (e) {
          continue;                                // le tableau de la forme le signale
        }
        var bilan = ORACLE.examiner(spec.id, ex);

        if (bilan.etat === 'horsCas') { horsCas++; continue; }
        if (bilan.etat === 'inconnu') {
          inconnus++;
          if (inconnus <= 2) {
            details.push('NON RECONNU  ' + spec.id + ' / graine ' + g + ' : ' + bilan.raison +
                         '\n    ' + bilan.enonce);
          }
          continue;
        }
        recalcules++;
        if (bilan.etat === 'faux') {
          faux++;
          if (faux <= 3) {
            details.push('FAUX  ' + spec.id + ' / graine ' + g +
                         '\n    énoncé    : ' + bilan.enonce +
                         '\n    annoncé   : ' + bilan.reponse +
                         '\n    recalculé : ' + bilan.attendu +
                         '   (lu dans la réponse : ' + bilan.obtenu + ')');
          }
        }
      }

      recalculesEnTout += recalcules;
      fauxEnTout += faux;
      inconnusEnTout += inconnus;

      var tr = document.createElement('tr');
      cellule(tr, spec.id);
      cellule(tr, recalcules, 'nb');
      cellule(tr, faux, 'nb ' + (faux ? 'ko' : 'ok'));
      cellule(tr, inconnus || '', 'nb' + (inconnus ? ' ko' : ''));
      cellule(tr, horsCas || '', 'nb');
      corps.appendChild(tr);
    });

    var resume = document.getElementById('resume-oracle');
    resume.className = (fauxEnTout || inconnusEnTout) ? 'ko' : 'ok';
    resume.textContent = recalculesEnTout + ' réponses recalculées — ' +
      (fauxEnTout ? fauxEnTout + ' fausse(s). ' : 'toutes justes. ') +
      (inconnusEnTout ? inconnusEnTout + ' énoncé(s) non reconnu(s).' : '');

    var bloc = document.getElementById('details-oracle');
    bloc.hidden = !details.length;
    bloc.textContent = details.join('\n\n');

    /* Ce qui n'est pas recalculé, et pourquoi : la dette doit rester visible. */
    var total = CM2.registre.liste().length;
    var parRaison = {};
    CM2.registre.liste().forEach(function (spec) {
      if (ORACLE.aUneRegle(spec.id)) return;
      var raison = ORACLE.raisonHorsPortee(spec.id) ||
        (spec.matiere === 'mathematiques' ? 'aucune règle de recalcul écrite'
         : spec.matiere === 'emc' ? 'banque écrite, contrôlée à part sur le référentiel'
         : 'réponse de langue, contrôlée par relecture');
      parRaison[raison] = (parRaison[raison] || 0) + 1;
    });
    document.getElementById('couverture-oracle').textContent =
      couverts + ' sortes d\'exercices sur ' + total + ' sont recalculées. Les autres : ' +
      Object.keys(parRaison).map(function (r) {
        return parRaison[r] + ' — ' + r;
      }).join(' ; ') + '.';
  }

  function verifier(graines) {
    var lignes = document.getElementById('lignes');
    var echecs = [];
    vider(lignes);
    var total = 0;

    CM2.registre.liste().forEach(function (spec) {
      var positions = {}, vus = {}, erreurs = 0;

      for (var g = 0; g < graines; g++) {
        total++;
        var ex;
        try {
          ex = CM2.registre.produire(spec.id, g);
        } catch (e) {
          erreurs++;
          if (erreurs <= 3) echecs.push(spec.id + ' / graine ' + g + ' : ' + e.message);
          continue;
        }

        var texte = ex.enonce + ' ' + (ex.explication || '') + ' ' + (ex.figure || '') + ' ' +
                    (ex.propositions || []).join(' ') + ' ' + ex.bonne_reponse;
        MARQUEURS.forEach(function (m) {
          if (texte.indexOf(m) !== -1) {
            erreurs++;
            if (erreurs <= 3) echecs.push(spec.id + ' / graine ' + g + ' : « ' + m + ' » dans le texte');
          }
        });

        if (ex.type === 'qcm') {
          positions[ex.bonne_reponse] = (positions[ex.bonne_reponse] || 0) + 1;
        }

        if (JSON.stringify(CM2.registre.produire(spec.id, g)) !== JSON.stringify(ex)) {
          erreurs++;
          echecs.push(spec.id + ' / graine ' + g + ' : non reproductible');
        }
        vus[ex.enonce] = true;
      }

      var tr = document.createElement('tr');
      cellule(tr, spec.id);
      cellule(tr, spec.matiere);
      cellule(tr, Object.keys(vus).length + ' / ' + graines, 'nb');
      cellule(tr, erreurs, 'nb ' + (erreurs ? 'ko' : 'ok'));
      cellule(tr, Object.keys(positions).map(function (k) {
        return k + ' : ' + positions[k];
      }).join('   '));
      lignes.appendChild(tr);
    });

    var resume = document.getElementById('resume');
    resume.className = echecs.length ? 'ko' : 'ok';
    resume.textContent = CM2.registre.liste().length + ' générateurs, ' + total +
      ' exercices produits — ' + (echecs.length ? echecs.length + ' échec(s).' : 'aucun échec.');

    var bloc = document.getElementById('echecs');
    bloc.hidden = !echecs.length;
    bloc.textContent = echecs.join('\n');
  }

  document.getElementById('version').textContent = 'v' + CM2.version.numero;
  document.getElementById('relancer').addEventListener('click', function () {
    oracle(1000);
    verifier(1000);
  });
  oracle(200);
  verifier(200);
})();
