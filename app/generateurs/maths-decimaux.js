/* Nombres décimaux — fractions décimales, écriture à virgule, comparaison.
   Référentiel : mat.nc.decimaux.

   Contrainte du programme : on ne va pas au-delà des millièmes. Tous les calculs
   internes se font donc en millièmes entiers, jamais en flottants, pour qu'aucun
   0,30000000000000004 ne puisse apparaître dans un énoncé. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  var RANGS_DEC = [
    { nom: 'dixièmes', diviseur: 10, position: 1 },
    { nom: 'centièmes', diviseur: 100, position: 2 },
    { nom: 'millièmes', diviseur: 1000, position: 3 }
  ];

  /** Décimal construit à partir d'un nombre entier de millièmes. */
  function dec(millemes) { return millemes / 1000; }

  /** Tire un décimal ayant exactement `nbDecimales` décimales, dernière non nulle. */
  function tirerDecimal(r, entierMax, nbDecimales) {
    var e = r.entier(0, entierMax);
    var puissance = Math.pow(10, nbDecimales);
    var frac;
    do {
      frac = r.entier(1, puissance - 1);
    } while (frac % 10 === 0);
    return e * 1000 + frac * (1000 / puissance);
  }

  function aff(millemes) { return F.decimal(dec(millemes)); }

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'dec.fraction_vers_virgule',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.08', 'mat.nc.decimaux.09'],
    titre: 'De la fraction décimale à l\'écriture à virgule',
    generer: function (r) {
      var rang = r.choix(RANGS_DEC);
      var num;
      do {
        num = r.entier(rang.diviseur + 1, rang.diviseur * 99);
      } while (num % 10 === 0);

      var valeur = (num / rang.diviseur) * 1000;

      return {
        enonce: 'Écris ' + num + '/' + rang.diviseur + ' avec une virgule.',
        type: 'saisie',
        bonne_reponse: aff(valeur),
        explication: num + '/' + rang.diviseur + ' = ' + aff(valeur) +
          '. Diviser par ' + rang.diviseur + ' revient à décaler la virgule de ' +
          rang.position + ' rang' + (rang.position > 1 ? 's' : '') + ' vers la gauche.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.virgule_vers_fraction',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.08'],
    titre: 'De l\'écriture à virgule à la fraction décimale',
    generer: function (r) {
      var nbDec = r.entier(1, 3);
      var m = tirerDecimal(r, 9, nbDec);
      var diviseur = Math.pow(10, nbDec);
      var num = Math.round(dec(m) * diviseur);

      function afficher(n) { return n + '/' + diviseur; }

      var candidats = [num * 10, Math.round(num / 10), num + diviseur, num - diviseur,
                       num * 100].filter(function (v) { return v > 0 && v === Math.floor(v); });

      var choix = Q.construire(r, num, r.melanger(candidats), afficher);

      return {
        enonce: 'Quelle fraction décimale est égale à ' + aff(m) + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: aff(m) + ' = ' + num + '/' + diviseur + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.chiffre_rang',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.02', 'mat.nc.decimaux.09'],
    titre: 'Le chiffre des dixièmes, centièmes, millièmes',
    generer: function (r) {
      var m = tirerDecimal(r, 999, 3);
      var rang = r.choix(RANGS_DEC);
      var chiffre = Math.floor(m / (1000 / rang.diviseur)) % 10;

      return {
        enonce: 'Dans ' + aff(m) + ', quel est le chiffre des ' + rang.nom + ' ?',
        type: 'saisie',
        bonne_reponse: String(chiffre),
        explication: 'Après la virgule viennent d\'abord les dixièmes, puis les centièmes, ' +
          'puis les millièmes. Dans ' + aff(m) + ', le chiffre des ' + rang.nom + ' est ' + chiffre + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.relations_unites',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.02'],
    titre: 'Relations entre unités, dixièmes, centièmes et millièmes',
    generer: function (r) {
      var grands = [
        { nom: 'unité', pluriel: 'unités', valeur: 1000 },
        { nom: 'dixième', pluriel: 'dixièmes', valeur: 100 },
        { nom: 'centième', pluriel: 'centièmes', valeur: 10 }
      ];
      var petits = [
        { nom: 'dixième', pluriel: 'dixièmes', valeur: 100 },
        { nom: 'centième', pluriel: 'centièmes', valeur: 10 },
        { nom: 'millième', pluriel: 'millièmes', valeur: 1 }
      ];

      var g = r.choix(grands);
      var candidatsPetits = petits.filter(function (p) { return p.valeur < g.valeur; });
      var p = r.choix(candidatsPetits);

      var combien = r.entier(2, 9);
      var reponse = combien * (g.valeur / p.valeur);

      return {
        enonce: 'Combien y a-t-il de ' + p.pluriel + ' dans ' + combien + ' ' + g.pluriel + ' ?',
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: '1 ' + g.nom + ' = ' + (g.valeur / p.valeur) + ' ' + p.pluriel + ', donc ' +
          combien + ' ' + g.pluriel + ' = ' + F.entier(reponse) + ' ' + p.pluriel + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.partie_entiere',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.11'],
    titre: 'Partie entière d\'un décimal',
    generer: function (r) {
      var m = tirerDecimal(r, 99, r.entier(1, 3));
      var entiere = Math.floor(m / 1000);

      return {
        enonce: 'Quelle est la partie entière de ' + aff(m) + ' ?',
        type: 'saisie',
        bonne_reponse: String(entiere),
        explication: 'La partie entière est ce qui est écrit avant la virgule : ' + entiere +
          '. Elle ne s\'arrondit pas.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.arrondi_entier',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.11'],
    titre: 'Arrondir un décimal à l\'entier',
    generer: function (r) {
      var m;
      // On évite pile 0,5 : la règle d'arrondi y est une convention, pas un raisonnement.
      do {
        m = tirerDecimal(r, 99, r.entier(1, 3));
      } while (m % 1000 === 500);

      var reste = m % 1000;
      var bas = Math.floor(m / 1000);
      var arrondi = reste < 500 ? bas : bas + 1;

      return {
        enonce: 'Quel est l\'arrondi à l\'entier de ' + aff(m) + ' ?',
        type: 'saisie',
        bonne_reponse: String(arrondi),
        explication: aff(m) + ' est compris entre ' + bas + ' et ' + (bas + 1) +
          '. Sa partie décimale vaut ' + aff(reste) + ', donc il est plus proche de ' + arrondi + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.comparer',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.12'],
    titre: 'Comparer deux décimaux',
    generer: function (r) {
      var a = tirerDecimal(r, 20, r.entier(1, 3));
      var b;
      if (r.chance(0.7)) {
        // Même partie entière : c'est le cas où l'erreur classique se produit
        // (croire que 2,7 < 2,45 parce que 45 > 7).
        var entiere = Math.floor(a / 1000);
        do {
          b = entiere * 1000 + r.entier(1, 999);
        } while (b === a);
      } else {
        do { b = tirerDecimal(r, 20, r.entier(1, 3)); } while (b === a);
      }

      var signe = a < b ? '<' : '>';

      return {
        enonce: 'Complète avec le signe < ou > : ' + aff(a) + ' … ' + aff(b),
        type: 'saisie',
        bonne_reponse: signe,
        explication: aff(a) + ' ' + signe + ' ' + aff(b) +
          '. On compare d\'abord les parties entières, puis les dixièmes, puis les centièmes. ' +
          'Un nombre n\'est pas plus grand parce qu\'il a plus de chiffres après la virgule.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.ordonner',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.12'],
    titre: 'Ranger des décimaux',
    generer: function (r) {
      var entiere = r.entier(1, 12);
      var valeurs = [];
      while (valeurs.length < 4) {
        var v = entiere * 1000 + r.choix([
          r.entier(1, 9) * 100,          // un chiffre après la virgule
          r.entier(1, 99) * 10,          // deux chiffres
          r.entier(1, 999)               // trois chiffres
        ]);
        if (valeurs.indexOf(v) === -1) valeurs.push(v);
      }
      valeurs = r.melanger(valeurs);

      var croissant = r.chance();
      var trie = valeurs.slice().sort(function (x, y) { return croissant ? x - y : y - x; });

      function afficher(liste) { return liste.map(aff).join(' ; '); }

      var choix = Q.rangement(r, trie, afficher);

      return {
        enonce: 'Range ces nombres dans l\'ordre ' + (croissant ? 'croissant' : 'décroissant') +
          ' : ' + afficher(valeurs),
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Dans l\'ordre ' + (croissant ? 'croissant' : 'décroissant') + ' : ' + afficher(trie) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.intercaler',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.12'],
    titre: 'Intercaler un décimal',
    generer: function (r) {
      var entiere = r.entier(1, 20);
      var d = r.entier(0, 8);
      var a = entiere * 1000 + d * 100;
      var b = a + 100;                       // deux dixièmes consécutifs
      var bonne = a + r.entier(1, 9) * 10;   // un centième strictement entre les deux

      // Les bornes elles-mêmes ne sont pas proposées : « compris entre » est parfois
      // entendu au sens large, et un leurre ambigu vaut une question fausse.
      var candidats = [
        a - r.entier(1, 9) * 10,
        b + r.entier(1, 9) * 10,
        a - 100 - r.entier(1, 9) * 10,
        b + 100 + r.entier(1, 9) * 10
      ].filter(function (v) { return v > 0; });

      var choix = Q.construire(r, bonne, candidats, aff);

      return {
        enonce: 'Quel nombre est compris entre ' + aff(a) + ' et ' + aff(b) + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: aff(a) + ' < ' + aff(bonne) + ' < ' + aff(b) +
          '. Entre deux décimaux, on peut toujours en intercaler un autre en descendant d\'un rang.'
      };
    }
  });

  /* --- Fractions décimales -------------------------------------------- */

  var NOM_RANG = { 10: 'dixièmes', 100: 'centièmes', 1000: 'millièmes' };

  reg.ajouter({
    id: 'dec.lire_fraction_decimale',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.01'],
    titre: 'Lire et écrire une fraction décimale',
    generer: function (r) {
      var diviseur = r.choix([10, 100, 1000]);
      var num;
      do {
        // On reste sous le millier : « six-mille-deux-cent-vingt-quatre millièmes »
        // est juste, mais illisible pour un élève.
        num = r.entier(2, Math.min(diviseur * 3, 999));
      } while (num % 10 === 0);

      return {
        enonce: 'Écris cette fraction décimale en chiffres : ' +
          CM2.lettres.enLettres(num) + ' ' + NOM_RANG[diviseur] +
          '. (Réponds sous la forme « 47/100 ».)',
        type: 'saisie',
        bonne_reponse: num + '/' + diviseur,
        explication: CM2.lettres.enLettres(num) + ' ' + NOM_RANG[diviseur] + ' s\'écrit ' +
          num + '/' + diviseur + ' : le numérateur dit combien on en prend, le dénominateur ' +
          'dit en combien de parts l\'unité est partagée.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.fraction_decimale_mixte',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.04'],
    titre: 'Un entier plus une fraction décimale',
    generer: function (r) {
      var diviseur = r.choix([10, 100, 1000]);
      var entier = r.entier(1, 9);
      var reste = r.entier(1, diviseur - 1);
      var num = entier * diviseur + reste;

      return {
        enonce: 'Écris ' + num + '/' + diviseur + ' sous la forme d\'un entier plus une ' +
          'fraction décimale inférieure à 1. (Réponds sous la forme « 3 + 47/100 ».)',
        type: 'saisie',
        bonne_reponse: entier + ' + ' + reste + '/' + diviseur,
        explication: entier + ' unités, c\'est ' + (entier * diviseur) + '/' + diviseur +
          '. Il reste ' + reste + '/' + diviseur + '. Donc ' + num + '/' + diviseur + ' = ' +
          entier + ' + ' + reste + '/' + diviseur + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.decomposer_fraction_decimale',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.05'],
    titre: 'Décomposer une fraction décimale',
    generer: function (r) {
      var diviseur = r.choix([100, 1000]);
      var entier = r.entier(1, 9);
      var dixiemes = r.entier(1, 9);
      var centiemes = r.entier(1, 9);
      var milliemes = diviseur === 1000 ? r.entier(1, 9) : 0;

      var num = entier * diviseur + dixiemes * (diviseur / 10) +
                centiemes * (diviseur / 100) + milliemes;

      var bouts = [String(entier), dixiemes + '/10', centiemes + '/100'];
      if (diviseur === 1000) bouts.push(milliemes + '/1000');
      var reponse = bouts.join(' + ');

      return {
        enonce: 'Décompose ' + num + '/' + diviseur + ' en un entier et des fractions décimales ' +
          'de numérateur inférieur à 10. (Réponds sous la forme « 3 + 4/10 + 7/100 ».)',
        type: 'saisie',
        bonne_reponse: reponse,
        explication: 'On lit les chiffres un à un : ' +
          entier + F.pluriel(entier, ' unité', ' unités') + ', ' +
          dixiemes + F.pluriel(dixiemes, ' dixième', ' dixièmes') + ', ' +
          centiemes + F.pluriel(centiemes, ' centième', ' centièmes') +
          (diviseur === 1000
            ? ' et ' + milliemes + F.pluriel(milliemes, ' millième', ' millièmes') : '') +
          '. Donc ' + num + '/' + diviseur + ' = ' + reponse + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.comparer_fractions_decimales',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.06'],
    titre: 'Comparer deux fractions décimales',
    generer: function (r) {
      // Dénominateurs différents la plupart du temps : c'est là que l'erreur
      // classique se produit (croire que 45/100 est plus grand que 7/10).
      var dA = r.choix([10, 100, 1000]);
      var dB = r.chance(0.7) ? r.choix([10, 100, 1000]) : dA;
      var nA = r.entier(1, dA * 5);
      var nB;
      do {
        nB = r.entier(1, dB * 5);
      } while (nA / dA === nB / dB);

      var signe = nA / dA < nB / dB ? '<' : '>';

      return {
        enonce: 'Complète avec le signe < ou > : ' + nA + '/' + dA + ' … ' + nB + '/' + dB,
        type: 'saisie',
        bonne_reponse: signe,
        explication: nA + '/' + dA + ' = ' + F.decimal(nA / dA) + ' et ' + nB + '/' + dB +
          ' = ' + F.decimal(nB / dB) + '. Donc ' + nA + '/' + dA + ' ' + signe + ' ' +
          nB + '/' + dB + '. Un grand numérateur ne fait pas une grande fraction : c\'est le ' +
          'dénominateur qui dit la taille des parts.'
      };
    }
  });

  reg.ajouter({
    id: 'dec.ordonner_fractions_decimales',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.07'],
    titre: 'Ranger des fractions décimales',
    generer: function (r) {
      var valeurs = [];      // en millièmes, pour comparer sans flottants
      var affiches = [];
      while (valeurs.length < 4) {
        var d = r.choix([10, 100, 1000]);
        var n = r.entier(1, d * 3);
        var m = n * (1000 / d);
        if (valeurs.indexOf(m) === -1) {
          valeurs.push(m);
          affiches.push({ m: m, texte: n + '/' + d });
        }
      }

      var croissant = r.chance();
      var trie = affiches.slice().sort(function (x, y) {
        return croissant ? x.m - y.m : y.m - x.m;
      });

      function afficher(liste) {
        return liste.map(function (x) { return x.texte; }).join(' ; ');
      }

      var choix = Q.rangement(r, trie, afficher);

      return {
        enonce: 'Range ces fractions décimales dans l\'ordre ' +
          (croissant ? 'croissant' : 'décroissant') + ' : ' + afficher(affiches),
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'En écriture à virgule : ' + affiches.map(function (x) {
          return x.texte + ' = ' + F.decimal(x.m / 1000);
        }).join(', ') + '. Dans l\'ordre ' + (croissant ? 'croissant' : 'décroissant') +
          ' : ' + afficher(trie) + '.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
