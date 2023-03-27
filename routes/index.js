var express = require('express');
var router = express.Router();
var shortid = require("shortid");
/* GET home page. */
router.get('/',(req,res)=>{
  var data = {newRoomId: '' };
  res.render("index",{data});
})
router.get('/genId',(req, res,)=> {
  //res.render('index', { title: 'Express' });
  var roomID = shortid.generate();
  var data = {newRoomId: roomID };
  res.render("index",{data});
});

module.exports = router;
