/* Algèbre. Référentiel : mat.nc.algebre.

   Interdit du programme respecté ici : les lettres ne désignent jamais une
   inconnue. Le nombre cherché est écrit « … » ou nommé par un mot (« le nombre
   mystère »). Les lettres arriveront au cycle 4. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'alg.egalite_a_trous',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.01'],
    titre: 'Le nombre manquant',
    generer: function (r) {
      var forme = r.entier(1, 4);
      var enonce, reponse, explication;

      if (forme === 1) {                       // a + … = b
        var a = r.entier(12, 480);
        var manque = r.entier(15, 520);
        enonce = F.entier(a) + ' + … = ' + F.entier(a + manque);
        reponse = manque;
        explication = 'On cherche ce qu\'il faut ajouter à ' + F.entier(a) + ' pour atteindre ' +
          F.entier(a + manque) + '. On soustrait : ' + F.entier(a + manque) + ' − ' + F.entier(a) +
          ' = ' + F.entier(manque) + '.';
      } else if (forme === 2) {                // … − a = b
        var b = r.entier(12, 400);
        var reste = r.entier(15, 500);
        enonce = '… − ' + F.entier(b) + ' = ' + F.entier(reste);
        reponse = b + reste;
        explication = 'Le nombre cherché est celui dont on a retiré ' + F.entier(b) +
          ' pour obtenir ' + F.entier(reste) + '. On remet ce qui a été retiré : ' +
          F.entier(reste) + ' + ' + F.entier(b) + ' = ' + F.entier(reponse) + '.';
      } else if (forme === 3) {                // a × … = b
        var f1 = r.entier(2, 9);
        var f2 = r.entier(3, 40);
        enonce = f1 + ' × … = ' + F.entier(f1 * f2);
        reponse = f2;
        explication = 'On cherche par combien multiplier ' + f1 + ' pour obtenir ' +
          F.entier(f1 * f2) + '. On divise : ' + F.entier(f1 * f2) + ' ÷ ' + f1 + ' = ' +
          F.entier(f2) + '.';
      } else {                                 // … ÷ a = b
        var d = r.entier(2, 9);
        var q = r.entier(4, 60);
        enonce = '… ÷ ' + d + ' = ' + F.entier(q);
        reponse = d * q;
        explication = 'Le nombre cherché, divisé par ' + d + ', donne ' + F.entier(q) +
          '. C\'est donc ' + d + ' × ' + F.entier(q) + ' = ' + F.entier(reponse) + '.';
      }

      return {
        enonce: 'Quel nombre se cache derrière les points ? ' + enonce,
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: explication
      };
    }
  });

  reg.ajouter({
    id: 'alg.nombre_mystere',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.02'],
    titre: 'Le nombre mystère',
    generer: function (r) {
      var depart = r.entier(6, 90);
      var ajout = r.entier(7, 60);
      var facteur = r.entier(2, 6);
      var deuxEtapes = r.chance(0.5);

      var arrivee, enonce, explication;
      if (deuxEtapes) {
        arrivee = (depart + ajout) * facteur;
        enonce = 'Je pense à un nombre. Je lui ajoute ' + ajout + ', puis je multiplie le ' +
          'résultat par ' + facteur + ' : j\'obtiens ' + F.entier(arrivee) +
          '. À quel nombre est-ce que je pensais ?';
        explication = 'On remonte le programme à l\'envers. Avant de multiplier par ' + facteur +
          ', on avait ' + F.entier(arrivee) + ' ÷ ' + facteur + ' = ' + F.entier(depart + ajout) +
          '. Avant d\'ajouter ' + ajout + ', on avait ' + F.entier(depart + ajout) + ' − ' + ajout +
          ' = ' + F.entier(depart) + '.';
      } else {
        arrivee = depart * facteur + ajout;
        enonce = 'Je pense à un nombre. Je le multiplie par ' + facteur + ', puis j\'ajoute ' +
          ajout + ' : j\'obtiens ' + F.entier(arrivee) + '. À quel nombre est-ce que je pensais ?';
        explication = 'On remonte à l\'envers. Avant d\'ajouter ' + ajout + ', on avait ' +
          F.entier(arrivee) + ' − ' + ajout + ' = ' + F.entier(depart * facteur) +
          '. Avant de multiplier par ' + facteur + ', on avait ' + F.entier(depart * facteur) +
          ' ÷ ' + facteur + ' = ' + F.entier(depart) + '.';
      }

      return {
        enonce: enonce,
        type: 'saisie',
        bonne_reponse: String(depart),
        explication: explication
      };
    }
  });

  reg.ajouter({
    id: 'alg.programme_de_calcul',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.03'],
    titre: 'Exécuter un programme de calcul',
    generer: function (r) {
      var depart = r.entier(3, 25);
      var etapes = [];
      var valeur = depart;

      var nb = r.entier(2, 3);
      for (var i = 0; i < nb; i++) {
        var choix = r.entier(1, 4);
        if (choix === 1) {
          var a = r.entier(3, 40);
          etapes.push('ajoute ' + a); valeur += a;
        } else if (choix === 2) {
          var s = r.entier(2, Math.max(2, Math.min(30, valeur - 1)));
          etapes.push('retranche ' + s); valeur -= s;
        } else if (choix === 3) {
          var m = r.entier(2, 5);
          etapes.push('multiplie par ' + m); valeur *= m;
        } else {
          // On ne divise que si le résultat tombe juste : le programme de calcul
          // travaille sur des entiers.
          var d = [2, 3, 4, 5].filter(function (x) { return valeur % x === 0; });
          if (d.length) { var dd = r.choix(d); etapes.push('divise par ' + dd); valeur /= dd; }
          else { var a2 = r.entier(3, 20); etapes.push('ajoute ' + a2); valeur += a2; }
        }
      }

      return {
        enonce: 'Applique ce programme de calcul au nombre ' + depart + ' : ' +
          etapes.join(', puis ') + '. Quel résultat obtiens-tu ?',
        type: 'saisie',
        bonne_reponse: String(valeur),
        explication: 'On suit les étapes dans l\'ordre, en partant de ' + depart +
          '. On arrive à ' + F.entier(valeur) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'alg.regle_de_suite',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.04'],
    titre: 'La règle d\'une suite',
    generer: function (r) {
      var multiplicative = r.chance(0.3);
      var premier, pas, suite = [];

      if (multiplicative) {
        premier = r.entier(2, 6);
        pas = r.entier(2, 4);
        for (var i = 0; i < 5; i++) suite.push(premier * Math.pow(pas, i));
      } else {
        premier = r.entier(3, 40);
        pas = r.entier(3, 19) * (r.chance(0.25) ? -1 : 1);
        if (pas < 0) premier = Math.abs(pas) * 6 + r.entier(1, 20);
        for (var j = 0; j < 5; j++) suite.push(premier + j * pas);
      }

      var bonne = multiplicative ? 'on multiplie par ' + pas
                                 : (pas > 0 ? 'on ajoute ' + pas : 'on retranche ' + Math.abs(pas));
      var leurres = multiplicative
        ? ['on ajoute ' + pas, 'on multiplie par ' + (pas + 1), 'on ajoute ' + (suite[1] - suite[0])]
        : [(pas > 0 ? 'on retranche ' + pas : 'on ajoute ' + Math.abs(pas)),
           'on multiplie par ' + Math.max(2, Math.abs(pas)),
           (pas > 0 ? 'on ajoute ' + (pas + 2) : 'on retranche ' + (Math.abs(pas) + 2))];

      var choix = Q.construire(r, bonne, leurres, String);

      return {
        enonce: 'Observe cette suite de nombres : ' + suite.map(F.entier).join(' ; ') +
          ' … Quelle est la règle qui permet de passer d\'un nombre au suivant ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'De ' + F.entier(suite[0]) + ' à ' + F.entier(suite[1]) + ', puis de ' +
          F.entier(suite[1]) + ' à ' + F.entier(suite[2]) + ', on fait toujours la même chose : ' +
          bonne + '.'
      };
    }
  });

  reg.ajouter({
    id: 'alg.continuer_suite',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.04'],
    titre: 'Continuer une suite',
    generer: function (r) {
      var premier = r.entier(4, 60);
      var pas = r.entier(3, 25);
      var suite = [];
      for (var i = 0; i < 5; i++) suite.push(premier + i * pas);

      return {
        enonce: 'Quel nombre vient après ? ' + suite.slice(0, 4).map(F.entier).join(' ; ') + ' ; …',
        type: 'saisie',
        bonne_reponse: String(suite[4]),
        explication: 'On ajoute ' + pas + ' à chaque fois : ' + F.entier(suite[3]) + ' + ' + pas +
          ' = ' + F.entier(suite[4]) + '.'
      };
    }
  });

  /* Suites de motifs : décrites en mots, comptées par la même règle affine.
     Le dessin n'est pas nécessaire tant que le motif est dit clairement. */
  var MOTIFS = [
    { objet: 'allumettes', forme: 'carrés mis bout à bout' },
    { objet: 'gommettes', forme: 'lignes de gommettes' },
    { objet: 'jetons', forme: 'rangées de jetons' },
    { objet: 'cubes', forme: 'tours de cubes' }
  ];

  reg.ajouter({
    id: 'alg.motif_etape_suivante',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.05'],
    titre: 'Poursuivre une suite de motifs',
    generer: function (r) {
      var m = r.choix(MOTIFS);
      var base = r.entier(2, 6);
      var pas = r.entier(2, 5);
      var compte = function (n) { return base + pas * (n - 1); };

      return {
        enonce: 'Pour construire des ' + m.forme + ', il faut ' + compte(1) + ' ' + m.objet +
          ' au motif 1, ' + compte(2) + ' au motif 2 et ' + compte(3) + ' au motif 3. ' +
          'Combien en faut-il au motif 4 ?',
        type: 'saisie',
        bonne_reponse: String(compte(4)),
        explication: 'À chaque motif, il faut ' + pas + ' ' + m.objet + ' de plus. Après ' +
          compte(3) + ', on a donc ' + compte(3) + ' + ' + pas + ' = ' + compte(4) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'alg.motif_etape_lointaine',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.algebre.06'],
    titre: 'Un motif éloigné',
    generer: function (r) {
      var m = r.choix(MOTIFS);
      var base = r.entier(2, 6);
      var pas = r.entier(2, 5);
      var etape = r.entier(7, 20);
      var compte = function (n) { return base + pas * (n - 1); };

      return {
        enonce: 'Pour construire des ' + m.forme + ', il faut ' + compte(1) + ' ' + m.objet +
          ' au motif 1, ' + compte(2) + ' au motif 2 et ' + compte(3) + ' au motif 3. ' +
          'Combien en faut-il au motif ' + etape + ' ?',
        type: 'saisie',
        bonne_reponse: String(compte(etape)),
        explication: 'Du motif 1 au motif ' + etape + ', il y a ' + (etape - 1) +
          ' fois ' + pas + ' ' + m.objet + ' en plus, soit ' + ((etape - 1) * pas) +
          '. Avec les ' + compte(1) + ' du départ : ' + compte(1) + ' + ' + ((etape - 1) * pas) +
          ' = ' + compte(etape) + '.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
