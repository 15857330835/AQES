<template>
  <div
    class="mosaicBoxs"
    id="fastblurBoxs"
    @mousedown="openway == 'pc' ? addMosaicdown($event) : temp()"
    @touchstart="addMosaicdown"
    @touchmove="addMosaicmove"
    @touchend="addMosaicup"
  >
    <div
      v-for="([keys, value], index) in Object.entries(
        this.filterList.fastblur
      ).filter(item => item[1].parameter.disable === 0)"
      class="mosaicBox"
      :class="key == keys ? 'active' : ''"
      @mousedown="openway == 'pc' ? filterMousedown($event, keys) : temp()"
      @touchstart="filterMousedown($event, keys)"
      @touchmove="filterMousemove($event, keys)"
      @touchend="filterMouseup($event, keys)"
      :key="'fastblur' + index"
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
      'systemmessage',
      'propertyNum',
      'openway'
    ]),
    filterList() {
      // 格式化滤镜数据
      const filter = this.activechunk.chunk.filter
      // debugger
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
          case 'fastblur': {
            // debugger
            if (!data.fastblur) {
              data.fastblur = {}
              data.fastblur[i] = filter[i]
            } else {
              data.fastblur[i] = filter[i]
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
    delFilter(key, e) {
      e.preventDefault()
      e.stopPropagation()
      this.activechunk.chunk.filter[key].parameter.disable = 1
      this.sendmessage()
    },
    addMosaicdown(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.mosaicmove = 'add'
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.boxsX = this.getElementPos('fastblurBoxs').x
      this.boxsY = this.getElementPos('fastblurBoxs').y
      for (let i = 0; i < this.activechunk.chunk.filter.length; i++) {
        if (
          this.activechunk.chunk.filter[i].service === 'fastblur' &&
          this.activechunk.chunk.filter[i].parameter.disable === 1
        ) {
          this.key = i
          this.activechunk.chunk.filter[i].parameter = {
            w: 0, // 区域宽百分比
            h: 0, // 区域高百分比
            left: (100 * (e.pageX - this.boxsX)) / this.w, // 区域左边距离百分比
            top: (100 * (e.pageY - this.boxsY)) / this.h, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
          this.num++
        }
      }
      console.log(this.num)
      if (this.num === 0) {
        this.key = this.activechunk.chunk.filter.length
        this.activechunk.chunk.filter.push({
          service: 'fastblur',
          name: '快速模糊',
          type: 1,
          parameter: {
            w: 0, // 区域宽百分比
            h: 0, // 区域高百分比
            left: (100 * (e.pageX - this.boxsX)) / this.w, // 区域左边距离百分比
            top: (100 * (e.pageY - this.boxsY)) / this.h, // 区域上边记录百分比
            disable: 0 // 是否禁用滤镜
          }
        })
      }
      if (this.openway === 'pc') {
        $(document).bind('mousemove.mosaicBoxs', this.addMosaicmove)
        $(document).one('mouseup.mosaicBoxs', this.addMosaicup)
      }
    },
    addMosaicmove(e_para) {
      if (this.mosaicmove !== 'add') {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
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
    addMosaicup(e) {
      // this.sendmessage()
      this.mosaicmove = ''
      if (this.num === 0) {
        this.addFilterWay(this.activechunk.chunk.filter[this.key])
      } else {
        this.sendmessage()
      }

      if (!e.touches) {
        $(document).unbind('.mosaicBoxs')
      }
    },
    addFilterWay(obj) {
      $.post(
        window.AQES.DOMAIN + '/api/chunk',
        JSON.stringify({
          cmd: 'add_filter',
          chunk_id: this.activechunk.chunk.chunk_id,
          filter: obj
        }),
        function(res) {
          if (res.code !== 0) {
            console.warn(res.msg)
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
    mousedown_drag(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      this.w = $('.mosaicBoxs').width()
      this.h = $('.mosaicBoxs').height()
      this.boxsX = this.getElementPos('fastblurBoxs').x
      this.boxsY = this.getElementPos('fastblurBoxs').y
      // $(document).bind('keydown.drag',this.keydown_box)
      this.mosaicmove = e.target.getAttribute('name')
      $(document).bind(
        'mousemove.drag',
        this['mousemove_drag_' + e.target.getAttribute('name')]
      )
      $(document).bind('mouseup.drag', this.mouseup_drag)
    },
    mousemove_drag_e(e_para) {
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
    mousemove_drag_s(e_para) {
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
    mousemove_drag_w(e_para) {
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
    mousemove_drag_n(e_para) {
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
    mouseup_drag() {
      // eslint-disable-next-line no-unused-expressions
      this.mosaicmove === ''
      this.sendmessage()
      $(document).unbind('.drag')
    },
    filterMousedown(e_para, key) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      this.mosaicmove = 'move'
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
    },
    filterMousemove(e_para) {
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
    filterMouseup(e) {
      e.preventDefault()
      e.stopPropagation()
      this.mosaicmove = ''
      this.sendmessage()
      if (!e.touches) {
        $(document).unbind('.mosaicBox')
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
