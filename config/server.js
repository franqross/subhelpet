const mysql = require("mysql");

const db = mysql.createConnection({
    host:"database-2.cqixht8znhwm.us-east-1.rds.amazonaws.com",
    port:"3306",
    user:"admin",
    password:"helpet-Adm127",
    database:"helpet",

});
db.connect(err=>{
    if(err){
        console.log(err.message);
        return;
    }
    db.query("SELECT * FROM user", function (err, result, fields) {
        if (err) throw err;
       /*  console.log(result); */
      });
    /* console.log("Database connected.") */
});

module.exports = db;