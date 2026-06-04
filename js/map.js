// Define RD (EPSG:28992) and WGS84 projections using Proj4
// RD New (EPSG:28992) - Rijksdriehoeks coordinate system for Netherlands
proj4.defs('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs +towgs84=565.417,50.3319,465.552,-0.398957,0.343008,-1.8774,4.0725');

// Initialize map with RD projection using Proj4Leaflet
const map = L.map('map', {
    crs: L.CRS.proj4js('EPSG:28992', proj4.defs('EPSG:28992'), {
        resolutions: [860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105, 0.0525],
        bounds: L.bounds([-285401.92, 22598.08], [595401.92, 903401.92]),
        origin: [-285401.92, 903401.92]
    }),
    continuousWorld: false,
    worldCopyJump: false
});

// Set initial view - center on Netherlands in RD coordinates
// Approximate center: (155000, 463000) in RD = Amsterdam area
map.setView([52.1326, 5.2913], 8);

// Base layers using PDOK (Publieke Diensten Op de Kaart) - Dutch national map services
// Using EPSG:28992 (RD New) endpoints for proper projection
const baseLayers = {
    'BRT Water': L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{z}/{x}/{y}.png', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 14,
        minZoom: 0,
        tms: false,
        bounds: L.bounds([-285401.92, 22598.08], [595401.92, 903401.92])
    }),
    'BRT Grijs': L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/{z}/{x}/{y}.png', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 14,
        minZoom: 0,
        tms: false,
        bounds: L.bounds([-285401.92, 22598.08], [595401.92, 903401.92])
    }),
    'Luchtfoto': L.tileLayer('https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.jpeg', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 14,
        minZoom: 0,
        tms: false,
        bounds: L.bounds([-285401.92, 22598.08], [595401.92, 903401.92])
    })
};

// Overlay layers - Water Management Maps using WMS
const overlayLayers = {
    // Administrative boundaries
    'Provincies': L.tileLayer.wms('https://service.pdok.nl/cbs/gebiedsindelingen/2023/wms/v1_0', {
        layers: 'provincie_gegeneraliseerd',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        version: '1.1.1',
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),
    
    'Waterschappen': L.tileLayer.wms('https://service.pdok.nl/hwh/waterschappen-waterschapsgrenzen-imso/wms/v2_0', {
        layers: 'waterschap',
        transparent: true,
        opacity: 0.65,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    // Water-related layers
    'Natura2000': L.tileLayer.wms('https://service.pdok.nl/rvo/natura2000/wms/v1_0', {
        layers: 'natura2000',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        version: '1.1.1',
        attribution: 'RVO'
    }),
    
    'Natuurnetwerk Nederland': L.tileLayer.wms('https://service.pdok.nl/provincies/natuurnetwerk-nederland/wms/v1_0', {
        layers: 'PS.ProtectedSite',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'Wetlands': L.tileLayer.wms('https://service.pdok.nl/rvo/wetlands/wms/v1_0', {
        layers: 'wetlands',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        version: '1.1.1',
        attribution: 'RVO'
    }),
    
    // Land use and soil
    'LGN (Landgebruik)': L.tileLayer.wms('https://service.pdok.nl/wur/landelijk-grondgebruik-nederland/wms/v1_0', {
        layers: 'lgn-actueel',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'Bodemkaart': L.tileLayer.wms('https://service.pdok.nl/bzk/bro-bodemkaart/wms/v1_0', {
        layers: 'soilarea',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'Geomorfologie': L.tileLayer.wms('https://service.pdok.nl/bzk/bro-geomorfologischekaart/wms/v2_0', {
        layers: 'geomorphological_area',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    // Elevation
    'Hoogte (AHN)': L.tileLayer.wms('https://service.pdok.nl/rws/ahn/wms/v1_0', {
        layers: 'dtm_05m',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        version: '1.1.1',
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),
    
    // Water infrastructure
    'Keringen primair': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/wvp/ows/wms', {
        layers: 'nbpw:dijktrajecten',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'Keringen regionaal': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/regionale_keringen/ows', {
        layers: 'regionale_keringen_rws',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'Waterbergingsgebieden': L.tileLayer.wms('https://service.pdok.nl/hwh/zoneringenimwa/wms/v1_0', {
        layers: 'Waterbergingsgebied',
        transparent: true,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'RWS Kwantiteit': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/omgevingswet/ows', {
        layers: 'waterkwantiteitsbeheer_rijk',
        transparent: true,
        opacity: 0.75,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'RWS Districten': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/regiogebieden_rijkswaterstaat/ows', {
        layers: 'rijkswaterstaat_districten_nat',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    // Water quality and management
    'Drinkwaterbedrijven': L.tileLayer.wms('https://data.rivm.nl/geo/ank/wms', {
        layers: 'rivm_r81_rg_voorzieningsgebiedendrinkwaterbedrijven',
        transparent: true,
        opacity: 0.4,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'RWZI (waterzuiveringsinrichtingen)': L.tileLayer.wms('https://service.pdok.nl/rioned/wswaterketen/wms/v1_0', {
        layers: 'waterschap_rwzi',
        transparent: true,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    // Navigation
    'Bevaarbaarheid': L.tileLayer.wms('https://service.pdok.nl/rws/vnds/wms/v2_0', {
        layers: 'l_navigability',
        transparent: true,
        format: 'image/png',
        version: '1.1.1'
    }),
    
    'Vaarwegenkaart 2013': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/vaarwegenkaart/ows', {
        layers: 'vaarwegenkaart',
        transparent: true,
        format: 'image/png',
        version: '1.1.1'
    })
};

// Add default base layer
baseLayers['BRT Water'].addTo(map);

// Create layer control
const layerControl = L.control.layers(baseLayers, overlayLayers, {
    position: 'topright',
    collapsed: true
}).addTo(map);

// Render custom layer controls panel
function renderLayerControls() {
    const controlPanel = document.getElementById('layer-controls');
    controlPanel.innerHTML = '<h3>Kaartlagen</h3>';

    // Base layers
    const baseLayersDiv = document.createElement('div');
    baseLayersDiv.innerHTML = '<h4 style="margin-top: 10px; margin-bottom: 8px; font-size: 0.85em; color: #666; font-weight: 500;">Achtergrondkaarten</h4>';
    
    Object.keys(baseLayers).forEach((name, index) => {
        const label = document.createElement('label');
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'basemap';
        input.value = name;
        if (index === 0) input.checked = true;
        
        input.addEventListener('change', function() {
            Object.keys(baseLayers).forEach(layerName => {
                if (map.hasLayer(baseLayers[layerName])) {
                    map.removeLayer(baseLayers[layerName]);
                }
            });
            map.addLayer(baseLayers[name]);
        });
        
        label.appendChild(input);
        label.appendChild(document.createTextNode(name));
        baseLayersDiv.appendChild(label);
    });
    controlPanel.appendChild(baseLayersDiv);

    // Overlay layers
    if (Object.keys(overlayLayers).length > 0) {
        const overlayDiv = document.createElement('div');
        overlayDiv.innerHTML = '<h4 style="margin-top: 15px; margin-bottom: 8px; font-size: 0.85em; color: #666; font-weight: 500;">Themalagen</h4>';
        
        Object.keys(overlayLayers).forEach(name => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = name;
            
            input.addEventListener('change', function() {
                if (this.checked) {
                    map.addLayer(overlayLayers[name]);
                } else {
                    map.removeLayer(overlayLayers[name]);
                }
            });
            
            label.appendChild(input);
            label.appendChild(document.createTextNode(name));
            overlayDiv.appendChild(label);
        });
        controlPanel.appendChild(overlayDiv);
    }
}

// Initial render
renderLayerControls();

// Add scale control
L.control.scale({ imperial: false }).addTo(map);

// Console messages for debugging
console.log('Map initialized successfully with RD New (EPSG:28992) projection!');
console.log('Loaded ' + Object.keys(overlayLayers).length + ' Dutch water management layers from PDOK and RWS');
