/* Ce que le cahier sait déjà dire.

   Le cahier note depuis le début deux choses que rien ne lisait :

   - l'historique des séances — { date, matière, questions, réussites } ;
   - pour chaque sorte d'exercice, les objectifs du programme qu'elle travaille.

   Ce fichier ne fait que les remonter. Aucun calcul nouveau n'est enregistré :
   tout ce qui suit se déduit de ce qui était déjà là, y compris pour un cahier
   ouvert il y a des mois.

   Deux lectures, pour deux lecteurs :

   - par domaine du programme, pour l'enfant : « les fractions, 24 questions,
     tu en réussis 3 sur 4 » vaut mieux qu'une liste de titres d'exercices ;
   - par semaine, pour l'adulte, avec ce qui est acquis et ce qui coince : c'est
     la seule façon de répondre à « est-ce que ça sert à quelque chose ? ».

   Une précision qui compte pour lire les chiffres : un exercice peut travailler
   deux objectifs de deux domaines différents (une aire de rectangle relève des
   aires et de la multiplication). Ses questions sont alors comptées dans les
   deux domaines. Les totaux par domaine ne s'additionnent donc pas jusqu'au
   total général — c'est voulu, et dit à l'écran.

   Aucune écriture : ce fichier lit le cahier, il ne le modifie jamais. */
(function (CM2) {
  'use strict';

  var B = {};

  /* Un taux calculé sur une ou deux réponses ne veut rien dire. En dessous de
     ce nombre de questions, on affiche le compte, pas le pourcentage. */
  var MINIMUM_POUR_JUGER = 3;

  /* Une notion est dite sue quand elle a été rencontrée assez souvent et
     qu'elle est passée dans les dernières boîtes de la révision espacée : le
     taux seul récompenserait un coup de chance, la boîte seule récompenserait
     l'ancienneté. */
  var TAUX_ACQUIS = 0.85;
  var BOITE_ACQUISE = 3;

  /* Toutes les lectures acceptent un cahier en dernier argument. Sans lui,
     c'est le cahier ouvert qui est lu — c'est le cas de l'écran de l'enfant.
     Avec lui, la vue enseignant parcourt les cahiers les uns après les autres
     sans jamais changer celui qui est ouvert. */
  function profil(cahier) { return cahier || CM2.profil.actuel(); }

  function taux(reussites, vus) {
    return vus ? reussites / vus : null;
  }

  /* --- Par domaine du programme --------------------------------------- */

  /** Pour chaque sous-domaine du programme : ce qui a été fait, ce qui a été
      réussi, et combien de sortes d'exercices l'application sait y proposer.

      matiere : 'mathematiques' | 'francais' | 'sciences' | 'emc' | null pour tout. */
  B.parSousDomaine = function (matiere, cahier) {
    var c = profil(cahier);
    var notions = (c && c.notions) || {};
    var index = {};

    CM2.domaines.sousDomaines(matiere).forEach(function (sd) {
      index[sd.id] = {
        id: sd.id, nom: sd.nom, matiere: sd.matiere,
        domaine: sd.domaine, domaineNom: sd.domaineNom,
        objectifs: sd.objectifs.length,
        generateurs: 0,             // sortes d'exercices disponibles ici
        rencontres: 0,              // sortes déjà rencontrées au moins une fois
        vus: 0, reussites: 0, taux: null
      };
    });

    CM2.registre.liste().forEach(function (spec) {
      // Un même sous-domaine ne compte le générateur qu'une fois, même si
      // celui-ci cite deux de ses objectifs.
      var deja = {};
      spec.objectifs.forEach(function (o) {
        var sd = CM2.domaines.sousDomaineDe(o);
        if (!sd || !index[sd.id] || deja[sd.id]) return;
        deja[sd.id] = true;

        var ligne = index[sd.id];
        ligne.generateurs++;

        var n = notions[spec.id];
        if (n && n.vus) {
          ligne.rencontres++;
          ligne.vus += n.vus;
          ligne.reussites += n.reussites;
        }
      });
    });

    return CM2.domaines.sousDomaines(matiere)
      .map(function (sd) {
        var ligne = index[sd.id];
        ligne.taux = taux(ligne.reussites, ligne.vus);
        ligne.jugeable = ligne.vus >= MINIMUM_POUR_JUGER;
        return ligne;
      })
      // Un sous-domaine que l'application ne sait pas travailler n'a rien à
      // dire à l'enfant : on ne l'affiche pas comme une lacune de sa part.
      .filter(function (l) { return l.generateurs > 0; });
  };

  /** Les mêmes chiffres, regroupés par domaine — la vue la plus lisible pour
      un enfant : cinq ou six lignes, pas quarante. */
  B.parDomaine = function (matiere, cahier) {
    var out = [];
    var index = {};

    B.parSousDomaine(matiere, cahier).forEach(function (sd) {
      if (!index[sd.domaine]) {
        index[sd.domaine] = {
          id: sd.domaine, nom: sd.domaineNom, matiere: sd.matiere,
          generateurs: 0, rencontres: 0, vus: 0, reussites: 0, taux: null,
          sous: []
        };
        out.push(index[sd.domaine]);
      }
      var d = index[sd.domaine];
      d.generateurs += sd.generateurs;
      d.rencontres += sd.rencontres;
      d.vus += sd.vus;
      d.reussites += sd.reussites;
      d.sous.push(sd);
    });

    out.forEach(function (d) {
      d.taux = taux(d.reussites, d.vus);
      d.jugeable = d.vus >= MINIMUM_POUR_JUGER;
    });
    return out;
  };

  /* --- Par semaine ---------------------------------------------------- */

  /** Le lundi de la semaine d'une date, au format AAAA-MM-JJ. */
  function lundiDe(date) {
    var d = new Date(date + 'T12:00:00');
    var jour = d.getDay();                        // 0 = dimanche
    var recul = (jour === 0 ? 6 : jour - 1);
    d.setDate(d.getDate() - recul);
    return isoDe(d);
  }

  function isoDe(d) {
    var m = d.getMonth() + 1;
    var j = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (j < 10 ? '0' + j : j);
  }

  function jjmm(iso) {
    var bouts = iso.split('-');
    return bouts[2] + '/' + bouts[1];
  }

  /** Les `combien` dernières semaines, de la plus ancienne à la plus récente,
      y compris les semaines sans aucune séance : un trou dans le travail est
      une information, le cacher donnerait une courbe flatteuse et fausse.

      Le cahier ne garde que les quarante dernières séances : au-delà, une
      semaine ancienne peut apparaître incomplète. */
  B.parSemaine = function (combien, cahier) {
    var c = profil(cahier);
    if (!c) return [];
    var nb = combien || 6;

    var semaines = [];
    var index = {};
    var lundiCourant = lundiDe(CM2.profil.aujourdhui());

    for (var i = nb - 1; i >= 0; i--) {
      var d = new Date(lundiCourant + 'T12:00:00');
      d.setDate(d.getDate() - 7 * i);
      var lundi = isoDe(d);
      var dimanche = new Date(d);
      dimanche.setDate(dimanche.getDate() + 6);

      var s = {
        lundi: lundi, dimanche: isoDe(dimanche),
        libelle: jjmm(lundi),
        courante: (i === 0),
        questions: 0, reussites: 0, seances: 0, jours: 0, taux: null
      };
      index[lundi] = s;
      semaines.push(s);
    }

    var joursVus = {};
    (c.seances || []).forEach(function (seance) {
      var lundi = lundiDe(seance.date);
      var s = index[lundi];
      if (!s) return;                             // plus vieux que la fenêtre
      s.questions += seance.questions || 0;
      s.reussites += seance.reussites || 0;
      s.seances++;
      var clef = lundi + '|' + seance.date;
      if (!joursVus[clef]) { joursVus[clef] = true; s.jours++; }
    });

    semaines.forEach(function (s) { s.taux = taux(s.reussites, s.questions); });
    return semaines;
  };

  /* --- Ce qui est su, ce qui coince ----------------------------------- */

  /* Une sorte d'exercice retirée de l'application entre deux versions reste
     inscrite dans les cahiers — on n'efface pas ce qui a été travaillé — mais
     elle n'est plus nommable : son identifiant ne dit rien à un lecteur, et
     elle ne peut plus être reproposée. On la laisse donc hors des listes, comme
     le fait déjà le résumé. */
  function connue(id) { return !!CM2.registre.get(id); }

  function ligneNotion(id, n) {
    var spec = CM2.registre.get(id);
    var objectif = spec.objectifs[0];
    var sd = objectif ? CM2.domaines.sousDomaineDe(objectif) : null;
    return {
      id: id,
      titre: spec.titre,
      matiere: spec.matiere,
      domaine: sd ? sd.nom : '',
      vus: n.vus, reussites: n.reussites,
      boite: n.boite || 0,
      taux: taux(n.reussites, n.vus)
    };
  }

  /** Notions tenues pour sues : assez rencontrées, et soit un taux élevé, soit
      une place dans les dernières boîtes de révision. */
  B.acquises = function (combien, cahier) {
    var c = profil(cahier);
    if (!c) return [];
    return Object.keys(c.notions)
      .filter(connue)
      .map(function (id) { return ligneNotion(id, c.notions[id]); })
      .filter(function (n) {
        return n.vus >= MINIMUM_POUR_JUGER &&
               (n.taux >= TAUX_ACQUIS || n.boite >= BOITE_ACQUISE);
      })
      .sort(function (a, b) { return (b.taux - a.taux) || (b.vus - a.vus); })
      .slice(0, combien || 8);
  };

  /** Notions qui résistent. Même seuil que le bureau de l'élève, mais avec le
      domaine du programme en plus : c'est ce qui permet à l'adulte de savoir
      quoi reprendre, et pas seulement quel exercice a raté. */
  B.fragiles = function (combien, cahier) {
    var c = profil(cahier);
    if (!c) return [];
    return Object.keys(c.notions)
      .filter(connue)
      .map(function (id) { return ligneNotion(id, c.notions[id]); })
      .filter(function (n) { return n.vus >= MINIMUM_POUR_JUGER && n.taux < 0.75; })
      .sort(function (a, b) { return a.taux - b.taux; })
      .slice(0, combien || 8);
  };

  /* --- Vue d'ensemble -------------------------------------------------- */

  /** De quoi écrire une phrase honnête sur l'ensemble du cahier. */
  B.resume = function (cahier) {
    var c = profil(cahier);
    if (!c) return null;

    var notions = c.notions || {};
    var rencontrees = Object.keys(notions).filter(function (id) {
      return notions[id].vus > 0 && CM2.registre.get(id);
    });

    var objectifsTravailles = {};
    rencontrees.forEach(function (id) {
      CM2.registre.get(id).objectifs.forEach(function (o) { objectifsTravailles[o] = true; });
    });

    var objectifsPossibles = {};
    CM2.registre.liste().forEach(function (spec) {
      spec.objectifs.forEach(function (o) { objectifsPossibles[o] = true; });
    });

    var derniere = null;
    (c.seances || []).forEach(function (s) {
      if (!derniere || s.date > derniere) derniere = s.date;
    });

    return {
      nom: c.nom,
      questions: c.total.questions,
      reussites: c.total.reussites,
      taux: taux(c.total.reussites, c.total.questions),
      seances: (c.seances || []).length,
      derniereSeance: derniere,
      joursTravailles: (c.jours || []).length,
      serie: CM2.profil.serieDe(c),
      sortesRencontrees: rencontrees.length,
      sortesDisponibles: CM2.registre.liste().length,
      objectifsTravailles: Object.keys(objectifsTravailles).length,
      objectifsPossibles: Object.keys(objectifsPossibles).length,
      objectifsProgramme: CM2.domaines.nombreObjectifs(),
      acquises: B.acquises(1000, c).length,
      fragiles: B.fragiles(1000, c).length,
      aRevoir: CM2.progression.aReviser(null, c).length,
      enAttente: CM2.progression.enAttente(null, c).length
    };
  };

  B.MINIMUM_POUR_JUGER = MINIMUM_POUR_JUGER;

  CM2.bilan = B;
})(window.CM2 = window.CM2 || {});
