const express = require('express');

const courses = require('../src/helpers/coursesHelpers');

const router = express.Router();

router.get('/new', (req, res) => {
  res.render('courses/new');
});

router.post('/new', (req, res) => {
  courses.createCourse(req.body);
  res.render('courses/table');
});

router.get('/table', (req, res) => {
  courses.checkMessage(req.method);
  res.render('courses/table');
});

router.get('/list', (req, res) => {
  res.render('courses/list');
});

module.exports = router;
