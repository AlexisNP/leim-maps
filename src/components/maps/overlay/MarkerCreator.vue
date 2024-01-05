<script lang="ts" setup>
import { onClickOutside, onLongPress, useCssVar, useLocalStorage, useMouse, useTimeout, useTimeoutFn } from '@vueuse/core';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const markerMenu = ref<HTMLMenuElement>();

/**
 * Appearing behaviour
 */
const isActive = ref<Boolean>(false)

// const hasBeenLongPressed = ref<Boolean>(false)
// const longPressDelay = 500
// const longPressOver = 1000

// const longPressTimer = useTimeoutFn(() => {
//     hasBeenLongPressed.value = false
// }, longPressOver)

onMounted(() => {
    window.addEventListener('contextmenu', handleContextMenu)
    // onLongPress(document.documentElement, handleLongPress, { delay: longPressDelay })
    onClickOutside(markerMenu, handleClickOutside)
})

// function handleLongPress(e: Event) {
//     hasBeenLongPressed.value = true
//     longPressTimer.start()

//     showMenu()
// }

function handleClickOutside(e: Event) {
    // if (!hasBeenLongPressed.value) {
        hideMenu()
    // }
}

function handleContextMenu(e: Event) {
    e.preventDefault()

    showMenu()
    updateMenuPosition()
}

function showMenu() {
    isActive.value = true
}

function hideMenu() {
    isActive.value = false
}

/**
 * Positioning
 */
const mouse = useMouse()
const mouseXVar = useCssVar('--mouse-x', markerMenu)
const mouseYVar = useCssVar('--mouse-y', markerMenu)

watch( isActive, (o, n) => {
    // If new value is active
    if (o) {
        updateMenuPosition()
    }
})

function updateMenuPosition() {
    updateCSSVars()
}

function updateCSSVars() {
    mouseXVar.value = `${mouse.x.value.toFixed()}px`
    mouseYVar.value = `${mouse.y.value.toFixed()}px`
}

/**
 * Adding custom marker
 */
const lastHeldXPosition = useLocalStorage('lastHeldXPosition', 0);
const lastHeldYPosition = useLocalStorage('lastHeldYPosition', 0);

const addCustomMarker = ref<HTMLButtonElement>();

onMounted(() => {
    const addCustomMarkerEvent = new CustomEvent(`add-custom-marker`, { bubbles: true })

    addCustomMarker.value?.addEventListener('click', () => {
        addCustomMarker.value?.dispatchEvent(addCustomMarkerEvent)
    })
})
</script>

<template>
    <Transition>
        <menu v-show="isActive" ref="markerMenu">
            <li>
                <button ref="addCustomMarker">
                    Ajouter un marqueur personnel
                </button>
            </li>
        </menu>
    </Transition>
</template>

<style lang="scss" scoped>
menu {
    --mouse-y: 0px;
    --mouse-x: 0px;

    position: absolute;
    top: calc(var(--mouse-y) - .5rem);
    left: calc(var(--mouse-x) + .75rem);
    background-color: var(--white);
    border: 1px solid var(--slate-400);
    border-radius: .3rem;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 12px;
    z-index: 1000;
    transition-property: top, left;
    transition-duration: .16s;
    transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);

    li {
        a, button {
            display: block;
            padding: .5rem 1.2rem;
            font-size: .8em;
            cursor: pointer;

            &:hover,
            &:focus-within {

            }
        }
    }
}

/**
* ANIMATIONS
*/
.v-enter-active,
.v-leave-active {
  transition: all .16s cubic-bezier(0.445, 0.05, 0.55, 0.95);
}

.v-enter-from,
.v-leave-to {
    transform: translateY(.5rem);
    opacity: 0;
}
</style>