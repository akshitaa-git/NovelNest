const mongoose = require('mongoose');

const readingHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bookId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['added_to_want_to_read', 'started_reading', 'marked_as_read', 'reviewed', 'rated'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ReadingHistory', readingHistorySchema);
