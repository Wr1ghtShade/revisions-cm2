/* Oracle de correction — le moteur.

   Question posée à chaque exercice : la réponse annoncée est-elle JUSTE ?

   verifier.js et la page tests.html ne contrôlent que la forme : pas
   d'exception, pas de NaN, reproductibilité, propositions distinctes. Rien de
   tout cela ne dit que la bonne réponse est la bonne. Or la règle qui commande
   tout le projet est qu'une question fausse est pire que pas de question.

   Le principe : relire l'énoncé, refaire le calcul par un second chemin, et
   comparer à bonne_reponse. Deux exigences tiennent l'indépendance de ce
   second chemin.

   1. Ce fichier n'utilise AUCUNE fonction de calcul de l'application : il a sa
      propre arithmétique — exacte, sur des fractions d'entiers, jamais de
      flottant —, son propre analyseur d'expressions, son propre lecteur de
      numéraux français et ses propres tables de faits.
   2. Il part du texte de l'énoncé, jamais des variables internes du
      générateur. Un générateur qui se trompe ne se contredit pas tout seul :
      c'est en refaisant le calcul depuis l'énoncé qu'on l'attrape.

   Quatre issues possibles par exercice :
     · verifie   — recalculé, d'accord avec la réponse annoncée ;
     · faux      — recalculé, en désaccord : il y a un vrai défaut ;
     · inconnu   — l'énoncé ne correspond plus au patron attendu par la règle.
                   Ce n'est pas une erreur de contenu, mais il faut corriger la
                   règle, sinon la couverture fond en silence ;
     · horsCas   — variante de ce générateur qui ne se recalcule pas (du
                   vocabulaire, par exemple).

   Les QCM sont tenus plus serré que le reste : on exige non seulement que la
   proposition retenue soit valable, mais qu'elle soit la SEULE. Deux réponses
   défendables, c'est une question fausse.

   Chargé par tests/oracle.js (en ligne de commande) et par tests.html (dans le
   navigateur). Ne fait pas partie de l'application. */
(function (racine) {
  'use strict';

  /* ================================================================== */
  /* Arithmétique exacte                                                */
  /* ================================================================== */

  function pgcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a || 1;
  }

  function R(n, d) {
    if (d === undefined) d = 1;
    if (!isFinite(n) || !isFinite(d) || d === 0) return null;
    if (d < 0) { n = -n; d = -d; }
    var g = pgcd(n, d);
    return { n: n / g, d: d / g };
  }

  function plus(a, b) { return (a && b) ? R(a.n * b.d + b.n * a.d, a.d * b.d) : null; }
  function moins(a, b) { return (a && b) ? R(a.n * b.d - b.n * a.d, a.d * b.d) : null; }
  function fois(a, b) { return (a && b) ? R(a.n * b.n, a.d * b.d) : null; }
  function divise(a, b) { return (a && b && b.n !== 0) ? R(a.n * b.d, a.d * b.n) : null; }
  function cmp(a, b) { var x = a.n * b.d, y = b.n * a.d; return x < y ? -1 : x > y ? 1 : 0; }
  function egal(a, b) { return !!a && !!b && a.n === b.n && a.d === b.d; }
  function plancher(a) { return Math.floor(a.n / a.d); }
  function estEntier(a) { return !!a && a.d === 1; }
  function nombreDe(a) { return a.n / a.d; }

  function ecrire(a) {
    if (!a) return '—';
    if (a.d === 1) return String(a.n);
    var x = a.n / a.d;
    return (Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-9)
      ? String(Math.round(x * 1e6) / 1e6) + ' (' + a.n + '/' + a.d + ')'
      : a.n + '/' + a.d;
  }

  /* ================================================================== */
  /* Lecture des nombres, des expressions et des numéraux               */
  /* ================================================================== */

  /* Les générateurs séparent les milliers par une espace insécable fine, et
     les réponses saisies peuvent en porter d'autres : on les traite toutes. */
  var ESPACES = /[ \t   ]/g;

  /** « 1 234,5 » → 2469/2. Rien d'autre qu'un nombre n'est accepté. */
  function lireNombre(t) {
    if (t === null || t === undefined) return null;
    var s = String(t).trim().replace(ESPACES, '').replace(',', '.');
    if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
    var negatif = s.charAt(0) === '-';
    if (negatif) s = s.slice(1);
    var bouts = s.split('.');
    var r;
    if (bouts.length === 1) {
      r = R(parseInt(bouts[0], 10), 1);
    } else {
      var p = Math.pow(10, bouts[1].length);
      r = R(parseInt(bouts[0], 10) * p + parseInt(bouts[1], 10), p);
    }
    return negatif ? R(-r.n, r.d) : r;
  }

  /* Un nombre peut porter des groupes de trois chiffres séparés par une
     espace : « 1 333,52 ». Le groupe n'est reconnu que s'il fait bien trois
     chiffres, sinon « 10 + 11 » se lirait comme un seul nombre. */
  var DEBUT_NOMBRE = /^\d+(?:[ \t   ]\d{3})*(?:,\d+)?/;
  var UNE_ESPACE = /[ \t   ]/;

  function decouper(t) {
    var s = String(t);
    var out = [];
    var i = 0;
    while (i < s.length) {
      var c = s.charAt(i);
      if (UNE_ESPACE.test(c)) { i++; continue; }
      if (/\d/.test(c)) {
        var m = DEBUT_NOMBRE.exec(s.slice(i));
        if (!m) return null;
        var v = lireNombre(m[0]);
        if (!v) return null;
        out.push({ t: 'nb', v: v });
        i += m[0].length;
        continue;
      }
      if (c === '+') { out.push({ t: '+' }); i++; continue; }
      if (c === '-' || c === '−') { out.push({ t: '-' }); i++; continue; }
      if (c === '*' || c === '×') { out.push({ t: '*' }); i++; continue; }
      if (c === '/' || c === '÷') { out.push({ t: '/' }); i++; continue; }
      if (c === '(') { out.push({ t: '(' }); i++; continue; }
      if (c === ')') { out.push({ t: ')' }); i++; continue; }
      return null;
    }
    return out;
  }

  /** Évalue « (10 + 11) × (7 + 2) », « 8 + 691/1000 », « 1 333,52 ÷ 8 ».
      Renvoie null si le texte n'est pas une expression complète et valide. */
  function evaluer(t) {
    var tk = decouper(t);
    if (!tk || !tk.length) return null;
    var i = 0;

    function expr() {
      var v = terme();
      while (v && i < tk.length && (tk[i].t === '+' || tk[i].t === '-')) {
        var op = tk[i++].t;
        var d = terme();
        v = op === '+' ? plus(v, d) : moins(v, d);
      }
      return v;
    }
    function terme() {
      var v = facteur();
      while (v && i < tk.length && (tk[i].t === '*' || tk[i].t === '/')) {
        var op = tk[i++].t;
        var d = facteur();
        v = op === '*' ? fois(v, d) : divise(v, d);
      }
      return v;
    }
    function facteur() {
      if (i >= tk.length) return null;
      if (tk[i].t === '-') { i++; var v = facteur(); return v ? R(-v.n, v.d) : null; }
      if (tk[i].t === '(') {
        i++;
        var e = expr();
        if (!e || i >= tk.length || tk[i].t !== ')') return null;
        i++;
        return e;
      }
      if (tk[i].t === 'nb') return tk[i++].v;
      return null;
    }

    var r = expr();
    return (r && i === tk.length) ? r : null;
  }

  /* Numéraux français en lettres → entier. Chemin volontairement inverse de
     celui de app/lettres.js, qui écrit les nombres : ici on les lit. */
  var MOTS_NOMBRES = {
    'zero': 0, 'zéro': 0, 'un': 1, 'une': 1, 'deux': 2, 'trois': 3, 'quatre': 4,
    'cinq': 5, 'six': 6, 'sept': 7, 'huit': 8, 'neuf': 9, 'dix': 10, 'onze': 11,
    'douze': 12, 'treize': 13, 'quatorze': 14, 'quinze': 15, 'seize': 16,
    'vingt': 20, 'vingts': 20, 'trente': 30, 'quarante': 40, 'cinquante': 50,
    'soixante': 60, 'cent': 100, 'cents': 100, 'mille': 1000, 'milles': 1000,
    'million': 1000000, 'millions': 1000000, 'milliard': 1000000000, 'milliards': 1000000000
  };

  function lireNumeral(texte) {
    if (texte === null || texte === undefined) return null;
    var s = String(texte).toLowerCase().trim().replace(/\.$/, '');
    // Les formes soudées d'abord, sinon « quatre-vingt » se lirait 4 puis 20.
    s = s.replace(/quatre-vingt-dix/g, ' 90 ');
    s = s.replace(/quatre-vingts?/g, ' 80 ');
    s = s.replace(/soixante-dix/g, ' 70 ');
    s = s.replace(/\bet\b/g, ' ');
    var mots = s.split(/[-\s]+/).filter(function (x) { return x.length; });
    if (!mots.length) return null;

    var total = 0, courant = 0;
    for (var i = 0; i < mots.length; i++) {
      var mot = mots[i];
      var v = /^\d+$/.test(mot) ? parseInt(mot, 10)
            : Object.prototype.hasOwnProperty.call(MOTS_NOMBRES, mot) ? MOTS_NOMBRES[mot]
            : null;
      if (v === null) return null;
      if (v === 100) courant = (courant || 1) * 100;
      else if (v >= 1000) { total += (courant || 1) * v; courant = 0; }
      else courant += v;
    }
    return total + courant;
  }

  /** « 3 h 50 », « 45 min », « 1 h 30 min » → un nombre de minutes. */
  function lireDuree(t) {
    var s = String(t === null || t === undefined ? '' : t)
      .replace(ESPACES, ' ').trim().toLowerCase();
    var h = /(\d+)\s*h/.exec(s);
    var apresH = /h\s*(\d+)/.exec(s);
    var min = /(\d+)\s*min/.exec(s);
    if (h) {
      var total = parseInt(h[1], 10) * 60;
      if (apresH) total += parseInt(apresH[1], 10);
      else if (min) total += parseInt(min[1], 10);
      return total;
    }
    if (min) return parseInt(min[1], 10);
    var seul = /^(\d+)$/.exec(s);
    return seul ? parseInt(seul[1], 10) : null;
  }

  function normTexte(s) {
    return String(s === null || s === undefined ? '' : s)
      .toLowerCase()
      .replace(/[’ʼ´`]/g, '\'')
      .replace(ESPACES, ' ')
      .replace(/\s+/g, ' ')
      .replace(/\.$/, '')
      .trim();
  }

  /* ================================================================== */
  /* Tables de faits, écrites ici indépendamment de l'application       */
  /* ================================================================== */

  var RANGS = {
    'unités': 1, 'dizaines': 10, 'centaines': 100, 'milliers': 1000,
    'dizaines de mille': 10000, 'centaines de mille': 100000,
    'millions': 1000000, 'dizaines de millions': 10000000,
    'centaines de millions': 100000000
  };

  /* Valeur d'un rang décimal, en fraction d'unité. */
  var RANGS_DECIMAUX = {
    'unités': R(1, 1), 'dixièmes': R(1, 10),
    'centièmes': R(1, 100), 'millièmes': R(1, 1000)
  };

  /* Combien de ces parts dans une unité : un quart, c'est 4 parts. */
  var PARTS = {
    'entier': 1, 'entiers': 1, 'demi': 2, 'demis': 2, 'tiers': 3, 'quart': 4, 'quarts': 4,
    'cinquième': 5, 'cinquièmes': 5, 'sixième': 6, 'sixièmes': 6,
    'huitième': 8, 'huitièmes': 8, 'dixième': 10, 'dixièmes': 10,
    'centième': 100, 'centièmes': 100, 'millième': 1000, 'millièmes': 1000
  };

  /* Aires : combien de cm² dans une unité. */
  var AIRES = { 'cm²': 1, 'dm²': 100, 'm²': 10000 };

  /* Faces, arêtes et sommets des solides du programme. Faits de géométrie
     élémentaire, recopiés ici pour pouvoir contredire le générateur. */
  var SOLIDES = {
    'le cube': { faces: 6, aretes: 12, sommets: 8 },
    'le pavé droit': { faces: 6, aretes: 12, sommets: 8 },
    'la pyramide à base carrée': { faces: 5, aretes: 8, sommets: 5 },
    'la pyramide à base triangulaire': { faces: 4, aretes: 6, sommets: 4 },
    'le prisme droit à base triangulaire': { faces: 5, aretes: 9, sommets: 6 }
  };

  /* Événements de probabilité, réécrits comme prédicats. */
  var EVENEMENTS = [
    { libelle: 'un nombre pair', test: function (n) { return n % 2 === 0; } },
    { libelle: 'un nombre impair', test: function (n) { return n % 2 === 1; } },
    { libelle: 'un nombre plus grand que', seuil: true,
      test: function (n, s) { return n > s; } },
    { libelle: 'un nombre plus petit que', seuil: true,
      test: function (n, s) { return n < s; } },
    { libelle: 'un multiple de', seuil: true,
      test: function (n, s) { return n % s === 0; } }
  ];

  /* ================================================================== */
  /* Petites aides pour écrire les règles                               */
  /* ================================================================== */

  function inconnu(raison) {
    var e = new Error(raison);
    e.inconnu = true;
    throw e;
  }

  /** Applique un patron à l'énoncé. Si le patron ne mord pas, l'exercice est
      « non reconnu » — jamais passé sous silence. */
  function motif(texte, re) {
    var r = re.exec(texte);
    if (!r) inconnu('patron : ' + re.source.slice(0, 46));
    return r;
  }

  function n(texte) {
    var v = lireNombre(texte);
    if (!v) inconnu('nombre illisible : « ' + texte + ' »');
    return v;
  }

  function ent(texte) {
    var v = n(texte);
    if (!estEntier(v)) inconnu('entier attendu : « ' + texte + ' »');
    return v.n;
  }

  function dansTable(mot, table) {
    var m = normTexte(mot);
    if (!Object.prototype.hasOwnProperty.call(table, m)) {
      inconnu('inconnu de la table : « ' + m + ' »');
    }
    return table[m];
  }

  /** Découpe « 8 679 926 ; 8 680 431 », ou « 400 et 500 », en valeurs. */
  function suite(texte) {
    return String(texte).split(/\s*(?:;|\bet\b)\s*/)
      .map(function (x) { return x.trim(); })
      .filter(function (x) { return x.length && x !== '…' && x !== '...'; })
      .map(function (x) {
        var v = evaluer(x);
        if (!v) inconnu('terme illisible : « ' + x + ' »');
        return v;
      });
  }

  /** Un QCM n'est juste que si la proposition retenue satisfait le critère et
      qu'elle est la seule à le satisfaire. */
  function seule(c, critere) {
    var valables = [];
    c.props.forEach(function (p, i) { if (critere(p)) valables.push(i); });
    if (valables.length === 1 && valables[0] === c.ex.bonne_reponse) return { ok: true };
    return {
      ok: false,
      attendu: 'une seule proposition valable, à la place ' + c.ex.bonne_reponse,
      obtenu: valables.length === 0 ? 'aucune proposition ne convient'
            : 'places valables : ' + valables.join(', ')
    };
  }

  /* ================================================================== */
  /* Les règles, générateur par générateur                              */
  /* ================================================================== */

  var REGLES = {};
  var HORS_PORTEE = {};

  function regle(id, fn) { REGLES[id] = fn; }
  function horsPortee(id, raison) { HORS_PORTEE[id] = raison; }

  /* --- Nombres entiers ------------------------------------------------ */

  regle('ent.chiffre_position', function (c) {
    var m = motif(c.e, /Dans le nombre (.+?), quel est le chiffre des (.+?) \?/);
    var p = dansTable(m[2], RANGS);
    return { valeur: R(Math.floor(ent(m[1]) / p) % 10, 1) };
  });

  regle('ent.nombre_de_rang', function (c) {
    var m = motif(c.e, /Dans le nombre (.+?), combien y a-t-il de (.+?) en tout \?/);
    var p = dansTable(m[2], RANGS);
    return { valeur: R(Math.floor(ent(m[1]) / p), 1) };
  });

  regle('ent.lettres_vers_chiffres', function (c) {
    var m = motif(c.e, /en chiffres ?: (.+?)\.?$/);
    var v = lireNumeral(m[1]);
    if (v === null) inconnu('numéral illisible : « ' + m[1] + ' »');
    return { valeur: R(v, 1) };
  });

  regle('ent.chiffres_vers_lettres', function (c) {
    var m = motif(c.e, /Comment s'écrit (.+?) en toutes lettres/);
    var attendu = ent(m[1]);
    var lu = lireNumeral(c.rep);
    return {
      ok: lu === attendu,
      attendu: String(attendu),
      obtenu: lu === null ? 'numéral illisible : « ' + c.rep + ' »' : String(lu)
    };
  });

  regle('ent.decomposition', function (c) {
    var m = motif(c.e, /décomposition de (.+?) \?/);
    var cible = n(m[1]);
    return seule(c, function (p) { return egal(evaluer(p), cible); });
  });

  function comparaison(c) {
    var m = motif(c.e, /signe < ou > ?: (.+?) … (.+?)\s*$/);
    var a = evaluer(m[1]), b = evaluer(m[2]);
    if (!a || !b) inconnu('termes illisibles');
    if (cmp(a, b) === 0) inconnu('les deux termes sont égaux : ni < ni >');
    return { texte: cmp(a, b) < 0 ? '<' : '>' };
  }
  regle('ent.comparer', comparaison);
  regle('dec.comparer', comparaison);
  regle('fra.comparer', comparaison);
  regle('dec.comparer_fractions_decimales', comparaison);

  function rangement(c) {
    var m = motif(c.e, /ordre (croissant|décroissant) ?: (.+?)\s*$/);
    var valeurs = suite(m[2]);
    var triees = valeurs.slice().sort(function (a, b) {
      return m[1] === 'croissant' ? cmp(a, b) : cmp(b, a);
    });
    return { valeurs: triees };
  }
  regle('ent.ordonner', rangement);
  regle('dec.ordonner', rangement);
  regle('dec.ordonner_fractions_decimales', rangement);

  regle('ent.encadrer', function (c) {
    var m = motif(c.e, /Entre quel\S* (.+?) consécut\S* se trouve (.+?) \?/);
    var p = dansTable(m[1], RANGS);
    var v = ent(m[2]);
    var bas = Math.floor(v / p) * p;
    return { valeurs: [R(bas, 1), R(bas + p, 1)] };
  });

  regle('ent.est_diviseur', function (c) {
    var m = motif(c.e, /Le nombre (\d+) est-il un diviseur de ([\d ]+) \?/);
    return { texte: ent(m[2]) % ent(m[1]) === 0 ? 'oui' : 'non' };
  });

  regle('ent.tous_diviseurs', function (c) {
    var m = motif(c.e, /tous les diviseurs de ([\d ]+) \?/);
    var v = ent(m[1]);
    var attendus = [];
    for (var i = 1; i <= v; i++) if (v % i === 0) attendus.push(i);
    var clef = attendus.join(';');
    return seule(c, function (p) {
      var liste;
      try { liste = suite(p); } catch (e) { return false; }
      return liste.every(estEntier) &&
             liste.map(function (x) { return x.n; }).join(';') === clef;
    });
  });

  regle('ent.diviseur_commun', function (c) {
    var m = motif(c.e, /diviseur commun à (\d+) et à (\d+) \?/);
    var a = ent(m[1]), b = ent(m[2]);
    return seule(c, function (p) {
      var v = lireNombre(p);
      return estEntier(v) && v.n > 1 && a % v.n === 0 && b % v.n === 0;
    });
  });

  regle('ent.multiple_commun', function (c) {
    var m = motif(c.e, /multiple commun à (\d+) et à (\d+) \?/);
    var a = ent(m[1]), b = ent(m[2]);
    return seule(c, function (p) {
      var v = lireNombre(p);
      return estEntier(v) && v.n > 0 && v.n % a === 0 && v.n % b === 0;
    });
  });

  regle('ent.diviseur_parmi', function (c) {
    var m = motif(c.e, /diviseur de ([\d ]+) \?/);
    var v = ent(m[1]);
    return seule(c, function (p) {
      var d = lireNombre(p);
      return estEntier(d) && d.n > 1 && d.n < v && v % d.n === 0;
    });
  });

  regle('ent.suivant_precedent', function (c) {
    var m = motif(c.e, /vient juste (après|avant) (.+?) \?/);
    var v = ent(m[2]);
    return { valeur: R(m[1] === 'après' ? v + 1 : v - 1, 1) };
  });

  /* --- Décimaux et fractions : même valeur, autre écriture ------------ */

  /* Toutes ces questions demandent de réécrire un nombre sans le changer : la
     vérification est la même, l'énoncé et la réponse doivent valoir
     exactement la même chose. */
  function memeValeur(re) {
    return function (c) {
      var m = motif(c.e, re);
      var v = evaluer(m[1]);
      if (!v) inconnu('valeur de départ illisible : « ' + m[1] + ' »');
      return { valeur: v };
    };
  }

  regle('dec.fraction_vers_virgule', memeValeur(/Écris (.+?) avec une virgule/));
  regle('dec.virgule_vers_fraction', memeValeur(/fraction décimale est égale à (.+?) \?/));
  regle('dec.fraction_decimale_mixte', memeValeur(/Écris (.+?) sous la forme/));
  regle('dec.decomposer_fraction_decimale', memeValeur(/Décompose (.+?) en un entier/));
  regle('fra.vers_mixte', memeValeur(/Écris (.+?) sous la forme/));
  regle('fra.depuis_mixte', memeValeur(/Écris (.+?) sous la forme/));
  regle('cm.fraction_vers_decimal', memeValeur(/Écris (.+?) sous forme décimale/));

  regle('fra.equivalente', function (c) {
    var m = motif(c.e, /fraction est égale à (.+?) \?/);
    var v = evaluer(m[1]);
    if (!v) inconnu('fraction illisible');
    return seule(c, function (p) { return egal(evaluer(p), v); });
  });

  regle('dec.lire_fraction_decimale', function (c) {
    var m = motif(c.e, /en chiffres ?: (.+?) (dixièmes|centièmes|millièmes)\.?$/);
    var num = lireNumeral(m[1]);
    if (num === null) inconnu('numéral illisible : « ' + m[1] + ' »');
    return { valeur: R(num, PARTS[normTexte(m[2])]) };
  });

  regle('dec.chiffre_rang', function (c) {
    var m = motif(c.e, /Dans (.+?), quel est le chiffre des (.+?) \?/);
    var v = n(m[1]);
    var part = dansTable(m[2], RANGS_DECIMAUX);
    return { valeur: R(plancher(divise(v, part)) % 10, 1) };
  });

  regle('dec.relations_unites', function (c) {
    var m = motif(c.e, /Combien y a-t-il de (\S+) dans (\d+) (\S+) \?/);
    var vers = dansTable(m[1], RANGS_DECIMAUX);
    var de = dansTable(m[3], RANGS_DECIMAUX);
    return { valeur: divise(fois(R(ent(m[2]), 1), de), vers) };
  });

  regle('dec.partie_entiere', function (c) {
    var m = motif(c.e, /partie entière de (.+?) \?/);
    return { valeur: R(plancher(n(m[1])), 1) };
  });

  regle('dec.arrondi_entier', function (c) {
    var m = motif(c.e, /arrondi à l'entier de (.+?) \?/);
    var v = n(m[1]);
    var bas = plancher(v);
    var reste = moins(v, R(bas, 1));
    return { valeur: R(cmp(reste, R(1, 2)) >= 0 ? bas + 1 : bas, 1) };
  });

  regle('dec.intercaler', function (c) {
    var m = motif(c.e, /compris entre (.+?) et (.+?) \?/);
    var a = n(m[1]), b = n(m[2]);
    if (cmp(a, b) > 0) { var t = a; a = b; b = t; }
    return seule(c, function (p) {
      var v = lireNombre(p);
      return !!v && cmp(a, v) < 0 && cmp(v, b) < 0;
    });
  });

  regle('fra.encadrer', function (c) {
    var m = motif(c.e, /Entre quels nombres entiers consécutifs se trouve (.+?) \?/);
    var v = evaluer(m[1]);
    if (!v) inconnu('fraction illisible');
    if (estEntier(v)) inconnu('la fraction vaut un entier : pas d\'encadrement strict');
    var bas = plancher(v);
    return { valeurs: [R(bas, 1), R(bas + 1, 1)] };
  });

  regle('fra.fraction_de_quantite', function (c) {
    var m = motif(c.e, /a (\d+) \S+\..*?prend (\d+)\/(\d+)\./);
    return { valeur: fois(R(ent(m[1]), 1), R(ent(m[2]), ent(m[3]))) };
  });

  /* --- Tout ce qui est écrit comme un calcul -------------------------- */

  /* « Calcule », « Calcule de tête : », « Pose et effectue : » — l'énoncé
     porte l'expression, on l'évalue. C'est le cœur de l'oracle. */
  function calcul(c) {
    var m = motif(c.e, /^(?:Calcule de tête|Calcule|Pose et effectue)\s*:?\s*(.+?)\s*\.$/);
    var v = evaluer(m[1]);
    if (!v) inconnu('expression illisible : « ' + m[1] + ' »');
    return { valeur: v };
  }

  ['cm.entier_plus_decimal', 'cm.multiplier_puissance_dix', 'cm.diviser_puissance_dix',
   'cm.somme_decimaux', 'cm.ajouter_presque_dizaine', 'cm.multiplier_dizaines',
   'cm.distributivite', 'cm.diviser_par_4_ou_8', 'cm.multiplier_par_5_ou_50',
   'ope.parentheses', 'ope.multiplication_decimale', 'ope.division_dividende_entier',
   'ope.division_dividende_decimal', 'fra.additionner', 'fra.soustraire',
   'fra.produit_entier'].forEach(function (id) { regle(id, calcul); });

  regle('cm.faits_usuels', function (c) {
    if (/^Calcule/.test(c.e)) return calcul(c);
    var complement = /Combien faut-il ajouter à (.+?) pour obtenir (.+?) \?/.exec(c.e);
    if (complement) return { valeur: moins(n(complement[2]), n(complement[1])) };
    var m = motif(c.e, /double de (.+?) \?/);
    return { valeur: fois(n(m[1]), R(2, 1)) };
  });

  function moitie(c) {
    var m = motif(c.e, /moitié de (.+?) \?/);
    return { valeur: divise(n(m[1]), R(2, 1)) };
  }
  regle('cm.moitie_impair', moitie);
  regle('cm.moitie_decimal', moitie);

  regle('cm.double_decimal', function (c) {
    var m = motif(c.e, /double de (.+?) \?/);
    return { valeur: fois(n(m[1]), R(2, 1)) };
  });

  regle('cm.relations_fractions', function (c) {
    var m = motif(c.e, /Combien de (\S+) font un (\S+) \?/);
    var petites = dansTable(m[1], PARTS);          // 4 pour les quarts
    var grande = dansTable(m[2], PARTS);           // 2 pour un demi
    return { valeur: R(petites, grande) };
  });

  regle('ope.ordre_de_grandeur', function (c) {
    var m = motif(c.e, /ordre de grandeur de (.+?) \?/);
    var bouts = m[1].split(/\s*[×x]\s*/);
    if (bouts.length !== 2) inconnu('produit attendu : « ' + m[1] + ' »');
    var arrondis = bouts.map(function (b) {
      var v = ent(b);
      var p = Math.pow(10, String(v).length - 1);
      return Math.round(v / p) * p;
    });
    return { valeur: R(arrondis[0] * arrondis[1], 1) };
  });

  regle('ope.division_euclidienne', function (c) {
    var m = motif(c.e, /division de ([\d ]+) par (\d+), quel est le (reste|quotient) \?/);
    var a = ent(m[1]), b = ent(m[2]);
    return { valeur: R(m[3] === 'reste' ? a % b : Math.floor(a / b), 1) };
  });

  /* --- Grandeurs et mesures ------------------------------------------- */

  regle('mes.aire_rectangle', function (c) {
    var carre = /Un carré a des côtés de (\d+)/.exec(c.e);
    if (carre) {
      var cote = ent(carre[1]);
      return { valeur: R(cote * cote, 1) };
    }
    var m = motif(c.e, /mesure (\d+) \S+ de longueur et (\d+) \S+ de largeur/);
    return { valeur: R(ent(m[1]) * ent(m[2]), 1) };
  });

  regle('mes.cote_depuis_aire', function (c) {
    var m = motif(c.e, /aire de ([\d ]+) \S+²\..*?est de ([\d ]+) \S+\./);
    return { valeur: divise(R(ent(m[1]), 1), R(ent(m[2]), 1)) };
  });

  regle('mes.conversion_aire', function (c) {
    var m = motif(c.e, /Combien de (\S+²) y a-t-il dans ([\d ]+) (\S+²) \?/);
    var vers = dansTable(m[1], AIRES);
    var de = dansTable(m[3], AIRES);
    return { valeur: divise(R(ent(m[2]) * de, 1), R(vers, 1)) };
  });

  regle('mes.comparer_aires', function (c) {
    var m = motif(c.e, /rectangle A mesure (\d+) \S+ sur (\d+) \S+\..*?rectangle B mesure (\d+) \S+ sur (\d+) \S+\./);
    var a = ent(m[1]) * ent(m[2]);
    var b = ent(m[3]) * ent(m[4]);
    if (a === b) inconnu('les deux aires sont égales : la question n\'a pas de réponse');
    return { texte: a > b ? 'le rectangle a' : 'le rectangle b' };
  });

  regle('mes.aire_figure_composee', function (c) {
    var accole = /rectangle de (\d+) \S+ sur (\d+) \S+, auquel on a accolé un carré de (\d+)/.exec(c.e);
    if (accole) {
      return { valeur: R(ent(accole[1]) * ent(accole[2]) + ent(accole[3]) * ent(accole[3]), 1) };
    }
    var m = motif(c.e, /découpe un carré de (\d+) \S+ de côté dans un rectangle de (\d+) \S+ sur (\d+)/);
    return { valeur: R(ent(m[2]) * ent(m[3]) - ent(m[1]) * ent(m[1]), 1) };
  });

  regle('mes.duree_ecoulee', function (c) {
    var m = motif(c.e, /commence à (\d+) h (\d+) et se termine à (\d+) h (\d+)/);
    var debut = ent(m[1]) * 60 + ent(m[2]);
    var fin = ent(m[3]) * 60 + ent(m[4]);
    if (fin <= debut) inconnu('la fin n\'est pas après le début');
    return { minutes: fin - debut };
  });

  regle('mes.instant_final', function (c) {
    var m = motif(c.e, /commence à (\d+) h (\d+) et dure (.+?)\. À quelle heure/);
    var debut = ent(m[1]) * 60 + ent(m[2]);
    var duree = lireDuree(m[3]);
    if (duree === null) inconnu('durée illisible : « ' + m[3] + ' »');
    return { minutes: (debut + duree) % (24 * 60) };
  });

  regle('mes.conversion_duree', function (c) {
    var enMinutes = /Combien de minutes y a-t-il dans (\d+) h (\d+) min \?/.exec(c.e);
    if (enMinutes) return { valeur: R(ent(enMinutes[1]) * 60 + ent(enMinutes[2]), 1) };
    var enSecondes = /Combien de secondes y a-t-il dans (\d+) minutes \?/.exec(c.e);
    if (enSecondes) return { valeur: R(ent(enSecondes[1]) * 60, 1) };
    var m = motif(c.e, /Convertis ([\d ]+) minutes en heures et minutes/);
    return { minutes: ent(m[1]) };
  });

  horsPortee('mes.lexique_angles', 'vocabulaire : rien à recalculer');

  /* --- Algèbre -------------------------------------------------------- */

  regle('alg.egalite_a_trous', function (c) {
    var e = c.e.replace(/^.*points \? /, '');
    var somme = /^([\d ]+) \+ … = ([\d ]+)$/.exec(e);
    if (somme) return { valeur: moins(n(somme[2]), n(somme[1])) };
    var diff = /^… − ([\d ]+) = ([\d ]+)$/.exec(e);
    if (diff) return { valeur: plus(n(diff[2]), n(diff[1])) };
    var prod = /^([\d ]+) × … = ([\d ]+)$/.exec(e);
    if (prod) return { valeur: divise(n(prod[2]), n(prod[1])) };
    var quot = motif(e, /^… ÷ ([\d ]+) = ([\d ]+)$/);
    return { valeur: fois(n(quot[2]), n(quot[1])) };
  });

  regle('alg.nombre_mystere', function (c) {
    // (x + a) × f = arrivée
    var deux = /ajoute (\d+), puis je multiplie le résultat par (\d+) ?: j'obtiens ([\d ]+)/.exec(c.e);
    if (deux) return { valeur: moins(divise(n(deux[3]), n(deux[2])), n(deux[1])) };
    // x × f + a = arrivée
    var m = motif(c.e, /multiplie par (\d+), puis j'ajoute (\d+) ?: j'obtiens ([\d ]+)/);
    return { valeur: divise(moins(n(m[3]), n(m[2])), n(m[1])) };
  });

  regle('alg.programme_de_calcul', function (c) {
    var m = motif(c.e, /au nombre (\d+) ?: (.+?)\. Quel résultat/);
    var v = n(m[1]);
    m[2].split(/, puis /).forEach(function (etape) {
      var p = /^(ajoute|retranche|multiplie par|divise par) ([\d ]+)$/.exec(etape.trim());
      if (!p) inconnu('étape inconnue : « ' + etape + ' »');
      var k = n(p[2]);
      if (p[1] === 'ajoute') v = plus(v, k);
      else if (p[1] === 'retranche') v = moins(v, k);
      else if (p[1] === 'multiplie par') v = fois(v, k);
      else v = divise(v, k);
    });
    return { valeur: v };
  });

  regle('alg.regle_de_suite', function (c) {
    var m = motif(c.e, /suite de nombres ?: (.+?) … Quelle est la règle/);
    var s = suite(m[1]).map(nombreDe);
    var pas = s[1] - s[0];
    var additive = s.every(function (x, i) { return i === 0 || x - s[i - 1] === pas; });
    if (additive) {
      return { texte: pas > 0 ? 'on ajoute ' + pas : 'on retranche ' + Math.abs(pas) };
    }
    var q = s[1] / s[0];
    var geometrique = s.every(function (x, i) { return i === 0 || x === s[i - 1] * q; });
    if (!geometrique) inconnu('suite ni additive ni multiplicative');
    return { texte: 'on multiplie par ' + q };
  });

  regle('alg.continuer_suite', function (c) {
    var m = motif(c.e, /vient après \? (.+?)\s*;\s*…$/);
    var s = suite(m[1]).map(nombreDe);
    var pas = s[1] - s[0];
    if (!s.every(function (x, i) { return i === 0 || x - s[i - 1] === pas; })) {
      inconnu('la suite donnée n\'a pas un pas constant');
    }
    return { valeur: R(s[s.length - 1] + pas, 1) };
  });

  function motifAffine(c) {
    var m = motif(c.e, /il faut (\d+) \S+ au motif 1, (\d+) au motif 2 et (\d+) au motif 3\. Combien en faut-il au motif (\d+) \?/);
    var a = ent(m[1]), b = ent(m[2]), d = ent(m[3]), cible = ent(m[4]);
    if (b - a !== d - b) inconnu('les trois premiers motifs n\'ont pas un pas constant');
    return { valeur: R(a + (cible - 1) * (b - a), 1) };
  }
  regle('alg.motif_etape_suivante', motifAffine);
  regle('alg.motif_etape_lointaine', motifAffine);

  /* --- Problèmes ------------------------------------------------------ */

  regle('pb.additif', function (c) {
    var m = motif(c.e, /a ([\d ]+) \S+ .+?\. On lui en offre ([\d ]+), puis .+? en donne ([\d ]+) à un ami/);
    return { valeur: moins(plus(n(m[1]), n(m[2])), n(m[3])) };
  });

  regle('pb.parties_tout', function (c) {
    var tout = /reçoit (\d+) \S+ de (\d+) \S+ chacun/.exec(c.e);
    if (tout) return { valeur: fois(n(tout[1]), n(tout[2])) };
    var m = motif(c.e, /range ([\d ]+) (\S+) dans des \S+ de (\d+) \2/);
    return { valeur: divise(n(m[1]), n(m[3])) };
  });

  regle('pb.mixte', function (c) {
    var m = motif(c.e, /achète (\d+) cahiers à (\d+) € l'un et un dictionnaire à (\d+) €\. .+? paie avec (\d+) €/);
    var depense = plus(fois(n(m[1]), n(m[2])), n(m[3]));
    return { valeur: moins(n(m[4]), depense) };
  });

  regle('pb.comparaison_multiplicative', function (c) {
    var facteur = /a (\d+) billes\. .+? en a (\d+) fois plus/.exec(c.e);
    if (facteur) return { valeur: fois(n(facteur[1]), n(facteur[2])) };
    var m = motif(c.e, /a (\d+) billes et .+? en a (\d+)\. Combien de fois plus/);
    return { valeur: divise(n(m[2]), n(m[1])) };
  });

  regle('pb.denombrement', function (c) {
    var m = motif(c.e, /Il y a (\d+) .+? et (\d+) /);
    var attendu = fois(n(m[1]), n(m[2]));
    return seule(c, function (p) { return egal(lireNombre(p), attendu); });
  });

  regle('pb.optimisation', function (c) {
    var m = motif(c.e, /ranger ([\d ]+) \S+ dans des \S+ qui en contiennent (\d+) au maximum/);
    return { valeur: R(Math.ceil(ent(m[1]) / ent(m[2])), 1) };
  });

  regle('pb.rendre_la_monnaie', function (c) {
    var m = motif(c.e, /On rend (\d+) € avec des billets de 20 € et de 10 €, et des pièces de 5 €, 2 € et 1 €/);
    var reste = ent(m[1]);
    var compte = 0;
    [20, 10, 5, 2, 1].forEach(function (v) {
      compte += Math.floor(reste / v);
      reste = reste % v;
    });
    return { valeur: R(compte, 1) };
  });

  /* --- Probabilités et proportionnalité ------------------------------- */

  /** Combien d'issues ? L'énoncé le dit toujours, sous une forme ou une autre. */
  function issues(e) {
    var numerotees = /de 1 à (\d+)/.exec(e);
    if (numerotees) return ent(numerotees[1]);
    var faces = /à (\d+) faces/.exec(e);
    if (faces) return ent(faces[1]);
    var secteurs = /en (\d+) secteurs/.exec(e);
    if (secteurs) return ent(secteurs[1]);
    if (/une pièce/.test(e)) return 2;
    inconnu('nombre d\'issues introuvable');
  }

  function compter(total, test) {
    var k = 0;
    for (var i = 1; i <= total; i++) if (test(i)) k++;
    return k;
  }

  /** Combien d'issues satisfont l'événement décrit ? */
  function favorables(e, total) {
    var libelle = motif(e, /(?:donnent|d'obtenir) (.+?)\s*\?/)[1].trim();
    for (var i = 0; i < EVENEMENTS.length; i++) {
      var ev = EVENEMENTS[i];
      if (!ev.seuil) {
        if (libelle === ev.libelle) {
          return compter(total, function (x) { return ev.test(x); });
        }
        continue;
      }
      var m = new RegExp('^' + ev.libelle + ' (\\d+)$').exec(libelle);
      if (m) {
        var seuil = parseInt(m[1], 10);
        return compter(total, function (x) { return ev.test(x, seuil); });
      }
    }
    inconnu('événement inconnu : « ' + libelle + ' »');
  }

  regle('prb.issues_possibles', function (c) {
    return { valeur: R(issues(c.e), 1) };
  });

  regle('prb.issues_evenement', function (c) {
    var total = issues(c.e);
    return { valeur: R(favorables(c.e, total), 1) };
  });

  regle('prb.chances_sur', function (c) {
    var total = issues(c.e);
    var k = favorables(c.e, total);
    return { texte: k + ' chance' + (k > 1 ? 's' : '') + ' sur ' + total };
  });

  regle('prb.comparer', function (c) {
    var m = motif(c.e, /sac A contient (\d+) jetons, dont (\d+) \S+\. Le sac B contient (\d+) jetons, dont (\d+) /);
    var a = R(ent(m[2]), ent(m[1]));
    var b = R(ent(m[4]), ent(m[3]));
    if (cmp(a, b) === 0) inconnu('les deux sacs donnent la même chance');
    return { texte: cmp(a, b) > 0 ? 'le sac a' : 'le sac b' };
  });

  regle('prb.independance', function (c) {
    // Le passé ne change rien : la probabilité reste 1 chance sur le nombre d'issues.
    return { texte: '1 chance sur ' + issues(c.e) };
  });

  regle('prb.deux_etapes', function (c) {
    motif(c.e, /, puis .+ Combien y a-t-il de résultats possibles en tout \?/);
    var nombres = c.e.match(/\d+/g);
    if (!nombres || nombres.length !== 2) inconnu('deux tailles attendues');
    return { valeur: R(parseInt(nombres[0], 10) * parseInt(nombres[1], 10), 1) };
  });

  horsPortee('prp.identifier', 'jugement sur une situation : rien à recalculer');

  function proportion(c) {
    var deuxCas = /^(\d+) (\S+) coûtent (\d+) € et (\d+) \2 coûtent (\d+) €\. Combien coûtent (\d+) \2 \?/.exec(c.e);
    if (deuxCas) {
      var u1 = R(ent(deuxCas[3]), ent(deuxCas[1]));
      var u2 = R(ent(deuxCas[5]), ent(deuxCas[4]));
      if (!egal(u1, u2)) inconnu('les deux cas donnés ne sont pas proportionnels entre eux');
      return { valeur: fois(u1, R(ent(deuxCas[6]), 1)) };
    }
    var m = motif(c.e, /^(\d+) (\S+) coûtent (\d+) €\. Combien coûtent (\d+) \2 \?/);
    return { valeur: fois(R(ent(m[3]), ent(m[1])), R(ent(m[4]), 1)) };
  }
  regle('prp.linearite_multiplicative', proportion);
  regle('prp.retour_a_l_unite', proportion);
  regle('prp.linearite_additive', proportion);

  /* --- Géométrie ------------------------------------------------------ */

  function mesureSeule(c, attendu) {
    return seule(c, function (p) {
      return egal(lireNombre(String(p).replace(/[^\d,. ]/g, '')), attendu);
    });
  }

  regle('geo.cercle_disque', function (c) {
    var diametre = /rayon de (\d+) \S+\. Combien mesure son diamètre/.exec(c.e);
    if (diametre) return mesureSeule(c, R(2 * ent(diametre[1]), 1));
    var rayon = /diamètre de (\d+) \S+\. Combien mesure son rayon/.exec(c.e);
    if (rayon) return mesureSeule(c, R(ent(rayon[1]), 2));
    return null;                                   // les autres cas sont du vocabulaire
  });

  regle('sol.decrire', function (c) {
    var m = motif(c.e, /Combien (.+?) a-t-(?:il|elle) de (faces|arêtes|sommets) \?/);
    var solide = SOLIDES[normTexte(m[1])];
    if (!solide) inconnu('solide inconnu : « ' + m[1] + ' »');
    var quoi = normTexte(m[2]) === 'arêtes' ? 'aretes' : normTexte(m[2]);
    var attendu = solide[quoi];
    if (attendu === undefined) inconnu('propriété inconnue : « ' + m[2] + ' »');
    return seule(c, function (p) { return egal(lireNombre(p), R(attendu, 1)); });
  });

  /* Assemblages de cubes : les trois dimensions sont dans l'énoncé, le compte
     se refait donc entièrement. */
  regle('pb.assemblage_cubes', function (c) {
    var dim = /(\d+) cubes? de long, (\d+) cubes? de large et (\d+) cubes? de haut/.exec(c.e);
    if (!dim) inconnu('dimensions illisibles');
    var L = ent(dim[1]), l = ent(dim[2]), h = ent(dim[3]);

    if (/Combien de cubes faut-il en tout/.test(c.e)) return { valeur: R(L * l * h, 1) };
    if (/Combien de cubes touchent la table/.test(c.e)) return { valeur: R(L * l, 1) };

    var posees = /\. (\d+) couches? (?:sont déjà posées|est déjà posée)/.exec(c.e);
    if (posees && /Combien de cubes manque-t-il/.test(c.e)) {
      var faites = ent(posees[1]);
      if (faites >= h) inconnu('il y aurait déjà plus de couches que la hauteur demandée');
      return { valeur: R((h - faites) * L * l, 1) };
    }
    inconnu('question sur les cubes non reconnue');
  });

  /* --- Ce qui reste hors de portée d'un oracle d'énoncé --------------- */

  ['dd.lire_entier', 'dd.lire_decimal', 'dd.lire_fraction'].forEach(function (id) {
    horsPortee(id, 'la donnée est dans la figure, pas dans l\'énoncé');
  });
  ['hor.lire_heure', 'hor.duree_entre_horloges'].forEach(function (id) {
    horsPortee(id, 'la donnée est dans l\'horloge dessinée');
  });
  ['don.lire_tableau', 'don.probleme_tableau', 'don.lire_diagramme'].forEach(function (id) {
    horsPortee(id, 'la donnée est dans le tableau ou le diagramme');
  });
  ['geo.symetrie_quadrillage', 'sol.patron_cube', 'sol.patron_pave', 'ang.comparer',
   'dep.suivre_instructions'].forEach(function (id) {
    horsPortee(id, 'réponse lue sur une figure');
  });
  ['geo.vocabulaire_lignes', 'geo.codes', 'geo.perpendiculaire_parallele',
   'geo.reconnaitre_figure', 'geo.proprietes_figures', 'mes.notation_angles',
   'geo.programme_construction'].forEach(function (id) {
    horsPortee(id, 'vocabulaire ou propriété : contrôlé par relecture, pas par calcul');
  });

  /* ================================================================== */
  /* Confrontation                                                      */
  /* ================================================================== */

  /* Les indications de forme (« Réponds sous la forme… ») ne font pas partie
     de la question : on les retire avant de lire l'énoncé. On ramène aussi
     toutes les espaces à l'espace ordinaire, pour que les patrons n'aient pas
     à connaître l'espace insécable fine des milliers. */
  function nettoyer(texte) {
    return String(texte)
      .replace(/[   ]/g, ' ')
      .replace(/\s*\(Réponds[^)]*\)\s*$/, '')
      .trim();
  }

  function reponseDonnee(ex) {
    return ex.type === 'qcm' ? String(ex.propositions[ex.bonne_reponse]) : String(ex.bonne_reponse);
  }

  function confronter(attendu, c) {
    if (Object.prototype.hasOwnProperty.call(attendu, 'ok')) return attendu;

    if (attendu.valeur) {
      var obtenu = evaluer(c.rep);
      return {
        ok: egal(attendu.valeur, obtenu),
        attendu: ecrire(attendu.valeur),
        obtenu: obtenu ? ecrire(obtenu) : 'illisible : « ' + c.rep + ' »'
      };
    }
    if (attendu.valeurs) {
      var lus;
      try { lus = suite(c.rep); } catch (e) { lus = null; }
      var memeTaille = lus && lus.length === attendu.valeurs.length;
      return {
        ok: !!memeTaille && attendu.valeurs.every(function (v, i) { return egal(v, lus[i]); }),
        attendu: attendu.valeurs.map(ecrire).join(' ; '),
        obtenu: lus ? lus.map(ecrire).join(' ; ') : 'illisible : « ' + c.rep + ' »'
      };
    }
    if (attendu.minutes !== undefined) {
      var lu = lireDuree(c.rep);
      return {
        ok: lu === attendu.minutes,
        attendu: Math.floor(attendu.minutes / 60) + ' h ' + (attendu.minutes % 60) +
                 ' (' + attendu.minutes + ' min)',
        obtenu: lu === null ? 'illisible : « ' + c.rep + ' »' : lu + ' min'
      };
    }
    if (attendu.texte !== undefined) {
      return {
        ok: normTexte(attendu.texte) === normTexte(c.rep),
        attendu: attendu.texte,
        obtenu: c.rep
      };
    }
    inconnu('règle sans verdict');
  }

  /** Examine un exercice produit. Renvoie
        { etat: 'verifie' | 'faux' | 'inconnu' | 'horsCas' | 'sansRegle',
          attendu, obtenu, raison, enonce, reponse }. */
  function examiner(id, ex) {
    if (!REGLES[id]) {
      return { etat: 'sansRegle', raison: HORS_PORTEE[id] || null };
    }
    var c = {
      e: nettoyer(ex.enonce),
      rep: nettoyer(reponseDonnee(ex)),
      props: ex.propositions || [],
      ex: ex
    };
    try {
      var attendu = REGLES[id](c);
      if (attendu === null) return { etat: 'horsCas', enonce: c.e };
      var verdict = confronter(attendu, c);
      return {
        etat: verdict.ok ? 'verifie' : 'faux',
        attendu: verdict.attendu,
        obtenu: verdict.obtenu,
        enonce: c.e,
        reponse: c.rep
      };
    } catch (e) {
      if (e.inconnu) return { etat: 'inconnu', raison: e.message, enonce: c.e };
      throw e;
    }
  }

  racine.ORACLE = {
    examiner: examiner,
    aUneRegle: function (id) { return !!REGLES[id]; },
    raisonHorsPortee: function (id) { return HORS_PORTEE[id] || null; },
    nombreDeRegles: function () { return Object.keys(REGLES).length; },
    // Exposés pour les tests de l'oracle lui-même.
    lireNombre: lireNombre,
    lireNumeral: lireNumeral,
    lireDuree: lireDuree,
    evaluer: evaluer,
    ecrire: ecrire
  };
})(typeof window !== 'undefined' ? window : this);
