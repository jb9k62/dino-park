import Park from "./Park.js";
import Dino from "./Dino.js";

export default function process(events) {
  const park = new Park();
  const dinos = new Map();
  const dinoLocations = new Map(); // Track dino ID -> cell location for O(1) lookups

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
        // Remove from old location if exists
        const oldLocation = dinoLocations.get(event.dinosaur_id);
        if (oldLocation) {
          park.cellByLocation(oldLocation).removeDino(event.dinosaur_id);
        }

        // Add to new location
        park
          .cellByLocation(event.location)
          .addDino(dinos.get(event.dinosaur_id));

        // Update location tracking
        dinoLocations.set(event.dinosaur_id, event.location);
        break;

      case "dino_removed":
        // Remove from tracked location
        const location = dinoLocations.get(event.dinosaur_id);
        if (location) {
          park.cellByLocation(location).removeDino(event.dinosaur_id);
          dinoLocations.delete(event.dinosaur_id);
        }
        break;

      case "maintenance_performed":
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
