const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

const processImage = async (url, request_id, originalName) => {
    try {
      // Create output directory
      const outputDir = path.join(__dirname, '..','uploads', `${request_id}_output`);
      await fs.mkdir(outputDir, { recursive: true });
  
      // Download the image
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
  
      // Determine the file extension
      const fileExtension = path.extname(originalName).toLowerCase();
  
      // Process the image using Sharp to reduce file size
      let outputBuffer = await sharp(imageBuffer)
        .toBuffer();
  
      // Convert the image to the original format
      if (fileExtension === '.jpg' || fileExtension === '.jpeg') {
        outputBuffer = await sharp(outputBuffer)
          .jpeg({ quality: 50 }) // Adjust quality as needed
          .toBuffer();
      } else if (fileExtension === '.png') {
        outputBuffer = await sharp(outputBuffer)
          .png({ quality: 50 }) // Adjust quality as needed
          .toBuffer();
      } else if (fileExtension === '.webp') {
        outputBuffer = await sharp(outputBuffer)
          .webp({ quality: 50 }) // Adjust quality as needed
          .toBuffer();
      } else if (fileExtension === '.tiff') {
        outputBuffer = await sharp(outputBuffer)
          .tiff({ quality: 50 }) // Adjust quality as needed
          .toBuffer();
      } else if (fileExtension === '.gif') {
        outputBuffer = await sharp(outputBuffer)
          .gif({ quality: 50 }) // Adjust quality as needed
          .toBuffer();
      } else {
        throw new Error(`Unsupported file type: ${fileExtension}`);
      }
  
      // Save the processed image to the output directory
      const outputPath = path.join(outputDir, originalName);
      await fs.writeFile(outputPath, outputBuffer);
  
      // Return the output URL
      const outputUrl = `${process.env.URL}/uploads/${request_id}_output/${originalName}`;
      return outputUrl;
    } catch (error) {
      console.error(`Error processing image ${url}:`, error);
      throw error;
    }
  };
  
  const processImageToWebP = async (url, request_id, originalName) => {
    try {
      // Create output directory
      const outputDir = path.join(__dirname,'..', 'uploads', `${request_id}_output`);
      await fs.mkdir(outputDir, { recursive: true });
  
      // Download the image
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
  
      // Process the image using Sharp to reduce file size and convert to WebP
      const outputBuffer = await sharp(imageBuffer)
        .webp({ quality: 50 }) // Adjust quality as needed
        .toBuffer();
  
      // Save the processed image to the output directory
      const webpName = `${path.parse(originalName).name}.webp`;
      const outputPath = path.join(outputDir, webpName);
      await fs.writeFile(outputPath, outputBuffer);
  
      // Return the output URL
      const outputUrl = `${process.env.URL}/uploads/${request_id}_output/${webpName}`;
      return outputUrl;
    } catch (error) {
      console.error(`Error processing image ${url} to WebP:`, error);
      throw error;
    }
  };
  module.exports = { processImage, processImageToWebP };