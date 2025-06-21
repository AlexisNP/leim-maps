<script lang="ts" setup>
import type { MapMarker } from '@/types/Leaflet';
import { onClickOutside, useCssVar, useLocalStorage, useMouse } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'

import { t } from '@/i18n/store';

const markerMenu = ref<HTMLMenuElement>()

type MenuMode = "editing-marker" | "default"

const props = defineProps<{
    mapKey?: string
}>()

const customMarkersKey = props.mapKey ? `custom-markers-${props.mapKey}` : 'custom-markers'

/**
 * Appearing behaviour
 */
const isActive = ref<Boolean>(false)
const shouldBeShown = computed(() => isActive.value)
const currentMode = ref<MenuMode>("default")

function switchMenuMode(newMode: MenuMode) {
    currentMode.value = newMode
}

// const hasBeenLongPressed = ref<Boolean>(false)
// const longPressDelay = 500
// const longPressOver = 1000

// const longPressTimer = useTimeoutFn(() => {
//     hasBeenLongPressed.value = false
// }, longPressOver)

onMounted(() => {
    const mapRef = document.getElementById('world')

    if (mapRef) {
        mapRef.addEventListener('contextmenu', handleContextMenu)
        mapRef.addEventListener('mousedown', hideMenu)
    }
})


function handleClickOutside(e: Event) {
    hideMenu()
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
const markerTitle = ref<string>()
const markerTitleInput = ref<HTMLInputElement>()

const markerTitleInputError = ref<Error | null>()

// Data from localStorage
const customMarkersData = useLocalStorage(customMarkersKey, [])

// Refresh from localStorage
onMounted(() => {
    customMarkersData.value = useLocalStorage(customMarkersKey, []).value

    document.addEventListener('refresh-custom-markers', () => {
        customMarkersData.value = useLocalStorage(customMarkersKey, []).value
    })
})

const addCustomMarker = ref<HTMLButtonElement>();

const markerModal = ref<HTMLDialogElement>()
const markerModalOpen = ref<boolean>(false)

// Shows modal if mode changes to editing-marker
watch(currentMode, (n, o) => {
    if (n === 'editing-marker') {
        showMarkerModal()
    } else {
        hideMarkerModal()
    }
})

// Closes the menu if clicked outside
onClickOutside(markerMenu, handleClickOutside, { ignore: [markerModal] })

/**
 * Add Custom Marker
 */
function handleAddCustomMarker() {
    // If title is empty, don't add anything
    if (!markerTitle.value) return

    // If marker of the same name already exists, don't add anything
    if (
        customMarkersData.value.find((cm: MapMarker) => cm.title === markerTitle.value)
    ) {
        setTitleError(new Error('Ce titre est déjà utilisé par un marqueur !'))
        return
    }


    const addCustomMarkerEvent = new CustomEvent(
        `add-custom-marker`,
        {
            bubbles: true,
            detail: { title: markerTitle.value }
        }
    )

    addCustomMarker.value?.dispatchEvent(addCustomMarkerEvent)
    hideMenu()
    hideMarkerModal()
    switchMenuMode('default')

    markerTitle.value = ""
    setTitleError(null)
}

/**
 * Hide modal on cancel and resets 
 */
function handleMarkerModalCancel() {
    showMenu()
    hideMarkerModal()
    switchMenuMode('default')
}

/**
 * Display marker modal
 */
function showMarkerModal() {
    markerModal.value?.showModal()
    markerModalOpen.value = true
    switchMenuMode('editing-marker')
}

/**
 * Hide marker modal
 * TODO: Implement a timer for animation
 */
function hideMarkerModal() {
    markerModal.value?.close()
    markerModalOpen.value = false
    switchMenuMode('default')

    markerTitle.value = ""
    setTitleError(null)
}

function setTitleError(error: Error | null) {
    markerTitleInputError.value = error
}

function handleCoordsCopy() {
    markerMenu.value?.dispatchEvent(new CustomEvent('on-copy-coords', { bubbles: true }))
    hideMenu()
}
</script>

<template>
    <div>
        <Transition>
            <menu v-show="shouldBeShown" ref="markerMenu">
                <li>
                    <button @click="switchMenuMode('editing-marker')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M128,16a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm32,96H136v24a8,8,0,0,1-16,0V112H96a8,8,0,0,1,0-16h24V72a8,8,0,0,1,16,0V96h24a8,8,0,0,1,0,16Z"></path></svg>

                        <span>{{ t('maps.markers.new') }}</span>
                    </button>
                </li>
                <li>
                    <button @click="handleCoordsCopy">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000000" viewBox="0 0 256 256"><path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32Zm-8,128H176V88a8,8,0,0,0-8-8H96V48H208Z"></path></svg>
                        
                        <span>{{ t('maps.copyCoords') }}</span>
                    </button>
                </li>
            </menu>
        </Transition>

        <dialog ref="markerModal" :class="{ 'open': markerModalOpen }" @cancel.prevent="handleMarkerModalCancel">
            <form @submit.prevent="handleAddCustomMarker">
                <div class="modal-head">
                    <h2>
                        {{ t('maps.markers.addPersonal') }}
                    </h2>
                    <p class="modal-notice">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="icon"><rect width="256" height="256" fill="none"/><path d="M142.41,40.22l87.46,151.87C236,202.79,228.08,216,215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22C119.89,29.26,136.11,29.26,142.41,40.22Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/><line x1="128" y1="144" x2="128" y2="104" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="12"/><circle cx="128" cy="180" r="10"/></svg>
                        <span>{{ t('maps.markers.newNotice') }}</span>
                    </p>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="marker-name">
                            {{ t('common.title') }}
                        </label>

                        <div class="form-input">
                            <input ref="markerTitleInput" type="text" name="marker-name" id="marker-name" v-model="markerTitle">

                            <div class="form-error" v-if="markerTitleInputError">
                                {{ markerTitleInputError.message }}
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <button
                        ref="addCustomMarker"
                        type="submit"
                        class="btn btn-secondary"
                        :disabled="!markerTitle"
                    >
                        <span>{{ t('common.create') }}</span>
                    </button>
                </div>
            </form>

            <div class="modal-actions">
                <button class="btn btn-danger btn-icon btn-shadow" @click="hideMarkerModal">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" class="icon"><rect width="256" height="256" fill="none"/><line x1="200" y1="56" x2="56" y2="200" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><line x1="200" y1="200" x2="56" y2="56" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                </button>
            </div>
        </dialog>
    </div>
</template>

<style lang="scss" scoped>
menu {
    --mouse-y: 0px;
    --mouse-x: 0px;

    position: absolute;
    padding-block: .25rem;
    top: calc(var(--mouse-y) - .5rem);
    left: calc(var(--mouse-x) + .75rem);
    color: var(--foreground);
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: .3rem;
    box-shadow: var(--shadow);
    z-index: 1000;
    transition-property: top, left;
    transition-duration: .16s;
    transition-timing-function: cubic-bezier(0.785, 0.135, 0.15, 0.86);

    li {
        a, button {
            display: flex;
            gap: .75ch;
            align-items: center;
            padding: .33rem 1rem;
            padding-left: .66rem;
            font-size: .77em;
            cursor: pointer;
            width: 100%;

            svg {
                fill: var(--foreground);
            }

            &:hover,
            &:focus-within {
                color: color-mix(in srgb, var(--accent) 90%, var(--background));
                background-color: color-mix(in srgb, var(--accent) 10%, var(--background));

                svg {
                    fill: color-mix(in srgb, var(--accent) 75%, var(--background));
                }
            }
        }
    }
}

dialog {
    position: fixed;
    max-width: calc(100% - 6rem);
    padding: 1.5rem 2rem;
    z-index: 9999;
    color: var(--foreground);
    background-color: var(--background);
    border: 1px solid var(--border);
    border-radius: .75rem;
    box-shadow: var(--shadow);
    overflow: visible;
    transform: translateY(1rem);
    transition: visibility 0s ease-out .3s, opacity .3s ease-out, transform .3s ease-out;

    @media screen and (width >= 900px) {
        width: 50%;
    }

    &,
    &::backdrop {
        visibility: hidden;
        opacity: 0;
    }

    &::backdrop {
        backdrop-filter: blur(1px);
    }

    &.open {
        transform: translateY(0);
    }

    &.open,
    &.open::backdrop {
        transition-delay: 0s;
    }

    &.open,
    &.open::backdrop {
        visibility: visible;
        opacity: 1;
    }

    .modal-head {
        margin-bottom: .75rem;

        h2 {
            font-size: 1.4em;
        }

        .modal-notice {
            margin-top: .2rem;
            display: flex;
            align-items: center;
            gap: .15rem;
            opacity: .85;
            font-size: .8em;

            .icon {
                width: 1.3em;
            }
        }
    }

    .modal-body {
        > * + * {
            margin-top: .5em;
        }
    }

    .modal-footer {
        margin-top: 1rem;
    }

    .modal-actions {
        display: flex;
        gap: 1rem;
        position: absolute;
        top: -0.8rem;
        right: 0;
        padding-right: .75rem;
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