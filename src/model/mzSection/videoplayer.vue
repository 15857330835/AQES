<template>
  <div class="nces_videoplayer" :style="{ width: videoselw }">
    <div class="player_title">
      <span class="u-icon">{{ this.v }}</span>
      <span
        @click="fullpage"
        class="u-icon"
        title="网页全屏"
        :class="{
          'fullpage-in': !this.isFullPage,
          'fullpage-out': this.isFullPage
        }"
      ></span>
    </div>
    <div class="videobackg">
      <div
        id="videobackg"
        :style="{
          backgroundColor: '#000',
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          height:
            this.playerInfo.w > this.playerInfo.h
              ? (100 * 16 * this.playerInfo.h) / 9 / this.playerInfo.w + '%'
              : '100%',
          width:
            this.playerInfo.w > this.playerInfo.h
              ? '100%'
              : (100 * 9 * this.playerInfo.w) / 16 / this.playerInfo.h + '%'
        }"
      >
        <fullscreen ref="webrtcVideoFullscreen">
          <video
            id="webrtcVideoID"
            ref="webrtcVideoID"
            style="display:none;position:absolute;top:0;left:0"
            autoplay
            :muted="mute"
            playsinline
            @dblclick="fullscreen"
            @touchend="dbl"
          ></video>
        </fullscreen>

        <div
          id="flashVideoID"
          style="position:absolute;top:0;display:none;maring-top:-2px"
        >
          <p style="color: #FF0000;background-color:#FFFFFF">
            您需要安装Adobe Flash Player 11.1.0以上的版本.
            <a target="_blank" href="http://www.adobe.com/go/getflashplayer"
              >点击获取</a
            >
          </p>
        </div>
      </div>
      <div
        v-if="
          this.chunksetshow &&
            (this.activechunk.chunk.chunk_type != 2 ||
              this.activechunk.chunk.chunk_type != 5)
        "
        :style="{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          height:
            this.playerInfo.w > this.playerInfo.h
              ? (100 * 16 * this.playerInfo.h) / 9 / this.playerInfo.w + '%'
              : '100%',
          width:
            this.playerInfo.w > this.playerInfo.h
              ? '100%'
              : (100 * 9 * this.playerInfo.w) / 16 / this.playerInfo.h + '%'
        }"
      >
        <newchartset v-if="this.filtershow == 'normal'"></newchartset>
        <newDynamicTextSet
          v-else-if="this.filtershow === 'dynamicText'"
        ></newDynamicTextSet>
        <newfilterset v-else></newfilterset>
      </div>
    </div>
    <div class="video_control">
      <div
        class="time-to-line"
        v-if="this.chunksetshow"
        @click="movetoposition($event)"
      >
        <div
          class="line-active"
          :style="{
            width:
              ((this.pointer.position - this.activechunk.chunk.track_start) *
                100) /
                (this.activechunk.chunk.src_end -
                  this.activechunk.chunk.src_start) +
              '%'
          }"
        ></div>
      </div>
      <div
        class="bottom-control"
        :style="{
          height: chunksetshow ? '0.4rem' : '0.48rem'
        }"
      >
        <div class="control_Cleft">
          <span @click="lastindex" class="u-icon" title="上一帧"></span>
          <span
            @click="videoplay"
            :class="(this.pointer.speed == 0 ? '' : 'active') + ' u-icon play'"
            :title="this.pointer.speed == 0 ? '播放' : '暂停'"
          ></span>
          <span @click="nextindex" class="u-icon" title="下一帧"></span>
        </div>
        <div
          title="添加时间点"
          class="add-tip"
          v-if="
            this.chunksetshow &&
              (this.activechunk.chunk.chunk_type != 2 ||
                this.activechunk.chunk.chunk_type != 5)
          "
          @click="adddian"
        >
          <span></span>
        </div>
        <div class="time-info" v-if="!this.chunksetshow">
          <span
            >{{ this.initdate(pointer.position) }} /
            {{ this.initdate(length) }}</span
          >
        </div>
        <div
          class="time-info"
          v-if="
            this.chunksetshow &&
              (this.activechunk.chunk.chunk_type != 2 ||
                this.activechunk.chunk.chunk_type != 5)
          "
        >
          <span
            >{{
              this.initdate(
                this.pointer.position - this.activechunk.chunk.track_start
              )
            }}
            /
            {{
              this.initdate(
                Math.floor(originSrcLen / this.activechunk.chunk.speed)
              )
            }}</span
          >
        </div>
        <div class="control_Cright">
          <span @click="videoRefresh" class="u-icon" title="刷新播放器"></span>
        </div>
      </div>
    </div>
    <div
      :class="{ videoMovebox: true, 'set-active': chunksetshow }"
      @mousedown="openway == 'pc' ? mousedown($event) : temp()"
      @touchstart="mousedown"
      @touchmove="mousemove"
      @touchend="mouseend"
      v-show="!exportVideoSetShow"
    >
      <span class="move-icon"></span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import newchartset from './newchartSet'
import newfilterset from './newfilterSet'
import newDynamicTextSet from './NewDynamicTextSet'
import _ from 'lodash'
import { TIP_HEIGHT_NUMBER, TRACK_MAXHEIGHT_NUMBER } from '@/config'

export default {
  data() {
    return {
      videomove: false,
      x: 0,
      lasttime: 0,
      mute: true,
      originSrcLen: 0,
      timer: null,
      isFullScreen: false,
      isFullPage: false
    }
  },
  components: {
    newchartset,
    newfilterset,
    newDynamicTextSet
  },
  computed: {
    ...mapState([
      'v',
      'showwhat',
      'clientwidth',
      'systemmessage',
      'activechunk',
      'propertyNum',
      'activeProperty',
      'filtershow',
      'openway',
      'changepos',
      'chunksetshow',
      'exportVideoSetShow'
    ]),
    length() {
      return this.$store.state.all.curr_track_len
    },
    pointer() {
      return this.$store.state.all.pointer
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    videoselw() {
      if (this.clientwidth >= 1440) {
        return this.track_property.fanwei['1920'].now * 100 + '%'
      } else {
        return this.track_property.fanwei['1440'].now * 100 + '%'
      }
    },
    playerInfo() {
      return this.systemmessage.player
    },
    isPlaying() {
      return !!this.$store.state.all.pointer.speed
    }
  },
  watch: {
    chunksetshow(val) {
      if (val) {
        this.originSrcLen =
          (this.activechunk.chunk.src_end - this.activechunk.chunk.src_start) *
          this.activechunk.chunk.speed
      }
      this.getindex()
    },
    isPlaying: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.timer = setInterval(() => {
            if (this.changepos) {
              return
            }
            this.getindex()
          }, 1000)
        } else {
          clearInterval(this.timer)
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapMutations([
      'UPDATE_TRACKBOX',
      'UPDATE_TRACKPOSITION',
      'UPDATE_CAPTIONPOSITION',
      'PROPERTY_FANWEI',
      'CHANGE_ACTIVEPROPERTY',
      'CHANGE_PROPERTYNUM',
      'ADD_REFRESH_KEY',
      'CHANGE_IS_REFRESH_PANES_BS'
    ]),
    ...mapActions([
      'postPointer',
      'lastindex',
      'videoplay',
      'nextindex',
      // "initdate",
      'getindex',
      'Post',
      'changeLoading',
      'geoPost'
    ]),
    // eslint-disable-next-line no-empty-function
    temp() {},
    adddian() {
      const geo_arr = []
      let flag = false
      let index = 0
      const datas = {}
      for (let i = 0; i < this.activeProperty.length; i++) {
        if (
          this.activeProperty[i].f >
            this.pointer.position - this.activechunk.chunk.track_start &&
          flag === false
        ) {
          for (const key of Object.keys(this.activeProperty[i - 1])) {
            datas[key] = this.activeProperty[i - 1][key]
          }
          datas.f = this.pointer.position - this.activechunk.chunk.track_start
          index = i
          geo_arr.push(datas)
          geo_arr.push(this.activeProperty[i])
          flag = true
        } else {
          geo_arr.push(this.activeProperty[i])
        }
      }
      if (!flag) {
        for (const key of Object.keys(
          this.activeProperty[this.activeProperty.length - 1]
        )) {
          datas[key] = this.activeProperty[this.activeProperty.length - 1][key]
        }
        datas.f = this.pointer.position - this.activechunk.chunk.track_start
        index = this.activeProperty.length
        geo_arr.push(datas)
      }
      this.CHANGE_PROPERTYNUM(index)
      this.geoPost({
        geo_arr
      })
    },
    movetoposition(obj) {
      const that = this
      const position =
        ((this.activechunk.chunk.src_end - this.activechunk.chunk.src_start) *
          obj.offsetX) /
        obj.currentTarget.offsetWidth
      const data = {
        type: 'pointer',
        data: {
          cmd: 'set',
          position: parseInt(position, 10) + this.activechunk.chunk.track_start
        },
        success(res) {
          that.getindex()
        }
      }
      this.Post(data)
    },
    throttleResizeScreen: _.throttle(function() {
      this.resizeScreen()
    }, 200),
    resizeScreen() {
      let num
      if (this.openway === 'pc') {
        num = '0vh'
      } else if (this.openway === 'ios') {
        num = '10vh'
      }
      let trackbox_max_height =
        $('.nces_sys').height() +
        $('.clearfix.lh').height() +
        $('.edit_ruler.clearfix').height() +
        $('#captionbox').height() +
        $('.time_track.clearfix').height() +
        $('.nces_videooper').height() +
        TRACK_MAXHEIGHT_NUMBER -
        72
      // editHeight
      trackbox_max_height = parseInt(trackbox_max_height, 10)
      $('#trackbox').css(
        'max-height',
        'calc(100vh - ' + num + ' - ' + trackbox_max_height + 'px)'
      )
      $('#edit_tip_line').height($('.nces_edit').height() + TIP_HEIGHT_NUMBER)
    },
    fullpage() {
      // 网页全屏方法
      // const callback = () => {
      //   this.ADD_REFRESH_KEY()
      // }
      if (!this.isFullPage) {
        this.isFullPage = true
        const that = this
        this.$fullscreen.enter(document.querySelector('#aqes'), {
          wrap: false,
          callback: that.buffResizeScreen
        })
        const func = e => {
          if (e.keyCode === 27) {
            this.isFullPage = false
            this.$fullscreen.exit({ callback: this.buffResizeScreen })
            document.removeEventListener('keyup', func)
          }
        }
        this.$nextTick(() => {
          document.addEventListener('keyup', func)
        })
      } else {
        this.isFullPage = false
        this.$fullscreen.exit({ callback: this.buffResizeScreen })
      }
    },
    videoRefresh() {
      // 刷新播放器
      $.post(
        window.AQES.DOMAIN + '/api/player',
        JSON.stringify({ cmd: 'restart' }),
        function(res) {
          if (res.code !== 0) {
            console.log(res.msg)
          }
        },
        'json'
      )
    },
    // 时间格式化 m/s/z
    initdate(time_para) {
      let time = time_para
      time = time < 0 ? 0 : time // 修复传入时间为-1时显示异常的bug 2019.5.13
      let m = Math.floor(time / 25 / 60)
      m = m < 10 ? '0' + m : m
      let s = Math.floor(time / 25) % 60
      s = s < 10 ? '0' + s : s
      let z = time % 25
      z = z < 10 ? '0' + z : z
      return m + ':' + s + '.' + z
    },
    dbl(e) {
      e.preventDefault()
      if (e.touches) {
        if (Date.now() - this.lasttime < 300) {
          this.fullscreen()
        }
        this.lasttime = Date.now()
      }
    },
    fullscreen(e) {
      // h5播放器全屏
      if (!this.isFullScreen) {
        // video未全屏
        this.$refs.webrtcVideoFullscreen.enter()
        this.isFullScreen = true
      } else {
        this.$refs.webrtcVideoFullscreen.exit()
        this.isFullScreen = false
      }

      // if (!this.isFullscreen) {
      //   // 如果没有全屏, 进入全屏
      //   this.isFullscreen = true
      //   if (ele.requestFullscreen) {
      //     ele.requestFullscreen();
      //   } else if (ele.mozRequestFullScreen) {
      //     ele.mozRequestFullScreen();
      //   } else if (ele.webkitRequestFullScreen) {
      //     ele.webkitRequestFullScreen();
      //   } else if(ele.oRequestFullscreen){
      //     ele.oRequestFullscreen();
      //   } else if(ele.msRequestFullScreen) {
      //     ele.msRequestFullScreen();
      //   }
      // } else {
      //   // 如果已经全屏, 退出全屏
      //   this.isFullscreen = false
      //   if (document.exitFullscreen) {
      //     document.exitFullscreen();
      //   } else if (document.msExitFullscreen) {
      //     document.msExitFullscreen();
      //   } else if (document.mozCancelFullScreen) {
      //     document.mozCancelFullScreen();
      //   } else if (document.oRequestFullscreen) {
      //     document.oCancelFullScreen();
      //   } else if (document.webkitExitFullscreen) {
      //     document.webkitExitFullscreen();
      //   }

      // }
    },
    mousemove(e_para) {
      if (!this.videomove) {
        return
      }
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      let max, min
      if ($(document).width() >= 1440) {
        max = $('.lh').width() * this.track_property.fanwei['1920'].max
        min = $('.lh').width() * this.track_property.fanwei['1920'].min
      } else {
        max = $('.lh').width() * this.track_property.fanwei['1440'].max
        min = $('.lh').width() * this.track_property.fanwei['1440'].min
      }
      const lh = $('.lh')
      const move = e.pageX - this.x
      this.x = e.pageX
      let width = $('.nces_videoplayer').width() - move
      if (width > max) {
        width = max
      }
      if (width < min) {
        width = min
      }

      if (this.clientwidth >= 1440) {
        this.track_property.fanwei['1920'].now = width / lh.width()
      } else {
        this.track_property.fanwei['1440'].now = width / lh.width()
      }
      $('.video_option')
        // .getNiceScroll()
        .resize()
      $('#trackbox')
        // .getNiceScroll()
        .resize()
      $('.mydir-bottom-content')
        // .getNiceScroll()
        .resize()
      this.resizeScreen()
    },
    buffResizeScreen() {
      let max, min
      if ($(document).width() >= 1440) {
        max = $('.lh').width() * this.track_property.fanwei['1920'].max
        min = $('.lh').width() * this.track_property.fanwei['1920'].min
      } else {
        max = $('.lh').width() * this.track_property.fanwei['1440'].max
        min = $('.lh').width() * this.track_property.fanwei['1440'].min
      }
      const lh = $('.lh')
      let width = $('.nces_videoplayer').width()
      if (width > max) {
        width = max
      }
      if (width < min) {
        width = min
      }
      if (this.clientwidth >= 1440) {
        this.track_property.fanwei['1920'].now = width / lh.width()
      } else {
        this.track_property.fanwei['1440'].now = width / lh.width()
      }
      $('.video_option')
        // .getNiceScroll()
        .resize()
      $('#trackbox')
        // .getNiceScroll()
        .resize()
      $('.mydir-bottom-content')
        // .getNiceScroll()
        .resize()
      this.resizeScreen()
    },
    mouseend(e) {
      this.videomove = false
      const data = {}
      data.type = 'property'
      data.data = {
        cmd: 'append',
        property: { fanwei: this.track_property.fanwei }
      }
      this.Post(data)
      this.UPDATE_TRACKBOX()
      this.UPDATE_TRACKPOSITION()
      this.UPDATE_CAPTIONPOSITION()
      // console.log('move-video-box')
      this.CHANGE_IS_REFRESH_PANES_BS(true)
      if (this.openway === 'pc') {
        $(document).unbind('mousemove')
      }
    },
    mousedown(e_para) {
      // 视频播放器宽度调节
      this.videomove = true
      let e = e_para
      if (e.touches) {
        e = e.touches[0]
      }
      // const that = this
      // const lh = $('.lh')
      // const nces_videoplayer = $('.nces_videoplayer')
      // const nces_videolist = $('.nces_videolist')
      // let max, min
      // if ($(document).width() >= 1440) {
      //   max = $('.lh').width() * that.track_property.fanwei['1920'].max
      //   min = $('.lh').width() * that.track_property.fanwei['1920'].min
      // } else {
      //   max = $('.lh').width() * that.track_property.fanwei['1440'].max
      //   min = $('.lh').width() * that.track_property.fanwei['1440'].min
      // }
      this.x = e.pageX
      if (this.openway === 'pc') {
        $(document).bind('mousemove', this.mousemove)
        $(document).one('mouseup', this.mouseend)
      }
    }
  },
  mounted() {
    const that = this
    this.resizeScreen()
    window.addEventListener('resize', this.throttleResizeScreen)
    // 加载播放器S
    const dynamicLoadJs = function(url, callback) {
      const head = document.getElementsByTagName('head')[0]
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.src = url
      if (typeof callback === 'function') {
        script.onreadystatechange = function() {
          if (
            !this.readyState ||
            this.readyState === 'loaded' ||
            this.readyState === 'complete'
          ) {
            callback()
            script.onreadystatechange = null
            script.onload = null
          }
        }
        script.onload = script.onreadystatechange
        script.onerror = function() {
          head.removeChild(script)
          setTimeout(() => {
            dynamicLoadJs(url, callback)
          }, 1000)
        }
      }
      head.appendChild(script)
    }

    const stream = 'allpreview'
    const domain = window.AQES.D // "xx.uid.lcps.aodianyun.com";
    const rtcVideoID = 'webrtcVideoID'
    const flashVideoID = 'flashVideoID'
    const width = '100%'
    const height = '100%'
    const type = 'auto'
    const OnError = function(data) {
      if (data.code === '-2') {
        this.$alert(
          '系统默认同时最多打开2个页面，如需要更多，可以从右上角菜单设置页面打开数'
        )
      } else {
        window.zindex = 0
        that.$alert(data.message, '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
      }
    }
    dynamicLoadJs(window.AQES.DOM + '/lcpsplayer.js', function() {
      // eslint-disable-next-line no-undef
      LcpsPlayerInit(domain, function() {
        // var player = new LcpsPlayer(domain, stream, "rtcVideoID", "flashVideoID", "auto");
        // eslint-disable-next-line
        const player = new LcpsPlayer(
          domain,
          stream,
          rtcVideoID,
          flashVideoID,
          width,
          height,
          type,
          OnError
        )
      })
    })

    this.mute = false

    this.originSrcLen =
      (this.activechunk.chunk.src_end - this.activechunk.chunk.src_start) *
      this.activechunk.chunk.speed

    document.addEventListener('fullscreenchange', e => {
      // solve the bug that the icon doesn't change when exits the full screen
      this.resizeScreen()
      if (document.fullscreenElement === null) {
        this.isFullPage = false
      }
    })
  },
  beforeDestroy() {
    // window.EventListener('resize', this.throttleResizeScreen)
  }
}
</script>

<style lang="scss" scoped>
.nces_videoplayer {
  height: 100%;
  float: right;
  position: absolute;
  top: 0;
  right: 0;
  width: 50%;
  font-size: 0.18rem;

  .player_title {
    height: 0.4rem;
    background-color: #212931;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0.2rem;

    .fullpage-in {
      background: url('../../img/u5.png');
      transform: scale(0.65);
    }

    .fullpage-out {
      background: url('../../img/u5_1.png');
      transform: scale(0.65);
    }

    > span {
      &:nth-child(1) {
        background: url(../../img/video-player.png) 0 center no-repeat;
        text-indent: 0.32rem;
        line-height: 0.4rem;
        background-size: 0.22rem;
      }

      &:nth-child(2) {
        width: 0.28rem;
        height: 0.28rem;
        background-size: 100%;
        cursor: pointer;
      }
    }
  }

  .videobackg {
    background: repeating-linear-gradient(
      -45deg,
      rgba(51, 51, 51, 0.5),
      rgba(51, 51, 51, 0.5) 0.05rem,
      rgba(68, 68, 68, 0.5) 0,
      rgba(68, 68, 68, 0.5) 0.1rem
    );
    width: 100%;
    height: calc(100% - 0.88rem);
    position: relative;
  }

  .video_control {
    width: 100%;
    height: 0.48rem;
    background-color: #212931;
    user-select: none;

    .time-to-line {
      height: 0.08rem;
      background-color: #6f7376;
      overflow: hidden;
      cursor: pointer;
      opacity: 0.6;
      width: 100%;
      .line-active {
        height: 100%;
        background-color: #61ded0;
      }
    }
    .bottom-control {
      .control_Cleft {
        float: left;
        user-select: none;
        height: 100%;
        padding: 0 0.2rem;
        // display: flex;
        // align-items: center;

        > span {
          width: 0.42rem;
          height: 100%;
          display: inline-block;
          cursor: pointer;

          &:nth-child(1) {
            background: url(../../img/u2.png) left no-repeat;
            transform: scale(0.9);
          }

          &:nth-child(2) {
            background: url(../../img/u3.png) left no-repeat;
            transform: scale(0.8);

            &.active {
              background: url(../../img/u13.png) left no-repeat;
              transform: scale(0.8);
            }
          }

          &:nth-child(3) {
            background: url(../../img/u4.png) left no-repeat;
            transform: scale(0.9);
          }
        }
      }

      .control_Cright {
        margin-right: 0.2rem;
        height: 100%;
        float: right;
        // display: flex;
        // align-items: center;
        > span {
          &:nth-child(1) {
            background-image: url(../../img/restart.png);
            transform: scale(0.7);
            width: 0.28rem;
            height: 100%;
            display: inline-block;
            background-size: 100%;
            cursor: pointer;
          }

          &:nth-child(2) {
            background-image: url(../../img/quanping.png);
            width: 0.28rem;
            height: 0.28rem;
            display: inline-block;
            background-size: 100%;
            cursor: pointer;
          }
        }
      }
      .time-info {
        float: left;
        height: 100%;
        display: flex;
        align-items: center;
      }
      .add-tip {
        float: left;
        margin: 0 20px;
        width: 11px;
        height: 7px;
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
        background-color: #61ded0;
        position: relative;
        top: calc(0.24rem - 8px);
        cursor: pointer;
        > span {
          display: inline-block;
          border: 5.5px solid transparent;
          border-top: 5.5px solid #61ded0;
          position: absolute;
          top: 7px;
        }
      }
    }
  }

  .videoMovebox {
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: absolute;
    top: 0;
    height: 100%;
    cursor: url(../../img/videoMove.png), pointer;
    font-weight: 900;
    width: 0.25rem;
    left: -0.25rem;
    box-sizing: border-box;
    background-color: #212931;
    border-left: 1px solid #151a20;
    border-right: 0.02rem solid #151a20;
    &.set-active {
      background-color: #151a20;
      z-index: 1666;
      width: 10px;
      border: none;
      left: -10px;
      span {
        transform: translate(-1px, -50%) scale(0.8);
      }
    }

    span {
      text-align: center;
      width: 0.1rem;
      height: 0.2rem;
      top: 50%;
      transform: translate(0.05rem, -50%);
      background: url(../../img/left_move.png) no-repeat;
      background-size: contain;
    }
  }
}
</style>
