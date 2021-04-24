var express = require('express');
var router = express.Router();

var mysql = require('mysql');
var dbConfig = require('../db/dbConfig');
var blogSql = require('../db/blogSql');

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
    //查询所有blog
router.get('/getList', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        // var param = req.query || req.params
        //建立连接 查询数据
        connection.query(blogSql.getAll, function(err, result) {
            if (result) {
                return res.send(result)
            };

        })

        // //释放连接
        // connection.release();

    })

});
router.post('/add', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.body
        var title = param.title
        var content = param.content
        var author = param.author
        var updatetime = Date.now()
            // console.log(title)
            // console.log(updatetime)
            //建立连接 查询数据
        connection.query(blogSql.addOne, [title, content, author, updatetime], function(err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: '添加blog数据成功'

                };


            } else if (err) {
                console.log(err)
            }

            //以json形式， 把操作结果返回给前台页面
            responseJSON(res, result);
        })

        // //释放连接
        // connection.release();

    })

});

router.post('/update', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.body
        var id = param.id
        var title = param.title
        var content = param.content
        var author = param.author
        var updatetime = Date.now()
            // console.log(title)
            // console.log(updatetime)
            //建立连接 查询数据
        connection.query(blogSql.updateOne, [title, content, author, updatetime, id], function(err, result) {
            if (result) {
                console.log(result)
                result = {
                    code: 200,
                    msg: '更新blog数据成功'

                };

            } else if (err) {
                console.log(err)
            }
            //以json形式， 把操作结果返回给前台页面
            responseJSON(res, result);
        })

        // //释放连接
        // connection.release();

    })

});

router.get('/delete', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.query || req.params
        var id = param.id
            //建立连接 查询数据
        connection.query(blogSql.delOne, [id], function(err, result) {
            let ret = result.affectedRows
            console.log(ret)
            if (ret > 0) {
                return res.json({
                    code: '200',
                    msg: '删除blog数据成功！'
                });
            }
            return res.json({
                code: '300',
                msg: '删除blog数据失败！'
            });
        })

        // //释放连接
        // connection.release();

    })

});


module.exports = router;