const express = require('express');
const app = express();
const _ = require('underscore');
const { verifyToken } = require('../middlewares/authentication');

let Product = require('../models/producto');

// Mostrar todos los productos
app.get('/productos', verifyToken, (req, res) => {
    let from = req.query.from || 0;
    from = Number(from);

    let limit = req.query.limit || 5;
    limit = Number(limit);

    Product.find({ available: true })
        .skip(from)
        .limit(limit)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((error, products) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            Product.countDocuments({ available: true }, (error, count) => {
                res.json({
                    ok: true,
                    length: count,
                    products
                });
            });
        });
});

// Mostrar un producto por id
app.get('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((error, productDB) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Product not found'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });
        });
});

// Buscar productos
app.get('/productos/buscar/:termino', verifyToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Product.find({ name: regex })
        .populate('category', 'description')
        .exec((error, products) => {
            if (error) {
                return res.status(500).json({
                    ok: false,
                    error
                });
            }

            res.json({
                ok: true,
                products
            });
        });
});

// Crear nuevo producto
app.post('/productos', verifyToken, (req, res) => {
    let userId = req.user._id;

    let body = req.body;

    let product = new Product({
        name: body.name,
        price: body.price,
        description: body.description,
        available: body.available,
        user: userId,
        category: body.category
    });

    product.save((error, productDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

// Actualizar producto
app.put('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let body = _.pick(req.body, ['name', 'price', 'available', 'description']);

    Product.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, productDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            product: productDB
        });
    });
});

// Borra producto
app.delete('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    //Soft delete
    let changeAvailability = {
        available: false
    };
    Product.findByIdAndUpdate(id, changeAvailability, { new: true }, (error, productDeleted) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!productDeleted) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Product not found'
                }
            });
        }

        res.json({
            ok: true,
            product: productDeleted
        });
    });
});


module.exports = app;