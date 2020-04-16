import React, { useState } from "react";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import { useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSubway } from "@fortawesome/free-solid-svg-icons";

import { Vehicle, Route, isNotUndefined } from "../types";

const GET_VEHICLE_UPDATES = gql`
  subscription onVehicleUpdate {
    vehicles(route: "Red") {
      id
      label
      latitude
      longitude
      bearing
    }
  }
`;

const GET_VEHICLES = gql`
  query GetVehicles {
    vehicles(filter: { routeFilter: ["Red"] }) {
      id
      label
      latitude
      longitude
      bearing
    }
  }
`;

const GET_ROUTES = gql`
  query GetRoutes {
    routes(filter: { typeFilter: [SUBWAY, LIGHT_RAIL] }) {
      id
      type
      color
      textColor
      shortName
      longName
      shapes {
        id
        priority
        polyline
        name
      }
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
    zoom: 11,
    minZoom: 10,
  }));
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [clickedRouteId, setClickedRouteId] = useState<string | null>(null);

  const { data: routeData } = useQuery<{
    routes: Route[];
  }>(GET_ROUTES);
  // const { data: queryData } = useQuery<{
  //   vehicles: Vehicle[];
  // }>(GET_VEHICLES);
  // const { data: subData } = useSubscription<{
  //   vehicles: Vehicle[];
  // }>(GET_VEHICLE_UPDATES);
  // const queryVehicles = queryData?.vehicles || [];
  // const subVehicles = subData?.vehicles || [];
  // const vehicles = subVehicles.length ? subVehicles : queryVehicles;
  const routes = routeData?.routes || [];
  const shapeIds = routes
    .flatMap((route) => route.shapes?.map((shape) => shape.id))
    .filter(isNotUndefined);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      interactiveLayerIds={shapeIds}
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
      onHover={({ features }) => {
        const hoveredRoute =
          features &&
          features.find(
            (feature) =>
              typeof feature.source === "string" &&
              feature.source.startsWith("shape-"),
          );
        if (hoveredRoute) {
          setHoveredRouteId(hoveredRoute.properties.routeId);
        } else {
          setHoveredRouteId(null);
        }
      }}
      onClick={({ features }) => {
        const clickedRoute =
          features &&
          features.find(
            (feature) =>
              typeof feature.source === "string" &&
              feature.source.startsWith("shape-"),
          );
        if (
          !clickedRoute ||
          clickedRoute.properties.routeId === clickedRouteId
        ) {
          setClickedRouteId(null);
        } else {
          setClickedRouteId(clickedRoute.properties.routeId);
        }
      }}
    >
      {/* {vehicles.map((vehicle) =>
        vehicle.longitude && vehicle.latitude ? (
          <Marker
            key={`marker-${vehicle.id}`}
            longitude={vehicle.longitude}
            latitude={vehicle.latitude}
          >
            <FontAwesomeIcon
              icon={faSubway}
              style={{
                color: "red",
                transform: `rotate(${180 + (vehicle.bearing || 0)}deg)`,
              }}
            />
          </Marker>
        ) : null,
      )} */}
      {routes.map((route) => {
        const { shapes = [] } = route;

        return shapes.map((shape) =>
          shape.polyline ? (
            <Source
              key={shape.id}
              id={`shape-${shape.id}`}
              type="geojson"
              data={{
                type: "Feature",
                properties: {
                  routeId: route.id,
                },
                geometry: {
                  type: "LineString",
                  coordinates: shape.polyline,
                },
              }}
            >
              <Layer
                id={shape.id}
                type="line"
                layout={{
                  "line-join": "round",
                  "line-cap": "round",
                }}
                paint={{
                  "line-color": `#${route.color}` || "gray",
                  "line-width": 10,
                  "line-opacity": [hoveredRouteId, clickedRouteId].includes(
                    route.id,
                  )
                    ? 1
                    : 0.1,
                }}
              />
            </Source>
          ) : null,
        );
      })}
    </ReactMapGL>
  );
}
