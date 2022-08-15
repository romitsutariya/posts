const express= require('express');
const { randomBytes} =require("crypto")
const bp =require("body-parser")
var cors = require('cors');
const { default: axios } = require('axios');
const PORT=4000;
const app= express();

app.use(cors())
app.use(bp.json());

const posts={};
app.get("/posts",(req,res)=>{
 res.send(posts)
});

app.post("/posts", async (req,res)=>{
    const id= randomBytes(4).toString("hex");
     const {title}= req.body;
     posts[id]={
        id,title
     };
    await axios.post("http://localhost:7000/events",{
            type:"PostCreated",
            data:{
                id,title
            }
     });
     res.status(201).send(posts[id]);
});

app.post("/events", (req,res)=>{
     console.log(req.body.type)
     res.status(200).send({status:'ok'});
});

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`)
});