// Clases de Agentes
class Person {
  constructor(id) {
    this.id = id;
    this.type = 'p'; this.el = null;
    this.x = Math.random() * 1900; this.y = Math.random() * 1900;
  }
  update() { // Movimiento simple
    this.x += (Math.random() - 0.5) * 10;
    this.y += (Math.random() - 0.5) * 10;
    this.x = Math.max(0, Math.min(1900, this.x)); // Limitar bordes
    this.y = Math.max(0, Math.min(1900, this.y));
  }
}

class Mosquito {
  constructor(id) {
    this.id = id;
    this.type = 'm'; this.el = null;
    this.x = Math.random() * 1900; this.y = Math.random() * 1900;
  }
  update() { // Movimiento más rápido
    this.x += (Math.random() - 0.5) * 20;
    this.y += (Math.random() - 0.5) * 20;
    this.x = Math.max(0, Math.min(1900, this.x));
    this.y = Math.max(0, Math.min(1900, this.y));
  }
}

// Variables Globales
let agents = [];
let isSimRunning = false;
let followedAgent = null;
let simInterval = null;
const WORLD_SIZE = 2000;

// Elementos del DOM
const elVistaMundo = document.getElementById('vista-simulacion');
const elContenedorVista = document.getElementById('vista-container');
// ... otros elementos de control ...

// Configuración de Sliders y Estaciones
const setupSliders = () => {
    // ... vincular sliders a labels de valor ...
};

// --- Sistema de Seguimiento ---
const setFollowedAgent = (agent) => {
    if (followedAgent) followedAgent.el.classList.remove('seguido');
    followedAgent = agent;
    followedAgent.el.classList.add('seguido');
};

const updateViewCenter = () => {
    if (!followedAgent) return;
    
    // Obtener las coordenadas del agente y de la ventana de vista
    const agentX = followedAgent.x;
    const agentY = followedAgent.y;
    const viewWidth = elContenedorVista.clientWidth;
    const viewHeight = elContenedorVista.clientHeight;
    
    // Calcular el desplazamiento (scroll) para centrar
    const scrollX = agentX - (viewWidth / 2);
    const scrollY = agentY - (viewHeight / 2);
    
    // Aplicar transformación para mover el mundo, no la ventana
    elVistaMundo.style.transform = `translate(${-scrollX}px, ${-scrollY}px)`;
};


// --- Funciones de Simulación ---
const spawnAgents = (numP, numM) => {
    // ... limpiar mundo y arrays ...
    // ... crear objetos Person/Mosquito y sus elementos DOM ...
    // ... añadir agentes a los arrays y al DOM del mundo ...
};

const simStep = () => {
    if (!isSimRunning) return;
    agents.forEach(agent => {
        agent.update();
        agent.el.style.left = `${agent.x}px`;
        agent.el.style.top = `${agent.y}px`;
    });
    updateViewCenter();
};

// --- Inicialización y Eventos ---
setupSliders();
spawnAgents(50, 20); // Inicialización por defecto

// Botones: Setear
btnSetear.addEventListener('click', () => {
    isSimRunning = false;
    // ... detener intervalo ...
    spawnAgents(sliderP.value, sliderM.value);
});

// Botones: Ejecutar
btnEjecutar.addEventListener('click', () => {
    isSimRunning = !isSimRunning;
    if (isSimRunning) simInterval = setInterval(simStep, 100);
    else clearInterval(simInterval);
});

// Botones: Seguir y Dejar de Seguir
btnSeguir.addEventListener('click', () => {
    // Seguir a la primera persona por defecto
    const person = agents.find(a => a.type === 'p');
    if (person) setFollowedAgent(person);
});

btnDejarSeguir.addEventListener('click', () => {
    if (followedAgent) followedAgent.el.classList.remove('seguido');
    followedAgent = null;
    elVistaMundo.style.transform = 'translate(0px, 0px)'; // Reset view
});
