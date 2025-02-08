import { Cesium3DTileset } from "cesium";

export default async function dataFromIonTiles(viewer) {
  // flatiron model: https://ion.cesium.com/assets/3061945?page=1&sortBy=DATE_ADDED&sortOrder=DESC
  viewer.scene.primitives.add(await Cesium3DTileset.fromIonAssetId(3061945));
}
