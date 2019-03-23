<template>
  <div class="information_container">
    <div class="information_area">
      <div class="change_rate_info">
        <strip-information :property-ary-pro="changeRateHeaderAry"
                           :value-ary-pro="changeRateAry"
                           :ranking-ary-pro="changeRateRankingAry"
                           :min-ary-pro="changeRateMinAry"
                           :max-ary-pro="changeRateMaxAry"></strip-information>
        <strip-information :property-ary-pro="exchangeRateHeaderAry"
                           :value-ary-pro="exchangeRateAry"
                           :ranking-ary-pro="exchangeRateRankingAry"
                           :min-ary-pro="exchangeRateMinAry"
                           :max-ary-pro="exchangeRateMaxAry"></strip-information>
      </div>
      <div class="exchange_rate_info"></div>
      <div class="close_min_info"></div>
      <div class="close_max_info"></div>
      <div class="close_avg_info"></div>
    </div>
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
      changeRateRankingAry: [],
      changeRateMinAry: [],
      changeRateMaxAry: [],
      changeRateAvgAry: [],
      exchangeRateHeaderAry: [],
      exchangeRateAry: [],
      exchangeRateRankingAry: [],
      exchangeRateMinAry: [],
      exchangeRateMaxAry: [],
      exchangeRateAvgAry: [],
      closeAvgRateAry: [],
      closeMinRateAry: [],
      closeMaxRateAry: [],
      domShareType: null
    }
  },
  mounted () {
    this.domShareType = this.$refs.domShareType
    let newOption = new Option('12dB', '1')
    this.domShareType.options.add(newOption)
    newOption = new Option('13dB', '2')
    this.domShareType.options.add(newOption)
    this.getChangeDataFromSever(this, '600395')
    this.getExchangeDataFromSever(this, '600395')
  },
  methods: {
    getChangeDataFromSever (host, code) {
      this.getChangeRateAry(host, code)
      this.getChangeRateMaxAry(host, code)
      this.getChangeRateMinAry(host, code)
      // this.getChangeRateAvgAry(host, code)
      this.getChangeRateRankingAry(host, code)
    },
    getChangeRateAry (host, params) {
      this.axios('/changeRateCode/' + params).then(function (res) {
        host.changeRateHeaderAry = Object.keys(res.data)
        host.changeRateAry = Object.values(res.data)
      })
    },
    getChangeRateMaxAry (host, params) {
      this.axios('/changeRateMaxCode/' + params).then(function (res) {
        host.changeRateMaxAry = res.data
      })
    },
    getChangeRateMinAry (host, params) {
      this.axios('/changeRateMinCode/' + params).then(function (res) {
        host.changeRateMinAry = res.data
      })
    },
    getChangeRateAvgAry (host, params) {
      this.axios('/changeRateAvgCode/' + params).then(function (res) {
        host.changeRateAvgAry = res.data
      })
    },
    getChangeRateRankingAry (host, params) {
      this.axios('/changeRateRankingCode/' + params).then(function (res) {
        host.changeRateRankingAry = res.data
      })
    },
    getExchangeDataFromSever (host, code) {
      this.getExchangeRateAry(host, code)
      this.getExchangeRateMaxAry(host, code)
      this.getExchangeRateMinAry(host, code)
      // this.getExchangeRateAvgAry(host, code)
      this.getExchangeRateRankingAry(host, code)
    },
    getExchangeRateAry (host, params) {
      this.axios('/exchangeRateCode/' + params).then(function (res) {
        host.exchangeRateHeaderAry = Object.keys(res.data)
        host.exchangeRateAry = Object.values(res.data)
      })
    },
    getExchangeRateMaxAry (host, params) {
      this.axios('/exchangeRateMaxCode/' + params).then(function (res) {
        host.exchangeRateMaxAry = res.data
      })
    },
    getExchangeRateMinAry (host, params) {
      this.axios('/exchangeRateMinCode/' + params).then(function (res) {
        host.exchangeRateMinAry = res.data
      })
    },
    getExchangeRateAvgAry (host, params) {
      this.axios('/exchangeRateAvgCode/' + params).then(function (res) {
        host.exchangeRateAvgAry = res.data
      })
    },
    getExchangeRateRankingAry (host, params) {
      this.axios('/exchangeRateRankingCode/' + params).then(function (res) {
        host.exchangeRateRankingAry = res.data
      })
    }
  }
}
</script>

<style scoped>
  .information_container {
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
