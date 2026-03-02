import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Save,
    Trash2,
    Clock,
    User as UserIcon,
    ChevronDown,
    Truck,
    Database,
    Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole, Product, CargoStatus, PaymentStatus, ShippingMethod } from '../types';
import api from '../services/api';
import { formatDate, cn } from '../utils/utils';
import { ProductDataFields } from '../components/ProductDataFields';

// ─── Validation ───────────────────────────────────────────────────────────────
export interface DataFieldErrors {
    characteristics?: string;
    price?: string;
    weight?: string;
    size?: string;
    quantity?: string;
}

function validateDataFields(p: Partial<Product>, t: any): Record<string, string | undefined> {
    const errs: Record<string, string | undefined> = {};
    if (p.characteristics && p.characteristics.length > 1000)
        errs.characteristics = t('max_1000_chars');
    if (p.price === undefined || p.price === null || isNaN(p.price))
        errs.price = t('price_required');
    else if (p.price < 0)
        errs.price = t('price_positive');
    if (p.weight !== undefined && p.weight !== null && p.weight < 0)
        errs.weight = t('weight_positive');
    if (p.weight_kg !== undefined && p.weight_kg !== null && p.weight_kg < 0)
        errs.weight = t('weight_kg_positive');
    if (p.size && p.size.length > 100)
        errs.size = t('max_100_chars');
    if (p.quantity === undefined || p.quantity === null)
        errs.quantity = t('quantity_required');
    else if (!Number.isInteger(p.quantity) || p.quantity < 0)
        errs.quantity = t('quantity_integer');
    return errs;
}

// ─── Main Component ─────────────────────────────────────────────────────────

const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { t } = useLanguage();
    const isNew = id === 'new';

    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [dataErrors, setDataErrors] = useState<DataFieldErrors>({});

    const [product, setProduct] = useState<Partial<Product>>({
        product_name: '',
        supplier_name: '',
        order_number: '',
        purchase_price: 0,
        currency: 'USD',
        exchange_rate: 1,
        weight_kg: 0,
        volume_m3: 0,
        quantity: 0,
        margin_percent: 10,
        status: CargoStatus.PENDING,
        payment_status: PaymentStatus.UNPAID,
        shipping_method: ShippingMethod.AIR,
        price: 0,
        weight: undefined,
        size: '',
        characteristics: '',
        media_urls: [],
        specifications: {},
        price_cny: 0,
        cny_rate: 0,
        places_count: 0,
        weight_per_box: 0,
        delivery_rate_usd_per_kg: 0,
        usd_rate: 0,
        service_percent: 10,
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [auditLogs, setAuditLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (!isNew) {
                    const prodRes = await api.get(`/products/${id}/`);
                    setProduct(prodRes.data);
                    const auditRes = await api.get(`/products/${id}/audit/`);
                    setAuditLogs(auditRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isNew]);

    // Live calculations for preview (used in components or logs if needed, keeping to resolve lint but marking as valid logic)
    // Actually, liveCalcs is used for real-time preview in ProductDataFields if we pass it, 
    // but ProductDataFields now handles its own internal preview. 
    // If we want to keep it here and use it, we should. 
    // Let's remove it if it's purely redundant to avoid confusion.

    const handleSave = async () => {
        const errs = validateDataFields(product, t);
        setDataErrors(errs);
        if (hasDataErrors) {
            return;
        }

        setSaving(true);
        try {
            if (isNew) {
                await api.post('/products/', product);
            } else {
                await api.patch(`/products/${id}`, product);
            }
            navigate('/products');
        } catch (err: any) {
            console.error('Save error:', err);
            alert(`Error saving changes: ${err.response?.data?.detail || err.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm(`${t('confirm_deletion')}? ${t('irreversible_action')}`)) return;
        try {
            await api.delete(`/products/${id}/`);
            navigate('/products');
        } catch (err) {
            console.error('Delete error:', err);
        }
    };

    const isLogisticsRole = user?.role === UserRole.LOGISTICS;
    // User wants everyone to be able to edit and save regardless of role
    const isLimited = false;
    const hasDataErrors = Object.keys(dataErrors).length > 0;

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <Loader2 className="animate-spin text-primary" size={48} />
            <div className="text-xl font-black text-white/20 uppercase tracking-widest animate-pulse">{t('initializing_terminal')}</div>
        </div>
    );

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.05 } },
    };


    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-[1400px] mx-auto pb-32"
        >
            {/* ── Header ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <button
                        onClick={() => navigate('/products')}
                        className="flex items-center gap-2 text-white/40 hover:text-primary transition-all font-black uppercase text-[10px] tracking-[0.2em] mb-4 group"
                    >
                        <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                        {t('back_to_list')}
                    </button>
                    <div className="flex flex-col">
                        <h1 className="text-5xl font-black tracking-tighter text-white">
                            {isNew ? t('add_new_order') : t('order_details')}
                        </h1>
                        {!isNew && (
                            <div className="flex items-center gap-3 mt-2">
                                <span className="text-[10px] font-black bg-white/5 border border-white/10 px-2 py-1 rounded text-white/40 uppercase tracking-widest leading-none">{t('transaction_record')}</span>
                                <p className="text-primary font-black text-xs tracking-widest">
                                    #{product.order_number || 'PENDING_ID'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                        <div className="text-[10px] font-black text-white/20 uppercase mb-1">{t('operator_profile')}</div>
                        <div className="flex items-center gap-3 glass-morphism px-4 py-2 rounded-xl border-white/5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <UserIcon size={16} />
                            </div>
                            <span className="text-xs font-black text-white uppercase tracking-wider">{user?.username}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ── Left Content (Tabs) ── */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-8">
                        {/* Core Identity Information section from old overview tab */}
                        <section className="glass-morphism p-8 rounded-[3rem] border-white/5">
                            <div className="flex items-center gap-3 mb-8">
                                <Database className="text-primary/40" size={18} />
                                <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/30">{t('registry_identity')}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('order_label')}</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 px-6 font-bold text-white transition-all outline-none"
                                            value={product.product_name}
                                            onChange={e => setProduct({ ...product, product_name: e.target.value })}
                                            disabled={isLimited}
                                            placeholder={t('operational_unit_name')}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('logistics_serial')}</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 px-6 font-bold text-white transition-all outline-none"
                                            value={product.order_number}
                                            onChange={e => setProduct({ ...product, order_number: e.target.value })}
                                            disabled={isLimited}
                                            placeholder="SINO-ORDER-XXXX"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('supplier_entity')}</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 px-6 font-bold text-white transition-all outline-none"
                                            value={product.supplier_name}
                                            onChange={e => setProduct({ ...product, supplier_name: e.target.value })}
                                            disabled={isLimited}
                                            placeholder={t('manufacturer_vendor_name')}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('batch_count')}</label>
                                            <input
                                                type="number"
                                                className="w-full bg-white/5 border border-white/5 focus:border-primary/50 rounded-2xl py-4 px-6 font-bold text-white transition-all outline-none"
                                                value={product.quantity || ''}
                                                onChange={e => setProduct({ ...product, quantity: parseInt(e.target.value) || 0 })}
                                                onFocus={(e) => e.target.select()}
                                                placeholder="0"
                                                disabled={isLimited}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-1">{t('scale_unit')}</label>
                                            <div className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 font-black text-white/20 text-xs flex items-center justify-center uppercase tracking-widest">{t('pcs')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <ProductDataFields
                            product={product}
                            setProduct={(p) => setProduct({ ...product, ...p } as Product)}
                            isLimited={isLimited}
                        />
                    </div>
                </div>

                {/* ── Right Column (Architecture) ── */}
                <div className="space-y-8">
                    {/* Architecture Control Shell */}
                    <section className="glass-morphism p-8 rounded-[3rem] border-white/5 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] rounded-full" />
                        <div className="flex items-center gap-4 mb-10">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                                <Truck size={24} />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tight">{t('logistics_info')}</h2>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{t('status_protocol')}</p>
                            </div>
                        </div>

                        <div className="space-y-10">
                            <div className="relative group">
                                <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3 block ml-1">{t('system_state')}</label>
                                <select
                                    className={cn(
                                        "w-full px-6 py-4 rounded-2xl border transition-all duration-500 font-black text-xs appearance-none cursor-pointer focus:ring-0 outline-none uppercase tracking-widest",
                                        product.status === CargoStatus.DELIVERED
                                            ? "bg-emerald-500 text-background border-emerald-400 shadow-glow-emerald"
                                            : "bg-white/5 text-white border-white/5 hover:border-primary/30"
                                    )}
                                    value={product.status}
                                    onChange={e => setProduct({ ...product, status: e.target.value as CargoStatus })}
                                    disabled={isLimited && !isLogisticsRole}
                                >
                                    {Object.values(CargoStatus).map(status => (
                                        <option key={status} value={status} className="bg-[#080c10] text-white py-4">{status}</option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={16}
                                    className={cn(
                                        "absolute right-6 bottom-[18px] pointer-events-none transition-transform group-hover:translate-y-0.5",
                                        product.status === CargoStatus.DELIVERED ? "text-background" : "text-white/20"
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{t('total_weight')}</div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group-hover:border-primary/20 transition-all opacity-80">
                                        <div className="font-black text-white text-lg">{(product.total_weight || 0).toFixed(2)}</div>
                                        <span className="text-primary/40 font-black text-[10px] ml-2">KG</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{t('total_volume')}</div>
                                    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group-hover:border-primary/20 transition-all opacity-80">
                                        <div className="font-black text-white text-lg">{(product.total_volume || 0).toFixed(4)}</div>
                                        <span className="text-primary/40 font-black text-[10px] ml-2">M³</span>
                                    </div>
                                </div>
                                {product.density !== undefined && product.density > 0 && (
                                    <div className="grid col-span-2 mt-2">
                                        <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">{t('density')}</div>
                                        <div className="bg-white/5 border border-white/5 rounded-2xl p-4 flex items-center justify-between group-hover:border-primary/20 transition-all opacity-80">
                                            <div className="font-black text-primary text-lg">{(product.density || 0).toFixed(2)}</div>
                                            <span className="text-primary/40 font-black text-[10px] ml-2">KG/M³</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group">
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{t('trace_id')}</span>
                                    <input
                                        className="font-black text-primary text-xs tracking-widest bg-transparent border-none p-0 text-right focus:ring-0 outline-none uppercase w-32"
                                        value={product.tracking_number}
                                        onChange={e => setProduct({ ...product, tracking_number: e.target.value })}
                                        disabled={isLimited}
                                        placeholder={t('no_records_match')}
                                    />
                                </div>

                                <div className="space-y-4 px-1">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('logged')}</span>
                                        <span className="font-black text-white/80 text-xs tracking-widest">{product.updated_at ? formatDate(product.updated_at) : '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest">{t('forecasted')}</span>
                                        <span className="font-black text-primary text-xs tracking-widest">
                                            {product.estimated_arrival_date ? formatDate(product.estimated_arrival_date) : t('pending_arrival')}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Operational Audit Feed */}
                    <section className="glass-morphism p-8 rounded-[3.5rem] border-white/5 flex flex-col min-h-[450px] relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                                <h2 className="text-xl font-black text-white tracking-tighter">{t('audit_feed')}</h2>
                                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-1">{t('operational_history')}</p>
                            </div>
                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-primary text-[10px] font-black tracking-widest">
                                {auditLogs.length} {t('events_count')}
                            </div>
                        </div>

                        <div className="flex-1 space-y-8 overflow-y-auto pr-4 custom-scrollbar relative z-10">
                            {auditLogs.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center opacity-10 py-20 grayscale">
                                    <Clock size={64} className="mb-4" />
                                    <div className="text-xs font-black uppercase tracking-[0.4em]">{t('zero_event_delta')}</div>
                                </div>
                            ) : auditLogs.map((log: any, index) => (
                                <div key={log.id} className="flex gap-6 group">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-primary group-hover:shadow-glow-teal group-hover:border-primary/40 transition-all">
                                            <UserIcon size={18} />
                                        </div>
                                        {index !== auditLogs.length - 1 && <div className="w-[1px] flex-1 bg-white/5 my-3" />}
                                    </div>
                                    <div className="pt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-black text-white tracking-wide">
                                                {log.user_id ? `AGENT_${log.user_id}` : t('system_core')}
                                            </span>
                                            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">— {log.action}</span>
                                        </div>
                                        <div className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">
                                            {formatDate(log.timestamp)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* ── Architectural Control Bar (Sticky) ── */}
            {true && (
                <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[1000px] px-6 z-[100]">
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="glass-morphism bg-[#080c10]/80 backdrop-blur-2xl border-white/10 px-10 py-6 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] flex flex-wrap items-center justify-between gap-8"
                    >
                        <div className="flex items-center gap-6 pr-8 border-r border-white/5">
                            <div className="flex flex-col">
                                <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-1">{t('terminal_status')}</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-glow-emerald animate-pulse" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{t('operational_ready')}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 flex-1 justify-end">
                            {!isNew && (user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER) && (
                                <button
                                    onClick={handleDelete}
                                    className="px-8 py-4 font-black transition-all text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/20 rounded-[1.5rem] uppercase text-[10px] tracking-[0.3em] flex items-center gap-3"
                                >
                                    <Trash2 size={16} />
                                    {t('cancel_order')}
                                </button>
                            )}

                            <button
                                onClick={() => navigate(-1)}
                                className="px-8 py-4 font-black text-white/40 hover:text-white transition-all uppercase text-[10px] tracking-[0.3em]"
                            >
                                {t('back_to_list')}
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-12 py-5 bg-primary text-background rounded-[1.5rem] font-black uppercase text-xs tracking-[0.3em] shadow-glow-teal hover:scale-105 active:scale-[0.98] transition-all flex items-center gap-4 disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                                {saving ? t('uploading') : t('save_changes')}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </motion.div>
    );
};

export default ProductDetail;
