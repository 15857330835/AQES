<template>
  <div class="mydirContent">
    <div class="mydir-top">
      <div class="search-box">
        <span class="directSearch">标题 :</span>
        <el-input v-model="title" class="input-search"></el-input>
      </div>

      <!-- <input type="text" v-model = "title" /> <span class = "search"></span> -->
      <!-- <div v-if="isToHis" style="display:inline-block;float:right;"
            @touchend="toHistory()"
      @click="toHistory()"><el-button slot="trigger" size="medium" type="text" icon="iconfont icon-fanhui" style="cursor:pointer;">返回</el-button></div>-->
      <div style="width:80px;float:right;">
        <el-select
          v-model="value.label"
          @change="change"
          size="mini"
          popper-class="dir-select"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div
        v-if="!isRecord"
        style="display:inline-block;float: right;margin-right:10px"
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
          <span>上传</span></button>-->
        </el-upload>
      </div>
      <div v-if="!isRecord" style="float:right;margin-right:10px;">
        <el-button type="text" icon="el-icon-printer" @click="createDir"
          >新建文件夹</el-button
        >
      </div>
    </div>
    <div class="mydir-bottom">
      <div class="mydir-bottom-title clearfix">
        <div style="float:left;margin-top:13px;padding-left:5px">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item>
              <span style="color:#e4e4e4;cursor:pointer;" @click="intoDir('')"
                >我的素材</span
              >
            </el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(value, index) in this.dirarr"
              :key="index"
              v-if="value != ''"
            >
              <span
                style="color:#e4e4e4;cursor:pointer;"
                @click="backDir(index)"
                >{{ value }}</span
              >
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div
        class="bscroll mydir-bottom-content"
        ref="bscroll"
        @contextmenu.prevent="downright($event, '', 'dirs')"
      >
        <div class="bscroll-container clearfix">
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
              <div>{{ upfile.name }}</div>
              <div></div>
            </div>
          </div>

          <div
            class="video_option_content dir"
            v-for="dir in this.dirlist.dirs"
            :key="url + dir"
            @touchend="touchend(dir)"
            @dblclick="openDir(dir)"
            @contextmenu.prevent="downright($event, dir, 'dir')"
            v-if="dir != '' && dir.match(newtitle) != null"
          >
            <div
              class="content_top u-icon"
              @click="imgClickedFn($event, dir, 'dir')"
              @mouseenter="enterdir($event, dir)"
              @mouseout="outdir"
            ></div>
            <div class="content_mes">
              <div>{{ dir }}</div>
              <div style="display:none;">
                <input
                  style="background-color: #232323;
              padding: 1px;
              color: #fff;
              border: 1px solid #797979;
              width: 95%;"
                  @blur="submitRename($event, 'dir')"
                />
              </div>
            </div>
          </div>

          <div
            class="video_option_content file"
            v-for="file in this.dirlist.files"
            :key="url + file.name"
            v-show="value.value == 'all' || value.value == file.type"
            v-if="file.name != '' && file.name.match(newtitle) != null"
            @contextmenu.prevent="downright($event, file.name, 'file')"
          >
            <div
              class="content_top"
              @mousedown.left="leftdown($event, file.name)"
              @click="imgClickedFn($event, file.name, 'file')"
              @mouseenter="isImageDelDivHandle($event, 'block')"
              @mouseleave="isImageDelDivHandle($event, 'none')"
            >
              <div
                style="background:red;width:18px;height:20px;line-height: 20px;position: absolute;right:0px;cursor:pointer;display:none;"
                @click="realRomveFile({ path: url + file.name })"
              >
                <i class="iconfont icon-shanchu-copy-copy" />
              </div>
              <img
                :src="'//' + file.previewimage"
                alt
                height="100%"
                class="content_top_img source-img"
                :class="[dragclass, { loaded: imgLoaded }]"
                :data-src_from="'http://' + file.url"
                :data-src_type="file.type == 'image' ? '3' : '1'"
                :data-src_id="'kljfl'"
                @load="handleImgLoad"
              />
            </div>
            <div class="content_mes">
              <div>{{ file.name }}</div>
              <div style="display:none;">
                <input
                  style="background-color: #232323;
              padding: 1px;
              color: #fff;
              border: 1px solid #797979;
              width: 95%;"
                  @blur="submitRename($event, 'file')"
                />
              </div>
              <div>{{ formatDuration(file.time) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="upfilelist" v-show="this.ready">
      <div class="upfilelist_content">
        <div class="content_title">上传文件列表</div>
        <div
          class="content_select upfilelist_content_select bscroll"
          style="height:170px"
          ref="fileBscroll"
        >
          <div class="bscroll-container">
            <p style="color:#6d6a6a;text-align:center">
              红色文件不可上传，格式或大小不支持！
            </p>
            <p
              v-for="(readyfile, index) in this.fileList"
              :key="index"
              v-if="readyfile.status == 'ready'"
              :style="{ color: beforeAvatarUpload(readyfile) ? '' : 'red' }"
              class="upfilelist-item"
            >
              {{ readyfile.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                (readyfile.size / 1024 / 1024).toFixed(2) + 'MB'
              }}
              <i
                class="el-icon-close"
                style="float:right;cursor: pointer;"
                @click="celfile(readyfile.uid)"
              ></i>
            </p>
          </div>
        </div>
        <div class="content_click">
          <span class="content_click_make" @click="submitUpload">确认</span>
          <span class="content_click_cancel" @click="cel">取消</span>
        </div>
      </div>
    </div>
    <div class="upfilelist" v-show="newDirDialog">
      <div class="newDir_content">
        <div class="content_title">新建文件夹</div>
        <div class="upfilelist-item" style="height:70px">
          <span>名称：</span>
          <el-input v-model="newDirName" class="input-item"></el-input>
        </div>
        <div class="content_click">
          <span class="content_click_make" @click="submitMkDir">确认</span>
          <span class="content_click_cancel" @click="celMkDir">取消</span>
        </div>
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
        :class="
          downrightname.split('/').slice(-1)[0] === '录音' ||
          this.downrighttype != 'file'
            ? 'disable'
            : ''
        "
        @click="fuzhi($event, 'copy')"
      >
        复制
      </p>
      <p
        :class="
          downrightname.split('/').slice(-1)[0] === '录音' ||
          (this.downrighttype != 'file' && this.downrighttype != 'dir')
            ? 'disable'
            : ''
        "
        @click="fuzhi($event, 'move')"
      >
        剪切
      </p>
      <p
        :class="
          downrightname.split('/').slice(-1)[0] === '录音' ||
          downrightname.split('/').slice(-2)[0] === '录音' ||
          this.tipobj.copy == ''
            ? 'disable'
            : ''
        "
        @click="zhantie"
      >
        粘贴
      </p>
      <p
        :class="
          this.downrighttype == 'root' || this.downrighttype == 'dirs'
            ? 'disable'
            : ''
        "
        @click="removefiles('')"
      >
        删除
      </p>
      <p
        :class="
          (downrightname.split('/').slice(-1)[0] === '录音' &&
            this.downrighttype === 'dir') ||
          this.downrighttype == 'dirs'
            ? 'disable'
            : ''
        "
        @click="Rename()"
      >
        重命名
      </p>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex';
// import systemmes from './model/Systemmes'
import * as api from '@/api/Lib';
import BScroll from 'better-scroll';
export default {
  data() {
    return {
      imgLoaded: false,
      imgClicked: true,
      lasttime: 0,
      timer: null,
      tipobj: {
        x: 0,
        y: 0,
        show: false,
        copy: '',
        parse: ''
      },
      dragclass: NCES.drag_ele,
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

      maxSize: 4 * 1024 * 1024 * 1024,
      maxText: '4GB',
      moveobj: '',
      toobj: '',
      ready: false,
      addname: false,
      newDirDialog: false,
      isRecord: false,

      newDirName: '',
      NewFileName: '',
      libOpera: {
        RenameObj: null,
        zanTieType: 'copy',
        fuzhitype: ''
        // downrightname:'',
        // downrighttype:'',
        // fuzhiname:''
      },
      // RenameObj: null,
      // zanTieType: "copy",
      // fuzhitype:'',
      downrightname: '',
      downrighttype: '',
      fuzhiname: '',
      // MulSeleList:[],
      // isToHis:false
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  created: function() {
    this.intoDir('');
  },
  computed: {
    ...mapState(['MulSeleList','isMulControl']),
    newtitle() {
      return new RegExp(this.title, 'i');
    },
    loadingShow: function() {
      return this.startloading || this.onloading
    },
    dirarr: function() {
      return this.url.split('/');
    },
    nowdir: function() {
      return this.dirarr[this.dirarr.length - 1]
    }
  },
  methods: {
    ...mapActions(['Post']),
    ...mapMutations(['ACTIVE_CHUNK','SET_MUL_SELE_LIST']),
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
      if (sec === undefined) {
        return '';
      }
      let min = parseInt(sec / 60)
      var sec = parseInt(sec % 60)
      // sec = sec>9?sec:'0'+sec
      let hour = parseInt(min / 60)
      min = min % 60

      return (
        (hour > 9 ? hour : '0' + hour) +
        ':' +
        (min > 9 ? min : '0' + min) +
        ':' +
        (sec > 9 ? sec : '0' + sec)
      )
    },
    outdir() {
      this.toobj = '';
    },
    enterdir(e, toobj) {
      // return;
      if (toobj === '录音') return;
      this.toobj = this.url + toobj + '/';
    },
    leftdown(e, moveobj) {
      // return;
      let that = this
      this.moveobj = moveobj
      this.libOpera.fuzhitype = 'file'
      const time = new Date().getTime()
      $(e.currentTarget).one('mouseup', function() {
        if (
          that.toobj !== '' &&
          that.moveobj !== '' &&
          that.toobj != that.moveobj + '/' &&
          time - new Date().getTime() >= 1000
        ) {
          that.move('move', that.url + that.moveobj, that.toobj, moveobj);
        } else {
          that.moveobj = '';
          that.toobj = '';
        }
      })
    },
    openDir(dir) {
      // this.isToHis = true
      this.isRecord = dir === '录音';
      this.intoDir(this.url + dir + '/');
    },
    toHistory() {
      //  this.isToHis = false
      this.intoDir('');
    },
    backDir(index) {
      let arr = this.url.split('/');
      let dir = '';
      if (index === '') {
        if (arr.length == 1) {
          return
        }
        for (var i = 0; i < arr.length - 2; i++) {
          dir += arr[i] + '/';
        }
      } else {
        for (var i = 0; i < index + 1; i++) {
          dir += arr[i] + '/';
        }
      }
      this.isRecord = this.dirarr[index] === '录音';
      this.intoDir(dir)
    },
    async intoDir(dir) {
      this.toobj = '';
      // var that = this;
      this.SET_MUL_SELE_LIST({ obj: {}, type: 'clear' })
      // this.MulSeleList = []
      let data = {}
      if (dir == '') {
        // var data = { cmd: "list" };
        this.isRecord = false
      } else {
        data = { path: dir }
      }
      this.url = dir
      // this.Post({
      //   type: "lib",
      //   data: data,
      //   success: function(res) {
      //     // console.log(res);
      //     that.dirlist = res.data;
      //   }
      // });
      const res = await api.libListApi(data)
      if (res.code === 0) {
        this.dirlist = res.data
      }
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
      this.tipobj.show = false
      this.libOpera.RenameObj = e.currentTarget
      if (e.touches) {
        e = e.touches[0]
      }

      this.tipobj.x = e.pageX
      this.tipobj.y = e.pageY

      if (name == '' || type == 'file') {
        this.downrightname = this.url + name
        if (type == 'file') {
          this.fuzhiname = name
        }
      } else if (type === 'dir' && name === '录音') {
        this.downrighttype = type
        this.downrightname = name
        return
      } else {
        this.downrightname = this.url + name + '/';
      }
      this.downrighttype = type
      //  console.log(this.downrighttype,this.downrightname)
      this.tipobj.show = true
    },
    removefiles() {
      if (this.downrighttype == 'root') {
        return
      }
      let data = {},
        bdir = false
      if (this.downrighttype == 'file') {
        data = { path: this.downrightname }

        this.realRomveFile(data, false)
      } else {
        data = {
          path: this.downrightname /* .slice(0,this.downrightname.length-1) */
        }
        bdir = true
      }
      // var that = this;
      // this.Post({
      //   type: "lib",
      //   data: data,
      //   success: function(res) {
      //     that.intoDir(that.url);
      //     that.tipobj.show = false;
      //     that.tipobj.copy = "";
      //   }
      // });
      this.realRomveFile(data, bdir)
    },

    async realRomveFile(data, bdir) {
      let res = {}
      if (bdir) {
        res = await api.libDelDirApi(data)
      } else {
        res = await api.libDelApi(data)
      }

      if (res.code === 0) {
        this.intoDir(this.url)
        this.tipobj.show = false
        this.tipobj.copy = '';
      }
    },
    fuzhi(e, opreaType) {
      e.stopPropagation()
      // if (this.downrighttype != "file") {
      //   return;
      // }
      this.tipobj.copy = this.downrightname
      this.tipobj.show = false
      this.libOpera.zanTieType = opreaType
      this.libOpera.fuzhitype = this.downrighttype
    },
    zhantie(e) {
      e.stopPropagation()
      if (this.tipobj.copy == '' /*  || this.downrighttype == "file" */) {
        return
      }
      switch (this.libOpera.zanTieType) {
        case 'move':
          this.move(
            'move',
            this.tipobj.copy,
            this.downrightname,
            this.tipobj.copy.split('/').slice(-1)[0]
          )
          // this.move("move", "xzl/testmovedir", this.downrightname,'testmovedir');
          break
        case 'copy':
          this.move(
            'copy',
            this.tipobj.copy,
            this.downrightname,
            this.fuzhiname
          )
          break
      }
    },
    Rename() {
      // console.log(this.libOpera.RenameObj)
      const NewFileName = this.libOpera.RenameObj.querySelectorAll('.content_mes>div')[0]
      )[0].innerText
      this.libOpera.RenameObj.querySelectorAll('.content_mes>div')[0].style.display =
        'none';
      this.libOpera.RenameObj.querySelectorAll('.content_mes>div')[1].style.display =
        'block';
      this.libOpera.RenameObj.querySelectorAll(
        '.content_mes input'
      )[0].value = NewFileName
      // $(document).click(()=>{
      //   this.libOpera.RenameObj.querySelectorAll(".content_mes>div")[1].style.display = "none"
      //   this.libOpera.RenameObj.querySelectorAll(".content_mes>div")[0].style.display = "block"
      //   this.libOpera.RenameObj.querySelectorAll(".content_mes input")[0].value = ""
      // })

      // this.toobj = "";
      // this.tipobj.show = false;
      // this.intoDir(this.url);
      this.NewFileName = NewFileName
    },
    submitRename(e, type) {
      this.moveobj = this.url + this.NewFileName
      const NewFileName = this.libOpera.RenameObj.querySelectorAll('.content_mes input')[0]
      )[0].value
      this.toobj = this.url
      if (type == 'dir'){
        this.moveobj += '/'
        // this.toobj = this.toobj+"/"+NewFileName+"/"
        // NewFileName = ""
      }

      this.move('move', this.moveobj, this.toobj, NewFileName, () => {
        this.libOpera.RenameObj.querySelectorAll('.content_mes>div')[1].style.display =
          'none';
        this.libOpera.RenameObj.querySelectorAll('.content_mes>div')[0].style.display =
          'block';
        this.libOpera.RenameObj.querySelectorAll('.content_mes input')[0].value = '';
      })
    },
    async move(type, moveobj, toobj, filename, callback) {
      let res = {}

      if (this.libOpera.fuzhitype === 'dir') {
        if (filename === ''){
          filename = moveobj.split('/').slice(-2)[0];
        }
        switch (type) {
          case 'copy':
            // res = await api.libCopyApi({ from: moveobj, to: toobj + filename });
            break
          case 'move':
            res = await api.libMoveDirApi({
              from: moveobj,
              to: toobj + filename + '/'
            })
            break
        }
      } else {
        switch (type) {
          case 'copy':
            res = await api.libCopyApi({ from: moveobj, to: toobj + filename })
            break
          case 'move':
            res = await api.libMoveApi({ from: moveobj, to: toobj + filename })
            break
        }
      }

      if (res.code === 0) {
        this.moveobj = '';
        this.toobj = '';
        this.tipobj.show = false
        this.intoDir(this.url)
        callback && callback()
      }
      // var that = this;
      // this.Post({
      //   type: "lib",
      //   data: { cmd: type, from: moveobj, to: toobj + this.fuzhiname },
      //   success: function() {
      //     that.moveobj = "";
      //     that.toobj = "";
      //     that.tipobj.show = false;
      //     that.intoDir(that.url);
      //   }
      // });
    },
    createDir() {
      this.newDirDialog = true
      window.zindex = 0
    },
    submitMkDir() {
      let that = this
      this.newDirDialog = false
      this.Post({
        type: 'lib',
        data: {
          cmd: 'add_dir',
          path: this.url + this.newDirName + '/' // "文件夹" + (this.dirlist.dirs.length + 1) + "/"
        },
        success: function(res) {
          that.intoDir(that.url)
        }
      })
      window.zindex = 1
    },
    celMkDir() {
      this.newDirDialog = false
      window.zindex = 1
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.ready = false
      window.zindex = 1
    },
    cel() {
      let arr = []
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
      let arr = []
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
      this.fileList = []
    },
    updateStatus(event, file, fileList) {
      this.fileList = fileList
      // console.log({fileList});
    },
    onchange(file, fileList) {
      // this.intoDir(this.url)
      if (file.status == 'ready') {
        this.fileList = fileList
        // console.log({fileList: this.fileList});
        this.ready = true
        window.zindex = 0
      }
    },
    beforeAvatarUpload(file) {
      const isLt4G = file.size < this.maxSize
      let isSport = !!file.name.match(
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
    },
    handleImgLoad() {
      this.imgLoaded = true
    },
    imgClickedFn(e, name, type) {
      this.ACTIVE_CHUNK({ state: '', index: 0 })
      let lib = {}
      /* if(!this.isMulControl){
        let clickList = document.querySelectorAll(".bscroll-container .clicked")
        if(clickList.length > 0){
            // for(let index in clickList){
              // if(clickList[index] !== e.currentTarget){
              //   // $(clickList[index]).removeClass("clicked")
              // }
              // console.log(clickList[index])
          // }
          clickList.forEach(ele=>{
            if(ele !== e.currentTarget){
                $(ele).removeClass("clicked")
              }
          })
        }
        
      } */
      if ($(e.currentTarget).hasClass('clicked')) {
        $(e.currentTarget).removeClass('clicked')

        // window.zindex = 1;
        // this.MulSeleList = this.MulSeleList.filter((item)=>{
        //   return item.url+item.name !== this.url+name
        // })
        lib = {
          url: this.url,
          name: name,
          type: type
        }
        this.SET_MUL_SELE_LIST({ obj: lib, type: 'pop' })
      } else {
        window.zindex = 3
        $(e.currentTarget).addClass('clicked')
        lib = {
          url: this.url,
          name: name,
          type: type
        }
        // this.MulSeleList.push(lib)
        this.SET_MUL_SELE_LIST({ obj: lib, type: 'add' })
      }
      console.log(this.MulSeleList)
    },
    isImageDelDivHandle(e, hide) {
      e.currentTarget.firstChild.style.display = hide
    }
  },
  mounted: function() {
    let that = this
    $(document).click(function() {
      that.tipobj.show = false
    })
    document.oncontextmenu = function() {
      /* 阻止浏览器默认弹框 */
      return false
    }
    this.$nextTick(() => {
      const bscrollDom = this.$refs.bscroll
      this.aBScroll = new BScroll(bscrollDom, {
        mouseWheel: true,
        click: true,
        tap: true,
        scrollbar: {
          fade: true,
          interactive: true
        }
      })

      const fileBscrollDom = this.$refs.fileBscroll
      this.fileBscroll = new BScroll(fileBscrollDom, {
        mouseWheel: true,
        click: true,
        tap: true,
        scrollbar: {
          fade: true,
          interactive: false
        }
      })
    })
  }
}
</script>

<style lang="scss">
.mydirContent {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: #232323;

  .search-box {
    display: inline-block;
    width: auto;
    // padding: 0 18px;
    // line-height: 50px;
    .directSearch {
      margin-right: 10px;
    }
    .input-search {
      display: inline-block;
      width: auto;
      input {
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
        width: 120px;
      }
    }
  }

  .mydir-top {
    padding: 0 18px;
    line-height: 50px;
    position: relative;
  }
  .mydir-bottom {
    height: calc(100% - 50px);
  }
  .mydir-bottom-content {
    height: calc(100% - 50px);
    overflow-y: hidden;
    position: relative;
    .bscroll-indicator {
      background-color: rgb(170, 170, 170) !important;
      border: none !important;
      .content_mes {
        .input-search {
          background-color: #232323;
          padding: 1px;
          border: 1px solid #797979;
          width: 95%;
          // display: inline-block;
          // width: auto;
          // box-sizing: border-box;
          // text-align: center;
          // font-size: 12px;
          // height: 20px;
          // border: 1px solid #686868;
          // color: #e4e4e4;
          // -web-kit-appearance: none;
          // -moz-appearance: none;
          // display: inline-block;
          // outline: 0;
          // padding: 0 1em;
          // text-decoration: none;
          // border-radius: 8px;
          // background-color: #1c1c1c;
          // width: 120px;
        }
      }
    }
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
    background-image: url(../../../img/dir.png);
    background-size: auto 100%;
    box-sizing: border-box;
  }
  .file,
  .dir {
    .content_top {
      padding: 1px;
    }
    .clicked {
      padding: 0px;
      border: 1px solid red;
    }
  }
  .lefttip {
    width: 50px;
    background-color: #1d1d1d;
    text-align: center;
    border: 1px solid #615959;
  }
  .lefttip p {
    margin: 8px 0;
    cursor: pointer;
    &:hover {
      background-color: #2e2e2e;
    }
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
    .upfilelist-item {
      width: 400px;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 20px;
      .input-item {
        display: inline-block;
        width: auto;
        input {
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
          width: 120px;
        }
      }
    }
    .content_title {
      height: 30px;
      line-height: 30px;
      background-color: #2e2e2e;
      text-align: center;
    }
    .upfilelist_content_select {
      position: relative;
      overflow-y: hidden;
      .bscroll-indicator {
        background-color: rgb(170, 170, 170) !important;
        border: none !important;
      }
    }
  }
  .upfilelist .newDir_content {
    position: absolute;
    width: 510px;
    // height: 230px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #232323;
    font-size: 12px;
    overflow: hidden;
    .upfilelist-item {
      width: 400px;
      margin: auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      line-height: 20px;
      .input-item {
        display: inline-block;
        width: auto;
        input {
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
          width: 345px;
        }
      }
    }
    .content_title {
      height: 30px;
      line-height: 30px;
      background-color: #2e2e2e;
      text-align: center;
    }
  }
}
.dir-select {
  .el-input__inner,
  .el-select-dropdown {
    background-color: #232323; /* #1d1d1d; */
    // border: 0px solid #636363 !important;
    font-size: 14px !important;
    color: rgb(170, 170, 170);
  }
  .el-select .el-input__inner:focus,
  .el-select .el-input__inner:hover {
    border-color: #636363;
  }
  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background-color: #1d1d1d;
    span {
      color: #049eff;
    }
  }
}
.source-img {
  opacity: 0;
  transition: opacity 0.5s ease;
}
.source-img.loaded {
  opacity: 1;
}
</style>
