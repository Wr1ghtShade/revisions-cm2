/* Chargeur commun des tests en ligne de commande.

   La liste des scripts de l'application n'existe plus qu'à un seul endroit :
   les balises <script> d'index.html, dans leur ordre. Chaque test en prend la
   tranche dont il a besoin.

   Avant, six fichiers de tests/ tenaient chacun leur propre copie de cette
   liste, et un seul oubli était détecté. Un générateur absent de la copie de
   tests/oracle.js n'y était simplement pas chargé : l'oracle annonçait « toutes
   les réponses recalculées sont justes » après en avoir recalculé zéro.

   tests.html, qui ne peut pas lire index.html depuis le navigateur, garde sa
   liste en dur ; tests/verifier.js exige qu'elle reprenne à l'identique la
   tranche « exercices ». */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');

function scriptsDe(page) {
  var texte = fs.readFileSync(path.join(racine, page), 'utf8');
  var out = [], re = /<script src="([^"]+)"/g, m;
  while ((m = re.exec(texte))) out.push(m[1]);
  return out;
}

var APPLICATION = scriptsDe('index.html');

// Tout ce qui précède le premier module du cahier produit des exercices sans
// jamais toucher au stockage ni à l'écran.
var FIN_EXERCICES = APPLICATION.indexOf('app/profil.js');
if (FIN_EXERCICES === -1) {
  throw new Error('tests/charger.js : app/profil.js introuvable dans index.html');
}

function estLangueOuGenerateur(f) {
  return /^app\/(generateurs|lexique)\//.test(f) || f === 'app/conjugaison.js';
}

var TRANCHES = {
  // Socle, outils de langue, générateurs et banques.
  exercices: APPLICATION.slice(0, FIN_EXERCICES),
  // Le socle et les seules banques rédigées, sans aucun générateur.
  banques: APPLICATION.slice(0, FIN_EXERCICES).filter(function (f) {
    return !estLangueOuGenerateur(f);
  }),
  // Tout, sauf l'interface.
  cahier: APPLICATION.filter(function (f) { return f !== 'app/ui.js'; }),
  // L'application entière, dans l'ordre d'index.html.
  application: APPLICATION.slice()
};

/** La liste des fichiers d'une tranche. */
function tranche(nom) {
  if (!TRANCHES[nom]) throw new Error('tests/charger.js : tranche inconnue « ' + nom + ' »');
  return TRANCHES[nom].slice();
}

/** Exécute les fichiers d'une tranche dans un contexte vm. Un fichier absent du
    disque arrête tout : un test qui tournerait sans lui mentirait. */
function executer(nom, contexte) {
  tranche(nom).forEach(function (f) {
    var chemin = path.join(racine, f);
    if (!fs.existsSync(chemin)) {
      console.error('fichier absent : ' + f);
      process.exit(1);
    }
    vm.runInContext(fs.readFileSync(chemin, 'utf8'), contexte, { filename: f });
  });
  return contexte;
}

module.exports = {
  racine: racine,
  scriptsDe: scriptsDe,
  tranche: tranche,
  executer: executer
};
