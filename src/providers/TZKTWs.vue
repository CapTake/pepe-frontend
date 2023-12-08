<template>
    <slot></slot>
</template>

<script setup>
import { HubConnectionBuilder } from '@microsoft/signalr'
import { onBeforeMount, provide } from 'vue'

const props = defineProps({
    contracts: Array
})

let listeners = []

const connection = new HubConnectionBuilder()
    .withUrl(import.meta.env.VITE_TZKT_WSAPI_URL)
    .build();

const init = async () => {
    await connection.start()

    for (const address of props.contracts) {
        await connection.invoke("SubscribeToOperations", { address, types: 'transaction' })
    }
}

connection.onclose(init)

const dispatch = ({ data }) => {
    if (!data) return

    for (const listener of listeners) {
        console.log('dispatching', data)
        listener(data)
    }
}

connection.on("operations", dispatch)

provide('subscribe', (fn) => {
    listeners = [...listeners.filter(listener => listener !== fn), fn]
})

provide('unsubscribe', (fn) => {
  listeners = listeners.filter(listener => listener !== fn)
})

onBeforeMount(async () => {
   await init()
})
</script>
