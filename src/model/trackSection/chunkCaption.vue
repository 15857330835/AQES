<template>
  <div
    class="fchunkbox"
    :class="
      this.activechunk.chunk.chunk_id == this.chunk.chunk_id
        ? this.activechunk.state
        : ''
    "
    :style="{
      position: this.move ? 'fixed' : 'absolute',
      zIndex: this.move ? 1003 : 1002,
      backgroundColor: '#000',
      backgroundSize: 'auto 100%',
      height: '29px',
      top: (this.move ? this.y : 0) + 'px',
      width:
        (this.chunk.track_end - this.chunk.track_start) /
          (this.slidernum.max - this.track_property.ratio) +
        'px',
      left:
        (this.move
          ? this.x
          : this.chunk.track_start /
            (this.slidernum.max - this.track_property.ratio)) + 'px',
      overflow: 'hidden'
    }"
  >
    <div
      class=" chunkbox 2"
      :id="this.chunk.chunk_id"
      :style="{
        width: '100%',
        lineHeight: '23px',
        height: '29px',
        position: 'absolute',
        left: 0
      }"
      @mousedown.left="openway == 'pc' ? mousedown($event) : temp()"
      @touchstart="down($event, 500)"
      @touchmove="mousemove"
      @touchend="mouseup"
      @dblclick="dblclick"
    >
      <div
        @mousedown="openway == 'pc' ? toLeft($event) : temp()"
        @touchstart="toLeft($event)"
        @touchmove="toLeftmove"
        @touchend="toLeftup"
        style="position:absolute;z-index:10;left:0"
      ></div>
      <div
        @mousedown="openway == 'pc' ? toRight($event) : temp()"
        @touchstart="toRight($event)"
        @touchmove="toRightmove"
        @touchend="toRightup"
        style="position:absolute;z-index:10;right:0"
      ></div>
      {{ this.chunk.text }}
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { ATTACH_NUMBER } from '@/config'

export default {
  data() {
    return {
      move: false,
      x: 0,
      y: 0,
      offsetx: 0,
      offsety: 0,
      xifuindex: null,
      xifulength: null,
      chunkmove: '',
      timer: null,
      lastt: 0,
      timerLeft: null,
      timerRight: null,
      oldpage: 0,
      oldstart: 0
    }
  },
  props: ['chunk', 'index'],
  computed: {
    ...mapState([
      'trackcaption',
      'trackposition',
      'activechunk',
      'slidernum',
      'openway',
      'modalVoiceApplyIsShow'
    ]),
    pointer() {
      return this.$store.state.all.pointer
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    chunks() {
      return this.$store.state.all.caption.chunks
    },
    delchunkposition() {
      const that = this
      const z = that.chunks
      const chunkPosition = { v: [] }
      for (let n = 0; n < z.length; n++) {
        if (z[n].chunk_id !== that.chunk.chunk_id) {
          const obj = {}
          obj.id = z[n].chunk_id
          obj.min = z[n].track_start
          obj.max = z[n].track_end
          chunkPosition.v.push(obj)
        }
      }
      return chunkPosition
    }
  },
  watch: {},
  methods: {
    ...mapActions(['changeLoading', 'Post']),
    ...mapMutations([
      'ACTIVE_CHUNK',
      'CHANGE_CAPTIONSETSHOW',
      'PROPERTY_OUTLEFT',
      'CLEAR_REST_ACTIVE_CHUNKS',
      'CHANGE_IS_REFRESH_CAPTION_SET_BS'
    ]),
    // eslint-disable-next-line no-empty-function
    temp() {},
    click() {
      this.ACTIVE_CHUNK({
        chunk: this.chunk,
        state: 'active',
        index: this.index
      })
    },
    down(e, time) {
      const that = this
      this.ACTIVE_CHUNK({
        chunk: this.chunk,
        state: 'active',
        index: this.index
      })
      this.timer = setTimeout(function() {
        that.mousedown(e)
      }, time)
    },
    mousedown(e_para) {
      e_para.stopPropagation()
      let e = e_para
      if (e_para.touches) {
        e = e_para.touches[0]
      }
      if (this.modalVoiceApplyIsShow) {
        return
      }
      this.CLEAR_REST_ACTIVE_CHUNKS()
      this.chunkmove = 'all'
      this.x = this.getElementPos(this.chunk.chunk_id).x - 3
      this.y = this.getElementPos(this.chunk.chunk_id).y - 3
      this.offsetx = e.pageX - this.x
      this.offsety = e.pageY - this.y
      if (this.openway !== 'pc') {
        this.ACTIVE_CHUNK({
          chunk: this.chunk,
          state: 'moveing',
          index: this.index
        })
      } else {
        this.ACTIVE_CHUNK({
          chunk: this.chunk,
          state: 'active',
          index: this.index
        })
      }
      // 播放状态调用暂停
      if (this.pointer.speed === 1) {
        this.Post({
          type: 'pointer',
          data: { cmd: 'set', speed: 0 },
          error: () => {
            this.$notify({
              title: '提示',
              type: 'error',
              message: '操作失败！',
              position: 'bottom-right',
              duration: 2500
            })
          }
        })
      }
      if (this.openway === 'pc') {
        $(document).on('mousemove', this.mousemove)
        $(document).one('mouseup', this.mouseup)
      }
    },
    xifuHandler(e) {
      let faaa = 0
      for (let m = 0; m < this.delchunkposition.v.length; m++) {
        if (
          Math.abs(
            e.pageX +
              this.track_property.outLeft -
              this.trackcaption.minX -
              this.offsetx
          ) < 10 &&
          this.track_property.xifuFlag
        ) {
          this.x = ATTACH_NUMBER - this.track_property.outLeft
          this.xifuindex = 0
          faaa++
        }
        if (
          Math.abs(
            e.pageX +
              this.track_property.outLeft -
              this.trackcaption.minX -
              this.offsetx -
              this.delchunkposition.v[m].max /
                (this.slidernum.max - this.track_property.ratio)
          ) < 10 &&
          this.track_property.xifuFlag
        ) {
          this.x =
            this.delchunkposition.v[m].max /
              (this.slidernum.max - this.track_property.ratio) +
            ATTACH_NUMBER -
            this.track_property.outLeft
          this.xifuindex = this.delchunkposition.v[m].max
          faaa++
        }
        if (
          Math.abs(
            e.pageX +
              this.track_property.outLeft -
              this.trackcaption.minX -
              this.offsetx -
              this.delchunkposition.v[m].min /
                (this.slidernum.max - this.track_property.ratio)
          ) < 10 &&
          this.track_property.xifuFlag
        ) {
          this.x =
            this.delchunkposition.v[m].min /
              (this.slidernum.max - this.track_property.ratio) +
            ATTACH_NUMBER -
            this.track_property.outLeft
          this.xifuindex = this.delchunkposition.v[m].min
          faaa++
        }
        if (
          Math.abs(
            e.pageX +
              this.track_property.outLeft -
              this.trackcaption.minX -
              this.offsetx +
              (this.chunk.track_end - this.chunk.track_start) /
                (this.slidernum.max - this.track_property.ratio) -
              this.delchunkposition.v[m].min /
                (this.slidernum.max - this.track_property.ratio)
          ) < 10 &&
          this.track_property.xifuFlag
        ) {
          this.x =
            (this.delchunkposition.v[m].min -
              this.chunk.track_end +
              this.chunk.track_start) /
              (this.slidernum.max - this.track_property.ratio) +
            ATTACH_NUMBER -
            this.track_property.outLeft
          this.xifuindex =
            this.delchunkposition.v[m].min -
            this.chunk.track_end +
            this.chunk.track_start
          faaa++
        }
        if (
          Math.abs(
            e.pageX +
              this.track_property.outLeft -
              this.trackcaption.minX -
              this.offsetx +
              (this.chunk.chunk_end - this.chunk.chunk_start) /
                (this.slidernum.max - this.track_property.ratio) -
              this.delchunkposition.v[m].max /
                (this.slidernum.max - this.track_property.ratio)
          ) < 10 &&
          this.track_property.xifuFlag
        ) {
          this.x =
            (this.delchunkposition.v[m].max -
              this.chunk.track_end +
              this.chunk.track_start) /
              (this.slidernum.max - this.track_property.ratio) +
            ATTACH_NUMBER -
            this.track_property.outLeft
          this.xifuindex =
            this.delchunkposition.v[m].max -
            this.chunk.track_end +
            this.chunk.track_start
          faaa++
        }
      }
      this.y = this.trackcaption.minY
      if (faaa === 0) {
        this.xifuindex = null
        if (this.activechunk.chunkstate === 'moveing') {
          return
        }
        this.ACTIVE_CHUNK({ state: 'moveing', index: this.index })
      }
      let x1, x2
      if (this.xifuindex) {
        x1 = this.xifuindex
        x2 = this.xifuindex + this.chunk.track_end - this.chunk.track_start
      } else {
        x1 =
          (e.pageX -
            this.trackcaption.minX -
            this.offsetx +
            this.track_property.outLeft) *
          (this.slidernum.max - this.track_property.ratio)
        x2 = x1 + this.chunk.track_end - this.chunk.track_start
      }
      return { num1: x1, num2: x2 }
    },
    sideTimer(e) {
      // 移动到左右两端时启动定时器
      if (
        e.pageX - this.trackcaption.minX < 20 &&
        this.track_property.outLeft !== 0
      ) {
        if (this.timerLeft == null) {
          this.timerLeft = setInterval(() => {
            this.track_property.outLeft =
              this.track_property.outLeft - 50 < 0
                ? 0
                : this.track_property.outLeft - 50
          }, 100)
        }
      } else {
        clearInterval(this.timerLeft)
        this.timerLeft = null
      }
      if (this.trackcaption.maxX - e.pageX < 20) {
        if (this.timerRight == null) {
          this.timerRight = setInterval(() => {
            this.track_property.outLeft =
              this.track_property.outLeft + 50 >
              $('.track_able_content').width() -
                $('.edit_track_contents').width()
                ? $('.track_able_content').width() -
                  $('.edit_track_contents').width()
                : this.track_property.outLeft + 50
          }, 100)
        }
      } else {
        clearInterval(this.timerRight)
        this.timerRight = null
      }
    },
    indexHandler(x1, x2) {
      let index = 0
      for (let j = 0; j < this.delchunkposition.v.length; j++) {
        if (
          (x1 >= this.delchunkposition.v[j].min &&
            x1 < this.delchunkposition.v[j].max) ||
          (x2 > this.delchunkposition.v[j].min &&
            x2 < this.delchunkposition.v[j].max) ||
          (this.delchunkposition.v[j].min >= x1 &&
            this.delchunkposition.v[j].min < x2) ||
          (this.delchunkposition.v[j].max > x1 &&
            this.delchunkposition.v[j].max < x2)
        ) {
          index++
        }
      }
      if (index !== 0) {
        index = 0
        if (this.activechunk.chunkstate === 'moveing1') {
          return
        }
        this.ACTIVE_CHUNK({ state: 'moveing1', index: this.index })
      } else {
        if (this.activechunk.chunkstate === 'moveing') {
          return
        }
        this.ACTIVE_CHUNK({ state: 'moveing', index: this.index })
      }
    },
    mousemove(e_para) {
      if (this.openway !== 'pc') {
        clearTimeout(this.timer)
        this.timer = 0
      }
      if (this.chunkmove !== 'all') {
        return
      }
      let e = e_para
      if (e_para.touches) {
        if (e_para.touches.length > 0) {
          e = e_para.touches[0]
        } else {
          e = e_para.changedTouches[0]
        }
      }
      this.move = true
      this.x = e.pageX - this.offsetx
      this.y = e.pageY - this.offsety
      if (
        e.pageX > this.trackcaption.minX &&
        e.pageX < this.trackcaption.maxX &&
        e.pageY > this.trackcaption.minY &&
        e.pageY < this.trackcaption.maxY
      ) {
        const numObj = this.xifuHandler(e)
        this.sideTimer(e)
        this.indexHandler(numObj.x1, numObj.x2)
      } else {
        if (this.activechunk.chunkstate === '') {
          return
        }
        this.ACTIVE_CHUNK({ state: '', index: this.index })
      }
    },
    mouseup(e_para) {
      let e = e_para
      if (Date.now() - this.lastt < 300) {
        if (e.touches && e.touches.length > 0) {
          return
        }
        if (e.changedTouches) {
          this.dblclick()
        }
      }
      this.lastt = Date.now()
      if (this.openway !== 'pc') {
        clearTimeout(this.timer)
        if (this.timer !== 0) {
          this.ACTIVE_CHUNK({ state: 'active', index: this.index })
          return
        }
      } else {
        $(document).off('mousemove')
      }
      if (this.chunkmove !== 'all') {
        return
      }
      if (e.touches) {
        e = e.changedTouches[0]
      }
      this.chunkmove = ''
      const that = this
      clearInterval(this.timerLeft)
      this.timerLeft = null
      clearInterval(this.timerRight)
      this.timerRight = null
      $.post(
        window.AQES.DOMAIN + '/api/property',
        JSON.stringify({
          cmd: 'append',
          property: { outLeft: this.track_property.outLeft }
        }),
        function(res) {
          if (res.code === 0) {
            // Hub.$emit('changeM')
          }
          if (res.code !== 0) {
            console.warn(res.msg)
          }
        },
        'json'
      )
      const start =
        this.xifuindex ||
        parseInt(
          (e.pageX -
            that.trackcaption.minX -
            this.offsetx +
            this.track_property.outLeft >
          0
            ? parseInt(
                e.pageX -
                  that.trackcaption.minX -
                  this.offsetx +
                  this.track_property.outLeft,
                10
              )
            : 0) *
            (this.slidernum.max - this.track_property.ratio),
          10
        )
      const end = that.chunk.track_end - that.chunk.track_start + start
      let mode
      if (this.move) {
        if (this.activechunk.state === 'moveing') {
          mode = 0
        }
        if (this.activechunk.state === 'moveing1') {
          mode = 2
        }
        this.Post({
          type: 'caption',
          data: {
            cmd: 'move',
            chunk_id: that.chunk.chunk_id,
            track_start: start,
            track_end: end,
            mode: mode
          },
          success(res) {
            that.changeLoading(function() {
              that.move = false
            })
          },
          error(res) {
            console.log(res)
            that.move = false
            return
          }
        })
      }
      this.ACTIVE_CHUNK({ state: 'active', index: this.index })
    },
    dblclick() {
      this.CHANGE_CAPTIONSETSHOW(true)
      this.CHANGE_IS_REFRESH_CAPTION_SET_BS(true)
    },
    toLeft(e_para) {
      e_para.stopPropagation()
      let e = e_para
      this.chunkmove = 'left'
      if (e.touches) {
        e = e.touches[0]
      }
      // this.target = $('#'+this.chunk.chunk_id)
      // this.target.addClass('moveing').removeClass('active')
      this.oldpage = e.pageX
      this.oldleft = this.chunk.track_start
      // this.oldleft = parseFloat(this.target.css('left'))
      // this.oldright = parseFloat(this.target.css('width'))
      if (this.openway === 'pc') {
        $(document).bind('mousemove', this.toLeftmove)
        $(document).one('mouseup', this.toLeftup)
      }
    },
    toLeftmove(e_para) {
      let e = e_para
      if (this.chunkmove !== 'left') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const that = this
      if (this.activechunk.chunk.state !== 'moveing') {
        this.ACTIVE_CHUNK({ state: 'moveing', index: this.index })
      }

      // var left = ((this.oldleft-this.oldpage+e.pageX)>(this.oldleft+this.oldright-6)?(this.oldleft+this.oldright-6):(this.oldleft-this.oldpage+e.pageX))
      // _target = $('#'+this.chunk.chunk_id)
      let trackstart = parseInt(
        this.oldleft +
          (e.pageX - this.oldpage) *
            (this.slidernum.max - this.track_property.ratio),
        10
      )
      if (trackstart > this.chunk.track_end) {
        trackstart = this.chunk.track_end
      }
      if (that.index === 0) {
        if (trackstart >= 0) {
          this.chunk.track_start = trackstart
        } else {
          this.chunk.track_start = 0
        }
      } else {
        if (trackstart > that.chunks[that.index - 1].track_end) {
          this.chunk.track_start = trackstart
        } else {
          this.chunk.track_start = that.chunks[that.index - 1].track_end
        }
      }
    },
    toLeftup(e) {
      const that = this
      this.chunkmove = ''
      if (this.openway === 'pc') {
        $(this).unbind('mousemove')
      }
      this.ACTIVE_CHUNK({ state: 'active', index: this.index })

      that.flag = 0
      $.post(
        window.AQES.DOMAIN + '/api/caption',
        JSON.stringify({
          cmd: 'move',
          chunk_id: that.chunk.chunk_id,
          track_start: this.chunk.track_start,
          track_end: that.chunk.track_end
        }),
        function(res) {
          if (res.code !== 0) {
            console.log(res.msg)
          }
        },
        'json'
      )
    },
    toRight(e_para) {
      e_para.stopPropagation()
      this.chunkmove = 'right'
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      // this.target = $('#'+this.chunk.chunk_id)
      // this.target.addClass('moveing').removeClass('active')
      this.oldpage = e.pageX
      this.oldleft = this.chunk.track_end
      // this.oldleft = parseFloat(this.target.css('left'))
      // this.oldright = parseFloat(this.target.css('width'))
      if (this.openway === 'pc') {
        $(document).bind('mousemove', this.toRightmove)
        $(document).one('mouseup', this.toRightup)
      }
    },
    toRightmove(e_para) {
      if (this.chunkmove !== 'right') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      const that = this
      if (this.activechunk.chunk.state !== 'moveing') {
        this.ACTIVE_CHUNK({ state: 'moveing', index: this.index })
      }

      // var left = ((this.oldleft-this.oldpage+e.pageX)>(this.oldleft+this.oldright-6)?(this.oldleft+this.oldright-6):(this.oldleft-this.oldpage+e.pageX))
      // _target = $('#'+this.chunk.chunk_id)
      let trackstart = parseInt(
        this.oldleft +
          (e.pageX - this.oldpage) *
            (this.slidernum.max - this.track_property.ratio),
        10
      )
      if (trackstart < this.chunk.track_start) {
        trackstart = this.chunk.track_start
      }
      if (that.index === this.chunks.length - 1) {
        this.chunk.track_end = trackstart
      } else {
        if (trackstart > that.chunks[that.index + 1].track_start) {
          this.chunk.track_end = that.chunks[that.index + 1].track_start
        } else {
          this.chunk.track_end = trackstart
        }
      }
    },
    toRightup(e) {
      const that = this
      this.chunkmove = ''
      if (this.openway === 'pc') {
        $(this).unbind('mousemove')
      }
      this.ACTIVE_CHUNK({ state: 'active', index: this.index })

      that.flag = 0
      $.post(
        window.AQES.DOMAIN + '/api/caption',
        JSON.stringify({
          cmd: 'move',
          chunk_id: that.chunk.chunk_id,
          track_start: this.chunk.track_start,
          track_end: that.chunk.track_end
        }),
        function(res) {
          if (res.code !== 0) {
            console.log(res.msg)
          }
        },
        'json'
      )
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
      while (
        parent &&
        parent.tagName.toUpperCase() !== 'BODY' &&
        parent.tagName.toUpperCase() !== 'HTML'
      ) {
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
    }
  }
}
</script>
<style></style>
