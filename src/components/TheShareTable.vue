<template>
  <div class="share-table-container">
    <table border="1">
      <thead>
      <tr>
        <td v-for="j in headerAry.length" :key="j">{{headerAry[j-1]}}</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="i in tableData.length" :key="i">
        <td v-for="j in tableData[i-1].length" :key="j">{{tableData[i-1][j-1]}}</td>
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
      headerAry: [...leftAry, ...rightAry]
    }
  },
  mounted () {
    this.getTableData(this)
    console.log(this.tableData)
  },
  methods: {
    getTableData (host) {
      this.axios.get('/exchange-rate').then(function (res) {
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
    padding-left: 8px;
    padding-right: 8px;
  }
</style>
