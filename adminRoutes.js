const express=require('express');
const router = express.Router();
var mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const crypto = require('crypto').randomBytes(256).toString('hex');

router.post('/addAdmin',(req,res)=>{
    var collection = mongoose.connection.db.collection('Admins');
    let user={
        Username : req.body.username,
        Password : req.body.Password
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

//student login

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


module.exports=router;