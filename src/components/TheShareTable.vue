<template>
  <div class="share-table-container">
    <table border="1">
      <thead>
      <tr>
        <td v-for="j in headerAry.length" :key="j" @click="getTableDataDesc(j-2)">{{headerAry[j-1]}}</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in tableData.length" :key="i">
        <td v-for="j in tableData[i-1].length > ROWS ? ROWS : tableData[i-1].length" :key="j"
            :style="{color: tableColorIndex[i-1][j-1] ? colorAry[tableColorIndex[i-1][j-1]] : colorAry[4]}">{{tableData[i-1][j-1]}}</td>
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
  name: 'TheShareTable',
  data () {
    return {
      ROWS: 100,
      tableData: [[]], // 二维数组，如果不这样创建，在接下的forEach嵌套使用中的第二次forEach将报错
      tableColorIndex: [[]],
      isAscAry: [],
      levelData: [],
      colorAry: ['#e11221', '#e1400c', '#e19028', '#e1b767', '#e1e1e1'],
      headerAry: [...leftAry, ...rightAry]
    }
  },
  mounted () {
    // :style="{color: tableColorIndex[i-1][j-1] ? colorAry[tableColorIndex[i-1][j-1]] : colorAry[4]}"
    this.getLevelValueData(this)
    this.getTableData(this, 'rate1-100')
    // console.log(this.tableData)
  },
  methods: {
    initData () {
      // 创建一个19*100(tableData.length * headerAry.length)的二维数组
      this.tableColorIndex = Array.from({length: this.tableData.length}, () => Array.from({length: this.headerAry.length}, () => 0))
      // console.log(this.tableColorIndex)
      this.tableData.forEach((aryChild, i) => {
        aryChild.forEach((value, j) => { // 直接使用aryChild.forEach会报错
          if (j > 1) {
            this.setTableColorIndexAry(value, i, j)
          }
        }, this)
      })
      // console.log(this.tableColorIndex)
    },
    setTableColorIndexAry (value, i, j) {
      // console.log(j + ' ' + i)
      this.tableColorIndex[i][j] = this.setTableColorIndex(value, j)
    },
    setTableColorIndex (value, index) {
      // console.log(this.levelData)
      let labelAry = this.levelData[index - 2]
      let result = 0
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
    getLevelValueData (host) {
      this.axios.get('/exchangeValueLevel').then(function (res) {
        host.levelData = res.data
      })
    },
    getTableDataDesc (index) {
      let param = 'rate' + index + '-' + this.ROWS
      this.getTableData(this, param)
    },
    getTableData (host, param) {
      this.axios.get('/exchangeRate/' + param).then(function (res) {
        host.tableData = []
        res.data.forEach(element => {
          let rowData = []
          leftAry.forEach(key => {
            rowData.push(element[key])
          })
          rightAry.forEach(key => {
            rowData.push(element[key].toFixed(2))
          })
          host.tableData.push(rowData)
        })
        host.initData()
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
</style>
