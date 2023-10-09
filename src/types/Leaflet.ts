export type MapMarkerGroup = "capitals" | "cities" | "towns" | "landmarks";

export type MapMarker = {
    title: string,
    markerCoords: {
        x: number,
        y: number,
    }
    description?: string,
    link?: string,
    group?: MapMarkerGroup,
}
