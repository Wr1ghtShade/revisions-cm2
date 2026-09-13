/* Écriture des nombres entiers en toutes lettres.

   Orthographe rectifiée de 1990 : tous les éléments sont reliés par des traits
   d'union (« deux-cent-trente-et-un »). C'est la graphie enseignée avec les
   programmes actuels.

   Limite volontaire à 999 999. Au-delà interviennent « million » et « milliard »,
   qui sont des noms et non des numéraux : leur accord et leur trait d'union sont
   discutés, et un exercice dont la forme attendue est discutable n'a rien à faire
   ici. Le champ numérique complet du CM2 (jusqu'à 999 999 999) reste travaillé
   par les générateurs qui n'écrivent pas en lettres. */
(function (CM2) {
  'use strict';

  var U = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit',
           'neuf', 'dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize'];
  var D = { 2: 'vingt', 3: 'trente', 4: 'quarante', 5: 'cinquante', 6: 'soixante' };

  /* 1..99. `suivi` : le groupe est-il suivi de « mille » ? (bloque le pluriel de vingt) */
  function deuxChiffres(n, suivi) {
    if (n < 17) return U[n];
    if (n < 20) return 'dix-' + U[n - 10];

    var d = Math.floor(n / 10);
    var u = n % 10;

    if (d === 7) {
      if (n === 71) return 'soixante-et-onze';
      return 'soixante-' + deuxChiffres(n - 60, suivi);
    }
    if (d === 9) {
      return 'quatre-vingt-' + deuxChiffres(n - 80, suivi);
    }
    if (d === 8) {
      if (u === 0) return 'quatre-vingt' + (suivi ? '' : 's');
      return 'quatre-vingt-' + U[u];
    }
    if (u === 0) return D[d];
    if (u === 1) return D[d] + '-et-un';
    return D[d] + '-' + U[u];
  }

  /* 1..999 */
  function groupe(n, suivi) {
    var c = Math.floor(n / 100);
    var r = n % 100;
    var s = '';
    if (c > 0) {
      s += (c > 1 ? U[c] + '-' : '') + 'cent';
      // « cent » ne prend l's que multiplié et non suivi d'un autre numéral.
      if (c > 1 && r === 0 && !suivi) s += 's';
    }
    if (r > 0) s += (c > 0 ? '-' : '') + deuxChiffres(r, suivi);
    return s;
  }

  /** Entier de 0 à 999 999 en toutes lettres. */
  function enLettres(n) {
    if (n < 0 || n > 999999 || n !== Math.floor(n)) {
      throw new Error('enLettres : ' + n + ' hors du domaine sûr (0 à 999 999)');
    }
    if (n === 0) return 'zéro';

    var milliers = Math.floor(n / 1000);
    var reste = n % 1000;
    var bouts = [];

    if (milliers > 0) {
      // « mille » est invariable, et « un mille » ne se dit pas.
      bouts.push(milliers === 1 ? 'mille' : groupe(milliers, true) + '-mille');
    }
    if (reste > 0) bouts.push(groupe(reste, false));

    return bouts.join('-');
  }

  CM2.lettres = { enLettres: enLettres, maximum: 999999 };
})(window.CM2 = window.CM2 || {});
