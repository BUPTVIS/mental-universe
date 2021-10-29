<template>
  <VueP5 @setup="setup"/>
</template>

<script>
import VueP5 from 'vue-p5'
import store from '@/store/globalStore.js'

export default {
  name: 'Overview',
  components: {
    VueP5
  },
  props: {
    loadData: { type: Boolean, default: false }
  },
  watch: {
    loadData: (newV) => {
      if (newV) {
        console.log('canvas', store.get('allData'))
      }
    }
  },
  methods: {
    setup(sk) {
      sk.createCanvas(400, 400)
      sk.background(255, 0, 0)
    }
  }
}
</script>