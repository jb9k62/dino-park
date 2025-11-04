export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export const getColumnIndex = (char) =>
  ALPHABET.indexOf(char.toUpperCase());

export const getColumnLetter = (index) =>
  ALPHABET[index];

export const parseLocation = (location) => {
  const match = location.match(/^([A-Z])(\d+)$/i);
  if (!match) throw new Error(`Invalid location: ${location}`);
  return {
    col: getColumnIndex(match[1]),
    row: parseInt(match[2], 10) - 1
  };
};
