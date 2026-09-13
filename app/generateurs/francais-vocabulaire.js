/* Vocabulaire. Référentiel : fra.vocabulaire.

   Tout le matériau est écrit à la main ci-dessous : préfixes, suffixes, familles
   de mots, synonymes, contraires, mots à plusieurs sens. Rien n'est déduit d'une
   règle : en vocabulaire, la règle a toujours des exceptions, et une exception
   servie comme une vérité est exactement ce qu'on veut éviter.

   Les leurres sont choisis loin du mot visé plutôt que tout près. Un piège
   étymologique (« terrible » n'est pas de la famille de « terre ») se défend
   devant un adulte, pas devant un élève de CM2 qui vient de le rater. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;
  var L = CM2.lexique;
  var C = CM2.conjugaison;

  /* --- Préfixes --------------------------------------------------------- */

  var PREFIXES = [
    { prefixe: 're-', sens: 'encore, une nouvelle fois',
      exemples: ['refaire', 'relire', 'redire', 'repasser'] },
    { prefixe: 'in-, im-, ir-, il-', sens: 'pas, non',
      exemples: ['inutile', 'impossible', 'irrégulier', 'illisible'] },
    { prefixe: 'dé-, dés-', sens: 'annuler ce qui a été fait',
      exemples: ['défaire', 'décoller', 'désordre', 'déplier'] },
    { prefixe: 'pré-', sens: 'avant',
      exemples: ['prévoir', 'préparer', 'prédire'] },
    { prefixe: 'sur-', sens: 'au-dessus, ou trop',
      exemples: ['survoler', 'surcharger', 'surélever'] },
    { prefixe: 'mal-, mé-', sens: 'mal, de façon mauvaise',
      exemples: ['malheureux', 'maladroit', 'mécontent'] }
  ];

  /* Contraires formés avec un préfixe. Chaque paire est vérifiée une à une. */
  var CONTRAIRES_PREFIXE = [
    { mot: 'possible', contraire: 'impossible' },
    { mot: 'utile', contraire: 'inutile' },
    { mot: 'prudent', contraire: 'imprudent' },
    { mot: 'lisible', contraire: 'illisible' },
    { mot: 'régulier', contraire: 'irrégulier' },
    { mot: 'content', contraire: 'mécontent' },
    { mot: 'heureux', contraire: 'malheureux' },
    { mot: 'adroit', contraire: 'maladroit' },
    { mot: 'coller', contraire: 'décoller' },
    { mot: 'faire', contraire: 'défaire' },
    { mot: 'plier', contraire: 'déplier' },
    { mot: 'brancher', contraire: 'débrancher' }
  ];

  /* --- Suffixes --------------------------------------------------------- */

  var SUFFIXES = [
    { suffixe: '-eur, -euse', sens: 'celui ou celle qui fait l\'action',
      exemples: ['chanteur', 'nageuse', 'vendeur'] },
    { suffixe: '-ette', sens: 'quelque chose de plus petit',
      exemples: ['fillette', 'maisonnette', 'camionnette'] },
    { suffixe: '-able', sens: 'qui peut être fait',
      exemples: ['lavable', 'mangeable', 'pliable'] },
    { suffixe: '-iste', sens: 'un métier ou une activité',
      exemples: ['dentiste', 'pianiste', 'fleuriste'] },
    { suffixe: '-ain, -aine', sens: 'qui vient d\'un lieu',
      exemples: ['américain', 'africaine', 'romain'] }
  ];

  /* --- Familles de mots -------------------------------------------------- */

  var FAMILLES = [
    { radical: 'dent', mots: ['dentiste', 'dentaire', 'dentifrice', 'denture'] },
    { radical: 'terre', mots: ['terrain', 'atterrir', 'souterrain', 'terrestre'] },
    { radical: 'jour', mots: ['journée', 'journal', 'bonjour', 'journalier'] },
    { radical: 'chant', mots: ['chanter', 'chanteur', 'chanson', 'chantonner'] },
    { radical: 'glace', mots: ['glacier', 'glaçon', 'glacé', 'glaciaire'] },
    { radical: 'lait', mots: ['laitier', 'laiterie', 'laitage'] },
    { radical: 'mont', mots: ['montagne', 'monter', 'montée', 'montagnard'] },
    { radical: 'port', mots: ['porter', 'porteur', 'portable', 'apporter'] },
    { radical: 'long', mots: ['longueur', 'allonger', 'longer', 'longtemps'] },
    { radical: 'fleur', mots: ['fleuriste', 'fleurir', 'fleurette'] }
  ];

  /* --- Synonymes et contraires ------------------------------------------ */

  var SYNONYMES = [
    { mot: 'content', synonyme: 'joyeux' },
    { mot: 'rapide', synonyme: 'vif' },
    { mot: 'bâtir', synonyme: 'construire' },
    { mot: 'débuter', synonyme: 'commencer' },
    { mot: 'terminer', synonyme: 'finir' },
    { mot: 'calme', synonyme: 'tranquille' },
    { mot: 'malin', synonyme: 'rusé' },
    { mot: 'ancien', synonyme: 'vieux' },
    { mot: 'bizarre', synonyme: 'étrange' },
    { mot: 'crier', synonyme: 'hurler' },
    { mot: 'joli', synonyme: 'beau' },
    { mot: 'apeuré', synonyme: 'effrayé' }
  ];

  var CONTRAIRES = [
    { mot: 'grand', contraire: 'petit' },
    { mot: 'vieux', contraire: 'jeune' },
    { mot: 'chaud', contraire: 'froid' },
    { mot: 'rapide', contraire: 'lent' },
    { mot: 'clair', contraire: 'sombre' },
    { mot: 'gagner', contraire: 'perdre' },
    { mot: 'monter', contraire: 'descendre' },
    { mot: 'ouvrir', contraire: 'fermer' },
    { mot: 'devant', contraire: 'derrière' },
    { mot: 'toujours', contraire: 'jamais' },
    { mot: 'dur', contraire: 'mou' },
    { mot: 'plein', contraire: 'vide' }
  ];

  /* --- Mots à plusieurs sens -------------------------------------------- */

  var POLYSEMIQUES = [
    { mot: 'glace', sens: [
      { phrase: 'Je me regarde dans la glace de la salle de bains.', veut_dire: 'un miroir' },
      { phrase: 'En été, je mange une glace à la fraise.', veut_dire: 'un dessert glacé' },
      { phrase: 'Le lac est couvert de glace en hiver.', veut_dire: 'de l\'eau gelée' }
    ] },
    { mot: 'feuille', sens: [
      { phrase: 'J\'écris sur une feuille de mon cahier.', veut_dire: 'un morceau de papier' },
      { phrase: 'Les feuilles de l\'arbre sont tombées.', veut_dire: 'une partie de la plante' }
    ] },
    { mot: 'carte', sens: [
      { phrase: 'Sur la carte, on voit toutes les rivières du pays.', veut_dire: 'un plan dessiné d\'une région' },
      { phrase: 'Il me manque une carte pour gagner la partie.', veut_dire: 'un carton d\'un jeu' }
    ] },
    { mot: 'règle', sens: [
      { phrase: 'Trace un trait avec ta règle.', veut_dire: 'un instrument pour tracer' },
      { phrase: 'La règle du jeu interdit de tricher.', veut_dire: 'une consigne à respecter' }
    ] },
    { mot: 'mine', sens: [
      { phrase: 'La mine de mon crayon est cassée.', veut_dire: 'la partie qui écrit' },
      { phrase: 'Les mineurs descendent au fond de la mine.', veut_dire: 'un lieu creusé sous terre' },
      { phrase: 'Tu as bonne mine aujourd\'hui !', veut_dire: 'l\'air du visage' }
    ] },
    { mot: 'pièce', sens: [
      { phrase: 'J\'ai trouvé une pièce de deux euros.', veut_dire: 'une monnaie en métal' },
      { phrase: 'La cuisine est la plus grande pièce de la maison.', veut_dire: 'une salle' },
      { phrase: 'Nous allons voir une pièce au théâtre.', veut_dire: 'un spectacle joué par des acteurs' }
    ] },
    { mot: 'souris', sens: [
      { phrase: 'La souris se cache derrière le meuble.', veut_dire: 'un petit animal' },
      { phrase: 'Clique sur l\'image avec la souris.', veut_dire: 'un objet qui commande l\'ordinateur' }
    ] },
    { mot: 'opération', sens: [
      { phrase: 'Pose l\'opération pour trouver le résultat.', veut_dire: 'un calcul' },
      { phrase: 'Le chirurgien a réussi l\'opération.', veut_dire: 'une intervention sur un malade' }
    ] }
  ];

  /* --- Orthographe des mots fréquents ------------------------------------ */

  var ORTHOGRAPHE = [
    { juste: 'beaucoup', faux: ['beaucout', 'beaucou', 'baucoup'] },
    { juste: 'toujours', faux: ['toujour', 'toujourd', 'tousjours'] },
    { juste: 'longtemps', faux: ['longtemp', 'lontemps', 'longtant'] },
    { juste: 'aujourd\'hui', faux: ['aujourdhui', 'aujoud\'hui', 'aujour d\'hui'] },
    { juste: 'parce que', faux: ['parceque', 'parsque', 'parce-que'] },
    { juste: 'tranquille', faux: ['tranquile', 'tranquil', 'trankille'] },
    { juste: 'appeler', faux: ['apeler', 'appeller', 'apeller'] },
    { juste: 'bientôt', faux: ['bientot', 'bienteau', 'biento'] },
    { juste: 'attention', faux: ['atention', 'attension', 'attantion'] },
    { juste: 'professeur', faux: ['proffesseur', 'profeseur', 'profésseur'] },
    { juste: 'immédiatement', faux: ['imédiatement', 'immédiatemment', 'imméditement'] },
    { juste: 'malheureusement', faux: ['malheureusemment', 'maleureusement', 'malheurusement'] }
  ];

  /* --- Ordre alphabétique ------------------------------------------------
     Des séries partageant leur première lettre : chercher dans un dictionnaire
     commence toujours là, et c'est la deuxième lettre qui fait le travail. */
  var SERIES_ALPHABET = [
    ['chapeau', 'chat', 'chemise', 'cheval', 'chien', 'chocolat'],
    ['carnet', 'chaise', 'ciseaux', 'citron', 'clou', 'coude'],
    ['balle', 'banane', 'bateau', 'bille', 'bonbon', 'bouton'],
    ['maison', 'manteau', 'marche', 'melon', 'moule', 'mur'],
    ['panier', 'passage', 'peigne', 'petit', 'poche', 'pull'],
    ['table', 'tapis', 'tasse', 'timbre', 'toit', 'tulipe'],
    ['sable', 'salade', 'seau', 'singe', 'soleil', 'sucre'],
    ['ferme', 'feuille', 'figure', 'fleur', 'fourmi', 'fruit']
  ];

  function sansAccent(mot) {
    return mot.normalize ? mot.normalize('NFD').replace(/[̀-ͯ]/g, '') : mot;
  }

  /* ====================================================== Les générateurs === */

  reg.ajouter({
    id: 'voc.sens_prefixe',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.enrichir.02', 'fra.vocabulaire.relations.02'],
    titre: 'Le sens d\'un préfixe',
    generer: function (r) {
      var p = r.choix(PREFIXES);
      var mot = r.choix(p.exemples);
      var leurres = PREFIXES.filter(function (x) { return x.sens !== p.sens; })
                            .map(function (x) { return x.sens; });

      var choix = Q.construire(r, p.sens, r.melanger(leurres), String);

      return {
        enonce: 'Dans le mot « ' + mot + ' », que veut dire le préfixe ' + p.prefixe + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le préfixe ' + p.prefixe + ' veut dire « ' + p.sens + ' ». On le retrouve ' +
          'dans ' + p.exemples.join(', ') + '.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.contraire_prefixe',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.relations.02'],
    titre: 'Le contraire avec un préfixe',
    generer: function (r) {
      var c = r.choix(CONTRAIRES_PREFIXE);
      return {
        enonce: 'Écris le contraire de « ' + c.mot + ' » en ajoutant un préfixe.',
        type: 'saisie',
        bonne_reponse: c.contraire,
        explication: 'Le contraire de « ' + c.mot + ' » est « ' + c.contraire +
          ' » : le préfixe inverse le sens du mot, le radical ne change pas.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.sens_suffixe',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.enrichir.02', 'fra.vocabulaire.relations.02'],
    titre: 'Le sens d\'un suffixe',
    generer: function (r) {
      var s = r.choix(SUFFIXES);
      var mot = r.choix(s.exemples);
      var leurres = SUFFIXES.filter(function (x) { return x.sens !== s.sens; })
                            .map(function (x) { return x.sens; });

      var choix = Q.construire(r, s.sens, r.melanger(leurres), String);

      return {
        enonce: 'Dans le mot « ' + mot + ' », que veut dire le suffixe ' + s.suffixe + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Le suffixe ' + s.suffixe + ' veut dire « ' + s.sens + ' » : ' +
          s.exemples.join(', ') + '.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.famille_de_mots',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.relations.02'],
    titre: 'La famille d\'un mot',
    generer: function (r) {
      var f = r.choix(FAMILLES);
      var bonne = r.choix(f.mots);

      // Les leurres viennent d'autres familles : on cherche à faire reconnaître
      // un radical, pas à piéger sur une ressemblance trompeuse.
      var leurres = [];
      FAMILLES.forEach(function (autre) {
        if (autre.radical !== f.radical) leurres.push(r.choix(autre.mots));
      });

      var choix = Q.construire(r, bonne, r.melanger(leurres), String);

      return {
        enonce: 'Quel mot appartient à la même famille que « ' + f.radical + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + bonne + ' » est construit sur le radical « ' + f.radical +
          ' », comme ' + f.mots.filter(function (m) { return m !== bonne; }).join(', ') + '.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.synonyme',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.enrichir.01', 'fra.vocabulaire.reemployer.01'],
    titre: 'Trouver un synonyme',
    generer: function (r) {
      var s = r.choix(SYNONYMES);
      var leurres = CONTRAIRES.map(function (c) { return c.contraire; })
        .concat(SYNONYMES.filter(function (x) { return x.mot !== s.mot; })
                         .map(function (x) { return x.synonyme; }))
        .filter(function (m) { return m !== s.synonyme && m !== s.mot; });

      var choix = Q.construire(r, s.synonyme, r.melanger(leurres), String);

      return {
        enonce: 'Quel mot veut dire à peu près la même chose que « ' + s.mot + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + s.mot + ' » et « ' + s.synonyme + ' » sont des synonymes : ' +
          'ils ont à peu près le même sens.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.contraire',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.enrichir.01'],
    titre: 'Trouver un contraire',
    generer: function (r) {
      var c = r.choix(CONTRAIRES);
      var leurres = CONTRAIRES.filter(function (x) { return x.mot !== c.mot; })
        .map(function (x) { return r.chance() ? x.mot : x.contraire; })
        .filter(function (m) { return m !== c.contraire && m !== c.mot; });

      var choix = Q.construire(r, c.contraire, r.melanger(leurres), String);

      return {
        enonce: 'Quel est le contraire de « ' + c.mot + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: '« ' + c.mot + ' » et « ' + c.contraire + ' » veulent dire le contraire ' +
          'l\'un de l\'autre.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.polysemie',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.relations.01', 'fra.vocabulaire.reemployer.02'],
    titre: 'Un mot, plusieurs sens',
    generer: function (r) {
      var p = r.choix(POLYSEMIQUES);
      var index = r.entier(0, p.sens.length - 1);
      var bonne = p.sens[index];

      var leurres = p.sens.filter(function (s, i) { return i !== index; })
                          .map(function (s) { return s.veut_dire; });
      // On complète avec les sens d'autres mots, pour avoir quatre propositions.
      POLYSEMIQUES.forEach(function (autre) {
        if (autre.mot !== p.mot) leurres.push(r.choix(autre.sens).veut_dire);
      });

      var choix = Q.construire(r, bonne.veut_dire, r.melanger(leurres), String);

      return {
        enonce: 'Dans la phrase « ' + bonne.phrase + ' », que veut dire le mot « ' +
          p.mot + ' » ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'Ici, « ' + p.mot + ' » veut dire ' + bonne.veut_dire +
          '. Le même mot a d\'autres sens ailleurs : c\'est un mot polysémique. ' +
          'C\'est la phrase autour qui dit lequel.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.orthographe_frequent',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.orthographe.01'],
    titre: 'La bonne orthographe',
    generer: function (r) {
      var o = r.choix(ORTHOGRAPHE);
      var choix = Q.construire(r, o.juste, r.melanger(o.faux), String);

      return {
        enonce: 'Quel mot est correctement orthographié ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'On écrit « ' + o.juste + ' ». C\'est un mot fréquent : il vaut la peine ' +
          'de le mémoriser tel quel.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.ordre_alphabetique',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.enrichir.03'],
    titre: 'L\'ordre du dictionnaire',
    generer: function (r) {
      var serie = r.echantillon(r.choix(SERIES_ALPHABET), 4);
      var trie = serie.slice().sort(function (a, b) {
        var x = sansAccent(a), y = sansAccent(b);
        return x < y ? -1 : (x > y ? 1 : 0);
      });

      function afficher(liste) { return liste.join(' ; '); }

      var choix = Q.rangement(r, trie, afficher);

      return {
        enonce: 'Range ces mots comme dans le dictionnaire : ' + afficher(serie),
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: 'On compare la première lettre ; quand elle est la même, on passe à la ' +
          'deuxième, puis à la troisième. Dans l\'ordre : ' + afficher(trie) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'voc.forme_du_dictionnaire',
    matiere: 'francais',
    objectifs: ['fra.vocabulaire.enrichir.03'],
    titre: 'Sous quelle forme chercher un mot ?',
    generer: function (r) {
      var cas = r.entier(1, 3);

      if (cas === 1) {
        var verbe = r.choix(L.verbes.filter(function (v) { return !v.auxiliaire; }));
        var temps = r.choix(C.tempsSimples);
        var forme = C.conjuguer(verbe, temps, r.entier(1, 5));
        return {
          enonce: 'Sous quelle forme faut-il chercher « ' + forme + ' » dans le dictionnaire ?',
          type: 'saisie',
          bonne_reponse: verbe.inf,
          explication: 'Un verbe conjugué se cherche à l\'infinitif : « ' + verbe.inf + ' ».'
        };
      }

      if (cas === 2) {
        var nom = r.choix(L.noms.filter(function (n) { return n.p !== n.s; }));
        return {
          enonce: 'Sous quelle forme faut-il chercher « ' + nom.p + ' » dans le dictionnaire ?',
          type: 'saisie',
          bonne_reponse: nom.s,
          explication: 'Un nom se cherche au singulier : « ' + nom.s + ' ».'
        };
      }

      var adj = r.choix(L.adjectifs.filter(function (a) { return a.f !== a.m; }));
      return {
        enonce: 'Sous quelle forme faut-il chercher « ' + adj.fp + ' » dans le dictionnaire ?',
        type: 'saisie',
        bonne_reponse: adj.m,
        explication: 'Un adjectif se cherche au masculin singulier : « ' + adj.m + ' ».'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
