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
import { openapiImageList, openapiImageSearch } from '@/api/OpenApi'
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
          title: '背景',
          interface: {
            list: _.partial(openapiImageList, '背景'),
            search: _.partial(openapiImageSearch, '背景')
          },
          sourceType: 'image_id',
          flag: 3
        },
        {
          title: '贴图',
          interface: {
            list: _.partial(openapiImageList, '贴图'),
            search: _.partial(openapiImageSearch, '贴图')
          },
          sourceType: 'image_id',
          flag: 3
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
