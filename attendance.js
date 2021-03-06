var mongoose = require('mongoose');

const Attendance = mongoose.model('Attendance',{
    date : {
        type : String,
        required : true
    },
    rollno : {
        type : String,
        required : true
    },
    reason:{
        type : String,
    },
    
    checkIn : {
        type : String
    },
    checkOut:{
        type : String
    }
}, 'Attendance');


module.exports = { Attendance };