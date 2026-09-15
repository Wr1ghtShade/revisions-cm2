/* La vue enseignant dit-elle vrai ?
       node tests/classe.js

   app/classe.js ne calcule rien de neuf : il relit plusieurs cahiers avec les
   outils de app/bilan.js et rassemble. Ce qui peut donc casser, ce n'est pas
   une formule, ce sont les jointures — un cahier oublié, un cahier compté
   deux fois, le cahier ouvert qui bouge pendant la lecture, un enfant jugé sur
   deux réponses.

   Trois cahiers sont fabriqués ici à la main, avec des historiques différents,
   et l'on vérifie ce que la vue en dit. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');

var stock = {};
var contexte = vm.createContext({
  console: console, Math: Math, JSON: JSON, Date: Date,
  isNaN: isNaN, parseInt: parseInt, parseFloat: parseFloat, isFinite: isFinite,
  Array: Array, String: String, Object: Object,
  localStorage: {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(stock, k) ? stock[k] : null; },
    setItem: function (k, v) { stock[k] = String(v); },
    removeItem: function (k) { delete stock[k]; }
  }
});
contexte.window = contexte;

[
  'app/version.js', 'app/rng.js', 'app/format.js', 'app/lettres.js', 'app/contraintes.js',
  'app/qcm.js', 'app/figures.js', 'app/registre.js', 'app/domaines.js',
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
  'app/generateurs/revisions-tables.js',
  'app/profil.js', 'app/progression.js', 'app/bilan.js', 'app/classe.js'
].forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), contexte, { filename: f });
});

var CM2 = contexte.CM2;
var P = CM2.profil;
var Cl = CM2.classe;

var echecs = 0, total = 0;

function verifier(intitule, obtenu, attendu) {
  total++;
  if (JSON.stringify(obtenu) === JSON.stringify(attendu)) {
    console.log('  ok     ' + intitule);
  } else {
    echecs++;
    console.log('  ÉCHEC  ' + intitule +
                '\n         attendu : ' + JSON.stringify(attendu) +
                '\n         obtenu  : ' + JSON.stringify(obtenu));
  }
}

/* --- Trois cahiers fabriqués ------------------------------------------ */

function ilYA(jours) { return P.dans(-jours); }

/** Écrit un cahier de toutes pièces, sans passer par une séance jouée : on
    contrôle ainsi exactement ce que la vue doit en dire. */
function fabriquer(nom, avatar, notions, seances, derniereVisite) {
  P.ouvrir(nom, avatar);
  var c = P.actuel();
  c.notions = notions;
  c.seances = seances;
  c.derniereVisite = derniereVisite;
  c.jours = seances.map(function (s) { return s.date; });
  c.total = seances.reduce(function (t, s) {
    return { questions: t.questions + s.questions, reussites: t.reussites + s.reussites };
  }, { questions: 0, reussites: 0 });
  P.enregistrer();
  P.fermer();
}

// Deux générateurs bien réels : la vue lit leur titre et leur domaine dans le
// registre, donc un identifiant inventé ne dirait rien.
var NOTION_A = 'ent.chiffre_position';
var NOTION_B = 'mes.aire_rectangle';

fabriquer('Zoé', '🦊', {
  // Une notion qui résiste, une notion acquise.
  'ent.chiffre_position': { vus: 10, reussites: 4, boite: 0, dernier: ilYA(1) },
  'mes.aire_rectangle': { vus: 8, reussites: 8, boite: 4, dernier: ilYA(1) }
}, [
  { date: ilYA(1), matiere: 'mathematiques', questions: 10, reussites: 7 },
  { date: ilYA(3), matiere: 'mathematiques', questions: 8, reussites: 5 }
], ilYA(1));

fabriquer('Malo', '🦖', {
  // La même notion résiste ici aussi : c'est elle qui doit remonter en tête.
  'ent.chiffre_position': { vus: 6, reussites: 2, boite: 0, dernier: ilYA(2) }
}, [
  { date: ilYA(2), matiere: 'mathematiques', questions: 6, reussites: 2 }
], ilYA(2));

// Un cahier ouvert il y a longtemps, et resté vide.
fabriquer('Inès', '🐼', {}, [], ilYA(30));

/* --- Le tableau des enfants -------------------------------------------- */

console.log('\nLe tableau des enfants');
var eleves = Cl.eleves();
verifier('les trois cahiers sont là', eleves.map(function (e) { return e.nom; }).sort(),
         ['Inès', 'Malo', 'Zoé']);
verifier('le plus récemment visité vient en premier', eleves[0].nom, 'Zoé');

var zoe = eleves.filter(function (e) { return e.nom === 'Zoé'; })[0];
verifier('les questions de Zoé sont comptées', zoe.questions, 18);
verifier('ses réussites aussi', zoe.reussites, 12);
verifier('son taux est celui de son cahier', Math.round(100 * zoe.taux), 67);
verifier('ses deux séances sont comptées', zoe.seances, 2);
verifier('elle n\'est pas signalée décrochée', zoe.decroche, false);

var ines = eleves.filter(function (e) { return e.nom === 'Inès'; })[0];
verifier('un cahier vide ne prétend pas à un taux', ines.jugeable, false);
verifier('… et son absence est signalée', ines.decroche, true);
verifier('… avec le nombre de jours', ines.joursSansNouvelles, 30);

/* --- Lire ne doit rien déplacer ---------------------------------------- */

console.log('\nLire les cahiers ne doit rien déranger');
verifier('aucun cahier n\'est ouvert après la lecture', P.actuel(), null);
P.ouvrir('Malo');
Cl.eleves();
Cl.difficultesCommunes();
Cl.parDomaine();
verifier('le cahier ouvert reste le même', P.actuel().nom, 'Malo');
verifier('sa dernière visite n\'a pas été réécrite par la lecture des autres',
         P.cahierDe('Zoé').derniereVisite, ilYA(1));
P.fermer();

/* --- Ce qui coince, et chez qui ---------------------------------------- */

console.log('\nCe qui coince');
var dur = Cl.difficultesCommunes(10);
verifier('la notion qui résiste à deux enfants est en tête', dur[0].id, NOTION_A);
verifier('les deux enfants sont nommés',
         dur[0].eleves.map(function (e) { return e.nom; }).sort(), ['Malo', 'Zoé']);
verifier('les comptes des deux cahiers sont additionnés', [dur[0].vus, dur[0].reussites], [16, 6]);
verifier('la notion réussie n\'apparaît pas comme une difficulté',
         dur.filter(function (l) { return l.id === NOTION_B; }).length, 0);
verifier('le titre vient du registre', dur[0].titre, CM2.registre.get(NOTION_A).titre);

/* --- Les domaines, tous cahiers réunis --------------------------------- */

console.log('\nLes domaines de la classe');
var domaines = Cl.parDomaine().filter(function (d) { return d.vus > 0; });
verifier('des domaines ressortent', domaines.length > 0, true);

var nombres = domaines.filter(function (d) { return d.id === 'mat.nc'; })[0];
verifier('le domaine des nombres additionne les deux cahiers', nombres.vus, 16);
verifier('… et compte deux enfants', nombres.enfants, 2);

var mesures = domaines.filter(function (d) { return d.id === 'mat.gm'; })[0];
verifier('le domaine des grandeurs ne compte qu\'un enfant', mesures.enfants, 1);
verifier('… avec les seules questions de Zoé', mesures.vus, 8);

/* --- La vue d'ensemble -------------------------------------------------- */

console.log('\nLa vue d\'ensemble');
var resume = Cl.resume();
verifier('les trois cahiers sont comptés', resume.cahiers, 3);
verifier('les questions de tous sont additionnées', resume.questions, 24);
verifier('les réussites aussi', resume.reussites, 14);
verifier('le cahier jamais commencé est signalé', resume.jamaisCommence, ['Inès']);
verifier('le cahier sans nouvelles est signalé', resume.decroches, ['Inès']);

/* --- Un seul cahier, et aucun ------------------------------------------ */

console.log('\nLes cas limites');
P.supprimer('Malo');
P.supprimer('Inès');
verifier('avec un seul cahier, la vue tient debout', Cl.resume().cahiers, 1);
verifier('et la difficulté ne concerne plus qu\'un enfant',
         Cl.difficultesCommunes()[0].eleves.length, 1);

P.supprimer('Zoé');
verifier('sans aucun cahier, rien ne casse', Cl.resume().cahiers, 0);
verifier('… les listes sont vides', [Cl.eleves().length, Cl.difficultesCommunes().length], [0, 0]);
verifier('… et les domaines aussi',
         Cl.parDomaine().filter(function (d) { return d.vus > 0; }).length, 0);

console.log('\n' + (total - echecs) + ' vérifications réussies sur ' + total + '.');
process.exit(echecs ? 1 : 0);
