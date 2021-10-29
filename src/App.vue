<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <VueP5 @setup="setup"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import VueP5 from 'vue-p5'

export default {
  name: 'App',
  components: {
    HelloWorld,
    VueP5,
  },
  methods: {
    setup(sk) {
      sk.createCanvas(400, 400)
      sk.background(255, 0, 0)
    }
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
