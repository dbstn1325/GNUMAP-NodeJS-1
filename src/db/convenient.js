const mysql = require("mysql");
const MySQLStore = require("express-mysql-session");


const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1234",
    database: 'convenience_db'
})

const sessionStore = new MySQLStore(db);

db.connect((err)=> {
    if(err) {
        console.log(err.message);
    }
    console.log('DB ' + db.state);
});

module.exports = {db, sessionStore};