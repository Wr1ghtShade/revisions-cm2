/* Version de l'application.

   Une seule source : le numéro affiché en bas de page, celui écrit dans les
   cahiers exportés et celui de cet historique sont le même.

   Numérotation 1.MAJEUR.MINEUR

   - le 1 ne bouge pas ;
   - le MAJEUR change quand l'application gagne quelque chose de structurant :
     un nouveau domaine d'enseignement, une nouvelle capacité de fond ;
   - le MINEUR, sur deux chiffres, change pour tout le reste : ajustements
     d'interface, corrections de bugs, complément de contenu dans un domaine
     existant.

   L'historique sert à savoir, devant un cahier exporté il y a des mois, ce que
   l'application savait faire à ce moment-là. */
(function (CM2) {
  'use strict';

  var HISTORIQUE = [
    { numero: '1.0.00', date: '2026-09-11', majeur: true,
      quoi: 'Socle de production — tirage déterministe, contrôle des contraintes du ' +
            'programme, registre — et premiers générateurs de mathématiques et de ' +
            'français (85). Interface de révision et page de vérification.' },

    { numero: '1.0.01', date: '2026-09-11',
      quoi: 'Habillage « salle de classe » : tableau vert, feuille à petits carreaux, ' +
            'marelle de progression, objets de la trousse.' },

    { numero: '1.1.00', date: '2026-09-12', majeur: true,
      quoi: 'Les cahiers : un profil par enfant, conservé d\'une visite à l\'autre, ' +
            'avec suivi des réussites et bascule d\'un cahier à l\'autre.' },

    { numero: '1.1.01', date: '2026-09-12',
      quoi: 'Marelle de cour dessinée en SVG, reprise d\'une série interrompue par un ' +
            'rafraîchissement de la page, séries de 5 à 20 questions, barre de bas de ' +
            'page portant la provenance des programmes et la licence.' },

    { numero: '1.2.00', date: '2026-09-12', majeur: true,
      quoi: 'Révision espacée : chaque notion et chaque exercice raté revient à 1, 3, 7 ' +
            'puis 16 jours. Sauvegarde et restauration du cahier dans un fichier.' },

    { numero: '1.3.00', date: '2026-09-12', majeur: true,
      quoi: 'Couverture du programme portée à 105 objectifs de mathématiques sur 115 et ' +
            '39 de français sur 82, dont les exercices avec figures : demi-droite ' +
            'graduée, horloge, quadrillage, tableaux, diagrammes, patrons, angles.' },

    { numero: '1.3.01', date: '2026-09-12',
      quoi: 'Une série arrêtée volontairement ne reprend plus toute seule au ' +
            'rechargement. Restauration d\'un cahier possible avant d\'en avoir créé un. ' +
            'Pied de page raccourci.' },

    { numero: '1.4.00', date: '2026-09-12', majeur: true,
      quoi: 'Nouveau domaine : enseignement moral et civique. Banque de 35 questions ' +
            'sur les 12 contenus évaluables du programme « Vivre en république », avec ' +
            'contrôle automatique du rattachement au référentiel.' },

    { numero: '1.4.01', date: '2026-09-12',
      quoi: 'Numéro de version affiché en bas de page et inscrit dans les cahiers ' +
            'exportés.' },

    { numero: '1.4.02', date: '2026-09-12',
      quoi: 'Fenêtre « à propos », ouverte par le « i » du tableau : ce que fait ' +
            'l\'application, d\'où viennent les questions, ce que le cahier retient, à ' +
            'quoi sert la page de vérification, et le journal des versions.' },

    { numero: '1.5.00', date: '2026-09-12', majeur: true,
      quoi: 'Oracle de correction : la réponse annoncée est désormais recalculée depuis ' +
            'l\'énoncé, par un second chemin indépendant du code de l\'application, pour ' +
            '91 sortes d\'exercices sur 163. Un QCM doit en outre n\'avoir qu\'une seule ' +
            'proposition défendable. Le contrôle tourne en ligne de commande et dans la ' +
            'page de vérification.' },

    { numero: '1.5.01', date: '2026-09-12',
      quoi: 'Six mascottes de plus — dinosaure, dragon, loup, requin, fusée, ballon — ' +
            'soit dix-huit au choix, chacune annoncée par son nom pour les lecteurs ' +
            'd\'écran.' },

    { numero: '1.6.00', date: '2026-09-12', majeur: true,
      quoi: 'La progression, enfin lisible : ce qui est travaillé est rattaché aux ' +
            'domaines du programme officiel plutôt qu\'à des titres d\'exercices, et un ' +
            'coin replié donne à l\'adulte les six dernières semaines, ce qui a l\'air ' +
            'acquis, ce qui coince, et la part du programme couverte.' },

    { numero: '1.7.00', date: '2026-09-12', majeur: true,
      quoi: 'Les fiches à imprimer : dix, vingt ou trente exercices sur une feuille, le ' +
            'corrigé sur la page suivante. Chaque fiche porte une référence qui permet de ' +
            'la réimprimer à l\'identique. De quoi travailler au crayon, sans ordinateur.' },

    { numero: '1.7.01', date: '2026-09-12',
      quoi: 'Les fiches s\'impriment sans le bandeau d\'adresse « file:///… » que le ' +
            'navigateur ajoutait en tête de page.' },

    { numero: '1.7.02', date: '2026-09-12',
      quoi: 'Les fiches se demandent en 5, 10, 15 ou 20 exercices — la même échelle que ' +
            'les séries à l\'écran, au lieu de 10, 20 ou 30.' },

    { numero: '1.7.03', date: '2026-09-13',
      quoi: 'Les touches 1 à 4 répondent aux questions à choix : le numéro est écrit dans ' +
            'la case de chaque proposition. Une réponse écrite fausse est désormais ' +
            'remontrée telle qu\'elle a été tapée, pour distinguer la faute de frappe de ' +
            'l\'erreur de raisonnement.' },

    { numero: '1.7.04', date: '2026-09-13',
      quoi: 'Les autres écritures d\'une même réponse sont acceptées — « 2 h 5 » vaut ' +
            '« 2 h 05 » — et le corrigé des fiches les indique. Les durées ne sont plus ' +
            'obligées de dépasser dix minutes pour rester sans ambiguïté.' },

    { numero: '1.7.05', date: '2026-09-13',
      quoi: 'Rappel de sauvegarde au bureau après cinq séances non enregistrées, avec le ' +
            'nombre de séances que perdrait un effacement du navigateur.' },

    { numero: '1.7.06', date: '2026-09-13',
      quoi: 'Confort de lecture : texte plus grand, texte plus aéré. Les deux réglages ' +
            'valent aussi pour les fiches imprimées et sont rangés dans le cahier de ' +
            'l\'enfant.' },

    { numero: '1.7.07', date: '2026-09-13',
      quoi: 'Quatre objectifs de mathématiques de plus — la notation des angles, le patron ' +
            'du pavé, l\'ordre des étapes d\'un programme de construction, les assemblages ' +
            'de cubes — soit 109 objectifs couverts sur 115. Les six qui restent demandent ' +
            'la règle, le compas ou le pliage : un écran ne peut pas les évaluer.' },

    { numero: '1.8.00', date: '2026-09-13', majeur: true,
      quoi: 'La vue enseignant : tous les cahiers de l\'ordinateur dans un tableau — où ' +
            'chacun en est, ce qui lui reste à revoir, depuis quand il n\'est pas venu — ' +
            'le détail d\'un enfant sans ouvrir son cahier, les domaines du programme ' +
            'additionnés sur la classe, et les notions qui résistent à plusieurs enfants ' +
            'à la fois. Imprimable. Les cahiers venus d\'un autre ordinateur s\'y ajoutent ' +
            'par leur fichier de sauvegarde.' },

    { numero: '1.8.01', date: '2026-09-13',
      quoi: 'Revue du code. Une sorte d\'exercice retirée entre deux versions n\'apparaît ' +
            'plus sous son identifiant technique dans « ce qui coince » : elle reste dans ' +
            'le cahier, mais hors des listes. Les dates lues par un adulte s\'écrivent ' +
            '13/09/2026 et non 2026-09-13. Accords au singulier corrigés dans la vue ' +
            'enseignant.' },

    { numero: '1.9.00', date: '2026-09-13', majeur: true,
      quoi: 'Nouveau domaine : sciences et technologie. Banque de 92 questions couvrant ' +
            'les 60 objectifs évaluables du programme — la matière et ses états, les ' +
            'mélanges, les mouvements, la lumière et les ombres, le vivant et sa ' +
            'classification, la digestion, les objets techniques, la Terre et les ' +
            'écosystèmes. Contrôle automatique du rattachement au référentiel, objectif ' +
            'par objectif.' },

    { numero: '1.10.00', date: '2026-09-13', majeur: true,
      quoi: 'Nouveau domaine : histoire et géographie. Banque de 33 questions sur 17 des ' +
            '18 sujets d\'étude évaluables. Aucune date qui ne figure au programme, y ' +
            'compris dans les leurres. Les guerres mondiales ne font l\'objet d\'aucune ' +
            'question : le programme ne l\'autorise que sur des repères chronologiques ' +
            'qu\'il n\'énonce pas. Les quatre sujets sur l\'âge industriel, que le ' +
            'professeur choisit, ne sont posés que si le cahier les a cochés.' },

    { numero: '1.11.00', date: '2026-09-13', majeur: true,
      quoi: 'Nouveau domaine : le numérique, d\'après le cadre de référence des ' +
            'compétences numériques. Banque de 25 questions sur les 17 repères évaluables ' +
            'des niveaux 1 et 2 — sources, données personnelles, traces de navigation, ' +
            'droit d\'auteur, sécurité, effets sur la santé et l\'environnement. Le ' +
            'cyberharcèlement ne fait l\'objet d\'aucune question : il se traite en classe ' +
            'avec un adulte.' },

    { numero: '1.11.01', date: '2026-09-13',
      quoi: 'La page de vérification contrôlait encore les seuls exercices des quatre ' +
            'premiers domaines : les banques de sciences, d\'histoire-géographie et de ' +
            'numérique y manquaient. Corrigé, et un contrôle interdit désormais qu\'un ' +
            'fichier d\'exercices soit chargé par l\'application sans l\'être aussi par ' +
            'la page de vérification.' },

    { numero: '1.11.02', date: '2026-09-13',
      quoi: '« Ma progression » et « Une fiche à imprimer » étaient relégués en bas du ' +
            'bureau, sous le choix des matières. Ils rejoignent « Où tu en es », juste ' +
            'sous les post-its : on voit d\'un coup ce qui a été fait et par où entrer ' +
            'pour en savoir plus. La rubrique « Et aussi », devenue vide, disparaît.' },

    { numero: '1.11.03', date: '2026-09-13',
      quoi: '« Effacer ce cahier » passe du beige terne au rouge pastel, texte en noir. ' +
            'La couleur dit enfin ce que fait le bouton. Le contour en pointillés et ' +
            'l\'absence d\'ombre restent : il signale sans inviter au clic.' },

    { numero: '1.11.04', date: '2026-09-13',
      quoi: 'Les sujets d\'histoire à cocher s\'affichaient dans la police du texte ' +
            'courant, alors que les boutons de matières juste au-dessus utilisent ' +
            'l\'écriture manuscrite. Même police pour les deux ; les sujets gardent ' +
            'leur taille plus discrète, ce sont des réglages.' },

    { numero: '1.12.00', date: '2026-09-15', majeur: true,
      quoi: 'Nouvelle matière « Révisions », pour travailler dès la rentrée ce qui ' +
            'n\'attend pas que la notion soit vue en classe. Elle s\'ouvre sur les ' +
            'tables de multiplication de 0 à 10, sous deux formes : le produit ' +
            '(« Calcule 7 × 8 ») et le facteur manquant (« Complète : 7 × ? = 56 »). ' +
            'Les deux sont recalculés par l\'oracle. Le facteur connu n\'est jamais 0, ' +
            'car « 0 × ? = 0 » accepterait n\'importe quelle réponse. Rien de nouveau ' +
            'au programme : ces exercices rejouent l\'objectif de CM2 ' +
            'mat.nc.calcul_mental.faits.01, servi à part.' },

    { numero: '1.12.01', date: '2026-09-15',
      quoi: 'Les fiches à imprimer ignoraient les révisions : la matière manquait ' +
            'dans la liste, et le nombre d\'exercices s\'arrêtait à 20. « Révisions » ' +
            'est proposée, et un choix « 30 » s\'ajoute pour le papier — une planche ' +
            'de tables se fait d\'une traite. Corrigé au passage : la référence d\'une ' +
            'fiche de révisions ne se relisait pas, la lettre « R » ayant été ajoutée ' +
            'à la table des codes mais pas au motif qui les relit. La fiche ' +
            's\'imprimait, sa référence ne ramenait rien.' },

    { numero: '1.12.02', date: '2026-09-15',
      quoi: '« Revoir mes erreurs » quittait mal sa place : rangé sous « On révise ' +
            'quoi ? », il passait pour une matière de plus. Il a maintenant sa propre ' +
            'rubrique, qui s\'efface entièrement quand il n\'y a rien à revoir. Des ' +
            'affaires d\'écolier apparaissent aussi à droite de la feuille sur les ' +
            'grands écrans — dessinées dans la page, sans image à charger.' },

    { numero: '1.12.03', date: '2026-09-15',
      quoi: 'Une planche de tables partait sur trois pages : chaque « Calcule 5 × 5 » ' +
            'occupait un titre de notion, une ligne d\'énoncé et une réglure pleine ' +
            'largeur. Les exercices courts tiennent désormais sur une seule ligne, ' +
            'énoncé et trait de réponse côte à côte ; et quand toute la fiche est ' +
            'faite de questions courtes, elle passe sur deux colonnes sans le libellé ' +
            'de notion, identique partout. Les fiches comportant des figures, des QCM ' +
            'ou des énoncés longs gardent la pleine largeur : une question à l\'étroit ' +
            'se lit mal. Le bouton « Une autre fiche » prend le rose de la gomme.' },

    { numero: '1.12.04', date: '2026-09-15',
      quoi: 'Sur les fiches compactes, le trait où écrire la réponse n\'apparaissait ' +
            'que sur certains exercices : il avait une hauteur nulle et son bord se ' +
            'confondait avec la ligne de base du texte, ce qui se rend mal, surtout ' +
            'sur deux colonnes. Il a maintenant une hauteur explicite et passe sous la ' +
            'ligne d\'écriture, comme sur un cahier. L\'application gagne par ailleurs ' +
            'une icône d\'onglet : le cahier à reliure rouge, sur le vert du tableau.' },

    { numero: '1.12.05', date: '2026-09-15',
      quoi: 'Une fois dans le cahier d\'un enfant, plus rien ne ramenait à l\'accueil : ' +
            'il fallait recharger la page. Les cahiers restaient accessibles par la ' +
            'bascule, mais pas la vue enseignant, la restauration ni la création d\'un ' +
            'cahier. Une maison répond maintenant au « i » sur le tableau, qui reste ' +
            'affiché partout. Elle s\'efface sur l\'accueil, où elle n\'aurait rien à ' +
            'faire, et pendant une question, pour ne pas offrir une sortie de série ' +
            'par mégarde — « Arrêter » y ramène au bureau, où elle reparaît.' },

    { numero: '1.12.06', date: '2026-09-15',
      quoi: 'La maison encadrait le titre du tableau au lieu de tenir compagnie au ' +
            '« i ». Elle se range à côté de lui, dans le même coin : les deux ' +
            'boutons se lisent désormais comme une paire.' },

    { numero: '1.12.07', date: '2026-09-28',
      quoi: 'Un 10 sur 10 s\'entendait dire « Sans faute ou presque » : le sans-faute ' +
            'partageait sa mention avec les séries à une erreur près. Il a désormais la ' +
            'sienne. En coulisse, les matières ne sont plus décrites qu\'à un seul ' +
            'endroit (app/matieres.js), dont découlent libellés, codes des fiches et ' +
            'compteurs ; et les tests lisent la liste des scripts dans index.html au ' +
            'lieu d\'en tenir six copies. Deux défauts silencieux venaient de ces ' +
            'doublons ; ce qui reste écrit en dur est désormais confronté à la table, et ' +
            'une dérive fait échouer les contrôles.' },

    { numero: '1.12.08', date: '2026-09-28',
      quoi: 'La page de vérification sert aux adultes : le lien du bas de page et ' +
            'celui de la fenêtre d\'informations disparaissent, pour qu\'un enfant ' +
            'n\'y tombe pas par hasard. Elle reste ouverte à qui tape son adresse.' },

    { numero: '1.12.09', date: '2026-11-05',
      quoi: 'Revue de sécurité. Le fichier de sauvegarde est la seule chose que ' +
            'l\'application lise sans l\'avoir écrite : il est désormais contrôlé ' +
            'avant d\'entrer — forme de chaque partie, taille — et « cahier ' +
            'restauré » n\'est annoncé qu\'une fois le cahier réellement en mémoire ' +
            'du navigateur. Avant, un fichier trop gros se disait restauré puis ' +
            'faisait perdre en silence tout ce qui suivait, et un fichier abîmé ' +
            'pouvait figer le démarrage. Un enfant qui s\'appelle « constructor » ' +
            'ou « __proto__ » a maintenant un vrai cahier, enregistré comme les ' +
            'autres. Une référence de fiche recopiée avec un nombre délirant ' +
            'd\'exercices est refusée au lieu de figer la page. La page déclare ' +
            'enfin une règle de sécurité du contenu : rien d\'autre que ses propres ' +
            'fichiers.' },

    { numero: '1.12.10', date: '2026-11-14',
      quoi: 'Suite de la revue de sécurité. Le contrôle du fichier de sauvegarde ' +
            'descend d\'un cran : chaque séance doit être lisible, la position ' +
            'dans une série en cours doit désigner une question qui existe, et un ' +
            'nom de plus de quarante caractères n\'est pas un prénom. Avant, un ' +
            'fichier abîmé à ces endroits-là entrait, puis faisait planter « Ma ' +
            'progression » et la vue enseignant, ou figeait la reprise d\'une ' +
            'série. Un fichier manifestement trop gros est refusé avant d\'être ' +
            'lu. Un exercice raté dont la sorte a depuis été retirée n\'est plus ' +
            'compté ni servi dans « Revoir mes erreurs », qu\'il interrompait. La ' +
            'page de vérification déclare à son tour une règle de sécurité du ' +
            'contenu, et son script quitte la page pour un fichier à part.' }
  ];

  var actuelle = HISTORIQUE[HISTORIQUE.length - 1];

  CM2.version = {
    numero: actuelle.numero,
    date: actuelle.date,
    historique: HISTORIQUE
  };
})(window.CM2 = window.CM2 || {});
