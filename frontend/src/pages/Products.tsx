import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Plus,
    Search,
    Filter,
    Download,
    ArrowUpDown,
    Truck,
    Clock,
    CheckCircle2,
    AlertCircle,
    Package,
    ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole, Product, CargoStatus, PaymentStatus } from '../types';
import api from '../services/api';
import { formatCurrency, cn } from '../utils/utils';

const STATUS_CONFIG: Record<string, { color: string, icon: any, glow: string }> = {
    [CargoStatus.IN_TRANSIT]: { color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', icon: Truck, glow: 'shadow-glow-amber' },
    [CargoStatus.IN_WAREHOUSE]: { color: 'text-primary bg-primary/10 border-primary/20', icon: Clock, glow: 'shadow-glow-teal' },
    [CargoStatus.DELIVERED]: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, glow: 'shadow-glow-emerald' },
    [CargoStatus.PENDING]: { color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', icon: AlertCircle, glow: 'shadow-glow-rose' },
};

interface ProductsProps {
    title?: string;
}

const Products: React.FC<ProductsProps> = ({ title }) => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const pageTitle = title || t('orders');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [paymentFilter, setPaymentFilter] = useState<string>('All');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products/');
                setProducts(response.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(p => {
        const name = p.product_name?.toLowerCase() || '';
        const supplier = p.supplier_name?.toLowerCase() || '';
        const orderNum = p.order_number?.toLowerCase() || '';
        const search = searchTerm.toLowerCase();

        const matchesSearch = name.includes(search) ||
            supplier.includes(search) ||
            orderNum.includes(search);

        const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
        const matchesPayment = paymentFilter === 'All' || p.payment_status === (paymentFilter as PaymentStatus);
        return matchesSearch && matchesStatus && matchesPayment;
    });

    const isLogistics = user?.role === UserRole.LOGISTICS;

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -10 },
        show: { opacity: 1, x: 0 }
    };

    return (
        <div className="space-y-10">
            {/* Header / Command Center */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">{pageTitle} <span className="text-primary italic font-black">{t('registry')}</span></h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-[.4em]">{t('inventory_terminal')}</span>
                        <div className="h-1 w-1 rounded-full bg-primary shadow-glow-teal" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{filteredProducts.length} {t('records_found')}</span>
                    </div>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 glass-morphism border-white/5 rounded-xl text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2 group">
                        <Download size={16} className="group-hover:translate-y-0.5 transition-transform" />
                        {t('export_data')}
                    </button>
                    {[UserRole.ADMIN, UserRole.MANAGER].includes(user?.role as UserRole) && (
                        <button
                            onClick={() => navigate('/products/new')}
                            className="px-6 py-3 bg-primary text-background rounded-xl text-xs font-black uppercase tracking-widest shadow-glow-teal hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                        >
                            <Plus size={18} />
                            {t('add_new_order')}
                        </button>
                    )}
                </div>
            </div>

            {/* Filters / Radar Bar */}
            <div className="glass-morphism p-6 rounded-[2.5rem] border border-white/5 flex flex-wrap items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder={t('search_product_placeholder')}
                            className="w-full pl-12 pr-6 py-4 bg-white/5 border border-white/5 rounded-2xl text-white font-bold text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none transition-all placeholder:text-white/5"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 px-5 py-3 glass-morphism border-white/5 rounded-2xl group/select hover:neon-border-teal transition-all">
                        <Filter size={14} className="text-white/20 group-hover/select:text-primary transition-colors" />
                        <select
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white/40 focus:ring-0 cursor-pointer appearance-none pr-8"
                            style={{ backgroundImage: 'none' }}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All" className="bg-[#0a0e14]">{t('all_units')}</option>
                            {Object.values(CargoStatus).map(s => <option key={s} value={s} className="bg-[#0a0e14]">{t(`status_${s.toLowerCase().replace(' ', '_')}` as any)}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 px-5 py-3 glass-morphism border-white/5 rounded-2xl group/select hover:neon-border-teal transition-all">
                        <ArrowUpDown size={14} className="text-white/20 group-hover/select:text-primary transition-colors" />
                        <select
                            className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white/40 focus:ring-0 cursor-pointer appearance-none pr-8"
                            style={{ backgroundImage: 'none' }}
                            value={paymentFilter}
                            onChange={(e) => setPaymentFilter(e.target.value)}
                        >
                            <option value="All" className="bg-[#0a0e14]">{t('all_payments')}</option>
                            {Object.values(PaymentStatus).map(s => <option key={s} value={s} className="bg-[#0a0e14]">{t(`payment_${s.toLowerCase().replace(' ', '_')}` as any)}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Shipments Ledger */}
            <div className="glass-morphism rounded-[3rem] border border-white/5 overflow-hidden shadow-premium">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left whitespace-nowrap border-collapse">
                        <thead>
                            <tr className="bg-white/[0.02] border-b border-white/5">
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('order_id')}</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('product')}</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('supplier')}</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('status')}</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20">{t('total_weight')} / {t('total_volume')}</th>
                                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[.25em] text-white/20 text-right">{t('value_analysis')}</th>
                            </tr>
                        </thead>
                        <motion.tbody
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="divide-y divide-white/5"
                        >
                            {loading ? (
                                <tr><td colSpan={6} className="px-10 py-32 text-center text-white/10 font-black uppercase tracking-[.5em] animate-pulse italic">{t('scanning_db')}</td></tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr><td colSpan={6} className="px-10 py-32 text-center text-white/10 font-black uppercase tracking-[.5em] italic">{t('zero_records')}</td></tr>
                            ) : filteredProducts.map((p) => {
                                const status = STATUS_CONFIG[p.status] || STATUS_CONFIG[CargoStatus.PENDING];
                                return (
                                    <motion.tr
                                        key={p.id}
                                        variants={rowVariants}
                                        className="hover:bg-primary/[0.03] transition-all duration-300 group cursor-pointer"
                                        onClick={() => navigate(`/products/${p.id}`)}
                                    >
                                        <td className="px-10 py-7">
                                            <div className="flex flex-col">
                                                <span className="font-black text-white/20 group-hover:text-primary transition-colors text-[10px] uppercase tracking-widest leading-none">#SY-ORD</span>
                                                <span className="text-sm font-black text-white/40 mt-1">{p.id.toString().padStart(5, '0')}</span>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 glass-morphism border-white/5 rounded-2xl flex items-center justify-center text-white/10 group-hover:text-primary transition-all group-hover:neon-border-teal">
                                                    <Package size={22} />
                                                </div>
                                                <div>
                                                    <div className="font-black text-white text-base tracking-tight group-hover:translate-x-1 transition-transform">{p.product_name}</div>
                                                    <div className="text-[10px] font-black text-primary/40 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                                                        {p.order_number}
                                                        <ArrowRight className="w-2 h-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="text-xs font-black text-white/40 uppercase tracking-widest">{p.supplier_name || 'N/A'}</div>
                                            <div className="text-[9px] font-bold text-white/10 italic mt-1 uppercase">{t('global_supply_chain')}</div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className={cn(
                                                "inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest",
                                                status.color,
                                                status.glow
                                            )}>
                                                <status.icon size={12} />
                                                {t(`status_${p.status.toLowerCase().replace(' ', '_')}` as any)}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7">
                                            <div className="flex flex-col gap-1">
                                                <div className="text-xs font-black text-white/60">{p.total_weight?.toFixed(2) || '0.00'} <span className="text-white/20 text-[10px]">KG</span></div>
                                                <div className="text-xs font-black text-white/60">{p.total_volume?.toFixed(4) || '0.0000'} <span className="text-white/20 text-[10px]">M³</span></div>
                                                {p.density > 0 && <div className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">{p.density?.toFixed(2)} KG/M³</div>}
                                            </div>
                                        </td>
                                        <td className="px-10 py-7 text-right">
                                            {!isLogistics ? (
                                                <div className="flex items-center justify-end gap-4 group/btn">
                                                    <div className="flex flex-col text-right">
                                                        <div className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{t('final_value')}</div>
                                                        <div className="text-base font-black text-white tracking-tighter">{formatCurrency(p.final_total_cost)}</div>
                                                    </div>
                                                    <div className="w-10 h-10 glass-morphism border-white/5 rounded-xl flex items-center justify-center text-white/20 group-hover:text-primary group-hover:neon-border-teal transition-all">
                                                        <ChevronRight size={18} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-white/10 uppercase tracking-widest italic">{t('restricted_entry')}</span>
                                            )}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </motion.tbody>
                    </table>
                </div>

                {/* Registry Navigation */}
                <div className="p-8 bg-white/[0.01] border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald" />
                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest font-mono">{t('registry_offset')}: 001 - {Math.min(100, filteredProducts.length)} // {t('total')}: {filteredProducts.length}</div>
                    </div>
                    <div className="flex gap-4">
                        <button className="px-6 py-2 glass-morphism border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white disabled:opacity-30 disabled:hover:text-white/20 transition-all font-mono" disabled>{t('prev_page')}</button>
                        <button className="px-6 py-2 glass-morphism border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-primary hover:neon-border-teal transition-all font-mono">{t('next_page_scan')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArrowRight = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
    </svg>
);

export default Products;
