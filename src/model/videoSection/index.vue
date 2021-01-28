<template>
  <div>
    <div class="player_title">
      <span class="u-icon"></span>
      <span>{{ this.v }}</span>
      <span @click="fullpage" class=" u-icon" title="网页全屏"> </span>
    </div>
    <div style="width:100%;height:calc(100% - 63px);position:relative">
      <video
        id="webrtcVideoID"
        style="display:none;position:absolute;top:0;left:0"
        autoplay
        playsinline
        @dblclick="fullscreen"
      ></video>
      <div
        id="flashVideoID"
        style="position:absolute;top:0;display:none;maring-top:-2px"
      >
        <p style="color: #FF0000;background-color:#FFFFFF">
          您需要安装Adobe Flash Player 11.1.0以上的版本.<a
            target="_blank"
            href="http://www.adobe.com/go/getflashplayer"
            >点击获取</a
          >
        </p>
      </div>
    </div>
    <div class="videoMovebox" @mousedown="mousedown">
      <span>·</span>
      <span>·</span>
      <span>·</span>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import { TIP_HEIGHT_NUMBER } from '@/config'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['v'])
  },
  methods: {
    ...mapMutations(['CHANGE_IS_REFRESH_CAPTION_SET_BS']),
    fullpage() {
      // 网页全屏方法
      // eslint-disable-next-line no-undef
      if (screenfull.enabled) {
        // 仅仅只进行全屏而不退出全屏可以调用
        // screenfull.request() 方法。
        // eslint-disable-next-line no-undef
        screenfull.toggle()
      } else {
        // Ignore or do something else
      }
    },
    mousedown(e_para) {
      const e = e_para || window.event
      const lh = $('.lh')
      const nces_videoplayer = $('.nces_videoplayer')
      const nces_videolist = $('.nces_videolist')
      let max, min
      if ($(document).width() >= 1440) {
        max = $('.lh').width() * 0.61
        min = 480
      } else {
        max = $('.lh').width() * 0.46
        min = $('.lh').width() * 0.25
      }
      let positionX = e.pageX
      $(document).on('mousemove', function(e2) {
        const move = e2.pageX - positionX
        positionX = e2.pageX
        let width = $('.nces_videoplayer').width() - move
        if (width > max) {
          width = max
        }
        if (width < min) {
          width = min
        }
        lh.css({ padding: 0, height: (width * 9) / 16 + 67 + 'px' })
        nces_videoplayer.width(width)
        nces_videolist.width(lh.width() - width - 10)
        $('.video_option')
          .getNiceScroll()
          .resize()
        this.CHANGE_IS_REFRESH_CAPTION_SET_BS(true)
        // $("#trackbox").css('max-height',$(document).height() - width * 9 / 16 - 260 - 5);
        // $("#trackbox").css('max-height',350);
        $('#edit_tip_line').height($('.nces_edit').height() + TIP_HEIGHT_NUMBER)
        $('.setContent').css({
          'padding-top': ((width + 5) * 9) / 16 + 70 + 'px',
          width: $('.lh').width() - width - 10 + 'px'
        })
        $('.setContent-do').width(width)
        // eslint-disable-next-line no-undef
        Hub.$emit('videoMoves', '')
      })
      $(document).one('mouseup', function() {
        $(document).off('mousemove')
        // eslint-disable-next-line no-undef
        Hub.$emit('videoMove', '')
      })
    }
  },
  mounted() {
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
      }
      script.onload = script.onreadystatechange
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
        this.$alert(data.message)
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
    // 加载播放器E
  }
}
</script>

<style></style>
