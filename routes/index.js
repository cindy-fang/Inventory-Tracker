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
    return db;
}

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
    }
}

//CREATE 
async function addItem(username,title, loc, count, weather, date){
    var conn = await connect();

    //check if item already exists (by item name/title)
    var yeehaw = await conn.collection('Users').find({username: 'user',"inventory.title":title}).count()>0;
    //console.log(yeehaw)
    if (yeehaw){
        throw new Error("Item already exists");
    }
    //add item into db 
    await conn.collection('Users').updateOne(
        {username},
        { $push: {inventory:{title,loc, count, weather, date},},},
    )
}

//READ 
async function showItems(username){
    var conn = await connect();
    var user = await conn.collection('Users').findOne({username});
    console.log(user);
    return user.inventory;
}

//CSV download 
async function csv(username){
    var conn = await connect();
    var data = await conn.collection('Users').findOne({username});
    const Json2csvParser = require("json2csv").Parser;
    const fs = require("fs");
    const json2csvParser = new Json2csvParser({ header: true });
    const csvData = json2csvParser.parse(data);
    fs.writeFile("inventory.csv", csvData, function(error) {
        if (error) throw error;
        console.log("Write to inventory.csv successfully!");
    });
}

//UPDATE 
async function updateItem(username,title, loc, count, weather, date){
    var conn = await connect();

    //check if item already exists (by item name/title)
    var checkExist = await conn.collection('Users').find({username: 'user',"inventory.title":title}).count()>0;
    if (checkExist){
        await conn.collection('Users').updateOne({username},{ $pull: {inventory:{title},},},)

        await conn.collection('Users').updateOne(
            {username},
            { $push: {inventory:{title,loc, count, weather, date},},},
            )
    }
    else{
        throw new Error("Item does not exist");
    }
}

//DELETE 
async function deleteItem(username,title){
    var conn = await connect();
    await conn.collection('Users').updateOne({username},{ $pull: {inventory:{title},},},) 
}

module.exports = {
    login,
    register,
    url,
    updateItem,
    addItem,
    showItems,
    deleteItem,
    csv
}
// makes function accesible from outside the file
