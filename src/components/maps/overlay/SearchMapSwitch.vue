<script lang="ts" setup>
import { computed, onUpdated, ref, watch } from 'vue';
import { useElementHover, useFocus } from '@vueuse/core'
import { PopoverArrow, PopoverContent, PopoverRoot, PopoverTrigger } from 'radix-vue'
import { useStore } from '@nanostores/vue';

import { currentLang } from '@/i18n/store';
import { t } from '@/i18n/store';

const $currentLang = useStore(currentLang);

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

interface Menu {
    name: string,
    items: MenuItem[]
}

interface MenuItem {
    name: string,
    img: string,
    url: string,
    newItem?: boolean
}

const menus: Menu[] = [
    {
        name: t('continents'),
        items: [
            {
                name: 'Aldys',
                img: '/images/aldys-cover.png',
                url: `/${$currentLang.value}/`
            },
            {
                name: 'Bamast',
                img: '/images/bamast-cover.png',
                url: `/${$currentLang.value}/bamast`
            }
        ]
    },
    {
        name: t('cities'),
        items: [
            {
                name: 'Borélis',
                img: '/images/aldys-borelis-cover.png',
                url: `/${$currentLang.value}/aldys/borelis`
            },
            {
                name: 'Cantane',
                img: '/images/aldys-cantane-cover.png',
                url: `/${$currentLang.value}/aldys/cantane`
            },
        ]
    },
    {
        name: t('others'),
        items: [
            {
                name: 'Mines Blanches',
                img: '/images/aldys-cantane-mines-blanches-cover.png',
                url: `/${$currentLang.value}/aldys/cantane/mines-blanches`,
                newItem: true
            },
        ]
    }
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
            <PopoverContent side="bottom" :side-offset="6" :collision-padding="16" class="card" style="z-index: 100;">
                <PopoverArrow class="card-arrow" />

                <template v-for="menu in menus">
                    <div class="menu-title">
                        {{ menu.name }}
                    </div>

                    <menu class="map-menu">
                        <li v-for="item in menu.items" :key="item.name">
                            <a
                                :href="item.url"
                                :class="{ 'active': url?.pathname === item.url }"
                                :tabindex="url?.pathname === item.url ? -1 : 0"
                                :title="item.newItem ? 'Nouveau' : ''"
                            >
                                <figure>
                                    <div class="img-wrapper">
                                        <img :src="item.img" alt="" width="40" height="40" loading="eager">

                                        <svg v-if="item.newItem" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 256 256">
                                            <path class="fill" d="M112.1,255c-3.6,0-7.2-.6-10.7-1.9-8.5-3.1-15.2-9.8-18.3-18.3l-16.7-45.1-45.1-16.6c-16-5.9-24.2-23.7-18.3-39.7,3.1-8.5,9.8-15.2,18.3-18.3l45.1-16.7,16.6-45.1c4.5-12.1,16.1-20.2,29-20.2s7.2.6,10.7,1.9c2.3.8,4.5,1.9,6.5,3.3,1-11.8,10.9-21.1,22.9-21.1h1v-1c0-12.7,10.3-23,23-23s23,10.3,23,23v1h1c12.7,0,23,10.3,23,23s-.7,6.4-1.9,9.2c1-.1,1.9-.2,2.9-.2,10.5,0,19.5,7.1,22.2,16.8,9.7,2.7,16.8,11.6,16.8,22.2s-7.1,19.5-16.8,22.2c-2.7,9.7-11.6,16.8-22.2,16.8s-4.6-.3-6.7-1c3.7,5.2,5.7,11.4,5.7,18,0,12.9-8.1,24.6-20.3,29l-45.1,16.6-16.6,45.1c-4.5,12.1-16.1,20.2-29,20.2ZM202.8,114.9c.4.2.8.3,1.2.5-.9-1.6-1.7-3.4-2.2-5.2-9.7-2.7-16.8-11.6-16.8-22.2s0-2,.2-2.9c-2.8,1.2-5.9,1.9-9.2,1.9-12.7,0-23-10.3-23-23v-1h-1c-2.8,0-5.5-.5-7.9-1.4l13.6,36.7,45.1,16.6ZM199,64c0,1,0,2-.2,2.9,1-.4,2-.8,3-1.1.3-1,.6-2,1.1-3-1,.1-1.9.2-2.9.2h-1v1Z"/>
                                            <path class="stroke" d="M176,8c4.4,0,8,3.6,8,8v16h16c4.4,0,8,3.6,8,8s-3.6,8-8,8h-16v16c0,4.4-3.6,8-8,8s-8-3.6-8-8v-16h-16c-4.4,0-8-3.6-8-8s3.6-8,8-8h16v-16c0-4.4,3.6-8,8-8M111.9,48c1.8,0,3.7.3,5.5,1,4.4,1.6,7.8,5.1,9.4,9.4l19.1,51.6,51.6,19c6.3,2.3,10.5,8.3,10.4,15,0,6.7-4.1,12.7-10.4,14.9l-51.6,19.1-19,51.6c-2.4,6.4-8.5,10.4-14.9,10.4s-3.7-.3-5.5-1c-4.4-1.6-7.8-5.1-9.4-9.4l-19.1-51.6-51.6-19c-8.3-3-12.5-12.2-9.4-20.4,1.6-4.4,5.1-7.8,9.4-9.4l51.6-19.1,19-51.6c2.4-6.4,8.5-10.4,14.9-10.4M224,64c4.4,0,8,3.6,8,8v8h8c4.4,0,8,3.6,8,8s-3.6,8-8,8h-8v8c0,4.4-3.6,8-8,8s-8-3.6-8-8v-8h-8c-4.4,0-8-3.6-8-8s3.6-8,8-8h8v-8c0-4.4,3.6-8,8-8M176-22c-16.7,0-31,10.9-36,26-8,2.7-14.8,7.9-19.5,14.8-2.8-.5-5.7-.8-8.6-.8h0c-19.2,0-36.5,12.1-43.1,30.1l-14.2,38.7-38.6,14.3c-12.6,4.7-22.6,14.6-27.2,27.2-8.7,23.8,3.5,50.2,27.2,59l38.7,14.2,14.3,38.7c4.7,12.6,14.6,22.5,27.2,27.2,5.1,1.9,10.4,2.8,15.9,2.8,19.2,0,36.5-12.1,43.1-30.1l14.2-38.6,38.5-14.2c18-6.6,30.1-23.8,30.1-43,0-1.6,0-3.1-.2-4.7,8.6-3.3,15.6-9.7,19.9-17.8,12.1-6.4,20.4-19.1,20.4-33.6s-8.3-27.3-20.4-33.6c-4.2-8-11.3-14.4-19.8-17.7-1.4-15.3-11.8-28-25.8-32.7-5-15.1-19.3-26-36-26h0Z"/>
                                        </svg>
                                    </div>

                                    <figcaption>
                                        {{ item.name }}
                                    </figcaption>
                                </figure>
                            </a>
                        </li>
                    </menu>
                </template>
            </PopoverContent>
        </PopoverRoot>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    pointer-events: all;

    @media screen and (width < 900px) {
        position: absolute;
    }
}

.menu-title {
    font-size: .9em;
    font-weight: 600;
    margin-bottom: .25rem;
    margin-left: .25rem;
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
                border-width: .15rem;
                border-color: var(--blue-300);
                filter: grayscale(50%);
            }
        }
    }

    figure {
        position: relative;
        display: grid;
        justify-items: center;
        gap: .25rem;

        .img-wrapper {
            position: relative;

            img {
                display: block;
                border-radius: .3rem;
                border: .1rem solid var(--white);
                outline: .15rem solid transparent;
            }

            svg {
                position: absolute;
                top: -0.3rem;
                right: -0.3rem;
                width: 1.15em;
                z-index: 10;
                pointer-events: none;

                .fill { fill: var(--orange-500); }
                .stroke { fill: var(--white); }
            }
        }

        figcaption {
            font-size: .75em;
            text-align: center;
            color: var(--slate-500);
        }
    }
}
</style>