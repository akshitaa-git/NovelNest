const mongoose = require('mongoose');

const bookShelfSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    bookId: {
        type: String, // Google Books ID or Open Library ID
        required: true,
        index: true
    },
    title: String,
    authors: [String],
    thumbnail: String,
    status: {
        type: String,
        enum: ['want-to-read', 'reading', 'read'],
        required: true
    },
    addedDate: {
        type: Date,
        default: Date.now
    },
    finishDate: Date,
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0
    },
    review: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }
}, { timestamps: true });

// Ensure a user can only have a book once on their shelf
bookShelfSchema.index({ userId: 1, bookId: 1 }, { unique: true });

module.exports = mongoose.model('BookShelf', bookShelfSchema);
