var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose.js')
var {users} = require('../db/models/users.js')
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login');
});

router.post('/authenticate', function(req,res,next) {
  if(req.body.name && req.body.id && req.body.email) {
    var user = new users({
      name: req.body.name,
      id:req.body.id,
      email: req.body.email
    });
    user.save().then((doc) => {
      console.log("post received")
      res.status(200).send("login success");
    }).catch(e => {
      console.log(e);
      res.status(400).send("login failure");
    })
  }
})

module.exports = router;
