import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, Loader2 } from 'lucide-react';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';

const GENRES = ['Fiction', 'Science', 'History', 'Fantasy', 'Mystery', 'Romance', 'Technology', 'Biography'];
const FILTERS = ['All', 'New Releases', 'Classic', 'Highly Rated', 'Trending'];

const Discover = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [query, setQuery] = useState(searchParams.get('q') || '');
    const [genre, setGenre] = useState(searchParams.get('genre') || '');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => { fetchBooks(); }, [searchParams]);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const q = searchParams.get('q') || (searchParams.get('genre') ? '' : 'bestsellers');
            const g = searchParams.get('genre') || '';
            const response = await axios.get(`/api/books/search?q=${q}&genre=${g}`);
            setBooks(response.data.books || []);
        } catch (err) {
            console.error('Search error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: query, genre });
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', paddingTop: '6rem', paddingBottom: '5rem' }}>
            {/* Header */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 3rem', marginBottom: '3rem' }}>
                <p className="section-label" style={{ marginBottom: '0.5rem' }}>40M+ Titles</p>
                <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#f2ead8', marginBottom: '1rem' }}>
                    Discover Books
                </h1>
                <p style={{ color: '#7a7060', maxWidth: '500px', lineHeight: 1.7 }}>
                    Search through millions of titles. Use natural language — describe a mood, a theme, or an author.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 3rem', marginBottom: '2.5rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', maxWidth: '700px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5040' }} />
                        <input
                            className="input-cozy"
                            style={{ paddingLeft: '2.75rem', height: '50px' }}
                            placeholder='Search by title, author, or mood...'
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ borderRadius: '0.5rem', height: '50px', padding: '0 1.5rem' }}>
                        Search
                    </button>
                </form>
            </div>

            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 3rem', display: 'flex', gap: '2.5rem' }}>
                {/* Sidebar Filters */}
                <aside style={{ width: '220px', flexShrink: 0 }}>
                    <div style={{
                        backgroundColor: '#1e3424',
                        border: '1px solid rgba(90,144,96,0.12)',
                        borderRadius: '0.75rem',
                        padding: '1.5rem',
                        position: 'sticky',
                        top: '6rem',
                    }}>
                        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5040', marginBottom: '1.25rem' }}>
                            <SlidersHorizontal size={14} /> Filters
                        </h3>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5040', marginBottom: '0.75rem' }}>
                                Type
                            </p>
                            {FILTERS.map(f => (
                                <button
                                    key={f}
                                    onClick={() => setActiveFilter(f)}
                                    style={{
                                        display: 'block', width: '100%', textAlign: 'left',
                                        padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
                                        fontSize: '0.85rem', cursor: 'pointer',
                                        border: 'none', marginBottom: '0.25rem',
                                        backgroundColor: activeFilter === f ? 'rgba(201,134,58,0.12)' : 'transparent',
                                        color: activeFilter === f ? '#c9863a' : '#7a7060',
                                        fontFamily: "'Inter', sans-serif",
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div>
                            <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5040', marginBottom: '0.75rem' }}>
                                Genre
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                {GENRES.map(g => (
                                    <button
                                        key={g}
                                        onClick={() => { setGenre(g.toLowerCase()); setSearchParams({ q: query, genre: g.toLowerCase() }); }}
                                        style={{
                                            display: 'block', width: '100%', textAlign: 'left',
                                            padding: '0.5rem 0.75rem', borderRadius: '0.375rem',
                                            fontSize: '0.85rem', cursor: 'pointer',
                                            border: 'none',
                                            backgroundColor: genre === g.toLowerCase() ? 'rgba(201,134,58,0.12)' : 'transparent',
                                            color: genre === g.toLowerCase() ? '#c9863a' : '#7a7060',
                                            fontFamily: "'Inter', sans-serif",
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Results */}
                <main style={{ flex: 1 }}>
                    {loading ? (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
                            <Loader2 size={36} style={{ color: '#c9863a', animation: 'spin 1s linear infinite' }} />
                            <p style={{ color: '#5a5040' }}>Searching global collection...</p>
                        </div>
                    ) : books.length > 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: '1.5rem' }}
                        >
                            {books.map((book) => <BookCard key={book.id} book={book} />)}
                        </motion.div>
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: '5rem 2rem',
                            border: '2px dashed rgba(90,144,96,0.15)', borderRadius: '1rem',
                        }}>
                            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#3a3025', marginBottom: '0.5rem' }}>
                                No stories found.
                            </p>
                            <p style={{ color: '#5a5040' }}>Try a different search — describe a mood or theme.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Discover;
