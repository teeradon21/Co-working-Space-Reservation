const mongoose = require('mongoose');

const SpaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    district: {
        type: String,
        required: [true, 'Please add a distinct']
    },
    province: {
        type: String,
        required: [true, 'Please add a province']
    },
    postalcode: {
        type: String,
        required: [true, 'Please add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    tel: {
        type: String
    },
    region: {
        type: String,
        required: [true, 'Please add a region']
    }
}, {
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Cascade delete reservations when a space is deleted
SpaceSchema.pre('remove', async function(next){

    console.log(`Reservations being removed from space ${this._id}`);

    await this.model('Reservation').deleteMany({space: this._id});

    next();
});

//Reverse populate with virtuals
SpaceSchema.virtual('reservations',{
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'space',
    justOne:false
});

module.exports=mongoose.model('Space',SpaceSchema);