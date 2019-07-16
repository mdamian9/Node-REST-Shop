const express = require('express');
const app = express();
const logger = require('morgan');
const mongoose = require('mongoose');

// Require routes
const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

// Connect to mongoDB using mongoose
mongoose.connect(
    `mongodb+srv://mdamian9:${process.env.MONGO_ATLAS_PW}@node-rest-shop-0xhk0.mongodb.net/test?retryWrites=true&w=majority`,
    { useNewUrlParser: true }
);
mongoose.set('useCreateIndex', true);

/* 
    Use middleware: morgan / body-parser
    - Use express.static middleware targeting /uploads route, make uploads folder public
    - Use bodyParser.urlencoded to parse urlencoded bodies with {extended: false} for simple bodies
    - Use bodyParser.json() to extract JSON data and make readable / accessible
    - Use middleware to funnel every request through it to handle CORS
*/
app.use(logger('dev'));
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use((req, res, next) => {
    // Add headers to adjust response with the following headers to handle CORS errors
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    // If browser sends OPTIONS request, set header 
    if (req.method === 'OPTIONS') {
        // Set header to let browser know what requests it may send
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({})
    };
    // Send request to next middleware (our routes in this case)
    next();
});

// Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

// Handle all requests that did not reach a route (error handling)
app.use((req, res, next) => {
    // Create new error and pass in error message
    const err = new Error('Not found');
    // Set status
    err.status = 404;
    // Forward error request to next middleware handler
    next(err);
});

// Handle errors from above / failed DB operations
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});

module.exports = app;
