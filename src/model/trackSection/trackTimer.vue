<template>
  <div class="time_track clearfix">
    <div class="clearfix">
      <div class="time_track_title">
        时间滑竿
        <!-- <div class="track-timer-left-mask" v-if="modalVoiceApplyIsShow"></div> -->
      </div>
      <div class="time_track_content">
        <div>
          <div class="left">
            <sliderbar></sliderbar>
          </div>
          <div class="right">
            <el-slider
              v-model="middle_ratio"
              :show-tooltip="false"
              :max="slidernum.max - 0.25"
              :min="slidernum.min"
              :step="0.25"
            ></el-slider>
            <span class="right_scale" @click="ratioScale" title="全览"></span>
            <span class="right_jian" @click="ratioCut"></span>
            <span class="right_jia" @click="ratioAdd"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import sliderbar from './sliderBar'
import _ from 'lodash'

export default {
  data: function() {
    return {
      oldratio: 24.6,
      trackWidth: 0,
      middle_ratio: 24.6
    }
  },
  components: {
    sliderbar
  },
  computed: {
    ...mapState(['exportVideoSetShow', 'slidernum', 'visTimerWidth']),
    track_property() {
      return this.$store.state.all.track_property
    },
    pointer() {
      return this.$store.state.all.pointer
    },
    length() {
      return this.$store.state.all.curr_track_len
    },
    ratio() {
      return this.$store.state.all.track_property.ratio
    },
    after_ratio() {
      let math_ratio =
        Math.round((this.middle_ratio + 0.15) / 0.25) * 0.25 - 0.15
      // 超出范围的放大缩小无效（ratio在服务器端同步）
      math_ratio =
        math_ratio < this.slidernum.max - 0.25
          ? math_ratio
          : this.slidernum.max - 0.25
      math_ratio =
        math_ratio > this.slidernum.min ? math_ratio : this.slidernum.min
      return math_ratio
    }
  },
  watch: {
    after_ratio(newVal, oldVal) {
      this.ratioChange(newVal, oldVal)
    }
    /* ratio: {
      handler(news, old) {
        if (news === 0 || old === 0) {
          // solve the bug of timeline jump randomly
          // news = old = Math.max(news, old)
          this.ratioChange(Math.max(news, old))
        }
        const left =
          this.pointer.position / (this.slidernum.max - old) -
          this.track_property.outLeft
        let outleft = this.pointer.position / (this.slidernum.max - news) - left
        if (
          outleft + this.trackWidth >
          this.length / (this.slidernum.max - news) + 100
        ) {
          outleft =
            this.length / (this.slidernum.max - news) + 100 - this.trackWidth
        }
        if (outleft < 0) {
          outleft = 0
        }
        this.PROPERTY_OUTLEFT(outleft)
      }
    } */
  },
  methods: {
    ...mapActions(['changeLoading', 'refreshLoading']),
    ...mapMutations([
      'PROPERTY_OUTLEFT',
      'PROPERTY_RATIO',
      'UPDATE_SLIDER_NUM',
      'CHANGE_VIS_TIMER_WIDTH',
      'CHANGE_TRACK_ABLE_WIDTH'
    ]),
    setSliderNum() {
      if (this.length > 0) {
        const max = 30.1
        const min = 24.6
        let displayNumMin = 30.1 - Math.round(this.length / 5) / 100
        displayNumMin = Math.round((displayNumMin + 0.15) / 0.25) * 0.25 - 0.15
        const newSliderNumMin = displayNumMin < min ? displayNumMin : min

        const displayWidth = Math.floor(this.visTimerWidth / 50) * 50
        let displayNum =
          30.1 - Math.round((this.length / displayWidth) * 100) / 100
        displayNum = displayNum <= max ? displayNum : max
        console.log({ newSliderNumMin, max })

        this.UPDATE_SLIDER_NUM({
          min: newSliderNumMin,
          max: max,
          length: 100,
          btnStep: 0.25
        })
        this.PROPERTY_OUTLEFT(0)
        this.middle_ratio = displayNum
      }
    },
    ratioAdd() {
      this.middle_ratio += 0.25
    },
    ratioCut() {
      this.middle_ratio -= 0.25
    },
    ratioScale() {
      this.trackWidth = document.querySelector(
        '.edit_track_content'
      ).offsetWidth
      this.CHANGE_VIS_TIMER_WIDTH(this.trackWidth)
      this.setSliderNum()
    },
    sendRatio() {
      const that = this
      $.post(
        window.NCES.DOMAIN + '/api/track',
        JSON.stringify({
          cmd: 'property_append',
          track_property: {
            ratio: that.track_property.ratio,
            outLeft: that.track_property.outLeft
          }
        }),
        function(res) {
          if (res.code === 0 && !that.exportVideoSetShow) {
            that.changeLoading()
            that.CHANGE_TRACK_ABLE_WIDTH()
          }
          if (res.code !== 0) {
            console.warn(res.msg)
          }
        },
        'json'
      )
    },
    sendRatioDenounce: _.debounce(function() {
      this.sendRatio()
    }, 300),
    ratioChange(newVal, oldVal) {
      console.log(newVal)
      this.PROPERTY_RATIO(newVal)
      const left =
        this.pointer.position / (this.slidernum.max - oldVal) -
        this.track_property.outLeft
      let outleft = this.pointer.position / (this.slidernum.max - newVal) - left
      if (
        outleft > 0 &&
        outleft + this.trackWidth >
          this.length / (this.slidernum.max - newVal) + 100
      ) {
        outleft =
          this.length / (this.slidernum.max - newVal) + 100 - this.trackWidth
      }
      if (outleft <= 0) {
        outleft = 0
      }
      outleft = Math.round(outleft)
      this.PROPERTY_OUTLEFT(outleft)
      this.sendRatioDenounce()
    }
  },
  created() {
    this.middle_ratio = this.ratio
  },
  mounted: function() {
    this.oldratio = this.track_property.ratio
    this.oldleft = this.track_property.outLeft
    this.trackWidth = document.querySelector('.edit_track_content').offsetWidth
    this.CHANGE_VIS_TIMER_WIDTH(this.trackWidth)
  }
}
</script>

<style lang="scss" scoped>
.time_track {
  position: fixed;
  width: calc(100% - 36px);
  bottom: -4px;
  left: 18px;
  background-color: #161616;
  .time_track_title {
    position: relative;
    width: 160px;
    height: 40px;
    box-sizing: border-box;
    line-height: 40px;
    text-align: center;
    font-size: 12px;
    // border-right: 1px solid #141414;
    // border-top: 1px solid#141414;
    float: left;
    .track-timer-left-mask {
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      position: absolute;
      top: 0;
      z-index: 9999;
    }
  }
  .time_track_content {
    float: left;
    width: calc(100% - 160px);
    height: 40px;
    > div {
      margin: 0 25px 0 10px;
      height: 100%;
      box-sizing: border-box;
      .left {
        height: 100%;
        padding: 16px 0;
        box-sizing: border-box;
        float: left;
        width: calc(100% - 300px);
      }
      .right {
        float: left;
        margin-left: 60px;
        width: 180px;
        padding: 0 30px;
        position: relative;
        .right_scale {
          position: absolute;
          height: 18px;
          width: 26px;
          border: 1px solid #818181;
          background: url(../../img/uf.png) center center no-repeat;
          background-size: 65% 55%;
          display: inline-block;
          top: 50%;
          transform: translateY(-50%);
          left: -30px;
          cursor: pointer;
        }
        .right_jian {
          position: absolute;
          height: 12px;
          width: 12px;
          background-image: url(../../img/us.png);
          display: inline-block;
          top: 50%;
          transform: translateY(-50%);
          left: 5px;
          cursor: pointer;
        }
        .right_jia {
          position: absolute;
          height: 12px;
          width: 12px;
          background-image: url(../../img/ub.png);
          display: inline-block;
          top: 50%;
          transform: translateY(-50%);
          right: 5px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
