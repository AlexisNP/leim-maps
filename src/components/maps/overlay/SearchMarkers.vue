<script setup lang="ts">
import type { MapMarker, MapMarkerGroup, PlayerMarker } from '@/types/Leaflet';
import { useFocus, useMagicKeys, whenever } from '@vueuse/core';
import { computed, onMounted, ref, onUpdated, watch } from 'vue';

const props = defineProps<{
    markers: MapMarker[],
    players: PlayerMarker,
}>()

const markers = props.markers

// Search functions
const qInput = ref()
const { focused: isFocused } = useFocus(qInput)

onMounted(() => {
    isFocused.value = true
})

const shouldBeActive = computed(() => q.value.length > 0 || currentSearchMode.value !== "query")

const q = ref<string>("")

const unifier = new RegExp(/[^a-zA-Z0-9\-\'']/g)

const filteredMarkers = computed(() => {
    if (currentSearchMode.value === "query") {
        return markers?.filter(m => {
            const queryString = new String(q.value).replace(unifier, "").toLocaleLowerCase()
            const hitTitle = m.title.replace(unifier, "").toLocaleLowerCase().includes(queryString)
            const hitDesc = m.description?.replace(unifier, "").toLocaleLowerCase().includes(queryString)

            return hitTitle || hitDesc
        })
    }

    return markers?.filter(m => {
        return m.group === currentSearchMode.value
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
    resetQueryValue()
    isFocused.value = true
})

watch(q, (n, o) => {
    if (n) setSearchMode('query'); 
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
        const flyToMarker = new CustomEvent(`fly-to-${toMarker}`, { bubbles: true })

        btn.addEventListener('click', () => btn.dispatchEvent(flyToMarker))
    })
})

type SearchMode = "query" | MapMarkerGroup;

const currentSearchMode = ref<SearchMode>('query');

const currentLimit = computed(() => {
    if (currentSearchMode.value === "query") return 10
    return 20;
})

function setSearchMode(m: SearchMode) {
    currentSearchMode.value = m;
}

function setActiveCategory(g: MapMarkerGroup) {
    resetQueryValue()
    currentSearchMode.value = g;
}

function resetQueryValue() {
    q.value = "";
}
</script>

<template>
    <nav class="toolbar">
        <div ref="searchBar" class="search-w" :data-focused="shouldBeActive">
            <div class="input-w">
                <i class="search-icon ph-fill ph-magnifying-glass"></i>
                <input ref="qInput" name="recherche" type="text" v-model="q" title="Rechercher le monde" placeholder="Ville, point d'intérêt…">

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
                            <i class="ph-fill ph-flag"></i>
                        </div>
                    </button>
                </li>
            </ul>
        </div>

        <menu class="tag-list">
            <li>
                <button @click="setActiveCategory('quests')">
                    <span class="icon">
                        <i class="ph-fill ph-flag-banner"></i>
                    </span>
                    <span class="label">
                        Quêtes
                    </span>
                </button>
            </li>
        </menu>
    </nav>
</template>

<style lang="scss" scoped>
.toolbar {
    display: flex;
    gap: 1.5rem;
    align-items: start;

    .search-w {
        padding: .5rem 1.2rem;
        width: calc(100% - 3rem);
        background: var(--white);
        border: 1px solid var(--slate-400);
        border-radius: 25px;
        box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
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

            .player-btn {
                position: relative;
                isolation: isolate;
                aspect-ratio: 1 / 1;
                line-height: 1;
                font-size: 1.5em;
                color: var(--red-500);
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
                padding-right: 2.4rem;
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
                    right: .4rem;
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

    @media screen and (width >= 900px) {
        .search-w {
            width: 29%;
        }
    }

    /**
    * TAG LIST
    */
    .tag-list {
        margin-top: .5rem;

        button {
            display: inline-flex;
            align-items: center;
            gap: .5ch;
            padding-block: .25rem;
            padding-inline: .8rem;
            font-weight: 600;
            font-size: .85em;
            background: var(--white);
            border: 1px solid var(--slate-400);
            border-radius: 100vmax;
            box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
            pointer-events: all;
            cursor: pointer;
            transition-property: color, background-color, border-color;
            transition-duration: .15s;
            transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);

            .icon {
                font-size: 1.1em;
            }

            &:hover {
                color: var(--white);
                background-color: var(--red-500);
                border-color: var(--red-700);
            }
        }
    }
}
</style>