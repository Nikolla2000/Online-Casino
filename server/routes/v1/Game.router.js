const express = require('express');
const { verifyJWT } = require('../../middleware/authentication');
const { playRouletteRound } = require('../../controllers/Roulette.controller');
const { playSlotsRound } = require('../../controllers/Slot.controller');
const router = express.Router();

router.post('/slots', verifyJWT, playSlotsRound);

router.post('/roulette', verifyJWT, playRouletteRound);

module.exports = router;