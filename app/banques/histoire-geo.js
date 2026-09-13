/* Banque de questions d'histoire et de géographie — CM2.

   C'est la banque la plus contrainte du projet, et c'est le référentiel
   lui-même qui l'exige. Le programme d'histoire-géographie est rédigé en
   termes de démarches, pas de listes de faits : il dit comment enseigner, non
   ce qu'il faut retenir. Le risque d'inventer une date y est maximal.

   Quatre règles commandent donc tout ce fichier :

   1. AUCUNE DATE INVENTÉE. Seuls les sept repères du bloc
      reperes_chronologiques sont utilisables. Le référentiel note lui-même que
      les dates des deux guerres mondiales n'y figurent pas, parce que le
      programme ne les énonce pas. Aucune question ne les emploie donc.

   2. ZONE SENSIBLE — thème « La France, des guerres mondiales à l'Union
      européenne ». Les guerres, la Résistance, la collaboration et le génocide
      des Juifs ne font l'objet d'aucun questionnement fermé. Ces contenus se
      traitent en classe avec un adulte. Conséquence directe : le sujet
      « Deux guerres mondiales au vingtième siècle » N'EST PAS COUVERT ICI.
      Le référentiel ne l'autorise que sur ses repères chronologiques, et ces
      repères n'existent pas dans le fichier. Il reste donc vide, et c'est le
      seul sujet évaluable du programme à l'être volontairement.
      Seule la construction européenne, hors zone sensible, est traitée.

   3. AUCUN TERRITOIRE PARTICULIER. Les sujets de géographie reposent sur des
      études de cas choisies localement par le professeur. Aucune question ne
      suppose l'étude de telle ville, de tel quartier ou de tel écoquartier :
      seules les notions générales sont évaluables.

   4. COUVERTURE VARIABLE. Au thème de l'âge industriel, « parmi les sujets
      d'étude proposés, le professeur en choisit deux ». Les quatre sujets sont
      donc marqués optionnel : ils ne sont jamais servis tant que le cahier ne
      les a pas déclarés étudiés. C'est réglable sur le bureau.

   Pipeline habituel : extraire, rédiger, rattacher, contrôler. Les questions
   sont rattachées au sujet d'étude, et celles qui affirment une date citent le
   repère d'où elle vient. tests/banques.js vérifie tout cela, et refuse toute
   année qui ne figurerait pas dans le référentiel. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;

  var BANQUE = [

    /* ================================================== Histoire — thème 1 */

    {
      sujet: 'hg.hist.t1.s1',
      titre: 'Le centenaire de la République',
      questions: [
        {
          q: 'En quelle année la République française a-t-elle fêté ses cent ans ?',
          bonne: '1892',
          leurres: ['1830', '1848', '1870'],
          repere: 'hg.rep.1892',
          explication: 'La République a fêté son centenaire en 1892. Les cérémonies mettaient en scène les symboles républicains.'
        },
        {
          q: 'Que mettaient en scène les cérémonies du centenaire de la République ?',
          bonne: 'les symboles républicains',
          leurres: ['les blasons des anciennes provinces', 'les portraits des rois de France',
                    'les drapeaux des pays voisins'],
          explication: 'Les cérémonies du centenaire mettaient en scène les symboles républicains.'
        },
        {
          /* Trois années figurent au référentiel pour ce sujet — 1830, 1848 et
             1870 — et elles sont également justes. On ne peut donc pas
             demander « laquelle » : la question porte sur les trois ensemble,
             et les leurres n'emploient que des années du référentiel. */
          q: 'Le programme cite trois années d\'expériences politiques vécues par les Français depuis la Révolution. Lesquelles ?',
          bonne: '1830, 1848 et 1870',
          leurres: ['1830, 1848 et 1892', '1848, 1870 et 1892', '1830, 1870 et 1892'],
          repere: 'hg.rep.1830',
          explication: 'Le programme cite 1830, 1848 et 1870 comme années d\'expériences politiques, y compris celles ayant suscité conflits et violences. 1892 est autre chose : l\'année du centenaire de la République.'
        }
      ]
    },

    {
      sujet: 'hg.hist.t1.s2',
      titre: 'L\'école de la République',
      questions: [
        {
          /* Les leurres n'emploient que des années du référentiel : une année
             inventée, même affichée comme fausse, mettrait sous les yeux une
             date que le programme n'énonce pas. */
          q: 'À partir de quelle décennie l\'adhésion à la République se construit-elle en partie par l\'école ?',
          bonne: 'les années 1880',
          leurres: ['les années 1830', 'les années 1870'],
          repere: 'hg.rep.1880',
          explication: 'À partir des années 1880, l\'adhésion à la République se construit en partie par l\'école gratuite, laïque et obligatoire.'
        },
        {
          q: 'Quels sont les trois caractères de l\'école de la République mis en place à cette époque ?',
          bonne: 'gratuite, laïque et obligatoire',
          leurres: ['payante, religieuse et facultative', 'gratuite, religieuse et facultative',
                    'payante, laïque et obligatoire'],
          explication: 'L\'école de la République est gratuite, laïque et obligatoire. C\'est par elle que se construit en partie l\'adhésion à la République.'
        }
      ]
    },

    {
      sujet: 'hg.hist.t1.s3',
      titre: 'Des républiques, une démocratie',
      questions: [
        {
          q: 'Sous quelle République les libertés et les droits sont-ils en vigueur aujourd\'hui en France ?',
          bonne: 'la Ve République',
          leurres: ['la IIIe République', 'la IVe République', 'la IIe République'],
          repere: 'hg.rep.republique_actuelle',
          explication: 'Les libertés et les droits dont nous disposons sont en vigueur sous la Ve République.'
        },
        {
          q: 'La France a-t-elle connu une seule République depuis la Révolution ?',
          bonne: 'non, elle en a connu plusieurs',
          leurres: ['oui, toujours la même', 'non, elle n\'en a jamais connu',
                    'oui, mais seulement depuis cent ans'],
          explication: 'Les Français ont vécu différentes expériences politiques depuis la Révolution : la France a connu plusieurs Républiques, et c\'est la Ve qui est en vigueur aujourd\'hui.'
        }
      ]
    },

    /* ==================================== Histoire — thème 2, au choix du professeur
       Les quatre sujets suivants portent optionnel: true. Le programme dit que
       le professeur en choisit deux : l'application ne devine pas lesquels. */

    {
      sujet: 'hg.hist.t2.s1',
      titre: 'Les énergies de l\'âge industriel',
      optionnel: true,
      questions: [
        {
          q: 'Quelles sont les énergies majeures de l\'âge industriel, dans l\'ordre où elles apparaissent ?',
          bonne: 'le charbon puis le pétrole',
          leurres: ['le pétrole puis le charbon', 'le gaz puis le charbon',
                    'l\'électricité puis le charbon'],
          repere: 'hg.rep.energies',
          explication: 'Les énergies majeures de l\'âge industriel sont le charbon puis le pétrole.'
        },
        {
          q: 'L\'industrialisation a-t-elle été un changement brutal ou un processus long ?',
          bonne: 'un processus qui s\'inscrit dans la durée',
          leurres: ['un changement survenu en une seule année',
                    'un changement qui n\'a touché qu\'un seul métier',
                    'un changement limité aux villes'],
          explication: 'L\'industrialisation est un processus qui s\'inscrit dans la durée et qui touche tous les secteurs de la production.'
        }
      ]
    },

    {
      sujet: 'hg.hist.t2.s2',
      titre: 'Le travail à l\'âge industriel',
      optionnel: true,
      questions: [
        {
          q: 'Quels nouveaux lieux de production apparaissent à l\'âge industriel ?',
          bonne: 'la mine, l\'usine, l\'atelier et le grand magasin',
          leurres: ['le château, l\'abbaye et le marché',
                    'l\'école, la mairie et la gare',
                    'le port, le phare et le moulin à vent'],
          explication: 'Le programme étudie le travail à la mine, à l\'usine, à l\'atelier et au grand magasin : ce sont les nouveaux modes et lieux de production de l\'âge industriel.'
        },
        {
          q: 'L\'industrialisation n\'a-t-elle touché qu\'un seul secteur de la production ?',
          bonne: 'non, elle touche tous les secteurs',
          leurres: ['oui, seulement les mines', 'oui, seulement les usines de textile',
                    'oui, seulement l\'agriculture'],
          explication: 'L\'industrialisation touche tous les secteurs de la production et entraîne de profonds changements sociaux et environnementaux.'
        }
      ]
    },

    {
      sujet: 'hg.hist.t2.s3',
      titre: 'La ville industrielle',
      optionnel: true,
      questions: [
        {
          q: 'Quel effet l\'industrialisation a-t-elle eu sur le monde urbain ?',
          bonne: 'elle l\'a fait évoluer profondément',
          leurres: ['elle l\'a laissé inchangé', 'elle a fait disparaître les villes',
                    'elle a seulement changé le nom des rues'],
          explication: 'L\'industrialisation entraîne des évolutions des mondes urbain et rural, et de profonds changements sociaux et environnementaux.'
        }
      ]
    },

    {
      sujet: 'hg.hist.t2.s4',
      titre: 'Le monde rural à l\'âge industriel',
      optionnel: true,
      questions: [
        {
          q: 'Le monde rural a-t-il été touché par l\'industrialisation ?',
          bonne: 'oui, il a évolué lui aussi',
          leurres: ['non, il est resté à l\'écart', 'non, il a disparu entièrement',
                    'oui, mais seulement dans les villes'],
          explication: 'L\'industrialisation entraîne des évolutions des mondes urbain et rural : la campagne change elle aussi.'
        }
      ]
    },

    /* ================================================== Histoire — thème 3
       Seule la construction européenne est traitée : voir l'en-tête. */

    {
      sujet: 'hg.hist.t3.s2',
      titre: 'La construction européenne',
      questions: [
        {
          q: 'Que sont devenus des pays européens autrefois en guerre les uns contre les autres ?',
          bonne: 'ils sont aujourd\'hui rassemblés au sein de l\'Union européenne',
          leurres: ['ils ont formé un seul pays', 'ils ont cessé tout échange entre eux',
                    'ils sont devenus des provinces françaises'],
          explication: 'Des pays européens autrefois en guerre les uns contre les autres sont aujourd\'hui rassemblés au sein de l\'Union européenne.'
        },
        {
          q: 'La France fait-elle partie de l\'Union européenne ?',
          bonne: 'oui',
          leurres: ['non', 'seulement pour le commerce', 'seulement depuis un an'],
          explication: 'La France est l\'un des pays européens rassemblés au sein de l\'Union européenne.'
        }
      ]
    },

    /* ================================================ Géographie — thème 1 */

    {
      sujet: 'hg.geo.t1.s1',
      titre: 'Se déplacer au quotidien en France',
      questions: [
        {
          q: 'Qu\'appelle-t-on un réseau de transport ?',
          bonne: 'l\'ensemble des voies et des lignes qui relient les lieux entre eux',
          leurres: ['un seul véhicule', 'le nombre d\'habitants d\'une ville',
                    'la vitesse maximale autorisée'],
          explication: 'Les habitants se déplacent grâce à des modes de transport et à des réseaux : l\'ensemble des voies et des lignes qui relient les lieux entre eux.'
        },
        {
          q: 'Qu\'est-ce qu\'un mode de transport ?',
          bonne: 'le moyen employé pour se déplacer, comme le train, la voiture ou le vélo',
          leurres: ['le trajet le plus court entre deux villes',
                    'le prix d\'un billet', 'l\'heure de départ'],
          explication: 'On étudie les modes et les réseaux de transport utilisés par les habitants dans leur quotidien : le mode est le moyen employé pour se déplacer.'
        }
      ]
    },

    {
      sujet: 'hg.geo.t1.s3',
      titre: 'Se déplacer de ville en ville',
      questions: [
        {
          q: 'Comment appelle-t-on les grands équipements qui permettent les déplacements, comme les gares, les autoroutes ou les aéroports ?',
          bonne: 'des infrastructures',
          leurres: ['des mobilités', 'des itinéraires', 'des horaires'],
          explication: 'Les déplacements de ville en ville s\'appuient sur des aménagements liés aux infrastructures de communication.'
        },
        {
          q: 'Les déplacements entre les villes se limitent-ils au territoire français ?',
          bonne: 'non, ils se font aussi en Europe et dans le monde',
          leurres: ['oui, uniquement en France', 'oui, uniquement dans sa région',
                    'non, mais seulement en avion'],
          explication: 'Le programme étudie les déplacements de ville en ville, en France, en Europe et dans le monde.'
        }
      ]
    },

    {
      sujet: 'hg.geo.t1.s4',
      titre: 'Se déplacer et développement durable',
      questions: [
        {
          q: 'Quel déplacement quotidien contribue le moins à la pollution de l\'air ?',
          bonne: 'se déplacer à vélo ou à pied',
          leurres: ['se déplacer seul en voiture', 'se déplacer en avion',
                    'se déplacer en scooter'],
          explication: 'Les déplacements s\'étudient dans le cadre du développement durable : la lutte contre la pollution passe notamment par de nouvelles formes de mobilités.'
        },
        {
          q: 'Pourquoi étudie-t-on les déplacements dans le cadre du développement durable ?',
          bonne: 'parce qu\'ils posent la question de la pollution et des ressources',
          leurres: ['parce qu\'ils font gagner du temps',
                    'parce qu\'ils coûtent de l\'argent',
                    'parce qu\'ils sont obligatoires'],
          explication: 'On étudie les déplacements dans le cadre du développement durable : la lutte contre la pollution, le recyclage, les nouvelles formes de mobilités.'
        }
      ]
    },

    /* ================================================ Géographie — thème 2 */

    {
      sujet: 'hg.geo.t2.s1',
      titre: 'Internet, un monde de réseaux',
      questions: [
        {
          q: 'Internet fonctionne-t-il sans installations matérielles ?',
          bonne: 'non, il repose sur des infrastructures matérielles',
          leurres: ['oui, tout se passe dans les airs',
                    'oui, les données sont dans les nuages',
                    'non, mais seulement dans les grandes villes'],
          explication: 'Le fonctionnement et le développement de l\'Internet supposent des infrastructures matérielles : câbles, antennes et centres de données.'
        },
        {
          q: 'Qu\'est-ce qu\'Internet, du point de vue du géographe ?',
          bonne: 'un réseau qui relie des lieux du monde entier',
          leurres: ['un seul très grand ordinateur', 'une chaîne de télévision',
                    'un programme installé sur chaque appareil'],
          explication: 'Internet est un réseau : il relie des lieux du monde entier grâce à des infrastructures matérielles.'
        }
      ]
    },

    {
      sujet: 'hg.geo.t2.s2',
      titre: 'Un habitant connecté au monde',
      questions: [
        {
          q: 'Quel nouveau rapport au temps les usages d\'Internet créent-ils ?',
          bonne: 'l\'immédiateté',
          leurres: ['la lenteur', 'l\'attente d\'une saison à l\'autre',
                    'le retard systématique'],
          explication: 'Les usages d\'Internet définissent un nouveau rapport à l\'espace et au temps, caractérisé par l\'immédiateté et la proximité.'
        },
        {
          q: 'Quel nouveau rapport à l\'espace les usages d\'Internet créent-ils ?',
          bonne: 'la proximité, même entre lieux éloignés',
          leurres: ['l\'éloignement de tous les lieux', 'la disparition des distances réelles',
                    'l\'impossibilité de communiquer au loin'],
          explication: 'Les usages d\'Internet créent un rapport à l\'espace fait de proximité : on communique d\'un bout à l\'autre du monde.'
        }
      ]
    },

    {
      sujet: 'hg.geo.t2.s3',
      titre: 'Des habitants inégalement connectés',
      questions: [
        {
          q: 'L\'accès à Internet est-il le même partout dans le monde ?',
          bonne: 'non, il existe de fortes inégalités d\'accès',
          leurres: ['oui, il est identique partout', 'oui, depuis que le réseau est mondial',
                    'non, mais seulement entre continents'],
          explication: 'On constate des inégalités d\'accès à l\'Internet en France et dans le monde.'
        },
        {
          q: 'Ces inégalités d\'accès à Internet existent-elles aussi en France ?',
          bonne: 'oui',
          leurres: ['non, la France est entièrement couverte',
                    'non, elles ne concernent que les autres pays',
                    'oui, mais seulement dans les villes'],
          explication: 'Les inégalités d\'accès à l\'Internet se constatent en France comme dans le monde.'
        }
      ]
    },

    /* ================================================ Géographie — thème 3 */

    {
      sujet: 'hg.geo.t3.s1',
      titre: 'La place de la nature en ville',
      questions: [
        {
          q: 'Quel aménagement urbain favorise la place de la nature en ville ?',
          bonne: 'les espaces verts et les corridors verts',
          leurres: ['les parkings souterrains', 'les panneaux publicitaires',
                    'les voies rapides'],
          explication: 'La place réservée dans la ville aux espaces verts, aux circulations douces, aux berges et corridors verts et au développement de la biodiversité contribue au « mieux habiter ».'
        },
        {
          q: 'Qu\'appelle-t-on une circulation douce ?',
          bonne: 'un déplacement sans moteur, comme la marche ou le vélo',
          leurres: ['un trajet en voiture électrique', 'un vol en avion de tourisme',
                    'un déplacement en métro'],
          explication: 'Les circulations douces font partie des aménagements qui améliorent le cadre de vie en ville.'
        }
      ]
    },

    {
      sujet: 'hg.geo.t3.s2',
      titre: 'Recycler',
      questions: [
        {
          q: 'Le recyclage se limite-t-il au tri des déchets ?',
          bonne: 'non, il va au-delà du tri',
          leurres: ['oui, trier suffit', 'oui, c\'est exactement la même chose',
                    'non, il le remplace complètement'],
          explication: 'Le programme parle du recyclage au-delà du tri des déchets : trier n\'est que la première étape.'
        },
        {
          q: 'À quoi sert le recyclage ?',
          bonne: 'à réutiliser la matière des objets usagés',
          leurres: ['à fabriquer plus de déchets', 'à enfouir les déchets plus profondément',
                    'à brûler tous les déchets'],
          explication: 'Recycler, c\'est récupérer la matière d\'objets usagés pour en fabriquer de nouveaux : cela préserve l\'environnement et les ressources.'
        }
      ]
    },

    {
      sujet: 'hg.geo.t3.s3',
      titre: 'L\'écoquartier',
      questions: [
        {
          q: 'Qu\'est-ce qu\'un écoquartier ?',
          bonne: 'un quartier aménagé pour préserver l\'environnement et améliorer le cadre de vie',
          leurres: ['un quartier réservé aux commerces', 'un quartier sans habitants',
                    'un quartier interdit aux piétons'],
          explication: 'L\'aménagement d\'un écoquartier est l\'une des réalisations qui contribuent au « mieux habiter », en réfléchissant aux choix des acteurs dans les politiques de développement durable.'
        },
        {
          q: 'Que cherchent à faire les projets de « mieux habiter » ?',
          bonne: 'améliorer le cadre de vie et préserver l\'environnement',
          leurres: ['construire le plus vite possible', 'augmenter le nombre de voitures',
                    'supprimer les espaces verts'],
          explication: 'Améliorer le cadre de vie et préserver l\'environnement sont au cœur des préoccupations actuelles : c\'est le sens des projets de « mieux habiter ».'
        }
      ]
    }
  ];

  /* Un générateur par sujet d'étude : la notion suivie par la révision espacée
     est alors exactement une entrée du référentiel. */
  BANQUE.forEach(function (bloc) {
    reg.ajouter({
      id: bloc.sujet,
      matiere: 'histoire_geo',
      objectifs: [bloc.sujet],
      titre: bloc.titre,
      optionnel: bloc.optionnel === true,
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
  CM2.banques.histoireGeo = BANQUE;
})(window.CM2 = window.CM2 || {});
