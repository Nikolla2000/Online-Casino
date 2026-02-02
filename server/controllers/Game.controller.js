const asyncHandler = require("../helpers/asyncHandler");
const rouletteService = require("../services/rouletteService");
const slotsService = require("../services/slotsService");


/**
 * Play round of slots
 * 
 * @route POST /server/v1/game/slots
 * @access Private
 * @param {number} betAmount - Amount of credits to bet - must be positive integer
 * @returns {Promise<void>} JSON response with slots spin result (winAmount, netProfit, multiplier, reels, balanceBefore, balanceAfer, isWin, gameId)
 * @throws {40*} client error
 * @throws {500} slots service failure
 */
const playSlotsRound = asyncHandler(async (req, res) => {  
  const { betAmount } = req.body;
  const userId = req.userId;

  const result = await slotsService.playRound(userId, betAmount);

  return res.status(200).json(result);
});


/**
 * Play a round of roulette game
 * 
 * @route POST /server/v1/game/roulette
 * @access Private
 * @param {number} betAmount - Amount of credits to bet - must be positive integer
 * @param {string} betType - Type of bet ("number", "color", "evenOdd", "half", "dozen", "column")
 * @param {string|number} betValue - Specific bet value (e.g., 17 for number, "red" for color, "even" for evenOdd)
 * @returns {Promise<void>} JSON response with roulette spin result
 * @throws {400} Invalid bet parameters or insufficient credits
 * @throws {401} User not authenticated
 * @throws {500} Roulette service failure
 */
const playRouletteRound =  asyncHandler(async (req, res) => {
  const { betAmount, betType, betValue } = req.body;
  const userId = req.userId;

  const result = await rouletteService.playRound(
      userId,
      betAmount,
      betType,
      betValue
  );

  return res.status(200).json(result);
});

module.exports = {
  playSlotsRound,
  playRouletteRound
}