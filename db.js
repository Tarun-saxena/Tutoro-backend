const mongoose = require('mongoose');
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI);


const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;


const adminschema = new Schema({
  email: {type: String, unique: true},
  password: String,
  username: String
});

const userschema = new Schema({
  email: {type: String, unique: true},
  password: String,
  username: String
});

const courseschema = new Schema({
  title: String,
  description: String,
  imageUrl: String,
  price: Number,
  creatorId: ObjectId
});

const purchaseschema=new Schema({
    userId:ObjectId,
    courseId:ObjectId
})

const adminmodel=mongoose.model("admins",adminschema);

const usersmodel=mongoose.model("users",userschema);

const coursemodel=mongoose.model("courses",courseschema);

const purchasemodel=mongoose.model("purchasedcourses",purchaseschema);

module.exports={
    adminmodel,
    usersmodel,
    coursemodel,
    purchasemodel

}

