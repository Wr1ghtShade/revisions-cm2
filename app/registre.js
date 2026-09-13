/* Registre des générateurs.

   Un exercice n'est jamais stocké : il est identifié par (generateur_id, graine)
   et reconstruit à l'identique quand on en a besoin — pour le rejouer en
   révision espacée, ou pour revoir un exercice raté.

   Le registre est aussi le garde-fou : tout exercice produit passe par
   CM2.contraintes.verifierExercice avant d'être rendu. Un exercice
   hors-programme n'est pas servi, il lève une erreur. « Une question fausse
   est pire que pas de question. » */
(function (CM2) {
  'use strict';

  var specs = {};
  var ordre = [];

  var R = {};

  /** Déclare un générateur.
      spec = {
        id, matiere, objectifs: [ids du référentiel], titre,
        niveau?: 1..3, type?: 'qcm'|'saisie'|'mixte',
        optionnel?: true — le programme laisse le professeur choisir de traiter
                    ce sujet ou non. Ces générateurs ne sont jamais servis tant
                    que le cahier ne les a pas activés : interroger sur un sujet
                    qui n'a pas été vu en classe n'apprend rien et décourage.
        generer(rng) -> { enonce, type, propositions?, bonne_reponse, explication }
      } */
  R.ajouter = function (spec) {
    if (!spec || !spec.id) throw new Error('registre : générateur sans id');
    if (specs[spec.id]) throw new Error('registre : id en double « ' + spec.id + ' »');
    if (typeof spec.generer !== 'function') throw new Error('registre : ' + spec.id + ' n\'a pas de fonction generer');
    if (!spec.matiere) throw new Error('registre : ' + spec.id + ' sans matière');
    if (!Array.isArray(spec.objectifs) || !spec.objectifs.length) {
      throw new Error('registre : ' + spec.id + ' n\'est rattaché à aucun objectif du référentiel');
    }
    specs[spec.id] = spec;
    ordre.push(spec.id);
    return spec;
  };

  /** Produit l'exercice (id, graine). Déterministe. */
  R.produire = function (id, graine) {
    var spec = specs[id];
    if (!spec) throw new Error('registre : générateur inconnu « ' + id + ' »');

    var rng = new CM2.Rng(graine);
    var ex = spec.generer(rng);

    var contexte = id + '#' + graine;
    var erreurs = CM2.contraintes.verifierExercice(ex, contexte);
    if (erreurs.length) {
      throw new Error('exercice hors-programme — ' + erreurs.join(' ; '));
    }

    ex.generateur_id = id;
    ex.graine = graine >>> 0;
    ex.matiere = spec.matiere;
    ex.objectifs = spec.objectifs;
    ex.titre = spec.titre;
    return ex;
  };

  /** Tire une graine au hasard et produit l'exercice correspondant. */
  R.tirer = function (id) {
    return R.produire(id, (Math.random() * 4294967296) >>> 0);
  };

  R.liste = function () {
    return ordre.map(function (id) { return specs[id]; });
  };

  R.get = function (id) { return specs[id]; };

  /** Générateurs travaillant un objectif donné du référentiel. */
  R.pourObjectif = function (objectifId) {
    return R.liste().filter(function (s) { return s.objectifs.indexOf(objectifId) !== -1; });
  };

  R.parMatiere = function (matiere) {
    return R.liste().filter(function (s) { return s.matiere === matiere; });
  };

  /** Les sortes d'exercices que le programme laisse au choix du professeur.
      Le référentiel d'histoire en compte quatre : « parmi les sujets d'étude
      proposés, le professeur en choisit deux ». L'application ne peut pas
      deviner lesquels, donc elle ne les propose pas d'elle-même. */
  R.optionnels = function () {
    return R.liste().filter(function (s) { return s.optionnel === true; });
  };

  CM2.registre = R;
})(window.CM2 = window.CM2 || {});
