const nodemailer = require("nodemailer")
const handlebars = require('handlebars')
const mjml2html = require('mjml')
const fs = require('fs')

//使用handlebars对mjml文件进行编译
const template = handlebars.compile(fs.readFileSync("./automation/template/test.mjml", "utf-8"))
    //将handlebars生成的mjml转为html
const html = mjml2html(template()).html
    // fs.readFile('./automation/template/test.mjml', 'utf8', function(err, data) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         console.log('data')
    //     }
    // })


const List = ["190748612@qq.com", "lovejackjon@163.com"]
    // const mailto = ''
    // for (var i = 0; i < List.length; i++) {
    //     mailto = List[i]
    //     console.log(mailto)
    // }


const transporter = nodemailer.createTransport({
    host: "smtp.163.com",
    port: 465, // 端口 
    secureConnection: true, // 安全ssl连接
    // 授权认证
    auth: {
        // 用来发送邮件的邮箱
        user: 'lovejackjon@163.com',
        pass: 'BTWPNIZUQWJMLIBV'
    }
})

const mailOption = {
    from: "lovejackjon@163.com", // 发送的邮箱地址
    to: List, // 接收的邮箱地址
    subject: "测试邮件！", // 邮箱的标题
    // text: "测试内容！" // 正文内容
    html: html
}

// 发送邮件
function mail() {
    transporter.sendMail(mailOption, (error, info) => {
        if (error) {
            return console.log(error)
        }
        // 成功会返回messageId
        console.log("Message send: %", info.messageId)
    })
}

module.exports = mail