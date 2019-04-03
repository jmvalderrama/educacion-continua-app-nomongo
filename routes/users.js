const express = require('express');

const users = require('../src/helpers/usersHelpers');

const router = express.Router();

router.get('/new', (req, res) => {
  res.render('users/new');
});

router.get('/courses-list', (req, res) => {
  users.checkMessage(req.method);
  res.render('users/courses-list');
});

router.post('/new', (req, res) => {
  users.enrollUser(req.body);
  users.checkMessage(req.method);
  res.render('users/confirm');
});

router.get('/enrolled', (req, res) => {
  res.render('users/enrolled');
});

module.exports = router;
