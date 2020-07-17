import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

import CloseButton from "../CloseButton/CloseButton";
import { Vehicle } from "../types";

import styles from "./VehiclePanel.module.css";

type VehiclePanelProps = {
  selectedVehicleId?: String | null;
  setSelectedVehicleId: React.Dispatch<React.SetStateAction<string | null>>;
};

const GET_VEHICLE = gql`
  query GetVehicle($id: ID!) {
    vehicle(id: $id) {
      id
      label
      currentStatus
      route {
        id
        color
        textColor
      }
    }
  }
`;

export default function VehiclePanel({
  selectedVehicleId,
  setSelectedVehicleId,
}: VehiclePanelProps) {
  const { loading, data } = useQuery<{
    vehicle: Vehicle;
  }>(GET_VEHICLE, {
    skip: !selectedVehicleId,
    variables: { id: selectedVehicleId },
  });

  if (!selectedVehicleId) return null;

  const { label, currentStatus, speed, route } = data?.vehicle || {};
  const { color, textColor } = route || {};

  return (
    <details className={styles["vehicle-panel"]} open>
      <summary>
        <h2>Selected Vehicle</h2>
        <button onClick={() => setSelectedVehicleId(null)}>
          <CloseButton />
        </button>
      </summary>
      <div className={styles["panel-body"]}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <>
            <h3
              style={{
                color: textColor ? `#${textColor}` : "inherit",
                backgroundColor: color ? `#${color}` : "inherit",
              }}
            >
              {label}
            </h3>
            <p>{currentStatus}</p>
            <p>{speed}</p>
          </>
        )}
      </div>
    </details>
  );
}
