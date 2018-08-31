var models = require('../db');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var $sql = require('../sqlMap');

// 连接数据库
var conn = mysql.createConnection(models.mysql);

conn.connect();
var jsonWrite = function(res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
            code: '1',
            msg: '操作失败'
        });
    } else {
        res.json(ret);
    }
};

// 获取文章详情
router.get('/getArticle', (req, res) => {
    var sql = $sql.article.get;
    var params = req.params;
    console.error('sql:',sql);
    console.log('id:',req.query.id);
    conn.query(sql, [req.query.id], function(err, result) {
        if (err) {
            console.log(err);
        }
        if (result) {
            jsonWrite(res, result);
        }
    })
});

// 获取文章列表

module.exports = router;