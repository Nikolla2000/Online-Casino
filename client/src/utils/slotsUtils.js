/**
 * Function that generates a pseudo-random slots board and is used when simulatiing slots spinning.
 * Each cell is replaced with a random integer from 1 to 12.
 * @param {number[][]} slotsArray - A 2D array whose dimensions define the size of the generated board.
 * @returns {number[][]} A new 2D array with the same dimesions as slotsArray
 */
export const generateRandomSlots = (slotsArray) => {
    return slotsArray.map(row => row.map(() => Math.floor(Math.random() * 12 + 1)));
};


/**
 * Animates smooth credits incrementing effect after winning a slots round and player wins credits.
 * Updates Redux store via dispatch at ~50ms intervals.
 * @param {number} startValue - The starting credit amount (typically balanceBefore - bet).
 * @param {number} endValue - The target credit amount (balanceAfter).
 * @param {Function} dispatch - Redux dispatch function to update credits in store.
 * @param {number} [duration=2000] - Animation duration in milliseconds (default: 2 seconds).
 * @returns {number} The interval ID, which can be used to clear the animation if needed.
 */
export const animateCreditsIncrement = (startValue, endValue, dispatch, duration=2000) => {
    const startTime = Date.now();
    const difference = endValue - startValue;
    const step = difference - (duration / 50);

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const currentValue = Math.floor(startValue + (difference * progress));

      dispatch(updateCredits(currentValue));

      if (progress >= 1) {
        clearInterval(interval);
        dispatch(updateCredits(endValue));
      }
    }, 50);

    return interval;
  }
