var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose.js')
var {users} = require('../db/models/users.js')
var axios = require('axios');

/* GET users listing. */
router.get('/', function(req, res, next) {
  if(req.cookies.token) {
    res.redirect('/map');
  }
  res.render('login');
});

router.post('/authenticate', function(req,res,next) {
  if(req.body.name && req.body.id && req.body.email) {
    axios.post(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.id}`)
    .then(data => {
      console.log(data);
      
      users.findOne({id: data.data.sub}).then(innerdata => {
        if(innerdata) {
          //user already present 
          res.cookie('token', req.body.id,{maxAge: 1000*60*60*2});
          res.status(200).send("login success");
        }
        else {
          var user = new users({
            name: req.body.name,
            id:data.data.sub,
            email: req.body.email
          });
      
          user.save().then((doc) => {
            console.log("post received")
            res.cookie('token', req.body.id,{maxAge: 1000*60*60*2})
            res.status(200).send("login success");
          }).catch(e => {
            console.log(e);
            res.status(400).send("login failure");
          })
        }
      })

    }).catch(e => {
      console.log(e);
        res.status(400).send("login failure");
    }) 
  }
})

module.exports = router;
