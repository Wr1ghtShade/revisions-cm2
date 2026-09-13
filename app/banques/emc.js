/* Banque de questions d'enseignement moral et civique — CM2, « Vivre en république ».

   L'EMC ne se génère pas : ses contenus ne sont pas paramétrables, ils sont
   institutionnels. Cette banque est donc rédigée, question par question, selon
   le pipeline imposé par le projet :

   1. EXTRAIRE   — ne retenir que les contenus marqués evaluable: true dans
                   data/referentiel/emc-cm2.json. Les deux contenus non
                   évaluables (emc.p1.c04, emc.p3.c01) n'ont aucune question.
   2. RÉDIGER    — n'écrire que ce que dit le texte du programme ou un repère du
                   bloc reperes_memorisables. Aucune connaissance ajoutée de
                   mémoire, aucune date ni aucun numéro d'article inventé.
   3. RATTACHER  — chaque question porte l'identifiant du contenu dont elle
                   relève et, quand elle comporte un repère chiffré,
                   l'identifiant de ce repère. C'est ce qui la rend vérifiable.
   4. CONTRÔLER  — tests/banques.js repasse automatiquement sur la banque :
                   contenus existants et évaluables, repères existants et
                   valeurs conformes, zone sensible respectée.

   Zone sensible. La partie « Respecter les droits de tous » (emc.p3) ne donne
   lieu qu'à UNE question, et seulement sur le point que le référentiel déclare
   évaluable : ces atteintes sont sanctionnées par la loi. Rien sur la gravité,
   rien à qualifier, rien de vécu.

   Trois autres interdits, respectés partout ici : aucun jugement moral, aucune
   opinion personnelle, et rien sur les croyances elles-mêmes — seulement le
   cadre juridique de la laïcité. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;

  var BANQUE = [
    {
      contenu: 'emc.p1.c01',
      titre: 'Citoyenneté, nationalité et droits',
      questions: [
        {
          q: 'À partir de quel moment un citoyen français exerce-t-il ses droits politiques, ' +
             'comme le droit de vote ?',
          bonne: 'à sa majorité',
          leurres: ['dès sa naissance', 'à son entrée au collège', 'dès qu\'il travaille'],
          repere: 'emc.rep.majorite',
          explication: 'Un citoyen bénéficie de droits civils dès sa naissance, et de droits ' +
            'politiques à sa majorité.'
        },
        {
          q: 'Qui bénéficie des droits civils en France ?',
          bonne: 'tout individu',
          leurres: ['seulement les citoyens français', 'seulement les adultes',
                    'seulement les personnes qui votent'],
          explication: 'Tout individu bénéficie de droits civils. Les droits politiques, eux, ' +
            'sont liés à la citoyenneté et s\'exercent à la majorité.'
        },
        {
          q: 'Quel article de la Convention internationale des droits de l\'enfant établit le ' +
             'droit d\'acquérir une nationalité dès la naissance ?',
          bonne: 'l\'article 7',
          leurres: ['l\'article 1er', 'l\'article 3', 'l\'article 11'],
          repere: 'emc.rep.cide_art7',
          explication: 'C\'est l\'article 7 de la Convention internationale des droits de ' +
            'l\'enfant qui établit ce droit.'
        }
      ]
    },

    {
      contenu: 'emc.p1.c02',
      titre: 'Le rôle politique des citoyens',
      questions: [
        {
          q: 'D\'après la Constitution, qui détient la souveraineté nationale ?',
          bonne: 'le peuple',
          leurres: ['le Président de la République', 'le gouvernement', 'les juges'],
          repere: 'emc.rep.souverainete',
          explication: 'C\'est le peuple. L\'article 3 de la Déclaration des droits de l\'homme ' +
            'et du citoyen et l\'article 3 de la Constitution affirment que la souveraineté ' +
            'nationale lui appartient.'
        },
        {
          q: 'À quoi les citoyennes et les citoyens ont-ils vocation à participer ?',
          bonne: 'à la vie politique du pays et à l\'évolution des institutions',
          leurres: ['à l\'écriture des jugements des tribunaux',
                    'à la nomination des fonctionnaires',
                    'à la rédaction des programmes scolaires'],
          explication: 'Les citoyens ont vocation à participer à la vie politique du pays et à ' +
            'l\'évolution des institutions. C\'est ce que permettent notamment les élections.'
        }
      ]
    },

    {
      contenu: 'emc.p1.c03',
      titre: 'Les devoirs du citoyen',
      questions: [
        {
          q: 'Quels sont les devoirs de toute personne qui réside sur le territoire français ?',
          bonne: 'respecter les lois et contribuer à financer les dépenses publiques',
          leurres: ['voter à chaque élection et connaître l\'hymne national',
                    'appartenir à une association et payer un abonnement',
                    'travailler et posséder un logement'],
          explication: 'Respecter les lois et contribuer au financement des dépenses publiques ' +
            'sont des devoirs de toute personne résidant en France, pas seulement des citoyens.'
        },
        {
          q: 'Quel article de la Déclaration des droits de l\'homme et du citoyen fonde la ' +
             'participation de chacun au financement des dépenses de l\'État ?',
          bonne: 'l\'article 13',
          leurres: ['l\'article 2', 'l\'article 10', 'l\'article 11'],
          repere: 'emc.rep.ddhc_art13',
          explication: 'C\'est l\'article 13 de la Déclaration des droits de l\'homme et du ' +
            'citoyen. L\'article 3, lui, énonce que la souveraineté appartient au peuple.'
        },
        {
          q: 'Pourquoi chaque citoyen doit-il respecter les droits des autres ?',
          bonne: 'parce que leurs droits sont identiques aux siens',
          leurres: ['parce qu\'il y est obligé par son école',
                    'parce que les autres ont plus de droits que lui',
                    'parce que les droits changent selon les personnes'],
          explication: 'Chaque citoyen doit respecter les droits des autres, qui sont identiques ' +
            'aux siens.'
        }
      ]
    },

    {
      contenu: 'emc.p1.c05',
      titre: 'Les symboles de la République',
      questions: [
        {
          q: 'Quelle est la devise de la République française ?',
          bonne: 'Liberté, Égalité, Fraternité',
          leurres: ['Liberté, Justice, Solidarité', 'Égalité, Fraternité, Respect',
                    'Union, Travail, Patrie'],
          repere: 'emc.rep.devise',
          explication: 'La devise de la République est « Liberté, Égalité, Fraternité ». ' +
            'Elle figure dans l\'article 2 de la Constitution.'
        },
        {
          q: 'Quel est l\'hymne national français ?',
          bonne: 'La Marseillaise',
          leurres: ['Le Chant du départ', 'La Marche républicaine', 'L\'Hymne à la joie'],
          repere: 'emc.rep.hymne',
          explication: 'L\'hymne national est La Marseillaise, mentionnée par l\'article 2 de ' +
            'la Constitution.'
        },
        {
          q: 'Quel est le drapeau national français ?',
          bonne: 'Le drapeau tricolore, bleu, blanc, rouge',
          leurres: ['Le drapeau tricolore, bleu, blanc, vert',
                    'Le drapeau tricolore, rouge, jaune, bleu',
                    'Le drapeau à deux bandes, bleu et rouge'],
          repere: 'emc.rep.drapeau',
          explication: 'Le drapeau tricolore, bleu, blanc, rouge, est mentionné par l\'article 2 ' +
            'de la Constitution, comme l\'hymne et la devise.'
        },
        {
          q: 'Lequel de ces symboles de la République n\'est pas mentionné par la Constitution ?',
          bonne: 'Marianne',
          leurres: ['le drapeau tricolore', 'La Marseillaise', 'la devise'],
          repere: 'emc.rep.marianne',
          explication: 'Le drapeau, l\'hymne et la devise figurent dans la Constitution. ' +
            'Marianne est un symbole coutumier : elle représente la République sans être citée ' +
            'par le texte.'
        },
        {
          q: 'Quelle est la date de la fête nationale française ?',
          bonne: 'le 14 juillet',
          leurres: ['le 11 novembre', 'le 8 mai', 'le 1er mai'],
          repere: 'emc.rep.fete_nationale',
          explication: 'La fête nationale est le 14 juillet.'
        },
        {
          q: 'De quelle fête de 1790 la fête nationale du 14 juillet est-elle l\'héritière ?',
          bonne: 'la Fête de la Fédération',
          leurres: ['la Fête de la Constitution', 'la Fête des Républiques',
                    'la Fête de la Liberté'],
          repere: 'emc.rep.federation',
          explication: 'La fête nationale du 14 juillet est l\'héritière de la Fête de la ' +
            'Fédération, célébrée en 1790.'
        }
      ]
    },

    {
      contenu: 'emc.p1.c06',
      titre: 'La France et l\'Union européenne',
      questions: [
        {
          q: 'De quelle union la République française est-elle membre ?',
          bonne: 'l\'Union européenne',
          leurres: ['l\'Union des États du Nord', 'l\'Union latine',
                    'l\'Union des républiques francophones'],
          repere: 'emc.rep.ue',
          explication: 'La République française est membre de l\'Union européenne.'
        }
      ]
    },

    {
      contenu: 'emc.p2.c01',
      titre: 'Les grands textes des droits et libertés',
      questions: [
        {
          q: 'En quelle année la Déclaration des droits de l\'homme et du citoyen a-t-elle été adoptée ?',
          bonne: '1789',
          leurres: ['1848', '1905', '1958'],
          repere: 'emc.rep.ddhc',
          explication: 'La Déclaration des droits de l\'homme et du citoyen date de 1789.'
        },
        {
          q: 'En quelle année la Déclaration universelle des droits de l\'homme a-t-elle été adoptée ?',
          bonne: '1948',
          leurres: ['1789', '1918', '2000'],
          repere: 'emc.rep.dudh',
          explication: 'La Déclaration universelle des droits de l\'homme date de 1948. ' +
            'Elle est universelle : elle ne concerne pas que la France.'
        },
        {
          q: 'En quelle année la Charte des droits fondamentaux de l\'Union européenne a-t-elle ' +
             'été proclamée ?',
          bonne: '2000',
          leurres: ['1789', '1948', '1958'],
          repere: 'emc.rep.charte_ue',
          explication: 'La Charte des droits fondamentaux de l\'Union européenne date de 2000.'
        },
        {
          q: 'De quelle année date la Constitution de la Ve République ?',
          bonne: '1958',
          leurres: ['1789', '1905', '1848'],
          repere: 'emc.rep.constitution',
          explication: 'La Constitution de la Ve République, celle qui est en vigueur ' +
            'aujourd\'hui, date de 1958.'
        },
        {
          q: 'Quel article de la Déclaration des droits de l\'homme et du citoyen énonce la ' +
             'liberté d\'opinion ?',
          bonne: 'l\'article 10',
          leurres: ['l\'article 2', 'l\'article 11', 'l\'article 13'],
          repere: 'emc.rep.ddhc_art10',
          explication: 'La liberté d\'opinion est énoncée par l\'article 10. L\'article 11, lui, ' +
            'énonce la liberté d\'expression.'
        },
        {
          q: 'Quel article de la Déclaration des droits de l\'homme et du citoyen énonce le ' +
             'droit à la sûreté ?',
          bonne: 'l\'article 2',
          leurres: ['l\'article 10', 'l\'article 11', 'l\'article 13'],
          repere: 'emc.rep.ddhc_art2',
          explication: 'Le droit à la sûreté est énoncé par l\'article 2 de la Déclaration des ' +
            'droits de l\'homme et du citoyen.'
        }
      ]
    },

    {
      contenu: 'emc.p2.c02',
      titre: 'Les droits qui découlent des grands textes',
      questions: [
        {
          q: 'Comment appelle-t-on le droit de vote reconnu à tous les citoyens majeurs ?',
          bonne: 'le suffrage universel',
          leurres: ['le suffrage censitaire', 'le suffrage partiel', 'le suffrage obligatoire'],
          explication: 'Le suffrage universel est le droit de vote reconnu à tous les citoyens ' +
            'majeurs, sans condition de fortune.'
        },
        {
          q: 'Parmi ces droits, lequel figure parmi les droits économiques et sociaux cités par ' +
             'le programme ?',
          bonne: 'le droit à la protection de la santé',
          leurres: ['le droit de circuler sans permis de conduire',
                    'le droit de ne pas respecter les lois',
                    'le droit de ne pas payer d\'impôts'],
          explication: 'Le droit à la protection de la santé fait partie des droits économiques ' +
            'et sociaux, avec le droit à l\'emploi, la gratuité de l\'enseignement public et ' +
            'l\'accès à la culture.'
        },
        {
          q: 'Quel droit garantit que l\'école publique ne coûte rien aux familles ?',
          bonne: 'le droit à la gratuité de l\'enseignement public',
          leurres: ['le droit à l\'emploi', 'le droit à la protection de la santé',
                    'le droit d\'accès à la culture'],
          explication: 'La gratuité de l\'enseignement public fait partie des droits reconnus ' +
            'par les grands textes.'
        }
      ]
    },

    {
      contenu: 'emc.p2.c03',
      titre: 'Les libertés s\'exercent dans le cadre de la loi',
      questions: [
        {
          q: 'La liberté d\'expression permet-elle de dire absolument tout ?',
          bonne: 'non, elle s\'exerce dans le cadre de la loi',
          leurres: ['oui, sans aucune limite',
                    'non, il faut demander une autorisation avant de parler',
                    'oui, sauf à l\'école'],
          explication: 'Les droits fondamentaux s\'exercent dans le cadre de la loi. La liberté ' +
            'd\'expression est un droit, mais la loi fixe ce qui n\'est pas permis.'
        },
        {
          q: 'Quel article de la Déclaration des droits de l\'homme et du citoyen énonce la ' +
             'liberté d\'expression ?',
          bonne: 'l\'article 11',
          leurres: ['l\'article 2', 'l\'article 10', 'l\'article 13'],
          repere: 'emc.rep.ddhc_art11',
          explication: 'La liberté d\'expression est énoncée par l\'article 11 de la Déclaration ' +
            'des droits de l\'homme et du citoyen.'
        },
        {
          q: 'De quand date la loi sur la liberté de la presse, de l\'imprimerie et de la librairie ?',
          bonne: 'du 29 juillet 1881',
          leurres: ['du 9 décembre 1905', 'du 4 octobre 1958', 'du 14 juillet 1790'],
          repere: 'emc.rep.loi_presse',
          explication: 'La loi sur la liberté de la presse date du 29 juillet 1881.'
        }
      ]
    },

    {
      contenu: 'emc.p2.c04',
      titre: 'Le droit à un environnement sain',
      questions: [
        {
          q: 'Quel article de la Charte de l\'environnement énonce le droit de vivre dans un ' +
             'environnement équilibré et respectueux de la santé ?',
          bonne: 'l\'article 1er',
          leurres: ['l\'article 2', 'l\'article 10', 'l\'article 13'],
          repere: 'emc.rep.charte_env_art1',
          explication: 'C\'est l\'article 1er de la Charte de l\'environnement.'
        },
        {
          q: 'Que garantit l\'article 1er de la Charte de l\'environnement ?',
          bonne: 'le droit de vivre dans un environnement équilibré et respectueux de la santé',
          leurres: ['le droit de choisir son lieu de vacances',
                    'le droit de construire où l\'on veut',
                    'le droit de ne pas trier ses déchets'],
          repere: 'emc.rep.charte_env_art1',
          explication: 'L\'article 1er de la Charte de l\'environnement énonce le droit de ' +
            'chacun de vivre dans un environnement équilibré et respectueux de la santé.'
        }
      ]
    },

    {
      /* ZONE SENSIBLE — une seule question, sur le seul point que le référentiel
         déclare évaluable : ces atteintes sont sanctionnées par la loi. */
      contenu: 'emc.p3.c02',
      titre: 'Ce que dit la loi sur les atteintes aux personnes',
      zoneSensible: true,
      questions: [
        {
          q: 'Le racisme, l\'antisémitisme, le sexisme, la xénophobie, l\'homophobie et le ' +
             'harcèlement sont des atteintes aux personnes. Que prévoit la loi française ?',
          bonne: 'elle les sanctionne',
          leurres: ['elle ne s\'en occupe pas', 'elle les autorise si personne ne se plaint',
                    'elle ne les sanctionne qu\'entre adultes'],
          explication: 'L\'expression des discriminations est sanctionnée par la loi. ' +
            'Si tu es concerné par une situation de ce genre, parles-en à un adulte de confiance.'
        }
      ]
    },

    {
      contenu: 'emc.p4.c01',
      titre: 'La laïcité à l\'école',
      questions: [
        {
          q: 'À l\'école publique, que protège la loi ?',
          bonne: 'la liberté de conscience des élèves',
          leurres: ['l\'enseignement d\'une religion à tous les élèves',
                    'l\'obligation pour chacun de dire ses croyances',
                    'l\'interdiction d\'étudier les religions en histoire'],
          explication: 'La loi protège les élèves de toute influence religieuse et préserve leur ' +
            'liberté de conscience. Le respect des croyances est assuré, mais leur expression ' +
            'est limitée par la loi.'
        },
        {
          q: 'Quelle est la date de la Journée de la laïcité ?',
          bonne: 'le 9 décembre',
          leurres: ['le 14 juillet', 'le 11 novembre', 'le 1er septembre'],
          repere: 'emc.rep.journee_laicite',
          explication: 'La Journée de la laïcité est le 9 décembre.'
        },
        {
          q: 'De quelle année date la loi comprise comme principe d\'organisation de la société ' +
             'en matière de laïcité ?',
          bonne: '1905',
          leurres: ['1789', '1881', '1958'],
          repere: 'emc.rep.loi_1905',
          explication: 'La loi de 1905 est comprise comme le principe d\'organisation de la ' +
            'société en matière de laïcité.'
        },
        {
          q: 'De quelles années datent les lois scolaires fondant l\'école gratuite, laïque et ' +
             'obligatoire ?',
          bonne: '1881-1882',
          leurres: ['1789-1790', '1905-1906', '1958-1959'],
          repere: 'emc.rep.lois_scolaires',
          explication: 'Les lois scolaires de 1881-1882 ont fondé l\'école gratuite, laïque et ' +
            'obligatoire.'
        }
      ]
    },

    {
      contenu: 'emc.p4.c02',
      titre: 'Croyances et convictions de chacun',
      questions: [
        {
          q: 'Que dit la règle au sujet des croyances et des convictions de chacun ?',
          bonne: 'nul ne peut être discriminé pour les siennes, et nul ne peut imposer les siennes aux autres',
          leurres: ['chacun doit faire connaître les siennes à l\'école',
                    'seules certaines convictions sont autorisées',
                    'il est interdit d\'en avoir à l\'école'],
          explication: 'Nul ne peut être discriminé pour sa croyance ou ses convictions, mais ' +
            'nul n\'a non plus le droit d\'imposer ses croyances ou ses convictions aux autres.'
        }
      ]
    }
  ];

  /* Un générateur par contenu du programme : la notion suivie par la révision
     espacée est alors exactement une entrée du référentiel. */
  BANQUE.forEach(function (bloc) {
    reg.ajouter({
      id: bloc.contenu,
      matiere: 'emc',
      objectifs: [bloc.contenu],
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
  CM2.banques.emc = BANQUE;
})(window.CM2 = window.CM2 || {});
