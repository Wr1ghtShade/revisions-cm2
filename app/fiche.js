/* Les fiches à imprimer.

   Sortir l'entraînement de l'écran : vingt exercices sur une feuille, le
   corrigé sur la suivante. Pour un CM2, écrire à la main une opération posée ou
   une phrase n'est pas la même chose que cliquer, et l'application doit pouvoir
   servir quand l'ordinateur n'est pas disponible.

   Rien de neuf n'est fabriqué ici : ce sont les mêmes générateurs, le même
   tirage déterministe. Deux choix propres à la version papier :

   - la fiche est tirée d'une seule graine maîtresse, et cette graine s'écrit en
     clair sur les deux pages (« fiche 7K3QP2 »). Elle sert à savoir quel
     corrigé va avec quelle feuille quand plusieurs traînent sur la table, et à
     réimprimer la même fiche à l'identique ;
   - les exercices sont répartis à tour de rôle entre les domaines du programme,
     au lieu de suivre l'ordre de la révision espacée. Sur une feuille de papier
     personne ne sait ce que l'enfant a raté la semaine dernière : mieux vaut un
     balayage régulier du programme qu'une priorité qu'on ne peut pas mesurer.

   Une fiche papier ne touche pas au cahier : les réponses ne sont pas connues
   de l'application, donc rien n'est noté et la révision espacée n'en tient pas
   compte. C'est dit à l'écran, pour ne pas laisser croire le contraire. */
(function (CM2) {
  'use strict';

  var Fi = {};

  var LETTRES = ['a', 'b', 'c', 'd', 'e', 'f'];

  /* --- Composition (aucun DOM : testable hors navigateur) -------------- */

  function graineAuHasard() {
    return (Math.random() * 4294967296) >>> 0;
  }

  /* La référence imprimée sur la feuille, par exemple « 7K3QP2-M20 » : la
     graine en base 36, puis la matière et le nombre d'exercices. Elle contient
     donc tout ce qu'il faut pour refaire la fiche — sans elle, il faudrait se
     souvenir aussi de la matière choisie. */
  var CODE_MATIERE = { mathematiques: 'M', francais: 'F', sciences: 'S',
                       histoire_geo: 'H', numerique: 'N', emc: 'C',
                       revisions: 'R', tout: 'T' };
  var MATIERE_DEPUIS_CODE = { M: 'mathematiques', F: 'francais', S: 'sciences',
                              H: 'histoire_geo', N: 'numerique', C: 'emc',
                              R: 'revisions', T: 'tout' };

  Fi.reference = function (graine, matiere, nombre) {
    var base = (graine >>> 0).toString(36).toUpperCase();
    if (!matiere && !nombre) return base;
    return base + '-' + (CODE_MATIERE[matiere] || 'T') + (nombre || '');
  };

  /** Relit une référence. Renvoie { graine, matiere, nombre }, ou null si le
      texte ne ressemble à rien. La casse et les espaces sont pardonnés : la
      référence est recopiée à la main depuis une feuille de papier. */
  Fi.depuisReference = function (texte) {
    var s = String(texte === null || texte === undefined ? '' : texte)
      .toUpperCase().replace(/\s/g, '');
    // Les lettres acceptées ici doivent suivre CODE_MATIERE à la lettre près :
    // une matière ajoutée à la table mais oubliée dans cette classe produirait
    // des fiches dont la référence ne se relit plus (constaté avec « R »).
    var m = /^([0-9A-Z]+)(?:-([MFSHNCRT])(\d+)?)?$/.exec(s);
    if (!m) return null;
    var graine = parseInt(m[1], 36);
    if (isNaN(graine)) return null;
    return {
      graine: graine >>> 0,
      matiere: m[2] ? MATIERE_DEPUIS_CODE[m[2]] : null,
      nombre: m[3] ? parseInt(m[3], 10) : null
    };
  };

  /** Range les générateurs par sous-domaine du programme, pour pouvoir ensuite
      les prendre à tour de rôle. */
  /* Un exercice « court » tient sur une seule ligne, énoncé et trait pour la
     réponse compris : pas de figure à regarder, pas de propositions à cocher,
     et un énoncé bref tenant sur une ligne. Le seuil est volontairement bas —
     en cas de doute on garde la pleine largeur, une question à l'étroit se lit
     mal, et c'est l'enfant qui en pâtirait. */
  var LONGUEUR_COURTE = 46;

  function estCourt(ex) {
    return !ex.figure &&
           ex.type !== 'qcm' &&
           String(ex.enonce).indexOf('\n') === -1 &&
           String(ex.enonce).length <= LONGUEUR_COURTE;
  }

  function parSousDomaine(specs) {
    var paquets = {};
    var ordre = [];
    specs.forEach(function (spec) {
      var sd = CM2.domaines.sousDomaineDe(spec.objectifs[0]);
      var clef = sd ? sd.id : spec.matiere;
      if (!paquets[clef]) { paquets[clef] = []; ordre.push(clef); }
      paquets[clef].push(spec);
    });
    return ordre.map(function (clef) { return paquets[clef]; });
  }

  /** Compose une fiche.

      matiere : 'mathematiques' | 'francais' | 'sciences' | 'histoire_geo'
                | 'numerique' | 'emc' | 'tout'
      nombre  : nombre d'exercices
      graine  : graine maîtresse, ou rien pour en tirer une

      Renvoie { matiere, nombre, graine, reference, exercices: [...] }.
      Deux appels avec la même graine donnent exactement la même fiche. */
  Fi.composer = function (matiere, nombre, graine) {
    var maitresse = (graine === undefined || graine === null) ? graineAuHasard() : (graine >>> 0);
    var r = new CM2.Rng(maitresse);

    var specs = ((matiere === 'tout' || !matiere)
      ? CM2.registre.liste()
      : CM2.registre.parMatiere(matiere))
      // Un sujet que le professeur n'a peut-être pas traité n'a pas sa place
      // sur une feuille qu'on donne à faire seul.
      .filter(function (s) { return CM2.progression.servable(s); });
    if (!specs.length) return null;

    // Les paquets sont mélangés, et chaque paquet aussi : la fiche balaie les
    // domaines dans un ordre différent d'une fois sur l'autre.
    var paquets = r.melanger(parSousDomaine(specs)).map(function (p) { return r.melanger(p); });

    var choisis = [];
    var tour = 0;
    while (choisis.length < nombre) {
      var reste = false;
      for (var i = 0; i < paquets.length && choisis.length < nombre; i++) {
        if (tour < paquets[i].length) { choisis.push(paquets[i][tour]); reste = true; }
      }
      tour++;
      // Moins de sortes d'exercices que de cases à remplir : on repart au début
      // des paquets, avec de nouvelles graines — donc d'autres questions.
      if (!reste) tour = 0;
    }

    var exercices = [];
    choisis.forEach(function (spec) {
      // Le registre refuse de servir un exercice qui sortirait du programme.
      // Cela n'arrive pas sur les générateurs en place, mais une fiche de vingt
      // exercices ne doit pas être perdue entière pour un tirage malheureux :
      // on retente quelques graines avant de renoncer à celui-là.
      for (var essai = 0; essai < 5; essai++) {
        try {
          exercices.push(CM2.registre.produire(spec.id, r.entier(0, 2147483646)));
          return;
        } catch (e) { /* graine suivante */ }
      }
    });

    return {
      matiere: matiere || 'tout',
      nombre: exercices.length,
      graine: maitresse,
      reference: Fi.reference(maitresse, matiere || 'tout', exercices.length),
      exercices: exercices
    };
  };

  /* --- Mise en page (DOM) ---------------------------------------------- */

  var NOM_MATIERE = {
    mathematiques: 'Mathématiques',
    francais: 'Français',
    sciences: 'Sciences et technologie',
    histoire_geo: 'Histoire et géographie',
    numerique: 'Le numérique',
    emc: 'Vivre en république',
    revisions: 'Révisions',
    tout: 'Toutes les matières'
  };

  function el(balise, classe, texte) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (texte !== undefined && texte !== null) n.textContent = texte;
    return n;
  }

  /** La réponse d'un QCM, telle qu'elle doit se lire dans le corrigé : la
      lettre, et le texte quand il y en a un. Quand les propositions sont des
      figures, la lettre suffit — décrire un dessin en mots serait pire. */
  function reponseQcm(ex) {
    var lettre = LETTRES[ex.bonne_reponse] || '?';
    if (ex.estFigure) return 'figure ' + lettre;
    return lettre + ') ' + ex.propositions[ex.bonne_reponse];
  }

  /** Dessine la fiche et son corrigé dans un conteneur. */
  Fi.dessiner = function (conteneur, fiche) {
    conteneur.innerHTML = '';
    if (!fiche) return;

    var aujourdhui = CM2.profil.aujourdhui();

    /* --- la feuille d'exercices --- */
    var tete = el('header', 'fiche-tete');
    tete.appendChild(el('h3', null, 'Fiche d\'entraînement — ' +
      (NOM_MATIERE[fiche.matiere] || fiche.matiere)));
    tete.appendChild(el('p', 'fiche-lignes-a-remplir',
      'Nom : .............................        Date : ...................'));
    tete.appendChild(el('p', 'fiche-reference',
      fiche.nombre + ' exercices — fiche n° ' + fiche.reference + ' — CM2, ' +
      CM2.format.date(aujourdhui)));
    conteneur.appendChild(tete);

    var ol = el('ol', 'fiche-exercices' +
      // Planche homogène — que des questions courtes, comme une série de
      // tables : elle passe sur deux colonnes. Vingt multiplications servies
      // en pleine largeur, avec un titre et une réglure chacune, mangeaient
      // trois pages pour une poignée de chiffres.
      (fiche.exercices.length && fiche.exercices.every(estCourt) ? ' fiche-compacte' : ''));

    fiche.exercices.forEach(function (ex) {
      var li = document.createElement('li');
      if (estCourt(ex)) li.className = 'fiche-court';
      li.appendChild(el('p', 'fiche-notion', ex.titre));
      li.appendChild(el('p', 'fiche-enonce', ex.enonce));

      if (ex.figure) {
        var fig = el('div', 'fiche-figure');
        // Fragment SVG fabriqué par app/figures.js à partir de nombres :
        // il ne contient jamais de saisie, d'où innerHTML.
        fig.innerHTML = ex.figure;
        li.appendChild(fig);
      }

      if (ex.type === 'qcm') {
        var choix = el('ul', 'fiche-choix' + (ex.estFigure ? ' fiche-choix-figures' : ''));
        ex.propositions.forEach(function (p, i) {
          var item = document.createElement('li');
          item.appendChild(el('span', 'fiche-lettre', LETTRES[i] + ')'));
          if (ex.estFigure) {
            var boite = el('span', 'fiche-vignette');
            boite.innerHTML = p;
            item.appendChild(boite);
          } else {
            item.appendChild(el('span', null, p));
          }
          choix.appendChild(item);
        });
        li.appendChild(choix);
      } else {
        li.appendChild(el('p', 'fiche-reglure', ''));
      }

      ol.appendChild(li);
    });
    conteneur.appendChild(ol);

    /* --- le corrigé, sur une page à part --- */
    var corrige = el('section', 'fiche-corrige');
    corrige.appendChild(el('h3', null, 'Corrigé — fiche n° ' + fiche.reference));
    corrige.appendChild(el('p', 'fiche-reference',
      'À détacher avant de donner la feuille, ou à garder pour la correction.'));

    var ol2 = el('ol', 'fiche-reponses');
    fiche.exercices.forEach(function (ex) {
      var li = document.createElement('li');
      var rep = el('b', null, ex.type === 'qcm' ? reponseQcm(ex) : String(ex.bonne_reponse));
      li.appendChild(rep);
      // Celui qui corrige au crayon doit savoir ce qui compte juste : sinon il
      // barre une réponse correcte écrite autrement.
      if (ex.reponses_acceptees && ex.reponses_acceptees.length) {
        li.appendChild(el('span', 'fiche-acceptees',
          ' (on accepte aussi : ' + ex.reponses_acceptees.join(', ') + ')'));
      }
      if (ex.explication) {
        li.appendChild(document.createTextNode(' — '));
        li.appendChild(el('span', 'fiche-explication', ex.explication));
      }
      ol2.appendChild(li);
    });
    corrige.appendChild(ol2);
    conteneur.appendChild(corrige);
  };

  CM2.fiche = Fi;
})(window.CM2 = window.CM2 || {});
