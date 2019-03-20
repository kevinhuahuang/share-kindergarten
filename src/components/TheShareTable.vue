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
      COLUMNS: 16,
      ROWS: 100,
      tableData: [0],
      tableColorIndex: [0],
      isAscAry: [],
      levelData: [],
      colorAry: ['red', 'orange', 'yellow', 'blue', '#e1e1e1'],
      headerAry: [...leftAry, ...rightAry]
    }
  },
  mounted () {
    this.getLevelValueData(this)
    this.getTableData(this, 'rate1-100')
    this.initData()
    // console.log(this.tableData)
  },
  methods: {
    initData () {
      // console.log(this.tableData)
      this.tableData.forEach((aryChild, i) => {
        let aryTemp = aryChild
        aryTemp.forEach((value, j) => { // 直接使用aryChild.forEach会报错
          this.setTableColorIndexAry(value, i, j)
        }, this)
      })
    },
    setTableColorIndexAry (value, i, j) {
      this.tableColorIndex[i][j] = this.setTableColorIndex(value, j)
    },
    setTableColorIndex (value, index) {
      let labelAry = this.levelData[index]
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
