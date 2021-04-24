var db = {};
var dbConfig = require('../db/dbConfig');

var mysql = require('mysql');
var nodemailer = require('nodemailer');
var pool = mysql.createPool(dbConfig.mysql);

// var pool  = mysql.createPool({  
//   connectionLimit : 10,  
//   host            : '118.190.162.70',  
//   user            : 'root',  
//   password        : '123456',  
//   database        : 'nodejs'  
// });  

//执行sql语句并返回结果  
db.query = function(sql, callback) {

    if (!sql) {
        callback();
        return;
    }
    pool.query(sql, function(err, rows, fields) {
        if (err) {
            console.log(err);
            callback(err, null);
            return;
        };

        callback(null, rows, fields);
    });
};

//发送邮件,带附件
db.sendMail = function(xlsxname, callback) {

    var transporter = nodemailer.createTransport({
        host: "smtp.163.com",
        port: 465,
        auth: {
            user: 'lovejackjon@163.com',
            pass: 'BTWPNIZUQWJMLIBV'
        }
    });

    var mailOptions = {
        from: 'lovejackjon@163.com', //你的邮箱
        to: `190748612@qq.com`, //你老板的邮箱
        subject: '这是测试邮件',
        html: `<h2>测试邮件</h2>`,
        attachments: [{
            filename: xlsxname,
            path: `./${xlsxname}`
        }]
    };

    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            callback(error, null);
        } else {
            callback(null, info);
        }
    });
}

//格式化当前时间
db.nowDate = function() {
    var date = new Date();
    var fmtTwo = function(number) {
        return (number < 10 ? '0' : '') + number;
    }
    var yyyy = date.getFullYear();
    var MM = fmtTwo(date.getMonth() + 1);
    var dd = fmtTwo(date.getDate());

    var HH = fmtTwo(date.getHours());
    var mm = fmtTwo(date.getMinutes());
    var ss = fmtTwo(date.getSeconds());

    return '' + yyyy + '-' + MM + '-' + dd + ' ' + HH + ':' + mm + ':' + ss;

}
module.exports = db;