const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const dealRouter = require('./routes/dealRouter');
const userRouter = require('./routes/userRouter');

// Start express app
const app = express();

app.use(express.json());

// GLOBAL MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('Hello from the middle-earth');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
  });


//ROUTES
app.use('/api/v1/deals', dealRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;

