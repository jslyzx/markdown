var sqlMap = {
	user: {
		add: 'insert into user ( username, password ) values (?, ?)',
		select: 'select * from user where id = ?',
		select_name: 'select * from user where username = ?'
	},
	article: {
		get: 'select * from article where id = ?',
		all: 'select * from article',
		add: 'insert into article (title, author, content) values (?, ?, ?)',
		update: 'update article set content = ? where id = ?'
	}
}
module.exports = sqlMap;