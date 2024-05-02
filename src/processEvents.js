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
        console.log(`Dino fed: ${event.dinosaur_id} at ${event.time}`)
        dinos.get(event.dinosaur_id).feed(event.time);
        break;

      case "dino_location_updated":
        console.log("dino_location_updated", event);
        park.grid.flat().forEach((cell) => cell.removeDino(event.dinosaur_id));
        park
          .cellByLocation(event.location)
          .addDino(dinos.get(event.dinosaur_id));

        break;

      case "dino_removed":
        console.log("dino_removed", event);
        // FIXME: suboptimal. instead of searching over the array, maintain a map of dinos to cells
        park.grid.flat().forEach((cell) => cell.removeDino(event.dinosaur_id));
        break;

      case "maintenance_performed":
        console.log("maintenance_performed", event);
        park
          .cellByLocation(event.location)
          .setLastMaintained(event.time);
        break;

      default:
        break;
    }
  }
  return park;
}
