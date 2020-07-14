const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);

dotenv.config({path:'./config/config.env'});
require('./config/passport')(passport);

connectDB();

const app = express();
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.use(express.static(path.join(__dirname,'public')));

app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body){
        let method = req.body._method
        delete req.body._method
        return method
    }
}))


if(process.env.NODE_ENV == 'development')
{
    app.use(morgan('dev'));
}

//importing helpers for handlebars
const helpers = {
    formatDate,
    stripHtml,
    striptxt,
    editIcon,
    select
} = require('./helpers/hbs');


app.engine('.hbs', exphbs({
    helpers:{formatDate,stripHtml,striptxt,editIcon,select},
    defaultLayout:'main',extname:'.hbs'}) );
app.set('view engine','.hbs');

app.use(session({
    secret:'ultrasecure',
    resave:false,
    saveUninitialized:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})
}));

app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
    res.locals.user = req.user || null
    next()
})

app.use('/',require('./routes/index'));
app.use('/auth',require('./routes/auth'));
app.use('/blogs',require('./routes/blog'));

app.get('*', function(req, res){
    return res.render('error/404');
});

const PORT = process.env.PORT || 3000;
app.listen(
    PORT,
    console.log(`Server running at port ${PORT}`)
);
