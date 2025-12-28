import { updateCredits as updateSlotsCredits } from "../redux/features/slots/slotMachineSlice";
import { updateCredits as updateRouletteCredits } from "../redux/features/roulette/rouletteSlice";

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
 * @param {string} gameName - The name of the game ('slots' or 'roulette') to determine which Redux slice to update.
 * @returns {number} The interval ID, which can be used to clear the animation if needed.
 * @throws {Error} If gameName is not 'slots' or 'roulette'
 */
export const animateCreditsIncrement = (startValue, endValue, dispatch, duration=2000, gameName='slots') => {
    const validGames = ['slots', 'roulette'];
    if (!validGames.includes(gameName)) {
        throw new Error(`Invalid gameName: ${gameName}. Must be one of: ${validGames.join(', ')}`);
    }

    const getUpdateCreditsAction = () => {
        switch (gameName) {
            case 'slots':
                return updateSlotsCredits;
            case 'roulette':
                return updateRouletteCredits;
            default:
                // Fallback to slots for backward compatibility
                return updateSlotsCredits;
        }
    };

    const updateCreditsAction = getUpdateCreditsAction();
    const startTime = Date.now();
    const difference = endValue - startValue;

    let animationFrameId;
    
    const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        const easedProgress = easeOutCubic(progress);
        
        const currentValue = Math.floor(startValue + (difference * easedProgress));
        
        dispatch(updateCreditsAction(currentValue));

        if (progress < 1) {
            animationFrameId = requestAnimationFrame(animate);
        } else {
            dispatch(updateCreditsAction(endValue));
        }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        dispatch(updateCreditsAction(endValue));
    };
  };
