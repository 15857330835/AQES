<template>
  <div class="mydirContent">
    <div class="mydir-top">
      <span class="directSearch">标题 : </span
      ><input type="text" v-model="title" /> <span class="search"></span>
      <div style="width:80px;float:right;margin:6px 10px 0 ">
        <el-select v-model="value.label" @change="change" size="mini">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <div
        style="display:inline-block;right:5px;top:10px;float: right;/*width:150px*/"
      >
        <el-upload
          class="upload-demo"
          ref="upload"
          :limit="10"
          :data="{ path: this.url }"
          :show-file-list="false"
          :action="this.actionurl"
          :on-success="success"
          :on-change="onchange"
          :on-progress="updateStatus"
          :file-list="fileList"
          :auto-upload="false"
          :before-upload="beforeAvatarUpload"
          :on-exceed="numout"
          :multiple="true"
        >
          <el-button
            slot="trigger"
            size="medium"
            type="text"
            icon="iconfont icon-shangchuan"
            >上传</el-button
          >
          <!-- <button type="button" class="el-button el-button--text el-button--medium"
                    <i class="iconfont icon-shangchuan"></i>
                    <span>上传</span></button> -->
        </el-upload>
      </div>

      <div class="upfilelist" v-show="this.ready">
        <div class="upfilelist_content">
          <div class="content_title">上传文件列表</div>
          <div
            class="content_select upfilelist_content_select"
            style="height:170px"
          >
            <p style="color:#6d6a6a;text-align:center">
              红色文件不可上传，格式或大小不支持！
            </p>
            <p
              v-for="(readyfile, index) in this.fileList"
              :key="index"
              v-if="readyfile.status == 'ready'"
              :style="{
                color: beforeAvatarUpload(readyfile) ? '' : 'red',
                width: '400px',
                margin: '10px auto'
              }"
            >
              {{ readyfile.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                (readyfile.size / 1024 / 1024).toFixed(2) + 'MB'
              }}<i
                class="el-icon-close"
                style="float:right"
                @click="celfile(readyfile.uid)"
              ></i>
            </p>
          </div>
          <div class="content_click">
            <span class="content_click_make" @click="submitUpload">确认</span
            ><span class="content_click_cancel" @click="cel">取消</span>
          </div>
        </div>
      </div>
      <el-button type="text" icon="el-icon-service" v-show="false"
        >录音</el-button
      >
    </div>
    <div class="mydir-bottom">
      <div class="mydir-bottom-title clearfix" v-if="false">
        <div style="float:left;margin-top:13px;padding-left:5px">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item
              ><span style="color:#e4e4e4" @click="intoDir('')"
                >首页</span
              ></el-breadcrumb-item
            >
            <el-breadcrumb-item
              v-for="(value, index) in this.dirarr"
              :key="index"
              v-if="value != ''"
              ><span style="color:#e4e4e4" @click="backDir(index)">{{
                value
              }}</span></el-breadcrumb-item
            >
          </el-breadcrumb>
        </div>

        <div style="float:right">
          <el-button type="text" icon="el-icon-printer" @click="createDir"
            >新建文件夹</el-button
          >
        </div>
      </div>

      <div class="mydir-bottom-content clearfix">
        <div
          class="video_option_content"
          v-for="(upfile, index) in this.fileList"
          :key="index"
          v-if="upfile.percentage != 0 && upfile.percentage != 100"
        >
          <div class="content_top" style="color:#e4e4e4 !important">
            <el-progress
              type="circle"
              :percentage="parseInt(upfile.percentage)"
              :width="62"
            ></el-progress>
          </div>
          <div class="content_mes">
            <div title="'+data[i]['name']+'">{{ upfile.name }}</div>
            <div></div>
          </div>
        </div>
        <div
          class="video_option_content dir"
          v-for="dir in this.dirlist.dirs"
          :key="url + dir"
          @touchend="touchend(dir)"
          @dblclick="openDir(dir)"
        >
          <div
            class="content_top u-icon"
            @mouseenter="enterdir($event, dir)"
            @mouseout="outdir"
          ></div>
          <div class="content_mes">
            <div title="'+data[i]['name']+'">{{ dir }}</div>
          </div>
        </div>
        <div
          class="video_option_content"
          v-for="file in this.dirlist.files"
          :key="url + file.name"
          v-show="value.value == 'all' || value.value == file.type"
          v-if="file.name != '' && file.name.match(newtitle) != null"
        >
          <div
            class="content_top"
            @mousedown.left="leftdown($event, file.name)"
          >
            <img
              :src="'//' + file.previewimage"
              alt=""
              height="100%"
              class="content_top_img "
              :class="dragclass"
              :data-src_from="'http://' + file.url"
              :data-src_type="file.type == 'image' ? '3' : '1'"
              :dat-src_id="'kljfl'"
            />
          </div>
          <div class="content_mes">
            <div>{{ file.name }}</div>
            <div>{{ formatDuration(file.time) }}</div>
          </div>
        </div>
        <div
          class="lefttip"
          v-if="this.tipobj.show"
          :style="{
            position: 'fixed',
            left: this.tipobj.x + 'px',
            top: this.tipobj.y + 'px'
          }"
        >
          <p
            :class="this.downrighttype != 'file' ? 'disable' : ''"
            @click="fuzhi"
          >
            复制
          </p>
          <p
            :class="
              this.downrighttype == 'file' || this.tipobj.copy == ''
                ? 'disable'
                : ''
            "
            @click="zhantie"
          >
            粘贴
          </p>
          <p
            :class="this.downrighttype == 'root' ? 'disable' : ''"
            @click="removefiles('')"
            v-if="false"
          >
            删除
          </p>
        </div>
      </div>
    </div>
    <div></div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data() {
    return {
      lasttime: 0,
      timer: null,
      tipobj: {
        x: 0,
        y: 0,
        show: false,
        copy: '',
        parse: ''
      },
      dragclass: window.NCES.drag_ele,
      options: [
        {
          value: 'all',
          label: '全部'
        },
        {
          value: 'video',
          label: '视频'
        },
        {
          value: 'audio',
          label: '音频'
        },
        {
          value: 'image',
          label: '图片'
        },
        {
          value: 'other',
          label: '其他'
        }
      ],
      value: { value: 'all', label: '全部' },
      url: '',
      dirlist: {},
      actionurl: NCES.DOMAIN + '/upload',
      fileList: [],
      upList: [],
      title: '',
      downrightname: '',
      downrighttype: '',
      fuzhiname: '',
      fuzhitype: '',
      maxSize: 4 * 1024 * 1024 * 1024,
      maxText: '4GB',
      moveobj: '',
      toobj: '',
      ready: false,
      addname: false
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  created: function() {
    this.intoDir('')
  },
  computed: {
    ...mapState([]),
    newtitle() {
      return new RegExp(this.title, 'i')
    },
    loadingShow: function() {
      return this.startloading || this.onloading
    },
    dirarr: function() {
      return this.url.split('/')
    },
    nowdir: function() {
      return this.dirarr[this.dirarr.length - 1]
    }
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations([]),
    change(obj) {
      this.value.value = obj
    },
    numout(files, fileList) {
      //   this.$message({type:'error',message:'单次上传文件数量不能超过 10 个！',showClose:true,duration:1500});
      window.zindex = 0
      this.$alert('单次上传文件数量不能超过 10 个！', '提示消息', {
        confirmButtonText: '确定',
        callback: function() {
          window.zindex = 1
        }
      })
    },
    formatDuration(sec) {
      if (typeof sec === 'undefined') {
        return ''
      }
      let min = parseInt(sec / 60, 10)
      var sec = parseInt(sec % 60, 10)
      // sec = sec>9?sec:'0'+sec
      const hour = parseInt(min / 60, 10)
      min = min % 60

      return (
        (hour > 9 ? hour : '0' + hour) +
        ':' +
        (min > 9 ? min : '0' + min) +
        ':' +
        (sec > 9 ? sec : '0' + sec)
      )
    },
    createDir() {
      const that = this
      this.Post({
        type: 'lib',
        data: {
          cmd: 'add_dir',
          path: this.url + '文件夹' + (this.dirlist.dirs.length + 1) + '/'
        },
        success: function(res) {
          that.intoDir(that.url)
        }
      })
    },
    outdir() {
      this.toobj = ''
    },
    enterdir(e, toobj) {
      return
      this.toobj = toobj + '/'
    },
    leftdown(e, moveobj) {
      return
      const that = this
      this.moveobj = moveobj
      $(document).one('mouseup', function() {
        if (
          that.toobj !== '' &&
          that.moveobj !== '' &&
          that.toobj != that.moveobj + '/'
        ) {
          that.move('move', that.moveobj, that.toobj)
        } else {
          that.moveobj = ''
          that.toobj = ''
        }
      })
    },
    openDir(dir) {
      this.intoDir(this.url + dir + '/')
    },

    backDir(index) {
      const arr = this.url.split('/')
      let dir = ''
      if (index === '') {
        if (arr.length == 1) {
          return
        }
        for (var i = 0; i < arr.length - 2; i++) {
          dir += arr[i] + '/'
        }
      } else {
        for (var i = 0; i < index + 1; i++) {
          dir += arr[i] + '/'
        }
      }
      this.intoDir(dir)
    },
    intoDir(dir) {
      this.toobj = ''
      const that = this
      if (dir === '') {
        var data = { cmd: 'list' }
      } else {
        data = { cmd: 'list', path: dir }
      }
      this.url = dir
      this.Post({
        type: 'lib',
        data: data,
        success: function(res) {
          // console.log(res);
          that.dirlist = res.data
        }
      })
    },
    // touchstart(e,name,type){
    //     this.timer = setTimeout(function (){
    //         that.downright(e,name,type)
    //         that.timer = null
    //     },500)
    // },
    touchend(dir) {
      if (Date.now() - this.lasttime < 300) {
        this.openDir(dir)
      }
      this.lasttime = Date.now()
      // if(this.timer){
      //     clearTimeout(this.timer)
      //     this.timer = null
      // }
    },
    downright(e, name, type) {
      e.stopPropagation()
      if (e.touches) {
        e = e.touches[0]
      }
      this.tipobj.x = e.pageX
      this.tipobj.y = e.pageY
      this.tipobj.show = true
      if (name == '' || type == 'file') {
        this.downrightname = this.url + name
        if (type == 'file') {
          this.fuzhiname = name
        }
      } else {
        this.downrightname = this.url + name + '/'
      }
      this.downrighttype = type
    },
    removefiles() {
      if (this.downrighttype == 'root') {
        return
      }
      if (this.downrighttype == 'file') {
        var data = { cmd: 'del', path: this.downrightname }
      } else {
        data = { cmd: 'del', path: this.downrightname, bdir: true }
      }
      const that = this
      this.Post({
        type: 'lib',
        data: data,
        success: function(res) {
          that.intoDir(that.url)
          that.tipobj.show = false
          that.tipobj.copy = ''
        }
      })
    },
    fuzhi(e) {
      e.stopPropagation()
      if (this.downrighttype != 'file') {
        return
      }
      this.tipobj.copy = this.downrightname
      this.tipobj.show = false
    },
    zhantie(e) {
      e.stopPropagation()
      if (this.tipobj.copy == '' || this.downrighttype == 'file') {
        return
      }
      this.move('copy', this.tipobj.copy, this.downrightname)
    },
    move(type, moveobj, toobj) {
      const that = this
      this.Post({
        type: 'lib',
        data: { cmd: type, from: moveobj, to: toobj + this.fuzhiname },
        success: function() {
          that.moveobj = ''
          that.toobj = ''
          that.tipobj.show = false
          that.intoDir(that.url)
        }
      })
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.ready = false
      window.zindex = 1
    },
    cel() {
      const arr = []
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].status != 'ready') {
          arr.push(this.fileList[i])
        }
      }
      this.fileList = arr
      this.ready = false
      window.zindex = 1
    },
    celfile(uid) {
      const arr = []
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].uid != uid) {
          arr.push(this.fileList[i])
        }
      }
      this.fileList = arr
      if (arr.length == 0) {
        this.ready = false
        window.zindex = 1
      }
    },
    success(response, file, fileList) {
      this.intoDir(this.url)
    },
    updateStatus(event, file, fileList) {
      this.fileList = fileList
    },
    onchange(file, fileList) {
      // this.intoDir(this.url)
      if (file.status == 'ready') {
        this.fileList = fileList
        this.ready = true
        window.zindex = 0
      }
    },
    beforeAvatarUpload(file) {
      const isLt4G = file.size < this.maxSize
      const isSport = !!file.name.match(
        /(bmp|png|jpg|jpeg|mp3|wma|aac|flac|wav|mp4|m3u8|flv|avi|mkv|mov)$/gi
      )
      // if(isSport==null){
      //     isSport = false
      // }
      // isSport = false
      // if (!isLt4G) {
      //     this.$message({type:'error',message:'文件 '+file.name+' 内容超过'+this.maxText+',该文件上传失败！',showClose:true,duration:1500});
      // }
      // if(!isSport){
      //     this.$message({type:'error',message:'不支持文件 '+file.name+' 的文件格式!',showClose:true,duration:1500});
      // }
      return isLt4G && isSport
    }
  },
  mounted: function() {
    const that = this
    $(document).click(function() {
      that.tipobj.show = false
    })
    document.oncontextmenu = function() {
      /* 阻止浏览器默认弹框 */
      return false
    }
    $('.mydir-bottom-content').niceScroll({
      cursorcolor: '#AAAAAA',
      cursorborder: '1px solid #AAAAAA',
      enablekeyboard: false,
      horizrailenabled: false,
      enablescrollonselection: false
    })
    $('.upfilelist_content_select').niceScroll({
      cursorcolor: '#AAAAAA',
      cursorborder: '1px solid #AAAAAA',
      enablekeyboard: false,
      horizrailenabled: false,
      enablescrollonselection: false
    })
  }
}
</script>

<style scoped>
.mydirContent {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #232323;
}
.mydir-top {
  padding: 10px 5px;
  height: 30px;
  position: relative;
}
.mydir-bottom {
  height: calc(100% - 50px);
}
.mydir-bottom-content {
  height: calc(100% - 10px);
}
.mydir-bottom-title {
  height: 40px;
}

.el-progress__text {
  color: #e4e4e4;
}
.dir .content_top:hover {
  border: 1px solid #918732;
}
.dir .content_top {
  background-image: url(../../img/dir.png);
  background-size: auto 100%;
  box-sizing: border-box;
}
.lefttip {
  width: 50px;
  background-color: #1d1d1d;
  text-align: center;
  border: 1px solid #615959;
}
.lefttip p {
  margin: 8px 0;
}
.lefttip p.disable {
  cursor: no-allowed;
  color: #585252;
}
.upfilelist {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1010;
}
.upfilelist .upfilelist_content {
  position: absolute;
  width: 510px;
  height: 230px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #232323;
  font-size: 12px;
  overflow: hidden;
}
.upfilelist .content_title {
  height: 30px;
  line-height: 30px;
  background-color: #2e2e2e;
  text-align: center;
}
</style>
