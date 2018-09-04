var mysql = require('mysql');

var models = require('../server/db')

var pool = mysql.createPool(models.mysql);

var query = function(sql, options, callback) {
  pool.getConnection(function(err, conn) {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, options, function(err, results, fields) {
        conn.release()
        callback(err, results, fields)
      })
    }
  })
}

module.exports = query;
