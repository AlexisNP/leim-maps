/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
    readonly ENABLE_TOOLBAR: boolean
    readonly ENABLE_TOOLBAR_TAGS: boolean
    readonly ENABLE_CUSTOM_MARKERS: boolean
    readonly ENABLE_BREADCRUMB: boolean
    readonly ENABLE_I18N: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}