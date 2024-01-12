<script lang="ts" setup>
import { onClickOutside, onLongPress, useCssVar, useFocus, useLocalStorage, useMouse, useTimeout, useTimeoutFn } from '@vueuse/core'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const markerMenu = ref<HTMLMenuElement>()

type MenuMode = "editing-marker" | "default"

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
    mapRef?.addEventListener('contextmenu', handleContextMenu)
    // onLongPress(document.documentElement, handleLongPress, { delay: longPressDelay })
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
const markerTitle = ref<string>()
const markerTitleInput = ref<HTMLInputElement>()

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
    if (!markerTitle.value) return

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
}
</script>

<template>
    <div>
        <Transition>
            <menu v-show="shouldBeShown" ref="markerMenu">
                <li>
                    <button @click="switchMenuMode('editing-marker')">
                        Nouveau marqueur
                    </button>
                </li>
            </menu>
        </Transition>

        <dialog ref="markerModal" :class="{ 'open': markerModalOpen }" @cancel.prevent="handleMarkerModalCancel" @click="console.log">
            <form @submit.prevent="handleAddCustomMarker">
                <div class="modal-head">
                    <h2>
                        Ajouter un marqueur personnel
                    </h2>
                    <p class="modal-notice">
                        <i class="icon ph-light ph-warning"></i>
                        <span>Le marqueur sera sauvegardé mais n'apparaîtra que sur votre carte !</span>
                    </p>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="marker-name">
                            Titre
                        </label>

                        <div class="form-input">
                            <input ref="markerTitleInput" type="text" name="marker-name" id="marker-name" v-model="markerTitle">
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
                        <span>Créer</span>
                    </button>
                </div>
            </form>

            <div class="modal-actions">
                <button class="btn btn-danger btn-icon" @click="hideMarkerModal">
                    <i class="ph-light ph-x"></i>
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
            padding: .33rem 1rem;
            font-size: .77em;
            cursor: pointer;

            &:hover,
            &:focus-within {
                background-color: var(--slate-100);
            }
        }
    }
}

dialog {
    position: fixed;
    width: 30%;
    padding: 1.5rem 2rem;
    z-index: 9999;
    background-color: var(--white);
    border: 1px solid var(--slate-400);
    border-radius: .75rem;
    box-shadow: rgba(0, 0, 0, 0.3) 0px 4px 12px;
    overflow: visible;
    transform: translateY(1rem);
    transition: visibility 0s ease-out .3s, opacity .3s ease-out, transform .3s ease-out;

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
                font-size: 1.3em;
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