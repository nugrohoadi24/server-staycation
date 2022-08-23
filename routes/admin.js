const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { upload, uploadMultiple } = require('../middleware/multer');
// const auth = require('../middleware/auth');

router.get('/login', adminController.viewSignIn);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

router.get('/dashboard', adminController.viewDashboard);

router.get('/user', adminController.viewUser);
router.post('/user', adminController.addUser);
router.put('/user', adminController.editUser);
router.delete('/user/:id', adminController.deleteUser);

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
router.delete('/item/:id/category/:categoryId', adminController.deleteItem);

router.post('/item/add-feature', upload, adminController.addFeature);
router.put('/item/update-feature', upload, adminController.editFeature);
router.delete('/item/delete-feature/:itemId/feature/:id', adminController.deleteFeature);

router.post('/item/add-activity', upload, adminController.addActivity);
router.put('/item/update-activity', upload, adminController.editActivity);
router.delete('/item/delete-activity/:itemId/activity/:id', adminController.deleteActivity);

router.get('/booking', adminController.viewBooking);
router.get('/booking/:id', adminController.showDetailBooking);
router.put('/booking/confirm/:id', adminController.actionConfirmation);
router.put('/booking/reject/:id', adminController.rejectConfirmation);

// router.use(auth);

module.exports = router;