import React, { useState } from "react";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import { useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrain, faSubway } from "@fortawesome/free-solid-svg-icons";

import { Vehicle, Route, isNotUndefined, isNull } from "../types";

import styles from "./Map.module.css";

const VEHICLE_FIELDS = gql`
  fragment VehicleFields on Vehicle {
    id
    label
    latitude
    longitude
    bearing
    route {
      id
      color
    }
  }
`;

const ON_VEHICLE_UPDATES = gql`
  subscription OnVehicleUpdate($routeId: String!) {
    vehicles(route: $routeId) {
      ...VehicleFields
    }
  }
  ${VEHICLE_FIELDS}
`;

const GET_VEHICLES = gql`
  query GetVehicles($routeId: String!) {
    vehicles(filter: { routeFilter: [$routeId] }) {
      ...VehicleFields
    }
  }
  ${VEHICLE_FIELDS}
`;

const bostonCoordinates = { latitude: 42.361145, longitude: -71.057083 };
const minLatitude = bostonCoordinates.latitude - 0.2; // Southern bound
const maxLatitude = bostonCoordinates.latitude + 0.2; // Northern bound
const minLongitude = bostonCoordinates.longitude - 0.2; // Western bound
const maxLongitude = bostonCoordinates.longitude + 0.2; // Eastern bound

type MapProps = {
  routes: Route[];
  hoveredRouteId: string | null;
  setHoveredRouteId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRouteId: string | null;
  setSelectedRouteId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedVehicleId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Map({
  routes,
  hoveredRouteId,
  setHoveredRouteId,
  selectedRouteId,
  setSelectedRouteId,
  setSelectedVehicleId,
}: MapProps) {
  const [viewport, setViewport] = useState(() => ({
    ...bostonCoordinates,
    zoom: 11,
    minZoom: 10,
  }));

  const selectedRoute = routes.find((route) => route.id === selectedRouteId);
  const filteredRoutes = selectedRouteId
    ? routes.filter((route) =>
        [selectedRouteId, hoveredRouteId].includes(route.id),
      )
    : routes;

  const shapeIds = filteredRoutes
    .flatMap((route) => route.shapes?.map((shape) => shape.id))
    .filter(isNotUndefined);
  const interactiveLayerIdProp = selectedRouteId
    ? { interactiveLayerIds: shapeIds }
    : {};

  const { data: queryData } = useQuery<{
    vehicles: Vehicle[];
  }>(GET_VEHICLES, {
    variables: { routeId: selectedRouteId },
    skip: !selectedRouteId,
  });

  const { data: subData } = useSubscription<{
    vehicles: Vehicle[];
  }>(ON_VEHICLE_UPDATES, {
    variables: { routeId: selectedRouteId },
    skip: !selectedRouteId,
  });

  const queryVehicles = queryData?.vehicles || [];
  // Filter out previous querys result's vehicles
  const filteredQueryVehicles = queryVehicles.filter(
    (vehicle) => vehicle.route?.id === selectedRouteId,
  );
  const subVehicles = subData?.vehicles || [];
  // Filter out previous subscription result's vehicles
  const filteredSubVehicles = subVehicles.filter(
    (vehicle) => vehicle.route?.id === selectedRouteId,
  );
  const vehicles = filteredSubVehicles.length
    ? filteredSubVehicles
    : filteredQueryVehicles;

  return (
    <section className={styles["map-container"]}>
      <ReactMapGL
        {...viewport}
        {...interactiveLayerIdProp}
        height="100%"
        width="100%"
        mapStyle="mapbox://styles/mapbox/dark-v10"
        interactiveLayerIds={selectedRouteId ? undefined : shapeIds}
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
          if (selectedRouteId) return;

          const clickedShapeSource =
            features &&
            features.find(
              (feature) =>
                typeof feature.source === "string" &&
                feature.source.startsWith("shape-"),
            );
          if (clickedShapeSource)
            setSelectedRouteId(clickedShapeSource.properties.routeId);
        }}
      >
        {vehicles.map((vehicle) =>
          vehicle.longitude && vehicle.latitude ? (
            <Marker
              key={`marker-${vehicle.id}`}
              longitude={vehicle.longitude}
              latitude={vehicle.latitude}
            >
              <FontAwesomeIcon
                icon={selectedRoute?.type === "LIGHT_RAIL" ? faTrain : faSubway}
                style={{
                  color: vehicle.route?.color || "white",
                  transform: `rotate(${180 + (vehicle.bearing || 0)}deg)`,
                }}
                onClick={() => setSelectedVehicleId(vehicle.id)}
              />
            </Marker>
          ) : null,
        )}
        {filteredRoutes.map((route) => {
          const { shapes = [] } = route;
          const isSelected = route.id === selectedRouteId;
          const isHovered = route.id === hoveredRouteId;

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
                    "line-color":
                      isNull(selectedRouteId) || (isHovered && !isSelected)
                        ? `#${route.color}`
                        : "gray",
                    "line-width": 10,
                    "line-opacity": isSelected || isHovered ? 1 : 0.1,
                  }}
                />
              </Source>
            ) : null,
          );
        })}
      </ReactMapGL>
    </section>
  );
}
