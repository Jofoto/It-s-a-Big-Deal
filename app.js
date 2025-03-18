const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const dealRouter = require('./routes/dealRouter');
const userRouter = require('./routes/userRouter');

// Start express app
const app = express();

// GLOBAL MIDDLEWARES
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
  });


//ROUTES
app.use('/api/v1/deals', dealRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server.`
    });
});

module.exports = app;

