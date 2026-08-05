// MAPEO/scripts/controles.js

export function agregarControles(map, capas) {
    // Control de capas

    // Añadir attributions a las capas overlay
    capas.capaBarrios.options.attribution = '<a href="https://www.estadisticaneuquen.gob.ar/#/inicio">Dirección Provincial de Estadística y Censos de Neuquén</a>';
    capas.densityLayer.options.attribution = '<a href="https://censo.gob.ar/">Censo Nacional 2022</a>';
    capas.areaEdificadaLayer.options.attribution = '<a href="https://sites.research.google/gr/open-buildings/">Open Buildings</a>';
    capas.urbanoLayer.options.attribution = '<a href="https://https://urbanochosma.wordpress.com/">Urbano Chosma</a>';
    capas.turismoCluster.options.attribution = '<a href="https://chosmalal.gob.ar/">Municipalidad de Chos Malal</a>';

    const controlCapas = L.control.layers(
        {
            'Argenmap': capas.argenmap,
            'Satelital': capas.satelital
        },
        {
            'Barrios': capas.capaBarrios,
            'Densidad': capas.densityLayer,
            'Área Edificada': capas.areaEdificadaLayer,
            'Transporte Urbano': capas.urbanoLayer,
            'Turismo': capas.turismoCluster
        },
        {
            collapsed: true,
            position: 'topright'
        }
    ).addTo(map);

    // Ocultar turismo inicialmente
    map.removeLayer(capas.turismoCluster);

    // Control de visibilidad de turismo para mostrar/ocultar filtros
    // map.on('overlayadd', function(evento) {
    //     if (evento.name === 'Turismo') {
    //         document.getElementById('filtros').style.display = 'block';
    //     }
    // });

    // map.on('overlayremove', function(evento) {
    //     if (evento.name === 'Turismo') {
    //         //document.getElementById('filtros').style.display = 'none';
    //         document.getElementById('selectorRubro').value = 'todos';
    //     }
    // });

    // Crear leyendas con la estructura correcta
    const leyendaBarrios = crearLeyenda('Barrios', getDatosBarrios());
    const leyendaDensidad = crearLeyenda('Densidad de Población', getDatosDensidad());
    const leyendaArea = crearLeyenda('Área Edificada', getDatosAreaEdificada());
    const leyendaTurismo = crearLeyenda('Rubros Turísticos', getDatosTurismo());

    // Agregar leyendas al mapa
    leyendaBarrios.addTo(map);
    leyendaDensidad.addTo(map);
    leyendaArea.addTo(map);
    leyendaTurismo.addTo(map);

    // Ocultar todas las leyendas inicialmente
    map.removeControl(leyendaBarrios);
    map.removeControl(leyendaDensidad);
    map.removeControl(leyendaArea);
    map.removeControl(leyendaTurismo);

    // Mostrar/ocultar leyendas según la capa activa
    map.on('overlayadd', function(evento) {
        switch(evento.name) {
            case 'Barrios':
                map.addControl(leyendaBarrios);
                break;
            case 'Densidad':
                map.addControl(leyendaDensidad);
                break;
            case 'Área Edificada':
                map.addControl(leyendaArea);
                break;
            case 'Turismo':
                map.addControl(leyendaTurismo);
                break;
        }
    });

    map.on('overlayremove', function(evento) {
        switch(evento.name) {
            case 'Barrios':
                map.removeControl(leyendaBarrios);
                break;
            case 'Densidad':
                map.removeControl(leyendaDensidad);
                break;
            case 'Área Edificada':
                map.removeControl(leyendaArea);
                break;
            case 'Turismo':
                map.removeControl(leyendaTurismo);
                break;
        }
    });

    // Escala
    L.control.scale({
        position: 'bottomleft',
        metric: true,
        imperial: false
    }).addTo(map);

    // Norte
    var controlNorte = L.control({ position: 'topleft' });

    controlNorte.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info-norte');
        // Inserta tu imagen de la rosa de los vientos o flecha de norte
        div.innerHTML = '<img src="./MAPEO/img/rosaDeLosVientos.png" style="width: 50px; height: 50px;">';
        return div;
    };

    // Añadirlo al mapa
    controlNorte.addTo(map);

    // Marca de agua
    L.Control.Watermark = L.Control.extend({
        onAdd: function (map) {
            var img = L.DomUtil.create('img');

            img.src = './MAPEO/img/mano.png';
            img.style.width = '200px';

            return img;
        },

        onRemove: function (map) {
            // Nothing to do here
        }
    });

    L.control.watermark = function (opts) {
        return new L.Control.Watermark(opts);
    }

    // Crear watermark y mantener referencia para poder quitar/volver a agregar
    const watermarkControl = L.control.watermark({ position: 'topright' });
    watermarkControl.addTo(map);

    // Ocultar el watermark cuando se abre el control de capas y volver a mostrarlo al cerrarlo
    const capasContainer = controlCapas.getContainer();
    capasContainer.addEventListener('click', function() {
        // esperar al cambio de clase que indica estado expandido
        setTimeout(function() {
            const expanded = capasContainer.classList.contains('leaflet-control-layers-expanded');
            if (expanded) {
                if (watermarkControl._map) {
                    map.removeControl(watermarkControl);
                }
            } else {
                if (!watermarkControl._map) {
                    watermarkControl.addTo(map);
                }
            }
        }, 0);
    });

}

// Función genérica para crear leyendas
function crearLeyenda(titulo, datos) {
    const div = L.DomUtil.create('div', 'info-leyenda');
    
    let html = `<h4>${titulo}</h4>`;
    datos.forEach(item => {
        html += `
            <div>
                <span style="background:${item.color};"></span>
                ${item.label}
            </div>
        `;
    });
    
    div.innerHTML = html;
    
    // Crear el control con la estructura correcta de Leaflet
    const control = L.control({ position: 'bottomright' });
    
    // Método onAdd requerido por Leaflet
    control.onAdd = function() {
        return div;
    };
    
    return control;
}

// Datos para las leyendas
function getDatosBarrios() {
    return [
        { label: 'DON BOSCO', color: '#FF0000' },
        { label: 'CHACRAS NORTE', color: '#0000FF' },
        { label: 'LAS VERTIENTES', color: '#00CC00' },
        { label: 'RUTA 40', color: '#FFA500' },
        { label: 'URIBURU', color: '#800080' },
        { label: 'CORDILLERA DEL VIENTO', color: '#FF69B4' },
        { label: 'TIRO FEDERAL', color: '#00BFFF' },
        { label: 'PARQUE LA HOYA', color: '#32CD32' },
        { label: 'JARDIN', color: '#FFD700' },
        { label: 'AREA CENTRO', color: '#8B4513' },
        { label: 'AGUA ESCONDIDA', color: '#2F4F4F' },
        { label: 'ÁREA DE FRONTERA', color: '#DC143C' },
        { label: 'LAS FLORES', color: '#FFB6C1' },
        { label: 'ALTOS DEL SOL', color: '#F0E68C' },
        { label: 'IV DIVISIÓN', color: '#6A5ACD' },
        { label: 'CANALITO', color: '#00CED1' },
        { label: 'CENTENARIO I', color: '#DAA520' },
        { label: 'CENTENARIO II', color: '#B8860B' },
        { label: 'CHACRA SUR', color: '#CD853F' }
    ];
}

function getDatosDensidad() {
    return [
        { label: '> 85 hab/ha', color: '#800026' },
        { label: '65 - 85 hab/ha', color: '#BD0026' },
        { label: '45 - 65 hab/ha', color: '#E31A1C' },
        { label: '25 - 45 hab/ha', color: '#FC4E2A' },
        { label: '5 - 25 hab/ha', color: '#FD8D3C' },
        { label: '< 5 hab/ha', color: '#FFEDA0' }
    ];
}

function getDatosAreaEdificada() {
    return [
        { label: '> 25%', color: '#800026' },
        { label: '20 - 25%', color: '#BD0026' },
        { label: '15 - 20%', color: '#E31A1C' },
        { label: '10 - 15%', color: '#FC4E2A' },
        { label: '5 - 10%', color: '#FD8D3C' },
        { label: '< 5%', color: '#FFEDA0' }
    ];
}

function getDatosTurismo() {
    return [
        { label: 'Restaurante', color: '#E74C3C' },
        { label: 'Restobar', color: '#E67E22' },
        { label: 'Rotisería', color: '#F1C40F' },
        { label: 'Panadería', color: '#F39C12' },
        { label: 'Cervecería', color: '#8E44AD' },
        { label: 'Café / Bar', color: '#2C3E50' },
        { label: 'Cafetería', color: '#16A085' },
        { label: 'Drugstore', color: '#7F8C8D' },
        { label: 'Comedor', color: '#D35400' },
        { label: 'Pastelería', color: '#FF6B9D' },
        { label: 'Pizzería', color: '#C0392B' },
        { label: 'Heladería', color: '#3498DB' },
        { label: 'Bar', color: '#34495E' },
        { label: 'Parador', color: '#27AE60' },
        { label: 'Parrilla', color: '#A04000' },
        { label: 'Discoteca', color: '#6C3483' },
        { label: 'Otros', color: '#95A5A6' }
    ];
}