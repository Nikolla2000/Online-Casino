const generateAccessToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); 
}

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId: userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '7d' }); 
}

module.exports = { generateAccessToken, generateRefreshToken }