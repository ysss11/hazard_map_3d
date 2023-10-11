import { TileLayer, BitmapLayer, MVTLayer, GeoJsonLayer } from "deck.gl";
import { _TerrainExtension as TerrainExtension } from '@deck.gl/extensions';

export function renderLayers(props) {
  const { tileURL } = props;

  const building = new MVTLayer({
    interleaved: true,
    data: `https://indigo-lab.github.io/plateau-tokyo23ku-building-mvt-2020/{z}/{x}/{y}.pbf`,
    minZoom: 0,
    maxZoom: 23,
    getFillColor: [255, 255, 255, 255],
    lineWidthMinPixels: 1,
    pickable: true,
    extruded: true,
    autoHighlight: true,
    highlightColor: [255, 0, 0],
    getElevation: (d) => d.properties.measuredHeight,
    wireframe: true,
    lineWidthMinPixels: 1,
    getLineColor: [0, 0, 0],
    material: {
      ambient: 0.1,
      diffuse: 0.9,
      shininess: 32,
      specularColor: [30, 30, 30]
    }
  });

  const baseMap = new TileLayer({
    data: tileURL,
    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    // renderSubLayers: (props) => {
    //   const {
    //     bbox: { west, south, east, north }
    //   } = props.tile;

    //   return new BitmapLayer(props, {
    //     data: null,
    //     image: props.data,
    //     bounds: [west, south, east, north]
    //   });
    // }
  });

const geojsonLayer = new GeoJsonLayer({
    id: 'max-kouzui',
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
  });

  let layers = [baseMap, building, geojsonLayer];

  return layers;
}
