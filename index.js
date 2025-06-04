const  express = require("express");
const cors = require("cors");
const connect = require("./config/connectDatabase.js");
const testAPIRouter =require("./router/testAPI.route.js");
const UserRouter = require("./router/user.route.js");
const DataRouter = require("./router/graph.route.js"); 
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const port = 3030;

// middleware zone
app.use(express.json());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(cookieParser());


// test first API 

app.get('/',(req,res)=>{
    res.send("Hello from Mayura to get junior dev");
})

app.use("/creature",testAPIRouter);
app.use("/user",UserRouter);
app.use("/data",DataRouter);

connect().then(()=>{
    app.listen(port,()=>{
        console.log("server is running on port :",port);
    })
})




