let balance = 0;
let movimientos = [];

// Cargar datos al iniciar
function cargarDatos() {
    const datosGuardados = localStorage.getItem('movimientos');
    if (datosGuardados) {
        movimientos = JSON.parse(datosGuardados);
        actualizarBalance();
        if (window.location.pathname.endsWith('historial.html')) {
            actualizarHistorial();
        }
    }
}

// Guardar datos en LocalStorage
function guardarDatos() {
    localStorage.setItem('movimientos', JSON.stringify(movimientos));
}

// Agregar un nuevo movimiento
function agregarMovimiento() {
    const cantidad = obtenerCantidad();
    if (!validarCantidad(cantidad)) return;

    const movimiento = {
        cantidad: cantidad,
        tipo: document.getElementById('tipo').value,
        fechaHora: new Date().toLocaleString()
    };

    movimientos.push(movimiento);
    actualizarBalance();
    guardarDatos();
    limpiarCampoCantidad();
}

// Actualizar el balance
function actualizarBalance() {
    balance = movimientos.reduce((total, mov) => total + (mov.tipo === 'ingreso' ? mov.cantidad : -mov.cantidad), 0);
    if (document.getElementById('balance')) {
        document.getElementById('balance').textContent = balance.toFixed(2);
    }
}

// Actualizar el historial
function actualizarHistorial() {
    const movimientosDiv = document.getElementById('movimientos');
    if (movimientosDiv) {
        movimientosDiv.innerHTML = '';

        movimientos.forEach((mov) => {
            const movimientoDiv = document.createElement('div');
            movimientoDiv.className = 'movimiento';
            movimientoDiv.textContent = `${mov.fechaHora} - ${mov.tipo === 'ingreso' ? '+' : '-'}${mov.cantidad.toFixed(2)} € (${mov.tipo})`;
            movimientosDiv.appendChild(movimientoDiv);
        });
    }
}

// Funciones auxiliares
function obtenerCantidad() {
    return parseFloat(document.getElementById('cantidad').value);
}

function validarCantidad(cantidad) {
    return !isNaN(cantidad) && cantidad > 0;
}

function limpiarCampoCantidad() {
    document.getElementById('cantidad').value = '';
}

// Cargar datos al iniciar la página
cargarDatos();