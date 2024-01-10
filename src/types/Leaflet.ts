export type MapMarkerGroup = "capitals" | "cities" | "towns" | "landmarks" | "quests" | "custom";

export type MapCoords = {
    x: number,
    y: number,
}

export type MapMarker = {
    title: string,
    markerCoords: MapCoords,
    description?: string,
    link?: string,
    group?: MapMarkerGroup,
}

export type PlayerMarker = {
    title: string,
    markerCoords: MapCoords,
    description?: string,
    link?: string,
}

export type CustomMarker = {
    lat: number,
    lon: number,
    title: string,
    icon: Object
}
