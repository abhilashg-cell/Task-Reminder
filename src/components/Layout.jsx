import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function Layout() {
    return (
        <>
            <main style={{ flex: 1, paddingBottom: 0 }}>
                <Outlet />
            </main>
            <BottomNav />
        </>
    );
}
