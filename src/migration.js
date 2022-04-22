const mysql = require('mysql');
const migration = require('mysql-migrations');

const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'secret',
    database: 'dbtodo'
});

migration.init(connection,__dirname + '/migrations', () => {
    console.log('finished running migrations');
});