<template>
  <span class="basic-pane">
    <div class="bscroll main highest" ref="bscroll">
      <div class="bscroll-container">
        <!-- <transition-group name="source-list" appear> -->
        <history-source
          v-for="(item, index) in sources"
          :key="item.src_id + index"
          :data="item"
        ></history-source>
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
import historySource from '@/components/historySource'
import BScroll from 'better-scroll'
// import _ from 'lodash'

export default {
  components: {
    historySource
  },
  props: ['getData'],
  data() {
    return {
      page: 1,
      num: 20,
      aBScroll: null,
      loadingShow: true,
      sources: []
    }
  },
  watch: {
    getData() {
      // 左侧被点击后pane数据重新刷新
      this.reset()
    }
  },
  computed: {
    ...mapState([]),
    noDataShow() {
      return this.sources.length === 0
    }
  },
  methods: {
    ...mapMutations([]),
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
