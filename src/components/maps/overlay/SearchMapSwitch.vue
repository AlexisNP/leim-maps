<script lang="ts" setup>
import { PopoverArrow, PopoverContent, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { computed, onUpdated, ref, watch } from 'vue';
import { useElementHover, useFocus } from '@vueuse/core'

const navModel = ref(false);

const wrapper = ref<HTMLDivElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const wrapperHovered = useElementHover(wrapper, { delayEnter: 500, delayLeave: 500 })
const { focused: buttonFocused } = useFocus(buttonRef)

const isNavOpened = computed(() => navModel.value || wrapperHovered.value)

watch([wrapperHovered, buttonFocused], (value) => {
    // Check if all values from array are false
    if (!value.some(Boolean)) {
        navModel.value = false
    }
})

let url: URL | null = null;

onUpdated(() => {
    url = new URL(window.location.href)
})

interface MenuItem {
    name: string,
    img: string,
    url: string
}

const worldMenuItems: MenuItem[] = [
    {
        name: 'Aldys',
        img: '/images/aldys-cover.png',
        url: '/'
    },
    {
        name: 'Bamast',
        img: '/images/bamast-cover.png',
        url: '/bamast'
    }
]

const cityMenuItems: MenuItem[] = [
    // {
    //     name: 'Ambrose',
    //     img: '/images/aldys-cover.png',
    //     url: '/aldys/ambrose'
    // },
    {
        name: 'Borélis',
        img: '/images/aldys-cover.png',
        url: '/aldys/borelis'
    },
    {
        name: 'Cantane',
        img: '/images/aldys-cover.png',
        url: '/aldys/cantane'
    },
]
</script>

<template>
    <div class="wrapper" ref="wrapper">
        <PopoverRoot :open="isNavOpened" @update:open="() => navModel = true">
            <PopoverTrigger as-child>
                <button ref="buttonRef" class="btn-round" :class="{ 'active': isNavOpened }">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M228.92,49.69a8,8,0,0,0-6.86-1.45L160.93,63.52,99.58,32.84a8,8,0,0,0-5.52-.6l-64,16A8,8,0,0,0,24,56V200a8,8,0,0,0,9.94,7.76l61.13-15.28,61.35,30.68A8.15,8.15,0,0,0,160,224a8,8,0,0,0,1.94-.24l64-16A8,8,0,0,0,232,200V56A8,8,0,0,0,228.92,49.69ZM96,176a8,8,0,0,0-1.94.24L40,189.75V62.25L95.07,48.48l.93.46Zm120,17.75-55.07,13.77-.93-.46V80a8,8,0,0,0,1.94-.23L216,66.25Z"/></svg>
                </button>
            </PopoverTrigger>
            <PopoverContent side="bottom" :side-offset="6" :collision-padding="10" class="card" style="z-index: 100;">
                <PopoverArrow class="card-arrow" />

                <div class="menu-title">
                    Continents
                </div>

                <menu class="map-menu">
                    <li v-for="item in worldMenuItems" :key="item.name">
                        <a :href="item.url" :class="{ 'active': url?.pathname === item.url }" :tabindex="url?.pathname === item.url ? -1 : 0">
                            <figure>
                                <img :src="item.img" alt="" width="40" height="40" loading="eager">

                                <figcaption>
                                    {{ item.name }}
                                </figcaption>
                            </figure>
                        </a>
                    </li>
                </menu>

                <div class="menu-title">
                    Villes
                </div>

                <menu class="map-menu">
                    <li v-for="item in cityMenuItems" :key="item.name">
                        <a :href="item.url" :class="{ 'active': url?.pathname === item.url }" :tabindex="url?.pathname === item.url ? -1 : 0">
                            <figure>
                                <img :src="item.img" alt="" width="40" height="40" loading="eager">

                                <figcaption>
                                    {{ item.name }}
                                </figcaption>
                            </figure>
                        </a>
                    </li>
                </menu>
            </PopoverContent>
        </PopoverRoot>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    pointer-events: all;

    @media screen and (width < 900px) {
        position: absolute;
        top: 10px;
        left: 10px;
    }
}

button {
    cursor: pointer;
}

.menu-title {
    font-size: .9em;
    font-weight: 600;
    margin-bottom: .25rem;
    margin-left: .25rem;
}

.btn-round {
    display: grid;
    place-items: center;
    height: 45px;
    aspect-ratio: 1;
    background-color: var(--white);
    border: 1px solid var(--slate-400);
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    border-radius: 100vmax;
    pointer-events: all;
    outline: .2rem solid transparent;
    transition-property: color, background-color, border-color, outline-color;
    transition-duration: .15s;
    transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);

    svg {
        transition-property: fill;
        transition-duration: .15s;
        transition-timing-function: cubic-bezier(0.445, 0.05, 0.55, 0.95);
    }

    &:hover,
    &:focus-visible {
        outline-color: color-mix(in srgb, var(--blue-500) 20%, transparent);
        border-color: var(--blue-500);
        
        svg {
            fill: var(--blue-500);
        }
    }

    &.active {
        color: var(--white);
        background-color: var(--blue-500);
        border-color: var(--blue-700);

        svg {
            fill: var(--white);
        }
    }
}

svg {
    width: 1.15em;
}

.map-menu {
    margin-top: .25rem;
    margin-bottom: .5rem;
    margin-inline: .25rem;
    display: flex;
    gap: 1rem;

    a {
        &:hover,
        &:focus-visible {
            figure img {
                outline-color: var(--blue-500);
            }
        }

        &.active {
            pointer-events: none;

            figure img {
                border-width: .1rem;
                border-color: var(--blue-500);
            }
        }
    }

    figure {
        display: grid;
        justify-items: center;
        gap: .25rem;

        img {
            display: block;
            border-radius: .3rem;
            border: .1rem solid var(--white);
            outline: .15rem solid transparent;
        }

        figcaption {
            font-size: .75em;
            text-align: center;
            opacity: .75;
        }
    }
}
</style>