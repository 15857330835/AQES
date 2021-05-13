<template>
  <div class="track_hide" v-if="this.track.bhidden || this.track.block">
    <div @click="showTrack" v-if="this.track.bhidden" class="show">
      <span></span>
      <span>显示轨道</span>
    </div>
    <div @click="unlockTrack" v-if="this.track.block" class="lock">
      <span></span>
      <span>解锁轨道</span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapMutations } from 'vuex'
export default {
  data() {
    return {}
  },
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
          window.AQES.DOMAIN + '/api/caption' + `?authKey=${window.AQES.authKey}`,
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
          window.AQES.DOMAIN + '/api/track' + `?authKey=${window.AQES.authKey}`,
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
    showTrack() {
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
          window.AQES.DOMAIN + '/api/caption' + `?authKey=${window.AQES.authKey}`,
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
          window.AQES.DOMAIN + '/api/track' + `?authKey=${window.AQES.authKey}`,
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

<style>
.track_hide {
  height: 100%;
  width: 100%;
  position: absolute;
  z-index: 1003;
  background: repeating-linear-gradient(
    -45deg,
    rgba(51, 51, 51, 0.9),
    rgba(51, 51, 51, 0.9) 5px,
    rgba(68, 68, 68, 0.9) 0,
    rgba(68, 68, 68, 0.9) 10px
  );
}
.track_hide div {
  display: inline-block;
  position: relative;
  left: 10px;
  top: 50%;
  width: 90px;
  transform: translate(0, -50%);
  cursor: pointer;
}
.track_hide div span:nth-child(1) {
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  width: 14px;
  height: 18px;
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  background-image: url(../../img/xianshi.png);
}
.track_hide div.show span:nth-child(1) {
  background-image: url(../../img/yincang.png);
}
.track_hide div.lock span:nth-child(1) {
  background-size: 80%;
  background-image: url(../../img/suoding.png);
}
.track_hide div span:nth-child(2) {
  font-size: 14px;
  color: #868484;
  position: relative;
  left: 20px;
}
</style>
