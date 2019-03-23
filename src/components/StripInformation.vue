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
      <ul class="ranking_ul" ref="rankingUl">
        <li class="ranking_li" v-for="item in rankingAry" :key="item"
            ref="rankingLi"  :style="widthLi">{{item}}</li>
      </ul>
      <ul class="min_ul" ref="minUl">
        <li class="min_li" v-for="item in minAry" :key="item"
            ref="minLi"  :style="widthLi">{{item}}</li>
      </ul>
      <ul class="max_ul" ref="maxUl">
        <li class="max_li" v-for="item in maxAry" :key="item"
            ref="maxLi"  :style="widthLi">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
const LI_MIN_WIDTH = 80
const LI_MAX_WIDTH = 120
const COLUMN_MAX = 15
export default {
  name: 'StripInformation',
  data () {
    return {
      columns: 0,
      propertyUl: null,
      propertyLi: null,
      valueUl: null,
      valueLi: null,
      rankingUl: null,
      rankingLi: null,
      maxUl: null,
      maxLi: null,
      minUl: null,
      minLi: null,
      widthLi: {
        minWidth: LI_MIN_WIDTH + 'px',
        maxWidth: LI_MAX_WIDTH + 'px',
        width: '15%' /* 预设10% ，根据columns值设置 */
      },
      propertyAry: [],
      valueAry: [],
      rankingAry: [],
      maxAry: [],
      minAry: []
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
    },
    rankingAryPro: {
      type: Array,
      required: true
    },
    maxAryPro: {
      type: Array,
      required: true
    },
    minAryPro: {
      type: Array,
      required: true
    }
  },
  mounted () {
    this.columns = COLUMN_MAX
    this.widthLi.width = '6.5%'
    this.propertyUl = this.$refs.propertyUl
    this.valueUl = this.$refs.valueUl
    this.rankingUl = this.$refs.rankingUl
    this.maxUl = this.$refs.maxUl
    this.minUl = this.$refs.minUl
    this.initDomStyle()
  },
  methods: {
    initDomStyle () {
      this.propertyUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
      this.valueUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
      this.rankingUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
      this.maxUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
      this.minUl.style.minWidth = (LI_MIN_WIDTH + 2) * this.columns + 'px'
    }
  },
  watch: {
    propertyAryPro (curV) {
      this.propertyAry = curV
      this.propertyAry.length = COLUMN_MAX // 元数不足10，用空位补足, 多余的将被删除
      // console.log(this.propertyAry)
    },
    valueAryPro (curV) {
      this.valueAry = curV
      this.valueAry.length = COLUMN_MAX // 元数不足10，用空位补足, 多余的将被删除
      // console.log(this.valueAry)
    },
    rankingAryPro (curV) {
      this.rankingAry = curV
      this.rankingAry.length = COLUMN_MAX// 元数不足10，用空位补足, 多余的将被删除
      // console.log(this.rankingAry)
    },
    minAryPro (curV) {
      this.minAry = curV
      this.minAry.length = COLUMN_MAX // 元数不足10，用空位补足, 多余的将被删除
      // console.log(this.minAry)
    },
    maxAryPro (curV) {
      this.maxAry = curV
      this.maxAry.length = COLUMN_MAX // 元数不足10，用空位补足, 多余的将被删除
      // console.log(this.maxAry)
    }
  }
}
</script>

<style scoped>
  .strip_information_container {
    position: relative;
    background-color: #e1e1e1;
  }
  .strip_container {
  }
  ul, li { /* 去除ul,li的默认样式*/
    padding: 0;
    margin: 0;
    list-style: none;
    vertical-align: top; /* 去除幽灵空白造成的间隙，否则，有文字的li与无文字的li不对齐*/
  }
  ul {
  }
  li {
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
  .property_li {
    background: aqua;
  }
</style>
