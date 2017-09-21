const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/assets'));

var url = 'mongodb://localhost:27017/smsservice';

hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear()
});

app.get('/', (req, res) => {
    res.render('login.hbs');
});

app.get('/home', (req, res) => {
    res.render('home.hbs');
});

app.get('/about', (req, res) => {
    res.render('about.hbs');
});

app.get('/contact', (req, res) => {
    res.render('contact.hbs');
});

app.get('/smsservice', (req, res) => {
    res.render('smsservice.hbs');
});

app.post('/loginCheck', (req, res) => {
    var resultArray = [];
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log(req.body.uname);
        console.log(req.body.pass);
        var cursor = db.collection('users').find({
            email: req.body.uname,
            pass: req.body.pass
        });
        cursor.forEach(function(doc, err) {
            assert.equal(null, err);
            resultArray.push(doc);
        }, function() {
            db.close();
            if (resultArray == '') {
                res.redirect('/');
            } else {
                res.redirect('/smsservice');
            }
        });
    });
});

app.post('/regisToDB', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        db.collection('users').insertOne({
            fname: req.body.fnameRegis,
            lname: req.body.lnameRegis,
            email: req.body.emailRegis,
            pass: req.body.passRegis
        }, function(err, result) {
            assert.equal(null, err);
            console.log('Regis complete - insert user to db');
            db.close();
        });
    });

    res.redirect('/');
});

app.post('/sendsms', (req, res) => {
    //https://www.intellisoftware.co.uk
    var intelliSMS = require('intellisms');
    var sms = new intelliSMS('smshospital', 'smsservice');
    // console.log(req.body.telno + " " + req.body.msg_data);
    //number and message 
    sms.SendMessage({ to: req.body.telno, text: req.body.msg_data }, function(err, id) {
        if (err) console.log(err);
        console.log(id);
        console.log("Send message to " + req.body.fname + " " + req.body.lname + " " + req.body.telno)
        res.redirect('/smsservice');
    });
});

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: 'Unable to handle request'
    });
});

app.get('/help', (req, res) => {
    // res.send('<h1><center>Contact Page</center></h1>');
    res.sendFile(__dirname + '/public/help.html');
});

app.listen(3001, () => {
    console.log('Server is up on port 3001');
});