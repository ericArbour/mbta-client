import React from "react";

import { Route } from "../types";

type MenuProps = {
  routes: Route[];
  hoveredRouteId: string | null;
  setHoveredRouteId: (string: string) => void;
  clickedRouteId: string | null;
  setClickedRouteId: (clickedRouteId: string | null) => void;
};

export default function Menu({ routes }: MenuProps) {
  return (
    <menu>
      <ul>
        {routes.map((route) => (
          <li
            style={{
              color: `#${route.textColor}`,
              backgroundColor: `#${route.color}`,
            }}
          >
            <h2>{route.longName}</h2>
            <p>{route.type}</p>
            <p>{route.fareClass}</p>
          </li>
        ))}
      </ul>
    </menu>
  );
}
