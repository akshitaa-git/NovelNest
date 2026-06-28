import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import BookCard from '../components/BookCard';

/* ── Genre Grid ── */
const GENRES = [
    { name: 'Fantasy', emoji: '🧙' },
    { name: 'Mystery', emoji: '🔍' },
    { name: 'Science Fiction', emoji: '🚀' },
    { name: 'Romance', emoji: '🌹' },
    { name: 'Thriller', emoji: '🔪' },
    { name: 'Biography', emoji: '📜' },
    { name: 'History', emoji: '🏛️' },
    { name: 'Self-Help', emoji: '✨' },
];

/* ── Testimonial mock ── */
const TESTIMONIALS = [
    { quote: 'Found my favorite read of the decade here.', author: 'Clara V.', role: 'Bibliophile' },
    { quote: 'BookNest knows what I want before I do.', author: 'Rohan M.', role: 'Weekly reader' },
    { quote: 'The coziest corner of the internet.', author: 'Sophie L.', role: 'Book blogger' },
];

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [featuredBooks, setFeaturedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [testimonialIdx, setTestimonialIdx] = useState(0);
    const navigate = useNavigate();
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef });
    const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);

    useEffect(() => {
        fetchData();
        const t = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
        return () => clearInterval(t);
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = token ? { Authorization: `Bearer ${token}` } : {};

            const [trendingRes, featuredRes] = await Promise.all([
                axios.get('/api/books/trending'),
                axios.get('/api/books/recommendations', { headers }),
            ]);
            setTrending(trendingRes.data.slice(0, 8));
            setFeaturedBooks(featuredRes.data.slice(0, 8));
        } catch (err) {
            console.error('Home fetch error:', err);
            // Fallback for featured if token fails or no read books
            try {
                const fallback = await axios.get('/api/books/search?q=popular+fiction');
                setFeaturedBooks(fallback.data.books?.slice(0, 8) || []);
            } catch (e) { }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#162a19', minHeight: '100vh' }}>

            {/* ════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════ */}
            <section
                ref={heroRef}
                style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center' }}
            >
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    background: 'radial-gradient(ellipse at 50% 0%, rgba(201,134,58,0.07) 0%, transparent 60%)',
                }} />

                <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', zIndex: 1,
                    background: 'linear-gradient(to top, rgba(201,134,58,0.04) 0%, transparent 100%)',
                    pointerEvents: 'none',
                }} />

                <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full" style={{ zIndex: 10, position: 'relative' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
                        {/* Left — Copy */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            style={{ paddingTop: '6rem' }}
                        >
                            <p className="section-label" style={{ marginBottom: '1.5rem' }}>
                                Your Personal Library
                            </p>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(3rem, 7vw, 5rem)', fontWeight: 500, color: '#f2ead8', lineHeight: 1, marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
                                Where every
                                <br />
                                reader finds
                                <br />
                                <span style={{ fontStyle: 'italic', fontWeight: 600, color: '#c9863a' }}>a home.</span>
                            </h1>
                            <p style={{ color: '#b5a98a', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '440px', marginBottom: '2.5rem' }}>
                                Discover stories that linger. NovelNest is a curated sanctuary for the curious mind, connecting you with your next obsession through soulful recommendations.
                            </p>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                <div style={{ display: 'flex' }}>
                                    {['#c9863a', '#5a9060', '#7a7060'].map((c, i) => (
                                        <div key={i} style={{
                                            width: '36px', height: '36px', borderRadius: '50%',
                                            background: c, border: '2px solid #162a19',
                                            marginLeft: i > 0 ? '-10px' : 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.7rem', color: '#f2ead8', fontWeight: 600,
                                        }}>
                                            {['JD', 'ML', '+4k'][i]}
                                        </div>
                                    ))}
                                </div>
                                <Link to="/auth" style={{ color: '#c9863a', fontSize: '0.85rem', fontWeight: 500, textDecoration: 'none' }}>
                                    Join 4,200+ readers online today →
                                </Link>
                            </div>

                            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                                <Link to="/discover" className="btn-primary" style={{ padding: '0.85rem 2.25rem' }}>Start Discovering</Link>
                            </div>
                        </motion.div>

                        {/* Right — Cozy book image */}
                        <motion.div
                            initial={{ opacity: 0, x: 40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                            style={{ position: 'relative', paddingTop: '5rem' }}
                        >
                            <motion.div
                                style={{
                                    borderRadius: '1rem',
                                    overflow: 'hidden',
                                    y: heroImageY,
                                    boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                                    border: '1px solid rgba(90,144,96,0.15)',
                                }}
                            >
                                <img
                                    src="/hero-books-shelf.jpg"
                                    alt="Cozy library shelf"
                                    style={{ width: '100%', height: '620px', objectFit: 'cover', display: 'block' }}
                                />
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: 'linear-gradient(to bottom right, rgba(201,134,58,0.06), rgba(13,26,15,0.3))',
                                    borderRadius: '1rem',
                                }} />
                            </motion.div>

                            <motion.div
                                key={testimonialIdx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5 }}
                                style={{
                                    position: 'absolute',
                                    bottom: '2rem',
                                    left: '-2rem',
                                    backgroundColor: '#1e3424',
                                    border: '1px solid rgba(90,144,96,0.2)',
                                    borderRadius: '0.875rem',
                                    padding: '1.25rem 1.5rem',
                                    maxWidth: '260px',
                                    boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                                }}
                            >
                                <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', color: '#f2ead8', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '0.75rem' }}>
                                    "{TESTIMONIALS[testimonialIdx].quote}"
                                </p>
                                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c9863a' }}>
                                    — {TESTIMONIALS[testimonialIdx].author}, {TESTIMONIALS[testimonialIdx].role}
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>


            {/* ════════════════════════════════════
          RECOMMENDED FOR YOU
          ════════════════════════════════════ */}
            {featuredBooks.length > 0 && (
                <section style={{ padding: '5rem 0', borderTop: '1px solid rgba(90,144,96,0.1)' }}>
                    <div className="max-w-7xl mx-auto px-6 lg:px-12">
                        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem' }}>
                            <div>
                                <p className="section-label" style={{ marginBottom: '0.5rem' }}>Based on Your Reading</p>
                                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', color: '#f2ead8', lineHeight: 1.2 }}>
                                    Recommended for You
                                </h2>
                            </div>
                            <Link to="/shelf" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                Your Shelf <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div style={{
                            display: 'flex', gap: '1.25rem', overflowX: 'auto', paddingBottom: '1rem',
                            scrollbarWidth: 'thin', scrollbarColor: 'rgba(201,134,58,0.3) transparent',
                        }}>
                            {featuredBooks.map((book, i) => (
                                <motion.div
                                    key={book.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    style={{ minWidth: '180px', maxWidth: '180px', flexShrink: 0 }}
                                >
                                    <BookCard book={book} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════════
          POPULAR GENRES
          ════════════════════════════════════ */}
            <section style={{ padding: '6rem 0' }}>
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <p className="section-label" style={{ marginBottom: '0.5rem' }}>Explore by Mood</p>
                        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', color: '#f2ead8' }}>
                            Popular Genres
                        </h2>
                    </div>
                    <div className="genre-grid">
                        {GENRES.map((genre) => (
                            <Link
                                key={genre.name}
                                to={`/discover?genre=${genre.name.toLowerCase().replace(' ', '+')}`}
                                className="card-book"
                                style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    justifyContent: 'center', padding: '2.5rem 1.5rem',
                                    backgroundColor: '#1e3424', gap: '1rem',
                                }}
                            >
                                <span style={{ fontSize: '2.5rem' }}>{genre.emoji}</span>
                                <span style={{ fontFamily: "'Playfair Display', serif", color: '#f2ead8', fontSize: '1.1rem' }}>
                                    {genre.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════
          BOTTOM CTA
          ════════════════════════════════════ */}
            <section style={{
                padding: '7rem 0',
                textAlign: 'center',
                borderTop: '1px solid rgba(90,144,96,0.12)',
                background: 'radial-gradient(ellipse at 50% 0%, rgba(201,134,58,0.06) 0%, transparent 60%)',
            }}>
                <div className="max-w-2xl mx-auto px-6">
                    <p className="section-label" style={{ marginBottom: '1rem' }}>Start Your Journey</p>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#f2ead8', marginBottom: '1.5rem', lineHeight: 1.15 }}>
                        Your next favorite book is waiting.
                    </h2>
                    <p style={{ color: '#b5a98a', fontSize: '1rem', marginBottom: '2.5rem', lineHeight: 1.75 }}>
                        Join a community of readers who've found their home in NovelNest. Track what you read, discover what's next, and let AI guide you.
                    </p>
                    <Link to="/auth" className="btn-primary" style={{ fontSize: '1rem', padding: '1rem 2.5rem' }}>
                        Join for Free
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;
