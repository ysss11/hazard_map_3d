/*----------------------------------------------------------------*/
/*                        Mapbox Settings                         */
/*----------------------------------------------------------------*/
/**
 * npm
 * $ npm install deck.gl --save
 * $ npm install --save mapbox-gl @mapbox/mapbox-gl-language
 * 
 * test data
 * > https://nlftp.mlit.go.jp/ksj/gml/datalist/KsjTmplt-A31-v2_2.html
 * A31-20-21_8303040032.geojson を index.html と同じディレクトリに配置
 * 
 * reference
 * > https://deck.gl/docs/get-started/using-with-map
 * > https://deck.gl/docs/api-reference/layers
 */
import mapboxgl from 'mapbox-gl';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import {MapboxOverlay, MapboxLayer} from '@deck.gl/mapbox';
import {ScatterplotLayer, GeoJsonLayer, ArcLayer} from '@deck.gl/layers';
// import { Tile3DLayer } from '@deck.gl/geo-layers';
// import { Tiles3DLoader } from '@loaders.gl/3d-tiles';
// import { Vector3 } from 'math.gl';
import { _TerrainExtension as TerrainExtension } from '@deck.gl/extensions';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
// Tokyo Station
const tg_lat = 35.6812;
const tg_lon = 139.7671;

const map = new mapboxgl.Map({
  container: 'map',
  center: [tg_lon, tg_lat],
  style: 'mapbox://styles/mapbox/streets-v11',
  zoom: 14.5,
  pitch: 45,
  antialias: true // Improves the rendering quality
});

// 言語変更設定
const language = new MapboxLanguage();
map.addControl(language);

// TODO z軸がズレる問題 mapbox では向いていなさそう
// const tile3dLayer = new Tile3DLayer({
//   id: 'tile3dlayer',
//   pointSize: 1,
//   // TODO Tokyo 全域
//   data: 'https://assets.cms.plateau.reearth.io/assets/42/6deba1-11df-45c9-88c3-6da484a91b31/13100_tokyo23-ku_2022_3dtiles%20_1_1_op_bldg_13120_nerima-ku_lod1/tileset.json',
//   loader: Tiles3DLoader,
//   onTilesetLoad: tileset => {
//     const { cartographicCenter } = tileset;
//     const [longitude, latitude] = cartographicCenter;
//     console.log(longitude, latitude);
//   },
//   onTileLoad: tileHeader => {
//     tileHeader.content.cartographicOrigin = new Vector3(
//       tileHeader.content.cartographicOrigin.x,
//       tileHeader.content.cartographicOrigin.y,
//       // TODO mapbox だと z軸 がズレてしまう
//       //tileHeader.content.cartographicOrigin.z - 73
//       tileHeader.content.cartographicOrigin.z - 80
//     );
//   },
// });

// const overlay = new MapboxOverlay({
//   interleaved: true,
//   layers: [
//     tile3dLayer,
//   ]
// });

map.on('load', () => {

  const firstLabelLayerId = map.getStyle().layers.find(layer => layer.type === 'symbol').id;

  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            15.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
    }
  }, firstLabelLayerId);

  //map.addControl(overlay);
  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

  // メニューからレイヤーをトグルするためのリスナーを設定
  document.getElementById('flood-hazard-toggle').addEventListener('change', (event) => {
    if (event.target.checked) {
        addFloodLayer();
    } else {
        removeFloodLayer();
    }
  });

  // 一旦未サポート
//   document.getElementById('elevation-toggle').addEventListener('change', (event) => {
//     if (event.target.checked) {
//         addElevationLayer();
//     } else {
//         removeElevationLayer();
//     }
//   });
});

function addFloodLayer() {
  if (!map.getLayer('flood-hazard')) {
      map.addLayer(new MapboxLayer({
        id: 'flood-hazard',
        type: GeoJsonLayer,
        // TODO 一応全国でのデータでも確認できるように
        data: "./A31-20-21_8303040032.geojson",
        pickable: true,
        stroked: false,
        filled: true,
    
        extruded: true, // 3d表示を有効にする
        wireframe: true, //アウトラインを表示する
        getElevation: ({properties}) => {
          // 最大値を返してみる return 〇〇m
          const { A31_205 } = properties;
          if (A31_205 == 1)
              return 0.5
          else if (A31_205 == 2)
              return 3
          else if (A31_205 == 3)
              return 5
          else if (A31_205 == 4)
              return 10
          else if (A31_205 == 5)
              return 20
          else if (A31_205 == 6)
              return 30
        },
        getFillColor: ({ properties }) => {
            // 浸水深ランクで色分け
            const { A31_205 } = properties;
            if (A31_205 == 1)
                return [247, 245, 169]
            else if (A31_205 == 2)
                return [255, 216, 192]
            else if (A31_205 == 3)
                return [255, 183, 183]
            else if (A31_205 == 4)
                return [255, 145, 145]
            else if (A31_205 == 5)
                return [242, 133, 201]
            else if (A31_205 == 6)
                return [220, 122, 220]
        },
        opacity: 0.4,
        extensions: [new TerrainExtension()]
      }), );
  }
}

function removeFloodLayer() {
  if (map.getLayer('flood-hazard')) {
      map.removeLayer('flood-hazard');
  }
}
