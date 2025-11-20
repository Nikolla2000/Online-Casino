const slotsService = require("../services/slotsService");

const slotItems = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const spin = (req, res) => {
  const result = [];
  for (let i = 0; i < 3; i++) {
    const row = [];
    for (let j = 0; j < 5; j++){
      const randomItem = slotItems[Math.floor(Math.random() * slotItems.length)];
      row.push(randomItem)
    }
    result.push(row)
  }
  res.json({ result })
}


const getFinalCombination = (req, res) => {
  const finalCombination = [
    [slotItems[1], slotItems[4], slotItems[7], slotItems[10], slotItems[0]],
    [slotItems[3], slotItems[6], slotItems[9], slotItems[11], slotItems[2]],
    [slotItems[0], slotItems[4], slotItems[8], slotItems[1], slotItems[5]],
  ];
  res.json({ finalCombination });
};


/**
 * Play slots round 
 * POST /server/v1/slots
 */
const playSlotsRound = async (req, res) => {  
  try {
    const { betAmount } = req.body;
    const userId = req.userId;

    const result = await slotsService.playRound(userId, betAmount);

    res.status(200).json(result);
    
  } catch (err) {
    console.error('Slots game error:', err);

    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      success: false,
      message: 'Error on playing slots round'
    });
  }
}

module.exports = {
  spin,
  getFinalCombination,
  playSlotsRound,
};