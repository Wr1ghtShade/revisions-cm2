/* Calcul mental. Référentiel : mat.nc.calcul_mental.

   Aucun de ces exercices ne doit demander de poser l'opération : ce sont des
   procédures mentales. Les nombres sont donc choisis pour que la procédure visée
   soit réellement praticable de tête.

   Les décimaux sont manipulés en millièmes entiers (voir maths-decimaux.js). */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;

  function aff(millemes) { return F.decimal(millemes / 1000); }

  /* --- Faits numériques ---------------------------------------------- */

  reg.ajouter({
    id: 'cm.faits_usuels',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.faits.01'],
    titre: 'Faits numériques usuels',
    generer: function (r) {
      var cas = r.entier(1, 4);
      var a, b, enonce, reponse, explication;

      if (cas === 1) {          // table de multiplication
        a = r.entier(2, 9);
        b = r.entier(2, 9);
        reponse = a * b;
        enonce = 'Calcule ' + a + ' × ' + b + '.';
        explication = a + ' × ' + b + ' = ' + reponse + '.';
      } else if (cas === 2) {   // complément à 100
        a = r.entier(11, 89);
        reponse = 100 - a;
        enonce = 'Combien faut-il ajouter à ' + a + ' pour obtenir 100 ?';
        explication = a + ' + ' + reponse + ' = 100.';
      } else if (cas === 3) {   // complément à 1000 par centaines entières
        a = r.entier(1, 9) * 100 + r.entier(1, 9) * 10;
        reponse = 1000 - a;
        enonce = 'Combien faut-il ajouter à ' + F.entier(a) + ' pour obtenir 1 000 ?';
        explication = F.entier(a) + ' + ' + F.entier(reponse) + ' = 1 000.';
      } else {                  // double d'un entier
        a = r.entier(11, 99);
        reponse = a * 2;
        enonce = 'Quel est le double de ' + a + ' ?';
        explication = 'Le double de ' + a + ' est ' + a + ' + ' + a + ' = ' + reponse + '.';
      }

      return { enonce: enonce, type: 'saisie', bonne_reponse: String(reponse), explication: explication };
    }
  });

  reg.ajouter({
    id: 'cm.moitie_impair',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.faits.02'],
    titre: 'Moitié d\'un nombre impair',
    generer: function (r) {
      var n = r.choix([3, 5, 7, 9, 11, 13, 15]);
      var m = n * 500;   // n/2 en millièmes

      return {
        enonce: 'Quelle est la moitié de ' + n + ' ?',
        type: 'saisie',
        bonne_reponse: aff(m),
        explication: n + ' = ' + (n - 1) + ' + 1. La moitié de ' + (n - 1) + ' est ' + ((n - 1) / 2) +
          ', et la moitié de 1 est 0,5 : la moitié de ' + n + ' est donc ' + aff(m) + '.'
      };
    }
  });

  var FRACTIONS_USUELLES = [
    { f: '1/2', dec: 500, moitieDe: null },
    { f: '1/4', dec: 250 },
    { f: '3/4', dec: 750 },
    { f: '1/5', dec: 200 },
    { f: '2/5', dec: 400 },
    { f: '3/5', dec: 600 },
    { f: '4/5', dec: 800 },
    { f: '1/10', dec: 100 },
    { f: '3/10', dec: 300 },
    { f: '7/10', dec: 700 },
    { f: '1/100', dec: 10 },
    { f: '5/100', dec: 50 }
  ];

  reg.ajouter({
    id: 'cm.fraction_vers_decimal',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.faits.04'],
    titre: 'Écriture décimale des fractions usuelles',
    generer: function (r) {
      var item = r.choix(FRACTIONS_USUELLES);
      return {
        enonce: 'Écris ' + item.f + ' sous forme décimale.',
        type: 'saisie',
        bonne_reponse: aff(item.dec),
        explication: item.f + ' = ' + aff(item.dec) + '. C\'est un résultat à connaître par cœur.'
      };
    }
  });

  var RELATIONS_FRACTIONS = [
    { question: 'Combien de quarts font un demi ?', reponse: '2', explication: '1/4 + 1/4 = 2/4 = 1/2.' },
    { question: 'Combien de quarts font un entier ?', reponse: '4', explication: '4/4 = 1.' },
    { question: 'Combien de demis font un entier ?', reponse: '2', explication: '2/2 = 1.' },
    { question: 'Combien de dixièmes font un demi ?', reponse: '5', explication: '5/10 = 1/2.' },
    { question: 'Combien de dixièmes font un cinquième ?', reponse: '2', explication: '2/10 = 1/5.' },
    { question: 'Combien de centièmes font un dixième ?', reponse: '10', explication: '10/100 = 1/10.' },
    { question: 'Combien de huitièmes font un quart ?', reponse: '2', explication: '2/8 = 1/4.' },
    { question: 'Combien de sixièmes font un tiers ?', reponse: '2', explication: '2/6 = 1/3.' },
    { question: 'Combien de tiers font un entier ?', reponse: '3', explication: '3/3 = 1.' },
    { question: 'Combien de cinquièmes font un entier ?', reponse: '5', explication: '5/5 = 1.' }
  ];

  reg.ajouter({
    id: 'cm.relations_fractions',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.faits.03'],
    titre: 'Relations entre fractions usuelles',
    generer: function (r) {
      var item = r.choix(RELATIONS_FRACTIONS);
      return {
        enonce: item.question,
        type: 'saisie',
        bonne_reponse: item.reponse,
        explication: item.explication
      };
    }
  });

  /* --- Numération ----------------------------------------------------- */

  reg.ajouter({
    id: 'cm.entier_plus_decimal',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.numeration.01', 'mat.nc.calcul_mental.numeration.02'],
    titre: 'Ajouter un entier à un décimal',
    generer: function (r) {
      var partieDec = r.entier(1, 99) * 10;      // centièmes, en millièmes
      var entiere = r.entier(1, 40);
      var d = entiere * 1000 + partieDec;
      var k = r.entier(2, 60);
      var soustraction = r.chance(0.4) && entiere > k;

      var resultat = soustraction ? d - k * 1000 : d + k * 1000;

      return {
        enonce: 'Calcule de tête : ' + aff(d) + (soustraction ? ' − ' : ' + ') + k + '.',
        type: 'saisie',
        bonne_reponse: aff(resultat),
        explication: 'On n\'ajoute (ou n\'enlève) que des unités : la partie décimale ne bouge pas. ' +
          Math.floor(d / 1000) + (soustraction ? ' − ' : ' + ') + k + ' = ' +
          Math.floor(resultat / 1000) + ', donc le résultat est ' + aff(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.multiplier_puissance_dix',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.numeration.03'],
    titre: 'Multiplier un décimal par 10, 100 ou 1 000',
    generer: function (r) {
      var m = r.entier(1, 9999);                  // millièmes
      var facteur = r.choix([10, 100, 1000]);
      var resultat = m * facteur;
      var rangs = { 10: 1, 100: 2, 1000: 3 }[facteur];

      return {
        enonce: 'Calcule ' + aff(m) + ' × ' + F.entier(facteur) + '.',
        type: 'saisie',
        bonne_reponse: aff(resultat),
        explication: 'Multiplier par ' + F.entier(facteur) + ' décale chaque chiffre de ' + rangs +
          ' rang' + (rangs > 1 ? 's' : '') + ' vers la gauche : ' + aff(m) + ' × ' +
          F.entier(facteur) + ' = ' + aff(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.diviser_puissance_dix',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.numeration.04'],
    titre: 'Diviser un décimal par 10, 100 ou 1 000',
    generer: function (r) {
      var facteur = r.choix([10, 100, 1000]);
      // On part du résultat pour rester au millième près.
      var resultat = r.entier(1, 9999);
      var m = resultat * facteur;
      var rangs = { 10: 1, 100: 2, 1000: 3 }[facteur];

      return {
        enonce: 'Calcule ' + aff(m) + ' ÷ ' + F.entier(facteur) + '.',
        type: 'saisie',
        bonne_reponse: aff(resultat),
        explication: 'Diviser par ' + F.entier(facteur) + ' décale chaque chiffre de ' + rangs +
          ' rang' + (rangs > 1 ? 's' : '') + ' vers la droite : ' + aff(m) + ' ÷ ' +
          F.entier(facteur) + ' = ' + aff(resultat) + '.'
      };
    }
  });

  /* --- Procédures ----------------------------------------------------- */

  reg.ajouter({
    id: 'cm.somme_decimaux',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.01'],
    titre: 'Additionner deux décimaux',
    generer: function (r) {
      var a = r.entier(1, 9) * 1000 + r.entier(1, 9) * 100;
      var b = r.entier(1, 9) * 1000 + r.entier(1, 9) * 100;
      var s = a + b;

      return {
        enonce: 'Calcule de tête : ' + aff(a) + ' + ' + aff(b) + '.',
        type: 'saisie',
        bonne_reponse: aff(s),
        explication: 'On ajoute les unités entre elles, puis les dixièmes : ' +
          aff(a) + ' + ' + aff(b) + ' = ' + aff(s) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.ajouter_presque_dizaine',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.02'],
    titre: 'Ajouter ou retrancher 9, 19, 29…',
    generer: function (r) {
      var dizaines = r.entier(0, 9);
      var unite = r.choix([8, 9]);
      var k = dizaines * 10 + unite;          // 8, 9, 18, 19, …, 98, 99
      if (k < 8) k = 9;

      var arrondi = k + (10 - unite);         // la dizaine juste au-dessus
      var ajuste = 10 - unite;                // 1 ou 2

      var n = r.entier(120, 900);
      var addition = r.chance();
      var resultat = addition ? n + k : n - k;

      return {
        enonce: 'Calcule de tête : ' + F.entier(n) + (addition ? ' + ' : ' − ') + k + '.',
        type: 'saisie',
        bonne_reponse: String(resultat),
        explication: k + ' = ' + arrondi + ' − ' + ajuste + '. On ' +
          (addition ? 'ajoute ' + arrondi + ' puis on retire ' + ajuste
                    : 'retire ' + arrondi + ' puis on rajoute ' + ajuste) +
          ' : ' + F.entier(n) + (addition ? ' + ' : ' − ') + arrondi +
          (addition ? ' − ' : ' + ') + ajuste + ' = ' + F.entier(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.multiplier_dizaines',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.03'],
    titre: 'Multiplier par des dizaines, centaines, milliers',
    generer: function (r) {
      var a = r.entier(2, 9);
      var b = r.entier(2, 9);
      var puissance = r.choix([10, 100, 1000]);
      var nom = { 10: 'dizaines', 100: 'centaines', 1000: 'milliers' }[puissance];
      var resultat = a * b * puissance;

      return {
        enonce: 'Calcule ' + a + ' × ' + F.entier(b * puissance) + '.',
        type: 'saisie',
        bonne_reponse: String(resultat),
        explication: F.entier(b * puissance) + ', c\'est ' + b + ' ' + nom + '. ' +
          a + ' × ' + b + ' = ' + (a * b) + ', donc le résultat vaut ' + (a * b) + ' ' + nom +
          ', soit ' + F.entier(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.distributivite',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.04'],
    titre: 'Décomposer pour multiplier',
    generer: function (r) {
      var a = r.entier(3, 9);
      var b = r.entier(11, 29);
      var dizaines = Math.floor(b / 10) * 10;
      var unites = b % 10;
      var resultat = a * b;

      return {
        enonce: 'Calcule de tête : ' + a + ' × ' + b + '.',
        type: 'saisie',
        bonne_reponse: String(resultat),
        explication: b + ' = ' + dizaines + ' + ' + unites + '. Donc ' + a + ' × ' + b + ' = ' +
          a + ' × ' + dizaines + ' + ' + a + ' × ' + unites + ' = ' +
          (a * dizaines) + ' + ' + (a * unites) + ' = ' + F.entier(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.double_decimal',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.05'],
    titre: 'Double d\'un décimal',
    generer: function (r) {
      var m = r.entier(1, 40) * 1000 + r.choix([250, 500, 750, 100, 200, 300, 400, 600, 800]);
      var resultat = m * 2;

      return {
        enonce: 'Quel est le double de ' + aff(m) + ' ?',
        type: 'saisie',
        bonne_reponse: aff(resultat),
        explication: 'On double la partie entière, puis la partie décimale : le double de ' +
          aff(m) + ' est ' + aff(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.moitie_decimal',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.06'],
    titre: 'Moitié d\'un décimal',
    generer: function (r) {
      // On part de la moitié pour garantir un résultat au millième près.
      var moitie = r.entier(1, 40) * 1000 + r.choix([250, 500, 750, 200, 400]);
      var m = moitie * 2;

      return {
        enonce: 'Quelle est la moitié de ' + aff(m) + ' ?',
        type: 'saisie',
        bonne_reponse: aff(moitie),
        explication: 'La moitié de ' + aff(m) + ' est ' + aff(moitie) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.diviser_par_4_ou_8',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.07'],
    titre: 'Diviser par 4 ou par 8',
    generer: function (r) {
      var diviseur = r.choix([4, 8]);
      var quotient = r.entier(3, 60);
      var n = quotient * diviseur;

      var etapes = diviseur === 4
        ? 'la moitié de ' + F.entier(n) + ' est ' + F.entier(n / 2) + ', et la moitié de ' +
          F.entier(n / 2) + ' est ' + F.entier(quotient)
        : 'la moitié de ' + F.entier(n) + ' est ' + F.entier(n / 2) + ', puis ' + F.entier(n / 4) +
          ', puis ' + F.entier(quotient);

      return {
        enonce: 'Calcule ' + F.entier(n) + ' ÷ ' + diviseur + '.',
        type: 'saisie',
        bonne_reponse: String(quotient),
        explication: 'Diviser par ' + diviseur + ', c\'est prendre la moitié ' +
          (diviseur === 4 ? 'deux fois' : 'trois fois') + ' : ' + etapes + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cm.multiplier_par_5_ou_50',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.calcul_mental.procedures.08', 'mat.nc.calcul_mental.procedures.09'],
    titre: 'Multiplier par 5 ou par 50',
    generer: function (r) {
      var facteur = r.choix([5, 50]);
      // Partie décimale paire en dixièmes : le passage par la moitié reste exact.
      var m = r.entier(1, 30) * 1000 + r.choix([200, 400, 600, 800]);
      var resultat = m * facteur;

      var reference = facteur === 5 ? 10 : 100;

      return {
        enonce: 'Calcule ' + aff(m) + ' × ' + facteur + '.',
        type: 'saisie',
        bonne_reponse: aff(resultat),
        explication: facteur + ' = ' + reference + ' ÷ 2. On multiplie donc par ' + reference +
          ' puis on prend la moitié : ' + aff(m) + ' × ' + reference + ' = ' + aff(m * reference) +
          ', et la moitié de ' + aff(m * reference) + ' est ' + aff(resultat) + '.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
