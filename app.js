const API_URL = 'https://bc8af2d3-bdf0-46f2-abeb-5c93c071602b-00-16gl2tzlc79kg.riker.replit.dev/';
let students = [];
let deleteId = null;

window.addEventListener('DOMContentLoaded', () => {
  getStudents();
})

const getStudents = () => {
  fetch(API_URL)
    .then(response => response.json())
    .catch(error => {
      alertManager('error', 'Ocurrión un problema al cargar los estudiantes');
    })
    .then(data => {
      students = data.data;
      renderResult(students);
    })
}

//-----------------------------

const studentsList = document.querySelector('#studentsList');

const renderResult = (students) => {
  let listHTML = "";
  students.forEach(student => {
    listHTML += `
      <div class="card">
        <div>Nombre: ${student.Nombre}</div>
        <div>Carrera: ${student.Carrera}</div>
        <div>Semestre: ${student.Semestre}</div>
        <div class="options">
          <button type="button" onclick="editStudent(${student.Id})">Editar</button>
          <button type="button" onclick="openModalConfirm(${student.Id})">Eliminar</button>
        </div>
      </div>
    `;
  });
  studentsList.innerHTML = listHTML;
}



//--------------------
const createStudent = () => {
  const formData = new FormData(document.querySelector('#formAdd'));

  if (!formData.get('nombre').length || !formData.get('carrera') || !formData.get('semestre')) {
    document.querySelector('#msgFormAdd').innerHTML = '* Llena todos los campos';
    return;
  }
  document.querySelector('#msgFormAdd').innerHTML = '';

  const student = {
    Nombre: formData.get('nombre'),
    Carrera: formData.get('carrera'),
    Semestre: formData.get('semestre'),
  }

  console.log(student)

  fetch(API_URL, {
    method: 'POST',
    body: JSON.stringify(student),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(error => {
      alertManager('error', error);
      document.querySelector('#formAdd').reset();
    })
    .then(response => {
      alertManager('success', response.mensaje)
      getStudents();
    })
}


//---------------------

const editStudent = (id) => {
  let student = {};
  students.filter(stud => {
    if (stud.Id == id) {
      student = stud
    }
  });

  document.querySelector('#formEdit #ID').value = student.Id;
  document.querySelector('#formEdit #nombre').value = student.Nombre;
  document.querySelector('#formEdit #carrera').value = student.Carrera;
  document.querySelector('#formEdit #semestre').value = student.Semestre;

  console.log(student);
  openModalEdit();
}

//-------------------

const updateStudent = () => {
  const student = {
    Nombre: document.querySelector('#formEdit #nombre').value,
    Carrera: document.querySelector('#formEdit #carrera').value,
    Semestre: document.querySelector('#formEdit #semestre').value,
    Id: document.querySelector('#formEdit #ID').value,
  }

  if (!student.Nombre || !student.Carrera || !student.Semestre) {
    document.querySelector('#msgFormEdit').innerHTML = '* Los campos no deben estar vacíos';
    return;
  }
  document.querySelector('#msgFormEdit').innerHTML = '';

  fetch(API_URL, {
    method: 'PUT',
    body: JSON.stringify(student),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .catch(error => {
      alertManager('error', error);
    })
    .then(response => {
      alertManager('success', response.mensaje);
      getStudents();
    });
  document.querySelector('#formEdit').reset();
}

//----------------

const deleteStudent = (id) => {

  fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  })
    .then(res => res.json())
    .catch(error => {
      alertManager('error', error);
    })
    .then(response => {
      alertManager('success', response.mensaje);
      closeModalConfirm();
      getStudents();
      deleteId = null;
    })

}

const confirmDelete = (res) => {
  if (res) {
    deleteStudent(deleteId);
  } else {
    closeModalConfirm();
  }
}



// MODAL ADD MANAGER
/** --------------------------------------------------------------- */
const btnAdd = document.querySelector('#btnAdd');
const modalAdd = document.querySelector('#modalAdd');

btnAdd.onclick = () => openModalAdd();

window.onclick = function (event) {
  if (event.target == modalAdd) {
    //modalAdd.style.display = "none";
  }
}

const closeModalAdd = () => {
  modalAdd.style.display = 'none';
}

const openModalAdd = () => {
  modalAdd.style.display = 'block';
}

// MODAL ADIT MANAGER
/** --------------------------------------------------------------- */
const modalEdit = document.querySelector('#modalEdit');

const openModalEdit = () => {
  modalEdit.style.display = 'block';
}

const closeModalEdit = () => {
  modalEdit.style.display = 'none';
}

window.onclick = function (event) {
  if (event.target == modalEdit) {
    //modalEdit.style.display = "none";
  }
}

// MODAL CONFIRM MANAGER
/** --------------------------------------------------------------- */
const modalConfirm = document.getElementById('modalConfirm');

window.onclick = function (event) {
  if (event.target == modalConfirm) {
    modalConfirm.style.display = "none";
  }
}

const closeModalConfirm = () => {
  modalConfirm.style.display = 'none';
}

const openModalConfirm = (id) => {
  deleteId = id;
  modalConfirm.style.display = 'block';
}


/** ALERT */
const alertManager = (typeMsg, message) => {
  const alert = document.querySelector('#alert');

  alert.innerHTML = message || 'Se produjo cambios';
  alert.classList.add(typeMsg);
  alert.style.display = 'block';

  setTimeout(() => {
    alert.style.display = 'none';
    alert.classList.remove(typeMsg);
  }, 3500);

}
