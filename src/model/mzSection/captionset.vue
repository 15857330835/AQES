<template>
  <div class="clearfix captionsetBox">
    <div class="captionset_style">
      <span
        style="display:inline-block;height:100%;float:left;margin-left:40px;line-height:40px"
        >字幕样式</span
      >
      <span
        id="zmstyleSelect"
        style="width:150px;display:inline-block;margin-top:9px;margin-left:30px;float:left"
      ></span>

      <span style="float:right" class="addCaption" @click="addCaption"></span>
    </div>
    <div class="cap-up-container">
      <div class="captionset_set">
        <div class="captionset_font clearfix">
          <capfontpick
            :holder="font"
            :style="{ width: '180px' }"
            @change="fontChange"
          ></capfontpick>
        </div>
        <div class="clearfix" style="float:left">
          <input
            type="number"
            :value="fontSize"
            class="styCap"
            min="0"
            max="96"
            @blur="fontSizeChange($event.currentTarget)"
          />
        </div>
        <div class="clearfix" style="float:left">
          <div class="font-textcolor" :style="{ float: 'left' }">
            <capcolorpick
              :holder="font"
              :type="'font'"
              @change="fontChange"
            ></capcolorpick>
          </div>
        </div>
        <div
          title="粗体"
          class="font-width font-option"
          :class="font.weight > 500 ? 'active' : ''"
          @click="togglefont('weight')"
        >
          <div></div>
        </div>
        <div
          title="斜体"
          class="font-style font-option"
          :class="font.style != 'normal' ? 'active' : ''"
          @click="togglefont('style')"
        >
          <div></div>
        </div>
        <div class="clearfix" style="float:left">
          <div class="font-textProfile" :style="{ float: 'left' }">
            <capcolorpick
              :holder="font"
              :type="'b'"
              text="文本轮廓"
              @change="fontChange"
            ></capcolorpick>
          </div>
        </div>
        <div class="clearfix" style="float:left">
          <div class="textBorder">
            <div class="font-textoutline">
              <div class="icon"></div>
            </div>
            <div class="el-icon-minus icon-item" @click="setoutline(-1)"></div>
            <span>{{ outline }}</span
            ><span>磅</span>
            <div class="el-icon-plus icon-item" @click="setoutline(1)"></div>
          </div>
        </div>
        <div class="clearfix" style="float:left">
          <div class="font-geshibeijingse" :style="{ float: 'left' }">
            <!-- iconfont icon-geshibeijingse -->
            <capcolorpick
              :holder="font"
              :type="'backg'"
              @change="fontChange"
            ></capcolorpick>
          </div>
        </div>
      </div>

      <div class="captionset_content track-box bscroll" ref="bscroll">
        <div class="bscroll-container">
          <div
            class="captionset_contents"
            v-for="(chunk, index) in this.all.caption.chunks"
            :key="chunk.chunk_id"
            :class="
              chunk.chunk_id == activechunk.chunk.chunk_id ? 'active' : ''
            "
          >
            <span
              style="display:inline-block;width:200px;height:30px;line-height:30px"
              @click="textinput(index, chunk, false)"
            >
              <span
                v-html="trantime(chunk.track_start)"
                style="margin-left:30px"
              ></span
              >&nbsp;~&nbsp;<span
                v-html="trantime(chunk.track_end)"
              ></span></span
            ><input
              placeholder="点击此处修改内容"
              v-model="chunk.text"
              maxlength="80"
              @focus="textinput(index, chunk, true)"
              @blur="blur($event.currentTarget, chunk.chunk_id)"
              @keydown.stop="keydownHandler($event, chunk.chunk_id, index)"
              class="captiontext"
              type="text"
              v-focus="focusIndex === index"
              @click.stop="focusIndex = index"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="clearfix btn-group">
      <div class="captionsel_export" @click="captionExportHandler">
        字幕导出
      </div>
      <div class="captionsel_sure" @click="captionSureHandler">
        确认
      </div>
    </div>
    <ExportCaption></ExportCaption>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import BScroll from 'better-scroll'
import { captionUpdateFontStyleApi } from '@/api/Caption'
import capfontpick from './capfontpick'
import capcolorpick from './capcolorpick'
import ExportCaption from './ExportCaption'

export default {
  data() {
    return {
      isOutTypeShow: false,
      focusIndex: -1
    }
  },
  components: {
    capfontpick,
    capcolorpick,
    ExportCaption
  },
  computed: {
    ...mapState([
      'captionlist',
      'all',
      'activechunk',
      'isAddCaption',
      'captionsetshow',
      'trankeyPress',
      'isRefreshCaptionSetBS'
    ]),
    captionsLen() {
      return this.all.caption.chunks.length
    },
    loadingShow() {
      return this.startloading || this.onloading
    },
    font: {
      get: function() {
        return this.all.caption.status.font
      },
      set: function(val) {
        this.all.caption.status.font = val
      }
    },
    fontSize: {
      get: function() {
        return this.all.caption.status.font.size
      },
      set: function(val) {
        if (val <= 4) {
          this.font.size = 4
        } else if (val >= 96) {
          this.font.size = 96
        } else {
          this.font.size = parseInt(val, 10)
        }
      }
    },
    outline: {
      get: function() {
        return parseInt(this.font.outline, 10).toFixed(2)
      },
      set: function(val) {
        if (val < 0) {
          this.font.outline = 0
        } else {
          this.font.outline = parseInt(val, 10) /*  + 'px' */
        }
      }
    }
  },
  watch: {
    captionsLen() {
      // this.$nextTick(() => this.aBScroll.refresh())
      setTimeout(function() {
        $('.captionset_content')
          .getNiceScroll()
          .resize()
      }, 750)
    },
    isAddCaption(newVal) {
      if (newVal) {
        this.addCaption()
      }
      this.CHANGE_IS_ADD_CAPTION(false)
    },
    isRefreshCaptionSetBS(newVal) {
      if (newVal) {
        this.CHANGE_IS_REFRESH_CAPTION_SET_BS(false)
        // this.$nextTick(() => this.aBScroll.refresh())
        setTimeout(function() {
          $('.captionset_content')
            .getNiceScroll()
            .resize()
        }, 750)
      }
    }
  },
  methods: {
    ...mapActions(['changeLoading', 'Post']),
    ...mapMutations([
      'ACTIVE_CHUNK',
      'CHANGE_CAPTIONSETSHOW',
      'CHANGE_IS_OUT_TYPE_SHOW',
      'CHANGE_IS_ADD_CAPTION',
      'CHANGE_IS_REFRESH_CAPTION_SET_BS'
    ]),
    // eslint-disable-next-line complexity
    keydownHandler(e, id, i) {
      if (!this.captionsetshow) {
        return
      }
      const isNormal = !e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey
      if (
        isNormal &&
        (e.keyCode === 13 ||
          e.key === 'Enter' ||
          e.keyCode === 40 ||
          e.key === 'ArrowDown')
      ) {
        if (i < this.captionsLen - 1) {
          this.focusIndex = i + 1
        }
      } else if (isNormal && (e.keyCode === 38 || e.key === 'ArrowUp')) {
        if (i > 0) {
          this.focusIndex = i - 1
        }
      } else if (
        e.altKey === this.trankeyPress.add_caption.altKey &&
        (e.metaKey === this.trankeyPress.add_caption.metaKey ||
          e.ctrlKey === this.trankeyPress.add_caption.ctrlKey) &&
        e.shiftKey === this.trankeyPress.add_caption.shiftKey &&
        (e.key === this.trankeyPress.add_caption.normalKey[0] ||
          e.key === this.trankeyPress.add_caption.normalKey[1])
      ) {
        e.returnValue = false
        e.preventDefault()
        this.blur(e.currentTarget, id)
        this.addCaption()
      }
    },
    initcaptionlist() {
      const a = []
      let str = ''
      for (let i = 0; i < this.captionlist.length; i++) {
        const b = {}
        if (this.captionlist[i].style === this.all.caption.status.style) {
          str = this.captionlist[i].name
        }

        b.name = this.captionlist[i].name
        b.id = this.captionlist[i].style
        a.push(b)
      }
      const fnBack2 = function(result) {
        $.post(
          window.NCES.DOMAIN + '/api/caption',
          JSON.stringify({
            cmd: 'update_style',
            style: result.id
          }),
          function(res) {
            window.captionStyle.status.style = result.id
            // Hub.$emit('changeM', '')
          }
        )
      }
      // eslint-disable-next-line
				const selectType = new SelectBox($('#zmstyleSelect'), a, fnBack2, {
        color: '#fff', // 输入框字体颜色
        height: 20,
        fontSize: 12,
        optionFontSize: 12,
        optionColor: '#fff', // 下拉框字体颜色
        arrowColor: '#fff', // 箭头颜色
        borderColor: '#606060', // 边线颜色
        borderRadius: 3,
        borderWidth: 1, // 边线宽度
        backgroundColor: '#1d1d1d', // 背景色颜色
        hoverColor: '#151a20', // 下拉框HOVER颜色
        arrowBorderWidth: 0, // 箭头左侧分割线宽度。如果为0则不显示
        placeholder: '', // 默认提示
        defalut: str,
        allowInput: false, // 是否允许输入
        width: 135,
        retur: true
      })
    },
    trantime(s_para) {
      let s = s_para
      let h = Math.floor(s / 1500)
      let m = Math.floor((s % 1500) / 25)
      m < 10 && (m = '0' + m)
      s = parseInt(s % 25, 10)
      s < 10 && (s = '0' + s)
      h < 10 && (h = '0' + h)
      return h + ':' + m + ':' + s // 00:00:00
    },
    blur(target, id) {
      this.focusIndex = -1
      const that = this
      const data = {}
      data.type = 'caption'
      data.data = { cmd: 'update_text', chunk_id: id, text: target.value }
      data.success = function(res) {
        that.changeLoading()
      }
      data.error = function(res) {
        window.zindex = 1
        that.$alert('字幕内容修改失败!', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        console.log('字幕内容修改失败:' + res.msg)
      }
      $.post(
        window.NCES.DOMAIN + '/api/caption',
        JSON.stringify({
          cmd: 'update_text',
          chunk_id: id,
          text: target.value
        }),
        function(res) {
          that.changeLoading()
        },
        'json'
      )
      window.zindex = 1
    },
    captionSureHandler: function() {
      this.CHANGE_CAPTIONSETSHOW(false)
      const that = this
      if (window.type === 'caption') {
        window.NCES.Getcaptionstyles(function(res) {
          that.INIT_CAPTIONLIST(res)
        })
      }
    },
    captionExportHandler: function() {
      const isEmpty = this.all.caption.chunks.every(item => !item.text.length)
      if (!this.all.caption.chunks.length || isEmpty) {
        this.$alert('无字幕内容', '警告')
      } else {
        this.CHANGE_IS_OUT_TYPE_SHOW(true)
      }
    },
    addCaption() {
      const that = this
      if (typeof this.activechunk.index === 'undefined') {
        window.zindex = 0
        that.$alert('请选择目标字幕块!', '提示消息', {
          confirmButtonText: '确定',
          callback: function() {
            window.zindex = 1
          }
        })
        window.zindex = 0
        return
      }
      let b = 75
      // if()
      if (this.activechunk.index < this.all.caption.chunks.length - 1) {
        console.log(
          'jinru',
          this.all.caption.chunks.length,
          this.activechunk.index
        )
        const a =
          this.all.caption.chunks[this.activechunk.index].track_start -
          this.all.caption.chunks[this.activechunk.index + 1].track_end
        if (a < b) {
          b = a
        }
      }
      // for(var i = 0;i<this.all.caption.chunks.length;i++){
      //     if(i!=this.activechunk.index){
      //         var a= this.all.caption.chunks[i].track_start-this.all.caption.chunks[i].track_end
      //         if(0<=a&&a<b){
      //             b = a
      //         }
      //     }
      // }
      const data = {}
      data.type = 'caption'
      if (this.all.caption.chunks.length === 0) {
        that.ACTIVE_CHUNK({ index: -1 })

        data.data = { cmd: 'add', track_start: 0, track_end: 75 }
      } else {
        if (b < 75) {
          data.data = {
            cmd: 'add',
            track_start:
              that.all.caption.chunks[this.activechunk.index].track_end,
            track_end:
              that.all.caption.chunks[this.activechunk.index].track_end + 75,
            mode: 2
          }
        } else {
          data.data = {
            cmd: 'add',
            track_start:
              that.all.caption.chunks[this.activechunk.index].track_end,
            track_end:
              that.all.caption.chunks[this.activechunk.index].track_end + 75,
            mode: 0
          }
        }
      }
      data.success = function(res) {
        that.changeLoading(function() {
          that.CHANGE_IS_REFRESH_CAPTION_SET_BS(true)
        })
        that.ACTIVE_CHUNK({
          chunk: res.data,
          index: that.activechunk.index + 1
        })
      }
      this.Post(data)
    },
    fontChange(obj) {
      this.font = obj
      this.fontUpdate(obj)
    },
    async fontUpdate(obj) {
      const data = {
        style: obj
      }
      const res = await captionUpdateFontStyleApi(data)
      if (res.code !== 0) return
    },
    fontSizeChange(target) {
      this.fontSize = parseInt(target.value, 10)
      this.fontUpdate(this.font)
    },
    togglefont: function(style) {
      if (style === 'weight') {
        if (this.font.weight === 500) {
          this.font.weight = 600
        } else {
          this.font.weight = 500
        }
      }
      if (style === 'style') {
        if (this.font.style === 'normal') {
          this.font.style = 'italic'
        } else {
          this.font.style = 'normal'
        }
      }
      this.fontUpdate(this.font)
    },
    setoutline(step) {
      if (parseInt(this.font.outline, 10) + step < 0) {
        this.outline = 0
        this.fontUpdate(this.font)
        return
      }
      if (parseInt(this.font.outline, 10) + step > 3) {
        this.outline = 3
        this.fontUpdate(this.font)
        return
      }
      this.outline = parseInt(this.font.outline, 10) + step
      this.fontUpdate(this.font)
    },
    textinput(index, chunk, changeindex) {
      this.ACTIVE_CHUNK({ chunk: chunk, index: index })
      if (changeindex) {
        window.zindex = 0
      }
    }
  },
  mounted() {
    this.initcaptionlist()
    // const bscrollDom = this.$refs.bscroll
    // this.aBScroll = new BScroll(bscrollDom, {
    //   mouseWheel: true,
    //   click: true,
    //   tap: true,
    //   scrollbar: {
    //     fade: false,
    //     interactive: true
    //   }
    // })
    $('.captionset_content').niceScroll({
      cursorcolor: '#AAAAAA',
      cursorborder: '1px solid #AAAAAA',
      horizrailenabled: false,
      enablescrollonselection: true
    })
  }
}
</script>

<style lang="scss" scoped>
.captionsetBox {
  height: 100%;
  display: flex;
  flex-direction: column;
  .captionset_style {
    height: 40px;
    box-sizing: border-box;
    position: relative;
  }
  .cap-up-container {
    height: calc(100% - 106px);
    display: flex;
    flex-direction: column;
    .captionset_set {
      padding: 0 0 0 117px;
      display: flex;
      flex-wrap: wrap;
      .captionset_font {
        position: relative;
        height: 30px;
        float: left;
        padding-top: 5px;
      }
    }
    .captionset_content {
      box-sizing: border-box;
      padding: 10px 10px 0 10px;
      overflow: hidden;
      flex: 1;
      .bscroll-container {
        display: block;
      }
      .captionset_contents {
        &.active {
          background-color: #131212;
        }
      }
    }
  }
}

.addCaption {
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-right: 15px;
  margin-top: 10px;
  cursor: pointer;
  background-image: url(../../img/addCaption.png);
}

.captiontext {
  border-radius: 4px;
  background-color: transparent;
  color: #fff;
  box-sizing: border-box;
  height: 30px;
  border: 1px solid transparent;
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

.btn-group {
  position: absolute;
  right: 20px;
  bottom: 20px;
  .captionsel_sure,
  .captionsel_export {
    width: 90px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    font-size: 16px;
    border-radius: 3px;
    float: right;
    margin-right: 20px;
    margin-top: 10px;
    cursor: pointer;
    color: #333;
  }
  .captionsel_sure {
    color: #203035;
    background-color: #61ded0;
    border-color: #61ded0;
  }
  .captionsel_export {
    color: #cdd5dd;
    background-color: #636a71;
    border-color: #636a71;
  }
}

input[type='number'].styCap {
  border-radius: 4px;
  background-color: #1d1d1d;
  color: #61ded0;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  height: 30px;
  border: 1px solid #636363;
  -webkit-appearance: none;
  -moz-appearance: textfield;
  display: inline-block;
  outline: 0;
  padding: 0.2em;
  text-decoration: none;
  width: 60px;
  margin-top: 4px;
}

.textBorder {
  height: 28px;
  border: 1px solid #616161;
  line-height: 28px;
  overflow: hidden;
  display: flex;
  margin-top: 5px;

  .icon-item {
    width: 28px;
    line-height: 28px;
    cursor: pointer;
    text-align: center;
  }
}
</style>
