const async = require('async')
const mysql = require('mysql')
const Eventproxy = require('eventproxy')

const ep = new Eventproxy()

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'AGR670A4',
  port: '3306',
  database: 'share_max_min'
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

function writeMySQLData (data) {
  sqlSentence = 'DROP TABLE IF EXISTS share_turnover_rate_list'

  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log('DROP TABLE FAIL', err.message)
    }
  })

  sqlSentence = 'CREATE TABLE IF NOT EXISTS share_turnover_rate_list' +
    ' (code VARCHAR(10) PRIMARY KEY, name VARCHAR(20), ' +
    'Rate1 FLOAT, Rate2 FLOAT, Rate3 FLOAT, Rate4 FLOAT, Rate5 FLOAT, Rate6 FLOAT, Rate7 FLOAT, Rate8 FLOAT, Rate9 FLOAT, Rate10 FLOAT,' +
    'Rate11 FLOAT, Rate12 FLOAT, Rate13 FLOAT, Rate14 FLOAT, Rate15 FLOAT, Rate16 FLOAT, Rate17 FLOAT, Rate18 FLOAT, Rate19 FLOAT, Rate20 FLOAT,' +
    'Rate21 FLOAT, Rate22 FLOAT, Rate23 FLOAT, Rate24 FLOAT, Rate25 FLOAT, Rate26 FLOAT, Rate27 FLOAT, Rate28 FLOAT, Rate29 FLOAT, Rate30 FLOAT,' +
    'Rate31 FLOAT, Rate32 FLOAT, Rate33 FLOAT, Rate34 FLOAT, Rate35 FLOAT, Rate36 FLOAT, Rate37 FLOAT, Rate38 FLOAT, Rate39 FLOAT, Rate40 FLOAT,' +
    'Rate41 FLOAT, Rate42 FLOAT, Rate43 FLOAT, Rate44 FLOAT, Rate45 FLOAT, Rate46 FLOAT, Rate47 FLOAT, Rate48 FLOAT, Rate49 FLOAT, Rate50 FLOAT,' +
    'Rate51 FLOAT, Rate52 FLOAT, Rate53 FLOAT, Rate54 FLOAT, Rate55 FLOAT, Rate56 FLOAT, Rate57 FLOAT, Rate58 FLOAT, Rate59 FLOAT, Rate60 FLOAT' +
    ')charset utf8 collate utf8_general_ci'
  // sqlSentence = 'CREATE TABLE IF NOT EXISTS share_turnover_rate_list' +
  //   ' (code VARCHAR(10) PRIMARY KEY, name VARCHAR(20), ' +
  //   'Rate1 FLOAT, Rate2 FLOAT' +
  //   ')charset utf8 collate utf8_general_ci'

  // console.log(sqlSentence);
  connection.query(sqlSentence, function (err) {
    if (err) {
      console.log(err.message)
      // console.log(sqlSentence)
    } else {
      console.log('创建数据库成功')
    }
  })

  sqlSentence = 'INSERT INTO share_turnover_rate_list' +
    ' (code, name, ' +
    'Rate1, Rate2, Rate3, Rate4, Rate5, Rate6, Rate7, Rate8, Rate9, Rate10, ' +
    'Rate11, Rate12, Rate13, Rate14, Rate15, Rate16, Rate17, Rate18, Rate19, Rate20, ' +
    'Rate21, Rate22, Rate23, Rate24, Rate25, Rate26, Rate27, Rate28, Rate29, Rate30, ' +
    'Rate31, Rate32, Rate33, Rate34, Rate35, Rate36, Rate37, Rate38, Rate39, Rate40, ' +
    'Rate41, Rate42, Rate43, Rate44, Rate45, Rate46, Rate47, Rate48, Rate49, Rate50, ' +
    'Rate51, Rate52, Rate53, Rate54, Rate55, Rate56, Rate57, Rate58, Rate59, Rate60' +
    ') VALUES ?;'
  // sqlSentence = 'INSERT INTO share_turnover_rate_list' +
  //   ' (code, name, ' +
  //   'Rate1, Rate2)' +
  //   ' VALUES ?;'

  // console.log(sqlSentence);
  connection.query(sqlSentence, [data], function (err, rows, fields) {
    if (err) {
      // console.log(err.message)
      // console.log(sqlSentence)
      console.log('插入数据出错：' + err.message)
    } else {
      console.log('write mysql share_turnover_rate_list finished')
    }
  })
}

// getTurnoverRateDays('000001', 2, function () {})

let writeData
function getTurnoverRateDays (shareAry, callback) {
  console.log(shareAry)
  let shareCode = shareAry[1]
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
      rowData.push(shareAry[1])
      rowData.push(shareAry[0])
      for (let i = 0; i < result.length; i++) {
        sumData = sumData + result[i]['exchange_rate']
        // console.log(sumData)
        rowData.push(sumData)
      }
      writeData.push(rowData)
      // writeMySQLData(writeData)
      // console.log(writeData)
    }

    // console.log(result);
    callback(null)
  })
}

let rowDataArray = []
function getChangeDataArray (shares) {
  let j = -1
  let length = shares.length
  // length = 3
  writeData = []

  rowDataArray.length = 0
  async.whilst(
    function () {
      j++
      return j < length
    },

    function (callback) {
      getTurnoverRateDays(shares[j], callback)
    },

    function (err, result) {
      if (err) {
        console.log(err.message)
      } else {
        // console.log(result[0]);
        console.log('写入数据库')
        console.log('数据长度：' + writeData.length)
        writeMySQLData(writeData)
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

  sqlSentence = 'SELECT name , code FROM share_name_code_date WHERE status = 1'

  connectionData.query(sqlSentence, function (err, result) {
    if (err) {
      console.log('SELECT * FROM share_name_code_date WHERE status = 1', err.message)
    }

    for (let i = 0; i < result.length; i++) {
      shareLive.push([result[i].name, result[i].code])
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
    getChangeDataArray(shares)
  })
  getBaseData()
}

start()
