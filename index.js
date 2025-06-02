const  express = require("express");
const cors = require("cors");
const connect = require("./config/connectDatabase.js");
require("dotenv").config();

const app = express();
const port = 3030;

// middleware zone
app.use(express.json());
app.use(cors());


// test first API 

app.get('/',(req,res)=>{
    res.send("Hello from Mayura to get junior dev");
})

connect().then(()=>{
    app.listen(port,()=>{
        console.log("server is running on port :",port);
    })
})


