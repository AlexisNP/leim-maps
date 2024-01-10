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
        <TransitionGroup name="tag-menu">
            <li>
                <button
                    @click="emitCategorySwitch('quests')"
                    class="red"
                    :class="{
                        'active': currentSearchMode === 'quests'
                    }"
                >
                    <span class="icon">
                        <i v-if="currentSearchMode === 'quests'" class="ph-bold ph-check"></i>
                        <i v-else class="ph-fill ph-flag-banner"></i>
                    </span>
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
                    <span class="icon">
                        <i v-if="currentSearchMode === 'capitals'" class="ph-bold ph-check"></i>
                        <i v-else class="ph-fill ph-castle-turret"></i>
                    </span>
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
                    <span class="icon">
                        <i v-if="currentSearchMode === 'landmarks'" class="ph-bold ph-check"></i>
                        <i v-else class="ph-fill ph-lighthouse"></i>
                    </span>
                    <span class="label">
                        Points d'intérêt
                    </span>
                </button>
            </li>

            <li v-if="customMarkers.length > 0">
                <button
                    @click="emitCategorySwitch('custom')"
                    class="purple"
                    :class="{
                        'active': currentSearchMode === 'custom'
                    }"
                >
                    <span class="icon">
                        <i v-if="currentSearchMode === 'custom'" class="ph-bold ph-check"></i>
                        <i v-else class="ph-fill ph-user-circle"></i>
                    </span>
                    <span class="label">
                        Personnels
                    </span>
                </button>
            </li>
        </TransitionGroup>
    </menu>
</template>

<style lang="scss" scoped>
.tag-list {
    display: flex;
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
            font-size: 1.1em;
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
                }

                &:not(.active) {
                    &:hover,
                    &:focus-visible {
                        color: var(--#{$c}-500);
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