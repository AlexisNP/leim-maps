<script lang="ts" setup>
import { computed, onUpdated, ref, watch } from 'vue';
import { useElementHover, useFocus } from '@vueuse/core'
import { PopoverArrow, PopoverContent, PopoverRoot, PopoverTrigger } from 'radix-vue'

import LangSwitcherButton from './LangSwitcherButton.vue';

import { useStore } from '@nanostores/vue';
import { currentLang, t } from '@/i18n/store';
import { availableLangs } from '@/i18n/ui';

const $currentLang = useStore(currentLang);

defineProps({
    currentUrl: {
        type: URL,
        required: true
    }
});

const menuModel = ref(false);

const wrapper = ref<HTMLDivElement | null>(null)
const buttonRef = ref<HTMLButtonElement | null>(null)
const wrapperHovered = useElementHover(wrapper, { delayEnter: 500, delayLeave: 500 })
const { focused: buttonFocused } = useFocus(buttonRef)

const isMenuOpen = computed(() => menuModel.value || wrapperHovered.value)

watch([wrapperHovered, buttonFocused], (value) => {
    // Check if all values from array are false
    if (!value.some(Boolean)) {
        menuModel.value = false
    }
})
</script>

<template>
    <div ref="wrapper" class="wrapper appear-from-top">
        <PopoverRoot :open="isMenuOpen" @update:open="() => menuModel = true">
            <PopoverTrigger as-child>
                <button ref="buttonRef" class="btn-round" :title="t('nav.lang.aria-label')" :class="{ 'active': isMenuOpen }">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#000000" viewBox="0 0 256 256"><path d="M247.15,212.42l-56-112a8,8,0,0,0-14.31,0l-21.71,43.43A88,88,0,0,1,108,126.93,103.65,103.65,0,0,0,135.69,64H160a8,8,0,0,0,0-16H104V32a8,8,0,0,0-16,0V48H32a8,8,0,0,0,0,16h87.63A87.76,87.76,0,0,1,96,116.35a87.74,87.74,0,0,1-19-31,8,8,0,1,0-15.08,5.34A103.63,103.63,0,0,0,84,127a87.55,87.55,0,0,1-52,17,8,8,0,0,0,0,16,103.46,103.46,0,0,0,64-22.08,104.18,104.18,0,0,0,51.44,21.31l-26.6,53.19a8,8,0,0,0,14.31,7.16L148.94,192h70.11l13.79,27.58A8,8,0,0,0,240,224a8,8,0,0,0,7.15-11.58ZM156.94,176,184,121.89,211.05,176Z"></path></svg>
                </button>
            </PopoverTrigger>
            <PopoverContent side="bottom" :side-offset="6" :collision-padding="16" class="card p-sm" style="z-index: 100;">
                <PopoverArrow class="card-arrow" />

                <menu>
                    <li v-for="lang in availableLangs" :key="lang">
                        <LangSwitcherButton :lang="lang" :currentUrl="currentUrl" :disabled="$currentLang === lang" />
                    </li>
                </menu>
            </PopoverContent>
        </PopoverRoot>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    pointer-events: all;
}

.btn-round {
    position: relative;

    > svg {
        width: 1.25em;
        height: 1.25em;
    }
}
</style>
