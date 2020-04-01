const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());

//Bodyparser - used to take in form field data
app.use(express.urlencoded({ extended: false }));//DO NOT COMMENT THIS OUT OR BCRYPTJS WILL FAIL
app.use(cookieParser());

//static file path
app.use(express.static(path.join(__dirname, 'public')));


//session
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        //if maxAge is set, user stays logged on for 5 minutes even after browser close
        //if not, user stays logged on indefinitely unless they log out or close the browser
        
        //maxAge: 60 * 1000 * 30, //in milliseconds == 5 minutes persists through browser close
        //note: old versions of internet explorer do not support maxAge and will just expire the cookie when closing browser
    }
}));

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);


module.exports = app;


/*========SQL STATEMENTS FOR REFERENCE========

app.get('/', (req,res) => {
    let sql = 'SELECT * FROM users';
    let query = db.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Check the console for the user data!');
    });
});

/*
app.get('/', (req,res) => {
    let newUser = {username: '', email: '', password: '', active: '1'};
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, newUser, (err, result)=> {
        if(err) throw err;
        console.log(result);
        res.send('Registration Complete!');
    });
});

==============================================*/