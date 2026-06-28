import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BookCard from '../components/BookCard';

const Recommendations = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const fetchRecommendations = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};
            const res = await axios.get('/api/books/recommendations', { headers });
            setBooks(res.data);
        } catch (err) {
            console.error('Recommendations error:', err);
            setError('Could not load recommendations. Make sure you have books in your shelf.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={36} style={{ color: '#c9863a' }} className="animate-spin" />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', paddingTop: '6rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>

                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Sparkles size={18} style={{ color: '#c9863a' }} />
                        <p className="section-label">Personalized Picks</p>
                    </div>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.75rem', color: '#f2ead8', marginBottom: '0.75rem' }}>
                        Recommended for You
                    </h1>
                    <p style={{ color: '#b5a98a', fontSize: '1rem', maxWidth: '520px', lineHeight: 1.6 }}>
                        Books curated based on what you've read. The more you read, the smarter these picks get.
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div style={{
                        backgroundColor: '#1e3424', border: '1px solid rgba(201,134,58,0.2)',
                        borderRadius: '0.75rem', padding: '2rem', textAlign: 'center',
                    }}>
                        <p style={{ color: '#b5a98a', fontSize: '0.95rem' }}>{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!error && books.length === 0 && (
                    <div style={{
                        backgroundColor: '#1e3424', border: '1px solid rgba(90,144,96,0.15)',
                        borderRadius: '1rem', padding: '4rem 2rem', textAlign: 'center',
                    }}>
                        <Sparkles size={40} style={{ color: '#c9863a', margin: '0 auto 1.5rem' }} />
                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#f2ead8', marginBottom: '0.75rem' }}>
                            No recommendations yet
                        </h3>
                        <p style={{ color: '#b5a98a', fontSize: '0.9rem', maxWidth: '360px', margin: '0 auto' }}>
                            Start adding books to your shelf and marking them as "Read" to get personalized recommendations.
                        </p>
                    </div>
                )}

                {/* Books Grid */}
                {books.length > 0 && (
                    <motion.div
                        initial="hidden"
                        animate="show"
                        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                            gap: '1.5rem',
                        }}
                    >
                        {books.map((book) => (
                            <motion.div
                                key={book.id}
                                variants={{
                                    hidden: { opacity: 0, y: 25 },
                                    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
                                }}
                            >
                                <BookCard book={book} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
