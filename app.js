require('dotenv').config

const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./connection');

const tradeRoutes = require('./routes/trades');

const app = express();
const PORT = process.env.PORT || 8443;

connectDB();

app.use(bodyParser.json());
app.use('/trades', tradeRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});