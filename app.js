const express = require('express');
const session = require('express-session');
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


app.use(express.json());
//Body parser middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.use(session({
    secret: process.env.JWT_SECRET, 
    resave: false, 
    saveUninitialized: true
}));

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(req.headers);
    
    next();
  });


//Routes 
app.use('/', viewRouter);
app.use('/api/v1/deals', dealRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

