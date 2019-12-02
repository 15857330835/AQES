import axios from '../http'
import * as libapi from '@/api/Lib'

export default {
  msgbox(context, data) {
    const h = this._vm.$createElement
    this._vm.$msgbox({
      title: '消息',
      message: h('p', null, [
        h('span', null, data.text)
        // h('i', { style: 'color: teal' }, 'VNode')
      ]),
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          instance.confirmButtonText = '执行中...'
          data.handle({
            callback: res => {
              done(res)
              setTimeout(() => {
                instance.confirmButtonLoading = false
              }, 300)
            }
          })
        } else {
          done()
        }
      }
    })
    // .then(action => {
    //   console.log()
    //   this.$message({
    //     type: 'info',
    //     message: 'action: ' + action
    //   });
    // });
  },
  changeLoading({ commit, state, dispatch }, callback) {
    // 获取非编工程所有的信息
    const that = this
    $.ajax({
      type: 'get',
      url: window.NCES.DOMAIN + '/api/all',
      success: function(res) {
        if (res.code !== 0 || res.data.project.loading === true) {
          setTimeout(function() {
            that.dispatch('changeLoading')
          }, 1000)
          return
        }
        const initdata = res.data.track_property
        if (
          typeof initdata.outLeft === 'undefined' ||
          typeof initdata.ratio === 'undefined' ||
          typeof initdata.xifuFlag === 'undefined' ||
          typeof initdata.fanwei === 'undefined'
        ) {
          if (typeof initdata.outLeft === 'undefined') {
            initdata.outLeft = 0
          }
          if (typeof initdata.ratio === 'undefined') {
            initdata.ratio = 0
          }
          if (typeof initdata.xifuFlag === 'undefined') {
            initdata.xifuFlag = true
          }
          if (typeof initdata.fanwei === 'undefined') {
            initdata.fanwei = {
              '1920': { max: 0.5, min: 0.25, now: 0.5 },
              '1440': { max: 0.45, min: 0.25, now: 0.45 }
            }
          }
          const data = {}
          data.type = 'track'
          data.data = { cmd: 'property_append', track_property: initdata }
          data.error = function() {
            console.log('初始化数据错误')
          }
          that.dispatch('Post', data)
        }
        // let originOutLeft = state.all.track_property && state.all.track_property.outLeft;
        // res.data.track_property.outLeft = originOutLeft;
        commit('CHANGE_LOADING', res.data)
        // 获取数据后确定state.slidernum.min
        const min = state.slidernum.min
        let displayNumMin =
          30.1 - Math.round(state.all.curr_track_len / 5) / 100
        displayNumMin = Math.round((displayNumMin + 0.15) / 0.25) * 0.25 - 0.15
        const newSliderNumMin = displayNumMin < min ? displayNumMin : min
        state.slidernum.min = newSliderNumMin
        that.dispatch('getnowimg')
        commit('UPDATE_CAPTION_STYLE', res.data.caption)
        window.captionStyle = res.data.caption
        if (callback && typeof callback === 'function') {
          callback()
        }
        commit('UPDATE_TRACKPOSITION')
      },
      error: function(res) {
        console.warn(res.msg)
        that.dispatch('changeLoading')
      },
      timeout: 500
    })
  },
  // 复制
  zhantie({ commit, state, dispatch }, payload) {
    const that = this
    const data = {
      cmd: 'copy',
      // chunk_id: state.activechunk.chunk.chunk_id,
      // track_start: state.activechunk.chunk.track_end
      chunk_list: payload.copyArray,
      track_start: payload.copyStart
    }
    $.post(
      window.NCES.DOMAIN + '/api/chunk',
      JSON.stringify(data),
      function(res) {
        if (res.code === 0) {
          that.dispatch('changeLoading')
        }
      },
      'json'
    )
  },
  gethistoryindex({ state, commit, dispatch }) {
    $.post(
      window.NCES.DOMAIN + '/api/history',
      JSON.stringify({ cmd: 'list' }),
      function(res) {
        if (res.code === 0) {
          commit('SET_HISTORYINDEX', res.data.length - 1)
        }
      },
      'json'
    )
  },
  // backhistoryindex({ state, commit, dispatch }) {},
  // 获取已经加载的源的数据sourcedata
  getSourcedata({ state, commit, dispatch }) {
    const data = {}
    data.type = 'source'
    data.data = { cmd: 'all' }
    data.success = function(res) {
      commit('SET_SOURCEDATA', res.data)
    }
    this.dispatch('Post', data)
  },
  // 获取系统信息
  getSystemmesage({ state, commit, dispatch }) {
    const data = {}
    data.type = 'system'
    data.data = {}
    data.success = function(res) {
      commit('INIT_SYSTEMMESSAGE', res.data.config)
    }
    this.dispatch('Post', data)
  },
  // 删除块
  del({ state, commit, dispatch }, array) {
    const data = {}
    const that = this
    data.type = 'chunk'
    data.data = { cmd: 'del', chunk_list: array }
    data.success = function(res) {
      commit('ACTIVE_CHUNK', { chunk: '', state: '' })
      that.commit('CLEAR_REST_ACTIVE_CHUNKS')
      that.commit('EMPTY_ACTIVE_CHUNK')
      that.dispatch('changeLoading')
    }
    if (typeof state.activechunk.chunk.chunk_type === 'undefined') {
      data.type = 'caption'
      data.data = { cmd: 'del', chunk_id: state.activechunk.chunk.chunk_id }
    } else if (state.activechunk.chunk.chunk_type === 5) {
      data.type = 'transition'
    } else {
      data.type = 'chunk'
    }
    this.dispatch('Post', data)
  },
  // 音视频分离
  avleave({ state, commit, dispatch }) {
    const data = {}
    const that = this
    data.type = 'chunk'
    data.data = {
      cmd: 'separate_audio',
      chunk_id: state.activechunk.chunk.chunk_id
    }
    data.error = function() {
      that.$alert('该资源非视频资源或已进行过音视频分离！', '提示消息', {
        confirmButtonText: '确定'
      })
    }
    data.success = function(res) {
      commit('ACTIVE_CHUNK', { chunk: '', state: '' })
      that.dispatch('changeLoading')
    }
    this.dispatch('Post', data)

    if ($('.chunkbox.active').length === 0) {
      $('.tipProp_content p').html('请选择要音视频分离的块！')
      $('.tipProp').show()
      window.zindex = 0
      return
    }
    if (
      $('.chunkbox.active')[0].getAttribute('avleave') === 'false' ||
      typeof $('.chunkbox.active')[0].getAttribute('avleave') === 'undefined'
    ) {
      $('.tipProp_content p').html('该资源非视频资源或已进行过音视频分离！')
      $('.tipProp').show()
      window.zindex = 0
      return
    }
    $('.chunkbox.active')[0].getAttribute('chunk_id')
  },
  cut(state, array) {
    const that = this
    $.post(
      window.NCES.DOMAIN + '/api/chunk',
      JSON.stringify({
        cmd: 'split',
        split_list: array
      }),
      function(res) {
        if (res.code === 0) {
          /* that.commit("ACTIVE_CHUNK", { chunk: "", state: "" });
            that.commit("CLEAR_REST_ACTIVE_CHUNKS");
            that.commit("EMPTY_ACTIVE_CHUNK"); */
          that.dispatch('changeLoading')
        }
        if (res.code !== 0) {
          console.warn(res.msg)
        }
      },
      'json'
    )
  },
  lastindex({ state, commit, dispatch }) {
    // 上一帧
    if (state.all.pointer.position === 0) {
      return
    }
    commit('UPDATE_POINTER_POSITION', state.all.pointer.position - 1)
    const data = {}
    data.data = { cmd: 'last_f' }
    this.dispatch('postPointer', data)
    // this._actions.postPointer(data)
  },
  videoplay({ state, commit, dispatch }) {
    // 播放or暂停
    const data = {}
    if (state.all.pointer.speed === 0) {
      commit('UPDATE_POINTER_SPEED', 1)
      if (state.all.pointer.position + 1 === state.all.curr_track_len) {
        data.data = { cmd: 'set', speed: 1, position: 0 }
        commit('UPDATE_POINTER_POSITION', 0)
      } else {
        data.data = { cmd: 'set', speed: 1 }
      }
    } else {
      commit('UPDATE_POINTER_SPEED', 0)
      data.data = { cmd: 'set', speed: 0 }
    }
    this.dispatch('postPointer', data)
  },
  nextindex({ commit, state, dispatch }) {
    // 下一帧
    commit('UPDATE_POINTER_POSITION', state.all.pointer.position + 1)
    const data = {}
    data.data = { cmd: 'next_f' }
    this.dispatch('postPointer', data)
  },
  lastTemp({ state, commit, dispatch }, num) {
    const data = {}
    const that = this
    data.type = 'history'
    data.data = { cmd: 'last', type: num }
    data.success = function() {
      commit('ACTIVE_CHUNK', { chunk: '', state: '' })
      that.dispatch('changeLoading')
    }
    this.dispatch('Post', data)
  },
  nextTemp({ state, commit, dispatch }, num) {
    const data = {}
    const that = this
    data.type = 'history'
    data.data = { cmd: 'next', type: num }
    data.success = function() {
      commit('ACTIVE_CHUNK', { chunk: '', state: '' })
      that.dispatch('changeLoading')
    }
    this.dispatch('Post', data)
  },
  getindex({ commit, state, dispatch }) {
    // 获取定位
    const data = {}
    const that = this
    data.data = { cmd: 'get' }
    data.success = function(res) {
      if (
        state.chunksetshow &&
        state.all.pointer.speed === 1 &&
        state.all.pointer.position > state.activechunk.chunk.track_end
      ) {
        const obj = {
          type: 'pointer',
          data: {
            cmd: 'set',
            position: state.activechunk.chunk.track_end,
            speed: 0
          }
        }
        that.dispatch('Post', obj)
      }
      state.all.pointer = res.data
    }
    this.dispatch('postPointer', data)
  },
  getnowimg({ commit, state, dispatch }) {
    // 获取可视区域图片列表
    const trackend =
      parseInt(
        (state.all.track_property.outLeft + $('.edit_track_contents').width()) *
          (state.slidernum.max - state.all.track_property.ratio),
        10
      ) > state.all.curr_track_len
        ? state.all.curr_track_len
        : parseInt(
            (state.all.track_property.outLeft +
              $('.edit_track_contents').width()) *
              (state.slidernum.max - state.all.track_property.ratio),
            10
          )
    // 获取可视区域图片的方法
    const config = {
      track_start:
        (parseInt(
          (state.all.track_property.outLeft - 100) *
            (state.slidernum.max - state.all.track_property.ratio),
          10
        ) < 0
          ? 0
          : parseInt(
              (state.all.track_property.outLeft - 100) *
                (state.slidernum.max - state.all.track_property.ratio),
              10
            )) || 0,
      track_end: trackend || 0,
      r_interval: parseInt(
        (state.slidernum.max - state.all.track_property.ratio) * 100,
        10
      ),
      pixel_ratio: parseFloat(
        (state.slidernum.max - state.all.track_property.ratio).toFixed(2)
      ),
      height: 56
    }
    const data = {}
    // console.log({ config })
    data.data = {
      cmd: 'get_imgs',
      track_start: config.track_start,
      track_end: config.track_end,
      img_h: config.height || 56,
      r_interval: config.r_interval,
      pixel_ratio: config.pixel_ratio
    }
    data.success = function(res) {
      commit('IMG_LISTS', res.data)
      // console.log(state.imglists)
    }
    this.dispatch('postTrack', data)
  },

  /**
   *
   * @param {*公用接口相关请求} param0
   * @param {*} data
   */
  // 提交pointer接口数据(position,speed)
  postPointer({ commit, state, dispatch }, data) {
    $.post(
      window.NCES.DOMAIN + '/api/pointer',
      JSON.stringify(data.data),
      function(res) {
        if (res.code !== 0) {
          console.warn(res.msg)
          return
        }
        if (data.success) {
          data.success(res)
        }
      },
      'json'
    )
  },
  // 提交chunk接口数据
  postTrack({ commit, state, dispatch }, data) {
    $.post(
      window.NCES.DOMAIN + '/api/track',
      JSON.stringify(data.data),
      function(res) {
        if (res.code !== 0) {
          if (data.error) {
            data.error(res)
          }
          console.warn(res.msg)
          return
        }
        if (data.success) {
          data.success(res)
        }
      },
      'json'
    )
  },
  // 提交接口数据
  Post({ commit, state, dispatch }, data) {
    $.post(
      window.NCES.DOMAIN + '/api/' + data.type,
      JSON.stringify(data.data),
      function(res) {
        if (res.code !== 0) {
          if (data.error) {
            data.error(res)
          }
          console.warn(res.msg)
          return
        }
        if (data.success) {
          data.success(res)
        }
      },
      'json'
    )
  },

  refreshActiveChunk({ commit, state, dispatch }, data) {
    axios
      .post(
        window.NCES.DOMAIN + '/api/chunk',
        JSON.stringify({
          cmd: 'get',
          chunk_id: state.activechunk.chunk.chunk_id
        })
      )
      .then(res => {
        commit('UPDATE_ACTIVE_PREVIEW_IMG', res.data.preview_img)
      })
  },

  async libRemove({ state, commit, dispatch }, data) {
    let res = null
    /* if(data && data.path){
      res = await libapi.libDelApi({arr:[data.path]});
    }
    else  */
    if (state.MulSeleList.length > 0) {
      res = await libapi.libDelApi({ arr: state.MulSeleList })
    }
    if (res && res.code === 0) {
      data.callback && data.callback(res)
      dispatch('changeLoading')
      dispatch('getDirList')
      commit('SET_PAST_TYPE', '')
      commit('SET_MUL_SELE_LIST', { type: 'clear' })
    }
  },
  libCut({ state, commit, dispatch }) {
    commit('SET_PAST_TYPE', 'cut')
  },
  libCopy({ state, commit, dispatch }) {
    commit('SET_PAST_TYPE', 'copy')
  },
  async reallibCut({ state, commit, dispatch }, data) {
    let res = null,
      libpath = ''

    if (data) {
      libpath = data.libpath || '/'
      res = await libapi.libMoveApi({ from: [data.path], to: libpath })
    } else if (state.MulSeleList.length > 0) {
      libpath = state.libpath || '/'
      res = await libapi.libMoveApi({ from: state.MulSeleList, to: libpath })
    }
    if (res && res.code === 0 && !res.fail) {
      console.log('some todo')
    }
    dispatch('getDirList')
    commit('SET_PAST_TYPE', '')
    commit('SET_MUL_SELE_LIST', { type: 'clear' })
  },
  async reallibCopy({ state, commit, dispatch }, data) {
    let res = null
    const libpath = state.libpath || '/'
    if (data) {
      res = await libapi.libCopyApi({ from: [data], to: libpath })
    } else if (state.MulSeleList.length > 0) {
      res = await libapi.libCopyApi({ from: state.MulSeleList, to: libpath })
    }
    if (res && res.code === 0) {
      console.log('some todo')
    }
    dispatch('getDirList')
    commit('SET_PAST_TYPE', '')
    commit('SET_MUL_SELE_LIST', { type: 'clear' })
  },
  async getDirList({ state, commit, dispatch }, data) {
    const index = data ? data.index : 1
    const number = data ? data.number : 20
    const res = await libapi.libListApi({
      path: state.libpath,
      index: index,
      number: number
    })
    if (res.code === 0) {
      commit('SET_DIR_LIST', { data: res.data, isAdd: index !== 1 })
      commit('SET_LIB_LOADING', false)
      data && data.callback(res)
    }
  },
  libClear({ state, commit, dispatch }) {
    dispatch('getDirList')
    commit('SET_PAST_TYPE', '')
    commit('SET_MUL_SELE_LIST', { type: 'clear' })
  },
  libPast({ state, commit, dispatch }) {
    commit('SET_LIB_LOADING', true)
    if (state.pastType === 'cut') {
      dispatch('reallibCut')
    } else {
      dispatch('reallibCopy')
    }
  }
}
