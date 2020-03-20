<template>
  <div class="nces_sys">
    <div class="sys_title">
      <span class="t1">{{ project }}</span>
    </div>
    <div class="sys_message">
      <span :class="cpus">
        CPU: <span>{{ cpu.v }} %</span>
      </span>
      <span :class="netOuts">
        netOut: <span>{{ (netOut.v / 1000).toFixed(2) }} kbps</span>
      </span>
      <span :class="nums">
        页面打开数: <span>{{ num.v }} </span>
      </span>
      <span>使用时长 : {{ this.newtime }}</span>
    </div>
    <div :style="{ float: 'right', color: color }">
      <span
        v-show="false"
        style="background-color: #61ded0;border: 1px solid #61ded0;display:inline-block;margin-right: 10px;margin-top: 6px;width: 40px;text-align: center;cursor: pointer;border-radius: 3px"
        >销毁</span
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      color: '',
      time: 0,
      cpu: {},
      project: '',
      netOut: {},
      num: {},
      flag: 0
    }
  },
  computed: {
    allflag() {
      let a = 0
      if (this.cpu > a) {
        a = this.cpu
      }
      if (this.netOut > a) {
        a = this.netOut
      }
      if (a === 0) {
        return '#e4e4e4'
      }
      if (a === 1) {
        return '#efc443'
      }
      if (a === 2) {
        return 'red'
      }
      return '#e4e4e4'
    },
    newtime() {
      return this.trantime(this.time)
    },
    cpus() {
      return this.state(this.cpu)
    },
    netOuts() {
      return this.state(this.netOut)
    },

    spaces() {
      return this.state(this.space)
    },
    nums() {
      return this.state(this.num)
    }
  },
  methods: {
    getsystemmes() {
      const that = this
      $.ajax({
        type: 'get',
        url: window.NCES.DOMAIN + '/api/system',
        dataType: 'json',
        success(res) {
          if (res.code === 0) {
            const status = res.data.status
            that.project = res.data.config.name
            that.cpu = status.cpu
            that.netOut = status.curr_net_out
            that.space = status.disk_space
            that.num = status.client_cout
          }
          if (res.code !== 0) {
            console.warn(res.msg)
            return
          }
        }
      })
    },
    check() {
      const that = this
      $.get(window.NCES.DOM + '/getInstanceInfo', function(json_para) {
        const json = JSON.parse(json_para)
        if (json.code !== 0 && json.code !== '0') {
          return
        }
        const nowtime = new Date()
        that.time = Math.floor(nowtime.getTime() / 1000 - json.info.createTime)
      })
    },
    trantime(s) {
      let m = Math.floor(s / 60)
      m < 10 && (m = '0' + m)
      return m + ' min'
    },
    state(a) {
      if (a.state === 1) {
        return 'warn'
      }
      if (a.state === 2) {
        return 'danger'
      }
      return 'normal'
    }
  },
  mounted() {
    this.getsystemmes()
    setInterval(() => {
      this.getsystemmes()
    }, 10000)
    this.check()
    setInterval(() => {
      this.check()
    }, 60000)
  }
}
</script>
<style lang="scss">
.nces_sys {
  width: 100%;
  height: 0.6rem;
  line-height: 0.6rem;
  background-color: #151a20;
  display: flex;
  align-items: center;
  .sys_title {
    text-indent: 0.25rem;
    width: 1.2rem;
    display: flex;
    .t1 {
      border-right: 1px solid #3f3f3f;
      border-color: #636b72;
      font-size: 0.18rem;
      height: 0.18rem;
      line-height: 0.18rem;
      padding-right: 0.16rem;
    }
  }
  .sys_message {
    display: inline-block;
    line-height: 30px;
    font-size: 0.16rem;
    & > span {
      opacity: 0.7;
      padding: 0 8px;
      &.hide {
        display: none;
      }
      &.warn {
        color: #efc443;
        opacity: 1;
      }
      &.danger {
        opacity: 1;
        color: red;
      }
    }
  }
}
</style>
