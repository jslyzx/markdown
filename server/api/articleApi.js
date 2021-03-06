var express = require('express');
var router = express.Router();
var query = require('../pool')

var $sql = require('../sqlMap');

var jsonWrite = function(res, ret) {
  if (typeof ret === 'undefined') {
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
  console.error('sql:', sql);
  console.log('id:', req.query.id);
  query(sql, [req.query.id], function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

// 获取文章列表
router.get('/listArticles', (req, res) => {
  var sql = $sql.article.all;
  console.error('sql:', sql);
  query(sql, function(err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      jsonWrite(res, result);
    }
  })
});

// 新建文章
router.post('/add', (req, res) => {
  var sql = $sql.article.add;
  console.error('sql:', sql);
  var article = req.body;
  query(sql, [article.title, '赵翔', article.content], function(err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
});


// 修改文章
router.put('/update', (req, res) => {
  var sql = $sql.article.update;
  console.error('sql:', sql);
  var article = req.body;
  query(sql, [article.content, article.id], function(err, result) {
    if (err) {
      console.log(err)
    }
    if (result) {
      jsonWrite(res, result)
    }
  })
})

module.exports = router;
