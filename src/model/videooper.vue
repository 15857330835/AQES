<template>
  <div class="nces_videooper">
    <div class="oper_sel">
      <span title="撤回" @click="lastTemp(2)"></span>
      <span title="取消撤回" @click="nextTemp(2)"></span>
      <span title="剪辑" @click="cutchunk"></span>
      <span title="删除" @click="delchunk"></span>
      <span title="音视频分离" @click="avleavechunk"></span>
      <span title="设置" @click="setchunk"></span>
      <span title="录音" @click="record"></span>
      <span title="复制" @click="zhantiechunk"></span>
      <span title="保存工程" @click="click('saveproject')"></span>
      <span title="当前工程另存为" @click="click('saveas')"></span>
      <span title="生成视频" @click="handleExportVideoClick"></span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { trackPropertyAppendApi } from '@/api/Track'

export default {
  data: function() {
    return {}
  },
  computed: {
    ...mapState([
      'activechunk',
      'filterlist',
      'systemmessage',
      'restActiveChunks',
      'ghostsPosition'
    ]),
    pointer() {
      return this.$store.state.all.pointer
    }
  },
  methods: {
    ...mapActions([
      'postPointer',
      'lastindex',
      'videoplay',
      'nextindex',
      'cut',
      'del',
      'lastTemp',
      'nextTemp',
      'avleave',
      'Post',
      'changeLoading',
      'zhantie',
      'getnowimg',
      'videooperShow',
      'exportVideoSetShow',
      'trackBoxShow',
      'gethistoryindex'
    ]),
    ...mapMutations([
      'CHANGE_BOXSET',
      'CHANGE_CHUNKSETSHOW',
      'CHANGE_CAPTIONSETSHOW',
      'CHANGE_VIDEOOPER_SHOW',
      'CHANGE_EXPORT_VIDEO_SET_SHOW',
      'CHANGE_TRACK_BOX_SHOW',
      'PROPERTY_FANWEI',
      'CHANGE_SELECTMZ_SHOW',
      'UPDATE_SLIDER_NUM',
      'PROPERTY_OUTLEFT',
      'PROPERTY_RATIO',
      'UPDATE_TRACK_START',
      'UPDATE_TRACK_END'
    ]),
    avleavechunk: function() {
      const that = this
      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要音视频分离的块！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      if (
        this.activechunk.chunk.battach_audio === false ||
        typeof this.activechunk.chunk.battach_audio === 'undefined'
      ) {
        window.zindex = 0
        this.$alert('该资源非视频资源或已进行过音视频分离！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      const a_track_list = this.$store.state.all.tracks.a_track_list
      let isAble = true
      for (const a_track of Object.values(a_track_list)) {
        const chunks = a_track.chunks
        for (const chunk of Object.values(chunks)) {
          if (
            !(
              chunk.track_start < this.activechunk.chunk.track_start &&
              chunk.track_end <= this.activechunk.chunk.track_start
            ) ||
            (chunk.track_end > this.activechunk.chunk.track_end &&
              chunk.track_start <= this.activechunk.chunk.track_end)
          ) {
            isAble = false
            break
          }
        }
      }
      if (!isAble) {
        const max_tracks = this.systemmessage.melt.max_tracks
        if (this.$store.state.all.tracks.a_track_list.length >= max_tracks) {
          console.log(
            '音频轨道数:' + this.$store.state.all.tracks.a_track_list.length
          )
          this.$alert(
            '您添加的音频轨道数已超出上限' + max_tracks + '，无法继续添加！',
            '错误'
          )
          return
        }
      }
      this.Post({
        type: 'chunk',
        data: {
          cmd: 'separate_audio',
          chunk_id: this.activechunk.chunk.chunk_id
        },
        success: function() {
          that.changeLoading()
        },
        error: function() {
          that.$alert('该资源非视频资源或已进行过音视频分离！', '提示消息', {
            confirmButtonText: '确定'
          })
        }
      })
    },
    delchunk() {
      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要删除的块！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
      } else {
        const del_chunks_id = []
        if (this.activechunk.chunk.chunk_id) {
          del_chunks_id.push(this.activechunk.chunk.chunk_id)
        }
        this.restActiveChunks.forEach(restItem => {
          del_chunks_id.push(restItem.chunk.chunk_id)
        })
        this.del(del_chunks_id)
      }
    },
    cutchunk() {
      const linePos = this.pointer.position

      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要剪辑的视频块！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      if (typeof this.activechunk.chunk.chunk_type === 'undefined') {
        window.zindex = 0
        this.$alert('不能对字幕块进行剪辑！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }

      let ghostsMirror = []
      for (const trackItem of this.ghostsPosition.v) {
        if (trackItem.length) {
          ghostsMirror = this.ghostsPosition.v
          break
        }
      }
      if (!ghostsMirror.length) {
        const obj = {}
        const _chunk = this.activechunk.chunk
        obj.id = _chunk.chunk_id
        obj.min = _chunk.track_start
        obj.max = _chunk.track_end
        ghostsMirror.push([obj])
      }
      let noCut = true
      let outBreak = false
      for (const trackItem of ghostsMirror) {
        if (trackItem.length) {
          for (const chunk of trackItem) {
            if (chunk.min < linePos && chunk.max > linePos) {
              noCut = false
              outBreak = true
              break
            }
          }
        }
        if (outBreak) {
          break
        }
      }
      console.log('noCut:', noCut)
      if (noCut) {
        window.zindex = 0
        this.$alert('必须在选中的区域内剪辑！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      const cut_chunks = []
      for (const trackItem of ghostsMirror) {
        if (trackItem.length) {
          for (const chunk of trackItem) {
            if (chunk.min < linePos && chunk.max > linePos) {
              cut_chunks.push({
                chunk_id: chunk.id,
                split: [linePos]
              })
            }
          }
        }
      }
      console.log(cut_chunks)
      this.cut(cut_chunks)
    },
    setchunk() {
      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要编辑的块！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        return
      }
      if (this.activechunk.chunk.chunk_type === 5) {
        this.CHANGE_BOXSET('savezc')
      }
      let serviceList = []
      const filterList = JSON.parse(this.filterlist)
      if (
        (this.activechunk.chunk.chunk_type === 4 ||
          this.activechunk.chunk.chunk_type === 1) &&
        this.activechunk.chunk.filter.length === 0
      ) {
        if (
          !this.activechunk.chunk.battach_audio ||
          this.activechunk.chunk.chunk_type === 4
        ) {
          // serviceList = ['saturation','cutting','rotate','mirror','mosaic','exposure','brightness','halo','boxblur','coloring','contrast']
          // serviceList = this.filterList.shift()
          for (let i = 0; i < filterList.length; i++) {
            if (
              filterList[i].service === 'volume' ||
              filterList[i].service === 'mosaic'
            ) {
              continue
            } else {
              if (filterList[i].service === 'cutting') {
                filterList[i].parameter.softness = 0.02
              }
              filterList[i].parameter.disable = 1
              serviceList.push(filterList[i])
            }
          }
        } else {
          // serviceList = ['volume','saturation','cutting','rotate','mirror','mosaic','exposure','brightness','halo','boxblur','coloring','contrast']
          for (let i = 0; i < filterList.length; i++) {
            if (filterList[i].service === 'mosaic') {
              continue
            } else {
              if (filterList[i].service === 'cutting') {
                filterList[i].parameter.softness = 0.02
              }
              filterList[i].parameter.disable = 1
              serviceList.push(filterList[i])
            }
          }
        }
        this.activechunk.chunk.filter = serviceList
      }
      if (this.activechunk.chunk.chunk_type === 2) {
        if (this.activechunk.chunk.filter.length === 0) {
          serviceList = [filterList[0]]
          serviceList[0].parameter.disable = 1
          this.activechunk.chunk.filter = serviceList
        }
      }
      for (let i = 0; i < serviceList.length; i++) {
        $.post(
          window.NCES.DOMAIN + '/api/chunk',
          JSON.stringify({
            cmd: 'add_filter',
            chunk_id: this.activechunk.chunk.chunk_id,
            filter: serviceList[i]
          }),
          function(res) {
            if (res.code !== 0) {
              console.warn(res.msg)
            }
          },
          'json'
        )
      }
      $.post(
        window.NCES.DOMAIN + '/api/pointer',
        JSON.stringify({
          cmd: 'set',
          position: this.activechunk.chunk.track_start
        }),
        function(res) {
          if (res.code !== 0) {
            console.log(res.msg)
          }
        },
        'json'
      )
      // if(this.activechunk.chunk.speed===undefined&&(this.chunk.chunk_type==1||this.chunk.chunk_type ==2)){
      //     this.chunk.speed = 1
      // }
      // const str = ''
      if (this.activechunk.chunk.chunk_type === 5) {
        return
        // this.CHANGE_BOXSET(str)
        // str = ''
      }
      if (typeof this.activechunk.chunk.chunk_type === 'undefined') {
        this.CHANGE_CAPTIONSETSHOW(true)
        return
      }

      this.CHANGE_CHUNKSETSHOW(true)
      this.gethistoryindex()
    },
    record() {
      this.CHANGE_BOXSET('setrecord')
    },
    zhantiechunk() {
      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要复制粘贴的块！', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
      } else {
        if (typeof this.activechunk.chunk.chunk_type === 'undefined') {
          window.zindex = 0
          this.$alert('字幕快请到字幕设置界面添加！', '提示消息', {
            confirmButtonText: '确定',
            callback: function() {
              window.zindex = 1
            }
          })
          return
        }
        const copyArray = []
        let copyStart = 0
        this.ghostsPosition.v.forEach(trackItem => {
          if (trackItem.length) {
            trackItem.forEach(chunk => {
              copyArray.push(chunk.id)
              copyStart = chunk.max > copyStart ? chunk.max : copyStart
            })
          }
        })
        if (!copyArray.length) {
          const _chunk = this.activechunk.chunk
          copyArray.push(_chunk.chunk_id)
          copyStart = _chunk.track_end
        }
        const copyInfo = {
          copyArray,
          copyStart
        }
        this.zhantie(copyInfo)
      }
    },
    click(str) {
      this.CHANGE_BOXSET(str)
    },
    handleExportVideoClick() {
      this.CHANGE_VIDEOOPER_SHOW(false)
      this.CHANGE_TRACK_BOX_SHOW(false)
      this.CHANGE_EXPORT_VIDEO_SET_SHOW(true)
      this.CHANGE_SELECTMZ_SHOW(false)
      // resize and fix the scale between video and left section
      const fanwei = this.$store.state.all.track_property.fanwei
      fanwei['1440'].now = 0.66
      fanwei['1920'].now = 0.66
      this.PROPERTY_FANWEI(fanwei)

      // block main shortcuts like delete
      window.zindex = 2

      const trackWidth = document.querySelector('.edit_ruler_content>div')
        .offsetWidth
      const videoFrames = this.$store.state.all.curr_track_len
      const totalRatio = videoFrames / trackWidth
      // set the max and min value of ratio slider
      this.UPDATE_SLIDER_NUM(
        Object.assign(this.$store.state.slidernum, { max: totalRatio, min: 0 })
      )
      this.PROPERTY_OUTLEFT(0) // set outleft to zero

      this.PROPERTY_RATIO(0) // set ratio to zero
      trackPropertyAppendApi({
        track_property: { ratio: 0, outLeft: 0 }
      }).then(res => {
        if (res.code === 0 && !this.exportVideoSetShow) {
          this.changeLoading()
        }
      })

      this.UPDATE_TRACK_START(0)
      this.UPDATE_TRACK_END(this.$store.state.all.curr_track_len)
    }
  }
}
</script>

<style>
.nces_videooper {
  height: 30px;
  position: relative;
  background-color: #161616;
}

.nces_videooper .oper_sel {
  position: absolute;
  /*left: 10px;*/
  top: 4px;
  /*bottom: -20px;*/
  display: inline-block;
  z-index: 10;
}

.nces_videooper .oper_sel > span {
  display: inline-block;
  width: 23px;
  height: 23px;
  padding: 0 10px 0 10px;
  margin-left: 5px;
  cursor: pointer;
  background-position: center;
  background-size: 23px 23px;
  background-repeat: no-repeat;
}

.nces_videooper .oper_sel > span:nth-child(1) {
  background-image: url(../img/trackBack.png);
  /* background-size: 85%; */
}

.nces_videooper .oper_sel > span:nth-child(2) {
  background-image: url(../img/trackreset.png);
  /* background-size: 85%; */
}

.nces_videooper .oper_sel > span:nth-child(3) {
  background-image: url(../img/u92.png);
  /* background-size: 90%; */
}

.nces_videooper .oper_sel > span:nth-child(4) {
  background-image: url(../img/u94.png);
  /* background-size: 85%; */
}

.nces_videooper .oper_sel > span:nth-child(5) {
  /* background-size: 115%; */
  background-image: url(../img/avleave.png);
}

.nces_videooper .oper_sel > span:nth-child(6) {
  /* background-size: 68%; */

  background-image: url(../img/chunkset.png);
}

.nces_videooper .oper_sel > span:nth-child(7) {
  /* background-size: 68%; */

  background-image: url(../img/record.png);
}

.nces_videooper .oper_sel > span:nth-child(8) {
  /* background-size: 68%; */

  background-image: url(../img/zhantie.png);
}

.nces_videooper .oper_sel > span:nth-child(9) {
  background-image: url(../img/save.png);
  /* background-size: 85%; */
}

.nces_videooper .oper_sel > span:nth-child(10) {
  /* background-size: 80%; */
  background-image: url(../img/newsave.png);
}

.nces_videooper .oper_sel > span:nth-child(11) {
  /* background-size: 80%; */

  background-image: url(../img/u96.png);
}
</style>
