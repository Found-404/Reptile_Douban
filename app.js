// 导入https模块
const https = require('https');
// 导入路径模块
const fs = require('fs');
// 导入cheerio工具解析模块
const cheerio = require('cheerio');

https.get('https://movie.douban.com/top250', function(res) {

    console.log(res);

    // 获取html文件
    let html = '';
    res.on('data', function(chunk) {
        html += chunk;
    });


    res.on('end', function() {
        // console.log(html);
        const $ = cheerio.load(html);
        let allFilms = [];
        $('li .item').each(function() {
            const title = $('.title', this).text();
            const star = $('.rating_num', this).text();
            const pic = $('.pic img', this).attr('src');
            allFilms.push({ title, star, pic });
        });
        fs.writeFile('./file.json', JSON.stringify(allFilms), function(err) {
            if (!err) {
                console.log('文件写入成功！');
            }
        });
        downloadImg(allFilms);
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
            // 二进制存放
            res.setEncoding('binary');
            let str = '';
            res.on('data', function(chunk) {
                str += chunk;
            });
            res.on('end', function() {
                // 写入模块、
                fs.writeFile(`./images/${i}.png`, str, 'binary', function(err) {
                    if (!err) {
                        console.log(`第${i}张图片下载成功`);
                    }
                })
            })
        })
    }
}