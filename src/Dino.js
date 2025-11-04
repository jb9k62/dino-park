export default class Dino {
  name = null;
  species = null;
  gender = null;
  id = null;
  digestionInHours = null;
  lastFed = null; // date
  herbivore = null;

  constructor({ name, species, gender, id, digestionInHours, herbivore }) {
    this.name = name;
    this.species = species;
    this.gender = gender;
    this.id = id;
    this.digestionInHours = digestionInHours;
    this.herbivore = herbivore;
  }

  feed(dateTime) {
    this.lastFed = new Date(dateTime);
  }

  isDigesting() {
    if (!this.lastFed) {
      return false;
    }

    if (this.lastFed.getTime() > new Date().getTime()) {
      return true;
    }

    // dino is digesting if current time is less than lastFed + digestionInHours(ms)
    return new Date().getTime() <
      this.lastFed.getTime() + (this.digestionInHours * 60 * 60 * 1000);
  }
}
