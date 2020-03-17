<template>
  <span class="basic-pane">
    <div class="bscroll main highest" ref="bscroll">
      <div class="bscroll-container">
        <!-- <transition-group name="source-list" appear> -->
        <div
          class="source-container"
          v-for="(item, index) in sources"
          :key="item.src_id + index"
        >
          <history-source :data="item"></history-source>
        </div>

        <div
          class="source-container fake-container"
          v-for="(item, index) in fakeData"
          :key="'fake' + index"
        ></div>
        <!-- </transition-group> -->
        <div class="loading" v-show="loadingShow">
          <div class="loading-item"></div>
          <div class="loading-item"></div>
          <div class="loading-item"></div>
          <div class="loading-item"></div>
          <div class="loading-item"></div>
        </div>
        <div
          v-show="noDataShow"
          style="text-align: center; width: 100%;padding: 10px;box-sizing: border-box;"
        >
          暂无数据
        </div>
      </div>
    </div>
    <div class="videolist_right_bottom"></div>
  </span>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import historySource from '@/components/historySource'
import BScroll from 'better-scroll'
// import _ from 'lodash'

export default {
  components: {
    historySource
  },
  props: ['getData', 'transPaneData'],
  data() {
    return {
      page: 1,
      num: 20,
      aBScroll: null,
      loadingShow: true,
      sources: [],
      fakeData: [...new Array(9).keys()]
    }
  },
  watch: {
    getData() {
      // 左侧被点击后pane数据重新刷新
      this.reset()
    },
    transPaneData(newVal) {
      if (newVal) {
        // console.log(newVal, 'history')
        this.$nextTick(() => {
          this.aBScroll.refresh()
          // this.CHANGE_IS_REFRESH_PANES_BS(false)
        })
      }
    }
  },
  computed: {
    ...mapState(['isRefreshPanesBS']),
    noDataShow() {
      return this.sources.length === 0
    }
  },
  methods: {
    ...mapMutations(['CHANGE_IS_REFRESH_PANES_BS']),
    isSuccess(res) {
      return res.Flag === 100 || res.code === 0
    },
    changeLoadingStatus(data) {
      this.loadingShow = data.length === this.num
    },
    async fetchMore() {
      const { api, params } = this.getData.list
      const res = await api(
        Object.assign(params, { index: this.page++, number: this.num })
      )
      if (this.isSuccess(res)) {
        this.sources = this.sources.concat(res.data)
        this.changeLoadingStatus(res.data)
      }
    },
    async reset() {
      this.page = 1
      const { api, params } = this.getData.list
      const res = await api(
        Object.assign(params, { index: this.page++, number: this.num })
      )
      if (this.isSuccess(res)) {
        this.sources = res.data
        this.changeLoadingStatus(res.data)
      }
      this.aBScroll && this.aBScroll.scrollTo(0, 0) // navbar滑到最上面
      this.fetchMore()
    }
  },
  mounted() {
    this.$nextTick(() => {
      const bscrollDom = this.$refs.bscroll
      this.aBScroll = new BScroll(bscrollDom, {
        mouseWheel: true,
        click: true,
        tap: true,
        scrollbar: {
          fade: true,
          interactive: true
        }
      })
      const that = this
      this.aBScroll.on('scrollEnd', function({ x, y }) {
        if (y <= that.aBScroll.maxScrollY) {
          setTimeout(() => {
            // if(that.fetchMoreEnable)
            that.fetchMore()
          }, 800)
        }
      })
      this.reset()
    })
  }
}
</script>
<style lang="scss" scoped></style>
