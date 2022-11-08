var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 获取用户信息
router.get('/get_user', userController.showUser);

module.exports = router;
