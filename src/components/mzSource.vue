<template>
  <div class="video_option_content">
    <div class="content_top" style="backgroundColor: #010101;">
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
        this.source.mp4_1080 ||
        this.source.mp4_720 ||
        this.source.mp4_480 ||
        this.source.m3u8_1080 ||
        this.source.m3u8_720 ||
        this.source.m3u8_480 ||
        this.source.m3u8 ||
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
<style lang="scss" scoped>
.source-img {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.source-img.loaded {
  opacity: 1;
}
</style>
