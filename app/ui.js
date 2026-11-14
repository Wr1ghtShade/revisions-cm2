/* Interface de révision.

   Aucune dépendance, aucun appel réseau : la page fonctionne ouverte directement
   depuis le disque, hors connexion.

   Ce que l'écran retient d'un exercice, c'est (generateur_id, graine) — jamais
   l'énoncé. Un exercice raté peut ainsi être resservi à l'identique plus tard,
   et c'est exactement ce que fait la série « Revoir mes erreurs ». */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var P = CM2.profil;
  var Prog = CM2.progression;

  var BRAVOS = ['Bravo !', 'Parfait !', 'Excellent !', 'Tu assures !', 'Exact !',
                'Très bien !', 'Pile poil !', 'Impeccable !'];
  var CONSOLATIONS = ['Pas tout à fait.', 'Presque !', 'Ce n\'était pas ça.',
                      'Raté pour cette fois.', 'On va la retenir, celle-là.'];

  /* Le titre du tableau pendant une série. Les matières viennent de
     app/matieres.js ; « erreurs » n'en est pas une — c'est la série de reprise
     — et reste donc ici. */
  function nomMatiere(id) {
    if (id === 'erreurs') return 'Tes erreurs à revoir';
    var m = CM2.matieres.get(id);
    return m ? m.nom : id;
  }

  var etat = {
    serie: [],          // [{ id, graine }]
    matiere: 'tout',
    index: 0,
    exercice: null,
    repondu: false,
    reussites: 0,
    rates: [],          // titres ratés de la séance
    nombre: 10,
    avatarChoisi: null,
    eleveDetaille: null,   // nom de l'enfant ouvert dans la vue enseignant
    ficheMatiere: 'mathematiques',
    ficheNombre: 20,
    ficheGraine: null   // gardée pour réimprimer la même fiche à l'identique
  };

  function $(id) { return document.getElementById(id); }

  function montrer(ecran) {
    ['cahiers', 'bureau', 'seance', 'bilan', 'progres', 'fiche', 'classe'].forEach(function (e) {
      $('ecran-' + e).hidden = (e !== ecran);
    });
    $('tableau-marelle').hidden = (ecran !== 'seance');

    // Les cahiers restent à portée de main sur le pupitre, sauf pendant une
    // question — où ils ne seraient qu'une occasion de se tromper de clic.
    var avecBascule = (ecran === 'bureau' || ecran === 'bilan') && !!P.actuel();
    $('bascule').hidden = !avecBascule;
    if (avecBascule) dessinerBascule();

    // Le retour à l'accueil disparaît là où il n'a pas de sens — on y est déjà
    // — et pendant une question : au même titre que les cahiers de la bascule,
    // ce serait une occasion de quitter une série par mégarde. Depuis une
    // séance, « Arrêter » ramène au bureau, où le bouton réapparaît.
    $('retour-cahiers').hidden = (ecran === 'cahiers' || ecran === 'seance');

    window.scrollTo(0, 0);
  }

  function ecrireTableau(titre, sousTitre) {
    $('tableau-titre').textContent = titre;
    $('tableau-sous-titre').textContent = sousTitre;
  }

  function auHasard(liste) { return liste[Math.floor(Math.random() * liste.length)]; }

  /* ================================================== écran « cahiers » === */

  function dessinerCahiers() {
    // Aucun cahier n'est ouvert sur cet écran : les réglages de lecture du
    // cahier précédent ne doivent pas rester collés à la page.
    appliquerConfort();
    var cahiers = P.liste();
    $('sans-memoire').hidden = P.memoireDisponible();
    $('bloc-cahiers-existants').hidden = !cahiers.length;

    var zone = $('liste-cahiers');
    zone.innerHTML = '';
    cahiers.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'cahier';
      var taux = c.questions ? Math.round(100 * c.reussites / c.questions) + ' % de réussite'
                             : 'cahier tout neuf';
      b.innerHTML = '<span class="avatar"></span><span class="texte">' +
                    '<span class="nom"></span><span class="stat"></span></span>';
      b.querySelector('.avatar').textContent = c.avatar;
      b.querySelector('.nom').textContent = c.nom;
      b.querySelector('.stat').textContent = taux;
      b.addEventListener('click', function () { ouvrirCahier(c.nom); });
      zone.appendChild(b);
    });

    var av = $('avatars');
    if (!av.children.length) {
      P.avatars.forEach(function (emoji, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.textContent = emoji;
        b.setAttribute('aria-label', 'mascotte : ' + P.nomAvatar(emoji));
        b.title = P.nomAvatar(emoji);
        b.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
        if (i === 0) etat.avatarChoisi = emoji;
        b.addEventListener('click', function () {
          etat.avatarChoisi = emoji;
          Array.prototype.forEach.call(av.children, function (x) {
            x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
          });
        });
        av.appendChild(b);
      });
    }

    ecrireTableau('Le cahier de révisions', 'CM2 — année 2026-2027');
    montrer('cahiers');
  }

  function creerCahier() {
    var nom = $('nom-nouveau').value.trim();
    if (!nom) { $('nom-nouveau').focus(); return; }
    ouvrirCahier(nom, etat.avatarChoisi);
  }

  function ouvrirCahier(nom, avatar) {
    P.ouvrir(nom, avatar);
    // Les réglages de lecture sont ceux du cahier ouvert : changer d'enfant
    // change la façon dont la page s'affiche.
    appliquerConfort();
    // On arrive toujours sur le bureau : c'est là que la série en pause, s'il y
    // en a une, est proposée. Retomber sans prévenir au milieu d'une question
    // serait déroutant quand on vient de changer de cahier.
    dessinerBureau();
  }

  /* =================================================== écran « bureau » === */

  /** La rangée de cahiers en haut du bureau : un clic suffit pour passer d'un
      enfant à l'autre, sans repasser par l'écran d'accueil. */
  function dessinerBascule() {
    var courant = P.actuel();
    var zone = $('bascule');
    zone.innerHTML = '';

    P.liste().forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'jeton-cahier';
      b.innerHTML = '<span class="avatar"></span><span class="nom"></span>';
      b.querySelector('.avatar').textContent = c.avatar;
      b.querySelector('.nom').textContent = c.nom;

      if (c.nom === courant.nom) {
        b.setAttribute('aria-current', 'true');
        b.disabled = true;
        b.setAttribute('aria-label', 'Cahier de ' + c.nom + ' (ouvert)');
      } else {
        b.setAttribute('aria-label', 'Ouvrir le cahier de ' + c.nom);
        b.addEventListener('click', function () { ouvrirCahier(c.nom); });
      }
      zone.appendChild(b);
    });

    var nouveau = document.createElement('button');
    nouveau.type = 'button';
    nouveau.className = 'jeton-nouveau';
    nouveau.textContent = '＋ Nouveau cahier';
    nouveau.addEventListener('click', function () {
      P.fermer();
      dessinerCahiers();
      $('nom-nouveau').value = '';
      $('nom-nouveau').focus();
    });
    zone.appendChild(nouveau);
  }

  function dessinerBureau() {
    var c = P.actuel();
    // Formulation sans accord : on ne connaît que le prénom saisi.
    ecrireTableau('Bonjour ' + c.nom + ' ' + c.avatar, 'On attaque une série de questions ?');

    $('stat-questions').textContent = c.total.questions;
    var taux = P.taux();
    $('stat-taux').textContent = taux === null ? '–' : taux + ' %';

    var serie = P.serie();
    $('stat-serie').textContent = serie;
    $('stat-serie-mot').textContent = serie > 1 ? 'jours de suite' : 'jour de suite';

    var fragiles = Prog.notionsFragiles(5);
    $('bloc-fragiles').hidden = !fragiles.length;
    var liste = $('liste-fragiles');
    liste.innerHTML = '';
    fragiles.forEach(function (n) {
      var li = document.createElement('li');
      li.textContent = n.titre + ' ';
      var petit = document.createElement('span');
      petit.className = 'taux';
      petit.textContent = '(' + n.reussites + ' réussites sur ' + n.vus + ')';
      li.appendChild(petit);
      liste.appendChild(li);
    });

    // Seuls les exercices dont la date de révision est arrivée sont proposés.
    // Les autres sont en train d'être mémorisés : les ressortir trop tôt
    // n'apprendrait rien, et la révision espacée n'aurait plus de sens.
    var echus = Prog.aReviser();
    // C'est la rubrique entière qui s'efface, pas seulement le bouton : sinon
    // le titre « Revenir sur tes erreurs » resterait seul, sans rien dessous.
    var bouton = $('revoir-erreurs');
    $('bloc-erreurs').hidden = !echus.length;
    bouton.hidden = !echus.length;
    bouton.textContent = 'Revoir mes erreurs (' + echus.length + ')';

    var attente = Prog.enAttente();
    var jours = Prog.prochaineEcheance();
    $('bloc-attente').hidden = !attente.length;
    if (attente.length) {
      $('texte-attente').textContent = attente.length +
        (attente.length > 1 ? ' exercices sont' : ' exercice est') + ' en cours de mémorisation. ' +
        (jours === 0 ? 'Le prochain revient aujourd’hui.'
                     : jours === 1 ? 'Le prochain revient demain.'
                                   : 'Le prochain revient dans ' + jours + ' jours.');
    }

    message(null);
    afficherRappelSauvegarde();
    appliquerConfort();
    dessinerSujetsOptionnels();

    // Une série mise en pause attend sagement son tour, dans ce cahier-ci.
    var enCours = P.seanceEnCours();
    // Une série sans questions n'a rien à reprendre : on ne la propose pas.
    if (enCours && !(Array.isArray(enCours.serie) && enCours.serie.length)) enCours = null;
    $('bloc-reprendre').hidden = !enCours;
    if (enCours) {
      var question = Math.min(enCours.index + (enCours.repondu ? 2 : 1), enCours.serie.length);
      $('reprendre-serie').textContent = '▶ Reprendre ma série (question ' + question +
        ' sur ' + enCours.serie.length + ')';
    }

    montrer('bureau');
  }

  /** Le rappel de sauvegarde, sur le bureau.

      Il ne bloque rien et ne se répète pas dans la séance : il attend au
      bureau, avec le bouton qui le fait disparaître juste à côté. Il dit un
      nombre de séances, pas « pensez-y » : c'est ce nombre qu'on perdrait. */
  function afficherRappelSauvegarde() {
    var r = P.rappelSauvegarde();
    $('bloc-sauvegarde').hidden = !r.besoin;
    if (!r.besoin) return;
    $('texte-sauvegarde').textContent = r.seances +
      (r.seances > 1 ? ' séances ne sont pas' : ' séance n’est pas') +
      (r.jamais ? ' à l’abri : ce cahier n’a jamais été enregistré dans un fichier. '
                : ' à l’abri : la dernière sauvegarde date du ' + F.date(r.depuis) + '. ') +
      'La mémoire du navigateur peut s’effacer toute seule.';
  }

  /** Les sujets que le programme laisse au choix du professeur.

      Le programme d'histoire propose quatre sujets d'étude sur l'âge
      industriel et précise que le professeur en choisit deux. L'application ne
      peut pas deviner lesquels : elle ne les propose donc pas tant que
      personne ne les a cochés. Interroger sur ce qui n'a pas été vu en classe
      ne fabrique qu'un échec sans objet. */
  function dessinerSujetsOptionnels() {
    var optionnels = reg.optionnels();
    $('bloc-sujets-choix').hidden = !optionnels.length;
    if (!optionnels.length) return;

    var zone = $('liste-sujets-choix');
    zone.innerHTML = '';
    optionnels.forEach(function (spec) {
      var actif = P.sujetEtudie(spec.id);
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'bouton' + (actif ? ' choisi' : '');
      b.textContent = spec.titre;
      b.setAttribute('aria-pressed', actif ? 'true' : 'false');
      b.addEventListener('click', function () {
        P.basculerSujet(spec.id);
        dessinerSujetsOptionnels();
      });
      zone.appendChild(b);
    });

    var choisis = optionnels.filter(function (s) { return P.sujetEtudie(s.id); }).length;
    $('texte-sujets-choix').textContent = choisis
      ? choisis + ' ' + F.pluriel(choisis, 'sujet coché', 'sujets cochés') +
        ' : ' + F.pluriel(choisis, 'il entrera', 'ils entreront') + ' dans les séries.'
      : 'Aucun sujet coché : ces questions ne sont pas posées.';
  }

  /* --- Confort de lecture -----------------------------------------------
     Deux réglages seulement : un texte plus grand, un texte plus aéré
     (interlignage, espacement des lettres et des mots, ce qui aide en cas de
     dyslexie). Ils valent pour toute la page, fiche imprimée comprise, et ils
     sont rangés dans le cahier : ils suivent l'enfant, pas l'ordinateur. */

  function boutonConfort(id, actif) {
    var b = $(id);
    b.classList.toggle('choisi', actif);
    b.setAttribute('aria-pressed', actif ? 'true' : 'false');
  }

  function appliquerConfort() {
    var c = P.confort();
    document.body.classList.toggle('lecture-grande', !!c.grand);
    document.body.classList.toggle('lecture-aeree', !!c.aere);
    boutonConfort('confort-grand', !!c.grand);
    boutonConfort('confort-aere', !!c.aere);
  }

  /* =================================================== écran « séance » === */

  function dessinerMarelle() {
    var m = $('marelle');
    m.innerHTML = '';
    for (var i = 0; i < etat.serie.length; i++) {
      var c = document.createElement('span');
      c.className = 'case';
      c.textContent = (i + 1);
      if (etat.serie[i].resultat === true) { c.className += ' juste'; c.textContent = '✓'; }
      else if (etat.serie[i].resultat === false) { c.className += ' faux'; c.textContent = '✗'; }
      else if (i === etat.index) { c.className += ' courante'; }
      m.appendChild(c);
    }
  }

  /** Met la série en cours à l'abri d'un rafraîchissement de la page.
      On n'enregistre que les graines et les résultats : l'énoncé se
      reconstruit tout seul au retour. */
  function sauverSeance() {
    P.enregistrerSeance({
      matiere: etat.matiere,
      index: etat.index,
      repondu: etat.repondu,
      reussites: etat.reussites,
      rates: etat.rates,
      serie: etat.serie,
      enPause: false
    });
  }

  /** L'enfant a cliqué sur la gomme : la série est gardée, mais on ne doit pas
      y retomber tout seul au prochain chargement de la page. */
  function mettreEnPause() {
    var s = P.seanceEnCours();
    if (s) { s.enPause = true; P.enregistrerSeance(s); }
    dessinerBureau();
  }

  /** Reprend la série laissée en plan, s'il y en a une. */
  function reprendreSeance() {
    var s = P.seanceEnCours();
    if (!s) return false;
    if (!Array.isArray(s.serie) || !s.serie.length) { P.oublierSeance(); return false; }

    // Un générateur a pu disparaître entre deux versions : dans ce cas on
    // abandonne la reprise plutôt que de servir une question qui n'existe plus.
    for (var i = 0; i < s.serie.length; i++) {
      var e = s.serie[i];
      if (!e || !reg.get(e.id)) { P.oublierSeance(); return false; }
    }

    // Même prudence pour la position : un indice qui ne désigne aucune
    // question de la série ne se reprend pas, il s'abandonne.
    if (typeof s.index !== 'number' || Math.floor(s.index) !== s.index ||
        s.index < 0 || s.index >= s.serie.length) {
      P.oublierSeance();
      return false;
    }

    etat.matiere = s.matiere;
    etat.serie = s.serie;
    etat.reussites = (typeof s.reussites === 'number') ? s.reussites : 0;
    etat.rates = Array.isArray(s.rates) ? s.rates : [];
    etat.nombre = s.serie.length;
    // La réponse déjà donnée a été comptée avant le rafraîchissement :
    // on reprend à la question suivante, pas sur celle-là.
    etat.index = s.repondu ? s.index + 1 : s.index;

    synchroniserBoutonsNombre();

    if (etat.index >= etat.serie.length) { afficherBilan(); return true; }

    ecrireTableau(nomMatiere(etat.matiere), P.actuel().nom + ' ' + P.actuel().avatar);
    montrer('seance');
    afficherExercice();
    return true;
  }

  function synchroniserBoutonsNombre() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-nombre]'), function (b) {
      var choisi = parseInt(b.getAttribute('data-nombre'), 10) === etat.nombre;
      b.classList.toggle('choisi', choisi);
      b.setAttribute('aria-pressed', choisi ? 'true' : 'false');
    });
  }

  function afficherExercice() {
    var item = etat.serie[etat.index];
    etat.exercice = reg.produire(item.id, item.graine);
    etat.repondu = false;

    // La matière est déjà écrite en titre du tableau : ne pas la répéter ici.
    $('progression').textContent = 'Question ' + (etat.index + 1) + ' sur ' + etat.serie.length;
    dessinerMarelle();

    $('titre-exercice').textContent = etat.exercice.titre;
    $('enonce').textContent = etat.exercice.enonce;

    // La figure est un fragment SVG fabriqué par app/figures.js à partir de
    // nombres : elle ne contient jamais de saisie de l'élève, d'où innerHTML.
    var zoneFigure = $('figure');
    zoneFigure.hidden = !etat.exercice.figure;
    zoneFigure.innerHTML = etat.exercice.figure || '';

    $('retour').hidden = true;
    $('suivant').hidden = true;

    var zone = $('reponses');
    zone.innerHTML = '';

    if (etat.exercice.type === 'qcm') {
      $('zone-saisie').hidden = true;
      var illustre = !!etat.exercice.estFigure;
      zone.className = illustre ? 'propositions-illustrees' : '';
      etat.exercice.propositions.forEach(function (p, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'proposition';
        if (illustre) {
          b.innerHTML = p;                       // fragment produit par nos figures
          b.setAttribute('aria-label', 'figure ' + (i + 1));
        } else {
          b.textContent = p;
        }
        // Le numéro s'affiche dans la case à cocher, à gauche : c'est la touche
        // du clavier qui répond. Les propositions ne dépassent jamais quatre,
        // donc le chiffre suffit — pas de modificateur à retenir.
        if (i < 9) {
          b.setAttribute('data-touche', String(i + 1));
          b.setAttribute('aria-keyshortcuts', String(i + 1));
        }
        b.addEventListener('click', function () { repondreQcm(i, b); });
        zone.appendChild(b);
      });
    } else {
      $('zone-saisie').hidden = false;
      $('saisie').disabled = false;
      $('valider').disabled = false;
      $('saisie').value = '';
      $('saisie').focus();
    }

    sauverSeance();
  }

  function repondreQcm(index, bouton) {
    if (etat.repondu) return;
    var juste = (index === etat.exercice.bonne_reponse);
    Array.prototype.forEach.call($('reponses').children, function (b, i) {
      b.disabled = true;
      if (i === etat.exercice.bonne_reponse) b.classList.add('juste');
    });
    if (!juste) bouton.classList.add('faux');
    conclure(juste, etat.exercice.propositions[etat.exercice.bonne_reponse]);
  }

  /** Répond au QCM affiché par le numéro de la proposition (touches 1 à 4).
      Renvoie false si ce numéro ne désigne rien : la touche est alors rendue au
      navigateur plutôt qu'avalée. */
  function repondreParTouche(numero) {
    if (etat.repondu || !etat.exercice || etat.exercice.type !== 'qcm') return false;
    var boutons = $('reponses').children;
    if (numero < 1 || numero > boutons.length) return false;
    repondreQcm(numero - 1, boutons[numero - 1]);
    return true;
  }

  function repondreSaisie() {
    if (etat.repondu) return;
    var saisie = $('saisie').value;
    if (!saisie.trim()) return;
    var juste = F.accepte(saisie, etat.exercice.bonne_reponse, etat.exercice.reponses_acceptees);
    $('saisie').disabled = true;
    $('valider').disabled = true;
    conclure(juste, etat.exercice.bonne_reponse, saisie);
  }

  /** `donnee` est ce que l'enfant a tapé, quand il a tapé quelque chose. On le
      lui remontre quand c'est faux : « tu as écrit 72 » distingue la faute de
      frappe de l'erreur de raisonnement, et lui seul peut faire la différence. */
  function conclure(juste, bonneReponse, donnee) {
    etat.repondu = true;
    etat.serie[etat.index].resultat = juste;
    dessinerMarelle();

    if (juste) etat.reussites++;
    else etat.rates.push(etat.exercice.titre);

    Prog.noterReponse(etat.exercice, juste);
    sauverSeance();

    var retour = $('retour');
    retour.hidden = false;
    retour.className = 'retour ' + (juste ? 'retour-juste' : 'retour-faux');
    retour.innerHTML = '';

    var verdict = document.createElement('p');
    verdict.className = 'verdict';
    verdict.textContent = juste ? auHasard(BRAVOS) : auHasard(CONSOLATIONS);
    retour.appendChild(verdict);

    if (!juste) {
      if (donnee !== undefined && String(donnee).trim() !== '') {
        var tapee = document.createElement('p');
        tapee.className = 'reponse-tapee';
        tapee.textContent = 'Tu as écrit : ' + String(donnee).trim();
        retour.appendChild(tapee);
      }
      var attendue = document.createElement('p');
      attendue.className = 'bonne-reponse';
      attendue.textContent = 'La bonne réponse : ' + bonneReponse;
      retour.appendChild(attendue);
    }

    if (etat.exercice.explication) {
      var exp = document.createElement('p');
      exp.className = 'explication';
      exp.textContent = etat.exercice.explication;
      retour.appendChild(exp);
    }

    $('suivant').hidden = false;
    $('suivant').textContent = (etat.index + 1 < etat.serie.length)
      ? 'Question suivante' : 'Voir mon bilan';
    $('suivant').focus();
  }

  function suivant() {
    etat.index++;
    if (etat.index >= etat.serie.length) afficherBilan();
    else afficherExercice();
  }

  /* ==================================================== écran « bilan » === */

  function afficherBilan() {
    var total = etat.serie.length;
    var part = total ? etat.reussites / total : 0;
    P.terminerSeance(etat.matiere, total, etat.reussites);
    P.oublierSeance();

    var mention, etoiles;
    // Le sans-faute a sa propre mention : un 10 sur 10 ne doit pas s'entendre
    // dire « ou presque ». On compare les nombres de réussites, pas la
    // fraction, qui peut s'arrondir. Le seuil de 95 % reste pour 19 sur 20.
    if (total && etat.reussites === total) { mention = 'Sans faute ! Bravo !'; etoiles = 5; }
    else if (part >= 0.95) { mention = 'Presque sans faute !'; etoiles = 5; }
    else if (part >= 0.8)  { mention = 'Très bien'; etoiles = 4; }
    else if (part >= 0.6)  { mention = 'Bien, ça avance'; etoiles = 3; }
    else if (part >= 0.4)  { mention = 'En progrès'; etoiles = 2; }
    else                   { mention = 'À revoir tranquillement'; etoiles = 1; }

    ecrireTableau('Bilan de la série', P.actuel().nom + ' ' + P.actuel().avatar);
    $('mention').textContent = mention;
    $('etoiles').innerHTML = '';
    for (var i = 0; i < 5; i++) {
      var e = document.createElement('span');
      e.textContent = '★';
      if (i >= etoiles) e.className = 'eteinte';
      $('etoiles').appendChild(e);
    }
    $('score').textContent = etat.reussites + ' bonne' + (etat.reussites > 1 ? 's' : '') +
      ' réponse' + (etat.reussites > 1 ? 's' : '') + ' sur ' + total + '.';

    var uniques = [];
    etat.rates.forEach(function (t) { if (uniques.indexOf(t) === -1) uniques.push(t); });

    $('bloc-rates').hidden = !uniques.length;
    var liste = $('liste-rates');
    liste.innerHTML = '';
    uniques.forEach(function (titre) {
      var li = document.createElement('li');
      li.textContent = titre;
      liste.appendChild(li);
    });

    montrer('bilan');
  }

  /* =============================================== écran « progression » === */

  /** Un pourcentage, ou rien quand il n'y a pas eu assez de questions pour
      qu'il veuille dire quelque chose. */
  function pourcent(taux) {
    return taux === null ? null : Math.round(100 * taux);
  }

  /** La barre d'un domaine. La couleur dit où on en est, la longueur aussi :
      deux signaux pour la même chose, parce que certains enfants ne
      distinguent pas bien le vert du rouge. */
  function dessinerBarre(conteneur, taux, jugeable) {
    var barre = document.createElement('div');
    barre.className = 'barre';
    if (!jugeable) barre.className += ' vide';
    else if (taux < 0.5) barre.className += ' froide';
    else if (taux < 0.75) barre.className += ' tiede';

    var part = document.createElement('div');
    part.className = 'part';
    part.style.width = (jugeable ? Math.round(100 * taux) : 0) + '%';
    barre.appendChild(part);
    conteneur.appendChild(barre);
  }

  function dessinerProgres() {
    var c = P.actuel();
    if (!c) return;
    var B = CM2.bilan;
    var resume = B.resume();

    ecrireTableau('Ta progression', c.nom + ' ' + c.avatar);

    $('progres-resume').textContent = resume.questions
      ? resume.questions + ' questions faites en tout, ' + resume.reussites + ' réussies (' +
        pourcent(resume.taux) + ' %), sur ' + resume.joursTravailles +
        (resume.joursTravailles > 1 ? ' jours' : ' jour') + ' de travail. ' +
        'Tu as rencontré ' + resume.sortesRencontrees + ' sortes d\'exercices sur ' +
        resume.sortesDisponibles + '.'
      : 'Rien encore dans ce cahier : fais une première série, et tu verras tes domaines ' +
        'se remplir ici.';

    /* --- les domaines du programme --- */
    var liste = $('progres-domaines');
    liste.innerHTML = '';

    B.parDomaine().forEach(function (d) {
      var li = document.createElement('li');

      var titre = document.createElement('div');
      titre.className = 'titre-domaine';
      titre.appendChild(el('span', null, d.nom));

      var chiffres = el('span', 'chiffres',
        d.vus === 0 ? 'pas encore travaillé'
        : d.jugeable ? d.vus + ' questions · ' + pourcent(d.taux) + ' % de réussite'
        : d.vus + (d.vus > 1 ? ' questions' : ' question') + ' — trop peu pour juger');
      titre.appendChild(chiffres);
      li.appendChild(titre);

      dessinerBarre(li, d.taux || 0, d.jugeable);

      // Le détail par sous-domaine, mais seulement là où il y a quelque chose
      // à dire : une liste de zéros n'apprend rien.
      var travailles = d.sous.filter(function (sd) { return sd.vus > 0; });
      if (travailles.length) {
        var ul = document.createElement('ul');
        ul.className = 'sous-domaines';
        travailles.forEach(function (sd) {
          var item = document.createElement('li');
          item.appendChild(el('span', 'nom', sd.nom));
          item.appendChild(el('span', null, sd.jugeable
            ? '· ' + sd.vus + ' questions, ' + pourcent(sd.taux) + ' %'
            : '· ' + sd.vus + (sd.vus > 1 ? ' questions' : ' question')));
          ul.appendChild(item);
        });
        li.appendChild(ul);
      }

      liste.appendChild(li);
    });

    $('progres-note').textContent = 'Un même exercice peut travailler deux domaines à la ' +
      'fois — une aire de rectangle, c\'est de la géométrie et de la multiplication. Les ' +
      'comptes par domaine s\'additionnent donc à plus que le total.';

    dessinerCoinAdulte();
    montrer('progres');
  }

  /** La partie repliée, pour l'adulte : l'évolution semaine par semaine, ce qui
      tient, ce qui résiste, et ce que l'application couvre du programme. */
  function dessinerCoinAdulte() {
    var B = CM2.bilan;
    var semaines = B.parSemaine(6);
    var maxi = Math.max.apply(Math, semaines.map(function (s) { return s.questions; }).concat([1]));

    var histo = $('progres-histo');
    var legende = $('progres-histo-legende');
    histo.innerHTML = '';
    legende.innerHTML = '';

    semaines.forEach(function (s) {
      var col = document.createElement('div');
      col.className = 'colonne' + (s.courante ? ' courante' : '');

      col.appendChild(el('span', 'valeur', s.questions || ''));
      var tige = el('div', 'tige');
      // Une semaine sans rien garde une hauteur nulle : le trou se voit.
      tige.style.height = Math.round(100 * s.questions / maxi) + '%';
      col.appendChild(tige);
      histo.appendChild(col);

      legende.appendChild(el('span', null, s.libelle));
    });

    var actives = semaines.filter(function (s) { return s.questions > 0; });
    var totalQuestions = semaines.reduce(function (n, s) { return n + s.questions; }, 0);
    var totalReussites = semaines.reduce(function (n, s) { return n + s.reussites; }, 0);

    $('progres-histo').setAttribute('aria-label',
      'Questions faites par semaine : ' + semaines.map(function (s) {
        return s.libelle + ', ' + s.questions;
      }).join(' ; '));

    $('progres-semaines-texte').textContent = totalQuestions
      ? totalQuestions + ' questions sur ces six semaines, ' +
        Math.round(100 * totalReussites / totalQuestions) + ' % de réussite, ' +
        'réparties sur ' + actives.length + (actives.length > 1 ? ' semaines' : ' semaine') +
        '. Le cahier ne garde que les quarante dernières séances : au-delà, une semaine ' +
        'ancienne peut apparaître incomplète.'
      : 'Aucune séance terminée sur ces six semaines.';

    remplirNotions('progres-acquis', 'progres-acquis-vide', B.acquises(8), function (n) {
      return n.reussites + ' sur ' + n.vus + ' — ' + n.domaine;
    });
    remplirNotions('progres-coince', 'progres-coince-vide', B.fragiles(8), function (n) {
      return n.reussites + ' sur ' + n.vus + ' — ' + n.domaine;
    });

    var resume = B.resume();
    $('progres-couverture').textContent =
      'Cet enfant a travaillé ' + resume.objectifsTravailles + ' objectifs du programme. ' +
      'L\'application en couvre ' + resume.objectifsPossibles + ' sur les ' +
      resume.objectifsProgramme + ' du CM2 — le reste (lecture à voix haute, écriture de ' +
      'textes, oral, constructions à la règle et au compas) ne s\'évalue pas par des ' +
      'questions fermées. ' +
      (resume.aRevoir ? resume.aRevoir + ' exercice(s) attendent une révision, ' : '') +
      resume.enAttente + ' sont en cours de mémorisation.';
  }

  function remplirNotions(idListe, idVide, notions, detail) {
    var ul = $(idListe);
    ul.innerHTML = '';
    $(idVide).hidden = !!notions.length;
    ul.hidden = !notions.length;
    notions.forEach(function (n) {
      var li = document.createElement('li');
      li.textContent = n.titre + ' ';
      li.appendChild(el('span', 'taux', '(' + detail(n) + ')'));
      ul.appendChild(li);
    });
  }

  function el(balise, classe, texte) {
    var n = document.createElement(balise);
    if (classe) n.className = classe;
    if (texte !== undefined && texte !== null) n.textContent = texte;
    return n;
  }

  /* ============================================= écran « vue enseignant » === */

  /** Le tableau des enfants, les domaines de la classe, ce qui coince chez
      plusieurs. Rien n'est ouvert : les cahiers sont lus sur place, et le
      cahier ouvert — s'il y en a un — ne bouge pas. */
  function dessinerClasse() {
    var Cl = CM2.classe;
    var eleves = Cl.eleves();
    var resume = Cl.resume();

    ecrireTableau('Vue enseignant', eleves.length +
      (eleves.length > 1 ? ' cahiers sur cet ordinateur' : ' cahier sur cet ordinateur'));

    $('classe-resume').textContent = eleves.length
      ? resume.cahiers + ' ' + F.pluriel(resume.cahiers, 'cahier', 'cahiers') + ', ' +
        resume.questions + ' ' + F.pluriel(resume.questions, 'question', 'questions') +
        ' en tout' +
        (resume.questions ? ', ' + pourcent(resume.taux) + ' % de réussite' : '') + '. ' +
        (resume.aRevoir
          ? resume.aRevoir + ' ' + F.pluriel(resume.aRevoir, 'exercice attend', 'exercices attendent') +
            ' une révision. '
          : '') +
        (resume.decroches.length
          ? 'Sans nouvelles depuis plus de ' + resume.joursSansNouvelles + ' jours : ' +
            resume.decroches.join(', ') + '.'
          : '')
      : 'Aucun cahier sur cet ordinateur. Utilisez « Restaurer un cahier » pour ouvrir ' +
        'le fichier de sauvegarde d’un enfant.';

    dessinerTableauClasse(eleves);
    dessinerDomainesClasse();
    dessinerDifficultesClasse();

    // Le détail affiché précédemment n'a plus lieu d'être quand on revient.
    choisirEleve(etat.eleveDetaille);

    montrer('classe');
  }

  function dessinerTableauClasse(eleves) {
    var corps = $('classe-lignes');
    corps.innerHTML = '';

    eleves.forEach(function (e) {
      var tr = document.createElement('tr');

      var nom = document.createElement('td');
      var bouton = document.createElement('button');
      bouton.type = 'button';
      bouton.className = 'lien-eleve';
      bouton.textContent = e.avatar + ' ' + e.nom;
      bouton.setAttribute('aria-label', 'Voir le détail du cahier de ' + e.nom);
      bouton.addEventListener('click', function () { choisirEleve(e.nom); });
      nom.appendChild(bouton);
      tr.appendChild(nom);

      function cellule(texte, classe) {
        var td = el('td', classe, texte);
        tr.appendChild(td);
        return td;
      }

      cellule(e.derniereVisite ? F.date(e.derniereVisite) : '—', e.decroche ? 'alerte' : null);
      cellule(String(e.seances), 'nb');
      cellule(String(e.questions), 'nb');
      // Sous trois questions, on écrit le compte, jamais un pourcentage : un
      // taux sur deux réponses est un chiffre faux qui a l'air vrai.
      cellule(e.jugeable ? pourcent(e.taux) + ' %' : '—', 'nb');
      cellule(String(e.aRevoir), 'nb');
      cellule(e.objectifsTravailles + ' / ' + e.objectifsPossibles, 'nb');

      corps.appendChild(tr);
    });

    $('classe-tableau').hidden = !eleves.length;
  }

  function dessinerDomainesClasse() {
    var liste = $('classe-domaines');
    liste.innerHTML = '';

    var domaines = CM2.classe.parDomaine().filter(function (d) { return d.vus > 0; });
    $('classe-domaines-vide').hidden = !!domaines.length;
    liste.hidden = !domaines.length;

    domaines.forEach(function (d) {
      var li = document.createElement('li');
      var titre = el('div', 'titre-domaine');
      titre.appendChild(el('span', null, d.nom));
      titre.appendChild(el('span', 'chiffres',
        d.vus + ' ' + F.pluriel(d.vus, 'question', 'questions') + ' · ' +
        (d.jugeable ? pourcent(d.taux) + ' % · ' : '') +
        d.enfants + ' ' + F.pluriel(d.enfants, 'enfant', 'enfants')));
      li.appendChild(titre);
      dessinerBarre(li, d.taux || 0, d.jugeable);
      liste.appendChild(li);
    });
  }

  function dessinerDifficultesClasse() {
    var ul = $('classe-difficultes');
    ul.innerHTML = '';

    var lignes = CM2.classe.difficultesCommunes(10);
    $('classe-difficultes-vide').hidden = !!lignes.length;
    ul.hidden = !lignes.length;

    lignes.forEach(function (l) {
      var li = document.createElement('li');
      li.textContent = l.titre + ' ';
      li.appendChild(el('span', 'taux', '(' + l.domaine + ' — ' +
        l.eleves.map(function (e) { return e.nom; }).join(', ') + ')'));
      ul.appendChild(li);
    });
  }

  /** Le détail d'un enfant, sous le tableau. `nom` nul referme le détail. */
  function choisirEleve(nom) {
    var c = nom ? P.cahierDe(nom) : null;
    etat.eleveDetaille = c ? nom : null;

    $('classe-detail').hidden = !c;
    if (!c) return;

    var B = CM2.bilan;
    var resume = B.resume(c);

    $('classe-detail-titre').textContent = c.avatar + ' ' + c.nom;
    $('classe-detail-resume').textContent = resume.questions
      ? resume.questions + ' ' + F.pluriel(resume.questions, 'question', 'questions') + ', ' +
        resume.reussites + ' ' + F.pluriel(resume.reussites, 'réussie', 'réussies') + ' (' +
        pourcent(resume.taux) + ' %), sur ' + resume.joursTravailles + ' ' +
        F.pluriel(resume.joursTravailles, 'jour', 'jours') + ' de travail. ' +
        resume.sortesRencontrees + ' ' +
        F.pluriel(resume.sortesRencontrees, 'sorte d’exercices rencontrée',
                  'sortes d’exercices rencontrées') +
        ' sur ' + resume.sortesDisponibles + ', et ' + resume.objectifsTravailles + ' ' +
        F.pluriel(resume.objectifsTravailles, 'objectif du programme travaillé',
                  'objectifs du programme travaillés') + '.'
      : 'Ce cahier est encore vide.';

    var semaines = B.parSemaine(6, c);
    var maxi = Math.max.apply(Math, semaines.map(function (s) { return s.questions; }).concat([1]));
    var histo = $('classe-histo');
    var legende = $('classe-histo-legende');
    histo.innerHTML = '';
    legende.innerHTML = '';
    semaines.forEach(function (s) {
      var col = el('div', 'colonne' + (s.courante ? ' courante' : ''));
      col.appendChild(el('span', 'valeur', s.questions || ''));
      var tige = el('div', 'tige');
      tige.style.height = Math.round(100 * s.questions / maxi) + '%';
      col.appendChild(tige);
      histo.appendChild(col);
      legende.appendChild(el('span', null, s.libelle));
    });
    histo.setAttribute('aria-label', 'Questions faites par semaine : ' +
      semaines.map(function (s) { return s.libelle + ', ' + s.questions; }).join(' ; '));

    remplirNotions('classe-acquis', 'classe-acquis-vide', B.acquises(8, c), function (n) {
      return n.reussites + ' sur ' + n.vus + ' — ' + n.domaine;
    });
    remplirNotions('classe-coince', 'classe-coince-vide', B.fragiles(8, c), function (n) {
      return n.reussites + ' sur ' + n.vus + ' — ' + n.domaine;
    });
  }

  /* ============================================ écran « fiche à imprimer » === */

  /** garderLaGraine : vrai pour redessiner la fiche affichée (on vient de la
      retrouver par sa référence), faux pour en tirer une nouvelle. */
  function dessinerFiche(garderLaGraine) {
    var c = P.actuel();
    ecrireTableau('Fiche à imprimer', c ? c.nom + ' ' + c.avatar : 'CM2');

    if (!garderLaGraine) etat.ficheGraine = null;
    var fiche = CM2.fiche.composer(etat.ficheMatiere, etat.ficheNombre, etat.ficheGraine);
    if (!fiche) return;
    etat.ficheGraine = fiche.graine;
    etat.ficheReference = fiche.reference;

    CM2.fiche.dessiner($('fiche-apercu'), fiche);
    montrer('fiche');
  }

  /** Refait la fiche dont on a recopié la référence. La référence porte aussi
      la matière et le nombre d'exercices : il n'y a rien d'autre à retrouver. */
  function refaireFiche() {
    var champ = $('fiche-reference');
    var lu = CM2.fiche.depuisReference(champ.value);
    var msg = $('fiche-message');

    if (!lu || !champ.value.trim()) {
      msg.hidden = false;
      msg.className = 'message rate';
      msg.textContent = 'Cette référence n’est pas lisible. Elle ressemble à « 7K3QP2-M20 », ' +
        'et se trouve en haut de la feuille imprimée.';
      return;
    }

    if (lu.matiere) etat.ficheMatiere = lu.matiere;
    if (lu.nombre) etat.ficheNombre = lu.nombre;
    etat.ficheGraine = lu.graine;
    synchroniserBoutonsFiche();
    dessinerFiche(true);

    msg.hidden = false;
    msg.className = 'message reussi';
    msg.textContent = (etat.ficheReference === champ.value.trim().toUpperCase())
      ? 'Voici la fiche ' + etat.ficheReference + ', à l’identique.'
      : 'Voici la fiche ' + etat.ficheReference + '.';
  }

  function synchroniserBoutonsFiche() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-fiche-nombre]'), function (b) {
      var choisi = parseInt(b.getAttribute('data-fiche-nombre'), 10) === etat.ficheNombre;
      b.classList.toggle('choisi', choisi);
      b.setAttribute('aria-pressed', choisi ? 'true' : 'false');
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-fiche-matiere]'), function (b) {
      var choisi = b.getAttribute('data-fiche-matiere') === etat.ficheMatiere;
      b.classList.toggle('choisi', choisi);
      b.setAttribute('aria-pressed', choisi ? 'true' : 'false');
    });
  }

  /* ======================================================== démarrage ==== */

  function demarrer(matiere, nombre) {
    etat.matiere = matiere;
    etat.serie = (matiere === 'erreurs')
      ? Prog.serieDesErreurs(nombre)
      : Prog.choisirSerie(matiere, nombre);
    if (!etat.serie.length) return;

    etat.index = 0;
    etat.reussites = 0;
    etat.rates = [];

    ecrireTableau(nomMatiere(matiere), P.actuel().nom + ' ' + P.actuel().avatar);
    montrer('seance');
    afficherExercice();
  }

  /* ================================ sauvegarde du cahier dans un fichier === */

  /* Il y a une zone de message par écran concerné — l'accueil et le bureau.
     On les met toutes à jour : seule celle de l'écran visible se voit. */
  function message(texte, classe) {
    Array.prototype.forEach.call(document.querySelectorAll('.message-cahier'), function (p) {
      p.hidden = !texte;
      p.textContent = texte || '';
      p.className = 'message message-cahier' + (classe ? ' ' + classe : '');
    });
  }

  function sauverCahier() {
    var contenu = P.exporter();
    if (!contenu) return;
    try {
      var lien = document.createElement('a');
      var blob = new Blob([contenu], { type: 'application/json' });
      lien.href = URL.createObjectURL(blob);
      lien.download = P.nomDeFichier();
      document.body.appendChild(lien);
      lien.click();
      document.body.removeChild(lien);
      setTimeout(function () { URL.revokeObjectURL(lien.href); }, 1000);
      // Le fichier est écrit : le compteur de séances non sauvegardées repart
      // de zéro, et le rappel s'efface.
      P.marquerSauvegarde();
      afficherRappelSauvegarde();
      message('Cahier enregistré dans le fichier ' + P.nomDeFichier() +
              '. Garde-le : il permet de tout retrouver.', 'reussi');
    } catch (e) {
      message('Le navigateur a refusé l’enregistrement du fichier.', 'rate');
    }
  }

  function restaurerCahier(fichier) {
    // Le poids est connu avant la lecture : inutile de charger en mémoire un
    // fichier qui sera refusé. Un caractère pèse au plus quatre octets, d'où
    // la marge — le contrôle exact, en caractères, reste celui de l'import.
    if (fichier && fichier.size > 4 * P.TAILLE_MAX_FICHIER) {
      message('Ce fichier est bien trop gros pour être un cahier.', 'rate');
      return;
    }
    var lecteur = new FileReader();
    lecteur.onload = function () {
      var bilan = P.importer(String(lecteur.result), false);

      // Un cahier du même nom existe déjà : on ne l'écrase pas sans demander.
      if (!bilan.ok && bilan.existe) {
        if (!window.confirm(bilan.message + ' Veux-tu le remplacer par celui du fichier ?')) {
          message('Restauration annulée : rien n’a été modifié.', null);
          return;
        }
        bilan = P.importer(String(lecteur.result), true);
      }

      if (!bilan.ok) { message(bilan.message, 'rate'); return; }

      // Restaurer depuis la vue enseignant ajoute un cahier au tableau ; cela
      // n'ouvre pas le cahier de l'enfant, et cela ne fait pas quitter la vue.
      if (!$('ecran-classe').hidden) {
        dessinerClasse();
        message('Le cahier de ' + bilan.nom + ' a été ajouté à la vue.', 'reussi');
        return;
      }

      // On ouvre d'abord : le bureau efface les messages en se redessinant.
      ouvrirCahier(bilan.nom);
      message('Le cahier de ' + bilan.nom + ' a été restauré.', 'reussi');
    };
    lecteur.onerror = function () { message('Le fichier n’a pas pu être lu.', 'rate'); };
    lecteur.readAsText(fichier);
  }

  /* ====================================== fenêtre « à propos » ============ */

  /** Remplit la fenêtre d'information avec ce que l'application sait d'elle-même :
      son contenu réel et son journal de versions. Rien n'est recopié à la main. */
  function preparerInfos() {
    // Une ligne par matière de la table : la somme retombe toujours sur le
    // total, une matière ajoutée ne peut plus manquer à l'appel.
    $('infos-compte').textContent = reg.liste().length + ' sortes d\'exercices — ' +
      CM2.matieres.liste.map(function (m) {
        return reg.parMatiere(m.id).length + ' ' + m.phrase;
      }).join(', ') + '. ' +
      'Chacune peut produire un nombre illimité de questions différentes.';

    var liste = $('infos-versions');
    liste.innerHTML = '';
    CM2.version.historique.slice().reverse().forEach(function (v) {
      var li = document.createElement('li');
      var num = document.createElement('b');
      num.textContent = v.numero;
      if (v.majeur) num.className = 'majeur';
      li.appendChild(num);
      li.appendChild(document.createTextNode(v.quoi));
      liste.appendChild(li);
    });
  }

  function ouvrirInfos() {
    var d = $('infos');
    // showModal donne le fond assombri, le piège à focus et la touche Échap.
    // Les navigateurs qui ne le connaissent pas retombent sur un simple affichage.
    if (typeof d.showModal === 'function') d.showModal();
    else d.setAttribute('open', 'open');
  }

  function fermerInfos() {
    var d = $('infos');
    if (typeof d.close === 'function') d.close();
    else d.removeAttribute('open');
  }

  function initialiser() {
    // `keyCode` en secours : certains claviers virtuels et certains navigateurs
    // n'alimentent pas `key`.
    function estEntree(e) { return e.key === 'Enter' || e.keyCode === 13; }

    $('creer').addEventListener('click', creerCahier);
    $('nom-nouveau').addEventListener('keydown', function (e) {
      if (estEntree(e)) { e.preventDefault(); creerCahier(); }
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-nombre]'), function (b) {
      b.addEventListener('click', function () {
        etat.nombre = parseInt(b.getAttribute('data-nombre'), 10);
        synchroniserBoutonsNombre();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll('[data-matiere]'), function (b) {
      b.addEventListener('click', function () {
        demarrer(b.getAttribute('data-matiere'), etat.nombre);
      });
    });

    $('revoir-erreurs').addEventListener('click', function () {
      demarrer('erreurs', etat.nombre);
    });

    $('valider').addEventListener('click', repondreSaisie);
    $('saisie').addEventListener('keydown', function (e) {
      if (estEntree(e)) { e.preventDefault(); repondreSaisie(); }
    });
    $('suivant').addEventListener('click', suivant);

    // Arrêter met la série en pause, sans l'effacer : on la retrouve au bureau.
    $('abandonner').addEventListener('click', mettreEnPause);
    $('reprendre-serie').addEventListener('click', function () {
      // Une série qui ne peut plus être reprise est oubliée : le bureau se
      // redessine, pour que le bouton ne reste pas là à ne rien faire.
      if (!reprendreSeance()) dessinerBureau();
    });
    $('retour-bureau').addEventListener('click', dessinerBureau);
    $('encore').addEventListener('click', function () {
      demarrer(etat.matiere === 'erreurs' ? 'tout' : etat.matiere, etat.nombre);
    });

    $('effacer-cahier').addEventListener('click', function () {
      var c = P.actuel();
      if (!c) return;
      if (window.confirm('Effacer définitivement le cahier de ' + c.nom + ' ?')) {
        P.supprimer(c.nom);
        dessinerCahiers();
      }
    });

    $('voir-classe').addEventListener('click', dessinerClasse);
    $('classe-retour').addEventListener('click', function () {
      // On revient d'où l'on vient : au bureau si un cahier est ouvert, à
      // l'accueil sinon.
      if (P.actuel()) dessinerBureau(); else dessinerCahiers();
    });
    $('classe-detail-fermer').addEventListener('click', function () { choisirEleve(null); });
    $('classe-imprimer').addEventListener('click', function () { window.print(); });
    $('classe-restaurer').addEventListener('click', function () { $('fichier-cahier').click(); });

    $('voir-progres').addEventListener('click', dessinerProgres);
    $('progres-retour').addEventListener('click', dessinerBureau);

    $('voir-fiche').addEventListener('click', function () { dessinerFiche(false); });
    $('fiche-retour').addEventListener('click', dessinerBureau);
    $('fiche-autre').addEventListener('click', function () { dessinerFiche(false); });
    $('fiche-refaire').addEventListener('click', refaireFiche);
    $('fiche-reference').addEventListener('keydown', function (e) {
      if (estEntree(e)) { e.preventDefault(); refaireFiche(); }
    });
    // La fiche affichée est déjà celle qui sortira : on imprime telle quelle.
    $('fiche-imprimer').addEventListener('click', function () { window.print(); });

    Array.prototype.forEach.call(document.querySelectorAll('[data-fiche-nombre]'), function (b) {
      b.addEventListener('click', function () {
        etat.ficheNombre = parseInt(b.getAttribute('data-fiche-nombre'), 10);
        synchroniserBoutonsFiche();
        dessinerFiche(false);
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('[data-fiche-matiere]'), function (b) {
      b.addEventListener('click', function () {
        etat.ficheMatiere = b.getAttribute('data-fiche-matiere');
        synchroniserBoutonsFiche();
        dessinerFiche(false);
      });
    });

    $('confort-grand').addEventListener('click', function () {
      P.basculerConfort('grand');
      appliquerConfort();
    });
    $('confort-aere').addEventListener('click', function () {
      P.basculerConfort('aere');
      appliquerConfort();
    });

    $('sauver-cahier').addEventListener('click', sauverCahier);
    $('sauvegarder-maintenant').addEventListener('click', sauverCahier);
    function ouvrirSelecteur() { $('fichier-cahier').click(); }
    $('restaurer-cahier').addEventListener('click', ouvrirSelecteur);
    $('restaurer-accueil').addEventListener('click', ouvrirSelecteur);
    $('fichier-cahier').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) restaurerCahier(e.target.files[0]);
      e.target.value = '';        // pour pouvoir recharger deux fois le même fichier
    });

    // « 1 » du rang des chiffres et « 1 » du pavé numérique : `key` vaut '1'
    // dans les deux cas ; les codes servent de secours, comme pour Entrée.
    function chiffreDe(e) {
      if (e.ctrlKey || e.altKey || e.metaKey) return null;
      if (e.key && /^[1-9]$/.test(e.key)) return parseInt(e.key, 10);
      if (e.keyCode >= 49 && e.keyCode <= 57) return e.keyCode - 48;
      if (e.keyCode >= 97 && e.keyCode <= 105) return e.keyCode - 96;
      return null;
    }

    document.addEventListener('keydown', function (e) {
      if (estEntree(e) && etat.repondu && !$('suivant').hidden) {
        e.preventDefault();
        suivant();
        return;
      }

      // Les chiffres choisissent une proposition. On ne s'en mêle que pendant
      // une question : ailleurs, « 1 » doit pouvoir s'écrire dans un champ.
      if ($('ecran-seance').hidden) return;
      var cible = e.target || {};
      if (cible.tagName === 'INPUT' || cible.tagName === 'TEXTAREA') return;
      var chiffre = chiffreDe(e);
      if (chiffre !== null && repondreParTouche(chiffre)) e.preventDefault();
    });

    $('compte-total').textContent = reg.liste().length;
    CM2.matieres.liste.forEach(function (m) {
      $(m.compteur).textContent = reg.parMatiere(m.id).length;
    });
    $('version').textContent = 'v' + CM2.version.numero;

    preparerInfos();
    // dessinerCahiers() redessine la liste avant d'afficher l'écran : les
    // statistiques d'un cahier travaillé entre-temps sont donc à jour.
    $('retour-cahiers').addEventListener('click', dessinerCahiers);

    $('ouvrir-infos').addEventListener('click', ouvrirInfos);
    $('fermer-infos').addEventListener('click', fermerInfos);
    $('fermer-infos-bas').addEventListener('click', fermerInfos);
    // Un clic sur le fond assombri ferme aussi : la cible de l'évènement est
    // alors la boîte elle-même, pas son contenu.
    $('infos').addEventListener('click', function (e) {
      if (e.target === $('infos')) fermerInfos();
    });
    $('pied-compte').textContent = reg.liste().length +
      ' sortes d’exercices, et un nombre illimité de questions.';

    dessinerCahiers();

    // On revient sur le cahier ouvert la dernière fois. Une série interrompue par
    // un rafraîchissement de la page reprend d'elle-même ; une série que l'enfant
    // a volontairement arrêtée ne reprend pas, elle attend au bureau.
    var dernier = P.dernier();
    if (dernier && P.existe(dernier)) {
      ouvrirCahier(dernier);
      var enCours = P.seanceEnCours();
      // Une série qui ne peut pas être reprise vient d'être oubliée : le
      // bureau, dessiné juste avant, la proposait encore.
      if (enCours && !enCours.enPause && !reprendreSeance()) dessinerBureau();
    }
  }

  CM2.ui = { initialiser: initialiser, etat: etat };
})(window.CM2 = window.CM2 || {});
