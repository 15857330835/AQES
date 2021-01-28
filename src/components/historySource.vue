<template>
  <div class="video_option_content">
    <div class :data-src_id="source.src_id">
      <div class="content_top">
        <img
          :src="src"
          class="content_top_img source-img"
          v-if="source.preview_img"
          @load="handleImgLoad"
          :class="{ loaded: imgLoaded }"
        />
        <div class="content_top_down" :style="{ backgroundColor: bgc }">
          <span
            class="per dragele"
            :data-src_from="source.from"
            :style="{ color }"
            @dblclick="handleDblClick"
            :title="title"
            >{{ tip }}</span
          >
          <span
            v-show="downloadShow"
            class="sourceDown"
            data-src_type="1"
            :data-src_id="source.src_id"
            @click="handleSourceDown"
            title="点击下载"
          ></span>
          <!-- <span v-show="!downloadShow">
          </span> -->
        </div>
      </div>
      <div class="content_mes">
        <div :title="source.name">{{ source.name }}</div>
        <div>{{ duration }}</div>
      </div>
    </div>
    <!-- <div :data-src_id="buildInSource.src_id" v-else>
      <div class="content_top">
        <span class="content_top_img">{{tip}}</span>
      </div>
      <div class="content_mes">
        <div :title="buildInSource.name">{{buildInSource.name}}</div>
        <div>{{buildInSource.progress.toFixed(0)}}</div>
      </div>
    </div>-->
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import { sourceLoadApi, sourceGetApi, sourceClearApi } from '@/api/Source'
import { loadingStatus } from '@/config/type'
export default {
  props: ['data'],
  data() {
    return {
      timer: null,
      source: this.data,
      imgLoaded: false
    }
  },
  computed: {
    ...mapState(['sourceData']),
    tip() {
      const progress = parseInt(this.source.progress, 10)
      if (progress > 0 && progress < 100) return `下载中 ${progress}%`
      return ''
    },
    color() {
      if (this.source.status === loadingStatus.FAILED) return 'red'
      return '#fff'
    },
    bgc() {
      if (this.source.status === loadingStatus.LOADED) return 'rgba(0,0,0,0)'
      return 'rgba(0,0,0,0.3)'
    },
    src() {
      let url = this.source.preview_img
      url = url.replace(/http:/, '')
      url = url.replace(/https:/, '')
      if (url.indexOf('//') === -1) {
        if (this.source.src_type === 2 || this.source.uncapture_preview_img) {
          url = '//' + url
        } else {
          url = window.AQES.DOMAIN + url
        }
      }
      return url
    },
    duration() {
      if (this.source.sum_frame) {
        return this.formatDuration(this.source.sum_frame / 25)
      }
      return ''
    },
    downloadShow() {
      return (
        !this.source.bload &&
        this.source.progress === 0
      )
    },
    title() {
      if (this.source.src_type !== 1) return ''
      return this.downloadShow ? '双击下载' : '双击清除'
    }
  },
  methods: {
    ...mapMutations([]),
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
    async getSource() {
      const that = this
      const res = await sourceGetApi({ src_id: that.source.src_id })
      if (res.code === 0) {
        this.source.progress = res.data.progress
        if (res.data.status === loadingStatus.FAILED) {
          return
        }
        if (this.source.progress < 100) {
          this.timer = setTimeout(that.getSource, 1000)
        }
      }
    },
    async handleSourceDown() {
      try {
        // load接口短时间不返回数据，调用会报错
        const res = await sourceLoadApi({ src_id: this.source.src_id })
        if (res.code === -1) {
          clearTimeout(this.timer)
          console.log(res.msg)
          if (res.msg === 'no disk space available') {
            this.$alert('磁盘空间已满, 请清除部分缓存')
          }
        }
      } catch (e) {}
      this.getSource()
    },
    async handleSourceClear() {
      const res = await sourceClearApi({ src_id: this.source.src_id })
      if (res.code === 0) {
        this.source.bload = false
        this.source.progress = 0
      }
    },
    isInDownloading(progress) {
      return progress > 0 && progress < 100
    },
    handleImgLoad() {
      this.imgLoaded = true
    },
    handleDblClick() {
      if (this.downloadShow) {
        this.handleSourceDown()
      } else {
        this.handleSourceClear()
      }
    }
  },
  mounted() {
    const progress = parseInt(this.source.progress, 10)
    if (this.isInDownloading(progress)) {
      this.getSource()
    }
  }
}
</script>
<style lang="scss" scoped></style>
