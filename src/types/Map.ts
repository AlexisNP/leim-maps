import type { MapMarker, PlayerMarker } from "./Leaflet"

export interface BreadcrumbItem {
    name: string;
    url: string;
}

export interface SearchConfig {
    disableQuests?: boolean
    disableCapitals?: boolean
    disableLandmarks?: boolean
}

export interface MapProps {
    mapKey: string
    zoomifyKey: string
    mapHeight: number
    mapWidth: number
    markers?: MapMarker[]
    players?: PlayerMarker
    rulerMainUnit?: string
    rulerDistanceRatio?: number
    rulerHideWalkDistance?: boolean
    backgroundColor?: string
}

export interface MapOverlayProps {
    mapKey: string
    markers?: MapMarker[]
    players?: PlayerMarker
    searchConfig?: SearchConfig
    breadcrumbs?: BreadcrumbItem[]
}
