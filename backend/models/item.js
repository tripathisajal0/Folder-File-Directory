const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['file', 'folder'],
        default: 'folder',
    },
    parentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        default: null,
    }
});

module.exports = mongoose.model('Item', itemSchema);
