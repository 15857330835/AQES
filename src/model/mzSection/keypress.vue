<template>
  <div class="keyPress">
    <div class="keypress_out" title="快捷键" @click="changeShow">
      <span class="title">快捷键</span>
    </div>
    <div class="keypress_set" v-show="this.keypressStaus">
      <div class="keypress_set_title">快捷键<em @click="changeShow">X</em></div>
      <div class="keypress_set_content">
        <p style="text-align:center;margin:0;color:#aaa">
          <i style="color:red">*</i> 请直接在键盘上输入快捷键操作
        </p>
        <div class="keypress_set_contentL">
          <p style="color:#939191">
            <label
              ><i>播放/暂停</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="Space"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>上一帧</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="←"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>复制</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="Ctrl+V"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>撤销</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="Ctrl+Z"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>删除</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="Delete"
            /></label>
          </p>
        </div>
        <div class="keypress_set_contentR">
          <p style="color:#939191">
            <label
              ><i>剪辑</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="X"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>下一帧</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="→"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>取消撤销</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="Ctrl+Y"
            /></label>
          </p>
          <p style="color:#939191">
            <label
              ><i>全屏预览</i
              ><input
                class="captiontext"
                style="color:#939191"
                disabled
                type="text"
                value="双击视频"
            /></label>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'
import _ from 'lodash'

export default {
  data() {
    return { keypress: {}, keypressStaus: false, fuzhistatus: false }
  },
  //   components: {
  //   		systemmes,
  //   },
  created() {
    this.getKeypress()
  },
  computed: {
    ...mapState([
      'activechunk',
      'MulSeleList',
      'all',
      'restActiveChunks',
      'ghostsPosition',
      'modalVoiceApplyIsShow',
      'captionsetshow'
    ]),
    loadingShow() {
      return this.startloading || this.onloading
    },
    trankeyPress() {
      const obj = {}
      for (const key of Object.keys(this.keypress)) {
        const ob = {
          altKey: false,
          shiftKey: false,
          ctrlKey: false,
          metaKey: false,
          normalKey: {}
        }
        const arr = this.keypress[key].split('+')
        const numArr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
        const alphArr = [
          'A',
          'B',
          'C',
          'D',
          'E',
          'F',
          'G',
          'H',
          'I',
          'J',
          'K',
          'L',
          'M',
          'N',
          'O',
          'P',
          'Q',
          'R',
          'S',
          'T',
          'U',
          'V',
          'X',
          'Y',
          'Z'
        ]
        for (let i = 0; i < arr.length; i++) {
          if (numArr.includes(arr[i])) {
            ob.normalKey = [arr[i]]
            continue
          }
          if (alphArr.includes(arr[i])) {
            ob.normalKey = [arr[i].toLowerCase(), arr[i]]
            continue
          }
          if (arr[i] === '') {
            continue
          }
          switch (arr[i]) {
            case 'Alt': {
              ob.altKey = true
              break
            }
            case 'Ctl': {
              ob.ctrlKey = true
              ob.metaKey = true
              break
            }
            case 'Shift': {
              ob.shiftKey = true
              break
            }
            case 'Space': {
              ob.normalKey = [' ', 'Spacebar']
              break
            }
            case 'Enter': {
              ob.normalKey = ['Enter']
              break
            }
            case 'Delete': {
              ob.normalKey = ['Delete', 'Del']
              break
            }
            case '↑': {
              ob.normalKey = ['ArrowUp', 'Up']
              break
            }
            case '↓': {
              ob.normalKey = ['ArrowDown', 'Down']
              break
            }
            case '←': {
              ob.normalKey = ['ArrowLeft', 'Left']
              break
            }
            case '→': {
              ob.normalKey = ['ArrowRight', 'Right']
              break
            }
            default: {
              console.log('no such special key')
            }
          }
        }
        obj[key] = ob
      }
      return obj
    },
    pointer() {
      return this.$store.state.all.pointer
    }
  },
  watch: {
    trankeyPress(newVal) {
      this.CHANGE_TRANKEY_PRESS(newVal)
    }
  },
  methods: {
    ...mapActions([
      'postPointer',
      'lastindex',
      'videoplay',
      'nextindex',
      'getindex',
      'cut',
      'del',
      'lastTemp',
      'nextTemp',
      'avleave',
      'Post',
      'zhantie',
      'libRemove',
      'libCut',
      'libCopy',
      'libPast',
      'msgbox',
      'changeLoading'
    ]),
    ...mapMutations([
      'CHANGE_BOXSET',
      'SET_MUL_CONTROL',
      'EMPTY_ACTIVE_CHUNK',
      'CLEAR_REST_ACTIVE_CHUNKS',
      'CHANGE_REST_ACTIVE_CHUNKS',
      'DEL_REST_ACTIVE_CHUNKS',
      'POP_REST_ACTIVE_CHUNKS',
      'ACTIVE_CHUNK',
      'CHANGE_ACTIVE_CHUNK',
      'UPDATE_CHUNK_POSITION',
      'CHANGE_IS_ADD_CAPTION',
      'CHANGE_TRANKEY_PRESS'
    ]),
    click(e) {
      e.stopPropagation()
    },

    dellib() {
      if (this.MulSeleList.length > 0) {
        let num = 0
        let text = ''
        for (const item in this.MulSeleList) {
          if (this.MulSeleList[item].slice(-1) === '/') {
            num++
          }
        }

        if (num === this.MulSeleList.length) {
          text = '确定将选中文件夹删除么，文件夹中的素材会被全部删除。'
        } else if (num === 0) {
          text = '确定将选中素材删除么？被应用到的素材也将会被全部删除。'
        } else {
          text =
            '确定将选中文件夹及素材删除么？该文件夹中的所有素材及被应用到的素材也将会被全部删除。'
        }
        this.msgbox({ text: text, handle: this.libRemove })
      } else {
        window.zindex = 0
        this.$alert('请选择要删除的素材或文件夹！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 3
          }
        })
      }
    },
    cutlib() {
      if (this.MulSeleList.length === 0) {
        window.zindex = 0
        this.$alert('请选择要剪辑的素材或文件夹！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 3
          }
        })
      } else {
        this.libCut()
      }
    },
    copylib() {
      if (this.MulSeleList.length === 0) {
        window.zindex = 0
        this.$alert('请选择要复制的素材或文件夹！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 3
          }
        })
      } else {
        this.libCopy()
      }
    },
    pastlib() {
      if (this.MulSeleList.length === 0) {
        window.zindex = 0
        this.$alert('请选择要粘贴的素材或文件夹！', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 3
          }
        })
      } else {
        this.libPast()
      }
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
        // const del_chunks_id = []
        // if (this.activechunk.chunk.chunk_id) {
        //   del_chunks_id.push(this.activechunk.chunk.chunk_id)
        // }
        // this.restActiveChunks.forEach(restItem => {
        //   del_chunks_id.push(restItem.chunk.chunk_id)
        // })
        // this.del(del_chunks_id)
        this.del([this.activechunk.index])
      }
    },
    cutchunk() {
      // this.UPDATE_CHUNK_POSITION()
      const linePos = this.pointer.position
      // const cut_chunks = {}

      // for (const trackItem of this.ghostsPosition.all) {
      //   if (linePos > trackItem.track_start && linePos < trackItem.track_end) {
      //     cut_chunks.chunk_id = trackItem.chunk_id
      //     break
      //   }
      // }
      
      // cut_chunks.split = [linePos]
      this.cut([linePos])
    },
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
        this.$alert('该资源非视频资源或已进行过音视频分离！', '提示消息', {
          confirmButtonText: '确定'
        })
        return
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
        // if (typeof this.activechunk.chunk.chunk_type === 'undefined') {
        //   window.zindex = 0
        //   this.$alert('字幕快请到字幕设置界面添加！', '提示消息', {
        //     confirmButtonText: '确定',
        //     callback() {
        //       window.zindex = 1
        //     }
        //   })
        //   return
        // }
        // this.UPDATE_CHUNK_POSITION()
        // const copyArray = []
        // let copyStart = 0
        // this.ghostsPosition.all.forEach(trackItem => {
        //   copyArray.push(trackItem.chunk_id)
        //   copyStart = trackItem.track_end > copyStart ? trackItem.track_end : copyStart
        // })
        // const copyId = this.activechunk.chunk.chunk_id
        // const copyInfo = {
        //   copyId,
        //   copyStart
        // }
        this.zhantie(this.activechunk.index)
      }
    },
    selectAllChunk() {
      this.CLEAR_REST_ACTIVE_CHUNKS()
      this.all.tracks.v_track_list.forEach(trackItem => {
        if (trackItem.chunks) {
          trackItem.chunks.forEach(chunkItem => {
            if (chunkItem.chunk_type === 5) return
            this.ACTIVE_CHUNK({ chunk: chunkItem, state: 'active' })
            const activeClone = _.cloneDeep(this.activechunk)
            this.CHANGE_REST_ACTIVE_CHUNKS(activeClone)
          })
        }
      })
      this.all.tracks.a_track_list.forEach(trackItem => {
        if (trackItem.chunks) {
          trackItem.chunks.forEach(chunkItem => {
            if (chunkItem.chunk_type === 5) return
            this.ACTIVE_CHUNK({ chunk: chunkItem, state: 'active' })
            const activeClone = _.cloneDeep(this.activechunk)
            this.CHANGE_REST_ACTIVE_CHUNKS(activeClone)
          })
        }
      })
      this.EMPTY_ACTIVE_CHUNK()
      if (this.restActiveChunks.length) {
        this.CHANGE_ACTIVE_CHUNK(
          this.restActiveChunks[this.restActiveChunks.length - 1]
        )
        this.POP_REST_ACTIVE_CHUNKS()
      }
      this.UPDATE_CHUNK_POSITION()
    },
    deleteKeypress(e) {
      if (
        e.altKey === this.trankeyPress.delete.altKey &&
        (e.metaKey === this.trankeyPress.delete.metaKey ||
          e.ctrlKey === this.trankeyPress.delete.ctrlKey) &&
        e.shiftKey === this.trankeyPress.delete.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.delete.normalKey[0] ||
          e.key === this.trankeyPress.delete.normalKey[1] ||
          e.key === this.trankeyPress.delete.normalKey[2]
        ) {
          e.preventDefault()
          e.stopPropagation()
          this.delchunk()
        }
      }
    },
    cutKeypress(e) {
      if (
        e.altKey === this.trankeyPress.cut.altKey &&
        (e.metaKey === this.trankeyPress.cut.metaKey ||
          e.ctrlKey === this.trankeyPress.cut.ctrlKey) &&
        e.shiftKey === this.trankeyPress.cut.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.cut.normalKey[0] ||
          e.key === this.trankeyPress.cut.normalKey[1]
        ) {
          e.returnValue = false
          e.preventDefault()
          this.cutchunk()
        }
      }
    },
    copyKeypress(e) {
      if (
        e.altKey === this.trankeyPress.copy.altKey &&
        (e.metaKey === this.trankeyPress.copy.metaKey ||
          e.ctrlKey === this.trankeyPress.copy.ctrlKey) &&
        e.shiftKey === this.trankeyPress.copy.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.copy.normalKey[0] ||
          e.key === this.trankeyPress.copy.normalKey[1]
        ) {
          e.returnValue = false
          // this.fuzhi()
        }
      }
    },
    pasteKeypress(e) {
      if (
        e.altKey === this.trankeyPress.paste.altKey &&
        (e.metaKey === this.trankeyPress.paste.metaKey ||
          e.ctrlKey === this.trankeyPress.paste.ctrlKey) &&
        e.shiftKey === this.trankeyPress.paste.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.paste.normalKey[0] ||
          e.key === this.trankeyPress.paste.normalKey[1]
        ) {
          e.returnValue = false
          this.zhantiechunk()
        }
      }
    },
    redoKeypress(e) {
      if (
        e.altKey === this.trankeyPress.redo.altKey &&
        (e.metaKey === this.trankeyPress.redo.metaKey ||
          e.ctrlKey === this.trankeyPress.redo.ctrlKey) &&
        e.shiftKey === this.trankeyPress.redo.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.redo.normalKey[0] ||
          e.key === this.trankeyPress.redo.normalKey[1]
        ) {
          e.returnValue = false
          e.preventDefault()
          this.nextTemp(2)
        }
      }
    },
    revokeKeypress(e) {
      if (
        e.altKey === this.trankeyPress.revoke.altKey &&
        (e.metaKey === this.trankeyPress.revoke.metaKey ||
          e.ctrlKey === this.trankeyPress.revoke.ctrlKey) &&
        e.shiftKey === this.trankeyPress.revoke.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.revoke.normalKey[0] ||
          e.key === this.trankeyPress.revoke.normalKey[1]
        ) {
          e.returnValue = false
          e.preventDefault()
          this.lastTemp(2)
        }
      }
    },
    saveKeyPress(e) {
      if (
        e.altKey === this.trankeyPress.save.altKey &&
        (e.metaKey === this.trankeyPress.save.metaKey ||
          e.ctrlKey === this.trankeyPress.save.ctrlKey) &&
        e.shiftKey === this.trankeyPress.save.shiftKey &&
        (e.key === this.trankeyPress.save.normalKey[0] ||
          e.key === this.trankeyPress.save.normalKey[1])
      ) {
        e.returnValue = false
        e.preventDefault()
        this.CHANGE_BOXSET('savevideo')
      }
    },
    // addCapKeyPress(e) {
    //   if (!this.captionsetshow) {
    //     return
    //   }
    //   if (
    //     e.altKey === this.trankeyPress.add_caption.altKey &&
    //     (e.metaKey === this.trankeyPress.add_caption.metaKey ||
    //       e.ctrlKey === this.trankeyPress.add_caption.ctrlKey) &&
    //     e.shiftKey === this.trankeyPress.add_caption.shiftKey &&
    //     (e.key === this.trankeyPress.add_caption.normalKey[0] ||
    //       e.key === this.trankeyPress.add_caption.normalKey[1])
    //   ) {
    //     e.returnValue = false
    //     e.preventDefault()
    //     this.CHANGE_IS_ADD_CAPTION(true)
    //   }
    // },
    lastFrameKeypress(e) {
      if (
        e.altKey === this.trankeyPress.last_frame.altKey &&
        (e.metaKey === this.trankeyPress.last_frame.metaKey ||
          e.ctrlKey === this.trankeyPress.last_frame.ctrlKey) &&
        e.shiftKey === this.trankeyPress.last_frame.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.last_frame.normalKey[0] ||
          e.key === this.trankeyPress.last_frame.normalKey[1]
        ) {
          e.returnValue = false
          this.lastindex()
        }
      }
    },
    nextFrameKeypress(e) {
      if (
        e.altKey === this.trankeyPress.next_frame.altKey &&
        (e.metaKey === this.trankeyPress.next_frame.metaKey ||
          e.ctrlKey === this.trankeyPress.next_frame.ctrlKey) &&
        e.shiftKey === this.trankeyPress.next_frame.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.next_frame.normalKey[0] ||
          e.key === this.trankeyPress.next_frame.normalKey[1]
        ) {
          e.returnValue = false
          this.nextindex()
        }
      }
    },
    playKeypress(e) {
      if (
        e.altKey === this.trankeyPress.play.altKey &&
        (e.metaKey === this.trankeyPress.play.metaKey ||
          e.ctrlKey === this.trankeyPress.play.ctrlKey) &&
        e.shiftKey === this.trankeyPress.play.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.play.normalKey[0] ||
          e.key === this.trankeyPress.play.normalKey[1]
        ) {
          e.returnValue = false
          this.videoplay()
        }
      }
    },
    allSelectKeyPress(e) {
      if (
        e.altKey === this.trankeyPress.select_all.altKey &&
        (e.metaKey === this.trankeyPress.select_all.metaKey ||
          e.ctrlKey === this.trankeyPress.select_all.ctrlKey) &&
        e.shiftKey === this.trankeyPress.select_all.shiftKey
      ) {
        if (
          e.key === this.trankeyPress.select_all.normalKey[0] ||
          e.key === this.trankeyPress.select_all.normalKey[1]
        ) {
          e.returnValue = false
          if (this.modalVoiceApplyIsShow) {
            return
          }
          this.selectAllChunk()
        }
      }
    },
    initkeypress() {
      // zindex=0: none
      // zindex=1 : delchunk,cutchunk,zhantiechunk,nextTemp,lastTemp,savevideo,lastindex,nextindex,videoplay
      // zindex=2: lastindex,nextindex,videoplay
      // zindex=3: 对素材进行 delete 删除 ；ctrl+鼠标多选；ctrl+C复制；ctrl+v粘贴；x剪辑 操作
      $(document).keydown(e => {
        if (typeof this.trankeyPress.delete === 'undefined') {
          return
        }
        /* if(e.key === 'Control'){
                this.SET_MUL_CONTROL(true)
            }else{
                this.SET_MUL_CONTROL(false)
            } */
        if (window.zindex === 1) {
          this.deleteKeypress(e)
          this.cutKeypress(e)
          this.copyKeypress(e)
          this.pasteKeypress(e)
          this.redoKeypress(e)
          this.revokeKeypress(e)
          this.saveKeyPress(e)
          // 全选
          // this.allSelectKeyPress(e)
          // this.addCapKeyPress(e)
        }
        if (window.zindex === 1 || window.zindex === 2) {
          this.lastFrameKeypress(e)
          this.nextFrameKeypress(e)
          this.playKeypress(e)
        }
        if (window.zindex === 3) {
          if (
            e.key === this.trankeyPress.delete.normalKey[0] ||
            e.key === this.trankeyPress.delete.normalKey[1] ||
            e.key === this.trankeyPress.delete.normalKey[2]
          ) {
            // this.libRemove()
            this.dellib()
          }
          if (e.ctrlKey && e.key === 'c') {
            this.copylib()
          }
          if (e.ctrlKey && e.key === 'x') {
            this.cutlib()
          }
          if (e.ctrlKey && e.key === 'v') {
            this.pastlib()
          }
        }
      })
    },
    changeShow() {
      this.keypressStaus = !this.keypressStaus
      $('.keypress_set input').prop('checked', false)
    },
    getKeypress() {
      // 获取快捷键配置选项
      const that = this
      const formkey = {
        last: '←',
        next: '→',
        top: '↑',
        bottom: '↓'
      }
      const res = {
        "code": 0,
        "data": {
            "sc": {
                "next_frame": "next",
                "last_frame": "last",
                "play": "Space",
                "delete": "Delete",
                "cut": "X",
                "save": "Ctl,S",
                "copy": "Ctl,C",
                "paste": "Ctl,V",
                "revoke": "Ctl,Z",
                "redo": "Ctl,Y",
                "select_all": "Ctl,A",
                "select_multi": "Ctl,",
                "add_caption": "Enter"
            },
            "utime": 1583142418263
        }
      }
      const obj = {}
        for (const key of Object.keys(res.data.sc)) {
          obj[key] = ''
          const arr = res.data.sc[key].split(',')
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              obj[key] +=
                typeof formkey[arr[i]] === 'undefined'
                  ? arr[i]
                  : formkey[arr[i]]
            } else {
              obj[key] +=
                '+' +
                (typeof formkey[arr[i]] === 'undefined'
                  ? arr[i]
                  : formkey[arr[i]])
            }
          }
        }
        that.keypress = obj
    },
    addSpecialKey(arr, obj) {
      if (obj.ctrlKey) {
        arr.push('Ctl')
      }
      if (obj.altKey) {
        arr.push('Alt')
      }
      if (obj.shiftKey) {
        arr.push('Shift')
      }
    },
    inputdown(e, type) {
      // 修改快捷键事件
      console.log(e)
      const that = this
      e.stopPropagation()
      e.preventDefault()
      e.returnValue = false
      let obj = {
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        ctrlKey: e.ctrlKey,
        metaKey: e.metaKey,
        normalKey: {}
      }
      const en = [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ]
      if (e.keyCode >= 65 && e.keyCode <= 90) {
        obj.normalKey.name = en[e.keyCode - 65]
        obj.normalKey.code = e.keyCode
      }
      if (e.keyCode >= 96 && e.keyCode <= 105) {
        obj.normalKey.name = e.keyCode - 96
        obj.normalKey.code = [e.keyCode, e.keyCode - 48]
      }
      if (e.keyCode >= 48 && e.keyCode <= 57) {
        obj.normalKey.name = e.keyCode - 48
        obj.normalKey.code = [e.keyCode, e.keyCode + 48]
      }
      switch (e.keyCode) {
        case 32: {
          obj.normalKey.name = 'Space'
          obj.normalKey.code = 32
          break
        }

        case 13: {
          obj.normalKey.name = 'Enter'
          obj.normalKey.code = 13
          break
        }

        case 37: {
          obj.normalKey.name = '←'
          obj.normalKey.code = 37
          break
        }

        case 38: {
          obj.normalKey.name = '↑'
          obj.normalKey.code = 38
          break
        }
        case 39: {
          obj.normalKey.name = '→'
          obj.normalKey.code = 39
          break
        }
        case 40: {
          obj.normalKey.name = '↓'
          obj.normalKey.code = 40
          break
        }

        case 46: {
          obj.normalKey.name = 'Delete'
          obj.normalKey.code = [46, 8]
          break
        }
        case 8: {
          obj.normalKey.name = 'Delete'
          obj.normalKey.code = [46, 8]
          break
        }
        default: {
          console.log('no such keyCode')
        }
      }
      const arr = []
      this.addSpecialKey(arr, obj)
      if (typeof obj.normalKey.name === 'undefined') {
        return
      }
      arr.push(obj.normalKey.name)
      obj = {}

      switch (type) {
        case '←': {
          obj[type] = 'last'
          break
        }
        case '↑': {
          obj[type] = 'top'
          break
        }
        case '→': {
          obj[type] = 'next'
          break
        }
        case '↓': {
          obj[type] = 'bottom'
          break
        }
        default: {
          obj[type] = arr.join(',')
        }
      }
      $.post(
        window.AQES.DOMAIN + '/api/shortcut',
        JSON.stringify({ cmd: 'update', shortcut: obj }),
        function(res) {
          if (res.code === 0) {
            that.keypress[type] = arr.join('+')
          } else {
            console.log('set shortCut failed')
          }
        }
      )
      return
    }
  },
  mounted() {
    this.initkeypress()
  }
}
</script>

<style lang="scss" scoped>
.keyPress {
  background: url(../../img/keyboard.png) center top no-repeat;
  display: inline-block;
  width: 0.6rem;
  height: 0.46rem;
  box-sizing: border-box;
  background-size: 45%;
  position: absolute;
  right: 0.11rem;
  top: 0.11rem;
  &:hover {
    background: url(../../img/keyboard_a.png) center top no-repeat;
    background-size: 45%;
    .keypress_out {
      > .title {
        color: #61ded0;
      }
    }
  }

  .keypress_out {
    height: 100%;
    cursor: pointer;
    position: relative;
    > .title {
      width: 100%;
      text-align: center;
      position: absolute;
      bottom: 0;
    }
  }

  .keypress_set {
    position: absolute;
    top: 26px;
    width: 440px;
    background-color: #151a20;
    // background-color: #212931;
    // background-color: #1c232a;
    z-index: 1000;
    left: 50%;
    transform: translate(-50%, 0);
    &.active {
      display: block;
    }
    .keypress_set_title {
      position: relative;
      height: 40px;
      line-height: 40px;
      font-size: 18px;
      text-align: center;
      background-color: #303840;
      // background: #191e22;
      border-radius: 4px 4px 0px 0px;

      em {
        font-style: normal;
        position: absolute;
        right: 0;
        padding: 0 10px;
        cursor: pointer;
      }
    }
    .keypress_set_content {
      .keypress_set_contentL,
      .keypress_set_contentR {
        float: left;
        width: 50%;
        border-right: 1px solid #2e2e2e;
        box-sizing: border-box;
        p {
          margin: 5px;
          label {
            position: relative;
            i {
              width: 80px;
              display: inline-block;
              font-style: normal;
              text-align: center;
            }
            input {
              width: 90px;
              cursor: pointer;
            }
            input[type='radio']:checked {
              & + input[type='text'] {
                border: 1px solid #61ded0;
              }
            }
          }
        }
      }
    }
  }
}
.captiontext {
  border-radius: 4px;
  background-color: transparent;
  color: #fff;
  box-sizing: border-box;
  height: 30px;
  border: 1px solid transparent;
  box-sizing: border-box;
  -moz-appearance: textfield;
  -webkit-appearance: none;
  display: inline-block;
  outline: 0;
  padding: 0.2em;
  text-decoration: none;
  width: calc(100% - 250px);
  &:focus {
    border: 1px solid #61ded0;
  }
  &.active {
    border: 1px solid #61ded0;
  }
}
</style>
