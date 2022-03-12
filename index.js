let express = require("express");
const { ListCollectionsCursor } = require("mongodb");
let app = express();
let mongoose = require("mongoose");

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
app.get("/api/",(req, res) => {
    res.send("Welcome to New-Social API");
});


// G L O B A L  C H A T
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
        "message": "I'm Batman 🦇",
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
app.get("/api/sendGlobalMessage/:sender/:message",(req, res)=>{
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
app.get("/api/receiveGlobalMessage", async (req, res)=>{
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
app.get("/api/deleteGlobalMessage/:sender/:message/:time", async (req, res) => {
    let b = await messagesModel.deleteOne({sender: req.params.sender, message: req.params.message, time: req.params.time});
    res.send("Message Deleted!");
})

// Editing Global Message
app.get("/api/updateGlobalMessage/:sender/:message/:time/:newMessage", async (req, res) => {
    console.log("editting");
    let b = await messagesModel.updateOne({sender: req.params.sender, message: req.params.message, time: req.params.time}, {$set: {sender: req.params.sender, message: req.params.newMessage, time: req.params.time}});
    console.log("Done!");
    res.send("Message Deleted!");
})

// Server
let portNum = process.env.PORT || 7000;
app.listen(portNum, ()=>{
    console.log(`Server listening on port ${portNum}`);
})

// admin quick changes 
app.get("/api/changeDPGlobalMessage/:sender/:dp", async (req, res)=>{
    console.log("fixing");
    let b = await messagesModel.updateMany({sender: req.params.sender}, {$set: {dp: req.params.dp}});
    console.log("Done!");
    res.send("Changed DP!");
})
app.get("/api/changeDPGlobalMessage", async (req, res)=>{
    console.log("fixing");
    let b = await messagesModel.updateMany({sender: "yeabu"}, {$set: {dp: "https://i.pinimg.com/originals/48/3f/be/483fbebfa30d9d506715307a9de897b1.gif"}});
    console.log("Done!");
    res.send("Changed DP!");
})



//?
// Create a new User
let newUserSchema = new mongoose.Schema({
    dp: String,
    username: String,
    password: String,
    creationDate: String,
    creationTime: String,
    profile: Array,
    friends: Array,
    posts: Array,
    chats: Array,
});

let allUsersSchema = new mongoose.Schema({
    profiles: Array,
});

let newUserModel = new mongoose.model("users", newUserSchema);
let allUsersModel = new mongoose.model("allUsers", allUsersSchema);

// Create a new User
app.get("/api/createNewUser/:username/:password", async (req, res) => {
    console.log("creating new user!");
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);    
    let newUser = new newUserModel({
        dp: "https://i.pinimg.com/564x/86/4d/3f/864d3f2beebcd48f4cf57052031de4a0.jpg",
        username: req.params.username,
        password: req.params.password,
        creationDate: today.toLocaleDateString(),
        creationTime: today.toLocaleTimeString(),
    }).save();
    await allUsersModel.updateOne({_id: "622cc8969b3a116206a8c96b"},{$push: {profiles: {username: req.params.username}}});
    console.log("new user account created!");
    res.send("New account created!");
});

// Get all usernames 
app.get("/api/getAllUsers", async (req, res) => {
    await allUsersModel.find().then((result) => {
        res.send(result[0]["profiles"]);
        console.log(result[0]["profiles"]);
    }).catch((err) => {
        console.log(err)
    });
});

// Login
app.get("/api/login/:username/:password", async (req,res ) => {
    await newUserModel.findOne({username: req.params.username, password: req.params.password}).then((result) => {
        res.send(result)
        console.log(result);
    }).catch((err) => {
        res.send(null);
        console.log(err);
    });
});

//? Posts
// Create New Post
app.get("/api/createNewPost/:username/:title/:subtitle/:likes/:shares", async (req, res) => {
    console.log("creating new post...");
    await newUserModel.updateOne(
        {
            username: req.params.username
        }, 
        {
            $push: {
                posts:
                    {
                        title: req.params.title, 
                        subtitle: req.params.subtitle, 
                        likes: req.params.likes, 
                        shares: req.params.shares
                    }   
            }
        }
    );
    console.log("new post created!");
    res.send("New Post created!");
});


//!  IMPORTANT
// Connect To DB - MongoDB Atlas - 500mbs
async function connectToDB(){
    console.log("Connecting...");
    let mongoAtlastUrl = "mongodb+srv://NewSocialAPI:NewSocialAPI1234@cluster0.fivp4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    await mongoose.connect(mongoAtlastUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(console.log("MDBA Connected!")).catch(err => console.log("ERROR"));
    console.log("connected!");
}

connectToDB();



