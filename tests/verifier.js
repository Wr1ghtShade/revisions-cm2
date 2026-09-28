/* Auto-tests des générateurs, exécutables hors navigateur :
       node tests/verifier.js

   Chaque générateur est passé sur un grand nombre de graines. On vérifie que :
   - il ne lève jamais d'exception ;
   - l'exercice produit passe les contrôles de programme (registre.produire) ;
   - la même graine redonne exactement le même exercice ;
   - la bonne réponse d'un QCM n'est pas toujours à la même place ;
   - aucun énoncé ne contient de marqueur d'erreur (NaN, undefined, Infinity).

   Ce fichier ne fait pas partie de l'application : il n'est pas chargé par index.html. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var GRAINES = parseInt(process.argv[2], 10) || 500;
var racine = path.join(__dirname, '..');

var FICHIERS = require('./charger').tranche('exercices');

var contexte = vm.createContext({ console: console, Math: Math, Date: Date });
contexte.window = contexte;

FICHIERS.forEach(function (f) {
  var chemin = path.join(racine, f);
  if (!fs.existsSync(chemin)) {
    console.error('fichier absent : ' + f);
    process.exit(1);
  }
  vm.runInContext(fs.readFileSync(chemin, 'utf8'), contexte, { filename: f });
});

var CM2 = contexte.CM2;
var generateurs = CM2.registre.liste();

var MARQUEURS = ['NaN', 'undefined', 'Infinity', 'null', '[object'];

var total = 0;
var echecs = [];
var rapport = [];

generateurs.forEach(function (spec) {
  var positions = {};
  var enoncesVus = {};
  var doublons = 0;
  var erreursIci = 0;

  for (var g = 0; g < GRAINES; g++) {
    total++;
    var ex;
    try {
      ex = CM2.registre.produire(spec.id, g);
    } catch (e) {
      erreursIci++;
      if (erreursIci <= 3) echecs.push(spec.id + ' graine ' + g + ' : ' + e.message);
      continue;
    }

    var texte = ex.enonce + ' ' + (ex.explication || '') + ' ' + (ex.figure || '') + ' ' +
                (ex.propositions || []).join(' ') + ' ' + ex.bonne_reponse;

    MARQUEURS.forEach(function (m) {
      if (texte.indexOf(m) !== -1) {
        erreursIci++;
        if (erreursIci <= 3) echecs.push(spec.id + ' graine ' + g + ' : marqueur « ' + m + ' » dans le texte');
      }
    });

    if (ex.type === 'qcm') {
      positions[ex.bonne_reponse] = (positions[ex.bonne_reponse] || 0) + 1;
    } else if (!String(ex.bonne_reponse).trim()) {
      erreursIci++;
      echecs.push(spec.id + ' graine ' + g + ' : réponse vide');
    }

    // Reproductibilité.
    var bis = CM2.registre.produire(spec.id, g);
    if (JSON.stringify(bis) !== JSON.stringify(ex)) {
      erreursIci++;
      echecs.push(spec.id + ' graine ' + g + ' : non reproductible');
    }

    if (enoncesVus[ex.enonce]) doublons++;
    enoncesVus[ex.enonce] = true;
  }

  var distinctes = Object.keys(enoncesVus).length;
  var pos = Object.keys(positions).map(function (k) { return k + ':' + positions[k]; }).join(' ');

  rapport.push({
    id: spec.id,
    erreurs: erreursIci,
    distincts: distinctes,
    doublons: doublons,
    positions: pos
  });
});

/* --- Aucun fichier oublié quelque part ---------------------------------

   index.html est la seule liste des scripts de l'application : les tests en
   ligne de commande la lisent (tests/charger.js). Restent deux listes qui ne
   peuvent pas la lire, et qu'on confronte donc à elle :

   - le disque : tout fichier .js de app/ doit être chargé par index.html, et
     tout script chargé doit exister ;
   - tests.html : la page de vérification ne peut pas lire index.html depuis le
     navigateur. Elle doit en reprendre, à l'identique et dans le même ordre,
     toute la tranche qui produit des exercices. Une banque absente de
     tests.html y serait simplement ignorée : la page annoncerait « tout est
     vérifié » en ayant contrôlé moins d'exercices qu'elle ne le croit — c'est
     arrivé aux banques de sciences, d'histoire-géographie et de numérique. */
(function controlerChargements() {
  var charger = require('./charger');
  var application = charger.scriptsDe('index.html');

  function tousLesJs(dossier) {
    var out = [];
    fs.readdirSync(path.join(racine, dossier)).forEach(function (f) {
      var rel = dossier + '/' + f;
      if (fs.statSync(path.join(racine, rel)).isDirectory()) out = out.concat(tousLesJs(rel));
      else if (/\.js$/.test(f)) out.push(rel);
    });
    return out;
  }

  tousLesJs('app').forEach(function (f) {
    if (application.indexOf(f) === -1) {
      echecs.push('chargement : « ' + f + ' » est sur le disque mais index.html ne le charge pas');
    }
  });
  application.forEach(function (f) {
    if (!fs.existsSync(path.join(racine, f))) {
      echecs.push('chargement : index.html charge « ' + f + ' », qui n\'existe pas');
    }
  });

  var attendu = charger.tranche('exercices');
  var page = charger.scriptsDe('tests.html').filter(function (f) { return /^app\//.test(f); });
  if (attendu.join('\n') !== page.join('\n')) {
    var avant = echecs.length;
    attendu.forEach(function (f) {
      if (page.indexOf(f) === -1) echecs.push('chargement : tests.html ne charge pas « ' + f + ' »');
    });
    page.forEach(function (f) {
      if (attendu.indexOf(f) === -1) echecs.push('chargement : tests.html charge « ' + f + ' », hors de la tranche des exercices');
    });
    // Mêmes fichiers de part et d'autre : c'est donc l'ordre qui diffère.
    if (echecs.length === avant) {
      echecs.push('chargement : tests.html charge les bons fichiers, mais pas dans l\'ordre d\'index.html');
    }
  }
})();

/* --- Les matières : une table, et ce qui en reste écrit en dur ----------

   app/matieres.js est la seule liste des matières. Ce qui ne peut pas en
   découler — les boutons et les jetons de compteurs, écrits dans index.html —
   doit la suivre exactement. Une matière ajoutée sans son bouton ne serait
   jamais proposée ; un jeton manquant ferait planter l'accueil au démarrage. */
(function controlerMatieres() {
  var M = CM2.matieres;
  var page = fs.readFileSync(path.join(racine, 'index.html'), 'utf8');

  function valeurs(attribut) {
    var out = [], re = new RegExp(attribut + '="([^"]+)"', 'g'), m;
    while ((m = re.exec(page))) out.push(m[1]);
    return out;
  }

  var attendus = M.liste.map(function (m) { return m.id; }).concat([M.tout.id]);
  [['data-matiere', 'les boutons « On révise quoi ? »'],
   ['data-fiche-matiere', 'les boutons des fiches']].forEach(function (a) {
    var vus = valeurs(a[0]);
    if (vus.join(' ') !== attendus.join(' ')) {
      echecs.push('matières : ' + a[1] + ' (' + vus.join(', ') + ') ne suivent pas app/matieres.js (' +
                  attendus.join(', ') + ')');
    }
  });

  M.liste.forEach(function (m) {
    if (page.indexOf('id="' + m.compteur + '"') === -1) {
      echecs.push('matières : aucun jeton id="' + m.compteur + '" dans index.html pour « ' + m.id + ' »');
    }
  });

  // Un générateur rangé sous une matière inconnue ne serait servi nulle part.
  CM2.registre.liste().forEach(function (spec) {
    if (!M.get(spec.matiere) || spec.matiere === M.tout.id) {
      echecs.push('matières : ' + spec.id + ' est rangé sous « ' + spec.matiere +
                  ' », qui n\'est pas dans app/matieres.js');
    }
  });

  // Toute référence de fiche doit se relire, pour chaque matière et « tout ».
  vm.runInContext(fs.readFileSync(path.join(racine, 'app/fiche.js'), 'utf8'), contexte,
                  { filename: 'app/fiche.js' });
  attendus.forEach(function (id) {
    var ref = CM2.fiche.reference(123456789, id, 30);
    var lu = CM2.fiche.depuisReference(ref);
    if (!lu || lu.matiere !== id || lu.nombre !== 30 || lu.graine !== 123456789) {
      echecs.push('matières : la référence « ' + ref + ' » (' + id + ') ne se relit pas');
    }
  });
})();

/* --- La tolérance d'écriture ------------------------------------------
   `reponses_acceptees` élargit ce qui est compté juste : si ce champ n'est pas
   tenu court, il devient la porte par laquelle deux réponses différentes
   passeraient pour la même. On vérifie donc ici qu'il est bien refusé quand on
   s'en sert mal — sans ce contrôle, le contrôle lui-même pourrait disparaître
   sans que rien ne le signale. */
(function controlerTolerance() {
  var F = CM2.format;
  var C = CM2.contraintes;

  function refuse(intitule, ex) {
    if (!C.verifierExercice(ex, 'contrôle').length) {
      echecs.push('tolérance d\'écriture : ' + intitule + ' aurait dû être refusé');
    }
  }
  function accepte(intitule, ex) {
    var e = C.verifierExercice(ex, 'contrôle');
    if (e.length) echecs.push('tolérance d\'écriture : ' + intitule + ' refusé à tort — ' + e.join(' ; '));
  }

  var base = { enonce: 'Combien de temps ?', type: 'saisie', bonne_reponse: '2 h 05' };
  function avec(autres) {
    return { enonce: base.enonce, type: base.type, bonne_reponse: base.bonne_reponse,
             reponses_acceptees: autres };
  }

  accepte('une autre écriture de la même réponse', avec(['2 h 5']));
  accepte('l\'absence du champ', base);
  refuse('une liste vide', avec([]));
  refuse('autre chose qu\'une liste', avec('2 h 5'));
  refuse('une écriture vide', avec(['2 h 5', '  ']));
  refuse('une écriture qui répète la réponse attendue', avec(['2 h 05']));
  refuse('deux fois la même écriture', avec(['2 h 5', '2h5']));
  refuse('le champ sur un QCM', {
    enonce: 'Laquelle ?', type: 'qcm', propositions: ['a', 'b'], bonne_reponse: 0,
    reponses_acceptees: ['a']
  });

  // Et la comparaison elle-même : elle accepte les autres écritures, et rien
  // d'autre.
  if (!F.accepte('2 h 5', '2 h 05', ['2 h 5'])) echecs.push('tolérance d\'écriture : « 2 h 5 » aurait dû être accepté');
  if (!F.accepte('2 h 05', '2 h 05', ['2 h 5'])) echecs.push('tolérance d\'écriture : la réponse attendue aurait dû être acceptée');
  if (F.accepte('2 h 15', '2 h 05', ['2 h 5'])) echecs.push('tolérance d\'écriture : « 2 h 15 » n\'aurait pas dû être accepté');
  if (F.accepte('2 h 5', '2 h 05', null)) echecs.push('tolérance d\'écriture : sans liste, seule la réponse attendue compte');
})();

console.log('');
console.log('Générateurs : ' + generateurs.length + '   exercices produits : ' + total +
            ' (' + GRAINES + ' graines chacun)');
console.log('');
console.log(pad('générateur', 34) + pad('énoncés distincts', 20) + pad('erreurs', 10) + 'position de la bonne réponse (QCM)');
console.log('-'.repeat(110));

rapport.forEach(function (l) {
  console.log(pad(l.id, 34) + pad(l.distincts + '/' + GRAINES, 20) +
              pad(String(l.erreurs), 10) + l.positions);
});

console.log('');
if (echecs.length) {
  console.log('ÉCHECS (' + echecs.length + ', 3 premiers par générateur) :');
  echecs.slice(0, 60).forEach(function (e) { console.log('  - ' + e); });
  process.exit(1);
} else {
  console.log('Aucun échec.');
}

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s + ' ' : s + ' '.repeat(n - s.length);
}
