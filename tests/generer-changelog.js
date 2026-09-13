/* Écrit CHANGELOG.md à partir de app/version.js :
       node tests/generer-changelog.js
       node tests/generer-changelog.js --verifier

   Pourquoi généré. Le journal des versions existe déjà à un endroit :
   app/version.js, que l'application lit pour l'afficher dans sa fenêtre « à
   propos » et pour inscrire son numéro dans les cahiers exportés. Recopier ce
   journal à la main dans un second fichier, c'est se garantir deux versions
   divergentes au bout de trois semaines — et un CHANGELOG qui ment est pire
   qu'un CHANGELOG absent.

   Le fichier Markdown est donc une vue, pas une source. Comme app/domaines.js,
   il est régénéré et contrôlé : le mode --verifier échoue si le fichier livré
   ne correspond plus à app/version.js. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');
var sortie = path.join(racine, 'CHANGELOG.md');

var contexte = vm.createContext({});
contexte.window = contexte;
vm.runInContext(fs.readFileSync(path.join(racine, 'app/version.js'), 'utf8'), contexte,
                { filename: 'app/version.js' });
var version = contexte.CM2.version;

/* Les mois en toutes lettres : une date lue par un humain ne s'écrit pas
   2026-09-13. */
var MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet',
            'août', 'septembre', 'octobre', 'novembre', 'décembre'];

function enFrancais(iso) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
  if (!m) return String(iso || '');
  return parseInt(m[3], 10) + ' ' + MOIS[parseInt(m[2], 10) - 1] + ' ' + m[1];
}

function ecrire() {
  var l = [];
  l.push('# 📓 Journal des versions');
  l.push('');
  l.push('> ⚠️ **Fichier généré — ne pas modifier à la main.**');
  l.push('> Il est écrit à partir de [`app/version.js`](app/version.js), qui est la seule');
  l.push('> source du journal : c\'est lui que l\'application affiche dans sa fenêtre');
  l.push('> « à propos » et qu\'elle inscrit dans les cahiers exportés.');
  l.push('>');
  l.push('> ```bash');
  l.push('> node tests/generer-changelog.js            # régénérer');
  l.push('> node tests/generer-changelog.js --verifier # contrôler');
  l.push('> ```');
  l.push('');
  l.push('## Comment lire les numéros');
  l.push('');
  l.push('La numérotation est `1.MAJEUR.MINEUR`.');
  l.push('');
  l.push('- le `1` ne bouge pas ;');
  l.push('- le **MAJEUR** change quand l\'application gagne quelque chose de structurant :');
  l.push('  un nouveau domaine d\'enseignement, une nouvelle capacité de fond ;');
  l.push('- le **MINEUR**, sur deux chiffres, change pour tout le reste : ajustements');
  l.push('  d\'interface, corrections, complément de contenu dans un domaine existant.');
  l.push('');
  l.push('🌟 marque une version majeure, 🔧 une version mineure.');
  l.push('');
  l.push('**Version actuelle : `' + version.numero + '` — ' + enFrancais(version.date) + '.**');
  l.push('');
  l.push('---');
  l.push('');

  version.historique.slice().reverse().forEach(function (v) {
    l.push('## ' + (v.majeur ? '🌟' : '🔧') + ' ' + v.numero +
           ' — ' + enFrancais(v.date));
    l.push('');
    l.push(v.quoi);
    l.push('');
  });

  l.push('---');
  l.push('');
  l.push('*' + version.historique.length + ' versions depuis le ' +
         enFrancais(version.historique[0].date) + '.*');
  l.push('');

  return l.join('\n');
}

var attendu = ecrire();

if (process.argv.indexOf('--verifier') !== -1) {
  var surDisque = fs.existsSync(sortie) ? fs.readFileSync(sortie, 'utf8') : '';
  if (surDisque.replace(/\r\n/g, '\n') !== attendu) {
    console.log('ÉCHEC : CHANGELOG.md ne correspond plus à app/version.js.');
    console.log('        Régénérer avec : node tests/generer-changelog.js');
    process.exit(1);
  }
  console.log('CHANGELOG.md est à jour avec app/version.js (' +
              version.historique.length + ' versions, actuelle ' + version.numero + ').');
  process.exit(0);
}

fs.writeFileSync(sortie, attendu, 'utf8');
console.log('CHANGELOG.md écrit : ' + version.historique.length + ' versions, actuelle ' +
            version.numero + '.');
