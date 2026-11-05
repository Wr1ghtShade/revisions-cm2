/* Les matières — table unique.

   Tout ce qui énumère les matières en découle : les libellés du tableau et des
   fiches, le code lettre des références de fiche, le motif qui relit ces
   références, la phrase de la fenêtre « à propos » et les compteurs de
   l'accueil.

   Avant cette table, les mêmes énumérations vivaient à sept endroits. Deux
   fois, une matière ajoutée à l'un et oubliée dans un autre a produit un défaut
   silencieux : une lettre « R » présente dans la table des codes mais absente
   du motif de relecture laissait imprimer des fiches dont la référence ne
   ramenait plus rien.

   Ce qui reste écrit en dur dans index.html — les boutons de matière et les
   jetons de compteurs — est confronté à cette table par tests/verifier.js :
   une matière ajoutée ici sans son bouton fait échouer les contrôles.

   Champs :
     id       l'identifiant porté par les générateurs (spec.matiere)
     code     une lettre, dans la référence d'une fiche (« 21I3V9-R30 »)
     nom      titre du tableau pendant une série
     nomFiche titre d'une fiche imprimée (l'EMC s'y appelle « Vivre en
              république », comme sur son bouton)
     phrase   complément dans la fenêtre « à propos » (« 114 en … »)
     compteur id du jeton de l'accueil qui affiche le nombre d'exercices */
(function (CM2) {
  'use strict';

  var LISTE = [
    { id: 'mathematiques', code: 'M', nom: 'Mathématiques',
      nomFiche: 'Mathématiques', phrase: 'en mathématiques', compteur: 'compte-maths' },
    { id: 'francais', code: 'F', nom: 'Français',
      nomFiche: 'Français', phrase: 'en français', compteur: 'compte-francais' },
    { id: 'sciences', code: 'S', nom: 'Sciences et technologie',
      nomFiche: 'Sciences et technologie', phrase: 'en sciences et technologie',
      compteur: 'compte-sciences' },
    { id: 'histoire_geo', code: 'H', nom: 'Histoire et géographie',
      nomFiche: 'Histoire et géographie', phrase: 'en histoire-géographie',
      compteur: 'compte-histoire-geo' },
    { id: 'numerique', code: 'N', nom: 'Le numérique',
      nomFiche: 'Le numérique', phrase: 'en numérique', compteur: 'compte-numerique' },
    { id: 'emc', code: 'C', nom: 'Enseignement moral et civique',
      nomFiche: 'Vivre en république', phrase: 'en enseignement moral et civique',
      compteur: 'compte-emc' },
    { id: 'revisions', code: 'R', nom: 'Révisions',
      nomFiche: 'Révisions', phrase: 'en révisions', compteur: 'compte-revisions' }
  ];

  /* « Toutes les matières » n'est pas une matière — aucun générateur ne la
     porte — mais elle se choisit, s'imprime et se relit comme les autres. */
  var TOUT = { id: 'tout', code: 'T', nom: 'Toutes les matières',
               nomFiche: 'Toutes les matières' };

  // Sans prototype : un identifiant venu d'un cahier importé (« constructor »)
  // ne doit pas remonter jusqu'à Object.prototype et passer pour une matière.
  var parId = Object.create(null), parCode = Object.create(null);
  LISTE.concat([TOUT]).forEach(function (m) {
    if (parId[m.id]) throw new Error('matières : identifiant en double « ' + m.id + ' »');
    if (parCode[m.code]) throw new Error('matières : code en double « ' + m.code + ' »');
    if (!/^[A-Z]$/.test(m.code)) throw new Error('matières : code invalide « ' + m.code + ' »');
    parId[m.id] = m;
    parCode[m.code] = m;
  });

  CM2.matieres = {
    /** Les vraies matières, dans l'ordre des boutons (sans « tout »). */
    liste: LISTE,
    tout: TOUT,
    /** Une matière ou « tout » par son identifiant, sinon null. */
    get: function (id) { return parId[id] || null; },
    /** Une matière ou « tout » par son code lettre, sinon null. */
    depuisCode: function (code) { return parCode[code] || null; },
    /** Toutes les lettres reconnues, « tout » compris : « MFSHNCRT ». */
    codes: function () { return Object.keys(parCode).join(''); }
  };
})(window.CM2 = window.CM2 || {});
