import React, { useState } from "react";
import ReactMapGL from "react-map-gl";
import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";

const GET_VEHICLE_UPDATES = gql`
  subscription onVehicleUpdate {
    vehicles(route: "Red") {
      id
    }
  }
`;

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
  const { data, loading, error } = useSubscription(GET_VEHICLE_UPDATES);
  console.log(data, loading, error);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v10"
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
