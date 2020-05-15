import React from "react";

import CloseButton from "../CloseButton/CloseButton";
import { Route } from "../types";

import styles from "./RoutePanel.module.css";

type RoutePanelProps = {
  selectedRoute?: Route | null;
};

export default function RoutePanel({ selectedRoute }: RoutePanelProps) {
  if (!selectedRoute) return null;

  const { color, textColor, longName, type, fareClass } = selectedRoute;

  return (
    <details className={styles["route-panel"]} open>
      <summary>
        <h2>Selected Route</h2>
        <CloseButton />
      </summary>
      <div className={styles["panel-body"]}>
        <h3
          style={{
            color: textColor ? `#${textColor}` : "inherit",
            backgroundColor: color ? `#${color}` : "inherit",
          }}
        >
          {longName}
        </h3>
        <p>{type}</p>
        <p>{fareClass}</p>
      </div>
    </details>
  );
}
