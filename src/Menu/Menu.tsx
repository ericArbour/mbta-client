import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { Route, isNullish, isNotNullish } from "../types";

import styles from "./Menu.module.css";

type MenuProps = {
  routes: Route[];
  hoveredRouteId: string | null;
  setHoveredRouteId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedRouteId: string | null;
  setSelectedRouteId: React.Dispatch<React.SetStateAction<string | null>>;
};

export default function Menu({
  routes,
  hoveredRouteId,
  setHoveredRouteId,
  selectedRouteId,
  setSelectedRouteId,
}: MenuProps) {
  return (
    <nav className={styles["route-menu"]}>
      <div className={styles["route-menu-header"]}>
        <h2>Routes</h2>
      </div>
      <ul>
        {routes.map((route) => {
          const isSelected = route.id === selectedRouteId;
          const isHovered = route.id === hoveredRouteId;
          const cardBodyClasses = [styles["card-body"]];
          if (isSelected) cardBodyClasses.push(styles["is-active"]);

          const headingColor =
            isNotNullish(route.textColor) &&
            (isSelected || isHovered || !selectedRouteId)
              ? `#${route.textColor}`
              : "black";

          const headingBackgroundColor = isNullish(route.color)
            ? "gray"
            : isSelected || isHovered
            ? getRgbaString(route.color, 1)
            : !selectedRouteId
            ? getRgbaString(route.color, 0.5)
            : "gray";

          const typeText = route.type === "SUBWAY" ? "Subway" : "Light Rail";

          return (
            <li key={route.id}>
              <button
                onMouseEnter={() => setHoveredRouteId(route.id)}
                onMouseLeave={() => setHoveredRouteId(null)}
                onClick={() =>
                  setSelectedRouteId((selectedRouteId) =>
                    selectedRouteId === route.id ? null : route.id,
                  )
                }
                style={{
                  color: headingColor,
                  backgroundColor: headingBackgroundColor,
                }}
              >
                {route.longName}
                {
                  <FontAwesomeIcon
                    icon={faTimes}
                    className={isSelected ? styles["is-active"] : ""}
                  />
                }
              </button>
              <div className={cardBodyClasses.join(" ")}>
                <p>
                  <span>Type:</span> {typeText}
                </p>
                <p>
                  <span>Fare Class:</span> {route.fareClass}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
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
