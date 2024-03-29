const mongoose = require('mongoose')
const { Schema } = mongoose;
const validator  = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your Name!"],
        minLength: [3, "Name must contain at least 3 Characters!"],
        maxLength: [30, "Name cannot exceed 30 Characters!"],
    },
    email: {
        type: String,
        required: [true, "Please enter your Email!"],
        validate: [validator.isEmail, "Please provide a valid Email!"],
    },
    phone: {
        type: Number,
        default:0,
    },
    password: {
        type: String,
        required: [true, "Please provide a Password!"],
    },
    role: {
        type: String,
        enum: ["applicant", "employer"],
        default:""
    },
    friends:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default:[],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

exports.User = mongoose.model("User", userSchema)