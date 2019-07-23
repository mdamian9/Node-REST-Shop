const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/checkAuth');

// We will use Multer and set up storage config to upload a file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({
    storage: storage,
    // Limit to 5MB files
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // Custom filter created to accept only jpeg and png image formats
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
            console.log('Image accepted');
            cb(null, true);
        } else {
            console.log('Invalid image');
            cb(null, false);
        };
    }
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find().select('name price productImage _id').exec().then(docs => {
        // if (docs.length >= 0) {
        // Return a well structured response
        res.status(200).json({
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    productImage: doc.productImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/products/${doc._id}`
                    }
                };
            })
        });
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

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Created product successfully',
            createdProduct: {
                name: result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: `http://localhost:3000/products/${result._id}`
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.get('/:productId', (req, res, next) => {
    Product.findById(req.params.productId).select('name price productImage _id').exec().then(doc => {
        /*
            Sometimes mongoDB ID's are valid but unexistant. If doc exists send ok response, else set status
            code to 404 and send error message.
        */
        if (doc) {
            res.status(200).json({
                product: doc,
                request: {
                    type: 'GET',
                    description: 'Get all products',
                    url: 'http://localhost:3000/products'
                }
            });
        } else {
            res.status(404).json({ message: 'No vaild entry found for provided ID' });
        };
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.patch('/:productId', checkAuth, (req, res, next) => {
    const updateOps = {};
    // Loop through operations in req.body
    for (const ops of req.body) {
        // Set operation property name equal to the value in updateOps object
        updateOps[ops.propName] = ops.value;
    };
    // Update product with given ID passed, and set changes to updateOps
    Product.updateOne({ _id: req.params.productId }, { $set: updateOps }).exec().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Product updated',
            request: {
                type: 'GET',
                url: `http://localhost:3000/products/${req.params.productId}`
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
    Product.remove({ _id: req.params.productId }).exec().then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Deleted product',
            request: {
                type: 'POST',
                description: 'Create a new product',
                url: 'http://localhost:3000/products',
                data: {
                    name: 'String',
                    price: 'Number'
                }
            }
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
    });
});

module.exports = router;

// Replace update() with updateOne(), updateMany(), or replaceOne()
// Replace remove() with deleteOne() or deleteMany().

