/* Lexique annoté : noms, adjectifs, verbes, déterminants, prépositions.

   Toutes les formes fléchies sont écrites ici à la main. Aucune n'est devinée
   par une règle approximative : une forme fausse dans un exercice d'orthographe
   enseignerait exactement l'erreur qu'on veut éviter.

   Deux exclusions volontaires :
   - aucun nom ne commence par une voyelle ou un h, pour que « le / la / ce / mon »
     s'appliquent sans élision et sans cas particulier ;
   - aucun verbe du premier groupe à variation de radical (-cer, -ger, -yer,
     -eler, -eter, e/é) : ces verbes sont au programme, mais leurs formes seraient
     produites par la règle générale, donc fausses. Ils devront être ajoutés
     explicitement, avec leurs formes écrites.

   Verbes du troisième groupe : uniquement la liste fermée du programme
   (faire, aller, dire, venir, pouvoir, voir, vouloir, prendre). */
(function (CM2) {
  'use strict';

  /* --- Noms : genre, pluriel explicite ------------------------------- */
  /* `cat` sert à ne fabriquer que des phrases qui veulent dire quelque chose :
     « le journal attrape une souris » est grammaticalement correct et
     pédagogiquement absurde. Catégories : personne, animal, objet, lieu,
     ecrit, nourriture. */
  var NOMS = [
    { s: 'chat', p: 'chats', g: 'm', cat: 'animal' },
    { s: 'chien', p: 'chiens', g: 'm', cat: 'animal' },
    { s: 'oiseau', p: 'oiseaux', g: 'm', cat: 'animal' },
    { s: 'cheval', p: 'chevaux', g: 'm', cat: 'animal' },
    { s: 'souris', p: 'souris', g: 'f', cat: 'animal' },
    { s: 'garçon', p: 'garçons', g: 'm', cat: 'personne' },
    { s: 'fille', p: 'filles', g: 'f', cat: 'personne' },
    { s: 'voisin', p: 'voisins', g: 'm', cat: 'personne' },
    { s: 'voisine', p: 'voisines', g: 'f', cat: 'personne' },
    { s: 'maison', p: 'maisons', g: 'f', cat: 'lieu' },
    { s: 'jardin', p: 'jardins', g: 'm', cat: 'lieu' },
    { s: 'village', p: 'villages', g: 'm', cat: 'lieu' },
    { s: 'bois', p: 'bois', g: 'm', cat: 'lieu' },
    { s: 'route', p: 'routes', g: 'f', cat: 'lieu' },
    { s: 'table', p: 'tables', g: 'f', cat: 'lieu' },
    { s: 'livre', p: 'livres', g: 'm', cat: 'ecrit' },
    { s: 'journal', p: 'journaux', g: 'm', cat: 'ecrit' },
    { s: 'lettre', p: 'lettres', g: 'f', cat: 'ecrit' },
    { s: 'dessin', p: 'dessins', g: 'm', cat: 'ecrit' },
    { s: 'chanson', p: 'chansons', g: 'f', cat: 'ecrit' },
    { s: 'gâteau', p: 'gâteaux', g: 'm', cat: 'nourriture' },
    { s: 'voiture', p: 'voitures', g: 'f', cat: 'objet' },
    { s: 'bateau', p: 'bateaux', g: 'm', cat: 'objet' },
    { s: 'chapeau', p: 'chapeaux', g: 'm', cat: 'objet' },
    { s: 'ballon', p: 'ballons', g: 'm', cat: 'objet' },
    { s: 'jeu', p: 'jeux', g: 'm', cat: 'objet' },
    { s: 'tapis', p: 'tapis', g: 'm', cat: 'objet' },
    { s: 'fleur', p: 'fleurs', g: 'f', cat: 'objet' },
    { s: 'porte', p: 'portes', g: 'f', cat: 'objet' },
    { s: 'fenêtre', p: 'fenêtres', g: 'f', cat: 'objet' }
  ];

  /** Noms d'une ou plusieurs catégories. */
  function nomsDe(categories) {
    return NOMS.filter(function (n) { return categories.indexOf(n.cat) !== -1; });
  }

  /* --- Adjectifs : quatre formes, place habituelle, et les catégories de noms
     auxquelles ils peuvent s'appliquer.

     `cats` n'est pas une coquetterie : sans lui on produit « le journal calme »
     ou « les voisins longs », grammaticalement corrects et absurdes. Une question
     absurde apprend à l'élève à se méfier de l'exercice plutôt que de sa réponse.
     Catégories : personne, animal, objet, lieu, ecrit, nourriture. ------------ */
  var TOUTES_CATS = ['personne', 'animal', 'objet', 'lieu', 'ecrit', 'nourriture'];

  var ADJECTIFS = [
    { m: 'petit', f: 'petite', mp: 'petits', fp: 'petites', avant: true, cats: TOUTES_CATS },
    { m: 'grand', f: 'grande', mp: 'grands', fp: 'grandes', avant: true, cats: TOUTES_CATS },
    { m: 'joli', f: 'jolie', mp: 'jolis', fp: 'jolies', avant: true, cats: TOUTES_CATS },
    { m: 'gros', f: 'grosse', mp: 'gros', fp: 'grosses', avant: true, cats: TOUTES_CATS },
    { m: 'noir', f: 'noire', mp: 'noirs', fp: 'noires', avant: false,
      cats: ['animal', 'objet', 'lieu', 'ecrit'] },
    { m: 'blanc', f: 'blanche', mp: 'blancs', fp: 'blanches', avant: false,
      cats: ['animal', 'objet', 'lieu', 'ecrit'] },
    { m: 'vert', f: 'verte', mp: 'verts', fp: 'vertes', avant: false,
      cats: ['animal', 'objet', 'lieu', 'ecrit', 'nourriture'] },
    { m: 'bleu', f: 'bleue', mp: 'bleus', fp: 'bleues', avant: false,
      cats: ['animal', 'objet', 'lieu', 'ecrit'] },
    { m: 'long', f: 'longue', mp: 'longs', fp: 'longues', avant: false,
      cats: ['objet', 'lieu', 'ecrit'] },
    { m: 'rapide', f: 'rapide', mp: 'rapides', fp: 'rapides', avant: false,
      cats: ['personne', 'animal', 'objet'] },
    { m: 'bruyant', f: 'bruyante', mp: 'bruyants', fp: 'bruyantes', avant: false,
      cats: ['personne', 'animal', 'lieu'] },
    { m: 'silencieux', f: 'silencieuse', mp: 'silencieux', fp: 'silencieuses', avant: false,
      cats: ['personne', 'animal', 'lieu'] },
    { m: 'calme', f: 'calme', mp: 'calmes', fp: 'calmes', avant: false,
      cats: ['personne', 'animal', 'lieu'] },
    { m: 'gentil', f: 'gentille', mp: 'gentils', fp: 'gentilles', avant: false,
      cats: ['personne', 'animal'] },
    { m: 'poli', f: 'polie', mp: 'polis', fp: 'polies', avant: false,
      cats: ['personne'] },
    { m: 'heureux', f: 'heureuse', mp: 'heureux', fp: 'heureuses', avant: false,
      cats: ['personne', 'animal'] },
    { m: 'fatigué', f: 'fatiguée', mp: 'fatigués', fp: 'fatiguées', avant: false,
      cats: ['personne', 'animal'] },
    { m: 'content', f: 'contente', mp: 'contents', fp: 'contentes', avant: false,
      cats: ['personne', 'animal'] }
  ];

  /** Adjectifs qui peuvent qualifier ce nom.
      `placeApres` limite aux adjectifs placés après le nom (voir phrases.js). */
  function adjectifsPour(nom, placeApres) {
    return ADJECTIFS.filter(function (a) {
      if (placeApres && a.avant) return false;
      return a.cats.indexOf(nom.cat) !== -1;
    });
  }

  /** Forme accordée d'un adjectif. */
  function accorderAdjectif(adj, genre, nombre) {
    if (nombre === 'p') return genre === 'f' ? adj.fp : adj.mp;
    return genre === 'f' ? adj.f : adj.m;
  }

  /* --- Déterminants --------------------------------------------------- */
  var DETERMINANTS = [
    { classe: 'article défini', ms: 'le', fs: 'la', mp: 'les', fp: 'les' },
    { classe: 'article indéfini', ms: 'un', fs: 'une', mp: 'des', fp: 'des' },
    { classe: 'déterminant démonstratif', ms: 'ce', fs: 'cette', mp: 'ces', fp: 'ces' },
    { classe: 'déterminant possessif', ms: 'mon', fs: 'ma', mp: 'mes', fp: 'mes' },
    { classe: 'déterminant possessif', ms: 'son', fs: 'sa', mp: 'ses', fp: 'ses' },
    { classe: 'déterminant possessif', ms: 'notre', fs: 'notre', mp: 'nos', fp: 'nos' }
  ];

  function accorderDeterminant(det, genre, nombre) {
    if (nombre === 'p') return genre === 'f' ? det.fp : det.mp;
    return genre === 'f' ? det.fs : det.ms;
  }

  /* --- Verbes ---------------------------------------------------------
     groupe : 1, 2 ou 3
     aux    : auxiliaire des temps composés
     pp     : participe passé (forme du masculin singulier)
     Les verbes du 3e groupe portent leurs tables complètes dans conjugaison.js. */
  var VERBES = [
    // Premier groupe, radical invariable.
    { inf: 'chanter', groupe: 1, aux: 'avoir', pp: 'chanté' },
    { inf: 'danser', groupe: 1, aux: 'avoir', pp: 'dansé' },
    { inf: 'marcher', groupe: 1, aux: 'avoir', pp: 'marché' },
    { inf: 'jouer', groupe: 1, aux: 'avoir', pp: 'joué' },
    { inf: 'regarder', groupe: 1, aux: 'avoir', pp: 'regardé' },
    { inf: 'parler', groupe: 1, aux: 'avoir', pp: 'parlé' },
    { inf: 'donner', groupe: 1, aux: 'avoir', pp: 'donné' },
    { inf: 'trouver', groupe: 1, aux: 'avoir', pp: 'trouvé' },
    { inf: 'porter', groupe: 1, aux: 'avoir', pp: 'porté' },
    { inf: 'chercher', groupe: 1, aux: 'avoir', pp: 'cherché' },
    { inf: 'penser', groupe: 1, aux: 'avoir', pp: 'pensé' },
    { inf: 'sauter', groupe: 1, aux: 'avoir', pp: 'sauté' },
    { inf: 'dessiner', groupe: 1, aux: 'avoir', pp: 'dessiné' },
    { inf: 'laver', groupe: 1, aux: 'avoir', pp: 'lavé' },
    { inf: 'fermer', groupe: 1, aux: 'avoir', pp: 'fermé' },
    { inf: 'aimer', groupe: 1, aux: 'avoir', pp: 'aimé' },
    { inf: 'écouter', groupe: 1, aux: 'avoir', pp: 'écouté' },
    { inf: 'travailler', groupe: 1, aux: 'avoir', pp: 'travaillé' },
    { inf: 'préparer', groupe: 1, aux: 'avoir', pp: 'préparé' },
    { inf: 'raconter', groupe: 1, aux: 'avoir', pp: 'raconté' },
    { inf: 'grimper', groupe: 1, aux: 'avoir', pp: 'grimpé' },
    { inf: 'attraper', groupe: 1, aux: 'avoir', pp: 'attrapé' },
    // Premier groupe se conjuguant avec être : l'accord du participe est alors visible.
    { inf: 'monter', groupe: 1, aux: 'être', pp: 'monté' },
    { inf: 'rester', groupe: 1, aux: 'être', pp: 'resté' },
    { inf: 'tomber', groupe: 1, aux: 'être', pp: 'tombé' },
    { inf: 'arriver', groupe: 1, aux: 'être', pp: 'arrivé' },
    { inf: 'entrer', groupe: 1, aux: 'être', pp: 'entré' },

    /* Premier groupe à variation de radical. Le programme les demande
       explicitement ; la règle générale produirait « nous commencons »,
       « j'appelerai », « je nettoyerai ». Leurs formes sont donc écrites ici
       une à une, comme celles du troisième groupe. */
    { inf: 'commencer', groupe: 1, aux: 'avoir', pp: 'commencé', variation: '-cer', formes: {
      'présent': ['commence', 'commences', 'commence', 'commençons', 'commencez', 'commencent'],
      'imparfait': ['commençais', 'commençais', 'commençait', 'commencions', 'commenciez', 'commençaient'],
      'futur': ['commencerai', 'commenceras', 'commencera', 'commencerons', 'commencerez', 'commenceront'],
      'passé simple': ['commençai', 'commenças', 'commença', 'commençâmes', 'commençâtes', 'commencèrent']
    } },
    { inf: 'manger', groupe: 1, aux: 'avoir', pp: 'mangé', variation: '-ger', formes: {
      'présent': ['mange', 'manges', 'mange', 'mangeons', 'mangez', 'mangent'],
      'imparfait': ['mangeais', 'mangeais', 'mangeait', 'mangions', 'mangiez', 'mangeaient'],
      'futur': ['mangerai', 'mangeras', 'mangera', 'mangerons', 'mangerez', 'mangeront'],
      'passé simple': ['mangeai', 'mangeas', 'mangea', 'mangeâmes', 'mangeâtes', 'mangèrent']
    } },
    { inf: 'nettoyer', groupe: 1, aux: 'avoir', pp: 'nettoyé', variation: '-yer', formes: {
      'présent': ['nettoie', 'nettoies', 'nettoie', 'nettoyons', 'nettoyez', 'nettoient'],
      'imparfait': ['nettoyais', 'nettoyais', 'nettoyait', 'nettoyions', 'nettoyiez', 'nettoyaient'],
      'futur': ['nettoierai', 'nettoieras', 'nettoiera', 'nettoierons', 'nettoierez', 'nettoieront'],
      'passé simple': ['nettoyai', 'nettoyas', 'nettoya', 'nettoyâmes', 'nettoyâtes', 'nettoyèrent']
    } },
    { inf: 'appeler', groupe: 1, aux: 'avoir', pp: 'appelé', variation: '-eler', formes: {
      'présent': ['appelle', 'appelles', 'appelle', 'appelons', 'appelez', 'appellent'],
      'imparfait': ['appelais', 'appelais', 'appelait', 'appelions', 'appeliez', 'appelaient'],
      'futur': ['appellerai', 'appelleras', 'appellera', 'appellerons', 'appellerez', 'appelleront'],
      'passé simple': ['appelai', 'appelas', 'appela', 'appelâmes', 'appelâtes', 'appelèrent']
    } },
    { inf: 'jeter', groupe: 1, aux: 'avoir', pp: 'jeté', variation: '-eter', formes: {
      'présent': ['jette', 'jettes', 'jette', 'jetons', 'jetez', 'jettent'],
      'imparfait': ['jetais', 'jetais', 'jetait', 'jetions', 'jetiez', 'jetaient'],
      'futur': ['jetterai', 'jetteras', 'jettera', 'jetterons', 'jetterez', 'jetteront'],
      'passé simple': ['jetai', 'jetas', 'jeta', 'jetâmes', 'jetâtes', 'jetèrent']
    } },
    { inf: 'acheter', groupe: 1, aux: 'avoir', pp: 'acheté', variation: 'e muet', formes: {
      'présent': ['achète', 'achètes', 'achète', 'achetons', 'achetez', 'achètent'],
      'imparfait': ['achetais', 'achetais', 'achetait', 'achetions', 'achetiez', 'achetaient'],
      'futur': ['achèterai', 'achèteras', 'achètera', 'achèterons', 'achèterez', 'achèteront'],
      'passé simple': ['achetai', 'achetas', 'acheta', 'achetâmes', 'achetâtes', 'achetèrent']
    } },
    { inf: 'lever', groupe: 1, aux: 'avoir', pp: 'levé', variation: 'e muet', formes: {
      'présent': ['lève', 'lèves', 'lève', 'levons', 'levez', 'lèvent'],
      'imparfait': ['levais', 'levais', 'levait', 'levions', 'leviez', 'levaient'],
      'futur': ['lèverai', 'lèveras', 'lèvera', 'lèverons', 'lèverez', 'lèveront'],
      'passé simple': ['levai', 'levas', 'leva', 'levâmes', 'levâtes', 'levèrent']
    } },
    { inf: 'promener', groupe: 1, aux: 'avoir', pp: 'promené', variation: 'e muet', formes: {
      'présent': ['promène', 'promènes', 'promène', 'promenons', 'promenez', 'promènent'],
      'imparfait': ['promenais', 'promenais', 'promenait', 'promenions', 'promeniez', 'promenaient'],
      'futur': ['promènerai', 'promèneras', 'promènera', 'promènerons', 'promènerez', 'promèneront'],
      'passé simple': ['promenai', 'promenas', 'promena', 'promenâmes', 'promenâtes', 'promenèrent']
    } },

    // Deuxième groupe.
    { inf: 'finir', groupe: 2, aux: 'avoir', pp: 'fini' },
    { inf: 'grandir', groupe: 2, aux: 'avoir', pp: 'grandi' },
    { inf: 'choisir', groupe: 2, aux: 'avoir', pp: 'choisi' },
    { inf: 'réussir', groupe: 2, aux: 'avoir', pp: 'réussi' },
    { inf: 'remplir', groupe: 2, aux: 'avoir', pp: 'rempli' },
    { inf: 'obéir', groupe: 2, aux: 'avoir', pp: 'obéi' },
    { inf: 'ralentir', groupe: 2, aux: 'avoir', pp: 'ralenti' },
    { inf: 'applaudir', groupe: 2, aux: 'avoir', pp: 'applaudi' },
    { inf: 'bâtir', groupe: 2, aux: 'avoir', pp: 'bâti' },
    { inf: 'punir', groupe: 2, aux: 'avoir', pp: 'puni' },
    { inf: 'rougir', groupe: 2, aux: 'avoir', pp: 'rougi' },
    { inf: 'saisir', groupe: 2, aux: 'avoir', pp: 'saisi' },
    { inf: 'franchir', groupe: 2, aux: 'avoir', pp: 'franchi' },
    { inf: 'guérir', groupe: 2, aux: 'avoir', pp: 'guéri' },
    { inf: 'nourrir', groupe: 2, aux: 'avoir', pp: 'nourri' },
    { inf: 'réfléchir', groupe: 2, aux: 'avoir', pp: 'réfléchi' },
    { inf: 'atterrir', groupe: 2, aux: 'avoir', pp: 'atterri' },
    { inf: 'avertir', groupe: 2, aux: 'avoir', pp: 'averti' },

    // Troisième groupe : liste fermée du programme, et elle seule.
    { inf: 'faire', groupe: 3, aux: 'avoir', pp: 'fait' },
    { inf: 'aller', groupe: 3, aux: 'être', pp: 'allé' },
    { inf: 'dire', groupe: 3, aux: 'avoir', pp: 'dit' },
    { inf: 'venir', groupe: 3, aux: 'être', pp: 'venu' },
    { inf: 'pouvoir', groupe: 3, aux: 'avoir', pp: 'pu' },
    { inf: 'voir', groupe: 3, aux: 'avoir', pp: 'vu' },
    { inf: 'vouloir', groupe: 3, aux: 'avoir', pp: 'voulu' },
    { inf: 'prendre', groupe: 3, aux: 'avoir', pp: 'pris' },

    // Auxiliaires.
    { inf: 'être', groupe: 3, aux: 'avoir', pp: 'été', auxiliaire: true },
    { inf: 'avoir', groupe: 3, aux: 'avoir', pp: 'eu', auxiliaire: true }
  ];

  /* --- Prépositions et conjonctions (nouvelles au CM2) ---------------- */
  var PREPOSITIONS = ['à', 'de', 'dans', 'sur', 'sous', 'pour', 'avec', 'sans',
                      'chez', 'vers', 'par', 'derrière', 'devant', 'entre'];

  var CONJONCTIONS_COORDINATION = ['mais', 'ou', 'et', 'donc', 'or', 'ni', 'car'];
  var CONJONCTIONS_SUBORDINATION = ['que', 'quand', 'lorsque', 'comme', 'si', 'puisque', 'parce que'];

  var ADVERBES = ['souvent', 'toujours', 'jamais', 'vite', 'lentement', 'bien',
                  'mal', 'beaucoup', 'hier', 'demain', 'ici', 'là'];

  var PRONOMS_SUJETS = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles'];
  var PRONOMS_COMPLEMENTS = ['me', 'te', 'le', 'la', 'lui', 'nous', 'vous', 'les', 'leur'];

  /* --- Prénoms, pour les sujets des phrases fabriquées ---------------- */
  var PRENOMS_F = ['Léa', 'Manon', 'Julie', 'Sarah', 'Chloé', 'Camille'];
  var PRENOMS_M = ['Paul', 'Lucas', 'Hugo', 'Théo', 'Noah', 'Martin'];

  CM2.lexique = {
    noms: NOMS,
    nomsDe: nomsDe,
    adjectifs: ADJECTIFS,
    adjectifsPour: adjectifsPour,
    determinants: DETERMINANTS,
    verbes: VERBES,
    prepositions: PREPOSITIONS,
    conjonctionsCoordination: CONJONCTIONS_COORDINATION,
    conjonctionsSubordination: CONJONCTIONS_SUBORDINATION,
    adverbes: ADVERBES,
    pronomsSujets: PRONOMS_SUJETS,
    pronomsComplements: PRONOMS_COMPLEMENTS,
    prenomsF: PRENOMS_F,
    prenomsM: PRENOMS_M,
    accorderAdjectif: accorderAdjectif,
    accorderDeterminant: accorderDeterminant,
    /** Verbe du lexique par son infinitif. */
    verbe: function (inf) {
      for (var i = 0; i < VERBES.length; i++) if (VERBES[i].inf === inf) return VERBES[i];
      return null;
    }
  };
})(window.CM2 = window.CM2 || {});
