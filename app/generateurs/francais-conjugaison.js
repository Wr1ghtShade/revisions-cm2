/* Conjugaison. Référentiel : fra.grammaire.conjugaison et
   fra.grammaire.accord_sujet_verbe.

   Deux garde-fous permanents :
   - seuls les six temps du programme et les verbes du lexique sont mobilisés
     (donc, pour le troisième groupe, la liste fermée et elle seule) ;
   - la première personne du singulier est écartée de toutes les questions dont
     la réponse est la forme verbale seule : « je » s'élide devant une voyelle,
     et « ai » comme « j'ai » seraient alors deux réponses défendables.

   Quand une question porte sur l'identification d'un temps ou d'une personne,
   la forme est d'abord testée : si elle apparaît à plusieurs endroits du tableau
   de conjugaison, la question serait sans réponse unique et n'est pas posée. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;
  var L = CM2.lexique;
  var C = CM2.conjugaison;

  var PERSONNES_SANS_JE = [1, 2, 3, 4, 5];

  /** Verbe du lexique dans les groupes demandés.
      `sansAuxiliaires` écarte être et avoir, dont le classement en « groupe »
      n'est pas ce que le programme demande de savoir. */
  function verbeConjugable(r, groupes, sansAuxiliaires) {
    var candidats = L.verbes.filter(function (v) {
      if (groupes.indexOf(v.groupe) === -1) return false;
      if (sansAuxiliaires && v.auxiliaire) return false;
      return true;
    });
    return r.choix(candidats);
  }

  function pronomDe(personne) { return C.pronoms[personne]; }

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'cj.forme_demandee',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accord_sujet_verbe.03'],
    titre: 'Conjuguer un verbe',
    generer: function (r) {
      var verbe = verbeConjugable(r, [1, 2, 3]);
      var temps = r.choix(C.tousLesTemps);
      var personne = r.choix(PERSONNES_SANS_JE);
      var forme = C.conjuguer(verbe, temps, personne);

      return {
        enonce: 'Conjugue le verbe « ' + verbe.inf + ' » au ' + temps + ' : ' +
          pronomDe(personne) + ' …',
        type: 'saisie',
        bonne_reponse: forme,
        explication: pronomDe(personne) + ' ' + forme + ' — ' + verbe.inf + ', ' + temps + ', ' +
          C.personnes[personne] + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cj.forme_qcm',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accord_sujet_verbe.03'],
    titre: 'Choisir la bonne forme',
    generer: function (r) {
      var verbe = verbeConjugable(r, [1, 2, 3]);
      var temps = r.choix(C.tousLesTemps);
      var personne = r.choix(PERSONNES_SANS_JE);
      var bonne = C.conjuguer(verbe, temps, personne);

      // Leurres : la même personne à d'autres temps, et d'autres personnes au même temps.
      var candidats = [];
      C.tousLesTemps.forEach(function (t) {
        if (t !== temps) candidats.push(C.conjuguer(verbe, t, personne));
      });
      PERSONNES_SANS_JE.forEach(function (p) {
        if (p !== personne) candidats.push(C.conjuguer(verbe, temps, p));
      });

      var choix = Q.construire(r, bonne, r.melanger(candidats), String);

      return {
        enonce: 'Quelle est la forme correcte de « ' + verbe.inf + ' » au ' + temps +
          ' avec « ' + pronomDe(personne) + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: pronomDe(personne) + ' ' + bonne + ' : ' + temps + ', ' +
          C.personnes[personne] + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cj.identifier_temps',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.05'],
    titre: 'Reconnaître le temps',
    generer: function (r) {
      var verbe, temps, personne, essais = 0;
      do {
        verbe = verbeConjugable(r, [1, 2, 3]);
        temps = r.choix(C.tousLesTemps);
        personne = r.choix(PERSONNES_SANS_JE);
        essais++;
      } while (C.formeAmbigue(verbe, temps, personne) && essais < 40);

      var forme = C.avecPronom(verbe, temps, personne);
      var leurres = C.tousLesTemps.filter(function (t) { return t !== temps; });
      var choix = Q.construire(r, temps, r.melanger(leurres), String);

      return {
        enonce: 'À quel temps est « ' + forme + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + forme + ' » est le ' + temps + ' du verbe ' + verbe.inf + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cj.identifier_personne',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.05'],
    titre: 'Reconnaître la personne',
    generer: function (r) {
      var verbe, temps, personne, essais = 0;
      do {
        verbe = verbeConjugable(r, [1, 2, 3]);
        temps = r.choix(C.tousLesTemps);
        personne = r.choix(PERSONNES_SANS_JE);
        essais++;
      } while (C.formeAmbigue(verbe, temps, personne) && essais < 40);

      var forme = C.conjuguer(verbe, temps, personne);
      var leurres = C.personnes.filter(function (p) { return p !== C.personnes[personne]; });
      var choix = Q.construire(r, C.personnes[personne], r.melanger(leurres), String);

      return {
        enonce: 'À quelle personne est la forme « ' + forme + ' » (verbe ' + verbe.inf + ') ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + pronomDe(personne) + ' ' + forme + ' » : ' + C.personnes[personne] +
          '. La terminaison porte à la fois la marque du temps et celle de la personne.'
      };
    }
  });

  reg.ajouter({
    id: 'cj.infinitif',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.05'],
    titre: 'Retrouver l\'infinitif',
    generer: function (r) {
      var verbe = verbeConjugable(r, [1, 2, 3]);
      var temps = r.choix(C.tempsSimples);
      var personne = r.choix(PERSONNES_SANS_JE);
      var forme = C.avecPronom(verbe, temps, personne);

      return {
        enonce: 'Quel est l\'infinitif du verbe dans « ' + forme + ' » ?',
        type: 'saisie',
        bonne_reponse: verbe.inf,
        explication: '« ' + forme + ' » est une forme du verbe ' + verbe.inf + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cj.groupe_verbe',
    matiere: 'francais',
    objectifs: ['fra.grammaire.variations.01'],
    titre: 'Le groupe d\'un verbe',
    generer: function (r) {
      var verbe = verbeConjugable(r, [1, 2, 3], true);
      var noms = { 1: '1er groupe', 2: '2e groupe', 3: '3e groupe' };
      var bonne = noms[verbe.groupe];
      var leurres = [noms[1], noms[2], noms[3]].filter(function (n) { return n !== bonne; });

      var choix = Q.construire(r, bonne, leurres, String, 3);

      var pourquoi = {
        1: 'Son infinitif se termine par -er et il se conjugue sur le modèle régulier.',
        2: 'Son infinitif se termine par -ir et il fait « nous ' +
           verbe.inf.slice(0, -2) + 'issons » au présent.',
        3: 'C\'est un verbe irrégulier : ses formes ne suivent pas un modèle régulier.'
      }[verbe.groupe];

      return {
        enonce: 'À quel groupe appartient le verbe « ' + verbe.inf + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + verbe.inf +' » est du ' + bonne + '. ' + pourquoi
      };
    }
  });

  reg.ajouter({
    id: 'cj.auxiliaire',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.01'],
    titre: 'Quel auxiliaire ?',
    generer: function (r) {
      // On tire d'abord l'auxiliaire, puis un verbe qui l'emploie : sinon « avoir »
      // serait la bonne réponse neuf fois sur dix et la question s'y répondrait sans
      // réfléchir.
      var auxVoulu = r.chance() ? 'être' : 'avoir';
      var candidats = L.verbes.filter(function (v) {
        return !v.auxiliaire && v.aux === auxVoulu;
      });
      var verbe = r.choix(candidats);
      var temps = r.choix(C.tempsComposes);

      var exemple = C.conjuguer(verbe, temps, 2, { genre: 'm' });

      return {
        enonce: 'Avec quel auxiliaire se conjugue le verbe « ' + verbe.inf + ' » au ' + temps + ' ?',
        type: 'qcm',
        propositions: ['avoir', 'être'],
        bonne_reponse: verbe.aux === 'avoir' ? 0 : 1,
        explication: 'On dit « il ' + exemple + ' » : l\'auxiliaire est ' + verbe.aux + '.' +
          (verbe.aux === 'être'
            ? ' Avec être, le participe passé s\'accorde avec le sujet.'
            : ' Avec avoir, le participe passé ne s\'accorde pas avec le sujet.')
      };
    }
  });

  reg.ajouter({
    id: 'cj.composition_temps_compose',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.01'],
    titre: 'Comment se forme un temps composé',
    generer: function (r) {
      var temps = r.choix(C.tempsComposes);
      var tempsAux = C.auxiliaireAu[temps];
      // « au présent », mais « à l'imparfait » : la préposition dépend du mot.
      var AU = { 'présent': 'au présent', 'imparfait': 'à l\'imparfait', 'futur': 'au futur' };
      var bonne = 'l\'auxiliaire ' + AU[tempsAux] + ' + le participe passé';

      var leurres = [
        'l\'auxiliaire ' + AU[tempsAux === 'présent' ? 'imparfait' : 'présent'] + ' + le participe passé',
        'l\'auxiliaire ' + AU.futur + ' + le participe passé',
        'le verbe à l\'infinitif + le participe passé'
      ];

      var choix = Q.construire(r, bonne, leurres, String);
      var verbe = L.verbe('chanter');
      var exemple = C.avecPronom(verbe, temps, 2);

      return {
        enonce: 'Comment se forme le ' + temps + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le ' + temps + ' se forme avec l\'auxiliaire ' + AU[tempsAux] +
          ' suivi du participe passé : « ' + exemple + ' ».'
      };
    }
  });

  reg.ajouter({
    id: 'cj.accord_participe_etre',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.02'],
    titre: 'Accorder le participe passé avec être',
    generer: function (r) {
      var verbesEtre = L.verbes.filter(function (v) { return v.aux === 'être'; });
      var verbe = r.choix(verbesEtre);
      var temps = r.choix(C.tempsComposes);

      var genre = r.chance() ? 'f' : 'm';
      var pluriel = r.chance();
      var personne = pluriel ? 5 : 2;

      var sujet = pluriel
        ? (genre === 'f' ? 'Les filles' : 'Les garçons')
        : (genre === 'f' ? r.choix(L.prenomsF) : r.choix(L.prenomsM));

      var forme = C.conjuguer(verbe, temps, personne, { genre: genre });
      var participe = forme.split(' ')[1];
      var auxiliaire = forme.split(' ')[0];

      return {
        enonce: sujet + ' ' + auxiliaire + ' … (' + verbe.inf + '). Écris le participe passé bien accordé.',
        type: 'saisie',
        bonne_reponse: participe,
        explication: 'Avec l\'auxiliaire être, le participe passé s\'accorde avec le sujet. ' +
          'Le sujet « ' + sujet + ' » est ' +
          (genre === 'f' ? 'féminin' : 'masculin') + ' ' + (pluriel ? 'pluriel' : 'singulier') +
          ', donc on écrit « ' + participe + ' » : ' + sujet + ' ' + forme + '.'
      };
    }
  });

  reg.ajouter({
    id: 'cj.negation',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.04'],
    titre: 'Mettre à la forme négative',
    generer: function (r) {
      var verbe = verbeConjugable(r, [1, 2, 3]);
      var temps = r.choix(C.tempsComposes);
      var personne = r.choix(PERSONNES_SANS_JE);

      var affirmatif = C.avecPronom(verbe, temps, personne);
      var negatif = C.avecPronomNegatif(verbe, temps, personne);

      return {
        enonce: 'Mets cette phrase à la forme négative : « ' + affirmatif + ' ».',
        type: 'saisie',
        bonne_reponse: negatif,
        explication: 'Aux temps composés, les deux mots de la négation encadrent l\'auxiliaire, ' +
          'pas le participe passé : « ' + negatif + ' ».'
      };
    }
  });

  reg.ajouter({
    id: 'cj.radical_variable',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.06'],
    titre: 'Les verbes dont le radical change',
    generer: function (r) {
      var verbes = L.verbes.filter(function (v) { return !!v.variation; });
      var verbe = r.choix(verbes);

      // On ne pose la question que là où le radical change vraiment : sinon
      // l'exercice n'apprend rien de ce qu'il prétend travailler.
      var interessantes = [];
      C.tousLesTemps.forEach(function (t) {
        for (var p = 0; p < 6; p++) {
          var forme = C.conjuguer(verbe, t, p);
          var regulier = verbe.inf.slice(0, -2);
          if (forme.indexOf(regulier) !== 0) interessantes.push({ temps: t, personne: p });
        }
      });
      if (!interessantes.length) interessantes.push({ temps: 'présent', personne: 3 });

      var cas = r.choix(interessantes);
      var bonne = C.conjuguer(verbe, cas.temps, cas.personne);

      // Les leurres sont les autres formes du même verbe : c'est entre elles
      // que l'élève doit choisir, pas entre une forme juste et une bouillie.
      var leurres = [];
      C.tousLesTemps.forEach(function (t) {
        if (t !== cas.temps) leurres.push(C.conjuguer(verbe, t, cas.personne));
      });
      for (var p2 = 0; p2 < 6; p2++) {
        if (p2 !== cas.personne) leurres.push(C.conjuguer(verbe, cas.temps, p2));
      }

      var choix = Q.construire(r, bonne, r.melanger(leurres), String);

      return {
        enonce: 'Conjugue « ' + verbe.inf + ' » au ' + cas.temps + ' avec « ' +
          C.pronoms[cas.personne] + ' ». Attention, le radical change.',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: C.pronoms[cas.personne] + ' ' + bonne + '. « ' + verbe.inf +
          ' » fait partie des verbes en ' + verbe.variation + ' : son radical se modifie à ' +
          'certaines personnes, il faut retenir ces formes.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
