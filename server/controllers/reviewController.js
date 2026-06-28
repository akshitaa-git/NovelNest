const Review = require('../models/Review');
const BookShelf = require('../models/BookShelf');

exports.addReview = async (req, res) => {
    try {
        const { userId } = req;
        const { bookId, rating, content } = req.body;

        const review = new Review({
            userId,
            bookId,
            rating,
            content
        });

        await review.save();

        // Update rating in bookshelf if it exists
        await BookShelf.findOneAndUpdate(
            { userId, bookId },
            { rating, review: review._id }
        );

        res.json(review);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookReviews = async (req, res) => {
    try {
        const { bookId } = req.params;
        const reviews = await Review.find({ bookId }).populate('userId', 'name profilePicture').sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const { userId } = req;
        const { reviewId } = req.params;

        const review = await Review.findOneAndDelete({ _id: reviewId, userId });
        if (!review) return res.status(404).json({ message: 'Review not found or unauthorized' });

        res.json({ message: 'Review deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
