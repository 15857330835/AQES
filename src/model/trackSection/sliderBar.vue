<template>
  <div class="leftW" id="leftW" @mousedown="w_mousedown" ref="leftW">
    <div
      class="leftN"
      :style="{
        position: 'absolute',
        width: this.width + 'px',
        left: this.left + 'px'
      }"
      id="leftN"
      @mousedown="openway == 'pc' ? n_mousedown($event) : temp"
      @touchstart="n_mousedown"
      ref="leftN"
    >
      <div></div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import _ from 'lodash'

export default {
  data() {
    return {
      x: 0,
      width: 0,
      left: 0,
      flag: false,
      track_width: 0
    }
  },
  computed: {
    ...mapState(['slidernum', 'notify', 'openway', 'exportVideoSetShow']),
    track_property() {
      return this.$store.state.all.track_property
    },
    length() {
      return this.$store.state.all.curr_track_len
    }
  },
  methods: {
    ...mapMutations(['PROPERTY_OUTLEFT', 'CHANGE_VIDEO_TIP_LOCKER']),
    ...mapActions(['postTrack', 'getnowimg']),
    // eslint-disable-next-line no-empty-function
    temp() {},
    n_mousedown(e_para) {
      e_para.preventDefault && e_para.preventDefault()
      let e = e_para
      this.flag = true
      this.CHANGE_VIDEO_TIP_LOCKER(true)
      if (e.touches) {
        e = e.touches[0]
      }

      this.x = e.clientX - this.$refs.leftN.offsetLeft
      // console.log({
      //   e: e.clientX,
      //   some: this.$refs.leftN.offsetLeft,
      //   x: this.x
      // })
      if (this.openway === 'pc') {
        this.addHandler(document, 'mousemove', this.moveDrag) // 绑定moveDrag
        this.addHandler(document, 'mouseup', this.stopDrag) // 绑定stopDrag
      } else {
        this.addHandler(document, 'touchmove', this.moveDrag) // 绑定moveDrag
        this.addHandler(document, 'touchend', this.stopDrag) // 绑定stopDrag
      }
      this.$refs.leftW.setCapture && this.$refs.leftW.setCapture() // 设置捕获范围
    },
    addHandler(oElement, sEventType, fnHandler) {
      return oElement.addEventListener
        ? oElement.addEventListener(sEventType, fnHandler, false)
        : oElement.attachEvent('on' + sEventType, fnHandler)
    },
    removeHandler(oElement, sEventType, fnHandler) {
      return oElement.removeEventListener
        ? oElement.removeEventListener(sEventType, fnHandler, false)
        : oElement.detachEvent('on' + sEventType, fnHandler)
    },
    moveDrag(e_para) {
      if (!this.flag) {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      const outerBarWidth = this.$refs.leftW.offsetWidth - 15
      let iLeft = e.clientX - this.x
      iLeft < 0 && (iLeft = 0)
      if (
        iLeft + parseFloat(this.$refs.leftN.style.width) - 15 >
        outerBarWidth
      ) {
        iLeft = outerBarWidth - parseFloat(this.$refs.leftN.style.width) + 15
      }
      this.left = iLeft
      const outleft =
        ((this.length / (this.slidernum.max - this.track_property.ratio) +
          this.slidernum.length) *
          this.$refs.leftN.offsetLeft) /
        outerBarWidth
      this.PROPERTY_OUTLEFT(outleft)
    },
    stopDrag() {
      this.flag = false
      this.CHANGE_VIDEO_TIP_LOCKER(false)
      const that = this
      if (this.openway === 'pc') {
        this.removeHandler(document, 'mousemove', this.moveDrag)
        this.removeHandler(document, 'mouseup', this.stopDrag)
      } else {
        this.removeHandler(document, 'touchmove', this.moveDrag)
        this.removeHandler(document, 'touchend', this.stopDrag)
      }
      this.$refs.leftW.releaseCapture && this.$refs.leftW.releaseCapture()
      this.postTrack({
        data: {
          cmd: 'property_append',
          track_property: { outLeft: this.track_property.outLeft }
        },
        success() {
          that.getnowimg()
        },
        error() {
          that.$notify({
            title: '提示',
            type: 'error',
            message: '操作失败！',
            position: 'bottom-right',
            duration: that.notify.time
          })
        }
      })
    },
    // eslint-disable-next-line no-empty-function
    w_mousedown(e) {}, // 有用
    refreshLeftNPos() {
      console.log('refresh leftN pos')
      const outerBarWidth = this.$refs.leftW.offsetWidth - 15
      const left =
        (outerBarWidth * this.track_property.outLeft) /
        (this.length / (this.slidernum.max - this.track_property.ratio) +
          this.slidernum.length)
      const width =
        (outerBarWidth * this.track_width) /
          (this.length / (this.slidernum.max - this.track_property.ratio)) >
        outerBarWidth - left
          ? outerBarWidth - left
          : (outerBarWidth * this.track_width) /
            (this.length / (this.slidernum.max - this.track_property.ratio))
      this.left = Math.ceil(left)
      this.width = Math.floor(width) + 15
    },
    throttleInitPosData: _.throttle(function() {
      this.initPosData()
    }, 200),
    initPosData() {
      this.track_width = document.querySelector(
        '.edit_track_contents'
      ).offsetWidth
      const outerBarWidth = this.$refs.leftW.offsetWidth - 15
      const left =
        (outerBarWidth * this.track_property.outLeft) /
        (this.length / (this.slidernum.max - this.track_property.ratio) +
          this.slidernum.length)
      const width =
        (outerBarWidth * this.track_width) /
          (this.length / (this.slidernum.max - this.track_property.ratio)) >
        outerBarWidth - left
          ? outerBarWidth - left
          : (outerBarWidth * this.track_width) /
            (this.length / (this.slidernum.max - this.track_property.ratio))
      this.left = Math.ceil(left)
      this.width = Math.floor(width) + 15
    }
  },
  watch: {
    length() {
      this.refreshLeftNPos()
    },
    'track_property.ratio'() {
      this.refreshLeftNPos()
    }
  },
  mounted() {
    this.initPosData()
    window.addEventListener('resize', this.throttleInitPosData)
  },
  beforeDestroy() {
    window.EventListener('resize', this.throttleInitPosData)
  }
}
</script>

<style lang="scss" scoped>
.leftW {
  width: 100%;
  height: 100%;
  background-color: #3c3d3f;
  position: relative;
  border-radius: 3px;
  cursor: pointer;
  .leftN {
    width: 100px;
    height: 100%;
    background-color: #aaaaaa;
    border-radius: 3px;
    cursor: move;
    > div {
      width: 15px;
      height: 100%;
      background-color: #aaa;
      border-radius: 5px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
    }
  }
}
</style>
