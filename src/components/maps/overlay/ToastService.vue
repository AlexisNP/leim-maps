<script setup lang="ts">
import { isVNode } from "vue"
import { useToast } from './useToast.ts'
import { ToastDescription, ToastProvider, ToastRoot, ToastTitle, ToastViewport } from 'radix-vue'

const { toasts } = useToast()

function handleUpdate(id: string) {
    toasts.value.forEach((t, i) => {
        if (t.id === id) {
            t.open = false

            setTimeout(() => {
                toasts.value.splice(i, 1)
            }, 3000)
        }
    })
}
</script>

<template>
    <ToastProvider>
        <ToastRoot
            class="toast-root"
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
