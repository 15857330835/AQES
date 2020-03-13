<template>
  <span class="caption-pane">
    <div class="bscroll main" ref="bscroll">
      <div class="bscroll-container">
        <!-- <transition-group name="source-list" appear> -->
        <div
          class="source-container"
          v-for="(item, index) in sources"
          :key="item.title + index"
        >
          <caption-source :source="item"></caption-source>
        </div>
        <div
          class="source-container fake-container"
          v-for="(item, index) in fakeData"
          :key="'fake' + index"
        ></div>
        <!-- </transition-group> -->
      </div>
    </div>
  </span>
</template>

<script>
import captionSource from '@/components/captionSource'
import BScroll from 'better-scroll'
// import _ from 'lodash'

export default {
  components: {
    captionSource
  },
  props: ['getData'],
  data() {
    return {
      sources: [],
      page: 1,
      num: 20,
      aBScroll: null,
      title: '',
      fakeData: [...new Array(9).keys()]
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
      this.page = 1
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
<style lang="scss" scoped>
.caption-pane {
  .main {
    height: calc(100% - 0.12rem);
  }
  .fake-container {
    min-width: 202px;
  }
}
</style>
