const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose');
const User = require('../models/User');

module.exports = function(passport)
{
    passport.use
    (
        new GoogleStrategy({
            clientID:process.env.GOOGLE_CLIENTID,
            clientSecret:process.env.CLIENT_SECRET,
            callbackURL:'/auth/google/callback'
        },
        async(accessToken,refreshToken,profile,cb)=>{
            const newUser = {
                googleId:profile.id,
                displayName:profile.displayName,
                firstName:profile.name.givenName,
                lastName:profile.name.familyName,
                image:profile.photos[0].value
            }
            try{
                let user = await User.findOne({googleId:profile.id})
                //if user exists
                if(user)
                {
                    cb(null,user)
                }
                //create a new user
                else{
                    user = await User.create(newUser);
                }
            }
            catch(err){
                console.log(err);
            }
        }),
    )
    passport.serializeUser((user,cb)=>{
        cb(null,user.id)
    })
    passport.deserializeUser((id,cb)=>{
        User.findById(id,(err,user)=>cb(err,user));
    })
}