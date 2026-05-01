// Initialize map centered on Netherlands
const map = L.map('map').setView([52.1326, 5.2913], 7);

// Base layers
const baseLayers = {
    'OpenStreetMap': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }),
    'Satellite': L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles © Esri',
        maxZoom: 18
    }),
    'Topographic': L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenTopoMap',
        maxZoom: 17
    })
};

// Overlay layers (OGC WMS services and other layers)
const overlayLayers = {
    // Example WMS layer - uncomment and modify with actual WMS services
    // 'Water Management': L.tileLayer.wms('https://example.com/wms', {
    //     layers: 'water_layer',
    //     transparent: true,
    //     attribution: 'Water Authority'
    // })
};

// Add default base layer
baseLayers['OpenStreetMap'].addTo(map);

// Create layer control
const layerControl = L.control.layers(baseLayers, overlayLayers, {
    position: 'topright',
    collapsed: true
}).addTo(map);

// Render layer controls in custom panel
function renderLayerControls() {
    const controlPanel = document.getElementById('layer-controls');
    controlPanel.innerHTML = '<h3>Map Layers</h3>';

    // Base layers
    const baseLayersDiv = document.createElement('div');
    baseLayersDiv.innerHTML = '<h4 style="margin-top: 10px; margin-bottom: 8px; font-size: 0.85em; color: #666; font-weight: 500;">Base Maps</h4>';
    
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
        overlayDiv.innerHTML = '<h4 style="margin-top: 15px; margin-bottom: 8px; font-size: 0.85em; color: #666; font-weight: 500;">Overlays</h4>';
        
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

    // Info text if no overlays
    if (Object.keys(overlayLayers).length === 0) {
        const infoDiv = document.createElement('div');
        infoDiv.style.cssText = 'margin-top: 15px; font-size: 0.85em; color: #999; line-height: 1.4;';
        infoDiv.innerHTML = '<em>No overlay layers configured yet. Add OGC WMS services in js/map.js</em>';
        controlPanel.appendChild(infoDiv);
    }
}

// Initial render
renderLayerControls();

// Add some example markers
const exampleMarker = L.marker([52.3676, 4.9041]).addTo(map)
    .bindPopup('<strong>Amsterdam</strong><br>Example location');

const exampleMarker2 = L.marker([51.9225, 4.4792]).addTo(map)
    .bindPopup('<strong>Rotterdam</strong><br>Example location');

// Add scale control
L.control.scale().addTo(map);

// Optional: Add fullscreen button (requires fullscreen library if desired)
console.log('Map initialized successfully!');
console.log('To add OGC WMS services, modify the overlayLayers object in js/map.js');
