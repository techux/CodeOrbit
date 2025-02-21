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
    socialLinks: [{
        platform: {
            type: String,
            enum: ['github', 'hackerrank', 'linkedin', 'twitter', 'medium'], // Predefined platforms
            required: true
        },
        username: {
            type: String,
            required: true
        },
    }],
},
{
    timestamps: true,
    versionKey: false
})


const User = mongoose.model("user", userSchema);

module.exports = User;