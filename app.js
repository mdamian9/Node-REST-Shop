const express = require('express');
const app = express();
const logger = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// Log all requests to console
app.use(logger('dev'));

// Routes to handle requests
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

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
