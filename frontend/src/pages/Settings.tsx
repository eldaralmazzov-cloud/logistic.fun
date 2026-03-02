import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings as SettingsIcon,
    Save,
    RefreshCw,
    AlertTriangle,
    Globe,
    Shield,
    History,
    Database,
    CheckCircle2,
    Monitor,
    Zap,
    Cpu,
    Terminal
} from 'lucide-react';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/utils';

const Settings: React.FC = () => {
    const { language, setLanguage, t } = useLanguage();
    const [settings, setSettings] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('rates');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings/');
            setSettings(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await api.get('/auth/');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAuditLogs = async () => {
        try {
            const response = await api.get('/settings/audit/');
            setAuditLogs(response.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (activeTab === 'security') fetchUsers();
        if (activeTab === 'database') fetchAuditLogs();
    }, [activeTab]);

    const handleChange = (key: string, value: any) => {
        setSettings(prev => prev.map(s => s.key === key ? { ...s, value: value } : s));
    };

    const handleSave = async (setting: any) => {
        setSaving(true);
        try {
            await api.post('/settings/', setting);
            setSettings(prev => prev.map(s => s.key === setting.key ? { ...s, saved: true } : s));
            setTimeout(() => {
                setSettings(prev => prev.map(s => s.key === setting.key ? { ...s, saved: false } : s));
            }, 2000);
        } catch (err) {
            alert(t('error_saving_setting'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 bg-primary blur-xl opacity-20" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[.4em] text-white/20 animate-pulse">{t('initializing_sys_config')}</div>
        </div>
    );

    const tabs = [
        { id: 'rates', label: t('global_rates'), icon: Zap },
        { id: 'appearance', label: t('appearance_lang'), icon: Monitor },
        { id: 'security', label: t('security_roles'), icon: Shield },
        { id: 'database', label: t('system_audit'), icon: History },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="max-w-6xl mx-auto space-y-12 pb-20"
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{t('core')} <span className="text-primary italic">{t('architecture')}</span></h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[.4em]">{t('global_config_terminal')}</span>
                        <div className="h-1 w-1 rounded-full bg-primary shadow-glow-teal" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t('sys_status_stable')}</span>
                    </div>
                </div>
                <div className="w-14 h-14 glass-morphism border-white/5 rounded-2xl flex items-center justify-center text-primary shadow-glow-teal relative group overflow-hidden">
                    <SettingsIcon className="group-hover:rotate-90 transition-transform duration-700" size={28} />
                    <div className="absolute inset-0 bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </div>

            {/* High-Tech Tab Navigation */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 glass-morphism rounded-2xl border border-white/5 w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative overflow-hidden group",
                            activeTab === tab.id
                                ? "bg-primary text-background shadow-glow-teal"
                                : "text-white/30 hover:text-white/60 hover:bg-white/5 shadow-none"
                        )}
                    >
                        <tab.icon size={16} className={cn(activeTab === tab.id ? "" : "group-hover:scale-110 transition-transform")} />
                        {tab.label}
                        {activeTab === tab.id && <motion.div layoutId="tab-indicator" className="absolute bottom-0 inset-x-0 h-0.5 bg-white/20" />}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'rates' && (
                    <motion.div
                        key="rates"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-10"
                    >
                        {/* Critical Alert */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-900 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                            <div className="relative glass-morphism p-8 rounded-[2.5rem] border-amber-500/20 flex gap-6 bg-amber-500/[0.02]">
                                <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 shrink-0 border border-amber-500/20 shadow-glow-amber">
                                    <AlertTriangle size={24} />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-base font-black text-amber-500 tracking-tight uppercase">{t('critical_performance_sync')}</h3>
                                    <p className="text-white/40 text-xs font-bold leading-relaxed max-w-3xl italic">
                                        {t('critical_performance_desc')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Settings Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {settings.map((s) => (
                                <motion.div
                                    key={s.id}
                                    variants={itemVariants}
                                    className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 relative group hover:neon-border-teal transition-all flex flex-col justify-between h-full"
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-8 opacity-40 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary/50 group-hover:text-primary transition-colors border border-white/5">
                                                <Database size={18} />
                                            </div>
                                            <div className="text-[9px] font-black text-white/5 uppercase tracking-[.4em] font-mono group-hover:text-primary/20 transition-colors">#{s.key.substring(0, 8)}</div>
                                        </div>
                                        <div className="space-y-1 mb-8">
                                            <div className="text-sm font-black text-white tracking-tight group-hover:text-primary transition-colors">{s.description || s.key}</div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-[.2em] font-mono">{s.key}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-auto">
                                        <div className="flex-1 relative">
                                            <input
                                                type="number"
                                                step="0.01"
                                                className="w-full px-5 py-4 bg-white/5 border border-white/5 rounded-2xl outline-none focus:bg-white/10 focus:border-primary/30 text-right font-black text-white transition-all text-sm placeholder:text-white/5"
                                                value={s.value || ''}
                                                onChange={(e) => handleChange(s.key, parseFloat(e.target.value) || 0)}
                                                onFocus={(e) => e.target.select()}
                                                placeholder="0"
                                            />
                                        </div>
                                        <button
                                            onClick={() => handleSave(s)}
                                            disabled={saving}
                                            className={cn(
                                                "p-4 rounded-2xl transition-all relative overflow-hidden",
                                                s.saved
                                                    ? "bg-emerald-500 text-background shadow-glow-emerald"
                                                    : "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-background"
                                            )}
                                        >
                                            {s.saved ? <CheckCircle2 size={20} /> : <Save size={20} />}
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'appearance' && (
                    <motion.div
                        key="appearance"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-4xl space-y-10"
                    >
                        <div className="glass-morphism p-10 rounded-[3rem] border border-white/5">
                            <div className="flex items-center gap-4 mb-10">
                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-glow-teal">
                                    <Globe size={24} />
                                </div>
                                <h3 className="text-xl font-black text-white tracking-tight uppercase">{t('language_selection')}</h3>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <button
                                    onClick={() => setLanguage('en')}
                                    className={cn(
                                        "flex items-center justify-between p-8 rounded-[2rem] border-2 transition-all group overflow-hidden relative",
                                        language === 'en'
                                            ? "border-primary bg-primary/5 text-primary shadow-glow-teal"
                                            : "border-white/5 bg-white/5 text-white/30 hover:border-white/20 hover:text-white/60"
                                    )}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-6 relative z-10">
                                        <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">🇺🇸</span>
                                        <span className="text-lg font-black uppercase tracking-widest">English</span>
                                    </div>
                                    {language === 'en' && <CheckCircle2 size={24} className="relative z-10" />}
                                </button>
                                <button
                                    onClick={() => setLanguage('ru')}
                                    className={cn(
                                        "flex items-center justify-between p-8 rounded-[2rem] border-2 transition-all group overflow-hidden relative",
                                        language === 'ru'
                                            ? "border-primary bg-primary/5 text-primary shadow-glow-teal"
                                            : "border-white/5 bg-white/5 text-white/30 hover:border-white/20 hover:text-white/60"
                                    )}
                                >
                                    <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="flex items-center gap-6 relative z-10">
                                        <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all">🇷🇺</span>
                                        <span className="text-lg font-black uppercase tracking-widest">Русский</span>
                                    </div>
                                    {language === 'ru' && <CheckCircle2 size={24} className="relative z-10" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'security' && (
                    <motion.div
                        key="security"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-morphism rounded-[3rem] border border-white/5 overflow-hidden shadow-premium"
                    >
                        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Cpu size={24} className="text-primary" />
                                <h3 className="text-lg font-black text-white tracking-tight uppercase">{t('operator_registry')}</h3>
                            </div>
                            <button className="px-5 py-2 glass-morphism border-white/10 rounded-xl text-[9px] font-black uppercase text-white/40 tracking-[.3em] hover:text-white transition-all">{t('provision_new_operator')}</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-white/[0.01]">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('username')}</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('email')}</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('role')}</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20 text-right">{t('access_log')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users.map(u => (
                                        <tr key={u.id} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-10 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 glass-morphism border-white/5 rounded-xl flex items-center justify-center text-white/10 group-hover:text-primary transition-colors">
                                                        <Zap size={18} />
                                                    </div>
                                                    <span className="font-black text-white/60 group-hover:text-white transition-colors">{u.username}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-5 text-white/20 font-bold font-mono text-xs">{u.email}</td>
                                            <td className="px-10 py-5">
                                                <span className="px-4 py-1.5 bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest rounded-lg border border-primary/20 shadow-glow-teal">
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-10 py-5 text-right text-white/10 font-black font-mono text-[9px] tracking-widest">
                                                {new Date(u.created_at).toLocaleDateString()} // {t('synced')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'database' && (
                    <motion.div
                        key="database"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-morphism rounded-[3rem] border border-white/5 overflow-hidden shadow-premium"
                    >
                        <div className="p-8 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Terminal size={24} className="text-primary" />
                                <h3 className="text-lg font-black text-white tracking-tight uppercase">{t('systems_audit_feed')}</h3>
                            </div>
                            <span className="text-[9px] font-black uppercase text-emerald-500 tracking-[.4em] flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-emerald animate-pulse" />
                                {t('live_monitoring_active')}
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-white/[0.01]">
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('timestamp')}</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('action')}</th>
                                        <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('details')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors group">
                                            <td className="px-10 py-5 text-[10px] font-black font-mono text-white/10 tracking-widest uppercase">
                                                {new Date(log.timestamp).toISOString().replace('T', ' | ').substring(0, 21)}
                                            </td>
                                            <td className="px-10 py-5">
                                                <span className="font-black text-xs text-white uppercase group-hover:text-primary transition-colors">{log.action}</span>
                                            </td>
                                            <td className="px-10 py-5 text-[9px] text-white/20 font-black font-mono max-w-md truncate border-l border-white/5 bg-white/[0.01]">
                                                {JSON.stringify(log.details)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-center pt-10 relative">
                <div className="absolute inset-0 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
                <button
                    onClick={fetchSettings}
                    className="group flex items-center gap-3 px-10 py-4 glass-morphism border-white/10 rounded-[2rem] text-primary hover:text-white hover:bg-primary hover:neon-border-teal transition-all text-[11px] font-black uppercase tracking-[.5em] shadow-premium"
                >
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-1000" />
                    {t('recalibrate_core_services')}
                </button>
            </div>
        </motion.div>
    );
};

export default Settings;
