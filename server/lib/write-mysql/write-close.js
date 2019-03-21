const async = require('async')
const mysql = require('mysql')
const Eventproxy = require('eventproxy')

const ep = new Eventproxy()
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_collection'
})

const connection163 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_daily_163'
})

const connectionData = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_data'
})

const indexAry = [5, 10, 30, 60, 120, 240, 480, 720]

let sqlSentence
let writeData
function writeChangeRate (data) {
  sqlSentence = 'DROP TABLE IF EXISTS close'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('DROP TABLE FAIL', err.message)
    }
  })

  sqlSentence = 'CREATE TABLE IF NOT EXISTS close' +
    ' (code VARCHAR(10) PRIMARY KEY, name VARCHAR(20), start_date CHAR(10), end_date CHAR(10), day1 FLOAT, ' +
    'day5_min FLOAT, day10_min FLOAT, day30_min FLOAT, day60_min FLOAT, day120_min FLOAT, day240_min FLOAT, day480_min FLOAT, day720_min, days_min FLOAT, ' +
    'day5_avg FLOAT, day10_avg FLOAT, day30_avg FLOAT, day60_avg FLOAT, day120_avg FLOAT, day240_avg FLOAT, day480_avg FLOAT, day720_avg, days_avg FLOAT, ' +
    'day5_max FLOAT, day10_max FLOAT, day30_max FLOAT, day60_max FLOAT, day120_max FLOAT, day240_max FLOAT, day480_max FLOAT, day720_max, days_max FLOAT' +
    ')charset utf8 collate utf8_general_ci'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('创建数据库错误' + err.message)
      // console.log(sqlSentence)
    } else {
      console.log('创建数据库成功')
    }
  })

  sqlSentence = 'INSERT INTO change_rate' +
    ' (code, name, start_date, end_date, day1' +
    'day5_min, day10_min, day20_min, day30_min, day60_min, day120_min, day240_min, day480_min, day720_min, days_min, ' +
    'day5_avg, day10_avg, day20_avg, day30_avg, day60_avg, day120_avg, day240_avg, day480_avg, day720_avg, days_avg, ' +
    'day5_max, day10_max, day20_max, day30_max, day60_max, day120_max, day240_max, day480_max, day720_max, days_max' +
    ') VALUES ?;'

  connection.query(sqlSentence, [data], function (err, rows, fields) {
    if (err) {
      console.log('数据写入出错：' + err.message)
    } else {
      console.log('数据写入完成')
    }
  })
}

function getAverageFromAry (ary) {
  let sum = 0
  ary.forEach(value => {
    sum += value
  })
  return Math.floor(sum / ary.length * 100) / 100
}

function getCloseDays (shareAry, callback) {
  let shareCode = shareAry[0]
  console.log(shareCode)
  sqlSentence = 'SELECT close FROM _' + shareCode + ' ORDER BY date DESC '
  connection163.query(sqlSentence, function (err, result) {
    if (err) {
      console.log(sqlSentence)
      return 0
    } else {
      let aryTemp = []
      let aryRes = []
      result.forEach(obj => {
        aryTemp.push(Object.values(obj)[0])
      })
      indexAry.forEach(value => {
        aryRes.push(Math.min(...aryTemp.slice(0, value)))
        aryRes.push(getAverageFromAry(aryTemp.slice(0, 3)))
        aryRes.push(Math.max(...aryTemp.slice(0, value)))
      })
      aryRes.push(Math.min(...aryTemp))
      aryRes.push(getAverageFromAry(aryTemp))
      aryRes.push(Math.max(...aryTemp))
      // console.log(aryRes)
      writeData.push(aryRes)
      callback(null)
    }
  })
}

// getCloseDays(['000001', 'WHAT'], data => {
//   console.log(data)
// })

function getCloseArray (shares) {
  let j = -1
  let length = shares.length
  console.log('change-rate写入操作，请稍等')
  writeData = []
  async.whilst(
    function () {
      j++
      return j < length
    },

    function (callback) {
      getCloseDays(shares[j], callback)
    },

    function (err, result) {
      if (err) {
        console.log('出错了')
        console.log(err.message)
      } else {
        console.log('数据长度：' + result.length)
        writeChangeRate(result)
      }
    }
  )
}

function getBaseData () {
  getShareLive() // 获取有效的share
}

let shareLive = []
function getShareLive () { // 获取当前有效的share，已停止的share将不处理
  shareLive.length = 0

  sqlSentence = 'SELECT name , code , start_date , end_date FROM share_name_code_date WHERE status = 1'

  connectionData.query(sqlSentence, function (err, result) {
    if (err) {
      console.log('读取name,code,date', err.message)
    }

    for (let i = 0; i < result.length; i++) {
      shareLive.push([result[i].code, result[i].name, result[i].start_date, result[i].end_date])
    }
    // console.log(shareLive)

    // shareLive.sort(sortAsc);  //not work ,shareLive is multiple array
    // console.log(shareLive);
    ep.emit('getShareLive', shareLive)
  })
}

// ========================================================================================

function start () {
  ep.all('getShareLive', function (shares) {
    getCloseArray(shares)
  })
  getBaseData()
}

start()
