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

function writeChangeRate (data) {
  sqlSentence = 'DROP TABLE IF EXISTS share_select'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('DROP TABLE FAIL', err.message)
    }
  })

  sqlSentence = 'CREATE TABLE IF NOT EXISTS share_select' +
    ' (code VARCHAR(10) PRIMARY KEY, name VARCHAR(20), start_date CHAR(10), end_date CHAR(10), type VARCHAR(20)' +
    ')charset utf8 collate utf8_general_ci'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('创建数据库错误' + err.message)
      // console.log(sqlSentence)
    } else {
      console.log('创建数据库成功')
    }
  })

  sqlSentence = 'INSERT INTO share_select' +
    ' (code, name, start_date, end_date, type' +
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
function getChangeRateDays (shareAry, callback) {
  // console.log(shareAry)
  let shareCode = shareAry[0]
  sqlSentence = 'SELECT share_select FROM _' + shareCode + ' ORDER BY date DESC LIMIT ' + 60

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
        sumData = sumData + result[i]['share_select']
        // console.log(sumData)
        rowData.push(sumData)
      }
      writeData.push(rowData)
      // writeChangeRate(writeData)
      // console.log(writeData)
    }

    // console.log(result);
    callback(null)
  })
}

let rowDataArray = []
function getExchangeDataArray (shares) {
  let j = -1
  let length = shares.length
  // length = 3
  writeData = []

  rowDataArray.length = 0
  console.log('change-rate写入操作，请稍等')
  async.whilst(
    function () {
      j++
      return j < length
    },

    function (callback) {
      getChangeRateDays(shares[j], callback)
    },

    function (err, result) {
      if (err) {
        console.log(err.message)
      } else {
        // console.log(result[0]);
        console.log('数据长度：' + writeData.length)
        writeChangeRate(writeData)
        // console.log(' get rowDataArray finished ')
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
