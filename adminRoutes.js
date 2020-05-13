const express=require('express');
const router = express.Router();
var mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const crypto = require('crypto').randomBytes(256).toString('hex');
var nodemailer = require('nodemailer');


const {Complaints} = require('./complaint');


//admin login

router.post('/login',(req,res)=>{

var collection = mongoose.connection.db.collection('Admins');

var username = req.body.username;
var password = req.body.password;

collection.find({'Username':username}).count((err,num)=>{
    if(num ==0)
    {
        res.send({success:false, message:username+' Not yet Registered'});
        console.log('Admin Not Found');
    }
    else
    {
        collection.findOne({'Username':username},(error,docs)=>{
            const token = jwt.sign({userId:docs._id}, crypto, {expiresIn : '24h'});
            
            if(docs.Password != password)
            {
                res.send({success:false, message:"Password Incorrect"});
                console.log('Password Incorrect');
            }
            else
            {
                res.send({success:true, message:"Logged In Successfully", token : token, 
                user :docs.Username});
               // console.log('Hi '+docs.Name+' You are logged in !!');
            }
        })
    }
})
});


//adding admin
router.post('/addAdmin',(req,res)=>{
    var collection = mongoose.connection.db.collection('Admins');
    let user={
        Username : req.body.username,
        Password : req.body.password
    }
               
    collection.find({'Username':user.Username}).count((error,us)=>{
                        if(us !=0)
                        {
                            //res.json('Already one User registered with this '+user.Email);
                            res.send({success:false, message : 'User Exists'})
                        }
                        else
                        {
                            collection.insertOne(user,(error,userDetail)=>{
                                if(!error)
                                {
                                    res.send({success:true, message : user.Username+' Registered Successfully'})
                        

                                    console.log(user.Username+' Registered Successfully');
                                   // console.log(userDetail);
                                }
                                else
                                {
                                    res.send({success:false , message : "Registration Error"})
                                    console.log('Registration Error'+err);
                                }
                        })
                        }
                })
            
});

//changing password

router.post('/changePassword',(req,res)=>{

    var collection = mongoose.connection.db.collection('Admins');
    console.log(req.body)
    collection.findOneAndUpdate({'Username':req.body.username},{$set :{'Password':req.body.password} }).then(()=>{
        res.send({success:true, message : 'Password Changed Successfully'})
    }).catch((err)=>{
        res.send({success:false, message:"Password Not Changed"})
    })

})





//get Attendance

router.post('/getAttendanceList',(req,res)=>{
    var collection = mongoose.connection.db.collection('Attendance');
    collection.find({'date':req.body.date}).count((err,num)=>{
        if(num == 0)
        {
            res.send({success:false, message: 'No Records Found'})
        }
        else
        {
           

            collection.find({'date':req.body.date}).toArray((error,docs)=>{
                if(error)
                {
                    res.send({success:false, message : 'Error While Fetching Attendance From DB'})
                }
                else
                {
                    res.send({success:true, data : docs})
                }
            })
        }
    })
    
})

//get Complaints

router.get('/getComplaintList',(req,res)=>{
    var collection = mongoose.connection.db.collection('Complaints');
 
        
            collection.find({}).toArray((error,docs)=>{
                if(error)
                {
                    res.send({success:false, message : 'Error While Fetching Complaints From DB'})
                }
                else
                {
                    res.send({success:true, data : docs})
                }
            })

    
})


//sending mail to students


function mailsend(userDetail){
 
    const transporter = nodemailer.createTransport({
        
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,  //true for 465 port, false for other ports
        auth: {
          user: 'cclabmca@gmail.com',
          pass: '18mxians'
        }
      });
               
      const mailOptions = {
        from: 'cclabmca@gmail.com', // sender address
        to: userDetail.Mail, // list of receivers
        subject: "MXCC - MCA CC LAB COMPLAINT", 
        html:"<h4> Hai "+userDetail.Name+". "+userDetail.Message+"</h4> <br><h3><i>"+userDetail.Message1+"</i></h3>"
    };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
             console.log(error);
             //  res.status(400).send(error);
        } else {
             console.log('Success');
             // res.status(200).send(info);
        }
      });
    
}

//update Complaint Status
router.get('/updateComplaint/:id',(req,res)=>{

var collection = mongoose.connection.db.collection('Users');
    
    Complaints.findById({_id:req.params.id}).then((doc)=>{
        //console.log(doc);
        var rollno = doc.rollno;
        var complaint = doc.complaint;
        var systemNo = doc.systemNo;
        Complaints.findByIdAndUpdate({_id:req.params.id},{$set:{status:'Solved Issue'}}).then(()=>{
            res.send({success:true, message:'Status Updated'})

            collection.findOne({'Roll_No':rollno}).then((user)=>{
                let UserDetail ={       
                    Name : user.Name,
                    Mail :user.Email,
                    Message : "The Issue you mentioned "+complaint+" on "+systemNo+" is Solved.",
                    Message1 :"Thank You"
                }
                mailsend(UserDetail);
            }).catch((err)=>{
                res.send({success:false, message :'Error while finding Student Mail'})
            })
           
        }).catch((error=>{
            res.send({success:false, message:'Status Updation Failed'})
        }))
                
        }).catch((err)=>{
            res.send({success:false, message:'Error While Retrieving Complaint'})
    })
})
//delete Complaint
router.get('/deleteComplaint/:id',(req,res)=>{

    var collection = mongoose.connection.db.collection('Users');
        
        Complaints.findById({_id:req.params.id}).then((doc)=>{
            //console.log(doc);
            var rollno = doc.rollno;
            var complaint = doc.complaint;
            var systemNo = doc.systemNo;
            Complaints.findByIdAndDelete({_id:req.params.id}).then(()=>{
                res.send({success:true, message:'Complaint Deleted'})
                collection.findOne({'Roll_No':rollno}).then((user)=>{
                    let UserDetail ={       
                        Name : user.Name,
                        Mail :user.Email,
                        Message : "The Issue you mentioned "+complaint+" on "+systemNo+" is Deleted.",
                        Message1: "If you received this email before getting Solved Issue Mail, it means your complaint is inappropriate. So that it will be deleted. "

                    }
                    mailsend(UserDetail);
                }).catch((err)=>{
                    res.send({success:false, message :'Error while finding Student Mail'})
                })
               
            }).catch((error=>{
                res.send({success:false, message:'Complait Deletion Failed'})
            }))
                    
            }).catch((err)=>{
                res.send({success:false, message:'Error While Retrieving Complaint'})
        })
    })

      

module.exports=router;

