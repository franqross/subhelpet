const mysql = require("mysql");

const db = mysql.createConnection({
    host:"database-2.cqixht8znhwm.us-east-1.rds.amazonaws.com",
    port:"3306",
    user:"admin",
    password:"helpet-Adm127",
    database:"helpetdb",

});


module.exports = db;