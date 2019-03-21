<template>
  <div class="share-table-container">
    <table border="1">
      <thead>
      <tr>
        <td v-for="j in headerAry.length" :key="j" @click="getTableDataDesc(j)" :style="{backgroundColor: headerClickAry[j-1] ? '#4a1cb6' : '#2b2b2b'}">{{headerAry[j-1]}}</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in tableData.length > ROWS ? ROWS : tableData.length" :key="i"><!--i是行，j是列-->
        <td v-for="j in tableData[i-1].length > headerAry.length ? headerAry.length : tableData[i-1].length" :key="j"
            :style="{color: tableColorIndex[i-1][j-1] ? colorAry[tableColorIndex[i-1][j-1]] : colorAry[0]}">{{tableData[i-1][j-1]}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
const leftAry = ['code', 'end_date']
const rightAry = ['rate1', 'rate2', 'rate3', 'rate4', 'rate5', 'rate6', 'rate7', 'rate8',
  'rate9', 'rate10', 'rate15', 'rate20', 'rate25', 'rate30', 'rate40', 'rate50', 'rate60']
export default {
  name: 'TheChangeRateTable',
  data () {
    return {
      ROWS: 100, // 设置100行时，显示切换较慢
      headerClickAry: [],
      tableData: [[]], // 二维数组，如果不这样创建，在接下的forEach嵌套使用中的第二次forEach将报错 长度100，子数组长度19
      tableColorIndex: [[]],
      isAscAry: [],
      levelData: [],
      color: '#e12fbf',
      colorAry: ['#e1e1e1', '#e1b767', '#e15916', '#e12fbf', 'red'],
      headerAry: [...leftAry, ...rightAry]
    }
  },
  mounted () {
    // 创建一个100*19(tableData.length * headerAry.length)的二维数组[列][行]
    this.tableColorIndex = Array.from({length: this.ROWS}, () => Array.from({length: this.headerAry.length}, () => 0))
    this.initTableColorIndex()
    this.headerClickAry = Array.from({length: this.headerAry.length}, () => false)
    this.getTableData(this, 'rate1-100')
  },
  methods: {
    initData () {
      this.tableData.forEach((aryChild, i) => { // 数组长度100，子数组长度19
        if (i < this.ROWS) {
          aryChild.forEach((value, j) => { // 直接使用aryChild.forEach会报错
            if (j >= leftAry.length) { // 从第三列开始 0，1，2（开始）
              this.setTableColorIndexAry(value, i, j)
            }
          }, this)
        }
      })
      // console.log(this.tableColorIndex)
    },
    initTableColorIndex () {
      let row = rightAry.length
      let column = 4
      this.levelData = Array.from({length: row}, () => Array.from({length: column}, () => 0))
      this.levelData.forEach((ary, i) => {
        ary.forEach((value, j) => {
          this.levelData[i][j] = ((i + 1) * 10) - (j + 1) * (i + 1) + 1
        })
      })
      // console.log(this.levelData)
    },
    setTableColorIndexAry (value, i, j) { // i是行，j是列
      // console.log('行: ' + i + ' ' + '列： ' + j)
      this.tableColorIndex[i][j] = this.setTableColorIndex(value, j)
      // console.log('value: ' + value + '   colorIndex: ' + this.tableColorIndex[i][j])
    },
    setTableColorIndex (value, index) {
      // console.log(this.levelData)
      let labelAry = this.levelData[index - 2]
      let result = 0
      value = Number.parseFloat(value) // 字符串比较 108 会小于 28
      switch (true) { // 注意此处值为true，不是value
        case value > labelAry[0]:
          result = 4
          break
        case value > labelAry[1]:
          result = 3
          break
        case value > labelAry[2]:
          result = 2
          break
        case value > labelAry[3]:
          result = 1
          break
      }
      return result
    },
    getTableDataDesc (index) {
      if (index < (leftAry.length + 1)) {
        return
      }
      let param = this.headerAry[index - 1] + '-' + this.ROWS
      this.getTableData(this, param)
      this.headerClickAry.fill(false)
      this.headerClickAry[index - 1] = true
    },
    getTableData (host, param) {
      this.axios.get('/changeRate/' + param).then(function (res) {
        host.tableData = []
        res.data.forEach(element => {
          let rowData = [] // 一行数据组成一个数组
          leftAry.forEach(key => {
            rowData.push(element[key])
          })
          rightAry.forEach(key => {
            rowData.push(element[key].toFixed(2))
          })
          host.tableData.push(rowData) // 数组成员为行数据（非列数据）
        })
        host.initData()
        // console.log(host.tableData)
      })
    }
  }
}
</script>

<style scoped>
  .share-table-container {
    background-color: #2b2b2b;
    color: #e1e1e1;
  }
  table {
    border-collapse: collapse;
    border: 1px solid #e1e1e1;
  }
  td {
    padding: 8px;
  }
  thead td {
    font-weight: bold;
  }
  thead td:hover {
    cursor: pointer;
  }
</style>
