<script setup lang="ts">
import type { MapMarker, MapMarkerGroup, PlayerMarker } from '@/types/Leaflet';
import type { SearchMode } from '@/types/Search';
import { useFocus, useLocalStorage, useMagicKeys, whenever } from '@vueuse/core';
import { computed, onMounted, ref, onUpdated, watch } from 'vue';
import SearchMarkersTags from './SearchMarkersTags.vue';

const props = defineProps<{
    markers: MapMarker[],
    players: PlayerMarker,
}>()

const fixedMarkers = props.markers
const customMarkersData = useLocalStorage('custom-markers', [])

const allMarkers = computed(() => {
    return [...fixedMarkers, ...customMarkersData.value]
})

// Search functions
const qInput = ref()
const { focused: isFocused } = useFocus(qInput)

const currentSearchMode = ref<SearchMode>('query')

onMounted(() => {
    isFocused.value = true
})

const hasQuery = computed(() => q.value.length > 0)
const shouldBeActive = computed(() => hasQuery.value || currentSearchMode.value !== "query")

const q = ref<string>("")

const unifier = new RegExp(/[^a-zA-Z0-9\-\'']/g)

/**
 * Dropdown's markers list
 * If the search doesn't have a query set, defaults to marker grouping
 */
const filteredMarkers = computed(() => {
    if (currentSearchMode.value === "query") {
        return allMarkers.value?.filter(m => {
            const queryString = new String(q.value).replace(unifier, "").toLocaleLowerCase()
            const hitTitle = m.title.replace(unifier, "").toLocaleLowerCase().includes(queryString)
            const hitDesc = m.description?.replace(unifier, "").toLocaleLowerCase().includes(queryString)

            return hitTitle || hitDesc
        })
    }

    return allMarkers.value?.filter(m => {
        return m.group === currentSearchMode.value
    })
})

// Limit of menu list dropdown
const currentLimit = computed(() => {
    if (currentSearchMode.value === "query") return 10
    return 100
})

/**
 * ACCESSIBILITY
 */
// Registered key combos
const keys = useMagicKeys()
const shortcutKeyCombo = keys['Shift+Period']
const eraseKeyCombo = keys['Escape']

whenever(shortcutKeyCombo, () => {
    isFocused.value = true
})
whenever(eraseKeyCombo, () => {
    resetAllFields()
    isFocused.value = true
})

// If query changes and has new value...
watch(q, (n, o) => {
    if (n) setSearchMode('query')
})

/**
 * Player geolocation
 * Uses native JS to avoid changing leaflet library
 */
onMounted(() => {
    const playerBtnRef = document.querySelector('[data-to-players]')
    const flyToPlayers = new CustomEvent(`fly-to-players`, { bubbles: true })

    playerBtnRef?.addEventListener('click', () => {
        playerBtnRef.dispatchEvent(flyToPlayers)
    })
})

const hasPlayers = computed(() => Object.keys(props.players).length > 0)

/**
 * Marker geolocation
 * We need to use onUpdated hook because the list is not always rendered, and it often rebuilt.
*/
onUpdated(() => {
    const markerBtnRefs = document.querySelectorAll('[data-to-marker]')

    markerBtnRefs.forEach((btn) => {
        const { toMarker } = (btn as HTMLButtonElement).dataset

        if (!toMarker) return

        const flyToEvent = new CustomEvent(`fly-to-${toMarker}`, { bubbles: true })

        btn.addEventListener('click', () => btn.dispatchEvent(flyToEvent))
    })
})

/**
 * Advanced Search Mode
 * Uses filters to show specific kinds of markers in the search results
 */
const hasGroupFilter = computed(() => {
    return currentSearchMode.value !== 'query'
})

function handleCategorySwitch(g: MapMarkerGroup) {
    resetQueryValue()

    if (currentSearchMode.value !== g) {
        currentSearchMode.value = g
    } else {
        currentSearchMode.value = "query"
    }
}

/**
 * EVENTS
 */
// Close Button event
function onCloseQuery() {
    resetAllFields("focusAfter")
}

/**
 * UTILITIES
 */
/**
 * Switches current search mode
 */
function setSearchMode(m: SearchMode) {
    currentSearchMode.value = m
}

/**
 * Resets active query in field
 */
function resetQueryValue() {
    q.value = ""
}

/**
 * Resets category and query states, default state
 */
function resetAllFields(actionAfter?: "focusAfter") {
    setSearchMode('query')
    resetQueryValue()

    if (actionAfter === "focusAfter") isFocused.value = true
}

/**
 * CUSTOM MARKERS HANDLING
 * This is really dirty (to me at least)
 * It should probably be handled by a store system, but nanostores doesn't mesh well 
 */
onMounted(() => {
    customMarkersData.value = useLocalStorage('custom-markers', []).value

    document.addEventListener('refresh-custom-markers', () => {
        customMarkersData.value = useLocalStorage('custom-markers', []).value
    })
})
</script>

<template>
    <nav class="toolbar">
        <div ref="searchBar" class="search-w" :data-focused="shouldBeActive">
            <div class="input-w">
                <i class="search-icon ph-fill ph-magnifying-glass"></i>
                <input ref="qInput" class="" name="recherche" type="text" v-model="q" title="Rechercher le monde" placeholder="Ville, point d'intérêt…">

                <button v-if="hasGroupFilter || hasQuery" @click="onCloseQuery" class="close-btn" title="Enlever le filtre">
                    <i class="ph-light ph-x"></i>
                </button>

                <button v-if="hasPlayers" data-to-players class="player-btn" :tabindex="shouldBeActive ? 1 : 0" title="Aller à la position actuelle des joueurs">
                    <i class="pin-icon ph-fill ph-map-pin"></i>
                </button>
            </div>

            <ul class="search-results" v-if="shouldBeActive">
                <li v-for="m in filteredMarkers?.slice(0, currentLimit)" :key="m.title">
                    <button
                        class="search-item"
                        :class="`group-${m.group}`"
                        :data-to-marker="m.title"
                        tabindex="0"
                        :title="m.group === 'quests' ? 'Voir la quête' : 'Visiter ce lieu'"
                    >
                        <span class="title">{{ m.title }}</span>

                        <div class="desc" v-html="m.description"></div>

                        <div class="icon" v-if="m.group === 'quests'">
                            <i class="ph-fill ph-flag-banner"></i>
                        </div>

                        <div class="icon" v-else-if="m.group === 'landmarks'">
                            <i class="ph-fill ph-castle-turret"></i>
                        </div>
                    </button>
                </li>
            </ul>
        </div>

        <SearchMarkersTags
            :current-search-mode="currentSearchMode"
            :custom-markers="customMarkersData"
            @on-category-switch="handleCategorySwitch"
        />
    </nav>
</template>

<style lang="scss" scoped>
.toolbar {
    @media screen and (width >= 900px) {
        display: flex;
        gap: 1.5rem;
        align-items: start;
    }

    .search-w {
        padding: .5rem 1.2rem;
        width: calc(100% - 3rem);
        background: var(--white);
        border: 1px solid var(--slate-400);
        border-radius: 25px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        pointer-events: all;

        @media screen and (width >= 900px) {
            width: 25%;
        }

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

                &::placeholder {
                    color: var(--slate-400);
                }
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

            .player-btn, .close-btn {
                position: relative;
                isolation: isolate;
                aspect-ratio: 1 / 1;
                line-height: 1;
                border-radius: 50%;
                cursor: pointer;

                &::before {
                    display: block;
                    content: '';
                    position: absolute;
                    inset: -.4rem;
                    background-color: transparent;
                    border-radius: 50%;
                    z-index: -1;
                    outline-offset: -.2rem;
                    transition-property: background-color;
                    transition-duration: .2s;
                    transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
                }

                &:hover {
                    &::before {
                        background-color: var(--slate-300);
                    }
                }

                &:focus-visible {
                    &::before {
                        background-color: var(--slate-200);
                        outline: 1px dotted var(--slate-500);
                        outline: 4px auto var(--slate-900);
                    }
                }
            }

            .player-btn {
                margin-left: .25rem;
                font-size: 1.5em;
                color: var(--red-500);

                &:hover {
                    &::before {
                        background-color: var(--slate-300);
                    }
                }

                &:focus-visible {
                    &::before {
                        background-color: var(--slate-200);
                        outline: 1px dotted var(--slate-500);
                        outline: 4px auto var(--slate-900);
                    }
                }
            }

            .close-btn {
                font-size: 1.1em;
                color: var(--slate-500);
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
                position: relative;
                cursor: pointer;
                padding: .4rem .25em;
                padding-right: 2.75rem;
                width: 100%;
                outline-offset: -1px;

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

                    :deep(a) {
                        text-underline-offset: 2px;
                        text-decoration: underline;

                        &:hover {
                            color: var(--green-500);
                        }
                    }
                }

                .icon {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: .75rem;
                    color: var(--slate-400);
                }

                &:hover:not(:has(a:hover)) {
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

                /**
                * Rules for specific groups (capitals, cities, etc...)
                */
                &.group-capitals {
                    .title {
                        font-weight: 600;
                    }
                }

                &.group-quests {
                    &:hover:not(:has(a:hover)) {
                        .icon {
                            color: var(--red-500);
                        }
                    }
                }
            }
        }

        &[data-focused="true"] {
            margin-bottom: 1em;
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
}
</style>