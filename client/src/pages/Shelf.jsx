import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Library, BookMarked, Bookmark, Trash2, Search, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Shelf = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('want-to-read');
    const [filterQuery, setFilterQuery] = useState('');

    useEffect(() => { fetchShelf(); }, []);

    const fetchShelf = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/shelf');
            setBooks(response.data);
        } catch (err) {
            toast.error('Failed to load shelf');
        } finally {
            setLoading(false);
        }
    };

    const removeFromShelf = async (bookId) => {
        try {
            await axios.delete(`/api/shelf/${bookId}`);
            setBooks(books.filter(b => b.bookId !== bookId));
            toast.success('Removed from shelf');
        } catch (err) {
            toast.error('Failed to remove');
        }
    };

    const filteredBooks = books
        .filter(b => b.status === activeTab)
        .filter(b => (b.title || '').toLowerCase().includes(filterQuery.toLowerCase()));

    const tabStyle = (tab) => ({
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.625rem 1.25rem', borderRadius: '9999px',
        fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none',
        fontFamily: "'Inter', sans-serif",
        backgroundColor: activeTab === tab ? '#c9863a' : 'transparent',
        color: activeTab === tab ? '#f7f0e0' : '#7a7060',
        transition: 'all 0.25s',
    });

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', paddingTop: '6rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 3rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
                    <div>
                        <p className="section-label" style={{ marginBottom: '0.5rem' }}>My Collection</p>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#f2ead8' }}>
                            My Library
                        </h1>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5040' }} />
                        <input
                            className="input-cozy"
                            style={{ paddingLeft: '2.5rem', width: '260px', height: '44px' }}
                            placeholder="Search your shelf..."
                            value={filterQuery}
                            onChange={e => setFilterQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', padding: '0.375rem', backgroundColor: '#1e3424', borderRadius: '9999px', width: 'fit-content', border: '1px solid rgba(90,144,96,0.12)' }}>
                    <button style={tabStyle('want-to-read')} onClick={() => setActiveTab('want-to-read')}>
                        <Bookmark size={16} /> Want to Read
                    </button>
                    <button style={tabStyle('read')} onClick={() => setActiveTab('read')}>
                        <BookMarked size={16} /> Read
                    </button>
                </div>

                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.5rem' }}>
                        {Array(6).fill(0).map((_, i) => (
                            <div key={i} style={{ aspectRatio: '2/3', borderRadius: '0.75rem', backgroundColor: '#1e3424', opacity: 0.6 }} />
                        ))}
                    </div>
                ) : filteredBooks.length > 0 ? (
                    <motion.div layout style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.5rem' }}>
                        <AnimatePresence>
                            {filteredBooks.map((book) => (
                                <motion.div
                                    key={book.bookId}
                                    layout
                                    initial={{ opacity: 0, scale: 0.92 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.92 }}
                                    style={{
                                        backgroundColor: '#1e3424',
                                        border: '1px solid rgba(90,144,96,0.12)',
                                        borderRadius: '0.75rem',
                                        overflow: 'hidden',
                                        position: 'relative',
                                    }}
                                    className="group"
                                >
                                    <div style={{ aspectRatio: '2/3', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={book.thumbnail || 'https://via.placeholder.com/200x300/132016/c9863a?text=BookNest'}
                                            alt={book.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,26,15,0.9) 0%, transparent 50%)' }} />
                                        <button
                                            onClick={() => removeFromShelf(book.bookId)}
                                            style={{
                                                position: 'absolute', top: '0.6rem', right: '0.6rem',
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                backgroundColor: 'rgba(220,38,38,0.85)', border: 'none',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: 'white', transition: 'opacity 0.2s',
                                            }}
                                        >
                                            <Trash2 size={15} />
                                        </button>
                                    </div>
                                    <div style={{ padding: '0.875rem' }}>
                                        <Link to={`/book/${book.bookId}`} style={{ textDecoration: 'none' }}>
                                            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f2ead8', fontSize: '0.9rem', lineHeight: 1.3, marginBottom: '0.25rem' }}>
                                                {book.title}
                                            </h3>
                                            <p style={{ fontSize: '0.75rem', color: '#5a5040' }}>{book.authors?.join(', ')}</p>
                                        </Link>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', alignItems: 'center' }}>
                                            <span style={{ fontSize: '0.7rem', color: '#b5a98a' }}>{new Date(book.addedDate).toLocaleDateString()}</span>
                                            {book.rating > 0 && (
                                                <div style={{ display: 'flex', gap: '1px' }}>
                                                    {Array(5).fill(0).map((_, i) => (
                                                        <Star key={i} size={10} fill={i < book.rating ? '#c9863a' : 'none'} color="#c9863a" />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <div style={{
                        textAlign: 'center', padding: '6rem 2rem',
                        border: '2px dashed rgba(90,144,96,0.12)', borderRadius: '1rem',
                    }}>
                        <Library size={48} style={{ color: '#3a3025', margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#3a3025', marginBottom: '0.5rem' }}>
                            Your shelf awaits.
                        </h3>
                        <p style={{ color: '#3a3025', marginBottom: '2rem' }}>Start exploring and add some stories to your collection.</p>
                        <Link to="/discover" className="btn-primary">Explore Books</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Shelf;
