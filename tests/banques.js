/* Quatrième étape du pipeline des banques : le contrôle automatique.
       node tests/banques.js

   Une banque est du texte rédigé à la main. Rien n'y est calculé, donc rien n'y
   est vérifiable par le simple fait que le programme tourne. Ces contrôles
   remplacent cette garantie :

   - chaque question se rattache à un contenu qui existe dans le référentiel et
     qui y est marqué evaluable: true ;
   - aucun contenu marqué evaluable: false n'a de question ;
   - tous les contenus évaluables sont couverts ;
   - chaque repère cité existe, et sa valeur figure réellement dans la réponse
     ou dans l'explication ;
   - toute date et tout numéro d'article affirmés dans une bonne réponse ou une
     explication se retrouvent quelque part dans le référentiel. C'est le
     garde-fou contre la date inventée de mémoire ;
   - la zone sensible ne porte qu'une question, et son texte ne demande ni de
     qualifier, ni de comparer, ni de raconter une expérience personnelle. */
'use strict';

var fs = require('fs');
var path = require('path');
var vm = require('vm');

var racine = path.join(__dirname, '..');

var contexte = vm.createContext({ console: console, Math: Math, Date: Date });
contexte.window = contexte;
require('./charger').tranche('banques').forEach(function (f) {
  vm.runInContext(fs.readFileSync(path.join(racine, f), 'utf8'), contexte, { filename: f });
});
var CM2 = contexte.CM2;

var BANQUES = [
  { nom: 'EMC', banque: CM2.banques.emc, fichier: 'emc-cm2.json' }
];

var echecs = [];
function exiger(condition, message) { if (!condition) echecs.push(message); }

BANQUES.forEach(function (b) {
  var brut = fs.readFileSync(path.join(racine, 'data/referentiel/' + b.fichier), 'utf8');
  var ref = JSON.parse(brut);

  /* Index des contenus et des repères du référentiel. */
  var contenus = {}, reperes = {}, sensibles = {};
  (ref.parties || []).forEach(function (partie) {
    (partie.contenus || []).forEach(function (c) {
      contenus[c.id] = c;
      if (partie.zone_sensible) sensibles[c.id] = true;
    });
  });
  (ref.reperes_memorisables || []).forEach(function (r) { reperes[r.id] = r; });

  console.log('\n--- ' + b.nom + ' : ' + b.banque.length + ' contenus, ' +
    b.banque.reduce(function (n, x) { return n + x.questions.length; }, 0) + ' questions');

  var couverts = {};

  b.banque.forEach(function (bloc) {
    var c = contenus[bloc.contenu];
    exiger(!!c, bloc.contenu + ' : ce contenu n\'existe pas dans le référentiel');
    if (!c) return;
    exiger(c.evaluable === true,
           bloc.contenu + ' : contenu marqué evaluable: false, il ne doit porter aucune question');
    couverts[bloc.contenu] = true;

    if (sensibles[bloc.contenu]) {
      exiger(bloc.questions.length === 1,
             bloc.contenu + ' : zone sensible, une seule question est admise (' +
             bloc.questions.length + ' trouvées)');
      var INTERDITS = ['selon toi', 'que penses-tu', 'd\'après toi', 'le plus grave',
                       'le pire', 'qualifie', 'as-tu déjà', 'ton avis', 'ressens'];
      bloc.questions.forEach(function (q) {
        var texte = (q.q + ' ' + q.bonne + ' ' + q.explication).toLowerCase();
        INTERDITS.forEach(function (mot) {
          exiger(texte.indexOf(mot) === -1,
                 bloc.contenu + ' : zone sensible, la question emploie « ' + mot + ' »');
        });
      });
    }

    bloc.questions.forEach(function (q, i) {
      var ou = bloc.contenu + ' question ' + (i + 1);
      exiger(q.q && q.bonne && q.explication, ou + ' : champ manquant');
      exiger(q.leurres && q.leurres.length >= 2, ou + ' : au moins deux leurres sont attendus');
      exiger(q.leurres.indexOf(q.bonne) === -1, ou + ' : la bonne réponse figure aussi en leurre');

      var affirme = q.bonne + ' ' + q.explication;

      if (q.repere) {
        var rep = reperes[q.repere];
        exiger(!!rep, ou + ' : repère inconnu « ' + q.repere + ' »');
        if (rep) {
          exiger(affirme.indexOf(rep.valeur) !== -1 ||
                 affirme.toLowerCase().indexOf(rep.valeur.toLowerCase()) !== -1,
                 ou + ' : la valeur du repère (« ' + rep.valeur + ' ») n\'apparaît ni dans la ' +
                 'réponse ni dans l\'explication');
        }
      }

      // Toute année et tout numéro d'article affirmés doivent exister dans le
      // référentiel. Les leurres, eux, sont affichés comme faux : ils échappent
      // à ce contrôle.
      (affirme.match(/\b1[6-9]\d\d\b|\b20\d\d\b/g) || []).forEach(function (annee) {
        exiger(brut.indexOf(annee) !== -1,
               ou + ' : l\'année ' + annee + ' ne figure pas dans le référentiel');
      });
      (affirme.match(/article\s+(\d+er|\d+)/gi) || []).forEach(function (art) {
        var normalise = art.toLowerCase().replace(/\s+/g, ' ');
        exiger(brut.toLowerCase().indexOf(normalise) !== -1,
               ou + ' : « ' + art + ' » ne figure pas dans le référentiel');
      });
    });
  });

  /* Aucun contenu évaluable ne doit rester sans question. */
  Object.keys(contenus).forEach(function (id) {
    if (contenus[id].evaluable === true) {
      exiger(couverts[id], id + ' : contenu évaluable sans aucune question');
    } else {
      exiger(!couverts[id], id + ' : contenu non évaluable, il ne doit pas être couvert');
    }
  });

  /* Les exercices produits passent aussi les contrôles communs du registre. */
  b.banque.forEach(function (bloc) {
    for (var g = 0; g < 200; g++) {
      try {
        CM2.registre.produire(bloc.contenu, g);
      } catch (e) {
        echecs.push(bloc.contenu + ' graine ' + g + ' : ' + e.message);
        break;
      }
    }
  });
});

/* ====================================================================== */
/* Sciences et technologie                                                */
/* ====================================================================== */

/* La banque de sciences est rangée par bloc du programme, et chaque question
   porte l'objectif dont elle relève : c'est à ce niveau-là que le référentiel
   pose le drapeau evaluable. Les contrôles portent donc sur les objectifs et
   non sur les blocs, contrairement à l'EMC où le drapeau est sur le contenu. */
(function controlerSciences() {
  var brut = fs.readFileSync(path.join(racine, 'data/referentiel/sciences-cm2.json'), 'utf8');
  var ref = JSON.parse(brut);
  var banque = CM2.banques.sciences;

  var objectifs = {}, blocsConnus = {};
  ref.thematiques.forEach(function (t) {
    (t.parties || []).forEach(function (p) {
      (p.blocs || []).forEach(function (b) {
        blocsConnus[b.id] = b;
        (b.objectifs || []).forEach(function (o) { objectifs[o.id] = { o: o, bloc: b.id }; });
      });
    });
  });

  var questions = banque.reduce(function (n, x) { return n + x.questions.length; }, 0);
  console.log('\n--- Sciences : ' + banque.length + ' blocs, ' + questions + ' questions');

  var couverts = {};

  banque.forEach(function (bloc) {
    exiger(!!blocsConnus[bloc.bloc], bloc.bloc + ' : ce bloc n\'existe pas dans le référentiel');

    bloc.questions.forEach(function (q, i) {
      var ou = bloc.bloc + ' question ' + (i + 1);

      exiger(q.q && q.bonne && q.explication, ou + ' : champ manquant');
      exiger(q.leurres && q.leurres.length >= 2, ou + ' : au moins deux leurres sont attendus');
      exiger(!q.leurres || q.leurres.indexOf(q.bonne) === -1,
             ou + ' : la bonne réponse figure aussi en leurre');

      var cible = objectifs[q.objectif];
      exiger(!!cible, ou + ' : objectif inconnu « ' + q.objectif + ' »');
      if (!cible) return;

      exiger(cible.o.evaluable === true,
             ou + ' : l\'objectif ' + q.objectif + ' est marqué evaluable: false');
      exiger(cible.bloc === bloc.bloc,
             ou + ' : l\'objectif ' + q.objectif + ' appartient au bloc ' + cible.bloc);
      couverts[q.objectif] = true;

      // Toute année affirmée dans une bonne réponse ou une explication doit se
      // retrouver dans le référentiel : garde-fou contre la date de mémoire.
      var affirme = q.bonne + ' ' + q.explication;
      (affirme.match(/\b1[6-9]\d\d\b|\b20\d\d\b/g) || []).forEach(function (annee) {
        exiger(brut.indexOf(annee) !== -1,
               ou + ' : l\'année ' + annee + ' ne figure pas dans le référentiel');
      });
    });

    /* Les objectifs déclarés au registre doivent tous être évaluables. Un bloc
       peut aussi déclarer un objectif d'un autre référentiel — c'est ainsi que
       le recoupement avec le CRCN est « lié plutôt que dupliqué » ; ceux-là
       sont contrôlés par la section du numérique. */
    var spec = CM2.registre.get(bloc.bloc);
    exiger(!!spec, bloc.bloc + ' : aucun générateur enregistré');
    if (spec) {
      var lies = bloc.objectifsLies || [];
      spec.objectifs.forEach(function (o) {
        if (lies.indexOf(o) !== -1) return;
        exiger(!!objectifs[o] && objectifs[o].o.evaluable === true,
               bloc.bloc + ' : objectif déclaré au registre inconnu ou non évaluable (' + o + ')');
      });
    }
  });

  /* Couverture : tout objectif évaluable porte au moins une question, aucun
     objectif non évaluable n'en porte. */
  Object.keys(objectifs).forEach(function (id) {
    var o = objectifs[id].o;
    if (o.evaluable === true) {
      exiger(couverts[id], id + ' : objectif évaluable sans aucune question');
    } else {
      exiger(!couverts[id], id + ' : objectif non évaluable, il ne doit porter aucune question');
    }
  });

  /* Les interdits propres au référentiel de sciences. Ils portent sur tout le
     texte, leurres compris : un leurre qui emploie une unité hors programme
     l'enseigne autant qu'une bonne réponse. */
  var texte = banque.map(function (bloc) {
    return bloc.questions.map(function (q) {
      return q.q + ' ' + q.bonne + ' ' + (q.leurres || []).join(' ') + ' ' + q.explication;
    }).join(' ');
  }).join(' ').toLowerCase();

  ['hectogramme', 'décagramme', 'décigramme', 'centigramme'].forEach(function (mot) {
    exiger(texte.indexOf(mot) === -1,
           'unité de masse hors programme employée : « ' + mot + ' »');
  });
  ['énergie chimique', 'énergie thermique', 'énergie nucléaire', 'énergie lumineuse']
    .forEach(function (mot) {
      exiger(texte.indexOf(mot) === -1,
             'forme d\'énergie non exigible au cours moyen : « ' + mot + ' »');
    });
  // Le programme ne distingue pas le CM1 du CM2 : aucune question ne doit
  // présenter un contenu comme appartenant à l'une des deux années.
  ['du cm1', 'du cm2', 'en cm1', 'en cm2'].forEach(function (mot) {
    exiger(texte.indexOf(mot) === -1,
           'une question situe un contenu dans une année précise : « ' + mot + ' »');
  });

  /* Les exercices produits passent aussi les contrôles communs du registre. */
  banque.forEach(function (bloc) {
    for (var g = 0; g < 200; g++) {
      try {
        CM2.registre.produire(bloc.bloc, g);
      } catch (e) {
        echecs.push(bloc.bloc + ' graine ' + g + ' : ' + e.message);
        break;
      }
    }
  });
})();

/* ====================================================================== */
/* Histoire et géographie                                                 */
/* ====================================================================== */

/* C'est la banque la plus contrainte, et les contrôles le sont autant :
   aucune date hors des sept repères du référentiel, aucun questionnement sur
   la zone sensible, aucun territoire particulier supposé étudié, et les quatre
   sujets laissés au choix du professeur déclarés comme tels au registre. */
(function controlerHistoireGeo() {
  var brut = fs.readFileSync(path.join(racine, 'data/referentiel/histoire-geo-cm2.json'), 'utf8');
  var ref = JSON.parse(brut);
  var banque = CM2.banques.histoireGeo;

  var sujets = {}, reperes = {}, sensibles = {}, variables = {};
  [ref.histoire, ref.geographie].forEach(function (moitie) {
    (moitie.themes || []).forEach(function (t) {
      (t.sujets_etude || []).forEach(function (s) {
        sujets[s.id] = s;
        if (t.zone_sensible || s.zone_sensible) sensibles[s.id] = true;
        if (t.couverture_variable || s.couverture_variable) variables[s.id] = true;
      });
    });
  });
  (ref.reperes_chronologiques || []).forEach(function (r) { reperes[r.id] = r; });

  var questions = banque.reduce(function (n, x) { return n + x.questions.length; }, 0);
  console.log('\n--- Histoire-géographie : ' + banque.length + ' sujets, ' + questions + ' questions');

  var couverts = {};

  banque.forEach(function (bloc) {
    var s = sujets[bloc.sujet];
    exiger(!!s, bloc.sujet + ' : ce sujet d\'étude n\'existe pas dans le référentiel');
    if (!s) return;
    exiger(s.evaluable === true,
           bloc.sujet + ' : sujet marqué evaluable: false, il ne doit porter aucune question');
    couverts[bloc.sujet] = true;

    // Un sujet à couverture variable doit être déclaré optionnel au registre,
    // et lui seul : sinon l'application interrogerait sur un sujet que le
    // professeur n'a peut-être pas traité.
    var spec = CM2.registre.get(bloc.sujet);
    exiger(!!spec, bloc.sujet + ' : aucun générateur enregistré');
    if (spec) {
      exiger(!!spec.optionnel === !!variables[bloc.sujet],
             bloc.sujet + ' : couverture variable=' + !!variables[bloc.sujet] +
             ' mais optionnel=' + !!spec.optionnel);
    }

    bloc.questions.forEach(function (q, i) {
      var ou = bloc.sujet + ' question ' + (i + 1);
      exiger(q.q && q.bonne && q.explication, ou + ' : champ manquant');
      exiger(q.leurres && q.leurres.length >= 2, ou + ' : au moins deux leurres sont attendus');
      exiger(!q.leurres || q.leurres.indexOf(q.bonne) === -1,
             ou + ' : la bonne réponse figure aussi en leurre');

      if (q.repere) {
        var rep = reperes[q.repere];
        exiger(!!rep, ou + ' : repère inconnu « ' + q.repere + ' »');
        if (rep) {
          var affirme = q.bonne + ' ' + q.explication;
          exiger(affirme.toLowerCase().indexOf(String(rep.valeur).toLowerCase()) !== -1,
                 ou + ' : la valeur du repère (« ' + rep.valeur + ' ») n\'apparaît ni dans la ' +
                 'réponse ni dans l\'explication');
        }
      }

      /* Aucune date inventée : toute année écrite où que ce soit dans la
         question — leurres compris, car un leurre chiffré enseigne une date
         autant qu'une bonne réponse — doit figurer dans le référentiel. */
      var tout = q.q + ' ' + q.bonne + ' ' + (q.leurres || []).join(' ') + ' ' + q.explication;
      (tout.match(/\b1[5-9]\d\d\b|\b20\d\d\b/g) || []).forEach(function (annee) {
        exiger(brut.indexOf(annee) !== -1,
               ou + ' : l\'année ' + annee + ' ne figure pas dans le référentiel');
      });
    });
  });

  /* Zone sensible : les guerres mondiales ne portent aucune question. */
  Object.keys(sensibles).forEach(function (id) {
    var detail = ((ref.contraintes_generation.zone_sensible || {}).detail_sujets || {})[id] || '';
    if (/uniquement sur les repères chronologiques/.test(detail)) {
      exiger(!couverts[id],
             id + ' : zone sensible sans repère chronologique disponible — aucune question ' +
             'ne doit y être rattachée');
    }
  });

  /* Les mots que la zone sensible interdit d'aborder par une question. */
  var texteHG = banque.map(function (bloc) {
    return bloc.questions.map(function (q) {
      return q.q + ' ' + q.bonne + ' ' + (q.leurres || []).join(' ') + ' ' + q.explication;
    }).join(' ');
  }).join(' ').toLowerCase();
  ['génocide', 'collaboration', 'résistance', 'déportation', 'persécution', 'nazi',
   'première guerre mondiale', 'seconde guerre mondiale', 'grande guerre']
    .forEach(function (mot) {
      exiger(texteHG.indexOf(mot) === -1,
             'zone sensible : le mot « ' + mot + ' » ne doit pas figurer dans une question');
    });

  /* Aucun territoire particulier supposé étudié : les études de cas sont
     choisies localement par le professeur. */
  ['paris', 'lyon', 'marseille', 'bordeaux', 'nantes', 'toulouse', 'strasbourg', 'lille']
    .forEach(function (ville) {
      exiger(texteHG.indexOf(ville) === -1,
             'une question suppose l\'étude d\'un territoire particulier : « ' + ville + ' »');
    });

  /* Couverture : tout sujet évaluable porte des questions, sauf celui que la
     zone sensible laisse volontairement vide. */
  Object.keys(sujets).forEach(function (id) {
    var s = sujets[id];
    var detail = ((ref.contraintes_generation.zone_sensible || {}).detail_sujets || {})[id] || '';
    var laisseVide = /uniquement sur les repères chronologiques/.test(detail);
    if (s.evaluable === true && !laisseVide) {
      exiger(couverts[id], id + ' : sujet évaluable sans aucune question');
    } else if (s.evaluable !== true) {
      exiger(!couverts[id], id + ' : sujet non évaluable, il ne doit porter aucune question');
    }
  });

  banque.forEach(function (bloc) {
    for (var g = 0; g < 200; g++) {
      try {
        CM2.registre.produire(bloc.sujet, g);
      } catch (e) {
        echecs.push(bloc.sujet + ' graine ' + g + ' : ' + e.message);
        break;
      }
    }
  });
})();

/* ====================================================================== */
/* Numérique — CRCN                                                       */
/* ====================================================================== */

(function controlerNumerique() {
  var brut = fs.readFileSync(path.join(racine, 'data/referentiel/numerique-crcn-cm2.json'), 'utf8');
  var ref = JSON.parse(brut);
  var banque = CM2.banques.numerique;

  var reperes = {}, competences = {};
  ref.domaines.forEach(function (dom) {
    (dom.competences || []).forEach(function (c) {
      competences[c.id] = c;
      (c.reperes || []).forEach(function (r) { reperes[r.id] = { r: r, competence: c.id }; });
    });
  });

  var questions = banque.reduce(function (n, x) { return n + x.questions.length; }, 0);
  console.log('\n--- Numérique : ' + banque.length + ' compétences, ' + questions + ' questions');

  var couverts = {};

  banque.forEach(function (bloc) {
    exiger(!!competences[bloc.competence],
           bloc.competence + ' : cette compétence n\'existe pas dans le référentiel');

    bloc.questions.forEach(function (q, i) {
      var ou = bloc.competence + ' question ' + (i + 1);
      exiger(q.q && q.bonne && q.explication, ou + ' : champ manquant');
      exiger(q.leurres && q.leurres.length >= 2, ou + ' : au moins deux leurres sont attendus');
      exiger(!q.leurres || q.leurres.indexOf(q.bonne) === -1,
             ou + ' : la bonne réponse figure aussi en leurre');

      var cible = reperes[q.repere];
      exiger(!!cible, ou + ' : repère inconnu « ' + q.repere + ' »');
      if (!cible) return;
      exiger(cible.r.evaluable === true,
             ou + ' : le repère ' + q.repere + ' est marqué evaluable: false');
      exiger(cible.competence === bloc.competence,
             ou + ' : le repère ' + q.repere + ' relève de ' + cible.competence);
      couverts[q.repere] = true;
    });
  });

  /* Le recoupement déclaré par le référentiel : la compétence « Programmer »
     ne doit porter aucune question propre, mais son repère évaluable doit être
     couvert par un générateur d'un autre référentiel. Sans ce contrôle, « lier
     plutôt que dupliquer » deviendrait « oublier ». */
  var lien = ref.contraintes_generation.recoupement_a_ne_pas_dupliquer;
  var liee = lien.competence;
  exiger(banque.filter(function (b) { return b.competence === liee; }).length === 0,
         liee + ' : cette compétence est liée à un autre référentiel, elle ne doit pas ' +
         'porter de question propre');

  Object.keys(reperes).forEach(function (id) {
    var e = reperes[id];
    if (e.r.evaluable !== true) {
      exiger(!couverts[id], id + ' : repère non évaluable, il ne doit porter aucune question');
      return;
    }
    if (e.competence === liee) {
      // Couvert ailleurs : on exige qu'un générateur le déclare réellement.
      var porteurs = CM2.registre.pourObjectif(id);
      exiger(porteurs.length > 0,
             id + ' : repère de la compétence liée, mais aucun générateur ne le déclare');
      return;
    }
    exiger(couverts[id], id + ' : repère évaluable sans aucune question');
  });

  /* Zone sensible et interdits explicites du référentiel. */
  var texteNum = banque.map(function (bloc) {
    return bloc.questions.map(function (q) {
      return q.q + ' ' + q.bonne + ' ' + (q.leurres || []).join(' ') + ' ' + q.explication;
    }).join(' ');
  }).join(' ').toLowerCase();

  ['cyberharcèlement', 'harcèlement'].forEach(function (mot) {
    exiger(texteNum.indexOf(mot) === -1,
           'zone sensible : « ' + mot + ' » ne doit faire l\'objet d\'aucune question');
  });
  ['test d\'informatique', 'certification', 'pix'].forEach(function (mot) {
    exiger(texteNum.indexOf(mot) === -1,
           'aucune question ne doit évoquer « ' + mot + ' » : il n\'existe pas de test ' +
           'd\'informatique à l\'entrée au collège');
  });

  banque.forEach(function (bloc) {
    for (var g = 0; g < 200; g++) {
      try {
        CM2.registre.produire(bloc.competence, g);
      } catch (e) {
        echecs.push(bloc.competence + ' graine ' + g + ' : ' + e.message);
        break;
      }
    }
  });
})();

console.log('');
if (echecs.length) {
  console.log('ÉCHECS (' + echecs.length + ') :');
  echecs.forEach(function (e) { console.log('  - ' + e); });
  process.exit(1);
}
console.log('Banques : tous les contrôles passent.');
