// Centralized Spanish translation system with type-safe keys

type TranslationKey =
  // Navigation
  | 'nav.dashboard'
  | 'nav.inventory'
  | 'nav.rates'
  | 'nav.sales'
  | 'nav.customers'
  | 'nav.cashbox'
  | 'nav.suppliers'
  | 'nav.closures'
  // Actions
  | 'action.search'
  | 'action.export'
  | 'action.cancel'
  | 'action.create'
  | 'action.save'
  | 'action.edit'
  | 'action.delete'
  | 'action.view'
  | 'action.loading'
  | 'action.saving'
  | 'action.creating'
  | 'action.back'
  | 'action.add'
  | 'action.actions'
  // Auth
  | 'auth.sign_in'
  | 'auth.sign_out'
  | 'auth.signing_in'
  | 'auth.sign_in_required'
  | 'auth.sign_in_to_create'
  | 'auth.sign_in_error'
  // Inventory
  | 'inventory.title'
  | 'inventory.subtitle'
  | 'inventory.add_product'
  | 'inventory.no_products'
  | 'inventory.low_stock_alert'
  | 'inventory.low_stock_description'
  | 'inventory.low_stock_description_plural'
  | 'inventory.all_categories'
  | 'inventory.start_adding'
  | 'inventory.no_products_category'
  | 'inventory.no_description'
  | 'inventory.low_stock_badge'
  | 'inventory_form.create_title'
  | 'inventory_form.edit_title'
  | 'inventory_form.description'
  | 'inventory_form.description_placeholder'
  | 'inventory_form.photo'
  | 'inventory_form.upload_photo'
  | 'inventory_form.category'
  | 'inventory_form.category_placeholder'
  | 'inventory_form.profit_margin'
  | 'inventory_form.stock_current'
  | 'inventory_form.stock_min'
  | 'inventory_form.cost_usd'
  | 'inventory_form.sell_retail'
  | 'inventory_form.sell_wholesale'
  | 'inventory_form.sell_special'
  | 'inventory_form.success_create'
  | 'inventory_form.success_update'
  // Customers
  | 'customers.add_customer'
  | 'customers.list_title'
  | 'customers.no_customers'
  | 'customers.name'
  | 'customers.contact'
  | 'customers.debt'
  | 'customers.status'
  | 'customers.create_title'
  | 'customers.name_placeholder'
  | 'customers.contact_placeholder'
  | 'customers.success_create'
  | 'customers.overdue_alert'
  | 'customers.overdue_badge'
  // Customer Detail
  | 'customer_detail.not_found'
  | 'customer_detail.not_found_description'
  | 'customer_detail.current_debt'
  | 'customer_detail.customer_id'
  | 'customer_detail.backend_required'
  | 'customer_detail.backend_description'
  // Suppliers
  | 'suppliers.add_supplier'
  | 'suppliers.list_title'
  | 'suppliers.no_suppliers'
  | 'suppliers.name'
  | 'suppliers.contact'
  | 'suppliers.contact_info'
  | 'suppliers.address'
  | 'suppliers.create_title'
  | 'suppliers.name_placeholder'
  | 'suppliers.contact_placeholder'
  | 'suppliers.address_placeholder'
  | 'suppliers.success_create'
  // Supplier Detail
  | 'supplier_detail.not_found'
  | 'supplier_detail.not_found_description'
  | 'supplier_detail.info_title'
  | 'supplier_detail.created_at'
  // Rates
  | 'rates.title'
  | 'rates.subtitle'
  | 'rates.current_rate'
  | 'rates.add_rate'
  | 'rates.add_new_rate'
  | 'rates.history'
  | 'rates.no_rates'
  | 'rates.bcv_ves'
  | 'rates.cop'
  | 'rates.date'
  | 'rates.success'
  | 'rates.success_add'
  | 'rates.error'
  | 'rates.adding'
  // Sales
  | 'sales.title'
  | 'sales.subtitle'
  | 'sales.search_product'
  | 'sales.search_products'
  | 'sales.cart'
  | 'sales.empty_cart'
  | 'sales.total'
  | 'sales.payment_method'
  | 'sales.immediate'
  | 'sales.credit'
  | 'sales.customer_name'
  | 'sales.customer_name_placeholder'
  | 'sales.complete_sale'
  | 'sales.success'
  | 'sales.error'
  | 'sales.retail'
  | 'sales.wholesale'
  | 'sales.special'
  | 'sales.quantity'
  | 'sales.price_type'
  | 'sales.subtotal'
  | 'sales.payment_term'
  | 'sales.clear_cart'
  | 'sales.processing'
  | 'sales.insufficient_stock'
  | 'sales.customer_required'
  | 'sales.cash_customer'
  | 'sales.start_adding_products'
  // Cashbox
  | 'cashbox.title'
  | 'cashbox.subtitle'
  | 'cashbox.add_entry'
  | 'cashbox.add_new_entry'
  | 'cashbox.entries'
  | 'cashbox.no_entries'
  | 'cashbox.totals'
  | 'cashbox.type'
  | 'cashbox.amount'
  | 'cashbox.amount_usd'
  | 'cashbox.currency'
  | 'cashbox.description'
  | 'cashbox.description_placeholder'
  | 'cashbox.date'
  | 'cashbox.income'
  | 'cashbox.expense'
  | 'cashbox.entry_type'
  | 'cashbox.entry_in'
  | 'cashbox.entry_out'
  | 'cashbox.balance'
  | 'cashbox.filter_all'
  | 'cashbox.filter_in'
  | 'cashbox.filter_out'
  | 'cashbox.start_adding'
  | 'cashbox.success'
  | 'cashbox.error'
  | 'cashbox.adding'
  // Closures
  | 'closures.title'
  | 'closures.subtitle'
  | 'closures.create_closure'
  | 'closures.create_new'
  | 'closures.history'
  | 'closures.no_closures'
  | 'closures.opening_balance'
  | 'closures.opening_balance_help'
  | 'closures.closing_balance'
  | 'closures.total_income'
  | 'closures.total_expenses'
  | 'closures.created_by'
  | 'closures.created_at'
  | 'closures.current_cashbox'
  | 'closures.current_totals'
  | 'closures.entries'
  | 'closures.net_change'
  | 'closures.start_adding'
  | 'closures.success'
  | 'closures.error'
  | 'closures.creating'
  | 'closures.create'
  | 'closures.login_required'
  // Dashboard
  | 'dashboard.title'
  | 'dashboard.subtitle'
  | 'dashboard.total_products'
  | 'dashboard.total_customers'
  | 'dashboard.low_stock'
  | 'dashboard.low_stock_alert'
  | 'dashboard.low_stock_items'
  | 'dashboard.overdue_customers'
  | 'dashboard.overdue_payments'
  | 'dashboard.total_debt'
  | 'dashboard.cash_balance'
  | 'dashboard.overdue'
  | 'dashboard.product'
  | 'dashboard.products'
  | 'dashboard.below_minimum'
  | 'dashboard.customer'
  | 'dashboard.customers'
  | 'dashboard.has_overdue'
  | 'dashboard.have_overdue'
  | 'dashboard.category'
  | 'dashboard.and_more'
  | 'dashboard.no_contact_info'
  | 'dashboard.overdue_sale'
  | 'dashboard.overdue_sales'
  // Analytics
  | 'analytics.top_selling_products'
  | 'analytics.top_searched_products'
  | 'analytics.net_profit_by_period'
  | 'analytics.net_profit_analysis'
  | 'analytics.no_sales_data'
  | 'analytics.no_search_data'
  | 'analytics.no_profit_data'
  | 'analytics.units_sold'
  | 'analytics.searches'
  | 'analytics.sales'
  | 'analytics.net_profit'
  | 'analytics.profit_margin'
  | 'analytics.margin'
  | 'analytics.daily'
  | 'analytics.weekly'
  | 'analytics.monthly'
  // Search
  | 'search.title'
  | 'search.placeholder'
  | 'search.searching'
  | 'search.no_results'
  // Overdue
  | 'overdue.badge'
  | 'overdue.alert_title'
  | 'overdue.customer_has'
  | 'overdue.count_has'
  | 'overdue.count_have'
  | 'overdue.generic'
  // Table
  | 'table.id'
  | 'table.description'
  | 'table.category'
  | 'table.stock'
  | 'table.stock_min'
  | 'table.cost_usd'
  | 'table.retail_usd'
  | 'table.wholesale_usd'
  | 'table.special_usd'
  | 'table.retail_ves'
  | 'table.retail_cop'
  // CSV
  | 'csv.yes'
  | 'csv.no'
  | 'csv.in'
  | 'csv.out'
  | 'csv.id'
  | 'csv.description'
  | 'csv.category'
  | 'csv.stock_current'
  | 'csv.stock_min'
  | 'csv.cost_usd'
  | 'csv.sell_retail_usd'
  | 'csv.sell_wholesale_usd'
  | 'csv.sell_special_usd'
  | 'csv.profit_margin'
  | 'csv.has_photo'
  | 'csv.name'
  | 'csv.contact_info'
  | 'csv.debt_usd'
  | 'csv.type'
  | 'csv.timestamp'
  | 'csv.currency'
  | 'csv.amount_usd'
  | 'csv.date'
  | 'csv.bcv_ves_per_usd'
  | 'csv.cop_per_usd'
  // Export
  | 'export.title'
  | 'export.description'
  | 'export.inventory'
  | 'export.customers'
  | 'export.cashbox_entries'
  | 'export.exchange_rates'
  | 'export.items'
  | 'export.entries'
  | 'export.rates'
  | 'export.action'
  | 'export.exporting'
  | 'export.success'
  | 'export.error'
  // Footer
  | 'footer.rights'
  | 'footer.built_with';

const translations: Record<TranslationKey, string> = {
  // Navigation
  'nav.dashboard': 'Panel',
  'nav.inventory': 'Inventario',
  'nav.rates': 'Tasas',
  'nav.sales': 'Ventas',
  'nav.customers': 'Clientes',
  'nav.cashbox': 'Caja',
  'nav.suppliers': 'Proveedores',
  'nav.closures': 'Cierres',
  // Actions
  'action.search': 'Buscar',
  'action.export': 'Exportar',
  'action.cancel': 'Cancelar',
  'action.create': 'Crear',
  'action.save': 'Guardar',
  'action.edit': 'Editar',
  'action.delete': 'Eliminar',
  'action.view': 'Ver',
  'action.loading': 'Cargando...',
  'action.saving': 'Guardando...',
  'action.creating': 'Creando...',
  'action.back': 'Volver',
  'action.add': 'Agregar',
  'action.actions': 'Acciones',
  // Auth
  'auth.sign_in': 'Iniciar sesión',
  'auth.sign_out': 'Cerrar sesión',
  'auth.signing_in': 'Iniciando sesión...',
  'auth.sign_in_required': 'Inicia sesión para agregar/editar',
  'auth.sign_in_to_create': 'Debes iniciar sesión para crear productos, clientes y proveedores',
  'auth.sign_in_error': 'Error al iniciar sesión',
  // Inventory
  'inventory.title': 'Inventario',
  'inventory.subtitle': 'Gestiona tu inventario de productos',
  'inventory.add_product': 'Agregar Producto',
  'inventory.no_products': 'No hay productos en el inventario',
  'inventory.low_stock_alert': 'Productos con stock bajo',
  'inventory.low_stock_description': '{count} producto está por debajo del stock mínimo',
  'inventory.low_stock_description_plural': '{count} productos están por debajo del stock mínimo',
  'inventory.all_categories': 'Todas las categorías',
  'inventory.start_adding': 'Comienza agregando tu primer producto',
  'inventory.no_products_category': 'No hay productos en esta categoría',
  'inventory.no_description': 'Sin descripción',
  'inventory.low_stock_badge': 'Stock Bajo',
  'inventory_form.create_title': 'Crear Producto',
  'inventory_form.edit_title': 'Editar Producto',
  'inventory_form.description': 'Descripción',
  'inventory_form.description_placeholder': 'Descripción del producto',
  'inventory_form.photo': 'Foto',
  'inventory_form.upload_photo': 'Subir foto',
  'inventory_form.category': 'Categoría',
  'inventory_form.category_placeholder': 'Ej: Repuestos, Accesorios',
  'inventory_form.profit_margin': 'Margen de Ganancia (%)',
  'inventory_form.stock_current': 'Stock Actual',
  'inventory_form.stock_min': 'Stock Mínimo',
  'inventory_form.cost_usd': 'Costo (USD)',
  'inventory_form.sell_retail': 'Precio Detal (USD)',
  'inventory_form.sell_wholesale': 'Precio Mayor (USD)',
  'inventory_form.sell_special': 'Precio Especial (USD)',
  'inventory_form.success_create': 'Producto creado exitosamente',
  'inventory_form.success_update': 'Producto actualizado exitosamente',
  // Customers
  'customers.add_customer': 'Agregar Cliente',
  'customers.list_title': 'Lista de Clientes',
  'customers.no_customers': 'No hay clientes registrados',
  'customers.name': 'Nombre',
  'customers.contact': 'Contacto',
  'customers.debt': 'Deuda',
  'customers.status': 'Estado',
  'customers.create_title': 'Crear Cliente',
  'customers.name_placeholder': 'Nombre del cliente',
  'customers.contact_placeholder': 'Teléfono o email',
  'customers.success_create': 'Cliente creado exitosamente',
  'customers.overdue_alert': 'clientes con crédito vencido',
  'customers.overdue_badge': 'Crédito Vencido',
  // Customer Detail
  'customer_detail.not_found': 'Cliente no encontrado',
  'customer_detail.not_found_description': 'El cliente solicitado no existe',
  'customer_detail.current_debt': 'Deuda Actual',
  'customer_detail.customer_id': 'ID del Cliente',
  'customer_detail.backend_required': 'Historial de transacciones',
  'customer_detail.backend_description': 'El historial de transacciones estará disponible próximamente',
  // Suppliers
  'suppliers.add_supplier': 'Agregar Proveedor',
  'suppliers.list_title': 'Lista de Proveedores',
  'suppliers.no_suppliers': 'No hay proveedores registrados',
  'suppliers.name': 'Nombre',
  'suppliers.contact': 'Contacto',
  'suppliers.contact_info': 'Información de Contacto',
  'suppliers.address': 'Dirección',
  'suppliers.create_title': 'Crear Proveedor',
  'suppliers.name_placeholder': 'Nombre del proveedor',
  'suppliers.contact_placeholder': 'Teléfono o email',
  'suppliers.address_placeholder': 'Dirección completa',
  'suppliers.success_create': 'Proveedor creado exitosamente',
  // Supplier Detail
  'supplier_detail.not_found': 'Proveedor no encontrado',
  'supplier_detail.not_found_description': 'El proveedor solicitado no existe',
  'supplier_detail.info_title': 'Información del Proveedor',
  'supplier_detail.created_at': 'Fecha de Registro',
  // Rates
  'rates.title': 'Tasas de Cambio',
  'rates.subtitle': 'Gestiona las tasas de cambio',
  'rates.current_rate': 'Tasa Actual',
  'rates.add_rate': 'Agregar Tasa',
  'rates.add_new_rate': 'Agregar Nueva Tasa',
  'rates.history': 'Historial de Tasas',
  'rates.no_rates': 'No hay tasas registradas',
  'rates.bcv_ves': 'BCV VES/USD',
  'rates.cop': 'COP/USD',
  'rates.date': 'Fecha',
  'rates.success': 'Tasa agregada exitosamente',
  'rates.success_add': 'Tasa agregada exitosamente',
  'rates.error': 'Error al agregar tasa',
  'rates.adding': 'Agregando...',
  // Sales
  'sales.title': 'Ventas',
  'sales.subtitle': 'Registra ventas y gestiona el carrito',
  'sales.search_product': 'Buscar producto',
  'sales.search_products': 'Buscar productos...',
  'sales.cart': 'Carrito',
  'sales.empty_cart': 'El carrito está vacío',
  'sales.total': 'Total',
  'sales.payment_method': 'Método de Pago',
  'sales.immediate': 'Inmediato',
  'sales.credit': 'Crédito',
  'sales.customer_name': 'Nombre del Cliente',
  'sales.customer_name_placeholder': 'Nombre del cliente para crédito',
  'sales.complete_sale': 'Completar Venta',
  'sales.success': 'Venta completada exitosamente',
  'sales.error': 'Error al completar la venta',
  'sales.retail': 'Detal',
  'sales.wholesale': 'Mayor',
  'sales.special': 'Especial',
  'sales.quantity': 'Cantidad',
  'sales.price_type': 'Tipo de Precio',
  'sales.subtotal': 'Subtotal',
  'sales.payment_term': 'Plazo de pago: 15 días',
  'sales.clear_cart': 'Vaciar Carrito',
  'sales.processing': 'Procesando...',
  'sales.insufficient_stock': 'Stock insuficiente para {product}',
  'sales.customer_required': 'El nombre del cliente es requerido para ventas a crédito',
  'sales.cash_customer': 'Cliente de Contado',
  'sales.start_adding_products': 'Busca y agrega productos al carrito',
  // Cashbox
  'cashbox.title': 'Caja',
  'cashbox.subtitle': 'Gestiona los movimientos de caja',
  'cashbox.add_entry': 'Agregar Movimiento',
  'cashbox.add_new_entry': 'Agregar Nuevo Movimiento',
  'cashbox.entries': 'Movimientos',
  'cashbox.no_entries': 'No hay movimientos registrados',
  'cashbox.totals': 'Totales',
  'cashbox.type': 'Tipo',
  'cashbox.amount': 'Monto',
  'cashbox.amount_usd': 'Monto (USD)',
  'cashbox.currency': 'Moneda',
  'cashbox.description': 'Descripción',
  'cashbox.description_placeholder': 'Descripción del movimiento',
  'cashbox.date': 'Fecha',
  'cashbox.income': 'Ingreso',
  'cashbox.expense': 'Egreso',
  'cashbox.entry_type': 'Tipo de Movimiento',
  'cashbox.entry_in': 'Ingreso',
  'cashbox.entry_out': 'Egreso',
  'cashbox.balance': 'Balance',
  'cashbox.filter_all': 'Todos',
  'cashbox.filter_in': 'Ingresos',
  'cashbox.filter_out': 'Egresos',
  'cashbox.start_adding': 'Comienza agregando tu primer movimiento',
  'cashbox.success': 'Movimiento agregado exitosamente',
  'cashbox.error': 'Error al agregar movimiento',
  'cashbox.adding': 'Agregando...',
  // Closures
  'closures.title': 'Cierres',
  'closures.subtitle': 'Gestiona los cierres de caja',
  'closures.create_closure': 'Crear Cierre',
  'closures.create_new': 'Crear Nuevo Cierre',
  'closures.history': 'Historial de Cierres',
  'closures.no_closures': 'No hay cierres registrados',
  'closures.opening_balance': 'Balance Inicial',
  'closures.opening_balance_help': 'El balance inicial se calculará automáticamente',
  'closures.closing_balance': 'Balance Final',
  'closures.total_income': 'Ingresos Totales',
  'closures.total_expenses': 'Egresos Totales',
  'closures.created_by': 'Creado por',
  'closures.created_at': 'Fecha',
  'closures.current_cashbox': 'Estado Actual de Caja',
  'closures.current_totals': 'Totales actuales en caja',
  'closures.entries': 'movimientos',
  'closures.net_change': 'Cambio Neto',
  'closures.start_adding': 'Comienza creando tu primer cierre',
  'closures.success': 'Cierre creado exitosamente',
  'closures.error': 'Error al crear cierre',
  'closures.creating': 'Creando...',
  'closures.create': 'Crear Cierre',
  'closures.login_required': 'Debes iniciar sesión para crear cierres',
  // Dashboard
  'dashboard.title': 'Panel de Control',
  'dashboard.subtitle': 'Resumen general de tu negocio',
  'dashboard.total_products': 'Productos Totales',
  'dashboard.total_customers': 'Clientes Totales',
  'dashboard.low_stock': 'Stock Bajo',
  'dashboard.low_stock_alert': 'Alerta de Stock Bajo',
  'dashboard.low_stock_items': 'Productos con Stock Bajo',
  'dashboard.overdue_customers': 'Clientes Morosos',
  'dashboard.overdue_payments': 'Pagos Vencidos',
  'dashboard.total_debt': 'Deuda Total',
  'dashboard.cash_balance': 'Balance en Caja',
  'dashboard.overdue': 'morosos',
  'dashboard.product': 'producto',
  'dashboard.products': 'productos',
  'dashboard.below_minimum': 'por debajo del mínimo',
  'dashboard.customer': 'cliente',
  'dashboard.customers': 'clientes',
  'dashboard.has_overdue': 'tiene pagos vencidos',
  'dashboard.have_overdue': 'tienen pagos vencidos',
  'dashboard.category': 'Categoría',
  'dashboard.and_more': 'y {count} más...',
  'dashboard.no_contact_info': 'Sin información de contacto',
  'dashboard.overdue_sale': 'venta vencida',
  'dashboard.overdue_sales': 'ventas vencidas',
  // Analytics
  'analytics.top_selling_products': 'Productos Más Vendidos',
  'analytics.top_searched_products': 'Productos Más Buscados',
  'analytics.net_profit_by_period': 'Ganancia Neta por Período',
  'analytics.net_profit_analysis': 'Análisis de Ganancia Neta',
  'analytics.no_sales_data': 'No hay datos de ventas disponibles',
  'analytics.no_search_data': 'No hay datos de búsqueda disponibles',
  'analytics.no_profit_data': 'No hay datos de ganancia disponibles',
  'analytics.units_sold': 'unidades vendidas',
  'analytics.searches': 'búsquedas',
  'analytics.sales': 'ventas',
  'analytics.net_profit': 'Ganancia Neta',
  'analytics.profit_margin': 'Margen de Ganancia',
  'analytics.margin': 'Margen',
  'analytics.daily': 'Diario',
  'analytics.weekly': 'Semanal',
  'analytics.monthly': 'Mensual',
  // Search
  'search.title': 'Buscar Productos',
  'search.placeholder': 'Buscar por descripción o categoría...',
  'search.searching': 'Buscando...',
  'search.no_results': 'No se encontraron productos',
  // Overdue
  'overdue.badge': 'Vencido',
  'overdue.alert_title': 'Crédito Vencido',
  'overdue.customer_has': 'Este cliente tiene',
  'overdue.count_has': 'tiene',
  'overdue.count_have': 'tienen',
  'overdue.generic': 'con pagos vencidos',
  // Table
  'table.id': 'ID',
  'table.description': 'Descripción',
  'table.category': 'Categoría',
  'table.stock': 'Stock',
  'table.stock_min': 'Stock Mín.',
  'table.cost_usd': 'Costo (USD)',
  'table.retail_usd': 'Detal (USD)',
  'table.wholesale_usd': 'Mayor (USD)',
  'table.special_usd': 'Especial (USD)',
  'table.retail_ves': 'Detal (VES)',
  'table.retail_cop': 'Detal (COP)',
  // CSV
  'csv.yes': 'Sí',
  'csv.no': 'No',
  'csv.in': 'Ingreso',
  'csv.out': 'Egreso',
  'csv.id': 'ID',
  'csv.description': 'Descripción',
  'csv.category': 'Categoría',
  'csv.stock_current': 'Stock Actual',
  'csv.stock_min': 'Stock Mínimo',
  'csv.cost_usd': 'Costo USD',
  'csv.sell_retail_usd': 'Precio Detal USD',
  'csv.sell_wholesale_usd': 'Precio Mayor USD',
  'csv.sell_special_usd': 'Precio Especial USD',
  'csv.profit_margin': 'Margen de Ganancia %',
  'csv.has_photo': 'Tiene Foto',
  'csv.name': 'Nombre',
  'csv.contact_info': 'Información de Contacto',
  'csv.debt_usd': 'Deuda USD',
  'csv.type': 'Tipo',
  'csv.timestamp': 'Fecha y Hora',
  'csv.currency': 'Moneda',
  'csv.amount_usd': 'Monto USD',
  'csv.date': 'Fecha',
  'csv.bcv_ves_per_usd': 'BCV VES/USD',
  'csv.cop_per_usd': 'COP/USD',
  // Export
  'export.title': 'Exportar Datos',
  'export.description': 'Exporta tus datos a formato CSV',
  'export.inventory': 'Inventario',
  'export.customers': 'Clientes',
  'export.cashbox_entries': 'Movimientos de Caja',
  'export.exchange_rates': 'Tasas de Cambio',
  'export.items': 'productos',
  'export.entries': 'movimientos',
  'export.rates': 'tasas',
  'export.action': 'Exportar',
  'export.exporting': 'Exportando...',
  'export.success': 'Datos exportados exitosamente',
  'export.error': 'Error al exportar datos',
  // Footer
  'footer.rights': '© {year} Todos los derechos reservados',
  'footer.built_with': 'Construido con',
};

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let translation = translations[key];

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return translation;
}

export function plural(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export type { TranslationKey };
