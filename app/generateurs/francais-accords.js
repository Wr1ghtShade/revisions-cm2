/* Accords : groupe nominal, sujet-verbe, participe passé.
   Référentiel : fra.grammaire.accords_gn, fra.grammaire.accord_sujet_verbe,
   fra.grammaire.conjugaison.

   Toutes les formes affichées viennent du lexique, où elles sont écrites à la
   main. Aucun pluriel ni féminin n'est fabriqué en ajoutant un s au hasard. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;
  var L = CM2.lexique;
  var C = CM2.conjugaison;
  var P = CM2.phrases;

  var DETERMINANTS_VARIABLES = ['article défini', 'déterminant démonstratif', 'déterminant possessif'];

  function determinantsFiltres(classes) {
    return L.determinants.filter(function (d) { return classes.indexOf(d.classe) !== -1; });
  }

  function adjectifPour(r, nom) {
    return r.choix(L.adjectifsPour(nom, true));
  }

  function ecrireGN(det, nom, adj, nombre) {
    var bouts = [L.accorderDeterminant(det, nom.g, nombre),
                 nombre === 'p' ? nom.p : nom.s];
    if (adj) bouts.push(L.accorderAdjectif(adj, nom.g, nombre));
    return bouts.join(' ');
  }

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'ac.gn_pluriel',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accords_gn.01', 'fra.grammaire.accords_gn.02'],
    titre: 'Mettre un groupe nominal au pluriel',
    generer: function (r) {
      var nom = r.choix(L.noms);
      var det = r.choix(determinantsFiltres(DETERMINANTS_VARIABLES));
      var adj = r.chance(0.7) ? adjectifPour(r, nom) : null;

      var singulier = ecrireGN(det, nom, adj, 's');
      var pluriel = ecrireGN(det, nom, adj, 'p');

      var detail = nom.p === nom.s
        ? 'Le nom « ' + nom.s + ' » se termine déjà par s : il ne change pas au pluriel.'
        : '« ' + nom.s + ' » devient « ' + nom.p + ' ».';

      return {
        enonce: 'Écris ce groupe nominal au pluriel : ' + singulier,
        type: 'saisie',
        bonne_reponse: pluriel,
        explication: singulier + ' → ' + pluriel + '. ' + detail +
          (adj ? ' L\'adjectif s\'accorde lui aussi avec le nom.' : '')
      };
    }
  });

  reg.ajouter({
    id: 'ac.gn_singulier',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accords_gn.01'],
    titre: 'Mettre un groupe nominal au singulier',
    generer: function (r) {
      var nom = r.choix(L.noms);
      var det = r.choix(determinantsFiltres(DETERMINANTS_VARIABLES));
      var adj = r.chance(0.7) ? adjectifPour(r, nom) : null;

      return {
        enonce: 'Écris ce groupe nominal au singulier : ' + ecrireGN(det, nom, adj, 'p'),
        type: 'saisie',
        bonne_reponse: ecrireGN(det, nom, adj, 's'),
        explication: ecrireGN(det, nom, adj, 'p') + ' → ' + ecrireGN(det, nom, adj, 's') +
          '. Tous les mots du groupe changent ensemble : c\'est la chaîne d\'accords.'
      };
    }
  });

  reg.ajouter({
    id: 'ac.adjectif',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accords_gn.01'],
    titre: 'Accorder l\'adjectif',
    generer: function (r) {
      var nom = r.choix(L.noms);
      var det = r.choix(determinantsFiltres(DETERMINANTS_VARIABLES.concat(['article indéfini'])));
      var adj = adjectifPour(r, nom);
      var nombre = r.chance() ? 's' : 'p';

      // L'article indéfini pluriel « des » reste correct ici : l'adjectif est placé
      // après le nom, la règle « de + adjectif antéposé » ne s'applique pas.
      var debut = L.accorderDeterminant(det, nom.g, nombre) + ' ' + (nombre === 'p' ? nom.p : nom.s);
      var forme = L.accorderAdjectif(adj, nom.g, nombre);

      return {
        enonce: 'Accorde l\'adjectif : ' + debut + ' (' + adj.m + ')',
        type: 'saisie',
        bonne_reponse: forme,
        explication: '« ' + (nombre === 'p' ? nom.p : nom.s) + ' » est ' +
          (nom.g === 'f' ? 'féminin' : 'masculin') + ' ' +
          (nombre === 'p' ? 'pluriel' : 'singulier') + ', donc on écrit « ' + debut + ' ' + forme + ' ».'
      };
    }
  });

  reg.ajouter({
    id: 'ac.gn_correct',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accords_gn.01', 'fra.grammaire.variations.01'],
    titre: 'Le groupe nominal bien accordé',
    generer: function (r) {
      var nom = r.choix(L.noms.filter(function (n) { return n.p !== n.s; }));
      var det = r.choix(determinantsFiltres(DETERMINANTS_VARIABLES));
      var adj = adjectifPour(r, nom);
      var nombre = r.chance() ? 's' : 'p';
      var autre = nombre === 's' ? 'p' : 's';

      var bonne = ecrireGN(det, nom, adj, nombre);

      // Leurres : un seul mot du groupe reste mal accordé.
      var leurres = [
        [L.accorderDeterminant(det, nom.g, autre), nombre === 'p' ? nom.p : nom.s,
         L.accorderAdjectif(adj, nom.g, nombre)].join(' '),
        [L.accorderDeterminant(det, nom.g, nombre), autre === 'p' ? nom.p : nom.s,
         L.accorderAdjectif(adj, nom.g, nombre)].join(' '),
        [L.accorderDeterminant(det, nom.g, nombre), nombre === 'p' ? nom.p : nom.s,
         L.accorderAdjectif(adj, nom.g, autre)].join(' ')
      ];

      var choix = Q.construire(r, bonne, leurres, String);

      return {
        enonce: 'Quel groupe nominal est correctement accordé ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + bonne + ' » : le déterminant, le nom et l\'adjectif portent tous ' +
          'la marque du ' + (nombre === 'p' ? 'pluriel' : 'singulier') + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ac.sujet_verbe',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accord_sujet_verbe.01'],
    titre: 'Accorder le verbe avec son sujet',
    generer: function (r) {
      var temps = r.choix(['présent', 'imparfait', 'futur', 'passé simple']);
      var ph = P.phrase(r, { complement: r.choix(['cod', 'aucun']), temps: temps });

      var bonne = ph.formeVerbale;
      var autrePersonne = ph.personne === 5 ? 2 : 5;
      var leurres = [C.conjuguer(ph.verbe, temps, autrePersonne)];
      [0, 1, 3, 4].forEach(function (p) {
        leurres.push(C.conjuguer(ph.verbe, temps, p));
      });

      var choix = Q.construire(r, bonne, leurres, String);
      var trou = ph.texte.replace(bonne, '…');

      return {
        enonce: 'Complète avec la forme correcte du verbe « ' + ph.verbe.inf + ' » (' + temps + ') : ' + trou,
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le sujet est « ' + ph.sujet.texte + ' », ' +
          (ph.sujet.nombre === 'p' ? 'au pluriel' : 'au singulier') +
          '. Le verbe s\'accorde avec lui : ' + ph.texte
      };

    }
  });

  reg.ajouter({
    id: 'ac.sujet_inverse',
    matiere: 'francais',
    objectifs: ['fra.grammaire.phrase_simple.02', 'fra.grammaire.accord_sujet_verbe.01'],
    titre: 'Le sujet inversé',
    generer: function (r) {
      var ph = P.phrase(r, {
        complement: 'aucun',
        circonstanciel: 'lieu',
        temps: r.choix(['présent', 'imparfait'])
      });

      // On réécrit la phrase en plaçant le complément en tête et le sujet après le verbe.
      var texte = P.majuscule(ph.circonstanciel.texte) + ' ' + ph.formeVerbale + ' ' +
                  ph.sujet.texte + '.';

      var leurres = [ph.circonstanciel.texte, ph.formeVerbale];
      if (ph.circonstanciel.groupeNominal) {
        leurres.push(ph.circonstanciel.groupeNominal.texte);
      }

      var choix = Q.construire(r, ph.sujet.texte, leurres, String);

      return {
        enonce: 'Dans la phrase « ' + texte + ' », quel est le sujet du verbe ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le sujet est « ' + ph.sujet.texte + ' » : c\'est lui qui fait l\'action, ' +
          'même s\'il est placé après le verbe. On le vérifie en disant « ' +
          (ph.sujet.nombre === 'p' ? 'ce sont ' : 'c\'est ') +
          ph.sujet.texte + ' qui ' + ph.formeVerbale + ' ».'
      };
    }
  });

  reg.ajouter({
    id: 'ac.participe_cod',
    matiere: 'francais',
    objectifs: ['fra.grammaire.conjugaison.03'],
    titre: 'Accorder le participe passé avec le COD placé avant',
    generer: function (r) {
      var modeles = P.verbesCod.filter(function (m) {
        return ['prendre', 'voir', 'laver', 'fermer', 'choisir', 'regarder', 'faire'].indexOf(m.inf) !== -1;
      });
      var modele = r.choix(modeles);
      var verbe = L.verbe(modele.inf);

      var cod = P.groupeNominal(r, {
        categories: modele.objet,
        determinants: ['article défini', 'déterminant démonstratif']
      });

      var sujetPrenom = r.chance()
        ? r.choix(L.prenomsF)
        : r.choix(L.prenomsM);

      var pronomCod = cod.nombre === 'p' ? 'les' : (cod.genre === 'f' ? 'la' : 'le');
      var participe = C.accorderParticipe(verbe.pp, cod.genre, cod.nombre);
      var auxiliaire = C.conjuguer(L.verbe('avoir'), 'présent', 2);

      // « la a » se dit « l'a » : le pronom singulier s'élide devant l'auxiliaire.
      var groupePronom = (pronomCod !== 'les' && C.commenceParVoyelle(auxiliaire))
        ? 'l\'' + auxiliaire
        : pronomCod + ' ' + auxiliaire;

      var phrase = P.majuscule(cod.texte) + ', ' + sujetPrenom + ' ' + groupePronom +
                   ' déjà … (' + verbe.inf + ').';

      return {
        enonce: 'Écris le participe passé bien accordé : ' + phrase,
        type: 'saisie',
        bonne_reponse: participe,
        explication: 'Avec l\'auxiliaire avoir, le participe passé s\'accorde avec le complément ' +
          'd\'objet direct quand celui-ci est placé avant le verbe. Ici le COD est le pronom ' +
          'qui reprend « ' + cod.texte + ' » (' +
          (cod.genre === 'f' ? 'féminin' : 'masculin') + ' ' +
          (cod.nombre === 'p' ? 'pluriel' : 'singulier') + '), donc « ' + participe + ' ».'
      };
    }
  });

  reg.ajouter({
    id: 'ac.attribut_du_sujet',
    matiere: 'francais',
    objectifs: ['fra.grammaire.accord_sujet_verbe.02', 'fra.grammaire.groupe_nominal.03'],
    titre: 'Accorder l\'attribut du sujet',
    generer: function (r) {
      var ph = P.phrase(r, { complement: 'attribut', temps: r.choix(['présent', 'imparfait']) });
      var attendu = L.accorderAdjectif(ph.attribut, ph.sujet.genre, ph.sujet.nombre);
      var trou = ph.texte.replace(' ' + attendu + '.', ' … (' + ph.attribut.m + ').');

      return {
        enonce: 'Accorde l\'attribut du sujet : ' + trou,
        type: 'saisie',
        bonne_reponse: attendu,
        explication: 'L\'adjectif est relié au sujet par le verbe être : c\'est un attribut du ' +
          'sujet, et il s\'accorde avec le sujet. « ' + ph.sujet.texte + ' » est ' +
          (ph.sujet.genre === 'f' ? 'féminin' : 'masculin') + ' ' +
          (ph.sujet.nombre === 'p' ? 'pluriel' : 'singulier') + ', donc on écrit « ' +
          attendu + ' ».'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
