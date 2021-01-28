<template>
  <div class="dolist1">
    <span
      @click="unlockTrack"
      class="u-icon"
      :class="this.track.block ? 'lock' : 'unlock'"
    ></span>
    <span
      @click="hideTrack"
      class="u-icon"
      :class="this.track.bhidden ? 'hide' : 'show'"
    ></span>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  props: ['track', 'type', 'index'],
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['CHANGE_TRACK']),
    unlockTrack() {
      const that = this
      let data
      if (this.type === 'caption') {
        if (this.track.block) {
          data = { cmd: 'unlock' }
        } else {
          data = { cmd: 'lock' }
        }
        this.track.block = !this.track.block
        $.post(
          window.AQES.DOMAIN + '/api/caption',
          JSON.stringify(data),
          function(res) {
            that.CHANGE_TRACK({ type: 'caption', status: that.track })
            // Hub.$emit('changeM','')
          },
          'json'
        )
      } else {
        if (this.track.block) {
          data = {
            cmd: 'unlock',
            track_id: this.track.track_id,
            track_type: this.track.track_type
          }
        } else {
          data = {
            cmd: 'lock',
            track_id: this.track.track_id,
            track_type: this.track.track_type
          }
        }
        this.track.block = !this.track.block
        $.post(
          window.AQES.DOMAIN + '/api/track',
          JSON.stringify(data),
          function(res) {
            that.CHANGE_TRACK({
              type: that.type,
              status: { block: that.track.block },
              index: that.index
            })
          },
          'json'
        )
      }
    },
    hideTrack() {
      const that = this
      let data
      if (this.type === 'caption') {
        if (this.track.bhidden) {
          data = { cmd: 'show' }
        } else {
          data = { cmd: 'hidden' }
        }
        this.track.bhidden = !this.track.bhidden
        $.post(
          window.AQES.DOMAIN + '/api/caption',
          JSON.stringify(data),
          function(res) {
            that.CHANGE_TRACK({ type: 'caption', status: that.track })
          },
          'json'
        )
      } else {
        if (this.track.bhidden) {
          data = {
            cmd: 'show',
            track_id: this.track.track_id,
            track_type: this.track.track_type
          }
        } else {
          data = {
            cmd: 'hidden',
            track_id: this.track.track_id,
            track_type: this.track.track_type
          }
        }
        this.track.bhidden = !this.track.bhidden
        $.post(
          window.AQES.DOMAIN + '/api/track',
          JSON.stringify(data),
          function(res) {
            that.CHANGE_TRACK({
              type: that.type,
              status: { bhidden: that.track.bhidden },
              index: that.index
            })
          },
          'json'
        )
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dolist1 {
  display: flex;
  width: 0.48rem;
  > span {
    width: 0.2rem;
    height: 0.2rem;
    margin-right: 0.04rem;
    cursor: pointer;
    background-size: 95%;
    background-repeat: no-repeat;
    &.lock {
      background-image: url(../../img/suoding.png);
      background-size: 60% auto;
    }
    &.unlock {
      background-image: url(../../img/unlock.png);
      background-size: 60% auto;
    }
    &.show {
      background-image: url(../../img/xianshi.png);
    }
    &.hide {
      background-image: url(../../img/yincang.png);
    }
  }
}
</style>
