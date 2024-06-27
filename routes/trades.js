const express = require('express');
const router = express.Router();
const {
  createTrade,
  getTrades,
  getTradeById,
  methodNotAllowed
} = require('../controllers/trades');

// POST /trades
router.post('/', createTrade);

// GET /trades
router.get('/', getTrades);

// GET /trades/:id
router.get('/:id', getTradeById);

// DELETE, PUT, PATCH requests to /trades/:id
router.use('/:id', methodNotAllowed);

module.exports = router;
