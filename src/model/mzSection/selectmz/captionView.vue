<template>
  <div>
    <mzAside :list="list" @selectLi="handleSelectLi"></mzAside>
    <div class="videolist_right">
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
import pane from '@/model/mzSection/selectmz/pane/captionPane'
import { captionStyleListApi } from '@/api/Caption'
// import _ from 'lodash'
export default {
  components: {
    mzAside,
    pane
  },
  props: [],
  data() {
    return {
      list: [
        {
          title: '字幕列表',
          interface: {
            list: captionStyleListApi
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
      // const { index, navitem } = data
      this.currentNav = data.navitem
    }
  },
  created() {
    this.currentNav = this.list[0]
  }
}
</script>
<style lang="scss"></style>
