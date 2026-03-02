import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    X,
    Image as ImageIcon,
    Video,
    Link as LinkIcon,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { Product } from '../types';
import { useCloudinaryUpload } from '../hooks/useCloudinaryUpload';
import { useLanguage } from '../context/LanguageContext';
import { cn } from '../utils/utils';

// ─── Media Card ──────────────────────────────────────────────────────────────
export interface MediaCardProps {
    url: string;
    onRemove: () => void;
    onClick: () => void;
    disabled: boolean;
    t: (key: string) => string;
}

export function MediaCard({ url, onRemove, onClick, disabled, t }: MediaCardProps) {
    const isImage = /\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(url)
        || url.includes('image')
        || url.includes('/image/upload/');
    const isVideo = /\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)
        || url.includes('/video/upload/');

    return (
        <div
            onClick={onClick}
            className="relative group rounded-2xl overflow-hidden border border-white/5 glass-morphism aspect-square flex items-center justify-center cursor-pointer active:scale-95 transition-all hover:neon-border-teal"
        >
            {isImage ? (
                <img
                    src={url}
                    alt="media"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                />
            ) : isVideo ? (
                <video
                    src={url}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    muted
                    onMouseOver={e => (e.currentTarget as HTMLVideoElement).play()}
                    onMouseOut={e => { const v = e.currentTarget as HTMLVideoElement; v.pause(); v.currentTime = 0; }}
                />
            ) : (
                <div className="flex flex-col items-center gap-2 text-white/20 p-4">
                    <LinkIcon size={24} />
                    <span className="text-[10px] font-bold text-center break-all line-clamp-2">{url}</span>
                </div>
            )}

            <div className="absolute top-2 left-2 flex gap-1">
                {isImage && <span className="bg-primary/20 backdrop-blur-md text-primary text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-primary/20 shadow-glow-teal"><ImageIcon size={9} /> {t('img_short')}</span>}
                {isVideo && <span className="bg-purple-500/20 backdrop-blur-md text-purple-400 text-[8px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 border border-purple-500/20"><Video size={9} /> {t('vid_short')}</span>}
            </div>

            {!disabled && (
                <button
                    onClick={(e) => { e.stopPropagation(); onRemove(); }}
                    className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-white/20 shadow-glow-rose hover:bg-rose-600"
                >
                    <X size={12} />
                </button>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md text-white/60 text-[8px] px-2 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                {url}
            </div>
        </div>
    );
}

// ─── Media Lightbox ──────────────────────────────────────────────────────────
export interface MediaLightboxProps {
    url: string | null;
    onClose: () => void;
    t: (key: string) => string;
}

export function MediaLightbox({ url, onClose, t }: MediaLightboxProps) {
    return (
        <AnimatePresence>
            {url && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-10"
                >
                    <button
                        className="absolute top-8 right-8 w-12 h-12 glass-morphism hover:bg-white/10 text-white rounded-full flex items-center justify-center transition-all z-[101] border-white/10"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>

                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative max-w-full max-h-full flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/\.(jpg|jpeg|png|gif|webp|avif|svg)(\?|$)/i.test(url) || url.includes('image') || url.includes('/image/upload/') ? (
                            <img
                                src={url}
                                alt="Full size"
                                className="max-w-full max-h-[80vh] object-contain rounded-2xl shadow-premium border border-white/10"
                            />
                        ) : (
                            <video
                                src={url}
                                controls
                                autoPlay
                                className="max-w-full max-h-[80vh] rounded-2xl shadow-premium border border-white/10"
                            />
                        )}

                        <div className="absolute -bottom-14 left-0 right-0 text-center">
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-white/20 hover:text-primary text-[10px] font-black uppercase tracking-[.2em] transition-colors truncate block max-w-lg mx-auto px-4"
                            >
                                {t('open_original')}
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// ─── Product Data Fields ─────────────────────────────────────────────────────
export interface ProductDataFieldsProps {
    product: Partial<Product>;
    setProduct: (p: Partial<Product>) => void;
    isLimited: boolean;
    errors?: Record<string, any>;
    showFinancials?: boolean;
}

export const ProductDataFields: React.FC<ProductDataFieldsProps> = ({
    product,
    setProduct,
    isLimited,
    errors = {},
    showFinancials = true,
}) => {
    const { t } = useLanguage();
    const { uploadFiles, uploading, uploadError } = useCloudinaryUpload();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragOver, setDragOver] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

    const urls = product.media_urls ?? [];

    const handleFiles = useCallback(async (files: FileList | File[]) => {
        const newUrls = await uploadFiles(files, (done, total) => {
            setUploadProgress({ done, total });
        });
        setUploadProgress(null);
        if (newUrls.length > 0) {
            setProduct({ ...product, media_urls: [...urls, ...newUrls] });
        }
    }, [product, urls, uploadFiles, setProduct]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (!isLimited && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    };

    const removeUrl = (index: number) => {
        setProduct({ ...product, media_urls: urls.filter((_, i) => i !== index) });
    };

    const addUrlManually = () => {
        const url = prompt(t('paste_media_url'));
        if (url?.trim()) {
            setProduct({ ...product, media_urls: [...urls, url.trim()] });
        }
    };

    const FieldLabel = ({ label, error, optional = true }: { label: string; error?: string; optional?: boolean }) => (
        <div className="flex items-center justify-between mb-3">
            <div className="text-[10px] font-black text-white/30 uppercase tracking-[.2em]">
                {label}
                {!optional && <span className="text-rose-500 ml-1">*</span>}
            </div>
            {error && (
                <div className="text-[10px] font-black text-rose-500 flex items-center gap-1.5 px-2 py-0.5 bg-rose-500/10 rounded-full border border-rose-500/20">
                    <AlertCircle size={10} /> {error}
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            {showFinancials && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Price Card */}
                    <div className={cn(
                        "glass-morphism p-8 rounded-[2.5rem] relative group border transition-all",
                        errors.price ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-white/5 hover:neon-border-teal"
                    )}>
                        <FieldLabel label={t('purchase_price_cny')} error={errors.price_cny} optional={false} />
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-white/20">¥</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                className={cn(
                                    "w-full text-4xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none placeholder:text-white/5",
                                    errors.price_cny ? "text-rose-500" : "text-white"
                                )}
                                value={product.price_cny || ''}
                                onChange={e => setProduct({ ...product, price_cny: parseFloat(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                disabled={isLimited}
                                placeholder="0.00"
                            />
                        </div>
                        <div className="text-[10px] text-white/20 mt-3 font-bold uppercase tracking-widest">{t('cny_purchase_value')}</div>
                    </div>

                    {/* Quantity Card */}
                    <div className={cn(
                        "glass-morphism p-8 rounded-[2.5rem] relative group border transition-all",
                        errors.quantity ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-white/5 hover:neon-border-teal"
                    )}>
                        <FieldLabel label={t('stock_quantity')} error={errors.quantity} optional={false} />
                        <input
                            type="number"
                            min="0"
                            step="1"
                            className={cn(
                                "w-full text-4xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none placeholder:text-white/5",
                                errors.quantity ? "text-rose-500" : "text-white"
                            )}
                            value={product.quantity || ''}
                            onChange={e => setProduct({ ...product, quantity: Math.max(0, parseInt(e.target.value) || 0) })}
                            onFocus={(e) => e.target.select()}
                            disabled={isLimited}
                        />
                        <div className="text-[10px] text-white/20 mt-3 font-bold uppercase tracking-widest">{t('units_in_warehouse')}</div>
                    </div>

                    {/* NEW: Calculation Fields Grid */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 mt-4 border-t border-white/5">
                        <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                            <FieldLabel label={t('cny_rate')} />
                            <input
                                type="number"
                                step="0.01"
                                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                                value={product.cny_rate || ''}
                                onChange={e => setProduct({ ...product, cny_rate: parseFloat(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                disabled={isLimited}
                            />
                        </div>

                        <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                            <FieldLabel label={t('places_count')} />
                            <input
                                type="number"
                                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                                value={product.places_count || ''}
                                onChange={e => setProduct({ ...product, places_count: parseInt(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                disabled={isLimited}
                            />
                        </div>

                        <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                            <FieldLabel label={t('weight_per_box')} />
                            <input
                                type="number"
                                step="0.01"
                                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                                value={product.weight_per_box || ''}
                                onChange={e => setProduct({ ...product, weight_per_box: parseFloat(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                disabled={isLimited}
                            />
                        </div>

                        <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                            <FieldLabel label={t('delivery_rate_usd_per_kg')} />
                            <div className="flex items-baseline gap-2">
                                <span className="text-xl font-black text-white/20">$</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                                    value={product.delivery_rate_usd_per_kg || ''}
                                    onChange={e => setProduct({ ...product, delivery_rate_usd_per_kg: parseFloat(e.target.value) || 0 })}
                                    onFocus={(e) => e.target.select()}
                                    disabled={isLimited}
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                            <FieldLabel label={t('usd_rate')} />
                            <input
                                type="number"
                                step="0.01"
                                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                                value={product.usd_rate || ''}
                                onChange={e => setProduct({ ...product, usd_rate: parseFloat(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                disabled={isLimited}
                            />
                        </div>

                        <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                            <FieldLabel label={t('service_percent')} />
                            <input
                                type="number"
                                step="0.1"
                                className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                                value={product.service_percent || ''}
                                onChange={e => setProduct({ ...product, service_percent: parseFloat(e.target.value) || 0 })}
                                onFocus={(e) => e.target.select()}
                                disabled={isLimited}
                            />
                        </div>
                    </div>

                    {/* Calculated Preview Section */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-8 border-t border-white/5">
                        {/* Formulas applied here following the backend logic */}
                        {(() => {
                            const val = (n: number | undefined) => n || 0;
                            const total_weight = val(product.places_count) * val(product.weight_per_box);
                            const product_cost_kgs = val(product.price_cny) * val(product.quantity) * val(product.cny_rate);
                            const delivery_cost_usd = total_weight * val(product.delivery_rate_usd_per_kg);
                            const delivery_cost_kgs = delivery_cost_usd * val(product.usd_rate);
                            const service_fee = product_cost_kgs * (val(product.service_percent) / 100);
                            const final_cost = product_cost_kgs + delivery_cost_kgs + service_fee;

                            const parseVol = (s: string | null | undefined, p: number) => {
                                if (!s || !p) return 0;
                                try {
                                    const parts = s.toLowerCase().replace(/\*/g, 'x').replace(/ /g, '').replace(/,/g, '.').split('x').map(parseFloat).filter(n => !isNaN(n));
                                    if (parts.length >= 3) {
                                        const rawBox = parts[0] * parts[1] * parts[2];
                                        if (rawBox > 10) return (rawBox * p) / 1000000;
                                        return rawBox * p;
                                    }
                                } catch (e) { }
                                return 0;
                            };
                            const total_volume = parseVol(product.packaging_size, val(product.places_count));
                            const density = total_volume > 0 ? total_weight / total_volume : 0;

                            const CalcItem = ({ label, value, unit, precision = 2 }: { label: string, value: number, unit: string, precision?: number }) => (
                                <div className="glass-morphism p-5 rounded-2xl border border-white/5 flex flex-col justify-center bg-white/[0.01]">
                                    <div className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{label}</div>
                                    <div className="text-xl font-black text-white flex items-baseline gap-1">
                                        {value.toLocaleString(undefined, { minimumFractionDigits: precision, maximumFractionDigits: precision })}
                                        <span className="text-[10px] text-white/20">{unit}</span>
                                    </div>
                                </div>
                            );

                            return (
                                <>
                                    <CalcItem label={t('total_weight')} value={total_weight} unit="KG" />
                                    <CalcItem label={t('product_cost')} value={product_cost_kgs} unit="KGS" />
                                    <CalcItem label={t('delivery_cost_usd')} value={delivery_cost_usd} unit="USD" />
                                    <CalcItem label={t('delivery_cost_kgs')} value={delivery_cost_kgs} unit="KGS" />
                                    <CalcItem label={t('service_fee')} value={service_fee} unit="KGS" />
                                    <CalcItem label={t('total_volume')} value={total_volume} unit="m³" precision={4} />
                                    <CalcItem label={t('density')} value={density} unit="kg/m³" />
                                    <div className="glass-morphism p-5 rounded-2xl border border-primary/20 bg-primary/5 flex flex-col justify-center shadow-glow-teal/5 lg:col-span-full mt-2">
                                        <div className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1">{t('final_total_cost')}</div>
                                        <div className="text-2xl font-black text-white flex items-baseline gap-1">
                                            {final_cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            <span className="text-[10px] text-white/40">KGS</span>
                                        </div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* Logistics Stats Grid */}
            {showFinancials && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                        <FieldLabel label={t('weight_kg')} error={errors.weight_kg} />
                        <input
                            type="number"
                            step="0.001"
                            min="0"
                            className="w-full text-2xl font-black bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                            value={product.weight_kg || ''}
                            onChange={e => setProduct({ ...product, weight_kg: parseFloat(e.target.value) || 0 })}
                            onFocus={(e) => e.target.select()}
                            disabled={isLimited}
                            placeholder="0.000"
                        />
                    </div>

                    <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                        <FieldLabel label={t('product_dimensions')} error={errors.size} />
                        <input
                            type="text"
                            maxLength={100}
                            className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                            value={product.size ?? ''}
                            onChange={e => setProduct({ ...product, size: e.target.value })}
                            disabled={isLimited}
                            placeholder={t('dimensions_placeholder')}
                        />
                    </div>

                    <div className="glass-morphism p-6 rounded-3xl border border-white/5 group hover:neon-border-teal transition-all">
                        <FieldLabel label={t('packaging_size')} error={errors.packaging_size} />
                        <input
                            type="text"
                            maxLength={100}
                            className="w-full text-xl font-bold bg-transparent border-none focus:ring-0 p-0 outline-none text-white placeholder:text-white/5"
                            value={product.packaging_size ?? ''}
                            onChange={e => setProduct({ ...product, packaging_size: e.target.value })}
                            disabled={isLimited}
                            placeholder={t('box_size_placeholder')}
                        />
                    </div>
                </div>
            )}

            {/* Structured Specifications Card */}
            <div className="glass-morphism p-8 rounded-[2.5rem] border border-white/5 hover:neon-border-teal transition-all">
                <div className="flex items-center justify-between mb-6">
                    <FieldLabel label={t('structured_specs')} />
                    {!isLimited && (
                        <button
                            type="button"
                            onClick={() => {
                                const key = prompt(t('spec_name'));
                                if (key) {
                                    setProduct({
                                        ...product,
                                        specifications: { ...product.specifications, [key]: '' }
                                    });
                                }
                            }}
                            className="text-[10px] font-black text-primary hover:text-white transition-colors uppercase tracking-widest px-3 py-1 bg-primary/10 rounded-lg border border-primary/20"
                        >
                            + {t('add_spec')}
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                        <div key={key} className="flex flex-col gap-2 p-4 bg-white/[0.02] rounded-2xl border border-white/5 group/spec">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{key}</span>
                                {!isLimited && (
                                    <button
                                        onClick={() => {
                                            const newSpecs = { ...product.specifications };
                                            delete newSpecs[key];
                                            setProduct({ ...product, specifications: newSpecs });
                                        }}
                                        className="text-rose-500 opacity-0 group-hover/spec:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </div>
                            <input
                                className="bg-transparent border-none p-0 text-sm font-bold text-white focus:ring-0 outline-none placeholder:text-white/5"
                                value={value as string}
                                onChange={e => {
                                    setProduct({
                                        ...product,
                                        specifications: { ...product.specifications, [key]: e.target.value }
                                    });
                                }}
                                disabled={isLimited}
                                placeholder="..."
                            />
                        </div>
                    ))}
                    {Object.keys(product.specifications || {}).length === 0 && (
                        <div className="md:col-span-2 py-8 text-center text-white/10 text-[10px] font-black uppercase tracking-widest italic border border-dashed border-white/5 rounded-2xl">
                            {t('no_specs_added')}
                        </div>
                    )}
                </div>
            </div>

            {/* Specifications Card (Notes) */}
            <div className={cn(
                "glass-morphism p-8 rounded-[2.5rem] border transition-all",
                errors.characteristics ? "border-rose-500/30 bg-rose-500/[0.02]" : "border-white/5 hover:neon-border-teal"
            )}>
                <FieldLabel label={t('additional_notes')} error={errors.characteristics} />
                <textarea
                    rows={4}
                    maxLength={1000}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 outline-none text-sm font-bold leading-loose text-white/70 resize-none h-[100px] custom-scrollbar placeholder:text-white/5"
                    value={product.characteristics ?? ''}
                    onChange={e => setProduct({ ...product, characteristics: e.target.value })}
                    disabled={isLimited}
                    placeholder={t('technical_specs_placeholder')}
                />
                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-black text-white/10 uppercase tracking-widest italic">{t('vertical_workflow')}</span>
                    <span className="text-[10px] font-black text-white/20">{product.characteristics?.length ?? 0} / 1000</span>
                </div>
            </div>

            {/* Media Upload Section */}
            <div className="glass-morphism p-8 rounded-[3rem] border border-white/5">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className="text-lg font-black text-white tracking-tight">{t('visual_assets')}</h3>
                        <p className="text-[10px] font-black text-white/20 uppercase tracking-[.2em] mt-1">{t('media_subtitle')}</p>
                    </div>
                    <div className="flex gap-4">
                        {!isLimited && (
                            <button
                                type="button"
                                onClick={addUrlManually}
                                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-white/40 uppercase tracking-widest transition-all border border-white/10 flex items-center gap-2"
                            >
                                <LinkIcon size={12} /> {t('external_url')}
                            </button>
                        )}
                        <div className="px-4 py-2 bg-primary/10 rounded-xl text-[10px] font-black text-primary uppercase tracking-widest border border-primary/20 flex items-center gap-2">
                            {urls.length} {t('stacked_count')}
                        </div>
                    </div>
                </div>

                {!isLimited && (
                    <div
                        onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleDrop}
                        className={cn(
                            "border-2 border-dashed rounded-[2rem] p-12 text-center transition-all mb-8 cursor-pointer relative group overflow-hidden",
                            dragOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-white/10 hover:border-primary/40 hover:bg-white/5"
                        )}
                        onClick={() => !uploading && fileInputRef.current?.click()}
                    >
                        {uploading ? (
                            <div className="flex flex-col items-center gap-4 text-primary">
                                <div className="relative">
                                    <Loader2 size={42} className="animate-spin" />
                                    <div className="absolute inset-0 bg-primary blur-xl opacity-20" />
                                </div>
                                <div>
                                    <div className="text-base font-black uppercase tracking-widest">
                                        {t('syncing')} {uploadProgress?.done ?? 0} {t('of')} {uploadProgress?.total ?? '?'}
                                    </div>
                                    <div className="text-[10px] font-bold text-white/20 mt-1">{t('powered_by')}</div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-4 text-white/20 group-hover:text-primary transition-colors">
                                <Upload size={42} />
                                <div>
                                    <div className="text-base font-black uppercase tracking-widest">{t('deploy_assets')}</div>
                                    <div className="text-[10px] font-bold mt-1 uppercase tracking-widest">{t('drag_drop_browse')}</div>
                                </div>
                            </div>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="hidden"
                            onChange={e => e.target.files && handleFiles(e.target.files)}
                        />
                    </div>
                )}

                {uploadError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-bold text-rose-500 flex items-center gap-3"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        {uploadError}
                    </motion.div>
                )}

                {urls.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {urls.map((url, i) => (
                            <MediaCard
                                key={i}
                                url={url}
                                onRemove={() => removeUrl(i)}
                                onClick={() => setSelectedMedia(url)}
                                disabled={isLimited}
                                t={t}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-white/[0.02] rounded-[2rem] border border-white/5 text-white/10 text-xs font-black uppercase tracking-widest">
                        {t('zero_visual_data')}
                    </div>
                )}
            </div>

            <MediaLightbox url={selectedMedia} onClose={() => setSelectedMedia(null)} t={t} />
        </div>
    );
};
