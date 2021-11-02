import { PathOptions, Path, LatLng } from "leaflet";

// Leaflet.Curve accepts two latlng types,
// [lat: number, lng: number] for commands M, L, C, S, Q, T and
// [lat/lng: number] for commands H, V
export type CurveLatLngExpression = [number, number] | [number];

// SVG Command Types
export type CurveSVGCommand =
    | "M"
    | "L"
    | "H"
    | "V"
    | "C"
    | "S"
    | "Q"
    | "T"
    | "Z";

// PathData consists of SVG command followed by their lat/lng parameters
export type CurvePathDataElement = CurveLatLngExpression | CurveSVGCommand;
export type CurvePathData = CurvePathDataElement[];

// Extending existing leaflet module to add Curve class and curve function
declare module "leaflet" {
    export interface CurveOptions extends PathOptions {
        animate?: KeyframeAnimationOptions | number;
    }

    export class Curve extends Path {
        constructor(pathData: CurvePathData, options: CurveOptions);

        // Public functions
        setPath(pathData: CurvePathData): this;
        getPath(): CurvePathData;
        getLatLngs(): CurvePathData;
        setLatLngs(pathData: CurvePathData): this;
        trace(samplingDistance: number[]): LatLng[];
    }

    export function curve(pathData: CurvePathData, options: CurveOptions): Curve;
}
