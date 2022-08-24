const router = require('express').Router();
const apiController = require('../controllers/apiController');
const { upload } = require('../middleware/multer');

router.get('/landing', apiController.landingPage);
router.get('/detail/:id', apiController.detailPage);
router.post('/booking', upload, apiController.bookingPage);

module.exports = router;