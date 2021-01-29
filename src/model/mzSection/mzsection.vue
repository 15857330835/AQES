<template>
  <div
    class="clearfix lh media-box"
    :style="{ userSelect: 'none', padding: 0, height: this.height }"
    ref="mediaBox"
  >
    <div
      class="nces_videolist"
      :style="{ width: 'calc(' + this.videoselw + ' - 20px)' }"
    >
      <selectmz v-show="!this.captionsetshow && selectmzShow"></selectmz>
      <captionset v-if="this.captionsetshow"></captionset>
    </div>
    <videoplayer v-if="systemmessage.player"></videoplayer>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
import selectmz from './selectmz/index_smz'
import videoplayer from './videoplayer'
import captionset from './captionset'

export default {
  components: {
    selectmz,
    videoplayer,
    captionset
  },
  data() {
    return {}
  },
  computed: {
    ...mapState([
      'clientwidth',
      'captionsetshow',
      'systemmessage',
      'selectmzShow'
    ]),
    track_property() {
      return this.$store.state.all.track_property
    },
    widthScale() {
      if (this.clientwidth >= 1440) {
        return this.track_property.fanwei['1920'].now * 100
      } else {
        return this.track_property.fanwei['1440'].now * 100
      }
    },
    height() {
      return `calc(100% - 3.28rem)`
      // return `calc(${this.widthScale}vw / 16 * 9 + 1.68rem)`
    },
    videoselw() {
      if (this.clientwidth >= 1440) {
        return 100 - this.track_property.fanwei['1920'].now * 100 + '%'
      } else {
        return 100 - this.track_property.fanwei['1440'].now * 100 + '%'
      }
    }
  },
  watch: {
    height(newVal) {
      this.CHANGE_MZ_HEIGHT(this.$refs.mediaBox.clientHeight)
    }
  },
  mounted() {
    this.CHANGE_MZ_HEIGHT(this.$refs.mediaBox.clientHeight)
  },
  methods: {
    // ...mapActions([
    //   'CHANGE_CLIENTWIDTH'
    // ])
    ...mapMutations(['CHANGE_MZ_HEIGHT'])
  }
}
</script>

<style lang="scss">
.media-box {
  width: 100%;
  height: 0;
  padding-top: calc(50% * 9 / 16);
  padding-bottom: 67px;
  position: relative;
  .nces_videolist {
    width: calc(50% - 10px);
    height: 100%;
    position: absolute;
    top: 0;
  }
}
.listContent {
  height: calc(100% - 0.68rem);
}
.videolist_right {
  width: calc(100% - 1.75rem);
  float: left;
  height: 100%;
  background-color: #1c232a;
  position: relative;
  font-size: 12px;
}
.videolist_right .videolist_right_search input[type='text'],
.videolist_right .mydir-top > input[type='text'] {
  box-sizing: border-box;
  text-align: center;
  font-size: 12px;
  height: 20px;
  border: 1px solid #636a71;
  color: #e4e4e4;
  -webkit-appearance: none;
  -moz-appearance: none;
  display: inline-block;
  outline: 0;
  padding: 0 1em;
  text-decoration: none;
  border-radius: 8px;
  background-color: #1c1c1c;
  width: 90px;
}
.videolist_right_search {
  height: 50px;
  line-height: 50px;
  padding: 0 18px;
}
.search {
  display: inline-block;
  background-image: url(../../img/u8.png);
  width: 18px;
  height: 19px;
  position: relative;
  top: 5px;
  cursor: pointer;
}
.bottom_tips {
  .uploadfile {
    background-color: #151a20;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    margin-top: 10px;
    padding: 0 10px;
    cursor: pointer;
    span {
      display: inline-block;
      background-position: center;
      background-size: 100%;
      color: #e4e4e4;
      &:nth-child(1) {
        background-image: url(../../img/addTrack.png);
        vertical-align: middle;
        margin-top: -2px;
        width: 12px;
        height: 12px;
      }
      &:nth-child(2) {
        margin-left: 10px;
      }
    }
  }
}
.bottom_fanye {
  float: right;
  user-select: none;
  .last {
    cursor: pointer;
  }
  .next {
    cursor: pointer;
  }
  .now {
    color: #61ded0;
  }
}
.prop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 200;
  display: none;
}

.wdgc_content {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
  height: 80px;
  position: relative;
  .mes_tip {
    position: absolute;
    top: 0;
    width: 100%;
    line-height: 70px;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.5);
    color: black;
    font-size: 20px;
  }
}
.wdgc_content_mes {
  width: calc(100% - 50px);
  position: relative;
  float: left;
  .mes_list {
    & > div {
      float: left;
    }
  }
  .mes_list_text {
    & > span {
      display: inline-block;
      height: 20px;
      line-height: 20px;
      padding-left: 23px;
      position: relative;
      &:nth-child(1) {
        height: 25px;
        font-size: 16px;
        line-height: 25px;
      }
      input {
        text-align: left;
        border-radius: 2px;
        padding-left: 0px;
        display: none;
      }
    }
    .wdgc_rename {
      background-image: url(../../img/rename.png);
      background-size: 100%;
      position: relative;
      top: 1px;
      height: 12px;
      width: 12px;
      padding-left: 0px;
      left: 10px;
      cursor: pointer;
    }
  }
}
.wdgc_content_del {
  width: 50px;
  height: 100%;
  float: left;
  position: relative;
  .btn_del {
    display: inline-block;
    background-image: url('../../img/delpro.png');
    background-size: 100%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    bottom: 5px;
    left: 10px;
  }
  .btn_set {
    display: inline-block;
    background-image: url('../../img/reset.png');
    background-size: 100%;
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    bottom: 5px;
    left: -30px;
  }
}
.audio_control {
  width: 15px;
  height: 15px;
  background-image: url('../../img/audioplay.png');
  display: none;
  position: absolute;
  bottom: 3px;
  left: 3px;
  cursor: pointer;
}
.content_top {
  &:hover {
    .audio_control {
      display: block;
    }
  }
  .audio_control {
    &.active {
      display: block;
      background-image: url('../../img/audiostop.png');
    }
  }
}
</style>

<style lang="scss">
.video_option {
  height: calc(100% - 90px);
  overflow: hidden;
  border-bottom: 10px solid transparent;
  box-sizing: border-box;
  & > div {
    width: 100%;
  }
}
</style>
