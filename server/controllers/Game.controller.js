const asyncHandler = require("../helpers/asyncHandler");
const rouletteService = require("../services/rouletteService");
const slotsService = require("../services/slotsService");

const playSlotsRound = asyncHandler(async (req, res) => {  
  const { betAmount } = req.body;
  const userId = req.userId;

  const result = await slotsService.playRound(userId, betAmount);

  res.status(200).json(result);
  
  console.error('Slots game error:', err);

  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: 'Error on playing slots round'
  });
});


const playRouletteRound =  asyncHandler(async (req, res) => {
  const { betAmount, betType, betValue } = req.body;
  const userId = req.userId;

  const result = await rouletteService.playRound(
      userId,
      betAmount,
      betType,
      betValue
  );

  res.status(200).json(result);
});

module.exports = {
  playSlotsRound,
  playRouletteRound
}