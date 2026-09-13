/* Banque de questions de sciences et technologie — cours moyen.

   Comme l'EMC, les sciences ne se génèrent pas : leurs contenus sont des faits
   institutionnels, pas des paramètres. Même pipeline en quatre étapes :

   1. EXTRAIRE   — ne retenir que les objectifs marqués evaluable: true dans
                   data/referentiel/sciences-cm2.json. Les 21 objectifs non
                   évaluables — réaliser un circuit, fabriquer une maquette,
                   mener un projet — n'ont aucune question : il n'y a pas de
                   fait à restituer derrière un geste.
   2. RÉDIGER    — n'écrire que ce que dit l'intitulé du programme. Les
                   parenthèses des intitulés sont la source la plus sûre :
                   « solide (forme et volume propres) » donne la définition
                   exacte, sans rien ajouter de mémoire.
   3. RATTACHER  — chaque question porte l'identifiant de l'objectif dont elle
                   relève. C'est ce qui la rend vérifiable.
   4. CONTRÔLER  — tests/banques.js repasse dessus : objectifs existants et
                   évaluables, aucun objectif non évaluable couvert, tous les
                   objectifs évaluables couverts, interdits respectés.

   Un générateur par bloc du programme, et non par objectif : le bloc est
   l'unité qui porte un titre lisible (« Propriétés de la matière »), et
   regrouper ses questions donne à la révision espacée de quoi varier. Les
   objectifs de chaque bloc sont déclarés au registre, donc la couverture du
   programme se compte objectif par objectif comme ailleurs.

   Quatre interdits du référentiel commandent ce fichier :

   - rien sur un objectif non évaluable ;
   - rien sur la reproduction humaine au-delà du vocabulaire anatomique et des
     changements de la puberté tels que le programme les énonce ;
   - les unités de masse se limitent à tonne, quintal, kilogramme, gramme et
     milligramme ;
   - les seules formes d'énergie exigibles sont la pesanteur, la cinétique et
     l'électrique — et jamais leur dépendance à la masse.

   Le programme ne distingue pas le CM1 du CM2 : il fixe un socle unique de fin
   de cours moyen. Aucune question ne présente donc un contenu comme « du CM2 ».
   Deux blocs — « Problème technique » et « Processus de réalisation de
   maquettes » — n'ont aucun objectif évaluable et n'apparaissent pas ici. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var Q = CM2.qcm;

  var BANQUE = [

    /* ============================ Thématique 1 — Matière, mouvement, énergie */

    {
      bloc: 'sci.t1.p1.b1',
      titre: 'Les propriétés de la matière',
      questions: [
        {
          objectif: 'sci.t1.p1.b1.01',
          q: 'Lequel de ces matériaux est directement disponible dans la nature, sans être fabriqué ni transformé par l\'être humain ?',
          bonne: 'le bois d\'un arbre',
          leurres: ['le verre', 'le plastique', 'le béton'],
          explication: 'Le bois se trouve tel quel dans la nature. Le verre, le plastique et le béton sont fabriqués ou transformés par l\'être humain.'
        },
        {
          objectif: 'sci.t1.p1.b1.02',
          q: 'Quel état physique se reconnaît à ce qu\'il a un volume propre, mais pas de forme propre ?',
          bonne: 'l\'état liquide',
          leurres: ['l\'état solide', 'l\'état gazeux', 'aucun des trois'],
          explication: 'Un solide a une forme propre et un volume propre. Un liquide a un volume propre mais pas de forme propre : il prend celle du récipient. Un gaz n\'a ni forme propre ni volume propre.'
        },
        {
          objectif: 'sci.t1.p1.b1.02',
          q: 'Qu\'est-ce qui caractérise l\'état gazeux ?',
          bonne: 'ni forme propre ni volume propre',
          leurres: ['une forme propre et un volume propre', 'un volume propre sans forme propre',
                    'une forme propre sans volume propre'],
          explication: 'Un gaz occupe tout l\'espace disponible : il n\'a ni forme propre ni volume propre.'
        },
        {
          objectif: 'sci.t1.p1.b1.03',
          q: 'Que veut dire qu\'un changement d\'état est réversible ?',
          bonne: 'la matière peut revenir à son état de départ',
          leurres: ['la matière change de nature', 'le changement ne peut avoir lieu qu\'une fois',
                    'la matière disparaît'],
          explication: 'Un changement d\'état réversible peut se faire dans les deux sens : l\'eau qui gèle peut fondre de nouveau, et la matière revient à son état de départ.'
        },
        {
          objectif: 'sci.t1.p1.b1.04',
          q: 'Sous quel état physique l\'eau se trouve-t-elle dans un nuage de vapeur invisible au-dessus d\'une casserole qui bout ?',
          bonne: 'à l\'état gazeux',
          leurres: ['à l\'état solide', 'à l\'état liquide', 'elle n\'a plus d\'état'],
          explication: 'Dans la nature comme dans la cuisine, l\'eau se rencontre sous les trois états : solide dans la glace, liquide dans la pluie, gazeux dans la vapeur d\'eau.'
        },
        {
          objectif: 'sci.t1.p1.b1.04',
          q: 'Sous quel état physique l\'eau se trouve-t-elle dans la banquise ?',
          bonne: 'à l\'état solide',
          leurres: ['à l\'état liquide', 'à l\'état gazeux', 'sous les trois états à la fois'],
          explication: 'La banquise est de l\'eau à l\'état solide. L\'eau se rencontre dans la nature sous les trois états physiques.'
        }
      ]
    },

    {
      bloc: 'sci.t1.p1.b2',
      titre: 'Les unités de masse',
      questions: [
        {
          objectif: 'sci.t1.p1.b2.03',
          q: 'Combien de grammes y a-t-il dans un kilogramme ?',
          bonne: '1 000 g',
          leurres: ['100 g', '10 g', '10 000 g'],
          explication: '1 kg = 1 000 g. Les unités de masse du programme sont la tonne, le quintal, le kilogramme, le gramme et le milligramme.'
        },
        {
          objectif: 'sci.t1.p1.b2.03',
          q: 'Combien de kilogrammes y a-t-il dans une tonne ?',
          bonne: '1 000 kg',
          leurres: ['100 kg', '10 kg', '10 000 kg'],
          explication: '1 t = 1 000 kg. Une tonne vaut aussi 10 quintaux, puisqu\'un quintal vaut 100 kg.'
        },
        {
          objectif: 'sci.t1.p1.b2.03',
          q: 'Combien de kilogrammes pèse un quintal ?',
          bonne: '100 kg',
          leurres: ['10 kg', '1 000 kg', '50 kg'],
          explication: 'Un quintal vaut 100 kg. Dix quintaux font une tonne.'
        },
        {
          objectif: 'sci.t1.p1.b2.03',
          q: 'Combien de milligrammes y a-t-il dans un gramme ?',
          bonne: '1 000 mg',
          leurres: ['100 mg', '10 mg', '10 000 mg'],
          explication: '1 g = 1 000 mg. Le milligramme est la plus petite des unités de masse au programme.'
        }
      ]
    },

    {
      bloc: 'sci.t1.p1.b3',
      titre: 'Les mélanges',
      questions: [
        {
          objectif: 'sci.t1.p1.b3.01',
          q: 'Quelle méthode sépare un mélange de sable et d\'eau en retenant le sable dans un papier ?',
          bonne: 'la filtration',
          leurres: ['le tamisage', 'la décantation', 'l\'évaporation'],
          explication: 'La filtration retient les solides dans le filtre et laisse passer le liquide. Le tamisage sépare des solides de tailles différentes, la décantation laisse les particules se déposer au fond.'
        },
        {
          objectif: 'sci.t1.p1.b3.01',
          q: 'Quelle méthode sépare un mélange de gros cailloux et de sable fin, sans eau ?',
          bonne: 'le tamisage',
          leurres: ['la filtration', 'la décantation', 'la dissolution'],
          explication: 'Le tamisage sépare des solides selon leur taille : les petits passent à travers le tamis, les gros restent dessus.'
        },
        {
          objectif: 'sci.t1.p1.b3.01',
          q: 'Comment appelle-t-on le fait de laisser reposer un mélange pour que les particules se déposent au fond ?',
          bonne: 'la décantation',
          leurres: ['le tamisage', 'la filtration', 'l\'ébullition'],
          explication: 'La décantation consiste à laisser le mélange au repos : les particules les plus lourdes se déposent au fond.'
        },
        {
          objectif: 'sci.t1.p1.b3.02',
          q: 'Du sel a été dissous dans de l\'eau. Comment le récupérer ?',
          bonne: 'en laissant l\'eau s\'évaporer',
          leurres: ['en filtrant le mélange', 'en tamisant le mélange', 'il est impossible de le récupérer'],
          explication: 'Le sel dissous passe à travers le filtre : la filtration ne le retient pas. En laissant l\'eau s\'évaporer, le sel reste.'
        },
        {
          objectif: 'sci.t1.p1.b3.03',
          q: 'On pèse 200 g d\'eau, puis on y dissout 20 g de sel. Que pèse le mélange obtenu ?',
          bonne: '220 g',
          leurres: ['200 g', '180 g', '20 g'],
          explication: 'La masse totale se conserve lors du mélange : la masse du mélange est la somme des masses, soit 200 + 20 = 220 g.'
        },
        {
          objectif: 'sci.t1.p1.b3.03',
          q: 'Que devient la masse totale quand on dissout un solide dans un liquide ?',
          bonne: 'elle se conserve',
          leurres: ['elle diminue', 'elle augmente', 'elle est divisée par deux'],
          explication: 'Le solide dissous ne disparaît pas : la masse totale du mélange est égale à la somme des masses du liquide et du solide.'
        }
      ]
    },

    {
      bloc: 'sci.t1.p2.b1',
      titre: 'Les mouvements',
      questions: [
        {
          objectif: 'sci.t1.p2.b1.01',
          q: 'Comment appelle-t-on le mouvement d\'un objet qui se déplace en ligne droite ?',
          bonne: 'un mouvement rectiligne',
          leurres: ['un mouvement circulaire', 'un mouvement immobile', 'un mouvement irréversible'],
          explication: 'Un mouvement rectiligne suit une ligne droite ; un mouvement circulaire suit un cercle.'
        },
        {
          objectif: 'sci.t1.p2.b1.01',
          q: 'Un enfant est assis dans un manège qui tourne. Par rapport au sol, quel est son mouvement ?',
          bonne: 'un mouvement circulaire',
          leurres: ['un mouvement rectiligne', 'il est immobile', 'il n\'a pas de mouvement'],
          explication: 'Décrire un mouvement suppose de préciser le point de vue : par rapport au sol l\'enfant décrit un cercle, mais par rapport au manège il est immobile.'
        },
        {
          objectif: 'sci.t1.p2.b1.01',
          q: 'Pourquoi faut-il préciser le point de vue quand on décrit un mouvement ?',
          bonne: 'parce qu\'un même objet peut être immobile pour l\'un et en mouvement pour l\'autre',
          leurres: ['parce que le mouvement change de nom selon l\'heure',
                    'parce que la vitesse est toujours la même',
                    'parce qu\'un objet ne peut avoir qu\'un seul mouvement'],
          explication: 'Un passager assis dans un train est immobile par rapport au wagon, et en mouvement par rapport au quai. Le mouvement se décrit toujours par rapport à quelque chose.'
        },
        {
          objectif: 'sci.t1.p2.b1.03',
          q: 'Comment mesure-t-on la durée du déplacement d\'un objet ?',
          bonne: 'en mesurant l\'intervalle entre l\'instant de départ et l\'instant d\'arrivée',
          leurres: ['en mesurant la distance parcourue', 'en comptant le nombre d\'arrêts',
                    'en pesant l\'objet'],
          explication: 'Une durée est l\'intervalle entre deux instants : celui du départ et celui de l\'arrivée.'
        },
        {
          objectif: 'sci.t1.p2.b1.04',
          q: 'Combien de mètres y a-t-il dans un kilomètre ?',
          bonne: '1 000 m',
          leurres: ['100 m', '10 m', '10 000 m'],
          explication: '1 km = 1 000 m.'
        },
        {
          objectif: 'sci.t1.p2.b1.04',
          q: 'Combien de secondes y a-t-il dans une heure ?',
          bonne: '3 600 s',
          leurres: ['60 s', '600 s', '1 000 s'],
          explication: 'Une heure vaut 60 minutes, et une minute vaut 60 secondes : 60 × 60 = 3 600 s.'
        }
      ]
    },

    {
      bloc: 'sci.t1.p3.b1',
      titre: 'Les formes d\'énergie',
      questions: [
        {
          objectif: 'sci.t1.p3.b1.02',
          q: 'Comment appelle-t-on la forme d\'énergie liée au mouvement d\'un objet ?',
          bonne: 'l\'énergie cinétique',
          leurres: ['l\'énergie de pesanteur', 'l\'énergie électrique', 'l\'énergie de position'],
          explication: 'L\'énergie cinétique est liée au mouvement. L\'énergie de pesanteur, elle, dépend de l\'altitude sur Terre.'
        },
        {
          objectif: 'sci.t1.p3.b1.02',
          q: 'De quoi dépend l\'énergie de pesanteur d\'un objet sur Terre ?',
          bonne: 'de son altitude',
          leurres: ['de sa couleur', 'de sa température', 'du jour de la semaine'],
          explication: 'L\'énergie de pesanteur dépend de l\'altitude sur Terre : c\'est ce qui permet à une centrale hydro-électrique de produire de l\'électricité avec de l\'eau retenue en hauteur.'
        },
        {
          objectif: 'sci.t1.p3.b1.02',
          q: 'Dans une éolienne, quelle forme d\'énergie est produite à partir du mouvement des pales ?',
          bonne: 'l\'énergie électrique',
          leurres: ['l\'énergie de pesanteur', 'l\'énergie du vent seule', 'aucune énergie'],
          explication: 'Une éolienne convertit le mouvement de ses pales en énergie électrique. Les trois formes d\'énergie étudiées au cours moyen sont la pesanteur, la cinétique et l\'électrique.'
        }
      ]
    },

    {
      bloc: 'sci.t1.p4.b1',
      titre: 'La lumière, les ombres et la Lune',
      questions: [
        {
          objectif: 'sci.t1.p4.b1.01',
          q: 'Comment appelle-t-on un objet qui ne laisse pas du tout passer la lumière ?',
          bonne: 'un objet opaque',
          leurres: ['un objet transparent', 'un objet translucide', 'un objet lumineux'],
          explication: 'Un objet transparent laisse passer la lumière et voir au travers ; un objet translucide laisse passer la lumière sans qu\'on voie nettement au travers ; un objet opaque ne la laisse pas passer.'
        },
        {
          objectif: 'sci.t1.p4.b1.01',
          q: 'Une vitre dépolie laisse passer la lumière, mais on ne distingue pas ce qu\'il y a derrière. Comment la qualifie-t-on ?',
          bonne: 'translucide',
          leurres: ['transparente', 'opaque', 'réfléchissante'],
          explication: 'Un objet translucide laisse passer la lumière sans permettre de voir nettement au travers.'
        },
        {
          objectif: 'sci.t1.p4.b1.02',
          q: 'Que faut-il pour obtenir une ombre ?',
          bonne: 'une source de lumière et un objet opaque',
          leurres: ['une source de lumière seule', 'un objet transparent et de l\'eau',
                    'de l\'obscurité complète'],
          explication: 'Une ombre est un déficit de lumière associé à une source : il faut une source de lumière et un objet opaque qui l\'arrête.'
        },
        {
          objectif: 'sci.t1.p4.b1.02',
          q: 'Comment appelle-t-on l\'ombre qui se forme sur la face non éclairée de l\'objet lui-même ?',
          bonne: 'l\'ombre propre',
          leurres: ['l\'ombre portée', 'la pénombre', 'le reflet'],
          explication: 'L\'ombre propre est sur l\'objet, du côté qui n\'est pas éclairé. L\'ombre portée est celle que l\'objet projette sur une autre surface.'
        },
        {
          objectif: 'sci.t1.p4.b1.02',
          q: 'Comment appelle-t-on l\'ombre qu\'un objet projette sur le sol ou sur un mur ?',
          bonne: 'l\'ombre portée',
          leurres: ['l\'ombre propre', 'l\'ombre chinoise', 'la source'],
          explication: 'L\'ombre portée est projetée par l\'objet sur une autre surface ; l\'ombre propre reste sur l\'objet.'
        },
        {
          objectif: 'sci.t1.p4.b1.03',
          q: 'Comment appelle-t-on la phase où la Lune n\'est pas visible depuis la Terre ?',
          bonne: 'la nouvelle lune',
          leurres: ['la pleine lune', 'le premier quartier', 'le dernier quartier'],
          explication: 'Les phases de la Lune se succèdent : nouvelle lune, premier quartier, pleine lune, dernier quartier.'
        },
        {
          objectif: 'sci.t1.p4.b1.03',
          q: 'Comment appelle-t-on la phase où la Lune apparaît entièrement éclairée ?',
          bonne: 'la pleine lune',
          leurres: ['la nouvelle lune', 'le premier quartier', 'le dernier quartier'],
          explication: 'À la pleine lune, la face de la Lune tournée vers la Terre est entièrement éclairée.'
        }
      ]
    },

    {
      bloc: 'sci.t1.p4.b2',
      titre: 'Le circuit électrique et sa sécurité',
      /* Note sur sci.t1.p4.b2.01. Le référentiel le marque evaluable: true,
         alors que sa propre règle cite « Réaliser un circuit électrique à une
         boucle » comme l'exemple type d'un objectif non évaluable — un geste
         sans fait à restituer. La contradiction est dans les données, et elle
         est signalée. Ici on s'en tient à ce que l'intitulé nomme lui-même et
         qui est bien un fait : les éléments du circuit, et le fait que le
         courant ne circule que si la boucle est fermée. Rien sur le montage. */
      questions: [
        {
          objectif: 'sci.t1.p4.b2.01',
          q: 'Quels éléments faut-il pour un circuit électrique à une boucle ?',
          bonne: 'un générateur, un interrupteur et un récepteur',
          leurres: ['un récepteur seul', 'deux interrupteurs et rien d\'autre',
                    'un générateur seul'],
          explication: 'Un circuit à une boucle associe un générateur — la pile —, un interrupteur et un ou deux récepteurs, par exemple des lampes à incandescence.'
        },
        {
          objectif: 'sci.t1.p4.b2.01',
          q: 'Dans un circuit à une boucle, que se passe-t-il quand on ouvre l\'interrupteur ?',
          bonne: 'le courant ne circule plus et la lampe s\'éteint',
          leurres: ['le courant circule plus vite', 'la lampe brille davantage',
                    'la pile se recharge'],
          explication: 'Le courant électrique ne circule que si la boucle est fermée. En ouvrant l\'interrupteur, on coupe la boucle : le courant ne circule plus.'
        },
        {
          objectif: 'sci.t1.p4.b2.01',
          q: 'Dans un circuit électrique, quel est le rôle de la pile ?',
          bonne: 'elle est le générateur : elle fait circuler le courant',
          leurres: ['elle est le récepteur : elle consomme le courant',
                    'elle ouvre et ferme la boucle',
                    'elle éclaire la pièce'],
          explication: 'La pile est le générateur du circuit. La lampe est un récepteur, et l\'interrupteur ouvre ou ferme la boucle.'
        },
        {
          objectif: 'sci.t1.p4.b2.02',
          q: 'Quelle règle de sécurité électrique faut-il respecter ?',
          bonne: 'ne jamais toucher un appareil électrique avec les mains mouillées',
          leurres: ['tirer sur le fil pour débrancher un appareil',
                    'brancher plusieurs appareils sur la même prise autant qu\'on veut',
                    'ouvrir un appareil branché pour regarder dedans'],
          explication: 'L\'eau conduit le courant électrique : toucher un appareil avec les mains mouillées est dangereux.'
        },
        {
          objectif: 'sci.t1.p4.b2.02',
          q: 'Sur quoi ne faut-il jamais faire d\'expérience avec l\'électricité en classe ?',
          bonne: 'sur les prises du secteur',
          leurres: ['sur une pile plate', 'sur une pile ronde', 'sur une lampe de poche'],
          explication: 'Les expériences d\'électricité se font avec des piles. Le courant du secteur, dans les prises murales, est dangereux.'
        }
      ]
    },

    /* ================================ Thématique 2 — Le vivant et ses fonctions */

    {
      bloc: 'sci.t2.p1.b1',
      titre: 'L\'organisation des êtres vivants',
      questions: [
        {
          objectif: 'sci.t2.p1.b1.01',
          q: 'Dans quel ordre range-t-on ces niveaux d\'organisation, du plus grand au plus petit ?',
          bonne: 'organisme, appareil, organe',
          leurres: ['organe, appareil, organisme', 'appareil, organisme, organe',
                    'organe, organisme, appareil'],
          explication: 'L\'organisme est l\'être vivant entier. Il contient des appareils, comme l\'appareil digestif, eux-mêmes formés d\'organes, comme l\'estomac.'
        },
        {
          objectif: 'sci.t2.p1.b1.01',
          q: 'L\'estomac est un exemple de quoi ?',
          bonne: 'un organe',
          leurres: ['un appareil', 'un organisme', 'une espèce'],
          explication: 'L\'estomac est un organe. Il fait partie de l\'appareil digestif, lui-même partie de l\'organisme.'
        }
      ]
    },

    {
      bloc: 'sci.t2.p1.b2',
      titre: 'Classer le vivant',
      questions: [
        {
          objectif: 'sci.t2.p1.b2.01',
          q: 'Sur quoi repose une classification en groupes emboîtés ?',
          bonne: 'sur les attributs que les espèces possèdent en commun',
          leurres: ['sur la taille des animaux', 'sur l\'endroit où ils vivent',
                    'sur l\'ordre alphabétique de leurs noms'],
          explication: 'On classe les espèces selon ce qu\'elles possèdent — des attributs comme le squelette interne ou les poils — pour mettre en évidence leurs liens de parenté.'
        },
        {
          objectif: 'sci.t2.p1.b2.01',
          q: 'Que met en évidence une classification en groupes emboîtés ?',
          bonne: 'des liens de parenté entre les espèces',
          leurres: ['l\'utilité des animaux pour l\'être humain', 'leur ordre d\'apparition dans l\'année',
                    'leur vitesse de déplacement'],
          explication: 'Les groupes emboîtés rassemblent les espèces qui partagent des attributs : c\'est ce qui met en évidence leurs liens de parenté.'
        }
      ]
    },

    {
      bloc: 'sci.t2.p1.b3',
      titre: 'La biodiversité d\'hier et d\'aujourd\'hui',
      questions: [
        {
          objectif: 'sci.t2.p1.b3.01',
          q: 'À quoi sert une clé de détermination ?',
          bonne: 'à identifier l\'espèce d\'un être vivant observé',
          leurres: ['à ouvrir un herbier', 'à mesurer la taille d\'une plante',
                    'à connaître l\'âge d\'un animal'],
          explication: 'Une clé de détermination propose une suite de choix sur les caractères observés, et conduit au nom de l\'espèce.'
        },
        {
          objectif: 'sci.t2.p1.b3.02',
          q: 'Que nous apprennent les fossiles ?',
          bonne: 'que les espèces vivantes ont changé au cours de l\'histoire de la Terre',
          leurres: ['que les espèces d\'aujourd\'hui ont toujours existé telles quelles',
                    'que la Terre a moins de mille ans',
                    'que tous les fossiles datent de la même époque'],
          explication: 'Les fossiles sont des restes d\'êtres vivants du passé : ils montrent que la biodiversité a changé au cours de l\'histoire de la Terre.'
        },
        {
          objectif: 'sci.t2.p1.b3.03',
          q: 'Laquelle de ces deux échelles de temps est la plus longue ?',
          bonne: 'l\'échelle des temps géologiques',
          leurres: ['l\'échelle de l\'histoire de l\'être humain', 'elles ont la même durée',
                    'aucune des deux ne se mesure'],
          explication: 'L\'échelle des temps géologiques est celle du temps long de la Terre. L\'histoire de l\'être humain y occupe une place très courte.'
        },
        {
          objectif: 'sci.t2.p1.b3.04',
          q: 'Sur une échelle des temps géologiques, où se place l\'apparition de l\'être humain ?',
          bonne: 'tout près de la fin, après les espèces fossiles les plus anciennes',
          leurres: ['tout au début, avant les premiers êtres vivants',
                    'au milieu exactement', 'elle ne peut pas y être placée'],
          explication: 'Les espèces fossiles les plus anciennes précèdent de très loin l\'apparition de l\'être humain, qui se place tout près de notre époque.'
        }
      ]
    },

    {
      bloc: 'sci.t2.p2.b1',
      titre: 'Se nourrir : besoins, digestion, circulation',
      questions: [
        {
          objectif: 'sci.t2.p2.b1.01',
          q: 'Pourquoi un être vivant a-t-il besoin de matière ?',
          bonne: 'pour grandir et se développer',
          leurres: ['pour changer de couleur', 'pour rester immobile', 'pour dormir moins'],
          explication: 'La matière prélevée dans l\'alimentation permet la croissance et le développement des êtres vivants.'
        },
        {
          objectif: 'sci.t2.p2.b1.02',
          q: 'Comment varient les besoins alimentaires d\'une personne selon son activité physique ?',
          bonne: 'ils augmentent quand l\'activité physique augmente',
          leurres: ['ils diminuent quand l\'activité physique augmente',
                    'ils ne changent jamais', 'ils dépendent seulement de la saison'],
          explication: 'Les besoins alimentaires varient au cours de la croissance et selon l\'activité physique : plus l\'activité est importante, plus les besoins sont grands.'
        },
        {
          objectif: 'sci.t2.p2.b1.03',
          q: 'Où commence la transformation des aliments dans l\'appareil digestif ?',
          bonne: 'dans la bouche, par la mastication',
          leurres: ['dans l\'estomac seulement', 'dans l\'intestin seulement',
                    'dans le cœur'],
          explication: 'La transformation des aliments commence dans la bouche : les dents les mastiquent, et leur texture change tout au long du trajet.'
        },
        {
          objectif: 'sci.t2.p2.b1.03',
          q: 'Que deviennent les aliments au fil de leur trajet dans l\'appareil digestif ?',
          bonne: 'leur texture change',
          leurres: ['ils gardent exactement la même forme', 'ils deviennent plus durs',
                    'ils ne se transforment qu\'à la sortie'],
          explication: 'Les aliments changent de texture tout au long du trajet digestif, à partir de la mastication par les dents.'
        },
        {
          objectif: 'sci.t2.p2.b1.04',
          q: 'Quel est le rôle de la circulation sanguine ?',
          bonne: 'approvisionner les organes',
          leurres: ['mastiquer les aliments', 'fabriquer les dents', 'remplacer la respiration'],
          explication: 'Le sang circule dans tout le corps et approvisionne les organes en ce dont ils ont besoin.'
        },
        {
          objectif: 'sci.t2.p2.b1.05',
          q: 'Quel comportement est favorable à la santé ?',
          bonne: 'se brosser les dents régulièrement',
          leurres: ['sauter des repas pour aller plus vite', 'manger toujours la même chose',
                    'boire seulement quand on a très soif'],
          explication: 'Le brossage des dents, l\'équilibre alimentaire et la qualité sanitaire des aliments sont des règles d\'hygiène favorables à la santé.'
        },
        {
          objectif: 'sci.t2.p2.b1.05',
          q: 'Que signifie « équilibre alimentaire » ?',
          bonne: 'manger de tout, en quantités adaptées',
          leurres: ['manger un seul type d\'aliment', 'manger le plus possible',
                    'ne manger qu\'une fois par jour'],
          explication: 'L\'équilibre alimentaire fait partie des comportements favorables à la santé : il consiste à varier les aliments et à adapter les quantités à ses besoins.'
        }
      ]
    },

    {
      bloc: 'sci.t2.p2.b2',
      titre: 'Transformer les aliments',
      questions: [
        {
          objectif: 'sci.t2.p2.b2.01',
          q: 'Quel être vivant fait lever la pâte à pain ?',
          bonne: 'la levure',
          leurres: ['le ferment lactique', 'le sel', 'la farine'],
          explication: 'La levure est à l\'origine biologique de la fabrication du pain. Le ferment lactique, lui, intervient dans la fabrication du yaourt.'
        },
        {
          objectif: 'sci.t2.p2.b2.01',
          q: 'Quel être vivant transforme le lait en yaourt ?',
          bonne: 'le ferment lactique',
          leurres: ['la levure', 'le sucre', 'la présure de fruit'],
          explication: 'Le yaourt est obtenu grâce au ferment lactique ; le pain, grâce à la levure.'
        }
      ]
    },

    {
      bloc: 'sci.t2.p3.b1',
      titre: 'Le cycle de vie',
      questions: [
        {
          objectif: 'sci.t2.p3.b1.01',
          q: 'Quelles sont les étapes d\'un cycle de vie ?',
          bonne: 'naissance, croissance, reproduction, vieillissement, mort',
          leurres: ['naissance, reproduction, naissance', 'croissance, mort, naissance',
                    'naissance, croissance, mort, reproduction'],
          explication: 'Un cycle de vie comporte la naissance, la croissance, la reproduction, le vieillissement et la mort.'
        },
        {
          objectif: 'sci.t2.p3.b1.01',
          q: 'Quelle suite de formes correspond au cycle de vie d\'une plante à fleurs ?',
          bonne: 'graine, plantule, plante fleurie',
          leurres: ['œuf, larve, adulte', 'graine, œuf, plante fleurie',
                    'plantule, graine, larve'],
          explication: 'Chez une plante à fleurs, les formes se succèdent de la graine à la plantule puis à la plante fleurie. Chez un animal, on observe l\'œuf, l\'embryon, la larve ou le jeune, puis l\'adulte.'
        }
      ]
    },

    {
      bloc: 'sci.t2.p3.b2',
      titre: 'La puberté',
      questions: [
        {
          objectif: 'sci.t2.p3.b2.02',
          q: 'À quoi la puberté est-elle reliée ?',
          bonne: 'à la capacité de se reproduire',
          leurres: ['au changement d\'école', 'à l\'apprentissage de la lecture',
                    'au choix d\'un métier'],
          explication: 'La puberté est la période des changements du corps qui rendent la reproduction possible.'
        },
        {
          objectif: 'sci.t2.p3.b2.01',
          q: 'Comment appelle-t-on les organes qui permettent la reproduction ?',
          bonne: 'les organes reproducteurs',
          leurres: ['les organes digestifs', 'les organes respiratoires', 'les organes circulatoires'],
          explication: 'Le vocabulaire scientifique nomme organes reproducteurs ceux qui permettent la reproduction, comme il nomme organes digestifs ceux de la digestion.'
        }
      ]
    },

    /* ================================== Thématique 3 — Les objets techniques */

    {
      bloc: 'sci.t3.p1.b1',
      titre: 'Les besoins et les objets techniques',
      questions: [
        {
          objectif: 'sci.t3.p1.b1.01',
          q: 'Lequel de ces énoncés exprime un besoin ?',
          bonne: 'se déplacer',
          leurres: ['une bicyclette', 'un radiateur', 'une casserole'],
          explication: 'Se déplacer, se chauffer ou s\'alimenter sont des besoins. La bicyclette, le radiateur et la casserole sont des objets techniques qui répondent à ces besoins.'
        },
        {
          objectif: 'sci.t3.p1.b1.02',
          q: 'À quel besoin un réfrigérateur répond-il ?',
          bonne: 'conserver les aliments',
          leurres: ['se déplacer', 'communiquer à distance', 'éclairer une pièce'],
          explication: 'Un objet technique est fabriqué pour répondre à un besoin : le réfrigérateur répond au besoin de conserver les aliments.'
        },
        {
          objectif: 'sci.t3.p1.b1.02',
          q: 'Quel objet technique répond au besoin de se chauffer ?',
          bonne: 'un radiateur',
          leurres: ['une lampe', 'un vélo', 'un téléphone'],
          explication: 'Chaque objet technique apporte une réponse à un besoin identifié : le radiateur répond au besoin de se chauffer.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p1.b2',
      titre: 'L\'évolution des objets techniques',
      questions: [
        {
          objectif: 'sci.t3.p1.b2.01',
          q: 'Que montre l\'étude de l\'évolution du transport ferroviaire depuis son apparition ?',
          bonne: 'qu\'un objet technique se transforme au cours du temps',
          leurres: ['qu\'un objet technique ne change jamais',
                    'que les trains ont toujours été identiques',
                    'que l\'objet disparaît dès qu\'il évolue'],
          explication: 'Un objet technique évolue dans son contexte historique, géographique, économique, culturel et technologique : le matériel ferroviaire et ses usages ont beaucoup changé depuis son apparition.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p2.b1',
      titre: 'Besoin et fonctions techniques',
      questions: [
        {
          objectif: 'sci.t3.p2.b1.01',
          q: 'Quelle est la différence entre un besoin et une fonction technique ?',
          bonne: 'le besoin est celui de l\'utilisateur, la fonction technique est ce que l\'objet réalise',
          leurres: ['ce sont deux mots pour la même chose',
                    'le besoin est ce que fait l\'objet, la fonction est ce que veut l\'utilisateur',
                    'la fonction technique est le nom commercial de l\'objet'],
          explication: 'Le besoin vient de l\'utilisateur ; les fonctions techniques sont ce que l\'objet réalise pour y répondre.'
        },
        {
          objectif: 'sci.t3.p2.b1.02',
          q: 'Quelle fonction technique un parapluie assure-t-il ?',
          bonne: 'protéger de la pluie',
          leurres: ['éclairer le chemin', 'mesurer la température', 'transporter des objets'],
          explication: 'Identifier les fonctions assurées par un objet technique, c\'est dire ce qu\'il fait : un parapluie protège de la pluie.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p2.b2',
      titre: 'Solutions technologiques et matériaux',
      questions: [
        {
          objectif: 'sci.t3.p2.b2.01',
          q: 'Qu\'est-ce qu\'une solution technologique ?',
          bonne: 'le moyen concret choisi pour réaliser une fonction technique',
          leurres: ['le besoin exprimé par l\'utilisateur', 'le prix de vente de l\'objet',
                    'le nom donné à l\'objet'],
          explication: 'À une même fonction technique peuvent correspondre plusieurs solutions technologiques : freiner un vélo peut se faire par des patins ou par un disque.'
        },
        {
          objectif: 'sci.t3.p2.b2.02',
          q: 'Pourquoi les fenêtres sont-elles en verre ?',
          bonne: 'parce que le verre est transparent',
          leurres: ['parce que le verre est souple', 'parce que le verre est léger',
                    'parce que le verre conduit l\'électricité'],
          explication: 'Identifier les matériaux d\'un objet technique, c\'est aussi comprendre pourquoi ils ont été choisis : le verre est transparent, ce qui laisse passer la lumière.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p2.b3',
      titre: 'Les sous-ensembles d\'un objet',
      questions: [
        {
          objectif: 'sci.t3.p2.b3.02',
          q: 'Qu\'appelle-t-on un sous-ensemble d\'un objet technique ?',
          bonne: 'un groupe de pièces qui assure une même fonction',
          leurres: ['une pièce de rechange', 'le mode d\'emploi de l\'objet',
                    'l\'emballage de l\'objet'],
          explication: 'Un objet technique se décompose en sous-ensembles : sur un vélo, le pédalier, la transmission et le freinage sont des sous-ensembles.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p3.b2',
      titre: 'Les contraintes et le choix des matériaux',
      questions: [
        {
          objectif: 'sci.t3.p3.b2.02',
          q: 'Quelle propriété physique fait choisir un matériau pour fabriquer un imperméable ?',
          bonne: 'l\'imperméabilité',
          leurres: ['la transparence', 'la conduction électrique', 'la capacité à rouiller'],
          explication: 'Un matériau se choisit en fonction de ses propriétés physiques : pour un imperméable, c\'est l\'imperméabilité qui compte.'
        },
        {
          objectif: 'sci.t3.p3.b2.02',
          q: 'Pourquoi choisit-on un matériau léger pour fabriquer un sac de randonnée ?',
          bonne: 'pour que le poids à porter reste faible',
          leurres: ['pour qu\'il soit transparent', 'pour qu\'il conduise la chaleur',
                    'pour qu\'il soit plus long'],
          explication: 'Le poids est une contrainte de l\'objet technique, au même titre que l\'imperméabilité ou l\'autonomie : le matériau se choisit en conséquence.'
        },
        {
          objectif: 'sci.t3.p3.b2.03',
          q: 'Un refuge de haute montagne n\'est relié à aucun réseau électrique. Quelle forme d\'énergie peut-il exploiter sur place ?',
          bonne: 'l\'énergie électrique produite par des panneaux solaires ou une éolienne',
          leurres: ['aucune énergie n\'est disponible en montagne',
                    'l\'énergie du réseau électrique de la vallée',
                    'l\'énergie des lampes du refuge'],
          explication: 'Exploiter les formes d\'énergie disponibles sur place est une contrainte de conception : un refuge isolé produit son électricité localement, un appartement en ville est relié au réseau.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p3.b3',
      titre: 'Le cycle de vie d\'un objet technique',
      questions: [
        {
          objectif: 'sci.t3.p3.b3.01',
          q: 'Quelle est la première étape du cycle de vie d\'un objet technique ?',
          bonne: 'l\'extraction des matières premières',
          leurres: ['son utilisation', 'sa mise au rebut', 'son recyclage'],
          explication: 'Le cycle de vie d\'un objet technique va de l\'extraction des matières premières à sa fin de vie, en passant par sa fabrication, sa distribution et son utilisation.'
        },
        {
          objectif: 'sci.t3.p3.b3.01',
          q: 'Quelle étape vient après l\'utilisation d\'un objet technique ?',
          bonne: 'sa fin de vie',
          leurres: ['sa fabrication', 'l\'extraction des matières premières', 'sa conception'],
          explication: 'Après l\'utilisation vient la fin de vie de l\'objet : il est alors jeté, recyclé ou réemployé.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p4.b1',
      titre: 'Les objets programmables',
      questions: [
        {
          objectif: 'sci.t3.p4.b1.01',
          q: 'Dans un éclairage public intelligent, quel élément détecte qu\'une personne approche ?',
          bonne: 'le détecteur de présence',
          leurres: ['le relais de commande', 'la lampe', 'le boîtier de contrôle'],
          explication: 'La chaîne d\'information commence par le détecteur de présence ; le boîtier de contrôle décide, et le relais commande l\'éclairage.'
        },
        {
          objectif: 'sci.t3.p4.b1.02',
          q: 'Comment appelle-t-on l\'élément d\'un robot qui mesure ou détecte quelque chose ?',
          bonne: 'un capteur',
          leurres: ['un actionneur', 'un programme', 'une batterie'],
          explication: 'Un capteur recueille une information ; un actionneur, comme un moteur électrique, agit.'
        },
        {
          objectif: 'sci.t3.p4.b1.02',
          q: 'Comment appelle-t-on l\'élément d\'un robot qui produit une action, comme un moteur électrique ?',
          bonne: 'un actionneur',
          leurres: ['un capteur', 'un interrupteur', 'un écran'],
          explication: 'L\'actionneur agit : le moteur électrique en est un exemple. Le capteur, lui, se contente de recueillir une information.'
        }
      ]
    },

    {
      bloc: 'sci.t3.p4.b2',
      titre: 'Lire un programme',
      /* Ce bloc recoupe la compétence CRCN « Programmer ». Le référentiel du
         numérique demande de lier plutôt que de dupliquer : son repère est
         déclaré ici, et la banque du numérique n'écrit rien dessus. */
      objectifsLies: ['num.3.4.n1.01'],
      questions: [
        {
          objectif: 'sci.t3.p4.b2.02',
          q: 'Un programme dit : « avance de 10 pas ; tourne à droite de 90° ; avance de 10 pas ». Que trace-t-il ?',
          bonne: 'deux traits qui forment un angle droit',
          leurres: ['un seul trait de 20 pas', 'un cercle', 'un carré complet'],
          explication: 'Traduire un programme en langage naturel, c\'est dire ce qu\'il fait, instruction après instruction : ici deux déplacements séparés par un quart de tour.'
        },
        {
          objectif: 'sci.t3.p4.b2.02',
          q: 'Un programme répète quatre fois : « avance de 5 pas ; tourne à droite de 90° ». Que trace-t-il ?',
          bonne: 'un carré',
          leurres: ['un triangle', 'un cercle', 'une ligne droite'],
          explication: 'Quatre déplacements égaux séparés par quatre quarts de tour ramènent au point de départ : le tracé est un carré.'
        }
      ]
    },

    /* ============================ Thématique 4 — La Terre et les écosystèmes */

    {
      bloc: 'sci.t4.p1.b1',
      titre: 'La Terre, planète active',
      questions: [
        {
          objectif: 'sci.t4.p1.b1.01',
          q: 'Autour de quoi la Terre tourne-t-elle dans le système solaire ?',
          bonne: 'le Soleil',
          leurres: ['la Lune', 'Mars', 'la Voie lactée'],
          explication: 'La Terre est une planète du système solaire : elle tourne autour du Soleil, et la Lune tourne autour d\'elle.'
        },
        {
          objectif: 'sci.t4.p1.b1.02',
          q: 'Quelle est la différence entre la météorologie et le climat ?',
          bonne: 'la météorologie décrit le temps qu\'il fait, le climat décrit le temps sur une longue période',
          leurres: ['ce sont deux mots pour la même chose',
                    'la météorologie concerne l\'été, le climat concerne l\'hiver',
                    'le climat change chaque jour, la météorologie jamais'],
          explication: 'La météorologie s\'occupe du temps qu\'il fait maintenant ou dans les jours qui viennent. Le climat caractérise le temps d\'une région sur une longue période.'
        },
        {
          objectif: 'sci.t4.p1.b1.03',
          q: 'Quel instrument mesure la quantité de pluie tombée ?',
          bonne: 'le pluviomètre',
          leurres: ['le thermomètre', 'l\'anémomètre', 'la boussole'],
          explication: 'Le pluviomètre mesure les précipitations, le thermomètre la température, l\'anémomètre la vitesse du vent.'
        },
        {
          objectif: 'sci.t4.p1.b1.03',
          q: 'Quel instrument mesure la vitesse du vent ?',
          bonne: 'l\'anémomètre',
          leurres: ['le pluviomètre', 'le thermomètre', 'le baromètre à sable'],
          explication: 'L\'anémomètre mesure la vitesse du vent. Le pluviomètre mesure la pluie, le thermomètre la température.'
        },
        {
          objectif: 'sci.t4.p1.b1.04',
          q: 'Lequel de ces phénomènes est un indice de l\'activité interne de la Terre ?',
          bonne: 'un volcan',
          leurres: ['le vent', 'un courant océanique', 'une averse'],
          explication: 'Les séismes et les volcans témoignent de l\'activité interne de la Terre ; les vents et les courants océaniques relèvent de son activité externe.'
        },
        {
          objectif: 'sci.t4.p1.b1.05',
          q: 'Lequel de ces éléments est une ressource naturelle exploitée par les sociétés humaines ?',
          bonne: 'la géothermie',
          leurres: ['un séisme', 'un cyclone', 'une éclipse'],
          explication: 'Les matériaux de construction et la géothermie sont des ressources naturelles liées à l\'activité de la planète Terre.'
        },
        {
          objectif: 'sci.t4.p1.b1.06',
          q: 'Quelle mesure de prévention est associée au risque sismique ?',
          bonne: 'construire des bâtiments capables de résister aux secousses',
          leurres: ['planter davantage d\'arbres en ville', 'arroser les rues avant l\'été',
                    'il n\'existe aucune prévention possible'],
          explication: 'À chaque risque naturel correspondent des modalités de prévention : pour les séismes, la construction adaptée et l\'information de la population.'
        }
      ]
    },

    {
      bloc: 'sci.t4.p2.b1',
      titre: 'L\'écosystème',
      questions: [
        {
          objectif: 'sci.t4.p2.b1.01',
          q: 'Qu\'est-ce qu\'un écosystème ?',
          bonne: 'un milieu de vie, l\'ensemble des êtres vivants qui l\'habitent, et leurs interactions',
          leurres: ['seulement les animaux d\'une région', 'seulement le sol et le climat',
                    'un groupe d\'animaux de la même espèce'],
          explication: 'Un écosystème se caractérise par son milieu de vie, par l\'ensemble des êtres vivants qui s\'y trouvent, et par les interactions en son sein.'
        },
        {
          objectif: 'sci.t4.p2.b1.02',
          q: 'Comment appelle-t-on la relation entre un renard et le mulot qu\'il mange ?',
          bonne: 'une relation de prédation',
          leurres: ['une relation de coopération', 'une relation de parenté',
                    'une absence de relation'],
          explication: 'La prédation et la coopération sont deux types de relations entre espèces au sein d\'un écosystème.'
        },
        {
          objectif: 'sci.t4.p2.b1.03',
          q: 'Lequel de ces facteurs est un facteur abiotique, c\'est-à-dire non vivant ?',
          bonne: 'la température',
          leurres: ['les insectes du sol', 'les oiseaux du bois', 'les champignons'],
          explication: 'La température, l\'ensoleillement et l\'humidité sont des facteurs abiotiques : ils ne sont pas vivants, mais ils expliquent en partie la répartition des êtres vivants.'
        }
      ]
    },

    {
      bloc: 'sci.t4.p2.b2',
      titre: 'Les chaînes alimentaires',
      questions: [
        {
          objectif: 'sci.t4.p2.b2.01',
          q: 'D\'où vient la matière qui permet à un animal de produire sa propre matière ?',
          bonne: 'de la nourriture qu\'il prend à d\'autres êtres vivants',
          leurres: ['de l\'air seul', 'de la lumière du soleil directement',
                    'il la fabrique à partir de rien'],
          explication: 'Un animal produit sa matière à partir de la nourriture qu\'il consomme, et cette nourriture provient d\'autres êtres vivants.'
        },
        {
          objectif: 'sci.t4.p2.b2.02',
          q: 'De quoi un végétal a-t-il besoin pour se développer ?',
          bonne: 'de lumière, d\'eau et d\'éléments pris dans le sol',
          leurres: ['de manger d\'autres êtres vivants', 'd\'obscurité complète',
                    'uniquement de chaleur'],
          explication: 'Les besoins des végétaux se mettent en évidence par l\'expérience : lumière, eau et éléments puisés dans le sol. Ils ne consomment pas d\'autres êtres vivants.'
        },
        {
          objectif: 'sci.t4.p2.b2.03',
          q: 'Quelle est la place des végétaux dans un réseau alimentaire ?',
          bonne: 'ils se trouvent à la base du réseau',
          leurres: ['ils se trouvent au sommet du réseau',
                    'ils sont en dehors du réseau',
                    'ils occupent la même place que les prédateurs'],
          explication: 'Les végétaux occupent une place singulière : ils sont à la base des réseaux alimentaires, car ils ne consomment pas d\'autres êtres vivants.'
        },
        {
          objectif: 'sci.t4.p2.b2.04',
          q: 'Dans la chaîne « herbe → criquet → oiseau », dans quel sens la flèche se lit-elle ?',
          bonne: '« est mangé par »',
          leurres: ['« mange »', '« ressemble à »', '« vit à côté de »'],
          explication: 'Dans une chaîne alimentaire, la flèche va de ce qui est mangé vers celui qui mange : l\'herbe est mangée par le criquet, lui-même mangé par l\'oiseau.'
        }
      ]
    },

    {
      bloc: 'sci.t4.p2.b3',
      titre: 'L\'action humaine sur l\'environnement',
      questions: [
        {
          objectif: 'sci.t4.p2.b3.01',
          q: 'Laquelle de ces actions humaines a une répercussion positive sur l\'environnement proche ?',
          bonne: 'planter une haie pour abriter des oiseaux',
          leurres: ['jeter ses déchets dans un cours d\'eau',
                    'laisser couler l\'eau sans raison',
                    'brûler des déchets dans son jardin'],
          explication: 'Les actions humaines ont des répercussions positives et négatives sur l\'environnement proche : la plantation d\'une haie crée un abri, le rejet de déchets dégrade le milieu.'
        }
      ]
    }
  ];

  /* Un générateur par bloc du programme. Ses objectifs sont ceux que ses
     questions couvrent réellement — c'est ce qui permet de compter la part du
     programme travaillée objectif par objectif, comme pour les autres
     matières. */
  BANQUE.forEach(function (bloc) {
    var objectifs = [];
    bloc.questions.forEach(function (q) {
      if (objectifs.indexOf(q.objectif) === -1) objectifs.push(q.objectif);
    });
    // Objectifs d'un autre référentiel que ce bloc travaille aussi : ils sont
    // déclarés ici plutôt que redemandés ailleurs par les mêmes questions.
    (bloc.objectifsLies || []).forEach(function (o) {
      if (objectifs.indexOf(o) === -1) objectifs.push(o);
    });

    reg.ajouter({
      id: bloc.bloc,
      matiere: 'sciences',
      objectifs: objectifs,
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
  CM2.banques.sciences = BANQUE;
})(window.CM2 = window.CM2 || {});
