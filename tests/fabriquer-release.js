/* Fabrique le zip d'une release et son empreinte :
       node tests/fabriquer-release.js
       node tests/fabriquer-release.js --sortie /un/autre/dossier

   Produit, dans dist/ par défaut (ignoré par git) :
       revisions-cm2-<version>.zip          tout est rangé sous revisions-cm2-<version>/
       revisions-cm2-<version>.zip.sha256   au format de « sha256sum -c »

   La version est lue dans app/version.js tel qu'il est dans le commit courant.

   Pourquoi un script. Le zip était fait à la main, et son contenu variait d'une
   release à l'autre : la 1.12.10 n'avait ni LICENSE, ni les contrôles que son
   propre README demandait de lancer. La liste ci-dessous fixe ce qu'une release
   contient, une fois pour toutes.

   Ce qui est livré : l'application, la page de vérification, les contrôles
   automatiques et les référentiels qu'ils lisent — de quoi utiliser
   l'application ET vérifier qu'une modification n'a pas introduit de question
   fausse. Ce qui ne l'est pas : les PDF officiels de data/sources/ (6 Mo), dont
   ni l'application ni les contrôles n'ont besoin ; chaque fichier de
   data/referentiel/ donne l'adresse de son texte d'origine.

   Le zip est tiré du commit courant par « git archive » : un fichier modifié
   mais pas commité n'y entre pas. Le script refuse donc de tourner si l'arbre
   de travail n'est pas propre sur les fichiers livrés. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');
var crypto = require('crypto');
var execFileSync = require('child_process').execFileSync;

var racine = path.join(__dirname, '..');

var LIVRES = [
  'index.html',
  'tests.html',
  'README.md',
  'CHANGELOG.md',
  'LICENSE',
  'app',
  'img',
  'tests',
  'data/referentiel'
];

function git(args) {
  return execFileSync('git', args, { cwd: racine, encoding: 'utf8' });
}

var i = process.argv.indexOf('--sortie');
var dossier = i > -1 && process.argv[i + 1]
  ? path.resolve(process.argv[i + 1])
  : path.join(racine, 'dist');

var sale = git(['status', '--porcelain', '--'].concat(LIVRES)).trim();
if (sale) {
  console.log('ÉCHEC : des fichiers livrés ont des modifications non commitées :');
  console.log(sale);
  process.exit(1);
}

LIVRES.forEach(function (chemin) {
  if (!git(['ls-files', '--', chemin]).trim()) {
    console.log('ÉCHEC : « ' + chemin + ' » ne contient aucun fichier suivi par git.');
    process.exit(1);
  }
});

var contexte = vm.createContext({});
contexte.window = contexte;
vm.runInContext(git(['show', 'HEAD:app/version.js']), contexte, { filename: 'app/version.js' });
var numero = contexte.CM2.version.numero;

var nom = 'revisions-cm2-' + numero;
var zip = path.join(dossier, nom + '.zip');
fs.mkdirSync(dossier, { recursive: true });

git(['archive', '--format=zip', '--prefix=' + nom + '/', '-o', zip, 'HEAD', '--'].concat(LIVRES));

var empreinte = crypto.createHash('sha256').update(fs.readFileSync(zip)).digest('hex');
fs.writeFileSync(zip + '.sha256', empreinte + '  ' + nom + '.zip\n');

console.log('Version ' + numero + ' (commit ' + git(['rev-parse', '--short', 'HEAD']).trim() + ')');
console.log(zip + '  (' + Math.round(fs.statSync(zip).size / 1024) + ' Ko)');
console.log(zip + '.sha256');
console.log(empreinte);
