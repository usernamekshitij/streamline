const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')
const db = require("./db")
var session = require('express-session');

//session
app.use(session({
    secret: "1234567890QWERTY",
    resave: false,
    saveUninitialized: true,
    cookie : {maxAge:600000,secure:false}
    }));

//set middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

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

//connecting to database
db.on('error',()=>console.log("error connecting to database")).then(()=>console.log("successfully connected to database"))

app.listen('3000',()=>{
    console.log('server is running..')
})