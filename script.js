let balance = 0;
let movimientos = [];

// ====================
// Funciones principales
// ====================

// Cargar datos al iniciar
function cargarDatos() {
    const datosGuardados = localStorage.getItem('movimientos');
    if (datosGuardados) {
        try {
            movimientos = JSON.parse(datosGuardados);
            actualizarBalance();
            if (window.location.href.includes('historial.html')) {
                actualizarHistorial();
            } else {
                actualizarInterfaz();
            }
        } catch (error) {
            console.error("Error al cargar datos:", error);
        }
    }
}

// Guardar datos
function guardarDatos() {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Agregar movimiento
function agregarMovimiento() {
    const cantidad = obtenerCantidad();
    if (!validarCantidad(cantidad)) return;

    const movimiento = {
        cantidad: cantidad,
        tipo: document.getElementById('tipo').value,
        fechaHora: new Date().toLocaleString()
    };

    movimientos.push(movimiento);
    guardarDatos();
    actualizarBalance();
    actualizarInterfaz();
    limpiarCampoCantidad();
}

// ====================
// Actualizaciones de UI
// ====================

// Actualizar balance
function actualizarBalance() {
    balance = movimientos.reduce((total, mov) => {
        return total + (mov.tipo === 'ingreso' ? mov.cantidad : -mov.cantidad);
    }, 0);
    
    if (document.getElementById('balance')) {
        document.getElementById('balance').textContent = balance.toFixed(2);
    }
}

// Actualizar interfaz principal
function actualizarInterfaz() {
    const contenedor = document.getElementById('movimientos');
    if (contenedor) {
        contenedor.innerHTML = '';
        movimientos.forEach((mov, index) => {
            contenedor.appendChild(crearElementoMovimiento(mov, index));
        });
    }
}

// Actualizar historial
function actualizarHistorial() {
    const contenedor = document.getElementById('movimientos');
    if (contenedor) {
        contenedor.innerHTML = '';
        movimientos.forEach((mov) => {
            const movimientoDiv = document.createElement('div');
            movimientoDiv.className = 'movimiento';
            movimientoDiv.innerHTML = `
                <span>${mov.tipo === 'ingreso' ? '+' : '-'}${mov.cantidad.toFixed(2)} €</span>
                <span>${mov.fechaHora}</span>
            `;
            contenedor.appendChild(movimientoDiv);
        });
    }
}

// ====================
// Funciones auxiliares
// ====================

// Crear elemento de movimiento
function crearElementoMovimiento(mov, index) {
    const div = document.createElement('div');
    div.className = 'movimiento';
    div.innerHTML = `
        <span>${mov.tipo === 'ingreso' ? '+' : '-'}${mov.cantidad.toFixed(2)} € - ${mov.fechaHora}</span>
        <button onclick="eliminarMovimiento(${index})">Eliminar</button>
    `;
    return div;
}

// Eliminar movimiento
function eliminarMovimiento(index) {
    movimientos.splice(index, 1);
    guardarDatos();
    actualizarBalance();
    actualizarInterfaz();
}

// Limpiar historial
function limpiarHistorial() {
    movimientos = [];
    guardarDatos();
    actualizarBalance();
    actualizarInterfaz();
}

// Validaciones
function obtenerCantidad() {
    return parseFloat(document.getElementById('cantidad').value);
}

function validarCantidad(cantidad) {
    return !isNaN(cantidad) && cantidad > 0;
}

function limpiarCampoCantidad() {
    document.getElementById('cantidad').value = '';
}

// Event listeners
document.getElementById('limpiarHistorial').addEventListener('click', limpiarHistorial);

// Inicialización
cargarDatos();