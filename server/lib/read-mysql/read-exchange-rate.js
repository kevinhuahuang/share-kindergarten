const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_collection'
})

let sqlSentence

function readExchangeRate (callback) {
  sqlSentence = 'SELECT * FROM exchange_rate' // 不加limit数据量太大
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result)
  })
}

function readExchangeRateLimit (order, limit, callback) {
  sqlSentence = 'SELECT * FROM exchange_rate ORDER BY ' + order + ' DESC LIMIT ' + limit
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result)
  })
}

function readExchangeRateMax (member, callback) {
  sqlSentence = 'SELECT MAX(' + member + ') FROM exchange_rate'
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    let temp = Object.values(result[0])[0]
    callback(temp)
  })
}

function readExchangeRateMin (member, callback) {
  sqlSentence = 'SELECT MIN(' + member + ') FROM exchange_rate'

  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    let temp = Object.values(result[0])[0]
    callback(temp)
  })
}

function readExchangeRateAverage (member, callback) {
  sqlSentence = 'SELECT AVG(' + member + ') FROM exchange_rate'
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    let temp = Object.values(result[0])[0]
    callback(temp)
  })
}

function readExchangeRateAvgLimit (member, limit, callback) {
  sqlSentence = 'SELECT ' + member + ' FROM exchange_rate ORDER BY ' + member + ' DESC LIMIT ' + limit
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    let sum = 0
    result.forEach(obj => {
      sum += obj[member]
    })
    let temp = (sum / limit).toFixed(2)
    callback(temp)
  })
}

module.exports = {
  readExchangeRate,
  readExchangeRateLimit,
  readExchangeRateMax,
  readExchangeRateMin,
  readExchangeRateAverage,
  readExchangeRateAvgLimit
}
