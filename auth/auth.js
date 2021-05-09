module.exports = (req,res,next)=>{
    if(req.session.user_data)
        next()
    else
        res.redirect("/index/signin")
}