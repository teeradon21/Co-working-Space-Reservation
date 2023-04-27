const express = require('express');
const {getReports} = require('../controllers/reports');

const router = express.Router({mergeParams:true});

const {protect, authorize} = require('../middleware/auth');

router.route('/')
    .get(protect, getReports)
    
module.exports=router;