/* eslint-disable */
window.type = "direct"; //资源类别
window.timer = null; //定时器
window.zindex = 1; //zindex可以有三个值 1 2 3 用于屏蔽部分快捷键1全部可以使用  2部分可以使用  3全部屏蔽
/*设置video区域s*/
// window.getVideo = function(a, b) {
//   if (b < 1) {
//     return;
//   }
//   window.type = a;
//   var title = $(".title").val() === undefined ? "" : $(".title").val();

//   var sTime1 = $(".startTime").val() === undefined ? "" : $(".startTime").val();
//   var eTime1 = $(".endTime").val() === undefined ? "" : $(".endTime").val();
//   var sTime = sTime1.replace(/\./g, "-");
//   var eTime = eTime1.replace(/\./g, "-");
//   if ($(".startTime").val() != "" || $(".endTime").val() != "") {
//     if ($(".startTime").val() == "") {
//       sTime = eTime;
//       eTime += " 23:59:59";
//       sTime += " 00:00:00";
//     }
//     if ($(".endTime").val() == "") {
//       eTime = sTime;
//       sTime += " 00:00:00";
//       eTime += " 23:59:59";
//     }
//   }
//   data = {
//     uin: NCES.uin,
//     type: a,
//     page: b,
//     stime: sTime,
//     etime: eTime,
//     title: title
//   };
//   $.ajax({
//     type: "POST",
//     url: "//console.aodianyun.com/share/index.php?r=nces/getMssVideo",
//     data: data,
//     dataType: "JSON",
//     success: function(data) {
//       if (data.Flag == 100) {
//         if (data.List.length == 0 && b > 1) {
//           return;
//         }
//         if (window.type == "direct") {
//           var top =
//             '<label class = "uploadSearch"><span>日期 : </span><input type="text"  value = "' +
//             sTime1 +
//             '" class="startTime" onfocus="WdatePicker({startDate:\'%y.%M.%d\',dateFmt:\'yyyy.MM.dd\',alwaysUseStartDate:false})"/></label>\
//                     <label class = "uploadSearch"><span> 至</span> <input type="text"  value = "' +
//             eTime1 +
//             '"  class="endTime" onfocus="WdatePicker({startDate:\'%y.%M.%d\',dateFmt:\'yyyy.MM.dd\',alwaysUseStartDate:false})"/> </label>\
//                     <span class = "search" onclick="getVideo(\'' +
//             a +
//             "',1)\"></span>";
//         } else {
//           top =
//             '<span class = "directSearch">标题 : </span><input type="text"  value = "' +
//             title +
//             '" class="title directSearch"/>\
//                     <span class = "search" onclick="getVideo(\'' +
//             a +
//             "',1)\"></span>";
//         }
//         var center = "<div>" + showHtml(data, "Mz") + "</div>";
//         var bottom =
//           '<div class = "bottom_tips"><span class = "u-icon"></span>如果有卡顿，请到 <span style = "cursor:pointer" onclick = "$(\'.my_history\').click()">我的历史</span> 将视频加载到本地。</div>\
//                         <div class = "bottom_fanye">\
//                         <span class = "last" onclick="getVideo(\'' +
//           a +
//           "'," +
//           (b - 1) +
//           ')">上一页</span>&nbsp\
//                         <span class = "now" id="Page">' +
//           b +
//           '</span>&nbsp\
//                         <span class = "next" onclick="getVideo(\'' +
//           a +
//           "'," +
//           (b + 1) +
//           ')">下一页</span>\
//                       </div>';
//         NCES.Setcontent({ top: top, center: center, bottom: bottom });
//       }
//     }
//   });
// };
/*设置video区域e*/
/*设置img区域s*/
// window.getImg = function(page) {
//   if (page < 1) {
//     return;
//   }
//   var title = $(".title").val() === undefined ? "" : $(".title").val();
//   window.type = "我的图片";
//   $.ajax({
//     type: "POST",
//     url: "//console.aodianyun.com/share/index.php?r=nces/resourceList",
//     data: { uin: NCES.uin, page: page, title: title },
//     dataType: "JSON",
//     success: function(data) {
//       if (data.Flag == 100) {
//         if (page > 1 && data.List.length == 0) {
//           return;
//         }

//         var top =
//           '<span class = "directSearch">标题 : </span><input type="text"  value = "' +
//           title +
//           '" class="title directSearch"/>\
//                     <span class = "search" onclick="getImg(1)"></span>';

//         var center = "<div>" + showHtml(data, "Tp") + "</div>";
//         var bottom =
//           '<div class = "bottom_tips"><div class = "uploadfile" style = \'display:none\' ><span></span><span>添加图片</span></div></div>\
//                   <div class = "bottom_fanye">\
//                         <span class = "last" onclick="getImg(' +
//           (page - 1) +
//           ')">上一页</span>&nbsp\
//                         <span class = "now" id="Page">' +
//           page +
//           '</span>&nbsp\
//                         <span class = "next" onclick="getImg(' +
//           (page + 1) +
//           ')">下一页</span>\
//                       </div>';
//         NCES.Setcontent({
//           top: top,
//           center: center,
//           bottom: bottom,
//           func: function() {
//             $(".uploadfile").click(function() {
//               NCES.Uploadimg();
//             });
//           }
//         });
//       }
//     }
//   });
// };
/*设置video区域e*/
/*设置资源列表s*/
// window.showHtml = function(data, box) {
//   page = data.page || 1;
//   var type = 1;
//   if (box == "Tp") {
//     type = 3;
//   }
//   var html = "";

//   var year = 0;
//   var mouth = 0;
//   var day = 0;
//   for (var i in data.List) {
//     var date = new Date(Number(data.List[i].uptime) * 1000);

//     var url = null;
//     if (
//       data.List[i].url.match(
//         /(bmp|png|jpg|jpeg|mp3|wma|aac|flac|wav|mp4|m3u8|flv|avi|mkv|mov)$/g
//       )
//     ) {
//       if (data.List[i].url.match(/(m3u8)$/g)) {
//         url =
//           data.List[i].mp4_1080 ||
//           data.List[i].mp4_720 ||
//           data.List[i].mp4_480 ||
//           data.List[i].m3u8_1080 ||
//           data.List[i].m3u8_720 ||
//           data.List[i].m3u8_480 ||
//           data.List[i].m3u8 ||
//           data.List[i].url ||
//           data.List[i].mp4_360 ||
//           data.List[i].mp4_240 ||
//           data.List[i].m3u8_360 ||
//           data.List[i].m3u8_240;
//       } else {
//         url =
//           data.List[i].mp4_1080 ||
//           data.List[i].mp4_720 ||
//           data.List[i].mp4_480 ||
//           data.List[i].url ||
//           data.List[i].m3u8 ||
//           data.List[i].m3u8_1080 ||
//           data.List[i].m3u8_720 ||
//           data.List[i].m3u8_480 ||
//           data.List[i].mp4_360 ||
//           data.List[i].mp4_240 ||
//           data.List[i].m3u8_360 ||
//           data.List[i].m3u8_240;
//       }
//     } else {
//       url =
//         data.List[i].mp4_1080 ||
//         data.List[i].mp4_720 ||
//         data.List[i].mp4_480 ||
//         data.List[i].m3u8_1080 ||
//         data.List[i].m3u8_720 ||
//         data.List[i].m3u8_480 ||
//         data.List[i].m3u8 ||
//         data.List[i].mp4_360 ||
//         data.List[i].mp4_240 ||
//         data.List[i].m3u8_360 ||
//         data.List[i].m3u8_240 ||
//         data.List[i].url;
//     }

//     url = url.replace(/https:/, "");
//     url = url.replace(/http:/, "");

//     html +=
//       '<div class = "video_option_content"> \
//                 <div class = "content_top"> \
//                 <img src= "' +
//       (data.List[i]["thumbnail"]
//         ? data.List[i]["thumbnail"].replace(/https:/, "").replace(/http:/, "") +
//           "/145/80"
//         : url + "?resize/110") +
//       '" alt="" class = "content_top_img dragele" data-src_id = "9398a06022ad11e8bc6ffb74c30c6b5b" data-src_from ="http:' +
//       url +
//       '" data-src_type = ' +
//       type +
//       ' /> \
//                 <div class = "content_top_down" style = "display:none;color:red" title = ' +
//       url +
//       '></div> \
//               </div> \
//               <div class = "content_mes clearfix"> \
//                 <div title = "' +
//       data.List[i]["title"] +
//       '">' +
//       data.List[i]["title"] +
//       "</div> \
//                 <div>" +
//       date.Format("yyyy.MM.dd") +
//       "</div>\
//                 <div>" +
//       (data.List[i]["duration"]
//         ? formatDuration(data.List[i]["duration"])
//         : "") +
//       "</div> \
//               </div> \
//           </div>";
//   }
//   return html;
// };
/*设置资源列表e*/
//图片上传相关事件s
// window.uploadImg = function() {
//   var a = new FormData();
//   if ($(".uploadimage")[0].files[0] == undefined) {
//     $(".tipProp_content p").html("请选择要上传的图片！");
//     $(".tipProp").show();
//     window.zindex = 0;
//     // setTimeout(function () {
//     //         $('.tipProp').hide()
//     //     },1000)
//     return;
//   }
//   a.append("title", $("#uploadtitle").val());
//   a.append("file", $(".uploadimage")[0].files[0]);
//   a.append("uin", NCES.uin);
//   // //console.aodianyun.com/share/index.php?r=nces/upResource
//   // index.php?r=app/upResource
//   $.ajax({
//     url: "index.php?r=app/upResource",
//     xhrFields: {
//       withCredentials: true
//     },
//     type: "POST",
//     cache: false,
//     data: a,
//     processData: false,
//     contentType: false,
//     async: true,
//     success: function(res) {
//       $(".tipProp_content p").html("上传成功");
//       $(".tipProp").show();
//       setTimeout(function() {
//         $(".tipProp").hide();

//         if (type == "我的图片") {
//           getImg(1);
//         }
//       }, 1000);
//     }
//   }).fail(function(jqXHR, textStatus, errorThrown) {
//     // net::ERR_CONNECTION_REFUSED 发生时，也能进入
//     console.info("网络出错", jqXHR, textStatus, errorThrown);
//     $(".uploadimg").hide();
//   });
//   $(".uploadimg").hide();
//   window.zindex = 1;
// };
// window.celUpload = function() {
//   $(".uploadimg").hide();
//   window.zindex = 1;
// };

//图片上传相关事件e
/*格式化时间s*/
// function formatDuration(sec) {
//   var min = parseInt(sec / 60);
//   var sec = parseInt(sec % 60);
//   // sec = sec>9?sec:'0'+sec
//   var hour = parseInt(min / 60);
//   min = min % 60;

//   return (
//     (hour > 9 ? hour : "0" + hour) +
//     ":" +
//     (min > 9 ? min : "0" + min) +
//     ":" +
//     (sec > 9 ? sec : "0" + sec)
//   );
// }
// function tranTime(sec) {
//   sec = sec / 1000;
//   var min = parseInt(sec / 60);
//   var sec = parseInt(sec % 60);
//   // sec = sec>9?sec:'0'+sec
//   var hour = parseInt(min / 60);
//   min = min % 60;
//   if (hour == 0) {
//     if (min == 0) {
//       return (sec > 9 ? sec : "0" + sec) + "秒";
//     } else {
//       return (
//         (min > 9 ? min : "0" + min) +
//         "分钟" +
//         (sec > 9 ? sec : "0" + sec) +
//         "秒"
//       );
//     }
//   } else {
//     return (
//       (hour > 9 ? hour : "0" + hour) +
//       "小时" +
//       (min > 9 ? min : "0" + min) +
//       "分钟" +
//       (sec > 9 ? sec : "0" + sec) +
//       "秒"
//     );
//   }
// }
// function tranDate(sec) {
//   var date = new Date(sec);
//   var year = date.getFullYear();
//   var month =
//     date.getMonth() + 1 > 10
//       ? date.getMonth() + 1
//       : "0" + (date.getMonth() + 1);
//   var day = date.getDate() > 10 ? date.getDate() : "0" + date.getDate();

//   return year + "年" + month + "月" + day + "日";
// }
/*格式化时间e*/
Date.prototype.Format = function(fmt) {
  //author: meizz
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return fmt;
};
// 获取路由参数
function getQueryStr(str, url) {
  var LocString = String(
    url != undefined ? url : window.document.location.href
  );
  var rs = new RegExp("(^|)" + str + "=([^&]*)(&|$)", "gi").exec(LocString),
    tmp;
  if ((tmp = rs)) return decodeURIComponent(tmp[2]);
  return "";
}
function getLiveList({page, sTime, eTime, title,num},callback){
  data = {
    uin: NCES.uin,
    type: 'direct',
    page: page,
    stime: sTime,
    etime: eTime,
    title: title,
    num
  };
  $.ajax({
    type: "POST",
    url: "//console.aodianyun.com/share/index.php?r=nces/getMssVideo",
    data: data,
    dataType: "JSON",
    async : false,
    success: function(res){
      // "title", "thumbnail", "duration", "date", "src_id", "src_from"
      if(res.Flag===100){
        NCES.callbackResult = res.List.map(item=>{
          return {
            title: item.title,
            thumbnail: item.thumbnail,
            duration: item.duration,
            date: item.uptime,
            id: item.id,
            url: item.url
          }
        })
        callback && callback(NCES.callbackResult)
      }
    }
  })
}
function getUploadList({page, sTime, eTime, title,num},callback){
  data = {
    uin: NCES.uin,
    type: 'upload',
    page: page,
    stime: sTime,
    etime: eTime,
    title: title,
    num
  };
  $.ajax({
    type: "POST",
    url: "//console.aodianyun.com/share/index.php?r=nces/getMssVideo",
    data: data,
    dataType: "JSON",
    async : false,
    success: function(res){
      if(res.Flag===100){
        NCES.callbackResult = res.List.map(item=>{
          return {
            title: item.title,
            thumbnail: item.thumbnail,
            duration: item.duration,
            date: item.uptime,
            id: item.id,
            url: item.url
          }
        })
        callback && callback(NCES.callbackResult)
      }
    }
  })
}
// function getLiveListForNces({page, num, title}){
//   var data = {
//     page,
//     num,
//     title
//   }
//   $.ajax({
//     type: 'GET',
//     url: baseUrl+ '/v1/mss/Index/getLiveListForNces',
//     // url: "/v1/mss/Index/getLiveListForNces",
//     data: data,
//     beforeSend: function (XMLHttpRequest) {
//       // XMLHttpRequest.setRequestHeader("token", CONSOLE_TOKEN_GDY)
//     },
//     dataType: 'JSON',
//     success: function (res) {
//       if(res.code === 200 && res.errorCode === 0){
//         NCES.callbackResult = res.List.map(item=>{
//           return {
//             title: item.title,
//             thumbnail: item.thumbnail,
//             duration: item.duration,
//             date: item.uptime,
//             id: item.id,
//             url: item.url
//           }
//         })
//       }
//     }
//   })
// }
// function getSourceListForNces({page, num, title}){
//   var data = {
//     page,
//     num,
//     title
//   }
//   $.ajax({
//     type: 'GET',
//     url: baseUrl+ '/v1/mss/Index/getSourceListForNces',
//     // url: "/v1/mss/Index/getLiveListForNces",
//     data: data,
//     beforeSend: function (XMLHttpRequest) {
//       // XMLHttpRequest.setRequestHeader("token", CONSOLE_TOKEN_GDY)
//     },
//     dataType: 'JSON',
//     success: function (res) {
//       if(res.code === 200 && res.errorCode === 0){
//         NCES.callbackResult = res.List.map(item=>{
//           return {
//             title: item.title,
//             thumbnail: item.thumbnail,
//             duration: item.duration,
//             date: item.uptime,
//             id: item.id,
//             url: item.url
//           }
//         })
//       }
//     }
//   })
// }
// function getSoldierListForNces({page, num, title}){
//   var data = {
//     page,
//     num,
//     title
//   }
//   $.ajax({
//     type: 'GET',
//     url: baseUrl+ '/v1/mss/Index/getSoldierListForNces',
//     // url: "/v1/mss/Index/getLiveListForNces",
//     data: data,
//     beforeSend: function (XMLHttpRequest) {
//       // XMLHttpRequest.setRequestHeader("token", CONSOLE_TOKEN_GDY)
//     },
//     dataType: 'JSON',
//     success: function (res) {
//       if(res.code === 200 && res.errorCode === 0){
//         NCES.callbackResult = res.List.map(item=>{
//           return {
//             title: item.title,
//             thumbnail: item.thumbnail,
//             duration: item.duration,
//             date: item.uptime,
//             id: item.id,
//             url: item.url
//           }
//         })
//       }
//     }
//   })
// }
// function getUploadListForNces({page, num, title}){
//   var data = {
//     page,
//     num,
//     title
//   }
//   $.ajax({
//     type: 'GET',
//     url: baseUrl+ '/v1/mss/Index/getUploadListForNces',
//     // url: "/v1/mss/Index/getLiveListForNces",
//     data: data,
//     beforeSend: function (XMLHttpRequest) {
//       // XMLHttpRequest.setRequestHeader("token", CONSOLE_TOKEN_GDY)
//     },
//     dataType: 'JSON',
//     success: function (res) {
//       if(res.code === 200 && res.errorCode === 0){
//         NCES.callbackResult = res.List.map(item=>{
//           return {
//             title: item.title,
//             thumbnail: item.thumbnail,
//             duration: item.duration,
//             date: item.uptime,
//             id: item.id,
//             url: item.url
//           }
//         })
//       }
//     }
//   })
// }

/*配置选项s*/
NCES.Config({
  //容器的id
  access_id: "110009843585",//奥点AccessID 奥点控制台获取
  expires: 1699771990,// 过期时间
  signature_nonce: "5bea74d65cdf0",
  signature: "ccc94a218c6c3543bef3f857fd1413f0",// 加密认证字符串
  id: "nces",
  // 导播台域名
  domain: getQueryStr("domain") || "nle",
  uin: "1011",
  // 自定义视频列表栏
  // video_sel:createVideolist(),
  // mz_obj:
  //   '<li onclick="getVideo(\'direct\',1)" class = "active">直播列表</li>\
  //               <li onclick="getVideo(\'upload\',1)">上传列表</li>',
  // tp_obj: '<li onclick="getImg(1)">我的图片</li>',
  //下拉拖进轨道的视频的类名，视频的信息也放在该元素上
  drag_ele: "dragele",
  // event: event,
  mzList: [ // 若html不为空，interface不起作用
    
    {
      title: "上传列表",
      interface: getUploadList,
      config: {
        showTitleSearch: true
      },
      html: ''
    },
    {
      title: "直播列表",
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
  saveas: function(obj) {}
});
/*配置选项e*/
NCES.Init(); //初始化
// function event() {
//   $(".uploadimage").change(function() {
//     if ($(".uploadimage")[0]["files"][0]) {
//       $(".imgfilepath").val($(".uploadimage")[0]["files"][0].name);
//     } else {
//       $(".imgfilepath").val("");
//     }
//   });
// }
// function downPers() {
//   NCES.Gethistory(function(res) {
//     var num = 0;
//     var domnode = null;
//     var type = null;
//     for (var i = 0; i < res.data.length; i++) {
//       domnode = $('[title="' + res.data[i].from + '"]');
//       domnode.show();
//       if (res.data[i].status <= 0) {
//         domnode
//           .html("加载失败")
//           .css("clolr", "red")
//           .css("line-height", "62px");
//       } else {
//         if (res.data[i].src_type == 3) {
//           type = 3;
//           domnode
//             .data("src_id", res.data[i].src_id)
//             .data("bload", true)
//             .data("url", res.data[i].preview_img)
//             .data("sum_frame", 250)
//             .css("background", "rgba(0,0,0,0)")
//             .addClass("dragele")
//             .data("type", type);
//         }
//         if (res.data[i].src_type == 2) {
//           type = 2;
//         }
//         if (res.data[i].src_type == 1) {
//           if (res.data[i].v_codec != undefined) {
//             type = 1;
//           } else {
//             type = 0;
//           }
//           domnode
//             .data("src_id", res.data[i].src_id)
//             .data("bload", true)
//             .data("url", res.data[i].preview_img)
//             .data("sum_frame", res.data[i].sum_frame)
//             .css("background", "rgba(0,0,0,0)")
//             .addClass("dragele")
//             .data("type", type);
//         }
//       }
//     }
//   });
// }
