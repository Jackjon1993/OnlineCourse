var userSql = {
    addUser: 'insert into users(username, password, role) values(?,?,?)',
    queryLike: 'select * from users where username like ?',
    queryAll: 'select * from users LIMIT ?,? ',
    getUserById: 'select * from users where id = ?',
    checkUser: 'select * from users where username =? and password =?',
    countAll: 'SELECT COUNT(*) FROM users',
    editUser: 'update users set password = ?, role = ? where username = ?',
    delUser: 'delete from users where username = ?'
};


module.exports = userSql