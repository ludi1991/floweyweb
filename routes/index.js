var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.aa) {
    console.log('there is an aa' + req.session.aa);
  }
  req.session.aa = "123";
  res.send('What a radical visit! And the session expired time is: ' + req.session.cookie.maxAge);
});

module.exports = router;
