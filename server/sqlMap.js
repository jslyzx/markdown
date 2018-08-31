var sqlMap = {
	user: {
		add: 'insert into user ( username, password ) values (?, ?)',
		select: 'select * from user where id = ?',
		select_name: 'select * from user where username = ?'
	},
	article: {
		get: 'select * from article where id = ?'
	}
}
module.exports = sqlMap;