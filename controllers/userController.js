var User = require('../models/user');
var bcrypt = require('bcrypt')
// Display list of all users.
exports.user_list = function(req, res) {
    res.send('NOT IMPLEMENTED: user list');
};

// Display detail page for a specific user.
exports.user_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: user detail: ' + req.params.id);
};

// Display user create form on GET.
exports.user_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: user create GET');
};

exports.user_register_get = function(req,res) {
    res.render('register', {title: 'Register'});
}

// Handle user create on POST.
exports.user_register_post = function(req, res, next) {
    if (req.body.login && req.body.password) { 
        var userData = {
            login: req.body.login,
            password: req.body.password,
        }  //use schema.create to insert data into the db
        //hashing a password before saving it to the database
            
        User.create(userData, function (err, user) {
          if (err) {
            return next(err)
          } else {
            return res.redirect('/login');
          }
        });
      }
      

};

// Display user delete form on GET.
exports.user_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: user delete GET');
};

// Handle user delete on POST.
exports.user_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: user delete POST');
};

// Display user update form on GET.
exports.user_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: user update GET');
};

// Handle user update on POST.
exports.user_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: user update POST');
};

exports.user_login_get = function(req, res) {
    res.render('login', {title: 'Login'});
}

exports.user_login_post = function(req, res, next) {
    User.findOne({ login: req.body.login })
        .exec(function (err, user) {
            if (err) {
                return next(err)
            } else if (!user) {
                return res.redirect('/login')
            }
            bcrypt.compare(req.body.password, user.password, function (err, result) {
            if (result === true) {
                req.session.user = { _id: user._id, login: user.login }
                return res.redirect('/catalog')
            } else {
                return res.sendStatus(403);
            }
            })
        });
}

exports.user_logout_post = function(req, res, next) {
        if (req.session.user && req.cookies.user_sid) {
            res.clearCookie('user_sid');
            res.redirect('/catalog');
        } else {
            res.redirect('/login');
        }
}