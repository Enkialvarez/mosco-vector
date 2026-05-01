const btnSetear = document.getElementById('btn-setear');
const btnEjecutar = document.getElementById('btn-ejecutar');
const btnPastilla = document.getElementById('btn-pastilla');
const btnDescacharrizar = document.getElementById('btn-descacharrizar');
const btnFumigar = document.getElementById('btn-fumigar');
const btnGrafico = document.getElementById('btn-grafico');
const modalGrafico = document.getElementById('modal-grafico');
const btnCerrarModal = document.getElementById('cerrar-modal');

const sliderP = document.getElementById('personas-init');
const sliderM = document.getElementById('mosquitos-init');
const sliderT = document.getElementById('tanques-init');
const sliderC = document.getElementById('cacharros-init');

const valP = document.getElementById('personas-val');
const valM = document.getElementById('mosquitos-val');
const valT = document.getElementById('tanques-val');
const valC = document.getElementById('cacharros-val');

const countSanos = document.getElementById('sanos-count');
const countInfectados = document.getElementById('infectados-count');
const countM = document.getElementById('mosquitos-count');
const countT = document.getElementById('tanques-count');
const countTratados = document.getElementById('tratados-count');
const countC = document.getElementById('cacharros-count');

const mundo = document.getElementById('vista-simulacion');

let agentes = [];
let simulacionActiva = false;
let intervaloSimulacion;
let tiempoSimulador = 0;

sliderP.addEventListener('input', () => valP.innerText = sliderP.value);
sliderM.addEventListener('input', () => valM.innerText = sliderM.value);
sliderT.addEventListener('input', () => valT.innerText = sliderT.value);
sliderC.addEventListener('input', () => valC.innerText = sliderC.value);

class Agente {
    constructor(tipo, estado) {
        this.tipo = tipo;
        this.estado = estado; 
        this.tratado = false; 
        this.el = document.createElement('div');
        
        if (tipo === 'persona') {
            this.el.className = 'agente';
            this.el.innerText = estado === 'sano' ? '🚶' : '🤒';
        }
        if (tipo === 'mosquito') {
            this.el.className = 'agente';
            this.el.innerText = '🦟';
            // Biología: El vector envejece y muere
            this.edad = 0;
            this.esperanzaVida = 50 + Math.floor(Math.random() * 50);
        }
        if (tipo === 'tanque') {
            this.el.className = 'agente tanque-concreto';
            this.el.innerText = ''; 
        }
        if (tipo === 'cacharro') {
            this.el.className = 'agente';
            this.el.innerText = '🪣'; 
        }
        
        this.x = Math.random() * (mundo.clientWidth - 50);
        this.y = Math.random() * (mundo.clientHeight - 50);
        
        this.actualizarDOM();
        mundo.appendChild(this.el);
    }

    actualizarDOM() {
        this.el.style.left = `${this.x}px`;
        this.el.style.top = `${this.y}px`;
    }

    mover() {
        if (this.tipo === 'tanque' || this.tipo === 'cacharro') return; 

        const velocidad = this.tipo === 'mosquito' ? 22 : 6;
        this.x += (Math.random() - 0.5) * velocidad;
        this.y += (Math.random() - 0.5) * velocidad;

        this.x = Math.max(0, Math.min(mundo.clientWidth - 50, this.x));
        this.y = Math.max(0, Math.min(mundo.clientHeight - 50, this.y));
        
        this.actualizarDOM();
    }
}

function setearSimulacion() {
    simulacionActiva = false;
    clearInterval(intervaloSimulacion);
    mundo.innerHTML = '';
    agentes = [];
    tiempoSimulador = 0;

    for (let i = 0; i < parseInt(sliderP.value); i++) {
        agentes.push(new Agente('persona', 'sano'));
    }
    for (let i = 0; i < parseInt(sliderM.value); i++) {
        agentes.push(new Agente('mosquito', 'infectado')); 
    }
    for (let i = 0; i < parseInt(sliderT.value); i++) {
        agentes.push(new Agente('tanque', 'estatico'));
    }
    for (let i = 0; i < parseInt(sliderC.value); i++) {
        agentes.push(new Agente('cacharro', 'estatico'));
    }
    actualizarControlesUI();
}

function logicaEpidemiologica() {
    let personas = agentes.filter(a => a.tipo === 'persona');
    let mosquitos = agentes.filter(a => a.tipo === 'mosquito');
    let tanques = agentes.filter(a => a.tipo === 'tanque');
    let cacharros = agentes.filter(a => a.tipo === 'cacharro');

    // 1. Contagio (Picadura con desfase visual corregido)
    mosquitos.forEach(m => {
        personas.forEach(p => {
            if (p.estado === 'sano') {
                let distanciaX = Math.abs(m.x - p.x);
                let distanciaY = Math.abs(m.y - p.y);
                if (distanciaX < 25 && distanciaY < 25) {
                    p.estado = 'infectado';
                    // Sincronización visual: Esperamos 95ms para que los iconos
                    // terminen de deslizarse y choquen visualmente antes del cambio.
                    setTimeout(() => {
                        if (p.el) p.el.innerText = '🤒';
                    }, 95);
                }
            }
        });
    });

    // 2. Curva de deceso natural (Mosquitos mueren por edad)
    for (let i = mosquitos.length - 1; i >= 0; i--) {
        let m = mosquitos[i];
        m.edad++; 
        if (m.edad > m.esperanzaVida) {
            m.el.remove(); 
            agentes.splice(agentes.indexOf(m), 1); 
        }
    }

    // 3. Tasa de Natalidad (Dependiente directo de la descacharrización y BTI)
    tiempoSimulador++;
    if (tiempoSimulador % 15 === 0) { 
        tanques.forEach(t => {
            if (!t.tratado && Math.random() < 0.40) { 
                let nuevoMosco = new Agente('mosquito', 'infectado');
                nuevoMosco.x = t.x; nuevoMosco.y = t.y;
                agentes.push(nuevoMosco);
            }
        });
        
        cacharros.forEach(c => {
            if (Math.random() < 0.45) { 
                let nuevoMosco = new Agente('mosquito', 'infectado');
                nuevoMosco.x = c.x; nuevoMosco.y = c.y;
                agentes.push(nuevoMosco);
            }
        });
    }
}

function alternarEjecucion() {
    simulacionActiva = !simulacionActiva;
    if (simulacionActiva) {
        intervaloSimulacion = setInterval(() => {
            agentes.forEach(agente => agente.mover());
            logicaEpidemiologica();
            actualizarControlesUI();
        }, 100);
    } else {
        clearInterval(intervaloSimulacion);
    }
}

function actualizarControlesUI() {
    countSanos.innerText = agentes.filter(a => a.tipo === 'persona' && a.estado === 'sano').length;
    countInfectados.innerText = agentes.filter(a => a.tipo === 'persona' && a.estado === 'infectado').length;
    countM.innerText = agentes.filter(a => a.tipo === 'mosquito').length;
    countT.innerText = agentes.filter(a => a.tipo === 'tanque' && !a.tratado).length;
    countTratados.innerText = agentes.filter(a => a.tipo === 'tanque' && a.tratado).length;
    countC.innerText = agentes.filter(a => a.tipo === 'cacharro').length;
}

// ==========================================
// IMPACTO BIOLÓGICO GRADUAL (2 EN 2)
// ==========================================

btnPastilla.addEventListener('click', () => {
    let tanquesNoTratados = agentes.filter(a => a.tipo === 'tanque' && !a.tratado);
    let limite = 0; // Contador para tratar solo 2 a la vez
    
    tanquesNoTratados.forEach(t => {
        if (limite < 2) {
            t.tratado = true; 
            t.el.classList.add('animacion-bti'); 
            t.el.classList.add('tanque-tratado'); 
            t.el.innerText = '⚪'; 
            limite++;
        }
    });
    actualizarControlesUI();
});

btnDescacharrizar.addEventListener('click', () => {
    let cacharros = agentes.filter(a => a.tipo === 'cacharro');
    let limite = 0; // Contador para eliminar solo 2 a la vez
    
    cacharros.forEach(c => {
        if (limite < 2) {
            c.el.remove();
            agentes.splice(agentes.indexOf(c), 1);
            limite++;
        }
    });
    actualizarControlesUI();
});

// ==========================================

btnFumigar.addEventListener('click', () => {
    let mosquitos = agentes.filter(a => a.tipo === 'mosquito');
    let eliminar = Math.floor(mosquitos.length * 0.75); 
    for (let i = 0; i < eliminar; i++) {
        let mosco = mosquitos[i];
        mosco.el.remove();
        agentes.splice(agentes.indexOf(mosco), 1);
    }
    actualizarControlesUI();
});

btnGrafico.addEventListener('click', () => {
    if (simulacionActiva) alternarEjecucion();

    let totalPersonas = parseInt(sliderP.value);
    let sanos = agentes.filter(a => a.tipo === 'persona' && a.estado === 'sano').length;
    let infectados = agentes.filter(a => a.tipo === 'persona' && a.estado === 'infectado').length;
    let mosquitos = agentes.filter(a => a.tipo === 'mosquito').length;

    document.getElementById('g-sanos').innerText = sanos;
    document.getElementById('g-infectados').innerText = infectados;
    document.getElementById('g-mosquitos').innerText = mosquitos;

    modalGrafico.style.display = 'flex';

    setTimeout(() => {
        document.getElementById('bar-sanos').style.width = `${(sanos / totalPersonas) * 100}%`;
        document.getElementById('bar-infectados').style.width = `${(infectados / totalPersonas) * 100}%`;
        let porcentajeMosquitos = Math.min((mosquitos / 100) * 100, 100); 
        document.getElementById('bar-mosquitos').style.width = `${porcentajeMosquitos}%`;
    }, 100); 
});

btnCerrarModal.addEventListener('click', () => {
    modalGrafico.style.display = 'none';
    document.getElementById('bar-sanos').style.width = '0%';
    document.getElementById('bar-infectados').style.width = '0%';
    document.getElementById('bar-mosquitos').style.width = '0%';
});

btnSetear.addEventListener('click', setearSimulacion);
btnEjecutar.addEventListener('click', alternarEjecucion);

setTimeout(setearSimulacion, 200); 

/* PROTECCIÓN DEL CÓDIGO CONTRA INSPECCIÓN */
document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
    if(e.keyCode == 123) return false; 
    if(e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'C'.charCodeAt(0))) return false;
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false;
    if(e.metaKey && e.altKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'U'.charCodeAt(0))) return false;
};