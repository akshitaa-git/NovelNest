import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#0f1c12',
            borderTop: '1px solid rgba(90,144,96,0.12)',
            padding: '4rem 0 2rem',
        }}>
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
                    {/* Brand */}
                    <div>
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '1rem' }}>
                            <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.6rem', color: '#c9863a' }}>
                                NovelNest
                            </span>
                        </Link>
                        <p style={{ color: '#5a5040', fontSize: '0.8rem', lineHeight: 1.7, maxWidth: '240px' }}>
                            Est. 2026 · Built for the literary mind
                        </p>
                    </div>

                    {[
                        { label: 'Explore', links: [{ name: 'Curations', to: '/discover' }, { name: 'The Shelf', to: '/shelf' }] },
                        { label: 'Account', links: [{ name: 'Sign Up', to: '/auth' }, { name: 'Log In', to: '/auth' }] },
                    ].map(col => (
                        <div key={col.label}>
                            <h4 style={{ fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#5a5040', fontWeight: 600, marginBottom: '1.25rem' }}>
                                {col.label}
                            </h4>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                                {col.links.map(l => (
                                    <li key={l.name}>
                                        <Link to={l.to} style={{ color: '#7a7060', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s' }}
                                            onMouseEnter={e => e.target.style.color = '#f2ead8'}
                                            onMouseLeave={e => e.target.style.color = '#7a7060'}
                                        >
                                            {l.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div style={{ borderTop: '1px solid rgba(90,144,96,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ color: '#3a3025', fontSize: '0.78rem' }}>© 2026 NovelNest. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
