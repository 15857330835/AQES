<template>
  <div class="track-mask" v-if="trackMaskIsShow" @mousedown="failClick"></div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'TrackMask',
  props: ['track', 'type', 'index'],
  computed: {
    ...mapState(['activechunk', 'isTrackSelect']),
    trackMaskIsShow() {
      return (
        this.track.track_id === this.activechunk.chunk.track_id &&
        this.isTrackSelect
      )
    }
  },
  methods: {
    failClick(e) {
      e.stopPropagation()
    }
  }
}
</script>

<style lang="scss" scoped>
.track-mask {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1004;
  border: 3px solid #61ded0;
  box-sizing: border-box;
}
</style>
