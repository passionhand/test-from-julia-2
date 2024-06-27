// Uncomment the code below to use Sequelize ORM
// const {Sequelize} = require("sequelize");
// const sequelize = new Sequelize("sqlite::memory:");

// Uncomment the code below to use Mongoose ORM
// const mongoose = require('mongoose');


// Insert your model definition below
const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true
    },

    type: {
      type: String,
      enum: ['buy', 'sell'],
      required: true
    },
    user_id: {
      type: Number,
      required: true
    },
    symbol: {
      type: String,
      required: true
    },
    shares: {
      type: Number,
      required: true,
      min: 1,
      max: 100
    },
    price: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Number,
      required: true
    }
  },
  { timestamps: false }
);

tradeSchema.set('toJSON', { virtuals: true });

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;
