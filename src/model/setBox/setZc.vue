<template>
  <div class="setchunkboxdx">
    <div class="setchunkboxdx_content">
      <div class="content_title">
        <span class="content_del u-icon" @click="deldx"></span><span>过渡</span>
      </div>
      <div class="content_input">
        <span>持续时间 :</span
        ><input
          type="number"
          v-model="time"
          step="1"
          class="cxsj"
          min="0"
          @change="timechange($event.currentTarget)"
        />S
        <span class="num_warn" style="color:red;display:none">请输入整数</span>
      </div>
      <div class="content_input">
        <span style="">类&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型 : </span>
        <div style="display:inline-block;width:157px">
          <el-select
            v-model="activechunk.chunk.transition.name"
            @change="typechange"
            size="mini"
          >
            <el-option
              v-for="item in txlist"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div
        class="content_text"
        v-if="this.activechunk.chunk.transition.name != '淡入淡出'"
      >
        <span>动效反向 : </span>
        <span
          ><label
            ><input
              type="radio"
              name="tracktype"
              :checked="this.activechunk.chunk.transition.invert == 1"
              @click="click(1)"
            /><span>&nbsp;是</span></label
          ></span
        >
        <span
          ><label
            ><input
              type="radio"
              name="tracktype"
              :checked="this.activechunk.chunk.transition.invert == 0"
              @click="click(0)"
            /><span>&nbsp;否</span></label
          ></span
        >
      </div>
      <div
        class="content_input"
        style="height:20px;text-align:center"
        v-if="this.activechunk.chunk.transition.name != '淡入淡出'"
      >
        <span style="float:left"
          >羽&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;化 :
        </span>
        <div style="float:left;position:relative;;height:20px;width:200px;">
          <span style="position:absolute;left:0;width:20px;height:20px">0</span>
          <span
            style="position:absolute;right:0;width:20px;height:20px;margin-right:0px"
            >1</span
          >
          <div style="top:-8px;position:absolute;right:30px;left:30px;">
            <el-slider
              v-model="activechunk.chunk.transition.softness"
              mini
              :max="1"
              :min="0"
              :step="0.01"
            ></el-slider>
          </div>
        </div>
      </div>
      <div class="content_bottom">
        <span class="con_click_make" @click="add">确认</span
        ><span class="con_click_cancel" @click="sure">取消</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
// import systemmes from './model/Systemmes'

export default {
  data: function() {
    return { show: false, txlist: [] }
  },
  created: function() {
    this.gettxlist()
  },
  props: ['chunk'],
  computed: {
    ...mapState(['notify', 'systemmessage', 'activechunk']),
    time: {
      get: function() {
        return this.activechunk.chunk.transition.frames / 25
      },
      set: function(value) {
        this.activechunk.chunk.transition.frames = value * 25
      }
    },
    track() {
      return this.$store.state.all.tracks
    }
  },
  watch: {},
  methods: {
    ...mapActions(['Post', 'del', 'changeLoading']),
    ...mapMutations(['CHANGE_BOXSET', 'ACTIVE_CHUNK']),
    gettxlist() {
      const that = this
      $.post(
        window.NCES.DOMAIN + '/api/transition',
        JSON.stringify({ cmd: 'all' }),
        function(res) {
          if (res.code !== 0) {
            console.warn(res)
            that.gettxlist()
            return
          }
          const arr = []
          for (let i = 0; i < res.data.length; i++) {
            arr.push({ value: res.data[i].name, service: res.data[i].service })
          }
          that.txlist = arr
        },
        'json'
      )
    },
    deldx() {
      this.CHANGE_BOXSET('')
      this.del()
    },
    add: function() {
      const that = this
      let data
      if (this.activechunk.chunk.transition.name === '淡入淡出') {
        data = {
          cmd: 'update',
          chunk_id: that.activechunk.chunk.chunk_id,
          service: this.activechunk.chunk.transition.service,
          frames: this.time * 25,
          invert: 0,
          softness: this.activechunk.chunk.transition.softness
        }
      } else {
        data = {
          cmd: 'update',
          chunk_id: that.activechunk.chunk.chunk_id,
          service: this.activechunk.chunk.transition.service,
          frames: this.time * 25,
          invert: this.activechunk.chunk.transition.invert,
          softness: this.activechunk.chunk.transition.softness
        }
      }
      $.post(
        window.NCES.DOMAIN + '/api/transition',
        JSON.stringify(data),
        function(res) {
          if (res.code === 0) {
            window.zindex = 1
            that.changeLoading()
            that.CHANGE_BOXSET('')
          }
          if (res.code !== 0) {
            that.$alert('动效时长大于素材时长，设置失败！', '提示消息', {
              confirmButtonText: '确定',
              callback: function() {
                window.zindex = 1
                that.sure()
              }
            })
          }
        },
        'json'
      )
    },
    sure() {
      const that = this
      this.CHANGE_BOXSET('')

      this.changeLoading(function() {
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
            for (let j = 0; j < that.track.v_track_list[i].chunks.length; j++) {
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
    },
    timechange() {
      this.activechunk.chunk.transition.frames = Math.ceil(this.time) * 25
    },
    typechange(value) {
      for (let i = 0; i < this.txlist.length; i++) {
        if (this.txlist[i].value === value) {
          this.activechunk.chunk.transition.service = this.txlist[i].service
          if (value === '淡入淡出') {
            this.activechunk.chunk.transition.invert = 0
          }
        }
      }
    },
    click(value) {
      if (this.activechunk.chunk.transition.name === '淡入淡出') {
        return
      }
      this.activechunk.chunk.transition.invert = value
    }
  },
  mounted: function() {
    if (typeof this.activechunk.chunk.transition.invert === 'undefined') {
      this.activechunk.chunk.transition.invert = 0
    }
    if (typeof this.activechunk.chunk.transition.softness === 'undefined') {
      this.activechunk.chunk.transition.softness = 0.2
    }
  }
}
</script>

<style>
.setchunkboxdx {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1010;
}
.setchunkboxdx_content {
  position: absolute;
  width: 510px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #232323;
  font-size: 14px;
}

/* .el-input__inner,.el-select-dropdown {
        background-color:#1d1d1d;
        border:1px solid #636363 !important;
        font-size:14px !important;
        color:rgb(170,170,170)
    }
    .el-select .el-input__inner:focus,.el-select .el-input__inner:hover, {
        border-color: #636363;
    }
    .el-select-dropdown__item.hover,.el-select-dropdown__item:hover{
        background-color:#1d1d1d;
        
    } */
</style>
