<template>
  <div class="time_track clearfix">
    <div class="time_track_title">
      时间滑竿
      <!-- <div class="track-timer-left-mask" v-if="modalVoiceApplyIsShow"></div> -->
    </div>
    <div class="time_track_content">
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
        <span
          class="right_scale"
          v-show="!exportVideoSetShow"
          @click="ratioScale"
          title="全览"
        ></span>
        <span class="right_jian" @click="ratioCut(0.25)"></span>
        <span class="right_jia" @click="ratioAdd(0.25)"></span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import sliderbar from './sliderBar'
import _ from 'lodash'

export default {
  data() {
    return {
      oldratio: 24.6,
      trackWidth: 0,
      middle_ratio: null
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
      if (this.middle_ratio === null) {
        return null
      }
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
      // 初次渲染时的oldVal为null，禁用请求
      if (oldVal !== null) {
        this.ratioChange(newVal, oldVal)
      }
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
        console.log('set outleft')
        setTimeout(() => {
          this.PROPERTY_OUTLEFT(0)
        }, 0)
        this.middle_ratio = displayNum
      }
    },
    /* doScroll(e_para) {
      const e = window.event || e_para
      e.preventDefault()
      const delta = e.deltaY
      if (delta > 0) {
        this.ratioAdd()
      } else if (delta < 0) {
        this.ratioCut()
      }
    }, */
    ratioAdd(num_para) {
      let num
      if (num_para) {
        num = num_para
      } else {
        num = Math.ceil(this.length / 2000) * 0.25
      }
      this.middle_ratio += num
    },
    ratioCut(num_para) {
      let num
      if (num_para) {
        num = num_para
      } else {
        num = Math.ceil(this.length / 2000) * 0.25
      }
      this.middle_ratio -= num
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
        window.AQES.DOMAIN + '/api/property',
        JSON.stringify({
          cmd: 'append',
          property: {
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
    sendRatioDebounce: _.debounce(function() {
      this.sendRatio()
    }, 300),
    ratioChange(newVal, oldVal) {
      this.PROPERTY_RATIO(newVal)
      const left =
        this.pointer.position / (this.slidernum.max - oldVal) -
        this.track_property.outLeft
      let outleft = this.pointer.position / (this.slidernum.max - newVal) - left
      if (
        outleft > 0 &&
        outleft + this.trackWidth >
          this.length / (this.slidernum.max - newVal) + this.slidernum.length
      ) {
        outleft =
          this.length / (this.slidernum.max - newVal) +
          this.slidernum.length -
          this.trackWidth
      }
      if (outleft <= 0) {
        outleft = 0
      }
      outleft = Math.round(outleft)
      this.PROPERTY_OUTLEFT(outleft)
      this.sendRatioDebounce()
    }
  },
  created() {
    this.middle_ratio = this.ratio
  },
  mounted() {
    this.oldratio = this.track_property.ratio
    this.oldleft = this.track_property.outLeft
    this.trackWidth = document.querySelector('.edit_track_content').offsetWidth
    this.CHANGE_VIS_TIMER_WIDTH(this.trackWidth)
    // window.addEventListener('mousewheel', this.doScroll, { passive: false })
  }
  // beforeDestroy() {
  //   window.removeEventListener('mousewheel', this.doScroll, { passive: false })
  // }
}
</script>

<style lang="scss" scoped>
.time_track {
  width: 100%;
  height: 0.54rem;
  background-color: #151a20;
  position: absolute;
  bottom: 0;
  display: flex;
  .time_track_title {
    position: relative;
    width: 160px;
    height: 0.54rem;
    box-sizing: border-box;
    line-height: 0.54rem;
    text-align: center;
    font-size: 0.12rem;
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
    flex: 1;
    height: 100%;
    padding: 0 25px 0 10px;
    display: flex;
    justify-content: space-between;
    .left {
      height: 100%;
      padding: 0.23rem 0;
      box-sizing: border-box;
      width: calc(100% - 300px);
    }
    .right {
      width: 180px;
      padding: 0 30px;
      position: relative;
      .right_scale {
        position: absolute;
        height: 0.18rem;
        width: 0.26rem;
        border: 1px solid #818181;
        background: url(../../img/uf.png) center center no-repeat;
        background-size: 65% 55%;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        left: -0.4rem;
        cursor: pointer;
      }
      .right_jian {
        position: absolute;
        height: 0.16rem;
        width: 0.16rem;
        background-image: url(../../img/minify.png);
        background-repeat: no-repeat;
        background-size: 110%;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        left: 0.04rem;
        cursor: pointer;
      }
      .right_jia {
        position: absolute;
        height: 0.16rem;
        width: 0.16rem;
        background-image: url(../../img/magnify.png);
        background-repeat: no-repeat;
        background-size: 110%;
        display: inline-block;
        top: 50%;
        transform: translateY(-50%);
        right: 0.04rem;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss">
.time_track_content {
  .el-slider {
    font-size: 0.16rem;
    .el-slider__runway {
      background-color: #636363;
      height: 0.08rem;
      margin: 0.23rem 0;
      .el-slider__bar {
        background-color: transparent;
      }
      .el-slider__button-wrapper {
        height: 0.54rem;
        width: 0.54rem;
        top: -0.23rem;
        .el-slider__button {
          border: 0.02rem solid #61ded0;
          background-color: #61ded0;
          width: 0.12rem;
          height: 0.12rem;
        }
      }
    }
  }
}
</style>
