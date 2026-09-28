/* Vérification du bilan et des fiches, hors navigateur :
       node tests/bilan.js

   On fabrique un cahier, on répond à des questions, on fait avancer le
   calendrier, et on contrôle que ce qui est remonté correspond à ce qui a été
   fait : les bons domaines du programme, les bonnes semaines, les bonnes
   notions dans « acquis » et dans « ça coince ».

   Pour les fiches, l'exigence est ailleurs : une fiche doit être exactement
   reproductible à partir de sa seule référence imprimée. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');

var MODULES = require('./charger').tranche('cahier');

/* --- Un navigateur de poche, et une horloge qu'on peut pousser -------- */

var stock = {};
var VraieDate = Date;
var decalage = 0;

function FausseDate() {
  if (arguments.length === 0) {
    var d = new VraieDate();
    d.setDate(d.getDate() + decalage);
    return d;
  }
  return new (VraieDate.bind.apply(VraieDate, [null].concat([].slice.call(arguments))))();
}
FausseDate.now = function () { return new FausseDate().getTime(); };

var contexte = vm.createContext({
  console: console, Math: Math, JSON: JSON, Date: FausseDate, isNaN: isNaN,
  parseInt: parseInt, parseFloat: parseFloat, isFinite: isFinite,
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
var B = CM2.bilan;
var Fi = CM2.fiche;

/* --- Petit cadre de test ---------------------------------------------- */

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
function jour(n) { decalage = n; }
function ligne(liste, id) {
  return liste.filter(function (l) { return l.id === id; })[0] || null;
}
function repondre(generateur, graine, juste) {
  Prog.noterReponse(CM2.registre.produire(generateur, graine), juste);
}

/* ====================================================================== */

console.log('\nLe référentiel est entièrement rattaché');
var orphelins = [];
CM2.registre.liste().forEach(function (spec) {
  spec.objectifs.forEach(function (o) {
    if (!CM2.domaines.sousDomaineDe(o)) orphelins.push(spec.id + ' → ' + o);
  });
});
verifier('aucun générateur ne cite un objectif hors du programme', orphelins, []);
verifier('les objectifs du programme sont tous indexés',
         CM2.domaines.sousDomaines().length > 0 && CM2.domaines.nombreObjectifs() > 150, true);

console.log('\nUn cahier tout neuf ne prétend rien');
jour(0);
P.ouvrir('Test');
var resume = B.resume();
verifier('aucune question faite', resume.questions, 0);
verifier('aucun taux à afficher', resume.taux, null);
verifier('aucune notion acquise', B.acquises().length, 0);
verifier('aucune notion fragile', B.fragiles().length, 0);
var domaines = B.parDomaine();
verifier('les domaines sont quand même listés', domaines.length > 4, true);
verifier('aucun domaine n\'est jugeable', domaines.every(function (d) { return !d.jugeable; }), true);
verifier('un domaine sans exercice disponible n\'est pas affiché',
         domaines.every(function (d) { return d.generateurs > 0; }), true);

console.log('\nCe qui est travaillé remonte dans le bon domaine du programme');
// ent.chiffre_position travaille mat.nc.entiers ; mes.aire_rectangle, mat.gm.aires.
repondre('ent.chiffre_position', 11, true);
repondre('ent.chiffre_position', 12, true);
repondre('ent.chiffre_position', 13, false);
repondre('mes.aire_rectangle', 21, true);

var sous = B.parSousDomaine();
verifier('les nombres entiers comptent 3 questions', ligne(sous, 'mat.nc.entiers').vus, 3);
verifier('les nombres entiers comptent 2 réussites', ligne(sous, 'mat.nc.entiers').reussites, 2);
verifier('les aires comptent 1 question', ligne(sous, 'mat.gm.aires').vus, 1);
verifier('les fractions n\'ont rien vu', ligne(sous, 'mat.nc.fractions').vus, 0);

// mes.aire_rectangle cite mat.gm.aires ET mat.gm.aires.03 : un seul comptage.
verifier('un générateur cité deux fois dans un sous-domaine n\'est compté qu\'une fois',
         ligne(sous, 'mat.gm.aires').rencontres, 1);

var nc = ligne(B.parDomaine(), 'mat.nc');
verifier('le domaine « nombres et calcul » agrège ses sous-domaines', nc.vus, 3);
verifier('le domaine est jugeable à partir de trois questions', nc.jugeable, true);
verifier('son taux est le bon', Math.round(100 * nc.taux), 67);

console.log('\nUne question peut compter dans deux domaines : c\'est assumé');
// mes.aire_rectangle travaille les aires (mat.gm) et rien d'autre ici ;
// dd.lire_decimal travaille les décimaux et les fractions décimales.
var avant = B.parSousDomaine();
var sommeDomaines = avant.reduce(function (n, l) { return n + l.vus; }, 0);
verifier('la somme des domaines peut dépasser le total du cahier',
         sommeDomaines >= P.actuel().total.questions, true);

console.log('\nAcquis et fragiles');
// Une notion vue deux fois n'est jamais jugée, même parfaite.
repondre('ent.comparer', 31, true);
repondre('ent.comparer', 32, true);
verifier('deux réussites ne suffisent pas à déclarer une notion sue',
         B.acquises().filter(function (n) { return n.id === 'ent.comparer'; }).length, 0);
repondre('ent.comparer', 33, true);
verifier('trois réussites, oui',
         B.acquises().filter(function (n) { return n.id === 'ent.comparer'; }).length, 1);
verifier('la notion acquise porte son domaine',
         B.acquises().filter(function (n) { return n.id === 'ent.comparer'; })[0].domaine,
         'Les nombres entiers');

repondre('gr.nature_mot', 41, false);
repondre('gr.nature_mot', 42, false);
repondre('gr.nature_mot', 43, true);
var fragiles = B.fragiles();
verifier('une notion ratée deux fois sur trois est signalée',
         fragiles.filter(function (n) { return n.id === 'gr.nature_mot'; }).length, 1);
verifier('elle n\'est pas en même temps déclarée acquise',
         B.acquises().filter(function (n) { return n.id === 'gr.nature_mot'; }).length, 0);

console.log('\nLes semaines');
P.terminerSeance('mathematiques', 10, 7);
var semaines = B.parSemaine(6);
verifier('six semaines sont rendues', semaines.length, 6);
verifier('la dernière est la semaine courante', semaines[5].courante, true);
verifier('la séance du jour tombe dans la semaine courante', semaines[5].questions, 10);
verifier('son taux est le bon', Math.round(100 * semaines[5].taux), 70);
verifier('les semaines vides sont rendues aussi, à zéro', semaines[0].questions, 0);
verifier('une semaine vide n\'a pas de taux', semaines[0].taux, null);
verifier('les semaines sont dans l\'ordre, de la plus ancienne à la plus récente',
         semaines[0].lundi < semaines[5].lundi, true);

// Deux séances le même jour : un seul jour travaillé, mais deux séances.
P.terminerSeance('francais', 5, 5);
semaines = B.parSemaine(6);
verifier('deux séances le même jour comptent pour deux séances', semaines[5].seances, 2);
verifier('… et pour un seul jour travaillé', semaines[5].jours, 1);
verifier('les questions s\'additionnent', semaines[5].questions, 15);

jour(10);
semaines = B.parSemaine(6);
var total10 = semaines.reduce(function (n, s) { return n + s.questions; }, 0);
verifier('dix jours plus tard, les séances passées sont toujours comptées', total10, 15);
verifier('mais plus dans la semaine courante', semaines[5].questions, 0);

jour(0);

console.log('\nLe résumé pour l\'adulte');
resume = B.resume();
verifier('il compte les questions du cahier', resume.questions, P.actuel().total.questions);
verifier('il compte les sortes d\'exercices rencontrées', resume.sortesRencontrees, 4);
verifier('il sait combien de sortes existent', resume.sortesDisponibles,
         CM2.registre.liste().length);
verifier('il compte les objectifs travaillés', resume.objectifsTravailles > 0, true);
verifier('les objectifs travaillés ne dépassent pas ceux que l\'appli couvre',
         resume.objectifsTravailles <= resume.objectifsPossibles, true);
verifier('… qui ne dépassent pas ceux du programme',
         resume.objectifsPossibles <= resume.objectifsProgramme, true);

console.log('\nLes fiches à imprimer');
var fiche = Fi.composer('mathematiques', 20);
verifier('une fiche de vingt exercices en contient vingt', fiche.exercices.length, 20);
verifier('elle porte une référence lisible',
         /^[0-9A-Z]+-M20$/.test(fiche.reference), true);
var lu = Fi.depuisReference(fiche.reference);
verifier('la référence redonne la graine', lu.graine, fiche.graine);
verifier('elle redonne aussi la matière', lu.matiere, 'mathematiques');
verifier('elle redonne aussi le nombre d\'exercices', lu.nombre, 20);
verifier('elle est pardonnante sur la casse et les espaces',
         Fi.depuisReference(' ' + fiche.reference.toLowerCase() + ' ').graine, fiche.graine);
verifier('un texte qui n\'est pas une référence est refusé',
         Fi.depuisReference('bonjour !'), null);

var memeFiche = Fi.composer('mathematiques', 20, fiche.graine);
verifier('la même référence redonne exactement la même fiche',
         memeFiche.exercices.map(function (e) { return e.generateur_id + '#' + e.graine; }),
         fiche.exercices.map(function (e) { return e.generateur_id + '#' + e.graine; }));

var autre = Fi.composer('mathematiques', 20, fiche.graine + 1);
verifier('une autre graine donne une autre fiche',
         autre.exercices.map(function (e) { return e.graine; }).join() !==
         fiche.exercices.map(function (e) { return e.graine; }).join(), true);

verifier('tous les exercices sont de la matière demandée',
         fiche.exercices.every(function (e) { return e.matiere === 'mathematiques'; }), true);
verifier('chaque exercice a une réponse',
         fiche.exercices.every(function (e) {
           return e.bonne_reponse !== undefined && e.bonne_reponse !== null &&
                  String(e.bonne_reponse).length > 0;
         }), true);

var domainesTouches = {};
fiche.exercices.forEach(function (e) {
  var sd = CM2.domaines.sousDomaineDe(e.objectifs[0]);
  if (sd) domainesTouches[sd.id] = true;
});
verifier('une fiche de vingt balaie au moins huit sous-domaines',
         Object.keys(domainesTouches).length >= 8, true);

var titres = {};
var repetitions = 0;
fiche.exercices.forEach(function (e) {
  if (titres[e.generateur_id]) repetitions++;
  titres[e.generateur_id] = true;
});
verifier('aucune sorte d\'exercice n\'est répétée sur une fiche de vingt', repetitions, 0);

// Une matière dont l'application a moins de sortes que la fiche n'a de cases :
// elle doit quand même rendre le compte demandé, avec d'autres questions.
var petite = Fi.composer('emc', 20);
verifier('une matière peu fournie remplit quand même la fiche', petite.exercices.length, 20);

var fiches = ['francais', 'emc', 'tout'].map(function (m) { return Fi.composer(m, 20); });
verifier('toutes les matières composent une fiche complète',
         fiches.every(function (f) { return f && f.exercices.length === 20; }), true);

verifier('une fiche ne touche pas au cahier',
         B.resume().questions, resume.questions);

/* --- Une sorte d'exercice retirée entre deux versions ------------------ */

console.log('\nUne sorte d\'exercice qui n\'existe plus');
var avantOubli = B.fragiles(50).length;
P.actuel().notions['gen.retire.en.route'] = {
  vus: 9, reussites: 1, boite: 0, dernier: P.aujourdhui()
};
P.enregistrer();

verifier('elle reste inscrite dans le cahier — on n\'efface pas le passé',
         !!P.actuel().notions['gen.retire.en.route'], true);
verifier('mais elle n\'apparaît pas dans « ce qui coince »',
         B.fragiles(50).length, avantOubli);
verifier('ni sous son identifiant brut',
         B.fragiles(50).concat(B.acquises(50))
           .filter(function (n) { return n.id === 'gen.retire.en.route'; }).length, 0);
verifier('le bureau de l\'enfant ne la montre pas non plus',
         CM2.progression.notionsFragiles(50)
           .filter(function (n) { return n.id === 'gen.retire.en.route'; }).length, 0);
verifier('aucune notion affichée ne porte un titre vide',
         B.fragiles(50).concat(B.acquises(50))
           .filter(function (n) { return !n.titre || !n.matiere; }).length, 0);
delete P.actuel().notions['gen.retire.en.route'];
P.enregistrer();

console.log('\n' + (total - echecs) + ' vérifications réussies sur ' + total + '.');
process.exit(echecs ? 1 : 0);
