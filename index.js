let express = require("express");
const { ListCollectionsCursor } = require("mongodb");
let app = express();
let mongoose = require("mongoose");


//! SERVER
let portNum = process.env.PORT || 7000;
app.listen(portNum, ()=>{
    console.log(`Server listening on port ${portNum}`);
});

app.get("/aurora/api/server",(req, res) => {
    res.send(`Server listening on port ${portNum}...`);
});

//! Database
// Connect To DB - MongoDB Atlas - 500mbs
async function connectToDB(){
    console.log("Connecting...");
    let mongoAtlastUrl = "mongodb+srv://dagmawibabi:dagmawibabi7@cluster0.fivp4.mongodb.net/cluster0/myFirstDatabase?retryWrites=true&w=majority";
    await mongoose.connect(mongoAtlastUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("MDBA Connected!")).catch(err => console.log("ERROR"));
    console.log("connected!");
}
connectToDB();


//! API

// Database
let messagesSchema = new mongoose.Schema({
    dp: String,
    sender: String,
    message: String,    
    date: String,
    time: String
});

let messagesModel = new mongoose.model("messages", messagesSchema);

// Home
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
app.get("/",(req, res) => {
    let d = Date();
    //console.log(monthNames[d.getMonth()]);
    res.send("Welcome to New-Social API");
});

// Home
app.get("/aurora/api/",(req, res) => {
    res.send("Welcome to New-Social API");
});





//? G L O B A L  C H A T
let globalMessages = [
    {
        "dp": "https://i.pinimg.com/564x/f8/9b/97/f89b97b7b61ef45ca3025c7a0bbd9310.jpg",
        "sender": "BoJack",
        "message": "Well this is depressing",
        "date": "12/2/2022",
        "time": "4:22:14 PM",
    },
    {
        "dp": "https://i.pinimg.com/564x/94/29/8a/94298a0acf7be013ec747aad82b5da13.jpg",
        "sender": "Nate",
        "message": "This's cool",
        "date": "12/2/2022",
        "time": "4:30:16 PM",
    },
    {
        "dp": "https://i.pinimg.com/564x/bf/e5/fd/bfe5fd63c5124fbb3730c5b9e2d3bc01.jpg",
        "sender": "Batman",
        "message": "I'm Batman ????",
        "date": "12/2/2022",
        "time": "4:46:12 PM",
    },
    {
        "dp": "https://i.pinimg.com/originals/62/82/0a/62820a3251082ac356b5fd45c8cc324f.gif",
        "sender": "BlueRed",
        "message": "This is awesome design",
        "date": "12/2/2022",
        "time": "4:52:42 PM",
    },    
];

// Send Global Message
app.get("/aurora/api/sendGlobalMessage/:sender/:message",(req, res)=>{
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);    
    let messageObject = {
        "dp": "https://i.pinimg.com/564x/86/4d/3f/864d3f2beebcd48f4cf57052031de4a0.jpg",
        "sender": req.params.sender,
        "message": req.params.message,
        "date": today.toLocaleDateString(),
        "time": today.toLocaleTimeString(),
    };
    //console.log(req.params);
    //console.log(messageObject);
    globalMessages.push(messageObject);

    // Save to DB
    let newText = new messagesModel({
        "dp": "https://i.pinimg.com/564x/86/4d/3f/864d3f2beebcd48f4cf57052031de4a0.jpg",
        "sender": req.params.sender,
        "message": req.params.message,
        "date": today.toLocaleDateString(),
        "time": today.toLocaleTimeString(), 
    }).save();

    
    res.send("Message Sent!");
});

// Receive Global Message
let globalMessagesFromDB = [];
app.get("/aurora/api/receiveGlobalMessage", async (req, res)=>{
    // fetch from a db
    await messagesModel.find().then((result) => {
        globalMessages = result;
        res.send(globalMessages);
        console.log("Messages Received From DB!");
    }).catch((err) => {
        res.send(globalMessages);
        console.log("Messages Received Error!");    
    });
    //console.log(globalMessages);
});

// Delete Global Message
app.get("/aurora/api/deleteGlobalMessage/:sender/:message/:time", async (req, res) => {
    let b = await messagesModel.deleteOne({sender: req.params.sender, message: req.params.message, time: req.params.time});
    res.send("Message Deleted!");
})

// Editing Global Message
app.get("/aurora/api/updateGlobalMessage/:sender/:message/:time/:newMessage", async (req, res) => {
    console.log("editting");
    let b = await messagesModel.updateOne({sender: req.params.sender, message: req.params.message, time: req.params.time}, {$set: {sender: req.params.sender, message: req.params.newMessage, time: req.params.time}});
    console.log("Done!");
    res.send("Message Deleted!");
})


// admin quick changes 
app.get("/aurora/api/changeDPGlobalMessage/:sender/:dp", async (req, res)=>{
    console.log("fixing");
    let b = await messagesModel.updateMany({sender: req.params.sender}, {$set: {dp: req.params.dp}});
    console.log("Done!");
    res.send("Changed DP!");
})
app.get("/aurora/api/changeDPGlobalMessage", async (req, res)=>{
    console.log("fixing");
    let b = await messagesModel.updateMany({sender: "yeabu"}, {$set: {dp: "https://i.pinimg.com/originals/48/3f/be/483fbebfa30d9d506715307a9de897b1.gif"}});
    console.log("Done!");
    res.send("Changed DP!");
})





//?
// Create a new User
let newUserSchema = new mongoose.Schema({
    dp: String,
    fullname: String,
    username: String,
    password: String,
    creationDate: String,
    creationTime: String,
    profile: Array,
    chats: Array,
    friends: Array,
    followers: Array,
    posts: Array,
    numOfFriends: Number,
    numOfFollowers: Number,
    numOfPosts: Number,
    numOfLikes: Number,
});

let allUsersSchema = new mongoose.Schema({
    profiles: Array,
});

let newUserModel = new mongoose.model("users", newUserSchema);
let allUsersModel = new mongoose.model("allUsers", allUsersSchema);

// Create a new User
app.get("/aurora/api/createNewUser/:fullname/:username/:password", async (req, res) => {
    console.log("creating new user!");
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);    
    let newUser = new newUserModel({
        dp: "https://i.pinimg.com/564x/86/4d/3f/864d3f2beebcd48f4cf57052031de4a0.jpg",
        fullname: req.params.fullname,
        username: req.params.username,
        password: req.params.password,
        creationDate: today.toLocaleDateString(),
        creationTime: today.toLocaleTimeString(),
        numOfFriends: 0,
        numOfFollowers: 0,
        numOfPosts: 0,
        numOfLikes: 0,
    }).save();
    await allUsersModel.updateOne({_id: "622d07b6839d110dd39bf0fc"},{$push: {profiles: {username: req.params.username}}});
    console.log("new user account created!");
    res.send("New account created!");
});

// Get all usernames 
app.get("/aurora/api/getAllUsers", async (req, res) => {
    await allUsersModel.find().then((result) => {
        res.send(result[0]["profiles"]);
        console.log(result[0]["profiles"]);
    }).catch((err) => {
        console.log(err)
    });
});

// Login
app.get("/aurora/api/login/:username/:password", async (req,res ) => {
    await newUserModel.findOne({username: req.params.username, password: req.params.password}).then((result) => {
        if(result != "" || result != " " || result != null){
            res.send(result)
        } else {
            res.send(" ");
        }
        console.log(result);
    }).catch((err) => {
        res.send(" ");
        console.log(err);
    });
});


// Get all users all data
app.get("/aurora/api/getAllUsersAllData", async (req,res ) => {
    await newUserModel.find({}).then((result) => {
        res.send(result)
    });
});



//? Posts
let allPostsScheme = new mongoose.Schema({
    posts: Array,
});
let allPostsModel = new mongoose.model("allPosts", allPostsScheme);

// Create New Post
app.get("/aurora/api/createNewPost/:username/:password/:title/:body", async (req, res) => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);    
    console.log("creating new post...");
    await allUsersModel.updateOne({_id: "622d07b6839d110dd39bf0fc"}, {$push: {profiles: {username: req.params.username}}});
    let b = await newUserModel.updateOne(
        {
            username: req.params.username,
            password: req.params.password,
        },
        {
            $push :{
                posts: {
                    "title": req.params.title, 
                    "body": req.params.body, 
                    "date": today.toLocaleDateString(),
                    "time": today.toLocaleTimeString(),
                    "likes": 0,
                    "shares": 0,            
                    "likers": [],
                }
            }
        }
    );
    await allPostsModel.updateOne({_id: "62320125970c537556052883"}, {$push: { posts: {
        "username": req.params.username, 
        "title": req.params.title, 
        "body": req.params.body, 
        "date": today.toLocaleDateString(),
        "time": today.toLocaleTimeString(),
        "likes": 0,
        "shares": 0,
        "likers": [],
    }}});
    console.log("new post created!");
    res.sendStatus(200);
});

// Get a person's posts
app.get("/aurora/api/getPosts/:username/:password", async (req, res) => {
    var posts = await newUserModel.findOne({username: req.params.username, password: req.params.password});
    console.log(posts["posts"]);
    res.send(posts["posts"]);
});


// Get all posts
app.get("/aurora/api/getAllPosts", async (req, res) => {
    let allUsers = await newUserModel.find();
    let posts = await allPostsModel.find();
    let eachPost = "";
    let allAdjustedPosts = [];
    for(eachPost of posts[0]["posts"]){
        for(eachUser of allUsers){
            if(eachPost["username"] == eachUser["username"]){
                eachPost["dp"] = eachUser["dp"];
                allAdjustedPosts.push(eachPost);
            }
        }
    }
    console.log(allAdjustedPosts);
    res.send(allAdjustedPosts);
    //console.log(posts[0]["posts"]);
    //res.send(posts[0]["posts"]);
});


// Like Posts
app.get("/aurora/api/likePost/:liker/:username/:time/:day/:month/:year", async (req, res) => {

    let likeInt = 0;
    let date = req.params.month.toString() + "/" + req.params.day.toString() + "/" + req.params.year.toString();

    // Check if likable
    let allLikers = await allPostsModel.findOne({});
    //console.log(allLikers);
    for(eachPost of allLikers["posts"]){
        if (eachPost["time"] == req.params.time && eachPost["date"] == date){
            console.log(eachPost["likers"]);
            if (eachPost["likers"].includes(req.params.liker)){
                console.log("already likes so decrease");
                likeInt = -1;
                await newUserModel.updateOne({username: req.params.username, posts: {$elemMatch: {time: req.params.time, date: date}} }, {$pull: {"posts.$.likers": {username: req.params.liker}} });
                await allPostsModel.updateOne({posts: {$elemMatch: {time: req.params.time, date: date}}}, {$pull: {"posts.$.likers": req.params.liker} });
                //await newUserModel.updateOne({username: req.params.username}, {$pull: {likers: req.params.username}});
            } else {
                console.log("new like added");
                likeInt = 1;
                await newUserModel.updateOne({username: req.params.username, posts: {$elemMatch: {time: req.params.time, date: date}} }, {$push: {"posts.$.likers": {username: req.params.liker}} });
                await allPostsModel.updateOne({posts: {$elemMatch: {time: req.params.time, date: date}}}, {$push: {"posts.$.likers": req.params.liker} });
                //await newUserModel.updateOne({username: req.params.username}, {$push: {likers: req.params.username}});
            }
        }
    }
    // Find the specific post and increment like
    //let user = await newUserModel.updateOne({username: req.params.username, posts: {$elemMatch: {time: req.params.time, date: date}} }, {$inc: {"posts.$.likes": likeInt}});
    
    // Add the liker to the likers list
    //await newUserModel.updateOne({username: req.params.username}, {$inc: {numOfLikes: likeInt}});

    // Find the specific post and increment like
    //await allPostsModel.updateOne({posts: {$elemMatch: {time: req.params.time, date: date}}}, {$inc: {"posts.$.likes": likeInt} });





    //console.log(user);
    res.status(200);
});

// admin
app.get("/aurora/api/likers", async (req, res) => {
    let likeInt = parseInt(req.params.like);
    let date = 3 + "/" + 19 + "/" + 2022;
    //let aa = await allPostsModel.findOne({posts: {$elemMatch: {time: req.params.time, date: date}}});
    let aa = await allPostsModel.findOne({});
    for(eachPost of aa["posts"]){
        console.log(eachPost["likers"]);
    }
    res.status(200);

});





