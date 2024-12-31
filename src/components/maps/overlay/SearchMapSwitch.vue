<template>
    <button class="btn-round">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"/><path d="M249.94,120.24l-27.05-6.76a95.86,95.86,0,0,0-80.37-80.37l-6.76-27a8,8,0,0,0-15.52,0l-6.76,27.05a95.86,95.86,0,0,0-80.37,80.37l-27,6.76a8,8,0,0,0,0,15.52l27.05,6.76a95.86,95.86,0,0,0,80.37,80.37l6.76,27.05a8,8,0,0,0,15.52,0l6.76-27.05a95.86,95.86,0,0,0,80.37-80.37l27.05-6.76a8,8,0,0,0,0-15.52Zm-44.17-11L158.6,97.4,146.8,50.23A79.88,79.88,0,0,1,205.77,109.2Zm-96.57-59L97.4,97.4,50.23,109.2A79.88,79.88,0,0,1,109.2,50.23Zm-59,96.57L97.4,158.6l11.8,47.17A79.88,79.88,0,0,1,50.23,146.8Zm96.57,59,11.8-47.17,47.17-11.8A79.88,79.88,0,0,1,146.8,205.77Z"/></svg>
    </button>
</template>

<style lang="scss" scoped>
button {
    pointer-events: all;
    cursor: pointer;
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
        outline-color: color-mix(in srgb, var(--purple-500) 20%, transparent);
        border-color: var(--purple-500);
        
        svg {
            fill: var(--purple-500);
        }
    }
}

svg {
    width: 1.15em;
}
</style>