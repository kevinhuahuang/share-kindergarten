<template>
  <div id="app">
    <!--<TheChangeRateTable></TheChangeRateTable>-->
    <!--<TheTableCloseMin></TheTableCloseMin>-->
    <!--<the-table-close-max></the-table-close-max>-->
    <!--<the-table-close-average></the-table-close-average>-->
    <TheShareInformation></TheShareInformation>
    <!--<strip-information></strip-information>-->
  </div>
</template>

<script>
import TheExchangeRateTable from './components/TheExchangeRateTable'
import TheChangeRateTable from './components/TheChangeRateTable'
import TheTableCloseMin from './components/TheTableCloseMin'
import TheTableCloseMax from './components/TheTableCloseMax'
import TheTableCloseAverage from './components/TheTableCloseAverage'
import TheShareInformation from './components/TheShareInformation'
import StripInformation from './components/StripInformation'
export default {
  name: 'App',
  components: {
    StripInformation,
    TheShareInformation,
    TheTableCloseAverage,
    TheTableCloseMax,
    TheTableCloseMin,
    TheChangeRateTable,
    TheExchangeRateTable}
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
