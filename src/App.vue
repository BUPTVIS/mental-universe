<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <h1>The Universe of Mental Health in Tech Company</h1>
    <!-- <Nav/>
    <Lengend/>
    <Detail/> -->
    <Overview :loadData="loadData"/>
  </div>
</template>

<script>
import { csv } from 'd3'
import store from '@/store/globalStore.js'
import Overview from '@/components/Overview.vue'

export default {
  name: 'App',
  components: {
    Overview,
  },
  data: () => ({
    loadData: false,
  }),
  created() {
    csv('./static/mental-health-in-tech-2016.csv').then(data => {
      store.set('allData', data)  // 存入全局缓存
      this.loadData = true
      // console.log(store.get('allData'))
    })
  },
  methods: {
  }
}
</script>

<style lang="less">
#app {
  img {
    width: 500px;
    height: 500px;
  }
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
