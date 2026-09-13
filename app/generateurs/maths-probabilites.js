/* Probabilités et proportionnalité. Référentiel : mat.ogd.probabilites, mat.prop.

   Deux règles du programme commandent tout ce fichier :

   - une probabilité s'exprime toujours sous la forme « a chances sur b », jamais
     en fraction ni en pourcentage ;
   - la proportionnalité ne s'appuie que sur la linéarité (doubler, tripler,
     additionner deux cas connus). Ni tableau, ni coefficient, ni produit en
     croix, et toujours des grandeurs, jamais des suites de nombres hors
     contexte. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  /* ============================================================ Probabilités */

  var TIRAGES = [
    { nom: 'dé', faces: 6, article: 'un', action: 'On lance un dé à 6 faces.',
      issue: 'résultat', pluriel: 'résultats' },
    { nom: 'roue', faces: 8, article: 'une', action: 'On fait tourner une roue partagée en 8 secteurs numérotés de 1 à 8.',
      issue: 'secteur', pluriel: 'secteurs' },
    { nom: 'carte', faces: 10, article: 'une', action: 'On tire une carte au hasard parmi 10 cartes numérotées de 1 à 10.',
      issue: 'carte', pluriel: 'cartes' },
    { nom: 'jeton', faces: 12, article: 'un', action: 'On tire un jeton au hasard dans un sac contenant 12 jetons numérotés de 1 à 12.',
      issue: 'jeton', pluriel: 'jetons' }
  ];

  reg.ajouter({
    id: 'prb.issues_possibles',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.probabilites.01'],
    titre: 'Tous les résultats possibles',
    generer: function (r) {
      var t = r.choix(TIRAGES);
      return {
        enonce: t.action + ' Combien y a-t-il de ' + t.pluriel + ' possibles ?',
        type: 'saisie',
        bonne_reponse: String(t.faces),
        explication: 'Chaque ' + t.issue + ' de 1 à ' + t.faces + ' peut sortir : il y a donc ' +
          t.faces + ' ' + t.pluriel + ' possibles.'
      };
    }
  });

  var EVENEMENTS = [
    { libelle: 'un nombre pair', test: function (n) { return n % 2 === 0; } },
    { libelle: 'un nombre impair', test: function (n) { return n % 2 === 1; } },
    { libelle: 'un nombre plus grand que 4', test: function (n) { return n > 4; } },
    { libelle: 'un nombre plus petit que 4', test: function (n) { return n < 4; } },
    { libelle: 'un multiple de 3', test: function (n) { return n % 3 === 0; } },
    { libelle: 'un multiple de 5', test: function (n) { return n % 5 === 0; } }
  ];

  function compter(faces, evenement) {
    var n = 0, liste = [];
    for (var i = 1; i <= faces; i++) if (evenement.test(i)) { n++; liste.push(i); }
    return { nombre: n, liste: liste };
  }

  reg.ajouter({
    id: 'prb.issues_evenement',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.probabilites.02'],
    titre: 'Les résultats qui conviennent',
    generer: function (r) {
      var t, e, c;
      do {
        t = r.choix(TIRAGES);
        e = r.choix(EVENEMENTS);
        c = compter(t.faces, e);
      } while (c.nombre === 0 || c.nombre === t.faces);

      return {
        enonce: t.action + ' Combien de ' + t.pluriel + ' donnent ' + e.libelle + ' ?',
        type: 'saisie',
        bonne_reponse: String(c.nombre),
        explication: 'Les ' + t.pluriel + ' qui conviennent sont : ' + c.liste.join(', ') +
          '. Il y en a ' + c.nombre + '.'
      };
    }
  });

  reg.ajouter({
    id: 'prb.chances_sur',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.probabilites.03'],
    titre: 'Exprimer une probabilité',
    generer: function (r) {
      var t, e, c;
      do {
        t = r.choix(TIRAGES);
        e = r.choix(EVENEMENTS);
        c = compter(t.faces, e);
      } while (c.nombre === 0 || c.nombre === t.faces);

      function ecrire(n) {
        return n + (n > 1 ? ' chances sur ' : ' chance sur ') + t.faces;
      }

      var candidats = [c.nombre + 1, c.nombre - 1, t.faces - c.nombre, 1]
        .filter(function (v) { return v >= 1 && v <= t.faces && v !== c.nombre; });

      var choix = Q.construire(r, c.nombre, r.melanger(candidats), ecrire);

      return {
        enonce: t.action + ' Quelle est la probabilité d\'obtenir ' + e.libelle + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Il y a ' + t.faces + ' ' + t.pluriel + ' possibles, et ' + c.nombre +
          ' qui conviennent (' + c.liste.join(', ') + '). La probabilité est donc de ' +
          ecrire(c.nombre) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'prb.comparer',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.probabilites.04'],
    titre: 'Quelle situation donne le plus de chances ?',
    generer: function (r) {
      var totalA = r.entier(5, 12);
      var bonsA = r.entier(1, totalA - 1);
      var totalB, bonsB;
      do {
        totalB = r.entier(5, 12);
        bonsB = r.entier(1, totalB - 1);
      } while (bonsA * totalB === bonsB * totalA);

      var aGagne = bonsA * totalB > bonsB * totalA;
      var couleur = r.choix(['rouges', 'bleus', 'verts', 'jaunes']);

      return {
        enonce: 'Le sac A contient ' + totalA + ' jetons, dont ' + bonsA + ' ' + couleur + '. ' +
          'Le sac B contient ' + totalB + ' jetons, dont ' + bonsB + ' ' + couleur + '. ' +
          'Dans quel sac a-t-on le plus de chances de tirer un jeton ' + couleur.slice(0, -1) + ' ?',
        type: 'qcm',
        propositions: ['le sac A', 'le sac B'],
        bonne_reponse: aGagne ? 0 : 1,
        explication: 'Sac A : ' + bonsA + ' chances sur ' + totalA + '. Sac B : ' + bonsB +
          ' chances sur ' + totalB + '. Pour comparer, on peut imaginer ' + (totalA * totalB) +
          ' tirages : cela ferait ' + (bonsA * totalB) + ' jetons ' + couleur + ' pour le sac A ' +
          'et ' + (bonsB * totalA) + ' pour le sac B. Le sac ' + (aGagne ? 'A' : 'B') +
          ' donne donc plus de chances.'
      };
    }
  });

  reg.ajouter({
    id: 'prb.independance',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.probabilites.05'],
    titre: 'Les tirages se souviennent-ils ?',
    generer: function (r) {
      var repetitions = r.entier(3, 6);
      var t = r.choix([
        { action: 'On lance une pièce', resultat: 'pile', total: 2 },
        { action: 'On lance un dé à 6 faces', resultat: 'un 6', total: 6 }
      ]);

      var bonne = t.total === 2 ? '1 chance sur 2' : '1 chance sur 6';
      var leurres = t.total === 2
        ? ['1 chance sur ' + (repetitions + 1), 'aucune chance', 'plus d\'1 chance sur 2']
        : ['1 chance sur ' + (repetitions + 6), 'aucune chance', 'moins d\'1 chance sur 6'];

      var choix = Q.construire(r, bonne, leurres, String);

      return {
        enonce: t.action + ' ' + repetitions + ' fois de suite et on obtient ' + t.resultat +
          ' à chaque fois. Quelle est la probabilité d\'obtenir encore ' + t.resultat +
          ' au lancer suivant ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le lancer suivant ne se souvient pas des précédents : la probabilité est ' +
          'toujours la même, ' + bonne + '. Ce qui vient de se produire ne change rien à ce qui ' +
          'va se produire.'
      };
    }
  });

  reg.ajouter({
    id: 'prb.deux_etapes',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.probabilites.06'],
    titre: 'Une expérience en deux étapes',
    generer: function (r) {
      var a = r.entier(2, 6);
      var b = r.entier(2, 6);
      var s = r.choix([
        { un: 'un dé à ' + a + ' faces', deux: 'un dé à ' + b + ' faces', verbe: 'lance' },
        { un: 'une roue à ' + a + ' secteurs', deux: 'une roue à ' + b + ' secteurs', verbe: 'fait tourner' }
      ]);

      var choix = Q.numerique(r, a * b, [a + b, a * b + a, a * b - b, Math.max(a, b)], String);

      return {
        enonce: 'On ' + s.verbe + ' ' + s.un + ', puis ' + s.deux +
          '. Combien y a-t-il de résultats possibles en tout ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Pour chacun des ' + a + ' résultats du premier tirage, le second en donne ' +
          b + '. En les rangeant dans un tableau, on compte ' + a + ' × ' + b + ' = ' + (a * b) +
          ' résultats possibles.'
      };
    }
  });

  /* ======================================================= Proportionnalité */

  var SITUATIONS_PROPORTIONNELLES = [
    { phrase: 'le prix de pommes vendues au kilo', proportionnel: true,
      pourquoi: 'deux fois plus de pommes coûtent deux fois plus cher.' },
    { phrase: 'le prix d\'un sachet de bonbons vendu à l\'unité', proportionnel: true,
      pourquoi: 'trois sachets coûtent trois fois le prix d\'un sachet.' },
    { phrase: 'la distance parcourue par un vélo roulant toujours à la même vitesse',
      proportionnel: true,
      pourquoi: 'en roulant deux fois plus longtemps, on parcourt deux fois plus de distance.' },
    { phrase: 'le nombre de roues selon le nombre de voitures', proportionnel: true,
      pourquoi: 'chaque voiture apporte toujours 4 roues.' },
    { phrase: 'l\'âge d\'un enfant selon sa taille', proportionnel: false,
      pourquoi: 'un enfant deux fois plus grand n\'a pas deux fois plus d\'âge.' },
    { phrase: 'le prix d\'une course en taxi, avec une somme fixe au départ puis un prix au kilomètre',
      proportionnel: false,
      pourquoi: 'à cause de la somme fixe, deux fois plus de kilomètres ne coûtent pas deux fois plus cher.' },
    { phrase: 'la taille d\'un arbre selon son âge', proportionnel: false,
      pourquoi: 'un arbre ne grandit pas de la même hauteur chaque année.' },
    { phrase: 'le temps mis pour lire un livre selon son nombre de pages', proportionnel: false,
      pourquoi: 'on ne lit pas toutes les pages à la même vitesse.' }
  ];

  reg.ajouter({
    id: 'prp.identifier',
    matiere: 'mathematiques',
    objectifs: ['mat.prop.prop.01'],
    titre: 'Est-ce proportionnel ?',
    generer: function (r) {
      var s = r.choix(SITUATIONS_PROPORTIONNELLES);
      return {
        enonce: 'Y a-t-il proportionnalité entre les deux grandeurs : ' + s.phrase + ' ?',
        type: 'qcm',
        propositions: ['oui', 'non'],
        bonne_reponse: s.proportionnel ? 0 : 1,
        explication: (s.proportionnel ? 'Oui : ' : 'Non : ') + s.pourquoi
      };
    }
  });

  var ACHATS = [
    { objet: 'croissants', unite: 'croissant' },
    { objet: 'cahiers', unite: 'cahier' },
    { objet: 'stylos', unite: 'stylo' },
    { objet: 'timbres', unite: 'timbre' }
  ];

  reg.ajouter({
    id: 'prp.linearite_multiplicative',
    matiere: 'mathematiques',
    objectifs: ['mat.prop.prop.02'],
    titre: 'Proportionnalité : deux fois plus, trois fois plus',
    generer: function (r) {
      var a = r.choix(ACHATS);
      var quantite = r.entier(2, 8);
      var prixUnite = r.entier(2, 9);
      var facteur = r.entier(2, 5);

      var prix = quantite * prixUnite;
      var grandeQuantite = quantite * facteur;

      return {
        enonce: quantite + ' ' + a.objet + ' coûtent ' + prix + ' €. ' +
          'Combien coûtent ' + grandeQuantite + ' ' + a.objet + ' ?',
        type: 'saisie',
        bonne_reponse: String(prix * facteur),
        explication: grandeQuantite + ', c\'est ' + facteur + ' fois ' + quantite + '. ' +
          'Il faut donc ' + facteur + ' fois le prix : ' + prix + ' × ' + facteur + ' = ' +
          F.entier(prix * facteur) + ' €.'
      };
    }
  });

  reg.ajouter({
    id: 'prp.retour_a_l_unite',
    matiere: 'mathematiques',
    objectifs: ['mat.prop.prop.02'],
    titre: 'Proportionnalité : le prix d\'un seul',
    generer: function (r) {
      var a = r.choix(ACHATS);
      var quantite = r.entier(3, 9);
      var prixUnite = r.entier(2, 9);
      var voulu = r.entierSauf(2, 15, [quantite]);

      return {
        enonce: quantite + ' ' + a.objet + ' coûtent ' + (quantite * prixUnite) + ' €. ' +
          'Combien coûtent ' + voulu + ' ' + a.objet + ' ?',
        type: 'saisie',
        bonne_reponse: String(voulu * prixUnite),
        explication: 'On cherche d\'abord le prix d\'un seul ' + a.unite + ' : ' +
          (quantite * prixUnite) + ' ÷ ' + quantite + ' = ' + prixUnite + ' €. ' +
          'Puis on multiplie : ' + voulu + ' × ' + prixUnite + ' = ' +
          F.entier(voulu * prixUnite) + ' €.'
      };
    }
  });

  reg.ajouter({
    id: 'prp.linearite_additive',
    matiere: 'mathematiques',
    objectifs: ['mat.prop.prop.02'],
    titre: 'Proportionnalité : en additionnant deux cas connus',
    generer: function (r) {
      var a = r.choix(ACHATS);
      var q1 = r.entier(2, 6);
      var q2 = r.entier(2, 6);
      var prixUnite = r.entier(2, 9);

      return {
        enonce: q1 + ' ' + a.objet + ' coûtent ' + (q1 * prixUnite) + ' € et ' + q2 + ' ' +
          a.objet + ' coûtent ' + (q2 * prixUnite) + ' €. Combien coûtent ' + (q1 + q2) + ' ' +
          a.objet + ' ?',
        type: 'saisie',
        bonne_reponse: String((q1 + q2) * prixUnite),
        explication: (q1 + q2) + ' ' + a.objet + ', c\'est ' + q1 + ' plus ' + q2 + '. ' +
          'Les prix s\'additionnent de la même façon : ' + (q1 * prixUnite) + ' + ' +
          (q2 * prixUnite) + ' = ' + F.entier((q1 + q2) * prixUnite) + ' €.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
