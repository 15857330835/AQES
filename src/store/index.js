import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'

Vue.use(Vuex)

const state = {
  v: `v_1.226.12261651`, // 版本信息
  startloading: true, // 工程是否在加载中
  onloading: false,
  all: {}, // 工程所有的信息
  systemmessage: { player: { w: 1280, h: 720 } }, // 系统信息
  imglists: {},
  activechunk: {
    // 激活的视频块
    chunk: '',
    state: 'active'
    // index: undefined
  },
  activechunks: [], // 选中的视频块
  activeProperty: [],
  propertyNum: 0, //
  trackbox: {}, // 视频块有效区域
  trackposition: [], // 视频块轨道有效区域
  trackcaption: {}, // 字幕块有效区域
  sourceData: [], // 已经添加的源的数据
  showwhat: null, // [chunk,filter]值为chunk显示块的位置，值为filter显示滤镜的位置
  slidernum: {
    max: 30.1, // 最大比例
    min: 24.6, // 最小比例
    length: 100, // 缓冲区长度
    btnStep: 0.25 // 全览新增，为按钮点击倍率的变化步长
  },
  notify: {
    // 提醒关闭延时
    time: 2500
  },

  filtershow: 'normal', // 轨道块设置界面的显示方式
  mosaicKey: null, // 马赛克滤镜的key值
  clientwidth: 1920, // 浏览器有效区域的宽度
  fontlist: {}, // 字体分类的列表
  captionlist: {}, // 字母分类的列表
  boxset: '', // 打开的弹出框的类型
  openway: 'pc', // 打开的设备的终端
  changepos: false,
  speed: 1,
  filterlist: '', // 滤镜列表
  historyindex: 0, // 进入chunk设置界面时记录历史序列用于取消时撤回操作
  newchartbili: 1, // 裁剪框的宽高比  用于放大缩小时计算
  isAsyncSetchart: true, // 对裁剪框修改时是否同步数据
  scale: 0, // 动态文本宽高比
  refreshKey: 0, // 用于重新渲染轨道
  videoTipLocker: false, // 用于切换videoTip的跳动模式
  selectmzShow: true, // show the component selectmz?
  chunksetshow: false, // 轨道块设置界面是否显示
  captionsetshow: false,
  mydirshow: false,
  videooperShow: true, // 是否显示videooper
  exportVideoSetShow: false, // 是否显示ExportVideoSetShow这个组件
  trackBoxShow: true, // show the component trackBox?

  trackStart: 0, // the first frame of track when exports a video
  trackEnd: 0, // the last frame of track when exports a video

  Mrzydata: [], // 媒资面板的数据
  audioStatus: {
    isPlaying: false,
    src: ''
  }, // 媒资部分音乐的audio的状态

  captionStyle: null,
  allowHistoryBack: true,
  // libOpera:{
  //   RenameObj: null,
  //   zanTieType: "copy",
  //   fuzhitype:'',
  //   downrightname:'',
  //   downrighttype:'',
  //   fuzhiname:''
  // },
  MulSeleList: [],
  libpath: '',
  pastType: '',
  libsourcelist: {
    dirs: [],
    files: []
  },
  isMulControl: false,
  libloading: false,

  /* 多选begin */
  restActiveChunks: [],
  isMultiSelect: false,
  originMousePos: {
    x: 0,
    y: 0
  },
  activeChunkPos: {
    x: 0,
    y: 0
  },
  moveMousePos: {
    x: 0,
    y: 0
  },
  endMousePos: {
    x: 0,
    y: 0
  },
  delchunkposition: {},
  ghostsPosition: {},
  visTimerWidth: 0,
  moveListData: [],
  moveResultFlag: 0,
  moveListCount: 0,
  trackAbleWidth: 0,
  /* 多选end */

  /* 智能语音自选段begin */
  modalVoiceApplyIsShow: false,
  mzHeight: 0,
  isTrackSelect: false,
  modalContent: '',
  aiVoiceApplyStart: false,
  aiTrackPosition: [],
  aiChunksPosition: [],
  aiViewMaskIsShow: false,
  /* 智能语音自选段end */

  /* 字幕格式导出begin */
  isOutTypeShow: false,
  /* 字幕格式导出end */

  filterIndexMap: new Map([
    [1, 'video'],
    [2, 'text'],
    [3, 'img'],
    [4, 'audio']
  ]),
  sourceIndexMap: new Map([
    [1, 'video'],
    [2, 'text'],
    [3, 'img'],
    [0, 'audio']
  ]),
  chunkIndexMap: new Map([
    [1, 'video'],
    [3, 'text'],
    [4, 'img'],
    [2, 'audio']
  ])
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  getters
})
