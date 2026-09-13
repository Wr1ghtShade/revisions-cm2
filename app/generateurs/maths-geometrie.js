/* Géométrie plane : vocabulaire, codes, perpendiculaires et parallèles,
   cercle et disque, reconnaissance des figures et de leurs propriétés.
   Référentiel : mat.eg.plane.01 et .03 à .08.

   Deux interdits du programme commandent ce fichier :

   - les notations (AB), [AB], [AB) ne sont pas exigibles ; les questions
     nomment donc toujours l'objet en toutes lettres (« le segment », « la
     droite »). Seuls les *codes* dessinés sur une figure sont demandés : le
     petit carré de l'angle droit, les traits identiques des longueurs égales ;
   - aucune mesure d'angle n'est employée en dehors de l'angle droit.

   Les objectifs de tracé — reproduire une figure, la construire, se servir du
   compas et de l'équerre — ne figurent pas ici : ils demandent la main, la
   feuille et les instruments, pas un écran.

   Élaborer un programme de construction (mat.eg.plane.11), en revanche, est
   affaire de langue et d'ordre : il faut dire quoi tracer, et dans quel ordre
   c'est possible. Cela s'évalue sans rien tracer, en demandant de remettre les
   étapes dans l'ordre — à condition que chaque étape ait besoin de la
   précédente, sinon plusieurs ordres seraient justes. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;

  /* --- Vocabulaire des lignes ------------------------------------------ */

  var LIGNES = [
    { nom: 'un segment', definition: 'une ligne droite limitée par deux points' },
    { nom: 'une droite', definition: 'une ligne droite illimitée des deux côtés' },
    { nom: 'une demi-droite', definition: 'une ligne droite qui part d\'un point et se prolonge sans fin d\'un seul côté' }
  ];

  reg.ajouter({
    id: 'geo.vocabulaire_lignes',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.01'],
    titre: 'Segment, droite, demi-droite',
    generer: function (r) {
      var l = r.choix(LIGNES);
      var sensDirect = r.chance();

      if (sensDirect) {
        var leurres = LIGNES.filter(function (x) { return x.nom !== l.nom; })
                            .map(function (x) { return x.nom; });
        var choix = Q.construire(r, l.nom, leurres, String, 3);
        return {
          enonce: 'Comment appelle-t-on ' + l.definition + ' ?',
          type: 'qcm',
          propositions: choix.propositions,
          bonne_reponse: choix.bonne_reponse,
          explication: C(l.nom) + ', c\'est ' + l.definition + '.'
        };
      }

      var leurres2 = LIGNES.filter(function (x) { return x.nom !== l.nom; })
                           .map(function (x) { return x.definition; });
      var choix2 = Q.construire(r, l.definition, leurres2, String, 3);
      return {
        // « qu'un », « qu'une » : l'élision vaut pour les deux articles.
        enonce: 'Qu\'est-ce qu\'' + l.nom + ' ?',
        type: 'qcm',
        propositions: choix2.propositions,
        bonne_reponse: choix2.bonne_reponse,
        explication: C(l.nom) + ', c\'est ' + l.definition + '.'
      };
    }
  });

  function C(texte) { return texte.charAt(0).toUpperCase() + texte.slice(1); }

  /* --- Codes des figures ------------------------------------------------ */

  var CODES = [
    { q: 'Sur une figure, que signifie un petit carré dessiné dans un coin ?',
      bonne: 'que cet angle est un angle droit',
      leurres: ['que ce côté est le plus long', 'que la figure est un carré',
                'que ce sommet est le centre de la figure'],
      e: 'Le petit carré est le code de l\'angle droit. Il évite d\'avoir à le vérifier à l\'équerre.' },
    { q: 'Sur une figure, que signifient deux petits traits identiques tracés sur deux côtés ?',
      bonne: 'que ces deux côtés ont la même longueur',
      leurres: ['que ces deux côtés sont parallèles', 'que ces deux côtés sont perpendiculaires',
                'que ces deux côtés sont les plus courts'],
      e: 'Des traits identiques codent l\'égalité des longueurs : les côtés qui portent le même ' +
         'signe ont la même longueur.' },
    { q: 'Sur une figure, que signifient des flèches identiques sur deux droites ?',
      bonne: 'que ces deux droites sont parallèles',
      leurres: ['que ces deux droites sont perpendiculaires',
                'que ces deux droites ont la même longueur',
                'que ces deux droites se croisent'],
      e: 'Les flèches identiques codent le parallélisme : les droites gardent partout le même ' +
         'écartement et ne se coupent jamais.' }
  ];

  reg.ajouter({
    id: 'geo.codes',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.03'],
    titre: 'Les codes d\'une figure',
    generer: function (r) {
      var c = r.choix(CODES);
      var choix = Q.construire(r, c.bonne, c.leurres, String);
      return {
        enonce: c.q,
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: c.e
      };
    }
  });

  /* --- Perpendiculaires et parallèles ----------------------------------- */

  var RELATIONS = [
    { q: 'Comment appelle-t-on deux droites qui se coupent en formant un angle droit ?',
      bonne: 'des droites perpendiculaires',
      leurres: ['des droites parallèles', 'des droites obliques', 'des demi-droites'],
      e: 'Deux droites perpendiculaires se coupent en formant quatre angles droits. On le ' +
         'vérifie avec l\'équerre.' },
    { q: 'Comment appelle-t-on deux droites qui ne se coupent jamais, même prolongées ?',
      bonne: 'des droites parallèles',
      leurres: ['des droites perpendiculaires', 'des droites sécantes', 'des segments'],
      e: 'Deux droites parallèles gardent partout le même écartement : elles ne se rencontrent ' +
         'jamais, même si on les prolonge.' },
    { q: 'Deux droites sont perpendiculaires à une même troisième droite. Que peut-on dire d\'elles ?',
      bonne: 'elles sont parallèles entre elles',
      leurres: ['elles sont perpendiculaires entre elles', 'elles se coupent',
                'elles ont la même longueur'],
      e: 'Si deux droites forment toutes les deux un angle droit avec la même droite, elles ' +
         'sont parallèles entre elles. C\'est une façon de tracer des parallèles à l\'équerre.' },
    { q: 'Dans un rectangle, comment sont deux côtés qui se touchent à un sommet ?',
      bonne: 'perpendiculaires',
      leurres: ['parallèles', 'de même longueur', 'obliques'],
      e: 'Un rectangle a quatre angles droits : deux côtés qui se touchent sont donc ' +
         'perpendiculaires. Les côtés opposés, eux, sont parallèles.' }
  ];

  reg.ajouter({
    id: 'geo.perpendiculaire_parallele',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.04', 'mat.eg.plane.05'],
    titre: 'Perpendiculaires ou parallèles ?',
    generer: function (r) {
      var s = r.choix(RELATIONS);
      var choix = Q.construire(r, s.bonne, s.leurres, String);
      return {
        enonce: s.q,
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: s.e
      };
    }
  });

  /* --- Cercle et disque -------------------------------------------------- */

  var CERCLE = [
    { q: 'Qu\'est-ce qu\'un cercle ?',
      bonne: 'l\'ensemble des points situés à la même distance du centre',
      leurres: ['l\'ensemble des points situés à l\'intérieur d\'une courbe fermée',
                'une ligne courbe qui ne se referme pas',
                'l\'ensemble des points situés à la même distance d\'une droite'],
      e: 'Tous les points d\'un cercle sont à la même distance du centre : cette distance est ' +
         'le rayon. C\'est exactement ce que fait le compas.' },
    { q: 'Quelle est la différence entre un cercle et un disque ?',
      bonne: 'le disque comprend aussi tout l\'intérieur',
      leurres: ['le disque est plus grand que le cercle',
                'le cercle a un centre, le disque n\'en a pas',
                'il n\'y a aucune différence'],
      e: 'Le cercle est seulement la ligne courbe. Le disque, c\'est cette ligne et tout ce ' +
         'qu\'elle entoure.' },
    { q: 'Comment appelle-t-on un segment qui joint le centre à un point du cercle ?',
      bonne: 'un rayon',
      leurres: ['un diamètre', 'une corde', 'une hauteur'],
      e: 'Le rayon va du centre au cercle. Le diamètre, lui, traverse le cercle en passant par ' +
         'le centre : il mesure deux fois le rayon.' },
    { q: 'Un cercle a un rayon de 7 cm. Combien mesure son diamètre ?',
      bonne: '14 cm', leurres: ['7 cm', '3,5 cm', '21 cm'],
      e: 'Le diamètre vaut deux fois le rayon : 7 × 2 = 14 cm.' }
  ];

  reg.ajouter({
    id: 'geo.cercle_disque',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.06'],
    titre: 'Cercle et disque',
    generer: function (r) {
      var c = r.choix(CERCLE);
      var choix = Q.construire(r, c.bonne, c.leurres, String);
      return {
        enonce: c.q,
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: c.e
      };
    }
  });

  /* --- Reconnaître une figure à sa définition --------------------------- */

  var FIGURES = [
    { nom: 'le carré', definition: 'quatre côtés de même longueur et quatre angles droits' },
    { nom: 'le rectangle', definition: 'quatre angles droits, et les côtés opposés de même longueur' },
    { nom: 'le losange', definition: 'quatre côtés de même longueur' },
    { nom: 'le triangle rectangle', definition: 'trois côtés et un angle droit' },
    { nom: 'le triangle isocèle', definition: 'trois côtés, dont deux de même longueur' },
    { nom: 'le triangle équilatéral', definition: 'trois côtés de même longueur' }
  ];

  reg.ajouter({
    id: 'geo.reconnaitre_figure',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.07'],
    titre: 'Reconnaître une figure',
    generer: function (r) {
      var f = r.choix(FIGURES);
      var leurres = FIGURES.filter(function (x) { return x.nom !== f.nom; })
                           .map(function (x) { return x.nom; });

      var choix = Q.construire(r, f.nom, r.melanger(leurres), String);

      return {
        enonce: 'Quelle figure a ' + f.definition + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: C(f.nom) + ' a ' + f.definition + '. ' +
          (f.nom === 'le carré'
            ? 'C\'est à la fois un rectangle et un losange.'
            : f.nom === 'le triangle équilatéral'
              ? 'Ses trois côtés étant égaux, il est aussi isocèle.'
              : 'C\'est ce qui permet de le reconnaître à coup sûr.')
      };
    }
  });

  var PROPRIETES = [
    { q: 'Dans un rectangle, que peut-on dire des deux diagonales ?',
      bonne: 'elles ont la même longueur et se coupent en leur milieu',
      leurres: ['elles sont perpendiculaires', 'elles ont des longueurs différentes',
                'elles sont parallèles'],
      e: 'Dans un rectangle, les diagonales ont la même longueur et se coupent en leur milieu. ' +
         'Elles ne sont perpendiculaires que si le rectangle est un carré.' },
    { q: 'Dans un losange, que peut-on dire des deux diagonales ?',
      bonne: 'elles sont perpendiculaires et se coupent en leur milieu',
      leurres: ['elles ont la même longueur', 'elles sont parallèles aux côtés',
                'elles ont la même longueur que les côtés'],
      e: 'Dans un losange, les diagonales se coupent à angle droit, en leur milieu. Elles n\'ont ' +
         'la même longueur que si le losange est un carré.' },
    { q: 'Dans un rectangle, que peut-on dire des côtés opposés ?',
      bonne: 'ils sont parallèles et de même longueur',
      leurres: ['ils sont perpendiculaires', 'ils ont des longueurs différentes',
                'ils se coupent en leur milieu'],
      e: 'Les côtés opposés d\'un rectangle sont parallèles deux à deux et de même longueur.' },
    { q: 'Un carré est-il aussi un rectangle ?',
      bonne: 'oui, car il a quatre angles droits',
      leurres: ['non, car ses côtés sont tous égaux', 'non, car un rectangle est plus long que large',
                'oui, mais seulement s\'il est posé de travers'],
      e: 'Un rectangle est un quadrilatère à quatre angles droits. Le carré en a quatre : c\'est ' +
         'donc un rectangle, un rectangle particulier dont tous les côtés sont égaux.' }
  ];

  reg.ajouter({
    id: 'geo.proprietes_figures',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.08'],
    titre: 'Les propriétés des figures',
    generer: function (r) {
      var p = r.choix(PROPRIETES);
      var choix = Q.construire(r, p.bonne, p.leurres, String);
      return {
        enonce: p.q,
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: p.e
      };
    }
  });

  /* --- Programmes de construction ---------------------------------------

     Chaque programme est écrit dans son ordre juste, et chaque étape a besoin
     de celle qui la précède : on ne trace pas une perpendiculaire à un segment
     qui n'existe pas encore, ni un point sur une droite qu'on n'a pas tracée.
     C'est cette dépendance qui rend l'ordre unique — sans elle, deux réponses
     seraient défendables et la question ne vaudrait rien.

     Les figures sont nommées en toutes lettres : le programme interdit
     d'exiger les notations [AB] ou (AB). */

  var PROGRAMMES = [
    { figure: 'un rectangle',
      etapes: [
        'Trace un segment de 8 cm et appelle ses extrémités A et B.',
        'Trace la perpendiculaire à ce segment qui passe par A.',
        'Sur cette perpendiculaire, place le point D à 5 cm de A.',
        'Place le point C de façon à fermer le rectangle, puis trace les deux derniers côtés.'
      ] },
    { figure: 'un carré',
      etapes: [
        'Trace un segment de 6 cm et appelle ses extrémités A et B.',
        'Trace les deux perpendiculaires à ce segment qui passent par A et par B.',
        'Sur chacune de ces perpendiculaires, place un point à 6 cm du segment : ce sont D et C.',
        'Relie C et D.'
      ] },
    { figure: 'un triangle rectangle',
      etapes: [
        'Trace un segment de 7 cm et appelle ses extrémités A et B.',
        'Trace la perpendiculaire à ce segment qui passe par B.',
        'Sur cette perpendiculaire, place le point C à 4 cm de B.',
        'Relie A et C.'
      ] },
    { figure: 'un cercle et l\'un de ses diamètres',
      etapes: [
        'Trace un cercle de 4 cm de rayon et appelle O son centre.',
        'Trace une droite qui passe par O.',
        'Appelle A et B les deux points où cette droite coupe le cercle.',
        'Repasse en couleur le segment qui va de A à B : c\'est un diamètre.'
      ] }
  ];

  /* Des chiffres romains, et non des lettres : A, B, C et D sont déjà les noms
     des points dans les étapes, et deux A dans le même énoncé, c'est une
     question fausse en puissance. */
  var ETIQUETTES = ['I', 'II', 'III', 'IV', 'V'];

  reg.ajouter({
    id: 'geo.programme_construction',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.11'],
    titre: 'Remettre un programme de construction dans l\'ordre',
    generer: function (r) {
      var p = r.choix(PROGRAMMES);

      // Les étapes sont présentées en désordre, chacune sous une étiquette.
      // L'ordre juste devient donc une suite d'étiquettes.
      var melange = r.melanger(p.etapes.map(function (texte, rang) {
        return { texte: texte, rang: rang };
      }));
      melange.forEach(function (e, i) { e.etiquette = ETIQUETTES[i]; });

      var juste = melange.slice().sort(function (x, y) { return x.rang - y.rang; })
                         .map(function (e) { return e.etiquette; });

      function afficher(liste) { return liste.join(' ; '); }
      var choix = Q.rangement(r, juste, afficher);

      var liste = melange.map(function (e) {
        return e.etiquette + '. ' + e.texte;
      }).join('\n');

      return {
        enonce: 'Voici, en désordre, les étapes d\'un programme de construction ' +
          'pour tracer ' + p.figure + '.\n' + liste +
          '\nDans quel ordre faut-il les suivre ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Chaque étape a besoin de la précédente : on ne peut pas tracer une ' +
          'perpendiculaire à un segment qui n\'existe pas, ni placer un point sur une ligne ' +
          'qu\'on n\'a pas tracée. L\'ordre est donc ' + afficher(juste) + ', c\'est-à-dire : ' +
          p.etapes.map(function (t, i) { return (i + 1) + ') ' + t; }).join(' ')
      };
    }
  });

})(window.CM2 = window.CM2 || {});
