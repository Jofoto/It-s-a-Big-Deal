const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, 'You must have a username!']
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, 'You *really* dont have an email?'],
        validate: [validator.isEmail, 'Please provide a valid email.']
    },
    password: {
        type: String,
        required: [true, 'Password IS required. Duh.'],
        minlength: [8, 'Password must be at least 8 characters long'],
        match: [
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]/,
            'Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*).'
        ],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password.']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User; 