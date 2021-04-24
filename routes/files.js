var express = require('express');
var router = express.Router();
const multer = require('multer');
const fs = require('fs')
const path = require('path')

var mysql = require('mysql');
var dbConfig = require('../db/dbConfig');

var fileSql = require('../db/files');

let upload = multer({
    //设置文件存储位置
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            let date = new Date()
            let year = date.getFullYear()
            let month = (date.getMonth() + 1).toString().padStart(2, '0')
            let day = date.getDate()
            let dir = path.join(__dirname, '../public/uploads/' + year + month + day)
                //判断存放图片的目录是否存在，如果不存在则创建
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true })
            }
            cb(null, dir)
        },
        //设置文件名称
        filename: function(req, file, cb) {
            let fileName = Date.now() + path.extname(file.originalname)
            cb(null, fileName);
        }
    })
});



router.post('/uploadImg', upload.single('img'), (req, res) => {
    // console.log(req.file);

    let imgPath = req.file.path.split('public')[1]
    let imgUrl = 'http://localhost:3000' + '/static' + imgPath
    console.log(imgUrl)
    res.send({
        code: 200,
        msg: '图片上传成功',
        data: imgUrl
    })

});
router.post('/uploadFiles', upload.array('files', 3), (req, res) => {
    // console.log(req.files);
    var arry = req.files;
    var fileUrls = new Array();
    for (var i = 0; i < arry.length; i++) {
        // console.log(arry[i].path)
        let fileName = arry[i].originalname
            // let filePath = arry[i].path.split('public')[1]
        let fileUrl = 'http://localhost:3000' + '/static' + arry[i].path.split('public')[1]
        fileUrls.push(
            fileName,
            fileUrl
        )
        console.log(fileUrls)
        res.send({
            code: 200,
            msg: '文件上传成功！',
            data: fileUrl
        })
    };

})

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
router.post('/upload', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.body
        var courseno = param.courseNo
        var title = param.fileName
        var content = param.fileContent
        var imgurl = param.imgurl
        var fileurl = param.finalFileUrl
            // console.log(title)
            // console.log(updatetime)
        console.log(param)
            //建立连接 查询数据
        connection.query(fileSql.addFile, [courseno, title, content, imgurl, fileurl], function(err, result) {
            if (result) {
                result = {
                    code: 200,
                    msg: '上传课程文件成功'

                };


            } else if (err) {
                console.log(err)
            }

            //以json形式， 把操作结果返回给前台页面
            responseJSON(res, result);
        })

        //释放连接
        connection.release();

    })

});

router.get('/list', function(req, res, next) {
    pool.getConnection(function(err, connection) {
        connection.query(fileSql.getList, function(err, result) {
                if (result) {
                    return res.send(result)
                } else if (err) {
                    return res.send(err)
                }

            })
            //释放连接
        connection.release();
    })
});

router.get('/courseDetail', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.query || req.params
        var courseno = param.courseno
        console.log(courseno)
            //建立连接 查询数据
        connection.query(fileSql.getDetail, [courseno], function(err, result) {
            if (result) {
                res.send(result)
            } else if (err) {
                res.send(err)
            }

        })

        //释放连接
        connection.release();

    })

});

router.delete('/delCourse', function(req, res, next) {
        //从连接池中获取连接
        pool.getConnection(function(err, connection) {
            //获取前台页面传过来的参数
            var param = req.query || req.params
            var courseno = param.courseno
            console.log(courseno)
                //建立连接 删除数据
            connection.query(fileSql.delCourse, [courseno], function(err, result) {
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
    //更新课件
router.post('/update', function(req, res, next) {
    //从连接池中获取连接
    pool.getConnection(function(err, connection) {
        //获取前台页面传过来的参数
        var param = req.body
        var courseno = param.courseNo
        var title = param.fileName
        var content = param.fileContent
        var imgurl = param.imgurl
        var fileurl = param.finalFileUrl
            // console.log(title)
            // console.log(updatetime)
        console.log(param)
            //建立连接 查询数据
        connection.query(fileSql.updateCourse, [title, content, imgurl, fileurl, courseno], function(err, result) {
            if (result) {
                // console.log(result)
                result = {
                    code: 200,
                    msg: '上传课程文件成功'

                };


            } else if (err) {
                console.log(err)
            }

            //以json形式， 把操作结果返回给前台页面
            responseJSON(res, result);
        })

        //释放连接
        connection.release();

    })

});

module.exports = router;