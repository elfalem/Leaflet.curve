export type CurveLatLngExpression = [number, number] | [number]
export type CurveSVGCommand = 'M' | 'L' | 'H' | 'V' | 'C' | 'S' | 'Q' | 'T' | 'Z'

export type CurvePathDataElement = CurveLatLngExpression | CurveSVGCommand
export type CurvePathData = CurvePathDataElement[]

declare module "leaflet" {
    export interface CurveOptions extends PathOptions {
        animate?: KeyframeAnimationOptions | number
    }

    export class Curve extends Path {
        constructor(pathData: CurvePathData, options: CurveOptions);

        setPath(pathData: CurvePathData): this;
        getPath(): CurvePathData;
        setLatLngs(pathData: CurvePathData): this;
        trace(samplingDistance: number[]): LatLng[]
    }

    export function curve(pathData: CurvePathData, options: CurveOptions): Curve
}