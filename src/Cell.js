export default class Cell {
  identifier = null;
  lastMaintained = null;
  dinosInCell = new Map();

  constructor(identifier) {
    this.identifier = identifier;
  }

  setLastMaintained(dateTime) {
    this.lastMaintained = dateTime;
  }

  // TODO: some inconsistency in properties for dates. use Date type, not string.
  needsMaintenance() {
    const lastMaintained = new Date(this.lastMaintained);
    return lastMaintained.setDate(lastMaintained.getDate() + 30) < new Date();
  }

  addDino(dino) {
    this.dinosInCell.set(dino.id, dino);
  }

  removeDino(id) {
    this.dinosInCell.delete(id);
  }

  safe() {
    if (this.dinosInCell.size === 0) {
      return true;
    }

    // check if any of the dinos are not digesting
    const anyDigesting = Array.from(this.dinosInCell.values()).some((dino) =>
      dino.isDigesting()
    );

    return anyDigesting;
  }
}
