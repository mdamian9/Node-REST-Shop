const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    // Set status code to 200, and send back json response
    res.status(200).json({
        message: '/products GET requests'
    });
});

router.post('/', (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: '/products POST requests',
            createdProduct: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.get('/:productId', (req, res, next) => {
    Product.findById(req.params.productId).exec().then(doc => {
        console.log(doc);
        /* 
            Sometimes mongoDB ID's are valid but unexistant. If doc exists send ok response, else set status
            code to 404 and send error message.
        */
        if (doc) {
            res.status(200).json(doc);
        } else {
            res.status(404).json({ message: 'No vaild entry found for provided ID' });
        };
    }).catch(err => {
        console.log(err);
        // If an error is caught, set status code to 500 and send error JSON data
        res.status(500).json({ error: err });
    });
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
