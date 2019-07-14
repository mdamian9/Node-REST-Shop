const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {
    // First look up user email to make sure no duplicate users are created
    User.find({ email: req.body.email }).exec().then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
                message: 'User already exists'
            });
        } else {
            // First, try to create password by passing in the password, salt rounds, and callback to bcrypt.hash
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    res.status(500).json({
                        message: 'Unable to create password',
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'User created successfully'
                        });
                    }).catch(err => {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    });
                };
            });
        }
    })
});

router.delete('/userId', (req, res, next) => {
    User.remove({ _id: req.params.userId }).exec().then(result => {
        res.status(200).json({
            message: 'User successfully deleted'
        });
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;
