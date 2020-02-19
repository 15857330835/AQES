<template>
  <div
    class="edit_ruler clearfix"
    :class="{ 'extend-height': exportVideoSetShow }"
  >
    <div class="edit_ruler_title" v-if="!exportVideoSetShow">
      <span class="icon addT" @click="addtrack" title="添加轨道"></span>
      <span
        class="icon xifu"
        :class="this.track_property.xifuFlag ? 'active' : ''"
        @click="xifuflagChange"
        :title="this.track_property.xifuFlag ? '关闭吸附' : '开启吸附'"
      ></span>
    </div>
    <div class="edit_ruler_title" v-else>
      <span :title="moved ? '输出时长' : ''">{{
        moved ? exportTime : '输出时长'
      }}</span>
    </div>
    <div class="edit_ruler_content">
      <div
        @mouseup="openway == 'pc' ? moveto($event) : temp()"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
      >
        <canvas id="ruler" height="58"></canvas>
      </div>
    </div>
    <div
      class="export-time-line"
      v-if="exportVideoSetShow"
      :style="{ left: left + 'px', width: width + 'px' }"
    ></div>
    <div
      class="pin"
      v-if="exportVideoSetShow"
      :style="{ left: left + 'px', width: width + 'px' }"
    >
      <div
        class="pin-left"
        @mousedown="handlePinLeftMouseDown"
        @touchstart="handlePinLeftMouseDown"
      ></div>
      <div
        class="pin-right"
        @mousedown="handlePinRightMouseDown"
        @touchstart="handlePinRightMouseDown"
      ></div>
    </div>
    <!-- <div class="mask" v-if="exportVideoSetShow">
      <div class="mask-left"></div>
      <div class="mask-right"></div>
    </div>-->
    <div class="maskForPin-left" v-if="exportVideoSetShow"></div>
    <div class="maskForPin-right" v-if="exportVideoSetShow"></div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { pointerSetApi } from '@/api/Pointer'
import _ from 'lodash'
export default {
  name: 'drawRuler',
  data: function() {
    return {
      startt: 0,
      endt: 0,
      start: 0,
      end: 0,
      videoFrames: 0,
      trackWidth: 0,
      totalRatio: 0,
      baseX: 170, // 0:00的线到浏览器最左端的距离
      moved: false, // 是否移动过左右指针
      unwatchStart: null,
      unwatchEnd: null
    }
  },
  watch: {
    track_property: {
      deep: true,
      handler: function(value, oldvalue) {
        this.drawruler()
      }
    },
    exportVideoSetShow(val) {
      if (val) {
        // 当进入导出视频设置时监听trackStart和trackEnd， 如果发生变动moved标记为true
        // unwatchStart 不能设为局部变量，不然每次watch的时候都会丢失
        this.unwatchStart = this.$watch('trackStart', function(newVal, oldVal) {
          this.moved = true
        })
        this.unwatchEnd = this.$watch('trackEnd', function(newVal, oldVal) {
          this.move = true
        })
      } else {
        // 当退出导出视频设置时停止监听trackStart和trackEnd， 并且将moved值重置为false
        this.unwatchStart()
        this.unwatchEnd()
        this.moved = false
      }
    }
  },
  computed: {
    ...mapState([
      'boxset',
      'openway',
      'exportVideoSetShow',
      'slidernum',
      'systemmessage',
      'trackStart',
      'trackEnd'
    ]),
    track_property() {
      return this.$store.state.all.track_property
    },
    length() {
      return this.$store.state.all.curr_track_len
    },
    pointer() {
      return this.$store.state.all.pointer
    },
    left() {
      return (
        this.baseX +
        this.trackStart / (this.slidernum.max - this.track_property.ratio) -
        this.track_property.outLeft
      )
    },
    width() {
      return (
        (this.trackEnd - this.trackStart) /
        (this.slidernum.max - this.track_property.ratio)
      )
    },
    exportTime() {
      return this.trantime(this.trackEnd - this.trackStart)
    },
    tracknum() {
      return (
        this.$store.state.all.tracks.a_track_list.length +
        this.$store.state.all.tracks.v_track_list.length
      )
    }
  },
  methods: {
    ...mapActions(['Post', 'getnowimg']),
    ...mapMutations([
      'CHANGE_BOXSET',
      'PROPERTY_XIFU',
      'UPDATE_POINTER',
      'PROPERTY_OUTLEFT',
      'UPDATE_POINTER_POSITION',
      'UPDATE_TRACK_START',
      'UPDATE_TRACK_END'
    ]),
    // eslint-disable-next-line no-empty-function
    temp: function() {},
    addtrack: function() {
      this.CHANGE_BOXSET('addtrack')
      window.zindex = 0
    },
    getElementPos(elementId) {
      const ua = navigator.userAgent.toLowerCase()
      const isOpera = ua.indexOf('opera') !== -1
      // eslint-disable-next-line no-unused-vars
      const isIE = ua.indexOf('msie') !== -1 && !isOpera // not opera spoof
      const el = document.getElementById(elementId)
      if (el.parentNode === null || el.style.display === 'none') {
        return false
      }
      let parent = null
      let pos = []
      let box
      if (el.getBoundingClientRect) {
        // IE
        box = el.getBoundingClientRect()
        const scrollTop = Math.max(
          document.documentElement.scrollTop,
          document.body.scrollTop
        )
        const scrollLeft = Math.max(
          document.documentElement.scrollLeft,
          document.body.scrollLeft
        )
        return {
          x: box.left + scrollLeft,
          y: box.top + scrollTop
        }
      } else if (document.getBoxObjectFor) {
        // gecko

        box = document.getBoxObjectFor(el)
        const borderLeft = el.style.borderLeftWidth
          ? parseInt(el.style.borderLeftWidth, 10)
          : 0
        const borderTop = el.style.borderTopWidth
          ? parseInt(el.style.borderTopWidth, 10)
          : 0
        pos = [box.x - borderLeft, box.y - borderTop]
      } // safari & opera
      else {
        pos = [el.offsetLeft, el.offsetTop]
        parent = el.offsetParent
        if (parent !== el) {
          while (parent) {
            pos[0] += parent.offsetLeft
            pos[1] += parent.offsetTop
            parent = parent.offsetParent
          }
        }
        if (
          ua.indexOf('opera') !== -1 ||
          (ua.indexOf('safari') !== -1 && el.style.position === 'absolute')
        ) {
          pos[0] -= document.body.offsetLeft
          pos[1] -= document.body.offsetTop
        }
      }
      if (el.parentNode) {
        parent = el.parentNode
      } else {
        parent = null
      }
      while (parent && parent.tagName !== 'BODY' && parent.tagName !== 'HTML') {
        // account for any scrolled
        // ancestors
        pos[0] -= parent.scrollLeft
        pos[1] -= parent.scrollTop
        if (parent.parentNode) {
          parent = parent.parentNode
        } else {
          parent = null
        }
      }
      return {
        x: pos[0],
        y: pos[1]
      }
    },
    xifuflagChange: function() {
      const that = this
      const data = {}
      const flag = !that.track_property.xifuFlag
      data.type = 'track'
      data.data = {
        cmd: 'property_append',
        track_property: { xifuFlag: flag }
      }
      data.success = function(res) {
        that.PROPERTY_XIFU(flag)
      }
      data.error = function() {
        window.zindex = 0
        that.$alert('吸附切换失败！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
      }
      this.Post(data)
    },
    moveto: function(e) {
      if (this.pointer.speed === 0) {
        const x = e.offsetX || e.pageX - this.getElementPos('ruler').x
        const position =
          parseInt(x + this.track_property.outLeft, 10) *
            (this.slidernum.max - this.track_property.ratio) >
          this.length
            ? parseInt(this.length, 10)
            : parseInt(
                (x + this.track_property.outLeft) *
                  (this.slidernum.max - this.track_property.ratio),
                10
              )
        this.UPDATE_POINTER({ position: position, speed: this.pointer.speed })
        $('#edit_tip_line').show()
        const data = { cmd: 'set', position: position }
        $.post(
          window.NCES.DOMAIN + '/api/pointer',
          JSON.stringify(data),
          function(res) {
            if (res.code !== 0) {
              // $('.tipProp_content p').html('超出视频有效区域！')
              // $('.tipProp').show()
            }
          },
          'json'
        )
      }
    },
    touchstart: function(e_para) {
      const e = e_para.touches[0]
      this.start = e.pageX
      this.startt = Date.now()
    },
    touchmove: function(e_para) {
      const e = e_para.touches[0]
      const left = parseFloat($('#edit_tip_line').css('left'))
      if (left < 0 || left > $('#ruler').width()) {
        $('#edit_tip_line').hide()
      } else {
        $('#edit_tip_line').show()
      }
      let a = this.track_property.outLeft - e.pageX + this.start
      if (
        a >
        $('.track_able_content').width() - $('.edit_track_contents').width()
      ) {
        a = $('.track_able_content').width() - $('.edit_track_contents').width()
      }
      if (a < 0) {
        a = 0
      }
      this.PROPERTY_OUTLEFT(a)
      // this.track_property.outLeft = a
      this.start = e.pageX
    },
    touchend: function(e_para) {
      const that = this
      const e = e_para.changedTouches[0]
      if (Date.now() - this.startt < 200) {
        this.moveto(e)
        return
      }
      const trackend =
        parseInt(
          (this.track_property.outLeft + $('.edit_track_contents').width()) *
            (this.slidernum.max - this.track_property.ratio),
          10
        ) > this.length
          ? this.length
          : parseInt(
              (this.track_property.outLeft +
                $('.edit_track_contents').width()) *
                (this.slidernum.max - this.track_property.ratio),
              10
            )
      $.post(
        window.NCES.DOMAIN + '/api/track',
        JSON.stringify({
          cmd: 'property_append',
          track_property: { outLeft: this.track_property.outLeft }
        }),
        function(res) {
          if (res.code === 0) {
            that.getnowimg({
              track_start:
                (parseInt(
                  (that.track_property.outLeft - 100) *
                    (that.slidernum.max - that.track_property.ratio),
                  10
                ) < 0
                  ? 0
                  : parseInt(
                      (that.track_property.outLeft - 100) *
                        (that.slidernum.max - that.track_property.ratio),
                      10
                    )) || 0,
              track_end: trackend || 0,
              r_interval: parseInt(
                (that.slidernum.max - that.track_property.ratio) * 100,
                10
              ),
              pixel_ratio: parseFloat(
                (that.slidernum.max - that.track_property.ratio).toFixed(2)
              ),
              height: 56
            })
          }
          if (res.code !== 0) {
            console.warn(res.msg)
          }
        },
        'json'
      )
    },
    trantime: function(s_para) {
      let s = s_para
      let h = Math.floor(s / 1500)
      let m = Math.floor((s % 1500) / 25)
      m < 10 && (m = '0' + m)
      s = parseInt(s % 25, 10)
      s < 10 && (s = '0' + s)
      h < 10 && (h = '0' + h)
      return h + ':' + m + ':' + s // 00:00:00
    },
    throttleResizeDrawRuler: _.throttle(function() {
      this.drawruler()
    }, 100),
    drawruler: function(resize) {
      const canvas = $('#ruler')[0]
      const ctx = canvas.getContext('2d')
      canvas.width = $('.edit_ruler_content>div').width()
      const that = this
      // canvas.style.background = "#2B2B2B";
      // 画刻度尺
      ctx.strokeStyle = '#fff'
      ctx.fillStyle = '#c6c6c6'
      ctx.lineWidth = '1px'
      ctx.save()
      // if (typeof resize === 'undefined') {
      //   ctx.translate(left, 0) // undefined
      // }
      const left = Math.floor(this.track_property.outLeft) || 0
      for (let i = left; i < left + canvas.width; i++) {
        ctx.beginPath()

        if (i % 100 === 0) {
          // 起点x坐标10像素，画厘米线
          ctx.moveTo(0, 32)
          ctx.lineTo(0, 42)
          const s = i * (this.slidernum.max - that.track_property.ratio) // 帧数*每个px对应的帧数
          // var s = i * (30.0).toFixed(1);
          // console.log(s);
          const text = this.trantime(s)
          const txtWidth = ctx.measureText(text).width
          ctx.font = '10px sans-serif'
          ctx.fillText(text, 0 - txtWidth / 2, 25)
        } else if (i % 50 === 0) {
          // 每隔0.5cm画间隔线
          ctx.moveTo(0, 35)
          ctx.lineTo(0, 42)
        } else if (i % 10 === 0) {
          // 画毫米线
          ctx.moveTo(0, 37)
          ctx.lineTo(0, 42)
        }
        ctx.stroke()
        ctx.translate(1, 0) // 每隔10像素移动一次，达到画线效果
      }
      ctx.restore()
    },
    pointerSetStart: _.throttle(function() {
      pointerSetApi({ position: this.trackStart })
    }, 200),
    pointerSetEnd: _.throttle(function() {
      pointerSetApi({ position: this.trackEnd })
    }, 200),
    handlePinLeftMouseDown(e_out_para) {
      let e_out = e_out_para || window.event
      if (e_out.touches) {
        e_out = e_out.touches[0]
      }
      let _trackStart
      const move = e_para => {
        let e = e_para
        if (e.touches) {
          e = e.touches[0]
        }
        let iLeft = e.clientX - this.baseX - 20 // 20是游标的宽度
        if (iLeft < 0) {
          iLeft = 0
        }
        _trackStart = parseInt(
          (iLeft + this.track_property.outLeft) *
            (this.slidernum.max - this.track_property.ratio),
          10
        )
        _trackStart = Math.min(_trackStart, this.trackEnd)
        this.UPDATE_POINTER_POSITION(_trackStart)
        this.UPDATE_TRACK_START(_trackStart)
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mousemove', this.pointerSetStart)
        document.removeEventListener('mouseup', up)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('touchmove', this.pointerSetStart)
        document.removeEventListener('touchend', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mousemove', this.pointerSetStart)
      document.addEventListener('mouseup', up)
      document.addEventListener('touchmove', move)
      document.addEventListener('touchmove', this.pointerSetStart)
      document.addEventListener('touchend', up)
    },
    handlePinRightMouseDown(e_out_para) {
      let e_out = e_out_para || window.event
      if (e_out.touches) {
        e_out = e_out.touches[0]
      }
      let _trackEnd
      const move = e_para => {
        let e = e_para
        if (e.touches) {
          e = e.touches[0]
        }
        let iLeft = e.clientX - this.baseX - 20 // 20是游标的宽度
        if (iLeft < 0) {
          iLeft = 0
        }
        _trackEnd = parseInt(
          (iLeft + this.track_property.outLeft) *
            (this.slidernum.max - this.track_property.ratio),
          10
        )
        _trackEnd = Math.min(_trackEnd, this.$store.state.all.curr_track_len)
        _trackEnd = Math.max(this.trackStart, _trackEnd)
        this.UPDATE_POINTER_POSITION(_trackEnd)
        this.UPDATE_TRACK_END(_trackEnd)
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mousemove', this.pointerSetEnd)
        document.removeEventListener('mouseup', up)
        document.removeEventListener('touchmove', move)
        document.removeEventListener('touchmove', this.pointerSetEnd)
        document.removeEventListener('touchend', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mousemove', this.pointerSetEnd)
      document.addEventListener('mouseup', up)
      document.addEventListener('touchmove', move)
      document.addEventListener('touchmove', this.pointerSetEnd)
      document.addEventListener('touchend', up)
    }
  },
  mounted: function() {
    // this.trackWidth = document.querySelector(".edit_ruler_content>div").offsetWidth;
    // this.videoFrames = this.$store.state.all.curr_track_len;
    // this.totalRatio = this.videoFrames / this.trackWidth;
    // console.log(this.totalRatio);
    this.drawruler()
    window.addEventListener('resize', this.throttleResizeDrawRuler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.throttleResizeDrawRuler)
  }
}
</script>

<style lang="scss" scoped>
$active-color: #3b8dcb;
.edit_ruler {
  position: relative;
  .edit_ruler_title {
    height: 42px;
    width: 160px;
    line-height: 42px;
    text-align: center;
    font-size: 12px;
    float: left;
    box-sizing: border-box;
    border-bottom: 1px solid #141414;
    border-right: 1px solid #141414;
    position: relative;
    .icon {
      width: 16px;
      height: 16px;
      display: inline-block;
      /*position: absolute;*/
      line-height: 58px;
      margin: 12px 10px 0;
      background-size: contain;
      cursor: pointer;
      text-align: center;
      &.addT {
        background-image: url(../../img/addTrack.png);
      }
      &.xifu {
        background-image: url(../../img/unxifu.png);
        background-repeat: no-repeat;
        &.active {
          background-image: url(../../img/xifu.png);
          background-repeat: no-repeat;
        }
      }
    }
  }
  .edit_ruler_content {
    width: calc(100% - 160px);
    float: left;
    > div {
      margin: 0 25px 0 10px;
      height: 42px;
      box-sizing: border-box;
      border-bottom: 1px solid #565656;
    }
  }
  .export-time-line {
    position: absolute;
    height: 5px;
    top: 58px;
    background-color: $active-color;
    z-index: 1;
  }
  .pin {
    position: absolute;
    height: 5px;
    top: 58px;
    z-index: 3;
    &-left {
      position: absolute;
      transform: translateX(-20px);
      height: 0;
      width: 0;
      border: 10px solid #aaa;
      border-top-color: transparent;
      border-left-color: transparent;
      cursor: ew-resize;
      left: 0;
      &.active {
        border: 10px solid $active-color;
      }
    }
    &-right {
      position: absolute;
      transform: translateX(20px);
      height: 0;
      width: 0;
      border: 10px solid #aaa;
      border-top-color: transparent;
      border-right-color: transparent;
      cursor: ew-resize;
      right: 0;
      &.active {
        border: 10px solid $active-color;
      }
    }
  }
  .maskForPin {
    &-left {
      height: 20px;
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(-5px) translateX(-2px);
      z-index: 4;
      height: 20px;
      width: 162px;
      background-color: #222;
    }
    &-right {
      height: 20px;
      position: absolute;
      bottom: 0;
      right: 0;
      transform: translateY(-5px) translateX(2px);
      z-index: 4;
      height: 20px;
      width: 15px;
      background-color: #222;
    }
  }
}

.extend-height {
  padding-bottom: 25px;
}
</style>
