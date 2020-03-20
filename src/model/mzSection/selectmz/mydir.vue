<template>
  <div class="mydirContent">
    <div class="mydir-top">
      <div class="search-box">
        <span class="direct-search">标题</span>
        <el-input
          v-model="title"
          class="input-search"
          @focus="titlefocusHandle"
          @blur="titleblurHandle"
        ></el-input>
      </div>

      <!-- <input type="text" v-model = "title" /> <span class = "search"></span> -->
      <!-- <div v-if="isToHis" style="display:inline-block;float:right;"
            @touchend="toHistory()"
      @click="toHistory()"><el-button slot="trigger" size="medium" type="text" icon="iconfont icon-fanhui" style="cursor:pointer;">返回</el-button></div>-->
      <div class="dir-set-box">
        <el-button
          v-if="!isRecord"
          class="create-dir"
          type="text"
          icon="el-icon-printer"
          @click="createDir"
          >新建文件夹</el-button
        >
        <el-upload
          v-if="!isRecord"
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
            @click="beforUpload"
            >上传</el-button
          >
          <!-- <button type="button" class="el-button el-button--text el-button--medium"
                    <i class="iconfont icon-shangchuan"></i>
          <span>上传</span></button>-->
        </el-upload>
        <el-select
          v-model="value.label"
          @change="change"
          size="mini"
          class="dir-select"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
              v-for="(value, index) in this.dirarr.filter(item => item !== '')"
              :key="index"
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
        ref="libbscroll"
        @contextmenu.prevent="downright($event, '', 'dirs', null)"
        @click="clearSelect"
        v-loading="libloading"
        element-loading-text="正在处理文件，请稍后......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(51, 51, 51, 0.75)"
      >
        <div class="bscroll-container clearfix">
          <div
            class="video_option_content"
            v-for="(upfile, index) in this.fileList.filter(item => {
              return item.percentage != 0 && item.percentage != 100
            })"
            :key="'upfile' + index"
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
            class="source-container"
            v-for="(dir, index) in this.dirlist.dirs.filter(item => {
              return item.name != '' && item.name.match(newtitle) != null
            })"
            :key="'dir' + index"
          >
            <div
              class="video_option_content dir"
              @touchend="touchend(dir.name)"
            >
              <div
                class="content_top u-icon"
                @click.stop="dirClickedFn($event, dir.name, 'dir', index)"
                @dblclick="openDir(dir.name)"
                :class="{ clicked: (dir.state & 1) === 1 }"
                @mouseenter="enterdir($event, dir.name)"
                @mouseout="outdir"
                @contextmenu.prevent="downright($event, dir.name, 'dir', index)"
              >
                <div
                  v-if="(dir.state & 2) === 2"
                  style=" width: 106px;
            height: 58.11px;
            background-color: #cccccc77;
            position: absolute;
            "
                ></div>
              </div>

              <div @click.stop="" class="content_mes">
                <div v-if="(dir.state & 4) !== 4" :title="dir.name">
                  {{ dir.name }}
                </div>
                <div v-else>
                  <!-- style="background-color: #232323;
                      padding: 1px;
                      color: #fff;
                      border: 1px solid #797979;
                      width: 95%;" -->
                  <el-input
                    v-model="dir.nameNoSuffix"
                    class="input-search"
                    @blur="renameBlurHandle('dir')"
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            class="source-container"
            v-for="(file, index) in this.dirlist.files.filter(item => {
              return item.name != '' && item.name.match(newtitle) != null
            })"
            :key="'file' + index"
          >
            <div
              class="video_option_content file"
              v-show="value.value == 'all' || value.value == file.type"
            >
              <div
                class="content_top"
                :class="{ clicked: (file.state & 1) === 1 }"
                @mousedown.left="leftdown($event, file.name)"
                @click.stop="clickedFn($event, file.name, 'file', index)"
                @mouseenter="isImageDelDivHandle($event, 'block')"
                @mouseleave="isImageDelDivHandle($event, 'none')"
                @contextmenu.prevent="
                  downright($event, file.name, 'file', index)
                "
              >
                <div
                  style="background:red;width:18px;height:20px;line-height: 20px;position: absolute;right:0px;cursor:pointer;display:none;"
                  @click.stop="realRomveFile(url + file.name, 'file', index)"
                >
                  <i class="iconfont icon-shanchu-copy-copy" />
                </div>
                <div
                  v-if="(file.state & 2) === 2"
                  style=" width: 106px;
            height: 62.11px;
            background-color: #cccccc77;
            position: absolute;
            "
                ></div>
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
              <div @click.stop="" class="content_mes">
                <div v-if="(file.state & 4) !== 4" :title="file.name">
                  {{ file.name }}
                </div>
                <div v-else>
                  <!-- style="background-color: #232323;
                           padding: 1px;
                           color: #fff;
                           border: 1px solid #797979;
                           width: 95%;" -->
                  <el-input
                    v-model="file.nameNoSuffix"
                    class="input-search"
                    @blur="renameBlurHandle('file')"
                  />
                </div>
                <div>{{ formatDuration(file.time) }}</div>
              </div>
            </div>
          </div>

          <div
            class="source-container fake-container"
            v-for="(item, index) in fakeData"
            :key="'fake' + index"
          ></div>
          <div class="loading" v-show="loadingShow">
            <div class="loading-item"></div>
            <div class="loading-item"></div>
            <div class="loading-item"></div>
            <div class="loading-item"></div>
            <div class="loading-item"></div>
          </div>
          <div
            v-show="noDataShow"
            style="text-align: center; width: 100%;padding: 10px;box-sizing: border-box;"
          >
            暂无数据
          </div>
          <div style="clear: both"></div>
        </div>
      </div>
    </div>
    <div class="upfilelist" v-show="this.ready">
      <div class="upfilelist_content">
        <div class="content_title">上传文件列表</div>
        <div
          class="content_select upfilelist_content_select bscroll"
          ref="fileBscroll"
        >
          <div class="bscroll-container">
            <p class="upload-info">
              红色文件不可上传，格式或大小不支持！
            </p>
            <p
              v-for="(readyfile, index) in this.fileList.filter(
                item => item.status == 'ready'
              )"
              :key="'readyfile' + index"
              :style="{ color: beforeAvatarUpload(readyfile) ? '' : 'red' }"
              class="upfilelist-item"
            >
              {{ readyfile.name }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                (readyfile.size / 1024 / 1024).toFixed(2) + 'MB'
              }}
              <i
                class="el-icon-close"
                style="float:right;cursor: pointer;"
                @click.stop="celfile(readyfile.uid)"
              ></i>
            </p>
          </div>
        </div>
        <div class="content_click">
          <span class="content_click_cancel" @click="cel">取消</span>
          <span class="content_click_make" @click="submitUpload">确认</span>
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
          <span class="content_click_cancel" @click="celMkDir">取消</span>
          <span class="content_click_make" @click="submitMkDir">确认</span>
        </div>
      </div>
    </div>
    <!--  (this.downrighttype !='file' && this.downrighttype !='dir') -->
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
          this.pastType !== '' ||
          this.MulSeleList.length === 0
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
          this.pastType !== '' ||
          this.MulSeleList.length == 0
            ? 'disable'
            : ''
        "
        @click="fuzhi($event, 'cut')"
      >
        剪切
      </p>
      <p
        :class="
          downrightname.split('/').slice(-1)[0] === '录音' ||
          downrightname.split('/').slice(-2)[0] === '录音' ||
          beforSwitchDir === url ||
          this.pastType === '' ||
          this.MulSeleList.length == 0
            ? 'disable'
            : ''
        "
        @click="zhantie"
      >
        粘贴
      </p>
      <p
        :class="
          downrightname.split('/').slice(-1)[0] === '录音' ||
          this.MulSeleList.length === 0 ||
          beforSwitchDir !== url
            ? 'disable'
            : ''
        "
        @click="removefiles()"
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
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'
import * as api from '@/api/Lib'
// import { uploadForm } from '@/api/Upload'
import BScroll from 'better-scroll'
export default {
  props: ['transPaneData'],
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
      // url: "",
      // dirlist: {},
      actionurl: window.NCES.DOMAIN + '/upload',
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
      oldFileName: '',
      downrightname: '',
      downrighttype: '',
      downrightIndex: null,
      fuzhiname: '',
      isSwitchDir: false, // 是否切换目录
      beforSwitchDir: '',
      page: 1,
      num: 20,
      // MulSeleList:[],
      // isToHis:false
      loadingShow: true,
      ctrlKey: false,
      simDbclickTime: 0,
      clctimer: null,
      uploadInde: 0,
      uploadFiles: null,
      // flex适应布局填充
      fakeData: [...new Array(9).keys()]
    }
  },
  //   components: {
  //   		systemmes,
  //   },
  watch: {
    transPaneData(newVal) {
      if (newVal) {
        // console.log(newVal, 'mydir')
        this.$nextTick(() => {
          this.aBScroll.refresh()
          // this.CHANGE_IS_REFRESH_PANES_BS(false)
        })
      }
    }
  },
  created() {
    this.intoDir('')
  },
  computed: {
    ...mapState([
      'MulSeleList',
      'isMulControl',
      'libsourcelist',
      'pastType',
      'libloading',
      'libpath',
      'isRefreshPanesBS'
    ]),
    newtitle() {
      return new RegExp(this.title, 'i')
    },
    dirlist: {
      get() {
        return this.libsourcelist
      },
      set(data) {
        this.$store.state.libsourcelist = data
      }
    },
    url: {
      get() {
        return this.libpath
      },
      set(str) {
        this.$store.state.libpath = str
      }
    },
    dirarr() {
      return this.url.split('/')
    },
    nowdir() {
      return this.dirarr[this.dirarr.length - 1]
    },
    noDataShow() {
      return (
        this.dirlist.files.length +
          this.dirlist.dirs.length +
          this.fileList.length ===
        0
      )
    }
  },
  methods: {
    ...mapActions([
      'Post',
      'getDirList',
      'libRemove',
      'reallibCut',
      'reallibCopy',
      'msgbox',
      'changeLoading'
    ]),
    ...mapMutations([
      'ACTIVE_CHUNK',
      'SET_MUL_SELE_LIST',
      'SET_LIB_PATH',
      'SET_PAST_TYPE',
      'SET_LIB_LOADING',
      'CHANGE_IS_REFRESH_PANES_BS'
    ]),
    change(obj) {
      this.value.value = obj
    },
    titlefocusHandle() {
      window.zindex = 2
    },
    titleblurHandle() {
      window.zindex = 1
    },
    numout(files, fileList) {
      window.zindex = 4
      this.$alert('单次上传文件数量不能超过 10 个！', '提示消息', {
        confirmButtonText: '确定',
        callback() {
          window.zindex = 1
        }
      })
    },
    formatDuration(secs) {
      if (typeof secs === 'undefined') {
        return ''
      }
      let min = parseInt(secs / 60, 10)
      const sec = parseInt(secs % 60, 10)
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
    outdir() {
      this.toobj = ''
    },
    enterdir(e, toobj) {
      // return;
      if (toobj === '录音') return
      this.toobj = this.url + toobj + '/'
    },

    openDir(dir) {
      // this.isToHis = true
      clearTimeout(this.clctimer)
      this.isRecord = dir === '录音'
      this.intoDir(this.url + dir + '/')
    },
    toHistory() {
      //  this.isToHis = false
      this.intoDir('')
    },
    backDir(index) {
      const arr = this.url.split('/')
      let dir = ''
      if (index === '') {
        if (arr.length === 1) {
          return
        }
        for (let i = 0; i < arr.length - 2; i++) {
          dir += arr[i] + '/'
        }
      } else {
        for (let i = 0; i < index + 1; i++) {
          dir += arr[i] + '/'
        }
      }
      this.isRecord = this.dirarr[index] === '录音'
      this.intoDir(dir)
    },
    async intoDir(dir) {
      if (dir === '') this.isRecord = false
      this.toobj = ''
      if (this.pastType === '') {
        this.SET_MUL_SELE_LIST({ path: '', type: 'clear' })
      }

      this.url = dir
      this.SET_LIB_PATH(this.url)
      this.isSwitchDir = true

      this.page = 1
      this.loadingShow = true
      this.getDirList({
        index: this.page,
        number: this.num,
        callback: res => {
          // this.loadingShow = false
          this.loadingShow = res.data.files.length === this.num
          this.tipobj.show = false
        }
      })
    },
    fetchMore() {
      this.getDirList({
        index: ++this.page,
        number: this.num,
        callback: res => {
          // this.loadingShow = false
          this.loadingShow = res.data.files.length === this.num
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
    },
    clearSelect() {
      if (!this.isSwitchDir) {
        this.SET_PAST_TYPE('')
        this.SET_MUL_SELE_LIST({ path: '', type: 'clear' })
      }
      if (
        this.downrightIndex !== null &&
        (this.dirlist[this.downrighttype + 's'][this.downrightIndex].state &
          4) ===
          4
      ) {
        this.submitRename(this.downrighttype)
      }
    },
    downright(e_para, name, type, index) {
      e_para.stopPropagation()
      let e = e_para
      this.tipobj.show = false
      this.downrightIndex = index
      if (e.touches) {
        e = e.touches[0]
      }

      this.tipobj.x = e.pageX
      this.tipobj.y = e.pageY

      if (name === '' || type === 'file') {
        this.downrightname = this.url + name
        if (type === 'file') {
          this.fuzhiname = name
        }
      } else if (type === 'dir' && name === '录音') {
        this.downrighttype = type
        this.downrightname = name
        return
      } else {
        this.downrightname = this.url + name + '/'
      }
      this.downrighttype = type
      //  console.log(this.downrighttype,this.downrightname)
      if (this.downrighttype !== 'root' && this.downrighttype !== 'dirs') {
        this.SET_PAST_TYPE('')
        this.SET_MUL_SELE_LIST({ path: '', type: 'clear' })

        this.SET_MUL_SELE_LIST({ path: this.downrightname, type: 'add' })
        const state = this.dirlist[this.downrighttype + 's'][
          this.downrightIndex
        ].state
        this.dirlist[this.downrighttype + 's'][this.downrightIndex].state =
          state ^ 1
        this.beforSwitchDir = this.url
      }

      this.tipobj.show = true
    },
    removefiles() {
      if (this.downrighttype === 'dirs') {
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
        this.realRomveFile(
          this.downrightname,
          this.downrighttype,
          this.downrightIndex
        )
      }
    },

    realRomveFile(name, type, index) {
      let text = '确定将选中素材删除么？被应用到的素材也将会被全部删除。'
      if (this.downrighttype === 'dir') {
        text = '确定将选中文件夹删除么，文件夹中的素材会被全部删除。'
      }
      this.SET_PAST_TYPE('')
      this.SET_MUL_SELE_LIST({ path: '', type: 'clear' })
      this.SET_MUL_SELE_LIST({ path: name, type: 'add' })
      this.dirlist[type + 's'][index].state =
        this.dirlist[type + 's'][index].state ^ 1
      this.msgbox({ text: text, handle: this.libRemove })
    },
    fuzhi(e, opreaType) {
      e.stopPropagation()
      this.tipobj.show = false
      this.isSwitchDir = false

      switch (opreaType) {
        case 'cut': {
          this.SET_PAST_TYPE('cut')
          if (this.downrighttype !== 'dirs') {
            const state = this.dirlist[this.downrighttype + 's'][
              this.downrightIndex
            ].state
            // eslint-disable-next-line no-self-compare
            if (state & (2 !== 2)) {
              this.dirlist[this.downrighttype + 's'][
                this.downrightIndex
              ].state = state ^ 2
            }
          }
          break
        }
        case 'copy': {
          this.SET_PAST_TYPE('copy')
          break
        }
        default: {
          console.log('no such operate')
        }
      }
    },
    leftdown(e, moveobj) {
      // return;
      this.isSwitchDir = false
      const that = this
      this.moveobj = moveobj
      const time = new Date().getTime()
      $(document).one('mouseup', function() {
        if (
          that.toobj !== '' &&
          that.moveobj !== '' &&
          that.toobj !== that.moveobj + '/' &&
          new Date().getTime() - time >= 1000
        ) {
          that.move('move', that.url + that.moveobj, that.toobj)
        } else {
          that.moveobj = ''
          that.toobj = ''
        }
      })
    },
    zhantie(e) {
      e.stopPropagation()
      switch (this.pastType) {
        case 'cut': {
          this.reallibCut()
          break
        }
        case 'copy': {
          this.reallibCopy()
          break
        }
        default: {
          console.log('no such operate')
        }
      }
      this.tipobj.show = false
    },
    async move(type, moveobj, toobj_para) {
      const toobj = toobj_para || '/'
      this.reallibCut({ path: moveobj, libpath: toobj })
      this.moveobj = ''
      this.toobj = ''
      this.tipobj.show = false
    },
    Rename() {
      window.zindex = 0
      const state = this.dirlist[this.downrighttype + 's'][this.downrightIndex]
        .state
      if ((state | 4) !== state) {
        this.dirlist[this.downrighttype + 's'][this.downrightIndex].state =
          state ^ 4
      }
      const that = this

      $(document).keydown(e => {
        if (e.key === 'Enter') {
          that.submitRename(that.downrighttype)
        }
      })
    },
    renameBlurHandle(type) {
      if (this.downrightIndex !== null) {
        this.submitRename(type)
      }
    },
    async submitRename(type) {
      if (this.downrightIndex === null) {
        return
      }
      let data
      const index = this.downrightIndex
      const state = this.dirlist[type + 's'][index].state
      if ((state | 4) === state) {
        this.dirlist[type + 's'][index].state = state ^ 4
      }
      if (type === 'dir') {
        data = {
          key: this.url + this.dirlist.dirs[index].name + '/',
          name: this.dirlist.dirs[index].nameNoSuffix
        }
      } else {
        data = {
          key: this.url + this.dirlist.files[index].name,
          name:
            this.dirlist.files[index].nameNoSuffix +
            this.dirlist.files[index].suffix
        }
      }
      this.downrightIndex = null
      const res = await api.libRenameApi(data)

      if (res.code !== 0) {
        console.log(res.msg)
      }
      window.zindex = 3
      this.changeLoading()
      this.intoDir(this.url)
    },

    createDir() {
      this.newDirDialog = true
      window.zindex = 4
    },
    async submitMkDir() {
      this.newDirDialog = false
      const res = await api.libAddDirApi({
        path: this.url + this.newDirName + '/'
      })
      if (res.code === 0) {
        this.intoDir(this.url)
      } else {
        console.log(res.msg)
      }
    },
    celMkDir() {
      this.newDirDialog = false
    },

    cel() {
      const arr = []
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].status !== 'ready') {
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
        if (this.fileList[i].uid !== uid) {
          arr.push(this.fileList[i])
        }
      }
      this.fileList = arr
      if (arr.length === 0) {
        this.ready = false
        window.zindex = 1
      }
    },
    submitUpload() {
      this.$refs.upload.submit()
      this.ready = false
      window.zindex = 1
    },
    success(response, file, fileList) {
      // setTimeout(()=>{
      this.intoDir(this.url)
      // },0)
    },
    updateStatus(event, file, fileList) {
      // console.log(fileList)
    },
    onchange(file, fileList) {
      this.fileList = fileList
      if (file.status === 'ready') {
        this.ready = true
        window.zindex = 4
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
    },
    beforUpload() {
      this.fileList = []
    },
    handleImgLoad() {
      this.imgLoaded = true
    },
    clickedFn(e, name, type, index) {
      this.tipobj.show = false
      this.isSwitchDir = false
      this.beforSwitchDir = this.url
      if (this.pastType !== '') {
        this.SET_PAST_TYPE('')
        this.SET_MUL_SELE_LIST({ path: '', type: 'clear' })
      }
      this.ACTIVE_CHUNK({ state: '', index: 0 })
      let path = this.url + name
      if (type === 'dir') {
        if (name === '录音') return
        path += '/'
      }
      window.zindex = 3
      const state = this.dirlist[type + 's'][index].state
      if (state & (state === 1)) {
        this.SET_MUL_SELE_LIST({ path: path, type: 'del' })
      } else {
        this.SET_MUL_SELE_LIST({ path: path, type: 'add' })
      }

      this.dirlist[type + 's'][index].state = state ^ 1
    },
    dirClickedFn(e, name, type, index) {
      clearTimeout(this.clctimer)
      this.clctimer = setTimeout(() => {
        this.clickedFn(e, name, type, index)
      }, 300)
    },
    isImageDelDivHandle(e, hide) {
      e.currentTarget.firstChild.style.display = hide
    }
  },
  mounted() {
    const that = this
    $(document).click(() => {
      that.tipobj.show = false
    })
    document.oncontextmenu = function() {
      /* 阻止浏览器默认弹框 */
      return false
    }
    this.$nextTick(() => {
      const bscrollDom = this.$refs.libbscroll
      this.aBScroll = new BScroll(bscrollDom, {
        mouseWheel: true,
        click: true,
        tap: true,
        scrollbar: {
          fade: true,
          interactive: true
        }
      })
      this.aBScroll.on('scrollEnd', function({ x, y }) {
        if (y <= that.aBScroll.maxScrollY) {
          // that.loadingShow = true
          setTimeout(() => {
            that.fetchMore()
          }, 800)
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

<style lang="scss" scoped>
.mydirContent {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  .mydir-top {
    padding: 0 0.2rem;
    height: 0.53rem;
    line-height: 0.53rem;
    background-color: #212931;
    display: flex;
    justify-content: space-between;
    .search-box {
      flex: 1;
      width: auto;
      display: flex;
      .direct-search {
        margin-right: 0.12rem;
      }
    }
    .dir-set-box {
      display: flex;
      .create-dir {
        background-color: transparent;
        border-color: transparent;
      }
      .upload-demo {
        margin: 0 0.2rem;
        .el-button {
          background-color: transparent;
          border-color: transparent;
        }
      }
      .dir-select {
        width: 1rem;
      }
    }
  }
  .mydir-bottom {
    .mydir-bottom-title {
      height: 40px;
    }
    .mydir-bottom-content {
      height: calc(100% - 50px);
      overflow-y: hidden;
      position: relative;
    }
  }
}
</style>
<style lang="scss">
.mydirContent {
  .mydir-top {
    .search-box {
      margin-right: 0.2rem;
      .input-search {
        flex: 1;
        max-width: 2rem;
        > input {
          width: 100%;
        }
      }
    }
  }
  .mydir-bottom {
    height: calc(100% - 50px);
    .el-icon-loading {
      &::before {
        content: '';
      }
      // animation: "";
      background: url(../../../img/libloading.png) 0 0 / 100% no-repeat;
      // width: 225px;
      height: 50px;
      width: 50px;
      margin-bottom: 10px;
    }
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
      border: 1px solid #ffffff05;
    }
    .clicked {
      padding: 1px;
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
    .upfilelist_content {
      .upfilelist_content_select {
        position: relative;
        overflow-y: hidden;
        height: 200px;
        margin-bottom: 15px;
        .upload-info {
          color: rgb(109, 106, 106);
          text-align: center;
          pointer-events: auto;
          width: 100%;
        }
      }
      .upfilelist-item {
        width: 400px;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 22px;
        font-size: 14px;
        .input-item {
          display: inline-block;
          width: auto;
          input {
            box-sizing: border-box;
            text-align: center;
            font-size: 12px;
            height: 20px;
            border: 1px solid #636a71;
            color: #e4e4e4;
            -webkit-appearance: none;
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
    }
    .newDir_content {
      .upfilelist-item {
        width: 400px;
        margin: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        line-height: 20px;
        font-size: 13px;
        .input-item {
          display: inline-block;
          width: auto;
          input {
            width: 345px;
            height: 20px;
            background-color: rgb(48, 56, 64);
            border: 1px solid rgb(99, 106, 113);
            border-radius: 3px;
            box-sizing: border-box;
            border: 1px solid #636a71;
            color: #e4e4e4;
            -webkit-appearance: none;
            -moz-appearance: none;
            display: inline-block;
            outline: 0;
            padding: 0 1em;
            text-decoration: none;
          }
        }
      }
    }
  }
}
</style>
