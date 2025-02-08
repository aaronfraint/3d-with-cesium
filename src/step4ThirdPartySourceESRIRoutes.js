// this module pulls from the esri/cesium routing tutorial: https://developers.arcgis.com/cesiumjs/route-and-directions/find-a-route-and-directions/

import {
  Cartesian3,
  Math as CesiumMath,
  ArcGisMapService,
  ArcGISTiledElevationTerrainProvider,
  VerticalOrigin,
  HeightReference,
  PinBuilder,
  Color,
  Cartographic,
  ScreenSpaceEventType,
  GeoJsonDataSource,
} from "cesium";

export default async function esriRoutes(viewer) {
  const accessToken = import.meta.env.VITE_ESRI_KEY;
  ArcGisMapService.defaultAccessToken = accessToken;
  const authentication = arcgisRest.ApiKeyManager.fromKey(accessToken);

  let currentStep = "start";
  let startCoords, endCoords;

  const pinBuilder = new PinBuilder();

  const startPoint = viewer.entities.add({
    name: "start",
    position: null,
    billboard: {
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      image: pinBuilder
        .fromText("1", Color.fromCssColorString("#348bdb"), 48)
        .toDataURL(),
    },
  });

  const endPoint = viewer.entities.add({
    name: "end",
    position: null,
    billboard: {
      verticalOrigin: VerticalOrigin.BOTTOM,
      heightReference: HeightReference.CLAMP_TO_GROUND,
      image: pinBuilder
        .fromText("2", Color.fromCssColorString("#348bdb"), 48)
        .toDataURL(),
    },
  });

  function onLeftClick(movement) {
    const pickedPosition = viewer.scene.pickPosition(movement.position);

    const cartographic = Cartographic.fromCartesian(pickedPosition);
    const point = [
      CesiumMath.toDegrees(cartographic.longitude),
      CesiumMath.toDegrees(cartographic.latitude),
    ];

    if (currentStep === "start") {
      startCoords = point;
      startPoint.position = pickedPosition;

      viewer.dataSources.removeAll();
      endPoint.position = null;
      endCoords = null;

      currentStep = "end";
    } else {
      endCoords = point;
      endPoint.position = pickedPosition;
      currentStep = "start";
    }

    if (startCoords && endCoords) {
      getRoute(startCoords, endCoords);
    }
  }

  viewer.screenSpaceEventHandler.setInputAction(
    onLeftClick,
    ScreenSpaceEventType.LEFT_CLICK
  );

  function getRoute(start, end) {
    arcgisRest
      .solveRoute({
        stops: [start, end],
        authentication,
      })

      .then((response) => {
        GeoJsonDataSource.load(response.routes.geoJson, {
          stroke: Color.fromCssColorString("#76fcfc"),
          strokeWidth: 5,
          clampToGround: true,
        }).then((data) => {
          viewer.dataSources.add(data);
        });

        const directionsHTML = response.directions[0].features
          .map((f) => f.attributes.text)
          .join("<br/>");

        const directionsPopup = viewer.entities.add({
          name: "Directions",
          description: directionsHTML,
          position: Cartesian3.fromDegrees(0, 0),
        });

        viewer.selectedEntity = directionsPopup;
      });
  }
}
