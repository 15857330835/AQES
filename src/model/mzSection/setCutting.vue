<template>
  <div class="mosaicBoxs" style="cursor:auto">
    <div
      class="mosaicBox active"
      @mousedown="openway == 'pc' ? filterMousedown($event) : temp()"
      @touchstart="filterMousedown"
      @touchmove="filterMousemove"
      @touchend="filterMouseup"
      :style="{
        width: this.filterList.cutting.parameter.w * 2 * 100 + '%',
        height: this.filterList.cutting.parameter.h * 2 * 100 + '%',
        top:
          (this.filterList.cutting.parameter.top -
            this.filterList.cutting.parameter.h) *
            100 +
          '%',
        left:
          (this.filterList.cutting.parameter.left -
            this.filterList.cutting.parameter.w) *
            100 +
          '%'
      }"
    >
      <div
        :style="{
          position: 'absolute',
          left: 0,
          top: 0,
          height: '5px',
          width: '100%',
          cursor: 'n-resize'
        }"
        @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
        @touchstart="mousedown_drag"
        @touchmove="mousemove_drag_n"
        @touchend="mouseup_drag"
        name="n"
      ></div>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '100%',
          width: '5px',
          cursor: 'w-resize'
        }"
        @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
        @touchstart="mousedown_drag"
        @touchmove="mousemove_drag_w"
        @touchend="mouseup_drag"
        name="w"
      ></div>
      <div
        :style="{
          position: 'absolute',
          left: 0,
          bottom: 0,
          height: '5px',
          width: '100%',
          cursor: 's-resize'
        }"
        @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
        @touchstart="mousedown_drag"
        @touchmove="mousemove_drag_s"
        @touchend="mouseup_drag"
        name="s"
      ></div>
      <div
        :style="{
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          width: '5px',
          cursor: 'e-resize'
        }"
        @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
        @touchstart="mousedown_drag"
        @touchmove="mousemove_drag_e"
        @touchend="mouseup_drag"
        name="e"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return {
      w: 0,
      h: 0,
      x1: 0,
      y1: 0,
      x2: 0,
      y2: 0,
      ePosx: 0,
      ePosy: 0,
      offsetX: 0,
      offsetY: 0,
      keyMove: false, // 控制键盘移动的开关
      downbox: '',
      flag: 1,
      arr: [],
      O: 1,
      img: '',
      timer: '',
      bili: 1,
      changeWay: true,
      filtermove: ''
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum',
      'openway'
    ]),
    filterList() {
      // 格式化滤镜数据
      const filter = this.activechunk.chunk.filter
      const data = {}
      for (let i = 0; i < filter.length; i++) {
        switch (filter[i].service) {
          case 'mirror': {
            if (!data.mirror) {
              data.mirror = {}
              data.mirror[i] = filter[i]
            } else {
              data.mirror[i] = filter[i]
            }
            break
          }
          case 'mosaic': {
            if (!data.mosaic) {
              data.mosaic = {}
              data.mosaic[i] = filter[i]
            } else {
              data.mosaic[i] = filter[i]
            }
            break
          }
          default: {
            data[filter[i].service] = filter[i]
          }
        }
      }
      return data
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW'
    ]),
    // eslint-disable-next-line no-empty-function
    temp() {},
    filterMousedown(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      this.filtermove = 'all'
      if (e.touches) {
        e = e.touches[0]
      }
      // if(!$(event.currentTarget).hasClass('active')){
      //     return
      // }
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      if (this.openway === 'pc') {
        $(document).bind('mousemove.mosaicBox', this.filterMousemove)
        $(document).bind('mouseup.mosaicBox', this.filterMouseup)
      }
    },
    filterMousemove(e_para) {
      if (this.filtermove !== 'all') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.filterList.cutting.parameter.left += (e.pageX - this.ePosx) / this.w
      if (
        this.filterList.cutting.parameter.left <
        this.filterList.cutting.parameter.w
      ) {
        this.filterList.cutting.parameter.left = this.filterList.cutting.parameter.w
      }
      if (
        this.filterList.cutting.parameter.left +
          this.filterList.cutting.parameter.w >
        1
      ) {
        this.filterList.cutting.parameter.left =
          1 - this.filterList.cutting.parameter.w
      }
      this.filterList.cutting.parameter.top +=
        (1 * (e.pageY - this.ePosy)) / this.h
      if (
        this.filterList.cutting.parameter.top <
        this.filterList.cutting.parameter.h
      ) {
        this.filterList.cutting.parameter.top = this.filterList.cutting.parameter.h
      }
      if (
        this.filterList.cutting.parameter.top +
          this.filterList.cutting.parameter.h >
        1
      ) {
        this.filterList.cutting.parameter.top =
          1 - this.filterList.cutting.parameter.h
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
    },
    filterMouseup(e) {
      this.filtermove = ''
      this.sendmessage()
      if (!e.touches) {
        $(document).unbind('.mosaicBox')
      }
    },
    mousedown_drag(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.filtermove = e.target.getAttribute('name')
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      if (this.openway === 'pc') {
        $(document).bind(
          'mousemove.drag',
          this['mousemove_drag_' + e.target.getAttribute('name')]
        )
        $(document).bind('mouseup.drag', this.mouseup_drag)
      }
    },
    mousemove_drag_e(e_para) {
      console.log('e')
      if (this.filtermove !== 'e') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.filterList.cutting.parameter.w += (e.pageX - this.ePosx) / this.w / 2
      this.filterList.cutting.parameter.left +=
        (e.pageX - this.ePosx) / this.w / 2
      if (this.filterList.cutting.parameter.w < 0) {
        this.filterList.cutting.parameter.left -= this.filterList.cutting.parameter.w
        this.filterList.cutting.parameter.w = 0
      }
      if (
        this.filterList.cutting.parameter.w +
          this.filterList.cutting.parameter.left >
        1
      ) {
        this.filterList.cutting.parameter.w -=
          (this.filterList.cutting.parameter.w +
            this.filterList.cutting.parameter.left -
            1) /
          2
        this.filterList.cutting.parameter.left =
          1 - this.filterList.cutting.parameter.w
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
    },
    mousemove_drag_s(e_para) {
      console.log('s')
      if (this.filtermove !== 's') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.filterList.cutting.parameter.h += (e.pageY - this.ePosy) / this.h / 2
      this.filterList.cutting.parameter.top +=
        (e.pageY - this.ePosy) / this.h / 2
      if (this.filterList.cutting.parameter.h < 0) {
        this.filterList.cutting.parameter.top -= this.filterList.cutting.parameter.h
        this.filterList.cutting.parameter.h = 0
      }
      if (
        this.filterList.cutting.parameter.h +
          this.filterList.cutting.parameter.top >
        1
      ) {
        this.filterList.cutting.parameter.h -=
          (this.filterList.cutting.parameter.h +
            this.filterList.cutting.parameter.top -
            1) /
          2
        this.filterList.cutting.parameter.top =
          1 - this.filterList.cutting.parameter.h
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
    },
    mousemove_drag_w(e_para) {
      console.log('w')
      if (this.filtermove !== 'w') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.filterList.cutting.parameter.w -= (e.pageX - this.ePosx) / this.w / 2
      this.filterList.cutting.parameter.left +=
        (e.pageX - this.ePosx) / this.w / 2
      if (
        this.filterList.cutting.parameter.left <
        this.filterList.cutting.parameter.w
      ) {
        this.filterList.cutting.parameter.w -=
          (this.filterList.cutting.parameter.w -
            this.filterList.cutting.parameter.left) /
          2
        this.filterList.cutting.parameter.left = this.filterList.cutting.parameter.w
      }
      if (this.filterList.cutting.parameter.w < 0) {
        this.filterList.cutting.parameter.left += this.filterList.cutting.parameter.w
        this.filterList.cutting.parameter.w = 0
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
    },
    mousemove_drag_n(e_para) {
      if (this.filtermove !== 'n') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.filterList.cutting.parameter.h -= (e.pageY - this.ePosy) / this.h / 2
      this.filterList.cutting.parameter.top +=
        (e.pageY - this.ePosy) / this.h / 2
      if (
        this.filterList.cutting.parameter.top <
        this.filterList.cutting.parameter.h
      ) {
        this.filterList.cutting.parameter.h -=
          (this.filterList.cutting.parameter.h -
            this.filterList.cutting.parameter.top) /
          2
        this.filterList.cutting.parameter.top = this.filterList.cutting.parameter.h
      }
      if (this.filterList.cutting.parameter.h < 0) {
        this.filterList.cutting.parameter.top += this.filterList.cutting.parameter.h
        this.filterList.cutting.parameter.h = 0
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
    },
    mouseup_drag(e) {
      this.filtermove = ''
      this.sendmessage()
      if (!e.touches) {
        $(document).unbind('.drag')
      }
    },
    sendmessage() {
      $.post(
        window.AQES.DOMAIN + '/api/chunk',
        JSON.stringify({
          cmd: 'update_filter',
          chunk_id: this.activechunk.chunk.chunk_id,
          property: this.activechunk.chunk.filter
        }),
        function(res) {
          if (res.code !== 0) {
            console.warn(res.msg)
          }
        },
        'json'
      )
    }
  }
}
</script>

<style></style>
