<template>
  <span class="basic-pane">
    <search-bar
      :title.sync="title"
      :inputEvent="handleTitleSearchChange"
      v-if="showSearchBar"
    ></search-bar>

    <div class="bscroll main" ref="bscroll" :class="{ highest: isHighest }">
      <div class="bscroll-container">
        <!-- <transition-group name="source-list" appear> -->
        <base-source
          v-for="(item, index) in sources"
          :key="item.title + index"
          :source="item"
        ></base-source>
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
        <div style="clear: both"></div>
      </div>
    </div>
    <div class="videolist_right_bottom"></div>
  </span>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
// import datePicker from '@/components/datePicker'
import baseSource from '@/components/baseSource'
import BScroll from 'better-scroll'
import SearchBar from '@/components/searchBar'
import _ from 'lodash'

export default {
  components: {
    baseSource,
    SearchBar
  },
  props: ['getData', 'sourceType', 'flag', 'searchDisable', 'paneTitle'],
  data() {
    return {
      page: 1,
      num: 20,
      aBScroll: null,
      loadingShow: true,
      title: '',
      sources: []
    }
  },
  watch: {
    getData() {
      // 左侧被点击后pane数据重新刷新
      this.reset()
      this.title = ''
    }
  },
  computed: {
    ...mapState(['Mrzydata']),
    fetchMoreEnable() {
      // 如果没有搜索数据，那么就允许fetchMore
      return this.title === ''
    },
    showSearchBar() {
      return !this.searchDisable
    },
    isHighest() {
      // 转场特效的pane高度很大
      return this.paneTitle === '转场特效'
    },
    noDataShow() {
      return this.sources.length === 0
    }
  },
  methods: {
    ...mapMutations(['UPDATE_MRZY_DATA']),
    isSuccess(res) {
      return res.Flag === 100 || res.code === 0
    },
    transferData(data) {
      return data.map(item => {
        if (item.category === '动态文本') {
          // 动态文本的特殊情况
          return {
            staticImg: `//${item.preview_img}`,
            url: '',
            from: item[this.sourceType],
            flag: this.flag,
            source: this.sourceType,
            title: item.name,
            dynamicImg: `//${item.preview_img_gif}`
          }
        }
        if (item.service) {
          // 转场特效的特殊情况
          return {
            staticImg: `${item.preview_img_jpg}`,
            dynamicImg: `${item.preview_img_gif}`,
            title: item.name,
            service: item.service
          }
        }
        if (typeof item.category === 'undefined') {
          // 动效列表的特殊情况
          return {
            staticImg: `//${item.preview_img}`,
            dynamicImg: `//${item.preview_img_gif}`,
            textId: item.text_id,
            title: item.name,
            url: item.url,
            from: item[this.sourceType],
            flag: this.flag,
            source: this.sourceType
          }
        }
        return {
          staticImg: `//${item.preview_img}`,
          url: item.url,
          from: item[this.sourceType],
          flag: this.flag,
          source: this.sourceType,
          title: item.name
        }
      })
    },
    changeLoadingStatus(data) {
      this.loadingShow = data.length === this.num
    },
    async fetchMore() {
      const res = await this.getData.list({ page: this.page++, num: this.num })
      if (res.Flag === 100) {
        if (typeof res.data === 'undefined') {
          res.data = res.List
        }
        this.UPDATE_MRZY_DATA([...this.Mrzydata, ...res.data])
        const formatedData = this.transferData(res.data)
        this.sources = this.sources.concat(formatedData)
        this.changeLoadingStatus(res.data)
      }
    },
    handleTitleSearchChange: _.debounce(async function() {
      let res
      if (this.title !== '') {
        // search接口必须要传入search_str参数,否则不能返回数据
        res = await this.getData.search({ search_str: this.title })
        if (this.isSuccess(res)) {
          if (typeof res.data === 'undefined') {
            res.data = res.List
          }
          // this.UPDATE_MRZY_DATA(res.data)
          this.UPDATE_MRZY_DATA([...this.Mrzydata, ...res.data])
          this.sources = this.transferData(res.data)
          this.changeLoadingStatus(res.data)
        }
      } else {
        this.reset()
        this.fetchMore()
      }
    }, 500),
    async reset() {
      console.log('mounted get pane')
      this.page = 1
      const res = await this.getData.list({ page: this.page++, num: this.num })
      if (this.isSuccess(res)) {
        if (typeof res.data === 'undefined') {
          res.data = res.List
        }
        // this.UPDATE_MRZY_DATA(res.data)
        this.UPDATE_MRZY_DATA([...this.Mrzydata, ...res.data])
        // console.log(this.Mrzydata)
        this.sources = this.transferData(res.data)
        this.changeLoadingStatus(res.data)
      }
      this.aBScroll && this.aBScroll.scrollTo(0, 0) // navbar滑到最上面
      this.fetchMore() // 解决屏幕过大导致20个块不能铺满pane，导致loading出现的问题
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
        if (y <= that.aBScroll.maxScrollY + 50) {
          setTimeout(() => {
            if (that.fetchMoreEnable) that.fetchMore()
          }, 800)
        }
      })
      this.reset()
    })
  }
}
</script>
<style lang="scss">
.basic-pane {
  .main {
    position: relative;
    height: calc(100% - 90px);
    overflow-y: hidden;
    outline: none;
    &.highest {
      height: calc(100% - 10px);
    }
    .bscroll-indicator {
      background-color: rgb(170, 170, 170) !important;
      border: none !important;
    }
  }
}
.source-list-enter-active,
.source-list-leave-active {
  transition: all 0.5s;
}
.source-list-enter,
.source-list-leave-to {
  opacity: 0;
}
.source-list-move {
  transition: transform 0.5s;
}
.loading {
  float: left;
  width: 100%;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading-item {
  width: 4px;
  height: 6px;
  background: #68b2ce;
  float: left;
  margin: 0 3px;
  animation: loading linear 1s infinite;
  -webkit-animation: loading linear 1s infinite;
}
.loading-item:nth-child(1) {
  animation-delay: 0s;
}
.loading-item:nth-child(2) {
  animation-delay: 0.15s;
}
.loading-item:nth-child(3) {
  animation-delay: 0.3s;
}
.loading-item:nth-child(4) {
  animation-delay: 0.45s;
}
.loading-item:nth-child(5) {
  animation-delay: 0.6s;
}
@keyframes loading {
  0%,
  60%,
  100% {
    transform: scale(1);
  }
  30% {
    transform: scaleY(3);
  }
}
@-webkit-keyframes loading {
  0%,
  60%,
  100% {
    transform: scale(1);
  }
  30% {
    transform: scaleY(3);
  }
}
</style>
