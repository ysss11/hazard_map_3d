/*----------------------------------------------------------------*/
/*                        Mapbox Settings                         */
/*----------------------------------------------------------------*/
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
// Tokyo Station
const tg_lat = 35.6812;
const tg_lon = 139.7671;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [tg_lon, tg_lat],
  zoom: 14.5,
  pitch: 45,
  bearing: -17.6,
  antialias: true
});

map.on('load', () => {

  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  add3DBuildings();

  // メニューからレイヤーをトグルするためのリスナーを設定
  document.getElementById('flood-hazard-toggle').addEventListener('change', (event) => {
    if (event.target.checked) {
        addFloodLayer();
    } else {
        removeFloodLayer();
    }
  });

  document.getElementById('elevation-toggle').addEventListener('change', (event) => {
    if (event.target.checked) {
        addElevationLayer();
    } else {
        removeElevationLayer();
    }
  });
});

// 3D建物データを追加
function add3DBuildings() {
  map.addLayer({
      'id': '3d-buildings',
      'source': 'composite',
      'source-layer': 'building',
      'filter': ['==', 'extrude', 'true'],
      'type': 'fill-extrusion',
      'minzoom': 14,
      'paint': {
          'fill-extrusion-color': '#aaa',
          'fill-extrusion-height': ['get', 'height'],
          'fill-extrusion-base': ['get', 'min_height'],
          'fill-extrusion-opacity': .6
      }
  });
}

// layers.flood-hazard-3d: layer "flood-hazard-3d" requires a vector source
// layers.flood-hazard-3d.paint.fill-extrusion-height[1][0]: Unknown expression "raster-data". If you wanted a literal array, use ["literal", [...]].
// TODO ysugiyam ラスター形式では実現できないため
// function addFloodLayer() {
//   if (!map.getLayer('flood-hazard-3d')) {
//       map.addLayer({
//           'id': 'flood-hazard-3d',
//           'type': 'fill-extrusion',
//           'source': {
//               'type': 'raster',
//               'tiles': ['https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_data/{z}/{x}/{y}.png'],
//               'tileSize': 256
//           },
//           'layout': {},
//           'paint': {
//               'fill-extrusion-color': '#088',
//               'fill-extrusion-height': ['*', ['raster-data', ['get', 'source'], ['literal', [0, 0]]], 10],
//               'fill-extrusion-opacity': 0.6
//           }
//       });
//   }
// }

// function removeFloodLayer() {
//   if (map.getLayer('flood-hazard-3d')) {
//       map.removeLayer('flood-hazard-3d');
//   }
// }

function addFloodLayer() {
  if (!map.getLayer('flood-hazard')) {
      map.addLayer({
          'id': 'flood-hazard',
          'type': 'raster',
          'source': {
              'type': 'raster',
              'tiles': ['https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'],
              'tileSize': 256
          },
          'paint': { 'raster-opacity': 0.6 },
      });
  }
}

function removeFloodLayer() {
  if (map.getLayer('flood-hazard')) {
      map.removeLayer('flood-hazard');
  }
}

function addElevationLayer() {

  if (!map.getSource('mapbox-dem')) { // Sourceの存在を確認
    map.addSource('mapbox-dem', {
        'type': 'raster-dem',
        'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
        'tileSize': 512,
        'maxzoom': 14
    });
  }

  if (!map.getLayer('hillshading')) {
      map.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });
      map.addLayer({
          'id': 'hillshading',
          'source': 'mapbox-dem',
          'type': 'hillshade'
      }, '3d-buildings');
  }
}

function removeElevationLayer() {
  if (map.getLayer('hillshading')) {
      map.removeLayer('hillshading');
      map.setTerrain(null);
  }
}
