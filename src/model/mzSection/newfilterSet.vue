<template>
  <div style="width:100%;height:100%;position:relative;overflow:hidden">
    <div
      v-if="this.activeProperty.length > 0"
      :style="{
        position: 'absolute',
        boxSizing: 'border-box',
        border: '1px solid #acacac',
        width: this.activeProperty[this.propertyNum].w + '%',
        height: this.activeProperty[this.propertyNum].h + '%',
        left: this.activeProperty[this.propertyNum].left + '%',
        top: this.activeProperty[this.propertyNum].top + '%'
      }"
    >
      <setcutting v-if="this.filtershow == 'cutting'"></setcutting>
      <setmosaic
        v-if="this.filtershow == 'mosaic' || this.filtershow == 'fastblur'"
      ></setmosaic>
      <!-- <setFastblur v-if = "this.filtershow == 'fastblur'"></setFastblur> -->
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import setcutting from './setCutting'
import setmosaic from './setMosaic'
// import setFastblur from './setFastblur'
// <set-cutting  v-if = "this.filtershow == 'cutting'"/>
// <set-mosaic  v-if = "this.filtershow == 'mosaic'"/>
//
export default {
  data: function() {
    return {}
  },
  components: {
    setcutting,
    setmosaic
    //   setFastblur
  },
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum'
    ]),
    filterList: function() {
      // 格式化滤镜数据
      const filter = this.activechunk.chunk.filter
      const data = {}
      for (let i = 0; i < filter.length; i++) {
        switch (filter[i].service) {
          case 'mirror': {
            if (!data.mirror) {
              data.mirror = {}
              data.mirror[i] = filter[i]
            } else {
              data.mirror[i] = filter[i]
            }
            break
          }
          case 'mosaic': {
            if (!data.mosaic) {
              data.mosaic = {}
              data.mosaic[i] = filter[i]
            } else {
              data.mosaic[i] = filter[i]
            }
            break
          }
          default: {
            data[filter[i].service] = filter[i]
          }
        }
      }
      return data
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([
      // 'UPDATE_ACTIVEFILTER',
      'CHANGE_FILTERSHOW'
    ])
  }
}
</script>

<style></style>
