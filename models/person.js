const mongoose = require('mongoose');

const PersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, default: 0 },
  gender: { type: String, default: '' },
  mobile: { type: String, default: '' }
});

module.exports = mongoose.model('Person', PersonSchema);
