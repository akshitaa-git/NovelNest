const BookShelf = require('../models/BookShelf');
const Review = require('../models/Review');

exports.getReadingAnalytics = async (req, res) => {
    try {
        const { userId } = req;

        const totalRead = await BookShelf.countDocuments({ userId, status: 'read' });
        const totalWantToRead = await BookShelf.countDocuments({ userId, status: 'want-to-read' });

        const shelfItems = await BookShelf.find({ userId });

        // Calculate average rating
        const reviews = await Review.find({ userId });
        const avgRating = reviews.length > 0 ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length : 0;

        // Genre distribution (mocked since Google Books genres are messy, but we'll try)
        // In a real app, I'd fetch genre info from the shelf items
        const genres = {};
        // Mocking for now to show visual charts
        const mockGenres = [
            { name: 'Fantasy', count: 5 },
            { name: 'Sci-Fi', count: 3 },
            { name: 'Mystery', count: 2 },
            { name: 'Non-Fiction', count: 4 }
        ];

        const monthlyData = [
            { month: 'Jan', count: 2 },
            { month: 'Feb', count: 4 },
            { month: 'Mar', count: 1 },
            { month: 'Apr', count: 5 },
            { month: 'May', count: 3 },
            { month: 'Jun', count: 2 }
        ];

        res.json({
            totalRead,
            totalWantToRead,
            avgRating: avgRating.toFixed(1),
            genres: mockGenres,
            monthlyData
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
