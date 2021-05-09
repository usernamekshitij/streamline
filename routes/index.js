const express = require('express')
const Router = express.Router()
const OccupationModel = require("../models/occupations")
const UserModel = require("../models/user")
const bcrypt = require("bcrypt")
const auth = require("../auth/auth")
const { spawnSync } = require('child_process');
const json = require('body-parser/lib/types/json')

Router.get('/',(req,res)=>{
    res.render("pages/homepage")
})

Router.get('/signin',(req,res)=>{
    res.render("pages/login")
})

Router.post("/signin",(req,res)=>{
    UserModel.findOne({email:req.body.username},(err,user)=>{
        if(err)
            console.log(err)
        else{
            bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
                if(err)
                    console.log(err)
                else if(isMatch){
                    console.log("welcome back " + user.name);
                    req.session.user_data = user
                    res.redirect("/index/home")
                }
            })
        }   
    })
})

Router.get('/signup',(req,res)=>{
    console.log(req.session.test)
   OccupationModel.find({},(err,data)=>{
        if(err)
            console.log(err)
        else{
            let occu = data[0];
            res.render("pages/signup",{occupations:occu['occupations']});
        }
    })
})

Router.post('/signup',(req,res)=>{
    let data = req.body
    let dataString = ""
    let final_data = null

    //passing the json obj to the python code
    let argu_data = JSON.stringify(req.body)
    const py = spawnSync('echo', [argu_data, "| python automated/add_user.py"],{shell:true});
    
    //storing the data in datastring
    dataString = py.stdout.toString()
    final_data = JSON.parse(dataString)

    data['by_rating'] = final_data['rating']
    data['by_popularity'] = final_data['popularity']

    //saving the data in the database
    let userData = new UserModel(data)
    userData.save(()=>{res.send("New user saved successfully")})
    
})

Router.get("/home",auth,(req,res)=>{
    res.render("pages/mainpage",{user:req.session.user_data})
})

module.exports = Router
