// Initialize map centered on Netherlands
const map = L.map('map').setView([52.1326, 5.2913], 7);

// Base layers using PDOK (Publieke Diensten Op de Kaart) - Dutch national map services
const baseLayers = {
    'BRT Water': L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/water/EPSG:28992/{z}/{x}/{y}.png', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 19
    }),
    'BRT Grijs': L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/grijs/EPSG:28992/{z}/{x}/{y}.png', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 19
    }),
    'Luchtfoto': L.tileLayer('https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_orthoHR/EPSG:28992/{z}/{x}/{y}.jpeg', {
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>',
        maxZoom: 19
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
        tileSize: 2048,
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),
    
    'Waterschappen': L.tileLayer.wms('https://service.pdok.nl/hwh/waterschappen-waterschapsgrenzen-imso/wms/v2_0', {
        layers: 'waterschap',
        transparent: true,
        opacity: 0.65,
        format: 'image/png'
    }),
    
    // Water-related layers
    'Natura2000': L.tileLayer.wms('https://service.pdok.nl/rvo/natura2000/wms/v1_0', {
        layers: 'natura2000',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        attribution: 'RVO'
    }),
    
    'Natuurnetwerk Nederland': L.tileLayer.wms('https://service.pdok.nl/provincies/natuurnetwerk-nederland/wms/v1_0', {
        layers: 'PS.ProtectedSite',
        transparent: true,
        opacity: 0.5,
        format: 'image/png'
    }),
    
    'Wetlands': L.tileLayer.wms('https://service.pdok.nl/rvo/wetlands/wms/v1_0', {
        layers: 'wetlands',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        attribution: 'RVO'
    }),
    
    // Land use and soil
    'LGN (Landgebruik)': L.tileLayer.wms('https://service.pdok.nl/wur/landelijk-grondgebruik-nederland/wms/v1_0', {
        layers: 'lgn-actueel',
        transparent: true,
        opacity: 0.5,
        format: 'image/png'
    }),
    
    'Bodemkaart': L.tileLayer.wms('https://service.pdok.nl/bzk/bro-bodemkaart/wms/v1_0', {
        layers: 'soilarea',
        transparent: true,
        opacity: 0.5,
        format: 'image/png'
    }),
    
    'Geomorfologie': L.tileLayer.wms('https://service.pdok.nl/bzk/bro-geomorfologischekaart/wms/v2_0', {
        layers: 'geomorphological_area',
        transparent: true,
        opacity: 0.6,
        format: 'image/png'
    }),
    
    // Elevation
    'Hoogte (AHN)': L.tileLayer.wms('https://service.pdok.nl/rws/ahn/wms/v1_0', {
        layers: 'dtm_05m',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),
    
    // Water infrastructure
    'Keringen primair': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/wvp/ows/wms', {
        layers: 'nbpw:dijktrajecten',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        version: '1.3.0'
    }),
    
    'Keringen regionaal': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/regionale_keringen/ows', {
        layers: 'regionale_keringen_rws',
        transparent: true,
        opacity: 0.7,
        format: 'image/png',
        service: 'WMS',
        version: '1.3.0'
    }),
    
    'Waterbergingsgebieden': L.tileLayer.wms('https://service.pdok.nl/hwh/zoneringenimwa/wms/v1_0', {
        layers: 'Waterbergingsgebied',
        transparent: true,
        format: 'image/png'
    }),
    
    'RWS Kwantiteit': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/omgevingswet/ows', {
        layers: 'waterkwantiteitsbeheer_rijk',
        transparent: true,
        opacity: 0.75,
        tileSize: 2048,
        format: 'image/png'
    }),
    
    'RWS Districten': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/regiogebieden_rijkswaterstaat/ows', {
        layers: 'rijkswaterstaat_districten_nat',
        transparent: true,
        opacity: 0.6,
        format: 'image/png',
        service: 'WMS',
        version: '1.3.0'
    }),
    
    // Water quality and management
    'Drinkwaterbedrijven': L.tileLayer.wms('https://data.rivm.nl/geo/ank/wms', {
        layers: 'rivm_r81_rg_voorzieningsgebiedendrinkwaterbedrijven',
        transparent: true,
        opacity: 0.4,
        format: 'image/png'
    }),
    
    'RWZI (waterzuiveringsinrichtingen)': L.tileLayer.wms('https://service.pdok.nl/rioned/wswaterketen/wms/v1_0', {
        layers: 'waterschap_rwzi',
        transparent: true,
        format: 'image/png'
    }),
    
    // Navigation
    'Bevaarbaarheid': L.tileLayer.wms('https://service.pdok.nl/rws/vnds/wms/v2_0', {
        layers: 'l_navigability',
        transparent: true,
        format: 'image/png'
    }),
    
    'Vaarwegenkaart 2013': L.tileLayer.wms('https://geo.rijkswaterstaat.nl/services/ogc/gdr/vaarwegenkaart/ows?SERVICE=WMS', {
        layers: 'vaarwegenkaart',
        transparent: true,
        format: 'image/png',
        version: '1.3.0'
    }),

    // Labels and reference layers (from wkaart)
    'Labels - Polders': L.tileLayer.wms('https://service.pdok.nl/brt/top10nl/wms/v1_0', {
        layers: 'geografischgebiedlabelnl',
        transparent: true,
        opacity: 0.9,
        format: 'image/png',
        minZoom: 9,
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),

    'Labels - Hoogtepunten': L.tileLayer.wms('https://service.pdok.nl/brt/top10nl/wms/v1_0', {
        layers: 'hoogte',
        transparent: true,
        opacity: 0.8,
        format: 'image/png',
        minZoom: 9,
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
    }),

    'Gemalen (Waterschappen)': L.tileLayer.wms('https://service.pdok.nl/hwh/kunstwerkenimwa/wms/v1_0', {
        layers: 'gemaal',
        transparent: true,
        format: 'image/png',
        minZoom: 9,
        attribution: 'Kaartgegevens © <a href="https://www.kadaster.nl">Kadaster</a>'
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
console.log('Map initialized successfully!');
console.log('Loaded ' + Object.keys(overlayLayers).length + ' water management layers from PDOK and RWS');
