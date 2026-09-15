/* Oracle de correction, en ligne de commande :
       node tests/oracle.js [nombre de graines] [filtre sur l'id]

   La réponse annoncée est-elle juste ? Le raisonnement et les règles sont dans
   tests/oracle-moteur.js, qui sert aussi à la page tests.html. Ce fichier ne
   fait que produire les exercices, appeler l'oracle et rendre compte.

   Sortie non nulle si une réponse est fausse, ou si un énoncé n'est plus
   reconnu par sa règle — une couverture qui fond en silence serait pire qu'un
   échec bruyant. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var GRAINES = parseInt(process.argv[2], 10) || 300;
var FILTRE = process.argv[3] || '';
var racine = path.join(__dirname, '..');

var FICHIERS = [
  'app/version.js', 'app/rng.js', 'app/format.js', 'app/lettres.js', 'app/contraintes.js',
  'app/qcm.js', 'app/figures.js', 'app/registre.js',
  'app/lexique/lexique.js', 'app/conjugaison.js', 'app/lexique/phrases.js',
  'app/generateurs/maths-entiers.js', 'app/generateurs/maths-decimaux.js',
  'app/generateurs/maths-fractions.js', 'app/generateurs/maths-calcul-mental.js',
  'app/generateurs/maths-operations.js', 'app/generateurs/maths-mesures.js',
  'app/generateurs/maths-algebre.js', 'app/generateurs/maths-problemes.js',
  'app/generateurs/maths-probabilites.js', 'app/generateurs/maths-figures.js',
  'app/generateurs/maths-geometrie.js',
  'app/generateurs/francais-conjugaison.js', 'app/generateurs/francais-accords.js',
  'app/generateurs/francais-grammaire.js', 'app/generateurs/francais-vocabulaire.js',
  'app/banques/emc.js', 'app/banques/sciences.js',
  'app/banques/histoire-geo.js', 'app/banques/numerique.js',
  'app/generateurs/revisions-tables.js'
];

var contexte = vm.createContext({ console: console, Math: Math, Date: Date });
contexte.window = contexte;
FICHIERS.forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), contexte, { filename: f });
});
var CM2 = contexte.CM2;

var ORACLE = require('./oracle-moteur.js').ORACLE;

/* --- Passage en revue -------------------------------------------------- */

var lignes = [];
var fautes = [];
var nonReconnus = [];
var totalRecalcules = 0;
var generateurs = CM2.registre.liste();

generateurs.forEach(function (spec) {
  if (FILTRE && spec.id.indexOf(FILTRE) === -1) return;
  if (!ORACLE.aUneRegle(spec.id)) return;

  var recalcules = 0, faux = 0, inconnus = 0, horsCas = 0;

  for (var g = 0; g < GRAINES; g++) {
    var ex;
    try {
      ex = CM2.registre.produire(spec.id, g);
    } catch (e) {
      continue;                                    // verifier.js s'en occupe
    }

    var bilan = ORACLE.examiner(spec.id, ex);

    if (bilan.etat === 'horsCas') { horsCas++; continue; }
    if (bilan.etat === 'inconnu') {
      inconnus++;
      if (inconnus <= 2) {
        nonReconnus.push({ id: spec.id, graine: g, raison: bilan.raison, enonce: bilan.enonce });
      }
      continue;
    }

    recalcules++;
    totalRecalcules++;
    if (bilan.etat === 'faux') {
      faux++;
      if (faux <= 3) {
        fautes.push({
          id: spec.id, graine: g, enonce: bilan.enonce, reponse: bilan.reponse,
          attendu: bilan.attendu, obtenu: bilan.obtenu
        });
      }
    }
  }

  lignes.push({ id: spec.id, recalcules: recalcules, faux: faux,
                inconnus: inconnus, horsCas: horsCas });
});

/* --- Rapport ---------------------------------------------------------- */

function pad(s, n) {
  s = String(s);
  return s.length >= n ? s + ' ' : s + ' '.repeat(n - s.length);
}

console.log('');
console.log('Oracle de correction — ' + GRAINES + ' graines par générateur');
console.log('');
console.log(pad('générateur', 34) + pad('recalculés', 12) + pad('FAUX', 8) +
            pad('non reconnus', 14) + 'hors cas');
console.log('-'.repeat(88));
lignes.forEach(function (l) {
  console.log(pad(l.id, 34) + pad(l.recalcules, 12) + pad(l.faux || '', 8) +
              pad(l.inconnus || '', 14) + (l.horsCas || ''));
});
console.log('');

if (fautes.length) {
  console.log('RÉPONSES FAUSSES (' + fautes.length + ', 3 premières par générateur) :');
  fautes.forEach(function (f) {
    console.log('');
    console.log('  ' + f.id + ' graine ' + f.graine);
    console.log('    énoncé    : ' + f.enonce);
    console.log('    annoncé   : ' + f.reponse);
    console.log('    recalculé : ' + f.attendu + '   (lu dans la réponse : ' + f.obtenu + ')');
  });
  console.log('');
}

if (nonReconnus.length) {
  console.log('ÉNONCÉS NON RECONNUS (' + nonReconnus.length + ', 2 premiers par générateur) —');
  console.log('la règle de l\'oracle doit être mise à jour, sinon la couverture fond :');
  nonReconnus.forEach(function (u) {
    console.log('  ' + pad(u.id, 30) + u.raison);
    console.log('    ' + u.enonce);
  });
  console.log('');
}

/* Couverture : ce qui est recalculé, ce qui ne l'est pas, et pourquoi. */
var couverts = 0, sansRegle = [];
generateurs.forEach(function (spec) {
  if (ORACLE.aUneRegle(spec.id)) couverts++;
  else sansRegle.push(spec);
});

console.log('Couverture : ' + couverts + ' générateurs sur ' + generateurs.length +
            ' ont une règle de recalcul, ' + totalRecalcules + ' exercices recalculés.');

var parRaison = {};
sansRegle.forEach(function (spec) {
  var raison = ORACLE.raisonHorsPortee(spec.id) ||
    (spec.matiere === 'mathematiques' ? 'AUCUNE RÈGLE — à écrire'
     : (spec.matiere === 'emc' || spec.matiere === 'sciences')
       ? 'banque écrite : contrôlée par tests/banques.js'
     : 'réponse de langue : contrôlée par relecture (tests/echantillon.js)');
  parRaison[raison] = parRaison[raison] || [];
  parRaison[raison].push(spec.id);
});
Object.keys(parRaison).forEach(function (raison) {
  var liste = parRaison[raison];
  console.log('  · ' + liste.length + ' non recalculés — ' + raison);
  if (/AUCUNE RÈGLE/.test(raison)) console.log('      ' + liste.join(', '));
});

console.log('');
if (fautes.length || nonReconnus.length) {
  console.log((fautes.length ? fautes.length + ' réponse(s) fausse(s). ' : '') +
              (nonReconnus.length ? nonReconnus.length + ' énoncé(s) non reconnu(s).' : ''));
  process.exit(1);
}
console.log('Toutes les réponses recalculées sont justes.');
