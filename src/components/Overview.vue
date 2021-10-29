<template> 
  <VueP5
    class="overview"
    @setup="setup"
    @draw="draw"
  />
</template>

<script>
import VueP5 from 'vue-p5'
import { scaleLinear } from 'd3-scale'
// import * as d3 from 'd3'
import store from '@/store/globalStore.js'

export default {
  name: 'Overview',
  components: {
    VueP5
  },
  data: () => ({
    srcData: []
  }),
  methods: {
    setup(sk) {
      // 处理数据
      this.srcData = store.get('allData')

      const leftsideWidth = 100, rightsideWidth = 200

      const xScale = scaleLinear()
      .domain([Math.min(...this.srcData.map(item => item.x)), Math.max(...this.srcData.map(item => item.x))])
      .range([leftsideWidth, sk.windowWidth - rightsideWidth])

      const yScale = scaleLinear()
      .domain([Math.min(...this.srcData.map(item => item.y)), Math.max(...this.srcData.map(item => item.y))])
      .range([0, sk.windowHeight])

      this.processedData = this.srcData.map((item, index) => ({
        // TODO: 大小写统一
        'id': index,
        'self-employed': item['Are you self-employed?'],
        'IT-company': item['Is your employer primarily a tech company/organization?'],
        'pre-employers': item['Do you have previous employers?'],
        'Tech-role': item['Is your primary role within your company related to tech/IT?'],
        'x': xScale(item.x),
        'y': yScale(item.y),
        // 'ox': 0,
        // 'oy': 0,
        'condition': item['If so, what condition(s) were you diagnosed with?'].split('|'),
        'view': item['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?']
      }))

      console.log("===", this.processedData)
    },

    draw(sk) {
      sk.createCanvas(sk.windowWidth, sk.windowHeight)
      sk.background(0)

      for (let i = 0; i < this.processedData.length; i++) {
        this.planet(sk, this.processedData[i])
      }
    },

    planet(sk, o) {
      sk.push()
      sk.fill(255,0,0)
      sk.ellipse(o.x, o.y, 2, 2)
      sk.pop()
    }
  }
}
</script>

<style scoped>
.overview {
  /* display: none; */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>