const csv = require('csv-parser');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Request = require('../models/request');
const Product = require('../models/product');
const { agenda } = require('../agenda/agenda');
const { validateCsvData, validateCsvHeaders } = require('../utils/validation');




exports.upload = async (req, res)=> {
    const csv_data = [];
    let headers = [];

    try {
      const fileContent = await fs.readFile(req.file.path, 'utf8');
      const stream = require('stream');
      const bufferStream = new stream.PassThrough();
      bufferStream.end(Buffer.from(fileContent, 'utf8'));

      bufferStream
        .pipe(csv())
        .on('headers', (headerList) => {
          headers = headerList;
        })
        .on('data', (row) => {
          csv_data.push(row);
        })
        .on('end', async () => {
          // Validate the CSV headers
          if (!validateCsvHeaders(headers)) {
            // Remove the uploaded CSV file
            await fs.unlink(req.file.path);
            return res.status(400).json({ error: 'Invalid CSV headers' });
          }

          // Validate the CSV data format
          if (!validateCsvData(csv_data)) {
            // Remove the uploaded CSV file
            await fs.unlink(req.file.path);
            return res.status(400).json({ error: 'Invalid CSV format' });
          }

          // Check if the exact same data has already been uploaded
          const existingRequest = await Request.findOne({ csv_data: JSON.stringify(csv_data) });
          if (existingRequest) {
            // Remove the uploaded CSV file
            await fs.unlink(req.file.path);

            if (existingRequest.status === 'completed') {
              const products = await Product.find({ request_id: existingRequest.request_id });
              if (products.length > 0) {
                const outputUrls = `${process.env.URL}/output/${existingRequest.request_id}`;
                return res.json({ message: 'Data already uploaded', request_id: existingRequest.request_id, status: existingRequest.status, csv_output: outputUrls });
              }
            }

            return res.json({ message: 'Data already uploaded', request_id: existingRequest.request_id, status: existingRequest.status });
          }

          const request_id = uuidv4();
          await Request.create({
            request_id,
            status: 'pending',
            csv_data: JSON.stringify(csv_data),
            created_at: new Date(),
            updated_at: new Date(),
          });

          csv_data.forEach((row) => {
            const valuesArray = Object.values(row);
            const serialNumber = valuesArray[0];
            const productName = valuesArray[1];
            const inputImageUrls = valuesArray[2];
            const input_image_urls = inputImageUrls.split(',').filter(url => url.trim() !== '');

            agenda.now('process image', {
              request_id,
              product_name: productName,
              input_image_urls,
            });
          });

          // Remove the uploaded CSV file
          await fs.unlink(req.file.path);
          const status_url = `${process.env.URL}/status/${request_id}`;
          res.json({ request_id, status_url });
        });
    } catch (error) {
      console.error('Error processing upload:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
// module.exports = uploadController;