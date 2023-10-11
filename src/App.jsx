
import React from 'react';
import { MapboxOverlay } from '@deck.gl/mapbox';
import Map, { useControl } from 'react-map-gl';

// import { Tile3DLayer } from '@deck.gl/geo-layers';
// import { Tiles3DLoader } from '@loaders.gl/3d-tiles';
// import { GeoJsonLayer } from '@deck.gl/layers';
// import { _TerrainExtension as TerrainExtension } from '@deck.gl/extensions';
// import { Vector3 } from 'math.gl';
// Mapbox GL JS
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';
import { renderLayers } from "./RenderLayers";

// const tile3dLayer = new Tile3DLayer({
//   id: 'tile3dlayer',
//   pointSize: 1,
//   //data: 'https://s3-ap-northeast-1.amazonaws.com/3dimension.jp/13000_tokyo-egm96/13101_chiyoda-ku_notexture/tileset.json',
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
//       tileHeader.content.cartographicOrigin.z - 40
//     );
//   },
// });

// const geojsonLayer = new GeoJsonLayer({
//   id: 'max-kouzui',
//   data: "./A31-20-21_8303040032.geojson",
//   pickable: true,
//   stroked: false,
//   filled: true,
  
//   extruded: true, // 3d表示を有効にする
//   wireframe: true, //アウトラインを表示する
//   getElevation: (d, { index }) => {
//     const i = index + 1; //indexを1からスタートさせる
//     //return 500 * i; //500m * indexを高さに指定
//     return 0.005 * i;
//   },
//   getFillColor: ({ properties }) => {
//       // 浸水深ランクで色分け
//       const { A31_205 } = properties;
//       if (A31_205 == 1)
//           return [247, 245, 169]
//       else if (A31_205 == 2)
//           return [255, 216, 192]
//       else if (A31_205 == 3)
//           return [255, 183, 183]
//       else if (A31_205 == 4)
//           return [255, 145, 145]
//       else if (A31_205 == 5)
//           return [242, 133, 201]
//       else if (A31_205 == 6)
//           return [220, 122, 220]
//   },
//   opacity: 0.3,
//   extensions: [new TerrainExtension()]
// });


const DeckGLOverlay = (props) => {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
};

// Tokyo Station
const tg_lat = 35.6812;
const tg_lon = 139.7671;

// Mapboxアクセストークン
const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
// 初期ビューポートの設定
const INITIAL_VIEW_STATE = {
    latitude: tg_lat,
    longitude: tg_lon,
    zoom: 14.5,
    pitch: 45,
    bearing: -17.6,
    antialias: true
};

const App = () => {

    return (
        <div className="App">
            <Map
                initialViewState={INITIAL_VIEW_STATE}
                mapStyle="mapbox://styles/mapbox/streets-v11"
                style={{ width: '100vw', height: '100vh' }}
                mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
            >
                <DeckGLOverlay layers={renderLayers(
                  {
                    tileURL: "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  })} />
            </Map>
        </div>
    );
};

export default App;
