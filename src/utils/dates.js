import { MAINTENANCE_INTERVAL_DAYS } from './constants.js';

export const parseEventTime = (isoString) => new Date(isoString);

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addHours = (date, hours) => {
  const result = new Date(date);
  result.setHours(result.getHours() + hours);
  return result;
};

export const needsMaintenanceCheck = (lastMaintained, currentTime = new Date()) => {
  if (!lastMaintained) return true;
  const maintenanceDue = addDays(new Date(lastMaintained), MAINTENANCE_INTERVAL_DAYS);
  return maintenanceDue < currentTime;
};
