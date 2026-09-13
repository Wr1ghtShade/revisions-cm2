/* Écrit app/domaines.js à partir des référentiels :
       node tests/generer-domaines.js

   Pourquoi un fichier généré plutôt qu'une lecture des JSON au chargement :
   ouverte depuis le disque, la page n'a pas le droit de faire fetch(). Les noms
   des domaines du programme doivent donc être dans un fichier JavaScript.

   Pourquoi généré plutôt qu'écrit à la main : ces noms sont ceux du Bulletin
   officiel. Les recopier serait la meilleure façon de les déformer. Le contrôle
   tests/banques.js vérifie que le fichier généré correspond toujours aux JSON.

   Seuls les noms et les identifiants sortent d'ici : les intitulés complets des
   objectifs restent dans data/referentiel, qui est la source. */
'use strict';

var fs = require('fs');
var path = require('path');

var racine = path.join(__dirname, '..');

var SOURCES = [
  { fichier: 'maths-cm2.json', matiere: 'mathematiques' },
  { fichier: 'francais-cm2.json', matiere: 'francais' },
  { fichier: 'sciences-cm2.json', matiere: 'sciences' },
  { fichier: 'histoire-geo-cm2.json', matiere: 'histoire_geo' },
  { fichier: 'numerique-crcn-cm2.json', matiere: 'numerique' },
  { fichier: 'emc-cm2.json', matiere: 'emc' }
];

/** Les objectifs d'un sous-domaine. Le calcul mental est le seul à porter un
    niveau de plus — ses objectifs sont rangés en blocs (faits numériques,
    numération, procédures) : on les remonte au sous-domaine. */
function objectifsDe(sd) {
  if (sd.objectifs) return sd.objectifs.map(function (o) { return o.id; });
  if (sd.blocs) {
    return sd.blocs.reduce(function (liste, bloc) {
      return liste.concat((bloc.objectifs || []).map(function (o) { return o.id; }));
    }, []);
  }
  return [];
}

/** Un domaine, ses sous-domaines, et pour chaque sous-domaine les
    identifiants de ses objectifs — de quoi rattacher un générateur au
    programme et compter ce qui est travaillé. */
function extraire() {
  var out = [];

  SOURCES.forEach(function (src) {
    var d = JSON.parse(fs.readFileSync(path.join(racine, 'data/referentiel', src.fichier), 'utf8'));

    // Les sciences sont découpées en thématiques, elles-mêmes en parties, et
    // chaque partie en blocs. La thématique joue le rôle du domaine, la partie
    // celui du sous-domaine, et objectifsDe remonte les blocs.
    if (d.thematiques) {
      d.thematiques.forEach(function (t) {
        out.push({
          matiere: src.matiere,
          id: t.id,
          nom: t.nom,
          sous: (t.parties || []).map(function (p) {
            return { id: p.id, nom: p.nom, objectifs: objectifsDe(p) };
          })
        });
      });
      return;
    }

    // L'histoire-géographie a deux moitiés, chacune découpée en thèmes,
    // eux-mêmes en sujets d'étude. Le sujet d'étude joue ici le rôle de
    // l'objectif : c'est lui que le référentiel marque évaluable ou non.
    if (d.histoire && d.geographie) {
      [d.histoire, d.geographie].forEach(function (moitie) {
        out.push({
          matiere: src.matiere,
          id: moitie.id,
          nom: moitie.nom,
          sous: (moitie.themes || []).map(function (t) {
            return {
              id: t.id,
              nom: t.nom,
              objectifs: (t.sujets_etude || []).map(function (s) { return s.id; })
            };
          })
        });
      });
      return;
    }

    // Le CRCN : cinq domaines, seize compétences, et des repères de maîtrise
    // qui tiennent lieu d'objectifs.
    if (d.domaines && d.domaines[0] && d.domaines[0].competences) {
      d.domaines.forEach(function (dom) {
        out.push({
          matiere: src.matiere,
          id: dom.id,
          nom: dom.nom,
          sous: (dom.competences || []).map(function (c) {
            return {
              id: c.id,
              nom: c.nom,
              objectifs: (c.reperes || []).map(function (r) { return r.id; })
            };
          })
        });
      });
      return;
    }

    // L'EMC n'a pas de domaines : son programme annuel est découpé en parties.
    if (d.parties) {
      out.push({
        matiere: src.matiere,
        id: 'emc',
        nom: d.titre_annuel || 'Enseignement moral et civique',
        sous: d.parties.map(function (p) {
          return {
            id: p.id,
            nom: p.nom || p.titre,
            objectifs: (p.contenus || []).map(function (c) { return c.id; })
          };
        })
      });
      return;
    }

    (d.domaines || []).forEach(function (dom) {
      out.push({
        matiere: src.matiere,
        id: dom.id,
        nom: dom.nom,
        sous: (dom.sous_domaines || []).map(function (sd) {
          return {
            id: sd.id,
            nom: sd.nom,
            objectifs: objectifsDe(sd)
          };
        })
      });
    });
  });

  return out;
}

/* Guillemets doubles, contrairement au reste du code : c'est JSON.stringify qui
   écrit, et il échappe correctement les apostrophes des noms du programme. */
function js(valeur) {
  return JSON.stringify(valeur);
}

function ecrire(domaines) {
  var lignes = [];
  lignes.push('/* Les domaines du programme, pour rattacher ce qui est travaillé au texte');
  lignes.push('   officiel plutôt qu\'à une liste de titres d\'exercices.');
  lignes.push('');
  lignes.push('   FICHIER GÉNÉRÉ — ne pas modifier à la main.');
  lignes.push('       node tests/generer-domaines.js');
  lignes.push('   Les noms viennent de data/referentiel/*.json, qui reste la source. Les');
  lignes.push('   JSON ne peuvent pas être lus au chargement : ouverte depuis le disque, la');
  lignes.push('   page n\'a pas le droit de faire fetch(). */');
  lignes.push('(function (CM2) {');
  lignes.push('  \'use strict\';');
  lignes.push('');
  lignes.push('  var DOMAINES = [');

  domaines.forEach(function (dom, i) {
    lignes.push('    { matiere: ' + js(dom.matiere) + ', id: ' + js(dom.id) + ',');
    lignes.push('      nom: ' + js(dom.nom) + ',');
    lignes.push('      sous: [');
    dom.sous.forEach(function (sd, j) {
      lignes.push('        { id: ' + js(sd.id) + ', nom: ' + js(sd.nom) + ',');
      lignes.push('          objectifs: ' + js(sd.objectifs) + ' }' + (j < dom.sous.length - 1 ? ',' : ''));
    });
    lignes.push('      ] }' + (i < domaines.length - 1 ? ',' : ''));
    if (i < domaines.length - 1) lignes.push('');
  });

  lignes.push('  ];');
  lignes.push('');
  lignes.push('  /* Index objectif -> sous-domaine, construit une fois au chargement. */');
  lignes.push('  var PAR_OBJECTIF = {};');
  lignes.push('  DOMAINES.forEach(function (dom) {');
  lignes.push('    dom.sous.forEach(function (sd) {');
  lignes.push('      sd.matiere = dom.matiere;');
  lignes.push('      sd.domaine = dom.id;');
  lignes.push('      sd.domaineNom = dom.nom;');
  lignes.push('      sd.objectifs.forEach(function (o) { PAR_OBJECTIF[o] = sd; });');
  lignes.push('    });');
  lignes.push('  });');
  lignes.push('');
  lignes.push('  CM2.domaines = {');
  lignes.push('    liste: function () { return DOMAINES; },');
  lignes.push('');
  lignes.push('    /** Sous-domaine du programme auquel appartient un objectif. */');
  lignes.push('    sousDomaineDe: function (objectifId) { return PAR_OBJECTIF[objectifId] || null; },');
  lignes.push('');
  lignes.push('    /** Tous les sous-domaines, dans l\'ordre du programme. */');
  lignes.push('    sousDomaines: function (matiere) {');
  lignes.push('      var out = [];');
  lignes.push('      DOMAINES.forEach(function (dom) {');
  lignes.push('        if (matiere && dom.matiere !== matiere) return;');
  lignes.push('        dom.sous.forEach(function (sd) { out.push(sd); });');
  lignes.push('      });');
  lignes.push('      return out;');
  lignes.push('    },');
  lignes.push('');
  lignes.push('    /** Nombre d\'objectifs du programme, toutes matières ou une seule. */');
  lignes.push('    nombreObjectifs: function (matiere) {');
  lignes.push('      var n = 0;');
  lignes.push('      DOMAINES.forEach(function (dom) {');
  lignes.push('        if (matiere && dom.matiere !== matiere) return;');
  lignes.push('        dom.sous.forEach(function (sd) { n += sd.objectifs.length; });');
  lignes.push('      });');
  lignes.push('      return n;');
  lignes.push('    }');
  lignes.push('  };');
  lignes.push('})(window.CM2 = window.CM2 || {});');
  lignes.push('');

  return lignes.join('\n');
}

var domaines = extraire();
var attendu = ecrire(domaines);
var sortie = path.join(racine, 'app/domaines.js');

var sousDomaines = domaines.reduce(function (n, d) { return n + d.sous.length; }, 0);
var objectifs = domaines.reduce(function (n, d) {
  return n + d.sous.reduce(function (m, sd) { return m + sd.objectifs.length; }, 0);
}, 0);
var compte = domaines.length + ' domaines, ' + sousDomaines + ' sous-domaines, ' +
             objectifs + ' objectifs';

/* Mode contrôle, pour les suites de tests : le fichier livré correspond-il
   toujours au référentiel ? Un nom de domaine corrigé dans le JSON et pas
   régénéré ici afficherait à l'enfant un intitulé qui n'est plus celui du
   programme. */
if (process.argv.indexOf('--verifier') !== -1) {
  var surDisque = fs.existsSync(sortie) ? fs.readFileSync(sortie, 'utf8') : '';
  if (surDisque.replace(/\r\n/g, '\n') !== attendu) {
    console.log('ÉCHEC : app/domaines.js ne correspond plus à data/referentiel.');
    console.log('        Régénérer avec : node tests/generer-domaines.js');
    process.exit(1);
  }
  console.log('app/domaines.js est à jour avec le référentiel (' + compte + ').');
  process.exit(0);
}

fs.writeFileSync(sortie, attendu, 'utf8');
console.log('app/domaines.js écrit : ' + compte + '.');
