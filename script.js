let balance = 0;
let movimientos = [];
const CONTRASEÑA = "0110"; // Cambia esto por tu contraseña

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

// Verificar contraseña
function verificarContraseña() {
    const contraseñaIngresada = document.getElementById('passwordInput').value;
    if (contraseñaIngresada === CONTRASEÑA) {
        document.getElementById('passwordSection').classList.add('hidden');
        document.getElementById('mainSection').classList.remove('hidden');
        cargarDatos();
    } else {
        alert("Contraseña incorrecta. Inténtalo de nuevo.");
    }
}

// Agregar un nuevo movimiento
function agregarMovimiento() {
    const cantidad = obtenerCantidad();
    if (!validarCantidad(cantidad)) return;

    const tipo = document.getElementById('tipo').value;
    const fechaHora = new Date().toLocaleString(); // Obtener fecha y hora actual

    const movimiento = {
        id: Date.now(), // ID único para cada movimiento
        cantidad: cantidad,
        tipo: tipo,
        fechaHora: fechaHora
    };

    movimientos.push(movimiento);
    actualizarBalance();
    guardarDatos();
    actualizarInterfaz();
    limpiarCampoCantidad();
}

// Eliminar un movimiento
function eliminarMovimiento(id) {
    movimientos = movimientos.filter(mov => mov.id !== id);
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

    movimientos.forEach(mov => {
        const movimientoDiv = document.createElement('div');
        movimientoDiv.className = 'movimiento';

        const textoMovimiento = document.createElement('span');
        textoMovimiento.textContent = `${mov.tipo === 'ingreso' ? '+' : '-'}${mov.cantidad.toFixed(2)} € - ${mov.fechaHora}`;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarMovimiento(mov.id);

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