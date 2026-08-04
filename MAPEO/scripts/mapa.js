// MAPEO/scripts/mapa.js

export function crearMapa() {
    return L.map('mapa', {
        zoomControl: true,
        fadeAnimation: true,
        zoomAnimation: true
    }).setView([-37.372246, -70.274423], 13);
}

export function crearCapasBase(map) {
    const argenmap = L.tileLayer(
        'https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png',
        {
            attribution:
                '<a href="https://www.ign.gob.ar/" target="_blank">' +
                'Instituto Geográfico Nacional</a> + ' +
                '<a href="https://www.openstreetmap.org/copyright" target="_blank">' +
                'OpenStreetMap</a>',
            minZoom: 3,
            maxZoom: 30
        }
    );

    const satelital = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
            attribution: 'Tiles © Esri',
            minZoom: 3,
            maxZoom: 30
        }
    );

    argenmap.addTo(map);

    return {
        argenmap,
        satelital
    };
}
