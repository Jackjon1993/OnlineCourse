var jwt = require('jsonwebtoken')
var signkey = 'Jack_0524#ccr!' //密钥
    //设置token
exports.setToken = function(username) {
    return new Promise((resolve, reject) => {
        var token = jwt.sign({
            username: username
        }, signkey, {
            expiresIn: 60 * 60 * 24 //表示1天后token过期
        });
        resolve(token)
    })
}

//验证token
exports.verToekn = function(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, signkey, (error, decoded) => {
            if (error) {
                reject(error)
            } else {
                resolve(decoded)
            }
        })
    })
}