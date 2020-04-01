const express = require('express');
const path = require('path');
var app = express();
const mysql = require('mysql');
var bcrypt = require('bcryptjs');


const multer = require('multer');
//Can add the timestamp to avoid duplicate filenames - won't worry about it for now
//var A = Date.now();
//var timestamp = currentDate.getTime();
const storage = multer.diskStorage({
    destination: 'public/images/',
//
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
//    filename: function(req, file, cb) {
//        cb(null, A + file.originalname);
//    }
});

const upload = multer({storage: storage});

//registration page
app.get('/register', (req,res) => {  
    if(req.session.user){
        console.log('>>>>>>>>>user is logged in');
        res.sendFile(path.join(__dirname, '../public/logoutTP.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public/registrationTP.html')); 
    }
});

//register handle
app.post('/register', (req,res) => {
    let { uname, email, pword, pwordc } = req.body;
    
    //hash pword
    var hash = bcrypt.hashSync(pword, 10);
    
    //connect to DB
    let db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Password12!@',
        database: 'csc317db'
    });
    
    //submit new user data or throw error and refresh
    let newUser = {username: uname, email: email, password: hash, active: '1'};
    let sql = 'INSERT INTO users SET ?';
    let query = db.query(sql, newUser, (err, result)=> {
        if(err) {
            console.log('Error creating account');
            //throw err;
            res.redirect('/users/register');
        }else{
        console.log(result);
        res.redirect('/users/login');
        }
    });
});



//login page
app.get('/login', (req,res) => { 
    if(req.session.user){
        console.log('>>>>>>>>>user is logged in');
        res.sendFile(path.join(__dirname, '../public/logoutTP.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public/loginTP.html')); 
    }
});

//login handle
app.post('/login', (req,res) => {
//check for user session
    if(req.session.user){
        console.log('>>>>>>>>>>>USER ALREADY LOGGED IN');
        res.redirect('/');
    } else {
        let { uname, pword } = req.body;

        let db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Password12!@',
            database: 'csc317db'
        });

        const user = uname;
        const sql = 'SELECT password FROM users WHERE username = ?';

        let query = db.query(sql, user, (err, rows) => {
            if(err){
                console.log('>>>error accessing database');
                console.log(err);
                res.redirect('/users/login');
            }else if(rows.length > 0){
                console.log(rows);
                console.log(rows[0].password);

                var dbpword = rows[0].password;
                if(bcrypt.compareSync(pword, dbpword)){
                    console.log('>>>>passwords match');
                    req.session.user = user;
                    console.log('>>>USER STARTED SESSION');
                    res.redirect('/');
                }else{
                    console.log('>>>>passwords do not match');
                    res.redirect('/users/login');
                }
            }else{
                console.log('>>>User does not exist');
                res.redirect('/users/register');
            }
        });
    }
});    
    
    
//logout page
app.get('/logout', (req,res) => { 
    if(!req.session.user){
        console.log('>>>>>>>>>user is not logged in');
        res.sendFile(path.join(__dirname, '../public/loginTP.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public/logoutTP.html')); 
    }
});

//logout handle
app.post('/logout', (req,res) => {
    req.session.destroy();
    console.log(">>>>>>>>>>>USER LOGGED OUT");
    res.sendFile(path.join(__dirname, '../public/homepageTP.html'));
});



//postimage page
app.get('/post', (req,res) => {
    if(req.session.user){
        console.log('>>>>>>>>>user is logged in');
        res.sendFile(path.join(__dirname, '../public/postimageTP.html'));
    } else {
        console.log('>>>>>>>>>user needs to log in first');
        res.sendFile(path.join(__dirname, '../public/loginTP.html')); 
    } 
});

//postimage handle
app.post('/post', upload.single('userImage'), (req, res) => {
    let { title, description, userImage } = req.body;
    console.log(req.file);
    
    
    let db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Password12!@',
        database: 'csc317db'
    });
    
    var user = req.session.user;
    console.log(user);
    let sqlu = 'SELECT id FROM users WHERE username = ?';

    let query = db.query(sqlu, user, (err, rows ) => {
        if(err){
            console.log('>>>error accessing database');
            console.log(err);
            res.redirect('/users/login');
        }else if(rows.length > 0){
            console.log(rows);
            console.log(rows[0].id);
            const userId = rows[0].id;
            
            let fk_userId = userId;
            let img_path = req.file.path;
            let img_name = req.file.originalname;
            console.log(">>>"+ img_path);
            console.log(">>>"+ img_name);

            let userPost = {title: title, description: description, fk_userid: fk_userId, active: '1', photopath: img_path};
            let sql = 'INSERT INTO imageposts SET ?';
            let query2 = db.query(sql, userPost, (err, result)=> {
                if(err) {
                    throw err;
                    //res.redirect('/users/post');
                }else{
                    console.log(result);
                    res.redirect('/');
                }
            });
        }else{
            console.log('ERROR WITH VALUE OF USER');
        }
    });
});


module.exports = app;

