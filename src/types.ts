export type Vehicle = {
  id: string;
  __typename: string;
  updatedAt?: string | null;
  speed?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  label?: string | null;
  directionId?: number | null;
  currentStopSequence?: number | null;
  currentStatus?: CurrentStopStatus | null;
  bearing?: number | null;
  route?: Route | null;
};

enum CurrentStopStatus {
  INCOMING_AT = "INCOMING_AT",
  STOPPED_AT = "STOPPED_AT",
  IN_TRANSIT_TO = "IN_TRANSIT_TO",
}

export type Shape = {
  id: string;
  __typename: string;
  name?: string | null;
  priority?: string | null;
  polyline?: number[][];
};

export type Route = {
  id: string;
  __typename: string;
  type?: string | null;
  color?: string | null;
  textColor?: string | null;
  longName?: string | null;
  fareClass?: string | null;
  shapes?: Shape[];
};

export function isUndefined<T>(x: T | undefined): x is undefined {
  return x === undefined;
}

export function isNotUndefined<T>(x: T | undefined): x is T {
  return !isUndefined(x);
}

export function isNull<T>(x: T | null): x is null {
  return x === null;
}

export function isNotNull<T>(x: T | null): x is T {
  return !isNull(x);
}

type Nullish = undefined | null;

export function isNullish<T>(x: T | Nullish): x is Nullish {
  return isUndefined(x) || isNull(x);
}

export function isNotNullish<T>(x: T | Nullish): x is T {
  return !isNullish(x);
}
