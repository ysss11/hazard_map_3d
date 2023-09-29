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
  zoom: 14,
  pitch: 60,
  bearing: 20
});

map.on('load', () => {
  // 洪水想定区域レイヤーの追加
  map.addLayer({
    'id': 'flood-hazard',
    'type': 'raster',
    'source': {
      'type': 'raster',
      'tiles': ['https://disaportaldata.gsi.go.jp/raster/01_flood_l1_shinsuishin_newlegend_data/{z}/{x}/{y}.png'],
      'tileSize': 256,
    },
    'paint': { 'raster-opacity': 0.6 },
    'layout': { 'visibility': 'visible' },
  });

  // 標高レイヤーを追加(raster形式)
  map.addLayer({
    'id': 'elevation',
    'type': 'hillshade',
    'source': {
      'type': 'raster-dem',
      'url': 'mapbox://mapbox.terrain-rgb'
    },
    'layout': { 'visibility': 'visible' },
  });

  // ラジオコントロールでレイヤーの表示を切り替え
  // const controls = document.querySelectorAll("input[name='layer']");
  // controls.forEach((control) => {
  //   control.addEventListener('change', (e) => {
  //     let value = e.target.value;
  //     if (value === 'flood') {
  //       map.setLayoutProperty('flood-hazard', 'visibility', 'visible');
  //       map.setLauoutProperty('elevation', 'visibility', 'none');
  //     } else if (value === 'elevation') {
  //       map.setLayoutProperty('flood-hazard', 'visibility', 'none');
  //       map.setLayoutProperty('elevation', 'visibility', 'visible');
  //     } else {
  //       map.setLayoutProperty('flood-hazard', 'visibility', 'none');
  //       map.setLayoutProperty('elevation', 'visibility', 'none');
  //     }
  //   });
  // });
});

// 解説
// 洪水想定区域レイヤーの追加: 指定されたURLを使用して、洪水想定区域のレイヤーをrasterタイプとして追加します。

// 標高レイヤーの追加: Mapboxのデフォルトのterrain-rgbデータセットを使用して、標高情報のレイヤーを追加します。これはhillshadeタイプのレイヤーとして追加されます。

// レイヤーの切り替え: ページ上部にラジオボタンを追加して、ユーザーが表示するレイヤーを選択できるようにします。選択に応じて、対応するレイヤーのvisibilityプロパティを変更することでレイヤーの表示を切り替えます。

// 標高データとしては、Mapboxのterrain-rgbデータセットを推奨します。このデータセットは全球的に利用可能で、高解像度の標高データを提供しています。
