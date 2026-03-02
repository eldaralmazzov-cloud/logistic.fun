import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';

interface LayoutProps {
    children?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="flex min-h-screen bg-background text-white overflow-hidden font-sans selection:bg-primary/30 selection:text-primary">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-emerald-500/5 blur-[100px] rounded-full" />
            </div>

            <Sidebar />

            <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
                {/* We removed the global header here because the SINO209 pages implement their own immersive headers */}

                <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={window.location.pathname}
                            initial={{ opacity: 0, scale: 0.99, y: 5 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.99, y: -5 }}
                            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                            className="max-w-[1600px] mx-auto w-full"
                        >
                            {children || <Outlet />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

export default Layout;
