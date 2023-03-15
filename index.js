const { parse } = require("csv-parse");
const fs = require("fs");

const habitablePlanets = [];

const isHabitablePlanet = (planet) => {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
};
fs.createReadStream("kepler_data_march_15_2023.csv")
  .pipe(
    parse({
      comment: "#",
      columns: true,
    })
  )
  .on("data", (data) => {
    if (isHabitablePlanet(data)) {
      habitablePlanets.push(data);
    }
  })
  .on("error", (err) => {
    console.log(err);
  })
  .on("end", () => {
    const habitablePlanetsName = habitablePlanets
      .map((planet) => planet["kepler_name"])
      .join(" \n");

    const superHabitablePlanet = habitablePlanets
      .filter(
        (planet) => planet["koi_prad"] == 1.09 && planet["koi_insol"] == 0.56
      )
      .map((planet) => planet["kepler_name"])
      .join("");

    console.log(`We have found ${habitablePlanets.length} habitable planets!`);
    console.log(`those are => \n${habitablePlanetsName}`);
    console.log(`\"${superHabitablePlanet}\" is supper habitable exoplanet`);
  });
