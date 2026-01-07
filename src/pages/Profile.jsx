import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaSignOutAlt, FaInfoCircle, FaUser, FaCog } from 'react-icons/fa';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Theme State
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('theme') || 'dark';
    });

    useEffect(() => {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
        } else {
            document.body.classList.remove('light-mode');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    async function handleLogout() {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <div className="container" style={{ marginTop: '1rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Profile</h2>

            {/* User Info Card */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                {currentUser?.photoURL ? (
                    <img
                        src={currentUser.photoURL}
                        alt="Profile"
                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                ) : (
                    <div style={{
                        width: '70px', height: '70px', borderRadius: '50%',
                        backgroundColor: 'var(--accent-secondary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '2rem', color: '#fff'
                    }}>
                        <FaUser />
                    </div>
                )}
                <div>
                    <h3 style={{ fontSize: '1.25rem' }}>{currentUser?.displayName || 'User'}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{currentUser?.email}</p>
                </div>
            </div>

            {/* App Preferences */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(128,128,128,0.1)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaCog /> App Settings
                </div>

                {/* Theme Toggle */}
                <div
                    onClick={toggleTheme}
                    style={{
                        padding: '1rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(128,128,128,0.05)'}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {theme === 'light' ? <FaSun style={{ color: 'orange' }} /> : <FaMoon style={{ color: 'var(--accent-primary)' }} />}
                        <span>App Theme</span>
                    </div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                </div>
            </div>

            {/* About Section */}
            <div className="card" style={{ padding: '0', overflow: 'hidden', marginBottom: '2rem' }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid rgba(128,128,128,0.1)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FaInfoCircle /> About
                </div>
                <div style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Version</span>
                        <span style={{ color: 'var(--text-secondary)' }}>1.0.0</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Developer</span>
                        <span style={{ color: 'var(--text-secondary)' }}>Antigravity</span>
                    </div>
                </div>
            </div>

            {/* Logout */}
            <button
                className="btn"
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--danger)',
                    border: '1px solid var(--danger)',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}
                onClick={handleLogout}
            >
                <FaSignOutAlt /> Log Out
            </button>
        </div>
    );
}
