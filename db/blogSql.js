var blogSql = {
    addOne: 'insert into blogs(title, content, author, updatetime) values(?,?,?,?)',
    getAll: 'select * from blogs',
    getDetail: 'select * from blogs where id =?',
    delOne: 'delete from blogs where id =?',
    updateOne: 'update blogs set title=?, content=?, author=?, updatetime=? where id =? '
}

module.exports = blogSql;