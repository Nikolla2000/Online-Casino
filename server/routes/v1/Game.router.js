const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { playSlotsRound, playRouletteRound } = require('../../controllers/Game.controller');

const router = express.Router();

router.use(verifyJWT);

router.post('/slots', playSlotsRound);

router.post('/roulette', playRouletteRound);

module.exports = router;