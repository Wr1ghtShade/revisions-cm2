/* Générateur pseudo-aléatoire déterministe.
   Une même graine redonne exactement la même suite, donc le même exercice.
   C'est ce qui permet de ne stocker que (generateur_id, graine) au lieu des énoncés. */
(function (CM2) {
  'use strict';

  function mulberry32(graine) {
    var a = graine >>> 0;
    return function () {
      a = (a + 0x6d2b79f5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function Rng(graine) {
    this.graine = graine >>> 0;
    this._suivant = mulberry32(this.graine);
  }

  /** Flottant dans [0, 1[. */
  Rng.prototype.reel = function () {
    return this._suivant();
  };

  /** Entier dans [min, max], bornes comprises. */
  Rng.prototype.entier = function (min, max) {
    return min + Math.floor(this._suivant() * (max - min + 1));
  };

  /** Un élément du tableau. */
  Rng.prototype.choix = function (tableau) {
    return tableau[this.entier(0, tableau.length - 1)];
  };

  /** true avec la probabilité p (0.5 par défaut). */
  Rng.prototype.chance = function (p) {
    return this._suivant() < (p === undefined ? 0.5 : p);
  };

  /** Copie mélangée (Fisher-Yates). Ne modifie pas l'original. */
  Rng.prototype.melanger = function (tableau) {
    var t = tableau.slice();
    for (var i = t.length - 1; i > 0; i--) {
      var j = this.entier(0, i);
      var tmp = t[i];
      t[i] = t[j];
      t[j] = tmp;
    }
    return t;
  };

  /** n éléments distincts tirés du tableau. */
  Rng.prototype.echantillon = function (tableau, n) {
    return this.melanger(tableau).slice(0, n);
  };

  /** Entier dans [min, max] différent de chacune des valeurs interdites.
      Renvoie null si l'intervalle ne contient aucune valeur libre. */
  Rng.prototype.entierSauf = function (min, max, interdits) {
    var libres = [];
    for (var v = min; v <= max; v++) {
      if (interdits.indexOf(v) === -1) libres.push(v);
    }
    return libres.length ? this.choix(libres) : null;
  };

  /** Graine reproductible à partir d'une chaîne (utile pour les tests). */
  Rng.graineDepuisTexte = function (texte) {
    var h = 2166136261 >>> 0;
    for (var i = 0; i < texte.length; i++) {
      h ^= texte.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  };

  CM2.Rng = Rng;
})(window.CM2 = window.CM2 || {});
