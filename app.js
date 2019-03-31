const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
require('./src/helpers/coursesHelpers');
require('./src/helpers/usersHelpers');

const app = express();

const coursesRoutes = require('./routes/courses');
const usersRoutes = require('./routes/users');
const dirPartials = path.join(__dirname, '/views/partials');
const bootstrapRoute = path.join(__dirname, '/node_modules');

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/courses', coursesRoutes);
app.use('/users', usersRoutes);
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(bootstrapRoute + '/bootstrap/dist/css'));
app.use('/js', express.static(bootstrapRoute + '/jquery/dist'));
app.use('/js', express.static(bootstrapRoute + '/popper.js/dist'));
app.use('/js', express.static(bootstrapRoute + '/bootstrap/dist/js'));

app.set('view engine', 'hbs');
hbs.registerPartials(dirPartials);

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(3000, () => {
  console.log(`Servidor iniciado en "localhost:3000"`);
});
