"use strict";
/**
 * @returns
 */
const openModal = () => {
  document.getElementById("md-overlay").classList.add("active");
};

/**
 *
 */
const closeModal = () => {
  cleanUpDataFields();
  document.getElementById("md-overlay").classList.remove("active");
};

/**
 * @returns Array de Objetos
 */
const getHeroesDataBase = () =>
  JSON.parse(localStorage.getItem("dbHeroes")) ?? [];

/**
 * @param {Array} dbAcademyHeroes
 * @returns
 */
const setHeroesDataBase = (dbAcademyHeroes) =>
  localStorage.setItem("dbHeroes", JSON.stringify(dbAcademyHeroes));

/**
 * Armazena heroi no localStorage.
 * @param {Object} hero
 */
const createHeroInDB = (hero) => {
  const dbAcademyHeroes = getHeroesDataBase();
  dbAcademyHeroes.push(hero);
  setHeroesDataBase(dbAcademyHeroes);
};

/**
 * Lê dados do DB caso exista e armazena em readHeroesDataBase.
 * Do contrário, retorna um Array vazio.
 * @returns
 */
const readHeroesDataBase = () => getHeroesDataBase();

/**
 * Atualiza dados de um heroi.
 * @param {Number} index
 * @param {Object} hero
 */
const updateDataHeroes = (index, hero) => {
  const dbAcademyHeroes = readHeroesDataBase();
  dbAcademyHeroes[index] = hero;
  setHeroesDataBase(dbAcademyHeroes);
};

/**
 *
 */
const saveHeroesInDB = () => {
  if (isValidFields()) {
    const hero = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      telephone: document.getElementById("phoneNumber").value,
      office: document.getElementById("office").value,
    };

    /**
     * Se data-set in HTML é 'new' o evento 'save' vem do button da home.
     * Caso contrário, evento capturado do button do modal ativo.
     */
    const index = document.getElementById("name").dataset.index;
    if (index == "new") {
      createHeroInDB(hero);
      refreshHeroesTable();
      closeModal();
    } else {
      updateDataHeroes(index, hero);
      refreshHeroesTable();
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
 */
function isValidFields() {
  return document.getElementById("md-form").reportValidity();
}

/**
 * @param {Number} index
 */
const deleteHero = (index) => {
  const dbAcademyHeroes = readHeroesDataBase();
  dbAcademyHeroes.splice(index, 1);
  setHeroesDataBase(dbAcademyHeroes);
};

/**
 * @param {Number} index
 */
const editHero = (index) => {
  const hero = readHeroesDataBase()[index];
  hero.index = index;
  fillFieldsDataHero(hero);
  openModal();
};

/**
 * Retorna os dados de um objeto para os campos do modal.
 * @param {Object} hero
 */
const fillFieldsDataHero = (hero) => {
  document.getElementById("name").dataset.index = hero.index;
  document.getElementById("name").value = hero.name;
  document.getElementById("email").value = hero.email;
  document.getElementById("phoneNumber").value = hero.telephone;
  document.getElementById("office").value = hero.office;
};

/**
 *
 */
const refreshHeroesTable = () => {
  const dbAcademyHeroes = readHeroesDataBase();
  clearRowsTable();
  dbAcademyHeroes.forEach(createRow);
}

/**
 * @param {Object} hero
 * @param {Number} index
 */
const createRow = (hero, index) => {
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
        <td class="table-data">${hero.name}</td>
        <td class="table-data">${hero.email}</td>
        <td class="table-data">${hero.telephone}</td>
        <td class="table-data">${hero.office}</td>
        <td class="actions-buttons">
            <button type="button" id="deleteBtn-${index}" class="button delete-button"><i class="fa-solid fa-trash-arrow-up"></i></button>
            <button type="button" id="editBtn-${index}" class="button edit-button"><i class="fa-solid fa-pencil"></i></button>
        </td>
    `;
  document.querySelector("#heroes-table > tbody").appendChild(newRow);
};

/**
 *
 */
refreshHeroesTable();

/**
 * Remove uma linha da tabela
 */
function clearRowsTable() {
  const row = document.querySelectorAll("#heroes-table > tbody > tr");
  row.forEach((row) => {
    row.parentNode.removeChild(row);
  });
}

/**
 * Representa escolha de uma ação para cada linha da tabela
 * @param {event} click - click em um botão
 */
const actionsRowsTable = (event) => {
  if (event.target.type == "button") {

    const [actionBtn, index] = event.target.id.split("-");

    if (actionBtn == "editBtn") {
      editHero(index);
    } else {
      const hero = readHeroesDataBase()[index];
      const response = confirm(`Deseja realmente excluir ${hero.name}`);
      if (response) {
        deleteHero(index);
        refreshHeroesTable();
      }
    }
  }
};

/**
 * Representa um evento
 * @event
 */
document.getElementById("new-register").addEventListener("click", openModal);

document.getElementById("close-md").addEventListener("click", closeModal);

document.getElementById("cancel").addEventListener("click", closeModal);

document.getElementById("save").addEventListener("click", saveHeroesInDB);

document.querySelector("#heroes-table > tbody").addEventListener("click", actionsRowsTable);
