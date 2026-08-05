// MAPEO/scripts/turismo.js

import { cargarGeoJSON, ajustarVista } from './utilidades.js';

const coloresRubros = {
    restaurante: '#E74C3C',
    restobar: '#E67E22',
    rotiseria: '#F1C40F',
    panaderia: '#F39C12',
    cerveceria: '#8E44AD',
    cafe_bar: '#2C3E50',
    cafeteria: '#16A085',
    drugstore: '#7F8C8D',
    comedor: '#D35400',
    pasteleria: '#FF6B9D',
    pizzeria: '#C0392B',
    heladeria: '#3498DB',
    bar: '#34495E',
    parador: '#27AE60',
    parrilla: '#A04000',
    discoteca: '#6C3483',
    otros: '#95A5A6'
};

function obtenerColorRubro(rubro) {
    return coloresRubros[rubro] || coloresRubros.otros;
}

function crearIconoCluster(cluster) {
    const cantidad = cluster.getChildCount();
    const rubros = {};

    cluster.getAllChildMarkers().forEach(marker => {
        const rubro = marker.options.rubro || 'otros';
        rubros[rubro] = (rubros[rubro] || 0) + 1;
    });

    const resumenRubros = Object.entries(rubros)
        .map(([rubro, cantidad]) => {
            return `<div>
                <span class="leyenda-color"
                      style="background:${obtenerColorRubro(rubro)}">
                </span>
                ${rubro}: ${cantidad}
            </div>`;
        })
        .join('');

    const colorCluster =
        cantidad < 10 ? '#43A047' :
        cantidad < 50 ? '#FB8C00' :
                        '#E53935';

    const icono = L.divIcon({
        className: 'cluster-mixto',
        html: `
            <div class="cluster-circulo"
                 style="background-color:${colorCluster}">
                ${cantidad}
            </div>
        `,
        iconSize: [46, 46],
        iconAnchor: [23, 23]
    });

    icono._popupContent = `
        <strong>${cantidad} establecimientos</strong>
        <hr>
        ${resumenRubros}
    `;

    return icono;
}

function crearMarcador(feature, latlng) {
    const props = feature.properties || {};
    const rubro = String(props.rubro || 'otros').toLowerCase();
    const color = obtenerColorRubro(rubro);

    const marcador = L.circleMarker(latlng, {
        radius: 15,
        color: '#FFFFFF',
        weight: 2,
        fillColor: color,
        fillOpacity: 0.9,

        // Se guarda para que el cluster pueda leerlo.
        rubro
    });

    // Importante: se conserva la referencia al Feature.
    marcador.feature = feature;

    const nombre =
        props.nombre ||
        props.Name ||
        'Establecimiento sin nombre';

    const direccion = props.direccion
        ? `<br>Dirección: ${props.direccion}`
        : '';

    marcador.bindPopup(`
        <div class="popup-turismo">
            <strong>${nombre}</strong>
            <br>
            <span>
                <b>Rubro:</b> ${rubro}
            </span>
            ${direccion}
        </div>
    `);

    return marcador;
}

function crearCluster() {
    const cluster = L.markerClusterGroup({
        maxClusterRadius: 40,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: true,
        zoomToBoundsOnClick: true,
        iconCreateFunction: crearIconoCluster,
        polygonOptions: {
            color: '#333',
            weight: 2,
            opacity: 0.5,
            fillColor: '#333',
            fillOpacity: 0.1
        }
    });

    cluster.on('clusterclick', evento => {
        const clusterLayer = evento.layer;
        const contenido = clusterLayer._icon?._popupContent;

        if (contenido) {
            clusterLayer
                .bindPopup(contenido)
                .openPopup();
        }
    });

    return cluster;
}

export async function crearCapaTurismo(map) {
    const datos = await cargarGeoJSON(
        './MAPEO/capas/turismo.geojson'
    );

    const turismoLayer = L.geoJSON(datos, {
        pointToLayer: crearMarcador
    });

    let clusterActual = crearCluster();

    turismoLayer.eachLayer(layer => {
        clusterActual.addLayer(layer);
    });

    map.addLayer(clusterActual);

    ajustarVista(map, clusterActual, {
        padding: [50, 50]
    });

    // function filtrarPorRubro(rubro) {
    //     map.removeLayer(clusterActual);

    //     const nuevoCluster = crearCluster();

    //     turismoLayer.eachLayer(layer => {
    //         const rubroCapa = layer.feature?.properties?.rubro || 'otros';

    //         if (rubro === 'todos' || rubroCapa === rubro) {
    //             nuevoCluster.addLayer(layer);
    //         }
    //     });

    //     clusterActual = nuevoCluster;
    //     map.addLayer(clusterActual);

    //     if (clusterActual.getLayers().length > 0) {
    //         ajustarVista(map, clusterActual, {
    //             padding: [50, 50]
    //         });
    //     }
    // }

    return {
        turismoLayer,
        getCluster: () => clusterActual
        //filtrarPorRubro
    };
}
