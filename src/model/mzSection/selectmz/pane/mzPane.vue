<template>
  <span class="mz-pane">
    <div class="datepicker" v-if="showDatePicker">
      <span>日期 :</span>
      <date-picker
        ref="datePicker"
        @dateChange="handleDateChange"
        @clearDate="handleClearDate"
      ></date-picker>
      <!-- <span class="search"></span> -->
    </div>
    <search-bar
      :title.sync="title"
      :inputEvent="handleTitleSearchChange"
      v-if="showTitleSearch"
    ></search-bar>

    <div class="bscroll main" ref="bscroll">
      <div class="bscroll-container">
        <mz-source
          :source="item"
          v-for="(item, index) in sources"
          :key="item.id + index"
        ></mz-source>
        <div
          class="video_option_content fake-placeholder"
          v-for="(item, index) in fakeData"
          :key="'fake' + index"
        ></div>
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
    <div class="videolist_right_bottom">
      <div class="bottom_tips">
        <span class="u-icon"></span>如果有卡顿，请到
        <span style="cursor:pointer">我的历史</span> 将视频加载到本地。
      </div>
    </div>
  </span>
</template>

<script>
import datePicker from '@/components/datePicker'
import mzSource from '@/components/mzSource'
import BScroll from 'better-scroll'
import SearchBar from '@/components/searchBar'
import _ from 'lodash'
import { mapState, mapMutations } from 'vuex'

export default {
  components: {
    datePicker,
    mzSource,
    SearchBar
  },
  props: [
    'handleMouseDown',
    'handleMouseMove',
    'handleMouseUp',
    'getData',
    'showDatePicker',
    'showTitleSearch',
    'transPaneData'
  ],
  data() {
    return {
      sources_: [],
      sources: [],
      page: 1,
      num: 20,
      aBScroll: null,
      loadingShow: true,
      title: '',
      sTime: '',
      eTime: '',
      fakeData: [...new Array(9).keys()]
    }
  },
  watch: {
    getData() {
      // 左侧被点击后pane数据重新刷新
      this.$refs.datePicker && this.$refs.datePicker.clearDate()
      this.title = ''
      this.reset()
    },
    transPaneData(newVal) {
      if (newVal) {
        // console.log(newVal, 'mz')
        this.$nextTick(() => {
          this.aBScroll.refresh()
          // this.CHANGE_IS_REFRESH_PANES_BS(false)
        })
      }
    }
    // sources:{
    //   handle:function(){
    //     this.sources_ = this.sources
    //   },
    //   deep:true,
    // }
  },
  computed: {
    ...mapState(['isRefreshPanesBS']),
    noDataShow() {
      return this.sources.length === 0
    }
  },
  methods: {
    ...mapMutations(['CHANGE_IS_REFRESH_PANES_BS']),
    fetchMore() {
      this.getData(
        {
          page: this.page++,
          sTime: this.sTime,
          eTime: this.eTime,
          title: this.title,
          num: this.num
        },
        res => {
          // console.log(res)
          if (res.length > 0) {
            this.sources = this.sources.concat(res)
          }
          this.loadingShow = res.length === this.num
          // console.log(this.loadingShow)
        }
      )
      // this.sources = this.sources.concat(NCES.callbackResult); // 更新数据，NCES.callbackResult无法监听
      // console.log(this.sources)
      // this.loadingShow = this.sources === this.num;
    },
    handleDateChange(data) {
      // eslint-disable-next-line prettier/prettier
      [this.sTime, this.eTime] = data
      this.reset()
    },
    handleClearDate() {
      this.sTime = ''
      this.eTime = ''
      this.reset()
    },
    handleTitleSearchChange: _.debounce(function() {
      this.reset()
    }, 500),
    reset() {
      // console.trace();
      // this.loadingShow = true
      this.page = 1
      this.getData(
        {
          page: this.page,
          sTime: this.sTime,
          eTime: this.eTime,
          title: this.title,
          num: this.num
        },
        res => {
          // console.log(res)
          this.sources = [] // 重置sources数组
          this.sources = this.sources.concat(res)
          this.loadingShow = res.length === this.num
        }
      )

      // this.sources = this.sources.concat(NCES.callbackResult);
      // this.aBScroll && this.aBScroll.scrollTo(0, 0); // navbar滑到最上面
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
            that.fetchMore()
          }, 800)
        }
      })
      this.fetchMore()
    })
  }
}
</script>
<style lang="scss" scoped>
.mz-pane {
  .datepicker {
    padding: 0 18px;
    line-height: 50px;
  }
}
</style>
<style lang="scss">
.videolist_right_bottom {
  height: 0.53rem;
  line-height: 0.53rem;
  padding: 0 0.2rem;
  .bottom_tips {
    float: left;
    span {
      color: #61ded0;
      &.u-icon {
        background-image: url(../../../../img/danger.png);
        display: inline-block;
        vertical-align: middle;
        margin-top: -2px;
        margin-right: 10px;
        width: 16px;
        height: 16px;
        background-size: 100%;
      }
    }
  }
}
</style>
