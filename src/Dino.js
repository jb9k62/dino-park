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
      console.debug(`Dino ${this.name} has never beed fed`);
      return false;
    }

    const isDigesting =
      new Date().getTime() >
      this.lastFed.setTime(
        this.lastFed.getTime() + this.digestionInHours * 60 * 60 * 1000
      );

    if (isDigesting) {
      console.debug(
        `Dino ${this.name} is digesting last meal ${
          (new Date().getTime() - this.lastFed.getTime()) / (60 * 60 * 1000)
        } hours ago`
      );
      return true;
    }
  }
}
