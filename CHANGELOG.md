# 📓 Journal des versions

> ⚠️ **Fichier généré — ne pas modifier à la main.**
> Il est écrit à partir de [`app/version.js`](app/version.js), qui est la seule
> source du journal : c'est lui que l'application affiche dans sa fenêtre
> « à propos » et qu'elle inscrit dans les cahiers exportés.
>
> ```bash
> node tests/generer-changelog.js            # régénérer
> node tests/generer-changelog.js --verifier # contrôler
> ```

## Comment lire les numéros

La numérotation est `1.MAJEUR.MINEUR`.

- le `1` ne bouge pas ;
- le **MAJEUR** change quand l'application gagne quelque chose de structurant :
  un nouveau domaine d'enseignement, une nouvelle capacité de fond ;
- le **MINEUR**, sur deux chiffres, change pour tout le reste : ajustements
  d'interface, corrections, complément de contenu dans un domaine existant.

🌟 marque une version majeure, 🔧 une version mineure.

**Version actuelle : `1.11.01` — 13 septembre 2026.**

---

## 🔧 1.11.01 — 13 septembre 2026

La page de vérification contrôlait encore les seuls exercices des quatre premiers domaines : les banques de sciences, d'histoire-géographie et de numérique y manquaient. Corrigé, et un contrôle interdit désormais qu'un fichier d'exercices soit chargé par l'application sans l'être aussi par la page de vérification.

## 🌟 1.11.00 — 13 septembre 2026

Nouveau domaine : le numérique, d'après le cadre de référence des compétences numériques. Banque de 25 questions sur les 17 repères évaluables des niveaux 1 et 2 — sources, données personnelles, traces de navigation, droit d'auteur, sécurité, effets sur la santé et l'environnement. Le cyberharcèlement ne fait l'objet d'aucune question : il se traite en classe avec un adulte.

## 🌟 1.10.00 — 13 septembre 2026

Nouveau domaine : histoire et géographie. Banque de 33 questions sur 17 des 18 sujets d'étude évaluables. Aucune date qui ne figure au programme, y compris dans les leurres. Les guerres mondiales ne font l'objet d'aucune question : le programme ne l'autorise que sur des repères chronologiques qu'il n'énonce pas. Les quatre sujets sur l'âge industriel, que le professeur choisit, ne sont posés que si le cahier les a cochés.

## 🌟 1.9.00 — 13 septembre 2026

Nouveau domaine : sciences et technologie. Banque de 92 questions couvrant les 60 objectifs évaluables du programme — la matière et ses états, les mélanges, les mouvements, la lumière et les ombres, le vivant et sa classification, la digestion, les objets techniques, la Terre et les écosystèmes. Contrôle automatique du rattachement au référentiel, objectif par objectif.

## 🔧 1.8.01 — 13 septembre 2026

Revue du code. Une sorte d'exercice retirée entre deux versions n'apparaît plus sous son identifiant technique dans « ce qui coince » : elle reste dans le cahier, mais hors des listes. Les dates lues par un adulte s'écrivent 13/09/2026 et non 2026-09-13. Accords au singulier corrigés dans la vue enseignant.

## 🌟 1.8.00 — 13 septembre 2026

La vue enseignant : tous les cahiers de l'ordinateur dans un tableau — où chacun en est, ce qui lui reste à revoir, depuis quand il n'est pas venu — le détail d'un enfant sans ouvrir son cahier, les domaines du programme additionnés sur la classe, et les notions qui résistent à plusieurs enfants à la fois. Imprimable. Les cahiers venus d'un autre ordinateur s'y ajoutent par leur fichier de sauvegarde.

## 🔧 1.7.07 — 13 septembre 2026

Quatre objectifs de mathématiques de plus — la notation des angles, le patron du pavé, l'ordre des étapes d'un programme de construction, les assemblages de cubes — soit 109 objectifs couverts sur 115. Les six qui restent demandent la règle, le compas ou le pliage : un écran ne peut pas les évaluer.

## 🔧 1.7.06 — 13 septembre 2026

Confort de lecture : texte plus grand, texte plus aéré. Les deux réglages valent aussi pour les fiches imprimées et sont rangés dans le cahier de l'enfant.

## 🔧 1.7.05 — 13 septembre 2026

Rappel de sauvegarde au bureau après cinq séances non enregistrées, avec le nombre de séances que perdrait un effacement du navigateur.

## 🔧 1.7.04 — 13 septembre 2026

Les autres écritures d'une même réponse sont acceptées — « 2 h 5 » vaut « 2 h 05 » — et le corrigé des fiches les indique. Les durées ne sont plus obligées de dépasser dix minutes pour rester sans ambiguïté.

## 🔧 1.7.03 — 13 septembre 2026

Les touches 1 à 4 répondent aux questions à choix : le numéro est écrit dans la case de chaque proposition. Une réponse écrite fausse est désormais remontrée telle qu'elle a été tapée, pour distinguer la faute de frappe de l'erreur de raisonnement.

## 🔧 1.7.02 — 12 septembre 2026

Les fiches se demandent en 5, 10, 15 ou 20 exercices — la même échelle que les séries à l'écran, au lieu de 10, 20 ou 30.

## 🔧 1.7.01 — 12 septembre 2026

Les fiches s'impriment sans le bandeau d'adresse « file:///… » que le navigateur ajoutait en tête de page.

## 🌟 1.7.00 — 12 septembre 2026

Les fiches à imprimer : dix, vingt ou trente exercices sur une feuille, le corrigé sur la page suivante. Chaque fiche porte une référence qui permet de la réimprimer à l'identique. De quoi travailler au crayon, sans ordinateur.

## 🌟 1.6.00 — 12 septembre 2026

La progression, enfin lisible : ce qui est travaillé est rattaché aux domaines du programme officiel plutôt qu'à des titres d'exercices, et un coin replié donne à l'adulte les six dernières semaines, ce qui a l'air acquis, ce qui coince, et la part du programme couverte.

## 🔧 1.5.01 — 12 septembre 2026

Six mascottes de plus — dinosaure, dragon, loup, requin, fusée, ballon — soit dix-huit au choix, chacune annoncée par son nom pour les lecteurs d'écran.

## 🌟 1.5.00 — 12 septembre 2026

Oracle de correction : la réponse annoncée est désormais recalculée depuis l'énoncé, par un second chemin indépendant du code de l'application, pour 91 sortes d'exercices sur 163. Un QCM doit en outre n'avoir qu'une seule proposition défendable. Le contrôle tourne en ligne de commande et dans la page de vérification.

## 🔧 1.4.02 — 12 septembre 2026

Fenêtre « à propos », ouverte par le « i » du tableau : ce que fait l'application, d'où viennent les questions, ce que le cahier retient, à quoi sert la page de vérification, et le journal des versions.

## 🔧 1.4.01 — 12 septembre 2026

Numéro de version affiché en bas de page et inscrit dans les cahiers exportés.

## 🌟 1.4.00 — 12 septembre 2026

Nouveau domaine : enseignement moral et civique. Banque de 35 questions sur les 12 contenus évaluables du programme « Vivre en république », avec contrôle automatique du rattachement au référentiel.

## 🔧 1.3.01 — 12 septembre 2026

Une série arrêtée volontairement ne reprend plus toute seule au rechargement. Restauration d'un cahier possible avant d'en avoir créé un. Pied de page raccourci.

## 🌟 1.3.00 — 12 septembre 2026

Couverture du programme portée à 105 objectifs de mathématiques sur 115 et 39 de français sur 82, dont les exercices avec figures : demi-droite graduée, horloge, quadrillage, tableaux, diagrammes, patrons, angles.

## 🌟 1.2.00 — 12 septembre 2026

Révision espacée : chaque notion et chaque exercice raté revient à 1, 3, 7 puis 16 jours. Sauvegarde et restauration du cahier dans un fichier.

## 🔧 1.1.01 — 12 septembre 2026

Marelle de cour dessinée en SVG, reprise d'une série interrompue par un rafraîchissement de la page, séries de 5 à 20 questions, barre de bas de page portant la provenance des programmes et la licence.

## 🌟 1.1.00 — 12 septembre 2026

Les cahiers : un profil par enfant, conservé d'une visite à l'autre, avec suivi des réussites et bascule d'un cahier à l'autre.

## 🔧 1.0.01 — 11 septembre 2026

Habillage « salle de classe » : tableau vert, feuille à petits carreaux, marelle de progression, objets de la trousse.

## 🌟 1.0.00 — 11 septembre 2026

Socle de production — tirage déterministe, contrôle des contraintes du programme, registre — et premiers générateurs de mathématiques et de français (85). Interface de révision et page de vérification.

---

*27 versions depuis le 11 septembre 2026.*
