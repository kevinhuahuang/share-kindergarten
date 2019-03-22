const mysql = require('mysql')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_collection'
})

let sqlSentence

function readCloseMaxLimit (order, limit, callback) { // 获取数据库表，只取前limit行
  let str = 'code, name, start_date, end_date, day5_rate, day10_rate, day30_rate, ' +
    'day60_rate, day120_rate, day240_rate, day480_rate, day720_rate, days_rate'
  sqlSentence = 'SELECT ' + str + ' FROM close_max ORDER BY ' + order + ' DESC LIMIT ' + limit
  connection.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
    }
    callback(result)
  })
}

// readCloseMaxLimit('day5_rate', 2, data => {
//   console.log(data)
// })

function readCloseMaxRanking (member, code, callback) { // 获取指定share代码的排名
  sqlSentence = 'SELECT code FROM close_max ORDER BY ' + member + ' DESC '
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
      console.log(aryTemp)
      let index = aryTemp.findIndex((element) => {
        return element === code
      })
      ++index
      callback(index)
    }
  })
}

// readCloseMaxRanking('day30_rate', '002358', function (data) {
//   console.log(data)
// })
module.exports = {
  readCloseMaxLimit,
  readCloseMaxRanking
}
