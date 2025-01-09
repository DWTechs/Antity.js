import type { MatchModes } from "./matchmodes";

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
