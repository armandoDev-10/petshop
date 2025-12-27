// main.js - Enfoque práctico con advertencias

(function() {
    'use strict';
    
    const CONFIG = {
        nombreApp: 'Mi Aplicación',
        tiempoAdvertencia: 10, // segundos para cerrar
        sonidoAlerta: true
    };
    
    let pestanaPrincipal = false;
    let contadorAdvertencia = null;
    
    // ==================== FUNCIONALIDAD PRINCIPAL ====================
    
    function inicializarControl() {
        // Usar localStorage para comunicación entre pestañas del MISMO origen
        const clave = `app_${location.hostname}_activa`;
        const idPestana = `id_${Date.now()}`;
        
        // Verificar si ya hay una pestaña activa
        const estado = localStorage.getItem(clave);
        
        if (estado) {
            // Hay otra pestaña activa
            const datos = JSON.parse(estado);
            
            // Verificar si la otra pestaña sigue activa (heartbeat)
            const tiempoInactivo = Date.now() - datos.ultimoLatido;
            
            if (tiempoInactivo < 5000) { // Menos de 5 segundos
                iniciarProcesoCierre();
                return;
            }
        }
        
        // Esta es la pestaña principal
        pestanaPrincipal = true;
        console.log('👑 Esta pestaña es ahora la principal');
        
        // Establecer estado activo
        const estadoPestana = {
            id: idPestana,
            inicio: Date.now(),
            ultimoLatido: Date.now(),
            url: window.location.href
        };
        
        localStorage.setItem(clave, JSON.stringify(estadoPestana));
        
        // Actualizar latido cada segundo
        setInterval(() => {
            if (pestanaPrincipal) {
                estadoPestana.ultimoLatido = Date.now();
                localStorage.setItem(clave, JSON.stringify(estadoPestana));
            }
        }, 1000);
        
        // Limpiar al cerrar
        window.addEventListener('beforeunload', () => {
            if (pestanaPrincipal) {
                localStorage.removeItem(clave);
            }
        });
        
        // Mostrar recordatorio
        mostrarRecordatorio();
    }
    
    function iniciarProcesoCierre() {
        console.warn('⚠️ Otra instancia detectada. Esta pestaña se cerrará.');
        
        // Paso 1: Mostrar advertencia clara
        mostrarAdvertenciaMultiple();
        
        // Paso 2: Emitir sonido de alerta (opcional)
        if (CONFIG.sonidoAlerta) {
            emitirSonidoAlerta();
        }
        
        // Paso 3: Iniciar cuenta regresiva
        iniciarCuentaRegresiva();
        
        // Paso 4: Intentar enfocar la pestaña principal
        intentarEnfocarPrincipal();
    }
    
    function mostrarAdvertenciaMultiple() {
        // Crear overlay de advertencia
        const overlay = document.createElement('div');
        overlay.id = 'overlay-multiples-pestanas';
        overlay.innerHTML = `
            <style>
                #overlay-multiples-pestanas {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 999999;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: white;
                    text-align: center;
                    padding: 20px;
                }
                
                .contenido-advertencia {
                    max-width: 600px;
                    background: rgba(231, 76, 60, 0.9);
                    border-radius: 15px;
                    padding: 40px;
                    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.02); }
                    100% { transform: scale(1); }
                }
                
                .icono-alerta {
                    font-size: 60px;
                    margin-bottom: 20px;
                }
                
                h2 {
                    font-size: 28px;
                    margin-bottom: 15px;
                }
                
                p {
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 10px;
                    opacity: 0.9;
                }
                
                .contador {
                    font-size: 48px;
                    font-weight: bold;
                    margin: 25px 0;
                    color: #f1c40f;
                    font-family: monospace;
                }
                
                .botones {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                    margin-top: 25px;
                }
                
                button {
                    padding: 12px 30px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                
                button:hover {
                    transform: translateY(-2px);
                }
                
                .btn-cerrar {
                    background: white;
                    color: #e74c3c;
                }
                
                .btn-continuar {
                    background: #2ecc71;
                    color: white;
                }
                
                .limitaciones {
                    margin-top: 25px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.3);
                    font-size: 14px;
                    opacity: 0.7;
                }
            </style>
            
            <div class="contenido-advertencia">
                <div class="icono-alerta">⚠️</div>
                <h2>Múltiples pestañas detectadas</h2>
                
                <p><strong>${CONFIG.nombreApp}</strong> solo puede ejecutarse en una pestaña a la vez.</p>
                
                <p>Por favor, cierre las otras pestañas de <strong>${window.location.hostname}</strong></p>
                
                <div class="contador" id="contador-cierre">${CONFIG.tiempoAdvertencia}</div>
                
                <p>Esta pestaña se cerrará automáticamente.</p>
                
                <div class="botones">
                    <button class="btn-cerrar" onclick="cerrarAhora()">Cerrar ahora</button>
                    <button class="btn-continuar" onclick="intentarForzar()">Intentar continuar</button>
                </div>
                
                <div class="limitaciones">
                    <p><strong>Nota técnica:</strong> Por razones de seguridad, los navegadores no permiten cerrar pestañas de otros sitios web (como Google, YouTube, etc.). Solo podemos controlar pestañas de este mismo sitio.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Agregar funciones globales para los botones
        window.cerrarAhora = function() {
            window.close();
            if (!window.closed) {
                window.location.href = 'about:blank';
            }
        };
        
        window.intentarForzar = function() {
            // Intentar tomar control (no recomendado en producción)
            pestanaPrincipal = true;
            localStorage.clear();
            overlay.remove();
            location.reload();
        };
    }
    
    function iniciarCuentaRegresiva() {
        let segundos = CONFIG.tiempoAdvertencia;
        const contadorElement = document.getElementById('contador-cierre');
        
        contadorAdvertencia = setInterval(() => {
            segundos--;
            
            if (contadorElement) {
                contadorElement.textContent = segundos;
                
                // Cambiar color cuando quede poco tiempo
                if (segundos <= 5) {
                    contadorElement.style.color = '#ff6b6b';
                    contadorElement.style.animation = 'none';
                }
            }
            
            if (segundos <= 0) {
                clearInterval(contadorAdvertencia);
                cerrarPestanaActual();
            }
        }, 1000);
    }
    
    function cerrarPestanaActual() {
        // Intentar cerrar suavemente
        try {
            window.close();
        } catch (e) {
            console.error('No se pudo cerrar la pestaña:', e);
        }
        
        // Fallback: redirigir a página en blanco
        setTimeout(() => {
            if (!window.closed) {
                window.location.href = 'about:blank';
            }
        }, 100);
    }
    
    function intentarEnfocarPrincipal() {
        // Enviar señal para que la pestaña principal se enfoque
        const claveEnfocar = `app_${location.hostname}_enfocar`;
        localStorage.setItem(claveEnfocar, Date.now().toString());
        
        // Limpiar después de 2 segundos
        setTimeout(() => {
            localStorage.removeItem(claveEnfocar);
        }, 2000);
    }
    
    function emitirSonidoAlerta() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 440; // Frecuencia en Hz
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1);
        } catch (e) {
            console.log('AudioContext no soportado o bloqueado');
        }
    }
    
    function mostrarRecordatorio() {
        // Mostrar recordatorio sutil en la esquina
        const recordatorio = document.createElement('div');
        recordatorio.innerHTML = `
            <style>
                .recordatorio-pestana-unica {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: rgba(46, 204, 113, 0.9);
                    color: white;
                    padding: 10px 15px;
                    border-radius: 8px;
                    font-size: 12px;
                    z-index: 9999;
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255,255,255,0.2);
                    max-width: 250px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    animation: fadeIn 0.5s;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .recordatorio-pestana-unica strong {
                    display: block;
                    margin-bottom: 5px;
                    font-size: 14px;
                }
                
                .recordatorio-pestana-unica button {
                    background: white;
                    color: #2ecc71;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    margin-top: 8px;
                    cursor: pointer;
                    font-size: 11px;
                }
            </style>
            
            <div class="recordatorio-pestana-unica">
                <strong>✅ Pestaña única activa</strong>
                Esta es la única pestaña permitida para esta aplicación.
                <br>
                <small>Si abres otra pestaña de este sitio, esta se cerrará automáticamente.</small>
                <br>
                <button onclick="this.parentNode.remove()">Entendido</button>
            </div>
        `;
        
        document.body.appendChild(recordatorio);
        
        // Auto-ocultar después de 10 segundos
        setTimeout(() => {
            if (recordatorio.parentNode) {
                recordatorio.style.opacity = '0';
                recordatorio.style.transition = 'opacity 0.5s';
                setTimeout(() => {
                    if (recordatorio.parentNode) {
                        recordatorio.remove();
                    }
                }, 500);
            }
        }, 10000);
    }
    
    // ==================== INICIALIZACIÓN ====================
    
    // Iniciar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarControl);
    } else {
        inicializarControl();
    }
    
    // Escuchar eventos de almacenamiento para enfocar
    window.addEventListener('storage', (e) => {
        if (e.key.includes('_enfocar') && pestanaPrincipal) {
            // Alguien quiere que nos enfoquemos
            window.focus();
            
            // También podríamos mostrar una notificación
            if (Notification.permission === 'granted') {
                new Notification('¡Vuelve aquí!', {
                    body: 'Esta aplicación requiere tu atención en esta pestaña',
                    icon: '/favicon.ico'
                });
            }
        }
    });
    
})();
