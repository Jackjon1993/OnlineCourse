var async = require('async');
var xlsx = require('node-xlsx');
var schedule = require("node-schedule");
var mysql = require('./sendmail');
var fs = require('fs');
var auto = function() {
    //查询数据,并转化成生成xlsx所需的格式
    var task1 = function(callback) {
            mysql.query('select * from files', function(err, rows, fields) {
                if (err) {
                    callback(err, null);
                    return;
                }
                var datas = [];
                // rows.forEach(function(row) {
                //     var newRow = [];
                //     for (var key in row) {
                //         newRow.push(row[key]);
                //     }
                //     datas.push(newRow);
                // })
                rows.forEach(Element => {
                    let arrInner = []
                    let fileurl = 'http://118.190.162.70:8080/#/course?courseno=' + element.courseno
                    arrInner.push(element.id)
                    arrInner.push(element.courseno)
                    arrInner.push(element.title)
                    arrInner.push(element.content)
                    arrInner.push(fileurl)
                    datas.push(arrInner)
                })
                callback(null, datas);
            })
        }
        // //查询数据并且填充
        // var task1 = function(callback) {
        //     mysql.query('select * from files', (err, rows, fields) => {
        //         if (err) {
        //             callback(err, null);
        //             return;
        //         }
        //         //rows是从数据库里读出来的数组
        //         let data = [] //重新定义一个数组，最后将其写入excel
        //         let title = ['id', 'courseno', 'title', 'content', 'fileurl']
        //         data.push(title) //添加列名
        //         rows.forEach(element => {
        //             // let arrInner = []
        //             // let fileurl = 'http://118.190.162.70:8080/#/course?courseno=' + element.courseno
        //             // arrInner.push(element.id)
        //             // arrInner.push(element.courseno)
        //             // arrInner.push(element.title)
        //             // arrInner.push(element.content)
        //             // arrInner.push(fileurl)
        //             // data.push(arrInner)
        //             console.log(element)

    //         });
    //         callback(null, datas)
    //     })
    // }

    //生成xlsx文件
    var task2 = function(datas, callback) {
        var buffer = xlsx.build([{ name: "测试数据", data: datas }]);
        var xlsxname = `${mysql.nowDate().split(' ')[0]}.xlsx`;
        // var xlsxname = './课件列表.xlsx'
        fs.writeFile(xlsxname, buffer, 'binary', function(err) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, xlsxname);
        })
    }

    //发送邮件,返回信息
    var task3 = function(xlsxname, callback) {
        mysql.sendMail(xlsxname, function(err, info) {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, info);
        })
    }

    async.waterfall([task1, task2, task3], function(err, result) {
        if (err) {
            console.log(err);
            return;
        }
        console.log(result);
    })
}

var rule = new schedule.RecurrenceRule();
var times = [1, 6, 11, 16, 21, 26, 31, 36, 41, 46, 51, 56];
rule.second = times;
schedule.scheduleJob(rule, function() {
    auto();
});