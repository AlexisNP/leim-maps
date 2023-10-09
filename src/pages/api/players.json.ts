import type { APIRoute } from "astro";
import { playerPosition } from "./data/players.markers";

export const GET: APIRoute = ({ params, request }) => {
    return new Response(
        JSON.stringify(playerPosition)
    )
}