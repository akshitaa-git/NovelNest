const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    recommendedBooks: [{
        bookId: String,
        title: String,
        authors: [String],
        thumbnail: String,
        reason: String // e.g., "Because you liked Harry Potter"
    }],
    lastUpdated: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
