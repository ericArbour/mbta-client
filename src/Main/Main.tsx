import React, { useState } from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import Menu from "../Menu/Menu";
import Map from "../Map/Map";
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
  const [clickedRouteId, setClickedRouteId] = useState<string | null>(null);

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
        clickedRouteId={clickedRouteId}
        setClickedRouteId={setClickedRouteId}
      />
      <Map
        routes={routes}
        hoveredRouteId={hoveredRouteId}
        setHoveredRouteId={setHoveredRouteId}
        clickedRouteId={clickedRouteId}
        setClickedRouteId={setClickedRouteId}
      />
    </main>
  );
}
