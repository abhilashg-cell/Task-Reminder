import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaCalendarAlt, FaTasks, FaUser } from 'react-icons/fa';

export default function BottomNav() {
    const navStyle = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--bg-secondary)',
        height: 'var(--nav-height)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTop: '1px solid #333',
        zIndex: 100
    };

    const linkStyle = ({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
        textDecoration: 'none',
        fontSize: '0.8rem',
        flex: 1,
        height: '100%'
    });

    return (
        <nav style={navStyle}>
            <NavLink to="/calendar" style={linkStyle}>
                <FaCalendarAlt size={20} style={{ marginBottom: '4px' }} />
                Calendar
            </NavLink>
            <NavLink to="/tasks" style={linkStyle}>
                <FaTasks size={20} style={{ marginBottom: '4px' }} />
                Tasks
            </NavLink>
            <NavLink to="/profile" style={linkStyle}>
                <FaUser size={20} style={{ marginBottom: '4px' }} />
                Profile
            </NavLink>
        </nav>
    );
}
