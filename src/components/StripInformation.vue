<template>
  <div class="strip_information_container">
    <div class="strip_container">
      <ul class="property_ul" ref="propertyUl">
        <li class="property_li" v-for="item in propertyAry" :key="item"
             ref="propertyLi" :style="widthLi">{{item}}</li>
      </ul>
      <ul class="value_ul" ref="valueUl">
        <li class="value_li" v-for="item in valueAry" :key="item"
             ref="valueLi"  :style="widthLi">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
const LI_MIN_WIDTH = 80
const LI_MAX_WIDTH = 120
const COLUMN_MAX = 10
export default {
  name: 'StripInformation',
  data () {
    return {
      columns: 0,
      propertyUl: null,
      propertyLi: null,
      valueUl: null,
      valueLi: null,
      widthLi: {
        minWidth: LI_MIN_WIDTH + 'px',
        maxWidth: LI_MAX_WIDTH + 'px',
        width: '15%' /* 预设10% ，根据columns值设置 */
      },
      propertyAry: [],
      valueAry: []
    }
  },
  props: {
    propertyAryPro: {
      type: Array,
      required: true
    },
    valueAryPro: {
      type: Array,
      required: true
    }
  },
  mounted () {
    this.columns = COLUMN_MAX
    this.widthLi.width = Math.floor(100 / 10 - 1) + '%' // 为看起来规范，统一10行，不足10，剩下的显示为空，-1为border预留
    this.propertyUl = this.$refs.propertyUl
    this.valueUl = this.$refs.valueUl
    this.initDomStyle()
  },
  methods: {
    initDomStyle () {
      this.propertyUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
      this.valueUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
    }
  },
  watch: {
    propertyAryPro (curV) {
      this.propertyAry = curV
      this.propertyAry.length = 10 // 元数不足10，用空位补足, 多余的将被删除
      console.log(this.propertyAry)
    },
    valueAryPro (curV) {
      this.valueAry = curV
      this.valueAry.length = 10 // 元数不足10，用空位补足, 多余的将被删除
      console.log(this.valueAry)
    }
  }
}
</script>

<style scoped>
  .strip_information_container {
    position: relative;
    height: 80px;
    background-color: #e1e1e1;
  }
  .strip_container {
    position: relative;
    top: 14px;
    height: 50px;
  }
  ul, li { /* 去除ul,li的默认样式*/
    padding: 0;
    margin: 0;
    list-style: none;
    vertical-align: top; /* 去除幽灵空白造成的间隙，否则，有文字的li与无文字的li不对齐*/
  }
  .property_ul, .value_ul {
  }
  .property_li, .value_li {
    display: inline-block;
    /*min-width: 60px; !* 最小宽度*! 放在html中设置，否则在Mounted中获取此值为空*/
    /*max-width: 100px; !* 最大宽度*! 放在html中设置，否则在Mounted中获取此值为空*/
    /*width: 10%; !* 动态的宽度 在js根据li个数设置*!*/
    height: 25px;
    font-size: 1.1rem;
    line-height: 25px;
    background: #42b983;
    border: 1px solid white;
  }
</style>
