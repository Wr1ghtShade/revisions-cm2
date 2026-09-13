/* Banque de questions du numérique — CRCN, niveaux 1 et 2.

   Le CRCN n'est pas un programme disciplinaire : c'est un cadre de référence
   de compétences. La très grande majorité de ses repères décrit un geste sur
   un outil — utiliser, produire, paramétrer, sauvegarder — qui s'évalue en
   situation, pas par une question fermée. Sur 47 repères des niveaux 1 et 2,
   18 seulement sont marqués évaluables, et c'est déjà beaucoup dire.

   Trois règles du référentiel commandent ce fichier :

   1. ZONE SENSIBLE — le cyberharcèlement ne fait l'objet d'AUCUNE question,
      sous quelque forme que ce soit. L'Éducation nationale impose un
      traitement en classe avec un adulte présent. Le repère correspondant est
      marqué non évaluable, et rien ici ne l'approche. Le numéro national
      contre les violences numériques, le 3018, est rappelé dans la fenêtre
      « à propos », qui s'adresse aux adultes.

   2. AUCUN TEST D'INFORMATIQUE À L'ENTRÉE AU COLLÈGE. Il n'en existe pas.
      Aucune question ne laisse entendre le contraire.

   3. RECOUPEMENT À NE PAS DUPLIQUER — la compétence « Programmer » (num.3.4)
      couvre exactement la partie « Initiation à la pensée informatique » du
      programme de mathématiques, et le bloc « Algorithmes et programmation »
      des sciences. Le référentiel demande de lier plutôt que de générer deux
      fois les mêmes questions : cette compétence n'a donc aucune question
      propre ici. Son repère évaluable est déclaré par les générateurs qui le
      travaillent déjà — suivre une suite d'instructions en mathématiques, lire
      un programme en sciences — de sorte que la couverture se compte quand
      même.

   Pipeline habituel : extraire, rédiger, rattacher, contrôler. Chaque question
   porte l'identifiant du repère dont elle relève. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;

  var BANQUE = [

    /* ==================================== Domaine 1 — Information et données */

    {
      competence: 'num.1.1',
      titre: 'Juger d\'une source d\'information',
      questions: [
        {
          repere: 'num.1.1.n2.04',
          q: 'Une information trouvée sur Internet : que faut-il se demander en premier ?',
          bonne: 'd\'où elle vient et si la source est fiable',
          leurres: ['si elle est écrite en gros caractères',
                    'si elle apparaît en premier dans les résultats',
                    'si beaucoup de gens l\'ont partagée'],
          explication: 'Questionner la fiabilité et la pertinence des sources est la première chose à faire : une information n\'est pas vraie parce qu\'elle est la première affichée ou la plus partagée.'
        },
        {
          repere: 'num.1.1.n2.04',
          q: 'Deux sites donnent des informations contradictoires. Que faire ?',
          bonne: 'chercher qui les publie et recouper avec d\'autres sources',
          leurres: ['croire le site le plus joli', 'croire le premier lu',
                    'choisir au hasard'],
          explication: 'Comparer les sources et regarder qui les publie est la manière de juger de leur fiabilité et de leur pertinence.'
        }
      ]
    },

    {
      competence: 'num.1.2',
      titre: 'Où sont rangés les fichiers',
      questions: [
        {
          repere: 'num.1.2.n2.03',
          q: 'Un fichier enregistré sur le disque de l\'ordinateur est-il accessible depuis un autre ordinateur ?',
          bonne: 'non, il est sur cet ordinateur seulement',
          leurres: ['oui, depuis n\'importe quel ordinateur',
                    'oui, à condition d\'avoir le même clavier',
                    'non, il disparaît dès que l\'ordinateur est éteint'],
          explication: 'Il faut distinguer les différents espaces de stockage : un espace local est sur la machine, un espace en ligne est accessible depuis plusieurs machines, un support amovible se transporte.'
        },
        {
          repere: 'num.1.2.n2.03',
          q: 'Lequel de ces espaces de stockage peut se transporter dans une poche ?',
          bonne: 'une clé USB',
          leurres: ['le disque interne d\'un ordinateur fixe',
                    'un espace de stockage en ligne',
                    'le réseau de l\'école'],
          explication: 'Une clé USB est un support amovible. Le disque interne reste dans la machine, et un espace en ligne n\'a pas de forme matérielle que l\'on transporte.'
        }
      ]
    },

    /* ========================== Domaine 2 — Communication et collaboration */

    {
      competence: 'num.2.1',
      titre: 'Se comporter et réagir en ligne',
      questions: [
        {
          repere: 'num.2.1.n1.01',
          q: 'Un contenu choquant apparaît à l\'écran. Que faire ?',
          bonne: 'arrêter et en parler à un adulte de confiance',
          leurres: ['le montrer à ses camarades', 'continuer à regarder pour comprendre',
                    'le partager pour prévenir les autres'],
          explication: 'Des contenus sur Internet peuvent être inappropriés. La bonne réaction est d\'arrêter et d\'en parler à un adulte de confiance.'
        },
        {
          repere: 'num.2.1.n2.03',
          q: 'Comment s\'adresse-t-on aux autres dans un message en ligne ?',
          bonne: 'avec les mêmes règles de politesse que dans la vie',
          leurres: ['sans politesse, puisque personne ne voit le visage',
                    'en écrivant tout en majuscules pour être sûr d\'être lu',
                    'comme on veut, les règles ne s\'appliquent pas en ligne'],
          explication: 'Les règles de civilité valent lors des interactions en ligne comme ailleurs : être derrière un écran ne les suspend pas.'
        }
      ]
    },

    {
      competence: 'num.2.2',
      titre: 'Partager et publier',
      questions: [
        {
          repere: 'num.2.2.n2.04',
          q: 'Une image trouvée sur Internet peut-elle être réutilisée librement ?',
          bonne: 'non, certains contenus sont protégés par un droit d\'auteur',
          leurres: ['oui, tout ce qui est en ligne est libre',
                    'oui, si on ne la vend pas', 'oui, si on la retrouve deux fois'],
          explication: 'Certains contenus sont protégés par un droit d\'auteur : être accessible en ligne ne veut pas dire être libre d\'usage.'
        },
        {
          repere: 'num.2.2.n2.05',
          q: 'Avant de partager une information, que faut-il pouvoir dire ?',
          bonne: 'd\'où elle vient',
          leurres: ['combien de personnes l\'ont déjà lue', 'à quelle heure elle a été publiée',
                    'si elle est longue ou courte'],
          explication: 'Identifier l\'origine des informations et des contenus partagés fait partie des règles du partage.'
        }
      ]
    },

    {
      competence: 'num.2.4',
      titre: 'La vie privée des autres',
      questions: [
        {
          repere: 'num.2.4.n1.01',
          q: 'Peut-on publier la photo d\'un camarade sans lui demander ?',
          bonne: 'non, il faut son accord',
          leurres: ['oui, si la photo est réussie', 'oui, si on ne donne pas son nom',
                    'oui, entre camarades de la même classe'],
          explication: 'La vie privée de chacun doit être protégée : publier l\'image de quelqu\'un suppose son accord.'
        },
        {
          repere: 'num.2.4.n1.01',
          q: 'Pourquoi faut-il protéger la vie privée des autres en ligne ?',
          bonne: 'parce que ce qui est publié échappe ensuite à celui qui est concerné',
          leurres: ['parce que c\'est interdit de publier quoi que ce soit',
                    'parce que les photos prennent de la place',
                    'parce que cela ralentit le réseau'],
          explication: 'Comprendre la nécessité de protéger la vie privée de chacun, c\'est comprendre qu\'un contenu publié ne se reprend pas.'
        }
      ]
    },

    /* ================================= Domaine 3 — Création de contenus
       La compétence « Programmer » n'a pas de questions ici : voir l'en-tête. */

    {
      competence: 'num.3.3',
      titre: 'Droit d\'auteur, droit à l\'image, données personnelles',
      questions: [
        {
          repere: 'num.3.3.n2.02',
          q: 'Quand on réutilise le texte de quelqu\'un dans un exposé, que faut-il faire ?',
          bonne: 'citer son auteur',
          leurres: ['le recopier sans rien dire', 'le traduire pour qu\'il change',
                    'changer quelques mots et le signer'],
          explication: 'Respecter le droit d\'auteur, c\'est citer l\'auteur de ce que l\'on réutilise.'
        },
        {
          repere: 'num.3.3.n2.02',
          q: 'Comment s\'appelle le droit qui protège l\'usage que l\'on fait de la photo d\'une personne ?',
          bonne: 'le droit à l\'image',
          leurres: ['le droit d\'auteur', 'le droit de copie', 'le droit de partage'],
          explication: 'Le droit à l\'image protège la personne photographiée ; le droit d\'auteur protège celui qui a créé l\'œuvre.'
        }
      ]
    },

    /* ================================== Domaine 4 — Protection et sécurité */

    {
      competence: 'num.4.1',
      titre: 'Protéger son matériel',
      questions: [
        {
          repere: 'num.4.1.n1.01',
          q: 'Un message inattendu demande d\'ouvrir une pièce jointe. Que faire ?',
          bonne: 'ne pas l\'ouvrir et en parler à un adulte',
          leurres: ['l\'ouvrir pour voir ce que c\'est',
                    'la transférer à ses camarades', 'répondre au message'],
          explication: 'Les pièces jointes inattendues font partie des risques principaux qui menacent un environnement informatique.'
        },
        {
          repere: 'num.4.1.n2.03',
          q: 'Qu\'est-ce qui protège le mieux un compte en ligne ?',
          bonne: 'un mot de passe long, gardé secret',
          leurres: ['son prénom suivi de son année de naissance',
                    'le même mot de passe partout, pour ne pas l\'oublier',
                    'un mot de passe écrit sur l\'écran'],
          explication: 'Mettre en œuvre des stratégies de protection, c\'est notamment choisir un mot de passe difficile à deviner et ne pas le communiquer.'
        },
        {
          repere: 'num.4.1.n2.03',
          q: 'Pourquoi faut-il mettre à jour ses logiciels ?',
          bonne: 'parce que les mises à jour corrigent des failles de sécurité',
          leurres: ['pour changer la couleur des fenêtres',
                    'pour libérer de la place sur le disque',
                    'pour accélérer la connexion'],
          explication: 'La mise à jour des logiciels est l\'une des stratégies de protection des ressources matérielles et logicielles.'
        }
      ]
    },

    {
      competence: 'num.4.2',
      titre: 'Les données personnelles et les traces',
      questions: [
        {
          repere: 'num.4.2.n1.01',
          q: 'Laquelle de ces informations est une donnée à caractère personnel ?',
          bonne: 'son adresse de domicile',
          leurres: ['la couleur préférée d\'un personnage de dessin animé',
                    'le nom d\'un fleuve', 'la date d\'une fête nationale'],
          explication: 'Une donnée à caractère personnel permet d\'identifier une personne : nom, adresse, photo, numéro de téléphone. Ce sont celles qu\'il ne faut pas partager.'
        },
        {
          repere: 'num.4.2.n1.01',
          q: 'Un site demande le numéro de téléphone de tes parents pour jouer. Que faire ?',
          bonne: 'ne rien donner et en parler à un adulte',
          leurres: ['le donner, puisque c\'est pour jouer',
                    'donner un numéro inventé et continuer',
                    'demander à un camarade de le donner à sa place'],
          explication: 'Les données à caractère personnel ne se partagent pas. Devant une demande de ce genre, on s\'arrête et on en parle à un adulte.'
        },
        {
          repere: 'num.4.2.n2.02',
          q: 'A-t-on le droit de demander ce qu\'un site sait de nous ?',
          bonne: 'oui, la loi protège les données personnelles et donne ce droit',
          leurres: ['non, une fois donné c\'est perdu',
                    'non, sauf pour les adultes', 'oui, mais seulement en payant'],
          explication: 'Des règles sont attachées à la protection des données personnelles : chacun a des droits sur les données qui le concernent.'
        },
        {
          repere: 'num.4.2.n2.03',
          q: 'Qu\'appelle-t-on les « traces » de navigation ?',
          bonne: 'les informations laissées derrière soi en utilisant Internet',
          leurres: ['les fichiers qu\'on a volontairement enregistrés',
                    'les touches usées du clavier',
                    'les images affichées à l\'écran'],
          explication: 'Naviguer laisse des traces : pages consultées, recherches effectuées, appareil utilisé.'
        },
        {
          repere: 'num.4.2.n2.04',
          q: 'Ces traces de navigation restent-elles privées ?',
          bonne: 'non, elles peuvent être vues, collectées ou analysées par d\'autres',
          leurres: ['oui, personne ne peut y accéder',
                    'oui, elles s\'effacent toutes seules chaque soir',
                    'non, mais seulement si on le demande'],
          explication: 'Les traces peuvent être vues, collectées ou analysées par d\'autres personnes : c\'est pourquoi il faut savoir qu\'elles existent.'
        }
      ]
    },

    {
      competence: 'num.4.3',
      titre: 'Le numérique, la santé et l\'environnement',
      questions: [
        {
          repere: 'num.4.3.n1.01',
          q: 'Quel effet une utilisation non réfléchie des écrans peut-elle avoir ?',
          bonne: 'des effets négatifs sur la santé et l\'équilibre social',
          leurres: ['aucun effet, quelle que soit la durée',
                    'seulement un effet sur la vue', 'un effet uniquement sur les adultes'],
          explication: 'L\'utilisation non réfléchie des technologies numériques peut avoir des impacts négatifs sur la santé et sur l\'équilibre social et psychologique.'
        },
        {
          repere: 'num.4.3.n2.04',
          q: 'Le numérique a-t-il un effet sur l\'environnement ?',
          bonne: 'oui, il consomme de l\'énergie et des ressources',
          leurres: ['non, rien n\'est fabriqué', 'non, tout est virtuel',
                    'oui, mais seulement dans les usines'],
          explication: 'L\'utilisation des technologies numériques a un impact sur l\'environnement : cela justifie des comportements simples pour économiser de l\'énergie et des ressources.'
        },
        {
          repere: 'num.4.3.n2.04',
          q: 'Quel geste simple économise de l\'énergie ?',
          bonne: 'éteindre un appareil plutôt que le laisser en veille',
          leurres: ['garder tous les appareils allumés pour éviter les redémarrages',
                    'augmenter la luminosité de l\'écran',
                    'télécharger deux fois le même fichier'],
          explication: 'Adopter des comportements simples pour économiser de l\'énergie et des ressources fait partie de la compétence : éteindre plutôt que laisser en veille en est un.'
        }
      ]
    },

    /* ================================= Domaine 5 — Environnement numérique */

    {
      competence: 'num.5.1',
      titre: 'De quoi un ordinateur est-il fait',
      questions: [
        {
          repere: 'num.5.1.n1.01',
          q: 'Lequel de ces éléments est un périphérique d\'entrée ?',
          bonne: 'le clavier',
          leurres: ['l\'écran', 'l\'imprimante', 'le haut-parleur'],
          explication: 'Un périphérique d\'entrée transmet une information à l\'ordinateur : clavier, souris, micro. L\'écran, l\'imprimante et le haut-parleur sont des périphériques de sortie.'
        },
        {
          repere: 'num.5.1.n1.01',
          q: 'Lequel de ces éléments est un périphérique de sortie ?',
          bonne: 'l\'imprimante',
          leurres: ['la souris', 'le clavier', 'le microphone'],
          explication: 'Un périphérique de sortie restitue une information produite par l\'ordinateur : écran, imprimante, haut-parleur.'
        }
      ]
    }
  ];

  /* Un générateur par compétence du CRCN. Ses objectifs sont les repères que
     ses questions couvrent réellement. */
  BANQUE.forEach(function (bloc) {
    var reperes = [];
    bloc.questions.forEach(function (q) {
      if (reperes.indexOf(q.repere) === -1) reperes.push(q.repere);
    });

    reg.ajouter({
      id: bloc.competence,
      matiere: 'numerique',
      objectifs: reperes,
      titre: bloc.titre,
      generer: function (r) {
        var question = r.choix(bloc.questions);
        var choix = Q.construire(r, question.bonne, r.melanger(question.leurres), String);
        return {
          enonce: question.q,
          type: 'qcm',
          propositions: choix.propositions,
          bonne_reponse: choix.bonne_reponse,
          explication: question.explication
        };
      }
    });
  });

  /* Exposée pour les contrôles automatiques de tests/banques.js. */
  CM2.banques = CM2.banques || {};
  CM2.banques.numerique = BANQUE;
})(window.CM2 = window.CM2 || {});
