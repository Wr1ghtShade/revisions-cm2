# Textes officiels sources

Les six fichiers de `data/referentiel/` ont été extraits **exclusivement** des PDF de ce
dossier. Aucune autre source n'a été utilisée.

Ces PDF sont la pièce justificative du projet : ils permettent de vérifier n'importe quel
objectif, contrainte ou repère du référentiel en remontant au texte officiel.

Téléchargés le **11 septembre 2026**.

## Correspondance fichier source → référentiel

| PDF source | Texte officiel | Alimente |
|---|---|---|
| `maths-cycle3-bo16-17avril2025.pdf` | Programme de mathématiques pour le cycle 3, BO n° 16 du 17 avril 2025 | `maths-cm2.json` |
| `francais-cycle3-bo16-17avril2025.pdf` | Programme de français pour le cycle 3, BO n° 16 du 17 avril 2025 | `francais-cm2.json` |
| `emc-cp-terminale-bo24-13juin2024.pdf` | Programme d'EMC du CP à la terminale, BO n° 24 du 13 juin 2024 | `emc-cm2.json` |
| `sciences-technologie-cycle3-bo25-22juin2023.pdf` | Programme de sciences et technologie du cycle 3, BO n° 25 du 22 juin 2023 | `sciences-cm2.json` |
| `cycle3-consolide-2023-histoire-geographie.pdf` | Programme du cycle 3 consolidé (éduscol), d'après le BO n° 31 du 30 juillet 2020 et le BO n° 25 du 22 juin 2023 | `histoire-geo-cm2.json` |
| `crcn-document-accompagnement-2019.pdf` | Document d'accompagnement — Mise en œuvre du CRCN, DNE, novembre 2019, actualisation août 2020 | `numerique-crcn-cm2.json` |

## URLs d'origine

| Fichier | URL |
|---|---|
| `maths-cycle3-bo16-17avril2025.pdf` | https://www.education.gouv.fr/sites/default/files/ensel620_annexe2-v2.pdf |
| `francais-cycle3-bo16-17avril2025.pdf` | https://www.education.gouv.fr/sites/default/files/ensel620_annexe1.pdf |
| `emc-cp-terminale-bo24-13juin2024.pdf` | https://www.education.gouv.fr/sites/default/files/ensel934_annexe_ok.pdf |
| `sciences-technologie-cycle3-bo25-22juin2023.pdf` | https://www.education.gouv.fr/sites/default/files/document/Annexe%20%E2%80%93%20Programme%20de%20sciences%20et%20technologie%20du%20cycle%203-365166.pdf |
| `cycle3-consolide-2023-histoire-geographie.pdf` | https://eduscol.education.gouv.fr/sites/default/files/document/programme-d-enseignement-du-cycle-3-2023-100806.pdf |
| `crcn-document-accompagnement-2019.pdf` | https://eduscol.education.fr/document/20404/download |

Note d'accès : `education.gouv.fr` renvoie un blocage Cloudflare sur les pages HTML du BO.
Les PDF, eux, se téléchargent avec un User-Agent de navigateur (`curl -A "Mozilla/5.0 …"`).

## Empreintes SHA-256

Permettent de vérifier que le PDF consulté est bien celui dont le référentiel a été tiré.

```
6353fce9acf44b3aa90b8874fcee57b96be3600b715cb9b7ab157dfa355d4d72  crcn-document-accompagnement-2019.pdf
879251a7b7b6dbf63cc982b6b3684e33c51c0661bbac190e381490c9d61aad0f  cycle3-consolide-2023-histoire-geographie.pdf
0f28566133a4d9b8a3da3ee5648fd3f2c1915fe25bea4d05aa8b9894a1544761  emc-cp-terminale-bo24-13juin2024.pdf
e7c27f55c212b5ebb92ba8b60b6b1b0761a2301e7c0d0d780171c4cfb6e121ae  francais-cycle3-bo16-17avril2025.pdf
f3f79a75ca8be7f54409b8b7cee3eafd769c23d12e6c822a253454e2c703b508  maths-cycle3-bo16-17avril2025.pdf
a6b2a8a97a1027c6debe8df87c168b1d1b0bcff2d44f4cc16b799ee01bc33218  sciences-technologie-cycle3-bo25-22juin2023.pdf
```

Vérification : `sha256sum -c` depuis ce dossier, ou `sha256sum *.pdf` pour comparer.

## Relire un texte source

L'outil disponible est `pdftotext` de **Xpdf 4.06** (pas Poppler) : il n'a pas `-bbox`,
mais il a `-table`, que Poppler n'a pas.

```bash
pdftotext -enc UTF-8 -layout maths-cycle3-bo16-17avril2025.pdf -
```

`-layout` suffit pour les programmes en une colonne (maths, français, histoire-géo).

```bash
pdftotext -enc UTF-8 -table crcn-document-accompagnement-2019.pdf -
```

`-table` est **indispensable** pour les programmes présentés en tableau (CRCN, EMC,
sciences). Avec `-layout`, la colonne de droite déborde sur celle du milieu et le texte
devient inexploitable.

Piège connu sur ces tableaux : un numéro de ligne ou de niveau y est **centré
verticalement**, sur une hauteur qui dépend de la colonne la plus remplie. Sa position
dans le texte extrait ne permet donc pas de l'attribuer au bon élément. C'est ce qui a
d'abord fait classer le cyberharcèlement au niveau 1 du CRCN au lieu du niveau 2.

## Périmètre retenu

**CM2 uniquement.** Les programmes couvrent tout le cycle 3 (CM1, CM2, 6e) voire toute la
scolarité pour l'EMC et le CRCN. Seules les sections CM2 ont été extraites :

- maths et français : sections « Cours moyen deuxième année »
- EMC : section « CM2 : Vivre en république » (le CM1 « Faire société » est exclu)
- histoire-géographie : sections « Classe de CM2 »
- sciences : colonne « fin de cours moyen » (le programme ne distingue pas CM1 et CM2)
- CRCN : niveaux de maîtrise 1 et 2, les seuls qui concernent l'école élémentaire

## Versions applicables au CM2 en 2026-2027

Le CM2 est en année de bascule. Les programmes présents ici sont ceux qui s'appliquent
à la rentrée 2026, pas les plus récents publiés.

| Matière | Version retenue |
|---|---|
| Français | Nouveau — BO n° 16 du 17 avril 2025 |
| Mathématiques | Nouveau — BO n° 16 du 17 avril 2025 |
| EMC | Nouveau — BO n° 24 du 13 juin 2024 |
| Histoire-géographie | **Ancien** — BO n° 31 du 30 juillet 2020 |
| Sciences et technologie | **Ancien** — BO n° 25 du 22 juin 2023 |

Les nouveaux programmes d'histoire-géographie et de sciences existent déjà (2026) mais ne
s'appliquent au CM2 qu'à la rentrée 2027. Ne pas les substituer à ceux-ci avant cette date.

## Licence

Programmes sous **Licence Ouverte / Open Licence 2.0 (Etalab)**. Réutilisation libre avec
mention de la source et de la date de mise à jour — d'où ce fichier.

Source : ministère de l'Éducation nationale, textes cités ci-dessus.
Date de récupération : 11 septembre 2026.
