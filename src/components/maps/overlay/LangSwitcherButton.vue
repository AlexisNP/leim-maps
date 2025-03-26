<script lang="ts" setup>
import type { Language } from '@/i18n/ui';

import { t } from '@/i18n/store';
import { switchLang } from '@/i18n/utils';

defineProps<{
    lang: Language,
    currentUrl: URL
    disabled?: boolean
}>();

const flagWidth = 18;
const flagHeight = 18;
</script>

<template>
    <a :href="switchLang(currentUrl, lang).pathname" :aria-disabled="disabled" :aria-current="disabled ? 'page' : 'false'" :tabindex="disabled ? -1 : 0">
        <div class="flag">
            <svg v-if="disabled" xmlns="http://www.w3.org/2000/svg" :height="flagHeight" :width="flagWidth" class="valid" viewBox="0 0 256 256"><path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z"></path></svg>

            <svg v-else-if="lang === 'en'" xmlns="http://www.w3.org/2000/svg" :height="flagHeight" :width="flagWidth" viewBox="0 0 36 36"><path fill="#00247D" d="M0 9.059V13h5.628zM4.664 31H13v-5.837zM23 25.164V31h8.335zM0 23v3.941L5.63 23zM31.337 5H23v5.837zM36 26.942V23h-5.631zM36 13V9.059L30.371 13zM13 5H4.664L13 10.837z"/><path fill="#CF1B2B" d="M25.14 23l9.712 6.801c.471-.479.808-1.082.99-1.749L28.627 23H25.14zM13 23h-2.141l-9.711 6.8c.521.53 1.189.909 1.938 1.085L13 23.943V23zm10-10h2.141l9.711-6.8c-.521-.53-1.188-.909-1.937-1.085L23 12.057V13zm-12.141 0L1.148 6.2C.677 6.68.34 7.282.157 7.949L7.372 13h3.487z"/><path fill="#EEE" d="M36 21H21v10h2v-5.836L31.335 31H32c1.117 0 2.126-.461 2.852-1.199L25.14 23h3.487l7.215 5.052c.093-.337.158-.686.158-1.052v-.058L30.369 23H36v-2zM0 21v2h5.63L0 26.941V27c0 1.091.439 2.078 1.148 2.8l9.711-6.8H13v.943l-9.914 6.941c.294.07.598.116.914.116h.664L13 25.163V31h2V21H0zM36 9c0-1.091-.439-2.078-1.148-2.8L25.141 13H23v-.943l9.915-6.942C32.62 5.046 32.316 5 32 5h-.663L23 10.837V5h-2v10h15v-2h-5.629L36 9.059V9zM13 5v5.837L4.664 5H4c-1.118 0-2.126.461-2.852 1.2l9.711 6.8H7.372L.157 7.949C.065 8.286 0 8.634 0 9v.059L5.628 13H0v2h15V5h-2z"/><path fill="#CF1B2B" d="M21 15V5h-6v10H0v6h15v10h6V21h15v-6z"/></svg>

            <svg v-else-if="lang === 'fr'" xmlns="http://www.w3.org/2000/svg" :height="flagHeight" :width="flagWidth" viewBox="0 0 36 36"><path fill="#ED2939" d="M36 27c0 2.209-1.791 4-4 4h-8V5h8c2.209 0 4 1.791 4 4v18z"/><path fill="#002495" d="M4 5C1.791 5 0 6.791 0 9v18c0 2.209 1.791 4 4 4h8V5H4z"/><path fill="#EEE" d="M12 5h12v26H12z"/></svg>
        </div>

        <small :class="{ 'valid': disabled }">
            {{ t(`lang.${lang}`) }}
        </small>
    </a>
</template>

<style lang="scss" scoped>
a {
    display: flex;
    align-items: center;
    gap: .75ch;
    padding-block: .25rem;
    padding-inline: .5rem;
    border-radius: .25rem;
    text-decoration: none;
    color: inherit;
    line-height: 1;
    min-width: 14ch;
    font-size: .9em;

    &:hover,
    &:focus-visible {
        background-color: var(--slate-200);
    }

    &[aria-current="page"] {
        pointer-events: none;
        cursor: default;
    }

    .flag {
        display: grid;
        place-items: center;
    }

    .valid {
        fill: var(--green-500);
        color: var(--green-500);
    }
}
</style>
