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
Falculty = model.Falculty;
Campus = model.Campus;
Course = model.Courses;

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
  res.render('new_falculty', { title: 'SIMS | Add Falculty' });
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

    new Campus({
        campus: 1,
        location: 'code',
        address: 'name',
        tel: 'category',
        email: 'hopekaphukusi@gmail.com',
        
    }).save().then(function (campus) {

       //console.log('Default user successfully set');

    })
});

router.get('/courses/add', function(req, res, next) {
  res.render('./courses/add_course', { title: 'Add Course' });
});

router.post('/courses/new',function(req,res,next){

    var params = req.body;

    var name = params.name;

    var code = params.code;

    var department = params.department;

    var year_offered = params.year_offered;

    var semester_offered = params.semester_offered;

    var lecture_hours = params.lecture_hours;

    var lab_hours = params.lab_hours;

    var course = {

                  course_code : code,

                  course_name : name,

                  department_id : department,

                  course_year_offered : year_offered,

                  course_semester : semester_offered,

                  course_lecture_hours : lecture_hours,

                  course_lab_hours : lab_hours

    }

    new Courses(course).save().then(function(object){

          res.send("Course successfully Added");

    });

 

});



module.exports = router;
