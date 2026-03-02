export enum UserRole {
    ADMIN = "Admin",
    MANAGER = "Manager",
    ACCOUNTANT = "Accountant",
    LOGISTICS = "Logistics",
}

export enum CargoStatus {
    PENDING = "Pending",
    IN_WAREHOUSE = "In Warehouse",
    IN_TRANSIT = "In Transit",
    DELIVERED = "Delivered",
}

export enum PaymentStatus {
    UNPAID = "Unpaid",
    PARTIALLY_PAID = "Partially Paid",
    PAID = "Paid",
}

export enum ShippingMethod {
    AIR = "Air",
    SEA = "Sea",
    RAIL = "Rail",
    TRUCK = "Truck",
}

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
}

export interface Product {
    id: number;
    product_name: string;
    supplier_name: string;
    order_number: string;
    category?: string;
    purchase_price: number;
    currency: string;
    exchange_rate: number;
    customs_cost: number;
    delivery_cost: number;
    margin_percent: number;
    final_total_cost: number;
    payment_status: PaymentStatus;
    payment_date?: string;
    outstanding_balance: number;
    invoice_number?: string;
    weight_kg: number;
    volume_m3: number;
    quantity: number;
    shipping_method: ShippingMethod;
    tracking_number?: string;
    status: CargoStatus;
    estimated_arrival_date?: string;
    actual_arrival_date?: string;
    updated_at: string;
    // New fields
    media_urls?: string[] | null;
    characteristics?: string | null;
    price: number;
    weight?: number | null;
    size?: string | null;
    packaging_size?: string | null;

    // New Restructured Fields
    price_cny: number;
    cny_rate: number;
    places_count: number;
    weight_per_box: number;
    delivery_rate_usd_per_kg: number;
    usd_rate: number;
    service_percent: number;

    // Calculated Fields
    total_weight: number;
    product_cost_kgs: number;
    delivery_cost_usd: number;
    delivery_cost_kgs: number;
    service_fee: number;
    final_cost: number;
    total_volume: number;
    density: number;

    // Structured Data
    specifications?: Record<string, any>;

    // Legacy Fields
    total_cost_som?: number;
}
