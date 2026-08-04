// MAPEO/scripts/utilidades.js

export async function cargarGeoJSON(ruta) {
    const respuesta = await fetch(ruta);

    if (!respuesta.ok) {
        throw new Error(`No se pudo cargar ${ruta}. Estado HTTP: ${respuesta.status}`);
    }

    return await respuesta.json();
}

export function ajustarVista(map, capa, opciones = {}) {
    if (!capa || capa.getLayers().length === 0) {
        return;
    }

    const bounds = capa.getBounds();

    if (bounds.isValid()) {
        map.fitBounds(bounds, {
            padding: [30, 30],
            ...opciones
        });
    }
}
