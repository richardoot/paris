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
    
    //Montrer les données Avant la suppression de la table
    console.log("DONNEES AVANT DROP : \n");
    db.all('SELECT * FROM paris', (err, data) => {
        if(err){
            throw err;
        } else {
            console.log(data);
        }
        });

    //Supprimer la table
    console.log("Suppression de la table paris.");
    db.run("DROP TABLE IF EXISTS paris");
});

//Fermeture de la BD
db.close();
