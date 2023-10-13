<script setup lang="ts">
import { allTasks } from 'nanostores';
import { useStore } from '@nanostores/vue'
import { $world } from '../worldStore';

import { useFocus, useMagicKeys, whenever } from '@vueuse/core';
import { computed, onMounted, ref, onUpdated } from 'vue';

$world.listen(() => {})
await allTasks()

const { markers, players } = useStore($world).value

// Search functions
const qInput = ref()
const { focused: isFocused } = useFocus(qInput)

onMounted(() => {
    isFocused.value = true
})

const shouldBeActive = computed(() => {
    if (q.value.length > 0) {
        return isFocused
    }
})

const q = ref<string>("")

const filteredMarkers = computed(() => {
    return markers?.filter(m => {
        const unifier = new RegExp(/[^a-zA-Z0-9\-\'']/g)

        const queryString = new String(q.value).replace(unifier, "").toLocaleLowerCase()
        const hitTitle = m.title.replace(unifier, "").toLocaleLowerCase().includes(queryString)
        const hitDesc = m.description?.replace(unifier, "").toLocaleLowerCase().includes(queryString)

        return hitTitle || hitDesc
    })
})

// Key Combos
const keys = useMagicKeys()
const shortcutKeyCombo = keys['Shift+Period']
const eraseKeyCombo = keys['Escape']

whenever(shortcutKeyCombo, () => {
    isFocused.value = true
})
whenever(eraseKeyCombo, () => {
    q.value = ""
})

/**
 * Player geolocation
 * Uses native JS to avoid changing leaflet library
 */
onMounted(() => {
    const playerBtnRef = document.querySelector('[data-to-players]')
    const flyToPlayers = new CustomEvent('fly-to', { bubbles: true, detail: players.markerCoords })

    playerBtnRef?.addEventListener('click', () => {
        playerBtnRef.dispatchEvent(flyToPlayers)
    })
})

/**
 * Marker geolocation
 * We need to use onUpdated hook because the list is not always rendered, and it often rebuilt.
*/
onUpdated(() => {
    const markerBtnRefs = document.querySelectorAll('[data-to-marker]')

    markerBtnRefs.forEach((btn) => {
        const { toMarker } = (btn as HTMLButtonElement).dataset
        if (!toMarker) return
        const rawCoords = toMarker?.split(',')
        const detail = {
            x: rawCoords[0],
            y: rawCoords[1]
        }
        const flyToMarker = new CustomEvent('fly-to', { bubbles: true, detail })

        btn.addEventListener('click', () => btn.dispatchEvent(flyToMarker))
    })
})
</script>

<template>
    <div ref="searchBar" class="search-w" :data-focused="shouldBeActive">
        <div class="input-w">
            <i class="search-icon ph-fill ph-magnifying-glass"></i>
            <input ref="qInput" type="text" v-model="q">

            <button data-to-players class="player-btn" tabindex="1">
                <i class="pin-icon ph-fill ph-map-pin"></i>
            </button>
        </div>

        <ul class="search-results" v-if="shouldBeActive">
            <li v-for="m in filteredMarkers?.slice(0, 10)" :key="m.title">
                <button class="search-item" :data-to-marker="`${m.markerCoords.x},${m.markerCoords.y}`" tabindex="0">
                    <span class="title">{{ m.title }}</span>
                    <span class="desc">{{ m.description }}</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.search-w {
    margin-bottom: 1em;
    padding: .5rem 1.2rem;
    width: 25%;
    min-width: 20rem;
    background: #fff;
    border: 1px solid var(--slate-400);
    border-radius: 25px;
    pointer-events: all;

    .input-w {
        $search-items-gap: .5rem;
        $search-icon-size: 1.2em;

        position: relative;
        padding-block: .2rem;
        display: flex;
        align-items: center;
        gap: $search-items-gap;

        input {
            display: block;
            min-width: 10rem;
            padding-inline-start: calc($search-icon-size + $search-items-gap);
            flex-grow: 1;
        }

        .search-icon {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            left: 0;
            font-size: $search-icon-size;
            color: var(--slate-400);
            pointer-events: none;
        }

        .player-btn {
            aspect-ratio: 1 / 1;
            line-height: 1;
            font-size: 1.5em;
            color: #dc2626;
            border-radius: 50%;
            cursor: pointer;
        }
    }

    .search-results {
        max-height: 50vh;
        overflow-y: auto;
        scrollbar-gutter: stable;

        &::-webkit-scrollbar,
        &::-webkit-scrollbar-thumb {
            width: 26px;
            border-radius: 13px;
            background-clip: padding-box;
            border: 10px solid transparent;
        }

        &::-webkit-scrollbar-thumb {
            background-color: var(--slate-300);
        }

        > * + * {
            margin-bottom: .33rem;
        }

        .search-item {
            cursor: pointer;
            padding: .4rem .25em;
            width: 100%;
            outline-offset: -1px;

            &:hover {
                background-color: var(--slate-100);

                .title {
                    text-decoration: underline;
                }
            }

            &:focus-visible {
                outline: 1px dotted var(--slate-500);
                outline: 4px auto var(--slate-900);

                .title {
                    text-decoration: underline;
                }
            }

            .title,
            .desc {
                display: block;
                font-size: .85em;
            }

            .title {
                font-weight: 500;
                text-underline-offset: 2px;
            }
            .desc {
                color: var(--slate-500);
            }
        }
    }

    &[data-focused="true"] {
        .input-w {
            border-bottom: 1px solid var(--slate-200);
            margin-bottom: .5rem;
            padding-bottom: .5rem;

            input {
                padding-block-start: .2rem;
            }
        }
    }
}
</style>