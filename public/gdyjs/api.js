// api接口集中管理
var baseUrl = '//consoleapi.guangdianyun.tv/v1'
var API = {
    getLiveListForNces: baseUrl + '/mss/Index/getLiveListForNces', // 现场存储
    getSourceListForNces: baseUrl + '/mss/Index/getSourceListForNces', // 信源输入
    getSoldierListForNces: baseUrl + '/mss/Index/getSoldierListForNces', // 单兵输入
    getUploadListForNces: baseUrl + '/mss/Index/getUploadListForNces', // 用户上传
    getImage: baseUrl + '/gadge/nces/getImage', // 获取图片
    uploadImage: baseUrl + '/gadge/nces/uploadImage', // 上传图片
    getAccessInfo: baseUrl + '/gadge/nces/getAccessInfo', // 获取授权
    saveAsProject: baseUrl + '/gadge/ncesNew/saveAsProject', // 保存工程
    getLogin: baseUrl + '/Passport/Index/getLogin', // 获取登录信息
}
/**
 * 对接底层列表接口方法
 */
function getLiveListForNces({ page, num, title },callback) {
    var data = {
        page,
        num,
        title
    }
    request('GET', API.getLiveListForNces, data, function (res) {
        if (res.code === 200 && res.errorCode === 0) {
            try {
                NCES.callbackResult = res.data.map(item => {
                    return {
                        title: item.title,
                        thumbnail: item.thumbnail,
                        duration: item.duration,
                        date: item.uptime,
                        id: item.id,
                        url: item.url
                    }
                })
            }
            catch{
                NCES.callbackResult = []
            }
            callback && callback(NCES.callbackResult) 
        }
    })
}
function getSourceListForNces({ page, num, title },callback) {
    var data = {
        page,
        num,
        title
    }
    request('GET', API.getSourceListForNces, data, function (res) {
        if (res.code === 200 && res.errorCode === 0) {
            try {
                NCES.callbackResult = res.data.map(item => {
                    return {
                        title: item.title,
                        thumbnail: item.thumbnail,
                        duration: item.duration,
                        date: item.uptime,
                        id: item.id,
                        url: item.url
                    }
                })
            }
            catch{
                NCES.callbackResult = []
            }
            callback && callback(NCES.callbackResult)
        }
    })
}
function getSoldierListForNces({ page, num, title },callback) {
    var data = {
        page,
        num,
        title
    }
    request('GET', API.getSoldierListForNces, data, function (res) {
        if (res.code === 200 && res.errorCode === 0) {
            try {
                NCES.callbackResult = res.data.map(item => {
                    return {
                        title: item.title,
                        thumbnail: item.thumbnail,
                        duration: item.duration,
                        date: item.uptime,
                        id: item.id,
                        url: item.url
                    }
                })
            }
            catch{
                NCES.callbackResult = []
            }
            callback && callback(NCES.callbackResult)
        }
    })
}
function getUploadListForNces({ page, num, title },callback) {
    var data = {
        page,
        num,
        title
    }
    request('GET', API.getUploadListForNces, data, function (res) {
        if (res.code === 200 && res.errorCode === 0) {
            try {
                NCES.callbackResult = res.data.map(item => {
                    return {
                        title: item.title,
                        thumbnail: item.thumbnail,
                        duration: item.duration,
                        date: item.uptime,
                        id: item.id,
                        url: item.url
                    }
                })
            }
            catch{
                NCES.callbackResult = []
            }
            callback && callback(NCES.callbackResult)
        }
    })
}