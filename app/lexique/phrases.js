/* Fabrique de phrases annotées.

   Une phrase n'est pas produite puis analysée : elle est construite à partir de
   son analyse. La nature de chaque mot et la fonction de chaque groupe sont donc
   connues par construction, et non devinées — c'est la seule façon d'être sûr
   que la correction est juste.

   Chaque verbe porte ici la liste des catégories de noms qui peuvent être son
   sujet et son complément. Sans cela on produit des phrases correctes et
   absurdes (« le journal attrape une souris »), qui font douter l'élève de la
   question plutôt que de sa réponse.

   Vocabulaire employé : celui du programme du CM2. La notion de proposition
   n'apparaît nulle part ; une phrase complexe est ici simplement une phrase à
   deux verbes conjugués. */
(function (CM2) {
  'use strict';

  var L = CM2.lexique;
  var C = CM2.conjugaison;

  var ANIME = ['personne', 'animal'];

  /* Verbes transitifs directs : sujet et objet compatibles, écrits à la main. */
  var VERBES_COD = [
    { inf: 'regarder', sujet: ANIME, objet: ['animal', 'personne', 'objet', 'ecrit', 'lieu'] },
    { inf: 'voir', sujet: ANIME, objet: ['animal', 'personne', 'objet', 'ecrit', 'lieu'] },
    { inf: 'chercher', sujet: ANIME, objet: ['animal', 'objet', 'ecrit'] },
    { inf: 'trouver', sujet: ANIME, objet: ['animal', 'objet', 'ecrit'] },
    { inf: 'porter', sujet: ['personne'], objet: ['objet', 'ecrit', 'nourriture'] },
    { inf: 'prendre', sujet: ['personne'], objet: ['objet', 'ecrit', 'nourriture'] },
    { inf: 'saisir', sujet: ['personne'], objet: ['objet', 'ecrit'] },
    { inf: 'attraper', sujet: ANIME, objet: ['animal', 'objet'] },
    { inf: 'laver', sujet: ['personne'], objet: ['objet', 'animal'] },
    { inf: 'fermer', sujet: ['personne'], objet: ['objet', 'ecrit', 'lieu'] },
    { inf: 'choisir', sujet: ['personne'], objet: ['objet', 'ecrit', 'nourriture'] },
    { inf: 'préparer', sujet: ['personne'], objet: ['nourriture', 'ecrit'] },
    { inf: 'dessiner', sujet: ['personne'], objet: ['animal', 'objet', 'lieu'] },
    { inf: 'raconter', sujet: ['personne'], objet: ['ecrit'] },
    { inf: 'écouter', sujet: ['personne'], objet: ['animal', 'ecrit', 'personne'] },
    { inf: 'aimer', sujet: ['personne'], objet: ['animal', 'personne', 'objet', 'ecrit', 'nourriture', 'lieu'] },
    { inf: 'faire', sujet: ['personne'], objet: ['nourriture', 'ecrit', 'objet'] }
  ];

  /* Verbes transitifs indirects, tous construits avec « à ». */
  var VERBES_COI = [
    { inf: 'obéir', sujet: ANIME, objet: ['personne'] },
    { inf: 'parler', sujet: ['personne'], objet: ['personne'] },
    { inf: 'penser', sujet: ['personne'], objet: ['personne', 'animal', 'lieu'] }
  ];

  /* Verbes employés sans complément d'objet. */
  var VERBES_INTRANSITIFS = [
    { inf: 'marcher', sujet: ANIME },
    { inf: 'danser', sujet: ['personne'] },
    { inf: 'sauter', sujet: ANIME },
    { inf: 'grimper', sujet: ANIME },
    { inf: 'tomber', sujet: ANIME },
    { inf: 'arriver', sujet: ANIME },
    { inf: 'travailler', sujet: ['personne'] },
    { inf: 'grandir', sujet: ANIME },
    { inf: 'réfléchir', sujet: ['personne'] }
  ];

  /* --- Contractions ---------------------------------------------------- */

  /** « de » + déterminant : du, de la, des. */
  function deAvec(determinantTexte) {
    if (determinantTexte === 'le') return 'du';
    if (determinantTexte === 'les') return 'des';
    return 'de ' + determinantTexte;
  }

  /** « à » + déterminant : au, à la, aux. */
  function aAvec(determinantTexte) {
    if (determinantTexte === 'le') return 'au';
    if (determinantTexte === 'les') return 'aux';
    return 'à ' + determinantTexte;
  }

  /* --- Groupe nominal --------------------------------------------------- */

  /** Construit un groupe nominal annoté.
      opts : { nombre, adjectif, determinants: [classes], categories: [cat] } */
  function groupeNominal(r, opts) {
    opts = opts || {};
    var nombre = opts.nombre || (r.chance() ? 's' : 'p');

    var candidats = opts.categories ? L.nomsDe(opts.categories) : L.noms;
    var nom = r.choix(candidats);

    var determinantsPossibles = L.determinants.filter(function (d) {
      if (!opts.determinants) return true;
      return opts.determinants.indexOf(d.classe) !== -1;
    });
    var det = r.choix(determinantsPossibles);

    var detTexte = L.accorderDeterminant(det, nom.g, nombre);
    var nomTexte = nombre === 'p' ? nom.p : nom.s;

    var mots = [
      { mot: detTexte, classe: det.classe },
      { mot: nomTexte, classe: 'nom' }
    ];

    var adjectif = null;
    if (opts.adjectif) {
      // Adjectif toujours placé après le nom : « les petits chats » exigerait
      // « de petits chats » avec l'article indéfini, subtilité hors programme.
      adjectif = r.choix(L.adjectifsPour(nom, true));
      mots.push({ mot: L.accorderAdjectif(adjectif, nom.g, nombre), classe: 'adjectif' });
    }

    return {
      texte: mots.map(function (m) { return m.mot; }).join(' '),
      mots: mots,
      genre: nom.g,
      nombre: nombre,
      nom: nom,
      determinant: det,
      determinantTexte: detTexte,
      adjectif: adjectif
    };
  }

  /** Complément du nom : groupe nominal introduit par une préposition. */
  function complementDuNom(r) {
    // Un possesseur : « le livre de la voisine » se comprend, « le livre du bois » non.
    var nom = r.choix(L.nomsDe(['personne']));
    var det = L.determinants[0];                       // article défini
    var detTexte = L.accorderDeterminant(det, nom.g, 's');
    return {
      texte: deAvec(detTexte) + ' ' + nom.s,
      mots: [{ mot: deAvec(detTexte), classe: 'préposition' },
             { mot: nom.s, classe: 'nom' }]
    };
  }

  /* --- Compléments circonstanciels ------------------------------------- */

  /* Compléments de temps sans ancrage dans le passé : « hier » ou « la semaine
     dernière » dans une phrase au présent créerait une contradiction que l'élève
     verrait avant la question elle-même. */
  var CC_TEMPS = ['chaque jour', 'ce matin', 'ce soir', 'après le repas',
                  'avant la nuit', 'le dimanche'];
  var CC_CAUSE = ['à cause de la pluie', 'à cause du bruit', 'à cause du vent',
                  'grâce à son courage', 'grâce à son travail'];
  /* Chaque lieu ne va pas avec n'importe quelle préposition : on est « dans le
     jardin » mais « sur la route », et « sous le village » ne veut rien dire. */
  var CC_LIEU = {
    'maison': ['dans', 'devant', 'derrière', 'vers'],
    'jardin': ['dans', 'devant', 'derrière', 'vers'],
    'village': ['dans', 'devant', 'vers'],
    'bois': ['dans', 'devant', 'derrière', 'vers'],
    'route': ['sur', 'vers'],
    'table': ['sur', 'sous', 'devant', 'derrière']
  };

  function complementCirconstanciel(r, type) {
    if (type === 'temps') {
      return { texte: r.choix(CC_TEMPS), type: 'complément circonstanciel de temps' };
    }
    if (type === 'cause') {
      return { texte: r.choix(CC_CAUSE), type: 'complément circonstanciel de cause' };
    }
    var gn = groupeNominal(r, {
      nombre: 's',
      categories: ['lieu'],
      determinants: ['article défini']
    });
    var prep = r.choix(CC_LIEU[gn.nom.s]);
    return {
      texte: prep + ' ' + gn.texte,
      type: 'complément circonstanciel de lieu',
      preposition: prep,
      groupeNominal: gn
    };
  }

  /* --- Phrase ----------------------------------------------------------- */

  function majuscule(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  /** Phrase simple annotée.
      opts : {
        complement : 'cod' | 'coi' | 'aucun' | 'attribut',
        circonstanciel : null | 'temps' | 'lieu' | 'cause',
        sujetAdjectif, codAdjectif : bool,
        temps : un temps du programme (présent par défaut),
        nombreSujet : 's' | 'p'
      } */
  function phrase(r, opts) {
    opts = opts || {};
    var temps = opts.temps || 'présent';
    var complement = opts.complement || 'cod';

    var modele;
    if (complement === 'cod') modele = r.choix(VERBES_COD);
    else if (complement === 'coi') modele = r.choix(VERBES_COI);
    else if (complement === 'aucun') modele = r.choix(VERBES_INTRANSITIFS);

    var sujet = groupeNominal(r, {
      nombre: opts.nombreSujet,
      adjectif: !!opts.sujetAdjectif,
      categories: modele ? modele.sujet : ANIME,
      determinants: ['article défini', 'déterminant démonstratif', 'déterminant possessif']
    });
    var personne = sujet.nombre === 'p' ? 5 : 2;

    var verbe, groupeVerbal, cod = null, coi = null, attribut = null;
    var groupes = [{ texte: sujet.texte, fonction: 'sujet' }];

    if (complement === 'attribut') {
      verbe = L.verbe('être');
      attribut = r.choix(L.adjectifsPour(sujet.nom, true));
      var attributTexte = L.accorderAdjectif(attribut, sujet.genre, sujet.nombre);
      groupeVerbal = C.conjuguer(verbe, temps, personne) + ' ' + attributTexte;
      groupes.push({ texte: attributTexte, fonction: 'attribut du sujet' });
    } else if (complement === 'coi') {
      verbe = L.verbe(modele.inf);
      var gnCoi = groupeNominal(r, {
        nombre: 's',
        categories: modele.objet,
        determinants: ['article défini']
      });
      coi = aAvec(gnCoi.determinantTexte) + ' ' + gnCoi.nom.s;
      groupeVerbal = C.conjuguer(verbe, temps, personne) + ' ' + coi;
      groupes.push({ texte: coi, fonction: 'complément d\'objet indirect' });
    } else if (complement === 'aucun') {
      verbe = L.verbe(modele.inf);
      groupeVerbal = C.conjuguer(verbe, temps, personne);
    } else {
      verbe = L.verbe(modele.inf);
      cod = groupeNominal(r, {
        nombre: 's',
        adjectif: !!opts.codAdjectif,
        categories: modele.objet,
        determinants: ['article défini', 'article indéfini']
      });
      groupeVerbal = C.conjuguer(verbe, temps, personne) + ' ' + cod.texte;
      groupes.push({ texte: cod.texte, fonction: 'complément d\'objet direct' });
    }

    var circonstanciel = null;
    if (opts.circonstanciel) {
      circonstanciel = complementCirconstanciel(r, opts.circonstanciel);
      groupes.push({ texte: circonstanciel.texte, fonction: circonstanciel.type });
    }

    var texte = majuscule(sujet.texte) + ' ' + groupeVerbal +
                (circonstanciel ? ' ' + circonstanciel.texte : '') + '.';

    return {
      texte: texte,
      groupes: groupes,
      sujet: sujet,
      verbe: verbe,
      temps: temps,
      personne: personne,
      formeVerbale: C.conjuguer(verbe, temps, personne),
      cod: cod,
      coi: coi,
      attribut: attribut,
      circonstanciel: circonstanciel
    };
  }

  CM2.phrases = {
    groupeNominal: groupeNominal,
    complementDuNom: complementDuNom,
    complementCirconstanciel: complementCirconstanciel,
    phrase: phrase,
    deAvec: deAvec,
    aAvec: aAvec,
    majuscule: majuscule,
    verbesCod: VERBES_COD,
    verbesCoi: VERBES_COI,
    verbesIntransitifs: VERBES_INTRANSITIFS,
    ccTemps: CC_TEMPS,
    ccCause: CC_CAUSE
  };
})(window.CM2 = window.CM2 || {});
