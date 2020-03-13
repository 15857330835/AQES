<template>
  <div class="video_option_content">
    <div class="content_top">
      <img
        :src="src"
        class="content_top_img dragele source-img"
        :data-src_id="source.id"
        :data-status="status"
        :data-src_from="_url"
        :data-src_type="1"
        :class="{ loaded: imgLoaded }"
        @load="handleImgLoad"
      />
    </div>
    <div class="content_mes clearfix">
      <div :title="source.title">{{ source.title }}</div>
      <div>{{ dateTime }}</div>
      <div>{{ formatDuration(source.duration) }}</div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: ['source'],
  data() {
    return {
      imgLoaded: false
    }
  },
  watch: {},
  computed: {
    dateTime() {
      const d = new Date(Number(this.source.date) * 1000)
      return this.formatDate(d, 'yyyy.MM.dd')
    },
    src() {
      return this.source.thumbnail
        ? this.source.thumbnail.replace(/https:/, '').replace(/http:/, '') +
            '/145/80'
        : this._url + '?resize/110'
      // return this.source.thumbnail + '/145/80'
    },
    _url1() {
      return (
        this.source.mp4 ||
        this.source.mp4_1080 ||
        this.source.mp4_720 ||
        this.source.mp4_480 ||
        this.source.m3u8_1080 ||
        this.source.m3u8_720 ||
        this.source.m3u8_480 ||
        this.source.m3u8 ||
        this.source.url ||
        this.source.mp4_360 ||
        this.source.mp4_240 ||
        this.source.m3u8_360 ||
        this.source.m3u8_240
      )
    },
    _url2() {
      return (
        this.source.mp4_1080 ||
        this.source.mp4_720 ||
        this.source.mp4_480 ||
        this.source.url ||
        this.source.mp4 ||
        this.source.m3u8 ||
        this.source.m3u8_1080 ||
        this.source.m3u8_720 ||
        this.source.m3u8_480 ||
        this.source.mp4_360 ||
        this.source.mp4_240 ||
        this.source.m3u8_360 ||
        this.source.m3u8_240
      )
    },
    _url3() {
      return (
        this.source.mp4 ||
        this.source.mp4_1080 ||
        this.source.mp4_720 ||
        this.source.mp4_480 ||
        this.source.m3u8 ||
        this.source.m3u8_1080 ||
        this.source.m3u8_720 ||
        this.source.m3u8_480 ||
        this.source.mp4_360 ||
        this.source.mp4_240 ||
        this.source.m3u8_360 ||
        this.source.m3u8_240 ||
        this.source.url
      )
    },
    _url() {
      let url = null
      if (
        this.source.url.match(
          /(bmp|png|jpg|jpeg|mp3|wma|aac|flac|wav|mp4|m3u8|flv|avi|mkv|mov)$/g
        )
      ) {
        url = this._url1
        // if (this.source.url.match(/(m3u8)$/g)) {
        //   url = this._url1
        // } else {
        //   url = this._url2
        // }
      } else {
        url = this._url3
      }
      url = url.replace(/https:/, '')
      url = url.replace(/http:/, '')
      return 'http:' + url
    },
    status() {
      return this.source.status ? this.source.status : 0
    }
  },
  methods: {
    formatDuration(secs) {
      let min = parseInt(secs / 60, 10)
      const sec = parseInt(secs % 60, 10)
      // sec = sec>9?sec:'0'+sec
      const hour = parseInt(min / 60, 10)
      min = min % 60
      return (
        (hour > 9 ? hour : '0' + hour) +
        ':' +
        (min > 9 ? min : '0' + min) +
        ':' +
        (sec > 9 ? sec : '0' + sec)
      )
    },
    formatDate(date, fmt_para) {
      // author: meizz
      const o = {
        'M+': date.getMonth() + 1, // 月份
        'd+': date.getDate(), // 日
        'h+': date.getHours(), // 小时
        'm+': date.getMinutes(), // 分
        's+': date.getSeconds(), // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        S: date.getMilliseconds() // 毫秒
      }
      let fmt = fmt_para
      if (/(y+)/.test(fmt_para)) {
        fmt = fmt_para.replace(
          RegExp.$1,
          (date.getFullYear() + '').substr(4 - RegExp.$1.length)
        )
      }
      for (const k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            RegExp.$1.length === 1
              ? o[k]
              : ('00' + o[k]).substr(('' + o[k]).length)
          )
        }
      }
      return fmt
    },
    handleImgLoad() {
      this.imgLoaded = true
    }
  }
}
</script>
<style lang="scss">
.video_option_content {
  width: 110px;
  padding: 5px 15px;
  margin: 0 auto;
  .content_top {
    position: relative;
    height: 62.11px;
    line-height: 0;
    text-align: center;
    background-color: #010101;
    .content_top_img {
      max-width: 100%;
      height: 62.11px;
      &.dragele {
        cursor: pointer;
      }
    }
    span {
      &.content_top_img {
        background-color: black;
        display: inline-block;
        line-height: 62.11px;
        text-align: center;
        cursor: no-drop;
      }
    }
    .content_top_down {
      height: 62.11px;
      width: 100%;
      position: absolute;
      bottom: 0;
      text-align: center;
      overflow: hidden;
      line-height: 62px;
      & > span {
        &:nth-child(1) {
          position: absolute;
          box-sizing: border-box;
          text-align: center;
          left: 0;
          height: 100%;
          width: 100%;
        }
        &:nth-child(2) {
          position: absolute;
          right: 5px;
          bottom: 5px;
          width: 19px;
          height: 12px;
          background-image: url(../img/u9.png);
          cursor: pointer;
          z-index: 50;
        }
        &:nth-child(3) {
          position: absolute;
          right: 5px;
          top: 5px;
          width: 18px;
          height: 18px;
          background-image: url(../img/cancel.png);
          cursor: pointer;
          z-index: 50;
        }
      }
    }
  }
  .content_mes {
    line-height: 25px;
    position: relative;
    div {
      height: 25px;
      left: 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: keep-all;
    }
    .input-search {
      display: inline-block;
      width: auto;

      input {
        box-sizing: border-box;
        text-align: center;
        font-size: 12px;
        height: 20px;
        border: 1px solid #686868;
        color: #e4e4e4;
        -web-kit-appearance: none;
        -moz-appearance: none;
        display: inline-block;
        outline: 0;
        padding: 0 1em;
        text-decoration: none;
        border-radius: 8px;
        background-color: #1c1c1c;
        width: 100px;
      }
    }
  }
}
</style>
<style lang="scss">
.video_option_content {
  .content_top {
    background-color: #010101;
    .source-img {
      opacity: 0;
      transition: opacity 0.5s ease;
      &.loaded {
        opacity: 1;
      }
    }
  }
}
</style>
