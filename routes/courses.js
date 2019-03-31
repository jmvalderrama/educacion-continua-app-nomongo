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

router.get('/enrolled', (req, res) => {
  res.render('courses/enrolled');
});

router.get('/list-users', (req, res) => {
  courses.searchCourse(req.query);
  res.render('courses/list');
});

router.post('/list-users', (req, res) => {
  courses.deleteUser(req.body.user, req.body.course);
  res.render('courses/enrolled');
});

router.get('/table', (req, res) => {
  courses.checkMessage(req.method);
  res.render('courses/table');
});

module.exports = router;
