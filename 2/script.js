let colaCoches = [];
let cochesPintados = 0;
let colores = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "brown"];
let intervalo;
let tiempoInicio;
let temporizadorActivo = false; // Agregar una variable para controlar el temporizador

function iniciarTemporizador() {
    tiempoInicio = new Date();
    temporizadorActivo = true; // Marcar el temporizador como activo
    setInterval(() => {
        if (temporizadorActivo) { // Solo actualizar el tiempo si el temporizador está activo
            const ahora = new Date();
            const diferencia = new Date(ahora - tiempoInicio);
            const minutos = String(diferencia.getUTCMinutes()).padStart(2, '0');
            const segundos = String(diferencia.getUTCSeconds()).padStart(2, '0');
            document.getElementById('tiempo').textContent = `Tiempo: ${minutos}:${segundos}`;
        }
    }, 1000);
}

function generarCoche() {
    if (colaCoches.length >= 5) {
        clearInterval(intervalo);
        terminarJuego();
        return;
    }

    const colorAleatorio = colores[Math.floor(Math.random() * colores.length)];
    const coche = {
        color: colorAleatorio,
        elemento: crearCocheElemento()
    };

    colaCoches.push(coche);
    actualizarCoches();
}

function crearCocheElemento() {
    const cocheDiv = document.createElement("div");
    cocheDiv.classList.add("carro");
    cocheDiv.innerHTML = `<span class="carro-label">???</span>`;
    return cocheDiv;
}

function actualizarCoches() {
    const container = document.getElementById("carro-container");
    container.innerHTML = ""; // Limpiar el contenedor

    colaCoches.forEach(coche => {
        container.appendChild(coche.elemento);
        coche.elemento.querySelector(".carro-label").textContent = coche.color;
    });
}

function pintarCoche(colorSeleccionado) {
    if (colaCoches.length === 0) {
        Swal.fire({
            title: 'Sin coches',
            text: 'No hay coches en la cola.',
            icon: 'info',
            confirmButtonText: 'Aceptar'
        });
        return;
    }

    const primerCoche = colaCoches[0];

    if (primerCoche.color === colorSeleccionado) {
        primerCoche.elemento.style.backgroundColor = colorSeleccionado;
        setTimeout(() => {
            colaCoches.shift();
            cochesPintados++;
            document.getElementById("record").innerText = "Coches pintados: " + cochesPintados;

            if (cochesPintados % 3 === 0) {
                aumentarVelocidad();
            }

            actualizarCoches();
        }, 500);
    } else {
        temporizadorActivo = false; // Detener el temporizador
        Swal.fire({
            title: 'Color incorrecto',
            text: 'Intenta de nuevo.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

function aumentarVelocidad() {
    clearInterval(intervalo);
    const nuevaVelocidad = Math.max(3000, 3000 - cochesPintados * 1000);
    intervalo = setInterval(generarCoche, nuevaVelocidad);
}

function terminarJuego() {
    temporizadorActivo = false; // Asegurarse de que el temporizador esté detenido
    const tiempoFinal = document.getElementById('tiempo').textContent;
    Swal.fire({
        title: '¡Juego Terminado!',
        html: `Pintaste ${cochesPintados} coches.<br>Tiempo total: ${tiempoFinal}`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Reiniciar',
        cancelButtonText: 'Salir'
    }).then(result => {
        if (result.isConfirmed) {
            reiniciarJuego();
        } else {
            confirmarSalida();
        }
    });
}

function confirmarSalida() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Quieres salir del juego?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    }).then(result => {
        if (result.isConfirmed) {
            window.close();
        }
    });
}

function reiniciarJuego() {
    location.reload();
}

window.onload = function() {
    iniciarTemporizador();
    intervalo = setInterval(generarCoche, 2000);
};

function confirmarRegresoMenu() {
    Swal.fire({
        title: '¿Seguro que quieres volver al menú?',
        text: 'Se perderá tu progreso actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, volver al menú',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../index.html'; // Ajusta la ruta según sea necesario
        }
    });
}
