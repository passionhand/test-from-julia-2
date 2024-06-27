const mongoose = require('mongoose');
// const mdbMS = require('mongodb-memory-server');
const { MongoMemoryServer } = require('mongodb-memory-server');

const ConnectionBase = require('./connection-base');
// const mongoServer = new mdbMS.MongoMemoryServer();
const Trades = require('../models/Trade');
mongoose.Promise = Promise;
let mongoServer;

const connect = async () => {
  if (!mongoServer) {
    mongoServer = await MongoMemoryServer.create();
  }

  const mongoUri = mongoServer.getUri('') + "stock_trades";

  try {
    await mongoose.connect(mongoUri);
    console.log(`MongoDB successfully connected to ${mongoUri}`);
  } catch (e) {
    console.error('Error connecting to MongoDB:', e);
    if (e.message.code === 'ETIMEDOUT') {
      console.log('Retrying MongoDB connection...');
      await mongoose.connect(mongoUri);
    } else {
      throw e;
    }
  }
}

class MongooseConnection extends ConnectionBase {
  constructor() {
    super();
    this.promise = null;
    this.connection = null;
  }

  async getConnection() {
    if (this.promise) {
      return this.promise;
    }
    this.promise = connect(this.promise)
      .then(connection => {
        this.connection = connection;
        return connection;
      })
      .catch(error => {
        this.promise = null; // Reset promise if there is an error
        throw error;
      });
    return this.promise
  }

  async clearDatabase() {
    return Trades.deleteMany();
  }

  async closeConnection() {
    if (this.connection) {
      await mongoose.connection.close(); // Returns a promise, awaited here
      await mongoServer.stop(); // Returns a promise, awaited here
      this.connection = null;
      this.promise = null;
      console.log("MongoDB connection closed.");
    }
  }
}

module.exports = MongooseConnection;
