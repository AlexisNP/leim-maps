import { deepMap, onMount, task } from 'nanostores'
import type { MapMarker, PlayerMarker } from '../../types/Leaflet';

let baseUrl: string

const isDev = import.meta.env.DEV;

baseUrl = "http://localhost:4321"

export const $world = deepMap({
    markers: [] as MapMarker[],
    players: {} as PlayerMarker,
})

// Fetch initial data
onMount($world, () => {
    // Fetch all markers
    task(async () => {
        let m
        try {
            m = await fetch(`${baseUrl}/api/markers.json`)

            $world.setKey('markers', await m.json())
        } catch (err) {
            console.log(err)
        }
    })
    // Fetch all player data
    task(async () => {
        let p
        try {
            p = await fetch(`${baseUrl}/api/players.json`)

            $world.setKey('players', await p.json())
        } catch (err) {
            console.log(err)
        }
    })
})
