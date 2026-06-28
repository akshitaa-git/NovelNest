import React, { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader2, Globe } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
    { quote: '"Not all those who wander are lost."', attr: '— J.R.R. Tolkien' },
    { quote: '"A reader lives a thousand lives before he dies."', attr: '— George R.R. Martin' },
    { quote: '"There is no friend as loyal as a book."', attr: '— Ernest Hemingway' },
];

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const { login, signup, googleLogin } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [quoteIdx] = useState(Math.floor(Math.random() * QUOTES.length));

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true);
            try {
                await googleLogin(tokenResponse.access_token);
                toast.success('Signed in with Google!');
                navigate('/');
            } catch (err) {
                console.error('Backend Google Auth Error:', err);
                toast.error('Server authentication failed.');
            } finally {
                setLoading(false);
            }
        },
        onError: (error) => {
            console.error('Google OAuth Error:', error);
            toast.error('Google login failed.');
        },
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Welcome back!');
            } else {
                await signup(formData);
                toast.success('Welcome to BookNest!');
            }
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Authentication failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%', paddingLeft: '2.75rem', paddingRight: '1rem',
        paddingTop: '0.875rem', paddingBottom: '0.875rem',
        backgroundColor: '#1e3424',
        border: '1px solid rgba(90,144,96,0.25)',
        borderRadius: '0.5rem', color: '#f2ead8',
        fontFamily: "'Inter', sans-serif", fontSize: '0.9rem',
        outline: 'none', transition: 'all 0.3s', boxSizing: 'border-box',
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr', backgroundColor: '#162a19' }}>
            {/* LEFT — Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 4rem', position: 'relative' }}>

                <motion.div
                    key={isLogin ? 'login' : 'signup'}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    style={{ width: '100%', maxWidth: '400px' }}
                >
                    <div style={{ marginBottom: '2.5rem' }}>
                        <p className="section-label" style={{ marginBottom: '0.75rem' }}>
                            {isLogin ? 'Welcome back' : 'Join the club'}
                        </p>
                        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#f2ead8', fontWeight: 700, lineHeight: 1.15 }}>
                            {isLogin ? 'Sign in to your library.' : 'Create your reading home.'}
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7060', marginBottom: '0.5rem' }}>
                                        Full Name
                                    </label>
                                    <div style={{ position: 'relative' }}>
                                        <User size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5040' }} />
                                        <input
                                            type="text"
                                            style={inputStyle}
                                            placeholder="Your name"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            required={!isLogin}
                                            onFocus={e => { e.target.style.borderColor = 'rgba(201,134,58,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,134,58,0.08)'; }}
                                            onBlur={e => { e.target.style.borderColor = 'rgba(90,144,96,0.25)'; e.target.style.boxShadow = 'none'; }}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7060', marginBottom: '0.5rem' }}>
                                Email address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5040' }} />
                                <input
                                    type="email"
                                    style={inputStyle}
                                    placeholder="your@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    onFocus={e => { e.target.style.borderColor = 'rgba(201,134,58,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,134,58,0.08)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(90,144,96,0.25)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a7060' }}>
                                    Password
                                </label>
                                {isLogin && <a href="#" style={{ fontSize: '0.75rem', color: '#c9863a', textDecoration: 'none' }}>Forgot?</a>}
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#5a5040' }} />
                                <input
                                    type="password"
                                    style={inputStyle}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    onFocus={e => { e.target.style.borderColor = 'rgba(201,134,58,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(201,134,58,0.08)'; }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(90,144,96,0.25)'; e.target.style.boxShadow = 'none'; }}
                                />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', height: '52px', fontSize: '0.95rem', borderRadius: '0.5rem', marginTop: '0.25rem', opacity: loading ? 0.7 : 1 }}>
                            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
                            {isLogin ? 'Sign In' : 'Create Account'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                    </form>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0' }}>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(90,144,96,0.15)' }} />
                        <span style={{ fontSize: '0.75rem', color: '#5a5040', fontWeight: 500 }}>or</span>
                        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(90,144,96,0.15)' }} />
                    </div>

                    <button
                        onClick={() => handleGoogleLogin()}
                        disabled={loading}
                        style={{ width: '100%', padding: '0.875rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', backgroundColor: '#1e3424', border: '1px solid rgba(90,144,96,0.2)', borderRadius: '0.5rem', color: '#f2ead8', fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', cursor: 'pointer', transition: 'all 0.2s', opacity: loading ? 0.7 : 1 }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(201,134,58,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(90,144,96,0.2)'}
                    >
                        <Globe size={18} style={{ color: '#c9863a' }} />
                        Continue with Google
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.85rem', color: '#5a5040' }}>
                        {isLogin ? "Don't have an account? " : 'Already a member? '}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            style={{ color: '#c9863a', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}
                        >
                            {isLogin ? 'Join the club' : 'Sign in'}
                        </button>
                    </p>
                </motion.div>
            </div>

            {/* RIGHT — Quote & Imagery */}
            <div style={{
                position: 'relative', overflow: 'hidden',
                background: 'linear-gradient(135deg, #1e3424 0%, #162a19 100%)',
                display: 'flex', alignItems: 'flex-end', padding: '4rem',
                borderLeft: '1px solid rgba(90,144,96,0.12)',
            }}>
                <img
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=700&q=80"
                    alt="Library"
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.2 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #162a19 35%, transparent 70%)' }} />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    style={{ position: 'relative', zIndex: 10 }}
                >
                    <div style={{ width: '3rem', height: '2px', backgroundColor: '#c9863a', marginBottom: '1.5rem' }} />
                    <p style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontSize: '2rem', color: '#f2ead8', lineHeight: 1.35, marginBottom: '1rem', maxWidth: '380px' }}>
                        {QUOTES[quoteIdx].quote}
                    </p>
                    <p style={{ color: '#c9863a', fontSize: '0.85rem', fontWeight: 500, letterSpacing: '0.05em' }}>
                        {QUOTES[quoteIdx].attr}
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default Auth;
