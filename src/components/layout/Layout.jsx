import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-[#0f172a] text-slate-100 overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                {/* Ambient background glows */}
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/20 rounded-full blur-[120px]" />
            </div>

            <Navbar />

            <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;
