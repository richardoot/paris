const sqlite3 = require('sqlite3').verbose();

//Connexion à la BD
const db = new sqlite3.Database('database-phe.db', (err) => {
    if(err){
      return console.error(err);
    }

    console.log("Connecté à la base de données SQlite phe.");   
});

//Requêtes SQL
db.serialize(() => {
    
    //Afficher les données Avant la suppression de données
    db.all('SELECT * FROM paris', (err, data) => {
        if(err){
            throw err;
        } else {
            console.log("DONNEES AVANT SUPPRESSION : \n");
            console.log(data);
        }
        });

    //Supprimer les données
    db.run(`DELETE FROM paris`, function(err) {
        if (err) {
            return console.error(err.message);
        }
        console.log("Suppression des données de la table paris");
        console.log(`Row(s) deleted ${this.changes}`);
    });

    //Afficher la table vide
    
    db.all('SELECT * FROM paris', (err, data) => {
        
        if(err){
            //Envoyer un code erreur
            throw err;
        }
        console.log("\nDONNEES APRES SUPPRESSION : ");
        console.log(data);
      }); 
});

//Fermeture de la BD
db.close();

 
