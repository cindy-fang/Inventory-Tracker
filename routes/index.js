var express = require('express');
var router = express.Router();
var db = require("../db");

//weather api 
var request = require('request');
var { response } = require('express');
var API_KEY = '8d87c1685e476709e2704076378ed102';

//log in or register 
router.post("/login",async function(req,res){
var {username,password,register} = req.body;

if (register){
  await db.register(username, password);
}else {
  await db.login(username,password);
}
req.session.username = username;
res.redirect('/');
});

function ensureLoggedIn(req,res,next){
  if(!req.session.username){
    res.redirect('/login');
  } else{
    next();
  }
}

function refresh(req,res,next){
  if(req.session.username){
    res.redirect('/');
  } else{
    next();
  }
}

// --------------------Routes---------------------

// registration
router.get('/registration', (req,res) =>{
  res.render('registration');
});

//login 
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Inventory Tracker' });
});

//-----------------------------------------------------------------------------------------
router.use(ensureLoggedIn); // have to be logged in to use code below

/* GET home page */
router.get('/', async (req,res) =>{
  var {username} = req.session;
  var notif = await db.showItems(username);
  res.render('index', { title: 'Inventory List',notif });
});

/* CRUD operations and CSV*/
router.post('/',async function(req,res){
  var {title,date,loc,count, save,del,update,csv} = req.body;
  var {username} = req.session;
  console.log(req.body);
  
  //api call url
  var url = `http://api.openweathermap.org/data/2.5/weather?q=${loc}&appid=${API_KEY}&units=metric`
  
  //download to csv file 
  if(csv){
    await db.csv(username);
  }
  //refresh the page 
  if(refresh){
    router.use(refresh);
  }
    
  //weather api call function to get current weather with error handling 
  function doRequest(u) {
    return new Promise(function (resolve, reject) {
      request({url:u, json:true}, function (error, res, body) {
        if (!error && res.statusCode == 200) {
          resolve(body.main.temp);
        } else {
          reject(error);
        }
      });
    });
  }
  //save
  if(save){
    //error handling for unfilled form 
    if (title ==''|| date == ''|| loc == '' || count == ''){
      throw new Error("Please fill in all item information")
    }
    else if (loc == 'seoul' || loc == 'toronto' || loc == 'chicago' || loc == 'rome' || loc == 'athens'){
      let w = await doRequest(url);
      await db.addItem(username,title, loc, count, w, date);
    }
    //error handling for incorrectly filled location
    else{
      throw new Error ("Please enter one of the listed locations: athens/chicago/rome/seoul/toronto")
    }
  }  
  //delete
  if(del){
    await db.deleteItem(username,del);
  } 
  //update
  if(update){
    //error handling for unfilled form 
    if (title ==''|| date == ''|| loc == '' || count == ''){
      throw new Error("Please fill in all item information")
    }
    else if (loc == 'seoul' || loc == 'toronto' || loc == 'chicago' || loc == 'rome' || loc == 'athens'){
      let w = await doRequest(url);
      await db.updateItem(username,title, loc, count,w, date);
    }
    //error handling for incorrect location 
    else{
      throw new Error ("Please enter one of the listed locations: athens/chicago/rome/seoul/toronto")
    }
  }
  res.redirect('/');
});

//user logout 
router.post('/logout',async function(req,res){
  req.session.username= '';
  res.redirect('/');
});

module.exports = router;
