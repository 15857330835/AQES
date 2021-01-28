/**
   * 动态加载JS
   * @param {string} url 脚本地址
   * @param {function} callback  回调函数
   */
  const dynamicLoadJs = (url, callback) => {
    
    let head = document.getElementsByTagName('head')[0]
    let script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    if (typeof callback == 'function') {
      script.onload = script.onreadystatechange = function() {
        if (
          !this.readyState ||
          this.readyState === 'loaded' ||
          this.readyState === 'complete'
        ) {
          callback()
          script.onload = script.onreadystatechange = null
        }
      }
      script.onerror = function() {
        head.removeChild(script)
        setTimeout(function() {
          dynamicLoadJs(url, callback)
        }, 500)
      }
    }
    head.appendChild(script)
  }
  export default dynamicLoadJs