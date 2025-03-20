const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    jwt.sign({id}, process.env.JWT_secret, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
      });

    const token = signToken(newUser._id);

    if (req.headers['content-type'] === 'application/json') {
        return res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    }

    //redirect user after signup
    res.redirect('/signup-success');
});


exports.login = catchAsync(async(req, res, next) => {
    const {email, password} = req.body;

    //check if email, passwrd exist
    if(!email || !password){
        return next(new AppError('Please provide email and password.', 400));
    }

    //check if user exists && correct passwrd
    const user = await User.findOne({email}).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError('Incorrect email or password.', 401));
    }

    //send token to client if all is correct
    const token = signToken(user._id);
    res.status(200).json({
        status: 'success',
        token
    });
});
