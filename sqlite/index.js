var sqlite3 = require('sqlite3').verbose()
var db = new sqlite3.Database('./db')

function getUsers(callback) {
  db.all("SELECT * FROM users", (err, rows) => {
    if (err) {
      console.log('Error of getting users ')
      callback(err, null)
    }
    callback(null, rows)
  });
}

function getUserStatistics(callback) {
  db.all("SELECT * FROM users_statistics", (err, rows) => {
    if (err) { 
      console.log('Error of getting statistics ') 
      callback(err, null)
    }
    callback(null, rows)
  });
}

function init() {
  const users = require("../init_data/users.json")
  const users_statistics = require("../init_data/users_statistic.json")
  
  const userMapping = `(${Object.values(users[0]).map(field => '?').join(', ')})`
  const q = `INSERT INTO users (id,first_name,last_name,email,gender,ip_address) VALUES ${userMapping};`
  
  const statisticMapping = `(${Object.values(users_statistics[0]).map(field => '?').join(', ')})`
  const p = `INSERT INTO users_statistics (user_id,date,page_views,clicks) VALUES ${statisticMapping };`
  
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users ( 
      id         INTEGER PRIMARY KEY,
      first_name  TEXT    NOT NULL,
      last_name   TEXT    NOT NULL,
      email      TEXT    NOT NULL,
      gender     TEXT    NOT NULL,
      ip_address TEXT    NOT NULL
    )`, err => console.log(`create table error: ${err}`));

    db.run(`CREATE TABLE IF NOT EXISTS users_statistics ( 
      oid        INTEGER PRIMARY KEY AUTOINCREMENT, 
      user_id    TEXT NOT NULL,
      date       TEXT NOT NULL,
      page_views TEXT NOT NULL,
      clicks     TEXT NOT NULL
    )`, err => console.log(`create table error: ${err}`));
 
    db.parallelize(() => {
      users.forEach((u) => {
        const user = Object.values(u);
  
        db.run(q, user, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log(`Successfully updated users`);
        });
      });

      users_statistics.forEach((i) => {
        const us = Object.values(i);
        db.run(p, us, (err) => {
          if (err) {
            return console.log(err);
          }
          console.log(`Successfully updated users_statistic`);
        });
      });
    });
  });
}

init()

module.exports = { getUsers, getUserStatistics }