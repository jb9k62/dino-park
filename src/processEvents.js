import Park from "./Park.js";
import Dino from "./Dino.js";

export default function process(events) {
  const park = new Park();
  const dinos = new Map();

  for (const event of events) {
    switch (event.kind) {
      case "dino_added":
        dinos.set(
          event.id,
          new Dino({
            id: event.id,
            name: event.name,
            species: event.species,
            gender: event.gender,
            digestionInHours: event.digestion_period_in_hours,
            herbivore: event.herbivore,
          })
        );
        break;

      case "dino_fed":
        dinos.get(event.dinosaur_id).feed(event.time);
        break;

      case "dino_location_updated":
        console.log("dino_location_updated", event);

        // find Dinos current location, remove it.
        // add Dino to new cell.
        park.grid.flat().forEach((cell) => cell.removeDino(event.dinosaur_id));
        park
          .cellByLocation(event.location)
          .addDino(dinos.get(event.dinosaur_id));

        break;

      default:
        break;
    }
  }
  console.log("Returning park", park);
  return park;
}
