import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const BookCard = ({ book, onAdd, added }) => {
    return (
        <motion.div
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            className="card-book"
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        >
            <Link to={`/book/${book.id}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Cover */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden', borderRadius: '0.75rem 0.75rem 0 0' }}>
                    <img
                        src={book.thumbnail || 'https://via.placeholder.com/200x300/132016/c9863a?text=BookNest'}
                        alt={book.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                        onMouseEnter={e => e.target.style.transform = 'scale(1.06)'}
                        onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                    />
                    {/* Gradient overlay */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(13,26,15,0.95) 0%, rgba(13,26,15,0.3) 40%, transparent 70%)',
                    }} />
                    {/* Rating badge */}
                    {book.averageRating > 0 && (
                        <div style={{
                            position: 'absolute', top: '0.6rem', right: '0.6rem',
                            backgroundColor: 'rgba(13,26,15,0.85)',
                            border: '1px solid rgba(201,134,58,0.35)',
                            borderRadius: '0.4rem',
                            padding: '0.2rem 0.5rem',
                            display: 'flex', alignItems: 'center', gap: '0.25rem',
                        }}>
                            <Star size={11} fill="#c9863a" color="#c9863a" />
                            <span style={{ fontSize: '0.7rem', color: '#f2ead8', fontWeight: 600 }}>{book.averageRating}</span>
                        </div>
                    )}
                    {/* Add button */}
                    {onAdd && (
                        <button
                            onClick={e => { e.preventDefault(); onAdd(book); }}
                            style={{
                                position: 'absolute', bottom: '0.6rem', right: '0.6rem',
                                width: '32px', height: '32px',
                                backgroundColor: added ? '#3a6640' : '#c9863a',
                                border: 'none', borderRadius: '50%', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#f2ead8', transition: 'all 0.2s',
                            }}
                        >
                            <Plus size={16} />
                        </button>
                    )}
                </div>

                {/* Info */}
                <div style={{ padding: '0.875rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    {book.categories?.[0] && (
                        <p className="genre-tag">{book.categories[0]}</p>
                    )}
                    <h3
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            color: '#f2ead8',
                            lineHeight: 1.3,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {book.title}
                    </h3>
                    <p style={{ fontSize: '0.78rem', color: '#b5a98a', marginTop: '0.15rem' }}>
                        {book.authors?.join(', ')}
                    </p>
                    {book.publishedDate && (
                        <p style={{ fontSize: '0.72rem', color: '#9a9080', marginTop: '0.25rem' }}>
                            {book.publishedDate}
                        </p>
                    )}
                </div>
            </Link>
        </motion.div>
    );
};

export default BookCard;
