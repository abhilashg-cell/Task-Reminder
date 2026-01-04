import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div className="card">
                <h2 style={{ marginBottom: '1rem' }}>Profile</h2>
                {currentUser && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        {currentUser.photoURL && (
                            <img
                                src={currentUser.photoURL}
                                alt="Profile"
                                style={{ width: '64px', height: '64px', borderRadius: '50%' }}
                            />
                        )}
                        <div>
                            <h3>{currentUser.displayName}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{currentUser.email}</p>
                        </div>
                    </div>
                )}
                <button className="btn" style={{ backgroundColor: 'var(--danger)' }} onClick={handleLogout}>
                    Log Out
                </button>
            </div>
        </div>
    );
}
