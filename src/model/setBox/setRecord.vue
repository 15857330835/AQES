<template>
  <div class="addRecordrop">
    <div class="recordProp_content">
      <div class="header">
        <div class="content_title">录制音频</div>
        <div class="close iconfont icon-close" @click="cel"></div>
      </div>
      <div class="content_icon" @click="recordHandle">
        <div
          class="content_div"
          style="background-color: #1DB4AC;"
          v-if="recorStatus == 0"
        >
          <i class="iconfont icon-luyinshuohuashengyin icon"></i>
        </div>
        <div
          class="content_div"
          style="background-color: #FE6262;"
          v-else-if="recorStatus == 1"
        >
          <div class="text">{{ countdown }}</div>
        </div>
        <div
          class="content_div"
          style="background-color: #FE6262;"
          v-else-if="recorStatus == 2"
        >
          <div class="zt-icon-div"><div class="zt-icon"></div></div>
        </div>
      </div>
      <div class="content_time">
        <span>{{ recordTime | tranFilter }}</span
        ><!-- {{ recordTime | tranFilter }} -->
      </div>
      <div class="re_content_bottom">
        <span class="con_click" @click="cel">取消</span
        ><span class="con_click" @click="add">完成</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import Recorder from 'js-audio-recorder'
// import systemmes from './model/Systemmes'
import { getTimeStr, dateFormat } from '@/utils'
import { uploadForm } from '@/api/Upload'
import { setInterval, clearInterval } from 'timers'
// import * as api from "@/api/Lib";
// import _ from 'lodash'
export default {
  data: function() {
    return {
      countdown: 3,
      recorStatus: 0,
      recordTime: 0,
      recordStr: '00:00:00',
      record: null
    }
  },
  filters: {
    tranFilter(n) {
      return /* dateFormat(n*1000, "HH:mm:ss")// */ getTimeStr(n) // .replace(/:/g,'：')
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  computed: {
    ...mapState([]),
    loadingShow: function() {
      return this.startloading || this.onloading
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'changeLoading', 'getDirList']),
    ...mapMutations(['CHANGE_BOXSET', 'SET_LIB_PATH']),

    async add() {
      clearInterval(this.recordTr)
      this.record.stop()
      const data = new FormData()
      data.append('path', '录音')
      // data.append("name","test.wav")
      const filedata = this.record.getWAVBlob()
      const fileName = dateFormat(new Date().getTime(), 'YYYYMMDDHHmm')
      const fileObj = new File([filedata], fileName + '.mp3', {
        type: 'audio/mp3'
      })
      data.append('file', fileObj)
      const res = await uploadForm(data)

      if (res.code === 0 || res.code === '0') {
        this.$alert('保存录音成功！请转至:我的素材->录音', '提示')
        this.SET_LIB_PATH('录音/')
        this.getDirList()
        this.CHANGE_BOXSET('')
      } else {
        this.$alert(res.message, '错误')
      }
    },
    recordHandle() {
      if (this.recorStatus === 0) {
        this.recorStatus = 1
        this.reTimer = setInterval(() => {
          this.countdown--
          if (this.countdown === 0) {
            clearInterval(this.reTimer)
            this.recorStatus = 2

            if (this.recordTime === 0) {
              this.record
                .start()
                .then(() => {
                  // 开始录音
                  this.recordTime = 0
                  this.recordTr = setInterval(() => {
                    this.recordTime += 1
                  }, 1000)
                })
                .catch(() => {
                  this.$alert('请确认麦克风连接情况正常，否则无法开始', '错误')
                })
            } else {
              this.record.resume()
              this.recordTr = setInterval(() => {
                this.recordTime += 1
              }, 1000)
            }
          }
        }, 1000)
      } else if (this.recorStatus === 2) {
        clearInterval(this.recordTr)
        this.record.pause()
        this.recorStatus = 0
        this.countdown = 3
      }
    },
    cel() {
      this.CHANGE_BOXSET('')
    }
  },
  mounted: function() {
    this.record = new Recorder()
  },
  destroyed() {
    if (this.recordTr || this.reTimer) {
      clearInterval(this.recordTr)
      clearInterval(this.reTimer)
    }
    if (this.recordTime > 0) {
      this.record.destroy().then(() => {
        this.record = null
      })
    } else {
      this.record = null
    }
  }
}
</script>

<style lang="scss">
/* 添加轨道的弹窗样式*/
.addRecordrop {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1010;
  .recordProp_content {
    position: absolute;
    width: 361px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #333333;

    padding: 12px 0 20px 0;
    // border: 1px solid rgba(121, 121, 121, 1);
    .header {
      height: 24px;
      text-align: center;
      .content_title {
        line-height: 24px;
        background-color: #333333;
        font-size: 18px;
        // padding-left: 20px;
        // border-bottom: 1px solid rgba(121, 121, 121, 1);
      }
      .close {
        width: 20px;
        height: 20px;
        line-height: 20px;
        position: absolute;
        right: 16px;
        top: 12px;
        cursor: pointer;
        display: inline-block;
      }
    }

    .content_icon {
      // height:70px;
      text-align: center;
      position: relative;
      margin-top: 25px;
      .content_div {
        width: 96px;
        height: 96px;
        margin-left: calc(50% - 48px);
        border-radius: 48px;
        // background-color: #008000;
        cursor: pointer;
        .icon {
          font-size: 48px;
          line-height: 96px;
          // width:96px;
          // height:96px;
          // background-position: center;
          // background-size: 48px 48px;
          // background-repeat: no-repeat;
          // background-image: url(../../img/record.png);
        }
        .zt-icon-div {
          background-color: #fe6262;
          width: 43px;
          height: 43px;
          border: 2.5px solid #ffffff;
          border-radius: 24px;
          display: inline-block;
          margin-top: calc(50% - 24px);
          .zt-icon {
            width: 20px;
            height: 20px;
            background-color: #ffffff;
            display: inline-block;
            margin-top: calc(50% - 10px);
          }
        }

        .text {
          font-size: 48px;
          line-height: 96px;
        }
      }
    }
    .content_time {
      height: 31px;
      line-height: 31px;
      padding-top: 20px;
      text-align: center;
      position: relative;
      span {
        font-size: 37px;
        font-weight: 600;
        color: #cccccc;
      }
    }
    .re_content_bottom {
      margin-top: 24px;
      height: 28px;
      display: flex;
      justify-content: center;
      .con_click {
        width: 64px;
        height: 28px;
        line-height: 28px;
        font-size: 16px;
        text-align: center;
        display: inline-block;
        border-radius: 5px;
        // background-color: #00A9FF;
        border: 1px solid rgba(121, 121, 121, 1);
        cursor: pointer;
        &:first-child {
          margin-right: 50px;
        }
        &:last-child {
          background-color: #00a9ff;
        }
      }
      // .con_click{
      //     // background-color: #232323;
      //     border:1px solid rgba(121, 121, 121, 1);

      // }
    }
  }
}
</style>
