/* Résolution de problèmes. Référentiel : mat.nc.problemes, et
   mat.eg.deplacements.03 pour les assemblages de cubes — c'est un problème de
   dénombrement avant d'être de la géométrie.

   Les énoncés sont fabriqués à partir de situations courtes et concrètes, avec
   des nombres choisis pour que le calcul reste faisable de tête ou posé — les
   élèves n'ont pas de calculatrice. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  /* Le genre est porté par le prénom : sans lui, on écrit « Sarah en a-t-il »,
     ce qui saute aux yeux d'un lecteur de CM2 avant même la question. */
  var PRENOMS = [
    { nom: 'Léa', f: true }, { nom: 'Manon', f: true }, { nom: 'Sarah', f: true },
    { nom: 'Camille', f: true }, { nom: 'Paul', f: false }, { nom: 'Hugo', f: false },
    { nom: 'Lucas', f: false }, { nom: 'Théo', f: false }
  ];

  /* ------------------------------------------------------- Problèmes additifs */

  var SITUATIONS_ADDITIVES = [
    { objet: 'images', lieu: 'dans son album' },
    { objet: 'billes', lieu: 'dans son sac' },
    { objet: 'timbres', lieu: 'dans sa collection' },
    { objet: 'perles', lieu: 'dans sa boîte' },
    { objet: 'cartes', lieu: 'dans son classeur' }
  ];

  reg.ajouter({
    id: 'pb.additif',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.01'],
    titre: 'Problème d\'addition et de soustraction',
    generer: function (r) {
      var qui = r.choix(PRENOMS);
      var il = qui.f ? 'elle' : 'il';
      var s = r.choix(SITUATIONS_ADDITIVES);
      var depart = r.entier(45, 480);
      var gagne = r.entier(20, 250);
      var perdu = r.entier(10, Math.min(200, depart + gagne - 5));
      var reste = depart + gagne - perdu;

      return {
        enonce: qui.nom + ' a ' + F.entier(depart) + ' ' + s.objet + ' ' + s.lieu + '. ' +
          'On lui en offre ' + F.entier(gagne) + ', puis ' + qui.nom + ' en donne ' +
          F.entier(perdu) + ' à un ami. Combien lui en reste-t-' + il + ' ?',
        type: 'saisie',
        bonne_reponse: String(reste),
        explication: 'Deux étapes. D\'abord ' + F.entier(depart) + ' + ' + F.entier(gagne) +
          ' = ' + F.entier(depart + gagne) + '. Ensuite ' + F.entier(depart + gagne) + ' − ' +
          F.entier(perdu) + ' = ' + F.entier(reste) + '.'
      };
    }
  });

  /* --------------------------------------------- Problèmes « parties-tout » */

  var LOTS = [
    { contenant: 'paquets', contenu: 'gâteaux' },
    { contenant: 'boîtes', contenu: 'crayons' },
    { contenant: 'sachets', contenu: 'bonbons' },
    { contenant: 'cartons', contenu: 'livres' },
    { contenant: 'caisses', contenu: 'pommes' }
  ];

  reg.ajouter({
    id: 'pb.parties_tout',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.02'],
    titre: 'Problème de groupements',
    generer: function (r) {
      var l = r.choix(LOTS);
      var chercheLeTout = r.chance(0.6);
      var nombre = r.entier(6, 48);
      // Quand l'élève doit diviser, le diviseur reste dans les tables : la
      // division posée à deux chiffres n'est pas au programme du CM2.
      var parLot = chercheLeTout ? r.entier(4, 25) : r.entier(3, 9);

      if (chercheLeTout) {
        return {
          enonce: 'Un magasin reçoit ' + nombre + ' ' + l.contenant + ' de ' + parLot + ' ' +
            l.contenu + ' chacun. Combien de ' + l.contenu + ' a-t-il reçus en tout ?',
          type: 'saisie',
          bonne_reponse: String(nombre * parLot),
          explication: nombre + ' fois ' + parLot + ', c\'est une multiplication : ' +
            nombre + ' × ' + parLot + ' = ' + F.entier(nombre * parLot) + '.'
        };
      }
      return {
        enonce: 'Un magasin range ' + F.entier(nombre * parLot) + ' ' + l.contenu + ' dans des ' +
          l.contenant + ' de ' + parLot + ' ' + l.contenu + '. Combien de ' + l.contenant +
          ' remplit-il ?',
        type: 'saisie',
        bonne_reponse: String(nombre),
        explication: 'On cherche combien de fois ' + parLot + ' tient dans ' +
          F.entier(nombre * parLot) + ' : ' + F.entier(nombre * parLot) + ' ÷ ' + parLot +
          ' = ' + F.entier(nombre) + '.'
      };
    }
  });

  /* ------------------------------------------------------- Problèmes mixtes */

  reg.ajouter({
    id: 'pb.mixte',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.03'],
    titre: 'Problème à plusieurs étapes',
    generer: function (r) {
      var qui = r.choix(PRENOMS).nom;
      var prixUnite = r.entier(2, 12);
      var quantite = r.entier(3, 9);
      var autre = r.entier(5, 40);
      var donne = 50 * r.entier(2, 4);
      var depense = prixUnite * quantite + autre;
      if (depense >= donne) donne = Math.ceil((depense + 5) / 10) * 10;
      var rendu = donne - depense;

      return {
        enonce: qui + ' achète ' + quantite + ' cahiers à ' + prixUnite + ' € l\'un et un ' +
          'dictionnaire à ' + autre + ' €. ' + qui + ' paie avec ' + donne + ' €. ' +
          'Combien lui rend-on ?',
        type: 'saisie',
        bonne_reponse: String(rendu),
        explication: 'Les cahiers coûtent ' + quantite + ' × ' + prixUnite + ' = ' +
          F.entier(prixUnite * quantite) + ' €. Avec le dictionnaire : ' +
          F.entier(prixUnite * quantite) + ' + ' + autre + ' = ' + F.entier(depense) + ' €. ' +
          'On rend ' + donne + ' − ' + F.entier(depense) + ' = ' + F.entier(rendu) + ' €.'
      };
    }
  });

  /* -------------------------------------------- Comparaison multiplicative */

  reg.ajouter({
    id: 'pb.comparaison_multiplicative',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.04'],
    titre: 'Combien de fois plus ?',
    generer: function (r) {
      var deux = r.echantillon(PRENOMS, 2);
      var a = deux[0].nom, autre = deux[1];
      var il = autre.f ? 'elle' : 'il';
      var petit = r.entier(6, 40);
      var facteur = r.entier(3, 8);
      var chercheLeGrand = r.chance(0.5);

      if (chercheLeGrand) {
        return {
          enonce: a + ' a ' + petit + ' billes. ' + autre.nom + ' en a ' + facteur +
            ' fois plus. Combien ' + autre.nom + ' a-t-' + il + ' de billes ?',
          type: 'saisie',
          bonne_reponse: String(petit * facteur),
          explication: facteur + ' fois plus, c\'est ' + petit + ' × ' + facteur + ' = ' +
            F.entier(petit * facteur) + ' billes.'
        };
      }
      return {
        enonce: a + ' a ' + petit + ' billes et ' + autre.nom + ' en a ' +
          F.entier(petit * facteur) + '. Combien de fois plus de billes ' + autre.nom +
          ' a-t-' + il + ' ?',
        type: 'saisie',
        bonne_reponse: String(facteur),
        explication: 'On cherche par combien multiplier ' + petit + ' pour obtenir ' +
          F.entier(petit * facteur) + ' : ' + F.entier(petit * facteur) + ' ÷ ' + petit +
          ' = ' + facteur + '. ' + autre.nom + ' en a ' + facteur + ' fois plus.'
      };
    }
  });

  /* ------------------------------------------------------- Dénombrement */

  /* `combien` porte sa préposition, élidée si besoin : « combien d'associations »
     et non « combien de associations ». */
  var TENUES = [
    { a: 'tee-shirts', b: 'pantalons', tout: 'tenues différentes', combien: 'de tenues différentes' },
    { a: 'parfums de glace', b: 'sortes de cornets', tout: 'glaces différentes', combien: 'de glaces différentes' },
    { a: 'sortes de pain', b: 'garnitures', tout: 'sandwichs différents', combien: 'de sandwichs différents' },
    { a: 'couleurs de stylo', b: 'sortes de carnets', tout: 'associations différentes', combien: 'd\'associations différentes' }
  ];

  reg.ajouter({
    id: 'pb.denombrement',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.05'],
    titre: 'Compter toutes les possibilités',
    generer: function (r) {
      var t = r.choix(TENUES);
      var a = r.entier(3, 7);
      var b = r.entier(3, 6);

      var choix = Q.numerique(r, a * b, [a + b, a * b + a, a * b - b, a * b + b], String);

      return {
        enonce: 'Il y a ' + a + ' ' + t.a + ' et ' + b + ' ' + t.b + '. ' +
          'Combien ' + t.combien + ' peut-on composer ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Pour chacun des ' + a + ' ' + t.a + ', il y a ' + b + ' possibilités. ' +
          'Cela fait ' + a + ' × ' + b + ' = ' + (a * b) + ' ' + t.tout + '.'
      };
    }
  });

  /* -------------------------------------------------------- Optimisation */

  reg.ajouter({
    id: 'pb.optimisation',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.06'],
    titre: 'Combien faut-il en prévoir ?',
    generer: function (r) {
      var contenance = r.choix([6, 8, 10, 12, 15, 24]);
      var quotient = r.entier(3, 20);
      var reste = r.entier(1, contenance - 1);
      var total = quotient * contenance + reste;

      var s = r.choix([
        { objet: 'œufs', contenant: 'boîtes', une: 'une boîte' },
        { objet: 'élèves', contenant: 'tables', une: 'une table' },
        { objet: 'bouteilles', contenant: 'casiers', une: 'un casier' },
        { objet: 'gâteaux', contenant: 'paquets', une: 'un paquet' }
      ]);

      return {
        enonce: 'Il faut ranger ' + F.entier(total) + ' ' + s.objet + ' dans des ' + s.contenant +
          ' qui en contiennent ' + contenance + ' au maximum. Combien de ' + s.contenant +
          ' faut-il ?',
        type: 'saisie',
        bonne_reponse: String(quotient + 1),
        explication: F.entier(total) + ' = ' + contenance + ' × ' + quotient + ' + ' + reste +
          '. Il faut ' + quotient + ' ' + s.contenant + ' pleins, et il reste ' + reste + ' ' +
          s.objet + ' : il faut donc ' + s.une + ' de plus, soit ' + (quotient + 1) +
          ' en tout. Attention, la division seule ne suffit pas ici.'
      };
    }
  });

  /* ---------------------------------------------- Préparation aux algorithmes */

  reg.ajouter({
    id: 'pb.rendre_la_monnaie',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.problemes.07'],
    titre: 'Rendre la monnaie avec le moins de pièces',
    generer: function (r) {
      var VALEURS = [20, 10, 5, 2, 1];
      var somme = r.entier(3, 48);

      var reste = somme, detail = [], total = 0;
      VALEURS.forEach(function (v) {
        var n = Math.floor(reste / v);
        if (n > 0) {
          detail.push(n + ' × ' + v + ' €');
          total += n;
          reste -= n * v;
        }
      });

      return {
        enonce: 'On rend ' + somme + ' € avec des billets de 20 € et de 10 €, et des pièces de ' +
          '5 €, 2 € et 1 €. Quel est le plus petit nombre de billets et de pièces possible ?',
        type: 'saisie',
        bonne_reponse: String(total),
        explication: 'On commence toujours par la plus grosse valeur possible, puis on continue ' +
          'avec ce qui reste : ' + detail.join(' + ') + '. Cela fait ' + total +
          ' billets et pièces en tout.'
      };
    }
  });

  /* ------------------------------------------------- Assemblages de cubes

     Référentiel : mat.eg.deplacements.03, « résoudre des problèmes portant sur
     des assemblages de cubes ». La construction, elle, se fait avec de vrais
     cubes sur une table ; ce qui s'évalue ici, c'est le dénombrement — voir
     l'empilement dans sa tête et le compter par couches.

     Les trois dimensions restent petites : l'enfant doit pouvoir se représenter
     le pavé, pas seulement multiplier trois nombres. */

  reg.ajouter({
    id: 'pb.assemblage_cubes',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.deplacements.03'],
    titre: 'Compter les cubes d\'un empilement',
    generer: function (r) {
      var L = r.entier(2, 6);
      var l = r.entier(2, 5);
      var h = r.entier(2, 5);
      var total = L * l * h;
      var couche = L * l;

      var cas = r.entier(1, 3);

      if (cas === 1) {
        return {
          enonce: 'On empile des cubes identiques pour former un gros pavé de ' + L +
            ' cubes de long, ' + l + ' cubes de large et ' + h + ' cubes de haut. ' +
            'Combien de cubes faut-il en tout ?',
          type: 'saisie',
          bonne_reponse: String(total),
          explication: 'Chaque couche compte ' + L + ' × ' + l + ' = ' + couche + ' cubes, et ' +
            'il y a ' + h + ' couches : ' + couche + ' × ' + h + ' = ' + F.entier(total) + ' cubes.'
        };
      }

      if (cas === 2) {
        // Un pavé auquel il manque les cubes d'une ou deux couches entières :
        // on compte ce qui est là, puis ce qui manque.
        var posees = r.entier(1, h - 1);
        var manquants = (h - posees) * couche;
        return {
          enonce: 'On veut construire un pavé de ' + L + ' cubes de long, ' + l +
            ' cubes de large et ' + h + ' cubes de haut. ' + posees +
            (posees > 1 ? ' couches sont déjà posées' : ' couche est déjà posée') +
            '. Combien de cubes manque-t-il pour finir ?',
          type: 'saisie',
          bonne_reponse: String(manquants),
          explication: 'Une couche compte ' + L + ' × ' + l + ' = ' + couche + ' cubes. Il ' +
            'reste ' + h + ' − ' + posees + ' = ' + (h - posees) + ' ' +
            F.pluriel(h - posees, 'couche', 'couches') + ' à poser, soit ' +
            (h - posees) + ' × ' + couche + ' = ' + F.entier(manquants) + ' cubes.'
        };
      }

      // Combien de cubes touchent la table : c'est la couche du bas, et elle
      // ne dépend pas de la hauteur.
      return {
        enonce: 'Un pavé est construit avec des cubes identiques : ' + L + ' cubes de long, ' +
          l + ' cubes de large et ' + h + ' cubes de haut. Combien de cubes touchent la table ?',
        type: 'saisie',
        bonne_reponse: String(couche),
        explication: 'Seule la couche du bas touche la table : elle compte ' + L + ' × ' + l +
          ' = ' + couche + ' cubes. La hauteur de l\'empilement n\'y change rien.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
