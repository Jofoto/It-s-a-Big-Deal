const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const dealRouter = require('./routes/dealRouter');
const userRouter = require('./routes/userRouter');
const viewRouter = require('./routes/viewRouter');

//const expressLayouts = require('express-ejs-layouts')
// const bodyParser = require('body-parser')

// Start express app
const app = express();

// Global Middlewares
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
// app.set('layout', 'layouts/layout')
// app.use(expressLayouts)

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
  });


//Body parser middleware  
app.use(express.urlencoded({ extended: true }));

//Routes
app.use('/api/v1/deals', dealRouter);
app.use('/api/v1/users', userRouter);
app.use('/', viewRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

