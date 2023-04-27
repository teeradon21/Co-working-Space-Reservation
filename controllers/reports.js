const Report = require('../models/Report');
const Reservation = require('../models/Reservation');
const Space = require('../models/Space');
const USer = require('../models/User');


//@desc     Get all reports
//@route    GET /api/v1/reports 
//@access   Public
exports.getReports= async (req,res,next)=>{
        let query;
        //General users can see only their reservations!
        if(req.user.role !== 'admin'){
            query = Report.find({user:req.user.id}).populate([
            {
                path: 'user',
                select : 'name'
            },{
                path: 'reservation',
                select : 'name'
            }
        ]);
        }else{ //If you are admin, you can see all!
            query = Report.find().populate([
            {
                path: 'user',
                select : 'name'
            },{
                path: 'reservation',
                select : 'name'
            }
            ]);
        }
        try{
            const reports = await query;
    
            res.status(200).json({success:true, count:reports.length, data:reports});
        } catch(error){
            console.log(error);
            return res.status(500).json({success:false, message: "Cannot find Reports"});
        }
    
};