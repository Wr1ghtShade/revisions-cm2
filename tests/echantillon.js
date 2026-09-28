/* Affiche quelques exercices de chaque générateur, pour relecture humaine :
       node tests/echantillon.js [nombre par générateur] [filtre sur l'id]

   C'est le seul contrôle qui vérifie que la réponse est *juste* : les auto-tests
   de verifier.js ne vérifient que la forme. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var N = parseInt(process.argv[2], 10) || 2;
var FILTRE = process.argv[3] || '';
var racine = path.join(__dirname, '..');

var FICHIERS = require('./charger').tranche('exercices');

var contexte = vm.createContext({ console: console, Math: Math, Date: Date });
contexte.window = contexte;
FICHIERS.forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), contexte, { filename: f });
});

var CM2 = contexte.CM2;

CM2.registre.liste().forEach(function (spec) {
  if (FILTRE && spec.id.indexOf(FILTRE) === -1) return;
  console.log('\n=== ' + spec.id + ' — ' + spec.titre + '  [' + spec.objectifs.join(', ') + ']');
  for (var g = 0; g < N; g++) {
    var ex = CM2.registre.produire(spec.id, 1000 + g * 37);
    console.log('  ' + ex.enonce);
    if (ex.type === 'qcm') {
      ex.propositions.forEach(function (p, i) {
        console.log('      ' + (i === ex.bonne_reponse ? '>' : ' ') + ' ' + p);
      });
    } else {
      console.log('      > ' + ex.bonne_reponse);
    }
    console.log('      · ' + ex.explication);
  }
});
