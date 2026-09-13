/* Nombres entiers — numération, comparaison, diviseurs et multiples.
   Référentiel : data/referentiel/maths-cm2.json, domaine mat.nc.entiers.

   Champ numérique : 999 999 999 au maximum (contrainte du programme).
   Les générateurs qui écrivent en toutes lettres restent sous 999 999,
   voir app/lettres.js pour la raison. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  var RANGS = [
    { nom: 'unités', puissance: 1 },
    { nom: 'dizaines', puissance: 10 },
    { nom: 'centaines', puissance: 100 },
    { nom: 'milliers', puissance: 1000 },
    { nom: 'dizaines de mille', puissance: 10000 },
    { nom: 'centaines de mille', puissance: 100000 },
    { nom: 'millions', puissance: 1000000 }
  ];

  /* Entier à `n` chiffres, premier chiffre non nul. */
  function nombreAChiffres(r, n) {
    var v = r.entier(1, 9);
    for (var i = 1; i < n; i++) v = v * 10 + r.entier(0, 9);
    return v;
  }

  function chiffreDe(nombre, puissance) {
    return Math.floor(nombre / puissance) % 10;
  }

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'ent.chiffre_position',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.04'],
    titre: 'Le chiffre d\'un rang',
    generer: function (r) {
      var longueur = r.entier(5, 8);
      var nombre = nombreAChiffres(r, longueur);
      var rang = RANGS[r.entier(1, Math.min(longueur - 1, RANGS.length - 1))];
      var reponse = chiffreDe(nombre, rang.puissance);

      return {
        enonce: 'Dans le nombre ' + F.entier(nombre) + ', quel est le chiffre des ' + rang.nom + ' ?',
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: 'On compte les rangs à partir de la droite. Le chiffre des ' +
          rang.nom + ' de ' + F.entier(nombre) + ' est ' + reponse + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.nombre_de_rang',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.01', 'mat.nc.entiers.04'],
    titre: 'Le nombre d\'unités d\'un rang',
    generer: function (r) {
      var longueur = r.entier(5, 8);
      var nombre = nombreAChiffres(r, longueur);
      var rang = RANGS[r.entier(1, Math.min(longueur - 1, RANGS.length - 1))];
      var reponse = Math.floor(nombre / rang.puissance);
      var chiffre = reponse % 10;

      return {
        enonce: 'Dans le nombre ' + F.entier(nombre) + ', combien y a-t-il de ' + rang.nom + ' en tout ?',
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: 'Attention à ne pas confondre : le *chiffre* des ' + rang.nom + ' est ' +
          chiffre + ', mais le *nombre* de ' + rang.nom + ' est ' + F.entier(reponse) +
          ', car on prend tout ce qui est à gauche de ce rang, ce rang compris.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.lettres_vers_chiffres',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.03'],
    titre: 'Des lettres aux chiffres',
    generer: function (r) {
      var nombre;
      // On évite les nombres trop ronds, qui rendent l'exercice trivial.
      do {
        nombre = r.entier(1001, 999999);
      } while (nombre % 1000 === 0);

      return {
        enonce: 'Écris ce nombre en chiffres : ' + CM2.lettres.enLettres(nombre) + '.',
        type: 'saisie',
        bonne_reponse: String(nombre),
        explication: CM2.lettres.enLettres(nombre) + ' s\'écrit ' + F.entier(nombre) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.chiffres_vers_lettres',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.03'],
    titre: 'Des chiffres aux lettres',
    generer: function (r) {
      var nombre;
      do {
        nombre = r.entier(1001, 999999);
      } while (nombre % 100 === 0);

      var bonne = CM2.lettres.enLettres(nombre);
      // Leurres : des nombres voisins, dont l'écriture en lettres diffère vraiment.
      var voisins = [
        nombre + 1000, nombre - 1000, nombre + 100, nombre - 100,
        nombre + 10, nombre - 10, nombre + 1, nombre - 1
      ].filter(function (v) { return v > 0 && v <= CM2.lettres.maximum; });

      var choix = Q.construire(r, nombre, r.melanger(voisins), CM2.lettres.enLettres);

      return {
        enonce: 'Comment s\'écrit ' + F.entier(nombre) + ' en toutes lettres ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: F.entier(nombre) + ' s\'écrit « ' + bonne + ' ».'
      };
    }
  });

  reg.ajouter({
    id: 'ent.decomposition',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.01', 'mat.nc.entiers.03'],
    titre: 'Décomposer un nombre entier',
    generer: function (r) {
      var longueur = r.entier(4, 6);
      var nombre = nombreAChiffres(r, longueur);

      function decomposer(n) {
        var bouts = [];
        for (var i = RANGS.length - 1; i >= 0; i--) {
          var p = RANGS[i].puissance;
          var c = chiffreDe(n, p);
          if (c === 0) continue;
          bouts.push(p === 1 ? String(c) : c + ' × ' + F.entier(p));
        }
        return bouts.length ? bouts.join(' + ') : '0';
      }

      // Leurres : des nombres qui produisent une décomposition proche mais fausse.
      var voisins = [nombre + 10, nombre - 10, nombre + 100, nombre - 100,
                     nombre + 1, nombre - 1, nombre + 1000, nombre - 1000]
        .filter(function (v) { return v > 0; });

      var choix = Q.construire(r, nombre, r.melanger(voisins), decomposer);

      return {
        enonce: 'Quelle est la décomposition de ' + F.entier(nombre) + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: F.entier(nombre) + ' = ' + decomposer(nombre) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.comparer',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.05'],
    titre: 'Comparer deux nombres entiers',
    generer: function (r) {
      var longueur = r.entier(5, 9);
      var a = nombreAChiffres(r, longueur);
      var b;
      if (r.chance(0.6)) {
        // Nombres proches : c'est là que la comparaison chiffre à chiffre se joue.
        var ecart = r.choix([1, 9, 10, 90, 100, 900, 1000]);
        b = r.chance() ? a + ecart : a - ecart;
      } else {
        b = nombreAChiffres(r, r.entier(5, 9));
      }
      if (b <= 0 || b === a) b = a + 1;

      var signe = a < b ? '<' : '>';

      return {
        enonce: 'Complète avec le signe < ou > : ' + F.entier(a) + ' … ' + F.entier(b),
        type: 'saisie',
        bonne_reponse: signe,
        explication: F.entier(a) + ' ' + signe + ' ' + F.entier(b) +
          '. On compare d\'abord le nombre de chiffres, puis les chiffres un à un en partant de la gauche.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.ordonner',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.06'],
    titre: 'Ranger des nombres entiers',
    generer: function (r) {
      var base = nombreAChiffres(r, r.entier(5, 7));
      var nombres = [base];
      while (nombres.length < 4) {
        var v = base + r.choix([-1, 1]) * r.choix([1, 10, 100, 1000, 11, 101, 1010]) * r.entier(1, 9);
        if (v > 0 && nombres.indexOf(v) === -1) nombres.push(v);
      }
      nombres = r.melanger(nombres);

      var croissant = r.chance();
      var trie = nombres.slice().sort(function (x, y) { return croissant ? x - y : y - x; });

      function afficher(liste) {
        return liste.map(F.entier).join(' ; ');
      }

      var choix = Q.rangement(r, trie, afficher);

      return {
        enonce: 'Range ces nombres dans l\'ordre ' + (croissant ? 'croissant' : 'décroissant') +
          ' : ' + afficher(nombres),
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Dans l\'ordre ' + (croissant ? 'croissant' : 'décroissant') +
          ' : ' + afficher(trie) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.encadrer',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.05'],
    titre: 'Encadrer un nombre entier',
    generer: function (r) {
      var pas = r.choix([10, 100, 1000, 10000]);
      var NOMS = {
        10: { quels: 'quelles', nom: 'dizaines', accord: 'consécutives' },
        100: { quels: 'quelles', nom: 'centaines', accord: 'consécutives' },
        1000: { quels: 'quels', nom: 'milliers', accord: 'consécutifs' },
        10000: { quels: 'quelles', nom: 'dizaines de mille', accord: 'consécutives' }
      };
      var nom = NOMS[pas];
      var nombre;
      do {
        nombre = r.entier(pas + 1, 999999);
      } while (nombre % pas === 0);

      var bas = Math.floor(nombre / pas) * pas;
      var haut = bas + pas;

      function afficher(v) { return F.entier(v) + ' et ' + F.entier(v + pas); }

      var choix = Q.construire(r, bas, [bas - pas, bas + pas, bas - 2 * pas]
        .filter(function (v) { return v >= 0; }), afficher, 4);

      return {
        enonce: 'Entre ' + nom.quels + ' ' + nom.nom + ' ' + nom.accord + ' se trouve ' +
          F.entier(nombre) + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: F.entier(bas) + ' < ' + F.entier(nombre) + ' < ' + F.entier(haut) + '.'
      };
    }
  });

  /* --- Diviseurs et multiples ---------------------------------------- */

  reg.ajouter({
    id: 'ent.est_diviseur',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.08'],
    titre: 'Est-ce un diviseur ?',
    generer: function (r) {
      var d = r.entier(2, 10);
      var oui = r.chance();
      var n;
      if (oui) {
        n = d * r.entier(4, 40);
      } else {
        do { n = r.entier(20, 400); } while (n % d === 0);
      }

      var reste = n % d;

      return {
        enonce: 'Le nombre ' + d + ' est-il un diviseur de ' + F.entier(n) + ' ?',
        type: 'qcm',
        propositions: ['oui', 'non'],
        bonne_reponse: oui ? 0 : 1,
        explication: oui
          ? F.entier(n) + ' = ' + d + ' × ' + (n / d) + ', donc ' + d + ' est bien un diviseur de ' + F.entier(n) + '.'
          : F.entier(n) + ' = ' + d + ' × ' + Math.floor(n / d) + ' + ' + reste +
            '. Le reste n\'est pas nul, donc ' + d + ' n\'est pas un diviseur de ' + F.entier(n) + '.'
      };
    }
  });

  function diviseursDe(n) {
    var d = [];
    for (var i = 1; i <= n; i++) if (n % i === 0) d.push(i);
    return d;
  }

  reg.ajouter({
    id: 'ent.tous_diviseurs',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.10'],
    titre: 'Tous les diviseurs d\'un nombre',
    generer: function (r) {
      // Nombre inférieur ou égal à 30, et pas premier : sinon l'exercice n'apprend rien.
      var n;
      do {
        n = r.entier(12, 30);
      } while (diviseursDe(n).length < 4);

      var bons = diviseursDe(n);
      function afficher(liste) { return liste.join(' ; '); }

      var candidats = [
        bons.slice(1),                                   // on oublie 1
        bons.slice(0, bons.length - 1),                  // on oublie le nombre lui-même
        bons.concat([r.entierSauf(2, n - 1, bons)]).sort(function (a, b) { return a - b; }),
        bons.slice(1, bons.length - 1)                   // on oublie les deux extrêmes
      ].filter(function (l) { return l.length > 0 && l.indexOf(null) === -1; });

      var choix = Q.construire(r, bons, candidats, afficher);

      return {
        enonce: 'Quelle liste donne tous les diviseurs de ' + n + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Les diviseurs de ' + n + ' sont ' + afficher(bons) +
          '. On n\'oublie jamais 1 ni le nombre lui-même.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.diviseur_commun',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.11'],
    titre: 'Un diviseur commun',
    generer: function (r) {
      var a, b, communs;
      do {
        a = r.entier(12, 30);
        b = r.entierSauf(12, 30, [a]);
        communs = diviseursDe(a).filter(function (d) {
          return d > 1 && b % d === 0;
        });
      } while (communs.length === 0);

      var bonne = r.choix(communs);
      var candidats = [];
      for (var v = 2; v <= 15; v++) {
        if (communs.indexOf(v) === -1) candidats.push(v);
      }

      var choix = Q.construire(r, bonne, r.melanger(candidats), String);

      return {
        enonce: 'Parmi ces nombres, lequel est un diviseur commun à ' + a + ' et à ' + b + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: a + ' = ' + bonne + ' × ' + (a / bonne) + ' et ' + b + ' = ' + bonne + ' × ' + (b / bonne) +
          ' : ' + bonne + ' divise les deux nombres.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.multiple_commun',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.12'],
    titre: 'Un multiple commun',
    generer: function (r) {
      var a = r.entier(2, 14);
      var b = r.entierSauf(2, 14, [a]);

      function ppcm(x, y) {
        var p = x * y, g = x, h = y;
        while (h) { var t = h; h = g % h; g = t; }
        return p / g;
      }
      var m = ppcm(a, b);
      var bonne = m * r.entier(1, 3);

      var candidats = [];
      for (var k = 1; k <= 12; k++) {
        var ma = a * k, mb = b * k;
        if (ma % b !== 0) candidats.push(ma);
        if (mb % a !== 0) candidats.push(mb);
      }
      for (var v = 2; v <= 60; v++) {
        if (v % a !== 0 && v % b !== 0) candidats.push(v);
      }

      var choix = Q.construire(r, bonne, r.melanger(candidats), String);

      return {
        enonce: 'Parmi ces nombres, lequel est un multiple commun à ' + a + ' et à ' + b + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: bonne + ' = ' + a + ' × ' + (bonne / a) + ' et ' + bonne + ' = ' + b + ' × ' + (bonne / b) +
          ' : c\'est bien un multiple des deux nombres.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.suivant_precedent',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.02'],
    titre: 'Le nombre juste avant, juste après',
    generer: function (r) {
      // On vise volontairement les passages de retenue : 4 599 999 → 4 600 000.
      var zeros = r.entier(1, 5);
      var tete = nombreAChiffres(r, r.entier(2, 9 - zeros));
      var nombre = tete * Math.pow(10, zeros) - 1;      // se termine par des 9
      var apres = r.chance();

      return {
        enonce: 'Quel nombre vient juste ' + (apres ? 'après' : 'avant') + ' ' +
          F.entier(apres ? nombre : nombre + 1) + ' ?',
        type: 'saisie',
        bonne_reponse: String(apres ? nombre + 1 : nombre),
        explication: apres
          ? F.entier(nombre) + ' se termine par des 9 : en ajoutant 1, tous ces 9 deviennent ' +
            'des 0 et le chiffre d\'avant augmente de 1. On obtient ' + F.entier(nombre + 1) + '.'
          : F.entier(nombre + 1) + ' se termine par des 0 : en retirant 1, on descend au ' +
            'nombre juste en dessous, ' + F.entier(nombre) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ent.diviseur_parmi',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.09'],
    titre: 'Trouver un diviseur',
    generer: function (r) {
      var n;
      do {
        n = r.entier(24, 100);
      } while (diviseursDe(n).length < 4);

      var bons = diviseursDe(n).filter(function (d) { return d > 1 && d < n; });
      var bonne = r.choix(bons);

      var candidats = [];
      for (var v = 2; v <= 20; v++) if (n % v !== 0) candidats.push(v);

      var choix = Q.construire(r, bonne, r.melanger(candidats), String);

      return {
        enonce: 'Parmi ces nombres, lequel est un diviseur de ' + n + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: n + ' = ' + bonne + ' × ' + (n / bonne) + ' : la division tombe juste, ' +
          bonne + ' est donc un diviseur de ' + n + '.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
