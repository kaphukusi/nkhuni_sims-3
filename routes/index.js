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

//faculty actions

router.get('/new_falculty', function(req, res, next) {
  res.render('./faculty/new_falculty', { title: 'SIMS | Add Falculty' });
});

router.post('/faculty/add',function(req,res,next){

    var params = req.body;

    var name = params.name;

    var code = params.code;

    var description = params.description;

    var email = params.email;

    var telephone = params.telephone;

    new Faculty({
        campus_id: 1,
        faculty_shortname: code,
        faculty_name: name,
        faculty_description: description,
        faculty_email: email,
        telephone: telephone
        
    }).save().then(function (faculties) {

       res.send("Faculty Added");

    });

});

router.get('/view_falculties', function(req, res, next) {

  res.render('./faculty/view_falculties', { title: 'SIMS | View Falculties' });

});

router.get('/new_department', function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

      var faculties = faculties.toJSON();

      res.render('department/new_department', { title: 'SIMS | New Department' , faculties: faculties});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

});

router.get('/view_departments', function(req, res, next) {

  res.render('./department/view_departments', { title: 'SIMS | View Departments' });

});

router.get('/student', function(req, res, next) {

  res.render('./student/index', { title: 'SIMS | Home' });

});

router.post('/department/add', function (req, res, next) {
    var params = req.body;

    var name = params.name;

    var code = params.code;

    var faculty = params.faculty

    var description = params.description;

    var email = params.email;

    var telephone = params.telephone;

    console.log(description);

    new Department({

        faculty_id: faculty,

        department_code: code,

        department_name: name,

        department_description: description,

        department_email: email,

        telephone: telephone
        
    }).save().then(function (faculties) {

       res.send("Department Added")

    })
});

router.get('/courses/add', function(req, res, next) {

  new Department().fetchAll().then(function(departments) {

      var departments = departments .toJSON();

      res.render('courses/add_course', { title: 'Add Course' , departments: departments });

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

  
});

router.post('/course/new',function(req,res,next){


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

    new Course(course).save().then(function(object){

          res.send("Course successfully Added");

    });

 

});



module.exports = router;
