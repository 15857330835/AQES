<template>
  <div class="clearfix mzsection" style="height:100%;">
    <div class="listTitle">
      <ul class="listTitle_select">
        <li
          v-for="(item, index) in nav"
          :key="item + index"
          @click="handleNavClick(item.title, item.component)"
          :class="{ active: item.title == isSelect }"
        >
          <span :class="item.name"></span>
          <span class="tab-title">{{ item.title }}</span>
        </li>
      </ul>
    </div>
    <div class="listContent">
      <keep-alive>
        <component
          :is="currentComponent"
          style="height: 100%;"
          :handleMouseDown="mousedown"
          :handleMouseMove="mousemove"
          :handleMouseUp="mouseup"
        ></component>
      </keep-alive>
    </div>
    <audio-player></audio-player>
    <keypress></keypress>
    <div
      class="fchunkbox clonediv"
      :class="this.clonediv.class"
      v-if="this.clonediv.able"
      :style="{
        zIndex: 1010,
        position: 'fixed',
        backgroundColor: 'black',
        width: this.clonediv.width + 'px',
        height: '62px',
        pointerEvents: this.clonediv.up ? '' : 'none',
        left: this.clonediv.x + 'px',
        top: this.clonediv.y + 'px',
        backgroundImage: this.clonediv.bgimg,
        backgroundSize: 'auto 100%'
      }"
    >
      <div style="position:absolute;width:100%;height:100%;overflow:hidden">
        <div
          v-for="(obj, k) in this.clonediv.imglist"
          v-bind:key="k"
          :style="{
            width: '100px',
            textAlign: 'center',
            height: '56px',
            backgroundColor: 'black',
            position: 'absolute',
            left: obj.index * 100 + 'px'
          }"
        >
          <img :src="obj.url" alt />
        </div>
      </div>
      <div
        style="position:absolute;cursor:pointer;top:65px;left:0;"
        v-show="this.clonediv.class == 'moveing1' && this.clonediv.up"
      >
        <p
          class="adapted-insert"
          :class="this.index1 == this.index2 ? 'disabled' : 'undisabled'"
        >
          适应插入
        </p>
        <p class="location-cover undisabled">位置覆盖</p>
        <p class="content-replace undisabled" v-show="isReplaceShow">
          内容替换
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import keypress from '@/model/mzSection/keypress'
// import mydir from "@/model/mzSection/mydir";
import mzView from '@/model/mzSection/selectmz/mzView'
import videoView from '@/model/mzSection/selectmz/videoView'
import imageView from '@/model/mzSection/selectmz/imageView'
import musicView from '@/model/mzSection/selectmz/musicView'
import textView from '@/model/mzSection/selectmz/textView'
import transitionView from '@/model/mzSection/selectmz/transitionView'
import captionView from '@/model/mzSection/selectmz/captionView'
import aiView from '@/model/mzSection/selectmz/aiView'
import historyView from '@/model/mzSection/selectmz/historyView'
import audioPlayer from '@/components/audioPlayer'
import { transitionAddApi } from '@/api/Transition'
import { chunkAddApi, chunkReplaceApi } from '@/api/Chunk'
import { trackPropertyAppendApi } from '@/api/Track'
import _ from 'lodash'
import axios from '@/http'

export default {
  data() {
    return {
      nav: [
        { title: '媒资', component: mzView, name: 'tab-media' },
        { title: '视频', component: videoView, name: 'tab-video' },
        { title: '图片', component: imageView, name: 'tab-image' },
        { title: '音乐', component: musicView, name: 'tab-music' },
        { title: '文本', component: textView, name: 'tab-text' },
        { title: '转场', component: transitionView, name: 'tab-trans' },
        { title: '字幕', component: captionView, name: 'tab-caption' },
        { title: '智能', component: aiView, name: 'tab-intell' },
        { title: '我的历史', component: historyView, name: 'tab-history' }
      ],
      isSelect: '媒资',
      currentComponent: mzView,
      chunkmove: false,
      xifuindex: null,
      timerLeft: null,
      timerRight: null,
      index1: null,
      index2: null,
      clonediv: {
        up: false,
        able: false,
        x: 0,
        y: 0,
        width: 6,
        src_from: '',
        src_type: '',
        src_url: '',
        src_id: '',
        type: null,
        bgimg: '',
        bgsize: '',
        frame: 0,
        imglist: [],
        onlyvideo: false,
        obj: {},
        src: '',
        jpg: '',
        class: '',
        status: 0
      },
      demo: {
        up: false,
        able: false,
        x: 0,
        y: 0,
        width: 6,
        src_from: '',
        src_type: '',
        src_url: '',
        src_id: '',
        type: null,
        bgimg: '',
        bgsize: '',
        frame: 0,
        imglist: [],
        onlyvideo: false,
        obj: {},
        src: '',
        jpg: '',
        class: ''
      },
      chunkPosition: {},
      isReplaceShow: false,
      mediaType: ''
    }
  },
  computed: {
    ...mapState([
      'sourceData',
      'trackbox',
      'trackposition',
      'all',
      'mydirshow',
      'openway',
      'filterlist',
      'slidernum',
      'Mrzydata',
      'audioStatus',
      'systemmessage',
      'sourceIndexMap',
      'chunkIndexMap'
    ]),
    tracksData() {
      return this.all.tracks
    },
    time1() {
      const length = Math.ceil((this.all.curr_track_len - 1) / 25)
      return length / 3
    },
    time2() {
      const length = Math.ceil((this.all.curr_track_len - 1) / 25)
      return length >= 60 ? (length - 60) / 5 + 60 : 60
    },
    trantime() {
      const length = Math.ceil((this.all.curr_track_len - 1) / 25)
      return Math.ceil(
        length / 3 + (length >= 60 ? (length - 60) / 5 + 60 : 60)
      )
    },
    track_property() {
      return this.$store.state.all.track_property
    }
  },
  watch: {
    tracksData: {
      immediate: true,
      handler: function() {
        this.refreshChunkPosition()
      }
    }
  },
  methods: {
    ...mapActions([
      'getSourcedata',
      'changeLoading',
      'Post',
      'sys',
      'libClear'
    ]),
    ...mapMutations([
      'CHANGE_MYDIRSHOW',
      'ACTIVE_CHUNK',
      'UPDATE_CHUNK_POSITION',
      'INIT_CHUNKS'
    ]),
    multiMediaHandler(res) {
      // console.log(res)
      if (res.code === 0) {
        if (res.data.status <= 0) {
          // if(NCES.tip_ele){
          //     $(e.target).parent().find('.'+NCES.tip_ele).show()
          // }
          console.log(`{res.data.status}:status no ready`)
          if (this.mediaType === 'muliti' && res.data.status === -2) {
            this.clonediv.status = res.data.status
          } else {
            this.clonedivInit()
          }
          return
        } else {
          if (!this.mediaType === 'text' && !res.data.a_codec) {
            this.clonediv.onlyvideo = true
          }
          this.clonediv.src_id = res.data.src_id
          this.getSourcedata()
          this.clonediv.type = res.data.src_type
          // console.log(this.clonediv.type, 22)
          if (this.clonediv.type === 3) {
            this.clonediv.width =
              250 / (this.slidernum.max - this.track_property.ratio)
            const pre_url = res.data.preview_img.replace(/https?:/, '')
            let pre_ = ''
            const reg = /^\/media\/source/
            if (reg.test(pre_url)) {
              pre_ = window.NCES.DOMAIN
            }
            this.clonediv.bgimg = `url(${pre_}${pre_url})`
            console.log(this.clonediv.bgimg)
            this.clonediv.frame = 250
          } else if (this.clonediv.type === 2) {
            this.clonediv.width =
              250 / (this.slidernum.max - this.track_property.ratio)
            this.clonediv.bgimg = `url(//${res.data.preview_img})`
            this.clonediv.frame = 250
          } else if (this.clonediv.type === 1) {
            if (typeof res.data.v_codec !== 'undefined') {
              this.clonediv.type = 1
            } else {
              this.clonediv.type = 0
            }
            this.clonediv.frame = res.data.sum_frame
            this.clonediv.src_id = res.data.src_id
            this.clonediv.width =
              res.data.sum_frame /
              (this.slidernum.max - this.track_property.ratio)
            if (
              this.mediaType === 'video' &&
              res.data.brepeat &&
              res.data.preview_img
            ) {
              let pre_ = ''
              const reg = /^\/media\/source/
              if (reg.test(res.data.preview_img)) {
                pre_ = window.NCES.DOMAIN
              }
              this.clonediv.bgimg = `url(${pre_}${res.data.preview_img})`
              console.log(this.clonediv.bgimg)
            } else {
              this.getImgs()
            }
          }
        }
        if (res.code !== 0) {
          console.warn('失败')
          // $('.tipProp_content p').html('网络波动，请刷新重试！')
          // $('.tipProp').show()
          this.clonedivInit()
        }
      }
    },
    postData(data) {
      axios
        .post(window.NCES.DOMAIN + '/api/source', JSON.stringify(data))
        .then(this.multiMediaHandler)
    },
    handleNavClick(title, component) {
      this.isSelect = title
      this.currentComponent = component
    },
    gcd(a, b) {
      let temp
      while (b !== 0) {
        temp = a % b
        // eslint-disable-next-line no-param-reassign
        a = b
        // eslint-disable-next-line no-param-reassign
        b = temp
      }
      return a
    },
    clonedivInit() {
      for (const key of Object.keys(this.clonediv)) {
        this.clonediv[key] = this.demo[key]
      }
      this.clonediv.imglist = []
      this.clonediv.obj = {}
    },
    refreshChunkPosition() {
      const v = this.all.tracks.v_track_list
      const a = this.all.tracks.a_track_list
      const chunkPosition = { a: [], v: [] }
      for (let i = 0; i < v.length; i++) {
        chunkPosition.v[i] = []
        for (let j = 0; j < v[i].chunks.length; j++) {
          chunkPosition.v[i][j] = {}
          chunkPosition.v[i][j].id = v[i].chunks[j].chunk_id
          chunkPosition.v[i][j].min = v[i].chunks[j].track_start
          chunkPosition.v[i][j].max = v[i].chunks[j].track_end
          chunkPosition.v[i][j].type = v[i].chunks[j].chunk_type
        }
      }
      for (let m = 0; m < a.length; m++) {
        chunkPosition.a[m] = []
        for (let n = 0; n < a[m].chunks.length; n++) {
          chunkPosition.a[m][n] = {}
          chunkPosition.a[m][n].id = a[m].chunks[n].chunk_id
          chunkPosition.a[m][n].min = a[m].chunks[n].track_start
          chunkPosition.a[m][n].max = a[m].chunks[n].track_end
          chunkPosition.a[m][n].type = a[m].chunks[n].chunk_type
        }
      }
      chunkPosition.v = chunkPosition.v.concat(chunkPosition.a)
      this.chunkPosition = chunkPosition
    },
    endRefresh(res) {
      this.changeLoading()
      this.clonedivInit()
      this.ACTIVE_CHUNK({ chunk: res.data, state: 'active' })
      this.UPDATE_CHUNK_POSITION()
    },
    replaceChunk(data) {
      chunkReplaceApi(data).then(res => {
        if (res.code !== 0) {
          console.warn(res.msg)
        } else {
          this.endRefresh(res)
        }
      })
    },
    // eslint-disable-next-line complexity
    createChunk(data) {
      const filterlist = JSON.parse(this.filterlist)
      const that = this
      if (!data.track_type) {
        transitionAddApi(data).then(res => {
          if (res.code !== 0) {
            this.$alert('动效时长大于素材时长，设置失败！', '提示消息', {
              confirmButtonText: '确定',
              callback: function() {
                window.zindex = 1
              }
            })
            window.zindex = 0
          }
          this.changeLoading()
          this.clonedivInit()
        })
      } else {
        let serviceList
        if (window.zindex === 3) {
          this.libClear()
        }
        if (
          data.type === 0 ||
          (data.type === 1 && parseInt(data.track_type, 10) === 2) ||
          data.track_type === 2
        ) {
          serviceList = [filterlist[0]]
        }

        if ((data.type === 1 || data.type === 3) && data.track_type === 1) {
          serviceList = []
          if (data.onlyVideo || data.type === 3) {
            for (let i = 0; i < filterlist.length; i++) {
              if (
                filterlist[i].service === 'volume' ||
                filterlist[i].service === 'mosaic'
              ) {
                continue
              } else {
                serviceList.push(filterlist[i])
              }
            }
          } else {
            // serviceList = ['volume','saturation','cutting','rotate','mirror','mosaic','exposure','brightness','halo','boxblur','coloring','contrast']
            for (let i = 0; i < filterlist.length; i++) {
              if (filterlist[i].service === 'mosaic') {
                continue
              } else {
                serviceList.push(filterlist[i])
              }
            }
          }
          for (let i = 0; i < serviceList.length; i++) {
            serviceList[i].parameter.disable = 1
            if (serviceList[i].service === 'cutting') {
              serviceList[i].parameter.softness = 0.02
            }
          }
        }

        if (data.type !== null && data.type === 2) {
          const transData = {
            mode: data.mode,
            src_id: data.src_id,
            track_id: data.track_id,
            track_type: parseInt(data.track_type, 10),
            track_start: data.track_start
          }
          chunkAddApi(transData).then(res => {
            if (res.code !== 0) {
              console.warn(res.msg)
            } else {
              this.endRefresh(res)
            }
          })
        } else if (data.type !== null) {
          const source = this.sourceData.filter(item => {
            return item.src_id === data.src_id
          })[0]
          if (source.status === -2 && source.src_type === 1) {
            that.$alert(
              '您添加的视频分辨率超出配置，请更改配置或选择分辨率较低的视频添加！',
              '错误'
            )
            that.clonedivInit()
            return
          }
          const transData = {
            src_id: data.src_id,
            mode: data.mode,
            track_id: data.track_id,
            track_type: parseInt(data.track_type, 10),
            track_start: data.track_start,
            filter: serviceList
          }
          chunkAddApi(transData).then(res => {
            if (res.code !== 0) {
              if (res.code === -1 && res.msg === 'mix video too much') {
                that.mix_error({ src_id: data.src_id })
              } else {
                console.warn(res.msg)
              }
            } else {
              this.endRefresh(res)
            }
          })
        } else {
          if (data.status === -2) {
            that.$alert(
              '您添加的视频分辨率超出配置，请更改配置或选择分辨率较低的视频添加！',
              '错误'
            )
          }
          that.changeLoading()
          that.clonedivInit()
          return
        }
      }
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
    sourcedataHas() {
      let has = false
      // console.log('sourceData:', _.cloneDeep(this.sourceData))
      for (let i = 0; i < this.sourceData.length; i++) {
        if (
          (this.sourceData[i].original_from || this.sourceData[i].from) ===
            this.clonediv.src_from ||
          (this.sourceData[i].original_from || this.sourceData[i].from) ===
            'http://' + this.clonediv.src_url
        ) {
          // console.log('has is true')
          has = true
          this.clonediv.type = this.sourceData[i].src_type
          this.clonediv.src_id = this.sourceData[i].src_id
          this.clonediv.status = this.sourceData[i].status || 0
          if (!this.sourceData[i].a_codec) {
            this.clonediv.onlyvideo = true
          }
          // console.log(this.clonediv.type, 11)
          if (this.clonediv.type === 3) {
            this.clonediv.width =
              250 / (this.slidernum.max - this.track_property.ratio)
            const pre_ =
              this.sourceData[i].preview_img.indexOf('http') === -1
                ? window.NCES.DOMAIN
                : ''
            this.clonediv.bgimg = `url(${pre_}${this.sourceData[i].preview_img})`
            console.log(this.clonediv.bgimg)
            this.clonediv.bgsize = 'auto 100%'
            this.clonediv.frame = 250
          }
          if (this.clonediv.type === 2) {
            this.clonediv.width =
              250 / (this.slidernum.max - this.track_property.ratio)
            this.clonediv.bgimg = `url(//${this.sourceData[i].preview_img})`
            this.clonediv.bgsize = 'auto 100%'
            this.clonediv.frame = 250
          }
          if (this.clonediv.type === 1) {
            if (typeof this.sourceData[i].v_codec !== 'undefined') {
              this.clonediv.type = 1
            } else {
              this.clonediv.type = 0
            }
            this.clonediv.frame = this.sourceData[i].sum_frame
            this.clonediv.src_id = this.sourceData[i].src_id
            this.clonediv.width =
              this.sourceData[i].sum_frame /
              (this.slidernum.max - this.track_property.ratio)
            this.clonediv.bgsize = '100px 56px'
            if (this.sourceData[i].brepeat && this.sourceData[i].preview_img) {
              let pre_ = ''
              const reg = /^\/media\/source/
              if (reg.test(this.sourceData[i].preview_img)) {
                pre_ = window.NCES.DOMAIN
              }
              this.clonediv.bgimg = `url(${pre_}${this.sourceData[i].preview_img})`
              console.log(this.clonediv.bgimg)
            } else {
              this.getImgs()
            }
          }
        }
      }
      return has
    },
    textHandler(j) {
      const that = this
      if (this.Mrzydata[j].text_id === this.clonediv.src_from) {
        const data = {
          cmd: 'copy',
          src_type: 2,
          content: that.Mrzydata[j]
        }
        this.mediaType = 'text'
        this.postData(data)
      }
    },
    audioHandler(j) {
      if (this.Mrzydata[j].audio_id === this.clonediv.src_from) {
        const data = {
          cmd: 'add',
          src_from: 'http://' + this.Mrzydata[j].url,
          src_type: 1,
          src_name: this.Mrzydata[j].name,
          brepeat: true
        }
        this.mediaType = 'audio'
        this.postData(data)
      }
    },
    videoHandler(j) {
      let data
      if (this.Mrzydata[j].video_id === this.clonediv.src_from) {
        if (
          this.Mrzydata[j].category === '转场' ||
          this.Mrzydata[j].category === '通用素材'
        ) {
          data = {
            cmd: 'add',
            src_from: 'http://' + this.Mrzydata[j].url,
            src_type: 1,
            src_name: this.Mrzydata[j].name
          }
        } else {
          data = {
            cmd: 'add',
            src_from: 'http://' + this.Mrzydata[j].url,
            src_type: 1,
            src_name: this.Mrzydata[j].name,
            preview_img: this.clonediv.src,
            brepeat: true
          }
        }
        this.mediaType = 'video'
        this.postData(data)
      }
    },
    imagehandler(j) {
      if (this.Mrzydata[j].image_id === this.clonediv.src_from) {
        const data = {
          cmd: 'add',
          src_from: 'http://' + this.Mrzydata[j].url,
          src_type: 3
        }
        this.mediaType = 'image'
        this.postData(data)
      }
    },
    sourcedataNone() {
      const that = this
      if (this.clonediv.service) {
        for (let m = 0; m < this.Mrzydata.length; m++) {
          if (this.Mrzydata[m].service === this.clonediv.service) {
            this.clonediv.obj = this.Mrzydata[m]
            this.clonediv.type = 5
            this.clonediv.width =
              250 / (this.slidernum.max - that.track_property.ratio)
            this.clonediv.bgimg =
              'url(' + window.NCES.DOMAIN + this.clonediv.jpg + ')'
          }
        }
      } else {
        if (this.clonediv.source) {
          for (let j = 0; j < this.Mrzydata.length; j++) {
            if (this.clonediv.source === 'text_id') {
              this.textHandler(j)
            }
            if (this.clonediv.source === 'audio_id') {
              this.audioHandler(j)
            }
            if (this.clonediv.source === 'video_id') {
              this.videoHandler(j)
            }
            if (this.clonediv.source === 'image_id') {
              this.imagehandler(j)
            }
          }
        } else {
          const data = {
            cmd: 'add',
            src_from: this.clonediv.src_from,
            src_type: this.clonediv.src_type
          }
          this.mediaType = 'muliti'
          axios
            .post(window.NCES.DOMAIN + '/api/source', JSON.stringify(data))
            .then(this.multiMediaHandler)
        }
      }
    },
    mousedown(e_para) {
      let e = e_para
      if (
        $(e.target).parents('.' + window.NCES.drag_ele).length !== 0 ||
        $(e.target).hasClass(window.NCES.drag_ele)
      ) {
        e.preventDefault()
        if (e.touches) {
          e = e.touches[0]
        }
        this.chunkmove = true
        this.clonediv.x = e.pageX - 30
        this.clonediv.y = e.pageY - 30
        this.clonediv.src_from =
          $(e.target).data('src_from') ||
          $(e.target)
            .parents('.' + window.NCES.drag_ele)
            .data('src_from')
        this.clonediv.src_url =
          $(e.target).data('src_url') ||
          $(e.target)
            .parents('.' + window.NCES.drag_ele)
            .data('src_url')
        this.clonediv.src_type =
          $(e.target).data('src_type') ||
          $(e.target)
            .parents('.' + window.NCES.drag_ele)
            .data('src_type')
        this.clonediv.service = $(e.target).data('service')
        this.clonediv.source = $(e.target).data('source')
        this.clonediv.jpg = $(e.target).data('jpg')
        this.clonediv.src = $(e.target).attr('src')
        // this.clonediv.status = $(e.target).data("status") || 0;
        if (this.openway === 'pc') {
          $(document).bind('mousemove', this.mousemove)
          $(document).one('mouseup', this.mouseup)
        }
      }
    },
    xifuHandler(e, clonediv_) {
      let faaa = 0
      let x1, x2
      let xifu = this.track_property.xifuFlag
      if (clonediv_.type === 5) {
        xifu = false
      }
      for (let i = 0; i < this.trackposition.length; i++) {
        for (let m = 0; m < this.chunkPosition.v[i].length; m++) {
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                30
            ) < 10 &&
            xifu
          ) {
            clonediv_.x = 188 - this.track_property.outLeft
            this.xifuindex = 0
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                30 -
                this.chunkPosition.v[i][m].max /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            xifu
          ) {
            clonediv_.x =
              (this.chunkPosition.v[i][m].max - 1) /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex = this.chunkPosition.v[i][m].max
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                30 -
                this.chunkPosition.v[i][m].min /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            xifu
          ) {
            clonediv_.x =
              (this.chunkPosition.v[i][m].min - 1) /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex = this.chunkPosition.v[i][m].min
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                30 +
                clonediv_.frame /
                  (this.slidernum.max - this.track_property.ratio) -
                this.chunkPosition.v[i][m].min /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            xifu
          ) {
            clonediv_.x =
              (this.chunkPosition.v[i][m].min - clonediv_.frame - 1) /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex = this.chunkPosition.v[i][m].min - clonediv_.frame
            faaa++
          }
          if (
            Math.abs(
              e.pageX +
                this.track_property.outLeft -
                this.trackposition[i].minX -
                30 +
                clonediv_.frame /
                  (this.slidernum.max - this.track_property.ratio) -
                this.chunkPosition.v[i][m].max /
                  (this.slidernum.max - this.track_property.ratio)
            ) < 10 &&
            xifu
          ) {
            clonediv_.x =
              (this.chunkPosition.v[i][m].max - clonediv_.frame - 1) /
                (this.slidernum.max - this.track_property.ratio) +
              188 -
              this.track_property.outLeft
            this.xifuindex = this.chunkPosition.v[i][m].max - clonediv_.frame
            faaa++
          }
        }
        // eslint-disable-next-line no-unused-vars
        if (faaa === 0) {
          this.xifuindex = null
        }
        if (this.xifuindex) {
          x1 = this.xifuindex
          x2 = this.xifuindex + clonediv_.frame
        } else {
          x1 =
            (e.pageX -
              this.trackposition[0].minX -
              30 +
              this.track_property.outLeft) *
            (this.slidernum.max - this.track_property.ratio)
          x2 = x1 + (clonediv_.frame || 250)
        }
      }
      return { num1: x1, num2: x2 }
    },
    sideTimer(e, clonediv_, n) {
      if (e.pageX - this.trackposition[n].minX < 20) {
        if (this.timerLeft == null) {
          this.timerLeft = setInterval(() => {
            this.track_property.outLeft =
              this.track_property.outLeft - 50 < 0
                ? 0
                : this.track_property.outLeft - 50
            clonediv_.class = 'moveing'
          }, 100)
        }
      } else {
        clearInterval(this.timerLeft)
        this.timerLeft = null
      }
      if (this.trackposition[n].maxX - e.pageX < 20) {
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
    // eslint-disable-next-line complexity
    indexHandler(clonediv_, n, x1, x2) {
      let index = 0
      for (let j = 0; j < this.chunkPosition.v[n].length; j++) {
        if (clonediv_.type === 5) {
          if (
            this.chunkPosition.v[n][j + 1] &&
            this.chunkPosition.v[n][j].max ===
              this.chunkPosition.v[n][j + 1].min &&
            x1 < this.chunkPosition.v[n][j].max &&
            x2 > this.chunkPosition.v[n][j].max &&
            this.chunkPosition.v[n][j + 1].type !== 5 &&
            this.chunkPosition.v[n][j + 1].type !== 5 &&
            this.chunkPosition.v[n][j].type !== 5 &&
            this.chunkPosition.v[n][j].type !== 5
          ) {
            index = j + 1
            this.xifuindex = j
            break
          }
        } else {
          if (
            (x1 >= this.chunkPosition.v[n][j].min &&
              x1 < this.chunkPosition.v[n][j].max) ||
            (x2 > this.chunkPosition.v[n][j].min &&
              x2 < this.chunkPosition.v[n][j].max) ||
            (this.chunkPosition.v[n][j].min >= x1 &&
              this.chunkPosition.v[n][j].min < x2) ||
            (this.chunkPosition.v[n][j].max > x1 &&
              this.chunkPosition.v[n][j].max < x2)
          ) {
            if (
              x1 >= this.chunkPosition.v[n][j].min &&
              x1 < this.chunkPosition.v[n][j].max
            ) {
              this.index1 = j
            }
            if (
              x2 > this.chunkPosition.v[n][j].min &&
              x2 < this.chunkPosition.v[n][j].max
            ) {
              this.index2 = j
            }
            if (
              (this.chunkPosition.v[n][j].min >= x1 &&
                this.chunkPosition.v[n][j].min < x2) ||
              (this.chunkPosition.v[n][j].max > x1 &&
                this.chunkPosition.v[n][j].max < x2)
            ) {
              this.index1 = 1
              this.index2 = 2
            }
            index++
          }
        }
      }
      if (clonediv_.type === 5) {
        if (index === 0) {
          clonediv_.class = 'warn'
        } else {
          clonediv_.class = 'moveing'
          index = 0
        }
      } else {
        if (index !== 0) {
          index = 0
          clonediv_.class = 'moveing1'
        } else {
          this.index1 = null
          this.index2 = null
          clonediv_.class = 'moveing'
        }
      }
    },
    // eslint-disable-next-line complexity
    mousemove(e_para) {
      e_para.preventDefault()
      e_para.stopPropagation()
      if (!this.chunkmove) {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      const clonediv_ = this.clonediv
      clonediv_.x = e.pageX - 30
      clonediv_.y = e.pageY - 30
      if (this.clonediv.able === false) {
        // console.log(_.cloneDeep(this.clonediv))
        clonediv_.able = true
        const has = this.sourcedataHas() // 判断是否已经加载过
        // console.log('Mrzydata:', _.cloneDeep(this.Mrzydata))
        if (!has) {
          console.log('load source')
          this.sourcedataNone()
        }
      }
      const trackboxScroll = $('#trackbox').scrollTop()
      if (
        e.pageX > this.trackbox.minX &&
        e.pageX < this.trackbox.maxX &&
        e.pageY > this.trackbox.minY &&
        e.pageY < this.trackbox.maxY
      ) {
        const nums = this.xifuHandler(e, clonediv_)
        const x1 = nums.num1
        const x2 = nums.num2
        for (let n = 0; n < this.trackposition.length; n++) {
          if (
            e.pageX > this.trackposition[n].minX &&
            e.pageX < this.trackposition[n].maxX &&
            e.pageY > this.trackposition[n].minY - trackboxScroll &&
            e.pageY < this.trackposition[n].maxY - trackboxScroll
          ) {
            // 左右移动
            this.sideTimer(e, clonediv_, n)
            clonediv_.y = this.trackposition[n].minY - trackboxScroll
            clonediv_.class = 'moveing'
            this.indexHandler(clonediv_, n, x1, x2)
            if (
              (clonediv_.type === 0 && this.trackposition[n].type !== 2) ||
              ((clonediv_.type === 2 || clonediv_.type === 3) &&
                this.trackposition[n].type === 2)
            ) {
              clonediv_.class = 'warn'
              return
            }
            if (
              clonediv_.type === 1 &&
              this.trackposition[n].type === 2 &&
              clonediv_.onlyvideo
            ) {
              clonediv_.class = 'warn'
              return
            }
            if (this.trackposition[n].able === 'true') {
              clonediv_.class = 'warn'
              return
            }
          }
        }
      } else {
        clonediv_.class = ''
      }
      this.clonediv = clonediv_
    },
    getDownChunk(cloneDivTrackStart, cloneDivTrackId) {
      const upChunkStart = cloneDivTrackStart
      const upChunkEnd =
        upChunkStart +
        this.clonediv.width * (this.slidernum.max - this.track_property.ratio)
      const targetTrack =
        this.all.tracks.v_track_list.find(
          item => item.track_id === cloneDivTrackId
        ) ||
        this.all.tracks.a_track_list.find(
          item => item.track_id === cloneDivTrackId
        )
      const downChunk = targetTrack.chunks.find(chunkItem => {
        return !(
          upChunkStart > chunkItem.track_end ||
          upChunkEnd < chunkItem.track_start
        )
      })
      if (downChunk) {
        return downChunk
      } else {
        console.log('chunks inter-active failed')
      }
    },
    mouseup(e_para) {
      this.chunkmove = false
      let e = e_para
      if (e.touches) {
        e = e.changedTouches[0]
      }
      this.clonediv.up = true
      let num = 0
      $(document).unbind('mousemove')
      clearInterval(this.timerLeft)
      this.timerLeft = null
      clearInterval(this.timerRight)
      this.timerRight = null
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
      for (let i = 0; i < this.trackposition.length; i++) {
        if (
          e.pageX > this.trackposition[i].minX &&
          e.pageX < this.trackposition[i].maxX &&
          e.pageY > this.trackposition[i].minY - $('#trackbox').scrollTop() &&
          e.pageY < this.trackposition[i].maxY - $('#trackbox').scrollTop() &&
          (this.clonediv.class === 'moveing' ||
            this.clonediv.class === 'moveing1')
        ) {
          let left = null
          if (this.xifuindex != null) {
            left = this.xifuindex
          } else {
            left =
              (e.pageX -
                this.trackposition[i].minX -
                30 +
                this.track_property.outLeft >
              0
                ? parseInt(
                    e.pageX -
                      this.trackposition[i].minX -
                      30 +
                      this.track_property.outLeft,
                    10
                  )
                : 0) *
              (this.slidernum.max - this.track_property.ratio)
          }
          if (this.clonediv.type === 5) {
            const data = {
              cmd: 'add',
              a_chunk_id: this.chunkPosition.v[i][this.xifuindex].id,
              b_chunk_id: this.chunkPosition.v[i][this.xifuindex + 1].id,
              transition: this.clonediv.obj
            }
            this.INIT_CHUNKS()
            this.createChunk(data)
            return
          } else {
            this.INIT_CHUNKS()
            if (this.clonediv.class === 'moveing') {
              const commonData = {
                src_id: this.clonediv.src_id,
                track_id: this.trackposition[i].id,
                track_type: this.trackposition[i].type,
                track_start: parseInt(left, 10),
                type: this.clonediv.type,
                status: this.clonediv.status,
                onlyVideo: this.clonediv.onlyvideo
              }
              this.createChunk(commonData)
            } else {
              // moving1的冲突状态
              const currentDownChunk = this.getDownChunk(
                left,
                this.trackposition[i].id
              )
              if (!currentDownChunk) {
                console.warn('get down chunk failed')
              }
              const cloneTypeString = this.sourceIndexMap.get(
                this.clonediv.type
              )
              const downTypeString = this.chunkIndexMap.get(
                currentDownChunk.chunk_type
              )
              if (
                cloneTypeString === downTypeString &&
                cloneTypeString !== 'text'
              ) {
                this.isReplaceShow = true
              } else {
                this.isReplaceShow = false
              }
              window.zindex = 5
              $('.adapted-insert').one('mousedown', e2 => {
                e2.stopPropagation()
                const insertData = {
                  src_id: this.clonediv.src_id,
                  mode: 3,
                  track_id: this.trackposition[i].id,
                  track_type: this.trackposition[i].type,
                  track_start: parseInt(left, 10),
                  type: this.clonediv.type,
                  status: this.clonediv.status,
                  onlyVideo: this.clonediv.onlyvideo
                }
                this.createChunk(insertData)
                window.zindex = 1
              })
              $('.location-cover').one('mousedown', e3 => {
                e3.stopPropagation()
                const coverData = {
                  src_id: this.clonediv.src_id,
                  mode: 1,
                  track_id: this.trackposition[i].id,
                  track_type: this.trackposition[i].type,
                  track_start: parseInt(left, 10),
                  type: this.clonediv.type,
                  status: this.clonediv.status,
                  onlyVideo: this.clonediv.onlyvideo
                }
                this.createChunk(coverData)
                window.zindex = 1
              })
              if (this.isReplaceShow) {
                $('.content-replace').one('mousedown', e4 => {
                  e4.stopPropagation()
                  if (
                    window.localStorage.getItem(
                      'notShowReplaceTip_aodianyun'
                    ) !== 'true_aodianyun' &&
                    !this.track_property.not_show_replace_tip
                  ) {
                    this.$confirm(
                      '为保证效果，建议使用长度相近素材替换',
                      '确认信息',
                      {
                        confirmButtonText: '确认',
                        cancelButtonText: '不再提示'
                      }
                    )
                      .then(() => {
                        console.log('用户确认替换')
                      })
                      .catch(action => {
                        window.localStorage.setItem(
                          'notShowReplaceTip_aodianyun',
                          'true_aodianyun'
                        )
                        trackPropertyAppendApi({
                          track_property: { not_show_replace_tip: true }
                        }).then(res => {
                          if (res.code === 0) {
                            console.log('add notShowReplaceTip success')
                            this.changeLoading()
                          }
                        })
                      })
                  }
                  const replaceData = {
                    chunk_id: currentDownChunk.chunk_id,
                    src_id: this.clonediv.src_id
                  }
                  this.replaceChunk(replaceData)
                  window.zindex = 1
                })
              }
              $('html').one('mousedown', () => {
                this.clonedivInit()
                window.zindex = 1
              })
            }
          }

          break
        } else {
          num++
        }
        if (num === this.trackposition.length) {
          this.clonedivInit()
        }
      }
    },
    getImgs() {
      const that = this
      const endposition =
        this.clonediv.frame >
        1920 * (this.slidernum.max - this.track_property.ratio)
          ? 1920 * (this.slidernum.max - this.track_property.ratio)
          : this.clonediv.frame
      if (this.clonediv.type === 1) {
        $.post(
          window.NCES.DOMAIN + '/api/source',
          JSON.stringify({
            cmd: 'get_imgs',
            src_id: this.clonediv.src_id,
            img_h: 56,
            r_interval: parseInt(
              (this.slidernum.max - this.track_property.ratio) * 100,
              10
            ),
            pixel_ratio: parseFloat(
              (this.slidernum.max - this.track_property.ratio).toFixed(2)
            ),
            src_start: 0,
            src_end: Math.ceil(endposition)
          }),
          function(res) {
            if (res.code === 0) {
              if (res.data.v.length > 0) {
                for (let i = 0; i < res.data.v.length; i++) {
                  // eslint-disable-next-line no-unused-vars
                  const url =
                    'url(//' +
                    window.NCES.domain +
                    '.' +
                    window.NCES.uin +
                    '.lcps.aodianyun.com:3002' +
                    res.data.v[i] +
                    ') ' +
                    i * 100 +
                    'px 0px  no-repeat '
                  that.loadimg(window.NCES.DOMAIN + res.data.v[i], i)
                }
              }
            }
          },
          'json'
        )
      }
      if (this.clonediv.type === 0) {
        $.post(
          window.NCES.DOMAIN + '/api/source',
          JSON.stringify({
            cmd: 'get_imgs',
            src_id: this.clonediv.src_id,
            pixel_ratio: parseFloat(
              (this.slidernum.max - this.track_property.ratio).toFixed(2)
            ),
            img_h: 56
          }),
          function(res) {
            if (res.code !== 0) {
              console.warn(res.msg)
            }
            that.loadimg(window.NCES.DOMAIN + res.data.a[0], 0)
          },
          'json'
        )
      }
    },
    loadimg(src, url) {
      const that = this
      const img = new Image()
      img.style.position = 'absolute'

      img.onload = function() {
        that.clonediv.imglist.push({
          url: src,
          index: url
        })
      }
      img.onerror = function() {
        setTimeout(function() {
          that.loadimg(src, url)
        }, 300)
      }
      // img.src=src+'?'+Math.random();
      img.src = src
    }
  },
  components: {
    mzView,
    videoView,
    imageView,
    musicView,
    textView,
    transitionView,
    captionView,
    aiView,
    historyView,
    keypress,
    audioPlayer
  }
}
</script>

<style lang="scss" scoped>
$base-url: '../../../';
.listTitle {
  height: 50px;
  font-size: 12px;
  background-color: #212931;
  position: relative;
  border-bottom: 2px solid #151a20;
  ul {
    display: inline-block;
    height: 100%;
    li {
      float: left;
      padding: 5px 15px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 40px;
      position: relative;
      > span:first-of-type {
        cursor: pointer;
        height: 16px;
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
      }
      .tab-media {
        background-image: url($base-url+'img/media.png');
      }
      .tab-video {
        background-image: url($base-url+'img/vtrack.png');
      }
      .tab-image {
        background-image: url($base-url+'img/image.png');
      }
      .tab-music {
        background-image: url($base-url+'img/atrack.png');
      }
      .tab-text {
        background-image: url($base-url+'img/text.png');
      }
      .tab-trans {
        background-image: url($base-url+'img/trans.png');
      }
      .tab-caption {
        background-image: url($base-url+'img/ziti.png');
      }
      .tab-intell {
        background-image: url($base-url+'img/idea.png');
      }
      .tab-history {
        background-image: url($base-url+'img/history.png');
      }
      &.active,
      &:hover {
        color: #61ded0;
        &::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 1px;
          top: 50px;
          left: 0;
          z-index: 99;
          background-color: #61ded0;
        }
        .tab-media {
          background-image: url($base-url+'img/media_a.png');
        }
        .tab-video {
          background-image: url($base-url+'img/vtrack_a.png');
        }
        .tab-image {
          background-image: url($base-url+'img/image_a.png');
        }
        .tab-music {
          background-image: url($base-url+'img/atrack_a.png');
        }
        .tab-text {
          background-image: url($base-url+'img/text_a.png');
        }
        .tab-trans {
          background-image: url($base-url+'img/trans_a.png');
        }
        .tab-caption {
          background-image: url($base-url+'img/ziti_a.png');
        }
        .tab-intell {
          background-image: url($base-url+'img/idea_a.png');
        }
        .tab-history {
          background-image: url($base-url+'img/history_a.png');
        }
      }
    }
  }
}
</style>
