/* Les cahiers : un profil par enfant, conservé d'une visite à l'autre.

   Ce fichier ne s'occupe que du rangement : ouvrir un cahier, le relire,
   l'écrire, l'exporter. Les règles de révision — quand une notion doit revenir,
   quand un exercice raté est considéré comme su — sont dans app/progression.js.

   Ce qu'on garde d'un exercice raté, c'est (generateur_id, graine) — jamais
   l'énoncé. L'exercice est donc reconstruit à l'identique le jour où on le
   repropose, ce qui permet de revoir exactement la question sur laquelle on a
   buté, et pas une question « du même genre ».

   Stockage : localStorage, sous une seule clé. Rien ne sort de l'ordinateur.
   Tous les accès passent par try/catch : ouverte depuis le disque en navigation
   privée, la page doit continuer à fonctionner, simplement sans mémoire. */
(function (CM2) {
  'use strict';

  var CLE = 'cm2.cahiers.v1';
  var MAX_SEANCES = 40;

  /* Taille au-delà de laquelle un fichier de restauration n'est pas un cahier.
     Un cahier réel pèse quelques dizaines de kilo-octets au plus : ses listes
     sont toutes bornées. Au-delà, c'est un autre fichier, ou un fichier
     abîmé — et un cahier trop gros pour localStorage se dirait « restauré »
     sans l'être, puis ferait perdre en silence tout ce qui suit. */
  var TAILLE_MAX_FICHIER = 2 * 1024 * 1024;

  /* Au bout de combien de séances non sauvegardées on le rappelle. Cinq, c'est
     à peu près une semaine de travail : assez pour que la perte fasse mal,
     assez rare pour que le rappel ne devienne pas du décor. */
  var SEANCES_AVANT_RAPPEL = 5;

  /* Réglages de confort de lecture. Ils vivent dans le cahier, donc ils suivent
     l'enfant : deux enfants sur le même ordinateur n'ont pas les mêmes besoins. */
  function confortNeuf() { return { grand: false, aere: false }; }

  /* Mascottes proposées à la création d'un cahier. L'emoji retenu est rangé
     tel quel dans le cahier : en ajouter de nouvelles ne touche à aucun cahier
     déjà créé. La liste n'est pas partagée en catégories — chaque enfant prend
     celle qui lui plaît. */
  var AVATARS = ['🦊', '🐼', '🦉', '🐬', '🦁', '🐨', '🦄', '🐢', '🐧', '🦋', '🐝', '🌻',
                 '🦖', '🐉', '🐺', '🦈', '🚀', '⚽'];

  /* Le nom sert à l'étiquette lue par un lecteur d'écran : « mascotte :
     dragon » vaut mieux que « mascotte 14 ». */
  var NOMS_AVATARS = {
    '🦊': 'renard', '🐼': 'panda', '🦉': 'chouette', '🐬': 'dauphin', '🦁': 'lion',
    '🐨': 'koala', '🦄': 'licorne', '🐢': 'tortue', '🐧': 'manchot', '🦋': 'papillon',
    '🐝': 'abeille', '🌻': 'tournesol', '🦖': 'dinosaure', '🐉': 'dragon', '🐺': 'loup',
    '🦈': 'requin', '🚀': 'fusée', '⚽': 'ballon de foot'
  };

  var disponible = true;
  var cache = null;          // sert aussi de mémoire de secours si localStorage est refusé
  var ouvert = null;

  /* --- Dates ----------------------------------------------------------- */

  function deuxChiffres(n) { return n < 10 ? '0' + n : String(n); }

  function enTexte(d) {
    return d.getFullYear() + '-' + deuxChiffres(d.getMonth() + 1) + '-' + deuxChiffres(d.getDate());
  }

  function aujourdhui() { return enTexte(new Date()); }

  /** Date au format AAAA-MM-JJ, décalée de `jours`. */
  function dans(jours) {
    var d = new Date();
    d.setDate(d.getDate() + jours);
    return enTexte(d);
  }

  function joursDecart(a, b) {
    return Math.round((new Date(b) - new Date(a)) / 86400000);
  }

  /* --- Lecture et écriture --------------------------------------------- */

  /* Les cahiers sont rangés par nom dans un dictionnaire sans prototype. Avec
     un objet ordinaire, un enfant qui se serait appelé « __proto__ » ou
     « constructor » tombait sur Object.prototype : son cahier existait sans
     avoir été créé, polluait tous les objets de la page et n'était jamais
     enregistré. Ici, n'importe quel nom est une clé comme une autre. */
  function sansPrototype(objet) {
    var d = Object.create(null);
    if (objet && typeof objet === 'object') {
      Object.keys(objet).forEach(function (k) { d[k] = objet[k]; });
    }
    return d;
  }

  function vide() { return { version: 1, dernier: null, cahiers: sansPrototype(null) }; }

  function charger() {
    if (cache) return cache;
    try {
      var brut = window.localStorage.getItem(CLE);
      cache = brut ? JSON.parse(brut) : vide();
      if (!cache || typeof cache !== 'object' || !cache.cahiers) cache = vide();
      cache.cahiers = sansPrototype(cache.cahiers);
    } catch (e) {
      disponible = false;
      cache = vide();
    }
    return cache;
  }

  /** Écrit la mémoire dans localStorage. Renvoie vrai si c'est fait. */
  function sauver() {
    if (!cache) return false;
    try {
      window.localStorage.setItem(CLE, JSON.stringify(cache));
      return true;
    } catch (e) {
      // Refus de principe (navigation privée, stockage interdit) ou simple
      // manque de place ? Dans le premier cas, la session continue en mémoire
      // et l'accueil le dit ; dans le second, la mémoire fonctionne encore et
      // c'est à l'appelant de prévenir que cette écriture-là n'a pas eu lieu.
      try {
        window.localStorage.setItem(CLE + '.essai', '1');
        window.localStorage.removeItem(CLE + '.essai');
      } catch (e2) {
        disponible = false;
      }
      return false;
    }
  }

  function nouveauCahier(nom, avatar) {
    return {
      nom: nom,
      avatar: avatar,
      cree: aujourdhui(),
      derniereVisite: aujourdhui(),
      jours: [aujourdhui()],
      total: { questions: 0, reussites: 0 },
      notions: {},          // generateur_id -> { vus, reussites, dernier, boite, prochaine }
      aRevoir: [],          // { id, graine, titre, matiere, boite, prochaine }
      seances: [],          // { date, matiere, questions, reussites }
      sauvegarde: null,     // date du dernier enregistrement dans un fichier
      seancesDepuisSauvegarde: 0,
      confort: confortNeuf(),
      // Sujets que le programme laisse au choix du professeur, et que ce cahier
      // déclare avoir étudiés. Vide par défaut : tant que personne ne l'a dit,
      // on ne suppose pas qu'un sujet a été vu en classe.
      sujetsEtudies: {}
    };
  }

  function estObjet(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }

  /** Complète un cahier écrit par une version antérieure de l'application.
      Un champ qui n'a pas la forme attendue est remis à neuf plutôt que de
      faire planter la page : ce qui est ici vient de la mémoire du navigateur,
      écrite par l'application elle-même. Un fichier venu d'ailleurs est, lui,
      passé au crible de `defauts()` avant d'arriver ici. */
  function normaliser(c) {
    if (!estObjet(c.total)) c.total = { questions: 0, reussites: 0 };
    if (!estObjet(c.notions)) c.notions = {};
    if (!Array.isArray(c.aRevoir)) c.aRevoir = [];
    if (!Array.isArray(c.seances)) c.seances = [];
    if (!Array.isArray(c.jours) || !c.jours.length) c.jours = [c.derniereVisite || aujourdhui()];
    if (c.sauvegarde === undefined) c.sauvegarde = null;
    // Un cahier d'avant le rappel n'a jamais été compté : on repart de ses
    // séances connues, ce qui le fait rappeler tout de suite s'il en a.
    if (typeof c.seancesDepuisSauvegarde !== 'number') {
      c.seancesDepuisSauvegarde = c.seances.length;
    }
    if (!estObjet(c.confort)) c.confort = confortNeuf();
    if (!estObjet(c.sujetsEtudies)) c.sujetsEtudies = {};

    // Les boîtes de révision n'existaient pas avant : tout ce qui est déjà là
    // est considéré comme à revoir aujourd'hui, ce qui est le choix prudent.
    Object.keys(c.notions).forEach(function (id) {
      var n = c.notions[id];
      if (!estObjet(n)) { n = c.notions[id] = { vus: 0, reussites: 0, dernier: null }; }
      if (typeof n.boite !== 'number') n.boite = 0;
      if (!n.prochaine) n.prochaine = aujourdhui();
    });
    c.aRevoir = c.aRevoir.filter(estObjet);
    c.aRevoir.forEach(function (e) {
      if (typeof e.boite !== 'number') e.boite = 0;
      if (!e.prochaine) e.prochaine = aujourdhui();
    });
    return c;
  }

  /** Ce qui, dans un cahier lu depuis un fichier, n'a pas la forme d'un cahier.
      Renvoie la liste des champs fautifs — vide si tout va bien.

      On ne répare pas un fichier : on le refuse. Remettre à neuf la liste des
      exercices à revoir d'un cahier qu'on croit restaurer, c'est perdre des
      mois de travail en annonçant le contraire. */
  function defauts(c) {
    var f = [];
    if (!estObjet(c)) return ['cahier'];
    if (typeof c.nom !== 'string' || !c.nom.trim()) f.push('nom');
    if (c.avatar !== undefined && typeof c.avatar !== 'string') f.push('avatar');
    if (c.total !== undefined && !estObjet(c.total)) f.push('total');
    if (c.notions !== undefined && !estObjet(c.notions)) f.push('notions');
    if (c.aRevoir !== undefined && !Array.isArray(c.aRevoir)) f.push('aRevoir');
    if (c.seances !== undefined && !Array.isArray(c.seances)) f.push('seances');
    if (c.jours !== undefined && !Array.isArray(c.jours)) f.push('jours');
    if (c.confort !== undefined && !estObjet(c.confort)) f.push('confort');
    if (c.sujetsEtudies !== undefined && !estObjet(c.sujetsEtudies)) f.push('sujetsEtudies');
    if (c.seanceEnCours !== undefined && c.seanceEnCours !== null) {
      var s = c.seanceEnCours;
      // Une série se rejoue à partir de ses graines : chaque entrée doit en
      // porter une, et nommer un générateur par une chaîne.
      var serieOk = estObjet(s) && Array.isArray(s.serie) && s.serie.every(function (e) {
        return estObjet(e) && typeof e.id === 'string' &&
               (e.graine === undefined || typeof e.graine === 'number');
      });
      if (!serieOk) f.push('seanceEnCours');
    }
    return f;
  }

  var P = {};

  P.avatars = AVATARS;
  P.nomAvatar = function (emoji) {
    return Object.prototype.hasOwnProperty.call(NOMS_AVATARS, emoji) ? NOMS_AVATARS[emoji] : 'mascotte';
  };
  P.aujourdhui = aujourdhui;
  P.dans = dans;
  P.joursDecart = joursDecart;

  P.memoireDisponible = function () { charger(); return disponible; };

  P.liste = function () {
    var d = charger();
    return Object.keys(d.cahiers).map(function (nom) {
      var c = d.cahiers[nom];
      return {
        nom: c.nom,
        avatar: c.avatar,
        questions: (c.total && c.total.questions) || 0,
        reussites: (c.total && c.total.reussites) || 0,
        derniereVisite: c.derniereVisite
      };
    }).sort(function (a, b) {
      return a.derniereVisite < b.derniereVisite ? 1 : -1;
    });
  };

  P.dernier = function () { return charger().dernier; };

  P.existe = function (nom) {
    return Object.prototype.hasOwnProperty.call(charger().cahiers, nom);
  };

  /** Crée le cahier s'il n'existe pas, puis l'ouvre. */
  P.ouvrir = function (nom, avatar) {
    var d = charger();
    if (!d.cahiers[nom]) d.cahiers[nom] = nouveauCahier(nom, avatar || AVATARS[0]);

    var c = normaliser(d.cahiers[nom]);
    var jour = aujourdhui();
    if (c.jours[c.jours.length - 1] !== jour) c.jours.push(jour);
    if (c.jours.length > 400) c.jours = c.jours.slice(-400);
    c.derniereVisite = jour;
    if (avatar) c.avatar = avatar;

    d.dernier = nom;
    ouvert = c;
    sauver();
    return c;
  };

  P.actuel = function () { return ouvert; };
  P.fermer = function () { ouvert = null; };

  /* --- Lire un cahier sans l'ouvrir --------------------------------------
     La vue enseignant lit plusieurs cahiers à la suite. Consulter celui d'un
     enfant ne doit ni changer le cahier ouvert, ni inscrire une visite dans
     le sien : c'est de la lecture, pas une séance. */

  P.cahierDe = function (nom) {
    var d = charger();
    return d.cahiers[nom] ? normaliser(d.cahiers[nom]) : null;
  };

  /** Tous les cahiers, du plus récemment visité au plus ancien. */
  P.tousLesCahiers = function () {
    var d = charger();
    return Object.keys(d.cahiers)
      .map(function (nom) { return normaliser(d.cahiers[nom]); })
      .sort(function (a, b) {
        return a.derniereVisite < b.derniereVisite ? 1
             : a.derniereVisite > b.derniereVisite ? -1
             : (a.nom < b.nom ? -1 : 1);
      });
  };

  /** À appeler après toute modification directe du cahier ouvert. */
  P.enregistrer = sauver;

  P.supprimer = function (nom) {
    var d = charger();
    delete d.cahiers[nom];
    if (d.dernier === nom) d.dernier = null;
    if (ouvert && ouvert.nom === nom) ouvert = null;
    sauver();
  };

  /* --- Séance en cours --------------------------------------------------
     Une série interrompue (rafraîchissement de la page, onglet fermé) doit
     pouvoir reprendre où elle en était. On garde donc l'état de la série dans
     le cahier lui-même : les questions n'y figurent pas, seulement leurs
     graines, comme partout ailleurs. */

  P.enregistrerSeance = function (seance) {
    if (!ouvert) return;
    ouvert.seanceEnCours = seance;
    sauver();
  };

  P.seanceEnCours = function () {
    return (ouvert && ouvert.seanceEnCours) ? ouvert.seanceEnCours : null;
  };

  P.oublierSeance = function () {
    if (!ouvert) return;
    delete ouvert.seanceEnCours;
    sauver();
  };

  P.terminerSeance = function (matiere, questions, reussites) {
    if (!ouvert) return;
    ouvert.seances.push({
      date: aujourdhui(), matiere: matiere,
      questions: questions, reussites: reussites
    });
    if (ouvert.seances.length > MAX_SEANCES) ouvert.seances.shift();
    ouvert.seancesDepuisSauvegarde = (ouvert.seancesDepuisSauvegarde || 0) + 1;
    sauver();
  };

  /* --- Rappel de sauvegarde ---------------------------------------------
     localStorage est de la mémoire de navigateur : un nettoyage d'historique,
     un changement d'ordinateur, une navigation privée, et des mois de travail
     ont disparu. Le fichier de sauvegarde existe depuis la version 1.2 ; ce
     qui manquait, c'est de penser à s'en servir avant la perte. */

  /** À appeler quand le cahier vient d'être écrit dans un fichier. */
  P.marquerSauvegarde = function () {
    if (!ouvert) return;
    ouvert.sauvegarde = aujourdhui();
    ouvert.seancesDepuisSauvegarde = 0;
    sauver();
  };

  /** Faut-il rappeler la sauvegarde, et pourquoi ?
      { besoin, seances, jamais, depuis } — `depuis` est la date de la dernière
      sauvegarde, nulle si le cahier n'a jamais été mis à l'abri. */
  P.rappelSauvegarde = function () {
    if (!ouvert) return { besoin: false, seances: 0, jamais: true, depuis: null };
    var seances = ouvert.seancesDepuisSauvegarde || 0;
    return {
      besoin: seances >= SEANCES_AVANT_RAPPEL,
      seances: seances,
      jamais: !ouvert.sauvegarde,
      depuis: ouvert.sauvegarde || null
    };
  };

  P.seancesAvantRappel = SEANCES_AVANT_RAPPEL;

  /* --- Sujets laissés au choix du professeur -----------------------------
     Le programme d'histoire propose quatre sujets d'étude sur l'âge industriel
     et précise que le professeur en choisit deux. L'application ne peut pas
     savoir lesquels : elle ne les propose donc pas tant que le cahier ne les a
     pas déclarés étudiés. Interroger sur ce qui n'a pas été vu en classe
     n'apprend rien — cela fabrique un échec sans objet. */

  P.sujetEtudie = function (id, cahier) {
    var c = cahier || ouvert;
    return !!(c && c.sujetsEtudies && c.sujetsEtudies[id]);
  };

  /** Bascule un sujet optionnel et renvoie son nouvel état. */
  P.basculerSujet = function (id) {
    if (!ouvert) return false;
    if (!ouvert.sujetsEtudies) ouvert.sujetsEtudies = {};
    if (ouvert.sujetsEtudies[id]) delete ouvert.sujetsEtudies[id];
    else ouvert.sujetsEtudies[id] = true;
    sauver();
    return !!ouvert.sujetsEtudies[id];
  };

  /* --- Confort de lecture ------------------------------------------------ */

  P.confort = function () {
    return ouvert ? ouvert.confort : confortNeuf();
  };

  /** Bascule un réglage de confort et renvoie sa nouvelle valeur. */
  P.basculerConfort = function (cle) {
    if (!ouvert) return false;
    if (!ouvert.confort) ouvert.confort = confortNeuf();
    if (!Object.prototype.hasOwnProperty.call(confortNeuf(), cle)) {
      throw new Error('profil : réglage de confort inconnu « ' + cle + ' »');
    }
    ouvert.confort[cle] = !ouvert.confort[cle];
    sauver();
    return ouvert.confort[cle];
  };

  /* --- Indicateurs simples ---------------------------------------------- */

  P.serie = function () { return P.serieDe(ouvert); };

  /** Nombre de jours consécutifs de révision d'un cahier, aujourd'hui compris. */
  P.serieDe = function (cahier) {
    if (!cahier || !cahier.jours || !cahier.jours.length) return 0;
    var jours = cahier.jours.slice().sort();
    var dernier = jours[jours.length - 1];
    if (joursDecart(dernier, aujourdhui()) > 1) return 0;

    var compte = 1;
    for (var i = jours.length - 1; i > 0; i--) {
      if (joursDecart(jours[i - 1], jours[i]) === 1) compte++;
      else break;
    }
    return compte;
  };

  P.taux = function () {
    if (!ouvert || !ouvert.total.questions) return null;
    return Math.round(100 * ouvert.total.reussites / ouvert.total.questions);
  };

  /* --- Sauvegarde dans un fichier ---------------------------------------
     localStorage ne survit pas à un nettoyage du navigateur, et encore moins à
     un changement d'ordinateur. Un cahier représente des mois de travail : il
     doit pouvoir être mis à l'abri, et relu ailleurs. */

  P.exporter = function () {
    if (!ouvert) return null;
    return JSON.stringify({
      format: 'cahier-revisions-cm2',
      version: 1,
      // Version de l'application qui a écrit ce fichier : utile le jour où on
      // relit un cahier exporté il y a longtemps.
      application: (CM2.version && CM2.version.numero) || null,
      exporte_le: aujourdhui(),
      cahier: ouvert
    }, null, 1);
  };

  P.nomDeFichier = function () {
    if (!ouvert) return 'cahier.json';
    var propre = ouvert.nom.replace(/[^0-9A-Za-zÀ-ÿ-]+/g, '-');
    return 'cahier-' + propre + '-' + aujourdhui() + '.json';
  };

  /** Relit un fichier exporté. Renvoie { ok, nom, existe, message }.
      `remplacer` autorise l'écrasement d'un cahier portant le même nom.

      Le fichier est la seule chose que l'application lise sans l'avoir écrite
      elle-même : il est contrôlé avant d'entrer, et le résultat n'est annoncé
      qu'une fois réellement en mémoire du navigateur. */
  P.importer = function (texte, remplacer) {
    texte = String(texte);
    if (texte.length > TAILLE_MAX_FICHIER) {
      return { ok: false, message: 'Ce fichier est bien trop gros pour être un cahier.' };
    }

    var paquet;
    try {
      paquet = JSON.parse(texte);
    } catch (e) {
      return { ok: false, message: 'Ce fichier est illisible : ce n\'est pas un cahier.' };
    }
    if (!estObjet(paquet) || paquet.format !== 'cahier-revisions-cm2' ||
        !estObjet(paquet.cahier) || !paquet.cahier.nom) {
      return { ok: false, message: 'Ce fichier n\'est pas un cahier de révisions CM2.' };
    }

    var fautes = defauts(paquet.cahier);
    if (fautes.length) {
      return { ok: false, message: 'Ce fichier est abîmé : la partie « ' + fautes[0] +
                                   ' » du cahier n\'a pas la forme attendue.' };
    }

    var d = charger();
    var nom = paquet.cahier.nom.trim();
    var ancien = d.cahiers[nom];
    if (ancien && !remplacer) {
      return { ok: false, existe: true, nom: nom,
               message: 'Il y a déjà un cahier au nom de ' + nom + '.' };
    }

    d.cahiers[nom] = normaliser(paquet.cahier);
    d.cahiers[nom].nom = nom;
    if (!sauver()) {
      // Rien n'a été écrit : on rend la mémoire telle qu'elle était, pour que
      // l'écran et le navigateur disent la même chose.
      if (ancien) d.cahiers[nom] = ancien; else delete d.cahiers[nom];
      return { ok: false, message: disponible
        ? 'Le navigateur n\'a pas pu enregistrer ce cahier : il manque de place.'
        : 'Le navigateur refuse d\'enregistrer : ce cahier ne survivrait pas à la fermeture de la page.' };
    }
    return { ok: true, nom: nom };
  };

  P.TAILLE_MAX_FICHIER = TAILLE_MAX_FICHIER;

  CM2.profil = P;
})(window.CM2 = window.CM2 || {});
