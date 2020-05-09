var mongoose = require('mongoose');

const Complaints = mongoose.model('Complaints',{

    date : {
        type : String,
        required : true
    },

    rollno : {
        type :String,
        required:true
    },

    systemNo : {
        type:String,
        required : true
    },

    complaint : {
        type : String,
        required : true
    },

    status : {
        type : String,
    }
}, 'Complaints');


module.exports = { Complaints };