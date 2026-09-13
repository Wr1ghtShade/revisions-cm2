/* Figures : demi-droites graduées, horloges, quadrillages, diagrammes.

   Chaque fonction renvoie un fragment SVG, sous forme de chaîne. Ce fragment est
   inséré tel quel dans la page par l'interface. C'est sans danger ici — et
   seulement ici : ces chaînes sont entièrement fabriquées par le code ci-dessous
   à partir de nombres, jamais à partir d'une saisie de l'élève. Aucune donnée
   extérieure n'entre dans une figure.

   Les figures s'adaptent au thème clair de la page et restent lisibles agrandies :
   tout est en unités du viewBox, rien en pixels fixes. */
(function (CM2) {
  'use strict';

  var ENCRE = '#24303a';
  var TRAIT = '#4a5a68';
  var ACCENT = '#cf4436';
  var DOUX = '#9fb2c2';
  var POLICE = 'font-family="Segoe UI, system-ui, sans-serif"';

  var Fig = {};

  function svg(largeur, hauteur, contenu, etiquette) {
    return '<svg viewBox="0 0 ' + largeur + ' ' + hauteur + '" ' +
      'xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + etiquette + '" ' +
      'style="width:100%;max-width:' + largeur + 'px;height:auto">' + contenu + '</svg>';
  }

  function texte(x, y, contenu, taille, couleur, ancre) {
    return '<text x="' + x + '" y="' + y + '" ' + POLICE +
      ' font-size="' + (taille || 13) + '" fill="' + (couleur || ENCRE) + '"' +
      ' text-anchor="' + (ancre || 'middle') + '">' + contenu + '</text>';
  }

  /* --------------------------------------------------- Demi-droite graduée
     `graduations` : les valeurs à écrire sous les grands traits.
     `sousGraduations` : nombre d'intervalles entre deux grands traits.
     `points` : [{ position, etiquette }] où position est une valeur de l'axe. */

  Fig.demiDroiteGraduee = function (opts) {
    var min = opts.min, max = opts.max;
    var largeur = 640, hauteur = 110;
    var marge = 40;
    var utile = largeur - 2 * marge;

    function x(valeur) { return marge + utile * (valeur - min) / (max - min); }

    var p = ['<line x1="' + (marge - 20) + '" y1="60" x2="' + (largeur - 10) + '" y2="60" ' +
             'stroke="' + ENCRE + '" stroke-width="2"/>',
             // la flèche du bout
             '<path d="M' + (largeur - 22) + ',52 L' + (largeur - 8) + ',60 L' +
             (largeur - 22) + ',68" fill="none" stroke="' + ENCRE + '" stroke-width="2"/>'];

    var pas = opts.pas;
    var sous = opts.sousGraduations || 0;
    for (var v = min; v <= max + pas / 1000; v += pas) {
      var arrondi = Math.round(v * 1e6) / 1e6;
      p.push('<line x1="' + x(arrondi) + '" y1="48" x2="' + x(arrondi) + '" y2="72" ' +
             'stroke="' + ENCRE + '" stroke-width="2"/>');
      if (opts.etiquettes !== false) {
        p.push(texte(x(arrondi), 92, opts.formater ? opts.formater(arrondi) : String(arrondi), 14));
      }
      if (sous && arrondi < max - pas / 1000) {
        for (var k = 1; k < sous; k++) {
          var sv = arrondi + (pas * k) / sous;
          p.push('<line x1="' + x(sv) + '" y1="54" x2="' + x(sv) + '" y2="66" ' +
                 'stroke="' + DOUX + '" stroke-width="1.5"/>');
        }
      }
    }

    (opts.points || []).forEach(function (pt) {
      p.push('<line x1="' + x(pt.position) + '" y1="30" x2="' + x(pt.position) + '" y2="60" ' +
             'stroke="' + ACCENT + '" stroke-width="2" stroke-dasharray="4 3"/>');
      p.push('<circle cx="' + x(pt.position) + '" cy="60" r="6" fill="' + ACCENT + '"/>');
      if (pt.etiquette) p.push(texte(x(pt.position), 24, pt.etiquette, 17, ACCENT));
    });

    return svg(largeur, hauteur, p.join(''), opts.description || 'demi-droite graduée');
  };

  /* ----------------------------------------------------------- Horloge */

  Fig.horloge = function (heures, minutes, description) {
    var taille = 220, c = taille / 2, rayon = c - 14;
    var p = ['<circle cx="' + c + '" cy="' + c + '" r="' + rayon + '" fill="#fff" stroke="' +
             ENCRE + '" stroke-width="3"/>'];

    for (var i = 0; i < 60; i++) {
      var angle = (i * 6 - 90) * Math.PI / 180;
      var grand = i % 5 === 0;
      var r1 = rayon - (grand ? 12 : 6);
      p.push('<line x1="' + (c + r1 * Math.cos(angle)) + '" y1="' + (c + r1 * Math.sin(angle)) +
             '" x2="' + (c + rayon * Math.cos(angle)) + '" y2="' + (c + rayon * Math.sin(angle)) +
             '" stroke="' + (grand ? ENCRE : DOUX) + '" stroke-width="' + (grand ? 2.5 : 1) + '"/>');
    }

    for (var h = 1; h <= 12; h++) {
      var a = (h * 30 - 90) * Math.PI / 180;
      var rc = rayon - 30;
      p.push(texte(c + rc * Math.cos(a), c + rc * Math.sin(a) + 6, String(h), 18));
    }

    // La petite aiguille avance aussi avec les minutes : à 3 h 30 elle est
    // entre le 3 et le 4. Sans cela, l'horloge apprendrait une heure fausse.
    var angleH = ((heures % 12) * 30 + minutes * 0.5 - 90) * Math.PI / 180;
    var angleM = (minutes * 6 - 90) * Math.PI / 180;

    p.push('<line x1="' + c + '" y1="' + c + '" x2="' + (c + (rayon - 66) * Math.cos(angleH)) +
           '" y2="' + (c + (rayon - 66) * Math.sin(angleH)) + '" stroke="' + ENCRE +
           '" stroke-width="6" stroke-linecap="round"/>');
    p.push('<line x1="' + c + '" y1="' + c + '" x2="' + (c + (rayon - 28) * Math.cos(angleM)) +
           '" y2="' + (c + (rayon - 28) * Math.sin(angleM)) + '" stroke="' + ACCENT +
           '" stroke-width="4" stroke-linecap="round"/>');
    p.push('<circle cx="' + c + '" cy="' + c + '" r="5" fill="' + ENCRE + '"/>');

    return svg(taille, taille, p.join(''), description || 'horloge à aiguilles');
  };

  /* ------------------------------------------------------- Quadrillage */

  /** Quadrillage avec des cases coloriées et, au choix, un axe de symétrie.
      `cases` : [[colonne, ligne], …]. `axe` : { type: 'vertical'|'horizontal', a } */
  Fig.quadrillage = function (colonnes, lignes, cases, axe, description) {
    var cote = 26, marge = 12;
    var largeur = colonnes * cote + 2 * marge;
    var hauteur = lignes * cote + 2 * marge;
    var p = [];

    for (var i = 0; i <= colonnes; i++) {
      p.push('<line x1="' + (marge + i * cote) + '" y1="' + marge + '" x2="' +
             (marge + i * cote) + '" y2="' + (marge + lignes * cote) + '" stroke="' + DOUX +
             '" stroke-width="1"/>');
    }
    for (var j = 0; j <= lignes; j++) {
      p.push('<line x1="' + marge + '" y1="' + (marge + j * cote) + '" x2="' +
             (marge + colonnes * cote) + '" y2="' + (marge + j * cote) + '" stroke="' + DOUX +
             '" stroke-width="1"/>');
    }

    (cases || []).forEach(function (c) {
      p.push('<rect x="' + (marge + c[0] * cote + 1) + '" y="' + (marge + c[1] * cote + 1) +
             '" width="' + (cote - 2) + '" height="' + (cote - 2) + '" fill="' + TRAIT +
             '" opacity=".75"/>');
    });

    if (axe) {
      if (axe.type === 'vertical') {
        p.push('<line x1="' + (marge + axe.a * cote) + '" y1="' + (marge - 6) + '" x2="' +
               (marge + axe.a * cote) + '" y2="' + (marge + lignes * cote + 6) + '" stroke="' +
               ACCENT + '" stroke-width="2.5" stroke-dasharray="6 4"/>');
      } else {
        p.push('<line x1="' + (marge - 6) + '" y1="' + (marge + axe.a * cote) + '" x2="' +
               (marge + colonnes * cote + 6) + '" y2="' + (marge + axe.a * cote) + '" stroke="' +
               ACCENT + '" stroke-width="2.5" stroke-dasharray="6 4"/>');
      }
    }

    return svg(largeur, hauteur, p.join(''), description || 'quadrillage');
  };

  /* --------------------------------------------------------- Diagrammes */

  /** Diagramme en barres. `donnees` : [{ nom, valeur }]. */
  Fig.diagrammeBarres = function (donnees, uniteAxe, description) {
    var largeur = 520, hauteur = 260;
    var gauche = 46, bas = hauteur - 46, haut = 20;
    var max = Math.max.apply(Math, donnees.map(function (d) { return d.valeur; }));
    var pas = max <= 10 ? 1 : (max <= 25 ? 5 : 10);
    var plafond = Math.ceil(max / pas) * pas;
    var largeurBarre = (largeur - gauche - 20) / donnees.length;

    var p = ['<line x1="' + gauche + '" y1="' + haut + '" x2="' + gauche + '" y2="' + bas +
             '" stroke="' + ENCRE + '" stroke-width="2"/>',
             '<line x1="' + gauche + '" y1="' + bas + '" x2="' + (largeur - 10) + '" y2="' + bas +
             '" stroke="' + ENCRE + '" stroke-width="2"/>'];

    for (var v = 0; v <= plafond; v += pas) {
      var y = bas - (bas - haut) * v / plafond;
      p.push('<line x1="' + (gauche - 5) + '" y1="' + y + '" x2="' + (largeur - 10) + '" y2="' + y +
             '" stroke="' + DOUX + '" stroke-width="' + (v === 0 ? 0 : 1) + '"/>');
      p.push(texte(gauche - 10, y + 5, String(v), 12, TRAIT, 'end'));
    }

    donnees.forEach(function (d, i) {
      var h = (bas - haut) * d.valeur / plafond;
      var x = gauche + i * largeurBarre + largeurBarre * 0.18;
      var l = largeurBarre * 0.64;
      p.push('<rect x="' + x + '" y="' + (bas - h) + '" width="' + l + '" height="' + h +
             '" fill="' + TRAIT + '" opacity=".8"/>');
      p.push(texte(x + l / 2, bas + 20, d.nom, 13));
    });

    if (uniteAxe) p.push(texte(gauche - 10, haut - 6, uniteAxe, 12, TRAIT, 'end'));

    return svg(largeur, hauteur, p.join(''), description || 'diagramme en barres');
  };

  /** Tableau à deux lignes : intitulés puis valeurs. */
  Fig.tableau = function (entetes, valeurs, description) {
    var colonne = Math.max(84, Math.min(140, 520 / entetes.length));
    var largeur = colonne * entetes.length + 4;
    var hauteur = 76;
    var p = [];

    entetes.forEach(function (e, i) {
      var x = 2 + i * colonne;
      p.push('<rect x="' + x + '" y="2" width="' + colonne + '" height="34" fill="#eef3f7" ' +
             'stroke="' + TRAIT + '" stroke-width="1.5"/>');
      p.push('<rect x="' + x + '" y="36" width="' + colonne + '" height="34" fill="#fff" ' +
             'stroke="' + TRAIT + '" stroke-width="1.5"/>');
      p.push(texte(x + colonne / 2, 25, e, 14));
      p.push(texte(x + colonne / 2, 59, String(valeurs[i]), 15));
    });

    return svg(largeur, hauteur, p.join(''), description || 'tableau de données');
  };

  /* ------------------------------------------------------ Patron de cube
     Le patron est décrit sur une grille 4 × 3 : la liste des cases occupées. */

  Fig.patron = function (cases, description) {
    var cote = 40, marge = 8;
    var colonnes = 4, lignes = 3;
    var largeur = colonnes * cote + 2 * marge;
    var hauteur = lignes * cote + 2 * marge;
    var p = [];

    cases.forEach(function (c) {
      p.push('<rect x="' + (marge + c[0] * cote) + '" y="' + (marge + c[1] * cote) +
             '" width="' + cote + '" height="' + cote + '" fill="#dce9f2" stroke="' + ENCRE +
             '" stroke-width="2"/>');
    });

    return svg(largeur, hauteur, p.join(''), description || 'patron');
  };

  /* --------------------------------------------------- Patron de pavé
     Même grille 4 × 3 que le patron de cube, mais les colonnes n'ont plus
     toutes la même largeur ni les lignes la même hauteur : c'est justement ce
     qui distingue le patron d'un pavé de celui d'un cube. Une face est donc
     décrite par sa case, et ses dimensions se lisent dans `largeurs` et
     `hauteurs`, exprimées en unités de longueur du pavé. */

  Fig.patronPave = function (cases, largeurs, hauteurs, description) {
    var unite = 13, marge = 8;
    function somme(liste, jusqua) {
      var t = 0;
      for (var i = 0; i < jusqua; i++) t += liste[i];
      return t;
    }
    var largeur = somme(largeurs, largeurs.length) * unite + 2 * marge;
    var hauteur = somme(hauteurs, hauteurs.length) * unite + 2 * marge;
    var p = [];

    cases.forEach(function (c) {
      p.push('<rect x="' + (marge + somme(largeurs, c[0]) * unite) +
             '" y="' + (marge + somme(hauteurs, c[1]) * unite) +
             '" width="' + (largeurs[c[0]] * unite) +
             '" height="' + (hauteurs[c[1]] * unite) +
             '" fill="#dce9f2" stroke="' + ENCRE + '" stroke-width="2"/>');
    });

    return svg(largeur, hauteur, p.join(''), description || 'assemblage de rectangles');
  };

  /* ------------------------------------------------------------- Angles */

  /** Deux angles côte à côte, en degrés, pour être comparés à l'œil. */
  Fig.deuxAngles = function (a, b, description) {
    var largeur = 420, hauteur = 170;

    function dessiner(cx, cy, degres, nom) {
      var rayon = 74;
      var rad = degres * Math.PI / 180;
      return '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + rayon) + '" y2="' + cy +
             '" stroke="' + ENCRE + '" stroke-width="2.5"/>' +
             '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + rayon * Math.cos(-rad)) +
             '" y2="' + (cy + rayon * Math.sin(-rad)) + '" stroke="' + ENCRE +
             '" stroke-width="2.5"/>' +
             '<path d="M' + (cx + 22) + ',' + cy + ' A22,22 0 0 0 ' +
             (cx + 22 * Math.cos(-rad)) + ',' + (cy + 22 * Math.sin(-rad)) + '" fill="none" ' +
             'stroke="' + ACCENT + '" stroke-width="2"/>' +
             texte(cx + 30, cy + 34, nom, 16, ACCENT, 'start');
    }

    return svg(largeur, hauteur,
      dessiner(40, 130, a, 'angle A') + dessiner(240, 130, b, 'angle B'),
      description || 'deux angles à comparer');
  };

  CM2.figures = Fig;
})(window.CM2 = window.CM2 || {});
