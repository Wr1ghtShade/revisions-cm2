/* Exercices avec une figure : demi-droite graduée, horloge, quadrillage,
   tableaux et diagrammes, patrons, angles.

   Référentiel : mat.nc.entiers.07, mat.nc.fractions.05 et .06,
   mat.nc.decimaux.03 et .10, mat.gm.temps.01 et .02, mat.gm.angles.03,
   mat.eg.plane.12, mat.eg.solides.03 et .05, mat.ogd.donnees.

   Ces objectifs sont hors d'atteinte sans dessin : on ne lit pas une heure sur
   une horloge décrite en mots. Les figures sont produites par app/figures.js. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;
  var Fig = CM2.figures;

  /* =================================================== Demi-droite graduée */

  reg.ajouter({
    id: 'dd.lire_entier',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.entiers.07'],
    titre: 'Lire un point sur une demi-droite graduée',
    generer: function (r) {
      var pas = r.choix([10, 100, 1000, 10000]);
      var depart = r.entier(0, 9) * pas * 10;
      var sous = r.choix([2, 5, 10]);
      var position = r.entier(1, 5 * sous - 1);
      var valeur = depart + position * (pas / sous);

      var figure = Fig.demiDroiteGraduee({
        min: depart, max: depart + 5 * pas, pas: pas, sousGraduations: sous,
        formater: F.entier,
        points: [{ position: valeur, etiquette: 'A' }],
        description: 'demi-droite graduée avec un point A'
      });

      return {
        enonce: 'Quel nombre est repéré par le point A ?',
        figure: figure,
        type: 'saisie',
        bonne_reponse: String(valeur),
        explication: 'Entre deux grands traits il y a ' + F.entier(pas) + ', partagés en ' +
          sous + ' intervalles : chaque petit trait vaut donc ' + F.entier(pas / sous) +
          '. Le point A est à ' + F.entier(valeur) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dd.lire_decimal',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.decimaux.03', 'mat.nc.decimaux.10'],
    titre: 'Lire un décimal sur une demi-droite graduée',
    generer: function (r) {
      var entier = r.entier(0, 12);
      var sous = r.choix([10, 5, 4]);
      var position = r.entier(1, 3 * sous - 1);
      var valeurMillemes = entier * 1000 + position * (1000 / sous);

      var figure = Fig.demiDroiteGraduee({
        min: entier, max: entier + 3, pas: 1, sousGraduations: sous,
        points: [{ position: valeurMillemes / 1000, etiquette: 'B' }],
        description: 'demi-droite graduée avec un point B entre deux entiers'
      });

      return {
        enonce: 'Quel nombre décimal est repéré par le point B ?',
        figure: figure,
        type: 'saisie',
        bonne_reponse: F.decimal(valeurMillemes / 1000),
        explication: 'Chaque unité est partagée en ' + sous + ' intervalles égaux : un petit ' +
          'trait vaut ' + F.decimal(1 / sous) + '. Le point B est à ' +
          F.decimal(valeurMillemes / 1000) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'dd.lire_fraction',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.fractions.05', 'mat.nc.fractions.06'],
    titre: 'Lire une fraction sur une demi-droite graduée',
    generer: function (r) {
      var denominateur = r.choix([2, 3, 4, 5, 6, 8, 10]);
      var maxEntier = 3;
      function pgcd(a, b) { return b ? pgcd(b, a % b) : a; }
      var numerateur;
      // Fraction irréductible : sinon « 20/8 » et « 5/2 » seraient deux réponses
      // également justes, et une seule serait acceptée.
      do {
        numerateur = r.entier(1, maxEntier * denominateur - 1);
      } while (numerateur % denominateur === 0 || pgcd(numerateur, denominateur) !== 1);

      var figure = Fig.demiDroiteGraduee({
        min: 0, max: maxEntier, pas: 1, sousGraduations: denominateur,
        points: [{ position: numerateur / denominateur, etiquette: 'C' }],
        description: 'demi-droite graduée partagée en ' + denominateur + ' intervalles par unité'
      });

      var entier = Math.floor(numerateur / denominateur);
      var reste = numerateur % denominateur;

      return {
        enonce: 'Quelle fraction est repérée par le point C ? (Réponds sous la forme « 7/4 ».)',
        figure: figure,
        type: 'saisie',
        bonne_reponse: numerateur + '/' + denominateur,
        explication: 'Chaque unité est partagée en ' + denominateur + ' parts égales : un petit ' +
          'trait vaut 1/' + denominateur + '. Le point C est au ' + numerateur + 'e trait, ' +
          'donc à ' + numerateur + '/' + denominateur +
          (entier > 0 ? ', c\'est-à-dire ' + entier + ' + ' + reste + '/' + denominateur : '') + '.'
      };
    }
  });

  /* ================================================================ Horloge */

  reg.ajouter({
    id: 'hor.lire_heure',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.temps.01'],
    titre: 'Lire l\'heure sur une horloge',
    generer: function (r) {
      var h = r.entier(1, 12);
      // Des minutes multiples de 5 : la petite aiguille est alors sans ambiguïté
      // entre deux chiffres, et la grande pointe exactement un repère.
      var m = r.entier(0, 11) * 5;

      return {
        enonce: 'Quelle heure indique cette horloge ? (Réponds sous la forme « 4 h 25 ».)',
        figure: Fig.horloge(h, m, 'horloge indiquant une heure à lire'),
        type: 'saisie',
        bonne_reponse: h + ' h ' + (m < 10 ? '0' + m : m),
        explication: m === 0
          ? 'La petite aiguille est pile sur le ' + h + ' et la grande sur le 12 : il est ' +
            h + ' heures juste.'
          : 'La petite aiguille a dépassé le ' + h + ' : il est ' + h + ' heures passées. ' +
            'La grande aiguille est sur le ' + (m / 5) + ', et chaque chiffre vaut 5 minutes : ' +
            (m / 5) + ' × 5 = ' + m + ' minutes. Il est donc ' + h + ' h ' +
            (m < 10 ? '0' + m : m) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'hor.duree_entre_horloges',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.temps.03', 'mat.gm.temps.02'],
    titre: 'Durée entre deux horloges',
    generer: function (r) {
      var h1 = r.entier(1, 9);
      var m1 = r.entier(0, 11) * 5;
      var dureeMin = r.entier(2, 8) * 15;

      var total = h1 * 60 + m1 + dureeMin;
      var h2 = Math.floor(total / 60), m2 = total % 60;

      var heures = Math.floor(dureeMin / 60), minutes = dureeMin % 60;
      var reponse = heures ? heures + ' h ' + (minutes < 10 ? '0' + minutes : minutes)
                           : minutes + ' min';
      // « 2 h 00 » et « 2 h » sont la même durée ; « 2 h 30 » et « 2 h 30 min »
      // aussi. On n'accepte pas « 45 » tout court : sans unité, ce n'est pas
      // une durée.
      var autres = !heures ? undefined
                 : minutes === 0 ? [heures + ' h']
                                 : [reponse + ' min'];

      return {
        enonce: 'La première horloge montre le départ, la seconde l\'arrivée. ' +
          'Combien de temps s\'est-il écoulé ? (Réponds « 1 h 30 », ou « 45 min » si c\'est ' +
          'moins d\'une heure.)',
        figure: '<span style="display:inline-block;width:44%;max-width:200px">' +
          Fig.horloge(h1, m1, 'horloge du départ') + '</span>' +
          '<span style="display:inline-block;width:44%;max-width:200px;margin-left:4%">' +
          Fig.horloge(h2 % 12 === 0 ? 12 : h2 % 12, m2, 'horloge de l\'arrivée') + '</span>',
        type: 'saisie',
        bonne_reponse: reponse,
        reponses_acceptees: autres,
        explication: 'La première horloge indique ' + F.heure(h1, m1) + ', la seconde ' +
          F.heure(h2, m2) + '. Entre les deux, il s\'est écoulé ' + reponse + '.'
      };
    }
  });

  /* =========================================================== Quadrillage */

  reg.ajouter({
    id: 'geo.symetrie_quadrillage',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.plane.12'],
    titre: 'Symétrie sur papier quadrillé',
    generer: function (r) {
      // Le programme limite la symétrie au papier quadrillé, avec un axe
      // vertical, horizontal ou diagonal du quadrillage.
      var colonnes = 10, lignes = 7;
      var axe = 5;

      var cases = [];
      var nb = r.entier(4, 6);
      while (cases.length < nb) {
        // Colonnes 1 à 4 : le symétrique tombe alors en 5 à 8, et le leurre
        // décalé d'une case reste dans le quadrillage sans recouvrir l'original.
        var c = [r.entier(1, 4), r.entier(1, lignes - 2)];
        if (!cases.some(function (x) { return x[0] === c[0] && x[1] === c[1]; })) cases.push(c);
      }

      var symetriques = cases.map(function (c) { return [2 * axe - 1 - c[0], c[1]]; });

      var bonne = Fig.quadrillage(colonnes, lignes, cases.concat(symetriques),
                                  { type: 'vertical', a: axe }, 'figure et son symétrique');

      // Les leurres : une translation au lieu d'une symétrie, et un décalage
      // d'une case — deux erreurs qu'on voit réellement en classe.
      var translation = cases.map(function (c) { return [c[0] + axe, c[1]]; });
      var decale = symetriques.map(function (c) { return [c[0] + 1, c[1]]; });
      var renverse = cases.map(function (c) { return [2 * axe - 1 - c[0], lignes - 1 - c[1]]; });

      var propositions = [
        bonne,
        Fig.quadrillage(colonnes, lignes, cases.concat(translation), { type: 'vertical', a: axe }, 'figure déplacée'),
        Fig.quadrillage(colonnes, lignes, cases.concat(decale), { type: 'vertical', a: axe }, 'figure mal placée'),
        Fig.quadrillage(colonnes, lignes, cases.concat(renverse), { type: 'vertical', a: axe }, 'figure retournée')
      ];

      var ordre = r.melanger([0, 1, 2, 3]);

      return {
        enonce: 'Quelle image montre la figure grise et son symétrique par rapport à l\'axe rouge ?',
        type: 'qcm',
        propositions: ordre.map(function (i) { return propositions[i]; }),
        bonne_reponse: ordre.indexOf(0),
        estFigure: true,
        explication: 'Dans une symétrie, chaque case est à la même distance de l\'axe, de ' +
          'l\'autre côté, et sur la même ligne. Une figure simplement glissée n\'est pas ' +
          'une figure symétrique.'
      };
    }
  });

  reg.ajouter({
    id: 'dep.suivre_instructions',
    matiere: 'mathematiques',
    /* Ce générateur travaille aussi le repère CRCN « Lire et construire un
       algorithme qui comprend des instructions simples ». Le référentiel du
       numérique demande de lier plutôt que de dupliquer : le repère est donc
       déclaré ici, et la banque du numérique n'écrit pas de question dessus. */
    objectifs: ['mat.eg.deplacements.01', 'mat.eg.deplacements.02', 'num.3.4.n1.01'],
    titre: 'Suivre un déplacement sur un quadrillage',
    generer: function (r) {
      var colonnes = 8, lignes = 6;
      var depart = [r.entier(1, 3), r.entier(2, 4)];

      var instructions = [], x = depart[0], y = depart[1];
      var nb = r.entier(3, 4);
      var essais = 0;
      for (var i = 0; i < nb && essais < 60; i++) {
        essais++;
        var sens = r.choix(['droite', 'gauche', 'haut', 'bas']);
        var n = r.entier(1, 3);
        var nx = x, ny = y;
        if (sens === 'droite') nx += n;
        else if (sens === 'gauche') nx -= n;
        else if (sens === 'haut') ny -= n;
        else ny += n;
        if (nx < 0 || nx >= colonnes || ny < 0 || ny >= lignes) { i--; continue; }
        x = nx; y = ny;
        instructions.push('avance de ' + n + ' case' + (n > 1 ? 's' : '') + ' vers ' +
          (sens === 'haut' ? 'le haut' : sens === 'bas' ? 'le bas' :
           sens === 'droite' ? 'la droite' : 'la gauche'));
      }

      var arrivee = 'colonne ' + (x + 1) + ', ligne ' + (y + 1);
      var candidats = [
        'colonne ' + (x + 2) + ', ligne ' + (y + 1),
        'colonne ' + (x + 1) + ', ligne ' + (y + 2),
        'colonne ' + (y + 1) + ', ligne ' + (x + 1),
        'colonne ' + Math.max(1, x) + ', ligne ' + Math.max(1, y)
      ].filter(function (c) { return c !== arrivee; });

      var choix = Q.construire(r, arrivee, r.melanger(candidats), String);

      return {
        enonce: 'Le jeton gris est à la colonne ' + (depart[0] + 1) + ', ligne ' +
          (depart[1] + 1) + ' (les lignes se comptent depuis le haut). ' +
          'Il ' + instructions.join(', puis ') + '. Où arrive-t-il ?',
        figure: Fig.quadrillage(colonnes, lignes, [depart], null, 'quadrillage avec le jeton de départ'),
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'En suivant les instructions une à une depuis la colonne ' +
          (depart[0] + 1) + ', ligne ' + (depart[1] + 1) + ', on arrive à la ' + arrivee + '.'
      };
    }
  });

  /* ================================================= Tableaux et diagrammes */

  var JOURS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi'];
  /* `titre` annonce le relevé, `question` s'insère dans la question : sans les
     séparer, on écrit « le relevé des gâteaux vendus de la semaine ». */
  var RELEVES = [
    { titre: 'les livres empruntés à la bibliothèque', question: 'livres', unite: 'livres' },
    { titre: 'les élèves qui mangent à la cantine', question: 'élèves', unite: 'élèves' },
    { titre: 'les kilomètres parcourus à vélo', question: 'kilomètres', unite: 'km' },
    { titre: 'les gâteaux vendus à la boulangerie', question: 'gâteaux', unite: 'gâteaux' }
  ];

  function releve(r, combien) {
    var d = [];
    for (var i = 0; i < combien; i++) d.push({ nom: JOURS[i], valeur: r.entier(4, 40) });
    return d;
  }

  reg.ajouter({
    id: 'don.lire_tableau',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.donnees.02'],
    titre: 'Lire un tableau',
    generer: function (r) {
      var sujet = r.choix(RELEVES);
      var donnees = releve(r, 5);
      var question = r.entier(1, 3);

      var valeurs = donnees.map(function (d) { return d.valeur; });
      var maxi = Math.max.apply(Math, valeurs);
      var mini = Math.min.apply(Math, valeurs);
      var jourMax = donnees[valeurs.indexOf(maxi)].nom;
      var jourMin = donnees[valeurs.indexOf(mini)].nom;

      var enonce, reponse, explication;
      if (question === 1) {
        var jour = r.choix(donnees);
        enonce = 'Combien de ' + sujet.question + ' compte-t-on le ' + jour.nom + ' ?';
        reponse = String(jour.valeur);
        explication = 'On lit la colonne « ' + jour.nom + ' » : ' + jour.valeur + '.';
      } else if (question === 2) {
        enonce = 'Quel jour compte-t-on le plus de ' + sujet.question + ' ?';
        reponse = jourMax;
        explication = 'La plus grande valeur du tableau est ' + maxi + ', au ' + jourMax + '.';
      } else {
        enonce = 'Quel jour compte-t-on le moins de ' + sujet.question + ' ?';
        reponse = jourMin;
        explication = 'La plus petite valeur du tableau est ' + mini + ', au ' + jourMin + '.';
      }

      return {
        enonce: 'Voici, jour par jour, le relevé de ' + sujet.titre + '. ' + enonce,
        figure: Fig.tableau(donnees.map(function (d) { return d.nom; }), valeurs,
                            'tableau de ' + sujet.titre),
        type: 'saisie',
        bonne_reponse: reponse,
        explication: explication
      };
    }
  });

  reg.ajouter({
    id: 'don.probleme_tableau',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.donnees.03'],
    titre: 'Un problème à partir d\'un tableau',
    generer: function (r) {
      var sujet = r.choix(RELEVES);
      var donnees = releve(r, 5);
      var valeurs = donnees.map(function (d) { return d.valeur; });
      var deuxEtapes = r.chance(0.5);

      var enonce, reponse, explication;
      if (deuxEtapes) {
        var total = valeurs.reduce(function (a, b) { return a + b; }, 0);
        enonce = 'Combien de ' + sujet.question + ' compte-t-on sur toute la semaine ?';
        reponse = String(total);
        explication = 'On additionne les cinq valeurs : ' + valeurs.join(' + ') + ' = ' +
          F.entier(total) + '.';
      } else {
        var deux = r.echantillon(donnees, 2);
        var ecart = Math.abs(deux[0].valeur - deux[1].valeur);
        enonce = 'Quelle est la différence entre le ' + deux[0].nom + ' et le ' + deux[1].nom + ' ?';
        reponse = String(ecart);
        explication = deux[0].nom + ' : ' + deux[0].valeur + '. ' + deux[1].nom + ' : ' +
          deux[1].valeur + '. La différence est ' + Math.max(deux[0].valeur, deux[1].valeur) +
          ' − ' + Math.min(deux[0].valeur, deux[1].valeur) + ' = ' + ecart + '.';
      }

      return {
        enonce: 'Voici, jour par jour, le relevé de ' + sujet.titre + '. ' + enonce,
        figure: Fig.tableau(donnees.map(function (d) { return d.nom; }), valeurs,
                            'tableau de ' + sujet.titre),
        type: 'saisie',
        bonne_reponse: reponse,
        explication: explication
      };
    }
  });

  reg.ajouter({
    id: 'don.lire_diagramme',
    matiere: 'mathematiques',
    objectifs: ['mat.ogd.donnees.01', 'mat.ogd.donnees.02'],
    titre: 'Lire un diagramme en barres',
    generer: function (r) {
      var sujet = r.choix(RELEVES);
      var donnees = releve(r, 5).map(function (d) {
        // Des valeurs multiples de 5 : sur un diagramme, on lit une hauteur,
        // pas un nombre exact. Sans cela la question n'aurait pas de réponse sûre.
        return { nom: d.nom, valeur: Math.max(5, Math.round(d.valeur / 5) * 5) };
      });

      var jour = r.choix(donnees);

      return {
        enonce: 'Ce diagramme donne, jour par jour, ' + sujet.titre + '. ' +
          'Combien en compte-t-on le ' + jour.nom + ' ?',
        figure: Fig.diagrammeBarres(donnees, sujet.unite, 'diagramme en barres de ' + sujet.titre),
        type: 'saisie',
        bonne_reponse: String(jour.valeur),
        explication: 'On repère la barre du ' + jour.nom + ' et on lit sa hauteur sur l\'axe ' +
          'vertical : ' + jour.valeur + ' ' + sujet.unite + '.'
      };
    }
  });

  /* ================================================================ Solides */

  /* Patrons de cube sur une grille 4 × 3. Les six premiers sont des patrons
     valides (croix latine et ses variantes), les suivants n'en sont pas. */
  var PATRONS_CUBE = [
    { cases: [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]], valide: true },
    { cases: [[1,0],[1,1],[0,1],[2,1],[3,1],[3,2]], valide: true },
    { cases: [[0,0],[0,1],[1,1],[2,1],[3,1],[3,2]], valide: true },
    { cases: [[2,0],[0,1],[1,1],[2,1],[3,1],[0,2]], valide: true },
    { cases: [[0,0],[1,0],[1,1],[2,1],[2,2],[3,2]], valide: true },
    { cases: [[1,0],[2,0],[0,1],[1,1],[2,1],[1,2]], valide: false },
    { cases: [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1]], valide: false },
    { cases: [[0,0],[1,0],[0,1],[1,1],[0,2],[1,2]], valide: false },
    { cases: [[0,1],[1,1],[2,1],[3,1],[1,0],[2,0]], valide: false }
  ];

  reg.ajouter({
    id: 'sol.patron_cube',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.solides.03'],
    titre: 'Reconnaître un patron de cube',
    generer: function (r) {
      var valides = PATRONS_CUBE.filter(function (p) { return p.valide; });
      var faux = PATRONS_CUBE.filter(function (p) { return !p.valide; });

      var bon = r.choix(valides);
      var autres = r.echantillon(faux, 3);

      var propositions = [bon].concat(autres).map(function (p) {
        return Fig.patron(p.cases, 'assemblage de six carrés');
      });
      var ordre = r.melanger([0, 1, 2, 3]);

      return {
        enonce: 'Lequel de ces assemblages est un patron de cube ?',
        type: 'qcm',
        propositions: ordre.map(function (i) { return propositions[i]; }),
        bonne_reponse: ordre.indexOf(0),
        estFigure: true,
        explication: 'Un patron de cube a six carrés, et en le pliant chacun doit devenir une ' +
          'face sans se superposer à un autre. Quand deux carrés sont posés au-dessus de deux ' +
          'colonnes voisines d\'une même rangée, ils se replient tous les deux sur le dessus du ' +
          'cube : ils se recouvrent, ce n\'est donc pas un patron.'
      };
    }
  });

  /* --- Patron de pavé ---------------------------------------------------

     Le patron d'un cube se reconnaît à sa forme seule : six carrés identiques,
     pliables. Celui d'un pavé demande une chose de plus — que les faces aillent
     ensemble. La bande de quatre faces se referme en un tube de section L × l ;
     les deux faces qui ferment le tube doivent donc mesurer L × l, et pas
     autre chose. C'est ce que le leurre principal met en défaut : une croix de
     forme parfaite, dont les deux faces de fermeture sont du mauvais côté.

     La grille fait toujours 4 colonnes sur 3 lignes ; ce sont les largeurs de
     colonnes et les hauteurs de lignes qui changent d'une proposition à
     l'autre, puisque c'est là que se joue la question. */

  var BANDE = [[0, 1], [1, 1], [2, 1], [3, 1]];

  /** Les quatre assemblages justes : la bande, plus une face au-dessus et une
      au-dessous, toutes deux sur une colonne large. */
  var PAVES_JUSTES = [
    [[0, 0], [0, 2]],
    [[2, 0], [2, 2]],
    [[0, 0], [2, 2]],
    [[2, 0], [0, 2]]
  ];

  reg.ajouter({
    id: 'sol.patron_pave',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.solides.05'],
    titre: 'Reconnaître un patron de pavé',
    generer: function (r) {
      var d = r.choix([
        { L: 5, l: 3, h: 2 }, { L: 6, l: 3, h: 4 }, { L: 5, l: 2, h: 3 },
        { L: 4, l: 3, h: 2 }, { L: 6, l: 4, h: 3 }
      ]);
      var colonnes = [d.L, d.l, d.L, d.l];
      var lignes = [d.l, d.h, d.l];

      var bon = {
        cases: BANDE.concat(r.choix(PAVES_JUSTES)),
        largeurs: colonnes, hauteurs: lignes
      };

      var faux = [
        // Une croix impeccable, mais les deux faces de fermeture sont posées
        // sur une colonne étroite : elles mesurent l × l au lieu de L × l.
        { cases: BANDE.concat([[1, 0], [1, 2]]), largeurs: colonnes, hauteurs: lignes },
        // Les deux faces de fermeture du même côté : en pliant, elles se
        // recouvrent, et l'autre bout du tube reste ouvert.
        { cases: BANDE.concat([[0, 0], [2, 0]]), largeurs: colonnes, hauteurs: lignes },
        // Un bloc de six rectangles : rien ne se replie en boîte.
        { cases: [[0, 0], [1, 0], [0, 1], [1, 1], [0, 2], [1, 2]],
          largeurs: colonnes, hauteurs: lignes },
        // La bande ne fait pas alterner les largeurs : le tube ne se referme
        // pas sur un rectangle.
        { cases: BANDE.concat([[0, 0], [0, 2]]),
          largeurs: [d.L, d.L, d.l, d.l], hauteurs: lignes }
      ];

      var propositions = [bon].concat(r.echantillon(faux, 3)).map(function (p) {
        return Fig.patronPave(p.cases, p.largeurs, p.hauteurs, 'assemblage de six rectangles');
      });
      var ordre = r.melanger([0, 1, 2, 3]);

      return {
        enonce: 'Lequel de ces assemblages est un patron de pavé droit ?',
        type: 'qcm',
        propositions: ordre.map(function (i) { return propositions[i]; }),
        bonne_reponse: ordre.indexOf(0),
        estFigure: true,
        explication: 'La bande de quatre rectangles se referme en un tube : ses largeurs ' +
          'doivent donc alterner, longueur, largeur, longueur, largeur. Les deux faces qui ' +
          'bouchent le tube ferment un rectangle de ' + d.L + ' sur ' + d.l + ' : il en faut ' +
          'une à chaque bout, et toutes deux de cette taille-là. C\'est ce qui différencie le ' +
          'patron d\'un pavé de celui d\'un cube, où toutes les faces sont identiques.'
      };
    }
  });

  var SOLIDES = [
    { nom: 'le cube', faces: 6, aretes: 12, sommets: 8,
      description: '6 faces carrées, 12 arêtes de même longueur et 8 sommets' },
    { nom: 'le pavé droit', faces: 6, aretes: 12, sommets: 8,
      description: '6 faces rectangulaires, 12 arêtes et 8 sommets' },
    { nom: 'la pyramide à base carrée', f: true, faces: 5, aretes: 8, sommets: 5,
      description: '1 base carrée et 4 faces triangulaires, 8 arêtes et 5 sommets' },
    { nom: 'le prisme droit à base triangulaire', faces: 5, aretes: 9, sommets: 6,
      description: '2 bases triangulaires et 3 faces rectangulaires, 9 arêtes et 6 sommets' }
  ];

  reg.ajouter({
    id: 'sol.decrire',
    matiere: 'mathematiques',
    objectifs: ['mat.eg.solides.01', 'mat.eg.solides.02'],
    titre: 'Décrire un solide',
    generer: function (r) {
      var s = r.choix(SOLIDES);
      var quoi = r.choix([
        { mot: 'faces', valeur: s.faces },
        { mot: 'arêtes', valeur: s.aretes },
        { mot: 'sommets', valeur: s.sommets }
      ]);

      var candidats = SOLIDES.map(function (autre) {
        return quoi.mot === 'faces' ? autre.faces
             : quoi.mot === 'arêtes' ? autre.aretes : autre.sommets;
      }).concat([quoi.valeur + 1, quoi.valeur - 1, quoi.valeur + 2])
        .filter(function (v) { return v !== quoi.valeur && v > 0; });

      var choix = Q.construire(r, quoi.valeur, r.melanger(candidats), String);

      return {
        enonce: 'Combien ' + s.nom + ' a-t-' + (s.f ? 'elle' : 'il') + ' de ' + quoi.mot + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: s.nom.charAt(0).toUpperCase() + s.nom.slice(1) + ' a ' + s.description +
          '. Il a donc ' + quoi.valeur + ' ' + quoi.mot + '.'
      };
    }
  });

  /* ================================================================= Angles */

  reg.ajouter({
    id: 'ang.comparer',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.angles.03'],
    titre: 'Comparer deux angles',
    generer: function (r) {
      var a = r.entier(2, 15) * 10;
      var b;
      do {
        b = r.entier(2, 15) * 10;
      } while (Math.abs(a - b) < 25);      // un écart trop faible ne se voit pas

      var plusGrand = a > b ? 'A' : 'B';

      function nommer(d) {
        return d < 90 ? 'aigu' : (d > 90 ? 'obtus' : 'droit');
      }

      return {
        enonce: 'Lequel de ces deux angles est le plus grand ?',
        figure: Fig.deuxAngles(a, b, 'deux angles à comparer'),
        type: 'qcm',
        propositions: ['l\'angle A', 'l\'angle B'],
        bonne_reponse: plusGrand === 'A' ? 0 : 1,
        explication: 'On compare l\'écartement des deux côtés, sans mesurer : l\'angle ' +
          plusGrand + ' est plus ouvert. L\'angle A est ' + nommer(a) + ', l\'angle B est ' +
          nommer(b) + '. On peut vérifier en superposant les deux angles.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
