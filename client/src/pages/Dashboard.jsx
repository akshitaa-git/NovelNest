import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { BookOpen, Star, TrendingUp, Award, Loader2, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#c9863a', '#5a9060', '#8b5040', '#d4944a', '#3a6640'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{ backgroundColor: '#1a2c1d', border: '1px solid rgba(90,144,96,0.2)', borderRadius: '0.5rem', padding: '0.75rem 1rem' }}>
                <p style={{ color: '#f2ead8', fontSize: '0.85rem', fontWeight: 600 }}>{label}</p>
                <p style={{ color: '#c9863a', fontSize: '0.8rem' }}>{payload[0].value} books</p>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchAnalytics(); }, []);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get('/api/analytics');
            setData(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Loader2 size={36} style={{ color: '#c9863a' }} className="animate-spin" />
        </div>
    );

    const stats = [
        { label: 'Books Read', value: data.totalRead, icon: BookOpen, color: '#c9863a', bg: 'rgba(201,134,58,0.08)' },
        { label: 'Saved to Read', value: data.totalWantToRead, icon: Award, color: '#5a9060', bg: 'rgba(90,144,96,0.08)' },
        { label: 'Avg. Rating', value: data.avgRating, icon: Star, color: '#d4944a', bg: 'rgba(212,148,74,0.08)' },
        { label: 'Reading Streak', value: '12 Days', icon: TrendingUp, color: '#8b7060', bg: 'rgba(139,112,96,0.08)' },
    ];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#162a19', paddingTop: '6rem', paddingBottom: '5rem' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 3rem' }}>
                {/* Header */}
                <div style={{ marginBottom: '3rem' }}>
                    <p className="section-label" style={{ marginBottom: '0.5rem' }}>Your Journey</p>
                    <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', color: '#f2ead8', marginBottom: '0.5rem' }}>
                        Reading Analytics
                    </h1>
                    <p style={{ color: '#5a5040', fontSize: '0.95rem' }}>Visualize your story through stories.</p>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            style={{
                                backgroundColor: '#1e3424',
                                border: '1px solid rgba(90,144,96,0.12)',
                                borderRadius: '0.875rem',
                                padding: '1.75rem',
                            }}
                        >
                            <div style={{ width: '44px', height: '44px', borderRadius: '0.625rem', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                <stat.icon size={22} style={{ color: stat.color }} />
                            </div>
                            <p style={{ fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, color: '#5a5040', marginBottom: '0.375rem' }}>{stat.label}</p>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#f2ead8', fontWeight: 700 }}>{stat.value}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    {/* Genre Pie */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ backgroundColor: '#1e3424', border: '1px solid rgba(90,144,96,0.12)', borderRadius: '0.875rem', padding: '2rem' }}
                    >
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f2ead8', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                            Genre Distribution
                        </h3>
                        <div style={{ height: '260px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={data.genres} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="count">
                                        {data.genres.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1a2c1d', border: '1px solid rgba(90,144,96,0.2)', borderRadius: '0.5rem', color: '#f2ead8' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                            {data.genres.map((g, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: COLORS[i % COLORS.length] }} />
                                    <span style={{ fontSize: '0.78rem', color: '#7a7060' }}>{g.name}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Monthly Bar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        style={{ backgroundColor: '#1e3424', border: '1px solid rgba(90,144,96,0.12)', borderRadius: '0.875rem', padding: '2rem' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f2ead8', fontSize: '1.25rem' }}>Monthly Progress</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: '#5a5040', backgroundColor: '#162a19', padding: '0.3rem 0.75rem', borderRadius: '0.5rem' }}>
                                <Calendar size={13} /> 2026
                            </div>
                        </div>
                        <div style={{ height: '260px' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.monthlyData} barSize={22}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(90,144,96,0.1)" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5a5040', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a5040', fontSize: 12 }} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(201,134,58,0.06)' }} />
                                    <Bar dataKey="count" fill="#c9863a" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                {/* Line Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ backgroundColor: '#1e3424', border: '1px solid rgba(90,144,96,0.12)', borderRadius: '0.875rem', padding: '2rem' }}
                >
                    <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#f2ead8', fontSize: '1.25rem', marginBottom: '1.5rem' }}>
                        Reading Pace Trends
                    </h3>
                    <div style={{ height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(90,144,96,0.1)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#5a5040', fontSize: 12 }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5a5040', fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="count" stroke="#c9863a" strokeWidth={2.5} dot={{ fill: '#c9863a', r: 5 }} activeDot={{ r: 7, fill: '#d4944a' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
