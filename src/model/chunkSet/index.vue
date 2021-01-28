<template>
  <div
    class="setContent"
    v-if="this.chunksetshow"
    :style="{
      width: 'calc(' + this.videoselw + ' - 10px)',
      paddingTop: this.paddingtop + 'px'
    }"
  >
    <videoset
      v-if="
        this.activechunk.chunk.chunk_type == 1 ||
          this.activechunk.chunk.chunk_type == 4
      "
    ></videoset>
    <audioset v-if="this.activechunk.chunk.chunk_type == 2"></audioset>
    <template v-if="this.activechunk.chunk.chunk_type == 3">
      <putextset v-if="categoryType == '基础文本'"></putextset>
      <dynamicTextSet v-else-if="categoryType == '动态文本'"></dynamicTextSet>
      <textset v-else></textset>
    </template>
    <div
      class="setContent-do"
      :style="{ width: 'calc(100vw * ' + this.videosurew + ')' }"
    >
      <el-button
        class="do-cel"
        type="info"
        :loading="celBtnLoading"
        @click="handleCancel"
        >{{ celBtnLoading ? '取消中' : '取消' }}
      </el-button>
      <el-button class="do-sure" type="primary" @click="sure">确认</el-button>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import videoset from './videoset'
import audioset from './audioset'
import textset from './textset'
import putextset from './putextset'
import dynamicTextSet from './dynamicTextSet'

export default {
  data() {
    return {
      activeTab: 'content-sel__O1',
      celBtnLoading: false
    }
  },
  watch: {
    chunksetshow() {
      if (this.chunksetshow) {
        const that = this
        $.post(
          window.AQES.DOMAIN + '/api/history',
          JSON.stringify({ cmd: 'list' }),
          function(res) {
            if (res.code === 0) {
              that.SET_HISTORYINDEX(res.data.length - 1)
            }
          },
          'json'
        )
      }
    }
  },
  components: {
    videoset,
    audioset,
    textset,
    putextset,
    dynamicTextSet
  },
  computed: {
    ...mapState([
      'activechunk',
      'chunksetshow',
      'clientwidth',
      'propertyNum',
      'historyindex',
      'allowHistoryBack',
      'categoryType'
    ]),
    track() {
      return this.$store.state.all.tracks
    },
    track_property() {
      return this.$store.state.all.track_property
    },
    videoselw() {
      if (this.clientwidth >= 1440) {
        return 100 - this.track_property.fanwei['1920'].now * 100 + '%'
      } else {
        return 100 - this.track_property.fanwei['1440'].now * 100 + '%'
      }
    },
    paddingtop() {
      if (this.clientwidth >= 1440) {
        return (
          ((this.clientwidth - 36) *
            this.track_property.fanwei['1920'].now *
            9) /
            16 +
          77
        )
      } else {
        return (
          ((this.clientwidth - 36) *
            this.track_property.fanwei['1440'].now *
            9) /
            16 +
          77
        )
      }
    },
    videosurew() {
      if (this.clientwidth >= 1440) {
        return this.track_property.fanwei['1920'].now
      } else {
        return this.track_property.fanwei['1440'].now
      }
    }
  },
  methods: {
    ...mapActions(['Post', 'changeLoading', 'refreshActiveChunk']),
    ...mapMutations([
      'CHANGE_CHUNKSETSHOW',
      'ACTIVE_CHUNK',
      'CHANGE_FILTERSHOW',
      'SET_HISTORYINDEX'
    ]),
    clearChunkhistory() {
      // 清除chunk内部设置的记录
      const that = this
      const data = {}
      data.type = 'history'
      data.data = { cmd: 'clear', type: 1 }
      data.success = function() {
        console.log('成功清除chunk内部设置的记录')
      }
      data.error = function(res) {
        window.zindex = 0
        that.$alert('清除内部操作记录失败！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
      }
      this.Post(data)
    },
    backChunkhistory(func) {
      const that = this
      console.log(that.historyindex)
      $.post(
        window.AQES.DOMAIN + '/api/history',
        JSON.stringify({ cmd: 'set', index: that.historyindex }),
        function(res) {
          if (res.code === 0) {
            $.post(
              window.AQES.DOMAIN + '/api/history',
              JSON.stringify({ cmd: 'clear', type: 1 }),
              function(resp) {
                if (resp.code === 0) {
                  that.CHANGE_CHUNKSETSHOW(false)
                  func()

                  // setTimeout(function () {
                  //     $('.active>.chunk').onmousedown()
                  //     $('.active>.chunk').ontouchstart()
                  // },0)
                }
              },
              'json'
            )
          }
        },
        'json'
      )
    },
    sure() {
      const that = this
      this.classname = 'content-sel_O1'
      this.CHANGE_CHUNKSETSHOW(false)
      this.CHANGE_FILTERSHOW('normal')
      this.changeLoading()
      this.refreshActiveChunk()
      if (this.activechunk.chunk.chunk_type === 2) {
        setTimeout(function() {
          const left = parseFloat($('#edit_tip_line').css('left'))
          if (left < 0 || left + 199 > $('.nces_edit').width()) {
            $('#edit_tip_line').hide()
          } else {
            $('#edit_tip_line').show()
          }
        }, 0)
      } else {
        setTimeout(function() {
          that.clearChunkhistory()
          const left = parseFloat($('#edit_tip_line').css('left'))
          if (left < 0 || left + 199 > $('.nces_edit').width()) {
            $('#edit_tip_line').hide()
          } else {
            $('#edit_tip_line').show()
          }
        }, 0)
      }
    },
    back() {
      const that = this
      this.classname = 'content-sel_O1'
      this.CHANGE_FILTERSHOW('normal')
      that.backChunkhistory(function() {
        that.changeLoading(function() {
          // 取消后将所有状态返回原来
          if (that.activechunk.chunk.chunk_type === 2) {
            for (let i = 0; i < that.track.a_track_list.length; i++) {
              for (let j = 0; j < that.track.a_track_list[i].chunks; j++) {
                if (
                  that.track.a_track_list[i].chunks[j].chunk_id ===
                  that.activechunk.chunk.chunk_id
                ) {
                  that.ACTIVE_CHUNK({
                    chunk: that.track.a_track_list[i].chunks[j],
                    state: 'active'
                  })
                }
              }
            }
          } else {
            for (let i = 0; i < that.track.v_track_list.length; i++) {
              for (
                let j = 0;
                j < that.track.v_track_list[i].chunks.length;
                j++
              ) {
                if (
                  that.track.v_track_list[i].chunks[j].chunk_id ===
                  that.activechunk.chunk.chunk_id
                ) {
                  that.ACTIVE_CHUNK({
                    chunk: that.track.v_track_list[i].chunks[j],
                    state: 'active'
                  })
                }
              }
            }
          }
        })
      })
    },
    handleCancel() {
      this.celBtnLoading = true
      setTimeout(() => {
        this.cel()
      }, 500)
    },
    cel() {
      if (this.allowHistoryBack) {
        this.back()
        this.celBtnLoading = false
      } else {
        setTimeout(() => {
          this.cel()
        }, 250)
      }
      setTimeout(() => {
        const left = parseFloat($('#edit_tip_line').css('left'))
        if (left < 0 || left + 199 > $('.nces_edit').width()) {
          $('#edit_tip_line').hide()
        } else {
          $('#edit_tip_line').show()
        }
      }, 0)
    }
  }
}
</script>

<style lang="scss" scoped></style>
