const express = require('express');
const { z } = require('zod');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { usersmodel, coursemodel, purchasemodel } = require('../db');
const jwt = require('jsonwebtoken');
const { authuser, userJWT_SECRET } = require("../middleware/userauth.js");

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
        await usersmodel.create({
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
            message:"you are signup as user"
        })
    }
    
})

router.post('/login', async(req, res) => {
    try {
        const email = req.body.email;
        const password=req.body.password;
        
        const user = await usersmodel.findOne({ email });
        if (!user) {
            return res.status(403).json({
                message: "User not found"
            });
        }

        const passwordmatch = await bcrypt.compare(password, user.password);
        if (passwordmatch) {
            const token = jwt.sign({
                id: user._id
            }, userJWT_SECRET);

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


router.get('/purchases', authuser, async (req, res) => {
    
    const userId = req.userId;

    const purchases = await purchasemodel.find({
        userId,
    });

    let purchasedCourseIds = [];

    for (let i = 0; i<purchases.length;i++){ 
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const coursesData = await courseModel.find({
        _id: { $in: purchasedCourseIds }
    })

    res.json({
        purchases,
        coursesData
    })
})

module.exports = router;

