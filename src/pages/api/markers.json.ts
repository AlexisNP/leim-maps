import type { APIRoute } from "astro";
import { allianceMarkers } from "./data/alliance.markers";

export const GET: APIRoute = ({ params, request }) => {
    return new Response(
        JSON.stringify(allianceMarkers)
    )
}