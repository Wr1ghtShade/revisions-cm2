# 📚 Le cahier de révisions — CM2

Une application de révision pour un élève de CM2, année scolaire **2026-2027**.
Elle s'ouvre en double-cliquant sur `index.html`. Il n'y a rien à installer,
rien à configurer, et **rien ne quitte l'ordinateur**.

> ### La règle qui commande tout
>
> **Une question fausse est pire que pas de question.**
>
> Un enfant qui révise seul n'a personne pour corriger l'application. Une
> réponse erronée n'est pas un bug : c'est une bêtise apprise, et qu'il faudra
> désapprendre. Tout ce qui suit — l'oracle de correction, les contrôles de
> programme, les banques rattachées au Bulletin officiel, les sujets laissés
> volontairement vides — découle de cette phrase.

---

## ✨ Ce que ça fait

- 🎲 **221 sortes d'exercices**, et un nombre illimité de questions : chaque
  exercice est *fabriqué* à la demande, pas tiré d'une liste.
- 🧠 **Révision espacée** : une notion ratée revient le lendemain, puis à 3, 7
  et 16 jours. Un exercice raté revient **à l'identique** — la même question,
  pas « une question du même genre ».
- 📒 **Un cahier par enfant**, conservé d'une visite à l'autre, exportable dans
  un fichier et restaurable ailleurs.
- 📈 **Une progression** rattachée aux domaines du programme officiel, et non à
  des titres d'exercices, avec un coin replié pour l'adulte.
- 📋 **Une vue enseignant** : tous les cahiers de l'ordinateur dans un tableau,
  ce qui coince chez plusieurs enfants, le détail d'un élève sans ouvrir son
  cahier.
- 🖨️ **Des fiches à imprimer** : 5, 10, 15 ou 20 exercices sur une feuille, le
  corrigé sur la page suivante, avec une référence qui permet de réimprimer la
  même fiche à l'identique.
- 👓 **Confort de lecture** : texte plus grand, texte plus aéré — utile en cas
  de dyslexie, valable aussi sur les fiches imprimées.
- ✈️ **Hors ligne, sans compte, sans serveur.** Aucune donnée ne sort de la
  machine, jamais.

---

## 🚀 Démarrer

```bash
# Ouvrir l'application : double-cliquer sur index.html
# Ou, depuis un terminal :
start index.html          # Windows
open index.html           # macOS
```

Les contrôles automatiques, eux, ont besoin de Node.js :

```bash
node tests/verifier.js            # la forme des exercices
node tests/banques.js             # les banques contre le référentiel
node tests/oracle.js              # la justesse des réponses, recalculée
node tests/interface.js           # les écrans s'exécutent-ils
```

`tests.html`, ouvert dans le navigateur, fait tourner les deux principaux
contrôles sans terminal.

---

## 📐 Les six domaines

Chiffres de la version `1.11.00`. « Couverts » compte les objectifs du
programme officiel qu'au moins un exercice travaille.

| Matière | Exercices | Objectifs couverts |
|---|---:|---|
| 📐 Mathématiques | 114 | 109 / 115 |
| 🖋️ Français | 41 | 39 / 82 |
| 🔬 Sciences et technologie | 27 | 60 / 81 |
| 🗺️ Histoire-géographie | 17 | 17 / 19 |
| 💻 Numérique (CRCN) | 10 | 18 / 47 |
| 🏛️ Vivre en république (EMC) | 12 | 12 / 14 |

### Ce qui n'est pas couvert, et pourquoi

Ces manques sont **délibérés**. Les combler supposerait de poser des questions
que le programme n'autorise pas, ou d'évaluer par un écran ce qui ne s'évalue
pas par un écran.

- **6 objectifs de mathématiques** demandent la règle, l'équerre, le compas ou
  le pliage. Un écran ne peut pas voir un tracé.
- **43 objectifs de français** sont de la lecture à voix haute, de l'écriture
  longue et de l'oral.
- **21 objectifs de sciences** et **29 repères du CRCN** décrivent un geste —
  monter un circuit, fabriquer une maquette, paramétrer un outil. Il n'y a pas
  de fait à restituer derrière un geste.
- **Les guerres mondiales** ne portent aucune question. Le programme ne
  l'autorise que sur des repères chronologiques qu'il n'énonce nulle part, et
  la Résistance, la collaboration et le génocide des Juifs se traitent en
  classe avec un adulte.
- **Le cyberharcèlement** ne porte aucune question, sous aucune forme.
  L'Éducation nationale impose un traitement en classe avec un adulte présent.
  En cas de besoin : **3018**, numéro national contre les violences numériques.
- **3 contenus** sont marqués non évaluables par les programmes eux-mêmes.

---

## 🏗️ Comment c'est construit

### Zéro dépendance, zéro build

Du HTML et du JavaScript, chargés par des balises `<script>` classiques dans un
espace de noms global `CM2`. Pas de React, pas de Vite, pas de `npm install`.

La raison est technique et elle est contraignante : ouverte depuis le disque en
`file://`, une page n'a le droit ni d'utiliser les modules ES, ni d'appeler
`fetch()`. Aucun fichier de données ne peut donc être lu au chargement — d'où
`app/domaines.js`, qui est **généré** depuis les JSON du référentiel.

### On stocke des graines, pas des questions

Un exercice n'est jamais enregistré. Il est identifié par le couple
`(generateur_id, graine)`, et un générateur pseudo-aléatoire déterministe le
reconstruit à l'identique. C'est ce qui permet à la révision espacée de
reproposer **exactement** la question ratée trois semaines plus tôt, et à une
fiche imprimée d'être réimprimée telle quelle depuis sa seule référence.

### Deux façons de produire une question

| | |
|---|---|
| **Générateurs paramétrés** | Le code calcule l'énoncé *et* la réponse. Mathématiques, français. |
| **Banques rédigées** | Les contenus sont institutionnels, pas paramétrables. Sciences, histoire-géo, numérique, EMC. |

Les banques suivent un pipeline en quatre étapes, imposé par le projet :
**extraire** les seuls contenus évaluables du référentiel → **rédiger** sans
rien ajouter de mémoire → **rattacher** chaque question à son objectif →
**contrôler** automatiquement le tout.

---

## 🛡️ Comment on sait que c'est juste

C'est la partie la plus importante du projet, et de loin.

### 1. Le contrôle de programme, avant de servir

`app/contraintes.js` traduit en code les blocs `contraintes_generation` des
référentiels : champ numérique, dénominateurs, verbes autorisés, notions
réservées à la 6e. **Tout exercice passe par ce contrôle avant d'être
affiché** ; un exercice hors-programme lève une erreur au lieu d'être servi.

### 2. 🔮 L'oracle de correction

Le contrôle de forme ne dit rien de la justesse. L'oracle recalcule donc la
réponse **depuis l'énoncé, par un chemin totalement indépendant** du code de
l'application : il lit le texte de la question, l'analyse avec son propre
évaluateur, et compare.

- **92 générateurs sur 221** sont recalculés, soit 27 365 exercices à chaque
  passage ;
- l'arithmétique y est **exactement rationnelle** — `747 ÷ 8` vaut `747/8`,
  jamais `93.37500000000001` ;
- un QCM n'est déclaré juste que si la proposition retenue est **la seule**
  défendable ;
- un énoncé que l'oracle ne reconnaît plus est signalé bruyamment, pour que la
  couverture ne puisse pas fondre en silence ;
- 41 auto-tests prouvent que l'oracle **sait échouer** : on lui soumet des
  réponses fausses connues, et il doit les attraper.

Ce qui n'est pas recalculable est déclaré comme tel, avec sa raison : réponse
lue sur une figure, réponse de langue, banque rédigée.

### 3. 📏 Les contrôles de banque

Pour les 185 questions rédigées à la main, rien n'est calculé — donc rien n'est
vérifiable par le simple fait que le programme tourne. `tests/banques.js`
remplace cette garantie :

- chaque question se rattache à un objectif **qui existe** et **qui est marqué
  évaluable** ;
- aucun objectif non évaluable ne porte de question ;
- aucun objectif évaluable n'est oublié ;
- **aucune date inventée** : toute année affirmée doit figurer dans le
  référentiel — en histoire, ce contrôle s'applique **jusque dans les mauvaises
  réponses**, car une date fausse mise sous les yeux s'apprend aussi ;
- les zones sensibles sont vérifiées mot à mot ;
- les interdits propres à chaque programme sont vérifiés sur tout le texte
  (unités de masse hors programme, formes d'énergie non exigibles, territoires
  particuliers…).

### 4. 🧪 Neuf suites, toutes vertes

```bash
node tests/verifier.js              # forme, reproductibilité, place de la bonne réponse
node tests/banques.js               # les 4 banques contre leurs référentiels
node tests/progression.js           # révision espacée
node tests/bilan.js                 # lectures du cahier
node tests/classe.js                # vue enseignant
node tests/interface.js             # les écrans, dans un DOM de poche
node tests/oracle-autotest.js       # l'oracle sait-il échouer
node tests/oracle.js                # la justesse, recalculée
node tests/generer-domaines.js --verifier
node tests/generer-changelog.js --verifier
```

`tests/interface.js` monte un DOM minimal en Node et **exécute réellement
`app/ui.js`** : un identifiant manquant, un écran oublié, un bouton sans
écouteur font échouer la suite.

---

## 📂 Où est quoi

```
index.html              L'application entière : structure, styles, écrans
tests.html              Page de vérification, ouvrable sans terminal

app/
  rng.js                Tirage déterministe (mulberry32)
  format.js             Nombres à la française, comparaison des réponses
  contraintes.js        Les interdits des programmes, exécutables
  registre.js           Déclaration et production des exercices
  qcm.js                Fabrication des QCM et de leurs leurres
  figures.js            Figures SVG : horloge, quadrillage, patrons, angles…
  domaines.js           ⚙️ GÉNÉRÉ depuis data/referentiel
  generateurs/          15 fichiers : mathématiques et français
  banques/              4 banques rédigées : sciences, histoire-géo, numérique, EMC
  profil.js             Les cahiers : stockage, export, restauration
  progression.js        Révision espacée, composition des séries
  bilan.js              Ce que le cahier sait raconter
  classe.js             La vue enseignant
  fiche.js              Les fiches à imprimer
  ui.js                 Les écrans
  version.js            Le journal des versions (source du CHANGELOG)

data/referentiel/       Les programmes officiels, extraits des PDF du BO
tests/                  Les contrôles automatiques
```

---

## 🔒 Vie privée

Il n'y a **ni serveur, ni compte, ni connexion réseau**. Les cahiers vivent dans
le `localStorage` du navigateur, sur cette machine seulement. Le bouton
*Sauvegarder mon cahier* écrit un fichier JSON que vous rangez où vous voulez.

La vue enseignant ne voit que les cahiers présents dans ce navigateur : un
enfant qui travaille sur un autre ordinateur n'y figure qu'une fois son fichier
restauré. C'est une limite assumée, et elle est écrite à l'écran.

> ⚠️ La mémoire du navigateur peut s'effacer toute seule. Au bout de cinq
> séances non sauvegardées, l'application le rappelle et dit combien de séances
> seraient perdues.

---

## 📜 Sources et licence

Les contenus viennent des programmes officiels français, extraits des annexes
du Bulletin officiel et rangés dans `data/referentiel/` avec leur source :

| Matière | Texte | Source |
|---|---|---|
| Mathématiques | Programme de mathématiques du cycle 3 | BO n° 16 du 17 avril 2025 |
| Français | Programme de français du cycle 3 | BO n° 16 du 17 avril 2025 |
| Sciences et technologie | Programme de sciences et technologie du cycle 3 | BO n° 25 du 22 juin 2023 |
| Histoire-géographie | Programme du cycle de consolidation | BO n° 31 du 30 juillet 2020 |
| Numérique | Cadre de référence des compétences numériques | Décret n° 2019-919, BO n° 37 du 10 octobre 2019 |
| EMC | Programme d'enseignement moral et civique | BO n° 24 du 13 juin 2024 |

Les textes des programmes sont sous **Licence Ouverte / Open Licence 2.0**
(Etalab). Chaque fichier de `data/referentiel/` porte sa source, son URL
d'origine et sa date d'extraction.

Le journal complet des versions est dans [CHANGELOG.md](CHANGELOG.md).
