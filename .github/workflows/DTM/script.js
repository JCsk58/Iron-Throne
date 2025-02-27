let balance = 0;
let movimientos = [];

// Cargar datos al iniciar
function cargarDatos() {
    const datosGuardados = localStorage.getItem('movimientos');
    if (datosGuardados) {
        movimientos = JSON.parse(datosGuardados);
        actualizarBalance();
        actualizarInterfaz();
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
    actualizarInterfaz();
    limpiarCampoCantidad();
}

// Eliminar un movimiento
function eliminarMovimiento(index) {
    movimientos.splice(index, 1);
    actualizarBalance();
    guardarDatos();
    actualizarInterfaz();
}

// Actualizar el balance
function actualizarBalance() {
    balance = movimientos.reduce((total, mov) => total + (mov.tipo === 'ingreso' ? mov.cantidad : -mov.cantidad), 0);
    document.getElementById('balance').textContent = balance.toFixed(2);
}

// Actualizar la interfaz
function actualizarInterfaz() {
    const movimientosDiv = document.getElementById('movimientos');
    movimientosDiv.innerHTML = '';

    movimientos.forEach((mov, index) => {
        const movimientoDiv = document.createElement('div');
        movimientoDiv.className = 'movimiento';

        const textoMovimiento = document.createElement('span');
        textoMovimiento.textContent = `${mov.tipo === 'ingreso' ? '+' : '-'}${mov.cantidad.toFixed(2)} € - ${mov.fechaHora}`;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarMovimiento(index);

        movimientoDiv.appendChild(textoMovimiento);
        movimientoDiv.appendChild(botonEliminar);
        movimientosDiv.prepend(movimientoDiv);
    });
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