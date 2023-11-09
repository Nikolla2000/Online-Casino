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

module.exports = {
  spin,
  getFinalCombination,
};