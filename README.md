# rkaart

Diverse kaarten voor Nederland

## Description

rkaart is a simple web-based map viewer for displaying various maps and geographic data for the Netherlands. It uses Leaflet, an open-source JavaScript mapping library, to provide an interactive and user-friendly interface.

**Live Demo:** [https://jonasgeise.github.io/rkaart/](https://jonasgeise.github.io/rkaart/)

## Features

- 🗺️ Interactive map with multiple base layers (OpenStreetMap, Satellite, Topographic)
- 📍 Layer control with checkboxes for toggling overlays
- 🎨 Clean and intuitive UI
- 📱 Responsive design
- 🔓 Open source (MIT License)

## Project Structure

```
rkaart/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Styling
├── js/
│   └── map.js          # Map initialization and controls
└── README.md           # This file
```

## Technologies

- **Leaflet** - Interactive mapping library
- **OpenStreetMap** - Free map tiles
- **HTML5 / CSS3 / JavaScript** - Web technologies

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/JonasGeise/rkaart.git
cd rkaart
```

2. Open `index.html` in your web browser, or use a local server:
```bash
python -m http.server 8000
# Then visit http://localhost:8000
```

### Adding OGC Web Map Services

To add OGC WMS services, modify `js/map.js` and add them to the `overlayLayers` object:

```javascript
const overlayLayers = {
    'Your WMS Layer': L.tileLayer.wms('https://example.com/wms', {
        layers: 'layer_name',
        transparent: true,
        attribution: 'Source'
    })
};
```

## Usage

- Use the layer control panel (top-right) to switch between different map types
- Toggle overlay layers using the checkboxes on the right side
- Click on markers to see more information
- Scroll to zoom in/out, drag to pan around the map

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## References

- [Leaflet Documentation](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)
- [OGC Web Services](https://www.ogc.org/standards/wms)
- [wkaart Project](https://github.com/wkaart/wkaart)
