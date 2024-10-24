class Nodo {
    constructor(placas, propietario) {
        this.placas = placas;             // Placas del auto
        this.propietario = propietario;   // Propietario del auto
        this.horaEntrada = new Date();    // Hora de entrada
        this.siguiente = null;             // Puntero al siguiente nodo
        this.anterior = null;              // Puntero al nodo anterior
    }
}

class ColaCircular {
    constructor() {
        this.cabeza = null;               // Primer nodo de la cola
        this.final = null;                // Último nodo de la cola
    }

    // Método para insertar un nuevo nodo en la cola
    ingresarAuto(placas, propietario) {
        const nuevoNodo = new Nodo(placas, propietario);
        if (!this.cabeza) {
            // Si la cola está vacía
            this.cabeza = nuevoNodo;
            this.final = nuevoNodo;
            nuevoNodo.siguiente = nuevoNodo; // Circular
            nuevoNodo.anterior = nuevoNodo;  // Circular
        } else {
            // Insertar el nuevo nodo al final
            nuevoNodo.siguiente = this.cabeza; // Nuevo nodo apunta al primero
            nuevoNodo.anterior = this.final;    // Nuevo nodo apunta al último
            this.final.siguiente = nuevoNodo;   // Último nodo apunta al nuevo
            this.cabeza.anterior = nuevoNodo;   // Primer nodo apunta al nuevo
            this.final = nuevoNodo;              // Actualizar el final
        }
    }

    // Método para sacar el nodo de la cabeza
    salirAuto() {
        if (!this.cabeza) return null; // Cola vacía
        const auto = this.cabeza;      // Guardar el auto que sale
        const horaSalida = new Date();  // Hora de salida
        const tiempoEstacionado = calcularTiempo(auto.horaEntrada, horaSalida);
        const costo = calcularCosto(tiempoEstacionado);

        // Si solo hay un nodo
        if (this.cabeza === this.final) {
            this.cabeza = null;
            this.final = null;
        } else {
            // Más de un nodo
            this.cabeza = this.cabeza.siguiente; // Mover la cabeza al siguiente
            this.final.siguiente = this.cabeza;   // Actualizar el enlace circular
            this.cabeza.anterior = this.final;    // Mantener doble enlace
            this.final.siguiente = this.cabeza;   // Mantener circularidad
        }

        // Retornar información del auto que salió
        return {
            placas: auto.placas,
            propietario: auto.propietario,
            horaEntrada: auto.horaEntrada,
            horaSalida: horaSalida,
            tiempoEstacionado,
            costo
        };
    }
}

// Inicializa la cola circular
let colaAutos = new ColaCircular();

function ingresarAuto() {
    const placas = document.getElementById("placas").value;
    const propietario = document.getElementById("propietario").value;

    if (!placas || !propietario) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, ingrese las placas y el nombre del propietario.',
        });
        return;
    }

    // Validar que no exista un auto con esas placas
    let nodoActual = colaAutos.cabeza;
    if (nodoActual) {
        do {
            if (nodoActual.placas === placas) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Ya hay un auto con esas placas en el estacionamiento.',
                });
                return;
            }
            nodoActual = nodoActual.siguiente;
        } while (nodoActual !== colaAutos.cabeza);
    }

    // Ingresar el auto en la cola
    colaAutos.ingresarAuto(placas, propietario);
    actualizarTabla();
    document.getElementById("placas").value = "";
    document.getElementById("propietario").value = "";
    Swal.fire({
        icon: 'success',
        title: 'Éxito',
        text: `Auto con placas ${placas} ingresó correctamente.`,
    });
}

function salirAuto() {
    const auto = colaAutos.salirAuto();
    if (!auto) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No hay autos en el estacionamiento.',
        });
        return;
    }

    // Calcular la salida y mostrar la información
    Swal.fire({
        icon: 'info',
        title: 'Salida de Auto',
        html: `
            <p><strong>Placas:</strong> ${auto.placas}</p>
            <p><strong>Propietario:</strong> ${auto.propietario}</p>
            <p><strong>Hora de Entrada:</strong> ${auto.horaEntrada.toLocaleString()}</p>
            <p><strong>Hora de Salida:</strong> ${auto.horaSalida.toLocaleString()}</p>
            <p><strong>Tiempo estacionado:</strong> ${auto.tiempoEstacionado} segundos</p>
            <p><strong>Costo:</strong> $${auto.costo.toFixed(2)} MXN</p>
        `,
    });
    actualizarTabla();
}

function calcularTiempo(entrada, salida) {
    return Math.floor((salida - entrada) / 1000);  // Tiempo en segundos
}

function calcularCosto(segundos) {
    return segundos * 2;  // $2 MXN por segundo
}

function actualizarTabla() {
    const tabla = document.getElementById("tabla-autos");
    tabla.innerHTML = ""; // Limpiar la tabla antes de actualizar

    // Agregar todos los autos a la tabla
    let nodoActual = colaAutos.cabeza;
    if (nodoActual) {
        do {
            const fila = `<tr>
                <td>${nodoActual.placas}</td>
                <td>${nodoActual.propietario}</td>
                <td>${nodoActual.horaEntrada.toLocaleTimeString()}</td>
            </tr>`;
            tabla.innerHTML += fila;
            nodoActual = nodoActual.siguiente;
        } while (nodoActual !== colaAutos.cabeza); // Continuar hasta que regrese a la cabeza
    }
}

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
            window.location.href = '../index.html'; // Ruta al menú principal
        }
    });
}


