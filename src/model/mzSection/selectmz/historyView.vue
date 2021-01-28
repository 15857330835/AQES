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
        v-if="paneShow"
        :transPaneData="transPaneData"
      ></pane>
    </div>
  </div>
</template>

<script>
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/historyPane'
import { sourceGetListApi } from '@/api/Source'
// import _ from 'lodash'
import { sourceType } from '@/config/type'
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
      paneShow: true,
      list: [
        {
          title: '历史媒资',
          interface: {
            list: {
              api: sourceGetListApi,
              params: {
                src_type: sourceType.MEDIA
              }
            }
          }
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
  },
  // 在使用keep-alive的情况下强制使pane刷新
  activated() {
    this.paneShow = true
  },
  deactivated() {
    this.paneShow = false
  }
}
</script>
<style lang="scss"></style>
