<template>
  <div id="app">
    <TheShareTable></TheShareTable>
  </div>
</template>

<script>
import TheShareTable from './components/TheShareTable'
export default {
  name: 'App',
  components: {TheShareTable}
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
