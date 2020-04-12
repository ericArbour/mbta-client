export type Vehicle = {
  id: string;
  __typename: string;
  updatedAt?: string;
  speed?: number;
  latitude?: number;
  longitude?: number;
  label?: string;
  directionId?: number;
  currentStopSequence?: number;
  currentStatus?: CurrentStopStatus;
  bearing?: number;
};

enum CurrentStopStatus {
  INCOMING_AT = "INCOMING_AT",
  STOPPED_AT = "STOPPED_AT",
  IN_TRANSIT_TO = "IN_TRANSIT_TO",
}
