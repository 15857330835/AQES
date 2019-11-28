<template>
  <div
    class="mosaicBoxs"
    id="mosaicBoxs"
    @mousedown="openway == 'pc' ? addMosaicdown($event) : temp()"
    @touchstart="addMosaicdown"
    @touchmove="addMosaicmove"
    @touchend="addMosaicup"
  >
    <div
      v-for="([keys, value], index) in Object.entries(
        this.filterList.mosaic
      ).filter(item => item[1].parameter.disable === 0)"
      class="mosaicBox"
      :class="key == keys ? 'active' : ''"
      @mousedown="openway == 'pc' ? filterMousedown($event, keys) : temp()"
      @blur="filterBlur()"
      @touchstart="filterMousedown($event, keys)"
      @touchmove="filterMousemove($event, keys)"
      @touchend="filterMouseup($event, keys)"
      :key="'mosaic' + index"
      :style="{
        width: value.parameter.w + '%',
        top: value.parameter.top + '%',
        height: value.parameter.h + '%',
        left: value.parameter.left + '%'
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
      <div
        class="u-icon delMosaic"
        :class="(value.parameter.top * h) / 100 > 20 ? 'top' : 'bottom'"
        @mousedown="delFilter(keys, $event)"
        @touchstart="delFilter(keys, $event)"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'
import { chunkUpdateFilterApi, chunkAddFilterApi } from '@/api/Chunk'
export default {
  data: function() {
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
      boxsX: 0,
      boxsY: 0,
      bili: 0,
      key: 0,
      num: 0,
      mosaicmove: ''
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
      'mosaicKey',
      'systemmessage',
      'propertyNum',
      'openway'
    ]),
    filterList: function() {
      // 格式化滤镜数据
      const filter = this.activechunk.chunk.filter
      const data = {}
      for (let i = 0; i < filter.length; i++) {
        if (!filter[i]) continue
        switch (filter[i].service) {
          // case 'mirror':{
          //     if(!data.mirror){
          //         data.mirror = {}
          //         data.mirror[i] = filter[i]
          //     }else{
          //         data.mirror[i] = filter[i]
          //     }
          //     break;
          // }
          case 'mosaic': {
            if (!data.mosaic) {
              data.mosaic = {}
              data.mosaic[i] = filter[i]
            } else {
              data.mosaic[i] = filter[i]
            }
            break
          }
          case 'fastblur': {
            // debugger
            if (!data.mosaic) {
              data.mosaic = {}
              data.mosaic[i] = filter[i]
            } else {
              data.mosaic[i] = filter[i]
            }
            break
          }
          // default:{
          //    data[filter[i].service] = filter[i]
          // }
          default: {
            console.log('no such filter case')
          }
        }
      }
      return data
    }
  },
  watch: {
    mosaicKey: function(n) {
      this.key = n
    }
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'ACTIVE_CHUNK',
      'CHANGE_FILTERSHOW',
      'SET_CHANGE_FILTERSHOW_KEY'
    ]),
    // eslint-disable-next-line no-empty-function
    temp() {},
    delFilter: function(key, e) {
      e.preventDefault()
      e.stopPropagation()
      this.SET_CHANGE_FILTERSHOW_KEY(null)
      this.activechunk.chunk.filter[key].parameter.disable = 1
      this.sendmessage()
    },
    addMosaicdown: function(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.key = null
      this.num = 0
      this.SET_CHANGE_FILTERSHOW_KEY(null)
      this.mosaicmove = 'add'
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.boxsX = this.getElementPos('mosaicBoxs').x
      this.boxsY = this.getElementPos('mosaicBoxs').y
      // for(var i = 0;i<this.activechunk.chunk.filter.length;i++){
      //     if(this.activechunk.chunk.filter[i].service =='mosaic'&&this.activechunk.chunk.filter[i].parameter.disable ==1){
      //         this.key = i;
      //         this.activechunk.chunk.filter[i].parameter = {
      //         "w": 0,//区域宽百分比
      //         "h": 0,//区域高百分比
      //         "left": 100 * (e.pageX - this.boxsX) / this.w,//区域左边距离百分比
      //         "top": 100 * (e.pageY- this.boxsY) / this.h,//区域上边记录百分比
      //         "disable": 0//是否禁用滤镜
      //     }
      //      this.num++;
      //     }
      // }
      for (const i in this.filterList.mosaic) {
        if (
          this.filterList.mosaic[i].service === this.filtershow &&
          this.filterList.mosaic[i].parameter.disable === 1
        ) {
          this.key = i
          const v = this.filterList.mosaic[i].parameter.v
            ? this.filterList.mosaic[i].parameter.v
            : 40
          this.activechunk.chunk.filter[i].parameter = {
            w: 0, // 区域宽百分比
            h: 0, // 区域高百分比
            v: v,
            left: (100 * (e.pageX - this.boxsX)) / this.w, // 区域左边距离百分比
            top: (100 * (e.pageY - this.boxsY)) / this.h, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
          this.num++
        }
      }
      if (this.num === 0 && this.filtershow === 'mosaic') {
        this.key = this.activechunk.chunk.filter.length
        this.activechunk.chunk.filter.push({
          service: 'mosaic',
          name: '马赛克',
          type: 1,
          parameter: {
            w: 0, // 区域宽百分比
            h: 0, // 区域高百分比
            left: (100 * (e.pageX - this.boxsX)) / this.w, // 区域左边距离百分比
            top: (100 * (e.pageY - this.boxsY)) / this.h, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
        })
      } else if (this.num === 0 && this.filtershow === 'fastblur') {
        this.key = this.activechunk.chunk.filter.length
        this.activechunk.chunk.filter.push({
          service: 'fastblur',
          name: '快速模糊',
          type: 1,
          parameter: {
            w: 0, // 区域宽百分比
            h: 0, // 区域高百分比
            v: 40, // 模糊量
            left: (100 * (e.pageX - this.boxsX)) / this.w, // 区域左边距离百分比
            top: (100 * (e.pageY - this.boxsY)) / this.h, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
        })
      }
      if (this.key) {
        this.SET_CHANGE_FILTERSHOW_KEY(this.key)
      }
      if (this.openway === 'pc') {
        $(document).bind('mousemove.mosaicBoxs', this.addMosaicmove)
        $(document).one('mouseup.mosaicBoxs', this.addMosaicup)
      }
    },
    addMosaicmove: function(e_para) {
      if (this.mosaicmove !== 'add') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      if (!this.key) return
      this.activechunk.chunk.filter[this.key].parameter.w =
        (100 * (e.pageX - this.boxsX)) / this.w -
        this.activechunk.chunk.filter[this.key].parameter.left
      if (this.activechunk.chunk.filter[this.key].parameter.w < 0) {
        this.activechunk.chunk.filter[this.key].parameter.w = 0
      }
      if (
        this.activechunk.chunk.filter[this.key].parameter.left +
          this.activechunk.chunk.filter[this.key].parameter.w >
        100
      ) {
        this.activechunk.chunk.filter[this.key].parameter.w =
          100 - this.activechunk.chunk.filter[this.key].parameter.left
      }
      this.activechunk.chunk.filter[this.key].parameter.h =
        (100 * (e.pageY - this.boxsY)) / this.h -
        this.activechunk.chunk.filter[this.key].parameter.top
      if (this.activechunk.chunk.filter[this.key].parameter.h < 0) {
        this.activechunk.chunk.filter[this.key].parameter.h = 0
      }
      if (
        this.activechunk.chunk.filter[this.key].parameter.top +
          this.activechunk.chunk.filter[this.key].parameter.h >
        100
      ) {
        this.activechunk.chunk.filter[this.key].parameter.h =
          100 - this.activechunk.chunk.filter[this.key].parameter.top
      }
    },
    addMosaicup: function(e) {
      // this.sendmessage()
      this.mosaicmove = ''
      if (this.num === 0) {
        this.addFilterWay(this.activechunk.chunk.filter[this.key])
      } else if (this.key) {
        this.sendmessage()
      }

      if (!e.touches) {
        $(document).unbind('.mosaicBoxs')
      }
    },
    getElementPos: function(elementId) {
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
    mousedown_drag: function(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.boxsX = this.getElementPos('mosaicBoxs').x
      this.boxsY = this.getElementPos('mosaicBoxs').y
      // $(document).bind('keydown.drag',this.keydown_box)
      this.mosaicmove = e.target.getAttribute('name')
      $(document).bind(
        'mousemove.drag',
        this['mousemove_drag_' + e.target.getAttribute('name')]
      )
      $(document).bind('mouseup.drag', this.mouseup_drag)
    },
    mousemove_drag_e: function(e_para) {
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      if (this.mosaicmove !== 'e') {
        return
      }
      this.activechunk.chunk.filter[this.key].parameter.w =
        (100 * (e.pageX - this.boxsX)) / this.w -
        this.activechunk.chunk.filter[this.key].parameter.left
      if (this.activechunk.chunk.filter[this.key].parameter.w < 0) {
        this.activechunk.chunk.filter[this.key].parameter.w = 0
      }
      if (
        this.activechunk.chunk.filter[this.key].parameter.left +
          this.activechunk.chunk.filter[this.key].parameter.w >
        100
      ) {
        this.activechunk.chunk.filter[this.key].parameter.w =
          100 - this.activechunk.chunk.filter[this.key].parameter.left
      }
    },
    mousemove_drag_s: function(e_para) {
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      if (this.mosaicmove !== 's') {
        return
      }

      this.activechunk.chunk.filter[this.key].parameter.h =
        (100 * (e.pageY - this.boxsY)) / this.h -
        this.activechunk.chunk.filter[this.key].parameter.top
      if (this.activechunk.chunk.filter[this.key].parameter.h < 0) {
        this.activechunk.chunk.filter[this.key].parameter.h = 0
      }
      if (
        this.activechunk.chunk.filter[this.key].parameter.top +
          this.activechunk.chunk.filter[this.key].parameter.h >
        100
      ) {
        this.activechunk.chunk.filter[this.key].parameter.h =
          100 - this.activechunk.chunk.filter[this.key].parameter.top
      }
    },
    mousemove_drag_w: function(e_para) {
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      if (this.mosaicmove !== 'w') {
        return
      }

      const all =
        this.activechunk.chunk.filter[this.key].parameter.left +
        this.activechunk.chunk.filter[this.key].parameter.w
      this.activechunk.chunk.filter[this.key].parameter.left =
        (100 * (e.pageX - this.boxsX)) / this.w
      if (this.activechunk.chunk.filter[this.key].parameter.left < 0) {
        this.activechunk.chunk.filter[this.key].parameter.left = 0
      }
      if (this.activechunk.chunk.filter[this.key].parameter.left > all) {
        this.activechunk.chunk.filter[this.key].parameter.left = all
      }
      this.activechunk.chunk.filter[this.key].parameter.w =
        all - this.activechunk.chunk.filter[this.key].parameter.left
    },
    mousemove_drag_n: function(e_para) {
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      if (this.mosaicmove !== 'n') {
        return
      }

      const all =
        this.activechunk.chunk.filter[this.key].parameter.top +
        this.activechunk.chunk.filter[this.key].parameter.h
      this.activechunk.chunk.filter[this.key].parameter.top =
        (100 * (e.pageY - this.boxsY)) / this.h
      if (this.activechunk.chunk.filter[this.key].parameter.top < 0) {
        this.activechunk.chunk.filter[this.key].parameter.top = 0
      }
      if (this.activechunk.chunk.filter[this.key].parameter.top > all) {
        this.activechunk.chunk.filter[this.key].parameter.top = all
      }
      this.activechunk.chunk.filter[this.key].parameter.h =
        all - this.activechunk.chunk.filter[this.key].parameter.top
    },
    mouseup_drag: function() {
      // eslint-disable-next-line no-unused-expressions
      this.mosaicmove === ''
      this.sendmessage()
      $(document).unbind('.drag')
    },
    filterMousedown: function(e_para, key) {
      e_para.preventDefault()
      e_para.stopPropagation()
      this.mosaicmove = 'move'
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.key = key
      if (this.openway === 'pc') {
        $(document).bind('mousemove.mosaicBox', this.filterMousemove)
        $(document).bind('mouseup.mosaicBox', this.filterMouseup)
      }
      this.SET_CHANGE_FILTERSHOW_KEY(key)
      if (this.activechunk.chunk.filter[key].service !== this.filtershow) {
        this.CHANGE_FILTERSHOW(this.activechunk.chunk.filter[key].service)
      }
      // console.log(key)
      // if(this.activechunk.chunk.filter[key].service != this.filtershow){
      //     let filter = {
      //         "service": this.filtershow,
      //         "name": this.filtershow == 'fastblur'?"快速模糊":"马赛克",
      //         "type": 1,
      //         "parameter": {
      //             "w":    this.activechunk.chunk.filter[key].parameter.w,//区域宽百分比
      //             "h":    this.activechunk.chunk.filter[key].parameter.h,//区域高百分比
      //             "v":    this.activechunk.chunk.filter[key].parameter.v?this.activechunk.chunk.filter[key].parameter.v:100,//模糊量
      //             "left": this.activechunk.chunk.filter[key].parameter.left,//区域左边距离百分比
      //             "top":  this.activechunk.chunk.filter[key].parameter.top,//区域上边记录百分比
      //             "disable": 0//是否禁用滤镜
      //         }
      //     }
      //     this.activechunk.chunk.filter[key] = filter
      //     // this.sendmessage()
      // }
    },
    filterBlur: function() {
      this.SET_CHANGE_FILTERSHOW_KEY(null)
    },
    filterMousemove: function(e_para) {
      if (this.mosaicmove !== 'move') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.activechunk.chunk.filter[this.key].parameter.left +=
        (100 * (e.pageX - this.ePosx)) / this.w
      if (this.activechunk.chunk.filter[this.key].parameter.left < 0) {
        this.activechunk.chunk.filter[this.key].parameter.left = 0
      }
      if (
        this.activechunk.chunk.filter[this.key].parameter.left +
          this.activechunk.chunk.filter[this.key].parameter.w >
        100
      ) {
        this.activechunk.chunk.filter[this.key].parameter.left =
          100 - this.activechunk.chunk.filter[this.key].parameter.w
      }
      this.activechunk.chunk.filter[this.key].parameter.top +=
        (100 * (e.pageY - this.ePosy)) / this.h
      if (this.activechunk.chunk.filter[this.key].parameter.top < 0) {
        this.activechunk.chunk.filter[this.key].parameter.top = 0
      }
      if (
        this.activechunk.chunk.filter[this.key].parameter.top +
          this.activechunk.chunk.filter[this.key].parameter.h >
        100
      ) {
        this.activechunk.chunk.filter[this.key].parameter.top =
          100 - this.activechunk.chunk.filter[this.key].parameter.h
      }
      this.ePosx = e.pageX
      this.ePosy = e.pageY
    },
    filterMouseup: function(e) {
      e.preventDefault()
      e.stopPropagation()
      this.mosaicmove = ''
      this.sendmessage()
      if (!e.touches) {
        $(document).unbind('.mosaicBox')
      }
    },
    async sendmessage() {
      if (
        this.activechunk.chunk.filter[this.key].parameter.w === 0 ||
        this.activechunk.chunk.filter[this.key].parameter.h === 0
      ) {
        this.activechunk.chunk.filter[this.key].parameter.disable = 1
        this.SET_CHANGE_FILTERSHOW_KEY(null)
        this.ACTIVE_CHUNK({ chunk: this.activechunk.chunk })
      } else {
        this.ACTIVE_CHUNK({ chunk: this.activechunk.chunk })
        const res = await chunkUpdateFilterApi({
          chunk_id: this.activechunk.chunk.chunk_id,
          property: this.activechunk.chunk.filter
        })
        if (res.code !== 0) {
          console.warn(res.msg)
        }
      }
    },
    async addFilterWay(obj) {
      if (
        this.activechunk.chunk.filter[this.key].parameter.w === 0 ||
        this.activechunk.chunk.filter[this.key].parameter.h === 0
      ) {
        delete this.activechunk.chunk.filter[this.key]
        this.SET_CHANGE_FILTERSHOW_KEY(null)
        this.ACTIVE_CHUNK({ chunk: this.activechunk.chunk })
      } else {
        this.ACTIVE_CHUNK({ chunk: this.activechunk.chunk })
        const res = await chunkAddFilterApi({
          chunk_id: this.activechunk.chunk.chunk_id,
          filter: obj
        })
        if (res.code !== 0) {
          console.warn(res.msg)
        }
      }
    }
  }
}
</script>

<style></style>
