/* Fabrication des QCM.

   Un QCM n'est bon que si ses leurres sont plausibles *et* faux. Deux pièges
   qu'on évite ici systématiquement :
   - un leurre égal à la bonne réponse après mise en forme (« 3,50 » vs « 3,5 ») ;
   - une bonne réponse toujours à la même place.

   Les leurres sont donc filtrés sur la forme affichée, puis l'ordre est mélangé
   par le générateur pseudo-aléatoire — donc reproductible avec la graine. */
(function (CM2) {
  'use strict';

  var Q = {};

  /** Construit les propositions à partir d'une valeur juste et de leurres candidats.
      @param rng        instance de CM2.Rng
      @param bonne      la valeur correcte (nombre ou chaîne)
      @param candidats  tableau de leurres possibles, par ordre de pertinence
      @param formater   fonction valeur -> chaîne affichée (identité par défaut)
      @param nb         nombre total de propositions (4 par défaut)
      @return { propositions: [string], bonne_reponse: index } */
  Q.construire = function (rng, bonne, candidats, formater, nb) {
    var fmt = formater || function (v) { return String(v); };
    var total = nb || 4;

    var texteBon = fmt(bonne);
    var vus = {};
    vus[CM2.format.normaliser(texteBon)] = true;

    var leurres = [];
    candidats.forEach(function (c) {
      if (leurres.length >= total - 1) return;
      if (c === null || c === undefined) return;
      if (typeof c === 'number' && !isFinite(c)) return;
      var t = fmt(c);
      var cle = CM2.format.normaliser(t);
      if (vus[cle]) return;
      vus[cle] = true;
      leurres.push(t);
    });

    if (leurres.length < 1) {
      throw new Error('qcm : pas assez de leurres distincts pour « ' + texteBon + ' »');
    }

    var propositions = rng.melanger([texteBon].concat(leurres));
    var index = propositions.indexOf(texteBon);
    return { propositions: propositions, bonne_reponse: index };
  };

  /** Raccourci : QCM « range ces éléments dans l'ordre ».

      Quatre générateurs posent la même question sur des contenus différents —
      entiers, décimaux, fractions décimales, mots du dictionnaire — et se
      trompent tous de la même façon s'ils n'ont pas les mêmes leurres. Les
      leurres d'un rangement sont toujours les mêmes : la liste à l'envers, puis
      des permutations de deux éléments voisins ou éloignés. Une permutation de
      voisins est le piège utile : c'est l'erreur que l'on fait vraiment.

      @param trie      la liste déjà rangée dans le bon ordre
      @param afficher  liste -> chaîne affichée */
  Q.rangement = function (rng, trie, afficher) {
    function permuter(i, j) {
      if (i >= trie.length || j >= trie.length) return null;
      var t = trie.slice();
      var x = t[i]; t[i] = t[j]; t[j] = x;
      return t;
    }
    var candidats = [trie.slice().reverse(), permuter(0, 1), permuter(2, 3), permuter(1, 3)]
      .filter(function (c) { return c !== null; });
    return Q.construire(rng, trie, candidats, afficher);
  };

  /** Raccourci : QCM numérique dont les leurres sont des écarts autour du bon résultat. */
  Q.numerique = function (rng, bonne, ecarts, formater, nb) {
    var candidats = ecarts.map(function (e) { return bonne + e; })
                          .filter(function (v) { return v >= 0; });
    return Q.construire(rng, bonne, rng.melanger(candidats), formater, nb);
  };

  CM2.qcm = Q;
})(window.CM2 = window.CM2 || {});
