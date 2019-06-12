const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

var Notebook = require('../models/notebook');
var User = require('../models/user');

var async = require('async');

exports.index = function(req, res) {   
    
    async.parallel({
        notebook_count: function(callback) {
            Notebook.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
        },
        user_count: function(callback) {
            User.countDocuments({}, callback);
        },
    }, function(err, results) {
        res.render('index', { title: 'Local Library Home', error: err, data: results });
    });
};
exports.notebook_list = function(req, res, next) {
    Notebook.find({ author: req.session.user._id })
    .populate('notebook')
    .exec(function (err, list_notebooks) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('notebook_list', { title: 'Notebook List', notebook_list: list_notebooks, moment: require('moment')
    });
    });
  };

// Display detail page for a specific notebook.
exports.notebook_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: notebook detail: ' + req.params.id);
};

// Display notebook create form on GET.
exports.notebook_create_get = function(req, res, next) {
    Notebook.find({})
    .exec(function (err, notebooks) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('notebook_form', {title: 'Create new notebook'});
    });
    
};

// Handle notebook create on POST.
exports.notebook_create_post = [

    // Validate fields.
    body('title', 'title must be specified').isLength({ min: 1 }).trim(),
    body('content', 'content must be specified').isLength({ min: 1 }).trim(),

    
    // Sanitize fields.
    sanitizeBody('title').escape(),
    sanitizeBody('content').escape(),
    
    // Process request after validation and sanitization.
    (req, res, next) => {

        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create a BookInstance object with escaped and trimmed data.
        var notebook = new Notebook(  
          { 
            title: req.body.title,
            author: req.session.user._id,
            content: req.body.content,
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values and error messages.
            Notebook.find({})
                .exec(function (err, _) {
                    if (err) { return next(err); }
                    // Successful, so render.
                    res.redirect('/catalog');
            });
            return;
        }
        else {
            // Data from form is valid.
            notebook.save(function (err) {
                if (err) { return next(err); }
                   // Successful - redirect to new record.
                   res.redirect('/catalog');
                });
        }
    }
];

// Display notebook delete form on GET.
exports.notebook_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: notebook delete GET');
};

// Handle notebook delete on POST.
exports.notebook_delete_post = function(req, res, next) {
    Notebook.deleteOne({ _id: req.params.id }, function (err, _) {
        if (err) next();
        res.redirect('/catalog');
    });
};

// Display notebook update form on GET.
exports.notebook_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: notebook update GET');
};

// Handle notebook update on POST.
exports.notebook_update_post = function(req, res, next) {
    const doc = {
        title: req.body.title,
        content: req.body.content,
        updatedAt: Date(),
      }
      Notebook.update({_id: req.params.id}, doc, function(err, _) {
        if (err) {
          next(err);
        }
        res.redirect('/catalog')
    })
}

// Display detail page for a specific BookInstance.
exports.notebook_detail = function(req, res, next) {

    Notebook.findById(req.params.id)
    .populate('notebook')
    .exec(function (err, notebook) {
        console.log(notebook)
      if (err) { return next(err); }
      if (notebook==null) { // No results.
          var err = new Error('Notebook copy not found');
          err.status = 404;
          return next(err);
        }
      // Successful, so render.
      res.render('notebook_detail', { title: 'Notebook:', notebook:  notebook});
    })

};