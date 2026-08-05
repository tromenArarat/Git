// MAPEO/scripts/app.js

import { crearMapa, crearCapasBase } from './mapa.js';
import { cargarCapasTematicas } from './capasTematicas.js';
import { crearCapaTurismo } from './turismo.js';
import { agregarControles } from './controles.js';

async function iniciarAplicacion() {
    try {
        const map = crearMapa();
        const capasBase = crearCapasBase(map);
        const capasTematicas = await cargarCapasTematicas();
        const turismo = await crearCapaTurismo(map);

        const capas = {
            ...capasBase,
            ...capasTematicas,
            turismoCluster: turismo.getCluster()
        };

        // Ocultar el panel de filtros inicialmente
        //document.getElementById('filtros').style.display = 'none';

        agregarControles(map, capas);

        const selector = document.getElementById('selectorRubro');

        // selector.addEventListener('change', evento => {
        //     turismo.filtrarPorRubro(evento.target.value);
        // });

        console.log('Mapa inicializado correctamente');
    } catch (error) {
        console.error('Error al iniciar el mapa:', error);

        const mensaje = document.createElement('div');
        mensaje.className = 'error-mapa';
        mensaje.textContent =
            `No se pudo iniciar el mapa: ${error.message}`;

        document.body.appendChild(mensaje);
    }
}

iniciarAplicacion();