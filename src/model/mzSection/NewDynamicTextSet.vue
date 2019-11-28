<template>
  <div
    class="operate"
    :style="{ left, top, height, width }"
    @mousedown.stop="mousedownDrag($event)"
  >
    <div
      class="scale scale-nw"
      @mousedown.stop="mousedownEqualRatio($event, 'nw')"
    ></div>
    <div
      class="scale scale-ne"
      @mousedown.stop="mousedownEqualRatio($event, 'ne')"
    ></div>
    <div
      class="scale scale-sw"
      @mousedown.stop="mousedownEqualRatio($event, 'sw')"
    ></div>
    <div
      class="scale scale-se"
      @mousedown.stop="mousedownEqualRatio($event, 'se')"
    ></div>
    <!-- <div class="scale scale-n" @mousedown.stop="mousedownEqualRatio($event, 'n')"></div>
    <div class="scale scale-e" @mousedown.stop="mousedownEqualRatio($event, 'e')"></div>
    <div class="scale scale-s" @mousedown.stop="mousedownEqualRatio($event, 's')"></div>
    <div class="scale scale-w" @mousedown.stop="mousedownEqualRatio($event, 'w')"></div> -->
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  data() {
    return {
      parameter: null,
      videoplayerHeight: 0,
      videoplayerWidth: 0
    }
  },
  computed: {
    ...mapState(['activechunk', 'activeProperty', 'isAsyncSetchart', 'scale']),
    left() {
      if (this.parameter.geometry_left !== null) {
        return this.parameter.geometry_left + '%'
      } else {
        return 50 - this.parameter.geometry_w / 2 + '%'
      }
    },
    top() {
      return this.parameter.geometry_top + '%'
    },
    width() {
      // console.log(this.parameter.geometry_w+'%');
      return this.parameter.geometry_w + '%'
    },
    height() {
      return this.parameter.geometry_h + '%'
    }
  },
  created() {
    this.parameter = this.activechunk.chunk.template_parameter
    this.SET_SCALE(this.parameter.geometry_w / this.parameter.geometry_h)
    this.videoplayerHeight = document.getElementById('videobackg').offsetHeight
    this.videoplayerWidth = document.getElementById('videobackg').offsetWidth
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['SET_SCALE']),
    mousedown(downEvent, mark) {
      // 宽高不等比

      const startX = downEvent.clientX
      const startY = downEvent.clientY
      const height = this.parameter.geometry_h / 100
      const width = this.parameter.geometry_w / 100
      const top = this.parameter.geometry_top / 100
      const left =
        (this.parameter.geometry_left || 50 - this.parameter.geometry_w / 2) /
        100
      this.videoplayerHeight = document.getElementById(
        'videobackg'
      ).offsetHeight
      this.videoplayerWidth = document.getElementById('videobackg').offsetWidth
      const move = moveEvent => {
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        const disY = currY - startY
        const disX = currX - startX
        const hasN = /n/.test(mark)
        const hasS = /s/.test(mark)
        const hasW = /w/.test(mark)
        const hasE = /e/.test(mark)
        const newHeight =
          height + (hasN ? -disY : hasS ? disY : 0) / this.videoplayerHeight
        const newWidth =
          width + (hasW ? -disX : hasE ? disX : 0) / this.videoplayerWidth

        this.parameter.geometry_h = (newHeight > 0 ? newHeight : 0) * 100
        this.parameter.geometry_w = (newWidth > 0 ? newWidth : 0) * 100

        const _top = top + (hasN ? disY : 0) / this.videoplayerHeight
        this.parameter.geometry_top =
          (_top < top + height ? _top : top + height) * 100
        const _left = left + (hasW ? disX : 0) / this.videoplayerWidth
        this.parameter.geometry_left =
          (_left < left + width ? _left : left + width) * 100
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        this.sendmessage()
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    mousedownEqualRatio(downEvent, mark) {
      // 宽高等比

      // const startX = downEvent.clientX
      const startY = downEvent.clientY
      const height = this.parameter.geometry_h / 100
      const width = this.parameter.geometry_w / 100
      const top = this.parameter.geometry_top / 100
      const left =
        (this.parameter.geometry_left || 50 - this.parameter.geometry_w / 2) /
        100
      this.videoplayerHeight = document.getElementById(
        'videobackg'
      ).offsetHeight
      this.videoplayerWidth = document.getElementById('videobackg').offsetWidth
      const move = moveEvent => {
        // let currX = moveEvent.clientX;
        const currY = moveEvent.clientY
        const disY = currY - startY
        // let disX = currX - startX;
        let newHeight, newWidth, newLeft, newTop
        const totalHeight = this.videoplayerHeight
        if (mark === 'nw') {
          newHeight = height - disY / totalHeight
          newWidth = newHeight * this.scale
          newTop = top + height - newHeight
          newLeft = left + width - newWidth
        } else if (mark === 'ne') {
          newHeight = height - disY / totalHeight
          newWidth = newHeight * this.scale
          newTop = top + height - newHeight
          newLeft = left
        } else if (mark === 'sw') {
          newHeight = height + disY / totalHeight
          newWidth = newHeight * this.scale
          newTop = top
          newLeft = left + width - newWidth
        } else if (mark === 'se') {
          newHeight = height + disY / totalHeight
          newWidth = newHeight * this.scale
          newTop = top
          newLeft = left
        }
        newLeft = Math.min(left + width, newLeft)
        newTop = Math.min(top + height, newTop)
        this.parameter.geometry_h = newHeight * 100
        this.parameter.geometry_w = newWidth * 100
        if (this.parameter.geometry_w > 100) this.parameter.geometry_w = 100
        this.parameter.geometry_left = newLeft * 100
        this.parameter.geometry_top = newTop * 100
      }
      const up = () => {
        this.sendmessage(async res => {
          if (res && res.code === 0) {
            const newChunk = await this.getChunkInfo(
              this.activechunk.chunk.chunk_id
            )
            this.parameter.geometry_w =
              newChunk.data.template_parameter.geometry_w
            this.SET_SCALE(
              this.parameter.geometry_w / this.parameter.geometry_h
            )
          } else {
            console.log('update_template_parameter 故障')
          }
        })

        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    mousedownDrag(downEvent) {
      const startX = downEvent.clientX
      const startY = downEvent.clientY
      // const height = this.parameter.geometry_h / 100
      // const width = this.parameter.geometry_w / 100
      const top = this.parameter.geometry_top / 100
      const left =
        (this.parameter.geometry_left || 50 - this.parameter.geometry_w / 2) /
        100
      this.videoplayerHeight = document.getElementById(
        'videobackg'
      ).offsetHeight
      this.videoplayerWidth = document.getElementById('videobackg').offsetWidth
      const move = moveEvent => {
        const currX = moveEvent.clientX
        const currY = moveEvent.clientY
        const disY = currY - startY
        const disX = currX - startX
        const totalHeight = this.videoplayerHeight
        const totalWidth = this.videoplayerWidth
        const newTop = top + disY / totalHeight
        const newLeft = left + disX / totalWidth
        this.parameter.geometry_left = newLeft * 100
        this.parameter.geometry_top = newTop * 100
      }
      const up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mouseup', up)
        this.sendmessage()
      }
      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    },
    getChunkInfo(id) {
      return this.$axios.post(
        window.NCES.DOMAIN + '/api/chunk',
        JSON.stringify({
          cmd: 'get',
          chunk_id: id
        })
      )
    },
    sendmessage: function(onSuccess) {
      const that = this
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_template_parameter',
        chunk_id: this.activechunk.chunk.chunk_id,
        property: this.parameter
      }
      data.success = onSuccess
      data.error = function() {
        that.$notify({
          title: '提示',
          type: 'error',
          message: '操作失败！',
          position: 'bottom-right',
          duration: that.notify.time
        })
      }
      this.Post(data)
    }
  }
  // watch: {
  //   "element.height": {
  //     handler(newValue, oldValue) {},
  //     deep: true,
  //     immediate: true
  //   },
  //   "element.width": {
  //     handler(newValue, oldValue) {},
  //     deep: true,
  //     immediate: true
  //   }
  // }
}
</script>
<style lang="scss" scoped>
.operate {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px dashed #000;
  cursor: move;

  .scale {
    position: absolute;
    background: #fff;
    border: 1px solid #000;
    box-shadow: 0px 0px 10px #c2c2c2;
    width: 7px;
    height: 7px;
    z-index: 1;
  }

  .scale-nw {
    top: -3.5px;
    left: -3.5px;
    cursor: nw-resize;
    border-radius: 50%;
  }

  .scale-ne {
    top: -3.5px;
    right: -3.5px;
    cursor: ne-resize;
    border-radius: 50%;
  }

  .scale-sw {
    bottom: -3.5px;
    left: -3.5px;
    cursor: sw-resize;
    border-radius: 50%;
  }

  .scale-se {
    bottom: -3.5px;
    right: -3.5px;
    cursor: se-resize;
    border-radius: 50%;
  }

  .scale-n {
    top: -3.5px;
    left: 50%;
    margin-left: -3.5px;
    cursor: n-resize;
  }

  .scale-e {
    right: -3px;
    top: 50%;
    margin-top: -3.5px;
    cursor: e-resize;
  }

  .scale-s {
    bottom: -3px;
    left: 50%;
    margin-left: -3.5px;
    cursor: s-resize;
  }

  .scale-w {
    left: -3.5px;
    top: 50%;
    margin-top: -3.5px;
    cursor: w-resize;
  }
}
</style>
