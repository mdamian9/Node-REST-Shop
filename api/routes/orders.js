const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
    // Use .populate to also return data about the product in the order
    Order.find().select('product quantity _id').populate('product', 'name price').exec().then(docs => {
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
                return {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/orders/${doc._id}`
                    }
                }
            })
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.post('/', (req, res, next) => {
    Product.findById(req.body.productId).then(product => {
        // If product is null (invalid ID) return false to send 404 response
        if (!product) {
            return false;
        } else {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();
        };
    }).then(result => {
        // If result was false (invalid product ID), return 404 error response
        if (!result) {
            return res.status(404).json({
                message: 'No product found'
            });
        };
        console.log(result);
        res.status(201).json({
            message: 'Order successfully created',
            createdOrder: {
                _id: result._id,
                product: result.product,
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: `http://localhost:3000/orders/${result._id}`
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId).populate('product').exec().then(order => {
        if (!order) {
            return res.status(404).json({
                message: 'Order not found'
            });
        };
        res.status(200).json({
            order: order,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/',
                description: 'GET request to obtain a list of all orders'
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.delete('/:orderId', (req, res, next) => {
    Order.remove({ _id: req.params.orderId }).exec().then(result => {
        res.status(200).json({
            message: 'Order deleted successfully',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders',
                body: { productId: 'ID', quantity: 'Number' },
                description: 'Use this POST route to create a new order'
            }
        })
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;

// Replace update() with updateOne(), updateMany(), or replaceOne()
// Replace remove() with deleteOne() or deleteMany().
