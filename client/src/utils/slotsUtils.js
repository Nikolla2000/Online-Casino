/**
 * Function that generates a pseudo-random slots board and is used when simulatiing slots spinning.
 * Each cell is replaced with a random integer from 1 to 12.
 * @param {number[][]} slotsArray - A 2D array whose dimensions define the size of the generated board.
 * @returns {number[][]} A new 2D array with the same dimesions as slotsArray
 */
export const generateRandomSlots = (slotsArray) => {
    return slotsArray.map(row => row.map(() => Math.floor(Math.random() * 12 + 1)));
};
