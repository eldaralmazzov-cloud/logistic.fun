import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'ru';

interface Translations {
    [key: string]: {
        [lang in Language]: string;
    };
}

export const translations: Translations = {
    // Sidebar
    dashboard: { en: 'Dashboard', ru: 'Панель' },
    orders: { en: 'Orders', ru: 'Заказы' },
    analytics: { en: 'Analytics', ru: 'Аналитика' },
    logistics: { en: 'Logistics', ru: 'Логистика' },
    settings: { en: 'Settings', ru: 'Настройки' },
    logout: { en: 'Logout', ru: 'Выйти' },
    logistics_subtitle: { en: 'Logistics & control systems', ru: 'Логистические системы и контроль' },

    // Dashboard
    admin_dashboard: { en: 'Admin Dashboard', ru: 'Панель управления' },
    global_ops: { en: 'Global logistics operations and performance', ru: 'Глобальные логистические операции и показатели' },
    add_new_order: { en: 'Add New Order', ru: 'Добавить заказ' },
    total_orders: { en: 'Total Orders', ru: 'Всего заказов' },
    pending_payments: { en: 'Pending Payments', ru: 'Ожидают оплаты' },
    total_revenue: { en: 'Total Revenue', ru: 'Общая выручка' },
    logistics_costs: { en: 'Logistics Costs', ru: 'Затраты на логистику' },
    overdue_payments: { en: 'Overdue payments', ru: 'Просроченные платежи' },
    revenue_vs_costs: { en: 'Revenue vs. Logistics Costs', ru: 'Выручка vs Затраты' },
    cargo_status: { en: 'Cargo Status', ru: 'Статус груза' },
    units: { en: 'Units', ru: 'Ед.' },
    units_count: { en: 'UNITS', ru: 'ЕД.' },
    costs: { en: 'Costs', ru: 'Затраты' },
    data_field: { en: 'Data Field', ru: 'Поле данных' },
    data_field_for: { en: 'Data Field For', ru: 'Поле данных для' },
    add_product: { en: 'ADD PRODUCT', ru: 'ДОБАВИТЬ ТОВАР' },
    recent_products: { en: 'Recently Added Products', ru: 'Недавно добавленные товары' },
    packaging_size: { en: 'Packaging Size', ru: 'Размер упаковки' },
    new_product: { en: 'New Product', ru: 'Новый товар' },
    edit_product: { en: 'Edit Product', ru: 'Редактирование товара' },
    select_or_add: { en: 'Select a product from the list or click "ADD PRODUCT"', ru: 'Выберите товар из списка или нажмите кнопку «ДОБАВИТЬ ТОВАР»' },
    quick_actions: { en: 'Quick Actions', ru: 'Быстрые действия' },
    new_snapshot: { en: 'New Snapshot', ru: 'Новый снимок' },
    live_intelligence: { en: 'Live Intelligence', ru: 'Активная аналитика' },
    active_shipments_tracker: { en: 'Active Shipments Tracker', ru: 'Трекер активных отгрузок' },
    search_placeholder: { en: 'Identify product or order...', ru: 'Идентификация товара или заказа...' },
    search_everything: { en: 'Search everything...', ru: 'Искать везде...' },
    scanning_ops: { en: 'SCANNING OPERATIONS...', ru: 'СКАНИРОВАНИЕ ОПЕРАЦИЙ...' },
    no_records_match: { en: 'Zero Records Match', ru: 'Записи не найдены' },
    operational_shortcuts: { en: 'Operational shortcuts', ru: 'Операционные ярлыки' },
    download_report: { en: 'Download Report', ru: 'Скачать отчет' },
    action_required_shipments: { en: 'Action required to release shipments.', ru: 'Требуются действия для выпуска груза.' },
    view_details: { en: 'View Details', ru: 'Подробнее' },
    performance_10_shipments: { en: 'Performance over last 10 shipments', ru: 'Показатели за последние 10 отгрузок' },
    live_shipment_dist: { en: 'Live shipment distribution', ru: 'Распределение текущих отгрузок' },
    no_products_added: { en: 'No products added', ru: 'Нет добавленных товаров' },
    product_name_placeholder: { en: 'Enter product name...', ru: 'Введите название товара...' },
    cancel: { en: 'Cancel', ru: 'Отмена' },
    save: { en: 'SAVE', ru: 'СОХРАНИТЬ' },

    // Products Registry
    registry: { en: 'Registry', ru: 'Реестр' },
    scanning_db: { en: 'Scanning Remote Database...', ru: 'Сканирование удаленной базы данных...' },
    zero_records: { en: 'Zero Records match your query', ru: 'Записи не найдены' },
    global_supply_chain: { en: 'Global Supply Chain', ru: 'Глобальная цепочка поставок' },
    final_value: { en: 'Final Value', ru: 'Итоговая стоимость' },
    restricted_entry: { en: 'Restricted Entry', ru: 'Доступ ограничен' },
    registry_offset: { en: 'Registry Offset', ru: 'Смещение реестра' },
    prev_page: { en: 'Prev_Page', ru: 'Пред_Стр' },
    next_page_scan: { en: 'Next_Page_Scan', ru: 'Скан_След_Стр' },
    inventory_terminal: { en: 'Inventory Management Terminal', ru: 'Терминал управления инвентарем' },
    records_found: { en: 'Records found', ru: 'Записей найдено' },
    export_data: { en: 'Export Data', ru: 'Экспорт данных' },
    search_product_placeholder: { en: 'Identify Product, Supplier or Order UID...', ru: 'Поиск товара, поставщика или ID заказа...' },
    all_units: { en: 'All Units', ru: 'Все единицы' },
    all_payments: { en: 'All Payments', ru: 'Все платежи' },
    all_statuses: { en: 'All Statuses', ru: 'Все статусы' },
    value_analysis: { en: 'Value Analysis', ru: 'Анализ стоимости' },
    no_records_match_query: { en: 'Zero Records match your query', ru: 'По вашему запросу ничего не найдено' },
    next_page: { en: 'Next_Page', ru: 'След_Стр' },
    initializing_terminal: { en: 'Initializing Terminal...', ru: 'Инициализация терминала...' },
    overdue_payments_banner: { en: 'Overdue payments.', ru: 'Просроченных платежей.' },
    update_success: { en: 'Updated successfully!', ru: 'Успешно обновлено!' },
    failed_save: { en: 'Failed to save.', ru: 'Не удалось сохранить.' },
    error: { en: 'Error', ru: 'Ошибка' },

    // Validation
    max_1000_chars: { en: 'Max 1000 characters', ru: 'Макс. 1000 символов' },
    price_required: { en: 'Price is required', ru: 'Цена обязательна' },
    price_positive: { en: 'Price must be a positive number', ru: 'Цена должна быть положительным числом' },
    weight_positive: { en: 'Weight must be a positive number', ru: 'Вес должен быть положительным числом' },
    weight_kg_positive: { en: 'Weight (kg) must be a positive number', ru: 'Вес (кг) должен быть положительным числом' },
    max_100_chars: { en: 'Max 100 characters', ru: 'Макс. 100 символов' },
    quantity_required: { en: 'Quantity is required', ru: 'Количество обязательно' },
    quantity_integer: { en: 'Quantity must be an integer ≥ 0', ru: 'Количество должно быть целым числом ≥ 0' },

    // Table Headers
    order_id: { en: 'Order ID', ru: 'ID Заказа' },
    product: { en: 'Product', ru: 'Товар' },
    supplier: { en: 'Supplier', ru: 'Поставщик' },
    status: { en: 'Status', ru: 'Статус' },
    weight: { en: 'Weight', ru: 'Вес' },
    volume: { en: 'Volume', ru: 'Объем' },
    payment: { en: 'Payment', ru: 'Оплата' },

    // Auth & Audit
    username: { en: 'Username', ru: 'Имя пользователя' },
    email: { en: 'Email', ru: 'Электронная почта' },
    role: { en: 'Role', ru: 'Роль' },
    created_at: { en: 'Created At', ru: 'Дата создания' },
    timestamp: { en: 'Timestamp', ru: 'Временная метка' },
    action: { en: 'Action', ru: 'Действие' },
    details: { en: 'Details', ru: 'Детали' },

    // Settings
    system_settings: { en: 'System Settings', ru: 'Настройки системы' },
    global_rates: { en: 'Global Rates', ru: 'Глобальные тарифы' },
    security_roles: { en: 'Security & Roles', ru: 'Безопасность и роли' },
    system_audit: { en: 'System Audit', ru: 'Аудит системы' },
    appearance_lang: { en: 'Appearance & Language', ru: 'Внешний вид и язык' },
    select_language: { en: 'Select Application Language', ru: 'Выберите язык приложения' },
    coming_soon: { en: 'Coming Soon', ru: 'Скоро будет' },
    recalibrate: { en: 'RECALIBRATE SYSTEM DEFAULTS', ru: 'ПЕРЕКАЛИБРОВАТЬ СИСТЕМУ' },

    // Product Detail
    order_details: { en: 'Order Details', ru: 'Детали заказа' },
    back_to_list: { en: 'Back to list', ru: 'Назад к списку' },
    save_changes: { en: 'Commit Changes', ru: 'Сохранить изменения' },
    cancel_order: { en: 'Cancel Order', ru: 'Отменить заказ' },
    financial_overview: { en: 'Financial Overview', ru: 'Финансовый обзор' },
    logistics_info: { en: 'Logistics Info', ru: 'Логистическая инфо' },
    product_name: { en: 'Product Name', ru: 'Название товара' },
    quantity: { en: 'Quantity', ru: 'Количество' },
    purchase_price_unit: { en: 'Purchase Price / Unit', ru: 'Цена закупки / ед.' },
    total_purchase: { en: 'Total Purchase', ru: 'Общая закупка' },
    customs_rate: { en: 'Customs Rate', ru: 'Таможенная ставка' },
    delivery_rate: { en: 'Delivery Rate', ru: 'Ставка доставки' },
    margin_percent: { en: 'Margin (%)', ru: 'Маржа (%)' },
    final_cost_unit: { en: 'Final Cost / Unit', ru: 'Итоговая цена / ед.' },
    total_order_cost: { en: 'Total Order Cost', ru: 'Итоговая стоимость заказа' },
    overview: { en: 'Overview', ru: 'Обзор' },
    data: { en: 'Data', ru: 'Данные' },
    financial_metrics: { en: 'Financial Metrics', ru: 'Финансовые метрики' },
    unit_economics: { en: 'Unit Economics Analysis', ru: 'Анализ юнит-экономики' },
    profit_margin_sync: { en: 'Profitability & Margin Sync', ru: 'Синхронизация прибыли и маржи' },
    purchase_data_cny: { en: 'Purchase Data (CNY)', ru: 'Данные закупки (CNY)' },
    shipping_params: { en: 'Shipping Parameters', ru: 'Параметры доставки' },
    total_financial_load: { en: 'Total Financial Load', ru: 'Общая финансовая нагрузка' },
    margin_analysis: { en: 'Margin Analysis', ru: 'Анализ маржи' },
    market_value: { en: 'Calculated Market Value', ru: 'Расчетная рыночная стоимость' },
    final_logistics_value: { en: 'Final Logistics Value', ru: 'Итоговая логистическая стоимость' },
    weight_label: { en: 'Weight (KG)', ru: 'Вес (КГ)' },
    volume_label: { en: 'Volume (M³)', ru: 'Объем (М³)' },
    shipping_method: { en: 'Shipment Method', ru: 'Способ доставки' },
    cargo_track_status: { en: 'Cargo Track Status', ru: 'Статус отслеживания груза' },
    destination_hub: { en: 'Destination Hub', ru: 'Пункт назначения' },
    logistics_pipeline: { en: 'Logistics Pipeline', ru: 'Логистический конвейер' },
    historical_audit: { en: 'Historical Audit', ru: 'История аудита' },
    last_mod: { en: 'Last Modification', ru: 'Последнее изменение' },
    internal_id: { en: 'Internal ID', ru: 'Внутренний ID' },
    audit_trail: { en: 'Audit Trail', ru: 'Журнал аудита' },
    event: { en: 'Event', ru: 'Событие' },
    operator_label: { en: 'Operator', ru: 'Оператор' },
    committing: { en: 'Committing...', ru: 'Сохранение...' },
    order_saved: { en: 'Order saved', ru: 'Заказ сохранен' },
    confirm_deletion: { en: 'Confirm Deletion', ru: 'Подтвердите удаление' },
    irreversible_action: { en: 'This action is irreversible', ru: 'Это действие необратимо' },
    cancel_delete: { en: 'CANCEL_DELETE', ru: 'ОТМЕНА_УДАЛЕНИЯ' },
    confirm_erase: { en: 'CONFIRM_ERASE', ru: 'ПОДТВЕРДИТЬ_СТИРАНИЕ' },
    transaction_record: { en: 'Transaction Record', ru: 'Запись транзакции' },
    operator_profile: { en: 'Operator Profile', ru: 'Профиль оператора' },
    real_time_margin_analysis: { en: 'Real-time Margin Analysis', ru: 'Анализ маржи в реальном времени' },
    purchase_cost: { en: 'Purchase Cost', ru: 'Стоимость закупки' },
    customs_fee: { en: 'Customs Fee', ru: 'Таможенная пошлина' },
    logistics_net: { en: 'Logistics Net', ru: 'Логистическая сеть' },
    total_estimated_liability: { en: 'Total Estimated Liability', ru: 'Общие расчетные обязательства' },
    net_strategic_profit: { en: 'Net Strategic Profit', ru: 'Чистая стратегическая прибыль' },
    margin_scalar: { en: 'Margin Scalar (%)', ru: 'Маржинальный скаляр (%)' },
    positive: { en: 'Positive', ru: 'Положительно' },
    registry_identity: { en: 'Registry Identity', ru: 'Идентичность реестра' },
    order_label: { en: 'Order Label', ru: 'Метка заказа' },
    operational_unit_name: { en: 'Operational Unit Name', ru: 'Имя операционного подразделения' },
    logistics_serial: { en: 'Logistics Serial #', ru: 'Логистический серийный №' },
    supplier_entity: { en: 'Supplier Entity', ru: 'Поставщик' },
    manufacturer_vendor_name: { en: 'Manufacturer / Vendor Name', ru: 'Название производителя / поставщика' },
    batch_count: { en: 'Batch Count', ru: 'Количество в партии' },
    scale_unit: { en: 'Scale Unit', ru: 'Единица измерения' },
    status_protocol: { en: 'Status Protocol', ru: 'Протокол статуса' },
    system_state: { en: 'System State', ru: 'Состояние системы' },
    mass_kg: { en: 'Mass (kg)', ru: 'Масса (кг)' },
    vol_m3: { en: 'Vol (m³)', ru: 'Объем (м³)' },
    trace_id: { en: 'Trace ID', ru: 'Trace ID' },
    logged: { en: 'Logged', ru: 'Зарегистрировано' },
    forecasted: { en: 'Forecasted', ru: 'Прогноз' },
    audit_feed: { en: 'Audit Feed', ru: 'Лента аудита' },
    operational_history: { en: 'Operational History', ru: 'История операций' },
    events_count: { en: 'EVENTS', ru: 'СОБЫТИЙ' },
    zero_event_delta: { en: 'Zero Event Delta', ru: 'Нулевая дельта событий' },
    terminal_status: { en: 'Terminal Status', ru: 'Статус терминала' },
    operational_ready: { en: 'Operational Ready', ru: 'Операционно готов' },
    uploading: { en: 'Uploading...', ru: 'Загрузка...' },
    pcs: { en: 'PCS', ru: 'ШТ' },
    pending_arrival: { en: 'PENDING', ru: 'ОЖИДАЕТСЯ' },
    system_core: { en: 'SYSTEM_CORE', ru: 'ЯДРО_СИСТЕМЫ' },

    // Product Data Fields
    retail_price: { en: 'Retail Price ($)', ru: 'Розничная цена ($)' },
    global_selling_value: { en: 'Global Selling Value', ru: 'Глобальная цена продажи' },
    stock_quantity: { en: 'Stock Quantity', ru: 'Количество на складе' },
    units_in_warehouse: { en: 'Units in Warehouse', ru: 'Единиц на складе' },
    purchase_price_cny: { en: 'Purchase Price (CNY ¥)', ru: 'Цена закупки (CNY ¥)' },
    delivery_rate_kg: { en: 'Delivery ($ / kg)', ru: 'Доставка ($ / кг)' },
    weight_kg: { en: 'Weight (kg)', ru: 'Вес (кг)' },
    product_dimensions: { en: 'Product Dimensions', ru: 'Габариты товара' },
    dimensions_placeholder: { en: 'W × H × D cm', ru: 'Ш × В × Г см' },
    box_size_placeholder: { en: 'External Box size', ru: 'Размер внешней коробки' },
    technical_specs: { en: 'Technical Specifications', ru: 'Технические характеристики' },
    vertical_workflow: { en: 'Vertical Workflow Optimized', ru: 'Вертикальный воркфлоу оптимизирован' },
    visual_assets: { en: 'Visual Assets', ru: 'Визуальные активы' },
    media_subtitle: { en: 'Images & Motion media', ru: 'Изображения и видео' },
    external_url: { en: 'External URL', ru: 'Внешняя ссылка' },
    stacked_count: { en: 'STACKED', ru: 'ЗАГРУЖЕНО' },
    deploy_assets: { en: 'Deploy Assets', ru: 'Разместить активы' },
    drag_drop_browse: { en: 'Drag & Drop or Touch to Browse', ru: 'Перетащите сюда или нажмите для выбора' },
    syncing: { en: 'Syncing', ru: 'Синхронизация' },
    powered_by: { en: 'POWERED BY CLOUDINARY', ru: 'НА БАЗЕ CLOUDINARY' },
    zero_visual_data: { en: 'Zero visual data detected', ru: 'Визуальные данные не обнаружены' },
    open_original: { en: 'Open Original Source', ru: 'Открыть первоисточник' },
    total_cost_som_label: { en: 'Total Cost (SOM)', ru: 'Итоговая стоимость (СОМ)' },
    paste_media_url: { en: 'Paste image/video URL:', ru: 'Вставьте ссылку на фото/видео:' },
    technical_specs_placeholder: { en: '• Material: Aerospace Grade Aluminum\n• Finish: Matte Midnight\n• Connectivity: Bluetooth 5.3', ru: '• Материал: Авиационный алюминий\n• Отделка: Матовый полуночный\n• Связь: Bluetooth 5.3' },
    of: { en: 'of', ru: 'из' },
    img_short: { en: 'IMG', ru: 'ИЗО' },
    vid_short: { en: 'VID', ru: 'ВИД' },

    // Analytics
    strategic_intelligence: { en: 'Strategic Intelligence', ru: 'Стратегическая аналитика' },
    live_engine: { en: 'Live Engine', ru: 'Живой движок' },
    analytics_subtitle: { en: 'Financial metrics & shipment efficiency', ru: 'Финансовые метрики и эффективность отгрузок' },
    detailed_view: { en: 'Detailed View', ru: 'Детальный вид' },
    export_pdf: { en: 'Export PDF', ru: 'Экспорт PDF' },
    financial_trajectory: { en: 'Financial Trajectory', ru: 'Финансовая траектория' },
    revenue_vs_expense: { en: 'Revenue vs Operational Expense', ru: 'Выручка vs Операционные расходы' },
    revenue: { en: 'Revenue', ru: 'Выручка' },
    expense: { en: 'Expense', ru: 'Расходы' },
    logistics_load: { en: 'Logistics Load (kg)', ru: 'Логистическая нагрузка (кг)' },
    efficiency_rating: { en: 'Efficiency Rating', ru: 'Рейтинг эффективности' },
    efficiency_desc: { en: 'Current logistics throughput is performing above nominal levels for Q1 operations.', ru: 'Текущая логистическая пропускная способность выше номинальных уровней для операций Q1.' },
    strategic: { en: 'Strategic', ru: 'Стратегическая' },
    intelligence: { en: 'Intelligence', ru: 'Аналитика' },
    top_performer_base: { en: 'Top performer: China South Base', ru: 'Лучший показатель: Южная база Китая' },
    nominal: { en: 'nominal', ru: 'номинально' },
    above_nominal: { en: 'above nominal', ru: 'выше номинала' },
    status_mix: { en: 'Status Mix', ru: 'Микс статусов' },
    global: { en: 'Global', ru: 'Глобально' },
    growth_forecast: { en: 'Growth Forecast', ru: 'Прогноз роста' },
    quarterly_velocity: { en: 'Quarterly Velocity', ru: 'Квартальная скорость' },
    top_performer: { en: 'Top performer', ru: 'Лучший показатель' },
    deep_dive_report: { en: 'Deep Dive Report', ru: 'Подробный отчет' },
    syncing_analytics: { en: 'Syncing Analytics Core...', ru: 'Синхронизация ядра аналитики...' },

    // Login
    logistics_terminal_v4: { en: 'Logistics Terminal V.4', ru: 'Логистический терминал V.4' },
    security_access: { en: 'Security Access', ru: 'Секретный доступ' },
    identity_verification: { en: 'Identity verification required', ru: 'Требуется проверка личности' },
    operator_id: { en: 'Operator ID', ru: 'ID Оператора' },
    encryption_key: { en: 'Encryption Key', ru: 'Ключ шифрования' },
    initialize_access: { en: 'Initialize Access', ru: 'Инициализировать доступ' },
    syncing_login: { en: 'Syncing...', ru: 'Синхронизация...' },
    core_sync_error: { en: 'CORE_SYNC_ERROR: Backend terminal unreachable.', ru: 'ОШИБКА_СИНХРОНИЗАЦИИ_ЯДРА: Терминал бэкенда недоступен.' },
    invalid_credentials: { en: 'INVALID_CREDENTIALS: Access Denied.', ru: 'НЕВЕРНЫЕ_ДАННЫЕ: Доступ запрещен.' },
    unauthorized_access_warning: { en: 'WARNING: Unauthorized access to SINO209 logistics control is strictly prohibited. All attempts are monitored and traced.', ru: 'ПРЕДУПРЕЖДЕНИЕ: Несанкционированный доступ к управлению логистикой SINO209 строго запрещен. Все попытки отслеживаются.' },

    // Settings Extras
    core_architecture: { en: 'Core Architecture', ru: 'Ядро архитектуры' },
    global_config_terminal: { en: 'Global System Configuration Terminal', ru: 'Терминал глобальной конфигурации системы' },
    sys_status_stable: { en: 'Sys_Status: Stable', ru: 'Статус сист: Стабильно' },
    critical_performance_sync: { en: 'Critical Performance Sync', ru: 'Критическая синхронизация производительности' },
    critical_performance_desc: { en: 'These rates power the core shipment engine. Synchronization is real-time. Modifications impact all pending unit calculations and future registry entries. Internal ledger balances remain immutable.', ru: 'Эти ставки управляют основным движком отгрузок. Синхронизация в реальном времени. Изменения влияют на все ожидающие расчеты и будущие записи реестра. Балансы внутренних гроссбухов остаются неизменными.' },
    error_saving_setting: { en: 'Error saving setting', ru: 'Ошибка сохранения настройки' },
    language_selection: { en: 'Language Selection', ru: 'Выбор языка' },
    operator_registry: { en: 'Operator Registry', ru: 'Реестр операторов' },
    provision_new_operator: { en: 'Provision_New_Operator', ru: 'Создать_Нового_Оператора' },
    access_log: { en: 'Access_Log', ru: 'Лог_Доступа' },
    synced: { en: 'SYNCED', ru: 'СИНХРОНИЗИРОВАНО' },
    systems_audit_feed: { en: 'Systems_Audit_Feed', ru: 'Лента_Аудита_Систем' },
    live_monitoring_active: { en: 'Live_Monitoring_Active', ru: 'Живой_Мониторинг_Активен' },
    recalibrate_core_services: { en: 'Recalibrate_Core_Services', ru: 'Перекалибровать_Ядро_Сервисов' },
    initializing_sys_config: { en: 'Initializing System Configuration...', ru: 'Инициализация конфигурации системы...' },

    // Statuses & Enums
    status_pending: { en: 'Pending', ru: 'Ожидание' },
    status_in_transit: { en: 'In Transit', ru: 'В пути' },
    status_in_warehouse: { en: 'In Warehouse', ru: 'На складе' },
    status_delivered: { en: 'Delivered', ru: 'Доставлено' },
    payment_paid: { en: 'Paid', ru: 'Оплачено' },
    payment_overdue: { en: 'Overdue', ru: 'Просрочено' },
    shipping_air: { en: 'Air', ru: 'Авиа' },
    shipping_sea: { en: 'Sea', ru: 'Море' },
    shipping_land: { en: 'Land', ru: 'Наземный' },
    shipping_express: { en: 'Express', ru: 'Экспресс' },

    // New Fields & Specs
    cny_purchase_value: { en: 'CNY Purchase Value', ru: 'Стоимость закупки в CNY' },
    cny_rate: { en: 'CNY Rate', ru: 'Курс CNY' },
    places_count: { en: 'Places Count (Boxes)', ru: 'Кол-во мест (коробок)' },
    weight_per_box: { en: 'Weight per Box (kg)', ru: 'Вес коробки (кг)' },
    delivery_rate_usd_per_kg: { en: 'Delivery Rate ($/kg)', ru: 'Ставка доставки ($/кг)' },
    usd_rate: { en: 'USD Rate', ru: 'Курс USD' },
    service_percent: { en: 'Service (%)', ru: 'Комиссия (%)' },
    total_weight: { en: 'Total Weight', ru: 'Общий вес' },
    product_cost: { en: 'Product Cost', ru: 'Стоимость товара' },
    delivery_cost_usd: { en: 'Delivery Cost (USD)', ru: 'Доставка (USD)' },
    delivery_cost_kgs: { en: 'Delivery Cost (KGS)', ru: 'Доставка (СОМ)' },
    service_fee: { en: 'Service Fee', ru: 'Комиссия сервиса' },
    final_total_cost: { en: 'Final Total Cost', ru: 'Итоговая себестоимость' },
    total_volume: { en: 'Total Volume (m³)', ru: 'Общий объем (м³)' },
    density: { en: 'Density (kg/m³)', ru: 'Плотность (кг/м³)' },
    structured_specs: { en: 'Product Parameters', ru: 'Параметры товара' },
    add_spec: { en: 'Add parameter', ru: 'Добавить параметр' },
    spec_name: { en: 'Parameter Name:', ru: 'Название параметра:' },
    no_specs_added: { en: 'No parameters added yet', ru: 'Параметры еще не добавлены' },
    additional_notes: { en: 'Additional Notes', ru: 'Дополнительные примечания' },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguageState] = useState<Language>(() => {
        return (localStorage.getItem('app_lang') as Language) || 'en';
    });

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('app_lang', lang);
    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) throw new Error('useLanguage must be used within LanguageProvider');
    return context;
};
