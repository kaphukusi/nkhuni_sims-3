var express = require('express');
var router = express.Router();
var model = require('../models/db_model');
var knex = require('../config/bookshelf').knex;
var passport = require('passport');
var bcrypt = require('bcrypt');
const saltRounds = 10;
var loadUser = require('../force_login');
var wkhtmltopdf = require('wkhtmltopdf');

var session = require('express-session');
var app = express();


var busboy = require('connect-busboy');
var fs = require('fs'); //image uploading
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;
// vendor libraries
var multer = require('multer');
var upload = multer({dest: '/tmp'});
var uploadPath = './public/student_images/';
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
Programme_course = model.Programme_courses;
Student_course = model.Student_courses;
Student_image = model.Student_images;

/* GET home page. */

var sess;

router.get('/', loadUser, function(req, res, next) {
    if (req.isAuthenticated() &&  sess.username){
        var username = sess.username;
        knex('users').where({user_name: username}).limit(1).then(function(user_type_id){
                if (user_type_id[0].user_type_id == '001') {
                  return res.redirect('/index');
                }

                else if (user_type_id[0].user_type_id == '002') {
                  return res.redirect('/');
                }

                else if (user_type_id[0].user_type_id == '003') {
                  return res.redirect('/');
                }

                else if (user_type_id[0].user_type_id == '004') {
                  knex('departments').where({faculty_id: user_type_id[0].faculty}).then(function(departments){
                    return res.render('./dean/dashboard', { title: 'SIMS | Dean of ', departments: departments  } );
                  });
                }

                else if (user_type_id[0].user_type_id == '005') {
                  return res.redirect('/');
                }

                else if (user_type_id[0].user_type_id == '006') {
                  return res.redirect('/');
                }

                else if (user_type_id[0].user_type_id == '007') {
                  return res.redirect('/');
                }

                else if (user_type_id[0].user_type_id == '008') {
                  //console.log(user_type_id[0]);
                  sess.user_name = user_type_id[0].user_name;
                  console.log(sess.user_name)
                  knex('students').select(['students.regno', 'students.title', 'students.first_name', 'students.middle_name', 'students.last_name', 'maiden_name', 'students.religion', 'students.dob', 'students.village', 'students.ta', 'students.enrollment_year', 'students.student_type', 'students.year_of_study', 'students.semester', 'programmes.programme_name', 'districts.district_name', 'students_contact_details.primary_phone_number', 'students_contact_details.primary_postal_address', 'students_contact_details.primary_email_address', 'students_contact_details.secondary_phone_number', 'students_contact_details.secondary_email_address', 'students_contact_details.secondary_postal_ddress', 'student_images.image_url']).leftJoin('programmes', 'programmes.programme_id', 'students.programme_id').leftJoin('districts', 'districts.district_id', 'students.district_id').leftJoin('students_contact_details', 'students.regno', 'students_contact_details.reg_no').leftJoin('student_images', 'student_images.reg_no', 'students.regno').where({regno: user_type_id[0].user_name}).then(function(student){
                    console.log(student);
                  return res.render('./student/index', {title: 'SIMS | Student Page', student: student[0], sess: sess });
                  });
                }
                
              })
        }
        else{
            res.redirect('/sign_in');
        }

});

router.get('/index', loadUser, function(req, res, next){

      knex('students').select('faculty_name', 'faculties.faculty_id', 'regno').count("regno as student_count").leftJoin('programmes', 'students.programme_id', 'programmes.programme_id').leftJoin('faculties', 'programmes.faculty_id', 'faculties.faculty_id').groupBy('faculty_name').then(function(students){
          console.log(students)
          res.render('index', { title: 'SIMS | Administrator Panel', students: students })
      
        });
  
});

router.get('/dashboard', loadUser, function(req, res, next) {
  knex('departments').where({faculty_id: req.query.faculty_id}).then(function(departments){
    res.render('./dean/dashboard', { title: 'SIMS | Dean Of Faculty', departments: departments });
  })
  
});

/********************* STUDENTS METHODS AND VIEWS **************************************/

router.get('/new_student', loadUser, function(req, res, next) {
  
  new Programme().fetchAll().then(function(programmes) {
    new District().fetchAll().then(function(districts){

      res.render('./student/new_student', { title: 'SIMS | Register Student' , programmes: programmes.toJSON(), districts: districts.toJSON()});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

  });

});

router.get('/view_students', loadUser, function(req, res, next) {
  knex('students').select(['students.regno', 'students.first_name', 'students.middle_name', 'students.last_name', 'students.maiden_name', 'students.year_of_study', 'students.semester', 'students.student_type', 'programmes.programme_name', 'programmes.programme_code']).leftJoin('programmes', 'students.programme_id', 'programmes.programme_id').then(function(students){

    res.render('./student/view_students', { title: 'SIMS | View Students', students: students  } );

  });

});

router.get('/view_faculty_students', loadUser, function(req, res, next) {
  knex('students').select(['students.regno', 'students.first_name', 'students.middle_name', 'students.last_name', 'students.maiden_name', 'students.year_of_study', 'students.semester', 'students.student_type', 'programmes.programme_name', 'programmes.programme_code', 'faculties.faculty_id', 'faculties.faculty_name']).leftJoin('programmes', 'students.programme_id', 'programmes.programme_id').leftJoin('faculties', 'faculties.faculty_id', 'programmes.faculty_id').where({'faculties.faculty_id': req.query.faculty_id}).then(function(students){

    res.render('./student/view_faculty_students', { title: 'SIMS | View Students', students: students, student: students[0]  } );

  });

});

router.get('/students_menu', loadUser, function(req, res, next) {
  res.render('./student/students_menu' , { title: 'SIMS | Students Menu' });
});

router.post('/student/add', loadUser, function (req, res, next) {

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
    var semester = params.semester;

    knex("students").insert({
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
      semester: semester,
      programme_id: programme,
      student_type: student_type,
      dob: new Date('01-02-2013'),
      title: title
    }).then(function (student) {
      //console.log(student[0].rego)
      knex("users").insert({
        full_name: f_name,
        user_name: rego,
        reg_no: rego,
        password: 'password123',
        position: 'Student',
        user_type_id: 008 
      }).then(function (user){
        console.log('user created')
      })

    });

        res.redirect("/view_students");
            
});

router.post('/upload', upload.single('file'), function(req, res, next){
  var regno = req.body.regno;
  var fName = req.body.file_name;

  console.log('File Name = ' + fName);

  //console.log(req.file)
  filePath = (req.file.path);
  fileName = fName;//req.file.filename;
  mimetype = req.file.mimetype;

  new Student_image({
    reg_no: regno,
    image_url: fName
  }).save().then(function(student_image){
    newsPathUploads = uploadPath;

        if (!fs.existsSync(newsPathUploads)) {
            fs.mkdirSync(newsPathUploads, '0777');
            newPath = newsPathUploads + '/' + fileName;
            fse.copy(filePath, newPath, function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log("success!")
                    res.redirect("/student");
                }
            }); //copies file
        }
        else{
          newPath = newsPathUploads + '/' + fileName;
            fse.copy(filePath, newPath, function (err) {
                if (err) {
                    return console.error(err);
                } else {
                    console.log("success!")

                    res.redirect("/student?regno=" + regno);
                }
            }); //copies file
        }
  })

});

router.get('/student', loadUser, function(req, res, next) {

  knex('students').select(['students.regno', 'students.title', 'students.first_name', 'students.middle_name', 'students.last_name', 'maiden_name', 'students.religion', 'students.dob', 'students.village', 'students.ta', 'students.enrollment_year', 'students.student_type', 'students.year_of_study', 'students.semester', 'programmes.programme_name', 'districts.district_name', 'students_contact_details.primary_phone_number', 'students_contact_details.primary_postal_address', 'students_contact_details.primary_email_address', 'students_contact_details.secondary_phone_number', 'students_contact_details.secondary_email_address', 'students_contact_details.secondary_postal_ddress', 'student_images.image_url']).leftJoin('programmes', 'programmes.programme_id', 'students.programme_id').leftJoin('districts', 'districts.district_id', 'students.district_id').leftJoin('students_contact_details', 'students.regno', 'students_contact_details.reg_no').leftJoin('student_images', 'student_images.reg_no', 'students.regno').where({regno: sess.username}).then(function(student){
    //console.log(student);
    res.render('./student/index', {title: 'SIMS | Student Page', student: student[0], sess: sess });
    });
  
});

router.get('/view_results', loadUser, function(req, res, next) {

  knex('student_courses').select(['student_courses.reg_no', 'student_courses.course_code', 'student_courses.course_final_grade', 'student_images.image_url', 'courses.course_name']).leftJoin('student_images', 'student_images.reg_no', 'student_courses.reg_no').leftJoin('courses', 'courses.course_code', 'student_courses.course_code').where({'student_courses.reg_no': req.query.regno}).then(function(results){
  
  res.render('./student/view_results', { title: 'SIMS | Student Results', results: results, result: results[0] });
  })
});

router.get('/view_transcript', loadUser, function(req, res, next) {

  knex('student_courses').select(['student_courses.reg_no', 'student_courses.course_code', 'student_courses.course_final_grade', 'student_images.image_url', 'courses.course_name', 'students.first_name', 'students.middle_name', 'students.last_name']).leftJoin('students', 'students.regno', 'student_courses.reg_no').leftJoin('student_images', 'student_images.reg_no', 'student_courses.reg_no').leftJoin('courses', 'courses.course_code', 'student_courses.course_code').where({'student_courses.reg_no': req.query.regno}).then(function(results){
  
  res.render('./reports/view_transcript', { title: 'SIMS | View Transcript', results: results, result: results[0] });
  })
});

router.get('/view_students_per_course', loadUser, function(req, res, next) {

  var course_code = req.query.course_code;

  knex('students').select(['students.regno', 'students.first_name', 'students.middle_name', 'students.last_name', 'students.maiden_name', 'students.year_of_study', 'students.semester', 'programme_courses.course_code']).leftJoin('programme_courses', 'students.programme_id', 'programme_courses.programme_id').whereRaw('students.year_of_study = programme_courses.study_year and students.semester = programme_courses.semester').where({'programme_courses.course_code': req.query.course_code}).then(function(students){
    res.render('./student/view_students_per_course', { title: 'SIMS | Enter Grades', students: students, student: students[0] } );
  });

});


/***************************** FACULTY ACTIONS *****************************************/

router.get('/faculties_menu', loadUser, function(req, res, next) {
  res.render('./faculty/faculties_menu' , { title: 'SIMS | Faculties Menu' });
});

router.get('/new_falculty', loadUser, function(req, res, next) {

  res.render('./faculty/new_falculty', { title: 'SIMS | Add Faculty' });

});

router.post('/faculty/add', loadUser, function(req,res,next){

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

router.post('/faculty/save_edited', loadUser, function (req, res, next) {
    faculty_id = req.body.faculty_id;
    name = req.body.name;
    code = req.body.code;
    description = req.body.description;
    email = req.body.email;
    telephone = req.body.telephone;

    console.log(telephone);

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

router.get('/delete_falculty', loadUser, function(req, res, next) {

  knex('faculties').then(function(faculties){
    res.render('./faculty/delete_falculty', { title: 'SIMS | Delete Faculty' , faculties: faculties} );

  });
});

router.post('/void_faculty', loadUser, function (req, res, next) {
    faculty_ids = req.body.faculty_ids.split(",");
    knex('faculties').where('faculty_id', 'in', faculty_ids).del().then(function (faculties) {
        res.send('okay');
    });
});

router.get('/view_falculties', loadUser, function(req, res, next) {

  knex('faculties').then(function(faculties){

    res.render('./faculty/view_falculties', { title: 'SIMS | View Faculties', faculties: faculties  } );

  });

});

router.get('/edit_this_faculty', loadUser, function(req, res, next) {

  knex('faculties').where({faculty_id: req.query.faculty_id}).limit(1).then(function(this_faculty){

    res.render('./faculty/edit_this_faculty', { title: 'SIMS | Edit Faculty', this_faculty: this_faculty[0]  } );

  });

});

/**************************** DEPARTMENTS ACTIONS **********************************/

router.get('/departments_menu', loadUser, function(req, res, next) {
  res.render('department/departments_menu' , { title: 'SIMS | Departments Menu' });
});

router.get('/new_department', loadUser, function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

      var faculties = faculties.toJSON();

      res.render('department/new_department', { title: 'SIMS | New Department' , faculties: faculties});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

});

router.get('/view_departments', loadUser, function(req, res, next) {

  knex('departments').select(['departments.department_id', 'departments.department_code', 'departments.department_name', 'departments.department_email', 'departments.telephone', 'departments.department_description', 'departments.department_description', 'faculties.faculty_name']).leftJoin('faculties', 'departments.faculty_id', 'faculties.faculty_id').then(function (departments){

  res.render('./department/view_departments', { title: 'SIMS | View Departments', departments: departments });

  });

});

router.get('/view_faculty_departments', loadUser, function(req, res, next) {

  knex('students').select('faculty_name', 'department_id', 'department_name', 'department_description', 'faculties.faculty_id', 'regno').count("regno as student_count").leftJoin('programmes', 'students.programme_id', 'programmes.programme_id').leftJoin('faculties', 'programmes.faculty_id', 'faculties.faculty_id').leftJoin('departments', 'departments.faculty_id', 'faculties.faculty_id').where({'departments.faculty_id': req.query.faculty_id}).groupBy('department_name').then(function(departments){
    console.log(departments)

    res.render('./department/view_faculty_departments', { title: 'SIMS | View Departments', departments: departments });

  });

});

router.get('/edit_this_department', loadUser, function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

  var faculties = faculties.toJSON();

  knex('departments').where({department_id: req.query.department_id}).limit(1).then(function(this_department){

    res.render('./department/edit_this_department', { title: 'SIMS | Edit Department', this_department: this_department[0], faculties: faculties} );

  });

})

});

router.post('/department/save_edited', loadUser, function (req, res, next) {
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

        }).then(function (departments) {
          res.redirect("/view_departments");
        });
});

router.post('/department/add', loadUser, function (req, res, next) {
    
    var params = req.body;
    var name = params.name;
    var code = params.code;
    var faculty = params.faculty;
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

/********************  PROGRAMMES ACTIONS   ************************************/

router.get('/programmes_menu', loadUser, function(req, res, next) {
  res.render('programme/programmes_menu' , { title: 'SIMS | Programmes Menu' });
});

router.get('/view_programmes', loadUser, function(req, res, next) {

  knex('programmes').select(['programmes.programme_code', 'programmes.programme_name', 'programmes.programme_name_of_award', 'programmes.programme_years_of_study', 'programmes.programme_description', 'programmes.programme_id', 'faculties.faculty_name']).leftJoin('faculties', 'programmes.faculty_id', 'faculties.faculty_id').then(function (programmes){

  res.render('programme/view_programmes', { title: 'SIMS | View Programmes', programmes: programmes });

  });

});

router.get('/view_programmes_assign_courses', loadUser, function(req, res, next) {

  knex('programmes').then(function (programmes){

  res.render('dean/view_programmes_assign_courses', { title: 'SIMS | View Programmes', programmes: programmes });

  });

});

router.get('/assign_courses_to_programme', loadUser, function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

  var faculties = faculties.toJSON();

  knex('programmes').where({programme_id: req.query.programme_id}).limit(1).then(function(this_programme){
    
    knex('courses').then(function(courses){

    res.render('./dean/assign_courses_to_programme', { title: 'SIMS | Assign Courses', this_programme: this_programme[0], courses: courses} );

    });

  });

})

});


/**************** COURSES ACTIONS   *********************************************/

router.get('/courses_menu', loadUser, function(req, res, next) {
  res.render('courses/courses_menu' , { title: 'SIMS | Courses Menu' });
});

router.post('/save_assigned_courses', loadUser, function (req, res, next) {
    
    var params = req.body;
    var programme_code = params.programme_code;
    var programme_id = params.programme_id;
    var academic_year = params.academic_year;
    var year = params.year;
    var semester = params.semester;
    var course_codes = params.course_codes;

    var course_code = params.course_codes;

    console.log(course_codes.length);    

    if (course_codes.length <= 1) {

      new Programme_course({
        programme_id: programme_id,
        programme_code: programme_code,
        course_code: course_code,
        study_year: year,
        semester: semester

    }).save().then(function (programme_courses) {
  
    })
    }

    else{
      for (var i = 0; i < course_codes.length; i++) {

      new Programme_course({
        programme_id: programme_id,
        programme_code: programme_code,
        course_code: course_codes[i],
        study_year: year,
        semester: semester

      }).save().then(function (programme_courses) {
  
      })

      }
    }

    
    res.send("Okay")
    
});

router.get('/add_course', loadUser, function(req, res, next) {

  new Department().fetchAll().then(function(departments) {

      var departments = departments .toJSON();

      res.render('courses/add_course', { title: 'Add Course' , departments: departments });

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

  
});

router.get('/view_courses', loadUser, function(req, res, next) {

  knex('courses').select(['courses.course_id', 'courses.course_name', 'courses.course_code', 'courses.course_year_offered', 'courses.course_semester', 'departments.department_name']).leftJoin('departments', 'courses.department_id', 'departments.department_id').then(function(courses){

    res.render('./courses/view_courses', { title: 'SIMS | View Courses', courses: courses  } );

  });

});
router.get('/view_departmental_courses', loadUser, function(req, res, next) {

  knex('courses').select(['courses.course_name', 'courses.course_code', 'courses.course_id', 'courses.course_year_offered', 'courses.course_semester', 'departments.department_id', 'departments.department_name']).leftJoin('departments', 'departments.department_id', 'courses.department_id').where({'courses.department_id': req.query.department_id}).then(function(courses){

    res.render('./dean/view_departmental_courses', { title: 'SIMS | View Departmental Courses', courses: courses, course: courses[0] });

  });

});

router.get('/view_departmental_courses_enter_grades', loadUser, function(req, res, next) {

  knex('courses').where({department_id: req.query.department_id}).then(function(courses){

    res.render('./dean/view_departmental_courses_enter_grades', { title: 'SIMS | View Departmental Courses', courses: courses  } );

  });

});

router.get('/enter_grades_for_this_course', loadUser, function(req, res, next) {

  var course_code = req.query.course_code;

  knex('students').select(['students.regno', 'students.first_name', 'students.middle_name', 'students.last_name', 'students.maiden_name', 'students.year_of_study', 'students.semester', 'programme_courses.course_code']).leftJoin('programme_courses', 'students.programme_id', 'programme_courses.programme_id').whereRaw('students.year_of_study = programme_courses.study_year and students.semester = programme_courses.semester').where({'programme_courses.course_code': req.query.course_code}).then(function(students){
    res.render('./dean/enter_grades_for_this_course', { title: 'SIMS | Enter Grades', students: students, student: students[0] } );
  });

});

router.get('/view_mycourses', loadUser, function(req, res, next) {

  knex('programme_courses').select(['programme_courses.course_code', 'programme_courses.study_year', 'programme_courses.semester', 'students.regno', 'courses.course_name']).leftJoin('courses', 'courses.course_code', 'programme_courses.course_code').leftJoin('students', 'students.programme_id', 'programme_courses.programme_id').where({regno: req.query.regno}).then(function(mycourses){
    //console.log(mycourses)
  res.render('./student/view_mycourses', { title: 'SIMS | Student Courses', mycourses: mycourses, mycourse: mycourses[0] });
  })
});



router.post('/dean/save_grades', loadUser, function (req, res, next) {
    
    var params = req.body;
    
    var data = {
            semester : params.semester,
            year_of_study : params.year_of_study,
            academic_year : (params.academic_year? params.academic_year : (new Date().getFullYear())),
            reg_no : params.regno,
            course_code : params.course_code 
    }
    knex('student_courses').where(data).limit(1).then(function(record){
          if(record.length != 0 ){
            //Update here
            data.course_final_grade = params.course_final_grade
            new Student_course({student_course_id :record[0].student_course_id}).save(data).then(function (student_courses) {
                res.send(student_courses);
            });
          }else{
            //Insert
            data.course_final_grade = params.course_final_grade
            new Student_course(data).save().then(function (student_courses) {
                res.send(student_courses)
            })
          }
      });
    /*
        new Course({course_id: course_id}).save({
      course_name: course_name,
      course_code: course_code,
      department_id: department,
      course_year_offered: year_offered,
      course_semester: semester_offered,
      course_lecture_hours: course_lecture_hours,
      course_lab_hours: course_lab_hours
    }).then(function(courses){
      res.redirect("/view_courses");
    });
    */
    
});

router.get('/edit_this_course', loadUser, function(req, res, next) {

  new Department().fetchAll().then(function(departments) {
    var departments = departments.toJSON();

    knex('courses').where({course_id: req.query.course_id}).limit(1).then(function(this_course){

      res.render('./courses/edit_this_course', { title: 'SIMS | Edit Course', this_course: this_course[0], departments: departments} );

      });
  })

});



router.post('/course/add', loadUser, function(req,res,next){
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
          res.redirect("/view_courses");
    });

});

router.post('/courses/save_edited', loadUser, function (req, res, next) {
    params = req.body;
    course_name = params.name;
    course_code = params.code;
    department = params.department;
    year_offered = params.year_offered;
    semester_offered = params.semester_offered;
    course_lecture_hours = params.lecture_hours;
    course_lab_hours = params.lab_hours;
    course_id = params.course_id;

    console.log(params);

    new Course({course_id: course_id}).save({
      course_name: course_name,
      course_code: course_code,
      department_id: department,
      course_year_offered: year_offered,
      course_semester: semester_offered,
      course_lecture_hours: course_lecture_hours,
      course_lab_hours: course_lab_hours
    }).then(function(courses){
      res.redirect("/view_courses");
    });
});

router.get("/new_programme", loadUser, function(req,res,next){

      new Faculty().fetchAll().then(function(faculties) {

      var faculties = faculties.toJSON();

      res.render('./programme/new_programme', { title: 'SIMS | Add Programme' , faculties: faculties});

        }).catch(function(error) {

          console.log(error);

          res.send('An error occured');

        });

});

router.post('/programme/add', loadUser, function(req,res,next){

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
        programme_years_of_study: years_of_study,
        programme_description: description,

    }).save().then(function(programmes){
          res.redirect("/view_programmes");
    });

});

/******************** USERS ACTIONS  **************************/

router.get('/users_menu', loadUser, function(req, res, next) {
  res.render('users/users_menu' , { title: 'SIMS | Users Menu' });
});

router.get('/add_users_menu', loadUser, function(req, res, next) {
  res.render('users/add_users_menu' , { title: 'SIMS | Add Users Menu' });
});

// sign in
// GET

router.get('/sign_in', function (req, res, next) {
    if (req.isAuthenticated())
        res.render('/sign_in');
    res.render('sign_in', {title: 'Sign In'});
});

// sign in
// POST

router.post('/signin', function (req, res, next) {

    sess = req.session;

    var user = req.body;
    var username = user.username
    var password = user.password;

    sess.username=username;
    //console.log(sess.username);
   
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

              knex('users').where({user_name: username}).limit(1).then(function(user){
                bcrypt.compare(password, user[0].password, function(err, bcryptres) {
                    if(bcryptres){
                        if (user[0].user_type_id == '001') {
                          return res.redirect('/index');
                        }

                        else if (user[0].user_type_id == '002') {
                          return res.redirect('/');
                        }

                        else if (user[0].user_type_id == '003') {
                          return res.redirect('/');
                        }

                        else if (user[0].user_type_id == '004') {
                          knex('departments').where({faculty_id: user[0].faculty}).then(function(departments){
                            return res.render('./dean/dashboard', { title: 'SIMS | Dean of ', departments: departments  } );
                          });
                        }

                        else if (user[0].user_type_id == '005') {
                          return res.redirect('/');
                        }

                        else if (user[0].user_type_id == '006') {
                          return res.redirect('/');
                        }

                        else if (user[0].user_type_id == '007') {
                          return res.redirect('/');
                        }

                        else if (user[0].user_type_id == '008') {
                          //console.log(user_type_id[0]);
                          sess.user_name = user[0].user_name;
                          console.log(sess.user_name)
                          knex('students').select(['students.regno', 'students.title', 'students.first_name', 'students.middle_name', 'students.last_name', 'maiden_name', 'students.religion', 'students.dob', 'students.village', 'students.ta', 'students.enrollment_year', 'students.student_type', 'students.year_of_study', 'students.semester', 'programmes.programme_name', 'districts.district_name', 'students_contact_details.primary_phone_number', 'students_contact_details.primary_postal_address', 'students_contact_details.primary_email_address', 'students_contact_details.secondary_phone_number', 'students_contact_details.secondary_email_address', 'students_contact_details.secondary_postal_ddress', 'student_images.image_url']).leftJoin('programmes', 'programmes.programme_id', 'students.programme_id').leftJoin('districts', 'districts.district_id', 'students.district_id').leftJoin('students_contact_details', 'students.regno', 'students_contact_details.reg_no').leftJoin('student_images', 'student_images.reg_no', 'students.regno').where({regno: user[0].user_name}).then(function(student){
                            console.log(student);
                          return res.render('./student/index', {title: 'SIMS | Student Page', student: student[0], sess: sess });
                          });
                        }
                    }else{
                        req.logout();
                        res.render('./sign_in',{message: 'Invalid username or password'});
                    }
                });
              })

            }
        });
    })(req, res, next);
});

// sign up
// GET

router.get('/new_user', loadUser, function(req, res, next) {

  new User_types().fetchAll().then(function(user_types) {

      var user_types = user_types.toJSON();

      res.render('users/new_user', { title: 'SIMS | Add User' , user_types: user_types});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

});

router.get('/new_dean', loadUser, function(req, res, next) {

  new Faculty().fetchAll().then(function(faculties) {

      var faculties = faculties.toJSON();

      res.render('users/new_dean', { title: 'SIMS | Add User' , faculties: faculties});

    }).catch(function(error) {

      console.log(error);

      res.send('An error occured');

    });

});

router.get('/view_users', loadUser, function(req, res, next) {

  knex('users').then(function(users){

    res.render('./users/view_users', { title: 'SIMS | View Users', users: users } );

  });

});

router.post('/users/add_dean', loadUser, function (req, res, next) {

    var user = req.body;


    
    var usernamePromise = null;
    usernamePromise = new model.Users({user_name: user.username}).fetch();

    

    return usernamePromise.then(function (model) {
        if (model) {
            res.render('users/new_dean', {title: 'SIMS | Add User', errorMessage: 'username already exists'});
        } else {

            //****************************************************//
            // More Validation to be added
            //****************************************************//

            bcrypt.hash(user.password, saltRounds, function(err, hash) {
                new Users({
                    full_name:  user.full_name,
                    user_name:  user.username,
                    password:   hash,
                    position:   'Dean of Academics',
                    faculty:     user.faculty,
                    email:      user.email,
                    user_type_id:   004      
                }).save().then(function (user) {
                    // sign in the newly registered user
                    res.redirect('/view_users');
                });
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
