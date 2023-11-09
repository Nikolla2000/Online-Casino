const express = require('express');
const router = express.Router()

const { spin, getFinalCombination } = require('../controllers/Slot.controller');

router.get('/spin', spin);
router.get('/finalCombination', getFinalCombination);

module.exports = router;
 