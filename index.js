'use strict;'

const express = require('express');
const faker = require('faker');
const cors = require('cors');
const bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

// Initialisation serveur
const app = express();

// Configuration Faker
faker.locale = 'fr';

// Sécurité
app.use(cors());

// Configuration parser body
app.use(bodyParser.json());

// Route /

/* Partie SQLite */
 // Connexion à la base de donnée avec sqlite
const db = new sqlite3.Database('database-phe.db', (err) => {
  if(err){
    return console.error(err);
  }
  console.log("Connected to the phe SQlite database.");


  db.serialize(() => {
    // db.run("DROP TABLE IF EXISTS paris");
    // db.run("CREATE TABLE IF NOT EXISTS paris (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, cheval INTEGER, date TEXT)");
    // db.run('INSERT INTO paris(author,cheval,date) VALUES(?,?,?),(?,?,?),(?,?,?)',["Mauricio",5,"2019-11-19T15:15:03.977Z","Cyril",4,"2018-11-19T15:15:03.977Z","Guillaume",3,"2018-11-19T15:15:03.977Z"]);
    
    // db.run(`DELETE FROM paris`, function(err) {
    //   if (err) {
    //     return console.error(err.message);
    //   }
    //   console.log(`Row(s) deleted ${this.changes}`);
    // });

    db.all('SELECT * FROM paris', (err, data) => {
    
      if(err){
        //Envoyer un code erreur
        throw err;
      }
      console.log("Voici les données de la table paris");
      console.log(data);
    }); 
  });

});



// Initialisation de la table paris
app.get("/", function(req, res){
  res.json({
    "code": 200,
    "message": "OK"
  });
  console.log("\nCALL to GET /");
  console.log("Status code envoyé\n");
});

// Récupération de tous les paris avec Sqlite
app.get("/paris", function(req, res){
  db.all('SELECT * FROM paris ORDER BY date DESC', (err,data) => {
    if(err){
      throw err;
    }

    //Afficher les données récupéré de la BD
    console.log("\nCALL to GET /paris");
    console.log("Envoie de toutes les données de la table paris");
    console.log(data);

    res.json({
      "code": 200,
      "data": data
    });
  });
});

// Ajout d'un pari avec Sqlite
app.post("/paris", function(req, res){
  //Récuprération des données du paris
  let paris = req.body;
  let date = new Date();

  //Ajout des données en BD
  db.run('INSERT INTO paris(author,cheval,date) VALUES(?,?,?)',[paris.author,paris.cheval,date]);

  //Affichage dans le terminal
  console.log("\nCALL to POST /paris");
  console.log("l'author : " + paris.author + " a parié sur le cheval numèro " + paris.cheval + " à la date : " + date);

  //Récupération des données dans la BD
  db.get('SELECT * FROM paris WHERE author=? AND cheval=? AND date=?',[paris.author, paris.cheval, date] , (err, data) => {
    
    if(err){
      throw err;
    }

    //Afficher les données dans le terminal

    console.log(data);
    
    //Envoyer le json
    res.json({
      "code": 200,
      "data": data
    });

  });   
});

// Génération de 10 paris aléatoires avec Sqlite
app.post("/paris/generate", function(req, res){
  let string_params = ""
  let nb_generations = 10; // Nombre de paris que nous souhaitons générer
  let nb_attributs_paris = 3; // Nombre d'attributs par paris
  let taille_tab_paris = nb_generations*nb_attributs_paris; // taille du tableau paris avec la liste de l'ensemble de éléments
  let tab_paris = [];

  for(let i=0 ; i<taille_tab_paris ; i+=3){
    tab_paris[i] = faker.name.firstName();
    tab_paris[i+1] = faker.random.number({min: 1,max: 10});
    tab_paris[i+2] = new Date();
    string_params += "(?,?,?)"; //lire doc sqlite --> correspond aux éléments de values qui vont être remplacer par les vraies valeurs
    if(i != taille_tab_paris-nb_attributs_paris){
      string_params += ',';
    }
  }

  //On récupére le nombre d'attributs présent sur la base
  let nb_paris;

  db.get('SELECT COUNT(*) FROM paris',function(err,data){
    if(err){
      throw err;
    }
    console.log("\nCALL to POST /paris");
    console.log("NB PARIS ACTUELLEMENT: ",data['COUNT(*)']);
    nb_paris = data['COUNT(*)']; 

    //On effectue une seule requette pour enregistrer les 10 paris
    db.run('INSERT INTO paris(author,cheval,date) VALUES' + string_params, tab_paris, function(err) {
      if(err){
        throw err;
      }

      console.log(`${this.changes} paris ont été ajoutés : \n`);


      db.all('SELECT * FROM paris WHERE id>?',nb_paris, function(err2,data) {
        console.log(data);
        res.json({
          "code": 200,
          "data": data
        });
      })
    });

  });

});

// Suppression d'un pari avec Sqlite
app.delete("/paris/:id", function(req, res){
  let id = req.params.id;
  let message = "Le paris avec l'id : " + id + " viens d'être supprimé";

  db.run("DELETE FROM paris WHERE id=?", id, function(err){
    if(err){
      throw err;
    }
    console.log("\nCALL to DELETE /paris/:id");
    console.log(`${this.changes} paris a été supprimé`);

  });

  res.json({
      "code": 200,
      "msg": message
    });
});

/* Démarrage serveur */
app.listen(3000, function () {
  console.log('Serveur phe-backend démarré !');
});
