// 导入https模块
const https = require('https');
// 导入路径模块
const fs = require('fs');
// 导入cheerio工具解析模块
const cheerio = require('cheerio');


let req = https.request('https://movie.douban.com/chart', res => {
    let html = '';
    res.on('data', chunk => {
        html += chunk;
    });
    res.on('end', () => {
        // 结束数据监听后将所有内容拼接存放进html
        let $ = cheerio.load(html);
        let text = [];
        // 将筛选的内容存放到text数组
        $('.article .indent .item').each(function(i, ele) {
            const imgs = $('.nbg img', this).attr('src');
            text.push({
                pic: imgs
            });
        });
        downloadImg(text);
    });
});
// 编写下载方法
// 将获取过来的数据进行下载
function downloadImg(allFilms) {
    for (let i = 0; i < allFilms.length; i++) {
        // 获取每个对象的url地址给picUrl
        const picUrl = allFilms[i].pic;
        https.get(picUrl, function(res) {
            // 读取picUrl写入到本地
            // 设置二进制存放
            res.setEncoding('binary');
            let str = '';
            res.on('data', function(chunk) {
                str += chunk;
            });
            res.on('end', function() {
                // 写入模块
                // 创建images文件夹
                fs.mkdir('./images', function(err) {
                    if (!err) {
                        console.log('imgages文件写入成功！');
                    }
                });
                // 往images文件中写入图片文件
                // str, 'binary' 将str转换为二进制存放
                fs.writeFile(`./images/${i}.png`, str, 'binary', function(err) {
                    if (!err) {
                        console.log(`第${i}张图片下载成功`);
                    }
                })
            })
        })
    }
};
// 结束请求
req.end();