// Datos iniciales (se cargarán desde Excel)
        let products = [];
        let sales = [];
        let users = []; // New array to store users

        // Configuración para el archivo Excel
        const EXCEL_CONFIG = {
            sheetName: 'Productos',
            headers: ['ID', 'Nombre', 'Precio', 'Categoría', 'Stock', 'Fecha Creación', 'Última Actualización', 'Stock Previo'],
            mappings: {
                id: 'ID',
                name: 'Nombre',
                price: 'Precio',
                category: 'Categoría',
                stock: 'Stock',
                creationDate: 'Fecha Creación',
                lastUpdateDate: 'Última Actualización',
                previousStock: 'Stock Previo'
            }
        };

        // Configuration for Sales Excel
        const EXCEL_CONFIG_SALES = {
            sheetName: 'Ventas',
            headers: ['ID Venta', 'Fecha', 'Hora', 'Usuario', 'Nombre Producto', 'Cantidad', 'Precio Unitario', 'Total Producto'],
            mappings: {
                id: 'ID Venta',
                date: 'Fecha',
                time: 'Hora',
                user: 'Usuario',
                productName: 'Nombre Producto',
                quantity: 'Cantidad',
                unitPrice: 'Precio Unitario',
                itemTotal: 'Total Producto'
            }
        };

        // Configuration for Users Excel
        const EXCEL_CONFIG_USERS = {
            sheetName: 'Usuarios',
            headers: ['Nombre', 'Rol', 'Código'],
            mappings: {
                name: 'Nombre',
                role: 'Rol',
                code: 'Código'
            }
        };

        // Configuration for Arrivals Excel
        const EXCEL_CONFIG_ARRIVALS = {
            sheetName: 'Llegadas',
            headers: ['ID Producto', 'Nombre Producto', 'Cantidad Llegada', 'Fecha Llegada', 'Notas', 'Stock Anterior', 'Nuevo Stock'],
            mappings: {
                productId: 'ID Producto',
                productName: 'Nombre Producto',
                quantity: 'Cantidad Llegada',
                date: 'Fecha Llegada',
                notes: 'Notas',
                previousStock: 'Stock Anterior',
                newStock: 'Nuevo Stock'
            }
        };

        // En los arrays al inicio:
        let arrivals = []; // New array to store product arrivals




        // Carrito de compras
        let cart = [];
        let currentSubcategory = 'all'; // Subcategory logic removed, but kept for now. Will be removed from rendering.

        // Pagination variables
        const productsPerPage = 4; // Number of products to display per page
        let currentPage = 1; // Current page number

        // Elementos del DOM
        const productsContainer = document.getElementById('products-container');
        const cartItemsContainer = document.getElementById('cart-items');
        const emptyCartElement = document.getElementById('empty-cart');
        // const categoryFilterSelect = document.getElementById('category-filter'); // Removed
        const subtotalElement = document.getElementById('subtotal');
        const totalElement = document.getElementById('total');
        const checkoutBtn = document.getElementById('checkout-btn');
        const receiptModal = document.getElementById('receipt-modal');
        const closeReceiptBtn = document.getElementById('close-receipt-btn');
        const currentDateElement = document.getElementById('current-date');
        const currentTimeElement = document.getElementById('current-time');
        const receiptDateElement = document.getElementById('receipt-date');
        const receiptTimeElement = document.getElementById('receipt-time');
        const receiptItemsElement = document.getElementById('receipt-items');
        const receiptTotalElement = document.getElementById('receipt-total');
        const receiptIdElement = document.getElementById('receipt-id');
        const searchInput = document.getElementById('search-input');
        const subcategoriesContainer = document.getElementById('subcategories-container'); // This container will now be hidden or removed
        const paginationControls = document.getElementById('pagination-controls');
        const prevPageBtn = document.getElementById('prev-page-btn');
        const nextPageBtn = document.getElementById('next-page-btn');
        const pageInfoSpan = document.getElementById('page-info');

        // Nuevos elementos para Excel
        const excelFileInput = document.getElementById('excel-file');
        const fileInfoElement = document.getElementById('file-info');
        const downloadTemplateBtn = document.getElementById('download-template');
        const exportProductsBtn = document.getElementById('export-products');
        const exportSalesBtn = document.getElementById('export-sales'); // New export sales button
        const statusMessageElement = document.getElementById('status-message');

        // Nuevos elementos para gestión de productos (modals)
        const openAddProductModalBtn = document.getElementById('open-add-product-modal-btn');
        const addProductModal = document.getElementById('add-product-modal');
        const closeAddProductModalBtn = document.getElementById('close-add-product-modal-btn');
        const addProductForm = document.getElementById('add-product-form');
        const addProductNameInput = document.getElementById('add-product-name');
        const addProductPriceInput = document.getElementById('add-product-price');
        const addProductCategoryInput = document.getElementById('add-product-category');
        const addProductStockInput = document.getElementById('add-product-stock');
        // const addProductIconInput = document.getElementById('add-product-icon'); // Removed
        const addProductFormStatusMessage = document.getElementById('add-product-form-status-message');

        // Nuevos elementos para gestión de usuarios (modal)
        const openAddUserModalBtn = document.getElementById('open-add-user-modal-btn');
        const addUserModal = document.getElementById('add-user-modal');
        const closeAddUserModalBtn = document.getElementById('close-add-user-modal-btn');
        const addUserForm = document.getElementById('add-user-form');
        const addUserNameInput = document.getElementById('add-user-name');
        const addUserRoleInput = document.getElementById('add-user-role');
        const addUserCodeInput = document.getElementById('add-user-code');
        const addUserFormStatusMessage = document.getElementById('add-user-form-status-message');


        const updateProductModal = document.getElementById('update-product-modal');
        const closeUpdateProductModalBtn = document.getElementById('close-update-product-modal-btn');
        const updateProductForm = document.getElementById('update-product-form');
        const updateProductIdInput = document.getElementById('update-product-id');
        const updateProductNameInput = document.getElementById('update-product-name');
        const updateProductPriceInput = document.getElementById('update-product-price');
        const updateProductCategoryInput = document.getElementById('update-product-category');
        const updateProductStockInput = document.getElementById('update-product-stock');
        // const updateProductIconInput = document.getElementById('update-product-icon'); // Removed
        const updateProductFormStatusMessage = document.getElementById('update-product-form-status-message');

        const toggleEditModeBtn = document.getElementById('toggle-edit-mode-btn'); // New DOM element
        let editModeActive = false; // To keep track of edit mode state
        const ADMIN_PASSWORD = 'admin'; // Define your admin password here
        const excelControls = document.querySelector('.excel-controls'); // Get the excel controls div

        // Variable global para el usuario actual
        let currentUser = null;

        // Agregar después de las otras declaraciones de elementos del DOM
        const openReportsModalBtn = document.getElementById('open-reports-modal-btn');
        const reportsModal = document.getElementById('reports-modal');
        const closeReportsModalBtn = document.getElementById('close-reports-modal-btn');
        const reportsForm = document.getElementById('reports-form');
        const startDateInput = document.getElementById('start-date');
        const endDateInput = document.getElementById('end-date');
        const reportTypeSelect = document.getElementById('report-type');
        const reportsFormStatusMessage = document.getElementById('reports-form-status-message');
        const exportReportBtn = document.getElementById('export-report-btn');
        const reportResults = document.getElementById('report-results');
        const totalSalesAmount = document.getElementById('total-sales-amount');
        const totalSalesCount = document.getElementById('total-sales-count');
        const totalItemsSold = document.getElementById('total-items-sold');
        const averageSale = document.getElementById('average-sale');
        const salesTableBody = document.getElementById('sales-table-body');
        let salesChart = null;

        const exportPdfBtn = document.getElementById('export-pdf-btn');

        // Elementos del modal de llegadas
        const openArrivalModalBtn = document.getElementById('open-arrival-modal-btn');
        const registerArrivalModal = document.getElementById('register-arrival-modal');
        const closeArrivalModalBtn = document.getElementById('close-arrival-modal-btn');
        const closeArrivalModalBtn2 = document.getElementById('close-arrival-modal-btn-2');
        const arrivalForm = document.getElementById('arrival-form');
        const arrivalProductSelect = document.getElementById('arrival-product-select');
        const arrivalQuantityInput = document.getElementById('arrival-quantity');
        const arrivalNotesInput = document.getElementById('arrival-notes');
        const arrivalFormStatusMessage = document.getElementById('arrival-form-status-message');


        // Función para mostrar mensajes de estado
        function showStatusMessage(message, type = 'info') {
            statusMessageElement.innerHTML = `<div class="status-message ${type}">${message}</div>`;

            // Auto-ocultar después de 5 segundos para mensajes de éxito/info
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    statusMessageElement.innerHTML = '';
                }, 5000);
            }
        }

        // Función para mostrar mensajes de estado para el formulario de producto
        function showAddProductFormStatusMessage(message, type = 'info') {
            addProductFormStatusMessage.innerHTML = `<div class="status-message ${type}">${message}</div>`;

            // Auto-ocultar después de 5 segundos para mensajes de éxito/info
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    addProductFormStatusMessage.innerHTML = '';
                }, 5000);
            }
        }

        function showUpdateProductFormStatusMessage(message, type = 'info') {
            updateProductFormStatusMessage.innerHTML = `<div class="status-message ${type}">${message}</div>`;

            // Auto-ocultar después de 5 segundos para mensajes de éxito/info
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    updateProductFormStatusMessage.innerHTML = '';
                }, 5000);
            }
        }

        // Función para mostrar mensajes de estado para el formulario de usuario
        function showAddUserFormStatusMessage(message, type = 'info') {
            addUserFormStatusMessage.innerHTML = `<div class="status-message ${type}">${message}</div>`;

            // Auto-ocultar después de 5 segundos para mensajes de éxito/info
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    addUserFormStatusMessage.innerHTML = '';
                }, 5000);
            }
        }



        // Función para descargar plantilla de Excel
        function downloadTemplate() {
            // Crear datos de ejemplo para la plantilla
            const templateData = [
                {
                    'ID': 1,
                    'Nombre': "Alimento para Perro Adulto",
                    'Precio': 450,
                    'Categoría': "food",
                    'Stock': 15,
                    'Fecha Creación': '2023-01-01 10:00:00',
                    'Última Actualización': '2023-01-01 10:00:00',
                    'Stock Previo': 15
                },
                {
                    'ID': 2,
                    'Nombre': "Alimento para Gato Adulto",
                    'Precio': 380,
                    'Categoría': "food",
                    'Stock': 12,
                    'Fecha Creación': '2023-01-01 10:05:00',
                    'Última Actualización': '2023-01-01 10:05:00',
                    'Stock Previo': 12
                },
                {
                    'ID': 3,
                    'Nombre': "Snacks para Perro",
                    'Precio': 120,
                    'Categoría': "food",
                    'Stock': 25,
                    'Fecha Creación': '2023-01-02 11:00:00',
                    'Última Actualización': '2023-01-02 11:00:00',
                    'Stock Previo': 25
                },
                {
                    'ID': 4,
                    'Nombre': "Pelota para Mascota",
                    'Precio': 85,
                    'Categoría': "toys",
                    'Stock': 30,
                    'Fecha Creación': '2023-01-02 11:15:00',
                    'Última Actualización': '2023-01-02 11:15:00',
                    'Stock Previo': 30
                },
                {
                    'ID': '',
                    'Nombre': '',
                    'Precio': '',
                    'Categoría': '',
                    'Stock': '',
                    'Fecha Creación': '',
                    'Última Actualización': '',
                    'Stock Previo': ''
                }
            ];

            // Crear hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(templateData);

            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, EXCEL_CONFIG.sheetName);

            // Descargar archivo
            XLSX.writeFile(wb, 'plantilla_productos_petshop.xlsx');

            showStatusMessage('Plantilla descargada correctamente. Completa los datos y cárgala en el sistema.', 'success');
        }

        // Función para leer archivo Excel
        function readExcelFile(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = function(e) {
                    try {
                        const data = new Uint8Array(e.target.result);
                        const workbook = XLSX.read(data, { type: 'array' });

                        // Obtener la primera hoja
                        const firstSheetName = workbook.SheetNames[0];
                        const worksheet = workbook.Sheets[firstSheetName];

                        // Convertir a JSON
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);

                        // Validar que el archivo tenga las columnas necesarias
                        if (jsonData.length === 0) {
                            reject(new Error('El archivo Excel está vacío o no tiene datos en la primera hoja.'));
                            return;
                        }

                        resolve({ sheetName: firstSheetName, data: jsonData });
                    } catch (error) {
                        reject(new Error('Error al procesar el archivo Excel: ' + error.message));
                    }
                };

                reader.onerror = function() {
                    reject(new Error('Error al leer el archivo.'));
                };

                reader.readAsArrayBuffer(file);
            });
        }

        // Función para procesar datos del Excel y actualizar productos
        function processExcelData(excelData) {
            const processedProducts = [];

            excelData.forEach((row, index) => {
                // Saltar filas vacías
                if (!row[EXCEL_CONFIG.mappings.id] && !row[EXCEL_CONFIG.mappings.name]) {
                    return;
                }

                try {
                    // Validar y procesar cada campo
                    const id = parseInt(row[EXCEL_CONFIG.mappings.id]);
                    const name = String(row[EXCEL_CONFIG.mappings.name]).trim();
                    const price = parseFloat(row[EXCEL_CONFIG.mappings.price]);
                    const category = String(row[EXCEL_CONFIG.mappings.category]).trim().toLowerCase();
                    const stock = parseInt(row[EXCEL_CONFIG.mappings.stock]);
                    // const icon = String(row[EXCEL_CONFIG.mappings.icon] || '').trim(); // Removed
                    // const subcategory = String(row[EXCEL_CONFIG.mappings.subcategory] || '').trim().toLowerCase(); // Removed
                    const creationDate = String(row[EXCEL_CONFIG.mappings.creationDate] || new Date().toLocaleString()); // Default to now if not provided
                    const lastUpdateDate = String(row[EXCEL_CONFIG.mappings.lastUpdateDate] || new Date().toLocaleString()); // Default to now if not provided
                    const previousStock = parseInt(row[EXCEL_CONFIG.mappings.previousStock] || 0); // New field: Previous Stock

                    // Validaciones básicas
                    if (isNaN(id) || id <= 0) {
                        throw new Error(`ID inválido en fila ${index + 2}`);
                    }

                    if (!name || name.length === 0) {
                        throw new Error(`Nombre vacío en fila ${index + 2}`);
                    }

                    if (isNaN(price) || price <= 0) {
                        throw new Error(`Precio inválido en fila ${index + 2}`);
                    }

                    if (!category || category.length === 0) {
                        throw new Error(`Categoría vacía en fila ${index + 2}`);
                    }

                    if (isNaN(stock) || stock < 0) {
                        throw new Error(`Stock inválido en fila ${index + 2}`);
                    }

                    // Crear objeto producto
                    const product = {
                        id,
                        name,
                        price,
                        category,
                        stock,
                        // icon: icon || getDefaultImageUrlForCategory(category), // Removed
                        // subcategory: subcategory,
                        creationDate: creationDate,
                        lastUpdateDate: lastUpdateDate,
                        previousStock: previousStock // Added previousStock
                    };

                    processedProducts.push(product);

                } catch (error) {
                    console.warn(`Error en fila ${index + 2}: ${error.message}`);
                    showStatusMessage(`Advertencia en fila ${index + 2}: ${error.message}`, 'error');
                }
            });

            return processedProducts;
        }

        // Función para procesar datos del Excel y actualizar usuarios
        function processExcelUsersData(excelData) {
            const processedUsers = [];

            excelData.forEach((row, index) => {
                // Saltar filas vacías
                if (!row[EXCEL_CONFIG_USERS.mappings.name] && !row[EXCEL_CONFIG_USERS.mappings.role] && !row[EXCEL_CONFIG_USERS.mappings.code]) {
                    return;
                }

                try {
                    const name = String(row[EXCEL_CONFIG_USERS.mappings.name]).trim();
                    const role = String(row[EXCEL_CONFIG_USERS.mappings.role]).trim().toLowerCase();
                    const code = String(row[EXCEL_CONFIG_USERS.mappings.code]).trim();

                    // Validaciones básicas
                    if (!name || name.length === 0) {
                        throw new Error(`Nombre de usuario vacío en fila ${index + 2}`);
                    }
                    if (!role || role.length === 0) {
                        throw new Error(`Rol de usuario vacío en fila ${index + 2}`);
                    }
                    if (!code || code.length === 0) {
                        throw new Error(`Código de acceso de usuario vacío en fila ${index + 2}`);
                    }

                    // Check for existing user name or code to prevent duplicates
                    // The IDs are automatically generated, so we only need to check name and code
                    if (users.some(u => u.name.toLowerCase() === name.toLowerCase()) || processedUsers.some(u => u.name.toLowerCase() === name.toLowerCase())) {
                        throw new Error(`Ya existe un usuario con el nombre '${name}' en fila ${index + 2}.`);
                    }
                    if (users.some(u => u.code.toLowerCase() === code.toLowerCase()) || processedUsers.some(u => u.code.toLowerCase() === code.toLowerCase())) {
                        throw new Error(`Ya existe un usuario con el código '${code}' en fila ${index + 2}.`);
                    }

                    const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 + processedUsers.length : 1 + processedUsers.length;

                    const newUser = {
                        id: newId,
                        name,
                        role,
                        code
                    };

                    processedUsers.push(newUser);

                } catch (error) {
                    console.warn(`Error en fila ${index + 2} al procesar usuario: ${error.message}`);
                    showStatusMessage(`Advertencia en fila ${index + 2} al procesar usuario: ${error.message}`, 'error');
                }
            });

            return processedUsers;
        }

        // Función para obtener icono por defecto según categoría (adaptada para URLs de imagen)
        // function getDefaultImageUrlForCategory(category) { // Removed
        //     const imageMap = {
        //         'food': 'https://via.placeholder.com/150/FF5733/FFFFFF?text=Food',
        //         'toys': 'https://via.placeholder.com/150/33FF57/FFFFFF?text=Toys',
        //         'health': 'https://via.placeholder.com/150/3357FF/FFFFFF?text=Health',
        //         'accessories': 'https://via.placeholder.com/150/FF33CC/FFFFFF?text=Accessory',
        //         'default': 'https://via.placeholder.com/150/cccccc/FFFFFF?text=Product'
        //     };

        //     return imageMap[category] || imageMap.default;
        // }

        // Función para exportar productos a Excel
        function exportToExcel() {
            if (products.length === 0) {
                showStatusMessage('No hay productos para exportar.', 'error');
                return;
            }

            // Preparar datos para exportación
            const exportData = products.map(product => ({
                'ID': product.id,
                'Nombre': product.name,
                'Precio': product.price,
                'Categoría': product.category,
                'Stock': product.stock,
                // 'Icono': product.icon, // Removed
                // 'Subcategoría': product.subcategory, // Removed
                'Fecha Creación': product.creationDate,
                'Última Actualización': product.lastUpdateDate,
                'Stock Previo': product.previousStock
            }));

            // Crear hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Ajustar ancho de columnas
            const wscols = [
                {wch: 8},  // ID
                {wch: 40}, // Nombre
                {wch: 12}, // Precio
                {wch: 15}, // Categoría
                {wch: 8},  // Stock
                // {wch: 15}, // Icono // Removed
                // {wch: 20}, // Subcategoría // Removed
                {wch: 22}, // Fecha Creación
                {wch: 22},  // Última Actualización
                {wch: 15}  // Stock Previo
            ];
            ws['!cols'] = wscols;

            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Productos_Exportados');

            // Generar nombre de archivo con fecha
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const fileName = `productos_petshop_${dateStr}.xlsx`;

            // Descargar archivo
            XLSX.writeFile(wb, fileName);

            showStatusMessage(`Productos exportados correctamente: ${products.length} productos`, 'success');

            // Add confirmation and clear data for products only
            if (confirm('¿Deseas borrar los productos existentes después de la exportación? Esta acción es irreversible.')) {
                products = [];
                saveProductsToLocalStorage();
                renderCategories();
                // renderSubcategories(); // Subcategory logic removed
                renderProducts();
                updateCart(); // Update cart to reflect empty products if any are in cart
                showStatusMessage('Productos borrados exitosamente después de la exportación.', 'success');
            }
        }

        // Función para exportar ventas a Excel
        function exportSalesToExcel() {
            if (sales.length === 0) {
                showStatusMessage('No hay ventas para exportar.', 'error');
                return;
            }

            const exportData = [];
            sales.forEach(sale => {
                sale.items.forEach(item => {
                    exportData.push({
                        'ID Venta': sale.id,
                        'Fecha': sale.date,
                        'Hora': sale.time,
                        'Usuario': sale.user,
                        'Nombre Producto': item.name,
                        'Cantidad': item.quantity,
                        'Precio Unitario': item.price,
                        'Total Producto': (item.quantity * item.price).toFixed(2)
                    });
                });
            });

            const ws = XLSX.utils.json_to_sheet(exportData);

            const wscols = [
                {wch: 15}, // ID Venta
                {wch: 15}, // Fecha
                {wch: 15}, // Hora
                {wch: 20}, // Usuario
                {wch: 40}, // Nombre Producto
                {wch: 10}, // Cantidad
                {wch: 15}, // Precio Unitario
                {wch: 15}  // Total Producto
            ];
            ws['!cols'] = wscols;

            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, EXCEL_CONFIG_SALES.sheetName);

            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const fileName = `ventas_petshop_${dateStr}.xlsx`;

            XLSX.writeFile(wb, fileName);

            showStatusMessage(`Ventas exportadas correctamente: ${exportData.length} registros de productos vendidos`, 'success');

            if (confirm('¿Deseas borrar los registros de ventas existentes después de la exportación? Esta acción es irreversible.')) {
                sales = [];
                saveSalesToLocalStorage();
                // No need to re-render categories/products/cart as only sales are affected
                showStatusMessage('Registros de ventas borrados exitosamente después de la exportación.', 'success');
            }
        }

        // Función para exportar usuarios a Excel
        function exportUsersToExcel() {
            if (users.length === 0) {
                showStatusMessage('No hay usuarios para exportar.', 'error');
                return;
            }

            // Preparar datos para exportación
            const exportData = users.map(user => ({
                'Nombre': user.name,
                'Rol': user.role,
                'Código': user.code
            }));

            // Crear hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Ajustar ancho de columnas
            const wscols = [
                {wch: 25},  // Nombre
                {wch: 15}, // Rol
                {wch: 15}  // Código
            ];
            ws['!cols'] = wscols;

            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, EXCEL_CONFIG_USERS.sheetName);

            // Generar nombre de archivo con fecha
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const fileName = `usuarios_petshop_${dateStr}.xlsx`;

            // Descargar archivo
            XLSX.writeFile(wb, fileName);

            showStatusMessage(`Usuarios exportados correctamente: ${users.length} usuarios`, 'success');

            if (confirm('¿Deseas borrar los usuarios existentes después de la exportación? Esta acción es irreversible.')) {
                users = [];
                saveUsersToLocalStorage();
                showStatusMessage('Usuarios borrados exitosamente después de la exportación.', 'success');
            }
        }

        

        // Función para configurar controles de llegadas
        function setupArrivalControls() {
            const excelControls = document.querySelector('.excel-controls');
            if (!excelControls) {
                console.warn('No se encontró el contenedor excel-controls');
                return;
            }
        
            // Verificar si ya existen los botones
            let arrivalBtn = document.getElementById('open-arrival-modal-btn');
            let exportArrivalsBtn = document.getElementById('export-arrivals');
        
            // Si no existen, crearlos
            if (!arrivalBtn) {
                arrivalBtn = document.createElement('button');
                arrivalBtn.id = 'open-arrival-modal-btn';
                arrivalBtn.type = 'button';
                arrivalBtn.className = 'excel-btn export-btn hidden-edit-button';
                arrivalBtn.innerHTML = '<i class="fas fa-truck-loading"></i> Registrar Llegada';
                arrivalBtn.title = 'Registrar llegada de productos al inventario';
                excelControls.appendChild(arrivalBtn);
            }
        
            if (!exportArrivalsBtn) {
                exportArrivalsBtn = document.createElement('button');
                exportArrivalsBtn.id = 'export-arrivals';
                exportArrivalsBtn.type = 'button';
                exportArrivalsBtn.className = 'excel-btn export-btn hidden-edit-button';
                exportArrivalsBtn.innerHTML = '<i class="fas fa-file-export"></i> Exportar Llegadas';
                exportArrivalsBtn.title = 'Exportar historial de llegadas';
                excelControls.appendChild(exportArrivalsBtn);
            }
        
            // Asignar event listeners CORREGIDO
            arrivalBtn.addEventListener('click', openArrivalModal);
            exportArrivalsBtn.addEventListener('click', exportArrivalsToExcel);
        
            console.log('Controles de llegadas configurados (ocultos por defecto)');
        }

        // Función para exportar llegadas a Excel
        function exportArrivalsToExcel() {
            if (arrivals.length === 0) {
                showStatusMessage('No hay registros de llegadas para exportar.', 'error');
                return;
            }
        
            // Preparar datos para exportación
            const exportData = arrivals.map(arrival => ({
                'ID Producto': arrival.productId,
                'Nombre Producto': arrival.productName,
                'Cantidad Llegada': arrival.quantity,
                'Fecha Llegada': arrival.date,
                'Notas': arrival.notes || '',
                'Stock Anterior': arrival.previousStock,
                'Nuevo Stock': arrival.newStock
            }));
        
            // Crear hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(exportData);
        
            // Ajustar ancho de columnas
            const wscols = [
                {wch: 12},  // ID Producto
                {wch: 30},  // Nombre Producto
                {wch: 15},  // Cantidad Llegada
                {wch: 20},  // Fecha Llegada
                {wch: 25},  // Notas
                {wch: 15},  // Stock Anterior
                {wch: 15}   // Nuevo Stock
            ];
            ws['!cols'] = wscols;
        
            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, EXCEL_CONFIG_ARRIVALS.sheetName);
        
            // Generar nombre de archivo con fecha
            const date = new Date();
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            const fileName = `llegadas_petshop_${dateStr}.xlsx`;
        
            // Descargar archivo
            XLSX.writeFile(wb, fileName);
        
            showStatusMessage(`Llegadas exportadas: ${arrivals.length} registros`, 'success');
        
            // Opcional: preguntar si borrar después de exportar
            if (confirm('¿Deseas borrar el historial de llegadas después de exportar? Esta acción es irreversible.')) {
                arrivals = [];
                saveArrivalsToLocalStorage();
                showStatusMessage('Historial de llegadas borrado', 'info');
            }
        }

        // Función para limpiar event listeners duplicados
        function cleanupDuplicateEventListeners() {
            // Limpiar event listeners del formulario de llegadas
            if (arrivalForm) {
                const newForm = arrivalForm.cloneNode(true);
                arrivalForm.parentNode.replaceChild(newForm, arrivalForm);

                // Actualizar referencia
                arrivalForm = document.getElementById('arrival-form');
                arrivalProductSelect = document.getElementById('arrival-product-select');
                arrivalQuantityInput = document.getElementById('arrival-quantity');
                arrivalNotesInput = document.getElementById('arrival-notes');
                arrivalFormStatusMessage = document.getElementById('arrival-form-status-message');
            }
        }

        // Función para formatear precio
        function formatPrice(price) {
            return `$${price.toFixed(2)}`;
        }

        // Función para actualizar fecha y hora
        function updateDateTime() {
            const now = new Date();

            // Formatear fecha
            const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            const formattedDate = now.toLocaleDateString('es-ES', optionsDate);
            currentDateElement.textContent = formattedDate;

            // Formatear hora
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const seconds = now.getSeconds().toString().padStart(2, '0');
            currentTimeElement.textContent = `${hours}:${minutes}:${seconds}`;

            // Actualizar cada segundo
            setTimeout(updateDateTime, 1000);
        }

        // Function to render subcategories based on the current category
        function renderSubcategories() {
            subcategoriesContainer.innerHTML = '';
            // No longer rendering subcategory buttons as the field has been removed.
            // We can optionally hide the entire subcategoriesContainer element if it's always empty.
            // subcategoriesContainer.style.display = 'none';
        }

        // Función para renderizar categorías dinámicamente
        // function renderCategories() { // Removed
        //     categoryFilterSelect.innerHTML = ''; // Clear previous options

        //     // Add "Todos" option
        //     const allOption = document.createElement('option');
        //     allOption.value = 'all';
        //     allOption.textContent = 'Todas las Categorías';
        //     categoryFilterSelect.appendChild(allOption);

        //     const uniqueCategories = new Set(products.map(p => p.category));

        //     uniqueCategories.forEach(category => {
        //         const option = document.createElement('option');
        //         option.value = category;
        //         option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        //         categoryFilterSelect.appendChild(option);
        //     });

        //     // Initialize Select2 after options are rendered
        //     $(categoryFilterSelect).select2({
        //         placeholder: "Selecciona una categoría",
        //         allowClear: true // Option to clear selection
        //     });

        //     // Set the currently selected category in the dropdown (for Select2)
        //     $(categoryFilterSelect).val(currentCategory).trigger('change');
        // }

        // Función para adjuntar event listeners a los botones de categoría
        // function attachCategoryEventListeners() { // Removed
        //     $(categoryFilterSelect).on('change', (e) => {
        //         currentCategory = e.target.value;
        //         currentSubcategory = 'all'; // Subcategory logic removed
        //         // renderSubcategories(); // Subcategory logic removed
        //         currentPage = 1; // Reset to first page when category changes
        //         renderProducts();
        //     });
        // }

        // Función para renderizar productos
        function renderProducts() {
            productsContainer.innerHTML = '';

            // Obtener el valor de búsqueda
            const searchTerm = searchInput.value.toLowerCase();

            // Filtrar productos por subcategoría y término de búsqueda
            let filteredProducts = products.filter(product => {
                // const matchesCategory = currentCategory === 'all' || product.category === currentCategory; // Removed
                // const matchesSubcategory = currentSubcategory === 'all' || product.subcategory === currentSubcategory; // Subcategory logic removed
                const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                      product.category.toLowerCase().includes(searchTerm) ||
                                      String(product.id).includes(searchTerm);
                                      // (product.subcategory && product.subcategory.toLowerCase().includes(searchTerm)); // Subcategory logic removed

                // Excluir productos con stock 0
                const hasStock = product.stock > 0;

                return /*matchesCategory &&*/ matchesSearch && hasStock; // Category filter removed
            });

            // Mostrar mensaje si no hay productos
            if (products.length === 0) {
                productsContainer.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-database" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>No hay productos cargados</h3>
                        <p>Carga un archivo Excel para importar productos</p>
                    </div>
                `;
                paginationControls.style.display = 'none'; // Hide pagination if no products
                return;
            }

            // Mostrar mensaje si no hay productos en la categoría o búsqueda
            if (filteredProducts.length === 0) {
                productsContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #6c757d;">
                        <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>No se encontraron productos</h3>
                        <p>Ajusta tu búsqueda, selecciona otra categoría</p>
                    </div>
                `;
                paginationControls.style.display = 'none'; // Hide pagination if no products match filter
                return;
            }

            // Calculate total pages and adjust current page if necessary
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage > totalPages) currentPage = totalPages;
            if (currentPage < 1) currentPage = 1;

            // Get products for the current page
            const startIndex = (currentPage - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;
            const productsToDisplay = filteredProducts.slice(startIndex, endIndex);

            // Create the table structure
            const table = document.createElement('table');
            table.className = 'products-table';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            `;
            const tbody = table.querySelector('tbody');

            productsToDisplay.forEach(product => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <div class="product-name-col">
                            <span class="product-name">${product.name}</span>
                        </div>
                    </td>
                    <td><span class="product-price">${formatPrice(product.price)}</span></td>
                    <td><span class="product-stock">${product.stock} unidades</span></td>
                    <td>
                        <div class="action-buttons-cell">
                            <button type="button" class="add-to-cart btn btn-sm btn-primary" data-id="${product.id}">
                                <i class="fas fa-cart-plus"></i>
                            </button>
                            <button type="button" class="action-btn edit-btn btn btn-sm btn-info ${editModeActive ? '' : 'hidden-edit-button'}" data-id="${product.id}">
                                <i class="fas fa-edit"></i>
                            </button>
                        </div>
                    </td>
                `;
                tbody.appendChild(row);
            });

            productsContainer.appendChild(table);

            // Render pagination controls
            renderPaginationControls(totalPages);

            // Agregar event listeners a los botones de agregar al carrito
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
                    addToCart(productId);
                });
            });

            // Add event listeners for edit buttons
            document.querySelectorAll('.edit-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = parseInt(e.target.closest('.edit-btn').dataset.id);
                    openUpdateProductModal(productId);
                });
            });
        }

        // Function to render pagination controls
        function renderPaginationControls(totalPages) {
            paginationControls.style.display = totalPages > 1 ? 'flex' : 'none'; // Show only if more than 1 page
            pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        }

        // Función para agregar producto al carrito
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);

            if (!product) {
                showStatusMessage('Producto no encontrado', 'error');
                return;
            }

            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                // Verificar si hay suficiente stock
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity += 1;
                    product.lastUpdateDate = new Date().toLocaleString(); // Update last update date
                }
                else {
                    showStatusMessage(`No hay suficiente stock de ${product.name}. Solo quedan ${product.stock} unidades.`, 'error');
                    return;
                }
            }
            else {
                // Agregar nuevo producto al carrito
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                    // icon: product.icon // Removed
                });
                // No need to update product.lastUpdateDate here as it's not a direct stock change on the product itself
            }

            // LIMPIAR EL INPUT DE BÚSQUEDA Y PONER EL FOCO
                if (searchInput && searchInput.value.trim() !== '') {
                    searchInput.value = ''; // Limpiar el contenido
                    searchInput.focus(); // Poner el foco
                    currentPage = 1; // Resetear a la primera página
                    renderProducts(); // Re-renderizar los productos sin filtro de búsqueda
                }

            // Actualizar carrito
            searchInput.focus();
            updateCart();

            // Mostrar mensaje de confirmación
            showStatusMessage(`${product.name} agregado al carrito`, 'success');
            saveProductsToLocalStorage();
        }

        // Función para actualizar carrito
        function updateCart() {
            // Mostrar/ocultar mensaje de carrito vacío
            if (cart.length === 0) {
                emptyCartElement.style.display = 'block';
                cartItemsContainer.innerHTML = '';
                cartItemsContainer.appendChild(emptyCartElement);
                checkoutBtn.disabled = true;
            }
            else {
                emptyCartElement.style.display = 'none';

                // Limpiar contenedor de items del carrito
                cartItemsContainer.innerHTML = '';

                // Renderizar cada item del carrito
                cart.forEach(item => {
                    const cartItemElement = document.createElement('div');
                    cartItemElement.className = 'cart-item';
                    cartItemElement.innerHTML = `
                        <div class="cart-item-info">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">${formatPrice(item.price)} c/u</div>
                        </div>
                        <div class="cart-item-controls">
                            <input type="number" class="item-quantity" data-id="${item.id}" value="${item.quantity}" min="0.01" step="0.01" max="${products.find(p => p.id === item.id).stock}">
                            <button type="button" class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;

                    cartItemsContainer.appendChild(cartItemElement);
                });

                // Habilitar botón de checkout
                checkoutBtn.disabled = false;

                // Agregar event listeners a los controles de cantidad (input change)
                document.querySelectorAll('.item-quantity').forEach(input => {
                    input.addEventListener('change', (e) => {
                        const productId = parseInt(e.target.dataset.id);
                        const newQuantity = parseFloat(e.target.value);
                        updateQuantityFromInput(productId, newQuantity);
                    });
                });

                // Agregar event listeners a los botones de eliminar
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const productId = parseInt(e.target.closest('.remove-item').dataset.id);
                        removeFromCart(productId);
                    });
                });
            }

            // Calcular y actualizar totales
            calculateTotals();
        }

        // Función para actualizar cantidad de un producto en el carrito desde input
        function updateQuantityFromInput(productId, newQuantity) {
            const item = cart.find(item => item.id === productId);
            const product = products.find(p => p.id === productId);

            if (item) {
                if (isNaN(newQuantity) || newQuantity < 0.01) {
                    newQuantity = 0.01;
                }
                if (newQuantity > product.stock) {
                    showStatusMessage(`No hay suficiente stock de ${product.name}. Solo quedan ${product.stock} unidades.`, 'error');
                    newQuantity = product.stock;
                }
                item.quantity = newQuantity;
                product.lastUpdateDate = new Date().toLocaleString();
                updateCart();
                saveProductsToLocalStorage();

                // LIMPIAR EL INPUT DE BÚSQUEDA Y PONER EL FOCO
                if (searchInput && searchInput.value.trim() !== '') {
                    searchInput.value = ''; // Limpiar el contenido
                    searchInput.focus(); // Poner el foco
                    currentPage = 1; // Resetear a la primera página
                    renderProducts(); // Re-renderizar los productos sin filtro de búsqueda
                }

            }
            searchInput.focus();
        }

        // Función para eliminar producto del carrito
        function removeFromCart(productId) {
            const item = cart.find(item => item.id === productId);
            cart = cart.filter(item => item.id !== productId);
            updateCart();

            if ( item) {
                showStatusMessage(`${item.name} eliminado del carrito`, 'info');

                // LIMPIAR EL INPUT DE BÚSQUEDA Y PONER EL FOCO
                if (searchInput && searchInput.value.trim() !== '') {
                    searchInput.value = ''; // Limpiar el contenido
                    searchInput.focus(); // Poner el foco
                    currentPage = 1; // Resetear a la primera página
                    renderProducts(); // Re-renderizar los productos sin filtro de búsqueda
                }
            }
            searchInput.focus();
        }

        // Función para calcular totales (sin IVA)%
        function calculateTotals() {
            let subtotal = 0;

            cart.forEach(item => {
                subtotal += item.price * item.quantity;
            });

            // No IVA calculation
            const total = subtotal;

            // Actualizar elementos del DOM
            subtotalElement.textContent = formatPrice(total);
            totalElement.textContent = formatPrice(total);
        }

        // Función para procesar la venta
        function processSale() {
            // Verificar si el carrito tiene items
            if (cart.length === 0) {
                showStatusMessage("El carrito está vacío. Agrega productos antes de procesar la venta.", 'error');
                return;
            }

            // Generar ID de recibo aleatorio
            const receiptId = `PS-${Math.floor(Math.random() * 10000).toString().padStart(5, '0')}`;
            receiptIdElement.textContent = `ID: ${receiptId}`;

            // Actualizar fecha y hora en el recibo
            const now = new Date();
            receiptDateElement.textContent = now.toLocaleDateString('es-ES');
            receiptTimeElement.textContent = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            // Calcular total para el recibo
            let totalSale = 0;
            let receiptItemsHTML = '';

            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalSale += itemTotal;

                receiptItemsHTML += `
                    <div class="receipt-item">
                        <span>${item.name} x${item.quantity}</span>
                        <span>${formatPrice(itemTotal)}</span>
                    </div>
                `;
            });

            // Store sale data
            sales.push({
                id: receiptId,
                date: now.toLocaleDateString('es-ES'),
                time: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                user: currentUser ? currentUser.name : 'Desconocido',
                total: totalSale,
                items: cart.map(item => ({
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                    // icon: item.icon // Removed
                }))
            });
            saveSalesToLocalStorage();

            // Actualizar items y total en el recibo
            receiptItemsElement.innerHTML = receiptItemsHTML;
            receiptTotalElement.textContent = formatPrice(totalSale);

            // Generar y descargar PDF del recibo
            generateAndDownloadReceiptPDF(receiptId, now, receiptItemsHTML, totalSale);

            // Mostrar modal de recibo
            receiptModal.style.display = 'flex';

            // Actualizar stock de productos
            cart.forEach(cartItem => {
                const product = products.find(p => p.id === cartItem.id);
                if (product) {
                    product.stock -= cartItem.quantity;
                    product.lastUpdateDate = new Date().toLocaleString();
                }
            });

            // Vaciar carrito
            cart = [];
            updateCart();
            searchInput.focus();

            // LIMPIAR EL INPUT DE BÚSQUEDA Y PONER EL FOCO
            if (searchInput && searchInput.value.trim() !== '') {
                searchInput.value = ''; // Limpiar el contenido
                searchInput.focus(); // Poner el foco
                currentPage = 1; // Resetear a la primera página
                renderProducts(); // Re-renderizar los productos sin filtro de búsqueda
            }

            // Actualizar lista de productos
            renderProducts();

            showStatusMessage('Venta procesada correctamente', 'success');
            saveProductsToLocalStorage();
        }

        // Función para generar y descargar PDF del recibo
        function generateAndDownloadReceiptPDF(receiptId, date, itemsHTML, total) {
            console.log('Verificando jsPDF:', window.jspdf); // Agregar para depurar
            const { jsPDF } = window.jspdf;
            // Tamaño cuadrado para ticket: 50mm x 50mm
            const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [50, 50] }); // 50mm ancho y alto

            let yPosition = 3; // Posición Y inicial
            const pageHeight = 50; // Altura de la página en mm
            const marginBottom = -4; // Margen inferior

            // Función auxiliar para verificar y agregar página si es necesario
            function checkPageBreak(neededSpace) {
                if (yPosition + neededSpace > pageHeight - marginBottom) {
                    doc.addPage([50, 50]);
                    yPosition = 3; // Reiniciar yPosition en nueva página
                }
            }

            // Fuente para ticket
            doc.setFontSize(6);

            // Título centrado
            checkPageBreak(4);
            doc.text('PetShop - Punto de Venta', 25, yPosition, { align: 'center' });
            yPosition += 4;

            // Línea separadora
            checkPageBreak(4);
            doc.line(4, yPosition, 45, yPosition);
            yPosition += 4;

            // ID del recibo
            checkPageBreak(4);
            doc.text(`ID: ${receiptId}`, 5, yPosition);
            yPosition += 4;

            // Fecha y hora
            checkPageBreak(8);
            doc.text(`Fecha: ${date.toLocaleDateString('es-ES')}`, 5, yPosition);
            yPosition += 4;
            doc.text(`Hora: ${date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`, 5, yPosition);
            yPosition += 4;

            // Línea separadora
            checkPageBreak(4);
            doc.line(4, yPosition, 45, yPosition);
            yPosition += 4;

            // Items (simplificado para ticket)
            checkPageBreak(4);
            doc.text('Productos:', 5, yPosition);
            yPosition += 4;

            // Parsear itemsHTML para extraer texto
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = itemsHTML;
            const items = tempDiv.querySelectorAll('.receipt-item');
            items.forEach(item => {
                const spans = item.querySelectorAll('span');
                if (spans.length >= 2) {
                    const productText = spans[0].textContent.substring(); // Truncar menos
                    const priceText = spans[1].textContent;
                    if (productText.length > 36){
                        checkPageBreak(12);
                        doc.text(productText, 5, yPosition);
                        yPosition += 8;
                        doc.text(priceText, 45, yPosition, { align: 'right' });
                        yPosition += 4;
                    }else{
                        checkPageBreak(8);
                        doc.text(productText, 5, yPosition);
                        yPosition += 4;
                        doc.text(priceText, 45, yPosition, { align: 'right' });
                        yPosition += 4;
                    }
                }
            });

            // Línea separadora
            checkPageBreak(4);
            doc.line(4, yPosition, 45, yPosition);
            yPosition += 4;

            // Total
            checkPageBreak(4);
            doc.setFontSize(8); // Un poco más grande para el total
            doc.text(`Total: ${formatPrice(total)}`, 45, yPosition, { align: 'right' });
            yPosition += 4;

            // Mensaje de agradecimiento
            checkPageBreak(5);
            doc.setFontSize(8);
            doc.text('¡Gracias por su compra!', 25, yPosition, { align: 'center' });

            // Descargar PDF
            doc.save(`${receiptId}.pdf`);
        }

        // Función para imprimir recibo
        function printReceipt() {
            const printContent = document.querySelector('.receipt-content').innerHTML;
            const originalContent = document.body.innerHTML;

            document.body.innerHTML = `
                <html>
                    <head>
                        <title>Recibo PetShop</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            .receipt-content { width: 100%; }
                            .receipt-header { text-align: center; margin-bottom: 20px; }
                            .receipt-item { display: flex; justify-content: space-between; margin-bottom: 8px; }
                            .modal-buttons { display: none; }
                        </style>
                    </head>
                    <body>${printContent}</body>
                </html>
            `;

            window.print();
            document.body.innerHTML = originalContent;

            // Volver a cargar los event listeners
            initEventListeners();
        }

        // Function to open Add Product Modal
        function openAddProductModal() {
            addProductForm.reset();
            addProductFormStatusMessage.innerHTML = '';

            // configurar para decimales
            addProductPriceInput.type = 'number';
            addProductPriceInput.step = '0.01';
            addProductStockInput.type = 'number';
            addProductStockInput.step = '0.01';
            addProductStockInput.min = '0';

            addProductModal.style.display = 'flex';
        }

        // Function to open Update Product Modal
        function openUpdateProductModal(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) {
                showStatusMessage('Producto no encontrado para actualizar', 'error');
                return;
            }

            // Populate form fields with product data
            updateProductIdInput.value = product.id;
            updateProductNameInput.value = product.name;
            updateProductPriceInput.value = product.price;
            updateProductCategoryInput.value = product.category;
            updateProductStockInput.value = product.stock;
            // updateProductIconInput.value = product.icon; // Removed
            updateProductFormStatusMessage.innerHTML = '';
            updateProductModal.style.display = 'flex';
        }

        // Function to close Add Product Modal
        function closeAddProductModal() {
            addProductModal.style.display = 'none';
        }

        // Function to close Update Product Modal
        function closeUpdateProductModal() {
            updateProductModal.style.display = 'none';
        }

        // Function to open Add User Modal
        function openAddUserModal() {
            addUserForm.reset();
            addUserFormStatusMessage.innerHTML = '';
            addUserModal.style.display = 'flex';
        }

        // Function to close Add User Modal
        function closeAddUserModal() {
            addUserModal.style.display = 'none';
        }

        // Función para mostrar mensajes en el formulario de reportes
        function showReportsFormStatusMessage(message, type = 'info') {
            reportsFormStatusMessage.innerHTML = `<div class="status-message ${type}">${message}</div>`;
        
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    reportsFormStatusMessage.innerHTML = '';
                }, 5000);
            }
        }

        // Función para abrir el modal de reportes
        function openReportsModal() {
            // Establecer fechas por defecto (últimos 30 días)
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);

            startDateInput.value = startDate.toISOString().split('T')[0];
            endDateInput.value = endDate.toISOString().split('T')[0];

            reportsFormStatusMessage.innerHTML = '';
            reportResults.style.display = 'none';
            reportsModal.style.display = 'flex';
        }

        // Función para cerrar el modal de reportes
        function closeReportsModal() {
            reportsModal.style.display = 'none';
            exportPdfBtn.style.display = 'none';
            if (salesChart) {
                salesChart.destroy();
                salesChart = null;
            }
        }

        // Función para filtrar ventas por rango de fechas
        function filterSalesByDateRange(startDate, endDate) {
            return sales.filter(sale => {
                const saleDate = parseDate(sale.date);
                return saleDate >= startDate && saleDate <= endDate;
            });
        }

        // Función mejorada para parsear fecha en formato español
        function parseDate(dateString) {
            // Si es un objeto Date, retornarlo directamente
            if (dateString instanceof Date) {
                return dateString;
            }

            // Intentar formato español (dd/mm/yyyy)
            const parts = dateString.split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                return new Date(year, month - 1, day);
            }

            // Intentar formato con hora (dd/mm/yyyy hh:mm)
            if (dateString.includes(' ')) {
                const [datePart, timePart] = dateString.split(' ');
                const dateParts = datePart.split('/');
                if (dateParts.length === 3) {
                    const [day, month, year] = dateParts;
                    const timeParts = timePart.split(':');
                    const hours = parseInt(timeParts[0]) || 0;
                    const minutes = parseInt(timeParts[1]) || 0;
                    return new Date(year, month - 1, day, hours, minutes);
                }
            }

            // Intentar formato ISO
            const isoDate = new Date(dateString);
            if (!isNaN(isoDate.getTime())) {
                return isoDate;
            }

            // Si todo falla, retornar fecha actual
            console.warn('No se pudo parsear la fecha:', dateString);
            return new Date();
        }

        // Función para formatear fecha para visualización
        function formatDateForDisplay(date) {
            return date.toLocaleDateString('es-ES');
        }

        // Función para generar estadísticas de ventas
        function generateSalesStats(filteredSales) {
            const stats = {
                totalSales: filteredSales.length,
                totalAmount: 0,
                totalItems: 0,
                salesByDay: {},
                salesByUser: {},
                topProducts: {}
            };

            filteredSales.forEach(sale => {
                stats.totalAmount += sale.total;

                // Contar items por venta
                sale.items.forEach(item => {
                    stats.totalItems += item.quantity;

                    // Acumular por producto
                    if (!stats.topProducts[item.name]) {
                        stats.topProducts[item.name] = {
                            name: item.name,
                            quantity: 0,
                            revenue: 0
                        };
                    }
                    stats.topProducts[item.name].quantity += item.quantity;
                    stats.topProducts[item.name].revenue += item.quantity * item.price;
                });

                // Acumular por día
                const saleDay = sale.date;
                if (!stats.salesByDay[saleDay]) {
                    stats.salesByDay[saleDay] = {
                        date: saleDay,
                        amount: 0,
                        count: 0
                    };
                }
                stats.salesByDay[saleDay].amount += sale.total;
                stats.salesByDay[saleDay].count += 1;

                // Acumular por usuario
                if (!stats.salesByUser[sale.user]) {
                    stats.salesByUser[sale.user] = {
                        user: sale.user,
                        amount: 0,
                        count: 0
                    };
                }
                stats.salesByUser[sale.user].amount += sale.total;
                stats.salesByUser[sale.user].count += 1;
            });

            return stats;
        }

        // Función para renderizar gráfico
        function renderSalesChart(stats, chartType = 'bar') {
            const ctx = document.getElementById('sales-chart').getContext('2d');

            // Destruir gráfico anterior si existe
            if (salesChart) {
                salesChart.destroy();
            }

            // Preparar datos para el gráfico
            const days = Object.keys(stats.salesByDay).sort();
            const amounts = days.map(day => stats.salesByDay[day].amount);

            const config = {
                type: chartType,
                data: {
                    labels: days,
                    datasets: [{
                        label: 'Ventas por Día ($)',
                        data: amounts,
                        backgroundColor: chartType === 'bar' ? 'rgba(54, 162, 235, 0.5)' : 
                                      chartType === 'line' ? 'rgba(54, 162, 235, 0.2)' : 
                                      getRandomColors(days.length),
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Ventas por Día',
                            font: {
                                size: 16
                            }
                        },
                        legend: {
                            display: chartType === 'pie' || chartType === 'doughnut'
                        }
                    },
                    scales: chartType !== 'pie' && chartType !== 'doughnut' ? {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return '$' + value.toFixed(2);
                                }
                            }
                        }
                    } : {}
                }
            };

            salesChart = new Chart(ctx, config);
        }

        // Función para generar colores aleatorios para gráficos de pastel
        function getRandomColors(count) {
            const colors = [];
            for (let i = 0; i < count; i++) {
                colors.push(`hsl(${(i * 360) / count}, 70%, 60%)`);
            }
            return colors;
        }

        // Función para renderizar tabla de ventas detalladas
        function renderSalesTable(filteredSales) {
            salesTableBody.innerHTML = '';

            // Ordenar por fecha descendente (ya está ordenado en generateSalesReport)
            filteredSales.forEach(sale => {
                const row = document.createElement('tr');

                // Calcular cantidad total de productos
                const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);

                // Crear lista de productos
                const productsList = sale.items.map(item => 
                    `<div class="product-list-item">
                        <span class="product-name-small">${item.name}</span>
                        <span class="product-quantity-small">x${item.quantity}</span>
                    </div>`
                ).join('');

                // Agregar indicador de nueva venta si es del día actual
                const saleDate = parseDate(sale.date);
                const today = new Date();
                const isToday = saleDate.toDateString() === today.toDateString();
                const isRecent = (today - saleDate) < 24 * 60 * 60 * 1000; // Menos de 24 horas

                let dateBadge = '';
                if (isToday) {
                    dateBadge = '<span class="badge badge-success" style="margin-left: 5px; font-size: 10px;">HOY</span>';
                } else if (isRecent) {
                    dateBadge = '<span class="badge badge-info" style="margin-left: 5px; font-size: 10px;">RECIENTE</span>';
                }

                row.innerHTML = `
                    <td>
                        <div style="display: flex; align-items: center; gap: 5px;">
                            <span>${sale.id}</span>
                            ${dateBadge}
                        </div>
                    </td>
                    <td>
                        <div style="font-weight: 600;">${sale.date}</div>
                        <div style="font-size: 12px; color: #718096;">${sale.time}</div>
                    </td>
                    <td>
                        <div class="user-badge" style="background: #e9d8fd; color: #553c9a; padding: 4px 8px; border-radius: 12px; font-size: 12px; display: inline-block;">
                            ${sale.user}
                        </div>
                    </td>
                    <td><div class="products-list">${productsList}</div></td>
                    <td>
                        <span class="badge badge-primary" style="background: #4c51bf; color: white; padding: 5px 10px; border-radius: 10px; font-size: 12px;">
                            ${totalItems} items
                        </span>
                    </td>
                    <td>
                        <span style="font-weight: 700; color: #2d3748;">${formatPrice(sale.total)}</span>
                    </td>
                `;

                salesTableBody.appendChild(row);
            });
        }

        // Función para generar reporte de ventas
        function generateSalesReport(startDate, endDate, chartType = 'bar') {
            if (sales.length === 0) {
                showReportsFormStatusMessage('No hay datos de ventas para generar reportes.', 'error');
                return;
            }

            // Filtrar ventas por rango de fechas
            let filteredSales = filterSalesByDateRange(startDate, endDate);

            if (filteredSales.length === 0) {
                showReportsFormStatusMessage('No hay ventas en el rango de fechas seleccionado.', 'error');
                return;
            }

            // Ordenar por fecha descendente (más reciente primero)
            filteredSales.sort((a, b) => {
                const dateA = parseDate(a.date + ' ' + a.time);
                const dateB = parseDate(b.date + ' ' + b.time);
                return dateB - dateA; // Orden descendente
            });

            // Generar estadísticas
            const stats = generateSalesStats(filteredSales);

            // Actualizar estadísticas en la UI
            totalSalesAmount.textContent = formatPrice(stats.totalAmount);
            totalSalesCount.textContent = stats.totalSales;
            totalItemsSold.textContent = stats.totalItems;
            averageSale.textContent = formatPrice(stats.totalSales > 0 ? stats.totalAmount / stats.totalSales : 0);

            // Renderizar gráfico
            renderSalesChart(stats, chartType);

            // Renderizar tabla de ventas
            renderSalesTable(filteredSales);

            // Mostrar resultados y botón de PDF
            reportResults.style.display = 'block';
            exportPdfBtn.style.display = 'block';

            // Guardar datos del reporte actual para exportación
            window.currentReportData = {
                startDate,
                endDate,
                filteredSales,
                stats,
                chartType
            };

            showReportsFormStatusMessage(`Reporte generado: ${filteredSales.length} ventas encontradas`, 'success');
        }

        // Función para exportar reporte a Excel
        function exportReportToExcel() {
            if (!window.currentReportData || !window.currentReportData.filteredSales) {
                showReportsFormStatusMessage('No hay datos de reporte para exportar.', 'error');
                return;
            }

            const { filteredSales, stats, startDate, endDate } = window.currentReportData;

            // Crear datos para exportación
            const exportData = [];

            // Agregar resumen del reporte
            exportData.push(
                { 'Tipo': 'Reporte de Ventas', 'Valor': '' },
                { 'Tipo': 'Período', 'Valor': `${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}` },
                { 'Tipo': 'Total Ventas', 'Valor': filteredSales.length },
                { 'Tipo': 'Monto Total', 'Valor': formatPrice(stats.totalAmount) },
                { 'Tipo': 'Productos Vendidos', 'Valor': stats.totalItems },
                { 'Tipo': 'Venta Promedio', 'Valor': formatPrice(stats.totalSales > 0 ? stats.totalAmount / stats.totalSales : 0) },
                { 'Tipo': '', 'Valor': '' }
            );

            // Agregar encabezados de ventas detalladas
            exportData.push(
                { 'ID Venta': '', 'Fecha': '', 'Hora': '', 'Usuario': '', 'Producto': '', 'Cantidad': '', 'Precio Unitario': '', 'Total Producto': '' }
            );

            // Agregar ventas detalladas
            filteredSales.forEach(sale => {
                sale.items.forEach(item => {
                    exportData.push({
                        'ID Venta': sale.id,
                        'Fecha': sale.date,
                        'Hora': sale.time,
                        'Usuario': sale.user,
                        'Producto': item.name,
                        'Cantidad': item.quantity,
                        'Precio Unitario': item.price,
                        'Total Producto': (item.quantity * item.price).toFixed(2)
                    });
                });
            });

            // Agregar separador
            exportData.push(
                { 'Tipo': '', 'Valor': '' },
                { 'Tipo': 'Ventas por Día', 'Valor': '' }
            );

            // Agregar ventas por día
            Object.keys(stats.salesByDay).sort().forEach(day => {
                exportData.push({
                    'Tipo': day,
                    'Valor': formatPrice(stats.salesByDay[day].amount)
                });
            });

            // Crear hoja de trabajo
            const ws = XLSX.utils.json_to_sheet(exportData);

            // Crear libro de trabajo
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Reporte_Ventas');

            // Generar nombre de archivo
            const startStr = startDate.toISOString().split('T')[0];
            const endStr = endDate.toISOString().split('T')[0];
            const fileName = `reporte_ventas_${startStr}_${endStr}.xlsx`;

            // Descargar archivo
            XLSX.writeFile(wb, fileName);
        
            showReportsFormStatusMessage('Reporte exportado a Excel correctamente', 'success');
        }
            
        // Función para exportar reporte a PDF
        function exportReportToPDF() {
            if (!window.currentReportData || !window.currentReportData.filteredSales) {
                showReportsFormStatusMessage('No hay datos de reporte para exportar a PDF.', 'error');
                return;
            }

            const { startDate, endDate, filteredSales, stats, chartType } = window.currentReportData;

            // Mostrar mensaje de procesamiento
            showReportsFormStatusMessage('Generando PDF, por favor espere...', 'info');

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Configuración
            const pageWidth = pdf.internal.pageSize.getWidth();
            const margin = 20;
            let yPosition = margin;
            const lineHeight = 7;
            const sectionSpacing = 15;

            // Función para agregar texto con manejo de salto de página
            function addText(text, x, y, options = {}) {
                const maxWidth = pageWidth - (margin * 2) - (x - margin);
                const lines = pdf.splitTextToSize(text, maxWidth);

                // Verificar si hay espacio suficiente
                const neededHeight = lines.length * lineHeight;
                if (y + neededHeight > pdf.internal.pageSize.getHeight() - margin) {
                    pdf.addPage();
                    y = margin;
                }

                pdf.text(lines, x, y, options);
                return y + (lines.length * lineHeight) + (options.spacing || 0);
            }

            // Función mejorada para dibujar línea
            function drawLine(y, startX = margin, endX = pageWidth - margin, color = [200, 200, 200], width = 0.5) {
                pdf.setDrawColor(...color);
                pdf.setLineWidth(width);
                pdf.line(startX, y, endX, y);
                return y + 5;
            }


            // Función para crear una celda de tabla
            function addTableCell(text, x, y, width, align = 'left', bold = false) {
                if (bold) {
                    pdf.setFont(undefined, 'bold');
                }

                // Establecer color de fondo para encabezados
                if (bold) {
                    pdf.setFillColor(102, 126, 234);
                    pdf.rect(x, y - 4, width, 8, 'F');
                    pdf.setTextColor(255, 255, 255);
                } else {
                    pdf.setTextColor(0, 0, 0);
                }

                pdf.text(text, x + (align === 'center' ? width / 2 : align === 'right' ? width - 2 : 2), y, {
                    align: align
                });

                if (bold) {
                    pdf.setFont(undefined, 'normal');
                    pdf.setTextColor(0, 0, 0);
                }

                // Dibujar borde de la celda
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.2);
                pdf.rect(x, y - 4, width, 8);
            }

            // 1. ENCABEZADO DEL REPORTE
            pdf.setFontSize(24);
            pdf.setTextColor(102, 126, 234);
            yPosition = addText('REPORTE DE VENTAS', margin, yPosition);

            pdf.setFontSize(14);
            pdf.setTextColor(118, 75, 162);
            yPosition = addText(`Período: ${formatDateForDisplay(startDate)} - ${formatDateForDisplay(endDate)}`, 
                               margin, yPosition + 5);

            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            yPosition = addText(`Generado el ${new Date().toLocaleDateString('es-ES')} a las ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}`, 
                               margin, yPosition + 3);

            yPosition = drawLine(yPosition + 10);

            // 2. RESUMEN ESTADÍSTICO
            pdf.setFontSize(16);
            pdf.setTextColor(76, 81, 191);
            yPosition = addText('RESUMEN ESTADÍSTICO', margin, yPosition + sectionSpacing);

            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 0);

            // Crear tabla de estadísticas
            const statWidth = (pageWidth - (margin * 2)) / 4;
            let statX = margin;

            // Fila de títulos
            addTableCell('TOTAL VENTAS', statX, yPosition + 10, statWidth, 'center', true);
            addTableCell('CANT. VENTAS', statX + statWidth, yPosition + 10, statWidth, 'center', true);
            addTableCell('PROD. VENDIDOS', statX + (statWidth * 2), yPosition + 10, statWidth, 'center', true);
            addTableCell('VENTA PROMEDIO', statX + (statWidth * 3), yPosition + 10, statWidth, 'center', true);

            // Fila de valores
            addTableCell(formatPrice(stats.totalAmount), statX, yPosition + 20, statWidth, 'center');
            addTableCell(stats.totalSales.toString(), statX + statWidth, yPosition + 20, statWidth, 'center');
            addTableCell(stats.totalItems.toString(), statX + (statWidth * 2), yPosition + 20, statWidth, 'center');
            addTableCell(formatPrice(stats.totalSales > 0 ? stats.totalAmount / stats.totalSales : 0), 
                         statX + (statWidth * 3), yPosition + 20, statWidth, 'center');

            yPosition += 30;
            yPosition = drawLine(yPosition + 10);

            // 3. CAPTURAR Y AGREGAR IMAGEN DEL GRÁFICO
            const chartCanvas = document.getElementById('sales-chart');
            if (chartCanvas) {
                html2canvas(chartCanvas, {
                    scale: 2,
                    backgroundColor: '#ffffff',
                    logging: false
                }).then(chartImage => {
                    const imgData = chartImage.toDataURL('image/png');
                    const imgWidth = pageWidth - (margin * 2);
                    const imgHeight = (chartCanvas.height * imgWidth) / chartCanvas.width;

                    // Verificar espacio en página
                    if (yPosition + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
                        pdf.addPage();
                        yPosition = margin;
                    }

                    pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
                    yPosition += imgHeight + 10;

                    // Continuar con el resto del contenido después de la imagen
                    continuePDFContent();
                }).catch(error => {
                    console.error('Error capturando gráfico:', error);
                    continuePDFContent();
                });
            } else {
                continuePDFContent();
            }

            // Función para continuar con el contenido del PDF
            function continuePDFContent() {
                // 4. VENTAS POR DÍA
                pdf.setFontSize(16);
                pdf.setTextColor(76, 81, 191);
                yPosition = addText('VENTAS POR DÍA', margin, yPosition + sectionSpacing);

                // Ordenar días descendente
                const sortedDays = Object.keys(stats.salesByDay).sort((a, b) => {
                    return parseDate(b) - parseDate(a);
                });

                if (sortedDays.length > 0) {
                    const dayWidth = (pageWidth - (margin * 2)) / 4;
                    let dayX = margin;

                    // Encabezados de tabla
                    addTableCell('FECHA', dayX, yPosition + 10, dayWidth, 'center', true);
                    addTableCell('VENTAS', dayX + dayWidth, yPosition + 10, dayWidth, 'center', true);
                    addTableCell('TOTAL', dayX + (dayWidth * 2), yPosition + 10, dayWidth, 'center', true);
                    addTableCell('PROMEDIO', dayX + (dayWidth * 3), yPosition + 10, dayWidth, 'center', true);

                    let tableY = yPosition + 20;

                    // Filas de datos
                    sortedDays.forEach(day => {
                        const dayStats = stats.salesByDay[day];

                        // Verificar espacio para nueva fila
                        if (tableY > pdf.internal.pageSize.getHeight() - margin) {
                            pdf.addPage();
                            tableY = margin + 20;
                        }

                        addTableCell(day, dayX, tableY, dayWidth, 'center');
                        addTableCell(dayStats.count.toString(), dayX + dayWidth, tableY, dayWidth, 'center');
                        addTableCell(formatPrice(dayStats.amount), dayX + (dayWidth * 2), tableY, dayWidth, 'center');
                        addTableCell(formatPrice(dayStats.amount / dayStats.count), 
                                   dayX + (dayWidth * 3), tableY, dayWidth, 'center');

                        tableY += 8;
                    });

                    yPosition = tableY;
                }

                yPosition = drawLine(yPosition + 10);

                // 5. PRODUCTOS MÁS VENDIDOS (Top 10)
                pdf.setFontSize(16);
                pdf.setTextColor(76, 81, 191);
                yPosition = addText('PRODUCTOS MÁS VENDIDOS', margin, yPosition + sectionSpacing);

                // Ordenar productos por cantidad descendente
                const sortedProducts = Object.values(stats.topProducts)
                    .sort((a, b) => b.quantity - a.quantity)
                    .slice(0, 10);

                if (sortedProducts.length > 0) {
                    const prodWidth = (pageWidth - (margin * 2)) / 4;
                    let prodX = margin;

                    // Encabezados
                    addTableCell('PRODUCTO', prodX, yPosition + 10, prodWidth * 2, 'center', true);
                    addTableCell('CANTIDAD', prodX + (prodWidth * 2), yPosition + 10, prodWidth, 'center', true);
                    addTableCell('INGRESOS', prodX + (prodWidth * 3), yPosition + 10, prodWidth, 'center', true);

                    let prodY = yPosition + 20;

                    // Filas de datos
                    sortedProducts.forEach((product, index) => {
                        if (prodY > pdf.internal.pageSize.getHeight() - margin) {
                            pdf.addPage();
                            prodY = margin + 20;
                        }

                        // Truncar nombre largo
                        const productName = product.name.length > 30 ? 
                            product.name.substring(0, 30) + '...' : product.name;

                        addTableCell(`${index + 1}. ${productName}`, prodX, prodY, prodWidth * 2, 'left');
                        addTableCell(product.quantity.toString(), prodX + (prodWidth * 2), prodY, prodWidth, 'center');
                        addTableCell(formatPrice(product.revenue), prodX + (prodWidth * 3), prodY, prodWidth, 'center');

                        prodY += 8;
                    });

                    yPosition = prodY;
                }

                yPosition = drawLine(yPosition + 10);

                // 6. DETALLE DE VENTAS (simplificado)
                pdf.setFontSize(16);
                pdf.setTextColor(76, 81, 191);
                yPosition = addText('DETALLE DE VENTAS', margin, yPosition + sectionSpacing);

                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);
                yPosition = addText(`Total de ventas en el período: ${filteredSales.length}`, margin, yPosition + 5);

                // Tabla simplificada de ventas
                const saleWidth = (pageWidth - (margin * 2)) / 6;
                let saleX = margin;

                // Encabezados (solo en primera página)
                addTableCell('ID', saleX, yPosition + 10, saleWidth, 'center', true);
                addTableCell('FECHA', saleX + saleWidth, yPosition + 10, saleWidth, 'center', true);
                addTableCell('USUARIO', saleX + (saleWidth * 2), yPosition + 10, saleWidth, 'center', true);
                addTableCell('PRODUCTOS', saleX + (saleWidth * 3), yPosition + 10, saleWidth, 'center', true);
                addTableCell('ITEMS', saleX + (saleWidth * 4), yPosition + 10, saleWidth, 'center', true);
                addTableCell('TOTAL', saleX + (saleWidth * 5), yPosition + 10, saleWidth, 'center', true);

                let saleY = yPosition + 20;

                // Filas de ventas (mostrar solo las primeras 50 para no saturar)
                const salesToShow = filteredSales.slice(0, 50);
                salesToShow.forEach(sale => {
                    if (saleY > pdf.internal.pageSize.getHeight() - margin) {
                        pdf.addPage();
                        saleY = margin + 20;

                        // Redibujar encabezados en nueva página
                        addTableCell('ID', saleX, saleY - 10, saleWidth, 'center', true);
                        addTableCell('FECHA', saleX + saleWidth, saleY - 10, saleWidth, 'center', true);
                        addTableCell('USUARIO', saleX + (saleWidth * 2), saleY - 10, saleWidth, 'center', true);
                        addTableCell('PRODUCTOS', saleX + (saleWidth * 3), saleY - 10, saleWidth, 'center', true);
                        addTableCell('ITEMS', saleX + (saleWidth * 4), saleY - 10, saleWidth, 'center', true);
                        addTableCell('TOTAL', saleX + (saleWidth * 5), saleY - 10, saleWidth, 'center', true);
                    }

                    const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);
                    const uniqueProducts = new Set(sale.items.map(item => item.name)).size;

                    // Truncar usuario si es muy largo
                    const userDisplay = sale.user.length > 10 ? 
                        sale.user.substring(0, 10) + '...' : sale.user;

                    addTableCell(sale.id, saleX, saleY, saleWidth, 'center');
                    addTableCell(sale.date, saleX + saleWidth, saleY, saleWidth, 'center');
                    addTableCell(userDisplay, saleX + (saleWidth * 2), saleY, saleWidth, 'center');
                    addTableCell(uniqueProducts.toString(), saleX + (saleWidth * 3), saleY, saleWidth, 'center');
                    addTableCell(totalItems.toString(), saleX + (saleWidth * 4), saleY, saleWidth, 'center');
                    addTableCell(formatPrice(sale.total), saleX + (saleWidth * 5), saleY, saleWidth, 'center');

                    saleY += 8;
                });

                // Nota si hay más ventas
                if (filteredSales.length > 50) {
                    pdf.setFontSize(9);
                    pdf.setTextColor(150, 150, 150);
                    yPosition = addText(`Nota: Se muestran 50 de ${filteredSales.length} ventas. Para ver el detalle completo, exporte a Excel.`, 
                                      margin, saleY + 10);
                }

                // 7. PIE DE PÁGINA
                const footerY = pdf.internal.pageSize.getHeight() - margin;
                pdf.setFontSize(10);
                pdf.setTextColor(100, 100, 100);

                // Línea separadora
                pdf.setDrawColor(200, 200, 200);
                pdf.setLineWidth(0.5);
                pdf.line(margin, footerY - 20, pageWidth - margin, footerY - 20);

                // Texto del pie
                pdf.text(`Página ${pdf.internal.getNumberOfPages()}`, margin, footerY - 10);
                pdf.text('Reporte generado por PetShop POS System', pageWidth - margin, footerY - 10, { align: 'right' });
                pdf.text(`© ${new Date().getFullYear()} - Todos los derechos reservados`, pageWidth / 2, footerY - 5, { align: 'center' });

                // 8. GUARDAR PDF
                const startStr = startDate.toISOString().split('T')[0];
                const endStr = endDate.toISOString().split('T')[0];
                const fileName = `reporte_ventas_${startStr}_${endStr}.pdf`;

                pdf.save(fileName);

                showReportsFormStatusMessage('Reporte exportado a PDF correctamente', 'success');
            }
        }

        // Función para formatear fecha para PDF
        function formatDateForDisplay(date) {
            if (!(date instanceof Date)) {
                date = new Date(date);
            }
            
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            
            return `${day}/${month}/${year}`;
        }

        // Función auxiliar para generar el PDF
        function generatePDF(element, startDate, endDate) {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Configuración
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 15;

            // Usar html2canvas para convertir el elemento a imagen
            html2canvas(element, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            }).then(canvas => {
                const imgData = canvas.toDataURL('image/png');
                const imgWidth = pageWidth - (margin * 2);
                const imgHeight = (canvas.height * imgWidth) / canvas.width;

                let heightLeft = imgHeight;
                let position = margin;
                let page = 1;

                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;

                // Agregar páginas adicionales si es necesario
                while (heightLeft > 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                    heightLeft -= pageHeight;
                    page++;
                }

                // Generar nombre de archivo
                const startStr = startDate.toISOString().split('T')[0];
                const endStr = endDate.toISOString().split('T')[0];
                const fileName = `reporte_ventas_${startStr}_${endStr}.pdf`;

                // Descargar PDF
                pdf.save(fileName);

                showReportsFormStatusMessage('Reporte exportado a PDF correctamente', 'success');
            }).catch(error => {
                console.error('Error generando PDF:', error);
                showReportsFormStatusMessage('Error al exportar a PDF: ' + error.message, 'error');
            });
        }


        // Function to toggle edit mode
        function toggleEditMode() {
            const enteredPassword = prompt('Introduce la clave de administrador para activar/desactivar el modo edición:');

            if (enteredPassword === ADMIN_PASSWORD) {
                editModeActive = !editModeActive;

                // Select all edit buttons (within the table rows)
                const editButtons = document.querySelectorAll('.products-table .edit-btn');
                editButtons.forEach(button => {
                    if (editModeActive) {
                        button.classList.remove('hidden-edit-button');
                    } else {
                        button.classList.add('hidden-edit-button');
                    }
                });

                // Toggle visibility of add product button and excel controls
                const addProductBtn = document.getElementById('open-add-product-modal-btn');
                if (addProductBtn) {
                    if (editModeActive) {
                        addProductBtn.classList.remove('hidden-edit-button');
                    } else {
                        addProductBtn.classList.add('hidden-edit-button');
                    }
                }

                // Toggle visibility of add user button
                const addUserBtn = document.getElementById('open-add-user-modal-btn');
                if (addUserBtn) {
                    if (editModeActive) {
                        addUserBtn.classList.remove('hidden-edit-button');
                    } else {
                        addUserBtn.classList.add('hidden-edit-button');
                    }
                }

                // Toggle visibility of arrival button (both in product management section and excel controls)
                const openArrivalModalBtn = document.getElementById('open-arrival-modal-btn');
                const excelControlsArrivalBtn = document.querySelector('.excel-controls #open-arrival-modal-btn');
                const exportArrivalsBtn = document.getElementById('export-arrivals');

                [openArrivalModalBtn, excelControlsArrivalBtn].forEach(btn => {
                    if (btn) {
                        if (editModeActive) {
                            btn.classList.remove('hidden-edit-button');
                        } else {
                            btn.classList.add('hidden-edit-button');
                        }
                    }
                });
            
                if (exportArrivalsBtn) {
                    if (editModeActive) {
                        exportArrivalsBtn.classList.remove('hidden-edit-button');
                    } else {
                        exportArrivalsBtn.classList.add('hidden-edit-button');
                    }
                }
                
                // Toggle visibility of excel controls
                if (excelControls) {
                    if (editModeActive) {
                        excelControls.classList.remove('hidden-edit-button');
                    } else {
                        excelControls.classList.add('hidden-edit-button');
                    }
                }

                // Toggle visibility of reports button
                const reportsBtn = document.getElementById('open-reports-modal-btn');
                if (reportsBtn) {
                    if (editModeActive) {
                        reportsBtn.classList.remove('hidden-edit-button');
                    } else {
                        reportsBtn.classList.add('hidden-edit-button');
                    }
                }


                showStatusMessage(editModeActive ? 'Modo edición ACTIVADO' : 'Modo edición DESACTIVADO', 'info');
            } else if (enteredPassword !== null) {
                showStatusMessage('Clave incorrecta. El modo edición no se activó.', 'error');
            }
        }
    
        // Variables para gestión de sesión
        const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hora en milisegundos
        let sessionTimer = null;
            
        // Función para verificar sesión existente
        function checkExistingSession() {
            const sessionData = localStorage.getItem('petshop_session');
                
            if (sessionData) {
                try {
                    const session = JSON.parse(sessionData);
                    const now = new Date().getTime();
                
                    // Verificar si la sesión ha expirado
                    if (session.expiresAt && now < session.expiresAt) {
                        // Buscar el usuario correspondiente al código
                        const user = users.find(u => u.code === session.userCode);
                        if (user) {
                            currentUser = user;
                            startSessionTimer();
                            hideLoginModal();
                            updateUserDisplay();
                        
                            // MOSTRAR INTERFAZ PRINCIPAL INMEDIATAMENTE
                            const mainContent = document.querySelector('.main-content');
                            const footer = document.querySelector('footer');
                            
                            if (mainContent) {
                                mainContent.style.display = 'flex';
                            }
                            if (footer) {
                                footer.style.display = 'flex';
                            }
                        
                            // Inicializar interfaz principal
                            initMainInterface();
                        
                            return true;
                        }
                    } else {
                        // Sesión expirada, limpiar
                        localStorage.removeItem('petshop_session');
                    }
                } catch (error) {
                    console.error('Error al cargar sesión:', error);
                    localStorage.removeItem('petshop_session');
                }
            }
        
            return false;
        }


        // Función para mostrar modal de login
        function showLoginModal() {
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.classList.add('login-modal-visible');
                // Enfocar el campo de código inmediatamente
                const loginCodeInput = document.getElementById('login-code');
                if (loginCodeInput) {
                    setTimeout(() => {
                        loginCodeInput.focus();
                    }, 50);
                }
            }
        }


        // Función para ocultar modal de login
        function hideLoginModal() {
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.classList.remove('login-modal-visible');
            }
        }


        // Función para actualizar la visualización del usuario en el header
        function updateUserDisplay() {
            const userInfoDisplay = document.getElementById('user-info-display');
            const userNameDisplay = document.getElementById('display-user-name');
            const userRoleDisplay = document.getElementById('display-user-role');

            if (currentUser) {
                userInfoDisplay.style.display = 'flex';
                userNameDisplay.textContent = `Usuario: ${currentUser.name}`;
                userRoleDisplay.textContent = `Rol: ${currentUser.role}`;

                // Mostrar/ocultar botón de edición según rol
                const toggleBtn = document.getElementById('toggle-edit-mode-btn');
                if (toggleBtn) {
                    toggleBtn.style.display = currentUser.role === 'admin' ? 'block' : 'none';
                }
            } else {
                userInfoDisplay.style.display = 'none';
            }
        }

        // Función para mostrar mensajes en el formulario de llegada
        function showArrivalFormStatusMessage(message, type = 'info') {
            arrivalFormStatusMessage.innerHTML = `<div class="status-message ${type}">${message}</div>`;
        
            if (type === 'success' || type === 'info') {
                setTimeout(() => {
                    arrivalFormStatusMessage.innerHTML = '';
                }, 5000);
            }
        }

        // Función para abrir el modal de llegadas (corregida)
        function openArrivalModal() {
            // Verificar que el modal exista
            const modal = document.getElementById('register-arrival-modal');
            if (!modal) {
                console.error('Modal de llegadas no encontrado en el DOM');
                showStatusMessage('Error: Modal de llegadas no disponible', 'error');
                return;
            }

            // Verificar modo edición
            if (!editModeActive) {
                showStatusMessage('El modo edición debe estar activo para registrar llegadas', 'error');
                return;
            }

            // Limpiar formulario
            if (arrivalForm) arrivalForm.reset();
            if (arrivalFormStatusMessage) arrivalFormStatusMessage.innerHTML = '';

            // Cargar productos en el select
            populateArrivalProductSelect();

            //configurar input para decimales
            arrivalQuantityInput.type = 'number';
            arrivalQuantityInput.step = '0.01';
            arrivalQuantityInput.min = '0.01';

            // Mostrar modal
            modal.style.display = 'flex';

            // Poner foco en el select
            setTimeout(() => {
                if (arrivalProductSelect) {
                    arrivalProductSelect.focus();

                    // Si Select2 está activo, abrir el dropdown
                    if (window.$ && $(arrivalProductSelect).hasClass('select2-hidden-accessible')) {
                        $(arrivalProductSelect).select2('open');
                    }
                }
            }, 300);

            console.log('Modal de llegadas abierto');
        }

        // Función para cerrar el modal de llegadas
        function closeArrivalModal() {
            registerArrivalModal.style.display = 'none';
        }

        // Función para poblar el select de productos (corregida)
        function populateArrivalProductSelect() {
            if (!arrivalProductSelect) {
                console.error('Elemento arrivalProductSelect no encontrado');
                return;
            }

            // Guardar selección actual
            const currentSelection = arrivalProductSelect.value;

            // Limpiar opciones
            arrivalProductSelect.innerHTML = '<option value="">Seleccionar producto...</option>';

            // Verificar que haya productos
            if (!products || products.length === 0) {
                const option = document.createElement('option');
                option.value = '';
                option.textContent = 'No hay productos disponibles';
                option.disabled = true;
                arrivalProductSelect.appendChild(option);
                console.warn('No hay productos para mostrar en el select');
                return;
            }

            // Ordenar productos por nombre
            const sortedProducts = [...products].sort((a, b) => a.name.localeCompare(b.name));

            // Agregar productos al select
            sortedProducts.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = `${product.name} (ID: ${product.id}, Stock: ${product.stock})`;
                option.setAttribute('data-stock', product.stock);
                arrivalProductSelect.appendChild(option);
            });

            // Restaurar selección anterior si existe
            if (currentSelection) {
                arrivalProductSelect.value = currentSelection;
            }

            console.log(`Select poblado con ${sortedProducts.length} productos`);

            // Inicializar Select2 si está disponible
            if (window.$ && $.fn && $.fn.select2) {
                try {
                    // Destruir Select2 anterior si existe
                    if ($(arrivalProductSelect).hasClass('select2-hidden-accessible')) {
                        $(arrivalProductSelect).select2('destroy');
                    }

                    // Inicializar Select2
                    $(arrivalProductSelect).select2({
                        placeholder: "Buscar producto...",
                        allowClear: false,
                        width: '100%',
                        dropdownParent: $('#register-arrival-modal')
                    });

                    console.log('Select2 inicializado correctamente');
                } catch (error) {
                    console.error('Error al inicializar Select2:', error);
                }
            }
        }
    
        // Función para registrar llegada desde el formulario (VERSIÓN SIMPLIFICADA)
        function registerArrivalFromForm() {
            console.log('=== INICIANDO registerArrivalFromForm ===');
        
            // Obtener datos del formulario
            const productId = parseInt(arrivalProductSelect.value);
            const quantity = parseFloat(arrivalQuantityInput.value);
            const notes = arrivalNotesInput.value.trim();
        
            console.log('Datos del formulario:', { productId, quantity });
        
            // Validaciones básicas
            if (!productId || isNaN(productId)) {
                showArrivalFormStatusMessage('Selecciona un producto válido', 'error');
                return false;
            }
        
            if (isNaN(quantity) || quantity <= 0) {
                showArrivalFormStatusMessage('La cantidad debe ser un número mayor a 0', 'error');
                return false;
            }
        
            // Buscar producto
            const product = products.find(p => p.id === productId);
            if (!product) {
                showArrivalFormStatusMessage('Producto no encontrado', 'error');
                return false;
            }
        
            console.log('Producto encontrado:', product.name);
            console.log('Stock anterior:', product.stock);
        
            // CALCULAR NUEVO STOCK CORRECTAMENTE
            const previousStock = product.stock;
            const newStock = previousStock + quantity; // Solo sumar una vez
        
            console.log('Nuevo stock calculado:', `${previousStock} + ${quantity} = ${newStock}`);
        
            // ACTUALIZAR PRODUCTO (SOLO UNA VEZ)
            product.stock = newStock;
            product.lastUpdateDate = new Date().toLocaleString();
            product.previousStock = previousStock;
        
            console.log('Producto actualizado. Stock actual:', product.stock);
        
            // Crear registro de llegada
            const newArrivalId = arrivals.length > 0 ? Math.max(...arrivals.map(a => a.id)) + 1 : 1;
            const arrival = {
                id: newArrivalId,
                productId: productId,
                productName: product.name,
                quantity: quantity,
                date: new Date().toLocaleString(),
                notes: notes,
                previousStock: previousStock,
                newStock: newStock
            };
        
            arrivals.push(arrival);
            console.log('Llegada registrada con ID:', newArrivalId);
        
            // Guardar cambios
            saveProductsToLocalStorage();
            saveArrivalsToLocalStorage();
        
            // Mostrar mensaje de éxito
            showArrivalFormStatusMessage(
                `✅ Llegada registrada exitosamente<br>
                 Producto: ${product.name}<br>
                 Cantidad: ${quantity} unidades<br>
                 Stock: ${previousStock} → ${newStock}`,
                'success'
            );
        
            // Actualizar interfaz
            setTimeout(() => {
                renderProducts();
                updateCart();
                closeArrivalModal();
                showStatusMessage(`Stock actualizado: ${product.name}`, 'success');
            }, 1500);
        
            // Prevenir envío múltiple
            const submitBtn = arrivalForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
                setTimeout(() => {
                    submitBtn.disabled = false;
                }, 2000);
            }
        
            return false; // Prevenir submit normal
        }

        // Guardar llegadas en localStorage
        function saveArrivalsToLocalStorage() {
            localStorage.setItem('petshop_arrivals', JSON.stringify(arrivals));
        }

        // Cargar llegadas desde localStorage (agrega en loadInitialData)
        function loadArrivalsFromStorage() {
            const savedArrivals = localStorage.getItem('petshop_arrivals');
            if (savedArrivals) {
                try {
                    arrivals = JSON.parse(savedArrivals);
                    console.log(`Registros de llegadas cargados: ${arrivals.length}`);
                } catch (error) {
                    console.error('Error al cargar llegadas:', error);
                    arrivals = [];
                }
            }
        }

        // Función para iniciar sesión
        function loginUser(userCode, rememberMe = false) {
            const user = users.find(u => u.code === userCode);

            if (!user) {
                showLoginStatusMessage('Código de usuario no válido', 'error');
                return false;
            }
        
            currentUser = user;
        
            // SEMPRE guardar sesión (no solo cuando se marca "recordar")
            const sessionData = {
                userCode: user.code,
                expiresAt: new Date().getTime() + SESSION_TIMEOUT
            };
            localStorage.setItem('petshop_session', JSON.stringify(sessionData));

            startSessionTimer();
        
            hideLoginModal();
            updateUserDisplay();
            showStatusMessage(`Bienvenido, ${user.name}!`, 'success');
        
            // Mostrar contenido principal
            const mainContent = document.querySelector('.main-content');
            const footer = document.querySelector('footer');
        
            if (mainContent) {
                mainContent.style.display = 'flex';
            }
            if (footer) {
                footer.style.display = 'flex';
            }
        
            // Inicializar interfaz principal
            initMainInterface();
        
            return true;
        }




        // Función para cerrar sesión
        function logoutUser() {
            if (confirm('¿Está seguro que desea cerrar sesión?')) {
                currentUser = null;
                localStorage.removeItem('petshop_session');
                clearTimeout(sessionTimer);

                // Limpiar el formulario de login
                const loginForm = document.getElementById('login-form');
                if (loginForm) {
                    loginForm.reset();
                }

                // Limpiar mensaje de estado de login
                const loginStatusElement = document.getElementById('login-status-message');
                if (loginStatusElement) {
                    loginStatusElement.innerHTML = '';
                }

                // Ocultar contenido principal
                const mainContent = document.querySelector('.main-content');
                if (mainContent) {
                    mainContent.style.display = 'none';
                }

                // Ocultar footer
                const footer = document.querySelector('footer');
                if (footer) {
                    footer.style.display = 'none';
                }

                // Mostrar modal de login
                setTimeout(() => {
                    showLoginModal();
                }, 100);

                showStatusMessage('Sesión cerrada correctamente', 'info');

                // Desactivar modo edición si está activo
                if (editModeActive) {
                    toggleEditMode();
                }
            }
        }




        // Función para iniciar temporizador de sesión
        function startSessionTimer() {
            clearTimeout(sessionTimer);

            sessionTimer = setTimeout(() => {
                showStatusMessage('Su sesión ha expirado por inactividad', 'info');
                logoutUser();
            }, SESSION_TIMEOUT);
        }

        // Función para mostrar mensajes en el login
        function showLoginStatusMessage(message, type = 'info') {
            const statusElement = document.getElementById('login-status-message');
            if (statusElement) {
                statusElement.innerHTML = `<div class="status-message ${type}">${message}</div>`;

                if (type === 'success' || type === 'info') {
                    setTimeout(() => {
                        statusElement.innerHTML = '';
                    }, 5000);
                }
            }
        }

        // Función para inicializar el sistema de login
        function initLoginSystem() {
            // VERIFICAR PRIMERO SI HAY SESIÓN ACTIVA
            const hasSession = checkExistingSession();

            if (!hasSession) {
                // Solo ocultar contenido si NO hay sesión activa
                const mainContent = document.querySelector('.main-content');
                const footer = document.querySelector('footer');
            
                if (mainContent) {
                    mainContent.style.display = 'none';
                }
                if (footer) {
                    footer.style.display = 'none';
                }
            
                // Mostrar modal de login
                setTimeout(() => {
                    showLoginModal();
                }, 100);
            }

        
            // Configurar event listeners para login
            const loginForm = document.getElementById('login-form');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const userCode = document.getElementById('login-code').value.trim();
                    const rememberMe = document.getElementById('remember-me').checked;
                
                    if (!userCode) {
                        showLoginStatusMessage('Por favor ingrese su código de usuario', 'error');
                        return;
                    }
                
                    loginUser(userCode, rememberMe);
                });
            }
        
            // Configurar event listener para logout
            const logoutBtn = document.getElementById('logout-btn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', logoutUser);
            }
        
            // Resetear temporizador de inactividad con interacción del usuario
            const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
            activityEvents.forEach(event => {
                document.addEventListener(event, () => {
                    if (currentUser && sessionTimer) {
                        startSessionTimer();
                    }
                });
            });
        }       




        // Inicializar la verificación al cargar la página
        //document.addEventListener('DOMContentLoaded', verifyUserCode);

        // Función para inicializar event listeners
        function initEventListeners() {
            // Event listener para la barra de búsqueda
            searchInput.addEventListener('input', () => { currentPage = 1; renderProducts(); }); // Reset page on search

            // Event listener para botón de checkout
            checkoutBtn.addEventListener('click', processSale);

            // Event listeners para el modal de recibo
            closeReceiptBtn.addEventListener('click', () => {
                receiptModal.style.display = 'none';
            });

            // Cerrar modal al hacer clic fuera del contenido
            receiptModal.addEventListener('click', (e) => {
                if (e.target === receiptModal) {
                    receiptModal.style.display = 'none';
                }
            });

            // Event listener para cargar archivo Excel
            excelFileInput.addEventListener('change', async (e) => {
                const file = e.target.files[0];

                if (!file) {
                    return;
                }

                // Validar extensión del archivo
                const validExtensions = ['.xlsx', '.xls', '.csv'];
                const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

                if (!validExtensions.includes(fileExtension)) {
                    showStatusMessage('Formato de archivo no válido. Usa .xlsx, .xls o .csv', 'error');
                    excelFileInput.value = '';
                    return;
                }

                // Actualizar información del archivo
                fileInfoElement.textContent = `Archivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`;

                try {
                    showStatusMessage('Procesando archivo Excel...', 'info');

                    // Leer archivo Excel (ahora devuelve { sheetName, data })
                    const { sheetName, data: excelData } = await readExcelFile(file);

                    // Determine if it's a product or user file based on sheet name
                    if (sheetName === EXCEL_CONFIG.sheetName) {
                        // Validar headers for products
                        const requiredHeaders = Object.values(EXCEL_CONFIG.mappings).filter(header => header !== undefined && header !== 'Fecha Creación' && header !== 'Última Actualización');
                        const actualHeaders = Object.keys(excelData[0] || {});
                        const missingHeaders = requiredHeaders.filter(header => !actualHeaders.includes(header));

                        if (missingHeaders.length > 0) {
                            throw new Error(`El archivo de productos debe contener las siguientes columnas obligatorias: ${missingHeaders.join(', ')}. Por favor, usa la plantilla.`);
                        }

                        // Process product data
                        products = processExcelData(excelData);

                        // Reset pagination and render UI
                        currentPage = 1;
                        // renderCategories(); // Removed
                        renderSubcategories();
                        renderProducts();

                        // Restablecer selección de categoría y subcategoría
                        // currentCategory = 'all'; // Removed
                        currentSubcategory = 'all';

                        saveProductsToLocalStorage();

                    } else if (sheetName === EXCEL_CONFIG_USERS.sheetName) {
                        // Validar headers for users
                        const requiredHeaders = Object.values(EXCEL_CONFIG_USERS.mappings);
                        const actualHeaders = Object.keys(excelData[0] || {});
                        const missingHeaders = requiredHeaders.filter(header => !actualHeaders.includes(header));

                        if (missingHeaders.length > 0) {
                            throw new Error(`El archivo de usuarios debe contener las siguientes columnas obligatorias: ${missingHeaders.join(', ')}. Por favor, usa la plantilla de usuarios.`);
                        }

                        // Process user data
                        const importedUsers = processExcelUsersData(excelData);

                        if (importedUsers.length > 0) {
                            users.push(...importedUsers);
                            showStatusMessage(`Archivo de usuarios cargado correctamente: ${importedUsers.length} usuarios importados. Total de usuarios: ${users.length}`, 'success');
                            saveUsersToLocalStorage();
                        }
                        else {
                            showStatusMessage('No se importaron nuevos usuarios del archivo Excel.', 'info');
                        }

                    } else {
                        throw new Error(`Nombre de hoja desconocido: '${sheetName}'. Asegúrate de que sea 'Productos' o 'Usuarios'.`);
                    }

                } catch (error) {
                    showStatusMessage(`Error al cargar archivo: ${error.message}`, 'error');
                    console.error('Error al cargar archivo Excel:', error);
                }
                finally {
                    excelFileInput.value = ''; // Clear the file input
                }
            });

            // Event listener para descargar plantilla
            downloadTemplateBtn.addEventListener('click', downloadTemplate);

            // Event listener para exportar productos
            exportProductsBtn.addEventListener('click', exportToExcel);

            // Event listener para exportar ventas
            exportSalesBtn.addEventListener('click', exportSalesToExcel);

            // Event listener para exportar usuarios
            const exportUsersBtn = document.getElementById('export-users');
            exportUsersBtn.addEventListener('click', exportUsersToExcel);

            // Event listeners for Add Product Modal
            openAddProductModalBtn.addEventListener('click', openAddProductModal);
            closeAddProductModalBtn.addEventListener('click', closeAddProductModal);
            addProductModal.addEventListener('click', (e) => {
                if (e.target === addProductModal) {
                    closeAddProductModal();
                }
            });

            // Event listener for Add Product Form submission
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = addProductNameInput.value.trim();
                const price = parseFloat(addProductPriceInput.value);
                const category = addProductCategoryInput.value.trim().toLowerCase();
                const stock = parseFloat(addProductStockInput.value);
                // const icon = addProductIconInput.value.trim(); // Removed

                if (!name || isNaN(price) || price <= 0 || !category || isNaN(stock) || stock < 0) {
                    showAddProductFormStatusMessage('Por favor, completa todos los campos correctamente.', 'error');
                    return;
                }

                // Check for existing product name
                if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                    showAddProductFormStatusMessage(`Ya existe un producto con el nombre '${name}'.`, 'error');
                    return;
                }

                const now = new Date().toLocaleString();
                const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;

                const newProduct = {
                    id: newId,
                    name,
                    price,
                    category,
                    stock,
                    // icon: icon || getDefaultImageUrlForCategory(category), // Removed
                    // subcategory: '', // Removed
                    creationDate: now,
                    lastUpdateDate: now,
                    previousStock: 0
                };

                products.push(newProduct);
                showAddProductFormStatusMessage(`Producto '${name}' agregado correctamente.`, 'success');
                closeAddProductModal();
                currentPage = 1; // Reset to first page after adding a new product
                // renderCategories(); // Removed
                // renderSubcategories(); // Subcategory logic removed
                renderProducts();
                saveProductsToLocalStorage();
            });

            // Event listeners for Update Product Modal
            closeUpdateProductModalBtn.addEventListener('click', closeUpdateProductModal);
            updateProductModal.addEventListener('click', (e) => {
                if (e.target === updateProductModal) {
                    closeUpdateProductModal();
                }
            });

            // Event listener for Update Product Form submission
            updateProductForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const id = parseInt(updateProductIdInput.value);
                const name = updateProductNameInput.value.trim();
                const price = parseFloat(updateProductPriceInput.value);
                const category = updateProductCategoryInput.value.trim().toLowerCase();
                const stock = parseInt(updateProductStockInput.value);
                // const icon = updateProductIconInput.value.trim(); // Removed

                if (!name || isNaN(price) || price <= 0 || !category || isNaN(stock) || stock < 0) {
                    showUpdateProductFormStatusMessage('Por favor, completa todos los campos correctamente.', 'error');
                    return;
                }

                const productIndex = products.findIndex(p => p.id === id);
                if (productIndex > -1) {
                    // Check for duplicate name for other products
                    if (products.some((p, idx) => p.name.toLowerCase() === name.toLowerCase() && idx !== productIndex)) {
                        showUpdateProductFormStatusMessage(`Ya existe otro producto con el nombre '${name}'.`, 'error');
                        return;
                    }

                    const now = new Date().toLocaleString();
                    const oldProduct = products[productIndex];
                    products[productIndex] = {
                        ...products[productIndex],
                        name,
                        price,
                        category,
                        stock,
                        // icon: icon || getDefaultImageUrlForCategory(category), // Removed
                        lastUpdateDate: now,
                        previousStock: oldProduct.stock
                    };
                    showUpdateProductFormStatusMessage(`Producto '${name}' actualizado correctamente.`, 'success');
                    closeUpdateProductModal();
                    // renderCategories(); // Removed
                    // renderSubcategories(); // Subcategory logic removed
                    renderProducts();
                    saveProductsToLocalStorage();
                }
                else {
                    showUpdateProductFormStatusMessage('Error: Producto no encontrado para actualizar.', 'error');
                }
            });

            // Event listeners for Add User Modal
            openAddUserModalBtn.addEventListener('click', openAddUserModal);
            closeAddUserModalBtn.addEventListener('click', closeAddUserModal);
            addUserModal.addEventListener('click', (e) => {
                if (e.target === addUserModal) {
                    closeAddUserModal();
                }
            });

            // Event listener for Add User Form submission
            addUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = addUserNameInput.value.trim();
                const role = addUserRoleInput.value.trim();
                const code = addUserCodeInput.value.trim();

                if (!name || !role || !code) {
                    showAddUserFormStatusMessage('Por favor, completa todos los campos de usuario.', 'error');
                    return;
                }

                // Check for duplicate user names or codes
                if (users.some(u => u.name.toLowerCase() === name.toLowerCase())) {
                    showAddUserFormStatusMessage(`Ya existe un usuario con el nombre '${name}'.`, 'error');
                    return;
                }
                if (users.some(u => u.code.toLowerCase() === code.toLowerCase())) {
                    showAddUserFormStatusMessage(`Ya existe un usuario con el código '${code}'.`, 'error');
                    return;
                }

                const newId = users.length > 0 ? Math.max(...users.map(u => u.id || 0)) + 1 : 1; // Ensure unique ID, handle missing IDs

                const newUser = {
                    id: newId,
                    name,
                    role,
                    code
                };

                users.push(newUser);
                showAddUserFormStatusMessage(`Usuario '${name}' agregado correctamente.`, 'success');
                closeAddUserModal();
                // Save users to local storage (function will be implemented later)
                saveUsersToLocalStorage();
            });

            // Event listener for toggle edit mode button
            toggleEditModeBtn.addEventListener('click', toggleEditMode);

            // Pagination event listeners
            prevPageBtn.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderProducts();
                }
            });

            // Event listeners for Reports Modal
            openReportsModalBtn.addEventListener('click', openReportsModal);
            closeReportsModalBtn.addEventListener('click', closeReportsModal);
            reportsModal.addEventListener('click', (e) => {
                if (e.target === reportsModal) {
                    closeReportsModal();
                }
            });

            // Event listener for Reports Form submission
            reportsForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const startDate = new Date(startDateInput.value);
                const endDate = new Date(endDateInput.value);
                const chartType = reportTypeSelect.value;

                if (startDate > endDate) {
                    showReportsFormStatusMessage('La fecha de inicio no puede ser mayor a la fecha de fin.', 'error');
                    return;
                }

                generateSalesReport(startDate, endDate, chartType);
            });

            // Event listener for Export Report button
            exportReportBtn.addEventListener('click', exportReportToExcel);


            nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(products.filter(p => p.stock > 0 /*&& (currentCategory === 'all' || p.category === currentCategory)*/ && p.name.toLowerCase().includes(searchInput.value.toLowerCase())).length / productsPerPage); // Category filter removed
                if (currentPage < totalPages) {
                    currentPage++;
                    renderProducts();
                }
            });

            // Event listener para Exportar a PDF
            exportPdfBtn.addEventListener('click', exportReportToPDF);


            // Event listeners para el modal de llegadas
            const openArrivalModalBtn = document.getElementById('open-arrival-modal-btn');
            if (openArrivalModalBtn) {
                // Remover listeners anteriores y agregar uno nuevo
                openArrivalModalBtn.replaceWith(openArrivalModalBtn.cloneNode(true));
                document.getElementById('open-arrival-modal-btn').addEventListener('click', openArrivalModal);
            }

            if (closeArrivalModalBtn) {
                closeArrivalModalBtn.addEventListener('click', closeArrivalModal);
            }

            if (closeArrivalModalBtn2) {
                closeArrivalModalBtn2.addEventListener('click', closeArrivalModal);
            }

            if (registerArrivalModal) {
                registerArrivalModal.addEventListener('click', (e) => {
                    if (e.target === registerArrivalModal) {
                        closeArrivalModal();
                    }
                });
            }

            // MANEJO DEL FORMULARIO DE LLEGADAS - SIN ELIMINAR FORMULARIO COMPLETO
            if (arrivalForm) {
                console.log('Configurando event listener para arrivalForm...');

                // Variable local para prevenir múltiples envíos
                let isFormProcessing = false;

                // Función handler única
                const arrivalFormSubmitHandler = function(e) {
                    e.preventDefault();
                    e.stopImmediatePropagation(); // IMPORTANTE: Detener propagación

                    console.log('=== SUBMIT ARRIVAL FORM ===');
                    console.log('isFormProcessing:', isFormProcessing);

                    if (isFormProcessing) {
                        console.log('Formulario ya en proceso, ignorando...');
                        return false;
                    }

                    isFormProcessing = true;
                    console.log('Iniciando procesamiento de llegada...');

                    // Deshabilitar botón de submit visualmente
                    const submitBtn = this.querySelector('button[type="submit"]');
                    const originalText = submitBtn ? submitBtn.innerHTML : '';

                    if (submitBtn) {
                        submitBtn.disabled = true;
                        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                    }

                    try {
                        // Llamar a la función principal
                        registerArrivalFromForm();
                    } catch (error) {
                        console.error('Error en submit handler:', error);
                    } finally {
                        // Reactivar después de 3 segundos
                        setTimeout(() => {
                            isFormProcessing = false;
                            if (submitBtn) {
                                submitBtn.disabled = false;
                                submitBtn.innerHTML = originalText;
                            }
                            console.log('Formulario listo para nuevo envío');
                        }, 3000);
                    }

                    return false;
                };

                // PRIMERO: Remover TODOS los listeners de submit existentes
                // Esto es más seguro que clonar el formulario completo
                arrivalForm.removeEventListener('submit', arrivalFormSubmitHandler);

                // Usar capture phase y once:false para tener control total
                arrivalForm.addEventListener('submit', arrivalFormSubmitHandler, {
                    capture: true,
                    once: false
                });

                console.log('Event listener configurado para arrivalForm (único)');
            }

            // Event listener para exportar llegadas
            const exportArrivalsBtn = document.getElementById('export-arrivals');
            if (exportArrivalsBtn) {
                exportArrivalsBtn.addEventListener('click', exportArrivalsToExcel);
            }

            


            // Event listener para Importar Usuarios (botón del panel de controles)
            const importUsersBtn = document.getElementById('import-users-btn');
            if (importUsersBtn) {
                importUsersBtn.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.xlsx, .xls, .csv';

                    input.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                    
                        const validExtensions = ['.xlsx', '.xls, .csv'];
                        const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

                        if (!validExtensions.includes(fileExtension)) {
                            showStatusMessage('Formato de archivo no válido. Usa .xlsx, .xls o .csv', 'error');
                            return;
                        }
                    
                        try {
                            showStatusMessage('Procesando archivo Excel de usuarios...', 'info');
                            const { sheetName, data: excelData } = await readExcelFile(file);

                            if (sheetName === EXCEL_CONFIG_USERS.sheetName) {
                                const requiredHeaders = Object.values(EXCEL_CONFIG_USERS.mappings);
                                const actualHeaders = Object.keys(excelData[0] || {});
                                const missingHeaders = requiredHeaders.filter(header => !actualHeaders.includes(header));

                                if (missingHeaders.length > 0) {
                                    throw new Error(`El archivo debe contener las columnas: ${missingHeaders.join(', ')}.`);
                                }

                                const importedUsers = processExcelUsersData(excelData);

                                if (importedUsers.length > 0) {
                                    users.push(...importedUsers);
                                    showStatusMessage(`Usuarios importados: ${importedUsers.length}. Total: ${users.length}`, 'success');
                                    saveUsersToLocalStorage();

                                    // Si el usuario actual está importando, actualizar display
                                    if (currentUser) {
                                        updateUserDisplay();
                                    }
                                } else {
                                    showStatusMessage('No se importaron nuevos usuarios del archivo.', 'info');
                                }
                            } else {
                                throw new Error(`La hoja debe llamarse '${EXCEL_CONFIG_USERS.sheetName}'. Se encontró: '${sheetName}'`);
                            }
                        } catch (error) {
                            showStatusMessage(`Error al importar usuarios: ${error.message}`, 'error');
                            console.error('Error en importación de usuarios:', error);
                        }
                    });

                    input.click();
                });
            }
        }

        // Cargar datos iniciales desde localStorage si existen
        function loadInitialData() {
            const savedProducts = localStorage.getItem('petshop_products');
            const savedSales = localStorage.getItem('petshop_sales');
            const now = new Date().toLocaleString();

            if (savedProducts) {
                try {
                    products = JSON.parse(savedProducts);
                    // Ensure loaded products have date fields, add if missing
                    products = products.map(p => ({
                        ...p,
                        creationDate: p.creationDate || now,
                        lastUpdateDate: p.lastUpdateDate || now,
                        previousStock: p.previousStock !== undefined ? p.previousStock : p.stock
                        // icon: p.icon || getDefaultImageUrlForCategory(p.category), // Removed
                        // subcategory: p.subcategory || '' // Removed
                    }));
                    showStatusMessage(`Datos cargados desde almacenamiento local: ${products.length} productos`, 'info');
                }
                catch (error) {
                    console.error('Error al cargar datos desde localStorage:', error);
                    products = [];
                }
            }

            if (savedSales) {
                try {
                    sales = JSON.parse(savedSales);
                }
                catch (error) {
                    console.error('Error al cargar ventas desde localStorage:', error);
                    sales = [];
                }
            }

            const savedUsers = localStorage.getItem('petshop_users');
            if (savedUsers) {
                try {
                    users = JSON.parse(savedUsers);
                    // Ensure loaded users have 'id' property
                    users = users.map((user, index) => ({ ...user, id: user.id || index + 1 }));
                    showStatusMessage(`Datos de usuarios cargados desde almacenamiento local: ${users.length} usuarios`, 'info');
                }
                catch (error) {
                    console.error('Error al cargar usuarios desde localStorage:', error);
                    users = [];
                }
            }

            // Si no hay usuarios cargados o guardados, cargar datos de ejemplo
            if (users.length === 0) {
                users = [
                    { id: 1, name: "Admin", role: "admin", code: "ADMIN001" },
                    { id: 2, name: "Vendedor 1", role: "seller", code: "SELL001" },
                    { id: 3, name: "Vendedor 2", role: "seller", code: "SELL002" }
                ];
                showStatusMessage('Usando datos de usuarios de ejemplo. Carga un archivo Excel para importar tus usuarios.', 'info');
            }

            //cargar llegadas
            loadArrivalsFromStorage();

            // Intentar importar usuarios desde Excel automáticamente
            fetch('usuarios.xlsx')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Archivo no encontrado');
                    }
                    return response.arrayBuffer();
                })
                .then(data => {
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    if (sheetName === EXCEL_CONFIG_USERS.sheetName) {
                        const excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                        const processedUsers = processExcelUsersData(excelData);
                        if (processedUsers.length > 0) {
                            users = processedUsers;
                            saveUsersToLocalStorage();
                            showStatusMessage(`Usuarios importados automáticamente desde Excel: ${processedUsers.length}`, 'success');
                        }
                    }
                })
                .catch(error => {
                    console.log('No se pudo importar usuarios desde Excel automáticamente:', error.message);
                });

            // Si no hay productos cargados o guardados, cargar datos de ejemplo
            if (products.length === 0) {
                products = [
                    { id: 1, name: "Alimento para Perro Adulto", price: 450, category: "food", stock: 15, creationDate: now, lastUpdateDate: now, previousStock: 15 },
                    { id: 2, name: "Alimento para Gato Adulto", price: 380, category: "food", stock: 12, creationDate: now, lastUpdateDate: now, previousStock: 12 },
                    { id: 3, name: "Snacks para Perro", price: 120, category: "food", stock: 25, creationDate: now, lastUpdateDate: now, previousStock: 25 },
                    { id: 4, name: "Pelota para Mascota", price: 85, category: "toys", stock: 30, creationDate: now, lastUpdateDate: now, previousStock: 30 },
                    { id: 5, name: "Collar de Perro", price: 60, category: "accessories", stock: 10, creationDate: now, lastUpdateDate: now, previousStock: 10 },
                    { id: 6, name: "Rascador para Gato", price: 200, category: "toys", stock: 5, creationDate: now, lastUpdateDate: now, previousStock: 5 },
                    { id: 7, name: "Antipulgas", price: 150, category: "health", stock: 20, creationDate: now, lastUpdateDate: now, previousStock: 20 },
                    { id: 8, name: "Arena para Gato", price: 90, category: "food", stock: 18, creationDate: now, lastUpdateDate: now, previousStock: 18 }
                ];

                showStatusMessage('Usando datos de ejemplo. Carga un archivo Excel para importar tus productos.', 'info');
            }
        }

        // Guardar productos en localStorage
        function saveProductsToLocalStorage() {
            localStorage.setItem('petshop_products', JSON.stringify(products));
        }

        // Guardar ventas en localStorage
        function saveSalesToLocalStorage() {
            localStorage.setItem('petshop_sales', JSON.stringify(sales));
        }

        // Guardar usuarios en localStorage
        function saveUsersToLocalStorage() {
            localStorage.setItem('petshop_users', JSON.stringify(users));
        }

        // Inicializar la aplicación
        function initApp() {

            // Primero actualizar fecha y hora
            updateDateTime();

            // Cargar datos iniciales
            loadInitialData();

            // Primero verificar si hay sesión activa
            if (checkExistingSession()) {
                // Si hay sesión activa, NO mostrar modal de login
                // La interfaz ya se mostrará en checkExistingSession()
                initLoginSystem();
            } else {
                // Solo inicializar sistema de login si NO hay sesión activa
                initLoginSystem();
            }
        }


        // Función para inicializar la interfaz principal DESPUÉS del login
        function initMainInterface() {
            // Limpiar mensajes de status anteriores
            if (statusMessageElement) {
                statusMessageElement.innerHTML = '';
            }

            // Ocultar el botón de toggle edit mode si el usuario no es admin
            if (currentUser && currentUser.role !== 'admin') {
                const toggleBtn = document.getElementById('toggle-edit-mode-btn');
                if (toggleBtn) {
                    toggleBtn.style.display = 'none';
                }
            }

            // Actualizar la visualización del usuario
            updateUserDisplay();

            // Renderizar componentes principales
            renderSubcategories();
            renderProducts();
            updateCart();
            initEventListeners();

            // Configurar guardado automático
            setInterval(saveProductsToLocalStorage, 30000);
            setInterval(saveSalesToLocalStorage, 30000);
            setInterval(saveUsersToLocalStorage, 30000);
            setInterval(saveArrivalsToLocalStorage, 30000);

            // Guardar también al cerrar la página
            window.addEventListener('beforeunload', () => {
                saveProductsToLocalStorage();
                saveSalesToLocalStorage();
                saveUsersToLocalStorage();

                saveArrivalsToLocalStorage();
            });

            // Poner foco en la búsqueda
            setTimeout(() => {
                if (searchInput) {
                    searchInput.focus();
                }
            }, 500);
        }

        // Inicializar cuando el DOM esté cargado
        document.addEventListener('DOMContentLoaded', initApp);

