const rouletteService = require('../services/rouletteService');

/**
 * Play roulette round
 * POST /serv er/v1/roulette
 * ACCESS: Private
 * Body: { betAmount: number, betType: string, betValue?: number }
 */
const playRouletteRound = async (req, res) => {
    try {
        const { betAmount, betType, betValue } = req.body;
        const userId = req.userId;

        const result = await rouletteService.playRound(
            userId,
            betAmount,
            betType,
            betValue
        );

        res.status(200).json(result);
        
    } catch (err) {
        console.error('Roulette game error:', err);

        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({
            success: false,
            message: 'Error on playing roulette round'
        });
    }
}

module.exports = {
    playRouletteRound,
}