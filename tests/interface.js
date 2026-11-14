/* Les écrans se dessinent-ils sans erreur ?
       node tests/interface.js

   Les autres suites ne touchent jamais à app/ui.js : elles vérifient les
   exercices, la révision espacée, le bilan, mais pas l'interface. Une faute de
   frappe sur un identifiant, une fonction renommée, un écran oublié dans la
   liste des écrans — rien de tout cela ne se voit avant d'ouvrir la page.

   Ce fichier monte donc un DOM de poche : juste assez pour que ui.js s'exécute
   pour de vrai. On y joue un parcours complet — créer un cahier, faire une
   série, voir le bilan, ouvrir la progression, composer une fiche — et la
   moindre exception fait échouer la suite.

   Ce n'est pas un test d'apparence : rien ici ne dit si c'est joli ou bien
   placé. Cela dit seulement que le code de l'interface tourne, et qu'aucun
   identifiant ne manque. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');

/* ====================================================================== */
/* Un DOM de poche                                                        */
/* ====================================================================== */

function Element(balise) {
  this.balise = balise || 'div';
  this.enfants = [];
  this.attributs = {};
  this.ecouteurs = {};
  this.className = '';
  this.textContent = '';
  this.html = '';
  this.hidden = false;
  this.disabled = false;
  this.value = '';
  this.title = '';
  this.style = {};
  var self = this;
  this.classList = {
    add: function (c) { if (!self.aClasse(c)) self.className += (self.className ? ' ' : '') + c; },
    remove: function (c) {
      self.className = self.className.split(/\s+/).filter(function (x) { return x && x !== c; }).join(' ');
    },
    contains: function (c) { return self.aClasse(c); },
    toggle: function (c, oui) { if (oui) this.add(c); else this.remove(c); }
  };
}

Element.prototype.aClasse = function (c) {
  return this.className.split(/\s+/).indexOf(c) !== -1;
};
Element.prototype.appendChild = function (n) { this.enfants.push(n); return n; };
Element.prototype.removeChild = function (n) {
  this.enfants = this.enfants.filter(function (x) { return x !== n; });
  return n;
};
Element.prototype.setAttribute = function (k, v) { this.attributs[k] = String(v); };
Element.prototype.getAttribute = function (k) {
  return Object.prototype.hasOwnProperty.call(this.attributs, k) ? this.attributs[k] : null;
};
Element.prototype.removeAttribute = function (k) { delete this.attributs[k]; };
Element.prototype.addEventListener = function (type, fn) {
  (this.ecouteurs[type] = this.ecouteurs[type] || []).push(fn);
};
Element.prototype.focus = function () {};
Element.prototype.click = function () { this.declencher('click'); };
Element.prototype.declencher = function (type, evenement) {
  var liste = this.ecouteurs[type] || [];
  var e = evenement || { preventDefault: function () {}, target: this };
  liste.forEach(function (fn) { fn(e); });
  return liste.length;
};
/* Le vrai code fait `b.innerHTML = '<span class="avatar">…'` puis
   `b.querySelector('.avatar')`. On ne sait pas analyser du HTML : on rend un
   élément neuf, ce qui suffit pour que le code s'exécute. */
Element.prototype.querySelector = function () { return new Element('span'); };

Object.defineProperty(Element.prototype, 'children', {
  get: function () { return this.enfants; }
});

/* Comme dans un vrai navigateur, écrire dans innerHTML remplace le contenu :
   sans cela, un écran redessiné empilerait les enfants et le test ne verrait
   jamais les doublons d'affichage. */
Object.defineProperty(Element.prototype, 'innerHTML', {
  get: function () { return this.html; },
  set: function (v) { this.html = String(v); this.enfants = []; }
});

/* Les éléments désignés par un sélecteur d'attribut : ui.js s'en sert pour les
   groupes de boutons. On les déclare ici avec leurs attributs, sinon les
   boutons « 10 questions » ou « mathématiques » n'existeraient pas. */
function groupe(attribut, valeurs) {
  return valeurs.map(function (v) {
    var e = new Element('button');
    e.setAttribute(attribut, v);
    return e;
  });
}

/* Les boutons de groupe sont lus dans index.html lui-même. Recopiés à la main,
   ils avaient dérivé : ce DOM ne connaissait ni la matière « revisions » ni les
   fiches de 30, et le parcours ne les exerçait donc jamais — sans que rien ne
   le signale. */
var PAGE = fs.readFileSync(path.join(racine, 'index.html'), 'utf8');

function valeursDans(attribut) {
  var out = [], re = new RegExp(attribut + '="([^"]+)"', 'g'), m;
  while ((m = re.exec(PAGE))) out.push(m[1]);
  if (!out.length) throw new Error('index.html ne contient aucun ' + attribut);
  return out;
}

var SELECTEURS = {
  '[data-nombre]': groupe('data-nombre', valeursDans('data-nombre')),
  '[data-matiere]': groupe('data-matiere', valeursDans('data-matiere')),
  '[data-fiche-nombre]': groupe('data-fiche-nombre', valeursDans('data-fiche-nombre')),
  '[data-fiche-matiere]': groupe('data-fiche-matiere', valeursDans('data-fiche-matiere')),
  '.message-cahier': [new Element('p'), new Element('p')]
};

var parId = {};
var document = {
  body: new Element('body'),
  ecouteurs: {},
  getElementById: function (id) {
    if (!parId[id]) { parId[id] = new Element('div'); parId[id].id = id; }
    return parId[id];
  },
  createElement: function (balise) { return new Element(balise); },
  createTextNode: function (texte) { var n = new Element('#text'); n.textContent = texte; return n; },
  querySelectorAll: function (sel) { return SELECTEURS[sel] || []; },
  addEventListener: function (type, fn) {
    (document.ecouteurs[type] = document.ecouteurs[type] || []).push(fn);
  }
};

var stock = {};
var impressions = 0;

var contexte = vm.createContext({
  console: console, Math: Math, JSON: JSON, Date: Date,
  isNaN: isNaN, parseInt: parseInt, parseFloat: parseFloat, isFinite: isFinite,
  setTimeout: function () {}, Array: Array, String: String, Object: Object,
  document: document,
  localStorage: {
    getItem: function (k) { return Object.prototype.hasOwnProperty.call(stock, k) ? stock[k] : null; },
    setItem: function (k, v) { stock[k] = String(v); },
    removeItem: function (k) { delete stock[k]; }
  }
});
contexte.window = contexte;
/* De quoi laisser s'exécuter l'enregistrement du cahier dans un fichier : sans
   ces deux-là, sauverCahier tomberait dans son filet et on ne saurait jamais si
   ce qui suit l'écriture du fichier a bien lieu. */
contexte.Blob = function (morceaux) { this.morceaux = morceaux; };
contexte.URL = {
  createObjectURL: function () { return 'blob:cahier'; },
  revokeObjectURL: function () {}
};
contexte.window.scrollTo = function () {};
contexte.window.print = function () { impressions++; };
contexte.window.confirm = function () { return true; };

/* Les mêmes fichiers, dans le même ordre que index.html. */
var ORDRE = require('./charger').tranche('application');
ORDRE.forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), contexte, { filename: f });
});

var CM2 = contexte.CM2;

/* ====================================================================== */
/* Le parcours                                                            */
/* ====================================================================== */

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

/** Fait ce que ferait un clic, et fait échouer la suite si personne n'écoute :
    un bouton sans écouteur est un bouton mort. */
function clic(id) {
  var n = document.getElementById(id).declencher('click');
  if (!n) { throw new Error('aucun écouteur sur « ' + id + ' »'); }
}

function ecranVisible() {
  var noms = ['cahiers', 'bureau', 'seance', 'bilan', 'progres', 'fiche', 'classe'];
  return noms.filter(function (e) {
    return document.getElementById('ecran-' + e).hidden === false;
  }).join(',');
}

function texte(id) { return document.getElementById(id).textContent; }

/** Une frappe au clavier, telle que la reçoit l'écouteur posé sur le document. */
function touche(cle) {
  var ecouteurs = document.ecouteurs.keydown || [];
  if (!ecouteurs.length) throw new Error('personne n\'écoute le clavier');
  var e = { key: cle, target: {}, preventDefault: function () {} };
  ecouteurs.forEach(function (fn) { fn(e); });
}

/** Le texte du bloc de correction, lignes rassemblées. */
function texteRetour() {
  return document.getElementById('retour').enfants.map(function (n) {
    return n.textContent;
  }).join(' | ');
}

function compterFeuilles(element) {
  var n = 1;
  element.enfants.forEach(function (e) { n += compterFeuilles(e); });
  return n;
}

console.log('\nDémarrage');
CM2.ui.initialiser();
verifier('la page s\'ouvre sur le choix du cahier', ecranVisible(), 'cahiers');
verifier('les mascottes sont proposées',
         document.getElementById('avatars').enfants.length, CM2.profil.avatars.length);
verifier('le numéro de version est écrit', texte('version'), 'v' + CM2.version.numero);

console.log('\nCréer un cahier');
document.getElementById('nom-nouveau').value = 'Zoé';
clic('creer');
verifier('on arrive sur le bureau', ecranVisible(), 'bureau');
verifier('le cahier existe', CM2.profil.actuel().nom, 'Zoé');
verifier('aucune question au compteur', texte('stat-questions'), 0);

console.log('\nUne série de cinq questions');
SELECTEURS['[data-nombre]'][0].declencher('click');      // 5
verifier('cinq questions sont choisies', CM2.ui.etat.nombre, 5);
SELECTEURS['[data-matiere]'][0].declencher('click');     // mathématiques
verifier('la séance démarre', ecranVisible(), 'seance');
verifier('la série compte cinq questions', CM2.ui.etat.serie.length, 5);
verifier('la marelle a cinq cases', document.getElementById('marelle').enfants.length, 5);

for (var q = 0; q < 5; q++) {
  var ex = CM2.ui.etat.exercice;
  if (ex.type === 'qcm') {
    // On répond juste une fois sur deux, pour alimenter les deux cas.
    var index = (q % 2 === 0) ? ex.bonne_reponse : (ex.bonne_reponse + 1) % ex.propositions.length;
    document.getElementById('reponses').enfants[index].declencher('click');
  } else {
    document.getElementById('saisie').value = (q % 2 === 0) ? String(ex.bonne_reponse) : 'n\'importe quoi';
    clic('valider');
  }
  verifier('question ' + (q + 1) + ' : la réponse est prise en compte', CM2.ui.etat.repondu, true);
  clic('suivant');
}

verifier('après la cinquième, le bilan s\'affiche', ecranVisible(), 'bilan');
verifier('le bilan porte cinq étoiles', document.getElementById('etoiles').enfants.length, 5);
verifier('les cinq questions sont comptées dans le cahier',
         CM2.profil.actuel().total.questions, 5);
verifier('la séance est enregistrée dans l\'historique',
         CM2.profil.actuel().seances.length, 1);
verifier('la série en cours est oubliée', CM2.profil.seanceEnCours(), null);

console.log('\nRépondre au clavier, et revoir ce qu\'on a tapé');
clic('retour-bureau');
SELECTEURS['[data-nombre]'][1].declencher('click');      // 10
SELECTEURS['[data-matiere]'][0].declencher('click');     // mathématiques

var vuQcm = false, vuSaisie = false;
while (!vuQcm || !vuSaisie) {
  if (document.getElementById('ecran-seance').hidden) {
    throw new Error('la série s\'est terminée sans montrer les deux sortes de questions');
  }
  var courant = CM2.ui.etat.exercice;

  if (courant.type === 'qcm' && !vuQcm) {
    vuQcm = true;
    var propositions = document.getElementById('reponses').enfants;
    verifier('chaque proposition porte le numéro de sa touche',
             propositions.map(function (b) { return b.getAttribute('data-touche'); }),
             propositions.map(function (b, i) { return String(i + 1); }));
    var mauvaise = (courant.bonne_reponse + 1) % courant.propositions.length;
    touche(String(mauvaise + 1));
    verifier('la touche ' + (mauvaise + 1) + ' répond à la question', CM2.ui.etat.repondu, true);
    verifier('la proposition choisie au clavier est marquée fausse',
             propositions[mauvaise].classList.contains('faux'), true);
    verifier('la bonne réponse est montrée quand même',
             propositions[courant.bonne_reponse].classList.contains('juste'), true);

  } else if (courant.type === 'saisie' && !vuSaisie) {
    vuSaisie = true;
    // Une réponse qu'aucune question de mathématiques n'attend, et entourée
    // d'espaces : on vérifie du même coup qu'elle est remontrée propre.
    document.getElementById('saisie').value = '  douze  ';
    clic('valider');
    verifier('ce qui a été tapé est remontré tel quel',
             /Tu as écrit : douze/.test(texteRetour()), true);
    verifier('… avec la bonne réponse à côté',
             /La bonne réponse/.test(texteRetour()), true);

  } else {
    // Une question de la sorte déjà vue : on répond juste, pour avancer.
    if (courant.type === 'qcm') {
      document.getElementById('reponses').enfants[courant.bonne_reponse].declencher('click');
    } else {
      document.getElementById('saisie').value = String(courant.bonne_reponse);
      clic('valider');
    }
  }
  clic('suivant');
}

// La série n'est pas allée à son terme : on la laisse en plan, sans la compter.
clic('abandonner');
verifier('on revient au bureau', ecranVisible(), 'bureau');

console.log('\nLa progression');
clic('voir-progres');
verifier('l\'écran de progression s\'affiche', ecranVisible(), 'progres');
verifier('des domaines sont listés',
         document.getElementById('progres-domaines').enfants.length > 4, true);
verifier('le résumé est écrit', texte('progres-resume').length > 40, true);
verifier('l\'histogramme a six colonnes',
         document.getElementById('progres-histo').enfants.length, 6);
verifier('la légende a six semaines',
         document.getElementById('progres-histo-legende').enfants.length, 6);
verifier('la couverture du programme est écrite',
         /objectifs du programme/.test(texte('progres-couverture')), true);
verifier('la note sur le double comptage est là',
         /deux domaines/.test(texte('progres-note')), true);
clic('progres-retour');
verifier('on revient au bureau', ecranVisible(), 'bureau');

console.log('\nLa fiche à imprimer');
clic('voir-fiche');
verifier('l\'écran de fiche s\'affiche', ecranVisible(), 'fiche');
var apercu = document.getElementById('fiche-apercu');
verifier('la fiche est dessinée', apercu.enfants.length, 3);   // tête, exercices, corrigé
verifier('elle contient vingt exercices', apercu.enfants[1].enfants.length, 20);
verifier('le corrigé contient vingt réponses',
         apercu.enfants[2].enfants[2].enfants.length, 20);

var reference = CM2.ui.etat.ficheReference;
verifier('la référence de la fiche est lisible', /^[0-9A-Z]+-M20$/.test(reference), true);

var avant = CM2.ui.etat.ficheGraine;
clic('fiche-autre');
verifier('« une autre fiche » change de fiche', CM2.ui.etat.ficheGraine !== avant, true);

SELECTEURS['[data-fiche-nombre]'][0].declencher('click');  // 5
verifier('on peut demander cinq exercices', CM2.ui.etat.ficheNombre, 5);
verifier('la fiche en contient cinq',
         document.getElementById('fiche-apercu').enfants[1].enfants.length, 5);

SELECTEURS['[data-fiche-matiere]'][1].declencher('click');  // français
verifier('on peut changer de matière', CM2.ui.etat.ficheMatiere, 'francais');
verifier('la fiche de français se dessine',
         compterFeuilles(document.getElementById('fiche-apercu')) > 30, true);

SELECTEURS['[data-fiche-matiere]'][2].declencher('click');  // EMC
verifier('la fiche d\'EMC se dessine aussi',
         compterFeuilles(document.getElementById('fiche-apercu')) > 30, true);
SELECTEURS['[data-fiche-matiere]'][3].declencher('click');  // tout
verifier('la fiche « tout » se dessine aussi',
         compterFeuilles(document.getElementById('fiche-apercu')) > 30, true);

// Retrouver une fiche par la référence recopiée sur le papier.
SELECTEURS['[data-fiche-matiere]'][0].declencher('click');   // retour aux maths
SELECTEURS['[data-fiche-nombre]'][3].declencher('click');    // 20
var aRetrouver = CM2.ui.etat.ficheReference;
clic('fiche-autre');
verifier('on a bien changé de fiche entre-temps',
         CM2.ui.etat.ficheReference !== aRetrouver, true);
document.getElementById('fiche-reference').value = aRetrouver.toLowerCase();
clic('fiche-refaire');
verifier('la référence recopiée redonne la même fiche',
         CM2.ui.etat.ficheReference, aRetrouver);
verifier('et le message le confirme',
         /à l’identique/.test(texte('fiche-message')), true);

document.getElementById('fiche-reference').value = 'n\'importe quoi';
clic('fiche-refaire');
verifier('une référence illisible est signalée, pas avalée',
         /pas lisible/.test(texte('fiche-message')), true);
verifier('… et la fiche affichée n\'a pas changé',
         CM2.ui.etat.ficheReference, aRetrouver);

clic('fiche-imprimer');
verifier('le bouton imprimer appelle l\'impression', impressions, 1);
clic('fiche-retour');
verifier('on revient au bureau', ecranVisible(), 'bureau');

console.log('\nLa fenêtre « à propos » et les erreurs à revoir');
clic('ouvrir-infos');
verifier('le journal des versions est rempli',
         document.getElementById('infos-versions').enfants.length,
         CM2.version.historique.length);
clic('fermer-infos');

var echus = CM2.progression.aReviser();
verifier('des exercices ratés attendent une révision', echus.length > 0, true);
clic('revoir-erreurs');
verifier('la série des erreurs démarre', ecranVisible(), 'seance');
verifier('elle ne contient que des exercices dus',
         CM2.ui.etat.serie.length <= echus.length, true);
clic('abandonner');
verifier('« arrêter » ramène au bureau', ecranVisible(), 'bureau');
verifier('la série arrêtée est gardée, mais en pause',
         CM2.profil.seanceEnCours().enPause, true);

console.log('\nLes sujets laissés au choix du professeur');
var optionnels = CM2.registre.optionnels();
verifier('le programme en déclare quelques-uns', optionnels.length > 0, true);
verifier('aucun n\'est coché au départ',
         optionnels.filter(function (s) { return CM2.profil.sujetEtudie(s.id); }).length, 0);

// Une série de la matière concernée ne doit contenir aucun sujet non coché.
function serieContientOptionnel(matiere) {
  var serie = CM2.progression.choisirSerie(matiere, 20);
  return serie.filter(function (e) {
    var spec = CM2.registre.get(e.id);
    return spec && spec.optionnel && !CM2.profil.sujetEtudie(spec.id);
  }).length;
}
verifier('une série ne sert aucun sujet non coché',
         serieContientOptionnel(optionnels[0].matiere), 0);
verifier('une fiche non plus',
         CM2.fiche.composer(optionnels[0].matiere, 20).exercices.filter(function (ex) {
           var spec = CM2.registre.get(ex.generateur_id);
           return spec && spec.optionnel;
         }).length, 0);

clic('retour-bureau');
verifier('le bureau propose de les cocher',
         document.getElementById('bloc-sujets-choix').hidden, false);
verifier('il y a un bouton par sujet',
         document.getElementById('liste-sujets-choix').enfants.length, optionnels.length);
verifier('le texte dit qu\'aucun n\'est coché',
         /Aucun sujet coché/.test(texte('texte-sujets-choix')), true);

document.getElementById('liste-sujets-choix').enfants[0].declencher('click');
verifier('cocher un sujet le retient dans le cahier',
         CM2.profil.sujetEtudie(optionnels[0].id), true);
verifier('le bouton se marque actif',
         document.getElementById('liste-sujets-choix').enfants[0].getAttribute('aria-pressed'),
         'true');
verifier('le sujet coché peut désormais être servi',
         CM2.progression.servable(optionnels[0]), true);
verifier('les autres restent en dehors',
         CM2.progression.servable(optionnels[1]), false);

document.getElementById('liste-sujets-choix').enfants[0].declencher('click');
verifier('décocher le retire de nouveau',
         CM2.profil.sujetEtudie(optionnels[0].id), false);

console.log('\nLe confort de lecture');
clic('confort-grand');
verifier('le texte plus grand s\'applique à la page',
         document.body.classList.contains('lecture-grande'), true);
verifier('le bouton se marque actif',
         document.getElementById('confort-grand').getAttribute('aria-pressed'), 'true');
verifier('le cahier s\'en souvient', CM2.profil.confort().grand, true);
clic('confort-aere');
verifier('le texte plus aéré aussi',
         document.body.classList.contains('lecture-aeree'), true);
clic('confort-grand');
verifier('un second appui revient en arrière',
         document.body.classList.contains('lecture-grande'), false);
verifier('… sans toucher à l\'autre réglage',
         document.body.classList.contains('lecture-aeree'), true);

console.log('\nLe rappel de sauvegarde');
verifier('rien à rappeler après une seule séance',
         CM2.profil.rappelSauvegarde().besoin, false);
while (CM2.profil.rappelSauvegarde().seances < CM2.profil.seancesAvantRappel) {
  CM2.profil.terminerSeance('mathematiques', 5, 5);
}
clic('retour-bureau');
verifier('le rappel s\'affiche au bureau',
         document.getElementById('bloc-sauvegarde').hidden, false);
verifier('il dit combien de séances sont en jeu',
         /5 séances/.test(texte('texte-sauvegarde')), true);
verifier('et qu\'aucune sauvegarde n\'a jamais été faite',
         /jamais/.test(texte('texte-sauvegarde')), true);

clic('sauvegarder-maintenant');
verifier('le cahier s\'écrit dans un fichier',
         /Cahier enregistré/.test(SELECTEURS['.message-cahier'][0].textContent), true);
verifier('le compteur de séances non sauvegardées repart de zéro',
         CM2.profil.rappelSauvegarde().seances, 0);
verifier('le rappel disparaît',
         document.getElementById('bloc-sauvegarde').hidden, true);
verifier('la date de sauvegarde est retenue',
         CM2.profil.rappelSauvegarde().depuis, CM2.profil.aujourdhui());

console.log('\nLa vue enseignant');
clic('voir-classe');
verifier('l\'écran enseignant s\'affiche', ecranVisible(), 'classe');
verifier('le tableau des cahiers est visible',
         document.getElementById('classe-tableau').hidden, false);
verifier('il contient une ligne par cahier',
         document.getElementById('classe-lignes').enfants.length, CM2.profil.liste().length);
verifier('le résumé est écrit', texte('classe-resume').length > 30, true);
verifier('les domaines de la classe sont dessinés',
         document.getElementById('classe-domaines').enfants.length > 0, true);

// Le nom de l'enfant est un bouton, dans la première cellule de sa ligne.
var premiereLigne = document.getElementById('classe-lignes').enfants[0];
premiereLigne.enfants[0].enfants[0].declencher('click');
verifier('le détail de l\'enfant s\'ouvre',
         document.getElementById('classe-detail').hidden, false);
verifier('son nom est écrit', /Zoé/.test(texte('classe-detail-titre')), true);
verifier('son histogramme a six semaines',
         document.getElementById('classe-histo').enfants.length, 6);
clic('classe-detail-fermer');
verifier('le détail se referme',
         document.getElementById('classe-detail').hidden, true);

verifier('la vue enseignant ne change pas le cahier ouvert',
         CM2.profil.actuel().nom, 'Zoé');
clic('classe-imprimer');
verifier('la vue peut s\'imprimer', impressions, 2);
clic('classe-retour');
verifier('on revient au bureau, puisqu\'un cahier est ouvert', ecranVisible(), 'bureau');

console.log('\nLe clavier, dans les cas tordus');
SELECTEURS['[data-nombre]'][0].declencher('click');       // 5
SELECTEURS['[data-matiere]'][2].declencher('click');      // EMC : toujours des QCM
verifier('une série d\'EMC démarre', ecranVisible(), 'seance');
var qcm = CM2.ui.etat.exercice;
verifier('c\'est bien une question à choix', qcm.type, 'qcm');
touche(String(qcm.propositions.length + 1));
verifier('une touche au-delà des propositions ne répond pas', CM2.ui.etat.repondu, false);
touche('0');
verifier('la touche 0 non plus', CM2.ui.etat.repondu, false);
touche(String(qcm.bonne_reponse + 1));
verifier('la bonne touche répond', CM2.ui.etat.repondu, true);
// La réponse donnée était juste : après elle, aucune frappe ne doit pouvoir
// marquer une proposition comme fausse.
touche(String(((qcm.bonne_reponse + 1) % qcm.propositions.length) + 1));
verifier('une frappe après la réponse ne marque rien de plus',
         document.getElementById('reponses').enfants.filter(function (b) {
           return b.classList.contains('faux');
         }).length, 0);
clic('abandonner');

console.log('\nLa vue enseignant quand il n\'y a plus rien');
CM2.profil.liste().forEach(function (c) { CM2.profil.supprimer(c.nom); });
clic('voir-classe');
verifier('l\'écran s\'affiche quand même', ecranVisible(), 'classe');
verifier('le tableau est masqué', document.getElementById('classe-tableau').hidden, true);
verifier('le texte explique quoi faire',
         /Aucun cahier/.test(texte('classe-resume')), true);
verifier('aucun détail n\'est ouvert', document.getElementById('classe-detail').hidden, true);
verifier('les domaines annoncent leur vide',
         document.getElementById('classe-domaines-vide').hidden, false);
clic('classe-retour');
verifier('sans cahier ouvert, le retour ramène à l\'accueil', ecranVisible(), 'cahiers');

/* La règle de sécurité du contenu (CSP) de index.html n'autorise un script en
   ligne que par son empreinte. Changer ce script sans refaire l'empreinte
   ferait une page qui ne démarre plus — et rien ne le dirait avant d'ouvrir le
   navigateur. L'empreinte de chaque script en ligne est donc recalculée ici. */
console.log('\nLa règle de sécurité du contenu');
var csp = /<meta http-equiv="Content-Security-Policy"\s+content="([^"]+)"/.exec(PAGE);
verifier('index.html déclare une règle', !!csp, true);
var enLigne = [], reScript = /<script>([\s\S]*?)<\/script>/g, ms;
while ((ms = reScript.exec(PAGE))) enLigne.push(ms[1]);
verifier('il y a un seul script en ligne', enLigne.length, 1);
enLigne.forEach(function (source) {
  var empreinte = require('crypto').createHash('sha256').update(source, 'utf8').digest('base64');
  verifier('l\'empreinte du script en ligne figure dans la règle',
           csp ? csp[1].indexOf("'sha256-" + empreinte + "'") !== -1 : false, true);
});
verifier('aucun script n\'est chargé depuis le réseau',
         require('./charger').scriptsDe('index.html').every(function (s) { return !/^[a-z]+:|^\/\//.test(s); }),
         true);


/* tests.html suit la même règle, sans empreinte : son script est dans un
   fichier à part. Un script en ligne qu'on y remettrait ne s'exécuterait plus,
   et la page resterait blanche sans rien dire. */
var PAGE_TESTS = fs.readFileSync(path.join(racine, 'tests.html'), 'utf8');
var cspTests = /<meta http-equiv="Content-Security-Policy"\s+content="([^"]+)"/.exec(PAGE_TESTS);
verifier('tests.html déclare une règle', !!cspTests, true);
verifier('… qui n\'autorise que les scripts du projet',
         cspTests ? /script-src 'self';/.test(cspTests[1]) : false, true);
verifier('tests.html n\'a aucun script en ligne', /<script>/.test(PAGE_TESTS), false);
verifier('tests.html n\'a aucun gestionnaire en attribut', /\son[a-z]+\s*=/i.test(PAGE_TESTS), false);
verifier('tests.html charge son script',
         require('./charger').scriptsDe('tests.html').indexOf('tests/page.js') !== -1, true);
verifier('… et aucun depuis le réseau',
         require('./charger').scriptsDe('tests.html').every(function (s) { return !/^[a-z]+:|^\/\//.test(s); }),
         true);
verifier('le script de la page n\'écrit pas de HTML',
         /innerHTML|insertAdjacentHTML|document\.write/.test(
           fs.readFileSync(path.join(racine, 'tests/page.js'), 'utf8')), false);

console.log('\n' + (total - echecs) + ' vérifications réussies sur ' + total + '.');
process.exit(echecs ? 1 : 0);
