# hazard_map

Mapboxを使って、洪水ハザードマップ(洪水浸水想定区域(想定最大規模))、標高を3Dマップに表示

## 事前準備

- Mabbox のアクセストークンを取得しておくこと
- .env_template をコピーし .env に変更しそこに上記で取得したアクセストークンを記載してください。 


## 実施

```shell
$ npm run dev
```

http://localhost:5173/


## 参考

> 洪水浸水想定区域（想定最大規模） https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html#l2shinsuishin  
> mapbox gl js https://github.com/mapbox/mapbox-gl-js  
