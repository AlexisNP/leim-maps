<script setup lang="ts">
import { isVNode, onMounted } from "vue"
import { ToastLifetime, useToast, type Toast } from './useToast.ts'
import { ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'radix-vue'

const { toast, toasts } = useToast()
import { t } from '@/i18n/store';

onMounted(() => {
    window.addEventListener('on-toast-push', (e) => handleInserted(e as CustomEvent))
})

function handleInserted(e: CustomEvent) {
    if ( e.detail.preset) {
        switch (e.detail.preset) {
            case "copied-coords":
            default:
                toast({
                    description: t('toast.copyCoords.description'),
                    duration: ToastLifetime.SHORT,
                    variant: 'success'
                })
            break
        }

        return
    }

    const toastData = e.detail.toast as Toast

    toast(toastData)
}

function handleUpdate(id: string) {
    toasts.value.forEach((t, i) => {
        if (t.id === id) {
            t.open = false

            setTimeout(() => {
                toasts.value.splice(i, 1)
            }, 5000)
        }
    })
}
</script>

<template>
    <ToastProvider>
        <ToastRoot
            class="toast-root"
            :class="toast.variant ? `toast-${toast.variant}` : ''"
            v-for="toast in toasts"
            :key="toast.id"
            v-bind="toast"
            @update:open="handleUpdate(toast.id)"
        >
            <ToastTitle class="toast-title" v-if="toast.title">
                {{ toast.title }}
            </ToastTitle>
            <template v-if="toast.description">
                <ToastDescription class="toast-description" v-if="isVNode(toast.description)">
                    <component :is="toast.description" />
                </ToastDescription>
                <ToastDescription v-else class="toast-description">
                    {{ toast.description }}
                </ToastDescription>
            </template>
        </ToastRoot>

        <ToastViewport class="toast-viewport"/>
    </ToastProvider>
</template>
