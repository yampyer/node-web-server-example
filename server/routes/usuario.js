const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const User = require('../models/usuario');
const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

app.get('/usuario', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ status: true }, 'name email role status img google')
        .skip(from)
        .limit(limit)
        .exec((error, users) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            User.countDocuments({ status: true }, (error, count) => {
                res.json({
                    ok: true,
                    length: count,
                    users
                });
            });
        });
});

app.post('/usuario', [verifyToken, verifyAdminRole], (req, res) => {

    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'role', 'status', 'email', 'img']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.delete('/usuario/:id', [verifyToken, verifyAdminRole], (req, res) => {

    let id = req.params.id;

    //Soft delete
    let changeStatus = {
        status: false
    };
    User.findByIdAndUpdate(id, changeStatus, { new: true }, (error, userDeleted) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        });
    });

    //Hard delete
    /*User.findByIdAndRemove(id, (error, userDeleted) => {
        if (error) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        if (!userDeleted) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: userDeleted
        });
    });*/

});

module.exports = app;