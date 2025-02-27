// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};

// Inicializar Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let balance = 0;
let movimientos = [];

// Cargar datos del usuario actual
function cargarDatos() {
    const usuario = auth.currentUser;
    if (usuario) {
        db.collection('usuarios').doc(usuario.uid).collection('movimientos').get()
            .then((querySnapshot) => {
                movimientos = [];
                querySnapshot.forEach((doc) => {
                    movimientos.push(doc.data());
                });
                actualizarBalance();
                actualizarInterfaz();
            })
            .catch((error) => {
                console.error("Error al cargar datos: ", error);
            });
    }
}

// Guardar datos en Firestore
function guardarDatos() {
    const usuario = auth.currentUser;
    if (usuario) {
        const movimientosRef = db.collection('usuarios').doc(usuario.uid).collection('movimientos');
        movimientosRef.doc().set({
            cantidad: movimientos[movimientos.length - 1].cantidad,
            tipo: movimientos[movimientos.length - 1].tipo,
            fechaHora: movimientos[movimientos.length - 1].fechaHora
        })
        .catch((error) => {
            console.error("Error al guardar datos: ", error);
        });
    }
}

// Iniciar sesión
function iniciarSesion() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    auth.signInWithEmailAndPassword(email, password)
        .then(() => {
            cargarDatos();
            document.getElementById('authSection').classList.add('hidden');
            document.getElementById('mainSection').classList.remove('hidden');
        })
        .catch((error) => {
            alert("Error al iniciar sesión: " + error.message);
        });
}

// Registrarse
function registrarse() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
            alert("Usuario registrado correctamente.");
        })
        .catch((error) => {
            alert("Error al registrarse: " + error.message);
        });
}

// Agregar un nuevo movimiento
function agregarMovimiento() {
    const cantidad = obtenerCantidad();
    if (!validarCantidad(cantidad)) return;

    const tipo = document.getElementById('tipo').value;
    const fechaHora = new Date().toLocaleString(); // Obtener fecha y hora actual

    const movimiento = {
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
    const usuario = auth.currentUser;
    if (usuario) {
        db.collection('usuarios').doc(usuario.uid).collection('movimientos').doc(id).delete()
            .then(() => {
                cargarDatos();
            })
            .catch((error) => {
                console.error("Error al eliminar movimiento: ", error);
            });
    }
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
auth.onAuthStateChanged((usuario) => {
    if (usuario) {
        document.getElementById('authSection').classList.add('hidden');
        document.getElementById('mainSection').classList.remove('hidden');
        cargarDatos();
    } else {
        document.getElementById('authSection').classList.remove('hidden');
        document.getElementById('mainSection').classList.add('hidden');
    }
});