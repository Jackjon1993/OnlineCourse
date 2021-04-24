var fileSql = {
    addFile: 'insert into files(courseno, title, content, imgurl,fileurl) values(?,?,?,?,?)',
    getList: 'select * from files',
    getDetail: 'select * from files where courseno = ?',
    delCourse: ' delete from files where courseno = ?',
    updateCourse: 'update files set title = ?, content = ?, imgurl = ?, fileurl = ? where courseno = ?'

}

module.exports = fileSql;