/* La vue enseignant : plusieurs cahiers lus ensemble.

   Ce fichier ne sait rien faire de neuf. Il relit, cahier par cahier, ce que
   app/bilan.js sait déjà dire d'un seul, et il rassemble. Rien n'est écrit,
   rien n'est ouvert : consulter le cahier d'un enfant ne doit pas y laisser
   de trace, ni déplacer le cahier ouvert.

   Ce que cette vue ne peut pas faire, et qu'il faut dire à l'écran plutôt que
   laisser croire :

   - elle ne voit que les cahiers rangés dans CE navigateur. Un enfant qui
     travaille sur un autre ordinateur n'y figure pas tant que son fichier de
     sauvegarde n'a pas été restauré ici ;
   - elle ne juge pas une notion vue moins de trois fois, comme partout
     ailleurs dans l'application ;
   - un exercice qui relève de deux domaines est compté dans les deux : les
     totaux par domaine dépassent le total général.

   Aucune donnée ne sort de l'ordinateur, ici pas plus qu'ailleurs. */
(function (CM2) {
  'use strict';

  var Cl = {};

  var P = CM2.profil;
  var B = CM2.bilan;

  /* Au-delà de ce nombre de jours sans ouvrir son cahier, l'enfant est signalé
     comme décroché. Une semaine : assez pour que ce ne soit pas un week-end. */
  var JOURS_SANS_NOUVELLES = 7;

  function taux(reussites, vus) { return vus ? reussites / vus : null; }

  /* --- Une ligne par enfant --------------------------------------------- */

  /** Pour chaque cahier de ce navigateur, de quoi remplir une ligne de
      tableau. Le résumé complet de chacun est joint : c'est lui qui sert au
      détail quand on choisit un enfant. */
  Cl.eleves = function () {
    var aujourdhui = P.aujourdhui();

    return P.tousLesCahiers().map(function (c) {
      var resume = B.resume(c);
      var depuis = c.derniereVisite ? P.joursDecart(c.derniereVisite, aujourdhui) : null;
      return {
        nom: c.nom,
        avatar: c.avatar,
        derniereVisite: c.derniereVisite,
        joursSansNouvelles: depuis,
        decroche: depuis !== null && depuis > JOURS_SANS_NOUVELLES,
        seances: resume.seances,
        questions: resume.questions,
        reussites: resume.reussites,
        taux: resume.taux,
        jugeable: resume.questions >= B.MINIMUM_POUR_JUGER,
        aRevoir: resume.aRevoir,
        enAttente: resume.enAttente,
        objectifsTravailles: resume.objectifsTravailles,
        objectifsPossibles: resume.objectifsPossibles,
        fragiles: resume.fragiles,
        acquises: resume.acquises,
        resume: resume
      };
    });
  };

  /* --- Ce qui coince, pour la classe entière ---------------------------- */

  /** Les notions qui résistent, rassemblées sur tous les cahiers.

      Une notion apparaît ici dès qu'elle résiste à un enfant ; ce qui trie la
      liste, c'est le nombre d'enfants concernés. Une notion qui coince chez
      cinq élèves ne se traite pas comme une notion qui coince chez un seul :
      la première demande d'y revenir en classe, la seconde un coup de main. */
  Cl.difficultesCommunes = function (combien) {
    var index = {};

    P.tousLesCahiers().forEach(function (c) {
      B.fragiles(1000, c).forEach(function (n) {
        var ligne = index[n.id];
        if (!ligne) {
          ligne = index[n.id] = {
            id: n.id, titre: n.titre, matiere: n.matiere, domaine: n.domaine,
            eleves: [], vus: 0, reussites: 0, taux: null
          };
        }
        ligne.eleves.push({ nom: c.nom, vus: n.vus, reussites: n.reussites, taux: n.taux });
        ligne.vus += n.vus;
        ligne.reussites += n.reussites;
      });
    });

    return Object.keys(index)
      .map(function (id) {
        var l = index[id];
        l.taux = taux(l.reussites, l.vus);
        return l;
      })
      .sort(function (a, b) {
        return (b.eleves.length - a.eleves.length) || (a.taux - b.taux);
      })
      .slice(0, combien || 10);
  };

  /* --- Les domaines du programme, pour la classe ------------------------ */

  /** Les mêmes domaines que sur l'écran de l'enfant, mais additionnés sur tous
      les cahiers : c'est ce qui montre où la classe accroche, et non un seul
      élève. `enfants` dit combien d'enfants ont réellement travaillé le
      domaine — un taux de 40 % venu d'un seul cahier ne se lit pas comme un
      taux de 40 % venu de six. */
  Cl.parDomaine = function (matiere) {
    var index = {}, ordre = [];

    P.tousLesCahiers().forEach(function (c) {
      B.parDomaine(matiere, c).forEach(function (d) {
        var ligne = index[d.id];
        if (!ligne) {
          ligne = index[d.id] = {
            id: d.id, nom: d.nom, matiere: d.matiere,
            vus: 0, reussites: 0, taux: null, enfants: 0
          };
          ordre.push(d.id);
        }
        ligne.vus += d.vus;
        ligne.reussites += d.reussites;
        if (d.vus > 0) ligne.enfants++;
      });
    });

    return ordre.map(function (id) {
      var l = index[id];
      l.taux = taux(l.reussites, l.vus);
      l.jugeable = l.vus >= B.MINIMUM_POUR_JUGER;
      return l;
    });
  };

  /* --- Vue d'ensemble ---------------------------------------------------- */

  /** De quoi écrire une phrase honnête sur l'ensemble des cahiers présents. */
  Cl.resume = function () {
    var eleves = Cl.eleves();
    var questions = 0, reussites = 0, aRevoir = 0;
    var decroches = [];
    var jamaisCommence = [];

    eleves.forEach(function (e) {
      questions += e.questions;
      reussites += e.reussites;
      aRevoir += e.aRevoir;
      if (e.decroche) decroches.push(e.nom);
      if (!e.questions) jamaisCommence.push(e.nom);
    });

    return {
      cahiers: eleves.length,
      questions: questions,
      reussites: reussites,
      taux: taux(reussites, questions),
      aRevoir: aRevoir,
      decroches: decroches,
      jamaisCommence: jamaisCommence,
      joursSansNouvelles: JOURS_SANS_NOUVELLES
    };
  };

  Cl.JOURS_SANS_NOUVELLES = JOURS_SANS_NOUVELLES;

  CM2.classe = Cl;
})(window.CM2 = window.CM2 || {});
