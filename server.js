
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const personRoutes = require('./routes/person');

const MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/peopledb';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Mongo connection error', err));

const app = express();
// restrict CORS to the hosted frontend (GitHub Pages)
app.use(cors({ origin: 'https://mgurunikhil.github.io' }));
app.use(bodyParser.json());

// mount routes
app.use('/person', personRoutes);

app.get('/', (req, res) => res.json({ ok: true }));

// 404 for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// centralized error handler
app.use((err, req, res, next) => {
  // log to server console
  console.error(err && err.stack ? err.stack : err);
  const status = err && err.status ? err.status : 500;
  const message = (err && err.message) || 'Internal Server Error';
  res.status(status).json({ error: message });
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
