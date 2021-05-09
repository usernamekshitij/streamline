const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')
const db = require("./db")

//set middleware
app.use(bodyParser.json())

//static files
app.use('/static',express.static('public'))

//set the view engine
app.set('view engine','ejs')

//routes
app.use('/index',indexRoutes);

//checking
app.get("/",(req,res)=>{
    res.send("working")
})

//checking connection with the database
db.on('error',()=>console.log("error connecting database")).then(()=>console.log("connected to database"))

//connecting to server
app.listen('3000',()=>{
    console.log('server is running..')
})