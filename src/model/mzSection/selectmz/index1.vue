<template>
  <div class="clearfix" style="height:100%;pointer:relative">
    <div class="listTitle">
      <span></span>
      <ul class="listTitle_select">
        <li class="active" @click="setleftlist(mzList, $event.currentTarget)">
          媒资
        </li>
        <li @click="setleftlist(videoList, $event.currentTarget)">视频</li>
        <li @click="setleftlist(tpList, $event.currentTarget)">图片</li>
        <li @click="setleftlist(audioList, $event.currentTarget)">音乐</li>
        <li @click="setleftlist(textList, $event.currentTarget)">文本</li>
        <li @click="setleftlist(zcList, $event.currentTarget)">转场</li>
        <li @click="setleftlist(captionList, $event.currentTarget)">字幕</li>
        <li @click="setleftlist(aicaptionList, $event.currentTarget)">智能</li>
        <li
          @click="setleftlist(historyList, $event.currentTarget)"
          class="my_history"
        >
          我的历史
        </li>
      </ul>
    </div>
    <div class="listContent">
      <div class="videolist_left">
        <ul class="list_leftlist" v-html="this.html"></ul>
      </div>
      <div
        class="videolist_right"
        @mousedown.left="mousedown"
        @touchstart="mousedown"
        @touchmove="mousemove"
        @touchend="mouseup"
      >
        <keep-alive v-show="!this.mydirshow">
          <div style="position:absolute;width:100%;height:100%">
            <div class="videolist_right_search"></div>
            <div class="video_option" style="height:calc(100% - 90px)"></div>
            <div class="videolist_right_bottom"></div>
          </div>
        </keep-alive>
        <keep-alive>
          <mydir v-if="this.mydirshow"></mydir>
        </keep-alive>
        <audio id="audio" src></audio>
      </div>
    </div>
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
          class="charu"
          :class="this.index1 == this.index2 ? 'disabled' : 'undisabled'"
        >
          适应插入
        </p>
        <p class="fugai undisabled">位置覆盖</p>
      </div>
    </div>
  </div>
</template>
<script>
/* eslint-disable */
import { mapState, mapActions, mapMutations } from 'vuex'
import keypress from '@/model/mzSection/keypress'
import mydir from '@/model/mzSection/mydir'

export default {
  data: function() {
    return {
      activateNav: '',
      chunkmove: false,
      obj: { chunk_id: '', track_id: '', track_end: '' },
      position: {},
      musictab: {},
      musiclist: [],
      html: NCES.mz_obj + '<li  class = "myDir">我的素材</li>',
      mzList: NCES.mz_obj + '<li  class = "myDir">我的素材</li>',
      tpList: '',
      videoList: '',
      audioList: '',
      textList: '',
      zcList: '',
      captionList:
        '<li onclick = "NCES.Getcaptionstyles()" class = "active">字幕列表</li>',
      aicaptionList: '<li  class = "aicaptions active">智能字幕</li>',
      historyList:
        '<li onclick = "NCES.Getsomehistory(1,1)" class = "active">历史媒资</li><li onclick = "NCES.Getsomehistory(2,1)">历史文本</li><li onclick = "NCES.Getsomehistory(3,1)">历史图片</li>',
      divindex: 1003,
      aidatalist: [],
      xifuindex: null,
      timerLeft: null,
      timerRight: null,
      index1: null,
      index2: null,
      srcid: null,
      nowtime: 0,
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
        service: undefined,
        source: undefined,
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
        service: undefined,
        source: undefined,
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
      }
    }
  },
  components: {
    keypress,
    mydir
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
      'slidernum'
    ]),
    time1: function() {
      const length = Math.ceil((this.all.curr_track_len - 1) / 25)
      return length / 3
    },
    time2: function() {
      const length = Math.ceil((this.all.curr_track_len - 1) / 25)
      return length >= 60 ? (length - 60) / 5 + 60 : 60
    },
    trantime: function() {
      // ***move
      const length = Math.ceil((this.all.curr_track_len - 1) / 25)
      return Math.ceil(
        length / 3 + (length >= 60 ? (length - 60) / 5 + 60 : 60)
      )
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    chunkPosition: function(v, a) {
      if (this.all == undefined) {
        return
      } else {
        var v = this.all.tracks.v_track_list
        var a = this.all.tracks.a_track_list
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
        return chunkPosition
      }
    }
  },
  watch: {
    trackposition(v, old) {
      return v
    }
  },
  methods: {
    ...mapActions([
      'getSourcedata',
      'changeLoading',
      'Post',
      'getSourcedata',
      'sys'
    ]),
    ...mapMutations(['CHANGE_MYDIRSHOW', 'ACTIVE_CHUNK']),
    temp() {},
    gcd(a, b) {
      let temp
      while (b != 0) {
        temp = a % b
        a = b
        b = temp
      }
      return a
    },
    clonedivInit() {
      for (const key in this.clonediv) {
        this.clonediv[key] = this.demo[key]
      }
      this.clonediv.imglist = []
      this.clonediv.obj = {}
    },
    getChunkPosition: function(v, a) {
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
    Getaicaptionstyles() {
      const that = this
      const data = {}
      data.type = 'ai'
      data.data = { cmd: 'list' }
      data.success = function(res) {
        that.aidatalist = res.data
        const obj = {}
        obj.type = 'ai'
        obj.data = { cmd: 'status' }
        obj.success = function(a) {
          if (
            a.data.service == null ||
            (a.data.service != null && a.data.state == 'error')
          ) {
            let html = ''
            for (let i = 0; i < res.data.length; i++) {
              html +=
                '<div class = "video_option_content" style = "width:100%;box-sizing:border-box;height:90px;padding:5px 5px 0px;margin-bottom:15px"> \
                                        <div class = "content_top" style = "height:85px"> \
                                            <img  src= "//' +
                res.data[i].preview_img +
                '" alt="" class = "content_top_img"  style = "height:85px;width:100%;cursor:auto" mousedown = function(e){e.preventDefault()} /> \
                                            <span  class = "znTouse" data-index = "' +
                i +
                '" data-service = "' +
                res.data[i].service +
                '">应用</span>\
                                            <span class = "znTitle">' +
                res.data[i].name +
                '</span>\
                                        </div> \
                                    </div>'
            }
            NCES.Setcontent({ center: '<div>' + html + '</div>' })
          } else {
            that.changeing(a.data.service)
            // Hub.$emit('changeing',res.data.service)
          }
        }
        that.Post(obj)
      }
      data.error = function(res) {
        window.zindex = 0
        that.$alert('获取ailist失败！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        console.log('获取ailist失败:' + res.msg)
      }
      that.Post(data)
    },
    createChunk: function(data) {
      const filterlist = JSON.parse(this.filterlist)
      const that = this
      if (!data.track_type) {
        $.post(
          NCES.DOMAIN + '/api/transition',
          JSON.stringify(data),
          function(res) {
            if (res.code !== 0) {
              that.$alert('动效时长大于素材时长，设置失败！', '提示消息', {
                confirmButtonText: '确定',
                callback: function() {
                  window.zindex = 1
                }
              })
              window.zindex = 0
            }
            that.changeLoading()
            that.clonedivInit()
          },
          'json'
        )
      } else {
        if (
          data.type == 0 ||
          (data.type == 1 && parseInt(data.track_type) == 2) ||
          data.track_type == 2
        ) {
          var serviceList = [filterlist[0]]
        }

        if ((data.type == 1 || data.type == 3) && data.track_type == 1) {
          serviceList = []
          if (data.onlyVideo || data.type == 3) {
            for (var i = 0; i < filterlist.length; i++) {
              if (
                filterlist[i].service == 'volume' ||
                filterlist[i].service == 'mosaic'
              ) {
                continue
              } else {
                serviceList.push(filterlist[i])
              }
            }
          } else {
            // serviceList = ['volume','saturation','cutting','rotate','mirror','mosaic','exposure','brightness','halo','boxblur','coloring','contrast']
            for (var i = 0; i < filterlist.length; i++) {
              if (filterlist[i].service == 'mosaic') {
                continue
              } else {
                serviceList.push(filterlist[i])
              }
            }
          }
          for (var i = 0; i < serviceList.length; i++) {
            serviceList[i].parameter.disable = 1
            if (serviceList[i].service == 'cutting') {
              serviceList[i].parameter.softness = 0.02
            }
          }
        }

        if (data.type == 2) {
          $.post(
            NCES.DOMAIN + '/api/chunk',
            JSON.stringify({
              cmd: 'add',
              mode: data.mode,
              src_id: data.src_id,
              track_id: data.track_id,
              track_type: parseInt(data.track_type),
              track_start: data.track_start
            }),
            function(res) {
              if (res.code !== 0) {
                console.warn(res.msg)
              }
              that.changeLoading()
              that.clonedivInit()
              that.ACTIVE_CHUNK({ chunk: res.data, state: 'active' })
            },
            'json'
          )
        } else {
          $.post(
            NCES.DOMAIN + '/api/chunk',
            JSON.stringify({
              cmd: 'add',
              src_id: data.src_id,
              mode: data.mode,
              track_id: data.track_id,
              track_type: parseInt(data.track_type),
              track_start: data.track_start,
              filter: serviceList
            }),
            function(res) {
              if (res.code !== 0) {
                console.warn(res.msg)
              }
              that.changeLoading()
              that.clonedivInit()
              that.ACTIVE_CHUNK({ chunk: res.data, state: 'active' })
            },
            'json'
          )
        }
      }
    },
    sourcedataHas() {
      const that = this
      let has = false
      for (let i = 0; i < this.sourceData.length; i++) {
        if (
          this.sourceData[i].from == this.clonediv.src_from ||
          this.sourceData[i].from == 'http://' + this.clonediv.src_url
        ) {
          has = true
          this.clonediv.type = this.sourceData[i].src_type
          this.clonediv.src_id = this.sourceData[i].src_id
          if (!this.sourceData[i].a_codec) {
            this.clonediv.onlyvideo = true
          }
          if (this.clonediv.type == 3) {
            this.clonediv.width =
              250 / (this.slidernum.max - that.track_property.ratio)
            this.clonediv.bgimg =
              'url(' +
              (this.sourceData[i].preview_img.indexOf('http') == -1
                ? NCES.DOMAIN
                : '') +
              this.sourceData[i].preview_img +
              ')'
            this.clonediv.bgsize = 'auto 100%'
            this.clonediv.frame = 250
          }
          if (this.clonediv.type == 2) {
            this.clonediv.width =
              250 / (this.slidernum.max - that.track_property.ratio)
            this.clonediv.bgimg =
              'url(//' + this.sourceData[i].preview_img + ')'
            this.clonediv.bgsize = 'auto 100%'
            this.clonediv.frame = 250
          }
          if (this.clonediv.type == 1) {
            if (this.sourceData[i].v_codec != undefined) {
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

            if (this.sourceData[i].brepeat) {
              this.clonediv.bgimg =
                'url(' + NCES.DOMAIN + that.sourceData[i].preview_img + ')'
            } else {
              this.getImgs()
            }
          }
        }
      }
      return has
    },
    sourcedataNone() {
      // console.log("none");
      const that = this
      if (this.clonediv.service) {
        for (let m = 0; m < window.Mrzydata.length; m++) {
          if (window.Mrzydata[m].service == this.clonediv.service) {
            this.clonediv.obj = window.Mrzydata[m]
            this.clonediv.type = 5
            this.clonediv.width =
              250 / (this.slidernum.max - that.track_property.ratio)
            this.clonediv.bgimg = 'url(' + NCES.DOMAIN + this.clonediv.jpg + ')'
          }
        }
      } else {
        if (this.clonediv.source) {
          for (let j = 0; j < window.Mrzydata.length; j++) {
            if (this.clonediv.source == 'text_id') {
              if (window.Mrzydata[j].text_id == this.clonediv.src_from) {
                $.post(
                  NCES.DOMAIN + '/api/source',
                  JSON.stringify({
                    cmd: 'copy',
                    src_type: 2,
                    content: window.Mrzydata[j]
                  }),
                  function(res) {
                    that.clonediv.src_id = res.data.src_id
                    if (res.code === 0) {
                      if (res.data.status <= 0) {
                        // if(NCES.tip_ele){
                        //     $(e.target).parent().find('.'+NCES.tip_ele).show()
                        // }
                        that.clonedivInit()

                        return
                      } else {
                        that.getSourcedata()
                        that.clonediv.type = res.data.src_type
                        if (that.clonediv.type == 3) {
                          that.clonediv.width =
                            250 /
                            (that.slidernum.max - that.track_property.ratio);
(that.clonediv.bgimg =
                            'url(' +
                            res.data.preview_img.replace(/https?:/, '') +
                            ')'),
                            (that.clonediv.frame = 250)
                        }
                        if (that.clonediv.type == 2) {
                          that.clonediv.width =
                            250 /
                            (that.slidernum.max - that.track_property.ratio);
(that.clonediv.bgimg =
                            'url(//' + res.data.preview_img + ')'),
                            (that.clonediv.frame = 250)
                        }
                        if (that.clonediv.type == 1) {
                          if (res.data.v_codec != undefined) {
                            that.clonediv.type = 1
                          } else {
                            that.clonediv.type = 0
                          }
                          that.clonediv.frame = res.data.sum_frame
                          that.clonediv.src_id = res.data.src_id
                          that.clonediv.width =
                            res.data.sum_frame /
                            (that.slidernum.max - that.track_property.ratio)
                          that.getImgs()
                        }
                      }
                      if (res.code !== 0) {
                        console.warn('失败')
                        that.clonedivInit()
                      }
                    }
                  },
                  'json'
                )
              }
            }
            if (this.clonediv.source == 'audio_id') {
              if (window.Mrzydata[j].audio_id == this.clonediv.src_from) {
                var data = {
                  cmd: 'add',
                  src_from: 'http://' + window.Mrzydata[j].url,
                  src_type: 1,
                  src_name: window.Mrzydata[j].name,
                  brepeat: true
                }
                $.post(
                  NCES.DOMAIN + '/api/source',
                  JSON.stringify(data),
                  function(res) {
                    if (!res.data.a_codec) {
                      that.clonediv.onlyvideo = true
                    }
                    that.clonediv.src_id = res.data.src_id
                    if (res.code === 0) {
                      if (res.data.status <= 0) {
                        // if(NCES.tip_ele){
                        //     $(e.target).parent().find('.'+NCES.tip_ele).show()
                        // }
                        that.clonedivInit()

                        return
                      } else {
                        that.getSourcedata()
                        that.clonediv.type = res.data.src_type
                        if (that.clonediv.type == 3) {
                          that.clonediv.width =
                            250 /
                            (that.slidernum.max - that.track_property.ratio);
(that.clonediv.bgimg =
                            'url(' +
                            res.data.preview_img.replace(/https?:/, '') +
                            ')'),
                            (that.clonediv.frame = 250)
                        }

                        if (that.clonediv.type == 1) {
                          if (res.data.v_codec != undefined) {
                            that.clonediv.type = 1
                          } else {
                            that.clonediv.type = 0
                          }
                          that.clonediv.frame = res.data.sum_frame
                          that.clonediv.src_id = res.data.src_id;
(that.clonediv.width =
                            res.data.sum_frame /
                            (that.slidernum.max - that.track_property.ratio)),
                            that.getImgs()
                        }
                      }
                      if (res.code !== 0) {
                        console.warn('失败')
                        // $('.tipProp_content p').html('网络波动，请刷新重试！')
                        // $('.tipProp').show()
                        that.clonedivInit()
                      }
                    }
                  },
                  'json'
                )
              }
            }
            if (this.clonediv.source == 'video_id') {
              if (window.Mrzydata[j].video_id == this.clonediv.src_from) {
                if (
                  window.Mrzydata[j].category == '转场' ||
                  window.Mrzydata[j].category == '通用素材'
                ) {
                  var data = {
                    cmd: 'add',
                    src_from: 'http://' + window.Mrzydata[j].url,
                    src_type: 1,
                    src_name: window.Mrzydata[j].name
                  }
                } else {
                  data = {
                    cmd: 'add',
                    src_from: 'http://' + window.Mrzydata[j].url,
                    src_type: 1,
                    src_name: window.Mrzydata[j].name,
                    preview_img: this.clonediv.src,
                    brepeat: true
                  }
                }
                $.post(
                  NCES.DOMAIN + '/api/source',
                  JSON.stringify(data),
                  function(res) {
                    if (!res.data.a_codec) {
                      that.clonediv.onlyvideo = true
                    }
                    that.clonediv.src_id = res.data.src_id
                    if (res.code === 0) {
                      if (res.data.status <= 0) {
                        // if(NCES.tip_ele){
                        //     $(e.target).parent().find('.'+NCES.tip_ele).show()
                        // }
                        that.clonedivInit()

                        return
                      } else {
                        that.getSourcedata()
                        that.clonediv.type = res.data.src_type
                        if (that.clonediv.type == 3) {
                          (that.clonediv.width =
                            250 /
                            (that.slidernum.max - that.track_property.ratio)),
                            (that.clonediv.bgimg =
                              'url(' +
                              res.data.preview_img.replace(/https?:/, '') +
                              ')')
                          that.clonediv.frame = 250
                        }
                        if (that.clonediv.type == 1) {
                          if (res.data.v_codec != undefined) {
                            that.clonediv.type = 1
                          } else {
                            that.clonediv.type = 0
                          }
                          that.clonediv.frame = res.data.sum_frame
                          that.clonediv.src_id = res.data.src_id
                          that.clonediv.width =
                            res.data.sum_frame /
                            (that.slidernum.max - that.track_property.ratio)
                          if (res.data.brepeat) {
                            that.clonediv.bgimg =
                              'url(' + res.data.preview_img + ')'
                          } else {
                            that.getImgs()
                          }
                        }
                      }
                      if (res.code !== 0) {
                        console.warn('失败')
                        // $('.tipProp_content p').html('网络波动，请刷新重试！')
                        // $('.tipProp').show()
                        that.clonedivInit()
                      }
                    }
                  },
                  'json'
                )
              }
            }
            if (this.clonediv.source == 'image_id') {
              if (window.Mrzydata[j].image_id == this.clonediv.src_from) {
                $.post(
                  NCES.DOMAIN + '/api/source',
                  JSON.stringify({
                    cmd: 'add',
                    src_from: 'http://' + window.Mrzydata[j].url,
                    src_type: 3
                  }),
                  function(res) {
                    if (!res.data.a_codec) {
                      that.clonediv.onlyvideo = true
                    }
                    that.clonediv.src_id = res.data.src_id
                    if (res.code === 0) {
                      if (res.data.status <= 0) {
                        // if(NCES.tip_ele){
                        //     $(e.target).parent().find('.'+NCES.tip_ele).show()
                        // }
                        that.clonedivInit()

                        return
                      } else {
                        that.getSourcedata()
                        that.clonediv.type = res.data.src_type
                        if (that.clonediv.type == 3) {
                          that.clonediv.width =
                            250 /
                            (that.slidernum.max - that.track_property.ratio)
                          that.clonediv.bgimg =
                            'url(' +
                            res.data.preview_img.replace(/https?:/, '') +
                            ')'
                          that.clonediv.frame = 250
                        }
                        if (that.clonediv.type == 1) {
                          if (res.data.v_codec != undefined) {
                            that.clonediv.type = 1
                          } else {
                            that.clonediv.type = 0
                          }
                          that.clonediv.frame = res.data.sum_frame
                          that.clonediv.src_id = res.data.src_id
                          that.clonediv.width =
                            res.data.sum_frame /
                            (that.slidernum.max - that.track_property.ratio)
                          that.getImgs()
                        }
                      }
                      if (res.code !== 0) {
                        console.warn('失败')
                        // $('.tipProp_content p').html('网络波动，请刷新重试！')
                        // $('.tipProp').show()
                        that.clonedivInit()
                      }
                    }
                  },
                  'json'
                )
              }
            }
          }
        } else {
          $.post(
            NCES.DOMAIN + '/api/source',
            JSON.stringify({
              cmd: 'add',
              src_from: this.clonediv.src_from,
              src_type: this.clonediv.src_type
            }),
            function(res) {
              if (res.code === 0) {
                if (!res.data.a_codec) {
                  that.clonediv.onlyvideo = true
                }
                that.clonediv.src_id = res.data.src_id
                if (res.data.status <= 0) {
                  // if(NCES.tip_ele){
                  //     $(e.target).parent().find('.'+NCES.tip_ele).show()
                  // }
                  that.clonedivInit()

                  return
                } else {
                  that.getSourcedata()
                  that.clonediv.type = res.data.src_type
                  if (that.clonediv.type == 3) {
                    that.clonediv.width =
                      250 / (that.slidernum.max - that.track_property.ratio)
                    that.clonediv.bgimg =
                      'url(' + res.data.preview_img.replace(/https?:/, '') + ')'
                    that.clonediv.frame = 250
                  }
                  if (that.clonediv.type == 1) {
                    if (res.data.v_codec != undefined) {
                      that.clonediv.type = 1
                    } else {
                      that.clonediv.type = 0
                    }
                    that.clonediv.frame = res.data.sum_frame
                    that.clonediv.src_id = res.data.src_id
                    that.clonediv.width =
                      res.data.sum_frame /
                      (that.slidernum.max - that.track_property.ratio)

                    that.getImgs()
                  }
                }
                if (res.code !== 0) {
                  console.warn('失败')
                  that.clonedivInit()
                }
              }
            },
            'json'
          )
        }
      }
    },
    mousedown: function(e) {
      if (
        $(e.target).parents('.' + NCES.drag_ele).length != 0 ||
        $(e.target).hasClass(NCES.drag_ele)
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
            .parents('.' + NCES.drag_ele)
            .data('src_from')
        this.clonediv.src_url =
          $(e.target).data('src_url') ||
          $(e.target)
            .parents('.' + NCES.drag_ele)
            .data('src_url')
        this.clonediv.src_type =
          $(e.target).data('src_type') ||
          $(e.target)
            .parents('.' + NCES.drag_ele)
            .data('src_type')
        this.clonediv.service = $(e.target).data('service')
        this.clonediv.source = $(e.target).data('source')
        this.clonediv.jpg = $(e.target).data('jpg')
        this.clonediv.src = $(e.target).attr('src')
        if (this.openway == 'pc') {
          $(document).bind('mousemove', this.mousemove)
          $(document).one('mouseup', this.mouseup)
        }
      }
    },
    mousemove: function(e) {
      e.preventDefault()

      if (!this.chunkmove) {
        return
      }
      e.stopPropagation()
      if (e.touches) {
        e = e.touches[0]
      }
      const that = this
      const clonediv_ = this.clonediv
      clonediv_.x = e.pageX - 30
      clonediv_.y = e.pageY - 30
      if (this.clonediv.able == false) {
        clonediv_.able = true
        const has = this.sourcedataHas() // 判断是否已经加载过
        if (!has) {
          this.sourcedataNone()
        }
      }
      const trackboxScroll = $('#trackbox').scrollTop()
      if (
        e.pageX > that.trackbox.minX &&
        e.pageX < that.trackbox.maxX &&
        e.pageY > that.trackbox.minY &&
        e.pageY < that.trackbox.maxY
      ) {
        let faaa = 0
        var xifu = that.track_property.xifuFlag
        if (clonediv_.type == 5) {
          var xifu = false
        }
        for (let i = 0; i < that.trackposition.length; i++) {
          for (let m = 0; m < that.chunkPosition.v[i].length; m++) {
            if (
              Math.abs(
                e.pageX +
                  that.track_property.outLeft -
                  that.trackposition[i].minX -
                  30
              ) < 10 &&
              xifu
            ) {
              clonediv_.x = 188 - that.track_property.outLeft
              that.xifuindex = 0
              faaa++
            }
            if (
              Math.abs(
                e.pageX +
                  that.track_property.outLeft -
                  that.trackposition[i].minX -
                  30 -
                  that.chunkPosition.v[i][m].max /
                    (that.slidernum.max - that.track_property.ratio)
              ) < 10 &&
              xifu
            ) {
              clonediv_.x =
                (that.chunkPosition.v[i][m].max - 1) /
                  (that.slidernum.max - that.track_property.ratio) +
                188 -
                that.track_property.outLeft
              that.xifuindex = that.chunkPosition.v[i][m].max
              faaa++
            }
            if (
              Math.abs(
                e.pageX +
                  that.track_property.outLeft -
                  that.trackposition[i].minX -
                  30 -
                  that.chunkPosition.v[i][m].min /
                    (that.slidernum.max - that.track_property.ratio)
              ) < 10 &&
              xifu
            ) {
              clonediv_.x =
                (that.chunkPosition.v[i][m].min - 1) /
                  (that.slidernum.max - that.track_property.ratio) +
                188 -
                that.track_property.outLeft
              that.xifuindex = that.chunkPosition.v[i][m].min
              faaa++
            }
            if (
              Math.abs(
                e.pageX +
                  that.track_property.outLeft -
                  that.trackposition[i].minX -
                  30 +
                  clonediv_.frame /
                    (that.slidernum.max - that.track_property.ratio) -
                  that.chunkPosition.v[i][m].min /
                    (that.slidernum.max - that.track_property.ratio)
              ) < 10 &&
              xifu
            ) {
              clonediv_.x =
                (that.chunkPosition.v[i][m].min - clonediv_.frame - 1) /
                  (that.slidernum.max - that.track_property.ratio) +
                188 -
                that.track_property.outLeft
              that.xifuindex = that.chunkPosition.v[i][m].min - clonediv_.frame
              faaa++
            }
            if (
              Math.abs(
                e.pageX +
                  that.track_property.outLeft -
                  that.trackposition[i].minX -
                  30 +
                  clonediv_.frame /
                    (that.slidernum.max - that.track_property.ratio) -
                  that.chunkPosition.v[i][m].max /
                    (that.slidernum.max - that.track_property.ratio)
              ) < 10 &&
              xifu
            ) {
              clonediv_.x =
                (that.chunkPosition.v[i][m].max - clonediv_.frame - 1) /
                  (that.slidernum.max - that.track_property.ratio) +
                188 -
                that.track_property.outLeft
              that.xifuindex = that.chunkPosition.v[i][m].max - clonediv_.frame
              faaa++
            }
          }

          if (faaa == 0) {
            that.xifuindex = null
          }
          if (that.xifuindex) {
            var x1 = that.xifuindex
            var x2 = that.xifuindex + clonediv_.frame
          } else {
            x1 =
              (e.pageX -
                that.trackposition[0].minX -
                30 +
                that.track_property.outLeft) *
              (that.slidernum.max - that.track_property.ratio)
            x2 = x1 + (clonediv_.frame || 250)
          }
        }

        for (let n = 0; n < that.trackposition.length; n++) {
          if (
            e.pageX > that.trackposition[n].minX &&
            e.pageX < that.trackposition[n].maxX &&
            e.pageY > that.trackposition[n].minY - trackboxScroll &&
            e.pageY < that.trackposition[n].maxY - trackboxScroll
          ) {
            // 左右移动
            if (e.pageX - that.trackposition[n].minX < 20) {
              if (that.timerLeft == null) {
                that.timerLeft = setInterval(function() {
                  that.track_property.outLeft =
                    that.track_property.outLeft - 50 < 0
                      ? 0
                      : that.track_property.outLeft - 50
                  clonediv_.class = 'moveing'
                }, 100)
              }
            } else {
              clearInterval(that.timerLeft)
              that.timerLeft = null
            }
            if (that.trackposition[n].maxX - e.pageX < 20) {
              if (that.timerRight == null) {
                that.timerRight = setInterval(function() {
                  that.track_property.outLeft =
                    that.track_property.outLeft + 50 >
                    $('.track_able_content').width() -
                      $('.edit_track_contents').width()
                      ? $('.track_able_content').width() -
                        $('.edit_track_contents').width()
                      : that.track_property.outLeft + 50
                }, 100)
              }
            } else {
              clearInterval(that.timerRight)
              that.timerRight = null
            }
            clonediv_.y = that.trackposition[n].minY - trackboxScroll
            clonediv_.class = 'moveing'
            let index = 0
            for (let j = 0; j < that.chunkPosition.v[n].length; j++) {
              if (clonediv_.type == 5) {
                if (
                  that.chunkPosition.v[n][j + 1] &&
                  that.chunkPosition.v[n][j].max ==
                    that.chunkPosition.v[n][j + 1].min &&
                  x1 < that.chunkPosition.v[n][j].max &&
                  x2 > that.chunkPosition.v[n][j].max &&
                  that.chunkPosition.v[n][j + 1].type != 5 &&
                  that.chunkPosition.v[n][j + 1].type != 5 &&
                  that.chunkPosition.v[n][j].type != 5 &&
                  that.chunkPosition.v[n][j].type != 5
                ) {
                  index = j + 1
                  that.xifuindex = j
                  break
                }
              } else {
                if (
                  (x1 >= that.chunkPosition.v[n][j].min &&
                    x1 < that.chunkPosition.v[n][j].max) ||
                  (x2 > that.chunkPosition.v[n][j].min &&
                    x2 < that.chunkPosition.v[n][j].max) ||
                  (that.chunkPosition.v[n][j].min >= x1 &&
                    that.chunkPosition.v[n][j].min < x2) ||
                  (that.chunkPosition.v[n][j].max > x1 &&
                    that.chunkPosition.v[n][j].max < x2)
                ) {
                  if (
                    x1 >= that.chunkPosition.v[n][j].min &&
                    x1 < that.chunkPosition.v[n][j].max
                  ) {
                    that.index1 = j
                  }
                  if (
                    x2 > that.chunkPosition.v[n][j].min &&
                    x2 < that.chunkPosition.v[n][j].max
                  ) {
                    that.index2 = j
                  }
                  if (
                    (that.chunkPosition.v[n][j].min >= x1 &&
                      that.chunkPosition.v[n][j].min < x2) ||
                    (that.chunkPosition.v[n][j].max > x1 &&
                      that.chunkPosition.v[n][j].max < x2)
                  ) {
                    that.index1 = 1
                    that.index2 = 2
                  }
                  index++
                }
              }
            }
            if (clonediv_.type == 5) {
              if (index == 0) {
                clonediv_.class = 'warn'
              } else {
                clonediv_.class = 'moveing'
                index = 0
              }
            } else {
              if (index != 0) {
                index = 0
                clonediv_.class = 'moveing1'
              } else {
                that.index1 = null
                that.index2 = null
                clonediv_.class = 'moveing'
              }
            }
            if (
              (clonediv_.type == 0 && that.trackposition[n].type != 2) ||
              ((clonediv_.type == 2 || clonediv_.type == 3) &&
                that.trackposition[n].type == 2)
            ) {
              clonediv_.class = 'warn'
              return
            }
            if (
              clonediv_.type == 1 &&
              that.trackposition[n].type == 2 &&
              clonediv_.onlyvideo
            ) {
              clonediv_.class = 'warn'
              return
            }
            if (that.trackposition[n].able == 'true') {
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
    mouseup: function(e) {
      this.chunkmove = false
      if (e.touches) {
        e = e.changedTouches[0]
      }
      this.clonediv.up = true
      const that = this
      let num = 0
      $(document).unbind('mousemove')
      clearInterval(that.timerLeft)
      that.timerLeft = null
      clearInterval(that.timerRight)
      that.timerRight = null
      $.post(
        NCES.DOMAIN + '/api/track',
        JSON.stringify({
          cmd: 'property_append',
          track_property: { outLeft: that.track_property.outLeft }
        }),
        function(res) {
          if (res.code === 0) {
          }
          if (res.code !== 0) {
            console.warn(res.msg)
          }
        },
        'json'
      )
      for (var i = 0; i < that.trackposition.length; i++) {
        if (
          e.pageX > that.trackposition[i].minX &&
          e.pageX < that.trackposition[i].maxX &&
          e.pageY > that.trackposition[i].minY - $('#trackbox').scrollTop() &&
          e.pageY < that.trackposition[i].maxY - $('#trackbox').scrollTop() &&
          (that.clonediv.class == 'moveing' ||
            that.clonediv.class == 'moveing1')
        ) {
          var left = null
          if (that.xifuindex != null) {
            left = that.xifuindex
          } else {
            left =
              (e.pageX -
                that.trackposition[i].minX -
                30 +
                that.track_property.outLeft >
              0
                ? parseInt(
                    e.pageX -
                      that.trackposition[i].minX -
                      30 +
                      that.track_property.outLeft
                  )
                : 0) *
              (that.slidernum.max - that.track_property.ratio)
          }
          if (this.clonediv.type == 5) {
            var data = {
              cmd: 'add',
              a_chunk_id: that.chunkPosition.v[i][that.xifuindex].id,
              b_chunk_id: that.chunkPosition.v[i][that.xifuindex + 1].id,
              transition: this.clonediv.obj
            }
            that.createChunk(data)

            return
          } else {
            if (that.clonediv.class == 'moveing') {
              data = {
                src_id: that.clonediv.src_id,
                track_id: that.trackposition[i].id,
                track_type: that.trackposition[i].type,
                track_start: parseInt(left),
                type: that.clonediv.type,
                onlyVideo: that.clonediv.onlyvideo
              }
              that.createChunk(data)
            } else {
              window.zindex = 5
              $('.charu').one('mousedown', function(e) {
                e.stopPropagation()
                data = {
                  src_id: that.clonediv.src_id,
                  mode: 2,
                  track_id: that.trackposition[i].id,
                  track_type: that.trackposition[i].type,
                  track_start: parseInt(left),
                  type: that.clonediv.type,
                  onlyVideo: that.clonediv.onlyvideo
                }

                that.createChunk(data)
                window.zindex = 1
              })
              $('.fugai').one('mousedown', function(e) {
                e.stopPropagation()
                data = {
                  src_id: that.clonediv.src_id,
                  mode: 1,
                  track_id: that.trackposition[i].id,
                  track_type: that.trackposition[i].type,
                  track_start: parseInt(left),
                  type: that.clonediv.type,
                  onlyVideo: that.clonediv.onlyvideo
                }

                that.createChunk(data)
                window.zindex = 1
              })
              $('html').one('mousedown', function() {
                that.clonedivInit()
                window.zindex = 1
              })
            }
          }

          break
        } else {
          num++
        }
        if (num == that.trackposition.length) {
          that.clonedivInit()
        }
      }
    },
    getImgs: function() {
      const that = this
      const endposition =
        this.clonediv.frame >
        1920 * (this.slidernum.max - this.track_property.ratio)
          ? 1920 * (this.slidernum.max - this.track_property.ratio)
          : this.clonediv.frame
      if (this.clonediv.type == 1) {
        $.post(
          NCES.DOMAIN + '/api/source',
          JSON.stringify({
            cmd: 'get_imgs',
            src_id: this.clonediv.src_id,
            img_h: 56,
            r_interval: parseInt(
              (this.slidernum.max - this.track_property.ratio) * 100
            ),
            pixel_ratio: parseFloat(
              (this.slidernum.max - this.track_property.ratio).toFixed(1)
            ),
            src_start: 0,
            src_end: Math.ceil(endposition)
          }),
          function(res) {
            if (res.code === 0) {
              if (res.data.v.length > 0) {
                for (let i = 0; i < res.data.v.length; i++) {
                  const url =
                    'url(//' +
                    NCES.domain +
                    '.' +
                    NCES.uin +
                    '.lcps.aodianyun.com:3002' +
                    res.data.v[i] +
                    ') ' +
                    i * 100 +
                    'px 0px  no-repeat '
                  that.loadimg(NCES.DOMAIN + res.data.v[i], i)
                }
              }
            }

            if (res.code !== 0) {
            }
          },
          'json'
        )
      }
      if (this.clonediv.type == 0) {
        $.post(
          NCES.DOMAIN + '/api/source',
          JSON.stringify({
            cmd: 'get_imgs',
            src_id: this.clonediv.src_id,
            pixel_ratio: parseFloat(
              (this.slidernum.max - this.track_property.ratio).toFixed(1)
            ),
            img_h: 56
          }),
          function(res) {
            if (res.code !== 0) {
              console.warn(res.msg)
            }
            that.loadimg(NCES.DOMAIN + res.data.a[0], 0)
          },
          'json'
        )
      }
    },
    loadimg: function(src, url) {
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
    },
    setleftlist(html, target) {
      const that = this
      $('.listTitle li.active').removeClass('active')
      window.type = null
      $(target).addClass('active')
      this.html = html
      setTimeout(function() {
        $('.list_leftlist li:nth-child(1)').addClass('active')
        $('.list_leftlist li:first').click()
        that.CHANGE_MYDIRSHOW(false)
      }, 50)
    },
    backailist: function() {
      // page = 1;
      window.type = 'aicaption'
      this.Getaicaptionstyles()
    },
    transtime: function(time) {
      // ***move
      return (
        (Math.ceil(time / 60) < 10
          ? '0' + Math.floor(time / 60)
          : Math.floor(time / 60)) +
        ':' +
        (time % 60 < 10 ? '0' + (time % 60) : time % 60)
      )
    },
    changeing: function(service) {
      const that = this
      let html = ''
      for (let i = 0; i < that.aidatalist.length; i++) {
        if (service == that.aidatalist[i].service) {
          html =
            '<div class = "video_option_content" style = "width:100%;box-sizing:border-box;height:90px;padding:5px 5px 0px;margin-bottom:15px"> \
                                    <div class = "content_top" style = "height:85px"> \
                                        <img src= "//' +
            that.aidatalist[i].preview_img +
            '" alt="" class = "content_top_img"  style = "height:85px;width:100%" mousedown = function(e){e.preventDefault()} /> \
                                        <span class = "znTitle">' +
            that.aidatalist[i].name +
            '</span>\
                                    </div> \
                                    <div class = "znsuccesstip" style = "position:relative;text-align:center;margin-top:50px;font-size:17px">\
                                        <p class = "stateTip" style = "color:red">操作正在进行中！</p>\
                                        <p class = "stateHide stateTime">预计过程约: ' +
            that.transtime(that.trantime) +
            '</p>\
                                        <p>为确保字幕显示的准确性，请勿对现有轨道资源进行任何修改！</p>\
                                        <div id = "progressbar"><span class = "aiPre" >0%</span></div>\
                                        <img class = "stateHide" src="//cdn.aodianyun.com/nces/v1/img/loadings.gif" alt=""/>\
                                    </div>\
                                </div>'
        }
      }

      NCES.Setcontent({
        center: '<div>' + html + '</div>',
        func: function() {
          window.centeredbar = new Nanobar({
            target: document.getElementById('progressbar')
          })
          clearInterval(window.aiTimer)
          window.aiTimer = null
          window.aiTimer = setInterval(function() {
            $.post(
              NCES.DOMAIN + '/api/ai',
              JSON.stringify({ cmd: 'status' }),
              function(res) {
                if (res.data.service == null) {
                  $('.stateHide').hide()
                  $('.video_option_content .stateTip')
                    .html('完成!')
                    .css('color', 'green')
                  $('.video_option_content .aiPre').html('100%')
                  centeredbar.go(100)
                  setTimeout(function() {
                    that.backailist()
                  }, 2000)
                  clearInterval(window.aiTimer)
                  window.aiTimer = null
                  that.changeLoading()
                } else {
                  let pre = 0
                  if (res.data.state != 'error') {
                    if (res.data.state == 1) {
                      pre = Math.ceil(res.data.progress / 2)
                    }
                    if (res.data.state == 2) {
                      pre = Math.ceil(res.data.progress / 2) + 50
                    }
                    $('.stateTime').html(
                      '预计过程约: ' +
                        that.transtime(
                          Math.ceil((that.trantime * (100 - pre)) / 100)
                        )
                    )
                    $('.video_option_content .aiPre').html(pre + '%')
                    centeredbar.go(pre)
                  } else {
                    $('.stateHide,#progressbar').hide()
                    $('.video_option_content .stateTip').html(
                      '智能字幕应用失败!'
                    )
                    $('.tipProp_content p').html('智能字幕应用失败！')
                    $('.tipProp').show()
                    $.post(
                      NCES.DOMAIN + '/api/ai',
                      JSON.stringify({ cmd: 'reset' }),
                      function(res) {}
                    )
                    window.zindex = 0
                    setTimeout(function() {
                      that.backailist()
                    }, 2000)
                    clearInterval(window.aiTimer)
                    window.aiTimer = null
                    Hub.$emit('changeM', '')
                  }
                }
              }
            )
          }, 1000)
        }
      })
    }
  },
  created: function() {
    const that = this
    // 获取图片列表
    NCES.Getopenapi('ImageCategory', { uin: NCES.uin }, function(data) {
      let html = ''
      for (const key in data) {
        html +=
          '<li onclick = "NCES.getImage(\'' + key + '\',1)" >' + key + '</li>'
      }
      html += NCES.tp_obj
      that.tpList = html
    })
    // 获取音频列表
    NCES.Getopenapi('AudioCategory', { uin: NCES.uin }, function(data) {
      let html = ''
      for (const key in data) {
        html +=
          '<li onclick = "NCES.getAudio(\'' + key + '\',1)">' + key + '</li>'
      }
      that.audioList = html
    })
    // 获取文本列表
    $.ajax({
      type: 'get',
      url: NCES.DOMAIN + '/api/system',
      dataType: 'json',
      success: function(res) {
        if (res.code === 0) {
          // that.w = res.data.config.player.w;
          window.player = res.data.config.player

          const player = res.data.config.player
          const a = that.gcd(player.w, player.h)
          const b = player.w / a + ':' + player.h / a
          window.aspect_ratio = b
          // 获取文本列表
          NCES.Getopenapi(
            'TextCategory',
            { uin: NCES.uin, aspect_ratio: b },
            function(data) {
              let a = '',
                b = '',
                c = '',
                d = ''
              let html = ''
              for (const key in data) {
                if (key == '简讯') {
                  a = `<li onclick = "NCES.getText('${key}',1)">${key}</li>`
                }
                if (key == '结尾') {
                  b = ` <li onclick = "NCES.getText('${key}',1)">${key}</li>`
                }
                if (key == '基础文本') {
                  c = `<li onclick = "NCES.getText('${key}',1)">${key}</li>`
                }
                if (key == '动态文本') {
                  d = `<li onclick = "NCES.getText('${key}',1)">${key}</li>`
                }
              }
              html = a + b + c + d
              that.textList = html
            }
          )
          // that.ratio = res.data.config.player.w / res.data.config.player.h
        }
        if (res.code !== 0) {
          console.warn(res.msg)
          return
        }
      }
    })

    // var a = that.gcd(that.player.w,that.player.h)
    //                     var b = that.player.w / a +':'+that.player.h / a
    // NCES.Getopenapi('TextCategory',{uin:NCES.uin},function (data){
    //     var a='',b='',c='';
    //     var html = '';
    //     for(var key in data){
    //     if(key == '简讯'){
    //         a = "<li onclick = \"NCES.getText('"+key+"',1)\">"+key+"</li>"
    //     }
    //     if(key == '结尾'){
    //         b = "<li onclick = \"NCES.getText('"+key+"',1)\">"+key+"</li>"
    //     }
    //     if(key == '基础文本'){
    //         c = "<li onclick = \"NCES.getText('"+key+"',1)\">"+key+"</li>"
    //     }
    //     }
    //     html=a+b+c
    //     that.textList = html

    // })
    // 获取转场视频列表
    NCES.Getopenapi('VideoCategory', { uin: NCES.uin }, function(data) {
      let html = '<li onclick = "NCES.getZcdh()">转场特效</li>'
      let htm = ''
      for (const key in data) {
        if (key == '转场') {
          html +=
            '<li onclick = "NCES.getZcsp(\'' + key + '\',1)">转场视频</li>'
        } else {
          htm +=
            '<li onclick = "NCES.getZcsp(\'' + key + '\',1)">' + key + '</li>'
        }
      }
      that.zcList = html
      that.videoList = htm
    })
  },
  mounted: function() {
    const that = this
    $('.video_option').niceScroll({
      cursorcolor: '#AAAAAA',
      cursorborder: '1px solid #AAAAAA',
      enablekeyboard: false,
      horizrailenabled: false,
      enablescrollonselection: false
    })
    $('.list_leftlist').on('click', 'li', function() {
      if ($(this).hasClass('active')) {
        return
      } else {
        $('.list_leftlist li.active').removeClass('active')
      }
      $(this).addClass('active')
      setTimeout(() => {
        if (!$(this).hasClass('myDir')) {
          that.CHANGE_MYDIRSHOW(false)
        } else {
          that.CHANGE_MYDIRSHOW(true)
        }
      }, 150)
    })
    $('.list_leftlist li:first').click()
    // 智能字母相关功能
    $('.list_leftlist').on('click', '.aicaptions', that.Getaicaptionstyles)

    $('.video_option').on('click', '.znTouse', function() {
      // ***move
      const index = $(this).data('index')
      let htm = ''
      const length = Math.ceil((that.all.curr_track_len - 1) / 25)
      const data =
        (Math.ceil(length / 60) < 10
          ? '0' + Math.floor(length / 60)
          : Math.floor(length / 60)) +
        ':' +
        (length % 60 < 10 ? '0' + (length % 60) : length % 60)
      const trantime = that.transtime(that.trantime)
      const check = true
      const price = ((length * 0.15) / 60).toFixed(2)
      if (NCES.captext) {
        var text = NCES.captext({ data: data, trantime: trantime })
      } else {
        text =
          '<p style = "font-size:16px">*此功能为<span style = "color:red">付费功能</span></p>\
                                <p style = "font-size:14px">视频时长: ' +
          data +
          '<br>预计费用: ' +
          price +
          '元&nbsp;<br>预计等待时间约: ' +
          trantime +
          '</p>\
                                '
      }
      htm =
        '<div class = "video_option_content" style = "width:100%;box-sizing:border-box;height:90px;padding:5px 5px 0px;margin-bottom:15px"> \
                            <div class = "content_top" style = "height:85px"> \
                                <img src= "//' +
        that.aidatalist[index].preview_img +
        '" alt="" class = "content_top_img"  style = "height:85px;width:100%" mousedown = function(e){e.preventDefault()} /> \
                                <span class = "znTitle">' +
        that.aidatalist[index].name +
        '</span>\
                            </div> \
                            <div style = "box-sizing:border-box;padding-top:45px;width:420px;margin:0 auto;position:relative" class = "clearfix">\
                                ' +
        text +
        '<p style = "color:#aaa">为确保字幕与媒资内容对应的准确性，操作中请勿对轨道资源进行任何修改！</p>\
                                <span class = "sureAi ' +
        (check == false ? 'unsureAi' : '') +
        '"  data-check = ' +
        check +
        ' data-service = "' +
        that.aidatalist[index].service +
        '">确定</span>\
                                <span class = "celAi">取消</span>\
                            </div>\
                        </div>'
      NCES.Setcontent({ center: '<div>' + htm + '</div>' })
    })
    $('.video_option').on('click', '.zmTouse', function() {
      $('.video_option .content_top.active').removeClass('active')
      $(this)
        .parent()
        .addClass('active')
      const data = { cmd: 'add', track_start: 0, track_end: 75, text: '' }

      if (window.captionStyle.status.style == $(this).data('style')) {
        if (window.captionStyle.chunks.length == 0) {
          $.post(
            NCES.DOMAIN + '/api/caption',
            JSON.stringify(data),
            function(res) {
              that.changeLoading()
            },
            'json'
          )
        }
      } else {
        $.post(
          NCES.DOMAIN + '/api/caption',
          JSON.stringify({ cmd: 'update_style', style: $(this).data('style') }),
          function(res) {
            if (res.code != 0) {
              return
            }

            if (window.captionStyle.chunks.length == 0) {
              $.post(
                NCES.DOMAIN + '/api/caption',
                JSON.stringify(data),
                function(res) {
                  that.changeLoading()
                },
                'json'
              )
            } else {
              that.changeLoading()
            }
          }
        )
      }
    })

    $('.video_option').on('click', '.celAi', function() {
      that.backailist()
    })
    $('.video_option').on('click', '.sureAi', function() {
      // that.backailist()
      const service = $(this).data('service')
      if ($(this).data('check')) {
        $.post(
          NCES.DOMAIN + '/api/ai',
          JSON.stringify({ cmd: 'apply', service: $(this).data('service') }),
          function(res) {
            if (res.code != 0) {
              return
            }
          }
        )
        setTimeout(function() {
          that.changeing(service)
        }, 0)
      } else {
        $('.tipProp_content p').html('余额不足，请及时充值！')
        $('.tipProp').show()
        window.zindex = 0
        return
      }
    })
  }
}
</script>

<style></style>
