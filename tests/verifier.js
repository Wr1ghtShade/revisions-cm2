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

var FICHIERS = [
  'app/version.js',
  'app/rng.js',
  'app/format.js',
  'app/lettres.js',
  'app/contraintes.js',
  'app/qcm.js',
  'app/figures.js',
  'app/registre.js',
  'app/lexique/lexique.js',
  'app/conjugaison.js',
  'app/lexique/phrases.js',
  'app/generateurs/maths-entiers.js',
  'app/generateurs/maths-decimaux.js',
  'app/generateurs/maths-fractions.js',
  'app/generateurs/maths-calcul-mental.js',
  'app/generateurs/maths-operations.js',
  'app/generateurs/maths-mesures.js',
  'app/generateurs/maths-algebre.js',
  'app/generateurs/maths-problemes.js',
  'app/generateurs/maths-probabilites.js',
  'app/generateurs/maths-figures.js',
  'app/generateurs/maths-geometrie.js',
  'app/generateurs/francais-conjugaison.js',
  'app/generateurs/francais-accords.js',
  'app/generateurs/francais-grammaire.js',
  'app/generateurs/francais-vocabulaire.js',
  'app/banques/emc.js', 'app/banques/sciences.js',
  'app/banques/histoire-geo.js', 'app/banques/numerique.js',
  'app/generateurs/revisions-tables.js'
];

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

/* --- Aucun fichier d'exercices oublié quelque part --------------------

   Les générateurs et les banques sont déclarés dans quatre listes qui doivent
   rester identiques : index.html (l'application), tests.html (la page de
   vérification), et la liste FICHIERS de ce fichier. Une banque ajoutée à
   l'application mais oubliée dans tests.html s'y trouverait simplement
   absente : la page annoncerait « tout est vérifié » en ayant contrôlé moins
   d'exercices qu'elle ne le croit. C'est exactement ce qui était arrivé aux
   trois banques de sciences, d'histoire-géographie et de numérique.

   La source de vérité est le disque : tout fichier présent dans
   app/generateurs/ ou app/banques/ doit être chargé partout. */
(function controlerChargements() {
  var attendus = [];
  ['app/generateurs', 'app/banques'].forEach(function (dossier) {
    fs.readdirSync(path.join(racine, dossier)).forEach(function (f) {
      if (/\.js$/.test(f)) attendus.push(dossier + '/' + f);
    });
  });

  function chargesPar(fichier) {
    var texte = fs.readFileSync(path.join(racine, fichier), 'utf8');
    var out = {}, re = /src="(app\/[^"]+)"/g, m;
    while ((m = re.exec(texte))) out[m[1]] = true;
    return out;
  }

  [{ nom: 'index.html', charges: chargesPar('index.html') },
   { nom: 'tests.html', charges: chargesPar('tests.html') },
   { nom: 'la liste FICHIERS de tests/verifier.js',
     charges: FICHIERS.reduce(function (o, f) { o[f] = true; return o; }, {}) }
  ].forEach(function (cible) {
    attendus.forEach(function (f) {
      if (!cible.charges[f]) {
        echecs.push('chargement : « ' + f + ' » est sur le disque mais absent de ' + cible.nom);
      }
    });
  });

  // Et l'inverse : un fichier déclaré mais disparu du disque.
  Object.keys(chargesPar('index.html')).forEach(function (f) {
    if (!fs.existsSync(path.join(racine, f))) {
      echecs.push('chargement : index.html charge « ' + f + ' », qui n\'existe pas');
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
