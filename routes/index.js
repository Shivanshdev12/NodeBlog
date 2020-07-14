const express = require('express');
const Blog= require('../models/Blog');
const router  = express.Router();
const {ensureAuth,ensureGuest} = require('../middleware/auth');

//route  /   starting from login
router.get('/',ensureGuest,(req,res)=>{
    return res.render('login',{
        layout:'login'
    });
});

//route  if logged in  /dashboard
router.get('/dashboard',ensureAuth,async (req,res)=>{
    try{
        const blogs = await Blog.find({user:req.user.id}).lean()
        return res.render('dashboard',{
            name:req.user.firstName,
            blogs,
        });
    }
    catch(err){
        console.error(err)
        res.render('error/500');
    }
});

//route get logout
router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/');
});


module.exports = router;


