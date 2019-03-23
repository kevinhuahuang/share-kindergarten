const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_collection'
})

let sqlSentence
const memberAry = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate7', 'rate8',
  'rate15', 'rate20', 'rate25', 'rate30', 'rate40', 'rate50', 'rate60']

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
  sqlSentence = 'SELECT ' + memberAry.join(', ') + ' FROM change_rate WHERE code = ' + code
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
    let temp = (sum / limit).toFixed(2) // 求平均值
    callback(temp)
  })
}

function readChangeRateRanking (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createRankingPromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createRankingPromise (member, code) {
  return new Promise(resolve => {
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
        resolve(index)
      }
    })
  })
}

// readChangeRateAverage('000001', data => {
//   console.log(data)
// })
function readChangeRateMax (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createChangeRateMaxPromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createChangeRateMaxPromise (member, code) {
  return new Promise(resolve => {
    sqlSentence = 'SELECT MAX(' + member + ') FROM change_rate'
    connection.query(sqlSentence, function (err, result) {
      if (err) {
        console.log(sqlSentence)
        return 0
      } else {
        // let index = 0
        resolve(Math.floor(Object.values(result[0])[0] * 100) / 100)
      }
    })
  })
}

function readChangeRateMin (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createChangeRateMinPromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createChangeRateMinPromise (member, code) {
  return new Promise(resolve => {
    sqlSentence = 'SELECT MIN(' + member + ') FROM change_rate'
    connection.query(sqlSentence, function (err, result) {
      if (err) {
        console.log(sqlSentence)
        return 0
      } else {
        // let index = 0
        resolve(Math.floor(Object.values(result[0])[0] * 100) / 100)
      }
    })
  })
}

function readChangeRateAverage (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createChangeRateAveragePromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createChangeRateAveragePromise (member, code) {
  return new Promise(resolve => {
    sqlSentence = 'SELECT AVG(' + member + ') FROM change_rate'
    connection.query(sqlSentence, function (err, result) {
      if (err) {
        console.log(sqlSentence)
        return 0
      } else {
        // let index = 0
        resolve(Math.floor(Object.values(result[0])[0] * 100) / 100)
      }
    })
  })
}

module.exports = {
  readChangeRate,
  readChangeRateLimit,
  readChangeRateAvgLimit,
  readChangeRateRanking,
  readChangeRateOfCode,
  readChangeRateMax,
  readChangeRateMin,
  readChangeRateAverage
}
