const router = require('express').Router();
const apiController = require('../controllers/apiController');
// const { upload, uploadMultiple } = require('../middleware/multer');

router.get('/landing', apiController.landingPage);

module.exports = router;