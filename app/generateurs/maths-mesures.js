/* Grandeurs et mesures : aires, angles, durées.
   Référentiel : mat.gm.

   Trois interdits du programme pèsent ici :
   - aucun tableau de conversion : les explications passent toujours par la
     relation entre unités (1 dm² = 100 cm²), jamais par un tableau ;
   - aucune formule de périmètre à mémoriser ;
   - aucune mesure d'angle en degrés autre que celle de l'angle droit, et pas de
     rapporteur ;
   - les conventions d'écriture ne sont jamais exigibles : la notation des
     angles est donc rappelée dans l'énoncé même qui s'en sert.
   Les unités d'aire se limitent donc à cm², dm² et m². */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  /* --- Aires ---------------------------------------------------------- */

  reg.ajouter({
    id: 'mes.aire_rectangle',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.aires.05', 'mat.gm.aires.03'],
    titre: 'Aire d\'un rectangle',
    generer: function (r) {
      var carre = r.chance(0.3);
      var unite = r.choix(['cm', 'dm', 'm']);
      var L = r.entier(3, 25);
      var l = carre ? L : r.entierSauf(2, 20, [L]);
      var aire = L * l;

      var enonce = carre
        ? 'Un carré a des côtés de ' + L + ' ' + unite + '. Quelle est son aire, en ' + unite + '² ?'
        : 'Un rectangle mesure ' + L + ' ' + unite + ' de longueur et ' + l + ' ' + unite +
          ' de largeur. Quelle est son aire, en ' + unite + '² ?';

      return {
        enonce: enonce,
        type: 'saisie',
        bonne_reponse: String(aire),
        explication: 'On compte combien de carrés de 1 ' + unite + ' de côté tiennent dans la figure : ' +
          l + ' rangées de ' + L + '. ' + L + ' × ' + l + ' = ' + F.entier(aire) + ' ' + unite + '².'
      };
    }
  });

  reg.ajouter({
    id: 'mes.cote_depuis_aire',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.aires.05'],
    titre: 'Retrouver un côté à partir de l\'aire',
    generer: function (r) {
      var unite = r.choix(['cm', 'dm', 'm']);
      // Facteurs dans les tables : la recherche du facteur manquant reste mentale,
      // la division posée par un diviseur à deux chiffres n'est pas au programme.
      var L = r.entier(4, 12);
      var l = r.entier(2, 12);
      var aire = L * l;

      return {
        enonce: 'Un rectangle a une aire de ' + F.entier(aire) + ' ' + unite + '². ' +
          'Sa longueur est de ' + L + ' ' + unite + '. Quelle est sa largeur, en ' + unite + ' ?',
        type: 'saisie',
        bonne_reponse: String(l),
        explication: 'L\'aire est le produit de la longueur par la largeur. On cherche donc le nombre ' +
          'qui, multiplié par ' + L + ', donne ' + F.entier(aire) + ' : ' + F.entier(aire) + ' ÷ ' + L +
          ' = ' + l + ' ' + unite + '.'
      };
    }
  });

  var RELATIONS_AIRE = [
    { de: 'dm²', vers: 'cm²', facteur: 100, phrase: 'Un carré de 1 dm de côté contient 10 rangées de 10 carrés de 1 cm de côté : 1 dm² = 100 cm².' },
    { de: 'm²', vers: 'dm²', facteur: 100, phrase: 'Un carré de 1 m de côté contient 10 rangées de 10 carrés de 1 dm de côté : 1 m² = 100 dm².' },
    { de: 'm²', vers: 'cm²', facteur: 10000, phrase: 'Un carré de 1 m de côté contient 100 rangées de 100 carrés de 1 cm de côté : 1 m² = 10 000 cm².' }
  ];

  reg.ajouter({
    id: 'mes.conversion_aire',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.aires.04', 'mat.gm.aires.03'],
    titre: 'Convertir des aires',
    generer: function (r) {
      var rel = r.choix(RELATIONS_AIRE);
      var descendre = r.chance(0.65);
      var petit = r.entier(2, 40);

      var enonce, reponse;
      if (descendre) {
        reponse = petit * rel.facteur;
        enonce = 'Combien de ' + rel.vers + ' y a-t-il dans ' + petit + ' ' + rel.de + ' ?';
      } else {
        var grand = petit * rel.facteur;
        reponse = petit;
        enonce = 'Combien de ' + rel.de + ' y a-t-il dans ' + F.entier(grand) + ' ' + rel.vers + ' ?';
      }

      return {
        enonce: enonce,
        type: 'saisie',
        bonne_reponse: String(reponse),
        explication: rel.phrase + ' On ' + (descendre ? 'multiplie' : 'divise') + ' donc par ' +
          F.entier(rel.facteur) + ' : la réponse est ' + F.entier(reponse) + ' ' +
          (descendre ? rel.vers : rel.de) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'mes.comparer_aires',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.aires.01', 'mat.gm.aires.05'],
    titre: 'Comparer deux aires',
    generer: function (r) {
      var unite = r.choix(['cm', 'dm', 'm']);
      var L1 = r.entier(3, 18), l1 = r.entier(2, 15);
      var L2, l2;
      do {
        L2 = r.entier(3, 18); l2 = r.entier(2, 15);
      } while (L2 * l2 === L1 * l1);

      var a1 = L1 * l1, a2 = L2 * l2;
      var plusGrand = a1 > a2 ? 'A' : 'B';

      return {
        enonce: 'Le rectangle A mesure ' + L1 + ' ' + unite + ' sur ' + l1 + ' ' + unite +
          '. Le rectangle B mesure ' + L2 + ' ' + unite + ' sur ' + l2 + ' ' + unite +
          '. Lequel a la plus grande aire ?',
        type: 'qcm',
        propositions: ['le rectangle A', 'le rectangle B'],
        bonne_reponse: plusGrand === 'A' ? 0 : 1,
        explication: 'Aire de A : ' + L1 + ' × ' + l1 + ' = ' + F.entier(a1) + ' ' + unite +
          '². Aire de B : ' + L2 + ' × ' + l2 + ' = ' + F.entier(a2) + ' ' + unite + '². Le rectangle ' +
          plusGrand + ' est le plus grand.'
      };
    }
  });

  reg.ajouter({
    id: 'mes.aire_figure_composee',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.aires.02', 'mat.gm.aires.05'],
    titre: 'Aire d\'une figure composée',
    generer: function (r) {
      var unite = r.choix(['cm', 'dm', 'm']);
      var L = r.entier(5, 14), l = r.entier(3, 10);
      var cote = r.entier(2, 9);
      var colle = r.chance(0.7);            // accolé, ou découpé dans le rectangle

      var aireRect = L * l;
      var aireCarre = cote * cote;
      var aire = colle ? aireRect + aireCarre : aireRect - aireCarre;

      if (!colle && aireCarre >= aireRect) { colle = true; aire = aireRect + aireCarre; }

      var enonce = colle
        ? 'Une figure est formée d\'un rectangle de ' + L + ' ' + unite + ' sur ' + l + ' ' +
          unite + ', auquel on a accolé un carré de ' + cote + ' ' + unite + ' de côté. ' +
          'Quelle est l\'aire de cette figure, en ' + unite + '² ?'
        : 'On découpe un carré de ' + cote + ' ' + unite + ' de côté dans un rectangle de ' +
          L + ' ' + unite + ' sur ' + l + ' ' + unite + '. Quelle est l\'aire de ce qui reste, ' +
          'en ' + unite + '² ?';

      return {
        enonce: enonce,
        type: 'saisie',
        bonne_reponse: String(aire),
        explication: 'On calcule les deux aires séparément, puis on les ' +
          (colle ? 'additionne' : 'soustrait') + '. Rectangle : ' + L + ' × ' + l + ' = ' +
          F.entier(aireRect) + ' ' + unite + '². Carré : ' + cote + ' × ' + cote + ' = ' +
          F.entier(aireCarre) + ' ' + unite + '². Total : ' + F.entier(aireRect) +
          (colle ? ' + ' : ' − ') + F.entier(aireCarre) + ' = ' + F.entier(aire) + ' ' +
          unite + '².'
      };
    }
  });

  /* --- Angles --------------------------------------------------------- */

  reg.ajouter({
    id: 'mes.lexique_angles',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.angles.01', 'mat.gm.angles.06'],
    titre: 'Le vocabulaire des angles',
    generer: function (r) {
      var cas = r.choix([
        {
          q: 'Comment appelle-t-on un angle plus petit qu\'un angle droit ?',
          bonne: 'un angle aigu',
          leurres: ['un angle obtus', 'un angle droit', 'un angle plat'],
          e: 'Un angle plus petit que l\'angle droit est un angle aigu.'
        },
        {
          q: 'Comment appelle-t-on un angle plus grand qu\'un angle droit, mais plus petit qu\'un angle plat ?',
          bonne: 'un angle obtus',
          leurres: ['un angle aigu', 'un angle droit', 'un angle plat'],
          e: 'Un angle plus grand que l\'angle droit est un angle obtus.'
        },
        {
          q: 'Combien de degrés mesure un angle droit ?',
          bonne: '90°',
          leurres: ['45°', '100°', '180°'],
          e: 'Un angle droit mesure 90°. C\'est la seule mesure d\'angle à connaître au CM2.'
        },
        {
          q: 'Un angle plat, c\'est un angle qui vaut…',
          bonne: 'deux angles droits',
          leurres: ['un angle droit', 'trois angles droits', 'la moitié d\'un angle droit'],
          e: 'Un angle plat est formé de deux angles droits mis bout à bout.'
        }
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

  /* Un angle se note par trois lettres, celle du sommet au milieu.

     Le programme demande de « comprendre et utiliser les notations des
     angles », mais il interdit aussi d'exiger la connaissance des conventions
     d'écriture : « les consignes expliciteront systématiquement les symboles
     utilisés ». Chaque énoncé rappelle donc la règle avant de s'en servir. Ce
     qui est évalué, c'est l'usage, pas la mémoire de la convention.

     Le chapeau qui se pose sur la lettre du sommet n'est pas dessiné : un
     accent combinant ne s'affiche pas de la même façon d'une police à l'autre,
     et il ne changerait rien à ce qui est demandé. */
  var SOMMETS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  reg.ajouter({
    id: 'mes.notation_angles',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.angles.02'],
    titre: 'Comment note-t-on un angle ?',
    generer: function (r) {
      // Trois ou quatre sommets, pris d'affilée dans l'alphabet : le polygone
      // se nomme alors comme on le lit, ABC ou ABCD.
      var combien = r.choix([3, 4]);
      var depart = r.entier(0, SOMMETS.length - combien);
      var lettres = SOMMETS.slice(depart, depart + combien);
      var nom = lettres.join('');
      var figure = combien === 3 ? 'le triangle ' + nom : 'le quadrilatère ' + nom;

      var rappel = 'Un angle se note avec trois lettres : celle du sommet est au milieu. ';
      var i = r.entier(0, combien - 1);
      var sommet = lettres[i];
      // Les deux voisins du sommet sur le contour de la figure : ce sont eux
      // qui encadrent la lettre du sommet.
      var avant = lettres[(i - 1 + combien) % combien];
      var apres = lettres[(i + 1) % combien];

      if (r.chance()) {
        var bonne = avant + sommet + apres;
        // Aucun leurre ne doit porter le sommet au milieu : il serait juste
        // lui aussi. On ne retient donc que des écritures où la lettre du
        // sommet est en première ou en dernière position.
        var leurres = [sommet + avant + apres, sommet + apres + avant,
                       avant + apres + sommet, apres + avant + sommet];
        var choix = Q.construire(r, bonne, r.melanger(leurres), String);
        return {
          enonce: rappel + 'Dans ' + figure + ', quelle écriture désigne l\'angle de sommet ' +
            sommet + ' ?',
          type: 'qcm',
          propositions: choix.propositions,
          bonne_reponse: choix.bonne_reponse,
          explication: 'Le sommet est ' + sommet + ' : sa lettre se place au milieu, entre les ' +
            'deux autres. On écrit donc ' + bonne + '.'
        };
      }

      var ecriture = avant + sommet + apres;
      var leurres2 = lettres.filter(function (l) { return l !== sommet; })
                            .map(function (l) { return 'l\'angle de sommet ' + l; });
      var choix2 = Q.construire(r, 'l\'angle de sommet ' + sommet, r.melanger(leurres2), String,
                                Math.min(4, combien));
      return {
        enonce: rappel + 'Dans ' + figure + ', que désigne l\'écriture ' + ecriture + ' ?',
        type: 'qcm',
        propositions: choix2.propositions,
        bonne_reponse: choix2.bonne_reponse,
        explication: 'Dans l\'écriture ' + ecriture + ', la lettre du milieu est ' + sommet +
          ' : c\'est le sommet de l\'angle.'
      };
    }
  });

  /* --- Durées --------------------------------------------------------- */

  function enMinutes(h, m) { return h * 60 + m; }

  function deuxChiffres(m) { return m < 10 ? '0' + m : String(m); }

  /** Les autres façons d'écrire une durée en heures et minutes.

      « 2 h 05 », « 2 h 5 », « 2 h 05 min » et « 2 h 5 min » sont la même durée.
      Tant que l'application n'acceptait qu'une seule écriture, il fallait
      interdire les durées de moins de dix minutes pour que la question reste
      honnête : c'était la pédagogie qui se pliait au code. */
  function ecrituresDuree(heures, minutes) {
    var vues = {}, autres = [];
    [heures + ' h ' + deuxChiffres(minutes),
     heures + ' h ' + minutes,
     heures + ' h ' + deuxChiffres(minutes) + ' min',
     heures + ' h ' + minutes + ' min',
     minutes === 0 ? heures + ' h' : null].forEach(function (t, i) {
      if (t === null) return;
      var cle = F.normaliser(t);
      if (i === 0) { vues[cle] = true; return; }     // celle-là est la réponse attendue
      if (vues[cle]) return;
      vues[cle] = true;
      autres.push(t);
    });
    return autres.length ? autres : undefined;
  }

  /** Les autres façons d'écrire un instant. Pas de « min » ici : une heure de
      la journée n'est pas une durée. */
  function ecrituresHeure(h, m) {
    if (m === 0) return [h + ' h'];
    if (m < 10) return [h + ' h ' + m];
    return undefined;
  }

  reg.ajouter({
    id: 'mes.duree_ecoulee',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.temps.03'],
    titre: 'Durée écoulée entre deux instants',
    generer: function (r) {
      var h1 = r.entier(6, 17);
      var m1 = r.entier(0, 59);
      // Durée toujours d'au moins une heure : la réponse garde la forme
      // « 2 h 15 ». Les minutes vont de 1 à 59 — « 3 h 5 » et « 3 h 05 » sont
      // deux écritures également défendables, et toutes deux sont acceptées.
      var heures = r.entier(1, 3);
      var minutes = r.entier(1, 59);
      var dureeMin = heures * 60 + minutes;

      var total = enMinutes(h1, m1) + dureeMin;
      var h2 = Math.floor(total / 60);
      var m2 = total % 60;

      return {
        enonce: 'Un film commence à ' + F.heure(h1, m1) + ' et se termine à ' + F.heure(h2, m2) +
          '. Combien de temps a-t-il duré ? (Réponds sous la forme « 2 h 15 ».)',
        type: 'saisie',
        bonne_reponse: heures + ' h ' + deuxChiffres(minutes),
        reponses_acceptees: ecrituresDuree(heures, minutes),
        explication: 'De ' + F.heure(h1, m1) + ' à ' + F.heure(h2, m2) + ', il s\'écoule ' +
          heures + ' h ' + minutes + ' min. On peut avancer d\'abord jusqu\'à l\'heure ronde ' +
          'suivante, puis compter les heures entières, puis les minutes qui restent.'
      };
    }
  });

  reg.ajouter({
    id: 'mes.instant_final',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.temps.04'],
    titre: 'À quelle heure cela finit-il ?',
    generer: function (r) {
      var h1 = r.entier(6, 17);
      var m1 = r.choix([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
      var dh = r.entier(0, 3);
      var dm = r.choix([10, 15, 20, 25, 30, 40, 45, 50]);
      var dureeMin = dh * 60 + dm;

      var total = enMinutes(h1, m1) + dureeMin;
      var h2 = Math.floor(total / 60) % 24;
      var m2 = total % 60;

      var dureeTexte = dh ? dh + ' h ' + dm + ' min' : dm + ' min';

      return {
        enonce: 'Une activité commence à ' + F.heure(h1, m1) + ' et dure ' + dureeTexte +
          '. À quelle heure se termine-t-elle ? (Réponds sous la forme « 14 h 30 ».)',
        type: 'saisie',
        bonne_reponse: h2 + ' h ' + deuxChiffres(m2),
        reponses_acceptees: ecrituresHeure(h2, m2),
        explication: 'On ajoute d\'abord les heures, puis les minutes, en convertissant 60 minutes ' +
          'en 1 heure si besoin : ' + F.heure(h1, m1) + ' + ' + dureeTexte + ' = ' + F.heure(h2, m2) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'mes.conversion_duree',
    matiere: 'mathematiques',
    objectifs: ['mat.gm.temps.04'],
    titre: 'Heures, minutes, secondes',
    generer: function (r) {
      var cas = r.entier(1, 3);
      var enonce, reponse, explication, autres;

      if (cas === 1) {
        var h = r.entier(2, 9);
        var m = r.choix([5, 10, 15, 20, 30, 40, 45]);
        reponse = h * 60 + m;
        enonce = 'Combien de minutes y a-t-il dans ' + h + ' h ' + m + ' min ?';
        explication = '1 h = 60 min, donc ' + h + ' h = ' + (h * 60) + ' min. Avec les ' + m +
          ' minutes restantes : ' + (h * 60) + ' + ' + m + ' = ' + F.entier(reponse) + ' min.';
      } else if (cas === 2) {
        var mn = r.entier(2, 9);
        reponse = mn * 60;
        enonce = 'Combien de secondes y a-t-il dans ' + mn + ' minutes ?';
        explication = '1 min = 60 s, donc ' + mn + ' × 60 = ' + F.entier(reponse) + ' s.';
      } else {
        var hh = r.entier(1, 8);
        var mm = r.entier(1, 59);
        var totalMin = hh * 60 + mm;
        reponse = hh + ' h ' + deuxChiffres(mm);
        autres = ecrituresDuree(hh, mm);
        enonce = 'Convertis ' + F.entier(totalMin) + ' minutes en heures et minutes. ' +
          '(Réponds sous la forme « 2 h 15 ».)';
        explication = F.entier(totalMin) + ' = ' + hh + ' × 60 + ' + mm + ', donc ' +
          F.entier(totalMin) + ' min = ' + hh + ' h ' + mm + ' min.';
      }

      return {
        enonce: enonce,
        type: 'saisie',
        bonne_reponse: String(reponse),
        reponses_acceptees: autres,
        explication: explication
      };
    }
  });

})(window.CM2 = window.CM2 || {});
