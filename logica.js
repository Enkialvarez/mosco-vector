// Capturamos los controles del HTML
const btnSetear = document.getElementById('btn-setear');
const btnEjecutar = document.getElementById('btn-ejecutar');
const btnFumigar = document.getElementById('btn-fumigar');
const sliderP = document.getElementById('personas-init');
const sliderM = document.getElementById('mosquitos-init');
const valP = document.getElementById('personas-val');
const valM = document.getElementById('mosquitos-val');
const countP = document.getElementById('personas-count');
const countM = document.getElementById('mosquitos-count');
const mundo = document.getElementById('vista-simulacion');

// Variables de la simulación
let agentes = [];
let simulacionActiva = false;
let intervaloSimulacion;

// Actualizar el número de los controles deslizantes
sliderP.addEventListener('input', () => valP.innerText = sliderP.value);
sliderM.addEventListener('input', () => valM.innerText = sliderM.value);

// Clase para crear Personas o Mosquitos
class Agente {
    constructor(tipo, icono) {
        this.tipo = tipo;
        this.el = document.createElement('div');
        this.el.className = 'agente';
        this.el.innerText = icono;
        
        // Posición aleatoria inicial dentro de la pantalla
        this.x = Math.random() * (mundo.clientWidth - 30);
        this.y = Math.random() * (mundo.clientHeight - 30);
        
        this.actualizarDOM();
        mundo.appendChild(this.el);
    }

    actualizarDOM() {
        this.el.style.left = `${this.x}px`;
        this.el.style.top = `${this.y}px`;
    }

    mover() {
        // Los mosquitos se mueven más rápido (15px) que las personas (5px)
        const velocidad = this.tipo === 'mosquito' ? 15 : 5;
        this.x += (Math.random() - 0.5) * velocidad;
        this.y += (Math.random() - 0.5) * velocidad;

        // Evitar que se salgan de la pantalla
        this.x = Math.max(0, Math.min(mundo.clientWidth - 30, this.x));
        this.y = Math.max(0, Math.min(mundo.clientHeight - 30, this.y));
        
        this.actualizarDOM();
    }
}

// Función SETEAR: Limpia la pantalla y crea nuevos agentes
function setearSimulacion() {
    // Detener si estaba corriendo
    simulacionActiva = false;
    clearInterval(intervaloSimulacion);
    
    // Limpiar pantalla y memoria
    mundo.innerHTML = '';
    agentes = [];

    // Crear Personas (🚶)
    for (let i = 0; i < parseInt(sliderP.value); i++) {
        agentes.push(new Agente('persona', '🚶'));
    }

    // Crear Mosquitos (🦟)
    for (let i = 0; i < parseInt(sliderM.value); i++) {
        agentes.push(new Agente('mosquito', '🦟'));
    }

    actualizarContadores();
}

// Función EJECUTAR: Inicia o pausa el movimiento
function alternarEjecucion() {
    simulacionActiva = !simulacionActiva;
    
    if (simulacionActiva) {
        // Mover a todos los agentes cada 100 milisegundos
        intervaloSimulacion = setInterval(() => {
            agentes.forEach(agente => agente.mover());
        }, 100);
    } else {
        clearInterval(intervaloSimulacion);
    }
}

function actualizarContadores() {
    const totalPersonas = agentes.filter(a => a.tipo === 'persona').length;
    const totalMosquitos = agentes.filter(a => a.tipo === 'mosquito').length;
    countP.innerText = totalPersonas;
    countM.innerText = totalMosquitos;
}

// Acción del botón FUMIGAR (Elimina la mitad de los mosquitos)
btnFumigar.addEventListener('click', () => {
    // Filtrar los que son mosquitos
    let mosquitos = agentes.filter(a => a.tipo === 'mosquito');
    let cantidadAMatar = Math.floor(mosquitos.length / 2);

    for (let i = 0; i < cantidadAMatar; i++) {
        let moscoMuerto = mosquitos[i];
        moscoMuerto.el.remove(); // Quitarlo de la pantalla
        agentes.splice(agentes.indexOf(moscoMuerto), 1); // Quitarlo de la memoria
    }
    actualizarContadores();
});

// Conectar botones con sus funciones
btnSetear.addEventListener('click', setearSimulacion);
btnEjecutar.addEventListener('click', alternarEjecucion);

// Crear la primera simulación al cargar la página por primera vez
setTimeout(setearSimulacion, 500);