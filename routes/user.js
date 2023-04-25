const express = require('express');
const router = express.Router();
const { reportUser, unblockUser } = require('../controllers/user');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/:id/report').post(protect, authorize('admin'), reportUser);
router.route('/:id/unblock').put(protect, authorize('admin'), unblockUser);

module.exports = router;
