var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'About Nkhoma University' });
});

router.get('/courses', function(req, res, next) {
  res.render('courses', { title: 'Our Courses' });
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

module.exports = router;
