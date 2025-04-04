export type MapMarkerGroup = "capitals" | "cities" | "towns" | "landmarks" | "quests" | "custom";
export type MapMarkerIcon = "castle" | "flag" | "graduation-cap" | "location-pin" | "monument" | "push-pin" | "house"

export type MapCoords = {
    x: number,
    y: number,
}

export type MapMarker = {
    /**
     * The title of the marker (must be unique).
     */
    title: string,
    /**
     * The coordinates of the marker.
     * @example { x: 123, y: 456 }
     */
    markerCoords: MapCoords,
    /**
     * The description of the marker.
     */
    description?: string,
    /**
     * The link that can appear on the marker title.
     * @example https://example.com
     */
    link?: string,
    /**
     * The ID of the map the marker is supposed to point to.
     *
     * This should be a valid path of the `maps/data` folder.
     * @example "fr/aldys/borelis"
     */
    mapId?: string,
    /**
     * The group that the marker belongs to.
     * @example "capitals"
     */
    group?: MapMarkerGroup,
    /**
     * The icon that the marker should use.
     * @example "castle"
     */
    icon?: MapMarkerIcon,
    /**
     * Cover image for the marker.
     * This should be a valid image in the public folder.
     *
     * @example "Ambrose.webp"
     */
    cover?: string,
    /**
     * The link to the cover image's source.
     */
    coverLink?: string,
    /**
     * The author of the cover image.
     */
    coverAuthor?: string,
    /**
     * Whether the cover image should be displayed in portrait mode.
     */
    coverPortrait?: boolean
}

/**
 * A marker that is used to display players' location on the map.
 */
export type PlayerMarker = {
    /**
     * The title of the marker (must be unique).
     */
    title: string,
    /**
     * The coordinates of the marker.
     * @example { x: 123, y: 456 }
     */
    markerCoords: MapCoords,
    /**
     * The description of the marker.
     */
    description?: string,
    /**
     * The link that can appear on the marker title.
     * @example https://example.com
     */
    link?: string,
}

/**
 * A marker that is used to display a custom location on the map.
 * These are only used on the client side and are not saved anywhere else.
 */
export type CustomMarker = {
    lat: number,
    lon: number,
    title: string,
    icon: Object
}
