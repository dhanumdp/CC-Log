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

 res.send("Oombu da Punda !!");
})


app.post('/student/register',(req,res)=>{

    var collection = mongoose.connection.db.collection('Users');

    let user={
        Name : req.body.Name,
        Roll_No : req.body.Roll_No.toLowerCase(),
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
                            res.json('Registration Error'+err);
                            console.log('Registration Error'+err);
                        }
                })
            }
    })


});

app.post('/student/login',(req,res)=>{

var collection = mongoose.connection.db.collection('Users');

var rollno = req.body.Roll_No.toLowerCase();
var password = req.body.Password;

collection.find({'Roll_No':rollno}).count((err,num)=>{
    if(num ==0)
    {
        
        res.json(rollno+' Not yet Registered');
        console.log('Student Not Found');
    }
    else
    {
        collection.findOne({'Roll_No':rollno},(error,docs)=>{
            if(docs.Password != password)
            {
                res.json('Password Incorrect');
                console.log('Password Incorrect');
            }
            else
            {
                res.json('Hi '+docs.Name+' You are logged in !!');
                console.log('Hi '+docs.Name+' You are logged in !!');
            }
        })
    }
})

});