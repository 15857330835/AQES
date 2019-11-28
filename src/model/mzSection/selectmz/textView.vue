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
import { openapiTextList, openapiTextSearch } from '@/api/OpenApi'
import _ from 'lodash'
export default {
  components: {
    mzAside,
    pane
  },
  props: ['handleMouseDown', 'handleMouseMove', 'handleMouseUp'],
  data() {
    return {
      aspect_ratio: '16:9',
      currentNav: null
    }
  },
  inheritAttrs: false,
  watch: {},
  computed: {
    list() {
      return [
        {
          title: '简讯',
          interface: {
            list: _.partial(openapiTextList, {
              category: '简讯',
              aspect_ratio: this.aspect_ratio
            }),
            search: _.partial(openapiTextSearch, {
              category: '简讯',
              aspect_ratio: this.aspect_ratio
            })
          },
          sourceType: 'text_id',
          flag: 2
        },
        {
          title: '结尾',
          interface: {
            list: _.partial(openapiTextList, {
              category: '结尾',
              aspect_ratio: this.aspect_ratio
            }),
            search: _.partial(openapiTextSearch, {
              category: '结尾',
              aspect_ratio: this.aspect_ratio
            })
          },
          sourceType: 'text_id',
          flag: 2
        },
        {
          title: '基础文本',
          interface: {
            list: _.partial(openapiTextList, {
              category: '基础文本',
              aspect_ratio: this.aspect_ratio
            }),
            search: _.partial(openapiTextSearch, {
              category: '基础文本',
              aspect_ratio: this.aspect_ratio
            })
          },
          sourceType: 'text_id',
          flag: 2
        },
        {
          title: '动态文本',
          interface: {
            list: _.partial(openapiTextList, {
              category: '动态文本',
              aspect_ratio: this.aspect_ratio
            }),
            search: _.partial(openapiTextSearch, {
              category: '动态文本',
              aspect_ratio: this.aspect_ratio
            })
          },
          sourceType: 'text_id',
          flag: 2
        }
      ]
    }
  },
  methods: {
    handleSelectLi(data) {
      // eslint-disable-next-line no-unused-vars
      const { index, navitem } = data
      this.currentNav = navitem
    },
    gcd(a, b) {
      let temp
      while (b !== 0) {
        temp = a % b
        // eslint-disable-next-line no-param-reassign
        a = b
        // eslint-disable-next-line no-param-reassign
        b = temp
      }
      return a
    },
    getAspectRatio() {
      const player = this.$store.state.systemmessage.player
      const commonFactor = this.gcd(player.w, player.h)
      return player.w / commonFactor + ':' + player.h / commonFactor
    }
  },
  created() {
    this.currentNav = this.list[0]
    this.aspect_ratio = this.getAspectRatio()
  }
}
</script>
<style lang="scss"></style>
