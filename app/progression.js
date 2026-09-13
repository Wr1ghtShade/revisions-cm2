/* Le schéma de progression : ce qui est su, ce qui ne l'est pas, et quand
   chaque chose doit revenir.

   Deux niveaux de mémoire, gérés par le même mécanisme de boîtes.

   1. La notion — un générateur. On retient combien de fois elle a été vue,
      combien de fois réussie, et la date à laquelle il faudra la retravailler.
      Une notion ne sort jamais du circuit : elle remonte simplement de boîte
      en boîte et revient de moins en moins souvent.

   2. L'exercice — un couple (générateur, graine). Un exercice raté entre dans
      la liste à revoir. Il faut le réussir plusieurs fois, à des dates de plus
      en plus espacées, pour qu'il en sorte. Une seule bonne réponse ne prouve
      rien : c'est tout l'intérêt de la révision espacée.

   Les intervalles sont ceux d'un système de Leitner classique : on revoit le
   lendemain, puis trois jours après, puis une semaine, puis seize jours. Un
   exercice raté sort donc de la liste à la cinquième réussite, la dernière
   tombant un peu moins d'un mois après l'échec.

   Ce schéma est destiné à ne plus changer : les banques d'exercices à venir
   s'y brancheront telles quelles, puisqu'il ne connaît des exercices que leur
   identifiant et leur graine. */
(function (CM2) {
  'use strict';

  var P = CM2.profil;

  /* Délai, en jours, avant le prochain passage — indexé par numéro de boîte.
     La boîte 0 est celle de ce qui vient d'être raté : à revoir tout de suite. */
  var INTERVALLES = [0, 1, 3, 7, 16];

  /* Un exercice sorti de la dernière boîte est considéré comme su et quitte la
     liste. Une notion, elle, plafonne à la dernière boîte et revient toujours. */
  var BOITE_MAX_NOTION = INTERVALLES.length - 1;

  var MAX_A_REVOIR = 80;

  var G = {};
  G.intervalles = INTERVALLES;

  function estEchu(date) {
    return !date || P.joursDecart(date, P.aujourdhui()) >= 0;
  }

  function cle(id, graine) { return id + '#' + graine; }

  /* --- Enregistrer une réponse ---------------------------------------- */

  /** Met à jour le cahier après une réponse.
      `exercice` sort du registre : il porte son generateur_id et sa graine,
      donc de quoi être rejoué tel quel. */
  G.noterReponse = function (exercice, juste) {
    var c = P.actuel();
    if (!c) return;

    c.total.questions++;
    if (juste) c.total.reussites++;

    majNotion(c, exercice.generateur_id, juste);
    majExercice(c, exercice, juste);

    P.enregistrer();
  };

  function majNotion(c, id, juste) {
    var n = c.notions[id];
    if (!n) n = c.notions[id] = { vus: 0, reussites: 0, dernier: null, boite: 0, prochaine: null };

    n.vus++;
    if (juste) n.reussites++;
    n.dernier = P.aujourdhui();

    // Réussi : la notion monte d'une boîte et revient plus tard.
    // Raté : elle retombe en boîte 0 et sera reproposée dès la prochaine série.
    n.boite = juste ? Math.min(n.boite + 1, BOITE_MAX_NOTION) : 0;
    n.prochaine = P.dans(INTERVALLES[n.boite]);
  }

  function majExercice(c, exercice, juste) {
    var k = cle(exercice.generateur_id, exercice.graine);
    var index = -1;
    for (var i = 0; i < c.aRevoir.length; i++) {
      if (cle(c.aRevoir[i].id, c.aRevoir[i].graine) === k) { index = i; break; }
    }

    if (!juste) {
      var entree = index === -1 ? {
        id: exercice.generateur_id,
        graine: exercice.graine,
        titre: exercice.titre,
        matiere: exercice.matiere
      } : c.aRevoir[index];

      entree.boite = 0;
      entree.prochaine = P.aujourdhui();
      entree.dernierEchec = P.aujourdhui();

      if (index === -1) {
        c.aRevoir.push(entree);
        // On garde les plus récents : une liste sans fin ne se rattrape jamais.
        if (c.aRevoir.length > MAX_A_REVOIR) c.aRevoir.shift();
      }
      return;
    }

    if (index === -1) return;        // exercice jamais raté : rien à suivre

    var e = c.aRevoir[index];
    e.boite++;
    if (e.boite >= INTERVALLES.length) {
      c.aRevoir.splice(index, 1);    // su : il quitte la liste
    } else {
      e.prochaine = P.dans(INTERVALLES[e.boite]);
    }
  }

  /* --- Ce qui est à revoir --------------------------------------------- */

  function filtrerMatiere(liste, matiere) {
    if (!matiere || matiere === 'tout') return liste;
    return liste.filter(function (e) { return e.matiere === matiere; });
  }

  /** Exercices ratés dont la date de révision est arrivée.
      `cahier` permet de lire un autre cahier que celui qui est ouvert — la vue
      enseignant s'en sert pour tous les enfants à la fois. */
  G.aReviser = function (matiere, cahier) {
    var c = cahier || P.actuel();
    if (!c) return [];
    return filtrerMatiere(c.aRevoir, matiere).filter(function (e) {
      return estEchu(e.prochaine);
    });
  };

  /** Exercices en cours de mémorisation, dont le tour n'est pas encore venu. */
  G.enAttente = function (matiere, cahier) {
    var c = cahier || P.actuel();
    if (!c) return [];
    return filtrerMatiere(c.aRevoir, matiere).filter(function (e) {
      return !estEchu(e.prochaine);
    });
  };

  /** Dans combien de jours le prochain exercice en attente revient-il ?
      null s'il n'y en a aucun. */
  G.prochaineEcheance = function () {
    var attente = G.enAttente();
    if (!attente.length) return null;
    var jours = attente.map(function (e) {
      return P.joursDecart(P.aujourdhui(), e.prochaine);
    });
    return Math.min.apply(Math, jours);
  };

  /** Notions les moins sûres, pour savoir quoi retravailler.
      Une notion vue moins de trois fois n'est pas jugée : le taux ne voudrait
      rien dire sur deux réponses. */
  G.notionsFragiles = function (combien) {
    var c = P.actuel();
    if (!c) return [];
    return Object.keys(c.notions)
      // Une sorte d'exercice retirée entre deux versions reste dans le cahier —
      // on n'efface pas le passé — mais on ne l'affiche pas : son identifiant
      // ne dit rien à personne, et elle ne peut plus être reproposée.
      .filter(function (id) { return !!CM2.registre.get(id); })
      .map(function (id) {
        var n = c.notions[id];
        var spec = CM2.registre.get(id);
        return {
          id: id,
          titre: spec.titre,
          matiere: spec.matiere,
          vus: n.vus,
          reussites: n.reussites,
          taux: n.vus ? n.reussites / n.vus : 0
        };
      })
      .filter(function (n) { return n.vus >= 3 && n.taux < 0.75; })
      .sort(function (a, b) { return a.taux - b.taux; })
      .slice(0, combien || 5);
  };

  /* --- Composer une série ---------------------------------------------- */

  function melanger(tableau) {
    var t = tableau.slice();
    for (var i = t.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = t[i]; t[i] = t[j]; t[j] = tmp;
    }
    return t;
  }

  function graine() { return (Math.random() * 4294967296) >>> 0; }

  /** Compose une série de `nombre` questions pour la matière demandée.

      L'ordre de priorité est le cœur du dispositif :
      1. les exercices ratés dont la date de révision est arrivée — au plus un
         tiers de la série, pour que réviser ne devienne pas une punition ;
      2. les notions dont la date de révision est arrivée ;
      3. les notions jamais rencontrées ;
      4. le reste, au hasard.

      Renvoie [{ id, graine }]. */
  /** Un sujet que le programme laisse au choix du professeur n'est proposé que
      si le cahier l'a déclaré étudié. Le filtre vaut pour les séries à l'écran
      comme pour les fiches à imprimer. */
  G.servable = function (spec, cahier) {
    if (!spec.optionnel) return true;
    return P.sujetEtudie(spec.id, cahier);
  };

  G.choisirSerie = function (matiere, nombre) {
    var specs = (matiere === 'tout' ? CM2.registre.liste() : CM2.registre.parMatiere(matiere))
      .filter(function (s) { return G.servable(s); });
    if (!specs.length) return [];

    var c = P.actuel();
    var notions = (c && c.notions) || {};
    var serie = [];

    melanger(G.aReviser(matiere))
      .slice(0, Math.floor(nombre / 3))
      .forEach(function (e) {
        if (CM2.registre.get(e.id)) serie.push({ id: e.id, graine: e.graine });
      });

    var echues = [], neuves = [], autres = [];
    specs.forEach(function (s) {
      var n = notions[s.id];
      if (!n) neuves.push(s);
      else if (estEchu(n.prochaine)) echues.push(s);
      else autres.push(s);
    });

    var ordre = melanger(echues).concat(melanger(neuves)).concat(melanger(autres));
    var deja = serie.length;                   // figé : serie.length bouge dans la boucle
    for (var i = 0; i < nombre - deja; i++) {
      serie.push({ id: ordre[i % ordre.length].id, graine: graine() });
    }

    return melanger(serie);
  };

  /** Série composée uniquement d'exercices ratés arrivés à échéance. */
  G.serieDesErreurs = function (nombre) {
    return melanger(G.aReviser()).slice(0, nombre).map(function (e) {
      return { id: e.id, graine: e.graine };
    });
  };

  CM2.progression = G;
})(window.CM2 = window.CM2 || {});
