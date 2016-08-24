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

router.get('/events', function(req, res, next) {
  res.render('events', { title: 'Nkhoma University Events' });
});

router.get('/gallery', function(req, res, next) {
  res.render('gallery', { title: 'Nkhoma University Gallery' });
});

router.get('/services', function(req, res, next) {
  res.render('services', { title: 'Our Services' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Contact Us' });
});

router.get('/student', function(req, res, next) {
  res.render('./student/index', { title: 'Contact Us' });
});


module.exports = router;
