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
              v-model="track_property.ratio"
              :show-tooltip="false"
              @change="ratioChange"
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

export default {
  data: function() {
    return {
      oldratio: 24.6,
      trackWidth: 0
    }
  },
  components: {
    sliderbar
  },
  computed: {
    ...mapState([
      'exportVideoSetShow',
      'slidernum',
      'visTimerWidth'
      // 'modalVoiceApplyIsShow'
    ]),
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
    }
  },
  watch: {
    ratio: {
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
    }
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
    ratioAdd() {
      const num = this.track_property.ratio
      /* if (num >= 30) {
          return;
        } */
      this.ratioChange(num + this.slidernum.btnStep)
    },
    ratioCut() {
      const num = this.track_property.ratio
      /* if (num <= 0.1) {
          return;
        } */
      this.ratioChange(num - this.slidernum.btnStep)
    },
    setSliderNum() {
      if (this.length > 0) {
        const max = 30.1
        const min = 24.6

        const displayNumMin = 30.1 - Math.round(this.length / 5) / 100
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
        return displayNum
      }
    },
    ratioScale() {
      this.trackWidth = document.querySelector(
        '.edit_track_content'
      ).offsetWidth
      this.CHANGE_VIS_TIMER_WIDTH(this.trackWidth)
      const num = this.setSliderNum()
      this.PROPERTY_OUTLEFT(0)
      this.ratioChange(num)
    },
    ratioChange(value_para) {
      // 超出范围的放大缩小无效（ratio在服务器端同步）
      let value = value_para
      if (value < this.slidernum.min) {
        if (this.slidernum.min - value === this.slidernum.btnStep) {
          return
        }
        value = this.slidernum.min
      } else if (value + 0.25 > this.slidernum.max) {
        if (value + 0.25 - this.slidernum.max === this.slidernum.btnStep) {
          return
        }
        value = this.slidernum.max - 0.25
      }
      console.log(value)
      const that = this
      this.oldratio = value
      this.PROPERTY_RATIO(value)
      $.post(
        window.NCES.DOMAIN + '/api/track',
        JSON.stringify({
          cmd: 'property_append',
          track_property: { ratio: value, outLeft: that.track_property.outLeft }
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
    }
  },
  mounted: function() {
    this.oldratio = this.track_property.ratio
    this.oldleft = this.track_property.outLeft
    this.trackWidth = document.querySelector('.edit_track_content').offsetWidth
    this.CHANGE_VIS_TIMER_WIDTH(this.trackWidth)
    // this.setSliderNum()
    // this.PROPERTY_RATIO(this.oldratio)
    // this.refreshLoading(1)
    // this.changeLoading()
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
