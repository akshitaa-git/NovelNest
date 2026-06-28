import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Star, BookOpen, Clock, Globe, MessageSquare, Sparkles, Loader2, Plus, Check, ChevronLeft, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const BookDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [aiSummary, setAiSummary] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState({ rating: 5, content: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const [shelfStatus, setShelfStatus] = useState(null);

    useEffect(() => {
        fetchBookData();
        fetchReviews();
        if (user) checkShelfStatus();
    }, [id, user]);

    const fetchBookData = async () => {
        try {
            const response = await axios.get(`/api/books/${id}`);
            setBook(response.data);
        } catch (err) {
            toast.error('Failed to load book details');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/reviews/${id}`);
            setReviews(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const checkShelfStatus = async () => {
        try {
            const response = await axios.get(`/api/shelf`);
            const entry = response.data.find(b => b.bookId === id);
            if (entry) setShelfStatus(entry.status);
        } catch (err) {
            console.error(err);
        }
    };

    const generateAISummary = async () => {
        setLoadingAI(true);
        try {
            const response = await axios.post('/api/ai/summary', {
                title: book.title,
                author: book.authors[0]
            });
            setAiSummary(response.data.summary);
        } catch (err) {
            toast.error('AI Summary generation failed');
        } finally {
            setLoadingAI(false);
        }
    };

    const addToShelf = async (status) => {
        if (!user) return toast.error('Please login to save books');
        try {
            await axios.post('/api/shelf', {
                bookId: id,
                status,
                title: book.title,
                authors: book.authors,
                thumbnail: book.thumbnail
            });
            setShelfStatus(status);
            toast.success(`Added to ${status.replace(/-/g, ' ')}`);
        } catch (err) {
            toast.error('Failed to update shelf');
        }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        if (!user) return toast.error('Please login to review');
        setSubmittingReview(true);
        try {
            await axios.post('/api/reviews', {
                bookId: id,
                rating: userReview.rating,
                content: userReview.content
            });
            toast.success('Review submitted');
            setUserReview({ rating: 5, content: '' });
            fetchReviews();
        } catch (err) {
            toast.error('Failed to submit review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={40} style={{ color: '#c9863a' }} className="animate-spin" />
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', paddingTop: '6rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>

                {/* Back Link */}
                <Link to="/discover" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#7a7060', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '3rem', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.target.style.color = '#f2ead8'}
                    onMouseLeave={e => e.target.style.color = '#7a7060'}
                >
                    <ChevronLeft size={18} /> Back to Library
                </Link>

                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '5rem', alignItems: 'start' }}>

                    {/* Left Column: Cover & Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ position: 'sticky', top: '8rem' }}
                    >
                        <div style={{
                            borderRadius: '1rem',
                            overflow: 'hidden',
                            boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
                            border: '1px solid rgba(90, 144, 96, 0.15)',
                            marginBottom: '2.5rem'
                        }}>
                            <img src={book.thumbnail} alt={book.title} style={{ width: '100%', height: 'auto', display: 'block' }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <button
                                onClick={() => addToShelf(shelfStatus === 'want-to-read' ? 'read' : 'want-to-read')}
                                className={shelfStatus ? 'btn-outline' : 'btn-primary'}
                                style={{ width: '100%', height: '56px', fontSize: '0.95rem' }}
                            >
                                {shelfStatus === 'want-to-read' ? (
                                    <><Check size={20} /> On your shelf</>
                                ) : (
                                    <><Plus size={20} /> Add to shelf</>
                                )}
                            </button>

                            <button
                                onClick={() => addToShelf('read')}
                                style={{
                                    width: '100%', padding: '0.75rem', border: '1px solid rgba(90, 144, 96, 0.2)',
                                    borderRadius: '0.75rem', background: 'transparent', color: '#b5a98a',
                                    fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = '#c9863a'; e.currentTarget.style.color = '#f2ead8'; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(90, 144, 96, 0.2)'; e.currentTarget.style.color = '#b5a98a'; }}
                            >
                                Mark as Read
                            </button>
                        </div>
                    </motion.div>

                    {/* Right Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                {book.categories?.map(cat => (
                                    <span key={cat} className="genre-tag" style={{ background: 'rgba(201, 134, 58, 0.1)', padding: '0.3rem 0.75rem', borderRadius: '4px' }}>
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            <h1 style={{
                                fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                                fontWeight: 700, color: '#f2ead8', lineHeight: 1.1, marginBottom: '1rem',
                                letterSpacing: '-0.01em'
                            }}>
                                {book.title}
                            </h1>

                            <p style={{ fontSize: '1.25rem', color: '#c9863a', fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontWeight: 500 }}>
                                by <span style={{ fontWeight: 600 }}>{book.authors?.join(', ')}</span>
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div style={{
                            display: 'flex', gap: '3rem', py: '2rem',
                            borderTop: '1px solid rgba(90, 144, 96, 0.12)',
                            borderBottom: '1px solid rgba(90, 144, 96, 0.12)',
                            marginBottom: '3rem', padding: '1.5rem 0'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star style={{ color: '#c9863a' }} fill="#c9863a" size={18} />
                                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f2ead8' }}>{book.averageRating || 'N/A'}</span>
                                <span style={{ fontSize: '0.8rem', color: '#5a5040' }}>({book.ratingsCount || 0} reviews)</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BookOpen style={{ color: '#5a9060' }} size={18} />
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f2ead8' }}>{book.pageCount || 'N/A'} Pages</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock style={{ color: '#5a9060' }} size={18} />
                                <span style={{ fontSize: '1rem', fontWeight: 600, color: '#f2ead8' }}>{new Date(book.publishedDate).getFullYear()}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ marginBottom: '4rem' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#f2ead8', marginBottom: '1.5rem' }}>The Story</h3>
                            <div
                                style={{ color: '#b5a98a', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}
                                dangerouslySetInnerHTML={{ __html: book.description }}
                            />
                        </div>

                        {/* AI Summary Box */}
                        <div style={{
                            backgroundColor: '#1e3424',
                            borderRadius: '1.5rem',
                            padding: '2.5rem',
                            border: '1px solid rgba(90, 144, 96, 0.2)',
                            position: 'relative',
                            overflow: 'hidden',
                            marginBottom: '4rem'
                        }}>
                            {/* Background Glow */}
                            <div style={{
                                position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px',
                                background: 'radial-gradient(circle, rgba(201, 134, 58, 0.1) 0%, transparent 70%)',
                                pointerEvents: 'none'
                            }} />

                            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <Sparkles style={{ color: '#c9863a' }} size={24} />
                                        <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#f2ead8', margin: 0 }}>AI Reading Assistant</h3>
                                    </div>
                                    <button
                                        onClick={generateAISummary}
                                        disabled={loadingAI}
                                        style={{
                                            padding: '0.625rem 1.25rem', borderRadius: '9999px',
                                            backgroundColor: 'rgba(201, 134, 58, 0.1)', color: '#c9863a',
                                            border: '1px solid rgba(201, 134, 58, 0.3)', fontWeight: 600,
                                            fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s',
                                            display: 'flex', alignItems: 'center', gap: '0.5rem'
                                        }}
                                        onMouseEnter={e => { e.target.style.backgroundColor = '#c9863a'; e.target.style.color = '#f7f0e0'; }}
                                        onMouseLeave={e => { e.target.style.backgroundColor = 'rgba(201, 134, 58, 0.1)'; e.target.style.color = '#c9863a'; }}
                                    >
                                        {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                                        Generate Summary
                                    </button>
                                </div>

                                <p style={{ color: '#7a7060', fontSize: '0.95rem', lineHeight: 1.6 }}>
                                    Curious about the prose style or pacing? Our AI can summarize the essence of this book in a single soulful paragraph.
                                </p>

                                <AnimatePresence>
                                    {aiSummary && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            style={{ borderLeft: '3px solid #c9863a', paddingLeft: '1.5rem', marginTop: '0.5rem' }}
                                        >
                                            <p style={{ color: '#f2ead8', fontStyle: 'italic', fontSize: '1.1rem', lineHeight: 1.7, margin: 0 }}>
                                                "{aiSummary}"
                                            </p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Reviews Section */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '4rem' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <MessageSquare style={{ color: '#c9863a' }} size={24} />
                                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#f2ead8', margin: 0 }}>Reader Reviews</h3>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    {reviews.length > 0 ? reviews.map(review => (
                                        <div key={review._id} style={{
                                            backgroundColor: '#1e3424', padding: '1.75rem', borderRadius: '1rem',
                                            border: '1px solid rgba(90, 144, 96, 0.1)'
                                        }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <img src={review.userId.profilePicture} style={{ width: '32px', height: '32px', borderRadius: '50%' }} alt="" />
                                                    <div>
                                                        <h4 style={{ color: '#f2ead8', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>{review.userId.name}</h4>
                                                        <div style={{ display: 'flex', gap: '2px' }}>
                                                            {Array(5).fill(0).map((_, i) => (
                                                                <Star key={i} size={10} fill={i < review.rating ? '#c9863a' : 'none'} color="#c9863a" />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '0.7rem', color: '#5a5040' }}>{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p style={{ color: '#b5a98a', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>{review.content}</p>
                                        </div>
                                    )) : (
                                        <div style={{
                                            padding: '3rem', textAlign: 'center', border: '1px dashed rgba(90, 144, 96, 0.15)', borderRadius: '1rem'
                                        }}>
                                            <p style={{ color: '#5a5040', fontStyle: 'italic' }}>No reviews yet. Be the first to share your thoughts.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review Form */}
                            <div>
                                <div style={{
                                    backgroundColor: '#1e3424', padding: '2rem', borderRadius: '1.5rem',
                                    border: '1px solid rgba(90, 144, 96, 0.15)', position: 'sticky', top: '8rem'
                                }}>
                                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.35rem', color: '#f2ead8', marginBottom: '1.5rem' }}>Share your thoughts</h4>

                                    <form onSubmit={submitReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#c9863a', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Rating</label>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                {[1, 2, 3, 4, 5].map(num => (
                                                    <button
                                                        key={num}
                                                        type="button"
                                                        onClick={() => setUserReview({ ...userReview, rating: num })}
                                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', transition: 'transform 0.2s' }}
                                                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.2)'}
                                                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                                    >
                                                        <Star fill={userReview.rating >= num ? '#c9863a' : 'none'} color="#c9863a" size={24} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', color: '#c9863a', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Review Content</label>
                                            <textarea
                                                style={{
                                                    width: '100%', height: '140px', backgroundColor: '#162a19',
                                                    border: '1px solid rgba(90, 144, 96, 0.2)', borderRadius: '0.75rem',
                                                    padding: '1rem', color: '#f2ead8', fontFamily: "'Inter', sans-serif",
                                                    fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'none'
                                                }}
                                                placeholder="What did you think of this story?"
                                                value={userReview.content}
                                                onChange={(e) => setUserReview({ ...userReview, content: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={submittingReview}
                                            className="btn-primary"
                                            style={{ width: '100%', height: '50px', fontSize: '0.9rem' }}
                                        >
                                            {submittingReview ? <Loader2 size={18} className="animate-spin" /> : 'Post Review'}
                                        </button>
                                    </form>
                                </div>
                            </div>

                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default BookDetails;
