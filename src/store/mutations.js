import { TIP_HEIGHT_NUMBER } from '@/config'

/* chunkset抽取公共部分begin */
const CHANGE_POSITION = 'CHANGE_POSITION'
/* chunkset抽取公共部分end */

const CHANGE_LOADING = 'CHANGE_LOADING' // 改变loading状态
const IMG_LISTS = 'IMG_LISTS' // 图片列表
const UPDATE_POINTER = 'UPDATE_POINTER' // 更新播放状态和视频位置位置
const PROPERTY_OUTLEFT = 'PROPERTY_OUTLEFT' // 自定义属性outleft
const PROPERTY_RATIO = 'PROPERTY_RATIO' // 自定义属性outleft
const PROPERTY_XIFU = 'PROPERTY_XIFU' // 自定义属性outleft
const PROPERTY_FANWEI = 'PROPERTY_FANWEI' // 自定义属性fanwei
const UPDATE_TRACKS = 'UPDATE_TRACKS' //
const ACTIVE_CHUNK = 'ACTIVE_CHUNK' // 更新选中的轨道快
// const UPDATA_ACTIVECHUNK = 'UPDATA_ACTIVECHUNK' // 更新选中的轨道块的属性
const UPDATE_TRACK_MIX = 'UPDATE_TRACK_MIX'
const UPDATE_TRACKBOX = 'UPDATE_TRACKBOX' // 设置轨道区域的范围
const UPDATE_TRACKPOSITION = 'UPDATE_TRACKPOSITION' // 设置每个轨道的范围
const UPDATE_CAPTIONPOSITION = 'UPDATE_CAPTIONPOSITION' // 设置字幕轨道的范围
const SET_SOURCEDATA = 'SET_SOURCEDATA' // 设置源数据数组
const CHANGE_CHUNKSETSHOW = 'CHANGE_CHUNKSETSHOW' // 设置轨道块设置界面的显示隐藏
const CHANGE_CAPTIONSETSHOW = 'CHANGE_CAPTIONSETSHOW' // 设置轨道块设置界面的显示隐藏
const CHANGE_CLIENTWIDTH = 'CHANGE_CLIENTWIDTH' // 设置当前可是区域的宽度
const UPDATE_ACTIVEFILTER = 'UPDATE_ACTIVEFILTER' // 更新选中轨道块的内容
const CHANGE_FILTERSHOW = 'CHANGE_FILTERSHOW' // 视频上层路径显示框的显示状态
const SET_CHANGE_FILTERSHOW_KEY = 'SET_CHANGE_FILTERSHOW_KEY' // 设置马赛克滤镜的key
const CHANGE_ACTIVEPROPERTY = 'CHANGE_ACTIVEPROPERTY' // 改变选中块的property
const INIT_SYSTEMMESSAGE = 'INIT_SYSTEMMESSAGE' // 初始化系统数据
const CHANGE_PROPERTYNUM = 'CHANGE_PROPERTYNUM' // 记录选中的property的index
const INIT_FONTLIST = 'INIT_FONTLIST' // 初始化字体数据
const CHANGE_BOXSET = 'CHANGE_BOXSET' // 改变弹框
const GET_OPENWAY = 'GET_OPENWAY' // 获取打开的终端
const INIT_CAPTIONLIST = 'INIT_CAPTIONLIST' // 初始化字幕列表
const CHANGE_TRACK = 'CHANGE_TRACK' // 初始化字幕列表
const CHANGE_POS = 'CHANGE_POS' // 改变tipline 的状态
const INIT_FILTERLIST = 'INIT_FILTERLIST' // 设置滤镜列表
const SET_HISTORYINDEX = 'SET_HISTORYINDEX' // 设置chunk设置的历史记录序列
const CHANGE_MYDIRSHOW = 'CHANGE_MYDIRSHOW' // 自定义文件区域显示
const SET_NEWCHART_BILI = 'SET_NEWCHART_BILI' // 设置裁剪框的宽高比例
const SET_ASYNC_SET_CHART = 'SET_ASYNC_SET_CHART' // 设置对裁剪框修改时是否同步数据
const SET_SCALE = 'SET_SCALE' // 设置动态文本宽高比
const UPDATE_ACTIVE_PREVIEW_IMG = 'UPDATE_ACTIVE_PREVIEW_IMG' // 更新activechunk的图片
const UPDATE_SPEED = 'UPDATE_SPEED' // 更新音频视频设置中的暂存的speed参数,只在修改播放速率时有用
const UPDATE_POINTER_SPEED = 'UPDATE_POINTER_SPEED' // update parameter speed of the pointer
const UPDATE_POINTER_POSITION = 'UPDATE_POINTER_POSITION' // update parameter position of the pointer
const ADD_REFRESH_KEY = 'ADD_REFRESH_KEY' // add the refreshKey
const CHANGE_VIDEO_TIP_LOCKER = 'CHANGE_VIDEO_TIP_LOCKER' // change the moving state of video tip
const SET_MUL_SELE_LIST = 'SET_MUL_SELE_LIST'
const SET_MUL_CONTROL = 'SET_MUL_CONTROL'
const SET_LIB_PATH = 'SET_LIB_PATH'
const SET_PAST_TYPE = 'SET_PAST_TYPE'
const SET_DIR_LIST = 'SET_DIR_LIST'
const SET_LIB_LOADING = 'SET_LIB_LOADING'
/* 多选begin */
const CHANGE_ACTIVE_CHUNK = 'CHANGE_ACTIVE_CHUNK'
const CHANGE_REST_ACTIVE_CHUNKS = 'CHANGE_REST_ACTIVE_CHUNKS'
const CLEAR_REST_ACTIVE_CHUNKS = 'CLEAR_REST_ACTIVE_CHUNKS'
const DEL_REST_ACTIVE_CHUNKS = 'DEL_REST_ACTIVE_CHUNKS'
const CHANGE_IS_MULTI_SELECT = 'CHANGE_IS_MULTI_SELECT'
const CHANGE_ORIGIN_MOUSE_POS = 'CHANGE_ORIGIN_MOUSE_POS'
const CHANGE_ACTIVE_CHUNK_POS = 'CHANGE_ACTIVE_CHUNK_POS'
const CHANGE_MOVE_MOUSE_POS = 'CHANGE_MOVE_MOUSE_POS'
const CHANGE_END_MOUSE_POS = 'CHANGE_END_MOUSE_POS'
const EMPTY_ACTIVE_CHUNK = 'EMPTY_ACTIVE_CHUNK'
const POP_REST_ACTIVE_CHUNKS = 'POP_REST_ACTIVE_CHUNKS'
const CHANGE_VIS_TIMER_WIDTH = 'CHANGE_VIS_TIMER_WIDTH'
const CHANGE_MOVE_LIST_DATA = 'CHANGE_MOVE_LIST_DATA'
const CLEAR_MOVE_LIST_DATA = 'CLEAR_MOVE_LIST_DATA'
const CHANGE_MOVE_RESULT_FLAG = 'CHANGE_MOVE_RESULT_FLAG'
const CHANGE_MOVE_LIST_COUNT = 'CHANGE_MOVE_LIST_COUNT'
const CLEAR_MOVE_LIST_COUNT = 'CLEAR_MOVE_LIST_COUNT'
const UPDATE_CHUNK_POSITION = 'UPDATE_CHUNK_POSITION'
const UPDATE_SLIDER_NUM = 'UPDATE_SLIDER_NUM'
const INIT_CHUNKS = 'INIT_CHUNKS'
const CHANGE_TRACK_ABLE_WIDTH = 'CHANGE_TRACK_ABLE_WIDTH'
/* 多选end */

/* 智能语音自选段begin */
const CHANGE_MODAL_VOICE_APPLY_IS_SHOW = 'CHANGE_MODAL_VOICE_APPLY_IS_SHOW'
const CHANGE_MZ_HEIGHT = 'CHANGE_MZ_HEIGHT'
const CHANGE_IS_TRACK_SELECT = 'CHANGE_IS_TRACK_SELECT'
const CHANGE_MODAL_CONTENT = 'CHANGE_MODAL_CONTENT'
const CHANGE_AI_VOICE_APPLY_START = 'CHANGE_AI_VOICE_APPLY_START'
const UPDATE_AI_CHUNKS_POSITION = 'UPDATE_AI_CHUNKS_POSITION'
const CHANGE_AI_VIEW_MASK_IS_SHOW = 'CHANGE_AI_VIEW_MASK_IS_SHOW'
/* 智能语音自选段end */

/* 字幕格式导出begin */
const CHANGE_IS_OUT_TYPE_SHOW = 'CHANGE_IS_OUT_TYPE_SHOW'
/* 字幕格式导出end */

const CHANGE_IS_ADD_CAPTION = 'CHANGE_IS_ADD_CAPTION'

/* BS滚动begin */
const CHANGE_IS_REFRESH_TRACK_BOX_BS = 'CHANGE_IS_REFRESH_TRACK_BOX_BS'
const CHANGE_IS_REFRESH_CAPTION_SET_BS = 'CHANGE_IS_REFRESH_CAPTION_SET_BS'

// panes
const CHANGE_IS_REFRESH_PANES_BS = 'CHANGE_IS_REFRESH_PANES_BS'
// const CHANGE_IS_REFRESH_MEDIA_PANE_BS = 'CHANGE_IS_REFRESH_MEDIA_PANE_BS'
// const CHANGE_IS_REFRESH_MYDIR_PANE_BS = 'CHANGE_IS_REFRESH_MYDIR_PANE_BS'
// const CHANGE_IS_REFRESH_BASIC_PANE_BS = 'CHANGE_IS_REFRESH_BASIC_PANE_BS'
// const CHANGE_IS_REFRESH_CAPTION_PANE_BS = 'CHANGE_IS_REFRESH_CAPTION_PANE_BS'
// const CHANGE_IS_REFRESH_HISTORY_PANE_BS = 'CHANGE_IS_REFRESH_HISTORY_PANE_BS'
/* BS滚动end */

const CHANGE_TRANKEY_PRESS = 'CHANGE_TRANKEY_PRESS'

export default {
  [CHANGE_MYDIRSHOW](state, data) {
    state.mydirshow = data
  },
  [SET_HISTORYINDEX](state, data) {
    state.historyindex = data
  },
  [INIT_FILTERLIST](state, data) {
    state.filterlist = data
  },
  [UPDATE_POINTER](state, data) {
    state.all.pointer = data
  },
  [UPDATE_POINTER_SPEED](state, data) {
    state.all.pointer.speed = data
  },
  [UPDATE_POINTER_POSITION](state, data) {
    // console.log({pointer_pos: data});
    state.all.pointer.position = data
  },
  [CHANGE_TRACK](state, data) {
    if (data.type === 'caption') {
      state.all.caption.status = data.status
    } else {
      for (const key in data.status) {
        if (data.status.hasOwnProperty(key)) {
          state.all.tracks[data.type][data.index][key] = data.status[key]
        }
      }
    }
  },
  [CHANGE_POS](state, data) {
    state.changepos = data
  },
  [INIT_CAPTIONLIST](state, data) {
    state.captionlist = data
  },
  [GET_OPENWAY](state, data) {
    const sUserAgent = navigator.userAgent.toLowerCase()
    const bIsIpad = sUserAgent.match(/ipad/i) === 'ipad'
    const bIsIphoneOs = sUserAgent.match(/iphone os/i) === 'iphone os'
    const bIsMidp = sUserAgent.match(/midp/i) === 'midp'
    const bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) === 'rv:1.2.3.4'
    const bIsUc = sUserAgent.match(/ucweb/i) === 'ucweb'
    const bIsAndroid = sUserAgent.match(/android/i) === 'android'
    const bIsCE = sUserAgent.match(/windows ce/i) === 'windows ce'
    const bIsWM = sUserAgent.match(/windows mobile/i) === 'windows mobile'
    if (
      bIsIpad ||
      bIsIphoneOs ||
      bIsMidp ||
      bIsUc7 ||
      bIsUc ||
      bIsAndroid ||
      bIsCE ||
      bIsWM
    ) {
      if (bIsIpad || bIsIphoneOs) {
        state.openway = 'ios'
      } else {
        state.openway = 'android'
      }
    } else {
      state.openway = 'pc'
    }
  },
  [CHANGE_BOXSET](state, data) {
    if (data === '') {
      window.zindex = 1
    } else {
      window.zindex = 0
    }
    state.boxset = data
  },
  [INIT_FONTLIST](state, data) {
    state.fontlist = data
  },
  [CHANGE_CLIENTWIDTH](state, data) {
    state.clientwidth = data
  },
  [CHANGE_PROPERTYNUM](state, data) {
    state.propertyNum = data
  },
  [INIT_SYSTEMMESSAGE](state, data) {
    state.systemmessage = data
  },
  [CHANGE_FILTERSHOW](state, data) {
    state.filtershow = data
  },
  [SET_CHANGE_FILTERSHOW_KEY](state, data) {
    state.mosaicKey = data
  },
  [CHANGE_LOADING](state, data) {
    state.all = data
    state.startloading = false
  },
  [CHANGE_CHUNKSETSHOW](state, data) {
    if (data) {
      window.zindex = 2
    } else {
      window.zindex = 1
    }
    state.chunksetshow = data
  },
  [CHANGE_CAPTIONSETSHOW](state, data) {
    state.captionsetshow = data
  },
  [SET_SOURCEDATA](state, data) {
    state.sourceData = data
  },
  [UPDATE_TRACK_MIX](state) {
    // UPDATE_TRACKBOX
    const data = {}
    data.minX = $('.edit_track_contents').offset().left
    data.maxX = data.minX + $('.edit_track_contents').innerWidth()
    data.minY = $('#trackbox').offset().top
    data.maxY = $('#trackbox').innerHeight() + data.minY
    state.trackbox = data

    // UPDATE_TRACKPOSITION
    const tracklist = $('#trackbox .edit_track_content')
    const arr = []
    for (let i = 0, len = tracklist.length; i < len; i++) {
      arr.push({})
      arr[i].minX = $('.edit_track_contents').offset().left
      arr[i].maxX = arr[i].minX + $('.edit_track_contents').innerWidth()
      arr[i].minY = $(tracklist[i]).offset().top + $('#trackbox').scrollTop()
      arr[i].maxY = arr[i].minY + $(tracklist[i]).innerHeight()
      arr[i].id = tracklist[i].getAttribute('id')
      arr[i].type = parseInt(tracklist[i].getAttribute('track_type'), 10)
      arr[i].able = tracklist[i].getAttribute('able')
    }
    state.trackposition = arr
    setTimeout(() => {
      $('#edit_tip_line').height($('.nces_edit').height() + TIP_HEIGHT_NUMBER)
    }, 0)

    // UPDATE_CAPTIONPOSITION
    state.trackcaption.minX = $('.edit_track_contents').offset().left
    state.trackcaption.maxX =
      state.trackcaption.minX + $('.edit_track_contents').innerWidth()
    state.trackcaption.minY = tracklist.offset().top
    state.trackcaption.maxY = state.trackcaption.minY + tracklist.innerHeight()
  },
  [UPDATE_TRACKBOX](state) {
    const data = {}
    data.minX = $('.edit_track_contents').offset().left
    data.maxX = data.minX + $('.edit_track_contents').innerWidth()
    data.minY = $('#trackbox').offset().top
    data.maxY = $('#trackbox').innerHeight() + data.minY
    state.trackbox = data
  },
  [UPDATE_TRACKPOSITION](state, data) {
    if (data === 0) {
      return
    }
    const tracklist = $('#trackbox .edit_track_content')
    const arr = []
    for (let i = 0, len = tracklist.length; i < len; i++) {
      arr.push({})
      arr[i].minX = $('.edit_track_contents').offset().left
      arr[i].maxX = arr[i].minX + $('.edit_track_contents').innerWidth()
      arr[i].minY = $(tracklist[i]).offset().top + $('#trackbox').scrollTop()
      arr[i].maxY = arr[i].minY + $(tracklist[i]).innerHeight()
      arr[i].id = tracklist[i].getAttribute('id')
      arr[i].type = parseInt(tracklist[i].getAttribute('track_type'), 10)
      arr[i].able = tracklist[i].getAttribute('able')
    }
    state.trackposition = arr
    setTimeout(() => {
      $('#edit_tip_line').height($('.nces_edit').height() + TIP_HEIGHT_NUMBER)
    }, 0)
  },
  [UPDATE_CAPTIONPOSITION](state, data) {
    const tracklist = $('#captionbox .edit_track_content')
    state.trackcaption.minX = $('.edit_track_contents').offset().left
    state.trackcaption.maxX =
      state.trackcaption.minX + $('.edit_track_contents').innerWidth()
    state.trackcaption.minY = tracklist.offset().top
    state.trackcaption.maxY = state.trackcaption.minY + tracklist.innerHeight()
  },
  // eslint-disable-next-line complexity
  [ACTIVE_CHUNK](state, data) {
    if (typeof data.speed !== 'undefined') {
      state.activechunk.chunk.speed = data.speed
    }
    if (typeof data.index !== 'undefined') {
      state.activechunk.index = data.index
    } else {
      delete state.activechunk.index
    }

    if (typeof data.state !== 'undefined') {
      state.activechunk.state = data.state
      if (data.state !== '') {
        window.zindex = 1
      }
    }
    if (data.chunk) {
      if (typeof data.chunk.speed === 'undefined') {
        data.chunk.speed = 1
      }
      state.activechunk.chunk = data.chunk
      if (data.chunk.geometry === 'undefined') {
        return
      }
      let geo = data.chunk.geometry
      if (!geo || typeof geo !== 'string') return null
      geo = geo.replace(/\s+/g, '')
      const geo_arr = geo.split(';')
      if (!geo_arr || !geo_arr.length) return null
      const geo_res = []
      let last = null
      for (let i = 0; i < geo_arr.length; i++) {
        const g = geo_arr[i]
        if (!g) {
          console.warn('invalid geometry 0:' + geo)
          return null
        }
        const fg = g.split('=')
        const f = {}
        if (fg.length !== 2) {
          console.warn('invalid geometry 1:' + geo)
          return null
        }
        fg[0] = parseInt(fg[0], 10)
        if (!(fg[0] === parseInt(fg[0], 10))) {
          console.warn('invalid geometry 2:' + geo)
          return null
        }
        if (last && last >= fg[0]) {
          console.warn('invalid geometry 11:' + geo)
          return null
        }
        f.f = fg[0]
        const lt_wh_t = fg[1].split(':')
        if (!lt_wh_t || lt_wh_t.length !== 3) {
          console.warn('invalid geometry 3:' + geo)
          return null
        }
        const get_vt = function(v, bp) {
          if (
            typeof v === 'undefined' ||
            !v.length ||
            (bp && v.substr(v.length - 1) !== '%')
          ) {
            return null
          }
          const vt = parseFloat(v)
          if (isNaN(vt)) {
            return null
          }
          return vt
        }
        const lt = lt_wh_t[0].split('/')
        if (!lt || lt.length !== 2) {
          console.warn('invalid geometry 4:' + geo)
          return null
        }
        const l = get_vt(lt[0], true)
        if (typeof l === 'undefined') {
          console.warn('invalid geometry 5:' + geo)
          return null
        }
        f.left = l
        const t = get_vt(lt[1], true)
        if (typeof t === 'undefined') {
          console.warn('invalid geometry 6:' + geo)
          return null
        }
        f.top = t

        const wh = lt_wh_t[1].split('x')
        if (!wh || wh.length !== 2) {
          console.warn('invalid geometry 7:' + geo)
          return null
        }
        const w = get_vt(wh[0], true)
        if (typeof w === 'undefined') {
          console.warn('invalid geometry 8:' + geo)
          return null
        }
        f.w = w
        const h = get_vt(wh[1], true)
        if (typeof h === 'undefined') {
          console.warn('invalid geometry 9:' + geo)
          return null
        }
        f.h = h

        const tr = get_vt(lt_wh_t[2])
        if (!(parseFloat(t) === t) || tr > 100 || tr < 0) {
          console.warn('invalid geometry 10:' + geo)
          return null
        }
        f.transparency = tr
        last = f.f
        geo_res.push(f)
      }
      state.activeProperty = geo_res
    }
  },
  [CHANGE_ACTIVEPROPERTY](state, data) {
    state.activeProperty = data // todo 必要？
    const geo_arr = data
    let geo = ''
    for (let i = 0; i < geo_arr.length; i++) {
      const f = geo_arr[i]
      geo += `${f.f}=${f.left}%/${f.top}%:${f.w}%x${f.h}%:${f.transparency};`
    }
    state.activechunk.chunk.geometry = geo.substr(0, geo.length - 1)
  },
  [UPDATE_ACTIVE_PREVIEW_IMG](state, data) {
    state.activechunk.chunk.preview_img = data
  },
  [UPDATE_ACTIVEFILTER](state, data) {
    state.activechunk.chunk.filter = data
  },
  [UPDATE_TRACKS](state, data) {
    state.all.tracks.a_track_list = data.a_track_list
    state.all.tracks.v_track_list = data.v_track_list
  },
  [IMG_LISTS](state, data) {
    state.imglists = data
  },
  [PROPERTY_OUTLEFT](state, data) {
    state.all.track_property.outLeft = data
  },

  [PROPERTY_RATIO](state, data) {
    state.all.track_property.ratio = data
  },
  [PROPERTY_FANWEI](state, data) {
    state.all.track_property.fanwei = data
  },
  [PROPERTY_XIFU](state, data) {
    state.all.track_property.xifuFlag = data
  },
  [SET_NEWCHART_BILI](state, bili) {
    state.newchartbili = bili
  },
  [SET_ASYNC_SET_CHART](state, bool) {
    state.isAsyncSetchart = bool
  },
  [SET_SCALE](state, val) {
    state.scale = val
  },
  [UPDATE_SPEED](state, val) {
    state.speed = val
  },
  [ADD_REFRESH_KEY](state, val) {
    state.refreshKey++
  },
  [CHANGE_VIDEO_TIP_LOCKER](state, val) {
    state.videoTipLocker = val
  },
  CHANGE_VIDEOOPER_SHOW(state, val) {
    state.videooperShow = val
  },
  CHANGE_EXPORT_VIDEO_SET_SHOW(state, val) {
    state.exportVideoSetShow = val
  },
  CHANGE_TRACK_BOX_SHOW(state, val) {
    state.trackBoxShow = val
  },
  CHANGE_SELECTMZ_SHOW(state, val) {
    state.selectmzShow = val
  },
  UPDATE_SLIDER_NUM(state, payload) {
    state.slidernum = payload
  },
  UPDATE_TRACK_START(state, val) {
    state.trackStart = val
  },
  UPDATE_TRACK_END(state, val) {
    state.trackEnd = val
  },
  UPDATE_MRZY_DATA(state, val) {
    console.log('MRZY change')
    state.Mrzydata = val
  },
  UPDATE_AUDIO_STATUS(state, val) {
    state.audioStatus = val
  },
  UPDATE_CAPTION_STYLE(state, val) {
    state.captionStyle = val
  },
  UPDATE_ALLOW_HISTORY_BACK(state, val) {
    state.allowHistoryBack = val
  },
  [SET_MUL_SELE_LIST](state, data) {
    if (data.type === 'add') {
      state.MulSeleList.push(data.path)
    } else if (data.type === 'del') {
      state.MulSeleList = state.MulSeleList.filter(item => {
        return item !== data.path
      })
    } else if (data.type === 'clear') {
      if (state.pastType === '') {
        state.MulSeleList = []
      }
    }
  },
  [SET_MUL_CONTROL](state, data) {
    state.isMulControl = data
  },
  [SET_LIB_PATH](state, str) {
    state.libpath = str
  },
  [SET_PAST_TYPE](state, str) {
    state.pastType = str
    let obj = {}
    switch (str) {
      case 'cut': {
        obj = state.libsourcelist
        const reg = new RegExp(state.libpath)
        if (Object.keys(obj).length > 0 && state.MulSeleList.length > 0) {
          for (const [dir, dirValue] of Object.entries(obj)) {
            state.MulSeleList.forEach(ite => {
              const ele = dirValue.filter(item => {
                if (dir === 'dirs') {
                  return ite.replace(reg, '') === item.name + '/'
                }
                return ite.replace(reg, '') === item.name
              })[0]
              if (ele && (ele.state & 2) !== 2) ele.state = ele.state ^ 2
            })
          }
        }
        state.libsourcelist = obj
        break
      }
      case 'copy': {
        obj = state.libsourcelist
        if (Object.keys(obj).length > 0) {
          for (const dirValue of Object.values(obj)) {
            for (const item of Object.values(dirValue)) {
              if (item !== 0) {
                item.state = 1
              }
            }
          }
        }
        state.libsourcelist = obj
        break
      }
      default: {
        obj = state.libsourcelist
        if (Object.keys(obj).length > 0) {
          for (const dirValue of Object.values(obj)) {
            for (const item of Object.values(dirValue)) {
              item.state = 0
            }
          }
        }
        state.libsourcelist = obj
        break
      }
    }
  },
  [SET_DIR_LIST](state, obj) {
    const data = {
      dirs: [],
      files: []
    }
    //   state.libsourcelist.dirs = obj.dirs
    // state 二进制 1111
    /*
    1 重命名  右键重命名样式
    1 剪辑后样式 剪辑后选中的文件或文件夹的样式
    1 置位后 点击后的文件或文件夹加框
     */
    // let reg = new RegExp(this.url+"/")
    if (Object.keys(obj.data).length > 0) {
      for (const [dir, dirValue] of Object.entries(obj.data)) {
        for (const item of Object.values(dirValue)) {
          const ele = item
          let m = {}
          if (dir === 'dirs') {
            m = {
              name: ele,
              nameNoSuffix: ele,
              state: 0
            }
            data.dirs.push(m)
          } else if (dir === 'files') {
            m.state = 0
            m = { ...m, ...ele }
            const ind = m.name.lastIndexOf('.')
            m.suffix = m.name.slice(ind)
            m.nameNoSuffix = m.name.slice(0, ind)
            data.files.push(m)
          }
        }
      }
    }
    if (obj.isAdd) {
      state.libsourcelist = {
        dirs: data.dirs, // [ ...state.libsourcelist.dirs,...data.dirs ],
        files: [...state.libsourcelist.files, ...data.files]
      }
    } else {
      state.libsourcelist = data
    }
  },
  [SET_LIB_LOADING](state, bool) {
    state.libloading = bool
  },

  /* 多选begin */
  [CHANGE_REST_ACTIVE_CHUNKS](state, data) {
    if (!data.chunk) {
      return
    }
    state.restActiveChunks.push(data)
  },
  [CLEAR_REST_ACTIVE_CHUNKS](state) {
    state.restActiveChunks = []
  },
  [DEL_REST_ACTIVE_CHUNKS](state, payload) {
    for (const [restIndex, restItem] of state.restActiveChunks.entries()) {
      if (restItem.chunk.chunk_id === payload.chunk_id) {
        state.restActiveChunks.splice(restIndex, 1)
        return
      }
    }
  },
  [POP_REST_ACTIVE_CHUNKS](state) {
    state.restActiveChunks.pop()
  },
  [CHANGE_IS_MULTI_SELECT](state, payload) {
    state.isMultiSelect = payload
  },
  [CHANGE_ORIGIN_MOUSE_POS](state, payload) {
    state.originMousePos.x = payload.x
    state.originMousePos.y = payload.y
  },
  [CHANGE_ACTIVE_CHUNK_POS](state, payload) {
    state.activeChunkPos.x = payload.x
    state.activeChunkPos.y = payload.y
  },
  [CHANGE_MOVE_MOUSE_POS](state, payload) {
    state.moveMousePos.x = payload.x
    state.moveMousePos.y = payload.y
  },
  [CHANGE_END_MOUSE_POS](state, payload) {
    state.endMousePos.x = payload.x
    state.endMousePos.y = payload.y
  },
  [EMPTY_ACTIVE_CHUNK](state) {
    state.activechunk = {
      chunk: '',
      state: 'active'
      // index: undefined
    }
  },
  [CHANGE_ACTIVE_CHUNK](state, payload) {
    state.activechunk = payload
  },
  [CHANGE_VIS_TIMER_WIDTH](state, payload) {
    state.visTimerWidth = payload
  },
  [CHANGE_MOVE_LIST_DATA](state, payload) {
    state.moveListData.push(payload)
  },
  [CLEAR_MOVE_LIST_DATA](state) {
    state.moveListData = []
  },
  [CHANGE_MOVE_RESULT_FLAG](state, payload) {
    state.moveResultFlag = payload
  },
  [CHANGE_MOVE_LIST_COUNT](state) {
    state.moveListCount += 1
  },
  [CLEAR_MOVE_LIST_COUNT](state) {
    state.moveListCount = 0
  },
  [UPDATE_CHUNK_POSITION](state) {
    const v = state.all.tracks.v_track_list
    const a = state.all.tracks.a_track_list
    const chunkPosition = { a: [], v: [] }
    const ghostsPosition = { a: [], v: [] }
    for (let i = 0, len = v.length; i < len; i++) {
      chunkPosition.v[i] = []
      ghostsPosition.v[i] = []
      for (
        let j = 0, chunksLength = v[i].chunks.length;
        j < chunksLength;
        j++
      ) {
        const _chunk = v[i].chunks[j]

        let restFlagV = false
        for (const restItem of state.restActiveChunks) {
          if (_chunk.chunk_id === restItem.chunk.chunk_id) {
            restFlagV = true
            break
          }
        }
        if (restFlagV || _chunk.chunk_id === state.activechunk.chunk.chunk_id) {
          const obj = {}
          obj.id = _chunk.chunk_id
          obj.min = _chunk.track_start
          obj.max = _chunk.track_end
          ghostsPosition.v[i].push(obj)
        } else {
          const obj = {}
          obj.id = _chunk.chunk_id
          obj.min = _chunk.track_start
          obj.max = _chunk.track_end
          chunkPosition.v[i].push(obj)
        }
      }
    }
    for (let m = 0, len = a.length; m < len; m++) {
      chunkPosition.a[m] = []
      ghostsPosition.a[m] = []
      for (
        let n = 0, chunksLength = a[m].chunks.length;
        n < chunksLength;
        n++
      ) {
        const _chunk = a[m].chunks[n]

        let restFlagA = false
        for (const restItem of state.restActiveChunks) {
          if (_chunk.chunk_id === restItem.chunk.chunk_id) {
            restFlagA = true
            break
          }
        }
        if (restFlagA || _chunk.chunk_id === state.activechunk.chunk.chunk_id) {
          const obj = {}
          obj.id = _chunk.chunk_id
          obj.min = _chunk.track_start
          obj.max = _chunk.track_end
          ghostsPosition.a[m].push(obj)
        } else {
          const obj = {}
          obj.id = _chunk.chunk_id
          obj.min = _chunk.track_start
          obj.max = _chunk.track_end
          chunkPosition.a[m].push(obj)
        }
      }
    }
    chunkPosition.v = chunkPosition.v.concat(chunkPosition.a)
    ghostsPosition.v = ghostsPosition.v.concat(ghostsPosition.a)
    state.delchunkposition = chunkPosition
    state.ghostsPosition = ghostsPosition

    const aiTrackChunksPosition = []
    for (let p = 0, len = v.length; p < len; p++) {
      if (v[p].track_id === state.activechunk.chunk.track_id) {
        v[p].chunks.forEach(item => {
          const obj = {}
          obj.id = item.chunk_id
          obj.min = item.track_start
          obj.max = item.track_end
          aiTrackChunksPosition.push(obj)
        })
        break
      }
    }
    if (!aiTrackChunksPosition.length) {
      for (let q = 0, len = a.length; q < len; q++) {
        if (a[q].track_id === state.activechunk.chunk.track_id) {
          a[q].chunks.forEach(item => {
            const obj = {}
            obj.id = item.chunk_id
            obj.min = item.track_start
            obj.max = item.track_end
            aiTrackChunksPosition.push(obj)
          })
          break
        }
      }
    }
    state.aiTrackPosition = aiTrackChunksPosition
  },
  [INIT_CHUNKS](state) {
    state.activechunk = {
      chunk: '',
      state: 'active'
      // index: undefined
    }
    state.restActiveChunks = []
    state.moveListData = []
    state.delchunkposition = {}
    state.ghostsPosition = {}
    state.aiChunksPosition = []
  },
  [CHANGE_TRACK_ABLE_WIDTH](state) {
    state.trackAbleWidth = document.querySelector(
      '.track_able_content'
    ).offsetWidth
  },
  /* 多选end */

  /* 智能语音自选段begin */
  [CHANGE_MODAL_VOICE_APPLY_IS_SHOW](state, payload) {
    state.modalVoiceApplyIsShow = payload
    if (payload === false && state.isTrackSelect) {
      state.isTrackSelect = false
    }
  },
  [CHANGE_MZ_HEIGHT](state, payload) {
    state.mzHeight = payload
  },
  [CHANGE_IS_TRACK_SELECT](state, payload) {
    state.isTrackSelect = payload
  },
  [CHANGE_MODAL_CONTENT](state, payload) {
    state.modalContent = payload
  },
  [CHANGE_AI_VOICE_APPLY_START](state, payload) {
    state.aiVoiceApplyStart = payload
  },
  [UPDATE_AI_CHUNKS_POSITION](state) {
    if (state.isTrackSelect) {
      state.aiChunksPosition = state.aiTrackPosition
    } else {
      let arr = []
      for (const trackPosition of state.ghostsPosition.v) {
        if (trackPosition.length) {
          arr = trackPosition
          break
        }
      }
      state.aiChunksPosition = arr
    }
  },
  [CHANGE_AI_VIEW_MASK_IS_SHOW](state, payload) {
    state.aiViewMaskIsShow = payload
  },
  /* 智能语音自选段end */

  /* 字幕格式导出begin */
  [CHANGE_IS_OUT_TYPE_SHOW](state, payload) {
    state.isOutTypeShow = payload
  },
  /* 字幕格式导出end */

  [CHANGE_IS_ADD_CAPTION](state, payload) {
    state.isAddCaption = payload
  },
  [CHANGE_IS_REFRESH_TRACK_BOX_BS](state, payload) {
    state.isRefreshTrackBoxBS = payload
  },
  [CHANGE_IS_REFRESH_CAPTION_SET_BS](state, payload) {
    state.isRefreshCaptionSetBS = payload
  },
  [CHANGE_IS_REFRESH_PANES_BS](state, payload) {
    state.isRefreshPanesBS = payload
  },
  [CHANGE_TRANKEY_PRESS](state, payload) {
    state.trankeyPress = payload
  },

  /* chunkset抽取公共部分begin */
  [CHANGE_POSITION](state, payload) {
    const way = payload.way
    const target = payload.target
    if (target.value === '') {
      target.value = 0
    } else {
      target.value = parseInt(target.value, 10)
    }

    if (way === 'x') {
      const num =
        (parseInt(target.value, 10) * 100) / state.systemmessage.player.w
      state.activeProperty[state.propertyNum].left = num
    }
    if (way === 'y') {
      const num =
        (parseInt(target.value, 10) * 100) / state.systemmessage.player.h
      state.activeProperty[state.propertyNum].top = num
    }
  }
  /* chunkset抽取公共部分end */
}
