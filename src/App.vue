<template>
  <div
    :id="this.id"
    :class="{ shadow: modalVoiceApplyIsShow || chunksetshow }"
    style="height:100vh;"
    v-cloak
    v-if="!this.startloading"
  >
    <systemmes></systemmes>
    <mzsection></mzsection>
    <videooper v-show="videooperShow && !chunksetshow"></videooper>
    <tracksection></tracksection>
    <chunkset></chunkset>
    <!-- <savevideo v-if ="this.boxset == 'savevideo'&&!this.startloading"></savevideo> -->
    <ExportVideoSet v-if="exportVideoSetShow"></ExportVideoSet>
    <saveproject v-if="this.boxset == 'saveproject'"></saveproject>
    <saveas v-if="this.boxset == 'saveas'"></saveas>
    <addtrack v-if="this.boxset == 'addtrack'"></addtrack>
    <savezc v-if="this.boxset == 'savezc'"></savezc>
    <setRecord v-if="this.boxset == 'setrecord'"></setRecord>
    <voice-apply-modal v-if="modalVoiceApplyIsShow"></voice-apply-modal>
  </div>
</template>

<script>
// import Vue from 'vue'
import _ from 'lodash'
import { mapState, mapActions, mapMutations } from 'vuex'
import systemmes from './model/Systemmes'
import mzsection from './model/mzSection/mzsection'
import videooper from './model/videooper'
import tracksection from './model/trackSection'
import chunkset from './model/chunkSet'
// import savevideo from "./model/setBox/saveVideo";
import ExportVideoSet from './model/mzSection/ExportVideoSet'
import saveproject from './model/setBox/saveProject'
import saveas from './model/setBox/saveAs'
import savezc from './model/setBox/setZc'
import addtrack from './model/setBox/addTrack'
import setRecord from './model/setBox/setRecord'
import VoiceApplyModal from './model/aiVoiceApply/VoiceApplyModal.vue'

export default {
  components: {
    systemmes,
    mzsection,
    videooper,
    tracksection,
    chunkset,
    // savevideo,
    saveproject,
    savezc,
    saveas,
    addtrack,
    ExportVideoSet,
    setRecord,
    VoiceApplyModal
  },
  data: function() {
    return {
      loadingObj: {},
      id: window.NCES.id
    }
  },
  computed: {
    ...mapState([
      'startloading',
      'onloading',
      'fontlist',
      'boxset',
      'openway',
      'videooperShow',
      'exportVideoSetShow',
      'mzsectionShow',
      'modalVoiceApplyIsShow',
      'chunksetshow'
    ]),

    loadingShow: function() {
      return this.startloading || this.onloading
    }
  },
  watch: {
    loadingShow: function(state) {
      // 检测loading状态变化
      if (state) {
        this.$loading({
          fullscreen: true,
          background: 'rgba(0, 0, 0, 0.4)',
          text: '努力加载中'
        })
      } else {
        this.getSourcedata() // 获取已经加载的源的数据
        this.GET_OPENWAY() // 获取打开的浏览器设备（pc/mobile）
        this.getcaption() // 获取字幕分类的列表
        this.getFilter() // 获取视频块的滤镜列表
        this.getSystemmesage() // 获取系统信息
        const a = $(document).width()
        this.CHANGE_CLIENTWIDTH(a) // 获取页面有效区域宽度
        const that = this
        $(document).click(function(e) {
          $('.keypress_set input').prop('checked', false)
        })
        window.NCES.Getopenapi(
          'FontCategory',
          { uin: window.NCES.uin },
          function(res) {
            for (const i in res) {
              if (res.hasOwnProperty(i)) {
                that.getfont(i)
              }
            }
          }
        )
        // 阻止平板端默认拖动效果
        document.addEventListener(
          'touchmove',
          function(e) {
            e.preventDefault() // 阻止默认的处理方式(阻止下拉滑动的效果)
          },
          { passive: false }
        ) // passive 参数不能省略，用来兼容ios和android

        this.loadingObj.close()
      }
    }
  },
  created: function() {
    this.loadingObj = this.$loading({
      fullscreen: true,
      background: 'rgba(0, 0, 0, 0.4)',
      text: '努力加载中'
    }) // 显示loading状态
    this.changeLoading(function() {
      console.log('loading success')
    }) // 判断是否已经加载完成
    this.clearHistory()
  },
  mounted() {
    // 浏览器大小改变后更新轨道位置(*** 主要是videoBox的宽高比例控制不变)
    window.addEventListener('resize', this.mixedResize)
    // 监听是否可以多选
    window.addEventListener('keydown', this.keydownEvent)
    window.addEventListener('keyup', this.keyupEvent)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.mixedResize)
    window.removeEventListener('keydown', this.keydownEvent)
    window.removeEventListener('keyup', this.keyupEvent)
  },
  methods: {
    throttleResize: _.throttle(function() {
      this.CHANGE_CLIENTWIDTH($(document).width())
      this.CHANGE_VIS_TIMER_WIDTH(
        document.querySelector('.edit_track_contents').offsetWidth
      )
    }, 200),
    debounceResize: _.debounce(function() {
      this.GET_OPENWAY()
      setTimeout(() => {
        this.UPDATE_TRACK_MIX()
      }, 1000)
    }),
    mixedResize() {
      this.throttleResize()
      this.debounceResize()
    },
    ...mapActions([
      'changeLoading',
      'getSourcedata',
      'getSystemmesage',
      'Post'
    ]),
    ...mapMutations([
      'CHANGE_CLIENTWIDTH',
      'INIT_FONTLIST',
      'GET_OPENWAY',
      'INIT_CAPTIONLIST',
      'INIT_FILTERLIST',
      'UPDATE_TRACK_MIX',
      'CHANGE_IS_MULTI_SELECT',
      'CHANGE_VIS_TIMER_WIDTH'
    ]),
    // checkstatus() {
    //   const that = this
    // },
    getFilter() {
      const that = this
      $.post(
        window.NCES.DOMAIN + '/api/filter',
        JSON.stringify({ cmd: 'all' }),
        function(res) {
          if (res.code !== 0) {
            setTimeout(that.getFilter, 500)
            return
          }
          const filterlist = []
          for (let i = 0; i < res.data.length; i++) {
            filterlist.push(res.data[i])
            if (res.data[i].service === 'mirror') {
              filterlist.push({
                name: '镜像',
                parameter: {
                  disable: 1,
                  value: 6
                },
                service: 'mirror',
                type: 1
              })
            }
          }
          that.INIT_FILTERLIST(JSON.stringify(filterlist))
        },
        'json'
      )
    },
    getcaption() {
      // 获取字幕分类的列表
      const that = this
      const data = {}
      data.type = 'caption'
      data.data = { cmd: 'style_list' }
      data.success = function(res) {
        that.INIT_CAPTIONLIST(res.data)
      }
      data.error = function(err) {
        console.log(err)
      }
      this.Post(data)
    },
    getfont(i) {
      const that = this
      window.NCES.Getopenapi(
        'FontList',
        { uin: window.NCES.uin, category: i },
        function(re) {
          that.fontlist[i] = re
          that.INIT_FONTLIST(that.fontlist)
        }
      )
    },
    clearHistory() {
      this.$axios
        .post(
          window.NCES.DOMAIN + '/api/history',
          JSON.stringify({
            cmd: 'clear',
            type: 1
          })
        )
        .then(res => {
          if (res === 'success') {
            console.log('successfully clear history')
          }
        })
    },
    keydownEvent(e) {
      const onlyCtrl =
        e.key === 'Control' && !e.shiftKey && !e.altKey && !e.metaKey
      const onlyMeta =
        e.key === 'Meta' && !e.shiftKey && !e.altKey && !e.ctrlKey
      if ((onlyCtrl || onlyMeta) && window.zindex === 1) {
        this.CHANGE_IS_MULTI_SELECT(true)
      } else {
        this.CHANGE_IS_MULTI_SELECT(false)
      }
    },
    keyupEvent(e) {
      if (!e.ctrlKey && !e.metaKey) {
        this.CHANGE_IS_MULTI_SELECT(false)
      }
    }
  }
}
</script>

<style lang="scss">
[v-cloak] {
  display: none;
}

.fchunkbox {
  border: 3px solid #3d3d3d;
  box-sizing: border-box;
  background-color: transparent;
  position: relative;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  /* transition: width 0.5s; */
}

.active.fchunkbox {
  border: 3px solid #61ded0;
}

.moveing.fchunkbox {
  border: 3px solid #0d9812;
}

.moveing1.fchunkbox {
  border: 3px solid #918732;
}

.warn.fchunkbox {
  border: 3px solid red;
}

.chunkbox > div:nth-child(1) {
  float: left;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  display: none;
  z-index: 41;
}

.active .chunkbox > div:nth-child(1) {
  display: block;
}

.chunkbox > div:nth-child(2) {
  float: right;
  width: 8px;
  height: 100%;
  cursor: ew-resize;
  display: none;
  z-index: 42;
}

.active .chunkbox > div:nth-child(2) {
  display: block;
}

.chunkbox > div:nth-child(3) {
  height: 100%;
  position: absolute;
  right: 0;
  text-align: right;
  line-height: 56px;
}
.shadow {
  background-color: #151a20 !important;
}
</style>
