<template>
  <div>
    <mzAside :list="list" @selectLi="handleSelectLi"></mzAside>
    <div
      class="videolist_right"
      @mousedown.left="handleMouseDown"
      @touchstart="handleMouseDown"
      @touchmove="handleMouseMove"
      @touchend="handleMouseUp"
    >
      <pane
        :getData="currentPaneInterface"
        v-if="paneShow"
        :showDatePicker="showDatePicker"
        :showTitleSearch="showTitleSearch"
        :transPaneData="transPaneData"
      ></pane>
      <div v-html="html"></div>
      <mydir v-if="libShow" :transPaneData="transPaneData"></mydir>
    </div>
  </div>
</template>

<script>
// import axios from 'axios'
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/mzPane'
// import { getMssVideoUpload, getMssVideoDirect } from '@/api/OpenApi'
import { libListApi } from '@/api/Lib'
import mydir from '@/model/mzSection/selectmz/mydir'
export default {
  components: {
    mzAside,
    pane,
    mydir
  },
  props: [
    'handleMouseDown',
    'handleMouseMove',
    'handleMouseUp',
    'transPaneData'
  ],
  data() {
    return {
      list: [
        {
          title: '我的素材',
          interface: libListApi
        }
      ],
      currentPaneInterface: null,
      paneShow: true,
      libShow: false,
      showDatePicker: true,
      showTitleSearch: false,
      html: ''
    }
  },
  inheritAttrs: false,
  computed: {},
  methods: {
    handleSelectLi(data) {
      // eslint-disable-next-line no-unused-vars
      const { index, navitem } = data
      this.checkStatus(navitem)
    },
    checkStatus(navitem) {
      this.html = navitem.html
      this.libShow = navitem.title === '我的素材'
      this.paneShow = !(this.libShow || navitem.html)
      if (this.paneShow) {
        this.currentPaneInterface = navitem.interface
        this.showDatePicker = !!navitem.config.showDatePicker
        this.showTitleSearch = !!navitem.config.showTitleSearch
      }
    }
  },
  created() {
    if (window.NCES.mzList) {
      this.list = window.NCES.mzList.concat(this.list)
    }
  },
  mounted() {
    this.currentPaneInterface = this.list[0].interface
    this.checkStatus(this.list[0])
  }
}
</script>
<style lang="scss"></style>
