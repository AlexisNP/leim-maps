import type { APIRoute } from "astro";
import { worldMarkers } from "./data/world.markers";

export const GET: APIRoute = ({ params, request }) => {
    return new Response(
        JSON.stringify(worldMarkers)
    )
}