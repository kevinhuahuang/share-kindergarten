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

function readExchangeRateOfCode (code, callback) {
  sqlSentence = 'SELECT ' + memberAry.join(', ') + ' FROM exchange_rate WHERE code = ' + code
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result[0])
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

function readExchangeRateLevel (callback) {
  let ary = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate7', 'rate8', 'rate9',
    'rate10', 'rate15', 'rate20', 'rate25', 'rate30', 'rate40', 'rate50', 'rate60']
  let promiseAll = []
  ary.forEach(value => {
    promiseAll.push(createReadLevelPromiseAll(value))
  })
  Promise.all([...promiseAll]).then(result => {
    callback(result)
  })
}

function readExchangeRateRanking (code, callback) {
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
    sqlSentence = 'SELECT code FROM exchange_rate ORDER BY ' + member + ' DESC '
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

function readExchangeRateMax (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createExchangeRateMaxPromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createExchangeRateMaxPromise (member, code) {
  return new Promise(resolve => {
    sqlSentence = 'SELECT MAX(' + member + ') FROM exchange_rate'
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

function readExchangeRateMin (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createExchangeRateMinPromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createExchangeRateMinPromise (member, code) {
  return new Promise(resolve => {
    sqlSentence = 'SELECT MIN(' + member + ') FROM exchange_rate'
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

function readExchangeRateAvg (code, callback) {
  let promiseAry = []
  memberAry.forEach(member => {
    promiseAry.push(createExchangeRateAveragePromise(member, code))
  })
  Promise.all([...promiseAry]).then(result => {
    callback(result)
  })
}

function createExchangeRateAveragePromise (member, code) {
  return new Promise(resolve => {
    sqlSentence = 'SELECT AVG(' + member + ') FROM exchange_rate'
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
  readExchangeRate,
  readExchangeRateOfCode,
  readExchangeRateLimit,
  readExchangeRateMax,
  readExchangeRateMin,
  readExchangeRateAvg,
  readExchangeRateAvgLimit,
  readExchangeRateLevel,
  readExchangeRateRanking
}

// ====================================================================
// 以下三个函数为readExchangeRateLevel服务
function createReadLevelPromise (member, limit) { // 返回一个promise
  return new Promise(resolve => {
    readExchangeRateAvgLimit(member, limit, data => {
      resolve(data)
    })
  })
}

function createReadLevelPromiseAry (member) { // 返回一个由promise组成的数组
  let ary = [10, 20, 30, 40]
  let result = []
  ary.forEach(value => {
    result.push(createReadLevelPromise(member, value))
  })
  return result
}

function createReadLevelPromiseAll (member) { // 返回一个执行promise.all的promise
  return new Promise(resolve => {
    Promise.all([...createReadLevelPromiseAry(member)]).then(result => {
      resolve(result)
    })
  })
}
