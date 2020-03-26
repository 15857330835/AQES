<template>
  <div>
    <div class="ai-view-mask" v-if="aiViewMaskIsShow"></div>
    <mzAside :list="list" @selectLi="handleSelectLi"></mzAside>
    <div :class="{ videolist_right: true, 'ai-view-show': aiViewMaskIsShow }">
      <pane
        :getData="currentNav.interface"
        :transPaneData="transPaneData"
      ></pane>
    </div>
  </div>
</template>

<script>
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/aiCaptionPane'
import { aiListApi } from '@/api/Ai'
// import _ from 'lodash'
import { mapState } from 'vuex'

export default {
  components: {
    mzAside,
    pane
  },
  props: ['transPaneData'],
  data() {
    return {
      list: [
        {
          title: '智能字幕',
          interface: {
            list: aiListApi
          }
        }
      ],
      currentNav: null
    }
  },
  watch: {},
  computed: {
    ...mapState(['aiViewMaskIsShow'])
  },
  methods: {
    handleSelectLi(data) {
      // eslint-disable-next-line no-unused-vars
      const { index, navitem } = data
      this.currentNav = navitem
    }
  },
  created() {
    this.currentNav = this.list[0]
  }
}
</script>
<style lang="scss" scoped>
.ai-view-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10001;
}

.ai-view-show {
  position: relative;
  z-index: 10002;
}
</style>
