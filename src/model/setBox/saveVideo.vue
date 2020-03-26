<template>
  <div class="saveTable">
    <div class="saveTable_content">
      <div class="content_title">视频生成设置</div>
      <div class="content_select">
        <p>
          <span>视频名称 : </span><input type="text" class="out_file_name" />
        </p>
        <p>
          <span>视频格式 : </span
          ><span id="selectType" style="padding:0;text-align: left;top:6px"
            >m3u8</span
          >
        </p>
        <p>
          <span>分辨率 : </span
          ><span id="selectP" style="padding:0;text-align: left;top:6px"
            >1920*1080</span
          >
        </p>
        <p>
          <span>视频编码 : </span
          ><span style="padding:0;text-align:left;color:#aaaaaa">h264</span>
        </p>
        <p>
          <span>音频编码 : </span
          ><span style="padding:0;text-align:left;color:#aaaaaa">aac</span>
        </p>
        <p>
          <span>输出模式 : </span
          ><span id="selectOut" style="padding:0;text-align: left;top:6px"
            >固定质量</span
          >
        </p>
        <div>
          <div class="outOption1">
            <div style="height:40px;line-height:40px;text-align:center">
              <div style="width:30px;float:left;height:100%">0</div>
              <div style="width:135px;float:left;">
                <el-slider
                  v-model="zhiliang"
                  mini
                  :max="0.6"
                  :min="0"
                  :step="0.01"
                ></el-slider>
              </div>
              <div style="width:35px;float:left;height:100%">0.6</div>
            </div>
          </div>
          <div class="outOption2">
            <p>
              <span>视频码率 : </span
              ><span style="padding:0;text-align:left;color:#aaaaaa"
                ><input
                  type="number"
                  step="1"
                  value="1200"
                  class="selectout_video"/></span
              ><span style="color:#aaaaaa">Kbps</span>
            </p>
            <p>
              <span>音频码率 : </span
              ><span style="padding:0;text-align:left;color:#aaaaaa"
                ><input
                  type="number"
                  step="1"
                  value="128"
                  class="selectout_audio"/></span
              ><span style="color:#aaaaaa">Kbps</span>
            </p>
          </div>
        </div>
      </div>
      <div class="content_click">
        <span class="content_click_cancel" @click="cel">取消</span>
        <span class="content_click_make" @click="sure">确认</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return { player: {}, zhiliang: 0.5 }
  },
  computed: {
    ...mapState(['notify', 'systemmessage'])
  },
  watch: {},
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['CHANGE_BOXSET']),
    cel() {
      this.CHANGE_BOXSET('')
    },
    sure() {
      const that = this

      if (window.NCES.backStr) {
        window.NCES.backStr(that.add)
      } else {
        that.add()
      }
    },
    add(str_para) {
      let str = ''
      if (typeof str_para !== 'undefined') {
        str = str_para
      }
      if ($('.saveTable .out_file_name').val() === '') {
        window.zindex = 0
        this.$alert('请输入要生成的视频的名称', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
        return
      }
      let v_w = 0,
        v_h = 0
      switch ($('#selectP input').attr('index_id')) {
        case '1': {
          v_w = parseInt(this.systemmessage.player.w * 1.5, 10)
          v_h = parseInt(this.systemmessage.player.h * 1.5, 10)
          break
        }
        case '2': {
          v_w = parseInt(this.systemmessage.player.w, 10)
          v_h = parseInt(this.systemmessage.player.h, 10)
          break
        }
        case '3': {
          v_w = parseInt((this.systemmessage.player.w * 2) / 3, 10)
          v_h = parseInt((this.systemmessage.player.h * 2) / 3, 10)
          break
        }
        case '4': {
          v_w = parseInt(this.systemmessage.player.w / 2, 10)
          v_h = parseInt(this.systemmessage.player.h / 2, 10)
          break
        }
        default: {
          console.log('no such input index_id')
        }
      }
      const data = {}
      data.type = 'producer'
      if ($('#selectOut input').val() === '固定质量') {
        data.data = {
          cmd: 'add',
          name: $('.saveTable .out_file_name').val() + str,
          out_file_type: $('#selectType input').val(),
          v_w: v_w,
          v_h: v_h,
          quality: parseFloat(this.zhiliang),
          bupload_mss: true,
          mss_title: $('.saveTable .out_file_name').val() + str
        }
      } else {
        data.data = {
          cmd: 'add',
          name: $('.saveTable .out_file_name').val() + str,
          out_file_type: $('#selectType input').val(),
          v_w: v_w,
          v_h: v_h,
          vb: parseFloat($('.selectout_video').val()),
          ab: parseFloat($('.selectout_audio').val()),
          bupload_mss: true,
          mss_title: $('.saveTable .out_file_name').val() + str
        }
      }
      data.error = function(res) {
        window.zindex = 1
        this.$alert('保存视频失败!', '提示消息', {
          confirmButtonText: '确定',
          callback() {
            window.zindex = 1
          }
        })
        console.log('视频保存失败原因:' + res.msg)
      }
      this.Post(data)
      this.CHANGE_BOXSET('')
      this.$alert('视频生成准备中,请去后台查看生成进度！', '提示消息', {
        confirmButtonText: '确定'
      })
      window.zindex = 1
    }
  },
  mounted() {
    const that = this
    if (window.NCES.strOfname) {
      this.strofname = window.NCES.strOfname
    }
    //   {name:parseInt(that.systemmessage.player.w * 2 / 3) +'*'+ parseInt(that.systemmessage.player.h * 2 / 3),id:3}
    const selecttypeList = [{ name: 'm3u8', id: 'm3u8' }]
    const selectpList = [
      {
        name:
          parseInt(that.systemmessage.player.w * 1.5, 10) +
          '*' +
          parseInt(that.systemmessage.player.h * 1.5, 10),
        id: 1
      },
      {
        name: that.systemmessage.player.w + '*' + that.systemmessage.player.h,
        id: 2
      },
      {
        name:
          parseInt(that.systemmessage.player.w / 2, 10) +
          '*' +
          parseInt(that.systemmessage.player.h / 2, 10),
        id: 4
      }
    ]
    const selectoutList = [
      { name: '固定码率', id: '固定码率' },
      { name: '固定质量', id: '固定质量' }
    ]
    const fnBack1 = function(result) {
      if (result.name === '固定码率') {
        $('.outOption2').show()
        $('.outOption1').hide()
      } else {
        $('.outOption1').show()
        $('.outOption2').hide()
      }
    }
    const fnBack2 = function(result) {
      switch (result.id) {
        case 1:
        case '1': {
          $('.selectout_video').val(3000)
          break
        }
        case '2':
        case 2: {
          $('.selectout_video').val(1500)
          break
        }
        case '3':
        case 3: {
          $('.selectout_video').val(800)
          break
        }
        case '4':
        case 4: {
          $('.selectout_video').val(600)
          break
        }
        default: {
          console.log('no such result.id')
        }
      }
    }
    // eslint-disable-next-line
    const selectType = new SelectBox($('#selectType'), selecttypeList, null, {
      color: '#aaaaaa', // 输入框字体颜色
      height: 20,
      fontSize: 12,
      optionFontSize: 12,
      optionColor: '#aaaaaa', // 下拉框字体颜色
      arrowColor: '#aaaaaa', // 箭头颜色
      borderColor: '#606060', // 边线颜色
      borderRadius: 3,
      borderWidth: 1, // 边线宽度
      backgroundColor: '#1d1d1d', // 背景色颜色
      hoverColor: '#151a20', // 下拉框HOVER颜色
      arrowBorderWidth: 0, // 箭头左侧分割线宽度。如果为0则不显示
      placeholder: '', // 默认提示
      defalut: 'firstData',
      allowInput: false, // 是否允许输入
      width: 185
    })
    // eslint-disable-next-line
    const selectP = new SelectBox($('#selectP'), selectpList, fnBack2, {
      color: '#aaaaaa', // 输入框字体颜色
      height: 20,
      fontSize: 12,
      optionFontSize: 12,
      optionColor: '#aaaaaa', // 下拉框字体颜色
      arrowColor: '#aaaaaa', // 箭头颜色
      borderColor: '#606060', // 边线颜色
      borderRadius: 3,
      borderWidth: 1, // 边线宽度
      backgroundColor: '#1d1d1d', // 背景色颜色
      hoverColor: '#151a20', // 下拉框HOVER颜色
      arrowBorderWidth: 0, // 箭头左侧分割线宽度。如果为0则不显示
      placeholder: '', // 默认提示
      defalut: 'firstData',
      allowInput: false, // 是否允许输入
      width: 185
    })
    // eslint-disable-next-line
    const selectOut = new SelectBox($('#selectOut'), selectoutList, fnBack1, {
      color: '#aaaaaa', // 输入框字体颜色
      height: 20,
      fontSize: 12,
      optionFontSize: 12,
      optionColor: '#aaaaaa', // 下拉框字体颜色
      arrowColor: '#aaaaaa', // 箭头颜色
      borderColor: '#606060', // 边线颜色
      borderRadius: 3,
      borderWidth: 1, // 边线宽度
      backgroundColor: '#1d1d1d', // 背景色颜色
      hoverColor: '#151a20', // 下拉框HOVER颜色
      arrowBorderWidth: 0, // 箭头左侧分割线宽度。如果为0则不显示
      placeholder: '', // 默认提示
      defalut: 'firstData',
      allowInput: false, // 是否允许输入
      width: 185
    })
    window.zindex = 0

    $('.outOption2 input[type=number]').on('focus', function(e) {
      e.preventDefault()
    })
  }
}
</script>

<style lang="scss" scoped></style>
