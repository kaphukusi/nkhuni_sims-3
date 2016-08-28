var express = require('express');
var router = express.Router();
var model = require('../models/db_model');
var knex = require('../config/bookshelf').knex;
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');

var busboy = require('connect-busboy');
var fs = require('fs'); //image uploading
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
// vendor libraries
var multer = require('multer');
var upload = multer({dest: '/tmp'});
var uploadPath = './uploads/';
var fse = require('fs-extra');


Department = model.Department;
Faculty = model.Faculty;
Campus = model.Campus;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SIMS | Admin Panel' });
});

router.get('/new_student', function(req, res, next) {
  res.render('./student/new_student', { title: 'SIMS | Register Student' });
});

router.get('/view_students', function(req, res, next) {
  res.render('./student/view_students', { title: 'SIMS | View Students' });
});

router.get('/new_falculty', function(req, res, next) {
  res.render('./faculty/new_falculty', { title: 'SIMS | Add Falculty' });
});

router.get('/view_falculties', function(req, res, next) {
  res.render('./faculty/view_falculties', { title: 'SIMS | View Falculties' });
});

router.get('/new_department', function(req, res, next) {
  res.render('./department/new_department', { title: 'SIMS | New Department' });
});

router.get('/view_departments', function(req, res, next) {
  res.render('./department/view_departments', { title: 'SIMS | View Departments' });
});

router.get('/student', function(req, res, next) {
  res.render('./student/index', { title: 'SIMS | Home' });
});

router.post('/add_department', function (req, res, next) {
    name = req.body.name;
    code = req.body.code;
    description = req.body.description;
    email = req.body.email;
    telephone = req.body.telephone;

    console.log(description);

    new Faculty({
        campus_id: 1,
        faculty_shortname: 'faculty_shortname',
        faculty_name: 'faculty_name',
        faculty_description: 'faculty_description',
        faculty_email: 'hopekaphukusi@gmail.com',
        telephone: '02245655'
        
    }).save().then(function (faculties) {

       //console.log('Default user successfully set');

    })
});

router.get('/courses/add', function(req, res, next) {
  res.render('./courses/add_course', { title: 'Add Course' });
});



module.exports = router;
