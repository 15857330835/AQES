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
        :getData="currentNav.interface"
        :sourceType="currentNav.sourceType"
        :flag="currentNav.flag"
        :searchDisable="currentNav.searchDisable"
        :paneTitle="currentNav.title"
        :transPaneData="transPaneData"
      ></pane>
    </div>
  </div>
</template>

<script>
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/basicPane'
import { openapiVideoList, openapiVideoSearch } from '@/api/OpenApi'
import { transitionAllApi } from '@/api/Transition'
import _ from 'lodash'
export default {
  components: {
    mzAside,
    pane
  },
  props: [
    'handleMouseDown',
    'handleMouseMove',
    'handleMouseUp',
    'transPaneData'
  ],
  data() {
    return {
      currentNav: null,
      list: [
        {
          title: '转场特效',
          interface: {
            list: transitionAllApi
          },
          searchDisable: true
        },
        {
          title: '转场视频',
          interface: {
            list: _.partial(openapiVideoList, '转场'),
            search: _.partial(openapiVideoSearch, '转场')
          },
          sourceType: 'video_id',
          flag: 3
        }
      ]
    }
  },
  inheritAttrs: false,
  watch: {},
  computed: {},
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
<style lang="scss"></style>
