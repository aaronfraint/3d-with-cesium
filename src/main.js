window.CESIUM_BASE_URL = "/cesiumStatic";

import {
  Cartesian3,
  Math as CesiumMath,
  Terrain,
  Viewer,
  Ion,
  Cesium3DTileset,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./App.css";

import dataFromIonTiles from "./step3IonHostedData";
import esriRoutes from "./step4ThirdPartySourceESRIRoutes";
import demoShowcase from "./step5DemoShowcase";

Ion.defaultAccessToken = import.meta.env.VITE_ION_TOKEN;

const viewer = new Viewer("cesiumContainer", {
  terrain: Terrain.fromWorldTerrain(),
});

// Fly the camera to the flatiron building
viewer.camera.flyTo({
  destination: Cartesian3.fromDegrees(-73.99, 40.73, 300),
  orientation: {
    heading: CesiumMath.toRadians(0),
    pitch: CesiumMath.toRadians(0),
  },
});

// Load Google 3d buildings
const google3dtiles = await Cesium3DTileset.fromIonAssetId(2275207);
console.log(google3dtiles);
viewer.scene.primitives.add(google3dtiles);
google3dtiles.show = false;

// wire up the additional functionality
await dataFromIonTiles(viewer);
await esriRoutes(viewer);
demoShowcase(google3dtiles);
