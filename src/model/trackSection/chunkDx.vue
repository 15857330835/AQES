<template>
  <div
    :style="{
      backgroundRepeat: 'repeat',
      position: 'absolute',
      backgroundSize: 'auto 100%',
      height: '62px',
      width:
        (this.chunk.track_end - this.chunk.track_start) /
          (this.slidernum.max - this.track_property.ratio) +
        'px',
      left:
        this.chunk.track_start /
          (this.slidernum.max - this.track_property.ratio) +
        'px'
    }"
  >
    <div
      class=" fchunkbox chunkboxdx"
      :class="
        this.activechunk.chunk.chunk_id == this.chunk.chunk_id
          ? this.activechunk.state
          : ''
      "
      style="width:100%;position:absolute"
      @dblclick="openway == 'pc' ? dblclick($event) : temp()"
      @touchend="mousedown"
      @click="click"
    ></div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
export default {
  data: function() {
    return {
      lastt: 0
    }
  },
  props: ['chunk'],
  computed: {
    ...mapState(['openway', 'activechunk', 'slidernum']),
    track_property() {
      return this.$store.state.all.track_property
    }
  },
  methods: {
    ...mapActions([]),
    ...mapMutations(['ACTIVE_CHUNK', 'CHANGE_BOXSET']),
    // eslint-disable-next-line no-empty-function
    temp: function() {},
    mousedown: function(e) {
      if (e.touches && e.touches.length > 1) {
        return
      }
      if (Date.now() - this.lastt < 300) {
        this.dblclick()
      }
      this.lastt = Date.now()
    },
    click: function(target) {
      this.ACTIVE_CHUNK({ chunk: this.chunk, state: 'active' })
    },
    dblclick: function(e) {
      this.CHANGE_BOXSET('savezc')
    }
  }
}
</script>

<style></style>
