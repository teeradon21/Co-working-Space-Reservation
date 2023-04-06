const Space = require('../models/Space');
const { param } = require('../routes/spaces');

//@desc     Get all spaces
//@route    GET /api/v1/spaces 
//@access   Public
exports.getSpaces= async (req,res,next)=>{
    try{
        let query;
        //Copy req.query
        const reqQuery = {...req.query};

        //Fields to exclude
        const removeFields = ['select','sort','page','limit'];

        //Loop over remove fields and delete them from reqQuery
        removeFields.forEach(param=>delete reqQuery[param]);
        //console.log(reqQuery);
        
        //Create query string
        let queryStr = JSON.stringify(req.query);

        //Create operators ($gt, $gte, etc)
        queryStr = queryStr.replace(/\b(gt|get|lt|lte|in)\b/, match=>`$${match}`);

        //finding resource
        query = Space.find(JSON.parse(queryStr)).populate('reservations');

        //Select Fields
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        //Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else{
            query=query.sort('-createdAt');
        }

        //Pagination
        const page = parseInt(req.query.page,10) || 1;
        const limit = parseInt(req.query.limit,10) || 25;
        const startIndex = (page-1)*limit;
        const endIndex = page*limit;
        const total = await Space.countDocuments();

        query=query.skip(startIndex).limit(limit);

        //Executing query
        const spaces = await query;

        //Pagination result
        const pagination = {};

        if (endIndex<total){
            pagination.next={
                page:page+1,
                limit
            }
        }

        if (startIndex>0){
            pagination.prev={
                page:page-1,
                limit
            }
        }
        
        res.status(200).json({success:true, count:spaces.length, pagination, data:spaces});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Get single space
//@route    GET /api/v1/spaces/:id
//@access   Public
exports.getSpace= async (req,res,next)=>{
    try{
        const space = await Space.findById(req.params.id);
        if(!space){
            return res.status(400).json({success:false});
        }
        res.status(200).json({success:true, data:space});
    } catch(err){
        res.status(400).json({success:false});
    }
    
}

//@desc     Create new space
//@route    POST /api/v1/spaces 
//@access   Private
exports.createSpace= async (req,res,next)=>{
    //console.log(req.body)
    const space = await Space.create(req.body); 
    res.status(201).json({success: true, data:space});
};

//@desc     Update space
//@route    PUT /api/v1/spaces/:id 
//@access   Private
exports.updateSpace= async (req,res,next)=>{
    try{
        const space = await Space.findByIdAndUpdate(req.params.id,req.body, {
            new: true,
            runValidators: true
        });

        if(!space){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:space});
    } catch(err){
        res.status(400).json({success:false});
    }
    
};

//@desc     Delete space
//@route    DELETE /api/v1/spaces /:id
//@access   Private
exports.deleteSpace = async (req,res,next)=>{
    try{
        const space = await Space.findById(req.params.id);
        if(!space){
            return res.status(400).json({success:false});
        }
        space.remove();
        res.status(200).json({success:true, data:{}});
    } catch(err){
        res.status(400).json({success:false});
    }
};