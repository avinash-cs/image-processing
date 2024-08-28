const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  request_id: String,
  status: String,
  csv_data: String,
  created_at: Date,
  updated_at: Date,
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;