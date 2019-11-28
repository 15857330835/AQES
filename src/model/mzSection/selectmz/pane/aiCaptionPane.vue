<template>
  <span class="ai-caption-pane">
    <div class="bscroll main highest" ref="bscroll">
      <div class="bscroll-container">
        <!-- <transition-group name="source-list" appear> -->
        <ai-caption-source
          v-for="(item, index) in sources"
          :key="item.style + index"
          :source="item"
          :index="index"
        ></ai-caption-source>
        <!-- </transition-group> -->
        <div style="clear: both"></div>
      </div>
    </div>
  </span>
</template>

<script>
import aiCaptionSource from '@/components/aiCaptionSource'
import BScroll from 'better-scroll'
// import _ from 'lodash'

export default {
  components: {
    aiCaptionSource
  },
  props: ['getData'],
  data() {
    return {
      sources: [],
      page: 1,
      num: 20,
      aBScroll: null,
      title: ''
    }
  },
  watch: {
    getData() {
      // 左侧被点击后pane数据重新刷新
      this.reset()
    }
  },
  computed: {},
  methods: {
    async reset() {
      const res = await this.getData.list()
      if (res.code === 0) {
        this.sources = res.data
      }
      this.aBScroll && this.aBScroll.scrollTo(0, 0) // navbar滑到最上面
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
      this.reset()
    })
  }
}
</script>
<style lang="scss">
.ai-caption-pane {
  .main {
    position: relative;
    height: calc(100% - 90px);
    overflow-y: hidden;
    outline: none;
    &.highest {
      height: 100%;
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
</style>
