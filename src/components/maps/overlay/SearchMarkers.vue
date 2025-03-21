<script setup lang="ts">
import { useStore } from '@nanostores/vue';
import { onClickOutside, useFocus, useFocusWithin, useLocalStorage, useMagicKeys, whenever } from '@vueuse/core';
import { computed, onMounted, onUpdated, ref, watch } from 'vue';

import type { MapMarker, MapMarkerGroup, PlayerMarker } from '@/types/Leaflet';
import type { SearchConfig } from '@/types/Map';
import type { SearchMode } from '@/types/Search';

import { t } from '@/i18n/store';

import SearchMapSwitch from './SearchMapSwitch.vue';
import SearchMarkersTags from './SearchMarkersTags.vue';

const props = defineProps<{
    markers: MapMarker[],
    players: PlayerMarker,
    mapKey?: string,
    searchConfig?: SearchConfig
}>()

const customMarkersKey = props.mapKey ? `custom-markers-${props.mapKey}` : 'custom-markers'

const fixedMarkers = props.markers
const customMarkersData = useLocalStorage(customMarkersKey, [])

const allMarkers = computed(() => {
    return [...fixedMarkers, ...customMarkersData.value]
})

// Search functions
const searchBar = ref<HTMLDivElement>()
const searchBarWrapper = ref<HTMLDivElement>()
const qInput = ref()
const { focused: isComponentFocused } = useFocusWithin(searchBarWrapper)
const { focused: isSearchFocused } = useFocus(qInput)

const currentSearchMode = ref<SearchMode>('query')

onMounted(() => {
    isSearchFocused.value = true
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
    if (currentSearchMode.value === "query") return 50
    return 500
})

/**
 * ACCESSIBILITY
 */
// Registered key combos
const keys = useMagicKeys()
const shortcutKeyCombo = keys['Shift+Period']
const eraseKeyCombo = keys['Escape']

whenever(shortcutKeyCombo, () => {
    isSearchFocused.value = true
})
whenever(eraseKeyCombo, () => {
    resetAllFields('focusAfter')
})

// If query changes and has new value...
watch(q, (n, o) => {
    if (n) setSearchMode('query')
})

// Toggle menu if clicked outside
onClickOutside(searchBarWrapper, () => setSearchMode('query'))

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
 * Custom Markers handling
 */
 onMounted(() => {
    customMarkersData.value = useLocalStorage(customMarkersKey, []).value

    document.addEventListener('refresh-custom-markers', () => {
        customMarkersData.value = useLocalStorage(customMarkersKey, []).value
    })
})

/**
 * Emit event to delete custom marker
 */
function emitDeleteCustomMarker(markerTitle: string) {
    const deleteCMarkerEvent = new CustomEvent(`delete-${markerTitle}`, { bubbles: true })

    searchBar.value?.dispatchEvent(deleteCMarkerEvent)
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

    if (actionAfter === "focusAfter") isSearchFocused.value = true
}
</script>

<template>
    <nav ref="searchBarWrapper" class="toolbar">
        <SearchMapSwitch />

        <div ref="searchBar" class="search-w" :data-focused="shouldBeActive">
            <div class="input-w">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="search-icon"><rect width="256" height="256" fill="none"/><path d="M168,112a56,56,0,1,1-56-56A56,56,0,0,1,168,112Zm61.66,117.66a8,8,0,0,1-11.32,0l-50.06-50.07a88,88,0,1,1,11.32-11.31l50.06,50.06A8,8,0,0,1,229.66,229.66ZM112,184a72,72,0,1,0-72-72A72.08,72.08,0,0,0,112,184Z"/></svg>

                <input
                    ref="qInput"
                    class=""
                    name="recherche"
                    type="text"
                    v-model="q"
                    :title="t('maps.search')"
                    :placeholder="t('maps.searchPlaceholder')"
                >

                <button v-if="hasGroupFilter || hasQuery" @click="onCloseQuery" class="close-btn" :title="t('maps.closeSearch')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="icon"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/><line x1="200" y1="200" x2="56" y2="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/></svg>
                </button>

                <button v-if="hasPlayers" data-to-players class="player-btn" :tabindex="shouldBeActive ? 1 : 0" :title="t('maps.go-to-player')">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="icon"><rect width="256" height="256" fill="none"/><path d="M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.17,83.41,134.55a8,8,0,0,0,9.18,0C136,236.17,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z"/></svg>
                </button>
            </div>

            <ul class="search-results" v-if="shouldBeActive">
                <li v-for="m in filteredMarkers?.slice(0, currentLimit)" :key="m.title">
                    <button
                        class="search-item"
                        :class="`group-${m.group}`"
                        :data-to-marker="m.title"
                        tabindex="0"
                        :title="m.group === 'quests' ? t('maps.seeQuest') : t('maps.seePlace')"
                    >
                        <img v-if="m.cover && !m.coverPortrait" :src="`/images/cover/${m.cover}`" :alt="m.title" width="300" />

                        <div class="content-wrapper">
                            <span class="title">{{ m.title }}</span>

                            <div class="desc">
                                <p v-html="m.description" />

                                <a v-if="m.mapId" :href="m.mapId" class="map-link">
                                    <span>
                                        {{ t('maps.go-to-map') }}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><line x1="80" y1="112" x2="144" y2="112" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><circle cx="112" cy="112" r="80" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="168.57" y1="168.57" x2="224" y2="224" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="112" y1="80" x2="112" y2="144" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                                </a>
                            </div>

                            <div v-if="m.icon">
                                <svg v-if="m.icon === 'graduation-cap'" xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 256 256"><path d="M251.76,88.94l-120-64a8,8,0,0,0-7.52,0l-120,64a8,8,0,0,0,0,14.12L32,117.87v48.42a15.91,15.91,0,0,0,4.06,10.65C49.16,191.53,78.51,216,128,216a130,130,0,0,0,48-8.76V240a8,8,0,0,0,16,0V199.51a115.63,115.63,0,0,0,27.94-22.57A15.91,15.91,0,0,0,224,166.29V117.87l27.76-14.81a8,8,0,0,0,0-14.12ZM128,200c-43.27,0-68.72-21.14-80-33.71V126.4l76.24,40.66a8,8,0,0,0,7.52,0L176,143.47v46.34C163.4,195.69,147.52,200,128,200Zm80-33.75a97.83,97.83,0,0,1-16,14.25V134.93l16-8.53ZM188,118.94l-.22-.13-56-29.87a8,8,0,0,0-7.52,14.12L171,128l-43,22.93L25,96,128,41.07,231,96Z"></path></svg>
                            </div>
                            <div v-else>
                                <svg v-if="m.group === 'quests'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M231.22,59.44l-80,168a8,8,0,1,1-14.44-6.88L165.62,160H32a8,8,0,0,1-5.88-13.43l42.56-46.1L26.59,61.9A8,8,0,0,1,32,48H224a8,8,0,0,1,7.22,11.44Z"/></svg>
                                <svg v-else-if="m.group === 'capitals'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M200,24h-8a16,16,0,0,0-16,16V56H148V40a16,16,0,0,0-16-16h-8a16,16,0,0,0-16,16V56H80V40A16,16,0,0,0,64,24H56A16,16,0,0,0,40,40V84.69A15.86,15.86,0,0,0,44.69,96L56,107.31V216a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V107.31L211.31,96A15.86,15.86,0,0,0,216,84.69V40A16,16,0,0,0,200,24ZM152,216H104V152a24,24,0,0,1,48,0Z"/></svg>
                                <svg v-else-if="m.group === 'landmarks'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M208,80a8,8,0,0,0-8,8v16H188.85L184,55.2A8,8,0,0,0,181.31,50h0L138.44,11.88l-.2-.17a16,16,0,0,0-20.48,0l-.2.17L74.68,50v0A7.93,7.93,0,0,0,72,55.2L67.15,104H56V88a8,8,0,0,0-16,0v24a8,8,0,0,0,8,8H65.54l-9.47,94.48A16,16,0,0,0,72,232H184a16,16,0,0,0,15.92-17.56L190.46,120H208a8,8,0,0,0,8-8V88A8,8,0,0,0,208,80ZM87.24,64h81.52l4,40H136V88a8,8,0,0,0-16,0v16H83.23ZM72,216l4.81-48H179.19L184,216Z"/></svg>
                            </div>
                        </div>
                    </button>

                    <!-- Custom marker actions -->
                    <div class="search-item-actions" v-if="m.group === 'custom'">
                        <!-- <button class="btn btn-info btn-icon btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="icon"><rect width="256" height="256" fill="none"/><path d="M92.69,216H48a8,8,0,0,1-8-8V163.31a8,8,0,0,1,2.34-5.65L165.66,34.34a8,8,0,0,1,11.31,0L221.66,79a8,8,0,0,1,0,11.31L98.34,213.66A8,8,0,0,1,92.69,216Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="136" y1="64" x2="192" y2="120" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                        </button> -->

                        <button class="btn btn-danger btn-icon btn-sm" @click="emitDeleteCustomMarker(m.title)">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="icon"><rect width="256" height="256" fill="none"/><line x1="216" y1="56" x2="40" y2="56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="104" y1="104" x2="104" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="152" y1="104" x2="152" y2="168" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                        </button>
                    </div>
                </li>
            </ul>
        </div>

        <SearchMarkersTags
            :current-search-mode="currentSearchMode"
            :custom-markers="customMarkersData"
            :search-config="props.searchConfig"
            @on-category-switch="handleCategorySwitch"
        />
    </nav>
</template>

<style lang="scss" scoped>
.toolbar {
    @media screen and (width >= 900px) {
        display: flex;
        gap: .75rem;
        align-items: start;
    }

    .search-w {
        margin-left: calc(45px + .5rem);
        padding: .5rem 1.2rem;
        width: calc(100% - 3rem);
        background: var(--white);
        border: 1px solid var(--slate-400);
        border-radius: 25px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
        pointer-events: all;

        @media screen and (width >= 900px) {
            width: clamp(25rem, 35dvw, 30rem);
            width: clamp(25rem, 35vw, 30rem);
            margin-right: .75rem;
            margin-left: 0;
        }

        .input-w {
            $search-items-gap: .5rem;
            $search-icon-size: 1.2em;

            position: relative;
            display: flex;
            align-items: center;
            gap: $search-items-gap;

            input {
                padding-block: .2rem;
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
                width: $search-icon-size;
                fill: var(--slate-400);
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

                .icon {
                    font-size: 1.5em;
                    fill: var(--red-500);
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

            .close-btn {
                font-size: 1.1em;
                color: var(--slate-500);
            }
        }

        .search-results {
            max-height: 20vh;
            overflow-y: auto;
            scrollbar-gutter: stable;

            @media screen and (width >= 900px) {
                max-height: 50vh;
            }

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

            li {
                position: relative;
                border-radius: .5rem;
                overflow: clip;

                &:not(:last-child) {
                    margin-bottom: .25rem;
                }

                &:hover:not(:has(a:hover)) {
                    background-color: var(--slate-100);

                    .title {
                        text-decoration: underline;
                    }
                }

                .search-item {
                    position: relative;
                    cursor: pointer;
                    width: 100%;
                    border-radius: .5rem;
                    outline-offset: -1px;

                    img {
                        display: block;
                        width: 100%;
                        max-height: 22.5dvh;
                        max-height: 22.5vh;
                        object-fit: cover;
                    }

                    .content-wrapper {
                        position: relative;
                        padding: .4rem .5em .6rem;
                        padding-right: 2.75rem;
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

                        .map-link {
                            margin-top: .5rem;
                            display: inline-flex;
                            align-items: center;
                            gap: .5ch;
                            text-underline-offset: 2px;
                            text-decoration: underline;

                            &:hover {
                                text-decoration: none;
                                color: var(--green-500);
                            }

                            svg {
                                width: 1rem;
                                height: 1rem;
                            }
                        }

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
                        fill: var(--slate-400);
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

                    &.group-custom {
                        .title {
                            font-style: italic;
                        }
                    }
                }

                /**
                * Custom markers actions
                */
                .search-item-actions {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: .25em;
                    display: flex;
                    align-items: center;
                    gap: .3rem;
                    transition-property: visibility, opacity;
                    transition-duration: .2s;
                    transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);
                }

                &:hover {
                    .search-item-actions {
                        visibility: visible;
                        opacity: 1;
                        pointer-events: all;
                    }
                }

                &:not(:hover) {
                    .search-item-actions {
                        visibility: hidden;
                        opacity: 0;
                        pointer-events: none;
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

// Animations on load
@media screen and (prefers-reduced-motion: no-preference) {
    .toolbar {
        animation: fadeIn .2s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(-1rem);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
}
</style>
