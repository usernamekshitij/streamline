const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const indexRoutes = require('./routes/index')

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

app.listen('3000',()=>{
    console.log('server is running..')
})