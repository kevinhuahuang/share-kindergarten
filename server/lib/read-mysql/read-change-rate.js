const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_collection'
})

let sqlSentence

function readChangeRate (callback) {
  sqlSentence = 'SELECT * FROM change_rate' // 不加limit数据量太大
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result)
  })
}

// readChangeRateOfCode('000001', data => {
//   console.log(data)
// })
function readChangeRateOfCode (code, callback) {
  sqlSentence = 'SELECT * FROM change_rate WHERE code = ' + code
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result[0])
  })
}

function readChangeRateLimit (order, limit, callback) {
  sqlSentence = 'SELECT * FROM change_rate ORDER BY ' + order + ' DESC LIMIT ' + limit
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result)
  })
}

function readChangeRateAverage (member, callback) {
  sqlSentence = 'SELECT AVG(' + member + ') FROM change_rate'
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

function readChangeRateAvgLimit (member, limit, callback) {
  sqlSentence = 'SELECT ' + member + ' FROM change_rate ORDER BY ' + member + ' DESC LIMIT ' + limit
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

function readChangeRateRanking (member, code, callback) {
  sqlSentence = 'SELECT code FROM change_rate ORDER BY ' + member + ' DESC '
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
      // let index = 0
      let aryTemp = []
      result.forEach(obj => {
        aryTemp.push(Object.values(obj)[0])
      })
      let index = aryTemp.findIndex((element) => {
        return element === code
      })
      ++index
      callback(index)
    }
  })
}

module.exports = {
  readChangeRate,
  readChangeRateLimit,
  readChangeRateAverage,
  readChangeRateAvgLimit,
  readChangeRateRanking,
  readChangeRateOfCode
}
