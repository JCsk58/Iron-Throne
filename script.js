let caloriasRestantes = 2000;
let historial = [];

document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const ejercicio = document.getElementById('ejercicio').value;
    const calorias = parseInt(document.getElementById('calorias').value);

    // Restar calorías del total
    caloriasRestantes -= calorias;
    if (caloriasRestantes < 0) {
        caloriasRestantes = 0;
    }

    // Guardar sesión en el historial
    historial.push({ ejercicio, calorias });

    // Actualizar la interfaz
    actualizarInterfaz();
});

document.getElementById('limpiarHistorial').addEventListener('click', function() {
    historial = [];
    caloriasRestantes = 2000;
    actualizarInterfaz();
});

function actualizarInterfaz() {
    // Actualizar calorías restantes
    document.getElementById('caloriasRestantes').textContent = caloriasRestantes;

    // Actualizar historial
    const listaMovimientos = document.getElementById('listaMovimientos');
    listaMovimientos.innerHTML = historial.map(sesion => `
        <div class="movimiento">
            <span>${sesion.ejercicio}</span>
            <span>${sesion.calorias} K</span>
        </div>
    `).join('');
}