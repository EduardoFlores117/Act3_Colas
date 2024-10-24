class Cliente {
    constructor(turno, nombre, movimiento, horaLlegada) {
        this.turno = turno;
        this.nombre = nombre;
        this.movimiento = movimiento;
        this.horaLlegada = horaLlegada;
    }
}

let colaClientes = [];

function agregarCliente() {
    const turno = parseInt(document.getElementById("turno").value);
    const nombre = document.getElementById("nombre").value;
    const movimiento = document.getElementById("movimiento").value;
    const horaLlegada = new Date();

    if (isNaN(turno) || nombre === "") {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'custom-confirm-button' }
        });
        return;
    }

    if (colaClientes.some(cliente => cliente.turno === turno)) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El número de turno ya está en uso.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'custom-confirm-button' }
        });
        return;
    }

    const cliente = new Cliente(turno, nombre, movimiento, horaLlegada);
    colaClientes.push(cliente);

    actualizarTabla();
    mostrarEstadoCola();

    Swal.fire({
        icon: 'success',
        title: 'Cliente agregado',
        html: `
            <p>No Turno: ${turno}</p>
            <p>Nombre: ${nombre}</p>
            <p>Tipo de Movimiento: ${movimiento}</p>
            <p>Hora de Llegada: ${horaLlegada.toLocaleString()}</p>
        `,
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'custom-confirm-button' }
    });
}

/** Atender Cliente */
function atenderCliente() {
    if (colaClientes.length === 0) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay clientes en la cola.',
            confirmButtonText: 'Aceptar',
            customClass: { confirmButton: 'custom-confirm-button' }
        });
        return;
    }

    const clienteAtendido = colaClientes.shift();
    const horaAtencion = new Date();
    const tiempoEspera = Math.floor((horaAtencion - clienteAtendido.horaLlegada) / 1000);

    actualizarTabla();
    mostrarEstadoCola();

    Swal.fire({
        icon: 'info',
        title: 'Cliente atendido',
        html: `
            <p>Nombre: ${clienteAtendido.nombre}</p>
            <p>Tiempo de espera: ${tiempoEspera} segundos</p>
        `,
        confirmButtonText: 'Aceptar',
        customClass: { confirmButton: 'custom-confirm-button' }
    });
}

/** Actualiza la tabla con los clientes en cola */
function actualizarTabla() {
    const tabla = document.getElementById("tabla-clientes");
    tabla.innerHTML = "";

    colaClientes.forEach(cliente => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td>${cliente.turno}</td>
            <td>${cliente.nombre}</td>
            <td>${cliente.movimiento}</td>
            <td>${cliente.horaLlegada.toLocaleString()}</td>
        `;
        tabla.appendChild(fila);
    });
}

/** Muestra el estado actual de la cola */
function mostrarEstadoCola() {
    const frente = document.getElementById("frente");
    const final = document.getElementById("final");

    if (colaClientes.length > 0) {
        frente.innerText = colaClientes[0].turno;
        final.innerText = colaClientes[colaClientes.length - 1].turno;
    } else {
        frente.innerText = "-1";
        final.innerText = "-1";
    }
}

function salir() {
    Swal.fire({
        title: '¿Seguro que desea salir?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No'
    }).then(result => {
        if (result.isConfirmed) {
            window.close();
        }
    });
}

/** Confirmación para regresar al menú */
function confirmarRegresoMenu() {
    Swal.fire({
        title: '¿Seguro que quieres volver al menú?',
        text: 'Se perderá tu progreso actual.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, volver al menú',
        cancelButtonText: 'No',
        customClass: { confirmButton: 'custom-confirm-button' }
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = '../index.html';
        }
    });
}

window.onload = mostrarEstadoCola;

