import React, { useState } from "react";
import ReactMapGL from "react-map-gl";

const bostonCoordinates = { latitude: 42.361145, longitude: -71.057083 };
const minLatitude = bostonCoordinates.latitude - 0.2; // Southern bound
const maxLatitude = bostonCoordinates.latitude + 0.2; // Northern bound
const minLongitude = bostonCoordinates.longitude - 0.2; // Western bound
const maxLongitude = bostonCoordinates.longitude + 0.2; // Eastern bound

export default function Map() {
  const [viewport, setViewport] = useState(() => ({
    width: 800,
    height: 800,
    ...bostonCoordinates,
    zoom: 12,
    minZoom: 11,
  }));

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(viewport) => {
        const { latitude, longitude } = viewport;
        const newLatitude =
          latitude > maxLatitude
            ? maxLatitude
            : latitude < minLatitude
            ? minLatitude
            : latitude;
        const newlongitude =
          longitude > maxLongitude
            ? maxLongitude
            : longitude < minLongitude
            ? minLongitude
            : longitude;

        setViewport({
          ...viewport,
          latitude: newLatitude,
          longitude: newlongitude,
        });
      }}
    />
  );
}
