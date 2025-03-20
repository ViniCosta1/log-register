const mongoose = require('mongoose');

const loggingSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    method: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Logging', loggingSchema);