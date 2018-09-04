var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/list', (req, res) => {
  fs.readFile('icon-font.css', 'utf-8', function(err, data) {
    if (err) {
      console.log(err)
      res.json({
        code: '1',
        msg: '操作失败'
      })
    } else {
      res.json(data)
    }
  })
})

module.exports = router;