<template>
  <div class="edit_tip" ref="leftW">
    <div
      class="edit_tip_line"
      id="edit_tip_line"
      :class="{
        'is-playing': isPlaying && !flag && !this.videoTipLocker,
        'height-plus': exportVideoSetShow
      }"
      ref="leftN"
      :style="{ left: this.left + 'px' }"
    >
      <span
        class="edit_tip_title"
        :class="{ 'tip-extend-height': exportVideoSetShow }"
      >
        <div
          class="location-left"
          @click="handleLocationLeftClick($event)"
          @touchend="handleLocationLeftClick"
          v-if="exportVideoSetShow"
        ></div>
        <span
          class="location-time"
          @mousedown="openway == 'pc' ? n_mousedown($event) : temp"
          @touchstart="n_mousedown"
          >{{ this.trantime }}</span
        >
        <div
          class="location-right"
          @click="handleLocationRightClick($event)"
          @touchend="handleLocationRightClick"
          v-if="exportVideoSetShow"
        ></div>
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { pointerSetApi } from '@/api/Pointer'
import _ from 'lodash'
export default {
  name: 'videoTip',
  data: function() {
    return {
      x: 0,
      width: 0,
      flag: false // 组件本身运动状态标记
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState([
      'slidernum',
      'openway',
      'videoTipLocker',
      'exportVideoSetShow',
      'trackStart',
      'trackEnd'
    ]),
    loadingShow: function() {
      return this.startloading || this.onloading
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    length() {
      return this.$store.state.all.curr_track_len
    },
    left() {
      // debugger
      let leftPosition
      if (this.pointer.position >= this.length) {
        leftPosition =
          this.length / (this.slidernum.max - this.track_property.ratio) -
          this.track_property.outLeft
      } else if (this.pointer.position + 1 === this.length) {
        leftPosition =
          (this.pointer.position + 1) /
            (this.slidernum.max - this.track_property.ratio) -
          this.track_property.outLeft
      } else {
        leftPosition =
          this.pointer.position /
            (this.slidernum.max - this.track_property.ratio) -
          this.track_property.outLeft
      }
      return leftPosition
    },
    trantime() {
      let s = this.pointer.position
      let h = Math.floor(s / (60 * 25))
      let m = Math.floor((s % (60 * 25)) / 25)
      m < 10 && (m = '0' + m)
      s = parseInt(s % 25, 10)
      s < 10 && (s = '0' + s)
      h < 10 && (h = '0' + h)
      return h + ':' + m + ':' + s // 00:00:00
    },
    pointer() {
      return this.$store.state.all.pointer
    },
    isPlaying() {
      return !!this.$store.state.all.pointer.speed
    }
  },
  watch: {
    left: function() {
      if (this.left < 0 || this.left > $('#ruler').width()) {
        $('#edit_tip_line').hide()
      } else {
        $('#edit_tip_line').show()
      }
    }
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      'UPDATE_POINTER',
      'CHANGE_POS',
      'UPDATE_TRACK_START',
      'UPDATE_TRACK_END',
      'UPDATE_POINTER_POSITION'
    ]),
    // eslint-disable-next-line no-empty-function
    temp() {},
    pointerSet: _.throttle(function() {
      pointerSetApi({ position: this.pointer.position })
    }, 200),
    n_mousedown(e_para) {
      // console.log({ onStartDrag: this.pointer.position });
      e_para.preventDefault && e_para.preventDefault() // 阻止默认事件
      let e = e_para
      this.flag = true
      if (e.touches) {
        e = e.touches[0]
      }
      this.x = e.clientX - this.$refs.leftN.offsetLeft // 文档显示区高度减去拖动div的相对父元素高度
      if (this.openway === 'pc') {
        this.addHandler(document, 'mousemove', this.moveDrag) // 绑定moveDrag
        this.addHandler(document, 'mouseup', this.stopDrag) // 绑定stopDrag
        this.addHandler(document, 'mousemove', this.pointerSet)
      } else {
        this.addHandler(document, 'touchmove', this.moveDrag) // 绑定moveDrag
        this.addHandler(document, 'touchend', this.stopDrag) // 绑定stopDrag
        this.addHandler(document, 'touchmove', this.pointerSet)
      }
      this.CHANGE_POS(true)
      this.$refs.leftW.setCapture && this.$refs.leftW.setCapture() // 设置捕获范围
    },
    addHandler(oElement, sEventType, fnHandler) {
      return oElement.addEventListener
        ? oElement.addEventListener(sEventType, fnHandler, false)
        : oElement.attachEvent('on' + sEventType, fnHandler)
    },
    removeHandler: function(oElement, sEventType, fnHandler) {
      return oElement.removeEventListener
        ? oElement.removeEventListener(sEventType, fnHandler, false)
        : oElement.detachEvent('on' + sEventType, fnHandler)
    },
    moveDrag: function(e_para) {
      // e.preventDefault && e.preventDefault();
      // console.log({ onDraging: this.pointer.position });
      if (!this.flag) {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      let iLeft = e.clientX - this.x
      iLeft < 0 && (iLeft = 0)
      if (
        iLeft + parseFloat(this.$refs.leftN.offsetWidth) >
        this.$refs.leftW.offsetWidth
      ) {
        iLeft =
          this.$refs.leftW.offsetWidth -
          parseFloat(this.$refs.leftN.offsetWidth)
      }
      if (
        (iLeft + this.track_property.outLeft) *
          (this.slidernum.max - this.track_property.ratio) >
        this.length
      ) {
        iLeft =
          this.length / (this.slidernum.max - this.track_property.ratio) -
          this.track_property.outLeft
      }
      // this.left =  iLeft;
      this.position = parseInt(
        (iLeft + this.track_property.outLeft) *
          (this.slidernum.max - this.track_property.ratio),
        10
      )
      this.UPDATE_POINTER_POSITION(this.position)
    },
    stopDrag: function() {
      // console.log({ onStopDrag: this.pointer.position });
      this.flag = false
      const that = this
      if (this.openway === 'pc') {
        this.removeHandler(document, 'mousemove', this.moveDrag) // 绑定moveDrag
        this.removeHandler(document, 'mouseup', this.stopDrag) // 绑定stopDrag
        this.removeHandler(document, 'mousemove', this.pointerSet)
      } else {
        this.removeHandler(document, 'touchmove', this.moveDrag) // 绑定moveDrag
        this.removeHandler(document, 'touchend', this.stopDrag) // 绑定stopDrag
        this.removeHandler(document, 'touchmove', this.pointerSet)
      }
      this.$refs.leftW.releaseCapture && this.$refs.leftW.releaseCapture()
      this.Post({
        type: 'pointer',
        data: {
          cmd: 'set',
          speed: that.pointer.speed,
          position: that.position
        },
        success: function() {
          that.CHANGE_POS(false)
        },
        error: function() {
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
    handleLocationLeftClick(e) {
      // console.log({ leftClick: this.pointer.position });
      if (this.pointer.position < this.trackEnd) {
        this.UPDATE_TRACK_START(this.pointer.position)
        // pointerSetApi({ position: this.pointer.position });
      }
    },
    handleLocationRightClick(e) {
      // console.log({ rightClick: this.pointer.position });
      if (this.pointer.position > this.trackStart) {
        this.UPDATE_TRACK_END(this.pointer.position)
        // pointerSetApi({ position: this.pointer.position });
      }
    }
  },
  mounted: function() {
    $('#edit_tip_line').height($('.nces_edit').height() + 32 - 58)
    if (this.left < 0 || this.left > $('#ruler').width()) {
      $('#edit_tip_line').hide()
    }
    return
  }
}
</script>

<style>
.location-time {
  padding-left: 2px;
  padding-right: 2px;
}
.nces_edit .edit_tip {
  position: relative;
  height: 0;
  margin: 0 25px 0 170px;
  background-color: #088fd3;
  top: -32px;
  z-index: 1004;
  font-size: 12px;
}
.nces_edit .edit_tip #edit_track_contents {
  position: relative;
}
.nces_edit .edit_tip .edit_tip_line {
  position: absolute;
  left: 60px;
  width: 1px;
  height: calc(100vh - 50vw * 9 / 16 - 203px);
  background-color: #088fd3;
  left: 0px;
}
.is-playing {
  transition: left 1s ease;
}
/* .tip-extend-height {
	margin-top: -30px;
} */
.height-plus {
  margin-top: -30px;
  height: 62px !important;
}
.nces_edit .edit_tip .edit_tip_line .edit_tip_title {
  position: absolute;
  display: flex;
  background-color: #088fd3;
  /* width: 61px; */
  /* padding-left: 5px;
  padding-right: 5px; */
  text-align: center;
  left: 50%;
  transform: translate(-50%, 0);
  cursor: ew-resize;
}

.nces_edit .edit_tip .edit_tip_line .edit_tip_title:after {
  content: '';
  border: 5px solid transparent;
  border-top: 5px solid #088fd3;
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translate(-50%, 0);
}
.location-left {
  /* background-color: red; */
  float: left;
  width: 16px;
  height: 16px;
  background: url(../../img/location2.png);
  background-size: 100%;
  background-repeat: no-repeat;
  cursor: pointer;
}
.location-right {
  float: right;
  width: 16px;
  height: 16px;
  background: url(../../img/location2.png);
  background-repeat: no-repeat;
  background-size: 100%;
  cursor: pointer;
  transform: translateX(2px);
}
</style>
