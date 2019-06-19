const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    // Set status code to 200, and send back json response
    res.status(200).json({
        message: '/products GET requests'
    });
});

router.post('/', (req, res, next) => {
    res.status(201).json({
        message: '/products POST requests'
    });
});

router.get('/:productId', (req, res, next) => {
    if (req.params.productId === 'special') {
        res.status(200).json({
            message: 'GET special ID'
        });
    } else {
        res.status(200).json({
            message: 'GET some productId'
        });
    };
});

router.patch('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Updated product (PATCH)'
    });
});

router.delete('/:productId', (req, res, next) => {
    res.status(200).json({
        message: 'Deleted product'
    });
});

module.exports = router;
