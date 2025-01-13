import type { MatchModes } from "./matchmodes";
import type { Comparators } from "./comparators";

export type Comparator = typeof Comparators[number];
export type MatchMode = typeof MatchModes[number];

export type Clause = {
  conds: string;
  args: any[];
}

export type Geometry = { 
  lng: number,
  lat: number,
  radius: number,
  bounds: {
    minLng: number,
    minLat: number,
    maxLng: number,
    maxLat: number
  } 
};
