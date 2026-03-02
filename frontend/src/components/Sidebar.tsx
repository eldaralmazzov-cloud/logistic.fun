import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Settings as SettingsIcon,
    LogOut,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    Truck,
    PieChart,
    Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { cn } from '../utils/utils';

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const { t } = useLanguage();
    const [collapsed, setCollapsed] = React.useState(false);

    const navItems = [
        { name: t('dashboard'), icon: LayoutDashboard, path: '/', exact: true, roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT, UserRole.LOGISTICS] },
        { name: t('data_field'), icon: Database, path: '/?tab=data', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT, UserRole.LOGISTICS] },
        { name: t('orders'), icon: TrendingUp, path: '/products', roles: [UserRole.ADMIN, UserRole.MANAGER, UserRole.ACCOUNTANT, UserRole.LOGISTICS] },
        { name: t('analytics'), icon: PieChart, path: '/analytics', roles: [UserRole.ADMIN, UserRole.ACCOUNTANT] },
        { name: t('logistics'), icon: Truck, path: '/logistics', roles: [UserRole.ADMIN, UserRole.LOGISTICS] },
    ].filter(item => user && item.roles.includes(user.role));

    return (
        <div className={cn(
            "h-screen glass-sidebar flex flex-col transition-all duration-500 relative z-50",
            collapsed ? "w-20" : "w-72"
        )}>
            {/* Branding */}
            <div className="p-6 mb-8 mt-4">
                {!collapsed ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black italic tracking-tighter text-white">SINO<span className="text-primary drop-shadow-[0_0_8px_rgba(0,242,255,0.6)]">209</span></span>
                            <div className="flex flex-col gap-[2px]">
                                <div className="h-[2px] w-8 bg-primary rounded-full" />
                                <div className="h-[2px] w-6 bg-primary/40 rounded-full" />
                            </div>
                        </div>
                        <span className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">{t('logistics_subtitle')}</span>
                    </motion.div>
                ) : (
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                        <span className="text-xs font-black italic text-primary">S</span>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 space-y-2">
                {navItems.map(item => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => {
                            const isCurrent = isActive && (item.path.includes('tab=') ? window.location.search === item.path.split('?')[1] : !window.location.search);
                            return cn(
                                "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden",
                                isCurrent
                                    ? "bg-primary/10 text-primary"
                                    : "text-white/40 hover:text-white/90 hover:bg-white/5"
                            );
                        }}
                    >
                        {({ isActive }) => {
                            const isCurrent = isActive && (item.path.includes('tab=') ? window.location.search === item.path.split('?')[1] : !window.location.search);
                            return (
                                <>
                                    {isCurrent && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full shadow-glow-teal"
                                        />
                                    )}
                                    <item.icon size={20} className={cn("transition-all group-hover:drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]", isCurrent ? "text-primary scale-110" : "")} />
                                    {!collapsed && (
                                        <span className="font-bold text-sm tracking-wide">{item.name}</span>
                                    )}
                                </>
                            );
                        }}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-border mt-auto">
                <NavLink
                    to="/settings"
                    className={({ isActive }) => cn(
                        "flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group text-white/40 hover:text-white/90 hover:bg-white/5 mb-2",
                        isActive && "text-white bg-white/10"
                    )}
                >
                    <SettingsIcon size={20} className="group-hover:rotate-45 transition-transform" />
                    {!collapsed && <span className="font-bold text-sm tracking-wide">{t('settings')}</span>}
                </NavLink>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300 group text-rose-500/50 hover:text-rose-500 hover:bg-rose-500/5"
                >
                    <LogOut size={20} />
                    {!collapsed && <span className="font-bold text-sm tracking-wide">{t('logout')}</span>}
                </button>
            </div>

            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute top-1/2 -right-4 w-8 h-8 glass-morphism rounded-full flex items-center justify-center text-white/40 hover:text-white hover:neon-border-teal transition-all hidden md:flex"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </div>
    );
};

export default Sidebar;
