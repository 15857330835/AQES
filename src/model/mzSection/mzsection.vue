<template>
  <div
    class="clearfix lh"
    :style="{ userSelect: 'none', padding: 0, height: this.height + 'px' }"
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
  data: function() {
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
    height: function() {
      if (this.clientwidth >= 1440) {
        return (
          (this.clientwidth * this.track_property.fanwei['1920'].now * 9) / 16 +
          70
        )
      } else {
        return (
          (this.clientwidth * this.track_property.fanwei['1440'].now * 9) / 16 +
          70
        )
      }
    },
    videoselw: function() {
      if (this.clientwidth >= 1440) {
        return 100 - this.track_property.fanwei['1920'].now * 100 + '%'
      } else {
        return 100 - this.track_property.fanwei['1440'].now * 100 + '%'
      }
    }
  },
  watch: {
    height(newVal) {
      this.CHANGE_MZ_HEIGHT(newVal)
    }
  },
  mounted() {
    this.CHANGE_MZ_HEIGHT(this.height)
  },
  methods: {
    // ...mapActions([
    //   'CHANGE_CLIENTWIDTH'
    // ])
    ...mapMutations(['CHANGE_MZ_HEIGHT'])
  }
}
</script>

<style>
.lh {
  width: 100%;
  height: 0;
  padding-top: calc(50% * 9 / 16);
  padding-bottom: 67px;
  position: relative;
}

.nces_videolist {
  width: calc(50% - 10px);
  height: 100%;
  position: absolute;
  top: 0;
}

.listContent {
  height: calc(100% - 27px);
}
.videolist_right {
  width: calc(100% - 100px);
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
  border: 1px solid #686868;
  color: #e4e4e4;
  -web-kit-appearance: none;
  -moz-appearance: none;
  display: inline-block;
  outline: 0;
  padding: 0 1em;
  text-decoration: none;
  border-radius: 8px;
  background-color: #1c1c1c;
  width: 90px;
}

.videolist_right input[type='text']:focus {
  border: 1px solid #686868;
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

.video_option {
  height: calc(100% - 90px);
  overflow: hidden;
  border-bottom: 10px solid transparent;
  box-sizing: border-box;
}

.video_option > div {
  width: 100%;
}

.video_option_content {
  width: 110px;
  padding: 5px 15px;
  float: left;
}

.video_option_content .content_top {
  position: relative;
  height: 62.11px;
  line-height: 0;
  text-align: center;
  background-color: #010101;
}

.video_option_content .content_top .content_top_img {
  max-width: 100%;
  height: 62.11px;
  /* cursor: pointer; */
}

.video_option_content .content_top .content_top_img.dragele {
  cursor: pointer;
}

.video_option_content .content_top span.content_top_img {
  background-color: black;
  display: inline-block;
  line-height: 62.11px;
  text-align: center;
  cursor: no-drop;
}

.video_option_content .content_top .content_top_down {
  height: 62.11px;
  width: 100%;
  position: absolute;
  bottom: 0;
  text-align: center;
  /*background-color: rgba(0,0,0,0.3);*/
  overflow: hidden;
  line-height: 62px;
  /*display:none;*/
}

.content_top_down > span:nth-child(1) {
  position: absolute;
  box-sizing: border-box;
  text-align: center;
  left: 0;
  height: 100%;
  width: 100%;
}

.content_top_down > span:nth-child(2) {
  position: absolute;
  right: 5px;
  bottom: 5px;
  width: 19px;
  height: 12px;
  background-image: url(../../img/u9.png);
  cursor: pointer;
  z-index: 50;
}

.content_top_down > span:nth-child(3) {
  position: absolute;
  right: 5px;
  top: 5px;
  width: 18px;
  height: 18px;
  background-image: url(../../img/cancel.png);
  cursor: pointer;
  z-index: 50;
}

.content_mes {
  line-height: 25px;
  position: relative;
}

.content_mes div {
  height: 25px;
  left: 0;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  word-break: keep-all;
}

.videolist_right_bottom {
  height: 40px;
  line-height: 40px;
  padding: 0 15px;
}

.videolist_right_bottom .bottom_tips {
  float: left;
}

.bottom_tips .u-icon {
  background-image: url(../../img/u10.png);
  display: inline-block;
  vertical-align: middle;
  margin-top: -2px;
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.bottom_tips span {
  color: #61ded0;
}

.bottom_tips .uploadfile {
  background-color: #151a20;
  height: 20px;
  line-height: 20px;
  border-radius: 10px;
  margin-top: 10px;
  padding: 0 10px;
  cursor: pointer;
}

.bottom_tips .uploadfile span {
  display: inline-block;
  background-position: center;
  background-size: 100%;
  color: #e4e4e4;
}

.bottom_tips .uploadfile span:nth-child(1) {
  background-image: url(../../img/addTrack.png);
  vertical-align: middle;
  margin-top: -2px;
  width: 12px;
  height: 12px;
}

.bottom_tips .uploadfile span:nth-child(2) {
  margin-left: 10px;
}

.bottom_fanye {
  float: right;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.bottom_fanye .last {
  cursor: pointer;
}

.bottom_fanye .next {
  cursor: pointer;
}

.bottom_fanye .now {
  color: #61ded0;
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

.saveTable_content,
.makeTable_content,
.delproTable_content {
  position: absolute;
  width: 510px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #232323;
  font-size: 14px;
}

.saveTable_content .content_title {
  height: 40px;
  line-height: 40px;
  background-color: #2e2e2e;
  text-align: center;
}

.delproTable .content_title {
  height: 40px;
  line-height: 40px;
  background-color: #2e2e2e;
  text-align: center;
}

.delproTable .content_select {
  height: 50px;
  line-height: 30px;
  text-align: center;
}

.content_select input[type='text'] {
  box-sizing: border-box;
  font-size: 14px;
  height: 20px;
  border: 1px solid #686868;
  color: rgb(170, 170, 170);
  -web-kit-appearance: none;
  -moz-appearance: none;
  display: inline-block;
  outline: 0;
  padding: 0 1em;
  text-decoration: none;
  border-radius: 3px;
  background-color: #1c1c1c;
  width: 185px;
}

.content_select input[type='text']:focus {
  border: 1px solid #686868;
}

.content_select span {
  display: inline-block;
  padding: 0 10px 0 80px;
  width: 100px;
  text-align: center;
}

.content_click {
  height: 30px;
  line-height: 30px;
  background-color: #2e2e2e;
  /*text-align: center;*/
}

.content_click span {
  float: right;
  width: 40px;
  height: 20px;
  line-height: 18px;
  margin-top: 5px;
  /*margin-left: 10px;*/
  margin-right: 10px;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
  box-sizing: border-box;
}

.content_click .content_click_make {
  background-color: #61ded0;
  border: 1px solid #61ded0;
}

.content_click .content_click_cancel {
  background-color: #232323;
  border: 1px solid #686868;
}

.wdgc_content {
  width: 100%;
  box-sizing: border-box;
  padding: 5px 10px;
  height: 80px;
  position: relative;
}

.wdgc_content_mes {
  width: calc(100% - 50px);
  position: relative;
  float: left;
}

.wdgc_content_mes .mes_list > div {
  float: left;
}

.wdgc_content_mes .mes_list_text > span {
  display: inline-block;
  height: 20px;
  line-height: 20px;
  padding-left: 23px;
  position: relative;
}

.wdgc_content_mes .mes_list_text > span:nth-child(1) {
  height: 25px;
  font-size: 16px;
  line-height: 25px;
}

.wdgc_content_mes .mes_list_text > span input {
  text-align: left;
  border-radius: 2px;
  padding-left: 0px;
  display: none;
}

.wdgc_content .mes_tip {
  position: absolute;
  top: 0;
  width: 100%;
  line-height: 70px;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.5);
  color: black;
  font-size: 20px;
}

.wdgc_content_mes .mes_list_text .wdgc_rename {
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

.wdgc_content_del {
  width: 50px;
  height: 100%;
  float: left;
  position: relative;
}

.wdgc_content_del .btn_del {
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

.wdgc_content_del .btn_set {
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

.content_top:hover .audio_control {
  display: block;
}

.content_top .audio_control.active {
  display: block;
  background-image: url('../../img/audiostop.png');
}
</style>
