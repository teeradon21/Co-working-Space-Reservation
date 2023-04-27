const express = require('express');
const {getReports,getReport,createReport,updateReport,deleteReport,unblockUser} = require('../controllers/reports');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(protect, getReports).post(protect, authorize('admin'), createReport);
router.route('/:id').get(getReport).put(protect, authorize('admin'), updateReport).delete(protect, authorize('admin'), deleteReport);
router.route('/unblock/:userId').put(protect, authorize('admin'), unblockUser);

module.exports=router;