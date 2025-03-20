const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.signup = catchAsync(async(req, res, next) => {
    const newUser = await User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
      });

    const token = jwt.sign({id: newUser._id}, process.env.JWT_secret, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });

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

