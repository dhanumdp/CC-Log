var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');


var code;

//for sending mail to the user.


function mailsend(userDetail){

    code=Math.floor(100000 + Math.random() * 900000);
 
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
        subject: "MXCC - Forgot Your Password ?", 
        html:"<h4> Hai "+userDetail.Name+" Forgot Your Password? No Worries, We have got you recovered.</h4> <h2> <br> This is your Code "+code+"</h2> <br><h5><i>If you didn't make this request, or made it by mistake, please ignore this mail. Your Password will remain as it was.</h5></i>"
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
    
    return code;

}

//Student Change Password

            router.post('/student', (req,res)=>{
                //const 

                
                const rollno = req.body.rollno;
                const mail = req.body.email;
            
                var collection= mongoose.connection.db.collection('Users');
                collection.findOne({ 'Roll_No':rollno }, (err,doc)=>{
                    if(err)
                        res.send({success : false, message : "Error in retrieving student details"});
                    else    
                    {
                    if(!doc)
                    {
                        res.send({success : false, message : "Wrong Roll No"});
                    } 
                    else
                    {
                            if(doc.Email === mail )
                            { 
                            let user={
                                "Name":doc.Name,
                                "Mail":doc.Email
                            }
                            const RecievedCode = mailsend(user);
                            res.send({success : true, message : "Please Check your Mail Inbox/Spam  and Enter the Code below", code : RecievedCode});
                            
                            }
                            else
                            {
                                res.send({success : false, message : "This Mail is not yet updated in your profile. Please Contact the Admin to proceed further."});
                            }
                    }  
                    }
                
                        
                })
            })

     

            router.post('/student/changePassword', (req,res)=>{

                
                const rollno = req.body.rollno;
                const mail = req.body.mail;
                const password = req.body.password;
                var collection= mongoose.connection.db.collection('Users');
                collection.findOne({'Roll_No':rollno}, (err,doc)=>{
                    if(err)
                    {
                        res.send({success : false, message : "Error in Initiating Password Change"});
                    }
                    else
                    {
                        collection.update({'Roll_No':rollno},{$set : {'Password': password}}, (error,result)=>{
                            if(error)
                            {
                                res.send({success : false, message : "Error in Changing Password"});
                            }
                            else
                            {
                                res.send({success : true, message : "Password Changed"});
                            }
                        })
                    }
                })



            })

//admin Change Password

            router.post('/admin', (req,res)=>{
                //const 

                
                const username = req.body.username;
                const mail = req.body.email;

                var collection= mongoose.connection.db.collection("Admins");
                collection.findOne({ 'username':username }, (err,doc)=>{
                    if(err)
                        res.send({success : false, message : "Error in retrieving Admin details"});
                    else    
                    {
                    if(!doc)
                    {
                        res.send({success : false, message : "Wrong Username"});
                    } 
                    else
                    {
                            if(doc.email === mail )
                            { 
                            let user={
                                "Name":doc.name,
                                "Mail":doc.email
                            }
                            const RecievedCode = mailsend(user);
                            res.send({success : true, message : "Please Check your Mail Inbox and Enter the Code below", code : RecievedCode} );
                              
                            }
                            else
                            {
                                res.send({success : false, message : "This Mail is not Updated in your Profile"});
                            }
                    }
                    
                    
                        
                    }
                
                        
                })
            })

           


            router.post('/admin/changePassword', (req,res)=>{

            
                const username = req.body.username;
                
                const password = req.body.password;
                var collection= mongoose.connection.db.collection("Admins");
                collection.findOne({'username ':username}, (err,doc)=>{
                    if(err)
                    {
                        res.send({success : false, message : "Error in Initiating Password Change"});
                    }
                    else
                    {
                        collection.update({'username':username},{$set : {'password': password}}, (error,result)=>{
                            if(error)
                            {
                                res.send({success : false, message : "Error in Changing Password"});
                            }
                            else
                            {
                                res.send({success : true, message : "Password Changed"});
                            }
                        })
                    }
                })



            })





module.exports=router;
