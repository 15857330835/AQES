(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.AQES = factory());
}(this, (function () { 'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var _css_urls$js_urls = {
    "css_urls": ["//fm.aodianyun.com/qes+/dist/css/app.css", "//fm.aodianyun.com/qes+/dist/css/chunk-vendors.css"],
    "js_urls": ["//fm.aodianyun.com/qes+/dist/js/app.js", "//fm.aodianyun.com/qes+/dist/js/chunk-vendors.js", "//fm.aodianyun.com/qes+/dist/js/comment.js", "//fm.aodianyun.com/qes+/dist/js/nces.js"]
  },
      css_urls = _css_urls$js_urls.css_urls,
      js_urls = _css_urls$js_urls.js_urls;

  var define = function () {
    var load_count = 0;
    var load_jsqueue = [];
    var load_cb;

    function IEVersion() {
      var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

      var isIE = userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1; //判断是否IE<11浏览器

      var isEdge = userAgent.indexOf('Edge') > -1 && !isIE; //判断是否IE的Edge浏览器

      var isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf('rv:11.0') > -1;

      if (isIE) {
        var reIE = new RegExp('MSIE (\\d+\\.\\d+);');
        reIE.test(userAgent);
        var fIEVersion = parseFloat(RegExp['$1']);

        if (fIEVersion == 7) {
          return 7;
        } else if (fIEVersion == 8) {
          return 8;
        } else if (fIEVersion == 9) {
          return 9;
        } else if (fIEVersion == 10) {
          return 10;
        } else {
          return 6; //IE版本<=7
        }
      } else if (isIE11) {
        return 11; //IE11
      } else if (isEdge) {
        return 'edge'; //edge
      } else {
          return -1; //不是ie浏览器
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
      console.error('The url ' + oError.target.src + ' is not accessible.');
    }

    function loadScript() {
      var url = load_jsqueue[load_count];
      var script = document.createElement('script');

      if (url.search(/-jsx/) != -1) {
        script.type = 'text/babel';
      } else {
        script.type = 'text/javascript';
      }

      if (script.readyState) {
        //IE
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
            loadFinished();
          }
        };
      } else {
        //Others
        script.onload = function () {
          loadFinished();
        };
      }

      script.onerror = loadError;
      script.src = url;
      (document.getElementsByTagName('body')[0] || document.getElementsByTagName('head')[0]).appendChild(script);
    }

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
    }

    function loadMultiScript(urls, cb) {
      load_count = 0;
      load_jsqueue = urls;

      load_cb = cb || function () {};

      loadScript();
    }

    return {
      js: loadMultiScript,
      css: loadCss,
      ie: IEVersion
    };
  }();

  var initRootHost = function initRootHost() {
    var getScriptSrc = function getScriptSrc(srcName) {
      var scripts = document.getElementsByTagName('script');

      for (var i = scripts.length - 1; i >= 0; i--) {
        var scriptSrc = scripts[i].getAttribute('src');

        if (scriptSrc.includes(srcName)) {
          return scriptSrc;
        }
      }

      return '';
    };

    var getRootHost = function getRootHost(scriptSrc) {
      if (scriptSrc === '') {
        return '';
      }

      var reg = /\/\/([^/]*?)\//;
      var host = reg.exec(scriptSrc);
      var isIP = /\d+.\d+.\d+.\d+:\d+/.test(host);

      if (!host || host.length < 2 || isIP) {
        return '';
      }

      var splitArr = host[1].split('.');
      var len = splitArr.length;

      if (len < 2) {
        console.log(splitArr);
        return '';
      } else {
        return "".concat(splitArr[len - 2], ".").concat(splitArr[len - 1]);
      }
    };

    window.appointConfig = {
      ROOT_HOST: getRootHost(getScriptSrc('comment.js')) || 'aodianyun.com',
      STATIC_PROTOCOL: /https/i.test(window.location.href) ? 'https:' : 'http:'
    };
  };

  initRootHost();

  var lcps = /*#__PURE__*/function () {
    function lcps() {
      _classCallCheck(this, lcps);
    }

    _createClass(lcps, [{
      key: "Config",
      value: function Config(options) {
        for (var key in options) {
          this[key] = options[key];
        }
      }
    }, {
      key: "Init",
      value: function Init() {
        define.js(js_urls, function () {});
        define.css(css_urls, function () {});
      }
    }]);

    return lcps;
  }();

  var index = new lcps();

  return index;

})));
//# sourceMappingURL=comment.js.map
