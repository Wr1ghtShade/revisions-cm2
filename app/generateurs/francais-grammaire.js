/* Grammaire : nature des mots, fonction des groupes, types de phrases.
   Référentiel : fra.grammaire.nature_fonction, .classes, .groupe_nominal,
   .phrase_simple, .phrase_complexe, .types_phrases.

   Interdit du programme respecté partout ici : le mot « proposition » n'apparaît
   dans aucun énoncé ni aucune explication. Une phrase complexe se reconnaît en
   comptant les verbes conjugués, et rien d'autre. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;
  var L = CM2.lexique;
  var C = CM2.conjugaison;
  var P = CM2.phrases;

  var CLASSES = ['nom', 'verbe', 'adjectif', 'article défini', 'article indéfini',
                 'déterminant démonstratif', 'déterminant possessif', 'préposition',
                 'adverbe', 'pronom personnel', 'conjonction de coordination',
                 'conjonction de subordination'];

  /* Article à employer devant chaque nom de classe, pour que les explications
     soient écrites en français correct. */
  var ARTICLE_CLASSE = {
    'nom': 'un', 'verbe': 'un', 'adjectif': 'un',
    'article défini': 'un', 'article indéfini': 'un',
    'déterminant démonstratif': 'un', 'déterminant possessif': 'un',
    'préposition': 'une', 'adverbe': 'un', 'pronom personnel': 'un',
    'conjonction de coordination': 'une', 'conjonction de subordination': 'une'
  };

  /* ------------------------------------------------------------------ */

  reg.ajouter({
    id: 'gr.nature_mot',
    matiere: 'francais',
    objectifs: ['fra.grammaire.nature_fonction.01', 'fra.grammaire.nature_fonction.02',
                'fra.grammaire.variations.01'],
    titre: 'La nature d\'un mot',
    generer: function (r) {
      var ph = P.phrase(r, {
        complement: r.choix(['cod', 'aucun']),
        sujetAdjectif: true,
        circonstanciel: r.chance(0.5) ? 'lieu' : null
      });

      // Mots dont la nature est connue par construction.
      var candidats = ph.sujet.mots.slice();
      candidats.push({ mot: ph.formeVerbale, classe: 'verbe' });
      if (ph.cod) ph.cod.mots.forEach(function (m) { candidats.push(m); });
      if (ph.circonstanciel && ph.circonstanciel.preposition) {
        candidats.push({ mot: ph.circonstanciel.preposition, classe: 'préposition' });
      }

      var cible = r.choix(candidats);
      var leurres = CLASSES.filter(function (c) { return c !== cible.classe; });
      var choix = Q.construire(r, cible.classe, r.melanger(leurres), String);

      return {
        enonce: 'Dans la phrase « ' + ph.texte + ' », quelle est la nature du mot « ' +
          cible.mot + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + cible.mot + ' » est ' + ARTICLE_CLASSE[cible.classe] + ' ' +
          cible.classe +
          '. La nature d\'un mot ne change pas selon la phrase : c\'est sa fonction qui change.'
      };
    }
  });

  reg.ajouter({
    id: 'gr.fonction_groupe',
    matiere: 'francais',
    objectifs: ['fra.grammaire.nature_fonction.01', 'fra.grammaire.nature_fonction.02',
                'fra.grammaire.phrase_simple.03', 'fra.grammaire.phrase_simple.06'],
    titre: 'La fonction d\'un groupe',
    generer: function (r) {
      var complement = r.choix(['cod', 'coi', 'attribut']);
      var circonstanciel = r.choix(['temps', 'lieu', 'cause', null]);
      var ph = P.phrase(r, { complement: complement, circonstanciel: circonstanciel });

      var cible = r.choix(ph.groupes);
      var fonctionsPossibles = ['sujet', 'complément d\'objet direct', 'complément d\'objet indirect',
                                'attribut du sujet', 'complément circonstanciel de temps',
                                'complément circonstanciel de lieu', 'complément circonstanciel de cause'];
      var leurres = fonctionsPossibles.filter(function (f) { return f !== cible.fonction; });

      var choix = Q.construire(r, cible.fonction, r.melanger(leurres), String);

      var aide = {
        'sujet': 'On le trouve en demandant « qui est-ce qui … ? ».',
        'complément d\'objet direct': 'Il répond à « qui ? » ou « quoi ? » après le verbe, sans préposition.',
        'complément d\'objet indirect': 'Il répond à « à qui ? » ou « à quoi ? » : il est relié au verbe par une préposition.',
        'attribut du sujet': 'Il est relié au sujet par le verbe être et dit ce que le sujet est.',
        'complément circonstanciel de temps': 'Il répond à « quand ? ».',
        'complément circonstanciel de lieu': 'Il répond à « où ? ».',
        'complément circonstanciel de cause': 'Il répond à « pourquoi ? ».'
      }[cible.fonction];

      return {
        enonce: 'Dans la phrase « ' + ph.texte + ' », quelle est la fonction du groupe « ' +
          cible.texte + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + cible.texte + ' » est ' + cible.fonction + '. ' + aide
      };
    }
  });

  reg.ajouter({
    id: 'gr.cod_ou_coi',
    matiere: 'francais',
    objectifs: ['fra.grammaire.phrase_simple.05'],
    titre: 'COD ou COI ?',
    generer: function (r) {
      var direct = r.chance();
      var ph = P.phrase(r, { complement: direct ? 'cod' : 'coi' });
      var groupe = ph.groupes[1];

      return {
        enonce: 'Dans la phrase « ' + ph.texte + ' », le groupe « ' + groupe.texte +
          ' » est-il complément d\'objet direct ou indirect ?',
        type: 'qcm',
        propositions: ['complément d\'objet direct', 'complément d\'objet indirect'],
        bonne_reponse: direct ? 0 : 1,
        explication: direct
          ? 'Le complément suit le verbe sans préposition : c\'est un complément d\'objet direct. ' +
            'On demande « ' + ph.formeVerbale + ' quoi ? » ou « ' + ph.formeVerbale + ' qui ? ».'
          : 'Le complément est relié au verbe par la préposition « à » : c\'est un complément ' +
            'd\'objet indirect. On demande « ' + ph.formeVerbale + ' à qui ? » ou « à quoi ? ».'
      };
    }
  });

  reg.ajouter({
    id: 'gr.epithete_ou_attribut',
    matiere: 'francais',
    objectifs: ['fra.grammaire.groupe_nominal.03', 'fra.grammaire.phrase_simple.04'],
    titre: 'Épithète ou attribut du sujet ?',
    generer: function (r) {
      var attribut = r.chance();
      var ph, adjectif, fonction;

      if (attribut) {
        ph = P.phrase(r, { complement: 'attribut' });
        adjectif = ph.groupes[1].texte;
        fonction = 'attribut du sujet';
      } else {
        ph = P.phrase(r, { complement: 'aucun', sujetAdjectif: true });
        adjectif = ph.sujet.mots[2].mot;
        fonction = 'épithète';
      }

      return {
        enonce: 'Dans la phrase « ' + ph.texte + ' », quelle est la fonction de l\'adjectif « ' +
          adjectif + ' » ?',
        type: 'qcm',
        propositions: ['épithète', 'attribut du sujet'],
        bonne_reponse: attribut ? 1 : 0,
        explication: attribut
          ? 'L\'adjectif est séparé du nom par le verbe être : il est attribut du sujet. ' +
            'Si on retire « ' + adjectif + ' », la phrase ne veut plus rien dire.'
          : 'L\'adjectif est placé directement à côté du nom, à l\'intérieur du groupe nominal : ' +
            'il est épithète. On peut le retirer, la phrase reste correcte.'
      };
    }
  });

  reg.ajouter({
    id: 'gr.complement_du_nom',
    matiere: 'francais',
    objectifs: ['fra.grammaire.groupe_nominal.02', 'fra.grammaire.groupe_nominal.01'],
    titre: 'Le complément du nom',
    generer: function (r) {
      var gn = P.groupeNominal(r, {
        nombre: 's',
        determinants: ['article défini', 'déterminant démonstratif']
      });
      var cdn = P.complementDuNom(r);
      var groupe = gn.texte + ' ' + cdn.texte;

      var leurres = [gn.texte, gn.determinantTexte + ' ' + gn.nom.s, cdn.mots[1].mot];
      var choix = Q.construire(r, cdn.texte, leurres, String);

      return {
        enonce: 'Dans le groupe nominal « ' + groupe + ' », quel est le complément du nom ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le nom principal est « ' + gn.nom.s + ' ». Il est complété par « ' +
          cdn.texte + ' », un groupe introduit par une préposition : c\'est le complément du nom.'
      };
    }
  });

  reg.ajouter({
    id: 'gr.phrase_simple_complexe',
    matiere: 'francais',
    objectifs: ['fra.grammaire.phrase_complexe.01'],
    titre: 'Phrase simple ou phrase complexe ?',
    generer: function (r) {
      var complexe = r.chance();
      var a = P.phrase(r, { complement: r.choix(['cod', 'aucun']) });

      var texte, nombreVerbes, formes;
      if (complexe) {
        var b = P.phrase(r, { complement: r.choix(['cod', 'aucun']) });
        // Les deux phrases sont tirées indépendamment : on n'emploie donc que des
        // liens qui n'affirment rien de leur rapport. « donc » ou « parce que »
        // annonceraient une cause qui n'existe pas.
        var lien = r.chance()
          ? r.choix(['et', 'mais'])
          : r.choix(['quand', 'lorsque']);
        texte = a.texte.slice(0, -1) + ' ' + lien + ' ' + b.texte.charAt(0).toLowerCase() + b.texte.slice(1);
        nombreVerbes = 2;
        formes = [a.formeVerbale, b.formeVerbale];
      } else {
        texte = a.texte;
        nombreVerbes = 1;
        formes = [a.formeVerbale];
      }

      return {
        enonce: '« ' + texte + ' » — cette phrase est-elle simple ou complexe ?',
        type: 'qcm',
        propositions: ['une phrase simple', 'une phrase complexe'],
        bonne_reponse: complexe ? 1 : 0,
        explication: 'On compte les verbes conjugués : il y en a ' + nombreVerbes + ' (' +
          formes.join(', ') + '). Une phrase à un seul verbe conjugué est simple ; ' +
          'une phrase qui en contient plusieurs est complexe.'
      };
    }
  });

  reg.ajouter({
    id: 'gr.classe_mot_invariable',
    matiere: 'francais',
    objectifs: ['fra.grammaire.classes.01', 'fra.grammaire.classes.02'],
    titre: 'Préposition, conjonction ou adverbe ?',
    generer: function (r) {
      var cas = r.entier(1, 3);
      var mot, classe;
      if (cas === 1) {
        mot = r.choix(L.prepositions);
        classe = 'une préposition';
      } else if (cas === 2) {
        mot = r.choix(L.conjonctionsCoordination);
        classe = 'une conjonction de coordination';
      } else {
        mot = r.choix(L.conjonctionsSubordination);
        classe = 'une conjonction de subordination';
      }

      var toutes = ['une préposition', 'une conjonction de coordination',
                    'une conjonction de subordination'];
      var choix = Q.construire(r, classe, toutes.filter(function (c) { return c !== classe; }), String, 3);

      var aide = {
        'une préposition': 'Une préposition introduit un groupe : elle relie un mot à son complément.',
        'une conjonction de coordination': 'Les conjonctions de coordination sont : mais, ou, et, donc, or, ni, car.',
        'une conjonction de subordination': 'Une conjonction de subordination relie deux verbes conjugués : ' +
          'elle rattache une partie de la phrase à une autre.'
      }[classe];

      return {
        enonce: 'Le mot « ' + mot + ' » est…',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + mot + ' » est ' + classe + '. ' + aide
      };
    }
  });

  reg.ajouter({
    id: 'gr.pronom_sujet_complement',
    matiere: 'francais',
    objectifs: ['fra.grammaire.classes.03', 'fra.grammaire.classes.04'],
    titre: 'Pronom sujet ou pronom complément ?',
    generer: function (r) {
      var sujet = r.chance();
      var verbe = L.verbe('regarder');
      var objet = r.choix(L.nomsDe(['objet', 'ecrit', 'animal']));
      var objetTexte = (objet.g === 'f' ? 'la ' : 'le ') + objet.s;

      var phrase, pronom, explication;
      if (sujet) {
        var personne = r.entier(0, 5);
        pronom = C.pronoms[personne];
        phrase = P.majuscule(C.avecPronom(verbe, 'présent', personne)) + ' ' + objetTexte + '.';
        explication = '« ' + pronom + ' » commande l\'accord du verbe : c\'est un pronom personnel sujet.';
      } else {
        pronom = r.choix(['me', 'te', 'nous', 'vous', 'les']);
        phrase = 'Paul ' + pronom + ' ' + C.conjuguer(verbe, 'présent', 2) + '.';
        explication = '« ' + pronom + ' » se place avant le verbe et reçoit l\'action : ' +
          'c\'est un pronom personnel complément. Le sujet, lui, est « Paul ».';
      }

      return {
        enonce: 'Dans la phrase « ' + phrase + ' », le pronom « ' + pronom + ' » est…',
        type: 'qcm',
        propositions: ['un pronom personnel sujet', 'un pronom personnel complément'],
        bonne_reponse: sujet ? 0 : 1,
        explication: explication
      };
    }
  });

  reg.ajouter({
    id: 'gr.type_de_phrase',
    matiere: 'francais',
    objectifs: ['fra.grammaire.types_phrases.01'],
    titre: 'Le type de phrase',
    generer: function (r) {
      var ph = P.phrase(r, { complement: r.choix(['cod', 'aucun']) });
      var type = r.choix(['déclarative', 'interrogative', 'exclamative']);

      var texte;
      if (type === 'déclarative') {
        texte = ph.texte;
      } else if (type === 'interrogative') {
        texte = 'Est-ce que ' + ph.texte.charAt(0).toLowerCase() + ph.texte.slice(1, -1) + ' ?';
      } else {
        // Une phrase déclarative close par un point d'exclamation est exclamative :
        // c'est la ponctuation qui porte le type, pas un tour syntaxique particulier.
        texte = ph.texte.slice(0, -1) + ' !';
      }

      var toutes = ['déclarative', 'interrogative', 'exclamative'];
      var choix = Q.construire(r, type, toutes.filter(function (t) { return t !== type; }), String, 3);

      var aide = {
        'déclarative': 'Elle donne une information et se termine par un point.',
        'interrogative': 'Elle pose une question et se termine par un point d\'interrogation.',
        'exclamative': 'Elle exprime un sentiment et se termine par un point d\'exclamation.'
      }[type];

      return {
        enonce: 'De quel type est la phrase « ' + texte + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'C\'est une phrase ' + type + '. ' + aide
      };
    }
  });

  reg.ajouter({
    id: 'gr.type_de_sujet',
    matiere: 'francais',
    objectifs: ['fra.grammaire.phrase_simple.01'],
    titre: 'De quelle sorte est le sujet ?',
    generer: function (r) {
      var sorte = r.entier(1, 3);
      var ph = P.phrase(r, { complement: r.choix(['cod', 'aucun']) });
      var texte, sujet, bonne, aide;

      if (sorte === 1) {
        texte = ph.texte;
        sujet = ph.sujet.texte;
        bonne = 'un groupe nominal';
        aide = 'Il est formé d\'un déterminant et d\'un nom.';
      } else if (sorte === 2) {
        var prenom = r.chance() ? r.choix(L.prenomsF) : r.choix(L.prenomsM);
        // Le verbe reste à la 3e personne du singulier : on remplace un groupe
        // nominal singulier par un nom propre, l'accord ne bouge pas.
        var phSing = P.phrase(r, { complement: r.choix(['cod', 'aucun']), nombreSujet: 's' });
        texte = prenom + ' ' + phSing.texte.slice(phSing.sujet.texte.length + 1);
        sujet = prenom;
        bonne = 'un nom propre';
        aide = 'Il désigne quelqu\'un par son nom et prend une majuscule.';
      } else {
        var phP = P.phrase(r, { complement: r.choix(['cod', 'aucun']), nombreSujet: 'p' });
        sujet = 'Ils';
        texte = 'Ils ' + phP.texte.slice(phP.sujet.texte.length + 1);
        bonne = 'un pronom personnel';
        aide = 'Il remplace un groupe nominal déjà connu.';
      }

      var toutes = ['un groupe nominal', 'un nom propre', 'un pronom personnel'];
      var choix = Q.construire(r, bonne, toutes.filter(function (t) { return t !== bonne; }),
                               String, 3);

      return {
        enonce: 'Dans la phrase « ' + texte + ' », le sujet « ' + sujet + ' » est…',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + sujet + ' » est ' + bonne + '. ' + aide +
          ' Un sujet peut prendre ces trois formes.'
      };
    }
  });

  reg.ajouter({
    id: 'gr.variation_pronom',
    matiere: 'francais',
    objectifs: ['fra.grammaire.classes.05'],
    titre: 'Les variations du pronom personnel',
    generer: function (r) {
      var cas = r.choix([
        { q: 'Quel pronom personnel sujet remplace « les chats » ?', bonne: 'ils',
          leurres: ['elles', 'il', 'nous'],
          e: '« les chats » est masculin pluriel : on le remplace par « ils ».' },
        { q: 'Quel pronom personnel sujet remplace « les fleurs » ?', bonne: 'elles',
          leurres: ['ils', 'elle', 'vous'],
          e: '« les fleurs » est féminin pluriel : on le remplace par « elles ».' },
        { q: 'Quel pronom personnel sujet remplace « la voisine » ?', bonne: 'elle',
          leurres: ['il', 'elles', 'lui'],
          e: '« la voisine » est féminin singulier : on le remplace par « elle ».' },
        { q: 'Quel pronom personnel sujet remplace « mon frère et moi » ?', bonne: 'nous',
          leurres: ['vous', 'ils', 'je'],
          e: 'Quand « moi » fait partie du groupe, le pronom est « nous », à la 1re personne du pluriel.' },
        { q: 'Quel pronom personnel sujet remplace « toi et ta sœur » ?', bonne: 'vous',
          leurres: ['nous', 'elles', 'tu'],
          e: 'Quand « toi » fait partie du groupe, sans « moi », le pronom est « vous ».' },
        { q: 'À quelle personne est le pronom « vous » ?', bonne: '2e personne du pluriel',
          leurres: ['2e personne du singulier', '1re personne du pluriel', '3e personne du pluriel'],
          e: '« vous » est la 2e personne du pluriel : on parle à plusieurs personnes.' }
      ]);

      var choix = Q.construire(r, cas.bonne, cas.leurres, String);

      return {
        enonce: cas.q,
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: cas.e
      };
    }
  });

  reg.ajouter({
    id: 'gr.supprimer_complement',
    matiere: 'francais',
    objectifs: ['fra.grammaire.phrase_simple.07'],
    titre: 'Supprimer ou déplacer un groupe',
    generer: function (r) {
      var type = r.choix(['temps', 'lieu', 'cause']);
      var ph = P.phrase(r, { complement: r.choix(['cod', 'aucun']), circonstanciel: type });
      var cc = ph.circonstanciel.texte;

      // La phrase privée de son complément circonstanciel : elle reste correcte,
      // c'est justement ce qui distingue ce groupe des autres.
      var sans = ph.texte.replace(' ' + cc + '.', '.');
      var leurres = [
        ph.texte.replace(' ' + cc + '.', '.').replace(ph.formeVerbale + ' ', ''),
        P.majuscule(cc) + ', ' + ph.texte.charAt(0).toLowerCase() +
          ph.texte.slice(1).replace(' ' + cc + '.', '.'),
        ph.texte
      ];

      var choix = Q.construire(r, sans, leurres, String);

      return {
        enonce: 'Dans la phrase « ' + ph.texte + ' », quelle phrase obtient-on en supprimant ' +
          'le groupe « ' + cc + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le groupe « ' + cc + ' » est un ' + ph.circonstanciel.type +
          '. On peut le supprimer : la phrase reste correcte. On peut aussi le déplacer en ' +
          'tête de phrase. Ce n\'est le cas ni du sujet ni du complément d\'objet.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
