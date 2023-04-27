const Report = require('../models/Report');
const Reservation = require('../models/Reservation');
const Space = require('../models/Space');
const User = require('../models/User');


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
                select : 'space',
                populate:{
                    path: 'space',
                    select : 'name'
                }
            }
        ]);
        }else{ //If you are admin, you can see all!
            query = Report.find().populate([
            {
                path: 'user',
                select : 'name'
            },{
                path: 'reservation',
                select : 'space',
                populate:{
                    path: 'space',
                    select : 'name'
                }
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


// //@desc     Get one report
// //@route    GET /api/v1/reports/:id
// //@access   Public
exports.getReport= async (req,res,next)=>{

    try{
        const report = await Report.findById(req.params.id).populate([
            {
                path: 'user',
                select : 'name'
            },{
                path: 'reservation',
                select : 'space',
                populate:{
                    path: 'space',
                    select : 'name',
                }
            }
        ]);
        if(!report){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:report});
    } catch(err){
        res.status(400).json({success:false});
    }
    
}

//@desc     Add one report
//@route    POST /api/v1/reports 
//@access   Private
exports.createReport= async (req,res,next)=>{
    console.log(req.body)
    console.log('line0')
    let user = await User.findById(req.body.user);
    console.log('line1')
    if (user.role === 'admin'){
        console.log('line2')
        return res.status(400).json({success:false, message:'Admin cannot be reported'})
    }
    console.log('line3')
    const report = await Report.create(req.body);
    console.log('line4')
    user = await User.findByIdAndUpdate(req.body.user, {
        $inc: { reports: 1 },
      })
    res.status(201).json({success: true, data:report});
};

// //@desc     Update one report
// //@route    PUT /api/v1/reports/:id 
// //@access   Private
exports.updateReport= async (req,res,next)=>{
    try{
        const report = await Report.findByIdAndUpdate(req.params.id,req.body, {
            new: true,
            runValidators: true
        });

        if(!report){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:report});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

// //@desc     Delete one report
// //@route    DELETE /api/v1/reports/:id
// //@access   Private
exports.deleteReport = async (req,res,next)=>{
    try{
        const report = await Report.findById(req.params.id);
        if(!report){
            return res.status(400).json({success:false});
        }
        report.remove();
        res.status(200).json({success:true, data:{}});
    } catch(err){
        res.status(400).json({success:false});
    }
};
