let express = require("express");
let app = express();

// Home
app.get("/",(req, res) => {
    res.send("Welcome to New-Social API");
});


// Home
app.get("/api/",(req, res) => {
    res.send("Welcome to New-Social API");
});




let pornNum = process.env.PORT || 7000;
app.listen(pornNum, ()=>{
    console.log(`Server listening on port ${portNum}`);
})

