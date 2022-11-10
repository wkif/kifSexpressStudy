var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/postTest', (req, res, next) => {
  console.log('访问前')
  next()
}, function (req, res, next) {
  // req: 客户端 携带的信息
  // console.log(req.query)
  // console.log(req.params)
  console.log(req.body)
  // console.log(req.get('Origin'))
  // console.log(req.url)
  res.render('index', { title: 'Express' });
});

module.exports = router;
