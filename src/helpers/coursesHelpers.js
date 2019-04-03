const fs = require('fs');

const hbs = require('hbs');

let coursesList,
  usersList = [];
let usersEnrolled = [];
let message, className, display, isAdded, courseSelected;

const isCreated = () => {
  try {
    coursesList = require('../../src/courses.json');
  } catch (error) {
    coursesList = [];
  }
};

const areUsersCreated = () => {
  try {
    usersList = require('../../src/users.json');
  } catch (error) {
    usersList = [];
  }
};

const createCourse = course => {
  isCreated();
  let newCourse = {
    id: parseInt(course.id),
    name: course.name,
    modality: course.modality,
    price: parseInt(course.price),
    description: course.description || '-',
    hours: parseInt(course.hours) || '-',
    state: 'available'
  };
  let isDuplicated = coursesList.find(item => item.id == course.id);
  if (!isDuplicated) {
    coursesList.push(newCourse);
    saveInJSON();
    message = `El curso "${newCourse.name}" ha sido agregado con éxito`;
    isAdded = true;
  } else {
    message = `Ya existe otro curso con ese id (${newCourse.id})`;
    isAdded = false;
  }
  display = '';
};

const saveInJSON = () => {
  let data = JSON.stringify(coursesList);
  fs.writeFile(__dirname + '/../courses.json', data, err => {
    if (err) throw err;
  });
};

const updateInJSON = newList => {
  let data = JSON.stringify(newList);
  fs.writeFile(__dirname + '/../users.json', data, err => {
    if (err) throw err;
  });
};

const updateCourses = newList => {
  let data = JSON.stringify(newList);
  fs.writeFile(__dirname + '/../courses.json', data, err => {
    if (err) throw err;
  });
};

const checkMessage = method => {
  if (method == 'GET') {
    message = '';
    display = 'display: none;';
  }
};

hbs.registerHelper('messageInfo', () => {
  className = isAdded == true ? 'success' : 'danger';
  return `<div style="${display}" class="alert alert-${className}" role="alert">${message}</div>`;
});

hbs.registerHelper('table', () => {
  isCreated();
  let coursesTable = `<table class="table table-hover">
  <thead class="bg-success">
  <th>Id</th>
  <th>Nombre</th>
  <th>Descripción</th>
  <th>Valor</th>
  <th>Modalidad</th>
  <th>Intensidad</th>
  <th>Estado</th>
  </thead>
  <tbody>`;

  coursesList.forEach(course => {
    coursesTable =
      coursesTable +
      `<tr>
        <td>${course.id}</td>
        <td>${course.name}</td>
        <td>${course.description}</td>
        <td>$${course.price}</td>
        <td>${
          course.modality == '-'
            ? '-'
            : course.modality == 'virtual'
            ? 'Virtual'
            : 'Presencial'
        }</td>
        <td>${course.hours == '-' ? '-' : course.hours + ' horas'}</td>
        <td>${course.state == 'available' ? 'Disponible' : 'Cerrado'}</td>
      </tr>`;
  });

  coursesTable = coursesTable + '</tbody></table>';
  return coursesTable;
});

hbs.registerHelper('courseSelect', () => {
  isCreated();
  let selectCourse = `<select class="form-control" id="id" name="id"><option value="-" selected></option>`;

  coursesList.forEach(course => {
    if (course.state == 'available') {
      selectCourse =
        selectCourse + `<option value="${course.id}">${course.name}</option>`;
    }
  });

  selectCourse = selectCourse + '</select>';
  return selectCourse;
});

const searchCourse = course => {
  isCreated();
  areUsersCreated();
  usersEnrolled = [];
  courseSelected = -1;
  usersList.forEach(user => {
    let isEnrolled = user.courses.find(item => item == course.id);
    if (isEnrolled) {
      courseSelected = course.id;
      usersEnrolled.push(user);
    } else {
      courseSelected = course.id;
    }
  });
};

hbs.registerHelper('courseState', () => {
  let course = coursesList.find(item => item.id == courseSelected);
  let state = `<form action="/courses/close-course" method="POST" class="mb-4"><div class="form-row"><div class="form-group col-md-6"><strong>Estado: </strong>${
    course.state == 'available' ? 'Disponible' : 'Cerrado'
  }<input type="hidden" name="id" id="id" value="${
    course.id
  }" class="form-control"/><button type="submit" style="margin-left: 1rem;" onclick="confirm('¿Estás seguro de cerrar este curso?');" class="btn btn-warning">Cerrar</button></div></div></form>`;
  return state;
});

hbs.registerHelper('listEnrolled', () => {
  let course = coursesList.find(item => item.id == courseSelected);
  if (usersEnrolled.length > 0) {
    let content = `<h3>Información del curso: ${
      course.name
    }</h3><br><table class="table table-hover">
    <thead class="bg-success">
    <th>Documento</th>
    <th>Nombre</th>
    <th>Correo</th>
    <th>Teléfono</th>
    <th>Acción</th>
    </thead>
    <tbody>`;
    usersEnrolled.forEach(user => {
      content =
        content +
        `<tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.phone}</td>
      <td><form method="POST" action="/courses/list-users"><input type="hidden" name="user" id="user" value="${
        user.id
      }"/><input type="hidden" name="course" id="course" value="${
          course.id
        }"/><button type="submit" onclick="confirm('¿Estás seguro de eliminar este registro?');" class="btn btn-danger">Eliminar</button></form></td>
    </tr>`;
    });
    content = content + `</tbody></table>`;
    return content;
  } else {
    let content = `<h3>Información del curso: ${
      course.name
    }</h3><br><p>Ningún aspirante inscrito</p>`;
    return content;
  }
});

const deleteUser = (userId, courseId) => {
  areUsersCreated();
  usersList.forEach(user => {
    if (user.id == userId) {
      let newCourses = user.courses.filter(course => course != courseId);
      user.courses = newCourses;
    }
  });
  updateInJSON(usersList);
};

const closeCourse = courseId => {
  coursesList.forEach(item => {
    if (item.id == courseId) {
      item.state = 'closed';
    }
  });
  updateCourses(coursesList);
};

module.exports = {
  createCourse,
  checkMessage,
  searchCourse,
  deleteUser,
  closeCourse
};
