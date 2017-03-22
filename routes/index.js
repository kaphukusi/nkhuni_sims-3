var express = require('express');
var router = express.Router();
var model = require('../models/db_model');
var knex = require('../config/bookshelf').knex;
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var loadUser = require('../force_login');


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
District = model.Districts;
Users = model.Users;
User_types = model.User_types;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SIMS | Admin Panel' });
});

router.get('/dashboard', function(req, res, next) {
  knex('departments').where({faculty_id: 1}).then(function(departments){
    res.render('./dean/dashboard', { title: 'SIMS | Dean Of Faculty', departments: departments });
  })
  
});

router.get('/new_student', function(req, res, next) {
  
  new Programme().fetchAll().then(function(programmes) {
    new District().fetchAll().then(function(districts){

      res.render('./student/new_student', { title: 'SIMS | Register Student' , programmes: programmes.toJSON(), districts: districts.toJSON()});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

  });

});

router.get('/view_students', function(req, res, next) {
  knex('students').then(function(students){

    res.render('./student/view_students', { title: 'SIMS | View Students', students: students  } );

  });

});

router.post('/student/add', function (req, res, next) {

    var params = req.body;
    var f_name = params.fname;
    var m_name = params.mname;
    var s_name = params.sname
    var phone = params.phone;
    var gender = params.gender;
    var homevillage = params.homevillage;
    var ta = params.ta;
    var district = params.district;
    var qualification = params.qualification;
    var programme = params.programme;
    var major_area_of_study = params.major_area_of_study;
    var date_registered = params.date_registered;
    var level = params.level;
    var year_of_study = params.year_of_study;
    var student_type = params.student_type;
    var title = params.title;
    var rego = params.rego;
    var district = params.district;

    new Student({
      regno: rego,
      first_name: f_name,
      last_name: s_name,
      middle_name: m_name,
      village: homevillage,
      ta: ta,
      district_id: district,
      nationalty_id: 1,
      gender: gender,
      enrollment_year: 2003,
      year_of_study: year_of_study,
      programme_id: programme,
      student_type: student_type,
      dob: new Date('01-02-2013'),
      title: title
        
    }).save().then(function (students) {

       res.send("Student Added");

    });
});

//faculty actions

router.get('/new_falculty', function(req, res, next) {

  res.render('./faculty/new_falculty', { title: 'SIMS | Add Faculty' });

});

router.post('/faculty/add',function(req,res,next){

    var params = req.body;
    var name = params.name;
    var code = params.code;
    var description = params.description;
    var email = params.email;
    var telephone = params.phone;

    new Faculty({
        campus_id: 1,
        faculty_shortname: code,
        faculty_name: name,
        faculty_description: description,
        faculty_email: email,
        telephone: telephone
    }).save().then(function (faculties) {

       return res.redirect("/view_falculties");

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
                res.redirect("/view_falculties");
            });
});

router.get('/delete_falculty', function(req, res, next) {

  knex('faculties').then(function(faculties){
    res.render('./faculty/delete_falculty', { title: 'SIMS | Delete Faculty' , faculties: faculties} );

  });
});

router.post('/void_faculty', function (req, res, next) {
    faculty_ids = req.body.faculty_ids.split(",");
    knex('faculties').where('faculty_id', 'in', faculty_ids).del().then(function (faculties) {
        res.send('okay');
    });
});

router.get('/view_falculties', function(req, res, next) {

  knex('faculties').then(function(faculties){

    res.render('./faculty/view_falculties', { title: 'SIMS | View Faculties', faculties: faculties  } );

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

router.get('/view_programmes', function(req, res, next) {

  //new Faculty().fetchAll().then(function(faculties) {

  //var faculties = faculties.toJSON();

  knex('programmes').then(function (programmes){

  res.render('programme/view_programmes', { title: 'SIMS | View Programmes', programmes: programmes });

  //console.log(departments);

});

});

router.get('/view_programmes_assign_courses', function(req, res, next) {

  //new Faculty().fetchAll().then(function(faculties) {

  //var faculties = faculties.toJSON();

  knex('programmes').then(function (programmes){

  res.render('dean/view_programmes_assign_courses', { title: 'SIMS | View Programmes', programmes: programmes });

  //console.log(departments);

});

});

router.get('/assign_courses_to_programme', function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

  var faculties = faculties.toJSON();

  knex('programmes').where({programme_id: req.query.programme_id}).limit(1).then(function(this_programme){
    
    knex('courses').then(function(courses){

    res.render('./dean/assign_courses_to_programme', { title: 'SIMS | Assign Courses', this_programme: this_programme[0], courses: courses} );

  });

  });

})

});

router.post('/save_assigned_courses', function (req, res, next) {
    
    var params = req.body;
    var name = params.name;
    var code = params.code;
    var faculty = params.faculty
    var description = params.description;
    var email = params.email;
    var telephone = params.telephone;

    new Department({

        faculty_id: faculty,
        department_code: code,
        department_name: name,
        department_description: description,
        department_email: email,
        telephone: telephone
        
    }).save().then(function (faculties) {

       res.redirect("/view_departments")

    })
});

router.get('/edit_this_department', function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

  var faculties = faculties.toJSON();

  knex('departments').where({department_id: req.query.department_id}).limit(1).then(function(this_department){

    res.render('./department/edit_this_department', { title: 'SIMS | Edit Department', this_department: this_department[0], faculties: faculties} );

  });

})

});

router.post('/department/save_edited', function (req, res, next) {
    department_id = req.body.department_id;
    name = req.body.name;
    code = req.body.code;
    description = req.body.description;
    faculty = req.body.faculty;
    email = req.body.email;
    telephone = req.body.telephone;

    new Department({department_id: department_id}).save({
        faculty_id: faculty,
        department_code: code,
        department_name: name,
        department_description: description,
        department_email: email,
        telephone: telephone

        })
            .then(function (departments) {
                res.redirect("/view_departments");
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

    new Department({

        faculty_id: faculty,
        department_code: code,
        department_name: name,
        department_description: description,
        department_email: email,
        telephone: telephone
        
    }).save().then(function (faculties) {

       res.redirect("/view_departments")

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

router.get('/view_courses', function(req, res, next) {

  knex('courses').then(function(courses){

    res.render('./courses/view_courses', { title: 'SIMS | View Courses', courses: courses  } );

  });

});
router.get('/view_departmental_courses', function(req, res, next) {

  knex('courses').where({department_id: req.query.department_id}).then(function(courses){

    res.render('./dean/view_departmental_courses', { title: 'SIMS | View Departmental Courses', courses: courses  } );

  });

});

router.get('/view_departmental_courses_enter_grades', function(req, res, next) {

  knex('courses').where({department_id: req.query.department_id}).then(function(courses){

    res.render('./dean/view_departmental_courses_enter_grades', { title: 'SIMS | View Departmental Courses', courses: courses  } );

  });

});

router.get('/enter_grades_for_this_course', function(req, res, next) {

  knex('courses').where({course_id: req.query.course_id}).limit(1).then(function(this_course){

    res.render('./dean/enter_grades_for_this_course', { title: 'SIMS | Enter Grades', this_course: this_course[0]  } );

  });

});

router.get('/edit_this_course', function(req, res, next) {

  knex('courses').where({course_id: req.query.course_id}).limit(1).then(function(this_course){

    res.render('./courses/edit_this_course', { title: 'SIMS | Edit Course', this_course: this_course[0]  } );

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

router.post('/courses/save_edited', function (req, res, next) {
    course_id = req.body.course_id;
    name = req.body.name;
    code = req.body.code;
    department = req.body.department;
    year_offered = req.body.year_offered;
    semester_offered = req.body.semester_offered;
    lecture_hours = req.body.lecture_hours;
    lab_hours = req.body.lab_hours;

    //console.log(department);

    new Course({course_id: course_id}).save({
         
        course_code: code,
        course_name: name,
        department_id: department,
        course_year_offered: year_offered,
        course_semester: semester_offered,
        course_lecture_hours: lecture_hours,
        course_lab_hours: lab_hours
        })
            .then(function (courses) {
                res.redirect("/view_courses");
            });
});

router.get("/new_programme",function(req,res,next){

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
    var type_of_award = params.type_of_award;
    var name_of_award = params.name_of_award;
    var years_of_study = params.years_of_study;
    var description = params.description;
    var faculty = params.faculty;

    new Programme({

        faculty_id: faculty,
        programme_code: code,
        programme_name: name,
        programme_type_of_award: type_of_award,
        programme_name_of_award: name_of_award,
        programme_years_of_study : years_of_study,
        programme_description : description,

        
    }).save().then(function(programmes){

          res.send("Programme successfully Added");

    });

});

// sign in
// GET

router.get('/sign_in', function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/');
    res.render('sign_in', {title: 'Sign In'});
});

// sign in
// POST

router.post('/signin', function (req, res, next) {

    var user = req.body;
    var username = user.username
   
    passport.authenticate('local', {successRedirect: '/',
        failureRedirect: '/sign_in'}, function (err, user, info) {
        if (err) {
            return res.render('sign_in', {title: 'Sign In', errorMessage: err.message});
        }

        if (!user) {
            return res.render('sign_in', {title: 'Sign In', errorMessage: info.message});
        }
        return req.logIn(user, function (err) {
            if (err) {
                return res.render('sign_in', {title: 'Sign In', errorMessage: err.message});
            } else {

              knex('users').where({user_name: username}).limit(1).then(function(user_type_id){
                if (user_type_id[0].user_type_id == '001') {
                  knex('departments').where({faculty_id: 1}).then(function(departments){

                  return res.render('./dean/dashboard', { title: 'SIMS | Dean', departments: departments  } );

                });
                

                }
                
              })

                
            }
        });
    })(req, res, next);
});

// sign up
// GET

router.get('/new_user', function(req, res, next) {

  new User_types().fetchAll().then(function(user_types) {

      var user_types = user_types.toJSON();

      res.render('users/new_user', { title: 'SIMS | Add User' , user_types: user_types});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

});

router.post('/users/add', function (req, res, next) {

    var user = req.body;


    
    var usernamePromise = null;
    usernamePromise = new model.Users({user_name: user.username}).fetch();

    

    return usernamePromise.then(function (model) {
        if (model) {
            res.render('users/new_user', {title: 'SIMS | Add User', errorMessage: 'username already exists'});
        } else {

            //****************************************************//
            // More Validation to be added
            //****************************************************//
            var password = user.password;
            var hash = bcrypt.hashSync(password);

            

            new Users({
                full_name:  user.full_name,
                user_name:  user.username,
                password:   hash,
                email:      user.email,
                user_type_id:   user.user_type_id      
            }).save().then(function (user) {
                // sign in the newly registered user
                return res.redirect('users/new_user');
            });
        }
    });
    (req, res, next);
});

// sign out
router.get('/sign_out', function (req, res, next) {
    if (!req.isAuthenticated()) {
        notFound404(req, res, next);
    } else {
        req.logout();
        res.redirect('/sign_in');
    }
});

module.exports = router;
