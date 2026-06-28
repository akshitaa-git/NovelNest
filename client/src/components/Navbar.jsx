import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'CURATIONS', path: '/discover' },
        { name: 'THE SHELF', path: '/shelf' },
    ];

    return (
        <nav
            className="fixed top-0 w-full z-50 transition-all duration-500"
            style={{
                backgroundColor: isScrolled ? 'rgba(13, 26, 15, 0.97)' : 'transparent',
                backdropFilter: isScrolled ? 'blur(12px)' : 'none',
                borderBottom: isScrolled ? '1px solid rgba(90, 144, 96, 0.12)' : 'none',
                padding: isScrolled ? '0.75rem 0' : '1rem 0',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span
                        style={{
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 700,
                            fontSize: '1.5rem',
                            color: '#c9863a',
                            letterSpacing: '-0.02em',
                        }}
                    >
                        NovelNest
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className="nav-link"
                            style={{
                                color: location.pathname === link.path ? '#f2ead8' : '#b5a98a',
                            }}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="hidden md:flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <Link to="/profile" className="flex items-center gap-2 group">
                                <img
                                    src={user.profilePicture}
                                    alt={user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                    style={{ border: '2px solid #c9863a' }}
                                />
                                <span style={{ color: '#b5a98a', fontSize: '0.8rem', fontWeight: 500 }}>
                                    {user.name.split(' ')[0]}
                                </span>
                            </Link>
                            <button
                                onClick={logout}
                                className="nav-link"
                                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                                LOG OUT
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/auth"
                                className="nav-link"
                                style={{ color: '#b5a98a' }}
                            >
                                Log In
                            </Link>
                            <Link to="/auth" className="btn-primary" style={{ fontSize: '0.8rem', padding: '0.6rem 1.4rem' }}>
                                Join the Club
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile toggle */}
                <button
                    className="md:hidden"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    style={{ color: '#f2ead8', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ backgroundColor: '#162a19', borderTop: '1px solid rgba(90,144,96,0.15)' }}
                        className="md:hidden px-6 pb-6"
                    >
                        <div className="flex flex-col gap-5 pt-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="nav-link text-left"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user ? (
                                <>
                                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="nav-link">MY PROFILE</Link>
                                    <button onClick={() => { logout(); setIsMenuOpen(false); }} className="nav-link text-left" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>LOG OUT</button>
                                </>
                            ) : (
                                <Link to="/auth" onClick={() => setIsMenuOpen(false)} className="btn-primary text-center" style={{ width: 'fit-content' }}>
                                    Join the Club
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
