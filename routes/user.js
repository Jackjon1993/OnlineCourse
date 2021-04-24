var express = require('express');
const { token } = require('morgan');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../db/dbConfig');
var userSql = require('../db/userSql');
//引入token_verify
var tokenApi = require('../token_verify')

var pool = mysql.createPool(dbConfig.mysql);
// //响应一个JSON数据
var responseJSON = function(res, ret) {
        if (!res) {
            res.json({
                code: '-200',
                msg: '操作失败'
            });

        } else {
            res.json(ret);
        }
    }
    //添加用户
router.post('/addUser', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var username = req.body.uname;
        var password = req.body.psd;
        var role = req.body.role
            // console.log(username)
            // console.log(password)
            // console.log(role)

        //建立连接 增加用户
        connection.query(userSql.addUser, [username, password, role], function(err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: '添加成功'

                };
                // console.log(result)

            } else {
                result = {
                    code: 0,
                    msg: '添加失败'
                }
            }
            //以json形式， 把操作结果返回给前台页面
            responseJSON(res, result);
            //释放连接
            connection.release();
        })
    })
});

router.post('/login', function(req, res, next) {
    //从连接池中获取连接

    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var username = req.body.username;
        var password = req.body.password;
        console.log(username)
        console.log(password)

        connection.query(userSql.checkUser, [username, password], function(err, result) {
            console.log(result)

            if (result.length > 0) {
                tokenApi.setToken(username).then(token => {
                    var user = {
                        username: username,
                        password: password
                    }
                    res.send({
                        code: 200,
                        msg: '登陆成功！',
                        // user: user,
                        token: token
                    })
                })

            } else {
                result = {
                    code: 300,
                    msg: '你还没有注册，请先注册'

                };
                //以json形式， 把操作结果返回给前台页面
                responseJSON(res, result);
                console.log(result)
            }


            //以json形式， 把操作结果返回给前台页面
            // console.log(query.sql)
            // responseJSON(res, result);
            // console.log(result)
            //释放连接
            connection.release();
        })
    })
})

//查询用户列表
router.get('/getList', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        var param = req.query || req.params
        var key = param.key.trim()
        var startNo = parseInt(param.pageNo)
        var rows = parseInt(param.pageSize)
        var offset = (startNo - 1) * rows
            // console.log(offset)
            // console.log(key)
            // var str = key.trim()
            // if (key) {
            //     console.log('key非空')
            //     console.log(key)
            // } else {
            //     console.log('key为空')
            //         // console.log(key)
            // }
        var counts
        connection.query(userSql.countAll, function(err, result) {
            if (result) {
                // var total = result[0]
                var ret = JSON.stringify(result[0]).split(':')[1].split('}')[0]
                counts = parseInt(ret)

            }

        });
        if (key) {
            connection.query(userSql.queryLike, ["%" + key + "%"], function(err, result) {

                if (result) {
                    res.json({
                        code: 200,
                        msg: 'success',
                        data: {
                            meta: result,
                            total: counts
                        }
                    })
                } else {
                    res.json(
                        code = '0',
                        msg = '获取用户列表失败'
                    )
                }
                //释放连接
                connection.release();
            })
        } else {
            connection.query(userSql.queryAll, [offset, rows], function(err, result) {
                if (result) {
                    res.json({
                        code: 200,
                        msg: 'success',
                        data: {
                            meta: result,
                            total: counts
                        }
                    })
                } else {
                    res.json(
                        code = '0',
                        msg = '获取用户列表失败'
                    )
                }
                //释放连接
                connection.release();
            })
        }

    })

})

//修改用户信息
router.post('/editUser', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var username = req.body.uname;
        var password = req.body.psd;
        var role = req.body.role
            // console.log(username)
            // console.log(password)
            // console.log(role)

        //建立连接 增加用户
        connection.query(userSql.editUser, [password, role, username], function(err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: '修改成功'

                };
                // console.log(result)

            } else {
                result = {
                    code: 0,
                    msg: '修改失败'
                }
            }
            //以json形式， 把操作结果返回给前台页面
            responseJSON(res, result);
            //释放连接
            connection.release();
        })
    })
});
//通过用户名删除一条用户
router.delete('/delUser', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.query || req.params
        var username = param.username
        console.log(username)
            //建立连接 删除数据
        connection.query(userSql.delUser, [username], function(err, result) {
                if (result.affectedRows > 0) {
                    result = {
                        code: '200',
                        msg: '删除成功！'
                    }
                } else {
                    result = {
                        code: '0',
                        msg: '删除失败！'
                    }
                }
                //以json形式， 把操作结果返回给前台页面
                responseJSON(res, result);
            })
            //释放连接
        connection.release();
    })
})
router.get('/test', function(req, res, next) {
    res.send('this is test')
})
module.exports = router;