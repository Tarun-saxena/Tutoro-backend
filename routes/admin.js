const express = require('express');
const { z } = require('zod');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { adminmodel, coursemodel } = require('../db');
const jwt = require('jsonwebtoken');
const { authadmin, adminJWT_SECRET } = require("../middleware/adminauth.js");

router.post('/signup', async (req, res) => {
    //input validation
     const requiredbody=z.object({
        email:z.string().min(5).max(30).email(),
        password:z.string().max(8).min(6),
        username:z.string().max(20).min(3)
    })

     const parseddata=requiredbody.safeParse(req.body);
     if(!parseddata.success){
        res.json({
            message:"incorrect format",
            error:parseddata.error
        })
        return
     }
    //hashing
    const error=false
    const email=req.body.email;
    const username=req.body.username;
    const password=req.body.password;
    
    try{
        const hashedpassword=await bcrypt.hash(password,5);
        await adminmodel.create({
            email:email,
            password:hashedpassword,
            username:username
        })


    }catch(e){
        res.json({
            message:"you are already signup"
        })
        error = true
    }

    if(!error){
        res.json({
            message:"you are signup as admin"
        })
    }
    
})

router.post('/login', async(req, res) => {
    try {
          const email=req.body.email;
          const password=req.body.password;
        const admin = await adminmodel.findOne({ email });
        if (!admin) {
            return res.status(403).json({
                message: "Admin not found"
            });
        }

        const passwordmatch = await  bcrypt.compare(password, admin.password);
        if (passwordmatch) {
            const token = jwt.sign({
                id: admin._id
            }, adminJWT_SECRET);

            return res.json({
                token: token,
                message: "Logged in successfully"
            });
        } else {
            return res.status(403).json({
                message: "Incorrect password"
            });
        }
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
    

  
})



router.post('/courses', authadmin, async (req, res) => {
    const adminId=req.userId;
    const title=req.body.title;
    const description=req.body.description;
    const imageUrl=req.body.imageUrl;
    const price=req.body.price;

    const course=await coursemodel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })
    res.json({
        message: "Course created",
        courseId: course._id
    })
  
})

router.get('/courses', authadmin, async (req, res) => {
     const  creatorId = req.userId;

    const courses = await coursemodel.find({
         creatorId
    });

    res.json({ courses });
});

module.exports = router;

