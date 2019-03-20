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
            :style="{color: colorAry[4]}">{{tableData[i-1][j-1]}}</td>
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
      levelOneAry: [],
      levelTwoAry: [],
      colorAry: ['red', 'orange', 'yellow', 'blue', '#e1e1e1'],
      headerAry: [...leftAry, ...rightAry]
    }
  },
  mounted () {
    this.getTableData(this, 'rate1-100')
    this.initData()
    // console.log(this.tableData)
  },
  methods: {
    initData () {
      this.tableData.forEach(ary => {
        console.log(ary)
        // ary.forEach(aryChild => {
        //   console.log(aryChild)
        // })
      })
    },
    getTableDataDesc (index) {
      let param = 'rate' + index + '-' + this.ROWS
      console.log(param)
      // this.getTableData(this, param)
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
