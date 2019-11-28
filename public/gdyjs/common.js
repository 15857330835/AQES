// 设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

// 获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

// 获取地址栏参数
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 获取环境 正式or频道
var CONSOLE_TOKEN_GDY = null
if (getQueryString('type') == 'mtsw') {
    CONSOLE_TOKEN_GDY = getCookie('CONSOLE_TOKEN_GDY_CHANNEL')
} else {
    CONSOLE_TOKEN_GDY = getCookie('CONSOLE_TOKEN_GDY')
}

// 二次封装ajax
function request(type, url, params, successCallback, errorCallback, isCache) {
    $.ajax({
        type: type,
        url: url,
        data: params,
        cache: isCache,
        xhrFields: {
            withCredentials: false
        },
        beforeSend: function (XMLHttpRequest) {
            XMLHttpRequest.setRequestHeader("X-Ca-Stage", 'TEST')
            // XMLHttpRequest.setRequestHeader("X-Ca-Stage", 'PRE')
            // XMLHttpRequest.setRequestHeader("X-Ca-Stage", '')
            XMLHttpRequest.setRequestHeader("token", CONSOLE_TOKEN_GDY)
        },
        dataType: 'JSON',
        success: function (res) {
            successCallback && successCallback(res);
        },
        error: function (res) {
            errorCallback && errorCallback(res);
        }
    })
}

