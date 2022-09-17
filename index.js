const express= require('express');
const { randomBytes} =require("crypto")
const bp =require("body-parser")
const cors = require('cors');
const { default: axios } = require('axios');
require('dotenv').config()


const PORT=4000;
const app= express();

//Env Configuration
const VERSION=process.env.VERSION || 'Latest';
const EVENT_HOST=process.env.EVENT_HOST || '127.0.0.1:7000';  // please add IP + post name

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
    await axios.post(`http://${EVENT_HOST}/events`,{
            type:"PostCreated",
            data:{
                id,title
            }
     }).catch(e=>console.log(e.message));
     res.status(201).send(posts[id]);
});

app.post("/events", (req,res)=>{
     console.log(req.body.type)
     res.status(200).send({status:'ok'});
});

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT} and version is ${VERSION}`)

    console.log(`Pub/Sub ip address is ${EVENT_HOST}`)
});