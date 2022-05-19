var express = require('express');
var router = express.Router();
var db = require("../db");


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

// --------------------Routes---------------------

// registration
router.get('/registration', (req,res) =>{
  res.render('registration');
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Inventory Tracker' });
});


//-----------------------------------------------------------------------------------------
router.use(ensureLoggedIn); // have to be logged in to use code below


/* GET home page. */
router.get('/', async (req,res) =>{
  var {username} = req.session;
  var notif = await db.showItems(username);
  res.render('index', { title: 'Inventory List',notif }, { weather: null, error: null }); /*this is new*/

});

/* Add + delete items to list*/
router.post('/',async function(req,res){
  var {title,date,loc,weather,count, save,del,update} = req.body;
  //var{weather} = req.body.weather;
  var {username} = req.session;
  console.log(req.body);

  //var apiurl = `http://api.openweathermap.org/data/2.5/weather?q=${loc}&units=metric&appid=${apiKey}`;

  if(save){
    await db.addItem(username,title, loc, count, weather, date);
  }
  if(del){
    await db.deleteItem(username,del);
  } 
  if(update){
    await db.updateItem(username,title, loc, count,weather, date);
  }

  if(fLoc){
    await db.filterLoc(username,title, loc);
  }
  if(fCount){
    await db.filterCount(username,title, count);
  }
  if(fWeather){
    await db.filterWeather(username,title,weather);
  }
  if(fDate){
    await db.filterDate(username,title,date);
  }
  res.redirect('/')

});

router.post('/logout',async function(req,res){
  req.session.username= '';
  res.redirect('/');
});

module.exports = router;