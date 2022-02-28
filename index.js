let express = require("express");
let app = express();

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
app.get("/api/sendGlobalMessage/:sender/:message/:dp",(req, res)=>{
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
    console.log(messageObject);
    globalMessages.push(messageObject);
    res.send("Message Sent!");
});

// Receive Global Message
app.get("/api/receiveGlobalMessage", (req, res)=>{
    console.log(globalMessages);
    res.send(globalMessages);
    console.log("Messages Received!");
});


// Server
let portNum = process.env.PORT || 7000;
app.listen(portNum, ()=>{
    console.log(`Server listening on port ${portNum}`);
})

