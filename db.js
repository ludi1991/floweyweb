var mysql = require('mysql');
// var connection = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     database : 'stat',
// });

// connection.connect();

// connection.query('SELECT * from user', function(err, rows, fields) {
//   if (err) throw err;

//   console.log('The solution is: ', rows[0]);
// });

// connection.end();

function createConnection() {
    return mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        database : 'stat',
    });
}



function query(sqlstr,fn) {
    var connection = createConnection();
    connection.connect();
    connection.query(sqlstr,function(error,rows,fields) {
        fn(error,rows,fields);
        connection.end();
    });
}

module.exports.query = query;
module.exports.createConnection = createConnection;
