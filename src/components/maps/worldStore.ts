import { deepMap, onMount, task, action } from 'nanostores'
import type { MapCoords, MapMarker } from '../../types/Leaflet';

export const $world = deepMap({
    markers: [] as MapMarker[],
    players: {} as MapMarker,
})

// Fetch initial data
onMount($world, () => {
    // Fetch all markers
    task(async () => {
        const m = await fetch('http://localhost:4321/api/markers.json')
        $world.setKey('markers', await m.json())
    })
    // Fetch all player data
    task(async () => {
        const p = await fetch('http://localhost:4321/api/players.json')
        $world.setKey('players', await p.json())
    })
})