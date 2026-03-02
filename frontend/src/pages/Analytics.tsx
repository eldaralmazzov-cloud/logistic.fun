import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Activity,
    BarChart3,
    PieChart as PieChartIcon,
    Calendar,
    ArrowUpRight,
    ChevronRight,
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    AreaChart,
    Area
} from 'recharts';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Product } from '../types';

const COLORS = ['#00f2ff', '#00ff9d', '#ff9f0a', '#ff2d55', '#00d2ff'];

const Analytics: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const { t } = useLanguage();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/products/');
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const statusData = React.useMemo(() => {
        const counts: Record<string, number> = {};
        products.forEach(p => {
            counts[p.status] = (counts[p.status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [products]);

    const financialTrendData = [
        { month: 'Jan', revenue: 4500, cost: 3200 },
        { month: 'Feb', revenue: 5200, cost: 3800 },
        { month: 'Mar', revenue: 4800, cost: 3100 },
        { month: 'Apr', revenue: 6100, cost: 4200 },
        { month: 'May', revenue: 5900, cost: 3900 },
        { month: 'Jun', revenue: 7200, cost: 4800 },
    ];

    const volumeByMethod = React.useMemo(() => {
        const vol: Record<string, number> = {};
        products.forEach(p => {
            vol[p.shipping_method] = (vol[p.shipping_method] || 0) + (p.weight_kg || 0);
        });
        return Object.entries(vol).map(([name, weight]) => ({ name, weight }));
    }, [products]);

    if (loading) return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <div className="absolute inset-0 bg-primary blur-xl opacity-20" />
            </div>
            <div className="text-[10px] font-black uppercase tracking-[.4em] text-white/20 animate-pulse">{t('syncing_analytics')}</div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-10"
        >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter">{t('strategic')} <span className="text-primary italic">{t('intelligence')}</span></h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-[10px] font-black text-primary uppercase tracking-widest">{t('live_engine')}</span>
                        <p className="text-white/20 text-xs font-bold uppercase tracking-widest">{t('analytics_subtitle')}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="glass-morphism p-1 rounded-xl flex bg-white/5 border-white/5">
                        <button className="px-5 py-2 bg-primary text-background rounded-lg text-xs font-black uppercase tracking-widest shadow-glow-teal transition-all">
                            {t('detailed_view')}
                        </button>
                        <button className="px-5 py-2 text-white/30 hover:text-white transition-all text-xs font-black uppercase tracking-widest">
                            {t('export_pdf')}
                        </button>
                    </div>
                    <button className="p-3 glass-morphism border-white/5 rounded-xl text-white/40 hover:text-primary transition-all">
                        <Calendar size={18} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Deep Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Main Area Chart */}
                    <motion.section variants={itemVariants} className="glass-morphism p-8 rounded-[3rem] border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Activity className="text-primary/10 group-hover:text-primary/20 transition-colors" size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h2 className="text-xl font-black text-white tracking-tight">{t('financial_trajectory')}</h2>
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[.2em] mt-1">{t('revenue_vs_expense')}</p>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-glow-teal" />
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest text-shadow-glow">{t('revenue')}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-glow-rose" />
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{t('expense')}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={financialTrendData}>
                                        <defs>
                                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.15} />
                                                <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                                            </linearGradient>
                                            <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#ff2d55" stopOpacity={0.1} />
                                                <stop offset="95%" stopColor="#ff2d55" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} tickFormatter={(v) => `$${v}`} />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(10,14,20,0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '16px',
                                                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
                                                backdropFilter: 'blur(8px)'
                                            }}
                                            itemStyle={{ fontWeight: 900, fontSize: '12px' }}
                                            labelStyle={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', marginBottom: '8px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        />
                                        <Area type="monotone" dataKey="revenue" stroke="#00f2ff" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" dot={{ r: 4, fill: '#00f2ff', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#00f2ff', strokeWidth: 8, stroke: 'rgba(0,242,255,0.2)' }} />
                                        <Area type="monotone" dataKey="cost" stroke="#ff2d55" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" dot={{ r: 4, fill: '#ff2d55', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#ff2d55', strokeWidth: 8, stroke: 'rgba(255,45,85,0.2)' }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </motion.section>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Bar Chart Section */}
                        <motion.section variants={itemVariants} className="glass-morphism p-8 rounded-[3rem] border border-white/5 relative group">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                                    <BarChart3 size={20} />
                                </div>
                                <h2 className="text-lg font-black text-white tracking-tight">{t('logistics_load')}</h2>
                            </div>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={volumeByMethod}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 10, fontWeight: 900 }} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            contentStyle={{
                                                backgroundColor: 'rgba(10,14,20,0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: '16px',
                                                boxShadow: '0 8px 32px 0 rgba(0,0,0,0.5)',
                                                backdropFilter: 'blur(8px)'
                                            }}
                                        />
                                        <Bar dataKey="weight" fill="#00f2ff" radius={[10, 10, 4, 4]} style={{ filter: 'drop-shadow(0 0 10px rgba(0,242,255,0.3))' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.section>

                        {/* Summary / Callout */}
                        <motion.section variants={itemVariants} className="glass-morphism p-8 rounded-[3rem] border border-white/5 bg-primary/[0.02] flex flex-col justify-center relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                            <div className="relative z-10 text-center">
                                <TrendingUp className="text-primary mx-auto mb-6 shadow-glow-teal" size={42} />
                                <h3 className="text-xl font-black text-white mb-2">{t('efficiency_rating')}</h3>
                                <div className="text-5xl font-black text-white tracking-tighter mb-4">98.4%</div>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-[.3em] leading-relaxed">
                                    {t('efficiency_desc').split('above nominal')[0]} <span className="text-primary">{t('above_nominal')}</span> {t('efficiency_desc').split('above nominal')[1]}
                                </p>
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* Right Column: Segmentation & Quick Metrics */}
                <div className="space-y-8">
                    {/* Pie Chart Section */}
                    <motion.section variants={itemVariants} className="glass-morphism p-8 rounded-[3rem] border border-white/5 relative">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-primary border border-white/5">
                                <PieChartIcon size={20} />
                            </div>
                            <h2 className="text-lg font-black text-white tracking-tight">{t('status_mix')}</h2>
                        </div>
                        <div className="h-[250px] relative flex items-center justify-center">
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                                <div className="text-3xl font-black text-white">{products.length}</div>
                                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{t('global')}</div>
                            </div>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={65}
                                        outerRadius={90}
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {statusData.map((_, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={COLORS[index % COLORS.length]}
                                                style={{ filter: `drop-shadow(0 0 8px ${COLORS[index % COLORS.length] + '44'})` }}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-8 space-y-4">
                            {statusData.map((s, i) => (
                                <div key={s.name} className="flex items-center justify-between group cursor-pointer hover:bg-white/5 p-2 -mx-2 rounded-xl transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length], boxShadow: `0 0 10px ${COLORS[i % COLORS.length]}` }} />
                                        <span className="text-xs font-bold text-white/40 group-hover:text-white transition-colors">{s.name}</span>
                                    </div>
                                    <span className="text-xs font-black text-white">{s.value}</span>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Growth Card */}
                    <motion.section variants={itemVariants} className="glass-morphism p-8 rounded-[3rem] border-primary/20 bg-primary/5 group relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-[50px] rounded-full" />
                        <div className="relative z-10">
                            <h2 className="text-lg font-black text-white mb-1">{t('growth_forecast')}</h2>
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-[.2em] mb-8">{t('quarterly_velocity')}</p>

                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="text-5xl font-black text-white tracking-tighter">+24.5%</span>
                                <ArrowUpRight className="text-emerald-500 shadow-glow-emerald" size={32} />
                            </div>

                            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-2xl border border-white/5">
                                <Activity className="text-primary" size={16} />
                                <span className="text-[10px] font-bold text-white/60">{t('top_performer_base')}</span>
                            </div>

                            <button className="w-full mt-8 py-4 bg-primary text-background rounded-2xl font-black text-[10px] uppercase tracking-[.3em] shadow-glow-teal hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group">
                                {t('deep_dive_report')} <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </motion.section>
                </div>
            </div>
        </motion.div>
    );
};

export default Analytics;
