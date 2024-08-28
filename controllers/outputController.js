const { validate: validateUuid } = require('uuid');
const Request = require('../models/request');
const Product = require('../models/product');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const outputController = {
  getOutput: async (req, res) => {
    const request_id = req.params.request_id;

  // Validate the request_id parameter
  if (!validateUuid(request_id)) {
    return res.status(400).json({ error: 'Invalid Request' });
  }

  const request = await Request.findOne({ request_id });

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.status !== 'completed') {
    return res.status(400).json({ error: 'Request is not completed', status: request.status });
  }

  const products = await Product.find({ request_id });

  if (products.length === 0) {
    return res.status(404).json({ error: 'No products found for this request ID' });
  }

  const csvWriter = createCsvWriter({
    path: 'output.csv',
    header: [
      { id: 'serialNumber', title: 'Serial Number' },
      { id: 'productName', title: 'Product Name' },
      { id: 'inputImageUrls', title: 'Input Image Urls' },
      { id: 'outputImageUrls', title: 'Output Image Urls' },
      { id: 'webpImageUrls', title: 'WebP Image Urls' },
    ]
  });

  const records = products.map((product, index) => ({
    serialNumber: index + 1,
    productName: product.product_name,
    inputImageUrls: product.input_image_urls.join(','),
    outputImageUrls: product.output_image_urls.join(','),
    webpImageUrls: product.webp_image_urls.join(','),
  }));

  await csvWriter.writeRecords(records);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=output_${request_id}.csv`);
  res.download('output.csv', `output_${request_id}.csv`);
  }
};

module.exports = outputController;