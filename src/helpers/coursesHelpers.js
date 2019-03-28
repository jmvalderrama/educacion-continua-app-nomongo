const fs = require('fs');

const hbs = require('hbs');

coursesList = [];
let message, className, display, isAdded;

const isCreated = () => {
  try {
    coursesList = require('../../src/courses.json');
  } catch (error) {
    coursesList = [];
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
  let coursesTable = `<table class="table table-hover">\
  <thead class="bg-success">\
  <th>Id</th>\
  <th>Nombre</th>\
  <th>Descripción</th>\
  <th>Valor</th>\
  <th>Modalidad</th>\
  <th>Intensidad</th>\
  <th>Estado</th>\
  </thead>\
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

hbs.registerHelper('list', () => {
  isCreated();
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
  createCourse,
  checkMessage
};
