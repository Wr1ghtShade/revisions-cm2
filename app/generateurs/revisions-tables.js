/* Révisions — tables de multiplication de 0 à 10.

   Ces exercices rejouent un objectif du programme de CM2 :
   « mat.nc.calcul_mental.faits.01 — Connaître des faits numériques usuels avec
   des entiers », qui couvre explicitement les tables. Rien de hors-programme
   n'est introduit ici, et rien du CM1 : c'est le même objectif, servi à part.

   Pourquoi une matière « revisions » plutôt que les mathématiques : en début
   d'année, l'essentiel du programme de CM2 n'a pas encore été vu en classe.
   Cette matière rassemble ce qui peut être travaillé tout de suite, sans
   attendre que la notion soit enseignée. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;

  reg.ajouter({
    id: 'rev.tables_multiplication',
    matiere: 'revisions',
    objectifs: ['mat.nc.calcul_mental.faits.01'],
    titre: 'Tables de multiplication',
    generer: function (r) {
      var a = r.entier(0, 10);
      var b = r.entier(0, 10);
      var reponse = a * b;

      return {
        enonce: 'Calcule ' + a + ' × ' + b + '.',
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: a + ' × ' + b + ' = ' + reponse + '.'
      };
    }
  });

  reg.ajouter({
    id: 'rev.tables_facteur_manquant',
    matiere: 'revisions',
    objectifs: ['mat.nc.calcul_mental.faits.01'],
    titre: 'Tables : le nombre qui manque',
    generer: function (r) {
      /* Le facteur connu ne descend jamais à 0 : « 0 × ? = 0 » accepterait
         n'importe quelle réponse. Une question dont la bonne réponse n'est pas
         la seule défendable n'a pas sa place ici. Le facteur cherché, lui, peut
         valoir 0 — « 7 × ? = 0 » n'admet que 0. */
      var connu = r.entier(1, 10);
      var manquant = r.entier(0, 10);
      var produit = connu * manquant;

      return {
        enonce: 'Complète : ' + connu + ' × ? = ' + produit + '.',
        type: 'saisie',
        bonne_reponse: String(manquant),
        explication: connu + ' × ' + manquant + ' = ' + produit + '.'
      };
    }
  });
})(window.CM2 = window.CM2 || {});
