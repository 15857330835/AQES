<template>
  <div class="nces_videooper">
    <div class="oper_sel">
      <span title="撤回" @click="lastTemp(2)"></span>
      <span title="取消撤回" @click="nextTemp(2)"></span>
      <span title="删除" @click="delchunk"></span>
      <span title="清空" @click="emptychunk"></span>
      <span title="生成视频" @click="click('saveas')"></span>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { trackPropertyAppendApi } from '@/api/Track'

export default {
  data() {
    return {}
  },
  computed: {
    ...mapState([
      'activechunk',
      'filterlist',
      'systemmessage',
      'restActiveChunks',
      'ghostsPosition',
      'slidernum'
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
      'gethistoryindex',
      'empty'
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
    avleavechunk() {
      const that = this
      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要音视频分离的块！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
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
          callback() {
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
        success() {
          that.changeLoading()
        },
        error() {
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
          callback() {
            window.zindex = 1
          }
        })
      } else {
        //.......
        // const del_chunks_id = []
        // if (this.activechunk.chunk.chunk_id) {
        //   del_chunks_id.push(this.activechunk.chunk.chunk_id)
        // }
        // this.restActiveChunks.forEach(restItem => {
        //   del_chunks_id.push(restItem.chunk.chunk_id)
        // })
        this.del([this.activechunk.index])
      }
    },
    emptychunk() {
      this.empty()
    },
    cutchunk() {
      const linePos = this.pointer.position

      if (this.activechunk.chunk === '') {
        window.zindex = 0
        this.$alert('请选择要剪辑的视频块！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
        return
      }
      if (typeof this.activechunk.chunk.chunk_type === 'undefined') {
        window.zindex = 0
        this.$alert('不能对字幕块进行剪辑！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
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
          callback() {
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
          callback() {
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
          window.AQES.DOMAIN + '/api/chunk',
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
        window.AQES.DOMAIN + '/api/pointer',
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
          callback() {
            window.zindex = 1
          }
        })
      } else {
        if (typeof this.activechunk.chunk.chunk_type === 'undefined') {
          window.zindex = 0
          this.$alert('字幕快请到字幕设置界面添加！', '提示消息', {
            confirmButtonText: '确定',
            callback() {
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

    after_ratio(middle_raito) {
      if (middle_raito === null) {
        return null
      }
      let math_ratio = Math.round((middle_raito + 0.15) / 0.25) * 0.25 - 0.15
      // 超出范围的放大缩小无效（ratio在服务器端同步）
      math_ratio =
        math_ratio < this.slidernum.max - 0.25
          ? math_ratio
          : this.slidernum.max - 0.25
      math_ratio =
        math_ratio > this.slidernum.min ? math_ratio : this.slidernum.min
      return math_ratio
    },
    setSliderNum(length, visTimerWidth) {
      if (length > 0) {
        const max = 30.1
        const min = 24.6
        let displayNumMin = 30.1 - Math.round(length / 5) / 100
        displayNumMin = Math.round((displayNumMin + 0.15) / 0.25) * 0.25 - 0.15
        const newSliderNumMin = displayNumMin < min ? displayNumMin : min

        const displayWidth = Math.floor(visTimerWidth / 50) * 50
        let displayNum = 30.1 - Math.round((length / displayWidth) * 100) / 100
        displayNum = displayNum <= max ? displayNum : max
        console.log({ newSliderNumMin, max })

        this.UPDATE_SLIDER_NUM({
          min: newSliderNumMin,
          max: max,
          length: 100,
          btnStep: 0.25
        })
        console.log('set outleft')
        setTimeout(() => {
          this.PROPERTY_OUTLEFT(0)
        }, 0)
        const ratio = displayNum
        return this.after_ratio(ratio)
      }
    },
    handleExportVideoClick() {
      this.CHANGE_VIDEOOPER_SHOW(false)
      this.CHANGE_TRACK_BOX_SHOW(false)
      this.CHANGE_EXPORT_VIDEO_SET_SHOW(true)
      this.CHANGE_SELECTMZ_SHOW(false)
      // resize and fix the scale between video and left section
      const fanwei = this.$store.state.all.track_property.fanwei
      fanwei['1440'].now = 0.6
      fanwei['1920'].now = 0.6
      this.PROPERTY_FANWEI(fanwei)

      // block main shortcuts like delete
      window.zindex = 2

      const trackWidth = document.querySelector('.edit_ruler_content>div')
        .offsetWidth
      const videoFrames = this.$store.state.all.curr_track_len
      // const totalRatio = videoFrames / trackWidth
      // // set the max and min value of ratio slider
      // this.UPDATE_SLIDER_NUM(
      //   Object.assign(this.$store.state.slidernum, { max: totalRatio, min: 0 })
      // )
      // this.PROPERTY_OUTLEFT(0) // set outleft to zero
      const after_ratio = this.setSliderNum(videoFrames, trackWidth)

      this.PROPERTY_RATIO(after_ratio) // set ratio to zero
      trackPropertyAppendApi({
        track_property: { ratio: after_ratio, outLeft: 0 }
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

<style lang="scss">
.nces_videooper {
  height: 0.54rem;
  box-sizing: border-box;
  position: relative;
  background-color: #212931;
  border-top: 0.02rem solid #151a20;
  border-bottom: 0.02rem solid #151a20;
  .oper_sel {
    position: absolute;
    display: inline-block;
    z-index: 10;
    height: 0.5rem;
    line-height: 0.5rem;
    display: flex;
    align-items: center;
    & > span {
      width: 0.2rem;
      height: 0.2rem;
      padding: 0 0.15rem;
      margin-left: 0.05rem;
      cursor: pointer;
      background-position: center;
      background-size: 0.2rem 0.2rem;
      background-repeat: no-repeat;
      &:nth-child(1) {
        background-image: url(../img/trackBack.png);
      }
      &:nth-child(2) {
        background-image: url(../img/trackreset.png);
      }
      &:nth-child(3) {
        background-image: url(../img/delete.png);
      }
      &:nth-child(4) {
        background-image: url(../img/empty.png);
      }
      &:nth-child(5) {
        background-image: url(../img/export.png);
      }
    }
  }
}
</style>
