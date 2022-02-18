const fs = require("fs");
require("dotenv").config();
const axios = require("axios");

class Searches {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.readData();
  }

  get paramsMapbox() {
    return {
      language: "es",
      access_token: process.env.MAPBOX_TOKEN || "",
    };
  }

  get paramsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY || "",
      units: "metric",
      lang: "es",
    };
  }

  get capitalizateHistorial() {
    return this.historial.map((place) => {
      let words = place.split(" ");
      words = words.map((w) => w[0].toUpperCase() + w.substring(1));

      return words.join(" ");
    });
  }

  async findCities(place = "") {
    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${place}.json`,
        params: this.paramsMapbox,
      });

      const response = await instance.get();
      return response.data.features.map((place) => ({
        id: place.id,
        name: place.place_name,
        lon: place.center[0],
        lat: place.center[1],
      }));
    } catch (error) {
      console.log(error);
    }
  }

  async findWeatherPlace(lat, lon) {
    try {
      const instance = axios.create({
        baseURL: "https://api.openweathermap.org/data/2.5/weather",
        params: { ...this.paramsWeather, lat, lon },
      });

      const response = await instance.get();
      const { weather, main } = response.data;

      return {
        description: weather[0].description,
        temp: main.temp,
        max: main.temp_max,
        min: main.temp_min,
      };
    } catch (error) {
      console.log(error);
    }
  }

  addHistorial(place = "") {
    if (this.historial.includes(place.toLocaleLowerCase())) {
      return;
    }

    this.historial = this.historial.splice(0, 5); // mantiene solo en 6 elementos en el historial
    this.historial.unshift(place.toLocaleLowerCase());
    this.saveData();
  }

  saveData() {
    const payload = {
      historial: this.historial,
    };

    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  readData() {
    if (!fs.existsSync(this.dbPath)) return;

    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);
    this.historial = data.historial;
  }
}

module.exports = Searches;
