var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db')
const users = require("../init_data/users.json")
const users_statistics = require("../init_data/users_statistic.json")

const userMapping = `(${Object.values(users[0]).map(field => '?').join(', ')})`
// console.log(`user mapping: ${userMapping}`)
const q = `INSERT INTO users (id,first_name,last_name,email,gender,ip_address) VALUES ${userMapping};`

const statisticMapping = `(${Object.values(users_statistics[0]).map(field => '?').join(', ')})`
console.log(`user mapping: ${statisticMapping}`)
const q = `INSERT INTO users (user_id,date,page_views,clicks) VALUES ${statisticMapping};`

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users ( 
    user_id         INTEGER PRIMARY KEY,
    date  TEXT    NOT NULL,
    page_views   NUMBER    NOT NULL,
    clicks      NUMBER    NOT NULL
  )`, err => console.log(`create table error: ${err}`));
  console.log(2);
  db.parallelize(() => {
    users.forEach((u) => {
      const user = Object.values(u);

      db.run(q, user, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log(`Successfully updated`);
      });
    });
  });
});

// db.serialize(function () {
//   let sql = `SELECT * FROM users`
//   let us = object.values(users).map((user) => '(?)').join(',');
//   let sqlStat = `SELECT * FROM users_statistic`
//   let statics = object.values(users_statistics).map((stat) => '(?)').join(',');

//   db.get(sql, (err, table) => {
//     if (err) {
//       db.run(`CREATE TABLE IF NOT EXISTS users ( 
//         id INTEGER PRIMARY KEY,
//         firstName  TEXT NOT NULL,
//         lastName   TEXT NOT NULL,
//         email      TEXT NOT NULL,
//         gender     TEXT NOT NULL,
//         ip_address TEXT NOT NULL,
//       )`)
//         .run(`INSERT INTO users(id, first_Name, last_Name, email, gender, ip_address)
//               VALUES` + us)
//     }
//     return table
//       ? console.log(table)
//       : console.log('Table not found');
  
//   });
//   db.get(sql, (err, table) => {
//     if (err) {
//       db.run(`CREATE TABLE IF NOT EXISTS users ( 
//         id INTEGER PRIMARY KEY,
//         firstName  TEXT NOT NULL,
//         lastName   TEXT NOT NULL,
//         email      TEXT NOT NULL,
//         gender     TEXT NOT NULL,
//         ip_address TEXT NOT NULL,
//       )`)
//         .run(`INSERT INTO users(id, first_Name, last_Name, email, gender, ip_address)
//               VALUES` + us)
//     }
//     return table
//       ? console.log(table)
//       : console.log('Table not found');
  
//   });
// })


db.close()