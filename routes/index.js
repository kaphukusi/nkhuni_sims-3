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
Programme = model.Programmes;
Student = model.Students;

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

router.post('/student/add', function (req, res, next) {

    var params = req.body;

    var f_name = params.fname;

    var m_name = params.mname;

    var s_name = params.sname

    var phone = params.phone;

    var whatsapp = params.whatsapp;

    var gender = params.gender;

    var homevillage = params.homevillage;

    var ta = params.ta;

    var district = params.district;

    var qualification = params.qualification;

    var programme = params.programme;

    var major_area_of_study = params.major_area_of_study;

    var date_registered = params.date_registered;

    var level = params.level;

    var religion_church = params.religion_church;

    var marital_status = params.marital_status

    var current_employer = params.current_employer;

    var place_of_work = params.place_of_work;

    var guardian = params.guardian;

    var guardian_phone = params.guardian_phone;

    var postal_address = params.postal_address;

    console.log(postal_address);

    new Student({
      rego: 1,
      first_name: f_name,
      last_name: s_name,
      middle_name: m_name,
      marital_status: marital_status,
      religion: religion_church,
      village: homevillage,
      ta: ta,
      district_id: 1,
      nationalty_id: 1,
      gender: gender,
      enrollment_year: 2003,
      programme_code: MAT,
      programme: Mathematical,
      year_of_study: 2
        
    }).save().then(function (students) {

       res.send("Student Added");

    });
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

router.post('/faculty/save_edited', function (req, res, next) {
    faculty_id = req.body.faculty_id;
    name = req.body.name;
    code = req.body.code;
    description = req.body.description;
    email = req.body.email;
    telephone = req.body.telephone;

    new Faculty({faculty_id: faculty_id}).save({
        faculty_name: name, 
        faculty_shortname: code,
        faculty_description: description,
        faculty_email: email,
        telephone: telephone
        })
            .then(function (faculties) {
                res.redirect("/view_falculties?faculty_id=" + faculty_id);
            });
});

router.get('/view_falculties', function(req, res, next) {

  knex('faculties').then(function(faculties){

    res.render('./faculty/view_falculties', { title: 'SIMS | View Falculties', faculties: faculties  } );

  });

});

router.get('/edit_this_faculty', function(req, res, next) {

  knex('faculties').where({faculty_id: req.query.faculty_id}).limit(1).then(function(this_faculty){

    res.render('./faculty/edit_this_faculty', { title: 'SIMS | Edit Faculty', this_faculty: this_faculty[0]  } );

  });

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

  knex('departments').then(function (departments){

  res.render('./department/view_departments', { title: 'SIMS | View Departments', departments: departments });

  //console.log(departments);

});

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

router.get('/add_course', function(req, res, next) {

  new Department().fetchAll().then(function(departments) {

      var departments = departments .toJSON();

      res.render('courses/add_course', { title: 'Add Course' , departments: departments });

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

  
});

router.post('/course/add',function(req,res,next){


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

router.get("/programme/new",function(req,res,next){

      new Faculty().fetchAll().then(function(faculties) {

      var faculties = faculties.toJSON();

      res.render('programme/new_programme', { title: 'SIMS | New Programme' , faculties: faculties});

        }).catch(function(error) {

          console.log(error);

          res.send('An error occured');

        });

});

router.post('/programme/add',function(req,res,next){


    var params = req.body;

    var name = params.name;

    var code = params.code;

    var level = params.level;

    var type_of_award = params.type_of_award;

    var name_of_award = params.name_of_award;

    var years_of_study = params.years_of_study;

    var description = params.description;

    var faculty = params.faculty;

    var pogramme  = {

                  faculty_id : faculty,

                  programme_code : code,

                  programme_name : name,

                  programme_type_of_award : type_of_award,

                  programme_level : level,

                  programme_name_of_award : name_of_award,

                  programme_years_of_study : years_of_study,

                  programme_description : description ,

                  campus_id : 1

    }

    new Programme(programme).save().then(function(object){

          res.send("Programme successfully Added");

    });

});



module.exports = router;
