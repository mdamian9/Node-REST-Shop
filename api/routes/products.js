const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find().exec().then(docs => {
        console.log(docs);
        // if (docs.length >= 0) {
        res.status(200).json(docs);
        // else {
        //     res.status(404).json({
        //         message: 'No documents found'
        //     });
        // };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
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
        res.status(500).json({ error: err });
    });
});

router.patch('/:productId', (req, res, next) => {
    const updateOps = {};
    // Loop through operations in req.body
    for (const ops of req.body) {
        // Set operation property name equal to the value in updateOps object
        updateOps[ops.propName] = ops.value;
    };
    // Update product with given ID passed, and set changes to updateOps
    Product.updateOne({ _id: req.params.productId }, { $set: updateOps }).exec().then(result => {
        console.log(result);
        res.status(200).json(result);
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.delete('/:productId', (req, res, next) => {
    Product.remove({ _id: req.params.productId }).exec().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Deleted product',
            result: result
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

module.exports = router;
