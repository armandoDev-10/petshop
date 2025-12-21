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

                if (excelControls) {
                    if (editModeActive) {
                        excelControls.classList.remove('hidden-edit-button');
                    } else {
                        excelControls.classList.add('hidden-edit-button');
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
            }
            // Enfocar el campo de código
            setTimeout(() => {
                const loginCodeInput = document.getElementById('login-code');
                if (loginCodeInput) {
                    loginCodeInput.focus();
                }
            }, 100);
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

        // Función para iniciar sesión
        function loginUser(userCode, rememberMe = false) {
            const user = users.find(u => u.code === userCode);
        
            if (!user) {
                showLoginStatusMessage('Código de usuario no válido', 'error');
                return false;
            }
        
            currentUser = user;
        
            // Guardar sesión si el usuario seleccionó "recordar"
            if (rememberMe) {
                const sessionData = {
                    userCode: user.code,
                    expiresAt: new Date().getTime() + SESSION_TIMEOUT
                };
                localStorage.setItem('petshop_session', JSON.stringify(sessionData));
                startSessionTimer();
            }
        
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

                // Limpiar el formulario de login
                const loginForm = document.getElementById('login-form');
                if (loginForm) {
                    loginForm.reset();
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
            // Ocultar contenido principal inicialmente
            const mainContent = document.querySelector('.main-content');
            const footer = document.querySelector('footer');

            if (mainContent) {
                mainContent.style.display = 'none';
            }
            if (footer) {
                footer.style.display = 'none';
            }

            // Verificar si hay una sesión activa
            if (!checkExistingSession()) {
                // Mostrar modal de login
                setTimeout(() => {
                    showLoginModal();
                }, 100);
            }
            // Si hay sesión, checkExistingSession() ya llamará a initMainInterface()
        
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
                const stock = parseInt(addProductStockInput.value);
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

            nextPageBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(products.filter(p => p.stock > 0 /*&& (currentCategory === 'all' || p.category === currentCategory)*/ && p.name.toLowerCase().includes(searchInput.value.toLowerCase())).length / productsPerPage); // Category filter removed
                if (currentPage < totalPages) {
                    currentPage++;
                    renderProducts();
                }
            });

            // Agregar botón para importar usuarios
            const excelControls = document.querySelector('.excel-controls');
            if (excelControls) {
                const importUsersBtn = document.createElement('button');
                importUsersBtn.type = 'button';
                importUsersBtn.className = 'excel-btn export-btn';
                importUsersBtn.innerHTML = '<i class="fas fa-users"></i> Importar Usuarios';
                importUsersBtn.addEventListener('click', () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.xlsx, .xls, .csv';
                    input.addEventListener('change', async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;

                        const validExtensions = ['.xlsx', '.xls', '.csv'];
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
                                } else {
                                    showStatusMessage('No se importaron nuevos usuarios.', 'info');
                                }
                            } else {
                                throw new Error(`La hoja debe ser '${EXCEL_CONFIG_USERS.sheetName}'.`);
                            }
                        } catch (error) {
                            showStatusMessage(`Error al importar usuarios: ${error.message}`, 'error');
                        }
                    });
                    input.click();
                });
                excelControls.appendChild(importUsersBtn);
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

            // Inicializar sistema de login
            initLoginSystem();

            // NO renderizar nada más hasta que el usuario inicie sesión
            // Las funciones renderProducts(), updateCart(), etc. se llamarán después del login
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

            // Guardar también al cerrar la página
            window.addEventListener('beforeunload', () => {
                saveProductsToLocalStorage();
                saveSalesToLocalStorage();
                saveUsersToLocalStorage();
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
