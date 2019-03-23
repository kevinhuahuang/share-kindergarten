<template>
  <div class="information_container">
    <div class="select_area">
      <label class="share_input_part">
        <input type="text" class="share_input" value="000001"/>
      </label>
      <div class="share_list">
        <label class="share_type_part">
          <select class="select_share_type" ref="domShareType"></select>
        </label>
        <div class="share_item_part">
          <div class="share_item">345</div>
        </div>
      </div>
    </div>
    <div class="information_area">
      <div class="change_rate_info">
        <strip-information :property-ary-pro="changeRateHeaderAry" :value-ary-pro="changeRateAry"></strip-information>
      </div>
      <div class="exchange_rate_info"></div>
      <div class="close_min_info"></div>
      <div class="close_max_info"></div>
      <div class="close_avg_info"></div>
    </div>
  </div>
</template>

<script>
import StripInformation from './StripInformation'
export default {
  name: 'TheShareInformation',
  components: {StripInformation},
  data () {
    return {
      shareListAry: [],
      shareType: ['124', '213', '324234'],
      changeRateHeaderAry: [],
      changeRateAry: [],
      closeAverageRateAry: [],
      closeMinRateAry: [],
      closeMaxRateAry: [],
      exchangeRateAry: [],
      domShareType: null
    }
  },
  mounted () {
    this.domShareType = this.$refs.domShareType
    let newOption = new Option('12dB', '1')
    this.domShareType.options.add(newOption)
    newOption = new Option('13dB', '2')
    this.domShareType.options.add(newOption)
    this.getChangeRateAry(this, '000001')
  },
  methods: {
    getChangeRateAry (host, params) {
      this.axios('/changeRateCode/' + params).then(function (res) {
        host.changeRateHeaderAry = Object.keys(res.data).slice(4)
        host.changeRateAry = Object.values(res.data).slice(4)
      })
    }
  }
}
</script>

<style scoped>
  .information_container {
    display: flex;
    justify-content: space-between;
    background-color: #e1e1e1;
  }
  .select_area {
    width: 120px;
    height: 800px;
    background-color: #e1e1e1;
  }
  .share_input_part {
    position: relative;
    margin: 10px;
    display: block;
    width: 160px;
    height: 50px;
    background-color: white;
    text-align: center;
  }
  .share_input {
    outline: none; /* 去掉input的默认样式 */
    /*border: 0;  !* 去掉input的默认样式 *!*/
    background: none;/* 去掉input的默认样式 */
    position: absolute;
    margin-top: 10px;
    margin-left: 10%;
    font-size: 1.2rem;
    display: block;
    width: 80%;
    height: 25px;
    text-align: center;
  }
  .select_share_type {
    outline: none; /* 去掉select的默认样式 */
    border: 0;  /* 去掉select的默认样式 */
    background: none;/* 去掉select的默认样式 */
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
  }
  .share_item_part {
    width: 160px;
    height: 800px;
    background-color: white;
    margin: 10px;
  }
  .information_area {
    margin: 10px;
    width: 600px;
    height: 800px;
    background-color: white;
  }
</style>
