<template>
  <div
    class="timerbox"
    :title="this.activeProperty[this.index].f"
    :style="{
      width: '11px',
      height: '13px',
      position: 'absolute',
      top: '-4px',
      left:
        (this.activeProperty[this.index].f * 100) /
          (this.activechunk.chunk.src_end - this.activechunk.chunk.src_start) +
        '%'
    }"
  >
    <div
      class="timer"
      :class="this.index == this.propertyNum ? 'active' : ''"
      @click="sel($event.currentTarget)"
    >
      <span style=""></span>
    </div>
    <div class="deldian" @click="del" v-show="this.index != 0"></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return {}
  },
  //   components: {
  //   		systemmes,
  //   },
  props: ['index'],
  computed: {
    ...mapState([
      'activechunk',
      'activeProperty',
      'notify',
      'filtershow',
      'systemmessage',
      'propertyNum'
    ])
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'getindex', 'geoPost']),
    ...mapMutations(['CHANGE_PROPERTYNUM', 'CHANGE_ACTIVEPROPERTY']),
    sel(target) {
      this.CHANGE_PROPERTYNUM(this.index)
      const position =
        this.activechunk.chunk.track_start + this.activeProperty[this.index].f

      const data = {}
      const that = this
      data.type = 'pointer'
      data.data = { cmd: 'set', position: position }
      data.success = function() {
        that.getindex()
      }
      this.Post(data)
    },
    del() {
      const geo_arr = []
      for (let i = 0; i < this.activeProperty.length; i++) {
        if (i !== this.index) {
          geo_arr.push(this.activeProperty[i])
        }
      }
      this.CHANGE_PROPERTYNUM(this.index - 1)
      this.geoPost({
        geo_arr
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.timer {
  position: absolute;
  width: 11px;
  height: 7px;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  background-color: #b9b9b9;
  cursor: pointer;
  &.active {
    background-color: #61ded0;
    span {
      border-top: 5.5px solid #61ded0;
    }
    & + .deldian {
      position: absolute;
      cursor: pointer;
      width: 11px;
      height: 11px;
      background-image: url(../../img/del.png);
      background-size: 100%;
      background-repeat: no-repeat;
      top: -15px;
    }
  }
  span {
    display: inline-block;
    border: 5.5px solid transparent;
    border-top: 5.5px solid #b9b9b9;
    position: absolute;
    top: 7px;
  }
}
</style>
