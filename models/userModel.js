const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
            /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/,
            'Password must contain at least one uppercase letter, one number, and one special character (!@#$%^&*).'
        ],
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm password.'],
        validate: {
            //only works on save and create
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords do not match.'
        }
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
});

userSchema.pre('save', async function(next){
    //run this function if pswrd was modified 
    // (if password has not been modified, exit function and call next middleware)
    if(!this.isModified('password')) return next(); 

    //encrypt/hash password with a CPU cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    //delete confirm field so it won't persist in db
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
   return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User; 