import React from 'react';
import FacebookIcon from '../images/HeaderVsFooter/facebook.svg';
import TwitterIcon from '../images/HeaderVsFooter/twitter.svg';
import InstagramIcon from '../images/HeaderVsFooter/instagram.svg';
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header
            className="bg-white shadow-sm"
            style={{
                borderBottom: '1px solid #e0e0e0',
                height: '80px',
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}
        >
            <div
                className="d-flex align-items-center justify-content-between container"
                style={{ height: '100%' }}
            >
                <Link
                    to="/"
                    className="fw-bold"
                    style={{
                        fontSize: '24px',
                        color: '#2c3e50',
                        textDecoration: 'none',
                        fontFamily: 'Georgia, serif',
                        letterSpacing: '1px'
                    }}
                >
                    <span style={{ color: '#36b0c2' }}>Nutri</span>Planner
                </Link>

                <nav className="d-flex gap-4">
                    {[
                        { to: '/', label: 'Home' },
                        { to: '/categories', label: 'Categories' },
                        { to: '/favourite', label: 'Favourite' },
                        { to: '/contact', label: 'Contact' },
                        { to: '/about', label: 'About us' }
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.to}
                            className="nav-link"
                            style={{
                                color: '#2c3e50',
                                textDecoration: 'none',
                                fontWeight: '500',
                                position: 'relative',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#36b0c2'}
                            onMouseLeave={(e) => e.target.style.color = '#2c3e50'}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="d-flex gap-3">
                    {[FacebookIcon, TwitterIcon, InstagramIcon].map((icon, idx) => (
                        <a href="#" key={idx} className="d-flex align-items-center justify-content-center" style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: '#f0f0f0',
                            transition: 'background-color 0.3s'
                        }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#d9f1f4'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                        >
                            <img src={icon} alt="Social Icon" style={{ height: '18px' }} />
                        </a>
                    ))}
                </div>
            </div>
        </header>
    );
}
