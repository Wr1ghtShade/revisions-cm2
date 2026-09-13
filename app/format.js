/* Mise en forme des nombres selon les conventions françaises, et comparaison
   des réponses saisies. Centralisé ici pour que tous les générateurs écrivent
   les nombres de la même façon. */
(function (CM2) {
  'use strict';

  var F = {};

  /** 1234567 -> "1 234 567" (espace insécable fine par groupes de trois). */
  F.entier = function (n) {
    var negatif = n < 0;
    var s = String(Math.abs(n));
    var out = '';
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 === 0) out += ' ';
      out += s[i];
    }
    return (negatif ? '-' : '') + out;
  };

  /** 3.25 -> "3,25". Coupe les zéros inutiles au-delà de `decimales`. */
  F.decimal = function (x, decimales) {
    var d = decimales === undefined ? 3 : decimales;
    var s = x.toFixed(d);
    if (s.indexOf('.') !== -1) s = s.replace(/0+$/, '').replace(/\.$/, '');
    var parties = s.split('.');
    return F.entier(parseInt(parties[0], 10)) + (parties[1] ? ',' + parties[1] : '');
  };

  /** Fraction en notation « a/b ». */
  F.fraction = function (num, den) {
    return num + '/' + den;
  };

  /** Fraction mixte : 2 et 3/4 -> "2 + 3/4". */
  F.mixte = function (entier, num, den) {
    if (num === 0) return String(entier);
    if (entier === 0) return F.fraction(num, den);
    return entier + ' + ' + F.fraction(num, den);
  };

  /** Durée en h/min/s à partir d'un nombre de secondes. */
  F.duree = function (secondes) {
    var h = Math.floor(secondes / 3600);
    var m = Math.floor((secondes % 3600) / 60);
    var s = secondes % 60;
    var bouts = [];
    if (h) bouts.push(h + ' h');
    if (m) bouts.push(m + ' min');
    if (s || !bouts.length) bouts.push(s + ' s');
    return bouts.join(' ');
  };

  /** Heure sur une horloge : 9 h 05. */
  F.heure = function (h, m, s) {
    var t = h + ' h ' + (m < 10 ? '0' + m : m);
    if (s !== undefined) t += ' ' + (s < 10 ? '0' + s : s) + ' s';
    return t;
  };

  /** Une date AAAA-MM-JJ telle qu'on l'écrit en France : 13/09/2026.

      Les dates sont rangées en AAAA-MM-JJ dans les cahiers — cet ordre-là se
      trie tout seul, et c'est ce qui compte pour la machine. Mais c'est un
      adulte qui lit « la dernière sauvegarde date du… » : il faut alors la
      forme qu'il écrit lui-même. Les noms de fichiers, eux, gardent l'ordre
      qui trie. */
  F.date = function (iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    return m ? m[3] + '/' + m[2] + '/' + m[1] : String(iso || '');
  };

  /** Normalise une réponse saisie pour la comparer :
      espaces retirés, virgule ramenée au point, zéros de fin supprimés.
      « 3,50 », « 3.5 » et « 3,5 » sont donc acceptés à l'identique. */
  F.normaliser = function (saisie) {
    var s = String(saisie).trim().toLowerCase();
    s = s.replace(/[\s  ]/g, '');
    // Les claviers et les traitements de texte produisent plusieurs apostrophes
    // différentes : elles valent toutes l'apostrophe droite.
    s = s.replace(/[’ʼ´`]/g, '\'');
    s = s.replace(',', '.');
    if (/^-?\d+\.\d+$/.test(s)) {
      s = s.replace(/0+$/, '').replace(/\.$/, '');
    }
    return s;
  };

  /** Deux réponses sont-elles équivalentes ? */
  F.memeReponse = function (a, b) {
    return F.normaliser(a) === F.normaliser(b);
  };

  /** La réponse saisie est-elle acceptable pour cet exercice ?

      Un exercice peut déclarer `reponses_acceptees` : d'autres façons d'écrire
      la même réponse — « 1 h 30 » pour « 1 h 30 min ». Jamais une seconde
      réponse défendable : dans ce cas c'est l'énoncé qu'il faut corriger, pas
      la correction qu'il faut élargir. */
  F.accepte = function (saisie, bonne, autres) {
    if (F.memeReponse(saisie, bonne)) return true;
    if (!autres) return false;
    for (var i = 0; i < autres.length; i++) {
      if (F.memeReponse(saisie, autres[i])) return true;
    }
    return false;
  };

  /** Accord singulier/pluriel simple pour les énoncés générés. */
  F.pluriel = function (n, singulier, pluriel) {
    return n > 1 ? pluriel : singulier;
  };

  CM2.format = F;
})(window.CM2 = window.CM2 || {});
