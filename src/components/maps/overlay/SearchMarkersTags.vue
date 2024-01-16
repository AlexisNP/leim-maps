<script lang="ts" setup>
import type { MapMarker, MapMarkerGroup } from '@/types/Leaflet';
import type { SearchMode } from '@/types/Search';

defineProps<{
    currentSearchMode: SearchMode,
    customMarkers: MapMarker[]
}>()

const emit = defineEmits<{
    (e: 'on-category-switch', cat: MapMarkerGroup): void
}>()

function emitCategorySwitch(newCategory: MapMarkerGroup) {
    emit('on-category-switch', newCategory)
}
</script>

<template>
    <menu class="tag-list">
        <li>
            <button
                @click="emitCategorySwitch('quests')"
                class="red"
                :class="{
                    'active': currentSearchMode === 'quests'
                }"
            >
                <svg v-if="currentSearchMode === 'quests'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="40 144 96 200 224 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                <svg v-else class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M231.22,59.44l-80,168a8,8,0,1,1-14.44-6.88L165.62,160H32a8,8,0,0,1-5.88-13.43l42.56-46.1L26.59,61.9A8,8,0,0,1,32,48H224a8,8,0,0,1,7.22,11.44Z"/></svg>

                <span class="label">
                    Quêtes
                </span>
            </button>
        </li>

        <li>
            <button
                @click="emitCategorySwitch('capitals')"
                class="blue"
                :class="{
                    'active': currentSearchMode === 'capitals'
                }"
            >
                <svg v-if="currentSearchMode === 'capitals'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="40 144 96 200 224 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                <svg v-else class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M200,24h-8a16,16,0,0,0-16,16V56H148V40a16,16,0,0,0-16-16h-8a16,16,0,0,0-16,16V56H80V40A16,16,0,0,0,64,24H56A16,16,0,0,0,40,40V84.69A15.86,15.86,0,0,0,44.69,96L56,107.31V216a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16V107.31L211.31,96A15.86,15.86,0,0,0,216,84.69V40A16,16,0,0,0,200,24ZM152,216H104V152a24,24,0,0,1,48,0Z"/></svg>

                <span class="label">
                    Capitales
                </span>
            </button>
        </li>

        <li>
            <button
                @click="emitCategorySwitch('landmarks')"
                class="orange"
                :class="{
                    'active': currentSearchMode === 'landmarks'
                }"
            >
                <svg v-if="currentSearchMode === 'landmarks'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="40 144 96 200 224 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                <svg v-else class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M208,80a8,8,0,0,0-8,8v16H188.85L184,55.2A8,8,0,0,0,181.31,50h0L138.44,11.88l-.2-.17a16,16,0,0,0-20.48,0l-.2.17L74.68,50v0A7.93,7.93,0,0,0,72,55.2L67.15,104H56V88a8,8,0,0,0-16,0v24a8,8,0,0,0,8,8H65.54l-9.47,94.48A16,16,0,0,0,72,232H184a16,16,0,0,0,15.92-17.56L190.46,120H208a8,8,0,0,0,8-8V88A8,8,0,0,0,208,80ZM87.24,64h81.52l4,40H136V88a8,8,0,0,0-16,0v16H83.23ZM72,216l4.81-48H179.19L184,216Z"/></svg>

                <span class="label">
                    Points d'intérêt
                </span>
            </button>
        </li>

        <li>
            <button
                @click="emitCategorySwitch('custom')"
                class="purple"
                :class="{
                    'active': currentSearchMode === 'custom'
                }"
            >
                <svg v-if="currentSearchMode === 'custom'" class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><polyline points="40 144 96 200 224 72" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M172,120a44,44,0,1,1-44-44A44.05,44.05,0,0,1,172,120Zm60,8A104,104,0,1,1,128,24,104.11,104.11,0,0,1,232,128Zm-16,0a88.09,88.09,0,0,0-91.47-87.93C77.43,41.89,39.87,81.12,40,128.25a87.65,87.65,0,0,0,22.24,58.16A79.71,79.71,0,0,1,84,165.1a4,4,0,0,1,4.83.32,59.83,59.83,0,0,0,78.28,0,4,4,0,0,1,4.83-.32,79.71,79.71,0,0,1,21.79,21.31A87.62,87.62,0,0,0,216,128Z"/></svg>

                <span class="label">
                    Personnels
                </span>
            </button>
        </li>
    </menu>
</template>

<style lang="scss" scoped>
.tag-list {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin-top: .5rem;

    .tag-menu-move, /* apply transition to moving elements */
    .tag-menu-enter-active,
    .tag-menu-leave-active {
        transition: all 0.5s ease;
    }

    .tag-menu-enter-from,
    .tag-menu-leave-to {
        opacity: 0;
        transform: translateX(30px);
    }

    /* ensure leaving items are taken out of layout flow so that moving
    animations can be calculated correctly. */
    .tag-menu-leave-active {
        position: absolute;
    }

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
        white-space: nowrap;
        pointer-events: all;
        cursor: pointer;
        outline: .2rem solid transparent;
        transition-property: color, background-color, border-color, outline-color;
        transition-duration: .15s;
        transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);

        @media screen and (width < 900px) {
            font-size: .76em;
        }

        .icon {
            width: 1.1em;
        }

        .label {
            text-underline-offset: .15rem;
        }

        $colors: 'red', 'blue', 'orange', 'purple';

        @each $c in $colors {
            &.#{$c} {
                &.active {
                    color: var(--white);
                    background-color: var(--#{$c}-500);
                    border-color: var(--#{$c}-700);

                    .icon {
                        fill: var(--white);
                    }
                }

                &:not(.active) {
                    &:hover,
                    &:focus-visible {
                        color: var(--#{$c}-500);

                        .icon {
                            fill: var(--#{$c}-500);
                        }
                    }
                }

                &:hover,
                &:focus-visible {
                    outline-color: color-mix(in srgb, var(--#{$c}-500) 20%, transparent);
                    border-color: var(--#{$c}-500);
                    
                    .label {
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}
</style>