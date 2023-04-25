const User = require('../models/User');

//@desc     Report a user for violating terms of service
//@route    POST /api/v1/reservations/:id/report
//@access   Private (admin only)
exports.reportUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.reports.push({
        reason: req.body.reason,
        notes: req.body.notes
      });
  
      if (user.reports.length >= 3) {
        user.isBlock = true;
        await user.save();
        return res.status(200).json({ success: true, message: 'User has been blocked' });
      } else {
        await user.save();
        return res.status(200).json({ success: true, message: 'Report has been submitted' });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  
  //@desc     Unblock a blocked user
  //@route    PUT /api/v1/reservations/:id/unblock
  //@access   Private (admin only)
  exports.unblockUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      user.isBlock = false;
      await user.save();
  
      return res.status(200).json({ success: true, message: 'User has been unblocked' });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Server Error' });
    }
  };
  