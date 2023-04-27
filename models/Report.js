const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default : Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref : 'User',
        required: true
    },
    reservation: {
        type: mongoose.Schema.ObjectId,
        ref : 'Reservation',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    notes: {
        type: String
    }
});

module.exports=mongoose.model('Report',ReportSchema);