var express = require('express');
var router = express.Router();

// Require controller modules.
var notebook_controller = require('../controllers/notebookController');
var user_controller = require('../controllers/userController');
var reqLogin = (req, res, next) => {
    if (!(req.session.user && req.cookies.user_sid)) {
        res.redirect('/login');
    } else {
        next();
    }    
  };

/// user ROUTES ///
// GET catalog home page.
router.get('/', user_controller.user_register_get);  //This actually maps to /catalog/ because we import the route with a /catalog prefix
router.post('/', user_controller.user_register_post);

router.get('/catalog', reqLogin, notebook_controller.notebook_list);  //This actually maps to /catalog/ because we import the route with a /catalog prefix
router.post('/catalog', user_controller.user_register_post);
// GET request for creating user. NOTE This must come before route for id (i.e. display user).
router.get('/login', user_controller.user_login_get);
router.post('/login', user_controller.user_login_post);


router.get('/register', user_controller.user_register_get)
router.post('/register', user_controller.user_register_post);

router.get('/logout', user_controller.user_logout_post)

// GET request to delete user.
router.get('/user/:id/delete', user_controller.user_delete_get);

// POST request to delete user.
router.post('/user/:id/delete', user_controller.user_delete_post);

// GET request to update user.
router.get('/user/:id/update', user_controller.user_update_get);

// POST request to update user.
router.post('/user/:id/update', user_controller.user_update_post);

// GET request for one user.
router.get('/user/:id', user_controller.user_detail);

// GET request for list of all users.
router.get('/users', user_controller.user_list);

/// notebook ROUTES ///

// GET request for creating a notebook. NOTE This must come before route that displays notebook (uses id).
router.get('/notebook/create', notebook_controller.notebook_create_get);

// POST request for creating notebook. 
router.post('/notebook/create', notebook_controller.notebook_create_post);

// GET request to delete notebook.
router.get('/notebook/:id/delete', notebook_controller.notebook_delete_get);

// POST request to delete notebook.
router.post('/notebook/:id/delete', notebook_controller.notebook_delete_post);

// GET request to update notebook.
router.get('/notebook/:id/update', notebook_controller.notebook_update_get);

// POST request to update notebook.
router.post('/notebook/:id/update', notebook_controller.notebook_update_post);

// GET request for one notebook.
router.get('/notebook/:id', notebook_controller.notebook_detail);

// GET request for list of all notebook.
router.get('/notebooks', notebook_controller.notebook_list);

module.exports = router;