/**
 * Pure functional domain model for Dinosaur
 */

/**
 * Create a new dinosaur
 * @param {Object} params - Dinosaur parameters
 * @param {string} params.name - Dinosaur name
 * @param {string} params.species - Dinosaur species
 * @param {string} params.gender - Dinosaur gender
 * @param {string} params.id - Unique identifier
 * @param {number} params.digestionInHours - Hours needed to digest food
 * @param {boolean} params.herbivore - Whether dinosaur is herbivore
 * @returns {Object} Immutable dinosaur object
 */
export const createDino = ({ name, species, gender, id, digestionInHours, herbivore }) => ({
  name,
  species,
  gender,
  id,
  digestionInHours,
  herbivore,
  lastFed: null
});

/**
 * Feed a dinosaur at a specific time
 * @param {Object} dino - Dinosaur to feed
 * @param {Date|string} dateTime - Time of feeding
 * @returns {Object} New dinosaur with updated lastFed
 */
export const feedDino = (dino, dateTime) => ({
  ...dino,
  lastFed: new Date(dateTime)
});

/**
 * Check if dinosaur is currently digesting
 * @param {Object} dino - Dinosaur to check
 * @param {Date} currentTime - Current time (defaults to now)
 * @returns {boolean} True if digesting
 */
export const isDinoDigesting = (dino, currentTime = new Date()) => {
  if (!dino.lastFed) {
    return false;
  }

  const lastFedTime = dino.lastFed.getTime();
  const now = currentTime.getTime();

  // Handle edge case: fed in future
  if (lastFedTime > now) {
    return true;
  }

  // Dino is digesting if current time is less than lastFed + digestionInHours(ms)
  const digestionEndTime = lastFedTime + (dino.digestionInHours * 60 * 60 * 1000);
  return now < digestionEndTime;
};
