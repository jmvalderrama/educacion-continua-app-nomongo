const fs = require('fs');

const hbs = require('hbs');

let coursesList,
  usersList = [];
let message, className, display, isAdded;

const isCreated = () => {
  try {
    usersList = require('../../src/users.json');
  } catch (error) {
    usersList = [];
  }
};

const areCoursesCreated = () => {
  try {
    coursesList = require('../../src/courses.json');
  } catch (error) {
    coursesList = [];
  }
};

const enrollUser = user => {
  isCreated();
  let newUser = {
    id: parseInt(user.id),
    email: user.email,
    name: user.name,
    phone: user.phone,
    courses: []
  };
  let hasCourses = usersList.find(item => item.id == user.id);
  if (hasCourses) {
    newUser.courses = hasCourses.courses;
  }
  if (newUser.courses.length > 0) {
    let isEnrolled = newUser.courses.find(enroll => enroll == user.course);
    if (!isEnrolled) {
      newUser.courses.push(parseInt(user.course));
      message = `El aspirante ${
        newUser.name
      } ha sido inscrito al curso exitosamente`;
      isAdded = true;
    } else {
      message = `El aspirante ${
        newUser.name
      } ya se encuentra inscrito en el curso`;
      isAdded = false;
    }
  } else {
    newUser.courses.push(parseInt(user.course));
  }
  let isDuplicated = usersList.find(item => item.id == newUser.id);
  if (isDuplicated) {
    isDuplicated.courses = newUser.courses;
  } else {
    usersList.push(newUser);
  }
  saveInJSON();
  display = '';
};

const saveInJSON = () => {
  let data = JSON.stringify(usersList);
  fs.writeFile(__dirname + '/../users.json', data, err => {
    if (err) throw err;
  });
};

const checkMessage = method => {
  if (method == 'GET') {
    message = '';
    display = 'display: none;';
  }
};

hbs.registerHelper('userInfo', () => {
  className = isAdded == true ? 'success' : 'danger';
  return `<div style="${display}" class="alert alert-${className}" role="alert">${message}</div>`;
});

hbs.registerHelper('userSelect', () => {
  areCoursesCreated();
  let selectCourse = `<select class="form-control" id="course" name="course"><option value="-" selected></option>`;

  coursesList.forEach(course => {
    if (course.state == 'available') {
      selectCourse =
        selectCourse + `<option value="${course.id}">${course.name}</option>`;
    }
  });

  selectCourse = selectCourse + '</select>';
  return selectCourse;
});

hbs.registerHelper('list', () => {
  isCreated();
  areCoursesCreated();
  let coursesCollapse = `<div class="accordion" id="accordionExample">`;
  i = 0;
  coursesList.forEach(course => {
    if (course.state == 'available') {
      coursesCollapse =
        coursesCollapse +
        `<div class="card">
      <div class="card-header" id="heading${i}">
        <h2 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
            <p class="text-left"><span class="text-decoration-none"><strong>Nombre del curso: </strong>${
              course.name
            }</span><br>
            <span class="text-decoration-none"><strong>Descripción: </strong>${
              course.description
            }</span><br>
            <span class="text-decoration-none"><strong>Valor: </strong>$${
              course.price
            }</span></p>
          </button>
        </h2>
      </div>
  
      <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
        <div class="card-body">
          <span><strong>Nombre del curso: </strong>${course.name}</span><br>
          <span><strong>Descripción: </strong>${course.description}</span><br>
          <span><strong>Valor: </strong>$${course.price}</span><br>
          <span><strong>Modalidad: </strong>${
            course.modality == '-'
              ? '-'
              : course.modality == 'virtual'
              ? 'Virtual'
              : 'Presencial'
          }</span><br>
          <span><strong>Intensidad: </strong>${
            course.hours == '-' ? '-' : course.hours + ' horas'
          }</span>
        </div>
      </div>
    </div>`;
      i++;
    }
  });

  coursesCollapse = coursesCollapse + '</div>';
  return coursesCollapse;
});

module.exports = {
  enrollUser,
  checkMessage
};
