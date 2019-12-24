<template>
  <div
    v-cloak
    class="fchunkbox"
    :class="{
      active: isActive,
      warn: isWarn,
      moveing: isMove,
      moveing1: isMoveing1
    }"
    :style="{
      backgroundRepeat: 'repeat',
      position: this.move ? 'fixed' : 'absolute',
      zIndex: this.move ? 1010 : this.isAiSelect ? 1004 : 1002,
      backgroundColor: '#000',
      backgroundImage: this.newprevImg,
      backgroundSize: 'auto 100%',
      height: '62px',
      backgroundPosition:
        -(
          this.chunk.src_start /
          (this.slidernum.max - this.track_property.ratio)
        ) + 'px',
      top: (this.move ? this.y : 0) + 'px',
      width:
        (this.chunk.track_end - this.chunk.track_start) /
          (this.slidernum.max - this.track_property.ratio) +
        'px',
      left:
        (this.move
          ? this.x
          : this.chunk.track_start /
            (this.slidernum.max - this.track_property.ratio)) + 'px'
    }"
  >
    <div
      style="position:absolute;height:100%;width:100%;overflow:hidden"
      v-if="
        (this.chunk.chunk_type == 1 && this.chunk.preview_img == null) ||
          this.chunk.chunk_type == 2
      "
    >
      <div v-if="chunk.chunk_type == 1">
        <transition-group name="img-list">
          <div
            v-for="(str, k) in this.useimglist"
            :key="k"
            :style="{
              backgroundColor: '#000',
              position: 'absolute',
              left: posit(str),
              width: '100px',
              height: '56px',
              textAlign: 'center'
            }"
          >
            <img max-height="62px" max-weight="100px" :src="url(str)" />
          </div>
        </transition-group>
      </div>
      <div v-else-if="chunk.chunk_type == 2">
        <div
          v-for="(str, k) in this.useimglist"
          :key="k"
          :style="{
            backgroundImage: 'url(' + str + ')',
            backgroundColor: '#000',
            position: 'absolute',
            width: '100%',
            left: posit(str),
            height: '56px',
            textAlign: 'center'
          }"
        ></div>
      </div>
    </div>
    <div
      class="chunkbox"
      :id="this.chunk.chunk_id"
      :style="{ width: '100%', height: '100%', position: 'absolute', left: 0 }"
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
      ></div>
      <div
        @mousedown="openway == 'pc' ? toRight($event) : temp()"
        @touchstart="toRight($event)"
        @touchmove="toRightmove"
        @touchend="toRightup"
      ></div>
    </div>
    <div
      v-if="this.up && !restActiveChunks.length"
      :style="{
        position: 'absolute',
        cursor: 'pointer',
        top: '65px',
        left: this.offsetx + 'px',
        zIndex: 100
      }"
    >
      <p
        class="adapted-insert"
        :class="this.index1 == this.index2 ? 'disabled' : 'undisabled'"
        @mousedown="insertHandler"
      >
        适应插入
      </p>
      <p class="undisabled location-cover" @mousedown="coverHandler">
        位置覆盖
      </p>
    </div>
    <div
      v-if="isAiSelect"
      class="track-choose"
      :style="{ top: -38 + appendTop + 'px' }"
    >
      <span
        v-if="!isTrackSelect"
        class="track-select track-choice"
        @mousedown="trackSelect"
        >选择全轨</span
      >
      <span v-else class="track-cancel track-choice" @mousedown="trackCancel"
        >取消全选</span
      >
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  // chunkSeparateAudioApi,
  // chunkDelApi,
  chunkUpdateLengthApi
} from '@/api/Chunk'
// import { trackType } from '@/config/type'
import { deepClone } from '@/utils'

export default {
  data: function() {
    return {
      useimglist: [],
      prevImg: '',
      move: false,
      x: 0,
      y: 0,
      index1: null,
      index2: null,
      offsetx: 0,
      offsety: 0,
      xifuindex: null,
      xifulength: null,
      timerLeft: null,
      timerRight: null,
      movetrackid: '',
      chunkmove: '',
      t: 0,
      max: 0,
      timer: null,
      up: false,
      start: 0,
      oldpage: 0,
      oldlefttrack: 0,
      oldleftsrc: 0,
      lastt: 0,
      mapOriginMousePos: {
        // ***+++
        x: 0,
        y: 0
      },
      mapMoveMousePos: {
        // ***+++
        x: 0,
        y: 0
      },
      boxScrollTop: 0,
      appendTop: 0
    }
  },
  props: ['chunk', 'trackid', 'tracktype', 'index', 'trackarr', 'trackMark'],
  computed: {
    ...mapState([
      'trackbox',
      'trackposition',
      'activechunk',
      'slidernum',
      'filterlist',
      'openway',
      'sourceData',
      'systemmessage',
      'restActiveChunks',
      'isMultiSelect',
      'originMousePos',
      'moveMousePos',
      'activeChunkPos',
      'endMousePos',
      'delchunkposition',
      'ghostsPosition',
      'moveListData',
      'moveResultFlag',
      'moveListCount',
      'modalVoiceApplyIsShow',
      'modalContent',
      'isTrackSelect',
      'all'
    ]),
    filterChunksArray() {
      return this.trackarr.chunks.filter(chunk => chunk.chunk_type !== 5)
    },
    isActive() {
      const chunkFlag =
        this.activechunk.chunk.chunk_id === this.chunk.chunk_id &&
        (this.activechunk.state === 'active' || this.activechunk.state === '')
      let restChunksFlag
      for (const restItem of this.restActiveChunks) {
        if (
          restItem.chunk.chunk_id === this.chunk.chunk_id &&
          (restItem.state === 'active' || restItem.state === '')
        ) {
          restChunksFlag = true
          break
        }
      }
      return chunkFlag || restChunksFlag
    },
    isWarn() {
      const chunkFlag =
        this.activechunk.chunk.chunk_id === this.chunk.chunk_id &&
        this.activechunk.state === 'warn'
      let restChunksFlag
      for (const restItem of this.restActiveChunks) {
        if (
          restItem.chunk.chunk_id === this.chunk.chunk_id &&
          restItem.state === 'warn'
        ) {
          restChunksFlag = true
          break
        }
      }
      return chunkFlag || restChunksFlag
    },
    isMove() {
      const chunkFlag =
        this.activechunk.chunk.chunk_id === this.chunk.chunk_id &&
        this.activechunk.state === 'moveing'
      let restChunksFlag
      for (const restItem of this.restActiveChunks) {
        if (
          restItem.chunk.chunk_id === this.chunk.chunk_id &&
          restItem.state === 'moveing'
        ) {
          restChunksFlag = true
          break
        }
      }
      return chunkFlag || restChunksFlag
    },
    isMoveing1() {
      const chunkFlag =
        this.activechunk.chunk.chunk_id === this.chunk.chunk_id &&
        this.activechunk.state === 'moveing1'
      let restChunksFlag
      for (const restItem of this.restActiveChunks) {
        if (
          restItem.chunk.chunk_id === this.chunk.chunk_id &&
          restItem.state === 'moveing1'
        ) {
          restChunksFlag = true
          break
        }
      }
      return chunkFlag || restChunksFlag
    },
    isAiSelect() {
      return (
        this.isActive &&
        !this.restActiveChunks.length &&
        this.modalVoiceApplyIsShow
      )
    },
    brepeat() {
      let num = 0
      for (let i = 0, len = this.sourceData.length; i < len; i++) {
        const sourceData = this.sourceData[i]
        if (
          sourceData.src_id === this.chunk.src_id &&
          sourceData.brepeat === true
        ) {
          num++
        }
      }
      return num > 0
    },
    pointer() {
      return this.$store.state.all.pointer
    },
    newprevImg() {
      return 'url(' + this.prevImg + ')'
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    track() {
      return this.$store.state.all.tracks
    },
    imglist() {
      return this.$store.state.imglists[this.chunk.chunk_id]
    },

    run: function() {
      return (
        -(
          this.chunk.src_start %
          ((this.slidernum.max - this.track_property.ratio) * 100)
        ) /
        (this.slidernum.max - this.track_property.ratio)
      )
    },
    position: function() {
      // const url = ''
      const arr = []
      if (this.chunk.chunk_type === 2) {
        arr.push(
          -this.chunk.src_start /
            (this.slidernum.max - this.track_property.ratio) +
            'px 0px'
        )
      }
      if (this.chunk.chunk_type === 1) {
        for (let i = 0, len = this.useimglist.length; i < len; i++) {
          const index = parseFloat(this.useimglist[i].match(/[\d.]+-/g))
          const width = parseInt(this.useimglist[i].match(/\d+x56/g), 10)

          const positionx =
            (Math.round(
              index /
                ((100 * (this.slidernum.max - this.track_property.ratio)) / 25)
            ) -
              parseInt(
                this.chunk.src_start /
                  (this.slidernum.max - this.track_property.ratio) /
                  100,
                10
              )) *
              100 +
            (100 - width) / 2 +
            this.run
          arr.push(positionx + 'px 0px ')
        }
      }

      return arr.join(',')
    }
  },
  watch: {
    imglist: {
      deep: true,
      immediate: true,
      handler: function(value, oldvalue) {
        if (typeof value === 'undefined') {
          return
        }
        for (let i = 0, len = value.length; i < len; i++) {
          let k = 0
          for (let j = 0, len2 = this.useimglist.length; j < len2; j++) {
            if (value[i] === this.useimglist[j]) {
              k = 1
            }
          }
          if (k === 0) {
            this.loadimg(value[i])
          }
        }
      }
    },
    'activechunk.chunk.preview_img'(val) {
      if (this.isActive && val != null) {
        if (val.indexOf('nces') !== -1) {
          if (val.indexOf('//') === -1) {
            this.prevImg = '//' + val
          } else {
            this.prevImg = val
          }
        } else {
          if (val.indexOf('//') === -1) {
            this.prevImg = window.NCES.DOMAIN + val
          } else {
            this.prevImg = val
          }
        }
      }
    },
    /* 多选begin */
    originMousePos: {
      // ***+++
      deep: true,
      handler: function(newVal) {
        for (const restItem of this.restActiveChunks) {
          if (this.chunk.chunk_id === restItem.chunk.chunk_id) {
            this.t = Date.now()
            this.chunkmove = 'all'
            this.x = this.getElementPos(this.chunk.chunk_id).x
            this.y = this.getElementPos(this.chunk.chunk_id).y - 1
            this.mapOriginMousePos.x =
              newVal.x - (this.activeChunkPos.x - this.x)
            this.mapOriginMousePos.y =
              newVal.y - (this.activeChunkPos.y - this.y)
            this.offsetx = this.mapOriginMousePos.x - this.x // 点击处距视频块左上角的横向距离
            this.offsety = this.mapOriginMousePos.y - this.y // 点击处距视频块左上角的纵向距离
            break
          }
        }
      }
    },
    moveMousePos: {
      // ***+++
      deep: true,
      // eslint-disable-next-line complexity
      handler: function(newVal) {
        for (const restItem of this.restActiveChunks) {
          if (this.chunk.chunk_id === restItem.chunk.chunk_id) {
            this.mapMoveMousePos.x =
              this.mapOriginMousePos.x + (newVal.x - this.originMousePos.x)
            this.mapMoveMousePos.y =
              this.mapOriginMousePos.y + (newVal.y - this.originMousePos.y)
            const e = {}
            e.pageX = this.mapMoveMousePos.x
            e.pageY = this.mapMoveMousePos.y

            this.move = true
            this.x = e.pageX - this.offsetx
            this.y = e.pageY - this.offsety

            // *** movePublicHandler start
            const trackboxScroll = $('#trackbox').scrollTop()
            const inTracksBox =
              e.pageX > this.trackbox.minX &&
              e.pageX < this.trackbox.maxX &&
              e.pageY > this.trackbox.minY &&
              e.pageY < this.trackbox.maxY
            if (inTracksBox) {
              const numObj = this.xifuHandler(e, trackboxScroll)
              for (let n = 0, len = this.trackposition.length; n < len; n++) {
                const minX = this.trackposition[n].minX
                const maxX = this.trackposition[n].maxX
                const minY = this.trackposition[n].minY
                const maxY = this.trackposition[n].maxY
                if (
                  e.pageX > minX &&
                  e.pageX < maxX &&
                  e.pageY > minY - trackboxScroll &&
                  e.pageY < maxY - trackboxScroll
                ) {
                  // 左右移动
                  this.sideTimer(e, minX, maxX)
                  this.y = minY - trackboxScroll + 1
                  // ***+++ index-moveing1-用来判断是否冲突
                  this.indexHandlers(numObj.num1, numObj.num2, n, 'rest')
                  // *** 综合移动判断为warning(activeChunk走mousemove事件分支，函数抽离时需加上分支代码)
                  this.isWarnRestHandler(n)
                }
              }
            } else {
              for (const rest_Item of this.restActiveChunks) {
                if (rest_Item.chunk.chunk_id === this.chunk.chunk_id) {
                  restItem.state = ''
                }
              }
            }
            break
          }
        }
      }
    },
    endMousePos: {
      // ***+++
      deep: true,
      handler: function(newVal) {
        for (const restItem of this.restActiveChunks) {
          if (this.chunk.chunk_id === restItem.chunk.chunk_id) {
            const e = {}
            e.pageX =
              this.mapOriginMousePos.x + (newVal.x - this.originMousePos.x)
            e.pageY =
              this.mapOriginMousePos.y + (newVal.y - this.originMousePos.y)
            this.restMouseup(e)
            break
          }
        }
      }
    },
    moveListCount: function(newVal, oldVal) {
      if (this.chunk.chunk_id !== this.activechunk.chunk.chunk_id) return
      if (!this.moveListData.length) return
      if (newVal === this.restActiveChunks.length + 1) {
        this.Post({
          type: 'chunk',
          data: {
            cmd: 'move',
            chunk_list: this.moveListData
          },
          success: res => {
            this.CHANGE_MOVE_RESULT_FLAG(1)
            this.changeLoading(() => {
              this.move = false
            })
          },
          error: res => {
            this.CHANGE_MOVE_RESULT_FLAG(2)
            this.move = false
            if (res.code === -1 && res.msg === 'mix video too much') {
              this.mix_error({ src_id: this.chunk.src_id })
            }
            // return;
          }
        })
      }
    }

    /* 多选end */
  },
  methods: {
    ...mapActions(['changeLoading', 'Post', 'gethistoryindex', 'libClear']),
    ...mapMutations([
      'ACTIVE_CHUNK',
      'CHANGE_CHUNKSETSHOW',
      'CHANGE_REST_ACTIVE_CHUNKS',
      'CLEAR_REST_ACTIVE_CHUNKS',
      'DEL_REST_ACTIVE_CHUNKS',
      'CHANGE_ORIGIN_MOUSE_POS',
      'CHANGE_MOVE_MOUSE_POS',
      'CHANGE_ACTIVE_CHUNK_POS',
      'CHANGE_END_MOUSE_POS',
      'CHANGE_MOVE_LIST_DATA',
      'CLEAR_MOVE_LIST_DATA',
      'CHANGE_MOVE_RESULT_FLAG',
      'CHANGE_MOVE_LIST_COUNT',
      'CLEAR_MOVE_LIST_COUNT',
      'UPDATE_CHUNK_POSITION',
      'EMPTY_ACTIVE_CHUNK',
      'CHANGE_ACTIVE_CHUNK',
      'POP_REST_ACTIVE_CHUNKS',
      'CHANGE_IS_TRACK_SELECT',
      'CHANGE_MODAL_CONTENT',
      'UPDATE_AI_CHUNKS_POSITION'
    ]),
    url(url) {
      if (url.indexOf('//') === -1) {
        return window.NCES.DOMAIN + url
      }
    },
    /* posit(url, sortNum) {
      if (this.chunk.chunk_type === 1) {
        if (sortNum > 0) {
          const srcNextPos = this.srcBeginPos + sortNum * 100
          console.log({ srcNextPos })
          return srcNextPos + 'px'
        }
        const index = parseFloat(url.match(/[\d.]+-/g))
        const positionx =
          (Math.round(
            index /
              ((100 * (this.slidernum.max - this.track_property.ratio)) / 25)
          ) -
            parseInt(
              this.chunk.src_start /
                (this.slidernum.max - this.track_property.ratio) /
                100,
              10
            )) *
            100 +
          this.run
        this.srcBeginPos = positionx
        console.log({ srcBeginPos: this.srcBeginPos })
        return positionx + 'px'
      } else {
        const audioSrcBeginPos =
          -this.chunk.src_start /
          (this.slidernum.max - this.track_property.ratio)
        console.log({ srcBeginPos: this.srcBeginPos })
        return audioSrcBeginPos + 'px'
      }
    }, */
    posit(url) {
      if (this.chunk.chunk_type === 1) {
        const index = parseFloat(url.match(/[\d.]+-/g))
        const positionx =
          (Math.round(
            index /
              ((100 * (this.slidernum.max - this.track_property.ratio)) / 25)
          ) -
            parseInt(
              this.chunk.src_start /
                (this.slidernum.max - this.track_property.ratio) /
                100,
              10
            )) *
            100 +
          this.run
        return positionx + 'px'
      } else {
        return (
          -this.chunk.src_start /
            (this.slidernum.max - this.track_property.ratio) +
          'px'
        )
      }
    },
    // eslint-disable-next-line no-empty-function
    temp() {},
    loadimg: function(url_para) {
      let url = url_para
      const that = this
      const img = new Image()
      img.onload = function() {
        if (that.chunk.chunk_type === 2) {
          that.prevImg = window.NCES.DOMAIN + url
        } else {
          that.useimglist.push(url)
        }
      }
      img.onerror = function() {
        setTimeout(function() {
          that.loadimg(url)
        }, 3000)
      }
      url = url.replace(/http:/, '')
      url = url.replace(/https:/, '')
      if (url.indexOf('//') === -1) {
        img.src = window.NCES.DOMAIN + url
      } else {
        img.src = url
      }
    },
    xifuHandler(e, trackboxScroll) {
      let faaa = 0
      let x1, x2
      for (let i = 0, len = this.trackposition.length; i < len; i++) {
        for (
          let m = 0, len2 = this.delchunkposition.v[i].length;
          m < len2;
          m++
        ) {
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                this.offsetx
            ) < 10 &&
            this.track_property.xifuFlag
          ) {
            this.x = 188 - this.track_property.outLeft
            this.xifuindex = 0
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                this.offsetx -
                this.delchunkposition.v[i][m].max /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            this.track_property.xifuFlag
          ) {
            this.x =
              this.delchunkposition.v[i][m].max /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex = this.delchunkposition.v[i][m].max
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                this.offsetx -
                this.delchunkposition.v[i][m].min /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            this.track_property.xifuFlag
          ) {
            this.x =
              this.delchunkposition.v[i][m].min /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex = this.delchunkposition.v[i][m].min
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                this.offsetx +
                (this.chunk.track_end - this.chunk.track_start) /
                  (this.slidernum.max - this.track_property.ratio) -
                this.delchunkposition.v[i][m].min /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            this.track_property.xifuFlag
          ) {
            this.x =
              (this.delchunkposition.v[i][m].min -
                this.chunk.track_end +
                this.chunk.track_start) /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex =
              this.delchunkposition.v[i][m].min -
              this.chunk.track_end +
              this.chunk.track_start
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                this.offsetx +
                (this.chunk.track_end - this.chunk.track_start) /
                  (this.slidernum.max - this.track_property.ratio) -
                this.delchunkposition.v[i][m].max /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            this.track_property.xifuFlag
          ) {
            this.x =
              (this.delchunkposition.v[i][m].max -
                this.chunk.track_end +
                this.chunk.track_start) /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex =
              this.delchunkposition.v[i][m].max -
              this.chunk.track_end +
              this.chunk.track_start
            faaa++
          }
        }
        if (
          e.pageX > this.trackposition[i].minX &&
          e.pageX < this.trackposition[i].maxX &&
          e.pageY > this.trackposition[i].minY - trackboxScroll &&
          e.pageY < this.trackposition[i].maxY - trackboxScroll
        ) {
          this.movetrackid = this.trackposition[i].id
          this.y = this.trackposition[i].minY - trackboxScroll + 1
        }
      }
      if (faaa === 0) {
        this.xifuindex = null
      }
      if (this.xifuindex) {
        x1 = this.xifuindex
        x2 = this.xifuindex + this.chunk.track_end - this.chunk.track_start
      } else {
        x1 =
          (e.pageX -
            this.trackbox.minX -
            this.offsetx +
            this.track_property.outLeft) *
          (this.slidernum.max - this.track_property.ratio)
        x2 = x1 + this.chunk.track_end - this.chunk.track_start
      }
      return { num1: x1, num2: x2 }
    },
    sideTimer(e, minX, maxX) {
      if (e.pageX - minX < 20 && this.track_property.outLeft !== 0) {
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
      if (maxX - e.pageX < 20) {
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
    indexHandlerForRest(index_para) {
      let index = index_para
      if (index !== 0) {
        index = 0
        for (const restItem of this.restActiveChunks) {
          if (
            restItem.chunk.chunk_id === this.chunk.chunk_id &&
            restItem.state !== 'moveing1'
          ) {
            restItem.state = 'moveing1'
            break
          }
        }
      } else {
        this.index1 = null
        this.index2 = null
        for (const restItem of this.restActiveChunks) {
          if (
            restItem.chunk.chunk_id === this.chunk.chunk_id &&
            restItem.state !== 'moveing'
          ) {
            restItem.state = 'moveing'
            break
          }
        }
      }
    },
    indexHandlerForActive(index_para, n) {
      let index = index_para
      if (index !== 0) {
        index = 0
        if (this.activechunk.state !== 'moveing1') {
          this.ACTIVE_CHUNK({ state: 'moveing1' })
        }
      } else {
        this.index1 = null
        this.index2 = null
        if (this.activechunk.state !== 'moveing') {
          this.ACTIVE_CHUNK({ state: 'moveing' })
        }
      }
      /*  19.6.3 产品突然不要这功能了,nmb
      if (
        this.tracktype === trackType.VIDEO &&
        this.trackposition[n].type === trackType.AUDIO
      ) {
        // move the video chunk to audio track
        if (
          this.activechunk.state !== "videoToAudio" &&
          this.activechunk.chunk.battach_audio === true
        ) {
          this.ACTIVE_CHUNK({ state: "videoToAudio" });
        } else {
          this.ACTIVE_CHUNK({state: 'warn'})
        }
      } else if (
        this.tracktype === trackType.AUDIO &&
        this.trackposition[n].type === trackType.VIDEO
      ) {
        // move the audio track to video chunk
        if (this.activechunk.state != "warn") {
          this.ACTIVE_CHUNK({ state: "warn" });
        }
      } */

      if (
        this.trackposition[n].type !== this.tracktype &&
        this.activechunk.state !== 'warn'
      ) {
        this.ACTIVE_CHUNK({ state: 'warn' })
      }
      if (
        this.trackposition[n].able === 'true' &&
        this.activechunk.state !== 'warn'
      ) {
        this.ACTIVE_CHUNK({ state: 'warn' })
      }
    },
    indexHandlers(x1, x2, n, mode) {
      let index = 0
      for (
        let j = 0, delchunkposition_len = this.delchunkposition.v[n].length;
        j < delchunkposition_len;
        j++
      ) {
        const delchunkposition = this.delchunkposition.v[n][j]
        const min = delchunkposition.min
        const max = delchunkposition.max
        if (
          (x1 >= min && x1 < max) ||
          (x2 > min && x2 < max) ||
          (min >= x1 && min < x2) ||
          (max > x1 && max < x2)
        ) {
          if (x1 >= min && x1 < max) {
            this.index1 = j
          }
          if (x2 >= min && x2 <= max) {
            this.index2 = j
          }
          if ((min >= x1 && min < x2) || (max > x1 && max < x2)) {
            this.index1 = 1
            this.index2 = 2
          }
          index++
        }
      }
      // ***+++需要单独抽出
      if (mode === 'rest') {
        this.indexHandlerForRest(index)
      }
      if (mode === 'active') {
        this.indexHandlerForActive(index, n)
      }
    },
    isWarnRestHandler(n) {
      if (
        this.trackposition[n].type !== this.tracktype ||
        this.trackposition[n].able === 'true' // *** n为mapMouse所在的track
      ) {
        for (const restItem of this.restActiveChunks) {
          if (restItem.chunk.chunk_id === this.chunk.chunk_id) {
            restItem.state = 'warn'
            break
          }
        }
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
    },
    down(e, time) {
      const that = this
      this.timer = setTimeout(function() {
        that.mousedown(e)
      }, time)
    },
    multiActiveHandler() {
      if (!(this.isActive || this.isWarn || this.isMove || this.isMoveing1)) {
        const modalReject =
          this.modalVoiceApplyIsShow &&
          this.chunk.track_id !== this.activechunk.chunk.track_id
        if (this.isMultiSelect && !modalReject) {
          if (this.activechunk.chunk) {
            const activeClone = deepClone(this.activechunk)
            this.CHANGE_REST_ACTIVE_CHUNKS(activeClone)
          }
        } else {
          this.CLEAR_REST_ACTIVE_CHUNKS()
        }
        this.ACTIVE_CHUNK({ chunk: this.chunk, state: 'active' })
      } else {
        // *** 点击的是选中块的情况
        if (
          this.restActiveChunks.length &&
          this.chunk.chunk_id !== this.activechunk.chunk.chunk_id
        ) {
          this.DEL_REST_ACTIVE_CHUNKS(this.chunk)
          if (this.activechunk.chunk !== '') {
            const activeClone = deepClone(this.activechunk)
            this.CHANGE_REST_ACTIVE_CHUNKS(activeClone)
          }
          this.ACTIVE_CHUNK({ chunk: this.chunk, state: 'active' })
        }
        // 多选状态取消所点击选中块
        if (this.isMultiSelect) {
          this.EMPTY_ACTIVE_CHUNK()
          if (this.restActiveChunks.length) {
            this.CHANGE_ACTIVE_CHUNK(
              this.restActiveChunks[this.restActiveChunks.length - 1]
            )
            this.POP_REST_ACTIVE_CHUNKS()
          }
        }
      }
    },
    mousedown(e_para) {
      e_para.stopPropagation()
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      if (this.up) {
        this.up = false
        this.move = false
        if (this.activechunk.state !== 'active') {
          this.ACTIVE_CHUNK({ state: 'active' })
        }
      }
      // 智能语音单击选择块，切换modal内容
      if (this.modalVoiceApplyIsShow && this.modalContent !== 'digitalInfo') {
        this.CHANGE_MODAL_CONTENT('digitalInfo')
      }
      if (this.modalContent === 'digitalInfo') {
        if (
          this.trackMark + 1 &&
          $('#trackbox')[0].scrollTop + 31 > 62 * this.trackMark
        ) {
          this.appendTop = 100
        } else {
          this.appendTop = 0
        }
      }
      if (window.zindex === 3) {
        this.libClear()
      }
      // *** 清除上一次的移动缓存
      this.CLEAR_MOVE_LIST_DATA()
      this.CHANGE_MOVE_RESULT_FLAG(0)
      this.CLEAR_MOVE_LIST_COUNT()
      // *** 保存拖动时鼠标原始坐标
      this.CHANGE_ORIGIN_MOUSE_POS({
        x: e.pageX,
        y: e.pageY
      })
      this.t = Date.now()
      this.chunkmove = 'all'
      const that = this
      this.x = this.getElementPos(this.chunk.chunk_id).x
      this.y = this.getElementPos(this.chunk.chunk_id).y - 1

      // *** 保存拖动时激活块坐标
      this.CHANGE_ACTIVE_CHUNK_POS({
        x: this.x,
        y: this.y
      })
      this.offsetx = e.pageX - this.x
      this.offsety = e.pageY - this.y

      if (
        typeof this.chunk.speed === 'undefined' &&
        (this.chunk.chunk_type === 1 || this.chunk.chunk_type === 2)
      ) {
        this.chunk.speed = 1
      }

      // this.ACTIVE_CHUNK({chunk: this.chunk, state: "active"});
      // *** active块多选时的处理
      this.multiActiveHandler()
      this.UPDATE_CHUNK_POSITION() // active块变化时更新chunkPosition(delChunk & ghostsChunk)
      this.UPDATE_AI_CHUNKS_POSITION()

      // 播放状态调用暂停
      if (this.pointer.speed === 1) {
        this.Post({
          type: 'pointer',
          data: { cmd: 'set', speed: 0 },
          error: function() {
            that.$notify({
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

      // this.addHandler(document, "mouseup", this.stopDrag); //绑定stopDrag
      // event.preventDefault && event.preventDefault(); //阻止默认事件
    },
    mousemove(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      let e = e_para
      if (Date.now() - this.t < 100) {
        return
      }
      if (this.openway !== 'pc') {
        clearTimeout(this.timer)
        this.timer = null
      }
      if (!this.chunkmove) {
        return
      }
      if (this.modalVoiceApplyIsShow) {
        return
      }
      if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
      }
      // if(this.move==false){
      //     this.ACTIVE_CHUNK({'state':'moveing1'})
      // }
      this.move = true
      // ***+++ 确定移动后提交新的鼠标位置
      this.CHANGE_MOVE_MOUSE_POS({
        x: e.pageX,
        y: e.pageY
      })
      this.x = e.pageX - this.offsetx
      this.y = e.pageY - this.offsety
      const trackboxScroll = $('#trackbox').scrollTop()

      if (
        e.pageX > this.trackbox.minX &&
        e.pageX < this.trackbox.maxX &&
        e.pageY > this.trackbox.minY &&
        e.pageY < this.trackbox.maxY
      ) {
        const numObj = this.xifuHandler(e, trackboxScroll)
        for (let n = 0, len = this.trackposition.length; n < len; n++) {
          const minX = this.trackposition[n].minX
          const maxX = this.trackposition[n].maxX
          const minY = this.trackposition[n].minY
          const maxY = this.trackposition[n].maxY
          if (
            e.pageX > minX &&
            e.pageX < maxX &&
            e.pageY > minY - trackboxScroll &&
            e.pageY < maxY - trackboxScroll
          ) {
            // 左右移动
            this.sideTimer(e, minX, maxX)
            this.y = minY - trackboxScroll + 1
            this.indexHandlers(numObj.num1, numObj.num2, n, 'active')
          }
        }
      } else {
        if (this.activechunk.state === '') {
          return
        }
        this.ACTIVE_CHUNK({ state: '' })
      }
    },
    async mouseup(e_para) {
      e_para.stopPropagation()
      let e = e_para
      // ***+++ 提交最终的鼠标位置
      this.CHANGE_END_MOUSE_POS({
        x: e.pageX,
        y: e.pageY
      })
      if (this.openway !== 'pc') {
        if (e.touches.length > 0) {
          return
        }
        if (Date.now() - this.lastt <= 300) {
          this.dblclick(e)
        }
        this.lastt = Date.now()

        clearTimeout(this.timer)
        if (this.timer !== 0) {
          this.ACTIVE_CHUNK({ state: 'active', chunk: this.chunk })

          return
        }
      }
      this.lastt = Date.now()

      if (this.chunkmove !== 'all') {
        return
      }
      this.chunkmove = ''
      if (e.touches) {
        e = e.changedTouches[0]
      }
      if (this.openway === 'pc') {
        $(document).off('mousemove')
      }
      clearInterval(this.timerLeft)
      this.timerLeft = null
      clearInterval(this.timerRight)
      this.timerRight = null
      if (this.activechunk.state !== 'active') {
        $.post(
          window.NCES.DOMAIN + '/api/track',
          JSON.stringify({
            cmd: 'property_append',
            track_property: { outLeft: this.track_property.outLeft }
          }),
          function(res) {
            if (res.code !== 0) {
              console.warn(res.msg)
            }
          },
          'json'
        )
      }
      this.start =
        e.pageX -
          this.trackposition[0].minX -
          this.offsetx +
          this.track_property.outLeft >
        0
          ? e.pageX -
            this.trackposition[0].minX -
            this.offsetx +
            this.track_property.outLeft
          : 0

      if (this.move) {
        if (
          this.activechunk.state === 'moveing' ||
          (this.activechunk.state === 'moveing1' &&
            this.restActiveChunks.length)
        ) {
          // let check_res = this.check_chunk({track_start:this.xifuindex ||
          //         parseInt(
          //           this.start * (this.slidernum.max - this.track_property.ratio)
          //         ),src_id:that.chunk.src_id})
          // if(check_res){
          //          return
          //     }
          this.CHANGE_MOVE_LIST_DATA({
            chunk_id: this.chunk.chunk_id,
            move_track_id: this.movetrackid,
            move_track_start:
              this.xifuindex ||
              parseInt(
                this.start * (this.slidernum.max - this.track_property.ratio),
                10
              ),
            mode: 2
          })
          this.ACTIVE_CHUNK({ state: 'active' })
        } else if (this.activechunk.state === 'moveing1') {
          this.up = true
        }
        // else if (this.activechunk.state === "videoToAudio") {
        //   let res;
        //   res = await chunkSeparateAudioApi({
        //     chunk_id: this.activechunk.chunk.chunk_id
        //   })
        //   if(res==='success') {
        //     res = await chunkDelApi({chunk_id: this.activechunk.chunk.chunk_id})
        //     this.changeLoading()
        //   }
        // }
        else if (
          this.activechunk.state === 'warn' ||
          this.activechunk.state === ''
        ) {
          this.move = false
          this.ACTIVE_CHUNK({ state: 'active' })
        }
      }
      this.CHANGE_MOVE_LIST_COUNT()
      this.UPDATE_CHUNK_POSITION()
    },
    async restMouseup(e) {
      if (this.chunkmove !== 'all') {
        return
      }
      this.chunkmove = ''
      clearInterval(this.timerLeft)
      this.timerLeft = null
      clearInterval(this.timerRight)
      this.timerRight = null

      this.start =
        e.pageX -
          this.trackposition[0].minX -
          this.offsetx +
          this.track_property.outLeft >
        0
          ? e.pageX -
            this.trackposition[0].minX -
            this.offsetx +
            this.track_property.outLeft
          : 0

      if (this.move) {
        for (const restItem of this.restActiveChunks) {
          if (restItem.chunk.chunk_id === this.chunk.chunk_id) {
            if (restItem.state === 'moveing' || restItem.state === 'moveing1') {
              this.CHANGE_MOVE_LIST_DATA({
                chunk_id: restItem.chunk.chunk_id,
                move_track_id: this.movetrackid,
                move_track_start:
                  this.xifuindex ||
                  parseInt(
                    this.start *
                      (this.slidernum.max - this.track_property.ratio),
                    10
                  ),
                mode: 2
              })
              restItem.state = 'active'
            } else if (restItem.state === 'warn' || restItem.state === '') {
              this.move = false
              restItem.state = 'active'
            }
            break
          }
        }
      }
      this.CHANGE_MOVE_LIST_COUNT()
    },
    insertHandler(e) {
      if (e) {
        e.stopPropagation()
      }
      let mode
      if (this.restActiveChunks.length) {
        mode = 2
      } else {
        mode = 3
      }
      const that = this
      if (this.index1 !== this.index2) {
        this.Post({
          type: 'chunk',
          data: {
            cmd: 'move',
            chunk_list: [
              {
                chunk_id: this.chunk.chunk_id,
                move_track_id: this.movetrackid,
                move_track_start:
                  this.xifuindex ||
                  parseInt(
                    this.start *
                      (this.slidernum.max - this.track_property.ratio),
                    10
                  ),
                mode
              }
            ]
          },
          success: function(res) {
            that.changeLoading(function() {
              that.move = false
            })
          },
          error: function(res) {
            that.move = false
            return
          }
        })
        if (this.chunk.chunk_id === this.activechunk.chunk.chunk_id) {
          this.ACTIVE_CHUNK({ state: 'active' })
        } else {
          for (const restItem of this.restActiveChunks) {
            if (this.chunk.chunk_id === restItem.chunk.chunk_id) {
              restItem.state = 'active'
              break
            }
          }
        }
        this.up = false
      }
    },
    coverHandler(e) {
      e.stopPropagation()
      const that = this
      this.Post({
        type: 'chunk',
        data: {
          cmd: 'move',
          chunk_list: [
            {
              chunk_id: this.chunk.chunk_id,
              move_track_id: this.movetrackid,
              move_track_start:
                this.xifuindex ||
                parseInt(
                  this.start * (this.slidernum.max - this.track_property.ratio),
                  10
                ),
              mode: 1
            }
          ]
        },
        success: function(res) {
          that.changeLoading(function() {
            that.move = false
          })
        },
        error: function(res) {
          that.move = false
        }
      })
      this.ACTIVE_CHUNK({ state: 'active' })
      this.up = false
    },
    dblclick() {
      console.log('chunkbox dblclick')
      this.ACTIVE_CHUNK({ chunk: this.chunk, state: 'active' })
      if (this.modalVoiceApplyIsShow) {
        return
      }
      let serviceList = []
      const filterList = JSON.parse(this.filterlist)
      if (
        (this.activechunk.chunk.chunk_type === 4 ||
          this.activechunk.chunk.chunk_type === 1) &&
        this.activechunk.chunk.filter.length === 0
      ) {
        if (
          !this.activechunk.chunk.battach_audio ||
          this.activechunk.chunk.chunk_type === 4
        ) {
          // serviceList = ['saturation','cutting','rotate','mirror','mosaic','exposure','brightness','halo','boxblur','coloring','contrast']
          // serviceList = this.filterList.shift()
          for (let i = 0; i < filterList.length; i++) {
            if (
              filterList[i].service === 'volume' ||
              filterList[i].service === 'mosaic'
            ) {
              continue
            } else {
              if (filterList[i].service === 'cutting') {
                filterList[i].parameter.softness = 0.02
              }
              filterList[i].parameter.disable = 1
              serviceList.push(filterList[i])
            }
          }
        } else {
          // serviceList = ['volume','saturation','cutting','rotate','mirror','mosaic','exposure','brightness','halo','boxblur','coloring','contrast']
          for (let i = 0; i < filterList.length; i++) {
            if (filterList[i].service === 'mosaic') {
              continue
            } else {
              if (filterList[i].service === 'cutting') {
                filterList[i].parameter.softness = 0.02
              }
              filterList[i].parameter.disable = 1
              serviceList.push(filterList[i])
            }
          }
        }
        this.activechunk.chunk.filter = serviceList
      }
      if (this.activechunk.chunk.chunk_type === 2) {
        if (this.activechunk.chunk.filter.length === 0) {
          serviceList = [filterList[0]]
          serviceList[0].parameter.disable = 1
          this.activechunk.chunk.filter = serviceList
        }
      }
      for (let i = 0; i < serviceList.length; i++) {
        $.post(
          window.NCES.DOMAIN + '/api/chunk',
          JSON.stringify({
            cmd: 'add_filter',
            chunk_id: this.activechunk.chunk.chunk_id,
            filter: serviceList[i]
          }),
          function(res) {
            if (res.code !== 0) {
              console.warn(res.msg)
            }
          },
          'json'
        )
      }
      $.post(
        window.NCES.DOMAIN + '/api/pointer',
        JSON.stringify({
          cmd: 'set',
          position: this.activechunk.chunk.track_start
        }),
        function(res) {
          if (res.code !== 0) {
            console.log(res.msg)
          } else {
            console.log('to chunkset refresh pointer ok')
          }
        },
        'json'
      )
      this.CHANGE_CHUNKSETSHOW(true)
      this.gethistoryindex()
    },
    toLeft(e_para) {
      e_para.stopPropagation()
      if (this.modalVoiceApplyIsShow) {
        return
      }
      let e = e_para
      this.chunkmove = 'left'
      if (e.touches) {
        e = e.touches[0]
      }
      this.flag = 1
      this.oldpage = e.pageX
      this.oldlefttrack = this.chunk.track_start
      this.oldleftsrc = this.chunk.src_start
      if (this.openway === 'pc') {
        $(document).on('mousemove', this.toLeftmove)
        $(document).one('mouseup', this.toLeftup)
      }
    },
    toLeftmove: function(e_para) {
      e_para.stopPropagation()
      let e = e_para
      if (this.chunkmove !== 'left') {
        return
      }
      if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
      }
      const that = this
      if (this.activechunk.state !== 'moveing') {
        this.ACTIVE_CHUNK({ state: 'moveing' })
      }
      if (that.chunk.chunk_type === 1 || that.chunk.chunk_type === 2) {
        let src_start =
          that.oldleftsrc +
          (e.pageX - this.oldpage) *
            (this.slidernum.max - that.track_property.ratio)
        if (src_start > this.chunk.src_end) {
          src_start = this.chunk.src_end
        }
        if (!that.brepeat) {
          if (src_start < 0) {
            this.chunk.track_start = this.oldlefttrack - this.oldleftsrc
            this.chunk.src_start = 0
          } else if (src_start > this.chunk.src_end) {
            this.chunk.track_start = that.chunk.track_end - 1
            this.chunk.src_start = that.chunk.src_end - 1
          } else {
            this.chunk.track_start =
              this.oldlefttrack + src_start - this.oldleftsrc
            this.chunk.src_start = src_start
          }
        } else {
          this.chunk.track_start =
            this.oldlefttrack + src_start - this.oldleftsrc
          this.chunk.src_start = src_start
        }
        if (that.index === 0) {
          if (this.chunk.track_start < 0) {
            this.chunk.src_start = this.chunk.src_start - this.chunk.track_start
            this.chunk.track_start = 0
          }
        } else {
          if (
            this.chunk.track_start <
            this.filterChunksArray[this.index - 1].track_end
          ) {
            this.chunk.track_start = this.filterChunksArray[
              this.index - 1
            ].track_end
            this.chunk.src_start =
              this.chunk.src_end -
              (this.chunk.track_end - this.chunk.track_start)
          }
        }
        // if (that.chunk.chunk_type == 2) {
        //   if(!that.prepeat){
        //        _target.css({'backgroundPosition':-this.src_start / (this.slidernum.max-that.property.ratio)+'px 0px'});
        //   }
        // }
        // _target1.css({'width':(that.chunk.src_end-this.src_start) / (this.slidernum.max-that.property.ratio)});
        // _target1.css({'left':this.track_start / (this.slidernum.max-that.property.ratio),'width':(that.chunk.track_end-this.track_start) / (this.slidernum.max-that.property.ratio)});
      }
      if (that.chunk.chunk_type === 3 || that.chunk.chunk_type === 4) {
        let left =
          this.oldlefttrack +
          (e.pageX - this.oldpage) *
            (this.slidernum.max - that.track_property.ratio)
        if (left > this.chunk.track_end) {
          left = this.chunk.track_end
        }
        if (that.index === 0) {
          if (left >= 0) {
            this.chunk.track_start = left
            this.chunk.src_end =
              this.chunk.track_end -
              this.chunk.track_start +
              this.chunk.src_start
          } else {
            this.chunk.track_start = 0
            this.chunk.src_end = this.chunk.track_end + this.chunk.src_start
          }
        } else {
          if (left >= that.filterChunksArray[that.index - 1].track_end) {
            this.chunk.track_start = left
            this.chunk.src_end =
              this.chunk.track_end -
              this.chunk.track_start +
              this.chunk.src_start
          } else {
            this.chunk.track_start =
              that.filterChunksArray[that.index - 1].track_end
            this.chunk.src_end =
              this.chunk.track_end -
              this.chunk.track_start +
              this.chunk.src_start
          }
        }
      }
    },
    async chunkUpdateLengthApiHandler(data, callback) {
      const res = await chunkUpdateLengthApi(data)
      if (res.code !== 0) {
        callback && callback(res)
      }
      this.changeLoading()
      this.ACTIVE_CHUNK({ state: 'active' })
    },
    toLeftup(e_para) {
      e_para.stopPropagation()
      let e = e_para
      this.chunkmove = ''
      if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
      }
      if (this.openway === 'pc') {
        $(document).unbind('mousemove')
      }

      let data = {}
      this.flag = 0
      // let check_res = this.check_chunk(this.chunk)
      // if(check_res){
      //     return
      //   }
      if (this.chunk.chunk_type === 1 || this.chunk.chunk_type === 2) {
        data = {
          chunk_id: this.chunk.chunk_id,
          src_start: parseInt(this.chunk.src_start, 10),
          track_start: parseInt(this.chunk.track_start, 10)
        }
      }
      if (this.chunk.chunk_type === 3 || this.chunk.chunk_type === 4) {
        data = {
          chunk_id: this.chunk.chunk_id,
          src_end: parseInt(this.chunk.src_end, 10),
          track_start: parseInt(this.chunk.track_start, 10)
        }
      }
      this.chunkUpdateLengthApiHandler(data, res => {
        if (res.code === -1 && res.msg === 'mix video too much') {
          this.mix_error({ src_id: this.chunk.src_id })
        }
      })
    },
    toRight(e_para) {
      e_para.stopPropagation()
      if (this.modalVoiceApplyIsShow) {
        return
      }
      let e = e_para
      this.chunkmove = 'right'
      if (e.touches) {
        e = e.touches[0]
      }
      this.flag = 1

      this.oldpage = e.pageX
      this.oldlefttrack = this.chunk.track_end
      this.oldleftsrc = this.chunk.src_end
      if (this.openway === 'pc') {
        $(document).on('mousemove', this.toRightmove)
        $(document).one('mouseup', this.toRightup)
      }
    },
    toRightmove: function(e_para) {
      e_para.stopPropagation()
      let e = e_para
      if (this.chunkmove !== 'right') {
        return
      }
      if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
      }
      const that = this
      if (this.activechunk.state !== 'moveing') {
        this.ACTIVE_CHUNK({ state: 'moveing' })
      }
      if (that.chunk.chunk_type === 1 || that.chunk.chunk_type === 2) {
        // 如果chunk类型是视频或者音频
        let src_end =
          that.oldleftsrc +
          (e.pageX - this.oldpage) *
            (this.slidernum.max - that.track_property.ratio)
        if (src_end < this.chunk.src_start) {
          src_end = this.chunk.src_start
        }
        if (!that.brepeat) {
          if (src_end > this.max) {
            this.chunk.track_end =
              this.oldlefttrack + this.max - this.oldleftsrc
            this.chunk.src_end = this.max
          } else {
            this.chunk.track_end = this.oldlefttrack + src_end - this.oldleftsrc
            this.chunk.src_end = src_end
          }
        } else {
          this.chunk.track_end = this.oldlefttrack + src_end - this.oldleftsrc
          this.chunk.src_end = src_end
        }
        if (that.index !== that.filterChunksArray.length - 1) {
          if (
            this.chunk.track_end >
            that.filterChunksArray[this.index + 1].track_start
          ) {
            this.chunk.src_end =
              this.chunk.src_end +
              that.filterChunksArray[this.index + 1].track_start -
              this.oldlefttrack
            this.chunk.track_end =
              that.filterChunksArray[this.index + 1].track_start
          }
        }
        // if (that.chunk.chunk_type === 2) {
        //   if(!that.prepeat){
        //        _target.css({'backgroundPosition':-this.src_start / (this.slidernum.max-that.property.ratio)+'px 0px'});
        //   }
        // }
        // _target1.css({'width':(that.chunk.src_end-this.src_start) / (this.slidernum.max-that.property.ratio)});
        // _target1.css({'left':this.track_start / (this.slidernum.max-that.property.ratio),'width':(that.chunk.track_end-this.track_start) / (this.slidernum.max-that.property.ratio)});
      }
      if (that.chunk.chunk_type === 3 || that.chunk.chunk_type === 4) {
        let right =
          this.oldlefttrack +
          (e.pageX - this.oldpage) *
            (this.slidernum.max - that.track_property.ratio)
        if (right < this.chunk.track_start) {
          right = this.chunk.track_start
        }
        if (that.index === that.filterChunksArray.length - 1) {
          this.chunk.track_end = right
        } else {
          if (right > that.filterChunksArray[that.index + 1].track_start) {
            this.chunk.track_end =
              that.filterChunksArray[that.index + 1].track_start
          } else {
            this.chunk.track_end = right
          }
        }
        this.chunk.src_end =
          this.chunk.src_start + this.chunk.track_end - this.chunk.track_start
      }
    },
    toRightup(e_para) {
      e_para.stopPropagation()
      let e = e_para
      this.chunkmove = ''
      if (e.touches && e.touches.length > 0) {
        e = e.touches[0]
      }
      if (this.openway === 'pc') {
        $(document).unbind('mousemove')
      }
      let data = {}
      this.flag = 0
      if (this.chunk.chunk_type === 1 || this.chunk.chunk_type === 2) {
        data = {
          chunk_id: this.chunk.chunk_id,
          src_end: parseInt(this.chunk.src_end, 10)
        }
      }
      if (this.chunk.chunk_type === 3 || this.chunk.chunk_type === 4) {
        data = {
          chunk_id: this.chunk.chunk_id,
          src_end: parseInt(this.chunk.src_end, 10)
        }
      }
      this.chunkUpdateLengthApiHandler(data, res => {
        if (res.code === -1 && res.msg === 'mix video too much') {
          this.mix_error({ src_id: this.chunk.src_id })
        }
      })
    },
    mix_error(data) {
      const source = this.sourceData.filter(item => {
        return item.src_id === data.src_id
      })[0]
      this.$alert(
        '同一时间段内混合的视频数量（' +
          source.v_width +
          'x' +
          source.v_height +
          '）超出资源配置上限，请删除此时间段内其他视频或选择分辨率较低的视频进行添加！',
        '错误'
      )
    },
    check_chunk(data) {
      const source = this.sourceData.filter(item => {
        return item.src_id === data.src_id
      })[0]
      if (
        source.status > 0 &&
        source.src_type === 1 &&
        source.v_height * source.v_width >=
          this.systemmessage.melt.max_video_mix_spec * 0.9
      ) {
        const start = data.track_start
        const end = data.track_end // +  source.sum_frame
        const v_track_list = this.$store.state.all.tracks.v_track_list
        let isAbleIndex = 0
        for (const v_track of v_track_list) {
          const chunks = v_track.chunks
          if (isAbleIndex > this.systemmessage.melt.max_video_mix) break
          for (const chunk of chunks) {
            if (
              !(chunk.track_start < start && chunk.track_end <= start) ||
              (chunk.track_end > end && chunk.track_start <= end)
            ) {
              const chunk_source = this.sourceData.filter(item => {
                return item.src_id === chunk.src_id
              })[0]
              if (
                chunk_source.v_height * chunk_source.v_width >=
                  this.systemmessage.melt.max_video_mix_spec * 0.9 &&
                ++isAbleIndex >= this.systemmessage.melt.max_video_mix
              ) {
                break
              }
            }
          }
        }
        if (isAbleIndex > this.systemmessage.melt.max_video_mix) {
          this.$alert(
            '同一时间段内混合的视频数量（' +
              source.v_width +
              'x' +
              source.v_height +
              '）超出资源配置上限，请删除此时间段内其他视频或选择分辨率较低的视频进行添加！',
            '错误'
          )
        }
        return isAbleIndex > this.systemmessage.melt.max_video_mix
      }
    },
    trackSelect(e) {
      e.stopPropagation()
      this.CHANGE_IS_TRACK_SELECT(true)
    },
    trackCancel(e) {
      e.stopPropagation()
      this.CHANGE_IS_TRACK_SELECT(false)
    }
  },
  created() {
    const that = this
    if (this.chunk.preview_img != null) {
      if (this.chunk.preview_img.indexOf('nces') !== -1) {
        if (this.chunk.preview_img.indexOf('//') === -1) {
          this.prevImg = '//' + this.chunk.preview_img
        } else {
          this.prevImg = this.chunk.preview_img
        }
      } else {
        if (this.chunk.preview_img.indexOf('//') === -1) {
          this.prevImg = window.NCES.DOMAIN + this.chunk.preview_img
        } else {
          this.prevImg = this.chunk.preview_img
        }
      }
    } else {
      $.post(
        window.NCES.DOMAIN + '/api/source',
        JSON.stringify({ cmd: 'get', src_id: that.chunk.src_id }),
        function(res) {
          if (res.code !== 0) {
            console.warn(res.msg)
            return
          }
          if (that.chunk.chunk_type === 1 || that.chunk.chunk_type === 2) {
            that.max = res.data.sum_frame
          }
          if (that.chunk.chunk_type === 1) {
            that.prevImg = window.NCES.DOMAIN + res.data.preview_img
          }
          if (that.chunk.chunk_type === 2) {
            if (res.data.v_codec) {
              // that.prevImg = "//cdn.aodianyun.com/nces/v2/img/audioimg.png"
              that.prevImg = '//cdn.aodianyun.com/nces/v2/img/audioimg.png'
            } else {
              // that.prevImg = (res.data.preview_img!=null)?(NCES.DOMAIN+res.data.preview_img):"//cdn.aodianyun.com/nces/v2/img/audioimg.png"
              that.prevImg =
                res.data.preview_img != null
                  ? window.NCES.DOMAIN + res.data.preview_img
                  : '//cdn.aodianyun.com/nces/v2/img/audioimg.png'
            }
          }
          if (that.chunk.chunk_type === 4) {
            // window[that.chunk.src_id] = res.data.preview_img;
            that.prevImg = window.NCES.DOMAIN + res.data.preview_img
            // var data = new Date().getTime()
            // that.loadimgs(res.data.preview_img,function (url) {
            //         that.img.push(url)
            //  }
            //  )
          }
        },
        'json'
      )
    }
  },
  // mounted: function() {
  //   const that = this
  //   $(document).on('mousedown', function() {
  //     that.up = false
  //     that.move = false
  //     if (that.activechunk.state !== 'active') {
  //       that.ACTIVE_CHUNK({ state: 'active' })
  //     }
  //   })
  // },
  updated() {
    if (this.moveResultFlag === 1 || this.moveResultFlag === 2) {
      this.move = false
    }
  }
}
</script>

<style lang="scss" scoped>
.img-list-enter-active,
.image-list-leave-active {
  transition: all 1s;
}

.img-list-enter,
.img-list-leave-to {
  opacity: 0;
}

.track-choose {
  display: flex;
  position: absolute;
  left: -3px;

  .track-choice {
    width: 86px;
    height: 32px;
    border-radius: 3px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 32px;
    cursor: pointer;
    text-align: center;

    &.track-select {
      background: rgba(8, 143, 211, 1);
      border: 1px solid rgba(8, 143, 211, 1);
      color: rgba(255, 255, 255, 1);
    }

    &.track-cancel {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(220, 222, 226, 1);
      color: rgba(102, 102, 102, 1);
    }
  }
}
</style>
