var express = require('express');
var router = express.Router();
var model = require('../models/db_model');
var knex = require('../config/bookshelf').knex;

var fs = require("fs");
const fileUpload = require('express-fileupload');

router.get('/csvdownload', function (req, res, next) {

	var course_code = req.query.course_code;
	var academic_year = req.query.academic_year

	var json2csv = require('json2csv');
	var fields = ['regno', 'name','academic_year','year_of_study','course_code','course_final_grade'];
	var fieldNames = ['Registration Number', 'Full Name ','Academic Year ','Year of Study ','Course code ','Final Agrregate Grade '];
	

  	knex('students').select(['students.regno', 'students.first_name', 'students.middle_name', 'students.last_name', 'students.maiden_name', 'students.year_of_study', 'students.semester', 'programme_courses.course_code']).leftJoin('programme_courses', 'students.programme_id', 'programme_courses.programme_id').whereRaw('students.year_of_study = programme_courses.study_year and students.semester = programme_courses.semester').where({'programme_courses.course_code': req.query.course_code}).then(function(students){  	
    	var csv_data = [];
    	students.map(function(student){
    		var data = {
    					regno: student.regno, 
    					name: (student.first_name +" "+ student.last_name) , 
    					academic_year : academic_year,
    					year_of_study : student.year_of_study ,
    					course_code : course_code,
    					course_final_grade : " "}
    		csv_data.push(data)
    	});

    	var csv = json2csv({ data: csv_data, fields: fields, fieldNames: fieldNames });

    	fs.writeFile('./files/templates/template'+course_code+'.csv', csv, function(err) {
			  if (err) throw err;
			  res.download('./files/templates/template'+course_code+'.csv');
		});
    	
  	});

});

router.post("/csvupload",function(req,res,next){
	var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        console.log("Uploading: " + filename); 
        fstream = fs.createWriteStream(__dirname + '/../files/results/' + filename);
        file.pipe(fstream);
        fstream.on('close', function () {
            res.redirect('back');
        });
    });
});

module.exports = router;
