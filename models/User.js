const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique : true,
        match : [
            /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user','admin'],
        default : 'user'
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength : 6,
        select : false
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt: {
        type: Date,
        default : Date.now
    },
    reports: {
        type: Number,
        default: 0,
        max: 3
    }
});

//Encrypt password using bcrypt
UserSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });
}

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}


// Please check this
// method to check if user is blocked
// UserSchema.methods.isBlocked = async function () {
//     return this.isBlocked;
//   };
  
//   method to increment the report count and check if user should be blocked
// UserSchema.methods.incrementReportCount = async function (reason, notes) {
//     this.reports.push({ reason, notes });
//     if (this.reports.length >= 3) {
//       this.isBlocked = true;
//     } 
//     await this.save();
    
// };

module.exports=mongoose.model('User',UserSchema);