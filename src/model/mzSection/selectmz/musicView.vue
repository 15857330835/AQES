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
        :transPaneData="transPaneData"
      ></pane>
    </div>
  </div>
</template>

<script>
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/basicPane'
import { openapiAudioList, openapiAudioSearch } from '@/api/OpenApi'
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
      list: [
        {
          title: '背景音乐',
          interface: {
            list: _.partial(openapiAudioList, '背景音乐'),
            search: _.partial(openapiAudioSearch, '背景音乐')
          },
          sourceType: 'audio_id',
          flag: 1
        },
        {
          title: '场景拟声',
          interface: {
            list: _.partial(openapiAudioList, '场景拟声'),
            search: _.partial(openapiAudioSearch, '场景拟声')
          },
          sourceType: 'audio_id',
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
