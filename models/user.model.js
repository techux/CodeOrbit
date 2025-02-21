const { validate } = require('email-validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: e => validate(e),
            message: props => `${props.value} is not a valid email!`
        },
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    hackerrank: {
        type: String,
        default: null
    },
    leetcode: {
        type: String,
        default: null
    },
    gfg: {
        type: String,
        default: null
    },
    codeforces: {
        type: String,
        default: null
    },
    codechef: {
        type: String,
        default: null
    },
    code360: {
        type: String,
        default: null
    }
},
{
    timestamps: true,
    versionKey: false
})


const User = mongoose.model("user", userSchema);

module.exports = User;