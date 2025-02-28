let caloriasRestantes = 2000;
let historial = [];

document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const registro = {
        ejercicio: document.getElementById('ejercicio').value,
        km: parseFloat(document.getElementById('km').value),
        tiempo: parseInt(document.getElementById('tiempo').value),
        calorias: parseInt(document.getElementById('calorias').value)
    };

    caloriasRestantes -= registro.calorias;
    if(caloriasRestantes < 0) caloriasRestantes = 0;
    
    historial.push(registro);
    actualizarInterfaz();
    document.getElementById('registroForm').reset();
});

function actualizarInterfaz() {
    document.getElementById('caloriasRestantes').textContent = caloriasRestantes;
    
    const listaCompleta = document.getElementById('listaCompleta');
    listaCompleta.innerHTML = historial.map((sesion, index) => `
        <div class="movimiento">
            <span>${sesion.ejercicio.toUpperCase()}</span>
            <span>${sesion.tiempo} min</span>
            <span>${sesion.calorias} K</span>
            <span>${sesion.km.toFixed(1)} km</span>
            <button class="borrar-btn" onclick="borrarRegistro(${index})">🗑️</button>
        </div>
    `).join('');
}

function borrarRegistro(index) {
    caloriasRestantes += historial[index].calorias;
    historial.splice(index, 1);
    actualizarInterfaz();
}

// Control de ventana modal
document.getElementById('mostrarDatos').addEventListener('click', () => {
    document.getElementById('ventanaDatos').style.display = "block";
});

document.querySelector('.cerrar').addEventListener('click', () => {
    document.getElementById('ventanaDatos').style.display = "none";
});

window.onclick = function(event) {
    if(event.target == document.getElementById('ventanaDatos')) {
        document.getElementById('ventanaDatos').style.display = "none";
    }
}