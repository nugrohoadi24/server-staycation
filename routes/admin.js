const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middleware/multer');

router.get('/', adminController.viewDashboard);
router.get('/booking', adminController.viewBooking);

router.get('/category', adminController.viewCategory);
router.post('/category', adminController.addCategory);
router.put('/category', adminController.editCategory);
router.delete('/category/:id', adminController.deleteCategory);

router.get('/bank', adminController.viewBank);
router.post('/bank', upload, adminController.addBank);
router.put('/bank', upload, adminController.editBank);
router.delete('/bank/:id', adminController.deleteBank);

router.get('/item', adminController.viewItem);
router.get('/item/:id', adminController.showDetailItem);
router.post('/item', uploadMultiple, adminController.addItem);
router.put('/item', uploadMultiple, adminController.editItem);
router.delete('/item/:id', adminController.deleteItem);

module.exports = router;