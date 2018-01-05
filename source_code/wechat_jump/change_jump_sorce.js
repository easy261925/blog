/**
 * 源地址 https://gist.github.com/feix/6dd1f62a54c5efa10f1e1c24f8efc417
 * 修改版 https://github.com/QC-L/blog/blob/master/source_code/wechat_jump/change_jump_sorce.js
*/
 

var CryptoJS = require('crypto-js')
var request = require('request-promise')

var score = 1225,  // 要修改的分数
    times = 563, // 分数所需时间
    version = 6,  // 版本
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
var test = 'l7BS5AHHtZ8oXbB50Ght8gvY3o0gaDWTtcMEe7oxg5zqjUUTxNpRTFx7oRf04K6QZKrlZVhfrpAxZ6Z1TH3hi+bhPVd0w+gVwBj8OvM5QOTXkf5qy+LYCO+w5HdrVNI+bW0rAqlZg9U4+Ns1lQlrO/z0iuxZQkcWSxAKcuxKBe6WE70/itqoF7m3hwLP8cK3yezrMkZJxYTEmOxdto7m6WnzdDb438kmwUrlzqCwbIF0EAXhzkw8aYZmhKNFYXSGDUXd0sSVQOTfkjw0UuouYrZsskWwIb6VtNSECEDja3Vxi3CAMZhs1VAJ/Mzis37gGT4JSOhjFWdfODnAKcvfnQZwCPh3wCFXlQ0QWevUDDGoKtbBb7WuFA3CNQIO/ds/C6A4pvGYwjM/Hp2dtIgu7Xbu3fO/Bzevgi/pHUIlFol8okRCXIHEWGCUZ0AU8CRN4/NLTSrrgCFQcWjMltBJu9uxP8Z+vGD5agiJKxYwwMhSZ77dcCsCoSJdTpQ6qnHVgVHPqoCHHf+WhYNVAS/swtqVeVNqO3bLgKXn34+QWYNIb1bagZ+uhL3UegpKNZYhd//GTTfVsneQXVb/NpOwY6q9G6QRYHH15ol5yXY7E0rwInoKegbyErn3bf0po6Jkmr9Sy9hFWUUQQqteoSwBsUL1nLjZRJyUTLdkuhyAOFXnaKFXmmbZIiT4Ztu9uJ+uO66lxskCTDqDuqmk930JJstPHu5wpL2fD3KL5Iz42wq9IZnv7Wo3HOflQpzwvVaCOcVFOdnDuU2+FYBaU+KIx0+ZFNbVRhaPMhY1Qm653OQJXI7YrEVOcfQoADEtWY31J7LP4SdY44W+VtlMJ77Y8LGKU7TGX2ahbWUbyDEIXzb+ng4Ti6rthgfOWcTbqB7nq+3xTTobBRpXAXGFStKZ/636dlRAnvyOFgEUr9wPsQ3xtbBouARHoySXmqDf/MZo0xnjnI9mwZqNF5iG4oRBVksQ0+pJ/9GzmPElSzcK7sZ7xRDg3keuESmhYwWP76uQCK03+KD1zOQpnZv6c1Ha/9a/+9axpDNecQ4jm0rm2tmmLZ2T72SHaHHnPLLwlQDNN596qgMt8+6ceYSHznlYJorSygdi0GWFmB0jTkZNcMHDZls3g2iHiboXRsrIyjBvD77dNoXt3oQ+ftt2xHJVBdi15rmXyGPdxY9KNEoeFtNtUIqRBaM5cmvG4Sj5IMXK/6QUrrWRsFS6/JC8yvqO3Q4XELc0Nr6LZupiNBDEmK4Lus6OeGjGkNpTM5jDcQvdb2k9HB5JsMznQPPiOXhBnLXuMEgtksJ0GsSzhB/HQNeO7qM7m37Sy0C7x5Lb7NSRsNE4+0Lxv/Vn+9XgctxNJPR7QQ/aXOoMyiYTV6jgx/po5FlErc+l/T6leSlIEzZrp45hi5TejQhhuL86zs3XxMdECChSNtLGuPIsknKjUis+nIytQUWq+BdRbiCN4onqVl5PvMAbcFdE3BXEz4PtZg=='


var headers = {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_2_1 like Mac OS X) AppleWebKit/604.4.7 (KHTML, like Gecko) Mobile/15C153 MicroMessenger/6.6.1 NetType/WIFI Language/zh_CN',
    'Referer': `https://servicewechat.com/wx7c8d593b2c3a7703/${version}/page-frame.html`,
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
            touchList = [], // 手指触摸坐标数组
            timestamp = [],
            steps = [],
            time = new Date().getTime()
        for (var i = 0; i < score; i++) {
            let jumpX = Math.random().toFixed(2) 
            let jumpY = (Math.random() * 2 + 1).toFixed(2)
            let touchX = (Math.random() * (250 - 200) + 200).toFixed(1)
            let touchY = (Math.random() * (560 - 510) + 510).toFixed(1)
            let tt = parseInt((Math.random() * (2000 - 1800) + 1800))
            action.push([jumpX, jumpY, false])
            var isYes = false
            // 随机出音乐效果
            if (jumpX > 0.5 && jumpX < 0.6) {
                isYes = true
            }
            musicList.push(isYes)
            touchList.push([touchX, touchY])
            var step = [];
            for (var j = 0; j < 5; j++) {
                step.push(touchX);
                step.push(touchY);
            }
            steps.push(step);
            // sleep.msleep(tt);
            time = time + tt
            timestamp.push(time)
        }
        var data = {
            score: score,
            times: timestamp[timestamp.length - 1] - timestamp[0], 
            game_data: JSON.stringify({
                seed: Date.now(),
                action: action,
                musicList: musicList,
                touchList: touchList,
                steps: steps,
                timestamp: timestamp,
                version: 2
            })
        }
        console.log(data)
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