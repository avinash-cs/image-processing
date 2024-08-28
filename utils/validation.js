// Function to validate the CSV headers
const validateCsvHeaders = (headers) => {
    const expectedHeaders = ['S. No.', 'Product Name', 'Input Image Urls'];
    if (headers.length !== expectedHeaders.length) {
      return false;
    }
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].trim() !== expectedHeaders[i]) {
        return false;
      }
    }
    return true;
  };
  
  // Function to validate the CSV data format
  const validateCsvData = (csv_data) => {
    for (const row of csv_data) {
      const valuesArray = Object.values(row);
      if (valuesArray.length !== 3) {
        return false;
      }
      const serialNumber = valuesArray[0];
      const productName = valuesArray[1];
      const inputImageUrls = valuesArray[2];
  
      if (typeof serialNumber !== 'string' || serialNumber.trim() === '') {
        return false;
      }
      if (typeof productName !== 'string' || productName.trim() === '') {
        return false;
      }
      if (typeof inputImageUrls !== 'string' || inputImageUrls.trim() === '') {
        return false;
      }
    }
    return true;
  };
  module.exports = { validateCsvData,validateCsvHeaders };
