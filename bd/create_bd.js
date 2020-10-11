const sqlite3 = require('sqlite3').verbose();

//Connexion à la BD
const db = new sqlite3.Database('database-phe.db', (err) => {
    if(err){
      return console.error(err);
    }
    console.log("Connecté à la base de données SQlite phe\n");   
});

//Requêtes SQL
db.serialize(() => {
    
  //Afficher les données Avant la suppression de données
  db.run("CREATE TABLE IF NOT EXISTS paris (id INTEGER PRIMARY KEY AUTOINCREMENT, author TEXT, cheval INTEGER, date TEXT)", function(err) {
    if(err){
      throw err;
    }
    console.log("Création de la table paris\n");
    console.log(`Rows inserted ${this.changes}`);
  });

  //Début du peuplement de la BD
  db.run('INSERT INTO paris(author,cheval,date) VALUES(?,?,?),(?,?,?),(?,?,?)',["Mauricio",2,new Date,"Cyril",4,new Date,"Guillaume",3,new Date], err => {
    if(err){
      throw err;
    }
    console.log("Peuplement des données de la table paris\n");
  });

  //Afficher la table 
  db.all('SELECT * FROM paris', (err, data) => {    
    if(err){
      //Envoyer un code erreur
      throw err;
    }
    console.log("Peuplement terminé");
    console.log("Table aprés peuplement");
    console.log(data);
  }); 
});

//Fermeture de la BD
db.close();