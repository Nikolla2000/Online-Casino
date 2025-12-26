const rouletteService = require('../services/rouletteService');
const asyncHandler = require('../helpers/asyncHandler');

/**
 * Play roulette round
 * POST /server/v1/roulette
 * ACCESS: Private
 * Body: { betAmount: number, betType: string, betValue?: number }
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

    res.status(200).json(result);
});

module.exports = {
    playRouletteRound,
}