#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Notebook = require('./models/notebook')
var User = require('./models/user')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var notebooks = []

function userCreate(login, password, cb) {
  userdetail = {login:login , password: password }
  
  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user)
    cb(null, user)
  }  );
}


function notebookCreate(title, author, content, cb) {
  notebookdetail = { 
    title: title,
    author: author,
    content: content
  }
    
  var notebook = new Notebook(notebookdetail);    
  notebook.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New notebook: ' + notebook);
    notebooks.push(notebook)
    cb(null, notebook)
  }  );
}

function createUsers(cb) {
    async.series([
        function(callback) {
            userCreate('Patrick', 'Rothfuss', callback);
        },
        function(callback) {
            userCreate('Ben', 'Bova', callback);
        },
        function(callback) {
            userCreate('Isaac', 'Asimov', callback);
        },
        function(callback) {
            userCreate('Bob', 'Billings', callback);
        },
        function(callback) {
            userCreate('Jim', 'Jones', callback);
        },
        ],
        // optional callback
        cb);
}


function createNotebooks(cb) {
    async.parallel([
        function(callback) {
          notebookCreate('Kingkiller', users[0], 'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.', callback);
        },
        function(callback) {
          notebookCreate("The Wise Man's Fear (The Kingkiller Chronicle, #2)",  users[0], 'Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.', callback);
        },
        function(callback) {
          notebookCreate("The Slow Regard of Silent Things (Kingkiller Chronicle)", users[1], 'Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.', callback);
        },
        function(callback) {
          notebookCreate("Apes and Angels", users[1], "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...", callback);
        },
        function(callback) {
            notebookCreate("Death Wave", users[2], "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...", callback);
        },
        function(callback) {
            notebookCreate('Test Book 1', users[3], 'Summary of test book 1', callback);
        },
        function(callback) {
            notebookCreate('Test Book 2', users[4], 'Summary of test book 2', callback)
        },
        ],
        // optional callback
        cb);
}


async.series([
    createUsers,
    createNotebooks,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: ' + err);
    }
    else {
        console.log('Notebooks: ' + notebooks);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




 
