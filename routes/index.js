var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose.js')
var {users} = require('../db/models/users.js')
var {dummy} = require('../db/dummy')
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.cookies.token) {
    res.redirect('/map');
  } else {
    res.redirect('/login');
  }
});

router.get('/dummy', function(req,res,next) {
  console.log(dummy.length);
    users.insertMany(dummy).then(docs => {
      console.log('entries added');
    }).catch(e => {
      console.log(e);
    })
})

module.exports = router;
