const express = require('express');
const router  = express.Router();
const passport = require('passport');
const {ensureAuth,ensureGuest} = require('../middleware/auth');

//route  /auth/google  will give all profiles to login
router.get('/google',passport.authenticate('google',{scope:['profile']}));


//route /auth/google/callback  profile clicked then callback 
router.get('/google/callback',passport.authenticate('google',{ failureRedirect:'/'}),
    (req,res)=>{
        res.redirect('/dashboard');
    }
);


module.exports = router;