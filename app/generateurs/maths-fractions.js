/* Fractions. Référentiel : mat.nc.fractions.

   Contrainte du programme : dénominateur au plus égal à 60, sauf fractions
   décimales. On reste ici sous 20 pour que le calcul mental soit possible sans
   calculatrice — les élèves n'en ont pas.

   Additions et soustractions : dénominateurs égaux, ou l'un multiple de l'autre.
   La réduction au même dénominateur par produit croisé n'est pas au programme. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  var DENOMINATEURS = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 20];

  function fr(n, d) { return n + '/' + d; }

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'fra.equivalente',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.01'],
    titre: 'Fractions égales',
    generer: function (r) {
      var d = r.choix([2, 3, 4, 5, 6]);
      var n = r.entier(1, d - 1);
      var k = r.entier(2, 5);
      var bonne = { n: n * k, d: d * k };

      var candidats = [
        { n: n * k, d: d },          // on n'a multiplié que le numérateur
        { n: n, d: d * k },          // on n'a multiplié que le dénominateur
        { n: n + k, d: d + k },      // on a ajouté au lieu de multiplier
        { n: n * (k + 1), d: d * k },
        { n: n * k, d: d * (k + 1) }
      ].filter(function (c) { return c.d <= 60 && c.n < c.d * 4; });

      function afficher(c) { return fr(c.n, c.d); }
      var choix = Q.construire(r, bonne, r.melanger(candidats), afficher);

      return {
        enonce: 'Quelle fraction est égale à ' + fr(n, d) + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: fr(n, d) + ' = ' + fr(bonne.n, bonne.d) + ' : on multiplie le numérateur ' +
          'et le dénominateur par le même nombre, ici ' + k + '.'
      };
    }
  });

  reg.ajouter({
    id: 'fra.vers_mixte',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.02'],
    titre: 'Entier plus fraction',
    generer: function (r) {
      var d = r.choix(DENOMINATEURS);
      var e = r.entier(1, 6);
      var reste = r.entier(1, d - 1);
      var n = e * d + reste;

      return {
        enonce: 'Écris ' + fr(n, d) + ' sous la forme d\'un entier plus une fraction inférieure à 1. ' +
          '(Réponds sous la forme « 3 + 2/5 ».)',
        type: 'saisie',
        bonne_reponse: F.mixte(e, reste, d),
        explication: n + ' = ' + e + ' × ' + d + ' + ' + reste + ', donc ' +
          fr(n, d) + ' = ' + F.mixte(e, reste, d) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'fra.depuis_mixte',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.03'],
    titre: 'Une seule fraction',
    generer: function (r) {
      var d = r.choix(DENOMINATEURS);
      var e = r.entier(1, 6);
      var reste = r.entier(1, d - 1);
      var n = e * d + reste;

      return {
        enonce: 'Écris ' + F.mixte(e, reste, d) + ' sous la forme d\'une seule fraction.',
        type: 'saisie',
        bonne_reponse: fr(n, d),
        explication: e + ' = ' + fr(e * d, d) + ', donc ' + F.mixte(e, reste, d) + ' = ' +
          fr(e * d, d) + ' + ' + fr(reste, d) + ' = ' + fr(n, d) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'fra.encadrer',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.04'],
    titre: 'Encadrer une fraction',
    generer: function (r) {
      var d = r.choix(DENOMINATEURS);
      var e = r.entier(1, 8);
      var n = e * d + r.entier(1, d - 1);

      function afficher(v) { return v + ' et ' + (v + 1); }
      var choix = Q.construire(r, e, [e - 1, e + 1, e + 2].filter(function (v) { return v >= 0; }), afficher);

      return {
        enonce: 'Entre quels nombres entiers consécutifs se trouve ' + fr(n, d) + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: fr(e * d, d) + ' = ' + e + ' et ' + fr((e + 1) * d, d) + ' = ' + (e + 1) +
          ', donc ' + e + ' < ' + fr(n, d) + ' < ' + (e + 1) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'fra.comparer',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.07'],
    titre: 'Comparer deux fractions',
    generer: function (r) {
      var cas = r.entier(1, 3);
      var a, b, raison;

      if (cas === 1) {
        // Même dénominateur.
        var d1 = r.choix(DENOMINATEURS);
        var n1 = r.entier(1, d1 * 2);
        var n2;
        do { n2 = r.entier(1, d1 * 2); } while (n2 === n1);
        a = { n: n1, d: d1 };
        b = { n: n2, d: d1 };
        raison = 'À dénominateur égal, la plus grande fraction est celle qui a le plus grand numérateur.';
      } else if (cas === 2) {
        // Même numérateur.
        var num = r.entier(1, 9);
        var da = r.choix(DENOMINATEURS);
        var db;
        do { db = r.choix(DENOMINATEURS); } while (db === da);
        a = { n: num, d: da };
        b = { n: num, d: db };
        raison = 'À numérateur égal, la plus grande fraction est celle qui a le plus petit dénominateur : ' +
          'plus on partage en parts nombreuses, plus chaque part est petite.';
      } else {
        // Un dénominateur multiple de l'autre.
        var petit = r.choix([2, 3, 4, 5, 6]);
        var k = r.entier(2, 4);
        var grand = petit * k;
        var na = r.entier(1, petit * 2);
        var nb;
        do { nb = r.entier(1, grand * 2); } while (nb === na * k);
        a = { n: na, d: petit };
        b = { n: nb, d: grand };
        raison = 'On écrit les deux fractions avec le même dénominateur : ' +
          fr(na, petit) + ' = ' + fr(na * k, grand) + '.';
      }

      var va = a.n / a.d;
      var vb = b.n / b.d;
      var signe = va < vb ? '<' : '>';

      return {
        enonce: 'Complète avec le signe < ou > : ' + fr(a.n, a.d) + ' … ' + fr(b.n, b.d),
        type: 'saisie',
        bonne_reponse: signe,
        explication: fr(a.n, a.d) + ' ' + signe + ' ' + fr(b.n, b.d) + '. ' + raison
      };
    }
  });

  reg.ajouter({
    id: 'fra.additionner',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.08'],
    titre: 'Additionner des fractions',
    generer: function (r) {
      var memeDenominateur = r.chance(0.6);
      var a, b, d;

      if (memeDenominateur) {
        d = r.choix(DENOMINATEURS);
        a = { n: r.entier(1, d), d: d };
        b = { n: r.entier(1, d), d: d };
      } else {
        var petit = r.choix([2, 3, 4, 5, 6]);
        var k = r.entier(2, 4);
        d = petit * k;
        a = { n: r.entier(1, petit), d: petit };
        b = { n: r.entier(1, d), d: d };
      }

      var na = a.n * (d / a.d);
      var somme = na + b.n;

      var candidats = [
        somme + 1, somme - 1, a.n + b.n, somme + d
      ].filter(function (v) { return v > 0; });

      function afficher(v) { return fr(v, d); }
      var choix = Q.construire(r, somme, r.melanger(candidats), afficher);

      var detail = memeDenominateur
        ? 'Les dénominateurs sont déjà égaux : on additionne les numérateurs et on garde le dénominateur.'
        : fr(a.n, a.d) + ' = ' + fr(na, d) + ', donc ' + fr(na, d) + ' + ' + fr(b.n, d) + ' = ' + fr(somme, d) + '.';

      return {
        enonce: 'Calcule ' + fr(a.n, a.d) + ' + ' + fr(b.n, b.d) + '.',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: fr(a.n, a.d) + ' + ' + fr(b.n, b.d) + ' = ' + fr(somme, d) + '. ' + detail
      };
    }
  });

  reg.ajouter({
    id: 'fra.soustraire',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.08'],
    titre: 'Soustraire des fractions',
    generer: function (r) {
      var memeDenominateur = r.chance(0.6);
      var d, a, b;

      if (memeDenominateur) {
        d = r.choix(DENOMINATEURS);
        var n1 = r.entier(2, d);
        var n2 = r.entier(1, n1 - 1);
        a = { n: n1, d: d };
        b = { n: n2, d: d };
      } else {
        var petit = r.choix([2, 3, 4, 5, 6]);
        var k = r.entier(2, 4);
        d = petit * k;
        var np = r.entier(1, petit);
        a = { n: np, d: petit };
        b = { n: r.entier(1, np * k - 1), d: d };
      }

      var na = a.n * (d / a.d);
      var diff = na - b.n;

      var candidats = [diff + 1, diff - 1, diff + d, na + b.n]
        .filter(function (v) { return v > 0; });

      function afficher(v) { return fr(v, d); }
      var choix = Q.construire(r, diff, r.melanger(candidats), afficher);

      var detail = memeDenominateur
        ? 'Les dénominateurs sont égaux : on soustrait les numérateurs et on garde le dénominateur.'
        : fr(a.n, a.d) + ' = ' + fr(na, d) + ', donc ' + fr(na, d) + ' − ' + fr(b.n, d) + ' = ' + fr(diff, d) + '.';

      return {
        enonce: 'Calcule ' + fr(a.n, a.d) + ' − ' + fr(b.n, b.d) + '.',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: fr(a.n, a.d) + ' − ' + fr(b.n, b.d) + ' = ' + fr(diff, d) + '. ' + detail
      };
    }
  });

  reg.ajouter({
    id: 'fra.produit_entier',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.09'],
    titre: 'Multiplier une fraction par un entier',
    generer: function (r) {
      var d = r.choix(DENOMINATEURS);
      var n = r.entier(1, d - 1);
      var k = r.entier(2, 9);
      var produit = n * k;

      var candidats = [n * k + d, n + k, produit + 1, produit - 1]
        .filter(function (v) { return v > 0; });

      function afficher(v) { return fr(v, d); }
      var choix = Q.construire(r, produit, r.melanger(candidats), afficher);

      return {
        enonce: 'Calcule ' + k + ' × ' + fr(n, d) + '.',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: k + ' × ' + fr(n, d) + ' revient à prendre ' + k + ' fois ' + n + ' ' +
          F.pluriel(n, 'part', 'parts') + ' : on multiplie le numérateur, le dénominateur ne change pas. ' +
          'Résultat : ' + fr(produit, d) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'fra.fraction_de_quantite',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.10'],
    titre: 'Une fraction d\'une quantité',
    generer: function (r) {
      var d = r.choix([2, 3, 4, 5, 6, 8, 10, 12]);
      var n = r.entier(1, d - 1);
      var part = r.entier(2, 12);
      var total = d * part;
      var reponse = n * part;

      var objets = r.choix([
        { mot: 'billes', verbe: 'a' },
        { mot: 'images', verbe: 'a' },
        { mot: 'gommettes', verbe: 'a' },
        { mot: 'perles', verbe: 'a' }
      ]);

      return {
        enonce: 'Léa ' + objets.verbe + ' ' + F.entier(total) + ' ' + objets.mot + '. ' +
          'Elle en prend ' + fr(n, d) + '. Combien cela fait-il de ' + objets.mot + ' ?',
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: 'Le tiers, le quart… : ici ' + fr(1, d) + ' de ' + F.entier(total) + ' vaut ' + F.entier(total) + ' ÷ ' + d +
          ' = ' + F.entier(part) + '. Il en faut ' + n + ', donc ' + n + ' × ' + F.entier(part) +
          ' = ' + F.entier(reponse) + '.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
