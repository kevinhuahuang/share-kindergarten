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

let sqlSentence

function writeExchangeRate (data) {
  sqlSentence = 'DROP TABLE IF EXISTS exchange_rate'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('DROP TABLE FAIL', err.message)
    }
  })

  sqlSentence = 'CREATE TABLE IF NOT EXISTS exchange_rate' +
    ' (code VARCHAR(10) PRIMARY KEY, name VARCHAR(20), start_date CHAR(10), end_date CHAR(10), ' +
    'rate1 FLOAT, rate2 FLOAT, rate3 FLOAT, rate4 FLOAT, rate5 FLOAT, rate6 FLOAT, rate7 FLOAT, rate8 FLOAT, rate9 FLOAT, rate10 FLOAT,' +
    'rate11 FLOAT, rate12 FLOAT, rate13 FLOAT, rate14 FLOAT, rate15 FLOAT, rate16 FLOAT, rate17 FLOAT, rate18 FLOAT, rate19 FLOAT, rate20 FLOAT,' +
    'rate21 FLOAT, rate22 FLOAT, rate23 FLOAT, rate24 FLOAT, rate25 FLOAT, rate26 FLOAT, rate27 FLOAT, rate28 FLOAT, rate29 FLOAT, rate30 FLOAT,' +
    'rate31 FLOAT, rate32 FLOAT, rate33 FLOAT, rate34 FLOAT, rate35 FLOAT, rate36 FLOAT, rate37 FLOAT, rate38 FLOAT, rate39 FLOAT, rate40 FLOAT,' +
    'rate41 FLOAT, rate42 FLOAT, rate43 FLOAT, rate44 FLOAT, rate45 FLOAT, rate46 FLOAT, rate47 FLOAT, rate48 FLOAT, rate49 FLOAT, rate50 FLOAT,' +
    'rate51 FLOAT, rate52 FLOAT, rate53 FLOAT, rate54 FLOAT, rate55 FLOAT, rate56 FLOAT, rate57 FLOAT, rate58 FLOAT, rate59 FLOAT, rate60 FLOAT' +
    ')charset utf8 collate utf8_general_ci'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('创建数据库错误' + err.message)
      // console.log(sqlSentence)
    } else {
      console.log('创建数据库成功')
    }
  })

  sqlSentence = 'INSERT INTO exchange_rate' +
    ' (code, name, start_date, end_date, ' +
    'rate1, rate2, rate3, rate4, rate5, rate6, rate7, rate8, rate9, rate10, ' +
    'rate11, rate12, rate13, rate14, rate15, rate16, rate17, rate18, rate19, rate20, ' +
    'rate21, rate22, rate23, rate24, rate25, rate26, rate27, rate28, rate29, rate30, ' +
    'rate31, rate32, rate33, rate34, rate35, rate36, rate37, rate38, rate39, rate40, ' +
    'rate41, rate42, rate43, rate44, rate45, rate46, rate47, rate48, rate49, rate50, ' +
    'rate51, rate52, rate53, rate54, rate55, rate56, rate57, rate58, rate59, rate60' +
    ') VALUES ?;'

  connection.query(sqlSentence, [data], function (err, rows, fields) {
    if (err) {
      // console.log(err.message)
      // console.log(sqlSentence)
      console.log('数据写入出错：' + err.message)
    } else {
      console.log('数据写入完成')
    }
  })
}

let writeData
function getExchangeRateDays (shareAry, callback) {
  // console.log(shareAry)
  let shareCode = shareAry[0]
  sqlSentence = 'SELECT exchange_rate FROM _' + shareCode + ' ORDER BY date DESC LIMIT ' + 60

  // console.log(sqlSentence);

  connection163.query(sqlSentence, function (err, result) {
    if (err) {
      // console.log('SELECT SUM(turnover) days ERROR' + shareCode, err.message)
      console.log(sqlSentence)
      return 0
    } else {
      let sumData = 0
      let rowData = []
      rowData.push(...shareAry)
      for (let i = 0; i < result.length; i++) {
        sumData = sumData + result[i]['exchange_rate']
        // console.log(sumData)
        rowData.push(sumData)
      }
      writeData.push(rowData)
      // writeExchangeRate(writeData)
      // console.log(writeData)
    }

    // console.log(result);
    callback(null)
  })
}

function getExchangeDataArray (shares) {
  let j = -1
  let length = shares.length
  // length = 3
  writeData = []

  async.whilst(
    function () {
      j++
      return j < length
    },

    function (callback) {
      getExchangeRateDays(shares[j], callback)
    },

    function (err, result) {
      if (err) {
        console.log(err.message)
      } else {
        // console.log(result[0]);
        console.log('写入数据库')
        console.log('数据长度：' + writeData.length)
        writeExchangeRate(writeData)
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
  // when to be use: after data be refresh
  // refreshShareLive();
  ep.all('getShareLive', function (shares) {
    getExchangeDataArray(shares)
  })
  getBaseData()
}

start()
