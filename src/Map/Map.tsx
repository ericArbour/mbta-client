import React, { useState } from "react";
import ReactMapGL, { Marker, Source, Layer } from "react-map-gl";
import { useSubscription, useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSubway } from "@fortawesome/free-solid-svg-icons";
import polyline from "@mapbox/polyline";

import { Vehicle } from "../types";

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
  const { data: queryData } = useQuery<{
    vehicles: Vehicle[];
  }>(GET_VEHICLES);
  const { data: subData } = useSubscription<{
    vehicles: Vehicle[];
  }>(GET_VEHICLE_UPDATES);
  const queryVehicles = queryData?.vehicles || [];
  const subVehicles = subData?.vehicles || [];
  const vehicles = subVehicles.length ? subVehicles : queryVehicles;

  const test = polyline
    .decode(
      "}nwaG~|eqLGyNIqAAc@S_CAEWu@g@}@u@k@u@Wu@OMGIMISQkAOcAGw@SoDFkCf@sUXcJJuERwHPkENqCJmB^mDn@}D??D[TeANy@\\iAt@qB`AwBl@cAl@m@b@Yn@QrBEtCKxQ_ApMT??R?`m@hD`Np@jAF|@C`B_@hBi@n@s@d@gA`@}@Z_@RMZIl@@fBFlB\\tAP??~@L^?HCLKJWJ_@vC{NDGLQvG}HdCiD`@e@Xc@b@oAjEcPrBeGfAsCvMqVl@sA??jByD`DoGd@cAj@cBJkAHqBNiGXeHVmJr@kR~@q^HsB@U??NgDr@gJTcH`@aMFyCF}AL}DN}GL}CXkILaD@QFmA@[??DaAFiBDu@BkA@UB]Fc@Jo@BGJ_@Lc@\\}@vJ_OrCyDj@iAb@_AvBuF`@gA`@aAv@qBVo@Xu@??bDgI??Tm@~IsQj@cAr@wBp@kBj@kB??HWtDcN`@g@POl@UhASh@Eb@?t@FXHl@Px@b@he@h[pCC??bnAm@h@T??xF|BpBp@^PLBXAz@Yl@]l@e@|B}CT[p@iA|A}BZi@zDuF\\c@n@s@VObAw@^Sl@Yj@U\\O|@WdAUxAQRCt@E??xAGrBQZAhAGlAEv@Et@E~@AdAAbCGpCA|BEjCMr@?nBDvANlARdBb@nDbA~@XnBp@\\JRH??|Al@`AZbA^jA^lA\\h@P|@TxAZ|@J~@LN?fBXxHhApDt@b@JXFtAVhALx@FbADtAC`B?z@BHBH@|@f@RN^^T\\h@hANb@HZH`@H^LpADlA@dD@jD@x@@b@Bp@HdAFd@Ll@F^??n@rDBRl@vD^pATp@Rb@b@z@\\l@`@j@p@t@j@h@n@h@n@`@hAh@n@\\t@PzANpAApBGtE}@xBa@??xB_@nOmB`OgBb@IrC[p@MbEmARCV@d@LH?tDyAXM",
    )
    .map(([a, b]) => [b, a]);
  console.log(test);

  return (
    <ReactMapGL
      {...viewport}
      mapStyle="mapbox://styles/mapbox/dark-v10"
      onViewportChange={(viewport) => {
        console.log("hit");
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
    >
      <Source
        type="geojson"
        data={{
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: test,
          },
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
                icon={faSubway}
                style={{
                  color: "red",
                  transform: `rotate(${180 + (vehicle.bearing || 0)}deg)`,
                }}
              />
            </Marker>
          ) : null,
        )}
        <Layer
          type="line"
          layout={{
            "line-join": "round",
            "line-cap": "round",
          }}
          paint={{
            "line-color": "grey",
            "line-width": 4,
          }}
        />
      </Source>
    </ReactMapGL>
  );
}
