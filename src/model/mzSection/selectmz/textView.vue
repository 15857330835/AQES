<template>
  <div>
    <mzAside :list="filterList" @selectLi="handleSelectLi"></mzAside>
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
        :sourceTitle="currentNav.title"
        :flag="currentNav.flag"
        :transPaneData="transPaneData"
      ></pane>
    </div>
  </div>
</template>

<script>
import mzAside from '@/components/mzAside'
import pane from '@/model/mzSection/selectmz/pane/basicPane'
import {
  openapiTextList,
  openapiTextSearch,
  openapiTextTemplateList,
  openapiTextTemplateSearch
} from '@/api/OpenApi'
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
        },
        {
          title: '动效列表',
          interface: {
            list: _.partial(openapiTextTemplateList, {
              category: '动效列表',
              aspect_ratio: this.aspect_ratio,
              status: 2
            }),
            search: _.partial(openapiTextTemplateSearch, {
              category: '',
              aspect_ratio: this.aspect_ratio,
              status: 2
            })
          },
          sourceType: 'text_id',
          flag: 2
        }
      ]
    },
    filterList() {
      if (
        window.AQES.diff_server &&
        window.AQES.diff_server === 'GuangdianCloud'
      ) {
        return this.list.filter(item => item.title !== '动效列表')
      }
      return this.list
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
    this.aspect_ratio = this.getAspectRatio()
    this.currentNav = this.list[0]
  }
}
</script>
<style lang="scss"></style>
