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
      // 筛选概览图相关维度
      const allData = store.get('allData')  // 获取全局缓存中的数据

      this.$filteredData = allData.map((d, i) => ({
        // TODO: 没用的维度
        'index': i,
        'conditions': d['If so, what condition(s) were you diagnosed with?'].split('|'),
        'tech-company': d['Is your employer primarily a tech company/organization?'],
        'tech-role': d['Is your primary role within your company related to tech/IT?'],
        'employed-before': d['Do you have previous employers?'],
        'self-employed': d['Are you self-employed?'],
        'viewed-negative': d['Do you think that team members/co-workers would view you more negatively if they knew you suffered from a mental health issue?'],
        'x': d['x'],
        'y': d['y'],
      }))

      // 画布左右边距
      /* const margin = {
        top: 50,
        right: 200,
        bottom: 50,
        left: 100
      } */

      // 坐标比例尺
      const xScale = scaleLinear()
        // .domain([Math.min(...this.$filteredData.map(d => d.x)), Math.max(...this.$filteredData.map(d => d.x))])
        // .range([margin.left, sk.windowWidth - margin.right])
        .domain([-80, 80])
        .range([0, sk.windowWidth])

      const yScale = scaleLinear()
        // .domain([Math.min(...this.$filteredData.map(d => d.y)), Math.max(...this.$filteredData.map(d => d.y))])
        // .range([margin.top, sk.windowHeight - margin.bottom])
        .domain([-40, 40])
        .range([0, sk.windowHeight])

      // 生成星球数据
      this.$planets = []
      for (let i = 0; i < this.$filteredData.length; i++) {
        const datum = this.$filteredData[i]
        this.$planets[i] = new this.Planet(datum, xScale, yScale)
      }
      // console.log(">>>", this.$planets)

      // 初次渲染
      // sk.createCanvas(sk.windowWidth, sk.windowHeight)
      // sk.background(0)

      // for (let i = 0; i < this.$planets.length; i++) {
      //   this.display(sk, this.$planets[i])
      // }
    },

    draw(sk) {
      sk.createCanvas(sk.windowWidth, sk.windowHeight)
      sk.background(0)

      const t = sk.millis() / 1000  // t是从开始到现在的毫秒数/1000

      for (let i = 0; i < this.$planets.length; i++) {
        this.display(sk, this.$planets[i], t, i)
      }
    },
    // TODO: 提炼到一个class里
    Planet(datum, xScale, yScale) {
      // 星球中心
      this.coordinateX = xScale(datum.x)
      this.coordinateY = yScale(datum.y)

      // 疾病数量
      this.conditionsLength = datum.conditions.length

      // 小圆明度
      this.brightness = 70 + 6 * this.conditionsLength

      // 小圆半径
      this.circleRadius = datum.conditions.length

      // 计算小圆的位置和颜色
      if (datum.conditions != '') {
        this.circles = datum.conditions.map((condition, index) => {
          let circle = {}

          // 小圆半径和数量决定偏移量
          // 一种病 无偏移
          if (this.conditionsLength == 1) {
            circle.offsetRadioX = 0
            circle.offsetRadioY = 0
          } else {  // 两种及以上 需要偏移 小圆顺序: 12点开始顺时针
            // 偏移系数
            circle.offsetRadioX = Math.sin(index * 2 * Math.PI / this.conditionsLength)
            circle.offsetRadioY = - Math.cos(index * 2 * Math.PI / this.conditionsLength)
          }

          // 疾病种类决定小圆颜色
          switch(condition) {
            case 'Mood Disorder (Depression, Bipolar Disorder, etc)':
              circle.color = [354.24, 354.24, this.brightness]
              break
            case 'Anxiety Disorder (Generalized, Social, Phobia, etc)':
              circle.color = [285.47, 78.84, this.brightness]
              break
            case 'Attention Deficit Hyperactivity Disorder':
              circle.color = [253.71, 80.41, this.brightness]
              break
            case 'Post-traumatic Stress Disorder':
              circle.color = [230.61, 73.06, this.brightness]
              break
            case 'Obsessive-Compulsive Disorder':
              circle.color = [220.66, 74.09, this.brightness]
              break
            case 'Substance Use Disorder':
              circle.color = [190.54, 58.73, this.brightness]
              break
            case 'Personality Disorder (Borderline, Antisocial, Paranoid, etc)':
              circle.color = [157.82, 51.97, this.brightness]
              break
            case 'Stress Response Syndromes':
              circle.color = [132.4, 53.54, this.brightness]
              break
            case 'Addictive Disorder':
              circle.color = [93.29, 68.92, this.brightness]
              break
            case 'Eating Disorder (Anorexia, Bulimia, etc)':
              circle.color = [53.76, 68.65, this.brightness]
              break
            case 'Dissociative Disorder':
              circle.color = [30.65, 77.18, this.brightness]
              break
            case 'Psychotic Disorder (Schizophrenia, Schizoaffective, etc)':
              circle.color = [12.24, 83.4, this.brightness]
              break
            default:
              circle.color = [0, 0, this.brightness]  // 其他类型的疾病是白色
              break
          }
          
          return circle
        })
      }
      
      // 闪烁 or 有星环 ?
      if (datum['viewed-negative'].substr(0,2) == 'No') {
        const OARBIT = 'orbit'
        this.stability = OARBIT
        if (datum['viewed-negative'] == 'No, they do not') {
          this.orbit = 25
        } else if (datum['viewed-negative'] == 'No, I don\'t think they would') {
          this.orbit = 8
        }
      } else {
        const FLICK = 'flick'
        this.stability = FLICK
        if (datum['viewed-negative'] == 'Yes, they do') {
          this.flick = 10
        } else if (datum['viewed-negative'] == 'Yes, I think they would') {
          this.flick = 4
        } else if (datum['viewed-negative'] == 'Maybe') {
          this.flick = 2
        }
      }
    },

    display(sk, planet, t, planetIndex) {
      if (!planet.circles) {  // 没病 画菱形
        const DIAMOND_RADIUS = 2.5
        const radius = planet.flick
          ? DIAMOND_RADIUS * Math.abs(Math.sin(planet.flick * t + 0.1 * planetIndex))  // t 时间变量; i 不让所有星球一起闪
          : DIAMOND_RADIUS
        
        sk.push()
        sk.rectMode(sk.CENTER) // TODO: 什么作用?
        sk.translate(planet.coordinateX, planet.coordinateY)
        sk.rotate(Math.PI / 4)
        sk.fill(255)
        sk.rect(0, 0, radius, radius)
        sk.pop()
      } else {  // 有病 画圆形
        for (let i = 0; i < planet.circles.length; i++) {
          const radius = planet.flick
            ? planet.circleRadius * Math.abs(Math.sin(planet.flick * t + 0.1 * planetIndex))  // t 时间变量; i 不让所有星球一起闪
            : planet.circleRadius
          const color = planet.circles[i].color
          const x = planet.coordinateX
          const y = planet.coordinateY
          const offsetX = planet.circles[i].offsetRadioX * (radius / 3)
          const offsetY = planet.circles[i].offsetRadioY * (radius / 3)

          sk.push()
          sk.colorMode(sk.HSB, 360, 100, 100, 100)  // 色相 饱和度 明度 透明度
          sk.blendMode(sk.LIGHTEST)
          sk.fill(...color)
          sk.ellipse(x + offsetX, y + offsetY, radius, radius)
          sk.pop()
        }
      }

      // 画星环
      if (planet.orbit) {
        const ORBIT_WIDTH = 0.1
        const radius = planet.orbit

        sk.push()
        sk.stroke(255)
        sk.strokeWeight(ORBIT_WIDTH)
        sk.noFill()
        sk.ellipse(planet.coordinateX, planet.coordinateY, radius, radius)
        sk.pop()
      }
    }
  }
}
</script>

<style scoped>
.overview {
}
</style>