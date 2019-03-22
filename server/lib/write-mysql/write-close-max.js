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
let writeData = []
function writeChangeRate (data) {
  sqlSentence = 'DROP TABLE IF EXISTS close_max'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('DROP TABLE FAIL', err.message)
    } else {
      console.log('删除数据库成功')
    }
  })

  sqlSentence = 'CREATE TABLE IF NOT EXISTS close_max' +
    ' (code VARCHAR(10) PRIMARY KEY, name VARCHAR(20), start_date CHAR(10), end_date CHAR(10), day1 FLOAT, ' +
    'day5 FLOAT, day10 FLOAT, day30 FLOAT, day60 FLOAT, day120 FLOAT, day240 FLOAT, day480 FLOAT, day720 FLOAT, days FLOAT, ' +
    'day5_rate FLOAT, day10_rate FLOAT, day30_rate FLOAT, day60_rate FLOAT, day120_rate FLOAT, day240_rate FLOAT, day480_rate FLOAT, day720_rate FLOAT, days_rate FLOAT ' +
    ')charset utf8 collate utf8_general_ci'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('创建数据库错误: ' + err.message)
      console.log(sqlSentence)
    } else {
      console.log('创建数据库成功')
      sqlSentence = 'INSERT INTO close_max' +
        ' (code, name, start_date, end_date, day1, ' +
        'day5, day10, day30, day60, day120, day240, day480, day720, days, ' +
        'day5_rate, day10_rate, day30_rate, day60_rate, day120_rate, day240_rate, day480_rate, day720_rate, days_rate' +
        ') VALUES ?;'

      // console.log('长度：' + data.length + ' : ' + data[0].length)
      // console.log(data[0])
      connection.query(sqlSentence, [data], function (err, rows, fields) {
        if (err) {
          console.log('数据写入出错：' + err.message)
          console.log(sqlSentence)
        } else {
          console.log('数据写入完成')
        }
      })
    }
  })
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
      let aryMin = []
      let aryRate = []
      let aryRes = []
      let temp
      result.forEach(obj => {
        aryTemp.push(Object.values(obj)[0])
      })
      aryRes.push(...shareAry)
      aryRes.push(aryTemp[0])
      indexAry.forEach(value => {
        temp = Math.max(...aryTemp.slice(0, value))
        aryMin.push(temp)
        aryRate.push(Math.floor(aryTemp[0] / temp * 100) / 100)
      })
      temp = Math.max(...aryTemp)
      aryMin.push(temp)
      aryRate.push(Math.floor(aryTemp[0] / temp * 100) / 100)
      // console.log(aryRes)
      writeData.push([...aryRes, ...aryMin, ...aryRate])
      callback(null)
    }
  })
}

function getCloseArray (shares) {
  let j = -1
  let length = shares.length
  // length = 3
  console.log('change-rate写入操作，请稍等')
  writeData = []
  async.whilst(
    function () {
      j++
      return j < length
    },

    function (callback) {
      getCloseDays(shares[j], callback)
      // console.log(j, callback)
    },

    function (err, result) {
      if (err) {
        console.log('出错了')
        console.log(err.message)
      } else {
        console.log('数据长度：' + writeData.length)
        writeChangeRate(writeData)
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
