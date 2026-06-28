const axios = require('axios');
const BookShelf = require('../models/BookShelf');
const API_KEY = process.env.GOOGLE_BOOKS_API_KEY || '';

// Helper: clean & upgrade thumbnail to highest resolution available
const getBestThumbnail = (imageLinks) => {
    if (!imageLinks) return null;
    const url = imageLinks.extraLarge
        || imageLinks.large
        || imageLinks.medium
        || imageLinks.thumbnail
        || imageLinks.smallThumbnail;
    if (!url) return null;
    // Force HTTPS and use zoom=1 for higher resolution
    return url.replace('http://', 'https://').replace('&zoom=1', '').replace('zoom=5', 'zoom=1');
};

// Helper: map a Google Books volume item to our book shape
const mapBook = (item) => {
    const info = item.volumeInfo;
    return {
        id: item.id,
        title: info.title,
        authors: info.authors || ['Unknown'],
        description: info.description || '',
        thumbnail: getBestThumbnail(info.imageLinks) || (info.industryIdentifiers ? `https://covers.openlibrary.org/b/isbn/${info.industryIdentifiers[0].identifier}-L.jpg` : null),
        categories: info.categories || [],
        averageRating: info.averageRating || 0,
        ratingsCount: info.ratingsCount || 0,
        publishedDate: info.publishedDate || '',
        pageCount: info.pageCount || 0,
        publisher: info.publisher || '',
        language: info.language || 'en',
        previewLink: info.previewLink || '',
        maturityRating: info.maturityRating,
    };
};

exports.getPersonalizedRecommendations = async (req, res) => {
    try {
        const userId = req.user;
        // 1. Get user's read books
        const readBooks = await BookShelf.find({ userId, status: 'read' }).limit(3).sort({ updatedAt: -1 });

        if (readBooks.length === 0) {
            // Fallback to trending
            return exports.getTrendingBooks(req, res);
        }

        // 2. Build specific queries based on read books
        const queries = readBooks.map(book => {
            const author = book.authors?.[0] || '';
            const title = book.title.split(' ').slice(0, 3).join(' ');
            return `intitle:${title}+inauthor:${author}`;
        });

        // Add a general query based on categories of newest read book
        if (readBooks[0].categories?.length > 0) {
            queries.push(`subject:${readBooks[0].categories[0]}`);
        }

        const results = await Promise.all(
            queries.slice(0, 4).map(q =>
                axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=5&orderBy=relevance&key=${API_KEY}`).catch(() => ({ data: { items: [] } }))
            )
        );

        const readIds = new Set(readBooks.map(b => b.bookId));
        const seen = new Set();
        const recommendations = results
            .flatMap(r => r.data.items || [])
            .filter(item => {
                if (!item.volumeInfo?.imageLinks || readIds.has(item.id) || seen.has(item.id)) return false;
                seen.add(item.id);
                return true;
            })
            .slice(0, 12)
            .map(mapBook);

        res.json(recommendations);
    } catch (err) {
        console.error('Rec Error:', err);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
};

exports.searchBooks = async (req, res) => {
    try {
        const { q, type, genre, page = 1 } = req.query;
        let query = q || '';

        if (genre) query += `+subject:${genre}`;
        if (type === 'author') query = `inauthor:${q}`;
        if (type === 'title') query = `intitle:${q}`;

        const startIndex = (page - 1) * 20;
        const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&startIndex=${startIndex}&maxResults=20&orderBy=relevance&printType=books&langRestrict=en&key=${API_KEY}`;
        const response = await axios.get(url);

        const books = (response.data.items || [])
            .filter(item => item.volumeInfo?.imageLinks)
            .map(mapBook);

        res.json({ books, totalItems: response.data.totalItems });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getBookDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${API_KEY}`);
        res.json(mapBook(response.data));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTrendingBooks = async (req, res) => {
    try {
        const queries = [
            'bestseller 2024 fiction',
            'bestseller 2023 thriller',
            'popular 2024 romance novel',
        ];

        const results = await Promise.all(
            queries.map(q =>
                axios.get(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=6&orderBy=relevance&printType=books&langRestrict=en&key=${API_KEY}`)
            )
        );

        const seen = new Set();
        const books = results
            .flatMap(r => r.data.items || [])
            .filter(item => {
                if (!item.volumeInfo?.imageLinks || seen.has(item.id)) return false;
                seen.add(item.id);
                return true;
            })
            .slice(0, 12)
            .map(mapBook);

        res.json(books);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
