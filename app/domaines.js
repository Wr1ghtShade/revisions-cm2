/* Les domaines du programme, pour rattacher ce qui est travaillé au texte
   officiel plutôt qu'à une liste de titres d'exercices.

   FICHIER GÉNÉRÉ — ne pas modifier à la main.
       node tests/generer-domaines.js
   Les noms viennent de data/referentiel/*.json, qui reste la source. Les
   JSON ne peuvent pas être lus au chargement : ouverte depuis le disque, la
   page n'a pas le droit de faire fetch(). */
(function (CM2) {
  'use strict';

  var DOMAINES = [
    { matiere: "mathematiques", id: "mat.nc",
      nom: "Nombres, calcul et résolution de problèmes",
      sous: [
        { id: "mat.nc.entiers", nom: "Les nombres entiers",
          objectifs: ["mat.nc.entiers.01","mat.nc.entiers.02","mat.nc.entiers.03","mat.nc.entiers.04","mat.nc.entiers.05","mat.nc.entiers.06","mat.nc.entiers.07","mat.nc.entiers.08","mat.nc.entiers.09","mat.nc.entiers.10","mat.nc.entiers.11","mat.nc.entiers.12"] },
        { id: "mat.nc.fractions", nom: "Les fractions",
          objectifs: ["mat.nc.fractions.01","mat.nc.fractions.02","mat.nc.fractions.03","mat.nc.fractions.04","mat.nc.fractions.05","mat.nc.fractions.06","mat.nc.fractions.07","mat.nc.fractions.08","mat.nc.fractions.09","mat.nc.fractions.10"] },
        { id: "mat.nc.decimaux", nom: "Les nombres décimaux",
          objectifs: ["mat.nc.decimaux.01","mat.nc.decimaux.02","mat.nc.decimaux.03","mat.nc.decimaux.04","mat.nc.decimaux.05","mat.nc.decimaux.06","mat.nc.decimaux.07","mat.nc.decimaux.08","mat.nc.decimaux.09","mat.nc.decimaux.10","mat.nc.decimaux.11","mat.nc.decimaux.12"] },
        { id: "mat.nc.calcul_mental", nom: "Le calcul mental",
          objectifs: ["mat.nc.calcul_mental.faits.01","mat.nc.calcul_mental.faits.02","mat.nc.calcul_mental.faits.03","mat.nc.calcul_mental.faits.04","mat.nc.calcul_mental.numeration.01","mat.nc.calcul_mental.numeration.02","mat.nc.calcul_mental.numeration.03","mat.nc.calcul_mental.numeration.04","mat.nc.calcul_mental.procedures.01","mat.nc.calcul_mental.procedures.02","mat.nc.calcul_mental.procedures.03","mat.nc.calcul_mental.procedures.04","mat.nc.calcul_mental.procedures.05","mat.nc.calcul_mental.procedures.06","mat.nc.calcul_mental.procedures.07","mat.nc.calcul_mental.procedures.08","mat.nc.calcul_mental.procedures.09"] },
        { id: "mat.nc.operations", nom: "Les quatre opérations",
          objectifs: ["mat.nc.operations.01","mat.nc.operations.02","mat.nc.operations.03","mat.nc.operations.04","mat.nc.operations.05"] },
        { id: "mat.nc.problemes", nom: "La résolution de problèmes",
          objectifs: ["mat.nc.problemes.01","mat.nc.problemes.02","mat.nc.problemes.03","mat.nc.problemes.04","mat.nc.problemes.05","mat.nc.problemes.06","mat.nc.problemes.07"] },
        { id: "mat.nc.algebre", nom: "Algèbre",
          objectifs: ["mat.nc.algebre.01","mat.nc.algebre.02","mat.nc.algebre.03","mat.nc.algebre.04","mat.nc.algebre.05","mat.nc.algebre.06"] }
      ] },

    { matiere: "mathematiques", id: "mat.gm",
      nom: "Grandeurs et mesures",
      sous: [
        { id: "mat.gm.aires", nom: "Les aires",
          objectifs: ["mat.gm.aires.01","mat.gm.aires.02","mat.gm.aires.03","mat.gm.aires.04","mat.gm.aires.05"] },
        { id: "mat.gm.angles", nom: "Les angles",
          objectifs: ["mat.gm.angles.01","mat.gm.angles.02","mat.gm.angles.03","mat.gm.angles.04","mat.gm.angles.05","mat.gm.angles.06"] },
        { id: "mat.gm.temps", nom: "Le repérage dans le temps et les durées",
          objectifs: ["mat.gm.temps.01","mat.gm.temps.02","mat.gm.temps.03","mat.gm.temps.04"] }
      ] },

    { matiere: "mathematiques", id: "mat.eg",
      nom: "Espace et géométrie",
      sous: [
        { id: "mat.eg.plane", nom: "La géométrie plane",
          objectifs: ["mat.eg.plane.01","mat.eg.plane.02","mat.eg.plane.03","mat.eg.plane.04","mat.eg.plane.05","mat.eg.plane.06","mat.eg.plane.07","mat.eg.plane.08","mat.eg.plane.09","mat.eg.plane.10","mat.eg.plane.11","mat.eg.plane.12"] },
        { id: "mat.eg.solides", nom: "Les solides",
          objectifs: ["mat.eg.solides.01","mat.eg.solides.02","mat.eg.solides.03","mat.eg.solides.04","mat.eg.solides.05"] },
        { id: "mat.eg.deplacements", nom: "Déplacements dans l'espace",
          objectifs: ["mat.eg.deplacements.01","mat.eg.deplacements.02","mat.eg.deplacements.03"] }
      ] },

    { matiere: "mathematiques", id: "mat.ogd",
      nom: "Organisation et gestion de données et probabilités",
      sous: [
        { id: "mat.ogd.donnees", nom: "Organisation et gestion de données",
          objectifs: ["mat.ogd.donnees.01","mat.ogd.donnees.02","mat.ogd.donnees.03"] },
        { id: "mat.ogd.probabilites", nom: "Les probabilités",
          objectifs: ["mat.ogd.probabilites.01","mat.ogd.probabilites.02","mat.ogd.probabilites.03","mat.ogd.probabilites.04","mat.ogd.probabilites.05","mat.ogd.probabilites.06"] }
      ] },

    { matiere: "mathematiques", id: "mat.prop",
      nom: "La proportionnalité",
      sous: [
        { id: "mat.prop.prop", nom: "La proportionnalité",
          objectifs: ["mat.prop.prop.01","mat.prop.prop.02"] }
      ] },

    { matiere: "mathematiques", id: "mat.info",
      nom: "Initiation à la pensée informatique",
      sous: [
      ] },

    { matiere: "francais", id: "fra.lecture",
      nom: "Lecture",
      sous: [
        { id: "fra.lecture.fluidite", nom: "Lire avec fluidité",
          objectifs: ["fra.lecture.fluidite.01","fra.lecture.fluidite.02","fra.lecture.fluidite.03"] },
        { id: "fra.lecture.expressivite", nom: "Lire à voix haute avec expressivité",
          objectifs: ["fra.lecture.expressivite.01","fra.lecture.expressivite.02","fra.lecture.expressivite.03"] },
        { id: "fra.lecture.comprendre_seul", nom: "Lire et comprendre seul des textes, des documents et des images",
          objectifs: ["fra.lecture.comprendre_seul.01","fra.lecture.comprendre_seul.02","fra.lecture.comprendre_seul.03"] },
        { id: "fra.lecture.apprendre", nom: "Lire et comprendre des textes, des documents et des images pour apprendre dans toutes les disciplines",
          objectifs: ["fra.lecture.apprendre.01","fra.lecture.apprendre.02","fra.lecture.apprendre.03"] },
        { id: "fra.lecture.oeuvre", nom: "Lire une œuvre et se l'approprier",
          objectifs: ["fra.lecture.oeuvre.01","fra.lecture.oeuvre.02","fra.lecture.oeuvre.03","fra.lecture.oeuvre.04"] }
      ] },

    { matiere: "francais", id: "fra.culture",
      nom: "Culture littéraire et artistique",
      sous: [
      ] },

    { matiere: "francais", id: "fra.ecriture",
      nom: "Écriture",
      sous: [
        { id: "fra.ecriture.geste", nom: "Écrire à la main de manière fluide et efficace",
          objectifs: ["fra.ecriture.geste.01","fra.ecriture.geste.02"] },
        { id: "fra.ecriture.reflexif", nom: "Écrire pour réfléchir, apprendre et mémoriser",
          objectifs: ["fra.ecriture.reflexif.01","fra.ecriture.reflexif.02","fra.ecriture.reflexif.03","fra.ecriture.reflexif.04"] },
        { id: "fra.ecriture.varies", nom: "Produire des écrits variés",
          objectifs: ["fra.ecriture.varies.01","fra.ecriture.varies.02","fra.ecriture.varies.03","fra.ecriture.varies.04","fra.ecriture.varies.05","fra.ecriture.varies.06"] }
      ] },

    { matiere: "francais", id: "fra.oral",
      nom: "Oral",
      sous: [
        { id: "fra.oral.ecouter", nom: "Écouter pour comprendre",
          objectifs: ["fra.oral.ecouter.01","fra.oral.ecouter.02","fra.oral.ecouter.03","fra.oral.ecouter.04","fra.oral.ecouter.05"] },
        { id: "fra.oral.dire", nom: "Dire pour être compris dans toutes les disciplines",
          objectifs: ["fra.oral.dire.01","fra.oral.dire.02","fra.oral.dire.03"] },
        { id: "fra.oral.echanges", nom: "Participer à des échanges verbaux",
          objectifs: ["fra.oral.echanges.01","fra.oral.echanges.02","fra.oral.echanges.03","fra.oral.echanges.04","fra.oral.echanges.05","fra.oral.echanges.06"] }
      ] },

    { matiere: "francais", id: "fra.vocabulaire",
      nom: "Vocabulaire",
      sous: [
        { id: "fra.vocabulaire.enrichir", nom: "Enrichir son vocabulaire dans toutes les disciplines",
          objectifs: ["fra.vocabulaire.enrichir.01","fra.vocabulaire.enrichir.02","fra.vocabulaire.enrichir.03"] },
        { id: "fra.vocabulaire.relations", nom: "Établir des relations entre les mots",
          objectifs: ["fra.vocabulaire.relations.01","fra.vocabulaire.relations.02"] },
        { id: "fra.vocabulaire.reemployer", nom: "Réemployer le vocabulaire étudié",
          objectifs: ["fra.vocabulaire.reemployer.01","fra.vocabulaire.reemployer.02"] },
        { id: "fra.vocabulaire.orthographe", nom: "Mémoriser l'orthographe des mots",
          objectifs: ["fra.vocabulaire.orthographe.01"] }
      ] },

    { matiere: "francais", id: "fra.grammaire",
      nom: "Grammaire et orthographe grammaticale",
      sous: [
        { id: "fra.grammaire.types_phrases", nom: "Connaître les trois types de phrases et leurs formes",
          objectifs: ["fra.grammaire.types_phrases.01"] },
        { id: "fra.grammaire.phrase_simple", nom: "Analyser une phrase simple",
          objectifs: ["fra.grammaire.phrase_simple.01","fra.grammaire.phrase_simple.02","fra.grammaire.phrase_simple.03","fra.grammaire.phrase_simple.04","fra.grammaire.phrase_simple.05","fra.grammaire.phrase_simple.06","fra.grammaire.phrase_simple.07"] },
        { id: "fra.grammaire.nature_fonction", nom: "Distinguer les notions de nature/classe grammaticales et de fonction",
          objectifs: ["fra.grammaire.nature_fonction.01","fra.grammaire.nature_fonction.02"] },
        { id: "fra.grammaire.classes", nom: "Identifier les mots, un groupe de mots selon leur nature/classe grammaticale",
          objectifs: ["fra.grammaire.classes.01","fra.grammaire.classes.02","fra.grammaire.classes.03","fra.grammaire.classes.04","fra.grammaire.classes.05"] },
        { id: "fra.grammaire.groupe_nominal", nom: "Analyser le groupe nominal",
          objectifs: ["fra.grammaire.groupe_nominal.01","fra.grammaire.groupe_nominal.02","fra.grammaire.groupe_nominal.03"] },
        { id: "fra.grammaire.phrase_complexe", nom: "Différencier phrase simple et phrase complexe",
          objectifs: ["fra.grammaire.phrase_complexe.01"] },
        { id: "fra.grammaire.variations", nom: "Identifier les classes de mots subissant des variations",
          objectifs: ["fra.grammaire.variations.01","fra.grammaire.variations.02"] },
        { id: "fra.grammaire.accords_gn", nom: "Réaliser la chaîne d'accords au sein du groupe nominal",
          objectifs: ["fra.grammaire.accords_gn.01","fra.grammaire.accords_gn.02"] },
        { id: "fra.grammaire.accord_sujet_verbe", nom: "Accorder le sujet et le verbe",
          objectifs: ["fra.grammaire.accord_sujet_verbe.01","fra.grammaire.accord_sujet_verbe.02","fra.grammaire.accord_sujet_verbe.03"] },
        { id: "fra.grammaire.conjugaison", nom: "Approfondir sa maîtrise de la conjugaison",
          objectifs: ["fra.grammaire.conjugaison.01","fra.grammaire.conjugaison.02","fra.grammaire.conjugaison.03","fra.grammaire.conjugaison.04","fra.grammaire.conjugaison.05","fra.grammaire.conjugaison.06"] }
      ] },

    { matiere: "sciences", id: "sci.t1",
      nom: "Matière, mouvement, énergie, information",
      sous: [
        { id: "sci.t1.p1", nom: "États et constitution de la matière à l'échelle macroscopique",
          objectifs: ["sci.t1.p1.b1.01","sci.t1.p1.b1.02","sci.t1.p1.b1.03","sci.t1.p1.b1.04","sci.t1.p1.b2.01","sci.t1.p1.b2.02","sci.t1.p1.b2.03","sci.t1.p1.b2.04","sci.t1.p1.b3.01","sci.t1.p1.b3.02","sci.t1.p1.b3.03"] },
        { id: "sci.t1.p2", nom: "Différents types de mouvement",
          objectifs: ["sci.t1.p2.b1.01","sci.t1.p2.b1.02","sci.t1.p2.b1.03","sci.t1.p2.b1.04"] },
        { id: "sci.t1.p3", nom: "Ressources en énergie et conversions d'énergie",
          objectifs: ["sci.t1.p3.b1.01","sci.t1.p3.b1.02"] },
        { id: "sci.t1.p4", nom: "Signal et information",
          objectifs: ["sci.t1.p4.b1.01","sci.t1.p4.b1.02","sci.t1.p4.b1.03","sci.t1.p4.b1.04","sci.t1.p4.b2.01","sci.t1.p4.b2.02"] }
      ] },

    { matiere: "sciences", id: "sci.t2",
      nom: "Le vivant, sa diversité et les fonctions qui le caractérisent",
      sous: [
        { id: "sci.t2.p1", nom: "Panorama du monde vivant",
          objectifs: ["sci.t2.p1.b1.01","sci.t2.p1.b2.01","sci.t2.p1.b3.01","sci.t2.p1.b3.02","sci.t2.p1.b3.03","sci.t2.p1.b3.04"] },
        { id: "sci.t2.p2", nom: "Alimentation humaine",
          objectifs: ["sci.t2.p2.b1.01","sci.t2.p2.b1.02","sci.t2.p2.b1.03","sci.t2.p2.b1.04","sci.t2.p2.b1.05","sci.t2.p2.b2.01","sci.t2.p2.b2.02"] },
        { id: "sci.t2.p3", nom: "Cycle de vie et reproduction des êtres vivants",
          objectifs: ["sci.t2.p3.b1.01","sci.t2.p3.b2.01","sci.t2.p3.b2.02"] }
      ] },

    { matiere: "sciences", id: "sci.t3",
      nom: "Les objets techniques au cœur de la société",
      sous: [
        { id: "sci.t3.p1", nom: "Les objets techniques en réponse aux besoins des individus et de la société",
          objectifs: ["sci.t3.p1.b1.01","sci.t3.p1.b1.02","sci.t3.p1.b2.01"] },
        { id: "sci.t3.p2", nom: "Besoins et fonctions techniques",
          objectifs: ["sci.t3.p2.b1.01","sci.t3.p2.b1.02","sci.t3.p2.b2.01","sci.t3.p2.b2.02","sci.t3.p2.b3.01","sci.t3.p2.b3.02","sci.t3.p2.b3.03"] },
        { id: "sci.t3.p3", nom: "Démarche de conception et de réalisation d'un objet technique",
          objectifs: ["sci.t3.p3.b1.01","sci.t3.p3.b1.02","sci.t3.p3.b2.01","sci.t3.p3.b2.02","sci.t3.p3.b2.03","sci.t3.p3.b3.01","sci.t3.p3.b3.02","sci.t3.p3.b4.01","sci.t3.p3.b4.02","sci.t3.p3.b4.03","sci.t3.p3.b4.04","sci.t3.p3.b4.05"] },
        { id: "sci.t3.p4", nom: "Programmation d'objets techniques",
          objectifs: ["sci.t3.p4.b1.01","sci.t3.p4.b1.02","sci.t3.p4.b2.01","sci.t3.p4.b2.02","sci.t3.p4.b2.03"] }
      ] },

    { matiere: "sciences", id: "sci.t4",
      nom: "La Terre, une planète peuplée par des êtres vivants",
      sous: [
        { id: "sci.t4.p1", nom: "La Terre, une planète singulière et active",
          objectifs: ["sci.t4.p1.b1.01","sci.t4.p1.b1.02","sci.t4.p1.b1.03","sci.t4.p1.b1.04","sci.t4.p1.b1.05","sci.t4.p1.b1.06"] },
        { id: "sci.t4.p2", nom: "Écosystème : structure, fonctionnement et dynamique",
          objectifs: ["sci.t4.p2.b1.01","sci.t4.p2.b1.02","sci.t4.p2.b1.03","sci.t4.p2.b2.01","sci.t4.p2.b2.02","sci.t4.p2.b2.03","sci.t4.p2.b2.04","sci.t4.p2.b3.01","sci.t4.p2.b3.02"] }
      ] },

    { matiere: "histoire_geo", id: "hg.hist",
      nom: "Histoire",
      sous: [
        { id: "hg.hist.t1", nom: "Le temps de la République",
          objectifs: ["hg.hist.t1.s1","hg.hist.t1.s2","hg.hist.t1.s3"] },
        { id: "hg.hist.t2", nom: "L'âge industriel en France",
          objectifs: ["hg.hist.t2.s1","hg.hist.t2.s2","hg.hist.t2.s3","hg.hist.t2.s4"] },
        { id: "hg.hist.t3", nom: "La France, des guerres mondiales à l'Union européenne",
          objectifs: ["hg.hist.t3.s1","hg.hist.t3.s2"] }
      ] },

    { matiere: "histoire_geo", id: "hg.geo",
      nom: "Géographie",
      sous: [
        { id: "hg.geo.t1", nom: "Se déplacer",
          objectifs: ["hg.geo.t1.s1","hg.geo.t1.s2","hg.geo.t1.s3","hg.geo.t1.s4"] },
        { id: "hg.geo.t2", nom: "Communiquer d'un bout à l'autre du monde grâce à l'Internet",
          objectifs: ["hg.geo.t2.s1","hg.geo.t2.s2","hg.geo.t2.s3"] },
        { id: "hg.geo.t3", nom: "Mieux habiter",
          objectifs: ["hg.geo.t3.s1","hg.geo.t3.s2","hg.geo.t3.s3"] }
      ] },

    { matiere: "numerique", id: "num.1",
      nom: "Information et données",
      sous: [
        { id: "num.1.1", nom: "Mener une recherche et une veille d'information",
          objectifs: ["num.1.1.n1.01","num.1.1.n1.02","num.1.1.n2.03","num.1.1.n2.04"] },
        { id: "num.1.2", nom: "Gérer des données",
          objectifs: ["num.1.2.n1.01","num.1.2.n2.02","num.1.2.n2.03"] },
        { id: "num.1.3", nom: "Traiter des données",
          objectifs: ["num.1.3.n1.01","num.1.3.n2.02"] }
      ] },

    { matiere: "numerique", id: "num.2",
      nom: "Communication et collaboration",
      sous: [
        { id: "num.2.1", nom: "Interagir",
          objectifs: ["num.2.1.n1.01","num.2.1.n1.02","num.2.1.n2.03"] },
        { id: "num.2.2", nom: "Partager et publier",
          objectifs: ["num.2.2.n1.01","num.2.2.n1.02","num.2.2.n2.03","num.2.2.n2.04","num.2.2.n2.05"] },
        { id: "num.2.3", nom: "Collaborer",
          objectifs: ["num.2.3.n1.01","num.2.3.n2.02"] },
        { id: "num.2.4", nom: "S'insérer dans un monde numérique",
          objectifs: ["num.2.4.n1.01","num.2.4.n2.02"] }
      ] },

    { matiere: "numerique", id: "num.3",
      nom: "Création de contenus",
      sous: [
        { id: "num.3.1", nom: "Développer des documents textuels",
          objectifs: ["num.3.1.n1.01","num.3.1.n2.02"] },
        { id: "num.3.2", nom: "Développer des documents multimédia",
          objectifs: ["num.3.2.n1.01","num.3.2.n2.02"] },
        { id: "num.3.3", nom: "Adapter les documents à leur finalité",
          objectifs: ["num.3.3.n1.01","num.3.3.n2.02","num.3.3.n2.03"] },
        { id: "num.3.4", nom: "Programmer",
          objectifs: ["num.3.4.n1.01","num.3.4.n2.02"] }
      ] },

    { matiere: "numerique", id: "num.4",
      nom: "Protection et sécurité",
      sous: [
        { id: "num.4.1", nom: "Sécuriser l'environnement numérique",
          objectifs: ["num.4.1.n1.01","num.4.1.n2.02","num.4.1.n2.03"] },
        { id: "num.4.2", nom: "Protéger les données personnelles et la vie privée",
          objectifs: ["num.4.2.n1.01","num.4.2.n2.02","num.4.2.n2.03","num.4.2.n2.04","num.4.2.n2.05"] },
        { id: "num.4.3", nom: "Protéger la santé, le bien-être et l'environnement",
          objectifs: ["num.4.3.n1.01","num.4.3.n1.02","num.4.3.n2.03","num.4.3.n2.04"] }
      ] },

    { matiere: "numerique", id: "num.5",
      nom: "Environnement numérique",
      sous: [
        { id: "num.5.1", nom: "Résoudre des problèmes techniques",
          objectifs: ["num.5.1.n1.01","num.5.1.n2.02"] },
        { id: "num.5.2", nom: "Évoluer dans un environnement numérique",
          objectifs: ["num.5.2.n1.01","num.5.2.n1.02","num.5.2.n2.03"] }
      ] },

    { matiere: "emc", id: "emc",
      nom: "Vivre en république",
      sous: [
        { id: "emc.p1", nom: "Citoyenneté et nationalité",
          objectifs: ["emc.p1.c01","emc.p1.c02","emc.p1.c03","emc.p1.c04","emc.p1.c05","emc.p1.c06"] },
        { id: "emc.p2", nom: "Libertés et droits fondamentaux",
          objectifs: ["emc.p2.c01","emc.p2.c02","emc.p2.c03","emc.p2.c04"] },
        { id: "emc.p3", nom: "Respecter les droits de tous",
          objectifs: ["emc.p3.c01","emc.p3.c02"] },
        { id: "emc.p4", nom: "À l'école laïque",
          objectifs: ["emc.p4.c01","emc.p4.c02"] }
      ] }
  ];

  /* Index objectif -> sous-domaine, construit une fois au chargement. */
  var PAR_OBJECTIF = {};
  DOMAINES.forEach(function (dom) {
    dom.sous.forEach(function (sd) {
      sd.matiere = dom.matiere;
      sd.domaine = dom.id;
      sd.domaineNom = dom.nom;
      sd.objectifs.forEach(function (o) { PAR_OBJECTIF[o] = sd; });
    });
  });

  CM2.domaines = {
    liste: function () { return DOMAINES; },

    /** Sous-domaine du programme auquel appartient un objectif. */
    sousDomaineDe: function (objectifId) { return PAR_OBJECTIF[objectifId] || null; },

    /** Tous les sous-domaines, dans l'ordre du programme. */
    sousDomaines: function (matiere) {
      var out = [];
      DOMAINES.forEach(function (dom) {
        if (matiere && dom.matiere !== matiere) return;
        dom.sous.forEach(function (sd) { out.push(sd); });
      });
      return out;
    },

    /** Nombre d'objectifs du programme, toutes matières ou une seule. */
    nombreObjectifs: function (matiere) {
      var n = 0;
      DOMAINES.forEach(function (dom) {
        if (matiere && dom.matiere !== matiere) return;
        dom.sous.forEach(function (sd) { n += sd.objectifs.length; });
      });
      return n;
    }
  };
})(window.CM2 = window.CM2 || {});
