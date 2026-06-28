const BookShelf = require('../models/BookShelf');
const ReadingHistory = require('../models/ReadingHistory');

exports.addToShelf = async (req, res) => {
    try {
        const userId = req.user;
        const { bookId, status, title, authors, thumbnail } = req.body;

        let bookEntry = await BookShelf.findOne({ userId, bookId });

        if (bookEntry) {
            bookEntry.status = status;
            if (status === 'read') bookEntry.finishDate = new Date();
        } else {
            bookEntry = new BookShelf({
                userId,
                bookId,
                status,
                title,
                authors,
                thumbnail,
                finishDate: status === 'read' ? new Date() : null
            });
        }

        await bookEntry.save();

        // Log history
        const historyAction = status === 'read' ? 'marked_as_read' : 'added_to_want_to_read';
        const history = new ReadingHistory({
            userId,
            bookId,
            action: historyAction
        });
        await history.save();

        res.json(bookEntry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getShelf = async (req, res) => {
    try {
        const userId = req.user;
        const { status } = req.query;

        const query = { userId };
        if (status) query.status = status;

        const shelf = await BookShelf.find(query).sort({ addedDate: -1 });
        res.json(shelf);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.removeFromShelf = async (req, res) => {
    try {
        const userId = req.user;
        const { bookId } = req.params;

        await BookShelf.findOneAndDelete({ userId, bookId });
        res.json({ message: 'Book removed from shelf' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
