import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import Menu from "../Menu/Menu";
import Map from "../Map/Map";
// import RoutePanel from "../RoutePanel/RoutePanel";
import { Route } from "../types";

import "./Main.module.css";

const GET_ROUTES = gql`
  query GetRoutes {
    routes(filter: { typeFilter: [SUBWAY, LIGHT_RAIL, FERRY] }) {
      id
      type
      color
      textColor
      longName
      fareClass
      shapes {
        id
        priority
        polyline
        name
      }
    }
  }
`;

export default function Main() {
  const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(
    null,
  );
  console.log(selectedVehicleId);
  const { data: routeData } = useQuery<{
    routes: Route[];
  }>(GET_ROUTES);
  const routes = routeData?.routes || [];

  return (
    <main>
      <Menu
        routes={routes}
        hoveredRouteId={hoveredRouteId}
        setHoveredRouteId={setHoveredRouteId}
        selectedRouteId={selectedRouteId}
        setSelectedRouteId={setSelectedRouteId}
      />
      <Map
        routes={routes}
        hoveredRouteId={hoveredRouteId}
        setHoveredRouteId={setHoveredRouteId}
        selectedRouteId={selectedRouteId}
        setSelectedRouteId={setSelectedRouteId}
        setSelectedVehicleId={setSelectedVehicleId}
      />
      {/* <RoutePanel selectedRoute={selectedRoute} /> */}
    </main>
  );
}
