// Initialize map using Dutch RD (Rijksdriehoeks) coordinate system EPSG:28992
// Define the RD coordinate system for Leaflet
const bounds = L.bounds([-285401.92, 22598.08], [595401.92, 903401.92]);
const fullBounds = L.bounds(bounds);
const maxBounds = fullBounds.pad(0.1);

const rdCRS = L.extend({}, L.CRS.EPSG4326, {
    code: 'EPSG:28992',
    wrapLng: false,
    bounds: bounds,
    transformation: new L.Transformation(1, 285401.92, -1, 903401.92),
    scale: (zoom) => {
        return 256 * Math.pow(2, zoom) / (903401.92 - 22598.08);
    },
    project: (latlng) => {
        // Simplified RD projection - using direct coordinate mapping
        // For accurate results, you may want to use a proper proj4 library
        return L.point(latlng.lng, latlng.lat);
    },
    unproject: (point) => {
        return L.latLng(point.y, point.x);
    }
});

// Initialize map centered on Netherlands with RD (Rijksdriehoeks) coordinate system
const map = L.map('map', {
    crs: rdCRS,
    continuousWorld: true,
    worldCopyJump: false
}).setView([52.1326, 5.2913], 7);

// Base layers using PDOK (Publieke Diensten Op de Kaart) - Dutch national map services
// Using EPSG:28992 endpoints for RD projection
const baseLayers = {
    'BRT Water': L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{z}/{x}/{y}.png', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 19,
        tms: false
    }),
    'BRT Grijs': L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/{z}/{x}/{y}.png', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 19,
        tms: false
    }),
    'Luchtfoto': L.tileLayer('https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.jpeg', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 19,
        tms: false
    })
};

// Overlay layers - Water Management Maps
const overlayLayers = {
    // Administrative boundaries
    'Provincies': L.tileLayer.wms('https://service.pdok.nl/cbs/gebiedsindelingen/2023/wms/v1_0', {
        layers: 'provincie_gegeneraliseerd',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        crs: rdCRS,
        tileSize: 512,
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),
    
    'Waterschappen': L.tileLayer.wms('https://service.pdok.nl/hwh/waterschappen-waterschapsgrenzen-imso/wms/v2_0', {
        layers: 'waterschap',
        transparent: true,
        opacity: 0.65,
        format: 'image/png',
        crs: rdCRS,
        tileSize: 512
    }),
    
    // Water-related layers
    'Natura2000': L.tileLayer.wms('https://service.pdok.nl/rvo/natura2000/wms/v1_0', {
        layers: 'natura2000',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        crs: rdCRS,
        attribution: 'RVO'
    }),
    
    'Natuurnetwerk Nederland': L.tileLayer.wms('https://service.pdok.nl/provincies/natuurnetwerk-nederland/wms/v1_0', {
        layers: 'PS.ProtectedSite',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'Wetlands': L.tileLayer.wms('https://service.pdok.nl/rvo/wetlands/wms/v1_0', {
        layers: 'wetlands',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        crs: rdCRS,
        attribution: 'RVO'
    }),
    
    // Land use and soil
    'LGN (Landgebruik)': L.tileLayer.wms('https://service.pdok.nl/wur/landelijk-grondgebruik-nederland/wms/v1_0', {
        layers: 'lgn-actueel',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'Bodemkaart': L.tileLayer.wms('https://service.pdok.nl/bzk/bro-bodemkaart/wms/v1_0', {
        layers: 'soilarea',
        transparent: true,
        opacity: 0.5,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'Geomorfologie': L.tileLayer.wms('https://service.pdok.nl/bzk/bro-geomorfologischekaart/wms/v2_0', {
        layers: 'geomorphological_area',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        crs: rdCRS
    }),
    
    // Elevation
    'Hoogte (AHN)': L.tileLayer.wms('https://service.pdok.nl/rws/ahn/wms/v1_0', {
        layers: 'dtm_05m',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        crs: rdCRS,
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),
    
    // Water infrastructure
    'Keringen primair': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/wvp/ows/wms', {
        layers: 'nbpw:dijktrajecten',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        version: '1.3.0',
        crs: rdCRS
    }),
    
    'Keringen regionaal': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/regionale_keringen/ows', {
        layers: 'regionale_keringen_rws',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        service: 'WMS',
        version: '1.3.0',
        crs: rdCRS
    }),
    
    'Waterbergingsgebieden': L.tileLayer.wms('https://service.pdok.nl/hwh/zoneringenimwa/wms/v1_0', {
        layers: 'Waterbergingsgebied',
        transparent: true,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'RWS Kwantiteit': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/omgevingswet/ows', {
        layers: 'waterkwantiteitsbeheer_rijk',
        transparent: true,
        opacity: 0.75,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'RWS Districten': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/regiogebieden_rijkswaterstaat/ows', {
        layers: 'rijkswaterstaat_districten_nat',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        service: 'WMS',
        version: '1.3.0',
        crs: rdCRS
    }),
    
    // Water quality and management
    'Drinkwaterbedrijven': L.tileLayer.wms('https://data.rivm.nl/geo/ank/wms', {
        layers: 'rivm_r81_rg_voorzieningsgebiedendrinkwaterbedrijven',
        transparent: true,
        opacity: 0.4,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'RWZI (waterzuiveringsinrichtingen)': L.tileLayer.wms('https://service.pdok.nl/rioned/wswaterketen/wms/v1_0', {
        layers: 'waterschap_rwzi',
        transparent: true,
        format: 'image/png',
        crs: rdCRS
    }),
    
    // Navigation
    'Bevaarbaarheid': L.tileLayer.wms('https://service.pdok.nl/rws/vnds/wms/v2_0', {
        layers: 'l_navigability',
        transparent: true,
        format: 'image/png',
        crs: rdCRS
    }),
    
    'Vaarwegenkaart 2013': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/vaarwegenkaart/ows?SERVICE=WMS', {
        layers: 'vaarwegenkaart',
        transparent: true,
        format: 'image/png',
        version: '1.3.0',
        crs: rdCRS
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
console.log('Map initialized successfully with RD (EPSG:28992) projection!');
console.log('Loaded ' + Object.keys(overlayLayers).length + ' water management layers from PDOK and RWS');
