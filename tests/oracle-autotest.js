/* L'oracle attrape-t-il vraiment une erreur ?
       node tests/oracle-autotest.js

   Un oracle qui dit toujours « c'est juste » est pire qu'inutile : il donne une
   confiance imméritée. Ce fichier lui soumet donc des exercices fabriqués à la
   main — des justes, et des faux dont on connaît le défaut — et vérifie qu'il
   rend le bon verdict dans les deux sens.

   Aucun générateur n'est chargé ici : on teste l'oracle, pas l'application. */
'use strict';

var ORACLE = require('./oracle-moteur.js').ORACLE;

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

/** Soumet un exercice fabriqué et ne garde que l'état du verdict. */
function etat(id, enonce, reponse, propositions, bonne) {
  var ex = propositions
    ? { enonce: enonce, type: 'qcm', propositions: propositions, bonne_reponse: bonne }
    : { enonce: enonce, type: 'saisie', bonne_reponse: reponse };
  return ORACLE.examiner(id, ex).etat;
}

/* --- Les briques de lecture ------------------------------------------- */

console.log('\nLecture des nombres, des expressions, des numéraux, des durées');
verifier('« 1 234,5 » est lu exactement', ORACLE.ecrire(ORACLE.lireNombre('1 234,5')), '1234.5 (2469/2)');
verifier('« 12 h » n\'est pas un nombre', ORACLE.lireNombre('12 h'), null);
verifier('(10 + 11) × (7 + 2) = 189', ORACLE.ecrire(ORACLE.evaluer('(10 + 11) × (7 + 2)')), '189');
verifier('747 ÷ 8 est exact, sans flottant', ORACLE.ecrire(ORACLE.evaluer('747 ÷ 8')), '93.375 (747/8)');
verifier('8 + 691/1000 vaut 8,691', ORACLE.ecrire(ORACLE.evaluer('8 + 691/1000')), '8.691 (8691/1000)');
verifier('une expression bancale est refusée', ORACLE.evaluer('8 + × 2'), null);
verifier('quatre-vingt-quinze-mille-trois', ORACLE.lireNumeral('quatre-vingt-quinze-mille-trois'), 95003);
verifier('sept-cent-quatre-vingt-dix-neuf', ORACLE.lireNumeral('sept-cent-quatre-vingt-dix-neuf'), 799);
verifier('cinq-cent-soixante-cinq-mille-six-cent-cinquante-et-un',
         ORACLE.lireNumeral('cinq-cent-soixante-cinq-mille-six-cent-cinquante-et-un'), 565651);
verifier('un mot qui n\'est pas un nombre', ORACLE.lireNumeral('septante-deux'), null);
verifier('« 3 h 50 » fait 230 minutes', ORACLE.lireDuree('3 h 50'), 230);
verifier('« 45 min » fait 45 minutes', ORACLE.lireDuree('45 min'), 45);

/* --- Une réponse juste est reconnue juste ----------------------------- */

console.log('\nDes exercices justes doivent passer');
verifier('un calcul juste',
  etat('ope.parentheses', 'Calcule (8 + 6) × (5 + 4).', '126'), 'verifie');
verifier('une division exacte juste',
  etat('ope.division_dividende_entier', 'Pose et effectue : 747 ÷ 8.', '93,375'), 'verifie');
verifier('une durée juste',
  etat('mes.duree_ecoulee',
       'Un film commence à 15 h 49 et se termine à 19 h 39. Combien de temps a-t-il duré ? ' +
       '(Réponds sous la forme « 2 h 15 ».)', '3 h 50'), 'verifie');
verifier('un encadrement juste',
  etat('ent.encadrer', 'Entre quelles dizaines de mille consécutives se trouve 829 411 ?',
       '820 000 et 830 000'), 'verifie');
verifier('un chiffre de rang juste',
  etat('ent.chiffre_position', 'Dans le nombre 86 804 317, quel est le chiffre des centaines de mille ?',
       '8'), 'verifie');
verifier('un nombre écrit en lettres, juste',
  etat('ent.chiffres_vers_lettres', 'Comment s\'écrit 795 399 en toutes lettres ?',
       'sept-cent-quatre-vingt-quinze-mille-trois-cent-quatre-vingt-dix-neuf'), 'verifie');
verifier('une comparaison juste',
  etat('ent.comparer', 'Complète avec le signe < ou > : 4 383 148 … 4 383 147', '>'), 'verifie');
verifier('un QCM à une seule bonne réponse',
  etat('ent.diviseur_parmi', 'Parmi ces nombres, lequel est un diviseur de 85 ?',
       null, ['4', '17', '6', '9'], 1), 'verifie');
verifier('une fraction réécrite sans changer de valeur',
  etat('fra.vers_mixte', 'Écris 68/12 sous la forme d\'un entier plus une fraction inférieure à 1. ' +
       '(Réponds sous la forme « 3 + 2/5 ».)', '5 + 8/12'), 'verifie');
verifier('un empilement de cubes bien compté',
  etat('pb.assemblage_cubes', 'On empile des cubes identiques pour former un gros pavé de 5 cubes ' +
       'de long, 3 cubes de large et 4 cubes de haut. Combien de cubes faut-il en tout ?',
       '60'), 'verifie');
verifier('la couche du bas, comptée sans la hauteur',
  etat('pb.assemblage_cubes', 'Un pavé est construit avec des cubes identiques : 5 cubes de long, ' +
       '3 cubes de large et 4 cubes de haut. Combien de cubes touchent la table ?',
       '15'), 'verifie');
verifier('les cubes qui manquent pour finir',
  etat('pb.assemblage_cubes', 'On veut construire un pavé de 5 cubes de long, 3 cubes de large et ' +
       '4 cubes de haut. 1 couche est déjà posée. Combien de cubes manque-t-il pour finir ?',
       '45'), 'verifie');

/* --- Une réponse fausse doit être attrapée ---------------------------- */

console.log('\nDes exercices faux doivent être attrapés');
verifier('une parenthèse oubliée dans le résultat',
  etat('ope.parentheses', 'Calcule (8 + 6) × (5 + 4).', '38'), 'faux');
verifier('un arrondi au lieu du quotient exact',
  etat('ope.division_dividende_entier', 'Pose et effectue : 747 ÷ 8.', '93,38'), 'faux');
verifier('une minute de trop dans la durée',
  etat('mes.duree_ecoulee',
       'Un film commence à 15 h 49 et se termine à 19 h 39. Combien de temps a-t-il duré ?',
       '3 h 51'), 'faux');
verifier('le mauvais côté de l\'encadrement',
  etat('ent.encadrer', 'Entre quelles dizaines de mille consécutives se trouve 829 411 ?',
       '830 000 et 840 000'), 'faux');
verifier('le chiffre du rang voisin',
  etat('ent.chiffre_position', 'Dans le nombre 86 804 317, quel est le chiffre des centaines de mille ?',
       '0'), 'faux');
verifier('un numéral mal écrit',
  etat('ent.chiffres_vers_lettres', 'Comment s\'écrit 795 399 en toutes lettres ?',
       'sept-cent-quatre-vingt-quinze-mille-trois-cent-quatre-vingt-neuf'), 'faux');
verifier('le signe de comparaison retourné',
  etat('ent.comparer', 'Complète avec le signe < ou > : 4 383 148 … 4 383 147', '<'), 'faux');
verifier('un QCM dont un leurre est aussi juste',
  etat('ent.diviseur_parmi', 'Parmi ces nombres, lequel est un diviseur de 85 ?',
       null, ['5', '17', '6', '9'], 1), 'faux');
verifier('un QCM dont la bonne place est mal notée',
  etat('ent.diviseur_parmi', 'Parmi ces nombres, lequel est un diviseur de 85 ?',
       null, ['4', '17', '6', '9'], 2), 'faux');
verifier('une fraction réécrite en changeant de valeur',
  etat('fra.vers_mixte', 'Écris 68/12 sous la forme d\'un entier plus une fraction inférieure à 1.',
       '5 + 7/12'), 'faux');
verifier('un empilement compté comme une seule couche',
  etat('pb.assemblage_cubes', 'On empile des cubes identiques pour former un gros pavé de 5 cubes ' +
       'de long, 3 cubes de large et 4 cubes de haut. Combien de cubes faut-il en tout ?',
       '15'), 'faux');
verifier('la hauteur comptée dans la couche du bas',
  etat('pb.assemblage_cubes', 'Un pavé est construit avec des cubes identiques : 5 cubes de long, ' +
       '3 cubes de large et 4 cubes de haut. Combien de cubes touchent la table ?',
       '60'), 'faux');
verifier('les couches restantes comptées à l\'envers',
  etat('pb.assemblage_cubes', 'On veut construire un pavé de 5 cubes de long, 3 cubes de large et ' +
       '4 cubes de haut. 1 couche est déjà posée. Combien de cubes manque-t-il pour finir ?',
       '15'), 'faux');
verifier('une réponse illisible ne passe pas pour juste',
  etat('ope.parentheses', 'Calcule (8 + 6) × (5 + 4).', 'cent vingt-six'), 'faux');

/* --- Un énoncé qui a changé de forme doit se signaler ----------------- */

console.log('\nUn énoncé qui ne correspond plus à sa règle doit se signaler');
verifier('énoncé reformulé : non reconnu, pas « juste »',
  etat('ope.parentheses', 'Effectue le calcul suivant : (8 + 6) × (5 + 4)', '126'), 'inconnu');
verifier('rang inventé : non reconnu',
  etat('ent.chiffre_position', 'Dans le nombre 86 804 317, quel est le chiffre des myriades ?',
       '8'), 'inconnu');
verifier('un générateur sans règle est annoncé comme tel',
  etat('hor.lire_heure', 'Quelle heure indique cette horloge ?', '4 h 25'), 'sansRegle');

console.log('\n' + (total - echecs) + ' vérifications réussies sur ' + total + '.');
process.exit(echecs ? 1 : 0);
