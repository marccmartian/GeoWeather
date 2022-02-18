require("colors");
const {
  readInput,
  showMainMenu,
  pause,
  showListPlaces,
} = require("./helpers/inquirerMenus");
const Searches = require("./models/searches");

const main = async () => {
  const searches = new Searches();
  let option = "";

  do {
    option = await showMainMenu();

    switch (option) {
      case 1:
        // mostrar mensaje
        const inputtedText = await readInput("Ciudad:");

        // buscar lugares
        const places = await searches.findCities(inputtedText);
        const id = await showListPlaces(places);

        if (id !== 0) {
          // seleccionar lugar
          selectedPlace = places.find((place) => place.id === id);

          // clima
          const currentWeather = await searches.findWeatherPlace(
            selectedPlace.lat,
            selectedPlace.lon
          );

          //mostrar resultados
          console.clear();
          console.log("\nInformación de la ciudad\n".green);
          console.log(`Ciudad: ${selectedPlace.name.green}`);
          console.log(`Latitud: ${selectedPlace.lat}`);
          console.log(`Longitud: ${selectedPlace.lon}`);
          console.log(`Clima: ${currentWeather.description.green}`);
          console.log("Temperatura: " + currentWeather.temp);
          console.log("Mínima: " + currentWeather.min);
          console.log("Máxima: " + currentWeather.max);

          // agregar al historial
          searches.addHistorial(selectedPlace.name);
        }

        break;

      case 2:
        // searches.historial.forEach((place, index) => {
        //   console.log(`${index + 1}. ${place}`);
        // });
        searches.capitalizateHistorial.forEach((place, index) => {
          console.log(`${index + 1}. ${place}`);
        });
        break;

      default:
        break;
    }

    if (option !== 0) await pause();
  } while (option !== 0);
};

main();
