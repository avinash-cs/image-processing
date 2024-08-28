const { validate: validateUuid } = require('uuid');
const Request = require('../models/request');
const Product = require('../models/product');

const statusController = {
  getStatus: async (req, res) => {
    const request_id = req.params.request_id;

    // Validate the request_id parameter
    if (!validateUuid(request_id)) {
      return res.status(400).json({ error: 'Invalid Request' });
    }
  
    const request = await Request.findOne({ request_id });
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
  
    const response = { status: request.status };
  
    if (request.status === 'completed') {
      const products = await Product.find({ request_id });
      if (products.length > 0) {
        const outputUrls = `${process.env.URL}/output/${request_id}`;
        response.csv_output = outputUrls;
      }
    }
  
    res.json(response);
  }
};

module.exports = statusController;