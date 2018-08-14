const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'The description is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'The userId is required']
    }
});

module.exports = mongoose.model('Category', categoriaSchema);