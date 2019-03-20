const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_collection'
})

let sqlSentence

function readExchangeRate (order, limit, callback) {
  sqlSentence = 'SELECT * FROM exchange_rate ORDER BY ' + order + ' DESC LIMIT ' + limit

  // console.log(sqlSentence);

  connection.query(sqlSentence, function (err, result) {
    if (err) {
      // console.log('SELECT SUM(turnover) days ERROR' + shareCode, err.message)
      console.log(sqlSentence)
      return 0
    } else {
      // console.log(result)
    }
    callback(result)
  })
}

exports.readExchangeRate = readExchangeRate
