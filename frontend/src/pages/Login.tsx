import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Lock, User as UserIcon, ShieldCheck, Cpu, Database, Network, Loader2 } from 'lucide-react';
import { cn } from '../utils/utils';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/token', formData);
            const { access_token } = response.data;

            const userResponse = await api.get('/auth/users/me', {
                headers: { Authorization: `Bearer ${access_token}` }
            });

            login(access_token, userResponse.data);
            navigate('/');
        } catch (err: any) {
            console.error('Login error details:', err);
            if (!err.response) {
                setError(t('core_sync_error'));
            } else {
                setError(err.response?.data?.detail || t('invalid_credentials'));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
            {/* Immersive Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100vw] h-[100vw] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
                <div className="grid grid-cols-8 gap-4 opacity-[0.03] w-full h-full p-10">
                    {Array.from({ length: 128 }).map((_, i) => (
                        <div key={i} className="h-20 border border-white/20 rounded-lg" />
                    ))}
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-lg relative z-10"
            >
                {/* Branding / Logo */}
                <div className="flex flex-col items-center mb-10">
                    <div className="relative group mb-6">
                        <div className="absolute -inset-4 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                        <div className="w-20 h-20 glass-morphism border-primary/20 rounded-3xl flex items-center justify-center text-primary shadow-glow-teal relative">
                            <Cpu size={36} className="animate-pulse" />
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-background animate-ping" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">SINO<span className="text-primary italic">209</span></h1>
                    <div className="flex items-center gap-4 mt-3">
                        <div className="h-[1px] w-8 bg-white/10" />
                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[.4em]">{t('logistics_terminal_v4')}</span>
                        <div className="h-[1px] w-8 bg-white/10" />
                    </div>
                </div>

                {/* Login Terminal Card */}
                <div className="glass-morphism border-white/5 p-10 rounded-[3rem] relative overflow-hidden shadow-premium">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <div className="mb-8 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-black text-white tracking-tight">{t('security_access')}</h2>
                            <p className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">{t('identity_verification')}</p>
                        </div>
                        <ShieldCheck className="text-primary/40" size={24} />
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[.2em]">{t('operator_id')}</label>
                            </div>
                            <div className="relative group">
                                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-white/5 transition-all outline-none"
                                    placeholder="SYN-CH-MAIN"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-[10px] font-black text-white/30 uppercase tracking-[.2em]">{t('encryption_key')}</label>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder:text-white/5 transition-all outline-none"
                                    placeholder="••••••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[10px] font-black uppercase tracking-[.1em] rounded-xl flex items-center gap-3"
                            >
                                <div className="w-2 h-2 rounded-full bg-rose-500 shadow-glow-rose animate-pulse" />
                                {error}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={cn(
                                "w-full py-4 bg-primary text-background rounded-2xl font-black text-xs uppercase tracking-[.3em] shadow-glow-teal hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group relative overflow-hidden",
                                loading && "opacity-70 cursor-not-allowed"
                            )}
                        >
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={18} />
                                    <span>{t('syncing_login')}</span>
                                </>
                            ) : (
                                <>
                                    <span>{t('initialize_access')}</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between gap-4 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700 cursor-default">
                        <div className="flex items-center gap-2">
                            <Database size={14} className="text-emerald-500" />
                            <span className="text-[8px] font-black uppercase text-white/40 tracking-[.2em]">DB_STABLE</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Network size={14} className="text-primary" />
                            <span className="text-[8px] font-black uppercase text-white/40 tracking-[.2em]">ENCRYPT_ON</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                            <span className="text-[8px] font-black uppercase text-white/40 tracking-[.2em]">SYS_OPERATIONAL</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-white/10 text-[9px] font-black uppercase tracking-[.5em] px-10 leading-loose">
                    {t('unauthorized_access_warning')}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
