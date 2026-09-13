/* Traduction en contrôles exécutables des blocs `contraintes_generation`
   des référentiels. Un exercice qui viole l'une de ces règles est
   hors-programme : le registre refuse de le servir.

   Ce fichier est la seule copie de ces valeurs dans le code applicatif.
   Toute divergence avec data/referentiel/*.json est un bug. */
(function (CM2) {
  'use strict';

  var C = {};

  /* --- Mathématiques, BO n° 16 du 17 avril 2025 --- */
  C.maths = {
    entierMax: 999999999,
    decimalesMax: 3,              // millièmes
    fractionDenominateurMax: 60,  // hors fractions décimales
    fractionDenominateursDecimaux: [10, 100, 1000],
    diviseurPoseMax: 9,           // division posée : diviseur à un chiffre
    uniteAireAutorisees: ['cm²', 'dm²', 'm²']
  };

  /* --- Français, BO n° 16 du 17 avril 2025 ---
     Liste fermée : aucun verbe du 3e groupe hors de cette liste ne doit
     apparaître dans un exercice de conjugaison. */
  C.francais = {
    tempsNouveaux: ['passé simple', 'plus-que-parfait'],
    tempsConsolides: ['présent', 'imparfait', 'futur', 'passé composé'],
    verbes3eGroupeAutorises: ['faire', 'aller', 'dire', 'venir', 'pouvoir', 'voir', 'vouloir', 'prendre'],
    // La notion de proposition n'arrive qu'en 6e.
    termesInterdits: ['proposition subordonnée', 'proposition principale', 'proposition indépendante']
  };

  /* --- Contrôles --- */

  var erreurs = [];
  function faute(msg) { erreurs.push(msg); }

  /** Nombre de décimales effectives d'un nombre. */
  function decimales(x) {
    var s = String(x);
    var i = s.indexOf('.');
    return i === -1 ? 0 : s.length - i - 1;
  }
  C.decimales = decimales;

  /** Vérifie un nombre destiné à un énoncé de maths. */
  C.verifierNombre = function (x, contexte) {
    if (typeof x !== 'number' || !isFinite(x)) {
      faute(contexte + ' : « ' + x + ' » n\'est pas un nombre fini');
      return;
    }
    if (Math.abs(x) > C.maths.entierMax) {
      faute(contexte + ' : ' + x + ' dépasse le champ numérique du CM2 (max ' + C.maths.entierMax + ')');
    }
    if (decimales(x) > C.maths.decimalesMax) {
      faute(contexte + ' : ' + x + ' va au-delà des millièmes');
    }
  };

  /** Vérifie un dénominateur de fraction. */
  C.verifierDenominateur = function (den, contexte) {
    if (C.maths.fractionDenominateursDecimaux.indexOf(den) !== -1) return;
    if (den > C.maths.fractionDenominateurMax) {
      faute(contexte + ' : dénominateur ' + den + ' > ' + C.maths.fractionDenominateurMax +
            ' (et ce n\'est pas une fraction décimale)');
    }
    if (den <= 0) faute(contexte + ' : dénominateur ' + den + ' invalide');
  };

  /** Vérifie qu'un verbe est conjugable au CM2. */
  C.verifierVerbe = function (infinitif, groupe, contexte) {
    if (groupe === 3 && C.francais.verbes3eGroupeAutorises.indexOf(infinitif) === -1) {
      faute(contexte + ' : « ' + infinitif + ' » est un verbe du 3e groupe hors de la liste fermée du programme');
    }
  };

  /** Les autres écritures acceptées d'une même réponse.

      Ce champ est une tolérance d'orthographe, pas une seconde bonne réponse :
      « 1 h 30 » et « 1 h 30 min » désignent la même durée. Il est donc refusé
      s'il est vide, s'il répète la réponse attendue, ou s'il se répète — trois
      signes qu'on s'en sert pour autre chose que ce à quoi il sert. */
  function verifierAcceptees(ex, contexte) {
    if (!Array.isArray(ex.reponses_acceptees) || !ex.reponses_acceptees.length) {
      faute(contexte + ' : reponses_acceptees doit être une liste d\'au moins une écriture');
      return;
    }
    var vues = {};
    vues[CM2.format.normaliser(ex.bonne_reponse)] = 'la réponse attendue';
    ex.reponses_acceptees.forEach(function (r) {
      if (r === undefined || r === null || String(r).trim() === '') {
        faute(contexte + ' : écriture acceptée vide');
        return;
      }
      var cle = CM2.format.normaliser(r);
      if (vues[cle]) {
        faute(contexte + ' : « ' + r + ' » est déjà ' + vues[cle]);
        return;
      }
      vues[cle] = 'accepté';
    });
  }

  /** Contrôles structurels communs à tout exercice produit. */
  C.verifierExercice = function (ex, contexte) {
    erreurs = [];

    if (!ex || typeof ex !== 'object') { faute(contexte + ' : exercice absent'); return erreurs; }
    if (!ex.enonce || !String(ex.enonce).trim()) faute(contexte + ' : énoncé vide');

    // La figure est du contenu produit par nos générateurs : elle passe les
    // mêmes contrôles que le texte.
    var texte = String(ex.enonce) + ' ' + (ex.explication || '') + ' ' + (ex.figure || '');
    C.francais.termesInterdits.forEach(function (t) {
      if (texte.toLowerCase().indexOf(t) !== -1) {
        faute(contexte + ' : emploie « ' + t + ' », notion réservée à la 6e');
      }
    });

    if (ex.type === 'qcm') {
      if (!Array.isArray(ex.propositions) || ex.propositions.length < 2) {
        faute(contexte + ' : un QCM demande au moins deux propositions');
      } else {
        var vues = {};
        ex.propositions.forEach(function (p) {
          var k = CM2.format.normaliser(p);
          if (vues[k]) faute(contexte + ' : proposition en double « ' + p + ' »');
          vues[k] = true;
        });
        if (typeof ex.bonne_reponse !== 'number' ||
            ex.bonne_reponse < 0 || ex.bonne_reponse >= ex.propositions.length) {
          faute(contexte + ' : bonne_reponse hors des propositions');
        }
      }
      // Dans un QCM, on choisit une proposition : il n'y a rien à écrire, donc
      // rien d'autre à accepter.
      if (ex.reponses_acceptees !== undefined) {
        faute(contexte + ' : reponses_acceptees n\'a pas de sens pour un QCM');
      }
    } else if (ex.type === 'saisie') {
      if (ex.bonne_reponse === undefined || ex.bonne_reponse === null || ex.bonne_reponse === '') {
        faute(contexte + ' : réponse attendue absente');
      }
      if (ex.reponses_acceptees !== undefined) verifierAcceptees(ex, contexte);
    } else {
      faute(contexte + ' : type « ' + ex.type + ' » inconnu');
    }

    return erreurs;
  };

  /** Erreurs accumulées par les vérificateurs unitaires depuis le dernier appel. */
  C.erreursCourantes = function () { return erreurs; };
  C.reinitialiser = function () { erreurs = []; };

  CM2.contraintes = C;
})(window.CM2 = window.CM2 || {});
