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
      ></pane>
    </div>
  </div>
</template>

<script>
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/basicPane'
import { openapiVideoList, openapiVideoSearch } from '@/api/OpenApi'
import _ from 'lodash'
export default {
  components: {
    mzAside,
    pane
  },
  props: ['handleMouseDown', 'handleMouseMove', 'handleMouseUp'],
  data() {
    return {
      list: [
        {
          title: '通用素材',
          interface: {
            list: _.partial(openapiVideoList, '通用素材'),
            search: _.partial(openapiVideoSearch, '通用素材')
          },
          sourceType: 'video_id',
          flag: 1
        },
        {
          title: '动态背景',
          interface: {
            list: _.partial(openapiVideoList, '动态背景'),
            search: _.partial(openapiVideoSearch, '动态背景')
          },
          sourceType: 'video_id',
          flag: 1
        }
      ],
      currentNav: null
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
