var bookshelf = require('../config/bookshelf').bookshelf;

var Annual_student_records = bookshelf.Model.extend({
    tableName: 'annual_student_records',
    idAttribute: 'annual_record_id'
});

var Campus = bookshelf.Model.extend({
    tableName: 'campus',
    idAttribute: 'campus_id'
});

var Courses = bookshelf.Model.extend({
    tableName: 'courses',
    
});

var Department = bookshelf.Model.extend({
   tableName: 'departments',
   idAttribute: 'department_id'
});

var Districts = bookshelf.Model.extend({
   tableName: 'districts',
   idAttribute: 'district_id'
});

var Faculty = bookshelf.Model.extend({
   tableName: 'faculties',
   idAttribute: 'faculty_id'
});

var Programmes = bookshelf.Model.extend({
   tableName: 'programmes',
   idAttribute: 'programme_id'
});

var Programme_courses = bookshelf.Model.extend({
   tableName: 'programme_courses',
  
});

var Students = bookshelf.Model.extend({
   tableName: 'students',
   idAttribute: 'rego'
});

var Student_courses = bookshelf.Model.extend({
   tableName: 'student_courses',
   idAttribute: 'student_course_id'
});

var Student_images = bookshelf.Model.extend({
   tableName: 'student_images',
   idAttribute: 'student_image_id'
});

var Users = bookshelf.Model.extend({
   tableName: 'users',
   idAttribute: 'user_id'
});

var User_types = bookshelf.Model.extend({
   tableName: 'user_types',
   idAttribute: 'user_type_id'
});


models = {Annual_student_records: Annual_student_records, Campus: Campus, Courses: Courses, Department: Department, Districts: Districts, Faculty: Faculty, Programmes: Programmes, Programme_courses: Programme_courses, Students: Students, Student_courses: Student_courses, Student_images: Student_images, Users: Users, User_types: User_types};

module.exports = models;
