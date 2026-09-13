/* Moteur de conjugaison, limité aux temps et aux verbes du programme du CM2.

   Temps : présent, imparfait, futur, passé composé (CM1, consolidés),
           passé simple, plus-que-parfait (nouveaux au CM2).

   Les verbes des premier et deuxième groupes sont conjugués par règle — mais
   seulement ceux dont le radical ne varie pas, voir lexique.js. Les verbes du
   troisième groupe ont leurs formes écrites une à une : la liste du programme
   est fermée, il n'y a donc aucune raison de les deviner.

   Les six personnes sont indexées de 0 à 5 : je, tu, il/elle, nous, vous, ils/elles. */
(function (CM2) {
  'use strict';

  var PERSONNES = ['1re personne du singulier', '2e personne du singulier', '3e personne du singulier',
                   '1re personne du pluriel', '2e personne du pluriel', '3e personne du pluriel'];
  var PRONOMS = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
  var PRONOMS_F = ['je', 'tu', 'elle', 'nous', 'vous', 'elles'];

  var TEMPS_SIMPLES = ['présent', 'imparfait', 'futur', 'passé simple'];
  var TEMPS_COMPOSES = ['passé composé', 'plus-que-parfait'];
  var TOUS_LES_TEMPS = TEMPS_SIMPLES.concat(TEMPS_COMPOSES);

  /* Le temps composé se forme sur ce temps de l'auxiliaire. */
  var AUXILIAIRE_AU = { 'passé composé': 'présent', 'plus-que-parfait': 'imparfait' };

  /* --- Terminaisons régulières ---------------------------------------- */

  var G1 = {
    'présent': ['e', 'es', 'e', 'ons', 'ez', 'ent'],
    'imparfait': ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
    'passé simple': ['ai', 'as', 'a', 'âmes', 'âtes', 'èrent']
  };

  var G2 = {
    'présent': ['is', 'is', 'it', 'issons', 'issez', 'issent'],
    'imparfait': ['issais', 'issais', 'issait', 'issions', 'issiez', 'issaient'],
    'passé simple': ['is', 'is', 'it', 'îmes', 'îtes', 'irent']
  };

  /* Futur : infinitif + terminaisons d'avoir au présent (réduites). */
  var FUTUR = ['ai', 'as', 'a', 'ons', 'ez', 'ont'];

  /* --- Verbes irréguliers : toutes les formes, écrites ---------------- */

  var IRREGULIERS = {
    'être': {
      'présent': ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
      'imparfait': ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
      'futur': ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
      'passé simple': ['fus', 'fus', 'fut', 'fûmes', 'fûtes', 'furent']
    },
    'avoir': {
      'présent': ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
      'imparfait': ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
      'futur': ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront'],
      'passé simple': ['eus', 'eus', 'eut', 'eûmes', 'eûtes', 'eurent']
    },
    'faire': {
      'présent': ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
      'imparfait': ['faisais', 'faisais', 'faisait', 'faisions', 'faisiez', 'faisaient'],
      'futur': ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront'],
      'passé simple': ['fis', 'fis', 'fit', 'fîmes', 'fîtes', 'firent']
    },
    'aller': {
      'présent': ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
      'imparfait': ['allais', 'allais', 'allait', 'allions', 'alliez', 'allaient'],
      'futur': ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
      'passé simple': ['allai', 'allas', 'alla', 'allâmes', 'allâtes', 'allèrent']
    },
    'dire': {
      'présent': ['dis', 'dis', 'dit', 'disons', 'dites', 'disent'],
      'imparfait': ['disais', 'disais', 'disait', 'disions', 'disiez', 'disaient'],
      'futur': ['dirai', 'diras', 'dira', 'dirons', 'direz', 'diront'],
      'passé simple': ['dis', 'dis', 'dit', 'dîmes', 'dîtes', 'dirent']
    },
    'venir': {
      'présent': ['viens', 'viens', 'vient', 'venons', 'venez', 'viennent'],
      'imparfait': ['venais', 'venais', 'venait', 'venions', 'veniez', 'venaient'],
      'futur': ['viendrai', 'viendras', 'viendra', 'viendrons', 'viendrez', 'viendront'],
      'passé simple': ['vins', 'vins', 'vint', 'vînmes', 'vîntes', 'vinrent']
    },
    'pouvoir': {
      'présent': ['peux', 'peux', 'peut', 'pouvons', 'pouvez', 'peuvent'],
      'imparfait': ['pouvais', 'pouvais', 'pouvait', 'pouvions', 'pouviez', 'pouvaient'],
      'futur': ['pourrai', 'pourras', 'pourra', 'pourrons', 'pourrez', 'pourront'],
      'passé simple': ['pus', 'pus', 'put', 'pûmes', 'pûtes', 'purent']
    },
    'voir': {
      'présent': ['vois', 'vois', 'voit', 'voyons', 'voyez', 'voient'],
      'imparfait': ['voyais', 'voyais', 'voyait', 'voyions', 'voyiez', 'voyaient'],
      'futur': ['verrai', 'verras', 'verra', 'verrons', 'verrez', 'verront'],
      'passé simple': ['vis', 'vis', 'vit', 'vîmes', 'vîtes', 'virent']
    },
    'vouloir': {
      'présent': ['veux', 'veux', 'veut', 'voulons', 'voulez', 'veulent'],
      'imparfait': ['voulais', 'voulais', 'voulait', 'voulions', 'vouliez', 'voulaient'],
      'futur': ['voudrai', 'voudras', 'voudra', 'voudrons', 'voudrez', 'voudront'],
      'passé simple': ['voulus', 'voulus', 'voulut', 'voulûmes', 'voulûtes', 'voulurent']
    },
    'prendre': {
      'présent': ['prends', 'prends', 'prend', 'prenons', 'prenez', 'prennent'],
      'imparfait': ['prenais', 'prenais', 'prenait', 'prenions', 'preniez', 'prenaient'],
      'futur': ['prendrai', 'prendras', 'prendra', 'prendrons', 'prendrez', 'prendront'],
      'passé simple': ['pris', 'pris', 'prit', 'prîmes', 'prîtes', 'prirent']
    }
  };

  function commenceParVoyelle(mot) {
    return /^[aàâeéèêëiîïoôuùûyh]/i.test(mot);
  }

  /** Participe passé accordé. `genre` : 'm' ou 'f'. `nombre` : 's' ou 'p'. */
  function accorderParticipe(pp, genre, nombre) {
    var forme = pp;
    if (genre === 'f') forme += 'e';
    if (nombre === 'p') {
      // Un participe déjà terminé par s ne reprend pas de s au masculin pluriel
      // (« pris » reste « pris », mais « prises » au féminin pluriel).
      if (!(genre === 'm' && /s$/.test(pp))) forme += 's';
    }
    return forme;
  }

  /** Forme simple d'un verbe : sans auxiliaire, sans pronom. */
  function formeSimple(verbe, temps, personne) {
    var inf = verbe.inf;

    // Un verbe qui porte ses propres formes les impose : c'est le cas des
    // verbes du premier groupe à variation de radical (-cer, -ger, -yer,
    // -eler, -eter, e muet), que la règle générale écrirait mal.
    if (verbe.formes && verbe.formes[temps]) return verbe.formes[temps][personne];

    if (IRREGULIERS[inf]) {
      var t = IRREGULIERS[inf][temps];
      if (!t) throw new Error('conjugaison : temps « ' + temps + ' » inconnu pour ' + inf);
      return t[personne];
    }

    if (temps === 'futur') {
      // Les verbes en -re perdent leur e final ; aucun n'est régulier ici,
      // mais la règle est écrite pour que l'invariant reste vrai.
      var base = /re$/.test(inf) ? inf.slice(0, -1) : inf;
      return base + FUTUR[personne];
    }

    if (verbe.groupe === 1) {
      return inf.slice(0, -2) + G1[temps][personne];
    }
    if (verbe.groupe === 2) {
      return inf.slice(0, -2) + G2[temps][personne];
    }

    throw new Error('conjugaison : ' + inf + ' n\'est pas conjugable par règle');
  }

  /** Forme conjuguée complète (auxiliaire compris pour les temps composés).
      opts : { genre: 'm'|'f' } — utilisé pour l'accord du participe avec être. */
  function conjuguer(verbe, temps, personne, opts) {
    opts = opts || {};
    var genre = opts.genre || 'm';
    var nombre = personne >= 3 ? 'p' : 's';

    if (TEMPS_SIMPLES.indexOf(temps) !== -1) {
      return formeSimple(verbe, temps, personne);
    }

    if (TEMPS_COMPOSES.indexOf(temps) !== -1) {
      var aux = CM2.lexique.verbe(verbe.aux);
      var formeAux = formeSimple(aux, AUXILIAIRE_AU[temps], personne);
      var participe = verbe.aux === 'être'
        ? accorderParticipe(verbe.pp, genre, nombre)
        : verbe.pp;
      return formeAux + ' ' + participe;
    }

    throw new Error('conjugaison : temps « ' + temps + ' » hors programme du CM2');
  }

  /** Sujet pronominal + verbe, élision comprise : « j'ai chanté ». */
  function avecPronom(verbe, temps, personne, opts) {
    opts = opts || {};
    var forme = conjuguer(verbe, temps, personne, opts);
    var pronom = (opts.genre === 'f' ? PRONOMS_F : PRONOMS)[personne];
    if (personne === 0 && commenceParVoyelle(forme)) return 'j\'' + forme;
    return pronom + ' ' + forme;
  }

  /** Forme négative : « il n'a pas chanté », « nous ne chantons pas ». */
  function negatif(verbe, temps, personne, opts) {
    var forme = conjuguer(verbe, temps, personne, opts);
    var ne = commenceParVoyelle(forme) ? 'n\'' : 'ne ';

    if (TEMPS_COMPOSES.indexOf(temps) !== -1) {
      // « pas » se place entre l'auxiliaire et le participe.
      var bouts = forme.split(' ');
      return ne + bouts[0] + ' pas ' + bouts.slice(1).join(' ');
    }
    return ne + forme + ' pas';
  }

  /** Sujet pronominal + forme négative : « je n'ai pas chanté ».
      Le pronom « je » ne s'élide pas ici, puisque « ne » s'intercale. */
  function avecPronomNegatif(verbe, temps, personne, opts) {
    opts = opts || {};
    var pronom = (opts.genre === 'f' ? PRONOMS_F : PRONOMS)[personne];
    return pronom + ' ' + negatif(verbe, temps, personne, opts);
  }

  /** Toutes les formes d'un verbe à un temps, dans l'ordre des personnes. */
  function tableau(verbe, temps, opts) {
    var t = [];
    for (var p = 0; p < 6; p++) t.push(conjuguer(verbe, temps, p, opts));
    return t;
  }

  /** Le couple (temps, personne) est-il identifiable sans ambiguïté à partir
      de la forme seule ? Utilisé pour n'interroger que sur des formes uniques. */
  function formeAmbigue(verbe, temps, personne) {
    var cible = conjuguer(verbe, temps, personne);
    var occurrences = 0;
    TOUS_LES_TEMPS.forEach(function (t) {
      for (var p = 0; p < 6; p++) {
        if (conjuguer(verbe, t, p) === cible) occurrences++;
      }
    });
    return occurrences > 1;
  }

  CM2.conjugaison = {
    personnes: PERSONNES,
    pronoms: PRONOMS,
    pronomsF: PRONOMS_F,
    tempsSimples: TEMPS_SIMPLES,
    tempsComposes: TEMPS_COMPOSES,
    tousLesTemps: TOUS_LES_TEMPS,
    auxiliaireAu: AUXILIAIRE_AU,
    conjuguer: conjuguer,
    avecPronom: avecPronom,
    negatif: negatif,
    avecPronomNegatif: avecPronomNegatif,
    tableau: tableau,
    accorderParticipe: accorderParticipe,
    formeAmbigue: formeAmbigue,
    commenceParVoyelle: commenceParVoyelle
  };
})(window.CM2 = window.CM2 || {});
