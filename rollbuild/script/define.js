var define = (function() {
    var load_count = 0
    var load_jsqueue = []
    var load_cb
    function IEVersion() {
      var userAgent = navigator.userAgent //取得浏览器的userAgent字符串
      var isIE =
        userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 //判断是否IE<11浏览器
      var isEdge = userAgent.indexOf('Edge') > -1 && !isIE //判断是否IE的Edge浏览器
      var isIE11 =
        userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1
      if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);')
        reIE.test(userAgent)
        var fIEVersion = parseFloat(RegExp['$1'])
        if (fIEVersion == 7) {
          return 7
        } else if (fIEVersion == 8) {
          return 8
        } else if (fIEVersion == 9) {
          return 9
        } else if (fIEVersion == 10) {
          return 10
        } else {
          return 6 //IE版本<=7
        }
      } else if (isIE11) {
        return 11 //IE11
      } else if (isEdge) {
        return 'edge' //edge
      } else {
        return -1 //不是ie浏览器
      }
    }

    function loadFinished() {
      load_count++
      if (load_count < load_jsqueue.length) {
        loadScript()
        return
      }
      load_cb()
    }

    function loadError(oError) {
      console.error('The url ' + oError.target.src + ' is not accessible.')
    }
    function loadScript() {
      var url = load_jsqueue[load_count]
      var script = document.createElement('script')
      if (url.search(/-jsx/) != -1) {
        script.type = 'text/babel'
      } else {
        script.type = 'text/javascript'
      }
      if (script.readyState) {
        //IE
        script.onreadystatechange = function() {
          if (
            script.readyState == 'loaded' ||
            script.readyState == 'complete'
          ) {
            script.onreadystatechange = null
            loadFinished()
          }
        }
      } else {
        //Others
        script.onload = function() {
          loadFinished()
        }
      }
      script.onerror = loadError
      script.src = url
      ;(
        document.getElementsByTagName('body')[0] ||
        document.getElementsByTagName('head')[0]
      ).appendChild(script)
    }
    function loadCss(urls) {
      if (!urls || urls.length === 0) {
        throw new Error('argument "path" is required !')
      }
      for (var i = 0; i < urls.length; i++) {
        var head = document.getElementsByTagName('head')[0]
        var link = document.createElement('link')
        link.href = urls[i]
        link.rel = 'stylesheet'
        link.type = 'text/css'
        head.appendChild(link)
        link.onerror = loadError
      }
    }

    function loadMultiScript(urls, cb) {
      load_count = 0
      load_jsqueue = urls
      load_cb = cb || function() {}
      loadScript()
    }
    return {
      js: loadMultiScript,
      css: loadCss,
      ie: IEVersion
    }
  })()
  export default define