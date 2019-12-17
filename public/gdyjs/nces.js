var appId = getQueryString('appId')
  var type = 'direct';//资源类别
  var timer = null;//定时器
  var zindex = 1;//zindex可以有三个值 1 2 3 用于屏蔽部分快捷键1全部可以使用  2部分可以使用  3全部屏蔽
  var title = ''
  var Videoerrirlist = ''
  var aodianAccessId = ''
  var expires = ''
  var signature = ''
  var signatureNonce = ''
  var LiveList = []
  var SourceList = []
  var SoldierList = []
  var UploadList = []
  
  /*设置video区域*/
  function trigger(a, b, type) {
    var e = window.event || arguments.callee.caller.arguments[0];
    var keyCode = e.keyCode || e.which || e.charCode;
    if (keyCode == 13) {
      if (type == 'video') {
        getVideo(a, b)
      } else {
        getImg(1)
      }

    }
  }

  function clickVideo(a, b) {
    $(".title").val('')
    if (b < 1) {
      return
    }
    var Videourl = ''
    var title = $(".title").val() === undefined ? '' : $(".title").val();
    var data = {
      page: b,
      num: 20,
      title: title
    }
    if (a == 'direct') {
      Videourl = API.getLiveListForNces
      sess(LiveList, Videourl, data, a, b, title)
    } else if (a == 'source') {
      Videourl = API.getSourceListForNces
      sess(SourceList, Videourl, data, a, b, title)
    } else if (a == 'singe') {
      Videourl = API.getSoldierListForNces
      sess(SoldierList, Videourl, data, a, b, title)
    } else {
      Videourl = API.getUploadListForNces
      sess(UploadList, Videourl, data, a, b, title)
    }


  }
  function sess(ForNcesdata, Videourl, data, a, b, title) {
    var type = 'search'
    if (ForNcesdata.length != 0) {
      ajaxhtml(title, ForNcesdata, a, b)
    } else {
      requestVideoajax(Videourl, data, a, b, title, type)
    }
  }
  function getVideo(a, b) {
    if (b < 1) {
      return
    }
    var Videourl = ''
    if (a == 'direct') {
      Videourl = API.getLiveListForNces
    } else if (a == 'source') {
      Videourl = API.getSourceListForNces
    } else if (a == 'singe') {
      Videourl = API.getSoldierListForNces
    } else {
      Videourl = API.getUploadListForNces
    }
    var title = $(".title").val() === undefined ? '' : $(".title").val();
    var data = {
      page: b,
      num: 20,
      title: title
    }

    requestVideoajax(Videourl, data, a, b, title)

  }
  function requestVideoajax(url, data, a, b, title, type) {
    request('GET', url, data, function (res) {
      if (res.code == 200 && res.errorCode == 0) {
        if (res.data.length == 0 && b > 1) {
          return
        }
        if (type == 'search') {
          if (a == 'direct') {
            Videourl = API.getLiveListForNces
            LiveList = res.data
          } else if (a == 'source') {
            Videourl = API.getSourceListForNces
            SourceList = res.data
          } else if (a == 'singe') {
            Videourl = API.getSoldierListForNces
            SoldierList = res.data
          } else {
            Videourl = API.getUploadListForNces
            UploadList = res.data
          }
        }
        ajaxhtml(title, res.data, a, b)
      } else {
        console.log('error')
      }
    })
  }
  function ajaxhtml(title, data, a, b) {

    var top = "<span class = \"directSearch\">标题 : </span><input type=\"text\"  value = \"" + title + "\" onkeydown=\"trigger('" + a + "',1,'video')\" class=\"title directSearch\"/>\
          <span class = \"search\"  onclick=\"getVideo('"+ a + "',1)\"></span>"
    var center = "<div>" + showHtml(data, 'Mz') + "</div>";
    var bottom = "<div class = \"bottom_tips\"><span class = \"u-icon\"></span>如果有卡顿，请到 <span style = \"cursor:pointer\" onclick = \"$('.my_history').click()\">我的历史</span> 将视频加载到本地。</div>\
                    <div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"getVideo('"+ a + "'," + (b - 1) + ")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+ b + "</span>&nbsp\
                    <span class = \"next\" onclick=\"getVideo('"+ a + "'," + (b + 1) + ")\">下一页</span>\
                  </div>"
    NCES.Setcontent({ top: top, center: center, bottom: bottom })
  }
  /*设置video区域e*/


  /*设置img区域s*/
  function getImg(page) {
    if (page < 1) {
      return
    }
    var title = $(".title").val() === undefined ? '' : $(".title").val();
    type = "我的图片";
    request('GET', API.getImage, { num: 20, page: page, title: title }, function (res) {
      if (res.code == 200 && res.errorCode == 0) {
        if (page > 1 && res.data.length == 0) {
          return
        }
        var top = "<span class = \"directSearch\">标题 : </span><input type=\"text\" onkeydown=\"trigger()\"  value = \"" + title + "\" class=\"title directSearch\"/>\
                <span class = \"search\" onclick=\"getImg(1)\"></span>"
        var center = "<div>" + showHtml(res.data, "Tp") + "</div>";
        var bottom = "<div class = \"bottom_tips\"><div class = \"uploadfile\"><span></span><span>添加图片</span></div></div>\
              <div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"getImg("+ (page - 1) + ")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+ page + "</span>&nbsp\
                    <span class = \"next\" onclick=\"getImg("+ (page + 1) + ")\">下一页</span>\
                  </div>"
        NCES.Setcontent({
          top: top, center: center, bottom: bottom, func: function () {
            $('.uploadfile').click(function () {
              NCES.Uploadimg()
            })
          }
        })
      }
    });
  }

  /*设置video区域e*/
  /*设置资源列表s*/
  function showHtml(list, box) {
    var type = 1
    if (box == 'Tp') {
      type = 3;
    }
    var html = '';

    var year = 0;
    var mouth = 0;
    var day = 0;
    for (var i in list) {
      var date = new Date(Number(list[i].uptime) * 1000);
      var url_m3u8 = list[i].m3u8
      if (typeof url_m3u8 == 'string') {
        url_m3u8 = JSON.parse(list[i].m3u8)
      }
      var url = null
      if (list[i].url.match(/(bmp|png|jpg|jpeg|mp3|wma|aac|flac|wav|mp4|m3u8|flv|avi|mkv|mov)$/g)) {
        if (!list[i].url.match(/(bmp|png|jpg|jpeg)$/g)) {
          var urltype = false
          Object.values(url_m3u8).forEach(element => {
            if (element != null && element.match(/(mp4)$/g)) {
              urltype = true
            }
          });
        }
        if (list[i].url.match(/(bmp|png|jpg|jpeg)$/g)) {
          url = list[i].url
        } else if (urltype) {
          url = url_m3u8['mp4_1080'] || url_m3u8['mp4_720'] || url_m3u8['mp4_480'] || url_m3u8['mp4_360'] || url_m3u8['mp4_240'] || url_m3u8['mp4']
        } else {
          url = list[i].url
        }
      } else {
        url = url_m3u8['mp4_1080'] || url_m3u8['mp4_720'] || url_m3u8['mp4_480'] || url_m3u8['mp4_360'] || url_m3u8['mp4_240'] || url_m3u8['mp4'] || list[i].url
      }
      if (url == null) {
        url = list[i].url
      }
      url = url.replace(/https:/, '');
      url = url.replace(/http:/, '');
      html += '<div class = "video_option_content"> \
	          <div class = "content_top"> \
	          <img src= "'+ (list[i]['thumbnail'] ? (list[i]['thumbnail'] + '/145/80') : (url + '?resize/110')) + '" alt="" class = "content_top_img dragele" data-src_id = "9398a06022ad11e8bc6ffb74c30c6b5b" data-src_from ="http:' + url + '" data-src_type = ' + type + ' /> \
	          <div class = "content_top_down" style = "display:none;color:red" title = '+ url + '></div> \
	        </div> \
	        <div class = "content_mes clearfix"> \
	          <div title = "'+ list[i]['title'] + '">' + list[i]['title'] + '</div> \
            <div>'+ date.Format("yyyy.MM.dd") + '</div>\
	          <div>'+ (list[i]['duration'] ? formatDuration(list[i]['duration']) : '') + '</div> \
	        </div> \
	    </div>';
    }
    return html

  }
  /*设置资源列表e*/
  //图片上传相关事件
  function uploadImg() {
    var modifyName = $('#uploadtitle').val()
    var a = new FormData();
    $('.tipProp').css({
      'zIndex': '202'
    })
    if ($(".uploadimage")[0].files[0] == undefined) {
      $('.tipProp_content p').html('请选择要上传的图片！')
      $('.tipProp').show()
      window.zindex = 0
      return
    }
    if (!modifyName) {
      $('.tipProp_content p').html('请选择填写名称！')
      $('.tipProp').show()
      return
    }
    var reader = new FileReader();
    reader.onload = function (e) {
      var newfile = $('.uploadimage')[0]['files'][0]
      var imgsize = newfile.size
      var imgPath = newfile.name
      var imgdata = {
        imgPath: imgPath,
        modifyName: modifyName,
        imgUrl: reader.result,
      }
      var fileType = imgPath.substr(imgPath.lastIndexOf(".") + 1).toLowerCase()

      if (fileType.match(/(bmp|png|jpg|jpeg)/g)) {
        if (imgsize > 2 * 1024 * 1024) {
          $('.tipProp_content p').html('请选择小于2M的图片！')
          $('.tipProp').show()
        } else {
          request('POST', API.uploadImage,
            {
              imgPath: imgPath,
              modifyName: modifyName,
              imgUrl: reader.result,
            },
            function (res) {
              $('.tipProp_content p').html('上传成功')
              $('.tipProp').show()
              setTimeout(function () {
                $('.tipProp').hide();
                if (type == "我的图片") {
                  getImg(1)
                }
              }, 1000)
            }, 
            false
          ).fail(function (jqXHR, textStatus, errorThrown) {
            // net::ERR_CONNECTION_REFUSED 发生时，也能进入
            console.info("网络出错", jqXHR, textStatus, errorThrown);
            $('.uploadimg').hide()
          })
          $('.uploadimg').hide()
          window.zindex = 1
        }

      } else {
        $('.tipProp_content p').html('只允许图片格式！')
        $('.tipProp').show()
      }

    }
    reader.readAsDataURL($(".uploadimage")[0].files[0])
  }
  function celUpload() {
    $('.uploadimg').hide()
    window.zindex = 1
  }
  $('.uploadimage').change(function () {
    if ($('.uploadimage')[0]['files'][0]) {
      $('.imgfilepath').val($('.uploadimage')[0]['files'][0].name)
    } else {
      $('.imgfilepath').val('')
    }
  })


  //图片上传相关事件e
  /*格式化时间s*/
  function formatDuration(sec) {
    var min = parseInt(sec / 60);
    var sec = parseInt(sec % 60);
    // sec = sec>9?sec:'0'+sec
    var hour = parseInt(min / 60);
    min = min % 60;

    return (hour > 9 ? hour : '0' + hour) + ':' + (min > 9 ? min : '0' + min) + ':' + (sec > 9 ? sec : '0' + sec);
  }
  function tranTime(sec) {
    sec = sec / 1000
    var min = parseInt(sec / 60);
    var sec = parseInt(sec % 60);
    // sec = sec>9?sec:'0'+sec
    var hour = parseInt(min / 60);
    min = min % 60;
    if (hour == 0) {
      if (min == 0) {
        return (sec > 9 ? sec : '0' + sec) + '秒';
      } else {
        return (min > 9 ? min : '0' + min) + '分钟' + (sec > 9 ? sec : '0' + sec) + '秒'
      }
    } else {
      return (hour > 9 ? hour : '0' + hour) + '小时' + (min > 9 ? min : '0' + min) + '分钟' + (sec > 9 ? sec : '0' + sec) + '秒';
    }

  }
  function tranDate(sec) {
    var date = new Date(sec)
    var year = date.getFullYear()
    var month = (date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1))
    var day = date.getDate() > 10 ? date.getDate() : ('0' + date.getDate())

    return year + "年" + month + "月" + day + '日'

  }
  Date.prototype.Format = function (fmt) { //author: meizz   
    var o = {
      "M+": this.getMonth() + 1,                 //月份   
      "d+": this.getDate(),                    //日   
      "h+": this.getHours(),                   //小时   
      "m+": this.getMinutes(),                 //分   
      "s+": this.getSeconds(),                 //秒   
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度   
      "S": this.getMilliseconds()             //毫秒   
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
  }
  /*格式化时间e*/
  request('GET', API.getAccessInfo, {},
    function (data) {
      aodianAccessId = data.data.aodianAccessId;
      expires = data.data.expires;
      signature = data.data.signature;
      signatureNonce = data.data.signatureNonce;
      request('GET', API.getLogin, {},
        function (res) {
          var uin = res.data.aodianUin
          var aid = res.aid ? res.aid : 0
          // setnces(uin, aid)
        },
        function (err) {
          console.log(err)
        }
      )

    },
    function (err) {
      console.log(err)
    }
  )

  // function setnces(uin, aid) {
    /*配置选项s*/
    NCES.Config({
      //容器的id
      // "access_id": aodianAccessId,
      // "expires": expires,
      // "signature_nonce": signatureNonce,
      // "signature": signature,
      // aodianAccessId: "333472419164",
      // expires: 1563156037,
      // signature: "c2d0f758f8b403603408e99738938506",
      // signatureNonce: 1687,
      aodianAccessId: "783085342139",
      expires: 1563269428,
      signature: "15210f26a86bb627cb99b0299a442a47",
      signatureNonce: 9119,
      // aodianAccessId: "783085342139",
      // expires: 1563265245,
      // signature: "7b5b403157540fea6588ffe56d0f4f51",
      // signatureNonce: 2254,
      id: "nces",
      // 导播台域名
      domain: appId,
      uin: 35140/* 25492 */,//uin,
      mzList: [ // 若html不为空，interface不起作用
        {
          title: '现场存储',
          interface: getLiveListForNces,
          config: {
            showTitleSearch: true
          }
        },
        {
          title: '信源输入',
          interface: getSourceListForNces,
          config: {
            showTitleSearch: true
          }
        },
        {
          title: '单兵输入',
          interface: getSoldierListForNces,
          config: {
            showTitleSearch: true
          }
        },
        {
          title: '用户上传',
          interface: getUploadListForNces,
          config: {
            showTitleSearch: true
          }
        }
      ],
      // callbackResult: [],
      // // 自定义视频列表栏
      // mz_obj: "<li onclick=\"clickVideo('direct',1)\" class = \"active\">现场储存</li>\
      //       <li onclick=\"clickVideo('source',1)\">信源输入</li>\
      //       <li onclick=\"clickVideo('singe',1)\">单兵输入</li>\
      //       <li onclick=\"clickVideo('upload',1)\">用户上传</li>\
      //       ",
      // tp_obj: "<li onclick=\"getImg(1)\">我的图片</li>",
      //下拉拖进轨道的视频的类名，视频的信息也放在该元素上
      drag_ele: "dragele",
      // tip_ele: "content_top_down",
      checkMoney: checkMoney,
      captext: function (obj) {
        return "<p style = \"font-size:14px\">视频时长: " + obj.data + "<br>预计等待时间约: " + obj.trantime + "</p>"
      },
      saveas: function (obj) {
        request('POST', API.saveAsProject,
          {
            name: obj.data.name,
            project_id: obj.data.project_id,
            spec: obj.data.spec,
          },
          function (res) {
            console.log('saveAsProject 成功')
          },
          function (res) {
            console.log('saveAsProject  出错')
          }
        )
      },
      backStr: function (func) {
        var str = "_nces_" + aid
        func(str)
      }
    });
    /*配置选项e*/
    NCES.Init();//初始化
  // }
  function checkMoney(a, b) {
    request('POST', '//console.aodianyun.com/share/index.php?r=nces/checkUserBalance', { uin: 1011, amount: a },
      function (data) {
        if (data.Flag == 100) {
          var check = true
          if (data.bDestory === 1) {
            check = false
          }
          if (b) {
            b(data.price, check)
          }
        }
      }
    );
  }
  function downPers() {
    NCES.Gethistory(function (res) {
      var num = 0
      var domnode = null;
      var type = null
      for (var i = 0; i < res.data.length; i++) {
        domnode = $('[title="' + res.data[i].from + '"]')
        domnode.show()
        if (res.data[i].status <= 0) {
          domnode.html('加载失败').css('clolr', 'red').css('line-height', '62px')
        } else {
          if (res.data[i].src_type == 3) {
            type = 3;
            domnode.data('src_id', res.data[i].src_id)
              .data('bload', true)
              .data('url', res.data[i].preview_img)
              .data('sum_frame', 250)
              .css('background', 'rgba(0,0,0,0)')
              .addClass('dragele')
              .data('type', type)
          }
          if (res.data[i].src_type == 2) {
            type = 2
          }
          if (res.data[i].src_type == 1) {
            if (res.data[i].v_codec != undefined) {
              type = 1
            } else {
              type = 0
            }
            domnode.data('src_id', res.data[i].src_id)
              .data('bload', true)
              .data('url', res.data[i].preview_img)
              .data('sum_frame', res.data[i].sum_frame)
              .css('background', 'rgba(0,0,0,0)')
              .addClass('dragele')
              .data('type', type)
          }

        }
      }
    })
  }