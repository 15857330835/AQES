<template>
  <audio :src="audioStatus.src" ref="audio" id="audio"></audio>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState(['audioStatus'])
  },
  watch: {
    'audioStatus.isPlaying': {
      handler(val, old) {
        if (val) {
          this.$refs.audio.play()
        } else {
          this.$refs.audio.pause()
        }
      }
    },
    'audioStatus.src': {
      handler(val, old) {
        if (val !== old && this.audioStatus.isPlaying) {
          // 在设置完src后有一段加载时间,不能立即play
          setTimeout(() => {
            this.$refs.audio.play()
          }, 100)
        }
      }
    }
  },
  methods: {}
}
</script>
