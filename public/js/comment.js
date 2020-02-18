/* eslint-disable */
;
(function() {
    "use strict";
    var nces = function() {
        this.pushurl = "";
    }
    var getjs = function () {
        var jsurl = [
            './static/plugin/nicescroll/nicescroll.js',
            './static/plugin/colorselect/spectrum.js',
            './static/plugin/lineProgressbar/nanobar.min.js',
            './static/plugin/input/select.js',
            "./static/plugin/My97DatePicker/WdatePicker.js",
        ];
        define.js(jsurl, function() {})};
    var define = (function() {
        var load_count = 0;
        var load_jsqueue = [];
        var load_cb;
        function IEVersion() {
            var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
            var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; //判断是否IE<11浏览器
            var isEdge = userAgent.indexOf("Edge") > -1 && !isIE; //判断是否IE的Edge浏览器
            var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
            if(isIE) {
                var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
                reIE.test(userAgent);
                var fIEVersion = parseFloat(RegExp["$1"]);
                if(fIEVersion == 7) {
                    return 7;
                } else if(fIEVersion == 8) {
                    return 8;
                } else if(fIEVersion == 9) {
                    return 9;
                } else if(fIEVersion == 10) {
                    return 10;
                }else {
                        return 6;//IE版本<=7
                    }   
                }else if(isIE11) {
                    return 11; //IE11  
                }  else if(isEdge) {
                    return 'edge';//edge
                } else{
                    return -1;//不是ie浏览器
                }
            
          
        }

        function loadFinished() {
            load_count++;
            if (load_count < load_jsqueue.length) {
                loadScript();
                return;
            }
            load_cb();
        }

        function loadError(oError) {
            console.error("The url " + oError.target.src + " is not accessible.");
        }
        function loadScript() {
            var url = load_jsqueue[load_count];
            var script = document.createElement('script');
            if(url.search(/-jsx/) != -1){
                script.type = "text/babel";
            } else {
                script.type = "text/javascript";
            } 
            if (script.readyState) { //IE
                script.onreadystatechange = function() {
                    if (script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        loadFinished();
                    }
                };
            } else { //Others
                script.onload = function() {
                    loadFinished();
                };
            }
            script.onerror = loadError;
            script.src = url;
            (document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0]).appendChild(script);
        };
        function loadCss(urls) {
            if (!urls || urls.length === 0) {
                throw new Error('argument "path" is required !');
            }
            for (var i = 0; i < urls.length; i++) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.href = urls[i];
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
                link.onerror = loadError;
            }
        };

        function loadMultiScript(urls, cb) {
            load_count = 0;
            load_jsqueue = urls;
            load_cb = cb || function() {};
            loadScript();
        }
        return {
            js: loadMultiScript,
            css: loadCss,
            ie:IEVersion
        };
    })();
    define.css([ "./static/css/global.css",
                "./static/css/rangeslider.css",
                './static/plugin/colorselect/spectrum.css',
                ], function() {});
    // $('body').append('<div class = \"onLoading\" style = \"display:block\">\
    //             <div class = \"onloading_content\">\
    //                 <span>努力加载中</span>\
    //                 <div class = \"loadingImg\"></div>\
    //             </div>\
    //           </div>')
    //判断是否引入vue.js文件
        
    // try{
    //     if(Vue){}
    // } catch(e) {
    //         define.js(['./js/vue.js'], function() {});
    // }
    function formatDuration(sec){
        var min = parseInt(sec/60);
        var sec = parseInt(sec%60);
        // sec = sec>9?sec:'0'+sec
        var hour = parseInt(min/60);
        min = min%60;
        
        return (hour>9?hour:'0'+hour)+':'+(min>9?min:'0'+min)+':'+(sec>9?sec:'0'+sec);
      }
    nces.prototype.Define = define.ie
    nces.prototype.Config = function(options) {
        for(var key in options){
            this[key] = options[key]
        }
        this.v = 'v_1.75.20181105'
        
         if('https' == window.location.href.slice(0,5)){
            this['DOMAIN']  = '//'+this.domain+'-'+this.uin+".lcps.aodianyun.com/3002"
            this['DOM']  = '//'+this.domain+'-'+this.uin+".lcps.aodianyun.com"
            this['D']  = this.domain+'-'+this.uin+".lcps.aodianyun.com"
        }else{
            this['DOMAIN']  = '//'+this.domain+'.'+this.uin+".lcps.aodianyun.com/3002"
            this['DOM']  = '//'+this.domain+'.'+this.uin+".lcps.aodianyun.com"
            this['D']  = this.domain+'.'+this.uin+".lcps.aodianyun.com"
        }
    };
    nces.prototype.Setcontent = function (obj) {
        var height = 90
        if(obj.top === undefined){
            $('.videolist_right_search').hide()
            height-=50
        }else{
            if(obj.top!=''){
                $('.videolist_right_search').html(obj.top)
                $('.videolist_right_search').show()
            }
        }
        if(obj.center===undefined){
            console.error('列表内容必须设置！')
        }else{
            if(obj.center != ''){
                $('.video_option').html(obj.center)
                
                $('.audio_control').click(function () {
                if(!$(this).hasClass('active')){
                    $('.audio_control').removeClass('active')
                    $(this).addClass('active')
                    $('#audio')[0].src = '//'+$(this).parent().find('img').data('src_url')
                    $('#audio')[0].play()
                }else{
                    $(this).removeClass('active')
                    $('#audio')[0].pause()
                }
                })
            }
        }
        if(obj.bottom === undefined){
            $('.videolist_right_bottom').hide()
            height-=40
        }else{
            if(obj.bottom!=''){
                $('.videolist_right_bottom').html(obj.bottom)
                $('.videolist_right_bottom').show()
            }
        }
        if(obj.func!=undefined){
            if((typeof obj.func)=='function'){
                obj.func()

            }else{
                console.error('obj.func is not a function !')
            }
        }
        $('.videolist_right').on('focus','input',function (e){
            window.zindex = 0
        })
        $('.videolist_right').on('blur','input',function (e){
           window.zindex = 1
        })
        $(".video_option").height('calc(100% - '+height+'px)')
        // $(".video_option").getNiceScroll().resize();
        
    }
    nces.prototype.showMrzy = function (data,typ,source){
        let type = typ;
        var other = ''
        var flag = 1;
        var color = 'transparent'
        if(source == "text_id"){
            flag = 2
        }
        if(source == "audio_id"){
            other = '<div class = "audio_control u-icon"></div>'
            flag = 1
        }
        if(source == "video_id"){
            flag = 1
        }
        if(source == 'image_id'){
            flag = 3
            color = '#fff'
        }
        var html = ''

        window.Mrzydata = data
        if(type=='动态文本') {
            for(var i = 0;i<data.length;i++){
                html += '<div class = "video_option_content"> \
                        <div class = "content_top" style = "background-color:'+color+'"> \
                        <img src= "//'+(data[i].preview_img)+'" data-jpg="//'+(data[i].preview_img)+'" data-gif="//'+data[i].preview_img_gif +'"  alt="" class = "dynamic_text content_top_img dragele" data-src_url = "'+data[i].url+'" data-src_from = "'+data[i][source]+'"  data-src_type = '+flag+' data-source = '+source+' /> \
                        '+other+'\
                        </div> \
                        <div class = "content_mes"> \
                            <div title = "'+data[i]['name']+'">'+data[i]['name']+'</div> \
                        </div> \
                    </div>';
            }
            
            return html
        }

        for(var i = 0;i<data.length;i++){
            html += '<div class = "video_option_content"> \
                    <div class = "content_top" style = "background-color:'+color+'"> \
                    <img src= "//'+(data[i].preview_img)+'" alt="" class = "content_top_img dragele" data-src_url = "'+data[i].url+'" data-src_from = "'+data[i][source]+'"  data-src_type = '+flag+' data-source = '+source+' /> \
                    '+other+'\
                    </div> \
                    <div class = "content_mes"> \
                        <div title = "'+data[i]['name']+'">'+data[i]['name']+'</div> \
                    </div> \
                </div>';
        }
        return html
    }
    nces.prototype.showZc = function (data,typ){
        type = typ;
        var other = ''
        var flag = 5;
        var html = ''
        window.Mrzydata = data
        for(var i = 0;i<data.length;i++){
            html += '<div class = "video_option_content"> \
                    <div class = "content_top"> \
                    <img src= "'+NCES.DOMAIN+data[i].preview_img_jpg+'" data-jpg = "'+data[i].preview_img_jpg+'" data-gif = "'+data[i].preview_img_gif+'" alt="" class = "content_top_img dragele" data-service = "'+data[i].service+'" /> \
                    </div> \
                    <div class = "content_mes"> \
                    <div title = "'+data[i]['name']+'">'+data[i]['name']+'</div> \
                    </div> \
                </div>';
        }
        return html
        // $("#videoContent"+box +' img').mouseover(function () {
        //     $(this).attr('src', NCES.DOMAIN +$(this).data('gif'))
        // })
        // $("#videoContent"+box +' img').mouseout(function () {
        //     $(this).attr('src', NCES.DOMAIN +$(this).data('jpg'))
        // })
        }
    nces.prototype.Getopenapi=function(url,data,func) {
            var obj = {expires:NCES.expires,signature_nonce:NCES.signature_nonce,signature:NCES.signature,access_id:NCES.access_id}
            $.extend(obj,data)
            $.ajax({
            type:'POST',
            url:'//openapi.aodianyun.com/v3/NCES.'+url,
            data:JSON.stringify(obj),
            dataType: 'JSON',
            success:function(res) {
                if(res.Flag == 100&&func){
                // addLeftlist('music',data.data)
                        func(res.data)
                }else{
                    console.warn(res)
                }
            }
        });
    }
    nces.prototype.getImage = function (a,b,c) {
        if(b<1 ){
            return
        }
        type = a
        var title = $(".title").val()===undefined?'':$(".title").val();
        if(c=='search'&&title!=''){
            var url = "ImageSearch";
            var data = {uin:NCES.uin,category:a,num:20,page:b,search_str:title}
        }else{
            title = ''
            url = "ImageList";
            data = {uin:NCES.uin,category:a,num:20,page:b}
        }
        this.Getopenapi(url,data,function (res){
            if(b>1&&res.length==0){
                return 
            }
            var top = "<span class = \"directSearch\">标题 : </span><input type=\"text\"   value = \""+title+"\"class=\"title directSearch\"/>\
                        <span class = \"search\" onclick=\"NCES.getImage('"+a+"',1,'search')\"></span>"
            var center;
            if(res.length>0){
               center = "<div>"+NCES.showMrzy(res,a,'image_id')+"</div>"
            }else{
                center = "<div class = \"contentnone\">当前已无内容啦!</div>"
            }
            var bottom = "<div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"NCES.getImage('"+a+"',"+(b-1)+")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+b+"</span>&nbsp\
                    <span class = \"next\" onclick=\"NCES.getImage('"+a+"',"+(b+1)+")\">下一页</span>\
                  </div>"
             NCES.Setcontent({top:top,center:center,bottom:bottom});

        })
    }
    nces.prototype.getAudio = function (a,b,c) {
        if(b<1 ){
            return
        }
        var title = $(".title").val()===undefined?'':$(".title").val();
        if(c=='search'&&title!=''){
            var url = "AudioSearch";
            var data = {uin:NCES.uin,category:a,search_str:title}
        }else{
            title = ''
            url = "AudioList";
            data = {uin:NCES.uin,category:a,num:20,page:b}
        }
        this.Getopenapi(url,data,function (res){
            if(b>1&&res.length==0){
                return 
            }
            var top = "<span class = \"directSearch\">标题 : </span><input type=\"text\"   value = \""+title+"\"class=\"title directSearch\"/>\
                        <span class = \"search\" onclick=\"NCES.getAudio('"+a+"',1,'search')\"></span>";
            var center;
            if(res.length>0){
                center = "<div>"+NCES.showMrzy(res,a,'audio_id')+"</div>"
            }else{
                center = "<div class = \"contentnone\">当前已无内容啦!</div>"
            }
            var bottom = "<div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"NCES.getAudio('"+a+"',"+(b-1)+")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+b+"</span>&nbsp\
                    <span class = \"next\" onclick=\"NCES.getAudio('"+a+"',"+(b+1)+")\">下一页</span>\
                  </div>"
            NCES.Setcontent({top:top,center:center,bottom:bottom});

        })
    }
    nces.prototype.getText = function (a,b,c) {
        if(b<1 ){
            return
        }
        this.Getopenapi('TextList',{uin:NCES.uin,category:a,num:20,page:b,aspect_ratio:window.aspect_ratio},function (res){
            if(b>1&&res.length==0){
                return 
            }
            var center;
            if(res.length>0){
                center = "<div class = \"textContent\">"+NCES.showMrzy(res,a,'text_id')+"</div>"
            }else{
                center = "<div class = \"contentnone\">当前已无内容啦!</div>"
            }
            var bottom = "<div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"NCES.getText('"+a+"',"+(b-1)+")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+b+"</span>&nbsp\
                    <span class = \"next\" onclick=\"NCES.getText('"+a+"',"+(b+1)+")\">下一页</span>\
                  </div>"
            if(c==undefined){
            }
            switch (c){
                case undefined:{
                    NCES.Setcontent({center:center,bottom:bottom, func:function(){
                        $(".dynamic_text").mouseover(function () {
                            // console.log('mouseover')
                            $(this).attr('src', $(this).data('gif'))
                        })
                        $(".dynamic_text").mouseout(function () {
                            // console.log('mouseout')
                            $(this).attr('src', $(this).data('jpg'))
                        })
                     }});
                    break
                }
                case "last":{
                    NCES.Setcontent({center:center,bottom:bottom})
                    break;  
                }
            }

        })
    }
    nces.prototype.getZcdh = function () {
        $.post(NCES.DOMAIN+'/api/transition',
            JSON.stringify({ "cmd": "all"}),
            function(res) {
                if (res.code !== 0) {
                    console.warn(res.msg)
                    return
                }
                var center = "<div id = \"videoContent\">"+NCES.showZc(res.data)+"</div>"
                NCES.Setcontent({center:center,func:function () {
                    $("#videoContent img").mouseover(function () {
                        $(this).attr('src', NCES.DOMAIN +$(this).data('gif'))
                    })
                    $("#videoContent img").mouseout(function () {
                        $(this).attr('src', NCES.DOMAIN +$(this).data('jpg'))
                    })
                }});
            }, "json")
    }
    nces.prototype.getZcsp= function (a,b,c) {
        if(b<1 ){
            return
        }
        var title = $(".title").val()===undefined?'':$(".title").val();
        if(c=='search'&&title!=''){
            var url = "VideoSearch";
            var data = {uin:NCES.uin,category:a,search_str:title}
        }else{
            title = ''
            url = "VideoList";
            data = {uin:NCES.uin,category:a,num:20,page:b}
        }
        this.Getopenapi(url,data,function (res){
            if(b>1&&res.length==0){
                return 
            }
            var top = "<span class = \"directSearch\">标题 : </span><input type=\"text\"   value = \""+title+"\"class=\"title directSearch\"/>\
                        <span class = \"search\" onclick=\"NCES.getZcsp('"+a+"',1,'search')\"></span>";
            var center;
            if(res.length>0){
                center = "<div>"+NCES.showMrzy(res,a,'video_id')+"</div>"
            }else{
                center = "<div class = \"contentnone\">当前已无内容啦!</div>"
            }
            var bottom = "<div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"NCES.getZcsp('"+a+"',"+(b-1)+")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+b+"</span>&nbsp\
                    <span class = \"next\" onclick=\"NCES.getZcsp('"+a+"',"+(b+1)+")\">下一页</span>\
                  </div>"
                    NCES.Setcontent({top:top,center:center,bottom:bottom});

        })
    }

     nces.prototype.Uploadimg = function (a){
        $('.uploadimg').show()
        if(a){
            this.uploadimgsuc = a
        }
            
    } 
   nces.prototype.getProducerevent = function (a){
        if(a<1){
            return
        }
        
        type = "producer";
        NCES.Getproducer({index:a},function (res ){
            if(res.data.length == 0 &&a!=1){
                return
            }
            var center = "<div>"+NCES.getProducer(res)+"</div>"
            var bottom = "<div class = \"bottom_fanye\">\
                        <span class = \"last\" onclick=\"NCES.getProducerevent("+(a-1)+")\">上一页</span>&nbsp\
                        <span class = \"now\" id=\"Page\">"+a+"</span>&nbsp\
                        <span class = \"next\" onclick=\"NCES.getProducerevent("+(a+1)+")\">下一页</span>\
                        </div>";
            NCES.Setcontent({center:center,bottom:bottom,func:function (){
                $('.btn_del').click(function (){
                    var that = this
                    Hub.$emit('delMode',{title:'取消生成视频',content:'你确定要取消该视频的生成？',type:'producer',id:$(that).data('id')})
                })
            }})
        });
    }
    nces.prototype.getProducer=function (res) {
        if (res.code !== 0) {
                $('.tipProp_content p').html('获取信息失败，请重试！')
                $('.tipProp').show()
                return
            }

            if(res.data.length!=0&&timer==null&&type=="producer"){
            timer = setInterval(function() {
                    var a = $('#Page').val() 
                    NCES.Getproducer({index:1},function (res ){
                    if(res.data.length == 0 &&a!=1){
                        return
                    }
                    var center = "<div>"+NCES.getProducer(res)+"</div>"
                    if(type!='producer'){
                        return
                    }
                    NCES.Setcontent({center:center,bottom:'',func:function (){
                        $('.btn_del').click(function (){
                            var that = this
                            Hub.$emit('delMode',{title:'取消生成视频',content:'你确定要取消该视频的生成？',type:'producer',id:$(that).data('id')})
                        })
                    }})
                });
            },1000)
            }
            if(res.data.length==0||type!="producer"){
            clearInterval(timer);
            timer = null;
            }
            var html = ""
            var tip = ''
            var width = 0;

            for(var i = 0;i<res.data.length;i++){
            if(res.data[i].status==0){
                tip = "<span style = 'color:red'>下载失败</span>";
                width = '100%'
            }
            if(res.data[i].status==1){
                tip = "<span style = 'color:red'>等待中</span>"
                width = '100%'
            }
            if(res.data[i].status==2){
                tip = "<span>"+ (res.data[i].progress||0)+"%</span>"
                width = (res.data[i].progress||0)+'%'
            }

            html+='<div class = "wdgc_content">\
                                <div class = "wdgc_content_mes">\
                                <div class = "mes_list clearfix">\
                                    <div class = "mes_list_img"><img src="//cdn.aodianyun.com/nces/v1/img/scdemo.png" alt="" height=70px /></div>\
                                    <div class = "mes_list_text">\
                                    <span>'+res.data[i].name+'</span><br/>\
                                    <span>时长:'+tranTime(res.data[i].duration)+'</span><br/>\
                                    <span>日期:'+tranDate(res.data[i].start_time||res.data[i].time)+'</span>\
                                    </div>\
                                </div>\
                                <div class = "mes_tip" style = "width:'+width+'">\
                                    '+tip+'\
                                </div>\
                                </div>\
                                <div class = "wdgc_content_del">\
                                <span title = "删除视频" class = "btn_del u-icon" data-type = "producer" data-id = '+res.data[i].producer_id+'></span>\
                                </div>\
                            </div>'
            }
        return html

            
        
}
nces.prototype.getProject = function (res) {
  if (res.code !== 0) {
        $('.tipProp_content p').html('获取信息失败，请重试！')
        $('.tipProp').show()
        return
    }
    if(res.data.length==0&&page>1){
      page = page - 1;
      alert('没有数据了！')
      return
    }
    var center = ''
    var str = NCES.strOfname==undefined?'':NCES.strOfname
   if(loadProject!=undefined){
     center = '<div class = "wdgc_content" style = "border:1px solid #61ded0">\
                        <div class = "wdgc_content_mes">\
                          <div class = "mes_list clearfix">\
                            <div class = "mes_list_img"><img src="//cdn.aodianyun.com/nces/v1/img/gcdemo.png" alt="" height=70px /></div>\
                            <div class = "mes_list_text">\
                              <span>\
                                <span class = "oldName">'+loadProject.name.replace(str,'')+'</span>\
                                <input class = "newName" type="text" value = "'+loadProject.name.replace(str,'')+'" />\
                              </span><span class = "wdgc_rename u-icon" data-id = "'+loadProject.project_id+'"></span><br/>\
                              <span>时长: '+tranTime(loadProject.duration)+'</span><br/>\
                              <span>日期: '+tranDate(loadProject.start_time||loadProject.time)+'</span>\
                            </div>\
                          </div>\
                        </div>\
                        <div class = "wdgc_content_del">\
                          <span style = "color:#61ded0">当前工程</span>\
                          <span title = "加载工程" style = "left:10px" class= "btn_set u-icon" data-type = "project" data-id = "'+loadProject.project_id+'"></span>\
                        </div>\
                      </div> '
   }else{
         center = '<div class = "wdgc_content" style = "border:1px solid #61ded0;height:50px">\
                       \
                        <div style = "height:40px;text-align:center;">\
                          <span style = "line-height:40px; color:red">暂无当前工程</span>\
                        </div>\
                      </div>'
   }
    for(var i = 0;i<res.data.length;i++){
      

      center+='<div class = "wdgc_content">\
                        <div class = "wdgc_content_mes">\
                          <div class = "mes_list clearfix">\
                            <div class = "mes_list_img"><img src="//cdn.aodianyun.com/nces/v1/img/gcdemo.png" alt="" height=70px /></div>\
                            <div class = "mes_list_text">\
                              <span>\
                                <span class = "oldName">'+res.data[i].name.replace(str,'')+'</span>\
                                <input class = "newName" type="text" value = "'+res.data[i].name.replace(str,'')+'" />\
                              </span><span class = "wdgc_rename u-icon" data-id = "'+res.data[i].project_id+'"></span><br/>\
                              <span>时长: '+tranTime(res.data[i].duration)+'</span><br/>\
                              <span>日期: '+tranDate(res.data[i].start_time||res.data[i].time)+'</span>\
                            </div>\
                          </div>\
                        </div>\
                        <div class = "wdgc_content_del">\
                          <span title = "删除工程" class = "btn_del u-icon" data-type = "project" data-id = "'+res.data[i].project_id+'" ></span>\
                          <span title = "加载工程" class= "btn_set u-icon" data-type = "project" data-id = "'+res.data[i].project_id+'" data-name = "'+res.data[i].name+'"></span>\
                        </div>\
                      </div> '
    }
    return center
          
    
}

    nces.prototype.getProjectevent = function (a,way){
        if(a<1){
            return
        }
        var title = $(".title").val()===undefined?'':$(".title").val();
        type = "project";
        clearInterval(timer);
        timer = null;
        if(way=='search'&&title!=''){
            var data = {'cmd':'search','name':title}
        }else{
            data = {'cmd':'get','index':a}
        }
        NCES.Getproject(data,function(res) {
            if(res.data.length==0&&a!=1){
                return
            }
            var top = "<span class = \"directSearch\">标题 : </span><input type=\"text\"   value = \""+title+"\"class=\"title directSearch\"/>\
                        <span class = \"search\" onclick=\"NCES.getProjectevent(1,'search')\"></span>"
            var center = "<div>"+NCES.getProject(res)+"</div>";
            if(way!='search'){
            var bottom = "<div class = \"bottom_fanye\">\
                <span class = \"last\" onclick=\"NCES.getProjectevent("+(a-1)+")\">上一页</span>&nbsp\
                <span class = \"now\" id=\"Page\">"+a+"</span>&nbsp\
                <span class = \"next\" onclick=\"NCES.getProjectevent("+(a+1)+")\">下一页</span>\
                </div>"
            }else{
            bottom = "<div class = \"bottom_fanye\">\
                <span class = \"last\">上一页</span>&nbsp\
                <span class = \"now\" id=\"Page\">"+a+"</span>&nbsp\
                <span class = \"next\" >下一页</span>\
                </div>"
            }
            NCES.Setcontent({top:top,center:center,bottom:bottom,func:function(){
                var str = NCES.strOfname==undefined?'':NCES.strOfname
                $('.btn_del').click(function (){
                    var that = this
                    Hub.$emit('delMode',{title:'删除工程',content:'你确定要删除当前工程？',type:'project',id:$(that).data('id')})
                })
                $('.btn_set').click(function(){
                    $('.loadProject').show()

                    $('.loadProject').data('project-id',$(this).data('id'))
                })
                $('.newName').blur(function () {
                    if($(this).val() == ''){
                    $('.tipProp_content p').html('工程名称不能为空！')
                    $('.tipProp').show();
                    return
                    }
                    $(this).parent().parent().find('.wdgc_rename').removeClass('active')  
                    $(this).parent().find('.oldName').html($(this).val())
                    $(this).parent().find('.oldName').show()
                    $(this).hide()
                    NCES.Renameproject({project_id:$(this).parent().parent().find('.wdgc_rename').data('id'),name:$(this).val()+str})
                    window.zindex = 1
                })
                $('.wdgc_rename').click(function() {
                    var that = this
                    if($(this).hasClass('active')){
                    if($(this).parent().find('.newName').val() == ''){
                        $('.tipProp_content p').html('工程名称不能为空！')
                        $('.tipProp').show();
                        return
                    }
                    $(this).removeClass('active')
                    $(this).parent().find('.oldName').html($(this).parent().find('.newName').val())
                    $(this).parent().find('.oldName').show()
                    $(this).parent().find('.newName').hide()
                    NCES.Renameproject({project_id:$(this).data('id'),name:$(this).parent().find('.newName').val()+str})
                    window.zindex = 1
                    }else{
                    $(this).addClass('active')
                    $(this).parent().find('.oldName').hide()
                    $(this).parent().find('.newName').show().focus(function () {
                        $(this).parent().find('.newName').keydown(function (e) {
                        e = e||window.event
                        if(e.keyCode==13){
                            if($(this).parent().find('.newName').val() == ''){
                            $('.tipProp_content p').html('工程名称不能为空！')
                            $('.tipProp').show();
                            return
                            }
                            $(that).removeClass('active')
                            $(that).parent().find('.oldName').html($(that).parent().find('.newName').val())
                            $(that).parent().find('.oldName').show()
                            $(that).parent().find('.newName').hide()
                            NCES.Renameproject({project_id:$(that).data('id'),name:$(that).parent().find('.newName').val()+str})
                            window.zindex = 1
                        }
                        })
                    }).select();
                    window.zindex = 0
                    }
                    
                })
            }})
        })
    } 
     nces.prototype.Getproducer = function (a,b) {
        var data = {"cmd":'get'}
        for(var key in a){
                data[key] = a[key]
            }
        $.post(this.DOMAIN+"/api/producer",JSON.stringify(data),function (res) {
                if(b){
                    b(res)
                }
            },"json")
    }
    nces.prototype.Delproducer = function (a,b) {
        var data = {"cmd":'del'}
        for(var key in a){
                data[key] = a[key]
            }
        $.post(this.DOMAIN+"/api/producer",JSON.stringify(data),function (res) {
                if(b){
                    b(res)
                }
            },"json")
    }
    nces.prototype.Getproject = function (a,b) {
        $.post(this.DOMAIN+"/api/project",JSON.stringify(a),function (res) {
                if(b){
                    b(res)
                }
            },"json")
    }

    nces.prototype.Loadproject = function (a,b) {
        var data = {"cmd":'load'}
        for(var key in a){
                data[key] = a[key]
            }
        $.post(this.DOMAIN+"/api/project",JSON.stringify(data),function (res) {
                if(b){
                    b(res)
                }
            },"json")
    }
    nces.prototype.Delproject = function (a,b) {
        var data = {"cmd":'del'}
        for(var key in a){
                data[key] = a[key]
            }
        $.post(this.DOMAIN+"/api/project",JSON.stringify(data),function (res) {
                if(b){
                    b(res)
                }
            },"json")
        
    }
    nces.prototype.Renameproject = function (a,b) {
        var data = {"cmd":'rename'}
        for(var key in a){
                data[key] = a[key]
            }
        $.post(this.DOMAIN+"/api/project",JSON.stringify(data),function (res) {
                if(b){
                    b(res)
                }
            },"json")
    }
    nces.prototype.Getcaptionstyles = function (callback){
            $.post(this.DOMAIN+"/api/caption",JSON.stringify({"cmd":"style_list"}),function (res) {
                if(res.code!=0){
                    console.error(res.msg)
                    return
                }
                if(!!callback && res.data.length != 0){
                    callback(res.data)
                }
                window.type = "caption"
                var html = ''
                var cla = ''
                for(var i = 0;i<res.data.length;i++){
                    if(res.data[i].style==window.captionStyle.status.style&&window.captionStyle.chunks.length>0){
                        cla = 'active'
                    }else{
                        cla = ''
                    }
                    html+="<div class = \"video_option_content\" style = \"width:192px;padding:5px 5px 0px;margin-bottom:15px\"> \
                                <div class = \"content_top "+cla+"\" style = \"height:108px\"> \
                                    <img src= \"//"+res.data[i].preview_img+"\" alt=\"\" class = \"content_top_img\"  style = \"height:108px\" mousedown = function(e){e.preventDefault()} /> \
                                    <span  class = \"zmTouse\" data-style = \""+res.data[i].style+"\">应用</span>\
                                    <span class = \"zmSuccess\"></span>\
                                </div> \
                            </div>"
                }
                NCES.Setcontent({center:"<div>"+html+"</div>"});    
            },"json")
    }
    nces.prototype.Getaicaptionstyles = function (){
            $.post(this.DOMAIN+"/api/ai",JSON.stringify({"cmd":"list"}),function (res) {
                window.aiList = res.data
                if(res.code!=0){
                    console.error(res.msg)
                    return
                }
                $.post(NCES.DOMAIN+"/api/ai",JSON.stringify({"cmd":"status"}),function (data) {
                    if(data.data.service == null||(data.data.service!=null&&data.data.state=='error')){
                            var html = ''
                            for(var i = 0;i<res.data.length;i++){
                                html+="<div class = \"video_option_content\" style = \"width:100%;box-sizing:border-box;height:90px;padding:5px 5px 0px;margin-bottom:15px\"> \
                                            <div class = \"content_top\" style = \"height:85px\"> \
                                                <img  src= \"//"+res.data[i].preview_img+"\" alt=\"\" class = \"content_top_img\"  style = \"height:85px;width:100%;cursor:auto\" mousedown = function(e){e.preventDefault()} /> \
                                                <span  class = \"znTouse\" data-index = \""+i+"\" data-service = \""+res.data[i].service+"\">应用</span>\
                                                <span class = \"znTitle\">"+res.data[i].name+"</span>\
                                            </div> \
                                        </div>"
                            }
                            NCES.Setcontent({center:"<div>"+html+"</div>"});
                    }else{
                        Hub.$emit('changeing',data.data.service)
                        
                    }               
                })
                
                
            },"json")
    }
    nces.prototype.Gethistory = function (a){
            $.post(this.DOMAIN+"/api/source",JSON.stringify({"cmd":"all"}),function (res) {
                a(res)
            },"json")
    }
    
    var historyTimer;
    nces.prototype.Getsomehistory = function (a,b){
        if(b<1 ){
            return
        }
        var data = {"cmd":"get_list",src_type:a,number:20,index:b}
            $.post(this.DOMAIN+"/api/source",JSON.stringify(data),function (res) {
                
                if (res.code !== 0) {
                    $('.tipProp_content p').html('获取我的媒资失败，请重试！')
                    $('.tipProp').show()
                    return
                }
                if(b>1&&res.data.length==0){
                    return 
                }
                var html = "";
                var num = 0;
                var tip = null;
                var por = "";
                var color = "#fff"
                var bgc = 'rgba(0,0,0,0.3)'
                var type = 1;
                var url = ''
                for (var i = 0; i < res.data.length; i++) {
                bgc = 'rgba(0,0,0,0.3)'
                    if(res.data[i].src_type === 3){
                    //说明是图片
                    }
                    if(res.data[i].preview_img == null){
                        if(res.data[i].status<1){
                        }else{
                        tip = '下载中'
                        html += '<div class = "video_option_content">\
                                    <div  data-src_id = "'+res.data[i].src_id+'">\
                                        <div class = "content_top"><span class = "content_top_img">'+tip+'</span></div>\
                                        <div class = "content_mes">\
                                            <div title = '+res.data[i].name+' >'+res.data[i].name+'</div>\
                                            <div>'+res.data[i].progress.toFixed(0)+'%</div>\
                                        </div>\
                                    </div>\
                                </div>';
                        }
                    
                    
                    }else {
                    if(res.data[i].src_type == 3){
                        type = 3
                    }
                    if(res.data[i].src_type ==2){
                        type =2
                    }
                    if(res.data[i].src_type ==1){
                        if(res.data[i].v_codec!=undefined){
                        type = 1
                        }else{
                        type = 0
                        }
                    }
                    if(res.data[i].bload){
                        if(res.data[i].src_type ==1){
                            if(res.data[i].status==1){
                                por = '下载中 '+ parseInt(res.data[i].progress)+'%'
                                color="#fff"

                                num++
                                }
                            if(res.data[i].status==2){
                                por = '下载失败'
                                color = 'red'
                            }
                            if(res.data[i].status==3){
                                por = ''
                                color="#fff"
                                bgc = 'rgba(0,0,0,0)'
                            }
                        }
                        url = res.data[i].preview_img
                        url = url.replace(/http:/,'');
                        url = url.replace(/https:/,'');
                        if(url.indexOf('//')==-1){
                            if(type ==2||res.data[i].uncapture_preview_img){
                            url = '//'+url
                            }else{
                            url = NCES.DOMAIN+url
                            }
                        }
                        html += '<div class = "video_option_content"><div class = "" >\
                                <div class = "content_top">\
                                <img src="'+url+'" class = "content_top_img " alt="" />\
                                <div class = "content_top_down" style = "background-color:'+bgc+'">\
                                <span  class = "per dragele" style = "color:'+color+' "  data-src_from = "'+res.data[i].from+'" >'+por+'</span>\
                                </div> \
                            </div>\
                            <div class = "content_mes">\
                            <div title = "'+res.data[i].name+' ">'+res.data[i].name+'</div>\
                            <div>'+(res.data[i].sum_frame==undefined?"": formatDuration(res.data[i].sum_frame / 25))+'</div>\
                            </div>\
                        </div></div>'
                        
                        
                    }else {
                        
                        html += '<div class = "video_option_content">\
                                <div class = "" data-src_id = "'+res.data[i].src_id+'">\
                                    <div class = "content_top">\
                                        <img src="'+((type==2||res.data[i].uncapture_preview_img)?"//":NCES.DOMAIN)+res.data[i].preview_img+'" class = "content_top_img" alt=""/>\
                                        <div class = "content_top_down" style = "background-color:'+bgc+'" >\
                                            <span class = "per dragele"  data-src_from = "'+res.data[i].from+'"></span>\
                                            <span class = "sourceDown" data-src_from = "" data-src_type = "1" data-src_id = "'+res.data[i].src_id+'"></span>\
                                        </div>\
                                    </div>\
                                    <div class = "content_mes">\
                                        <div title = "'+res.data[i].name+'" >'+res.data[i].name+'</div>\
                                        <div>'+(res.data[i].sum_frame==undefined?"": formatDuration(res.data[i].sum_frame / 25))+'</div>\
                                    </div>\
                                </div>\
                                </div>'
                    }
                    }    
                }

                // $(".video_option>div.wdmz").html(html)
                var center = "<div>"+html+"</div>"
                var bottom = "<div class = \"bottom_fanye\">\
                    <span class = \"last\" onclick=\"NCES.Getsomehistory("+a+","+(b-1)+")\">上一页</span>&nbsp\
                    <span class = \"now\" id=\"Page\">"+b+"</span>&nbsp\
                    <span class = \"next\" onclick=\"NCES.Getsomehistory("+a+","+(b+1)+")\">下一页</span>\
                  </div>"
                NCES.Setcontent({center:center,bottom:bottom,func:function () {
                    $('.sourceDown').on('click',function (e) {
                        e = e||window.event;
                        e.preventDefault()
                        NCES.Loadhistory({'src_id':$(e.target).data('src_id')},function (ress) {
                            // alert(a.code)
                            if(ress.code!=0){
                            $('.tipProp_content p').html('该地址不存在或已下载！')
                            $('.tipProp').show()
                            return
                        }
                            NCES.Getsomehistory(a,b)
                            downPers()
                        })
                    });
                    if(num>0){
                        historyTimer = setTimeout(function() {
                            if($(".list_leftlist>li.active").html()==='历史媒资'){
                                NCES.Getsomehistory(a,b)
                            }
                            clearTimeout(historyTimer)
                        }, 3000);
                    }
                }});
                

            },"json")
    }
    nces.prototype.Loadhistory = function (a,b) {
        $.post(this.DOMAIN+"/api/source",JSON.stringify({"cmd":"load","src_id":a.src_id}),function (res) {
                if(b){b(res)}
            },"json")
    }
    nces.prototype.Delhistory = function (a) {
        $.post(this.DOMAIN+"/api/source",JSON.stringify({"cmd":"del","src_id":a.src_from,}),function (res) {
                if(a){a(res)}
            },"json")
    }
    // nces.prototype.Getsavelist = function (a) {
    //     var data = null;
    //     $.post(this.DOMAIN+"/api/output",JSON.stringify({"cmd":"all"}),function (res) {
    //             a(res)
    //         },"json")
    // }







    nces.prototype.Init = function(cb) {
        cb = cb || function() {};


        var box = $('#'+NCES.id);
        var ie = define.ie()    
        // if(ie == 6||ie == 7|| ie == 8||ie == 9|| ie == 10){
        //     var strVar = "";
            
        //     box.append(strVar)
        //     return
        // }else {
        //     box.append('<my-component></my-component>')
        // }

        getjs()
        
    };

    window.NCES = new nces;
}());