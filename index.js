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
        "sender": "BoJack",
        "message": "Well this is depressing",
        "date": "12/2/2022",
        "time": "4:22",
    },
    {
        "sender": "Nate",
        "message": "This's cool",
        "date": "12/2/2022",
        "time": "4:30",
    },
    {
        "sender": "Batman",
        "message": "I'm Batman 🦇",
        "date": "12/2/2022",
        "time": "4:46",
    },
];

// Send Global Message
app.get("/api/sendGlobalMessage/:sender/:message",(req, res)=>{
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);    
    let messageObject = {
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

