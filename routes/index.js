const express = require('express');
const path = require('path');
var app = express();
const mysql = require('mysql');
const fs = require('fs');
const directory = "./public/images";
const cors = require('cors');
const bodyParser = require('body-parser');

//homepageTP
app.get('/', (req,res) => {
    if(req.session.user){  
        res.sendFile(path.join(__dirname, '../public/homepageLoggedInTP.html'));
    } else {  
        res.sendFile(path.join(__dirname, '../public/homepageTP.html'));
    } 
});

//homepageTP loads images
app.get('/imageLoad', (req, res) => {
    var files = fs.readdirSync(directory);
    console.log(files);
    res.json(files);
});


//viewimageTP
app.get('/viewimage/:source', (req,res) => { 
    if(req.session.user){
        var imageSource = req.params.source; 
        //var imageObject = {imageSource};
        console.log('>>>>>>>>>>>>IN THE VIEWIMAGETP ROUTE'+imageSource);
        res.sendFile(path.join(__dirname, '../public/viewimageLoggedInTP.html'));
    } else {
        var imageSource = req.params.source;
        //var imageObject = {imageSource};
        console.log('>>>>>>>>>>>>IN THE VIEWIMAGETP ROUTE'+imageSource);
        res.sendFile(path.join(__dirname, '../public/viewimageTP.html'));
    } 
});

//need both cors and bodyparser or else it wont read JSON data correctly for some reason
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
//viewImageTP loads data
app.post('/fetchData', (req,res) => {
    let x = req.body.route;
    console.log(x);

    let db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Password12!@',
        database: 'csc317db'
    });
    
    let photopath1 = "%\\\\";
    let photopath2 = photopath1 + x;
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+photopath2);

    let sql = 'SELECT * FROM imageposts WHERE photopath LIKE ?';
    
    let query = db.query(sql, photopath2, (err,rows) => {
        if(err){
            console.log('>>>error accessing database');
            console.log(err);
            res.redirect('/');
        }else if(rows.length > 0){
            console.log(rows);
            var title = rows[0].title;
            var description = rows[0].description;
            var id = rows[0].id;
            console.log(title, description, id);

            let sql2 = 'SELECT comment FROM comments WHERE fk_postid = ?';
    
            let query2 = db.query(sql2, id, (err,rows) => {
                if(err){
                    console.log('>>>error accessing database');
                    console.log(err);
                    res.redirect('/');
                }else if(rows.length > 0){
                    console.log(rows);
                    var comments = [];
                    for(i=0; i < rows.length; i++){
                        comments.push(rows[i].comment);
                    }
                    console.log(comments);
                    var pageDetails = {
                        title: title,
                        description: description,
                        id: id,
                        comments: comments
                    };
                    res.send(JSON.stringify(pageDetails));
                }else{
                    console.log(err);
                    res.redirect('/');
                }
            });
        }else{
            console.log(err);
            res.redirect('/');
        }
    });
});


//comments handle - saves comments to database
app.post('/viewimage', (req, res) => {
    let { comments, imageId } = req.body;
    console.log(req.body);
    console.log(comments);
    console.log(imageId);
    
    let db = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Password12!@',
        database: 'csc317db'
    });
    
    let user = req.session.user;
    let sql = 'SELECT id FROM users WHERE username = ?';
    let query = db.query(sql,user, (err,rows) => {
        if(err){
            console.log(err);
            res.redirect('/');
        }else{
            let userId = rows[0].id;
            console.log(userId);
            
            let newComment = {comment: comments, fk_postid: imageId, fk_userid: userId};
            let sql2 = 'INSERT INTO comments SET ?';
            let query2 = db.query(sql2, newComment, (err,result) => {
                if(err) {
                    console.log(err);
                    res.redirect('/');
                }else{
                    console.log(result);
                    res.redirect('/');
                }
            }); 
        }
    });
});
   
module.exports = app; 
 