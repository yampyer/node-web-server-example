const express = require('express');

const app = express();

const { verifyToken, verifyAdminRole } = require('../middlewares/authentication');

let Category = require('../models/categoria');

// Mostrar todas las categorias
app.get('/categoria', verifyToken, (req, res) => {
    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((error, categories) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    error
                });
            }

            Category.countDocuments({}, (error, count) => {
                res.json({
                    ok: true,
                    length: count,
                    categories
                });
            });
        });
});

// Mostrar una categoria por id
app.get('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    Category.findById(id, (error, categoryDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Crear nueva categoria
app.post('/categoria', verifyToken, (req, res) => {
    let userId = req.user._id;

    let body = req.body;

    let category = new Category({
        description: body.description,
        user: userId
    });

    category.save((error, categoryDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Actualizar categoria
app.put('/categoria/:id', verifyToken, (req, res) => {
    let id = req.params.id;

    let body = req.body;
    let descriptionCategory = {
        description: body.description
    };

    Category.findByIdAndUpdate(id, descriptionCategory, { new: true, runValidators: true }, (error, categoryDB) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                error
            });
        }

        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Borra archivo de categoria
app.delete('/categoria/:id', [verifyToken, verifyAdminRole], (req, res) => {
    let id = req.params.id;

    Category.findByIdAndRemove(id, (error, categoryDeleted) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                error
            });
        }

        if (!categoryDeleted) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Category not found'
                }
            });
        }

        res.json({
            ok: true,
            category: categoryDeleted
        });
    });
});


module.exports = app;