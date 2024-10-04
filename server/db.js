import mysql from  'mysql2';

export const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "12345678",
    database: "react-blog"
});