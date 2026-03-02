import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Loader2,
    Database,
    LayoutDashboard,
    Search,
    Save as SaveIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Product, CargoStatus, PaymentStatus } from '../types';
import api from '../services/api';
import { cn } from '../utils/utils';
import { ProductDataFields } from '../components/ProductDataFields';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { t } = useLanguage();
    const [products, setProducts] = useState<Product[]>([]);
    const [settings, setSettings] = useState<any>({});
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [saving, setSaving] = useState(false);

    const handleCreateNew = () => {
        const newProduct: Partial<Product> = {
            product_name: '',
            supplier_name: '',
            price: 0,
            quantity: 1,
            media_urls: [],
            characteristics: '',
            order_number: `TEMP-${Date.now()}`,
            status: CargoStatus.PENDING,
            payment_status: PaymentStatus.UNPAID,
            purchase_price: 0,
            margin_percent: 0,
            customs_cost: 0,
            delivery_cost: 0,
            final_total_cost: 0,
            weight_kg: 0,
            volume_m3: 0,
            shipping_method: 'Truck' as any,
            currency: 'USD',
            exchange_rate: 1,
            outstanding_balance: 0,
        };
        setSelectedProduct(newProduct as Product);
        setIsAddingNew(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Settings
                const settingsRes = await api.get('/settings/');
                const settingsMap = settingsRes.data.reduce((acc: any, s: any) => ({ ...acc, [s.key]: s.value }), {});
                setSettings(settingsMap);

                // Fetch Products
                const response = await api.get('/products/');
                const productsData: Product[] = response.data;
                setProducts(productsData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const selectedProductTotalCostSom = useMemo(() => {
        if (!selectedProduct) return 0;
        const cny_to_kgs = settings.cny_to_kgs || 12.5;
        const usd_to_kgs = settings.usd_to_kgs || 89.0;

        const price_cny = selectedProduct.price_cny || 0;
        const weight_kg = selectedProduct.weight_kg || 0;
        const delivery_usd_per_kg = selectedProduct.delivery_usd_per_kg || 0;

        const price_kgs = price_cny * cny_to_kgs;
        const shipping_usd = delivery_usd_per_kg * weight_kg;
        const shipping_kgs = shipping_usd * usd_to_kgs;
        return price_kgs + shipping_kgs;
    }, [selectedProduct, settings]);

    const handleSaveData = async () => {
        if (!selectedProduct) return;
        setSaving(true);
        try {
            if (isAddingNew) {
                const res = await api.post('/products/', selectedProduct);
                setProducts([res.data, ...products]);
                setSelectedProduct(res.data);
                setIsAddingNew(false);
            } else {
                await api.patch(`/products/${selectedProduct.id}/`, selectedProduct);
                // Refresh local list
                setProducts(products.map(p => p.id === selectedProduct.id ? selectedProduct : p));
            }
            alert(t('update_success'));
        } catch (err: any) {
            console.error(err);
            const msg = err.response?.data?.detail || err.message || t('failed_save');
            alert(`${t('error')}: ${msg}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Header / Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="relative flex-1 max-w-2xl">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input
                        type="text"
                        placeholder={t('search_placeholder')}
                        className="w-full pl-12 pr-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none placeholder:text-white/10 text-white"
                    />
                </div>
                <div className="flex items-center gap-6">
                    <button className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-all relative group">
                        <Clock size={20} className="text-white/40 group-hover:text-primary transition-colors" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-glow-teal animate-pulse" />
                    </button>
                    <div className="flex items-center gap-4 pl-6 border-l border-white/10">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-black text-white leading-none">{user?.username || 'Admin'}</div>
                            <div className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{user?.role || 'Admin'}</div>
                        </div>
                        <div className="w-11 h-11 rounded-xl glass-morphism border-primary/20 flex items-center justify-center text-primary group cursor-pointer hover:neon-border-teal transition-all">
                            <LayoutDashboard size={20} className="group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-12 mb-4">
                <h1 className="text-3xl font-black tracking-tight text-white">{t('admin_dashboard')}</h1>
                <div className="flex items-center gap-3">
                    <button className="px-6 py-3 bg-primary text-background rounded-xl font-black text-xs uppercase tracking-widest shadow-glow-teal hover:scale-105 active:scale-95 transition-all">
                        {t('download_report')}
                    </button>
                </div>
            </div>

            <div className="space-y-8 max-w-4xl mx-auto">
                {/* 1. Add Product Button */}
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleCreateNew}
                    className="w-full py-6 bg-primary text-background rounded-[2rem] font-black text-xl shadow-glow-teal border-4 border-white/5 flex items-center justify-center gap-4 hover:neon-border-teal transition-all"
                >
                    <span className="w-10 h-10 bg-background/20 rounded-full flex items-center justify-center text-2xl font-black">+</span>
                    {t('add_product')}
                </motion.button>

                {/* 2. Product List (Recent) */}
                <div className="glass-morphism p-8 rounded-[2.5rem]">
                    <h3 className="text-lg font-black mb-6 flex items-center gap-2 text-white/40 uppercase tracking-widest">
                        <Database size={18} /> {t('recent_products')}
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar snap-x">
                        {products.slice(0, 10).map(p => (
                            <button
                                key={p.id}
                                onClick={() => { setSelectedProduct(p); setIsAddingNew(false); }}
                                className={cn(
                                    "min-w-[200px] p-5 rounded-2xl border text-left transition-all snap-start",
                                    selectedProduct?.id === p.id
                                        ? "bg-primary border-primary shadow-glow-teal text-background"
                                        : "bg-white/5 border-white/5 hover:border-primary/30 text-white"
                                )}
                            >
                                <div className={cn("text-[10px] font-black uppercase mb-1", selectedProduct?.id === p.id ? "text-background/60" : "text-white/30")}>
                                    {p.order_number}
                                </div>
                                <div className={cn("text-sm font-bold truncate", selectedProduct?.id === p.id ? "text-background" : "text-white")}>
                                    {p.product_name}
                                </div>
                                <div className={cn("text-[10px] font-bold mt-2", selectedProduct?.id === p.id ? "text-background/40" : "text-white/20")}>
                                    {new Date(p.updated_at).toLocaleDateString()}
                                </div>
                            </button>
                        ))}
                        {products.length === 0 && (
                            <div className="text-white/20 italic text-sm py-4">{t('no_products_added')}</div>
                        )}
                    </div>
                </div>

                {/* 3. Product Editor */}
                <AnimatePresence mode="wait">
                    {selectedProduct ? (
                        <motion.div
                            key={selectedProduct.id || 'new'}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="space-y-8"
                        >
                            <div className="glass-morphism p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary shadow-glow-teal" />
                                <div>
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">
                                        {isAddingNew ? t('new_product') : t('edit_product')}
                                    </div>
                                    {isAddingNew ? (
                                        <input
                                            className="text-2xl font-black bg-transparent border-none focus:ring-0 p-0 w-full placeholder:text-white/10 text-white"
                                            value={selectedProduct.product_name}
                                            onChange={e => setSelectedProduct({ ...selectedProduct, product_name: e.target.value })}
                                            onFocus={(e) => e.target.select()}
                                            placeholder={t('product_name_placeholder')}
                                            autoFocus
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-black tracking-tight text-white">{selectedProduct.product_name}</h2>
                                    )}
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setSelectedProduct(null)}
                                        className="px-6 py-3 glass-morphism text-white/60 rounded-xl font-bold text-sm hover:text-white transition-all"
                                    >
                                        {t('cancel')}
                                    </button>
                                    <button
                                        onClick={handleSaveData}
                                        disabled={saving || !selectedProduct.product_name}
                                        className="px-8 py-3 bg-primary text-background rounded-xl font-black text-sm shadow-glow-teal hover:scale-105 transition-all flex items-center gap-2 disabled:opacity-50"
                                    >
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <SaveIcon size={18} />}
                                        {saving ? t('committing') : t('save')}
                                    </button>
                                </div>
                            </div>

                            <ProductDataFields
                                product={selectedProduct}
                                setProduct={(p) => setSelectedProduct({ ...selectedProduct, ...p } as Product)}
                                isLimited={false}
                                showFinancials={true}
                                calculatedTotalCostSom={selectedProductTotalCostSom}
                            />
                        </motion.div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-white/20 italic font-medium">
                            {t('select_or_add')}
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default Dashboard;
