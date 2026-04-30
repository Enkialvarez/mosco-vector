// Capturamos los elementos del DOM
const btnFumigar = document.getElementById('btn-fumigar');
const btnDescacharrizar = document.getElementById('btn-descacharrizar');
const btnReiniciar = document.getElementById('btn-reiniciar');
const nubeHumo = document.getElementById('nube-humo');
const moscos = document.querySelectorAll('.mosco');
const cacharros = document.querySelectorAll('.cacharros');

// Acción: FUMIGAR
btnFumigar.addEventListener('click', () => {
    // Activa la nube de humo
    nubeHumo.classList.add('activo');
    
    // Mata a los moscos después de un pequeño retraso para sincronizar con el humo
    setTimeout(() => {
        moscos.forEach(mosco => {
            mosco.classList.add('muerto');
        });
    }, 400); // 400ms de retraso

    // Limpia la clase del humo para poder reusarla después
    setTimeout(() => {
        nubeHumo.classList.remove('activo');
    }, 2000);
});

// Acción: DESCACHARRIZAR
btnDescacharrizar.addEventListener('click', () => {
    // Aplica la animación de eliminación a cada cacharro con un efecto en cadena (stagger)
    cacharros.forEach((cacharro, index) => {
        setTimeout(() => {
            cacharro.classList.add('eliminado');
        }, index * 200); // Cada cacharro desaparece 200ms después del anterior
    });
});

// Acción: REINICIAR (Para repetir la demostración)
btnReiniciar.addEventListener('click', () => {
    moscos.forEach(mosco => mosco.classList.remove('muerto'));
    cacharros.forEach(cacharro => cacharro.classList.remove('eliminado'));
});