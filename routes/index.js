var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SIMS | Admin Panel' });
});

router.get('/new_student', function(req, res, next) {
  res.render('new_student', { title: 'SIMS | Register Student' });
});

router.get('/view_students', function(req, res, next) {
  res.render('view_students', { title: 'SIMS | View Students' });
});

router.get('/new_falculty', function(req, res, next) {
  res.render('new_falculty', { title: 'SIMS | Add Falculty' });
});

router.get('/view_falculties', function(req, res, next) {
  res.render('view_falculties', { title: 'SIMS | View Falculties' });
});

router.get('/new_department', function(req, res, next) {
  res.render('new_department', { title: 'SIMS | New Department' });
});

router.get('/view_departments', function(req, res, next) {
  res.render('view_departments', { title: 'SIMS | View Departments' });
});

router.get('/student', function(req, res, next) {
  res.render('./student/index', { title: 'Contact Us' });
});


module.exports = router;
