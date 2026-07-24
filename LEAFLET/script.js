var mimapa = document.getElementById("mapa");
mimapa = L.map('mapa').setView([-40, -59], 4);
L.tileLayer('https://wms.ign.gob.ar/geoserver/gwc/service/tms/1.0.0/capabaseargenmap@EPSG%3A3857@png/{z}/{x}/{-y}.png', {
    attribution: '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a> | <a href="http://www.ign.gob.ar/AreaServicios/Argenmap/IntroduccionV2" target="_blank">Instituto Geográfico Nacional</a> + <a href="http://www.osm.org/copyright" target="_blank">OpenStreetMap</a>',
    minZoom: 3,
    maxZoom: 30
}).addTo(mimapa);
var marcador = L.marker([-37.38, -70.26]).addTo(mimapa);
marcador.bindPopup("¡Acá estamos!").openPopup();
    