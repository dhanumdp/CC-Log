var express=require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var app=express();
var port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect('mongodb+srv://dhanumdp:mcadhanu@dhanumdp-brslm.mongodb.net/MXCC?retryWrites=true&w=majority',{ useNewUrlParser: true, useUnifiedTopology:true }, (err)=>{
        if(!err)
        {
            app.listen(port,()=>{
                console.log("Connected to Database. Server Running At port !!");
                
            });
        }
        else
        {
            console.log('DB Connection Error *** '+err);
        }
});

app.get('/',(req,res)=>{

 res.send("Android Lab Package");
})


//student registration

app.post('/student/register',(req,res)=>{

    var collection = mongoose.connection.db.collection('Users');

    let user={
        Name : req.body.Name.toUpperCase(),
        Roll_No : req.body.Roll_No.toUpperCase(),
        Email : req.body.email,
        Password : req.body.Password
    }

    collection.find({'Roll_No':user.Roll_No}).count((err,num)=>{
            if(num != 0)
            {
                res.json(user.Roll_No+' Already Registered.')
                console.log('Student Already Registered.')
            }
            else
            {
                collection.insertOne(user,(error,userDetail)=>{
                        if(!error)
                        {
                            res.json(user.Roll_No+' Registered Successfully');
                            console.log(user.Roll_No+' Registered Successfully');
                           // console.log(userDetail);
                        }
                        else
                        {
                            res.send('Registration Error'+err);
                            console.log('Registration Error'+err);
                        }
                })
            }
    })


});

//student login

app.post('/student/login',(req,res)=>{

var collection = mongoose.connection.db.collection('Users');

var rollno = req.body.Roll_No.toUpperCase();
var password = req.body.Password;

collection.find({'Roll_No':rollno}).count((err,num)=>{
    if(num ==0)
    {
        
        res.send(rollno+' Not yet Registered');
        console.log('Student Not Found');
    }
    else
    {
        collection.findOne({'Roll_No':rollno},(error,docs)=>{
            if(docs.Password != password)
            {
                res.send('Password Incorrect');
                console.log('Password Incorrect');
            }
            else
            {
                res.send('Success');
                console.log('Hi '+docs.Name+' You are logged in !!');
            }
        })
    }
})

});


//getDetails

app.post('/student/getDetails',(req,res)=>{
    var collection = mongoose.connection.db.collection('Users');

    var rollno = req.body.Roll_No.toUpperCase();
        {
            collection.findOne({'Roll_No':rollno},(error,docs)=>{
              res.send(docs.Name);
            })
        }
    })
    


//student attendance entry


const {Attendance} = require('./attendance');

app.post('/student/putAttendance',(req,res)=>{

    // var collection = mongoose.connection.db.collection("Attendance");
    Attendance.find({'date':req.body.date, 'rollno':req.body.rollno}).count((err,doc)=>{
        if(doc != 0)
        {
        console.log("Already Checked In");
        Attendance.update({'date':req.body.date,'rollno':req.body.rollno},{$set:{'checkOut':req.body.time}},(error,doc)=>{
            if(!error)
            {
                res.send('Checked Out at '+req.body.time);
            }
            else
            {
                res.send('Error while Checking Out.');
            }
        })

       
    }
    else
    {

        console.log("New Attendance Entry");
        let atd = new Attendance({
            date : req.body.date,
            rollno : req.body.rollno,
            reason : req.body.reason,
            checkIn : req.body.time,
            checkOut : "",
        })

        atd.save((err)=>{
            if(!err)
            {
                res.send(req.body.rollno +"Checked In at "+req.body.time);
            }
            else
            {
                res.send('Error while Checking In' + err);
            }
        })

    }

})

})


//get student attendace

app.post('/student/getAttendance',(req,res)=>{

        Attendance.find({'date':req.body.date, 'rollno':req.body.rollno}, (err,doc)=>{
            if(err)
            {
                res.send('Error')
            }
            else
            {
                res.send(doc);
            }
        })
})


//student complaint entry

const {Complaints} = require('./complaint');

app.post('/student/complaint', (req,res)=>{

    let complaint = new Complaints(req.body);

    complaint.save((err,doc)=>{
        if(err)
        {
            res.send("Error")
        }
        else
        {
            res.send(doc);
        }
    })

})


//student view complaint

app.post('/student/viewComplaints',(req,res)=>{

    Complaints.find({'rollno':req.body.rollno},(err,doc)=>{
        if(err)
        {
            res.send("Error")
        }
        else
        {
            res.send(doc);
        }
    })
})


//admin view attendance

app.post('/admin/viewAttendance',(req,res)=>{

    Attendance.find({'date':req.body.date},(err,doc)=>{
        if(err)
        {
            res.send("Error");
        }
        else
        {
            res.send(doc);
        }
    })
})


//admin view complaint

app.post('/admin/viewComplaint',(req,res)=>{
    Complaints.find((err,docs)=>{
        if(err)
            res.send("Error")
        else
            res.send(docs)
    })

})



//admin edit complaint

app.post('/admin/editComplaint',(req,res)=>{

    Complaints.findByIdAndUpdate({'_id':req.body._id},{$set : {'status':'Solved Issue'}},(err,docs)=>{
        if(err)
        {
            res.send(err);
        }
        else
        {
            res.send(docs);
        }
    })
})

const password = require('./changePasswordRoutes');
app.use('/forgotpassword',password);