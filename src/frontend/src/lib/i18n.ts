// Centralized Spanish translation system with type-safe translation keys

type TranslationKey =
  | 'nav.dashboard'
  | 'nav.inventory'
  | 'nav.rates'
  | 'nav.sales'
  | 'nav.customers'
  | 'nav.cashbox'
  | 'nav.suppliers'
  | 'nav.closures'
  | 'dashboard.title'
  | 'dashboard.subtitle'
  | 'dashboard.total_products'
  | 'dashboard.total_customers'
  | 'dashboard.low_stock'
  | 'dashboard.delinquent_sales'
  | 'dashboard.inventory_value'
  | 'dashboard.active_customers'
  | 'dashboard.items_below_minimum'
  | 'dashboard.overdue_15_days'
  | 'dashboard.cashbox_summary'
  | 'dashboard.quick_actions'
  | 'dashboard.low_stock_alert'
  | 'dashboard.delinquent_alert'
  | 'inventory.title'
  | 'inventory.subtitle'
  | 'inventory.add_product'
  | 'inventory.low_stock_alert'
  | 'inventory.low_stock_description'
  | 'inventory.low_stock_description_plural'
  | 'inventory.all_categories'
  | 'inventory.no_products'
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
  | 'rates.title'
  | 'rates.subtitle'
  | 'rates.current_rate'
  | 'rates.bcv_ves'
  | 'rates.cop'
  | 'rates.add_new_rate'
  | 'rates.add_rate'
  | 'rates.adding'
  | 'rates.history'
  | 'rates.no_rates'
  | 'rates.success'
  | 'rates.error'
  | 'customers.add_customer'
  | 'customers.list_title'
  | 'customers.no_customers'
  | 'customers.name'
  | 'customers.contact'
  | 'customers.debt'
  | 'customers.create_title'
  | 'customers.edit_title'
  | 'customers.name_placeholder'
  | 'customers.contact_placeholder'
  | 'customers.success_create'
  | 'customers.success_update'
  | 'customers.contact_info'
  | 'customers.current_debt'
  | 'customers.delinquent'
  | 'customer_detail.not_found'
  | 'customer_detail.not_found_description'
  | 'customer_detail.info_title'
  | 'suppliers.add_supplier'
  | 'suppliers.list_title'
  | 'suppliers.no_suppliers'
  | 'suppliers.name'
  | 'suppliers.contact'
  | 'suppliers.address'
  | 'suppliers.create_title'
  | 'suppliers.edit_title'
  | 'suppliers.name_placeholder'
  | 'suppliers.contact_placeholder'
  | 'suppliers.address_placeholder'
  | 'suppliers.success_create'
  | 'suppliers.success_update'
  | 'suppliers.contact_info'
  | 'supplier_detail.not_found'
  | 'supplier_detail.not_found_description'
  | 'supplier_detail.info_title'
  | 'supplier_detail.created_at'
  | 'search.title'
  | 'search.placeholder'
  | 'search.no_results'
  | 'search.hint'
  | 'search.inventory'
  | 'search.customer'
  | 'search.supplier'
  | 'search.sale'
  | 'export.title'
  | 'export.description'
  | 'export.download'
  | 'export.exporting'
  | 'export.success'
  | 'export.error'
  | 'artifacts.title'
  | 'artifacts.description'
  | 'artifacts.button'
  | 'artifacts.app_build_name'
  | 'artifacts.app_build_description'
  | 'artifacts.source_code_zip_name'
  | 'artifacts.source_code_zip_description'
  | 'artifacts.source_doc_name'
  | 'artifacts.source_doc_description'
  | 'artifacts.available'
  | 'artifacts.unavailable'
  | 'artifacts.download'
  | 'artifacts.none_available'
  | 'action.loading'
  | 'action.searching'
  | 'action.view'
  | 'action.edit'
  | 'action.cancel'
  | 'action.create'
  | 'action.creating'
  | 'action.update'
  | 'action.updating'
  | 'action.back'
  | 'action.actions'
  | 'action.search'
  | 'action.add'
  | 'action.save'
  | 'action.saving'
  | 'auth.sign_in'
  | 'auth.sign_out'
  | 'auth.signing_in'
  | 'auth.sign_in_to_create'
  | 'auth.sign_in_error'
  | 'auth.sign_in_required'
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
  | 'table.total'
  | 'overdue.badge'
  | 'overdue.alert_title'
  | 'overdue.customer_has'
  | 'overdue.count_has'
  | 'overdue.count_have'
  | 'overdue.generic'
  | 'cashbox.title'
  | 'cashbox.subtitle'
  | 'cashbox.add_entry'
  | 'cashbox.filter_all'
  | 'cashbox.filter_in'
  | 'cashbox.filter_out'
  | 'cashbox.no_entries'
  | 'cashbox.start_adding'
  | 'cashbox.type'
  | 'cashbox.date'
  | 'cashbox.currency'
  | 'cashbox.amount'
  | 'cashbox.description'
  | 'cashbox.balance'
  | 'cashbox.entry_in'
  | 'cashbox.entry_out'
  | 'cashbox.add_new_entry'
  | 'cashbox.entry_type'
  | 'cashbox.amount_usd'
  | 'cashbox.description_placeholder'
  | 'cashbox.adding'
  | 'cashbox.success'
  | 'cashbox.error'
  | 'closures.title'
  | 'closures.subtitle'
  | 'closures.create_closure'
  | 'closures.current_cashbox'
  | 'closures.history'
  | 'closures.no_closures'
  | 'closures.start_adding'
  | 'closures.created_by'
  | 'closures.entries'
  | 'closures.opening_balance'
  | 'closures.closing_balance'
  | 'closures.total_income'
  | 'closures.total_expenses'
  | 'closures.net_change'
  | 'closures.create_new'
  | 'closures.opening_balance_help'
  | 'closures.current_totals'
  | 'closures.creating'
  | 'closures.create'
  | 'closures.success'
  | 'closures.error'
  | 'closures.login_required'
  | 'sales.title'
  | 'sales.subtitle'
  | 'sales.cart'
  | 'sales.empty_cart'
  | 'sales.start_adding_products'
  | 'sales.quantity'
  | 'sales.price_type'
  | 'sales.retail'
  | 'sales.wholesale'
  | 'sales.special'
  | 'sales.subtotal'
  | 'sales.total'
  | 'sales.payment_method'
  | 'sales.immediate'
  | 'sales.credit'
  | 'sales.customer_name'
  | 'sales.customer_name_placeholder'
  | 'sales.payment_term'
  | 'sales.clear_cart'
  | 'sales.processing'
  | 'sales.complete_sale'
  | 'sales.search_products'
  | 'sales.insufficient_stock'
  | 'sales.customer_required'
  | 'sales.cash_customer'
  | 'sales.success'
  | 'sales.error'
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
  | 'csv.yes'
  | 'csv.no'
  | 'csv.in'
  | 'csv.out'
  | 'csv.address'
  | 'csv.created_at'
  | 'csv.customer_name'
  | 'csv.total_amount'
  | 'csv.sale_type'
  | 'csv.sale_date'
  | 'csv.due_date'
  | 'csv.items_count'
  | 'csv.credit'
  | 'csv.immediate'
  | 'csv.opening_balance'
  | 'csv.closing_balance'
  | 'csv.total_income'
  | 'csv.total_expenses'
  | 'csv.created_by'
  | 'analytics.sales'
  | 'analytics.net_profit_analysis'
  | 'analytics.margin';

const translations: Record<TranslationKey, string> = {
  'nav.dashboard': 'Panel',
  'nav.inventory': 'Inventario',
  'nav.rates': 'Tasas',
  'nav.sales': 'Ventas',
  'nav.customers': 'Clientes',
  'nav.cashbox': 'Caja',
  'nav.suppliers': 'Proveedores',
  'nav.closures': 'Cierres',
  'dashboard.title': 'Panel de Control',
  'dashboard.subtitle': 'Resumen general del sistema',
  'dashboard.total_products': 'Total de Productos',
  'dashboard.total_customers': 'Total de Clientes',
  'dashboard.low_stock': 'Stock Bajo',
  'dashboard.delinquent_sales': 'Ventas Morosas',
  'dashboard.inventory_value': 'Valor del Inventario',
  'dashboard.active_customers': 'Clientes Activos',
  'dashboard.items_below_minimum': 'Artículos bajo mínimo',
  'dashboard.overdue_15_days': 'Vencidas +15 días',
  'dashboard.cashbox_summary': 'Resumen de Caja',
  'dashboard.quick_actions': 'Acciones Rápidas',
  'dashboard.low_stock_alert': 'Alerta de Stock Bajo',
  'dashboard.delinquent_alert': 'Alerta de Morosidad',
  'inventory.title': 'Inventario',
  'inventory.subtitle': 'Gestión de repuestos y productos',
  'inventory.add_product': 'Agregar Producto',
  'inventory.low_stock_alert': 'Alerta de Stock Bajo',
  'inventory.low_stock_description': 'producto está por debajo del stock mínimo',
  'inventory.low_stock_description_plural': 'productos están por debajo del stock mínimo',
  'inventory.all_categories': 'Todas las Categorías',
  'inventory.no_products': 'No hay productos',
  'inventory.start_adding': 'Comienza agregando tu primer producto',
  'inventory.no_products_category': 'No hay productos en esta categoría',
  'inventory.no_description': 'Sin descripción',
  'inventory.low_stock_badge': 'Stock Bajo',
  'inventory_form.create_title': 'Crear Producto',
  'inventory_form.edit_title': 'Editar Producto',
  'inventory_form.description': 'Descripción',
  'inventory_form.description_placeholder': 'Descripción del producto',
  'inventory_form.photo': 'Foto',
  'inventory_form.upload_photo': 'Subir Foto',
  'inventory_form.category': 'Categoría',
  'inventory_form.category_placeholder': 'Categoría del producto',
  'inventory_form.profit_margin': 'Margen de Ganancia (%)',
  'inventory_form.stock_current': 'Stock Actual',
  'inventory_form.stock_min': 'Stock Mínimo',
  'inventory_form.cost_usd': 'Costo (USD)',
  'inventory_form.sell_retail': 'Precio Venta Detal (USD)',
  'inventory_form.sell_wholesale': 'Precio Venta Mayor (USD)',
  'inventory_form.sell_special': 'Precio Venta Especial (USD)',
  'inventory_form.success_create': 'Producto creado exitosamente',
  'inventory_form.success_update': 'Producto actualizado exitosamente',
  'rates.title': 'Tasas de Cambio',
  'rates.subtitle': 'Gestión de tasas USD, VES y COP',
  'rates.current_rate': 'Tasa Actual',
  'rates.bcv_ves': 'BCV VES por USD',
  'rates.cop': 'COP por USD',
  'rates.add_new_rate': 'Agregar Nueva Tasa',
  'rates.add_rate': 'Agregar Tasa',
  'rates.adding': 'Agregando...',
  'rates.history': 'Historial de Tasas',
  'rates.no_rates': 'No hay tasas registradas',
  'rates.success': 'Tasa agregada exitosamente',
  'rates.error': 'Error al agregar tasa',
  'customers.add_customer': 'Agregar Cliente',
  'customers.list_title': 'Lista de Clientes',
  'customers.no_customers': 'No hay clientes registrados',
  'customers.name': 'Nombre',
  'customers.contact': 'Contacto',
  'customers.debt': 'Deuda (USD)',
  'customers.create_title': 'Crear Cliente',
  'customers.edit_title': 'Editar Cliente',
  'customers.name_placeholder': 'Nombre del cliente',
  'customers.contact_placeholder': 'Teléfono o email',
  'customers.success_create': 'Cliente creado exitosamente',
  'customers.success_update': 'Cliente actualizado exitosamente',
  'customers.contact_info': 'Información de Contacto',
  'customers.current_debt': 'Deuda Actual',
  'customers.delinquent': 'Moroso',
  'customer_detail.not_found': 'Cliente no encontrado',
  'customer_detail.not_found_description': 'El cliente que buscas no existe',
  'customer_detail.info_title': 'Información del Cliente',
  'suppliers.add_supplier': 'Agregar Proveedor',
  'suppliers.list_title': 'Lista de Proveedores',
  'suppliers.no_suppliers': 'No hay proveedores registrados',
  'suppliers.name': 'Nombre',
  'suppliers.contact': 'Contacto',
  'suppliers.address': 'Dirección',
  'suppliers.create_title': 'Crear Proveedor',
  'suppliers.edit_title': 'Editar Proveedor',
  'suppliers.name_placeholder': 'Nombre del proveedor',
  'suppliers.contact_placeholder': 'Teléfono o email',
  'suppliers.address_placeholder': 'Dirección del proveedor',
  'suppliers.success_create': 'Proveedor creado exitosamente',
  'suppliers.success_update': 'Proveedor actualizado exitosamente',
  'suppliers.contact_info': 'Información de Contacto',
  'supplier_detail.not_found': 'Proveedor no encontrado',
  'supplier_detail.not_found_description': 'El proveedor que buscas no existe',
  'supplier_detail.info_title': 'Información del Proveedor',
  'supplier_detail.created_at': 'Fecha de Registro',
  'search.title': 'Buscar',
  'search.placeholder': 'Buscar productos, clientes, proveedores...',
  'search.no_results': 'No se encontraron resultados',
  'search.hint': 'Escribe para buscar en todo el sistema',
  'search.inventory': 'Inventario',
  'search.customer': 'Cliente',
  'search.supplier': 'Proveedor',
  'search.sale': 'Venta',
  'export.title': 'Exportar Datos',
  'export.description': 'Descarga todos los datos del sistema en formato CSV',
  'export.download': 'Descargar CSV',
  'export.exporting': 'Exportando...',
  'export.success': 'Datos exportados exitosamente',
  'export.error': 'Error al exportar datos',
  'artifacts.title': 'Descargar Archivos del Sistema',
  'artifacts.description': 'Descarga el código fuente y archivos de construcción del ERP Speed Motors',
  'artifacts.button': 'Archivos',
  'artifacts.app_build_name': 'Paquete de Despliegue',
  'artifacts.app_build_description': 'Aplicación compilada lista para desplegar en Internet Computer con backend y frontend',
  'artifacts.source_code_zip_name': 'Código Fuente Completo',
  'artifacts.source_code_zip_description': 'Árbol completo de código fuente editable con todos los archivos del proyecto',
  'artifacts.source_doc_name': 'Documento de Código Fuente',
  'artifacts.source_doc_description': 'Documento Markdown con todo el código fuente concatenado para referencia offline',
  'artifacts.available': 'Disponible',
  'artifacts.unavailable': 'No disponible',
  'artifacts.download': 'Descargar',
  'artifacts.none_available': 'No hay archivos disponibles. Ejecuta el script de empaquetado para generar los archivos.',
  'action.loading': 'Cargando...',
  'action.searching': 'Buscando...',
  'action.view': 'Ver',
  'action.edit': 'Editar',
  'action.cancel': 'Cancelar',
  'action.create': 'Crear',
  'action.creating': 'Creando...',
  'action.update': 'Actualizar',
  'action.updating': 'Actualizando...',
  'action.back': 'Volver',
  'action.actions': 'Acciones',
  'action.search': 'Buscar',
  'action.add': 'Agregar',
  'action.save': 'Guardar',
  'action.saving': 'Guardando...',
  'auth.sign_in': 'Iniciar Sesión',
  'auth.sign_out': 'Cerrar Sesión',
  'auth.signing_in': 'Iniciando sesión...',
  'auth.sign_in_to_create': 'Inicia sesión para crear',
  'auth.sign_in_error': 'Error al iniciar sesión',
  'auth.sign_in_required': 'Debes iniciar sesión para realizar esta acción',
  'table.id': 'ID',
  'table.description': 'Descripción',
  'table.category': 'Categoría',
  'table.stock': 'Stock',
  'table.stock_min': 'Stock Mín.',
  'table.cost_usd': 'Costo USD',
  'table.retail_usd': 'Detal USD',
  'table.wholesale_usd': 'Mayor USD',
  'table.special_usd': 'Especial USD',
  'table.retail_ves': 'Detal VES',
  'table.retail_cop': 'Detal COP',
  'table.total': 'Total',
  'overdue.badge': 'Moroso',
  'overdue.alert_title': 'Crédito Vencido',
  'overdue.customer_has': 'Este cliente tiene',
  'overdue.count_has': 'crédito vencido',
  'overdue.count_have': 'créditos vencidos',
  'overdue.generic': 'Crédito vencido hace más de 15 días',
  'cashbox.title': 'Caja',
  'cashbox.subtitle': 'Gestión de entradas y salidas',
  'cashbox.add_entry': 'Agregar Movimiento',
  'cashbox.filter_all': 'Todos',
  'cashbox.filter_in': 'Entradas',
  'cashbox.filter_out': 'Salidas',
  'cashbox.no_entries': 'No hay movimientos registrados',
  'cashbox.start_adding': 'Comienza agregando tu primer movimiento',
  'cashbox.type': 'Tipo',
  'cashbox.date': 'Fecha',
  'cashbox.currency': 'Moneda',
  'cashbox.amount': 'Monto',
  'cashbox.description': 'Descripción',
  'cashbox.balance': 'Balance',
  'cashbox.entry_in': 'Entrada',
  'cashbox.entry_out': 'Salida',
  'cashbox.add_new_entry': 'Agregar Nuevo Movimiento',
  'cashbox.entry_type': 'Tipo de Movimiento',
  'cashbox.amount_usd': 'Monto (USD)',
  'cashbox.description_placeholder': 'Descripción del movimiento',
  'cashbox.adding': 'Agregando...',
  'cashbox.success': 'Movimiento agregado exitosamente',
  'cashbox.error': 'Error al agregar movimiento',
  'closures.title': 'Cierres de Caja',
  'closures.subtitle': 'Gestión de cierres contables',
  'closures.create_closure': 'Crear Cierre',
  'closures.current_cashbox': 'Caja Actual',
  'closures.history': 'Historial de Cierres',
  'closures.no_closures': 'No hay cierres registrados',
  'closures.start_adding': 'Comienza creando tu primer cierre',
  'closures.created_by': 'Creado por',
  'closures.entries': 'movimientos',
  'closures.opening_balance': 'Balance Inicial',
  'closures.closing_balance': 'Balance Final',
  'closures.total_income': 'Total Ingresos',
  'closures.total_expenses': 'Total Egresos',
  'closures.net_change': 'Cambio Neto',
  'closures.create_new': 'Crear Nuevo Cierre',
  'closures.opening_balance_help': 'Balance inicial del período',
  'closures.current_totals': 'Totales Actuales',
  'closures.creating': 'Creando...',
  'closures.create': 'Crear Cierre',
  'closures.success': 'Cierre creado exitosamente',
  'closures.error': 'Error al crear cierre',
  'closures.login_required': 'Debes iniciar sesión para crear cierres',
  'sales.title': 'Ventas',
  'sales.subtitle': 'Registro de ventas y facturación',
  'sales.cart': 'Carrito',
  'sales.empty_cart': 'Carrito vacío',
  'sales.start_adding_products': 'Comienza agregando productos',
  'sales.quantity': 'Cantidad',
  'sales.price_type': 'Tipo de Precio',
  'sales.retail': 'Detal',
  'sales.wholesale': 'Mayor',
  'sales.special': 'Especial',
  'sales.subtotal': 'Subtotal',
  'sales.total': 'Total',
  'sales.payment_method': 'Método de Pago',
  'sales.immediate': 'Inmediato',
  'sales.credit': 'Crédito',
  'sales.customer_name': 'Nombre del Cliente',
  'sales.customer_name_placeholder': 'Nombre del cliente',
  'sales.payment_term': 'Plazo de Pago',
  'sales.clear_cart': 'Limpiar Carrito',
  'sales.processing': 'Procesando...',
  'sales.complete_sale': 'Completar Venta',
  'sales.search_products': 'Buscar productos...',
  'sales.insufficient_stock': 'Stock insuficiente',
  'sales.customer_required': 'El nombre del cliente es requerido para ventas a crédito',
  'sales.cash_customer': 'Cliente de Contado',
  'sales.success': 'Venta registrada exitosamente',
  'sales.error': 'Error al registrar venta',
  'csv.id': 'ID',
  'csv.description': 'Descripción',
  'csv.category': 'Categoría',
  'csv.stock_current': 'Stock Actual',
  'csv.stock_min': 'Stock Mínimo',
  'csv.cost_usd': 'Costo USD',
  'csv.sell_retail_usd': 'Venta Detal USD',
  'csv.sell_wholesale_usd': 'Venta Mayor USD',
  'csv.sell_special_usd': 'Venta Especial USD',
  'csv.profit_margin': 'Margen de Ganancia %',
  'csv.has_photo': 'Tiene Foto',
  'csv.name': 'Nombre',
  'csv.contact_info': 'Contacto',
  'csv.debt_usd': 'Deuda USD',
  'csv.type': 'Tipo',
  'csv.timestamp': 'Fecha y Hora',
  'csv.currency': 'Moneda',
  'csv.amount_usd': 'Monto USD',
  'csv.date': 'Fecha',
  'csv.bcv_ves_per_usd': 'BCV VES por USD',
  'csv.cop_per_usd': 'COP por USD',
  'csv.yes': 'Sí',
  'csv.no': 'No',
  'csv.in': 'Entrada',
  'csv.out': 'Salida',
  'csv.address': 'Dirección',
  'csv.created_at': 'Fecha de Creación',
  'csv.customer_name': 'Cliente',
  'csv.total_amount': 'Monto Total USD',
  'csv.sale_type': 'Tipo de Venta',
  'csv.sale_date': 'Fecha de Venta',
  'csv.due_date': 'Fecha de Vencimiento',
  'csv.items_count': 'Cantidad de Artículos',
  'csv.credit': 'Crédito',
  'csv.immediate': 'Inmediato',
  'csv.opening_balance': 'Balance Inicial USD',
  'csv.closing_balance': 'Balance Final USD',
  'csv.total_income': 'Total Ingresos USD',
  'csv.total_expenses': 'Total Egresos USD',
  'csv.created_by': 'Creado Por',
  'analytics.sales': 'Ventas',
  'analytics.net_profit_analysis': 'Análisis de Ganancia Neta',
  'analytics.margin': 'Margen',
};

export function t(key: TranslationKey, params?: Record<string, string | number>): string {
  let translation = translations[key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      translation = translation.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return translation;
}
