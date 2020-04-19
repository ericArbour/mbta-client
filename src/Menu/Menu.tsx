import React from "react";

import { Route, isNullish } from "../types";

import styles from "./Menu.module.css";

type MenuProps = {
  routes: Route[];
  hoveredRouteId: string | null;
  setHoveredRouteId: (hoveredRouteId: string | null) => void;
  clickedRouteId: string | null;
  setClickedRouteId: (clickedRouteId: string | null) => void;
};

export default function Menu({
  routes,
  hoveredRouteId,
  setHoveredRouteId,
  clickedRouteId,
  setClickedRouteId,
}: MenuProps) {
  return (
    <menu>
      <div className={styles["menu-header"]}>
        <h2>Routes</h2>
      </div>
      <ul>
        {routes.map((route) => (
          <li
            key={route.id}
            onMouseEnter={() => setHoveredRouteId(route.id)}
            onMouseLeave={() => setHoveredRouteId(null)}
            onClick={() => setClickedRouteId(route.id)}
          >
            <div className={styles["card-header"]}>
              <h3
                style={{
                  color: `#${route.textColor}`,
                  backgroundColor: isNullish(route.color)
                    ? ""
                    : [hoveredRouteId, clickedRouteId].includes(route.id)
                    ? getRgbaString(route.color, 1)
                    : getRgbaString(route.color, 0.5),
                }}
              >
                <span>{route.longName}</span>
              </h3>
            </div>
            <div className={styles["card-body"]}>
              <p>Type: {route.type === "SUBWAY" ? "Subway" : "Light Rail"}</p>
              <p>Fare Class: {route.fareClass}</p>
            </div>
          </li>
        ))}
      </ul>
    </menu>
  );
}

function getRgbaString(hex: string, a: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "";

  return `rgba(${rgb.r},${rgb.g},${rgb.b},${a})`;
}

type Rgb = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex: string): Rgb | null {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
