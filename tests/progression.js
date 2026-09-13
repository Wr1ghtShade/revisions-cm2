/* Vérification du schéma de progression, hors navigateur :
       node tests/progression.js

   On simule un cahier, une horloge qu'on fait avancer jour par jour, et on
   contrôle que la révision espacée se comporte comme annoncé : un exercice raté
   revient tout de suite, puis à 1, 3, 7 et 16 jours, et sort de la liste à la
   cinquième réussite ; une notion ratée retombe en boîte 0 ; les séries donnent
   la priorité à ce qui est dû et à ce qui n'a jamais été vu. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');
var MODULES = ['app/version.js', 'app/rng.js', 'app/format.js', 'app/lettres.js', 'app/contraintes.js',
               'app/qcm.js', 'app/registre.js', 'app/profil.js', 'app/progression.js'];

/* --- Un navigateur de poche ------------------------------------------- */

var stock = {};
var VraiDate = Date;
var decalage = 0;           // en jours, pour faire avancer le calendrier

function FausseDate() {
  if (arguments.length === 0) {
    var d = new VraiDate();
    d.setDate(d.getDate() + decalage);
    return d;
  }
  return new (VraiDate.bind.apply(VraiDate, [null].concat([].slice.call(arguments))))();
}
FausseDate.now = function () { return new FausseDate().getTime(); };

var contexte = vm.createContext({
  console: console, Math: Math, JSON: JSON, Date: FausseDate,
  localStorage: {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(stock, k) ? stock[k] : null; },
    setItem: function (k, v) { stock[k] = String(v); },
    removeItem: function (k) { delete stock[k]; }
  }
});
contexte.window = contexte;
MODULES.forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), contexte, { filename: f });
});

var CM2 = contexte.CM2;
var P = CM2.profil;
var Prog = CM2.progression;

/* Quelques générateurs factices : on ne teste ici que la mécanique de révision. */
['a', 'b', 'c', 'd'].forEach(function (lettre) {
  CM2.registre.ajouter({
    id: 'faux.' + lettre,
    matiere: 'mathematiques',
    objectifs: ['test'],
    titre: 'Exercice ' + lettre,
    generer: function (r) {
      return { enonce: 'Question ' + lettre + ' ?', type: 'saisie',
               bonne_reponse: String(r.entier(1, 9)), explication: 'Parce que.' };
    }
  });
});

/* --- Petit cadre de test ---------------------------------------------- */

var echecs = 0, total = 0;
function verifier(intitule, obtenu, attendu) {
  total++;
  var ok = JSON.stringify(obtenu) === JSON.stringify(attendu);
  if (!ok) {
    echecs++;
    console.log('  ÉCHEC  ' + intitule + '\n         attendu : ' + JSON.stringify(attendu) +
                '\n         obtenu  : ' + JSON.stringify(obtenu));
  } else {
    console.log('  ok     ' + intitule);
  }
}
function jour(n) { decalage = n; }
function exercice(id, graine) { return CM2.registre.produire(id, graine); }

/* --- Le scénario -------------------------------------------------------- */

console.log('\nUn exercice raté, puis réussi jusqu\'à être su');
jour(0);
P.ouvrir('Test');
var ex = exercice('faux.a', 1234);

Prog.noterReponse(ex, false);
verifier('raté : il est à revoir aujourd\'hui', Prog.aReviser().length, 1);
verifier('raté : rien en attente', Prog.enAttente().length, 0);

Prog.noterReponse(ex, true);
verifier('1re réussite : plus rien à revoir aujourd\'hui', Prog.aReviser().length, 0);
verifier('1re réussite : il passe en attente', Prog.enAttente().length, 1);
verifier('1re réussite : il revient dans 1 jour', Prog.prochaineEcheance(), 1);

jour(1);
verifier('le lendemain : il est dû', Prog.aReviser().length, 1);
Prog.noterReponse(ex, true);
verifier('2e réussite : il revient dans 3 jours', Prog.prochaineEcheance(), 3);

jour(4);
Prog.noterReponse(exercice('faux.a', 1234), true);
verifier('3e réussite : il revient dans 7 jours', Prog.prochaineEcheance(), 7);

jour(11);
Prog.noterReponse(exercice('faux.a', 1234), true);
verifier('4e réussite : il revient dans 16 jours', Prog.prochaineEcheance(), 16);
verifier('4e réussite : il est encore suivi', P.actuel().aRevoir.length, 1);

jour(27);
Prog.noterReponse(exercice('faux.a', 1234), true);
verifier('5e réussite : il sort de la liste', P.actuel().aRevoir.length, 0);

console.log('\nUn exercice réussi puis raté retombe en boîte 0');
var ex2 = exercice('faux.b', 77);
Prog.noterReponse(ex2, false);
Prog.noterReponse(ex2, true);
verifier('après une réussite : en attente', Prog.enAttente().length, 1);
Prog.noterReponse(ex2, false);
verifier('après une rechute : de nouveau dû', Prog.aReviser().length, 1);
verifier('après une rechute : boîte remise à zéro', P.actuel().aRevoir[0].boite, 0);

console.log('\nLes notions suivent les mêmes boîtes');
var n = P.actuel().notions['faux.a'];
verifier('faux.a a été vu 6 fois', n.vus, 6);
verifier('faux.a a 5 réussites', n.reussites, 5);
verifier('faux.a plafonne en boîte 4', n.boite, 4);

console.log('\nComposition des séries');
jour(27);
var serie = Prog.choisirSerie('mathematiques', 6);
verifier('une série de 6 contient 6 questions', serie.length, 6);

var ids = serie.map(function (s) { return s.id; });
verifier('faux.c, jamais vu, est proposé', ids.indexOf('faux.c') !== -1, true);
verifier('faux.d, jamais vu, est proposé', ids.indexOf('faux.d') !== -1, true);

var dus = Prog.aReviser('mathematiques');
var reprises = serie.filter(function (s) {
  return dus.some(function (d) { return d.id === s.id && d.graine === s.graine; });
});
verifier('au plus un tiers de reprises', reprises.length <= 2, true);

console.log('\nSauvegarde et restauration');
var fichier = P.exporter();
verifier('l\'export est du JSON lisible', typeof JSON.parse(fichier).cahier.nom, 'string');
var bilan = P.importer(fichier, false);
verifier('réimporter sans remplacer est refusé', bilan.existe, true);
verifier('réimporter en remplaçant fonctionne', P.importer(fichier, true).ok, true);
verifier('un fichier étranger est refusé', P.importer('{"format":"autre"}', true).ok, false);
verifier('un fichier illisible est refusé', P.importer('pas du json', true).ok, false);

console.log('\n' + (total - echecs) + ' vérifications réussies sur ' + total + '.');
process.exit(echecs ? 1 : 0);
