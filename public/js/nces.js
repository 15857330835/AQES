/* eslint-disable */
// 获取路由参数
function getQueryStr(str, url) {
  var LocString = String(url != undefined ? url : window.document.location.href)
  var rs = new RegExp('(^|)' + str + '=([^&]*)(&|$)', 'gi').exec(LocString),
    tmp
  if ((tmp = rs)) return decodeURIComponent(tmp[2])
  return ''
}
function getLiveList({ page, sTime, eTime, title, num }, callback) {
  data = {
    uin: AQES.uin,
    type: 'direct',
    page: page,
    stime: sTime,
    etime: eTime,
    title: title,
    num
  };
  $.ajax({
    type: 'POST',
    url: '//console.aodianyun.com/share/index.php?r=nces/getMssVideo',
    data: data,
    dataType: 'JSON',
    async: false,
    success: function(res) {
      // "title", "thumbnail", "duration", "date", "src_id", "src_from"
      if (res.Flag === 100) {
        //过滤被AQES剪辑过的视频
        res.List = res.List.filter(item => item.source != 'AQES')
        AQES.callbackResult = res.List.map(item => {
          return {
            title: item.title,
            thumbnail: item.thumbnail,
            duration: item.duration,
            date: item.uptime,
            id: item.id,
            url: item.url.slice(-4) == 'm3u8' ? item.url : item.m3u8_1080 || item.m3u8_720 || item.m3u8_480 || item.m3u8_360 || item.m3u8_240 || item.m3u8 || item.url
          }
        })
        callback && callback(AQES.callbackResult)
      }
    }
  })
}
function getUploadList({page, sTime, eTime, title,num},callback){
  data = {
    uin: AQES.uin,
    type: 'upload',
    page: page,
    stime: sTime,
    etime: eTime,
    title: title,
    num
  };
  $.ajax({
    type: 'POST',
    url: '//console.aodianyun.com/share/index.php?r=nces/getMssVideo',
    data: data,
    dataType: "JSON",
    async : false,
    success: function(res) {
      if (res.Flag === 100) {
        AQES.callbackResult = res.List.map(item => {
          return {
            title: item.title,
            thumbnail: item.thumbnail,
            duration: item.duration,
            date: item.uptime,
            id: item.id,
            url: item.url.slice(-4) == 'm3u8' ? item.url : item.m3u8_1080 || item.m3u8_720 || item.m3u8_480 || item.m3u8_360 || item.m3u8_240 || item.m3u8 || item.url
          }
        })
        callback && callback(AQES.callbackResult)
      }
    }
  })
}

/*配置选项s*/
AQES.Config({
  //容器的id
  access_id: '110009843585', //奥点AccessID 奥点控制台获取
  expires: 1699771990, // 过期时间
  // signature_nonce: '5bea74d65cdf0',
  // signature: 'ccc94a218c6c3543bef3f857fd1413f0', // 加密认证字符串
  id: 'aqes',
  // 导播台域名
  domain: getQueryStr('domain') || 'nle',
  uin: '1011',
  // 自定义视频列表栏
  // video_sel:createVideolist(),
  // mz_obj:
  //   '<li onclick="getVideo(\'direct\',1)" class = "active">直播列表</li>\
  //               <li onclick="getVideo(\'upload\',1)">上传列表</li>',
  // tp_obj: '<li onclick="getImg(1)">我的图片</li>',
  //下拉拖进轨道的视频的类名，视频的信息也放在该元素上
  drag_ele: 'dragele',
  // event: event,
  mzList: [
    // 若html不为空，interface不起作用

    {
      title: '上传列表',
      interface: getUploadList,
      config: {
        showTitleSearch: true
      },
      html: ''
    },
    {
      title: '直播列表',
      interface: getLiveList,
      config: {
        showDatePicker: true
      },
      html: ''
    },
    // {
    //   title: '现场存储',
    //   interface: getLiveListForNces,
    //   config: {
    //     showTitleSearch: true
    //   }
    // },
    // {
    //   title: '信源输入',
    //   interface: getSourceListForNces,
    //   config: {
    //     showTitleSearch: true
    //   }
    // },
    // {
    //   title: '单兵输入',
    //   interface: getSoldierListForNces,
    //   config: {
    //     showTitleSearch: true
    //   }
    // },
    // {
    //   title: '用户上传',
    //   interface: getUploadListForNces,
    //   config: {
    //     showTitleSearch: true
    //   }
    // }
  ],
  // callbackResult: [],
  //导出的视频地址
  saveas: function(obj) {
    console.log(obj)
  }
})
/*配置选项e*/
AQES.Init() //初始化