var { MongoClient, ConnectionClosedEvent} = require('mongodb');
// want to import mongoclient field from mongo db namespace
var bcrypt = require('bcrypt');

var url = 'mongodb+srv://dbUser:FuNawdaOMwFyFCNH@cluster0.gezqw.mongodb.net/cps731?retryWrites=true&w=majority'

var db = null; 
var client = null;
async function connect(){
    if (db == null){
    var options = {
        useUnifiedTopology: true,
    }
    client = await MongoClient.connect(url,options);
    db = await client.db("cps731");
    }
    // in JS async - call method like this, not immediately return
    // this will start connecting, but dont assume it will finish connecting  
    return db;
}
//tells JS to wait for it to connect, and once connected we will be able to use this variable

async function register(username,password){
    var conn = await connect();

    var existingUser = await conn.collection('Users').findOne({username});
    if (existingUser != null){
        throw new Error('User already exits!');
    }
    var SALT_ROUNDS = 10;
    var passwordHash = await bcrypt.hash(password,SALT_ROUNDS);

    conn.collection('Users').insertOne({username,passwordHash});
}

async function login(username,password){
    var conn = await connect();
    var user = await conn.collection('Users').findOne({username});

    if (user == null){
        throw new Error('User does not exist');
    }
    var valid = await bcrypt.compare(password,user.passwordHash);
    //pass in supplied and existing password hash
    //user.passwordHash retrieves the passwordHash from Register function
    //valid is boolean indicating if it matches

    if (!valid){
        throw new Error('Invalid Password');  
    //if (user.password != password){
        //throw new Error('Invalid Password');
        // can no longer use this comparison as we are using bcrypt now
    }
}

//CREATE 
async function addItem(username,title, loc, count, weather, date){
    var conn = await connect();
    /*
    var item = await conn.collection('Users').findOne({username},{title: title});
    if (item != null){
        throw new Error('Item already exists');
    }
    */

    if (title ==null || title ==""){
        throw new Error('Please enter title');
    }
    if (date==null || date == ""){
        throw new Error('Please enter date');
    }
    if (loc==null || loc == ""){
        throw new Error('Please enter location');
    }
    if (count==null || count == ""){
        throw new Error('Please enter count');
    }
    if (weather==null || weather == ""){
        throw new Error('Please enter weather');
    }

    if (loc == 'seoul'){
        await conn.collection('Users').updateOne(
            {username},
            { $push: {inventory:{title,loc, count, weather, date},},},
            )
    }
    if (loc == 'toronto'){
        await conn.collection('Users').updateOne(
            {username},
            { $push: {inventory:{title,loc, count, weather, date},},},
            )
    }
    if (loc == 'chicago'){
        await conn.collection('Users').updateOne(
            {username},
            { $push: {inventory:{title,loc, count, weather, date},},},
            )
    }
    if (loc == 'rome'){
        await conn.collection('Users').updateOne(
            {username},
            { $push: {inventory:{title,loc, count, weather, date},},},
            )
    }
    if (loc == 'athens'){
        await conn.collection('Users').updateOne(
            {username},
            { $push: {inventory:{title,loc, count, weather, date},},},
            )
    }
}

//READ 
async function showItems(username){
    var conn = await connect();
    var user = await conn.collection('Users').findOne({username});
    console.log(user);
    return user.inventory;
}

//UPDATE 
async function updateItem(username,title, loc, count, weather, date){
    var conn = await connect();

    if (title ==null || title ==""){
        throw new Error('Please fill in all spaces of the item you want to update');
    }
    if (loc ==null || loc ==""){
        throw new Error('Please fill in all spaces of the item you want to update');
    }
    if (count ==null || count ==""){
        throw new Error('Please fill in all spaces of the item you want to update');
    }
    if (weather ==null || weather ==""){
        throw new Error('Please fill in all spaces of the item you want to update');
    }
    if (date ==null || date ==""){
        throw new Error('Please fill in all spaces of the item you want to update');
    }

    await conn.collection('Users').updateOne(
        {username: username},
        { $set: {inventory: [{title: title, weather: weather, count: count, loc: loc, date: date}],},},
    )
}

//DELETE 
async function deleteItem(username,title){
    var conn = await connect();
    await conn.collection('Users').updateOne({username},{ $pull: {inventory:{title},},},) 
}


//FILTERING 
async function filterLoc(username,title,loc){
    var conn = await connect();
    var user = await conn.collection('Users').find({username},{loc:loc});
    console.log(user);
    return user.inventory;
}

async function filterCount(username,count){
    var conn = await connect();
    var user = await conn.collection('Users').find({username},{count:count});
    console.log(user);
    return user.inventory;
}

async function filterWeather(username,weather){
    var conn = await connect();
    var user = await conn.collection('Users').find({username},{inventory:{weather:weather}});
    console.log(user);
    return user.inventory;
}

async function filterDate(username,date){
    var conn = await connect();
    var user = await conn.collection('Users').find({username},{inventory:{date:date}});
    console.log(user);
    return user.inventory;
}
module.exports = {
    login,
    register,
    url,
    updateItem,
    addItem,
    showItems,
    deleteItem,
    filterLoc,
    filterCount, 
    filterWeather,
    filterDate
}
// makes function accesible from outside the file
