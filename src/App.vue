<template>
  <div
    :id="this.id"
    style="height: 100vh;"
    :class="{ shadow: modalVoiceApplyIsShow || chunksetshow }"
    v-cloak
    v-if="!this.startloading"
  >
    <MainBox></MainBox>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import MainBox from '@/model/MainBox.vue'
import { outputAllApi } from '@/api/Output'

export default {
  components: {
    MainBox
  },
  data() {
    return {
      loadingObj: {},
      id: window.AQES.id
    }
  },
  computed: {
    ...mapState([
      'startloading',
      'onloading',
      'fontlist',
      'openway',
      'chunksetshow',
      'modalVoiceApplyIsShow'
    ]),

    loadingShow() {
      return this.startloading || this.onloading
    }
  },
  watch: {
    loadingShow(state) {
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
        // window.AQES.Getopenapi(
        //   'FontCategory',
        //   { uin: window.AQES.uin },
        //   function(res) {
        //     for (const i in res) {
        //       if (res.hasOwnProperty(i)) {
        //         that.getfont(i)
        //       }
        //     }
        //   }
        // )
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
  created() {
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
    outputAllApi().then(res => {
      if (res.data.state == 1) {
        this.CHANGE_BOXSET('saveprogress')
      }
    })
  },
  methods: {
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
      'CHANGE_BOXSET'
    ]),
    getFilter() {
      // const that = this
      // $.post(
      //   window.AQES.DOMAIN + '/api/filter',
      //   JSON.stringify({ cmd: 'all' }),
      //   function(res) {
      //     if (res.code !== 0) {
      //       setTimeout(that.getFilter, 500)
      //       return
      //     }
      //     const filterlist = []
      //     for (let i = 0; i < res.data.length; i++) {
      //       filterlist.push(res.data[i])
      //       if (res.data[i].service === 'mirror') {
      //         filterlist.push({
      //           name: '镜像',
      //           parameter: {
      //             disable: 1,
      //             value: 6
      //           },
      //           service: 'mirror',
      //           type: 1
      //         })
      //       }
      //     }
      //     that.INIT_FILTERLIST(JSON.stringify(filterlist))
      //   },
      //   'json'
      // )
    },
    getcaption() {
      // 获取字幕分类的列表
      // const that = this
      // const data = {}
      // data.type = 'caption'
      // data.data = { cmd: 'style_list' }
      // data.success = function(res) {
      //   that.INIT_CAPTIONLIST(res.data)
      // }
      // data.error = function(err) {
      //   console.log(err)
      // }
      // this.Post(data)
    },
    getfont(i) {
      const that = this
      window.AQES.Getopenapi(
        'FontList',
        { uin: window.AQES.uin, category: i },
        function(re) {
          that.fontlist[i] = re
          that.INIT_FONTLIST(that.fontlist)
        }
      )
    },
    clearHistory() {
      // this.$axios
      //   .post(
      //     window.AQES.DOMAIN + '/api/history',
      //     JSON.stringify({
      //       cmd: 'clear',
      //       type: 1
      //     })
      //   )
      //   .then(res => {
      //     if (res === 'success') {
      //       console.log('successfully clear history')
      //     }
      //   })
    }
  }
}
</script>

<style lang="scss">
#aqes {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  overflow: hidden;
  color: #e4e4e4;
  background-color: #1c232a;
  position: relative;
}
</style>
<style lang="scss" scoped>
[v-cloak] {
  display: none;
}

.shadow {
  background-color: #151a20 !important;
}
</style>
