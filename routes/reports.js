const express = require('express');
const {getReports,getReport,createReport,updateReport,deleteReport} = require('../controllers/reports');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(protect, getReports).post(protect, authorize('admin'), createReport);
router.route('/:id').get(getReport).put(protect, authorize('admin'), updateReport).delete(protect, authorize('admin'), deleteReport);

module.exports=router;