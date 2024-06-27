// controllers/trades.js
const Trade = require('../models/Trade');

// Helper function to get next trade ID
const getNextTradeId = async () => {
  const lastTrade = await Trade.findOne().sort({ id: -1 });
  const id = lastTrade ? lastTrade.id + 1 : 1;
  return id;
};

const createTrade = async (req, res) => {
  const { type, user_id, symbol, shares, price, timestamp } = req.body;

  if (!['buy', 'sell'].includes(type) || shares < 1 || shares > 100) {
    return res.status(400).send('Invalid trade data');
  }
  try {
    const id = await getNextTradeId();
    const trade = new Trade({
      id,
      type,
      user_id,
      symbol,
      shares,
      price,
      timestamp
    });
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getTrades = async (req, res) => {
  try {
    const { type, user_id } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (user_id) filter.user_id = user_id;

    const trades = await Trade.find(filter).sort({ id: 1 });
    return res.status(200).json(trades);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findOne({ id: req.params.id });
    if (!trade) {
      return res.status(404).send('ID not found');
    }
    res.status(200).json(trade);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const methodNotAllowed = (req, res) => {
  res.status(405).send('Method not allowed');
};

module.exports = {
  createTrade,
  getTrades,
  getTradeById,
  methodNotAllowed
};
