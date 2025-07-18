const express = require('express');
const router = express.Router();
const { coursemodel, purchasemodel } = require('../db');
const { authuser } = require("../middleware/userauth.js");

// Get all courses
router.get('/all',authuser, async (req, res) => {
    try {
        const courses = await coursemodel.find({});
            

        if (!courses || courses.length === 0) {
            return res.status(404).json({
                message: "No courses found"
            });
        }

        res.json({
            message: "Courses retrieved successfully",
            courses: courses
        });
    } catch (error) {
        console.error("Error fetching courses:", error);
        res.status(500).json({
            message: "Error fetching courses",
            error: error.message
        });
    }
});



// Purchase a course
router.post('/purchase/:courseId', authuser, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const userId = req.userId;

        // Check if course exists
        const course = await coursemodel.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found"
            });
        }

        // Check if already purchased
        const existingPurchase = await purchasemodel.findOne({
            userId,
            courseId
        });

        if (existingPurchase) {
            return res.status(400).json({
                message: "You have already purchased this course"
            });
        }

        // Create purchase record
        await purchasemodel.create({
            userId,
            courseId
        });

        res.status(201).json({
            message: "Course purchased successfully"
        });
    } catch (error) {
        console.error("Error purchasing course:", error);
        res.status(500).json({
            message: "Error purchasing course",
            error: error.message
        });
    }
});

// Get user's purchased courses
router.get('/my/purchased', authuser, async (req, res) => {
    try {
        const userId = req.userId;
        const purchases = await purchasemodel.find({ userId });
        const purchasedCourseIds = purchases.map(p => p.courseId);
        
        const purchasedCourses = await coursemodel.find({
            _id: { $in: purchasedCourseIds }
        });

        res.json({
            message: "Purchased courses retrieved successfully",
            courses: purchasedCourses
        });
    } catch (error) {
        console.error("Error fetching purchased courses:", error);
        res.status(500).json({
            message: "Error fetching purchased courses",
            error: error.message
        });
    }
});



module.exports = router;
