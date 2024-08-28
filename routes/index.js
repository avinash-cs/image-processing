const express = require('express');
const uploadController = require('../controllers/uploadController');
const statusController = require('../controllers/statusController');
const outputController = require('../controllers/outputController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();
router.post('/upload', upload.single('csv'), uploadController.upload);
router.get('/status/:request_id', statusController.getStatus);
router.get('/output/:request_id', outputController.getOutput);

module.exports = router;