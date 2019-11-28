<template>
  <div
    class="boxx"
    style="width:100%;height:100%;top:0;left:0;position:absolute;cursor:move;overflow:hidden;"
    @mousedown="openway == 'pc' ? mousedown_box($event) : temp()"
    @touchstart="mousedown_box"
    @touchmove="mousemove_box"
    @touchend="mouseup_box"
  >
    <div
      :style="{
        position: 'absolute',
        left: this.left + '%',
        top: this.top + '%',
        width: this.width + '%',
        height: this.height + '%'
      }"
    >
      <div :style="{ position: 'absolute', width: '100%', height: '100%' }">
        <div
          :style="{
            position: 'absolute',
            left: 0,
            top: 0,
            height: '1px',
            width: '100%',
            backgroundColor: '#ccc'
          }"
        ></div>
        <div
          :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '100%',
            width: '1px',
            backgroundColor: '#ccc'
          }"
        ></div>
        <div
          :style="{
            position: 'absolute',
            left: 0,
            bottom: 0,
            height: '1px',
            width: '100%',
            backgroundColor: '#ccc'
          }"
        ></div>
        <div
          :style="{
            position: 'absolute',
            right: 0,
            top: 0,
            height: '100%',
            width: '1px',
            backgroundColor: '#ccc'
          }"
        ></div>
      </div>
      <div
        :style="{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0.5
        }"
      >
        <div
          :style="{
            position: 'absolute',
            left: 0,
            top: '3px',
            width: '100%',
            height: '7px',
            cursor: 's-resize'
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
            bottom: '3px',
            width: '100%',
            height: '7px',
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
            left: '3px',
            top: 0,
            width: '7px',
            height: '100%',
            cursor: 'w-resize'
          }"
          name="w"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_w"
          @touchend="mouseup_drag"
        ></div>
        <div
          :style="{
            position: 'absolute',
            right: '3px',
            top: 0,
            width: '7px',
            height: '100%',
            cursor: 'w-resize'
          }"
          name="e"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_e"
          @touchend="mouseup_drag"
        ></div>
        <div
          :style="{
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            left: 'calc(50% - 5px)',
            top: '-5px',
            width: '9px',
            height: '9px',
            cursor: 's-resize'
          }"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_n"
          @touchend="mouseup_drag"
          name="n"
        ></div>
        <div
          :style="{
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            left: 'calc(50% - 5px)',
            bottom: '-5px',
            width: '9px',
            height: '9px',
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
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            left: '-5px',
            top: 'calc(50% - 5px)',
            width: '9px',
            height: '9px',
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
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            right: '-5px',
            top: 'calc(50% - 5px)',
            width: '9px',
            height: '9px',
            cursor: 'w-resize'
          }"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_e"
          @touchend="mouseup_drag"
          name="e"
        ></div>
        <div
          :style="{
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            left: '-5px',
            top: '-5px',
            width: '9px',
            height: '9px',
            cursor: 'nw-resize'
          }"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_nw"
          @touchend="mouseup_drag"
          name="nw"
        ></div>
        <div
          :style="{
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            right: '-5px',
            top: '-5px',
            width: '9px',
            height: '9px',
            cursor: 'ne-resize'
          }"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_ne"
          @touchend="mouseup_drag"
          name="ne"
        ></div>
        <div
          :style="{
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            left: '-5px',
            bottom: '-5px',
            width: '9px',
            height: '9px',
            cursor: 'ne-resize'
          }"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_sw"
          @touchend="mouseup_drag"
          name="sw"
        ></div>
        <div
          :style="{
            border: '1px solid #eee',
            backgroundColor: '#333',
            position: 'absolute',
            right: '-5px',
            bottom: '-5px',
            width: '9px',
            height: '9px',
            cursor: 'nw-resize'
          }"
          @mousedown="openway == 'pc' ? mousedown_drag($event) : temp()"
          @touchstart="mousedown_drag"
          @touchmove="mousemove_drag_se"
          @touchend="mouseup_drag"
          name="se"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data: function() {
    return {
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
      w: 0,
      h: 0,
      O: 1,
      img: '',
      timer: '',
      // bili:(this.systemmessage.player.h / this.systemmessage.player.w).toFixed(2),
      changeWay: true,
      chunkmove: '',
      active: {},
      controlShow: true
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
      'openway',
      'newchartbili',
      'filterControlBoxShow'
    ]),
    // active:{
    //     get:function(){
    //         return this.activeProperty[this.propertyNum]
    //     },
    //     set:function(){

    //     }
    // },
    bili: function() {
      return this.newchartbili // 1 //(this.systemmessage.player.h / this.systemmessage.player.w).toFixed(2)
    },
    filterList: function() {
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
    },
    left() {
      return this.activeProperty[this.propertyNum]
        ? this.activeProperty[this.propertyNum].left
        : 0
    },
    right() {
      return this.activeProperty[this.propertyNum]
        ? this.activeProperty[this.propertyNum].right
        : 0
    },
    width() {
      return this.activeProperty[this.propertyNum]
        ? this.activeProperty[this.propertyNum].w
        : 0
    },
    height() {
      return this.activeProperty[this.propertyNum]
        ? this.activeProperty[this.propertyNum].h
        : 0
    },
    top() {
      return this.activeProperty[this.propertyNum]
        ? this.activeProperty[this.propertyNum].top
        : 0
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW',
      'CHANGE_ACTIVEPROPERTY',
      'SET_ASYNC_SET_CHART'
    ]),
    // eslint-disable-next-line no-empty-function
    temp() {},
    mousedown_box: function(e_para) {
      let e = e_para
      this.chunkmove = 'all'
      if (e.touches) {
        e = e.touches[0]
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      if (this.openway === 'pc') {
        $(document).bind('mousemove.boxx', this.mousemove_box)
        $(document).bind('mouseup.boxx', this.mouseup_box)
      }
    },
    mousemove_box: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'all') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      const height = $('.boxx').height()
      this.x1 = e.pageX - this.ePosx + this.x1
      this.y1 = e.pageY - this.ePosy + this.y1
      this.x2 = e.pageX - this.ePosx + this.x2
      this.y2 = e.pageY - this.ePosy + this.y2
      const active = this.activeProperty[this.propertyNum]
      active.left = ((e.pageX - this.ePosx) * 100) / width + active.left
      active.top = ((e.pageY - this.ePosy) * 100) / height + active.top
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mouseup_box: function(e) {
      this.chunkmove = ''
      this.sendmessage()
      if (!e.touches) {
        $(document).unbind('.boxx')
      }
    },
    mousedown_drag: function(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      this.SET_ASYNC_SET_CHART(false)
      if (e.touches) {
        e = e.touches[0]
      }
      this.chunkmove = e.target.getAttribute('name')
      this.offsetX = $('.boxx').offset().left
      this.offsetY = $('.boxx').offset().top
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.downbox = e.target
      if (this.openway) {
        $(document).bind(
          'mousemove.drag',
          this['mousemove_drag_' + e.target.getAttribute('name')]
        )
        $(document).bind('mouseup.drag', this.mouseup_drag)
        $(document).unbind('mousemove.boxx', this.mousemove_box)
        $(document).unbind('mouseup.boxx', this.mouseup_box)
      }
    },
    mousemove_drag_e: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'e') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      // const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      active.w =
        ((e.pageX - this.ePosx) * 100) / width + active.w < 0
          ? 0
          : ((e.pageX - this.ePosx) * 100) / width + active.w
      if (this.changeWay) {
        active.h = active.w / this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_s: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 's') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      // const width = $('.boxx').width()
      const height = $('.boxx').height()
      const variation = e.pageY - this.ePosy
      const active = this.activeProperty[this.propertyNum]
      // let nwDom = document.getElementsByName("nw")[0];
      active.h =
        (variation * 100) / height + active.h < 0
          ? 0
          : (variation * 100) / height + active.h
      if (this.changeWay) {
        active.w = active.h * this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      // active.left = active.left
      // active.top = active.top
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_w: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'w') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      // const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      const length = active.w + active.left
      active.w =
        ((this.ePosx - e.pageX) * 100) / width + active.w < 0
          ? 0
          : ((this.ePosx - e.pageX) * 100) / width + active.w
      active.left = length - active.w
      if (this.changeWay) {
        active.h = active.w / this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_n: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'n') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      // const width = $('.boxx').width()
      const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      const length = active.h + active.top
      active.h =
        ((this.ePosy - e.pageY) * 100) / height + active.h < 0
          ? 0
          : ((this.ePosy - e.pageY) * 100) / height + active.h
      active.top = length - active.h
      if (this.changeWay) {
        active.w = active.h * this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_se: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'se') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      if (!this.changeWay) {
        active.w =
          ((e.pageX - this.ePosx) * 100) / width + active.w < 0
            ? 0
            : ((e.pageX - this.ePosx) * 100) / width + active.w
        active.h =
          ((e.pageY - this.ePosy) * 100) / height + active.h < 0
            ? 0
            : ((e.pageY - this.ePosy) * 100) / height + active.h
        this.ePosx = e.pageX
        this.ePosy = e.pageY
        return
      }
      const w1 =
        ((e.pageX - this.offsetX) * 100) / width - active.left < 0
          ? 0
          : ((e.pageX - this.offsetX) * 100) / width - active.left
      const w2 =
        (((e.pageY - this.offsetY) * 100) / height - active.top < 0
          ? 0
          : ((e.pageY - this.offsetY) * 100) / height - active.top) * this.bili
      if (w1 > w2) {
        active.w =
          ((e.pageX - this.offsetX) * 100) / width - active.left < 0
            ? 0
            : ((e.pageX - this.offsetX) * 100) / width - active.left
        active.h = active.w / this.bili
      } else {
        active.h =
          ((e.pageY - this.offsetY) * 100) / height - active.top < 0
            ? 0
            : ((e.pageY - this.offsetY) * 100) / height - active.top
        active.w = active.h * this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_sw: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'sw') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      if (!this.changeWay) {
        active.w =
          ((e.pageX - this.ePosx) * 100) / width + active.w < 0
            ? 0
            : ((e.pageX - this.ePosx) * 100) / width + active.w
        active.h =
          ((e.pageY - this.ePosy) * 100) / height + active.h < 0
            ? 0
            : ((e.pageY - this.ePosy) * 100) / height + active.h
        this.ePosx = e.pageX
        this.ePosy = e.pageY
        return
      }
      const w1 =
        active.left + active.w - ((e.pageX - this.offsetX) * 100) / width < 0
          ? 0
          : active.left + active.w - ((e.pageX - this.offsetX) * 100) / width
      const w2 =
        (((e.pageY - this.offsetY) * 100) / height - active.top < 0
          ? 0
          : ((e.pageY - this.offsetY) * 100) / height - active.top) * this.bili
      if (w1 > w2) {
        active.w =
          active.left + active.w - ((e.pageX - this.offsetX) * 100) / width < 0
            ? 0
            : active.left + active.w - ((e.pageX - this.offsetX) * 100) / width
        active.left = ((e.pageX - this.offsetX) * 100) / width
        active.h = active.w / this.bili
      } else {
        active.h =
          ((e.pageY - this.offsetY) * 100) / height - active.top < 0
            ? 0
            : ((e.pageY - this.offsetY) * 100) / height - active.top
        active.left = active.left + active.w - active.h * this.bili
        active.w = active.h * this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_nw: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'nw') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      if (!this.changeWay) {
        active.w =
          ((e.pageX - this.ePosx) * 100) / width + active.w < 0
            ? 0
            : ((e.pageX - this.ePosx) * 100) / width + active.w
        active.h =
          ((e.pageY - this.ePosy) * 100) / height + active.h < 0
            ? 0
            : ((e.pageY - this.ePosy) * 100) / height + active.h
        this.ePosx = e.pageX
        this.ePosy = e.pageY
        return
      }
      const w1 =
        active.left + active.w - ((e.pageX - this.offsetX) * 100) / width < 0
          ? 0
          : active.left + active.w - ((e.pageX - this.offsetX) * 100) / width
      const w2 =
        (active.top + active.h - ((e.pageY - this.offsetY) * 100) / height < 0
          ? 0
          : active.top + active.h - ((e.pageY - this.offsetY) * 100) / height) *
        this.bili
      if (w1 > w2) {
        active.w =
          active.left + active.w - ((e.pageX - this.offsetX) * 100) / width < 0
            ? 0
            : active.left + active.w - ((e.pageX - this.offsetX) * 100) / width
        active.left = ((e.pageX - this.offsetX) * 100) / width
        active.top = active.h + active.top - active.w / this.bili
        active.h = active.w / this.bili
      } else {
        active.h =
          active.top + active.h - ((e.pageY - this.offsetY) * 100) / height < 0
            ? 0
            : active.top + active.h - ((e.pageY - this.offsetY) * 100) / height
        active.top = ((e.pageY - this.offsetY) * 100) / height
        active.left = active.left + active.w - active.h * this.bili
        active.w = active.h * this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mousemove_drag_ne: function(e_para) {
      let e = e_para
      if (this.chunkmove !== 'ne') {
        return
      }
      if (e.touches) {
        e = e.touches[0]
      }
      const width = $('.boxx').width()
      const height = $('.boxx').height()
      const active = this.activeProperty[this.propertyNum]
      if (!this.changeWay) {
        active.w =
          ((e.pageX - this.ePosx) * 100) / width + active.w < 0
            ? 0
            : ((e.pageX - this.ePosx) * 100) / width + active.w
        active.h =
          ((e.pageY - this.ePosy) * 100) / height + active.h < 0
            ? 0
            : ((e.pageY - this.ePosy) * 100) / height + active.h
        this.ePosx = e.pageX
        this.ePosy = e.pageY
        return
      }
      const w1 =
        ((e.pageX - this.offsetX) * 100) / width - active.left < 0
          ? 0
          : ((e.pageX - this.offsetX) * 100) / width - active.left
      const w2 =
        (active.top + active.h - ((e.pageY - this.offsetY) * 100) / height < 0
          ? 0
          : active.top + active.h - ((e.pageY - this.offsetY) * 100) / height) *
        this.bili
      if (w1 > w2) {
        active.w =
          ((e.pageX - this.offsetX) * 100) / width - active.left < 0
            ? 0
            : ((e.pageX - this.offsetX) * 100) / width - active.left
        active.top = active.h + active.top - active.w / this.bili
        active.h = active.w / this.bili
      } else {
        active.h =
          active.top + active.h - ((e.pageY - this.offsetY) * 100) / height < 0
            ? 0
            : active.top + active.h - ((e.pageY - this.offsetY) * 100) / height
        active.top = ((e.pageY - this.offsetY) * 100) / height
        active.w = active.h * this.bili
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.activeProperty[this.propertyNum] = active
    },
    mouseup_drag: function(e) {
      let temp = null
      this.chunkmove = ''
      if (!e.touches) {
        $(document).unbind('.drag')
      }
      this.flag = 1
      if (this.x1 > this.x2) {
        temp = this.x1
        this.x1 = this.x2
        this.x2 = temp
      }
      if (this.y1 > this.y2) {
        temp = this.y1
        this.y1 = this.y2
        this.y2 = temp
      }
      this.SET_ASYNC_SET_CHART(true)
      this.sendmessage()
    },
    sendmessage: function() {
      const geo_arr = this.activeProperty
      this.CHANGE_ACTIVEPROPERTY(geo_arr)
      let geo = ''
      for (let i = 0; i < geo_arr.length; i++) {
        const f = geo_arr[i]
        if (f.top < 0) {
          geo =
            geo +
            f.f +
            '=' +
            f.left +
            '%/' +
            f.top +
            '%:' +
            f.w +
            '%x' +
            f.h +
            '%:' +
            f.transparency +
            ';'
        } else {
          geo =
            geo +
            f.f +
            '=' +
            f.left +
            '%/' +
            f.top +
            '%:' +
            f.w +
            '%x' +
            f.h +
            '%:' +
            f.transparency +
            ';'
        }
      }
      const data = {}
      data.type = 'chunk'
      data.data = {
        cmd: 'update_property',
        chunk_id: this.activechunk.chunk.chunk_id,
        geometry: geo.substr(0, geo.length - 1)
      }
      this.Post(data)
    }
  },
  mounted: function() {
    // console.log('mounted')
  }
}
</script>

<style></style>
