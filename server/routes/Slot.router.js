const express = require('express');
const router = express.Router()

const { 
  spin,
  getFinalCombination,
  playSlotsRound
} = require('../controllers/Slot.controller');

const { verifyJWT } = require('../middleware/authentication');

router.get('/spin', spin);
router.get('/finalCombination', getFinalCombination);
router.post('/play-slots-round', verifyJWT, playSlotsRound);

module.exports = router;
 