/* Les quatre opérations. Référentiel : mat.nc.operations.

   Deux contraintes du programme sont ici structurantes :
   - la multiplication posée se limite à décimal × entier (décimal × décimal est en 6e) ;
   - la division posée se limite à un diviseur à un chiffre.
   Les dividendes sont choisis pour que le quotient tombe juste au millième près :
   un quotient qui ne s'arrête pas n'est pas au programme du CM2. */
(function (CM2) {
  'use strict';

  var reg = CM2.registre;
  var F = CM2.format;
  var Q = CM2.qcm;

  function aff(millemes) { return F.decimal(millemes / 1000); }

  reg.ajouter({
    id: 'ope.ordre_de_grandeur',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.operations.01'],
    titre: 'Ordre de grandeur d\'un calcul',
    generer: function (r) {
      var a = r.entier(180, 980);
      var b = r.entier(18, 89);
      var produit = a * b;

      var arrA = Math.round(a / 100) * 100;
      var arrB = Math.round(b / 10) * 10;
      var estimation = arrA * arrB;

      var candidats = [estimation * 10, Math.round(estimation / 10), estimation * 2,
                       Math.round(estimation / 2)];

      var choix = Q.construire(r, estimation, candidats, F.entier);

      return {
        enonce: 'Sans poser l\'opération, quel est l\'ordre de grandeur de ' +
          F.entier(a) + ' × ' + b + ' ?',
        type: 'qcm',
        propositions: choix.propositions,
        bonne_reponse: choix.bonne_reponse,
        explication: F.entier(a) + ' est proche de ' + F.entier(arrA) + ', et ' + b +
          ' est proche de ' + arrB + '. ' + F.entier(arrA) + ' × ' + arrB + ' = ' +
          F.entier(estimation) + '. Le résultat exact, ' + F.entier(produit) + ', en est bien voisin.'
      };
    }
  });

  reg.ajouter({
    id: 'ope.parentheses',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.operations.02'],
    titre: 'Calcul avec parenthèses',
    generer: function (r) {
      var a = r.entier(2, 12);
      var b = r.entier(2, 12);
      var c = r.entier(2, 9);
      var forme = r.entier(1, 3);

      var enonce, resultat, sansParentheses, explication;

      if (forme === 1) {
        resultat = (a + b) * c;
        sansParentheses = a + b * c;
        enonce = 'Calcule (' + a + ' + ' + b + ') × ' + c + '.';
        explication = 'On commence par ce qui est entre parenthèses : ' + a + ' + ' + b + ' = ' +
          (a + b) + ', puis ' + (a + b) + ' × ' + c + ' = ' + F.entier(resultat) +
          '. Sans les parenthèses on aurait trouvé ' + F.entier(sansParentheses) + '.';
      } else if (forme === 2) {
        var grand = a * c + b;
        resultat = grand - (a + b);
        enonce = 'Calcule ' + F.entier(grand) + ' − (' + a + ' + ' + b + ').';
        explication = 'D\'abord les parenthèses : ' + a + ' + ' + b + ' = ' + (a + b) +
          ', puis ' + F.entier(grand) + ' − ' + (a + b) + ' = ' + F.entier(resultat) + '.';
      } else {
        var d = r.entier(2, 9);
        resultat = (a + b) * (c + d);
        enonce = 'Calcule (' + a + ' + ' + b + ') × (' + c + ' + ' + d + ').';
        explication = 'Chaque parenthèse d\'abord : ' + a + ' + ' + b + ' = ' + (a + b) +
          ' et ' + c + ' + ' + d + ' = ' + (c + d) + '. Puis ' + (a + b) + ' × ' + (c + d) +
          ' = ' + F.entier(resultat) + '.';
      }

      return {
        enonce: enonce,
        type: 'saisie',
        bonne_reponse: String(resultat),
        explication: explication
      };
    }
  });

  reg.ajouter({
    id: 'ope.multiplication_decimale',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.operations.03'],
    titre: 'Multiplier un décimal par un entier',
    generer: function (r) {
      var nbDec = r.entier(1, 2);
      var puissance = Math.pow(10, nbDec);
      var partie;
      // Dernier chiffre non nul : sinon l'affichage perd une décimale et
      // l'explication sur le nombre de chiffres après la virgule devient fausse.
      do {
        partie = r.entier(1, puissance - 1);
      } while (partie % 10 === 0);
      var m = r.entier(1, 60) * 1000 + partie * (1000 / puissance);
      var k = r.entier(3, 25);
      var resultat = m * k;

      return {
        enonce: 'Pose et effectue : ' + aff(m) + ' × ' + k + '.',
        type: 'saisie',
        bonne_reponse: aff(resultat),
        explication: 'On calcule ' + F.entier(m / (1000 / puissance)) + ' × ' + k + ' = ' +
          F.entier(resultat / (1000 / puissance)) + ' comme avec des entiers, puis on replace la virgule : ' +
          'le premier nombre a ' + nbDec + ' chiffre' + (nbDec > 1 ? 's' : '') +
          ' après la virgule, on en compte donc autant dans le produit. ' +
          aff(m) + ' × ' + k + ' = ' + aff(resultat) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ope.division_dividende_entier',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.operations.04'],
    titre: 'Division décimale, dividende entier',
    generer: function (r) {
      var d = r.choix([2, 4, 5, 8]);   // diviseurs pour lesquels le quotient tombe juste
      var n;
      do {
        n = r.entier(11, 900);
      } while (n % d === 0);           // sinon le quotient est entier : pas de décimale

      var quotientMillemes = Math.round((n * 1000) / d);

      return {
        enonce: 'Pose et effectue : ' + F.entier(n) + ' ÷ ' + d + '.',
        type: 'saisie',
        bonne_reponse: aff(quotientMillemes),
        explication: 'Quand il reste quelque chose, on ajoute une virgule au quotient et on continue ' +
          'avec les dixièmes, puis les centièmes. ' + F.entier(n) + ' ÷ ' + d + ' = ' +
          aff(quotientMillemes) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ope.division_dividende_decimal',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.operations.05'],
    titre: 'Division décimale, dividende décimal',
    generer: function (r) {
      var d = r.entier(2, 9);
      // On part du quotient : le dividende est alors exact par construction, et
      // la division « tombe juste », ce qui est la seule situation au programme.
      var quotientMillemes = r.entier(1, 200) * 1000 + r.entier(1, 99) * 10;
      var m = quotientMillemes * d;

      return {
        enonce: 'Pose et effectue : ' + aff(m) + ' ÷ ' + d + '.',
        type: 'saisie',
        bonne_reponse: aff(quotientMillemes),
        explication: 'On divise la partie entière, puis on passe la virgule au quotient et on ' +
          'continue avec les dixièmes et les centièmes. ' + aff(m) + ' ÷ ' + d + ' = ' +
          aff(quotientMillemes) + '.'
      };
    }
  });

  reg.ajouter({
    id: 'ope.division_euclidienne',
    matiere: 'mathematiques',
    objectifs: ['mat.nc.operations.04'],
    titre: 'Quotient et reste',
    generer: function (r) {
      var d = r.entier(2, 9);
      var q = r.entier(12, 140);
      var reste = r.entier(1, d - 1);
      var n = q * d + reste;

      return {
        enonce: 'Dans la division de ' + F.entier(n) + ' par ' + d +
          ', quel est le reste ?',
        type: 'saisie',
        bonne_reponse: String(reste),
        explication: F.entier(n) + ' = ' + d + ' × ' + F.entier(q) + ' + ' + reste +
          '. Le reste est ' + reste + ', et il est toujours plus petit que le diviseur.'
      };
    }
  });

})(window.CM2 = window.CM2 || {});
