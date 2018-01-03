/**
 * 源地址 https://gist.github.com/feix/6dd1f62a54c5efa10f1e1c24f8efc417
 * 修改版 https://github.com/QC-L/blog/blob/master/source_code/wechat_jump/change_jump_sorce.js
*/
 

var CryptoJS = require('crypto-js'),
    request = require('request-promise')

var score = 2018,  // 要修改的分数
    times = 1000, // 分数所需时间
    // 你的 session_id
    session_id = ''

// 加密算法
function encrypt (text, originKey) {
    var originKey = originKey.slice(0, 16),
        key = CryptoJS.enc.Utf8.parse(originKey),
        iv = CryptoJS.enc.Utf8.parse(originKey),
        msg = JSON.stringify(text)
    var ciphertext = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return ciphertext.toString()
}
// 解密算法
function decrypt (text, originKey) {
    var originKey = originKey.slice(0, 16),
        key = CryptoJS.enc.Utf8.parse(originKey),
        iv = CryptoJS.enc.Utf8.parse(originKey)
    var bytes = CryptoJS.AES.decrypt(text, key, {
        iv: iv
    })
    var plaintext = CryptoJS.enc.Utf8.stringify(bytes)
    return plaintext
}
// 对象连接
function extend (target) {
    var sources = [].slice.call(arguments, 1)
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop]
        }
    })
    return target
}

var headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_4 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G35 MicroMessenger/6.6.1 NetType/WIFI Language/zh_CN',
    'Referer': 'https://servicewechat.com/wx7c8d593b2c3a7703/5/page-frame.html',
    'Content-Type': 'application/json',
    'Accept-Language': 'zh-cn',
    'Accept': '*/*',
    "Host":	'mp.weixin.qq.com'
}

var base_req = {
    'base_req': {
        'session_id': session_id,
        'fast': 1
    }
}
var base_site = 'https://mp.weixin.qq.com/wxagame/'

var path = 'wxagame_getuserinfo'
request({
    method: 'POST',
    url: base_site + path,
    headers: headers,
    json: true,
    body: base_req
}).then(function (response) { 
    console.log(path, response) 
}).catch(function (error) {
    console.log(path, error)
})

path = 'wxagame_getfriendsscore'
request({
    method: 'POST',
    url: base_site + path,
    headers: headers,
    json: true,
    body: base_req
}).then(function (response) {
    path = 'wxagame_init'
    request({
        method: 'POST',
        url: base_site + path,
        headers: headers,
        json: true,
        body: extend({}, {version: 9}, base_req)
    }).then(function (response) {
        var action = [], // 跳动坐标数组
            musicList = [], // 是否有音乐数组
            touchList = [] // 手指触摸坐标数组
        for (var i = 0; i < score; i++) {
            let jumpX = Math.random().toFixed(3) 
            let jumpY = (Math.random() * 2 + 1).toFixed(2)
            let touchX = (Math.random() * (250 - 200) + 200).toFixed(1)
            let touchY = (Math.random() * (560 - 510) + 510).toFixed(1)
            action.push([jumpX, jumpY, false])
            var isYes = false
            // 随机出音乐效果
            if (jumpX > 0.5 && jumpX < 0.7) {
                isYes = true
            }
            musicList.push(isYes)
            touchList.push([touchX, touchY])
        }
        var data = {
            score: score,
            times: times, 
            game_data: JSON.stringify({
                seed: Date.now(),
                action: action,
                musicList: musicList,
                touchList: touchList,
                version: 1
            })
        }
        path = 'wxagame_settlement'
        request({
            method: 'POST',
            url: base_site + path,
            headers: headers,
            json: true,
            body: extend({}, {action_data: encrypt(data, session_id)}, base_req)
        }).then(function (response) {
            console.log(path, response)
            console.log('2018! Happy new year! 🎉')
        }).catch(function (error) {
            console.log(error)
        })
    })
})