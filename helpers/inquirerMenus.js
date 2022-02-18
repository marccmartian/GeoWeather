require("colors");
const inquirer = require("inquirer");

const mainMenuQuestions = [
  {
    type: "list",
    name: "option",
    message: "¿Qué quieres hacer?",
    choices: [
      {
        value: 1,
        name: `${"1.".green} Buscar Ciudad`,
      },
      {
        value: 2,
        name: `${"2.".green} Historial`,
      },
      {
        value: 0,
        name: `${"0.".green} Salir`,
      },
    ],
  },
];

const showMainMenu = async () => {
  console.clear();
  console.log("=========================".green);
  console.log("  Selecciona una opción:");
  console.log("=========================\n".green);

  const { option } = await inquirer.prompt(mainMenuQuestions);
  return option;
};

const pause = async () => {
  const pauseQuestion = {
    type: "input",
    name: "pause",
    message: `Presiona ${"enter".blue} para continuar`,
  };

  console.log("\n");
  await inquirer.prompt(pauseQuestion);
};

const readInput = async (message) => {
  const inputQuestion = {
    type: "input",
    name: "input",
    message,
    validate(value) {
      if (value.length === 0) return "Por favor ingresa un valor correcto";
      return true;
    },
  };

  const { input } = await inquirer.prompt(inputQuestion);
  return input;
};

const showListPlaces = async (places = []) => {
  const choices = places.map((place, index) => {
    const { id, name } = place;
    const item = `${index + 1}.`.green;
    return {
      value: id,
      name: `${item} ${name}`,
    };
  });

  choices.unshift({
    value: 0,
    name: `${"0.".green} Cancelar`,
  });

  const questions = [
    {
      type: "list",
      name: "id",
      message: "Seleccione lugar",
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

const confirmDeletion = async () => {
  const confirmQuestion = [
    {
      type: "confirm",
      name: "ok",
      message: "¿Estás seguro de borrar esta tarea?",
    },
  ];

  const { ok } = await inquirer.prompt(confirmQuestion);
  return ok;
};

const showListTasksToComplete = async (tasks = []) => {
  const choices = tasks.map((task, index) => {
    const { id, description, completedAt } = task;
    const item = `${index + 1}.`.green;
    return {
      value: id,
      name: `${item} ${description}`,
      checked: completedAt ? true : false,
    };
  });

  const completeTaskQuestions = [
    {
      type: "checkbox",
      name: "ids",
      message: "Seleccionar",
      choices,
    },
  ];

  const { ids } = await inquirer.prompt(completeTaskQuestions);
  return ids;
};

module.exports = {
  showMainMenu,
  pause,
  readInput,
  showListPlaces,
  confirmDeletion,
  showListTasksToComplete,
};
