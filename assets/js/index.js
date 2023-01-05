"use strict";

const openModal = () => {
  document.getElementById("md-overlay").classList.add("active");
};

const closeModal = () => {
  cleanUpDataFields();
  document.getElementById("md-overlay").classList.remove("active");
};

/**
 * @returns Array de Objetos
 */
const getPersonsDataBase = () =>
  JSON.parse(localStorage.getItem("dbPersons")) ?? [];

/**
 * @param {Array} dbPersonsList
 */
const setPersonsDataBase = (dbPersonsList) =>
  localStorage.setItem("dbPersons", JSON.stringify(dbPersonsList));

/**
 * Armazena obj pessoa no localStorage.
 * @param {Object} person
 */
const createPersonInDB = (person) => {
  const dbPersonsList = getPersonsDataBase();
  dbPersonsList.push(person);
  setPersonsDataBase(dbPersonsList);
};

/**
 * Lê dados do DB caso exista e armazena em readPersonsDataBase.
 * Do contrário, retorna um Array vazio.
 * @returns
 */
const readPersonsDataBase = () => getPersonsDataBase();

/**
 * Atualiza dados de uma pessoa.
 * @param {Number} index
 * @param {Object} person
 */
const updateDataPerson = (index, person) => {
  const dbPersonsList = readPersonsDataBase();
  dbPersonsList[index] = person;
  setPersonsDataBase(dbPersonsList);
};

const savePersonInDB = () => {
  if (isValidFields()) {
    const person = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      telephone: document.getElementById("phoneNumber").value,
      office: document.getElementById("office").value,
    };

    /**
     * Se data-set in HTML é 'new' o evento 'save' vem do button do modal 'profile information' da home.
     * Caso contrário, evento capturado vem do button do modal de edição de dados ativo.
     */
    const index = document.getElementById("name").dataset.index;
    if (index == "new") {
      createPersonInDB(person);
      refreshPersonTable();
      closeModal();
    } else {
      updateDataPerson(index, person);
      refreshPersonTable();
      document.getElementById("name").dataset.index = "new";
      closeModal();
    }
  }
}

/**
 * Apaga os dados persistentes nos campos do modal
 */
function cleanUpDataFields() {
  const dataFields = document.querySelectorAll(".md-field");
  dataFields.forEach((field) => {
    field.value = "";
  });
}

/**
 * @returns true - Se campos são válidos
 * @returns false - Se campos são inválidos
 */
function isValidFields() {
  return document.getElementById("md-form").reportValidity();
}

/**
 * @param {Number} index - identificador do registro na tabela
 */
const deletePerson = (index) => {
  const dbPersonsList = readPersonsDataBase();
  dbPersonsList.splice(index, 1);
  setPersonsDataBase(dbPersonsList);
};

/**
 * @param {Number} index - identificador do registro na tabela
 */
const editPerson = (index) => {
  const person = readPersonsDataBase()[index];
  person.index = index;
  fillFieldsDataHero(person);
  openModal();
};

/**
 * @param {Object} person
 * @returns Dados de um objeto para os campos do modal.
 */
const fillFieldsDataHero = (person) => {
  document.getElementById("name").dataset.index = person.index;
  document.getElementById("name").value = person.name;
  document.getElementById("email").value = person.email;
  document.getElementById("phoneNumber").value = person.telephone;
  document.getElementById("office").value = person.office;
};

const refreshPersonTable = () => {
  const dbPersonsList = readPersonsDataBase();
  clearRowsTable();
  dbPersonsList.forEach(createRow);
}

/**
 * @param {Object} person
 * @param {Number} index
 */
const createRow = (person, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td class="table-data">${person.name}</td>
        <td class="table-data">${person.email}</td>
        <td class="table-data">${person.telephone}</td>
        <td class="table-data">${person.office}</td>
        <td class="actions-buttons">
            <button type="button" id="deleteBtn-${index}" class="button delete-button"><i class="fa-solid fa-trash-arrow-up"></i></button>
            <button type="button" id="editBtn-${index}" class="button edit-button"><i class="fa-solid fa-pencil"></i></button>
        </td>
    `;
  document.querySelector("#persons-table > tbody").appendChild(newRow);
};

/**
 * atualiza dados na tela 
 */
refreshPersonTable();

/**
 * Remove uma linha da tabela
 */
function clearRowsTable() {
  const row = document.querySelectorAll("#persons-table > tbody > tr");
  row.forEach((row) => {
    row.parentNode.removeChild(row);
  });
}

/* remove todos os registros da tabela */
function clearTable() {
  const response = confirm(`Deseja realmente excluir todos os registros da tabela?`);
  if (response) {
    clearRowsTable();
  } 
  return;
}

/**
 * Representa escolha de uma ação para cada linha da tabela
 * @param {event} click - click em um botão
 */
const actionsRowsTable = (event) => {
  if (event.target.type == "button") {

    const [actionBtn, index] = event.target.id.split("-");

    if (actionBtn == "editBtn") {
      editPerson(index);
    } else {
      const person = readPersonsDataBase()[index];
      const response = confirm(`Deseja realmente excluir ${person.name}`);
      if (response) {
        deletePerson(index);
        refreshPersonTable();
      }
    }
  }
};


document.getElementById("new-register").addEventListener("click", openModal);
document.getElementById("close-md").addEventListener("click", closeModal);
document.getElementById("cancel").addEventListener("click", closeModal);
document.getElementById("save").addEventListener("click", savePersonInDB);
document.querySelector("#persons-table > tbody").addEventListener("click", actionsRowsTable);
document.getElementById("clear-registers").addEventListener("click", clearTable);
