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

console.log('\nUn fichier de restauration est contrôlé avant d\'entrer');
function paquet(cahier) {
  return JSON.stringify({ format: 'cahier-revisions-cm2', version: 1, cahier: cahier });
}
var abime = P.importer(paquet({ nom: 'Casse', aRevoir: { pas: 'un tableau' } }), true);
verifier('une liste à revoir qui n\'est pas une liste est refusée', abime.ok, false);
verifier('… et le message nomme la partie fautive', /aRevoir/.test(abime.message), true);
verifier('le cahier refusé n\'est pas entré', P.existe('Casse'), false);
verifier('une série en cours sans identifiants de texte est refusée',
         P.importer(paquet({ nom: 'Piege', seanceEnCours: { serie: [{ id: 42, graine: 1 }] } }), true).ok,
         false);
verifier('un nom qui n\'est pas un texte est refusé',
         P.importer(paquet({ nom: { x: 1 } }), true).ok, false);
var gros = paquet({ nom: 'Gros', bourrage: new Array(P.TAILLE_MAX_FICHIER + 2).join('x') });
verifier('un fichier plus gros qu\'un cahier ne peut l\'être est refusé',
         P.importer(gros, true).ok, false);
verifier('un cahier normal, lui, passe', P.importer(paquet({ nom: 'Normal' }), true).ok, true);

console.log('\nUn échec d\'écriture est annoncé, pas tu');
var vraiSetItem = contexte.localStorage.setItem;
contexte.localStorage.setItem = function (k, v) {
  if (k === 'cm2.cahiers.v1') throw new Error('QuotaExceededError');
  vraiSetItem(k, v);
};
var refuse = P.importer(paquet({ nom: 'SansPlace' }), true);
verifier('l\'import rapporte l\'échec', refuse.ok, false);
verifier('… en parlant de place', /place/.test(refuse.message), true);
verifier('le cahier n\'est pas resté en mémoire', P.existe('SansPlace'), false);
verifier('la mémoire est toujours déclarée disponible', P.memoireDisponible(), true);
contexte.localStorage.setItem = vraiSetItem;
verifier('l\'écriture rétablie, le même cahier passe', P.importer(paquet({ nom: 'SansPlace' }), true).ok, true);

console.log('\nLes noms réservés de JavaScript sont des noms comme les autres');
['__proto__', 'constructor', 'toString'].forEach(function (nom) {
  var avant = P.liste().length;
  P.ouvrir(nom);
  verifier('« ' + nom + ' » : le cahier existe', P.existe(nom), true);
  verifier('« ' + nom + ' » : il porte son nom', P.actuel().nom, nom);
  verifier('« ' + nom + ' » : il figure dans la liste', P.liste().length, avant + 1);
  verifier('« ' + nom + ' » : les autres objets ne sont pas touchés', ({}).notions, undefined);
  verifier('« ' + nom + ' » : il est bien enregistré',
           Object.keys(JSON.parse(stock['cm2.cahiers.v1']).cahiers).indexOf(nom) !== -1, true);
  P.supprimer(nom);
  verifier('« ' + nom + ' » : il se supprime', P.existe(nom), false);
});
verifier('un générateur nommé « constructor » n\'existe pas', CM2.registre.get('constructor'), undefined);
verifier('une mascotte nommée « constructor » n\'a pas de nom', P.nomAvatar('constructor'), 'mascotte');

console.log('\n' + (total - echecs) + ' vérifications réussies sur ' + total + '.');
process.exit(echecs ? 1 : 0);
