import type { MapMarkerGroup } from "./Leaflet";

/**
 * Available advanced search modes for the filter functions
 *
 * Currently only groups MapMarkerGroup and string "query"
 */
export type SearchMode = "query" | MapMarkerGroup