import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { User, Mail, Star, BookOpen, Heart, Settings, Loader2, Award, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ read: 0, wantToRead: 0, avgRating: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await axios.get('/api/analytics');
            setStats({
                read: response.data.totalRead,
                wantToRead: response.data.totalWantToRead,
                avgRating: response.data.avgRating
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', paddingTop: '6rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>

                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '5rem', alignItems: 'start' }}>

                    {/* Left Column: Profile Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3rem' }}
                    >
                        <div style={{ position: 'relative' }}>
                            <div style={{
                                width: '180px', height: '180px', borderRadius: '50%',
                                padding: '4px', border: '3px solid #c9863a',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.4)', overflow: 'hidden'
                            }}>
                                <img src={user.profilePicture} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                            </div>
                            <button style={{
                                position: 'absolute', bottom: '8px', right: '8px',
                                width: '44px', height: '44px', borderRadius: '50%',
                                backgroundColor: '#c9863a', border: 'none', color: '#f7f0e0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                            }}>
                                <Settings size={20} />
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#f2ead8', margin: 0 }}>{user.name}</h1>
                            <p style={{ color: '#b5a98a', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <Mail size={14} /> {user.email}
                            </p>
                        </div>

                        <div style={{
                            width: '100%', backgroundColor: '#1e3424', padding: '2rem', borderRadius: '1.25rem',
                            border: '1px solid rgba(90, 144, 96, 0.12)'
                        }}>
                            <p className="section-label" style={{ marginBottom: '1.25rem' }}>Curator Preferences</p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: '#5a5040', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Favorite Genres</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {['Fantasy', 'Mystery', 'History', 'Classics'].map(g => (
                                            <span key={g} style={{
                                                fontSize: '0.75rem', color: '#b5a98a', border: '1px solid rgba(90, 144, 96, 0.2)',
                                                padding: '0.35rem 0.75rem', borderRadius: '6px'
                                            }}>
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <button className="btn-outline" style={{ width: '100%', height: '44px', fontSize: '0.8rem' }}>Edit Library Voice</button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column: Achievements & Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}
                    >
                        {/* Stats Row */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {[
                                { label: 'Books Read', value: stats.read, icon: BookOpen, color: '#c9863a' },
                                { label: 'Want to Read', value: stats.wantToRead, icon: Heart, color: '#5a9060' },
                                { label: 'Avg Rating', value: stats.avgRating, icon: Star, color: '#d4944a' },
                            ].map((stat, i) => (
                                <div key={i} style={{
                                    backgroundColor: '#1e3424', padding: '2.5rem 1.5rem', borderRadius: '1.5rem',
                                    border: '1px solid rgba(90, 144, 96, 0.12)', textAlign: 'center'
                                }}>
                                    <stat.icon style={{ color: stat.color, marginBottom: '1rem' }} size={32} />
                                    <h4 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#f2ead8', margin: 0 }}>{stat.value}</h4>
                                    <p style={{ color: '#5a5040', fontSize: '0.8rem', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            backgroundColor: '#1e3424', padding: '3rem', borderRadius: '1.5rem',
                            border: '1px solid rgba(90, 144, 96, 0.12)'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                                <Clock style={{ color: '#c9863a' }} size={24} />
                                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', color: '#f2ead8', margin: 0 }}>Recent Chapters</h3>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {[
                                    { text: 'Finished reading "The Great Gatsby"', detail: 'You gave it a 5-star rating and shared a review.', time: '2 days ago', icon: Award },
                                    { text: 'Added "Project Hail Mary" to your shelf', detail: 'Based on your interest in Science Fiction.', time: '4 days ago', icon: BookOpen },
                                    { text: 'Discovered a new genre: Dark Fantasy', detail: 'Explored 3 new titles in this category.', time: '1 week ago', icon: Star },
                                ].map((activity, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1.25rem' }}>
                                        <div style={{
                                            width: '48px', height: '48px', borderRadius: '12px',
                                            backgroundColor: 'rgba(201, 134, 58, 0.1)', flexShrink: 0,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}>
                                            <activity.icon style={{ color: '#c9863a' }} size={24} />
                                        </div>
                                        <div style={{ flex: 1, borderBottom: i < 2 ? '1px solid rgba(90, 144, 96, 0.08)' : 'none', paddingBottom: '1.5rem' }}>
                                            <h4 style={{ color: '#f2ead8', fontSize: '1.1rem', margin: '0 0 0.5rem 0', fontWeight: 600 }}>{activity.text}</h4>
                                            <p style={{ color: '#7a7060', fontSize: '0.875rem', margin: '0 0 0.75rem 0', lineHeight: 1.6 }}>{activity.detail}</p>
                                            <span style={{ fontSize: '0.7rem', color: '#3a3025', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </div>
    );
};

export default Profile;
