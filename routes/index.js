const express = require('express')
const Router = express.Router()

Router.get('/',(req,res)=>{
    res.render("pages/homepage")
})

Router.get('/signin',(req,res)=>{
    res.render("pages/login")
})

Router.get('/signup',(req,res)=>{
    res.render("pages/signup");
})

module.exports = Router
