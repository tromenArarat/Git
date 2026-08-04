// MAPEO/scripts/capasTematicas.js

import { cargarGeoJSON } from './utilidades.js';

function colorBarrio(nombre) {
    const colores = {
        'DON BOSCO': '#FF0000',
        'CHACRAS NORTE': '#0000FF',
        'LAS VERTIENTES': '#00CC00',
        'RUTA 40': '#FFA500',
        'URIBURU': '#800080',
        'CORDILLERA DEL VIENTO': '#FF69B4',
        'TIRO FEDERAL': '#00BFFF',
        'PARQUE LA HOYA': '#32CD32',
        'JARDIN': '#FFD700',
        'AREA CENTRO': '#8B4513',
        'AGUA ESCONDIDA': '#2F4F4F',
        'ÁREA DE FRONTERA': '#DC143C',
        'LAS FLORES': '#FFB6C1',
        'ALTOS DEL SOL': '#F0E68C',
        'IV DIVISIÓN': '#6A5ACD',
        'CANALITO': '#00CED1',
        'CENTENARIO I': '#DAA520',
        'CENTENARIO II': '#B8860B',
        'CHACRA SUR': '#CD853F'
    };

    return colores[nombre] || '#FFEDA0';
}

function estiloBarrios(feature) {
    return {
        fillColor: colorBarrio(feature.properties.nombre),
        weight: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function estiloDensidad(feature) {
    const densidad = Number(feature.properties.dens_pobl) || 0;

    const color =
        densidad > 85 ? '#800026' :
        densidad > 65 ? '#BD0026' :
        densidad > 45 ? '#E31A1C' :
        densidad > 25 ? '#FC4E2A' :
        densidad > 5  ? '#FD8D3C' :
                        '#FFEDA0';

    return {
        fillColor: color,
        weight: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function estiloAreaEdificada(feature) {
    const porcentaje = Number(feature.properties.built_perc) || 0;

    const color =
        porcentaje > 25 ? '#800026' :
        porcentaje > 20 ? '#BD0026' :
        porcentaje > 15 ? '#E31A1C' :
        porcentaje > 10 ? '#FC4E2A' :
        porcentaje > 5  ? '#FD8D3C' :
                          '#FFEDA0';

    return {
        fillColor: color,
        weight: 2,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function activarInteraccion(layer, popup) {
    layer.bindPopup(popup);

    layer.on({
        mouseover: evento => {
            evento.target.setStyle({
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.8
            });

            evento.target.bringToFront();
        },

        mouseout: evento => {
            evento.target.setStyle(evento.target.options);
        },

        click: evento => {
            evento.target._map.fitBounds(evento.target.getBounds());
        }
    });
}

export async function cargarCapasTematicas() {
    const [
        barrios,
        densidad,
        areaEdificada,
        transporte
    ] = await Promise.all([
        cargarGeoJSON('./MAPEO/capas/barrios.geojson'),
        cargarGeoJSON('./MAPEO/capas/densidad.geojson'),
        cargarGeoJSON('./MAPEO/capas/area_edificada.geojson'),
        cargarGeoJSON('./MAPEO/capas/transporte_urbano.geojson')
    ]);

    const capaBarrios = L.geoJSON(barrios, {
        style: estiloBarrios,
        onEachFeature: (feature, layer) => {
            const nombre = feature.properties.nombre || 'Barrio sin nombre';
            activarInteraccion(layer, `<strong>${nombre}</strong>`);
        }
    });

    const densityLayer = L.geoJSON(densidad, {
        style: estiloDensidad,
        onEachFeature: (feature, layer) => {
            const props = feature.properties;

            activarInteraccion(
                layer,
                `Población total: ${props.p02_tot || 0}<br>` +
                `Densidad: ${props.dens_pobl || 0} hab/ha`
            );
        }
    });

    const areaEdificadaLayer = L.geoJSON(areaEdificada, {
        style: estiloAreaEdificada,
        onEachFeature: (feature, layer) => {
            const props = feature.properties;

            activarInteraccion(
                layer,
                `Área edificada: ${(Number(props.built_perc) || 0).toFixed(1)}%<br>` +
                `Población estimada: ${props.pob_est || 0}`
            );
        }
    });

    const urbanoLayer = L.geoJSON(transporte, {
        style: {
            color: '#FF4500',
            weight: 3,
            opacity: 0.9,
            dashArray: '8, 6'
        }
    });

    return {
        capaBarrios,
        densityLayer,
        areaEdificadaLayer,
        urbanoLayer
    };
}

