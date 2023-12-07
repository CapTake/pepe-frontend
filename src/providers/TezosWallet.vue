<template>
    <slot></slot>
</template>

<script setup>
import { BeaconWallet } from '@taquito/beacon-wallet'
import { MichelCodecPacker, TezosToolkit } from '@taquito/taquito'
// import { TzktExtension } from '@tzkt/ext-taquito'
// import { Tzip12Module } from '@taquito/tzip12'
// import { Tzip16Module } from '@taquito/tzip16'
import { reactive, onBeforeMount, provide } from 'vue'
import { useDark } from '@vueuse/core'

const Tezos = new TezosToolkit(import.meta.env.VITE_TEZOS_RPC_URL)
// Tezos.addExtension(new TzktExtension({ url: import.meta.env.VITE_TZKT_API_URL }))
// Tezos.addExtension(new Tzip12Module())
// Tezos.addExtension(new Tzip16Module())
Tezos.setPackerProvider(new MichelCodecPacker())

const isDark = useDark()

const wallet = new BeaconWallet({
  name: import.meta.env.VITE_DAPP_NAME,
  preferredNetwork: import.meta.env.VITE_TEZOS_NETWORK,
  colorMode: isDark.value ? 'dark' : 'light'
})

Tezos.setWalletProvider(wallet)

const requestPermissions = async () => {
  return await wallet.requestPermissions({
        network: {
            type: import.meta.env.VITE_TEZOS_NETWORK
        }
    })
}

const getActiveAccount = async () => {
  const activeAccount = await wallet.client.getActiveAccount()

  return activeAccount
}

const connectWallet = async () => {
    try {
        console.log('connect')
        if (connection.connecting) return

        connection.connecting = true

        if (!connection.address) {

            let account = await getActiveAccount()

            if (!account) {
                await requestPermissions()

                account = await getActiveAccount()
            }

            connection.address = account?.address
        }
    } catch (e) {
        console.error(e)
    } finally {
        connection.connecting = false
    }
}

const disconnectWallet = async () => {
    try {
        connection.connecting = true

        await wallet.clearActiveAccount()

        connection.address = null
    } catch (e) {
        console.error(e)
    } finally {
        connection.connecting = false
    }
}

const connection = reactive({
    address: null,
    client: Tezos,
    connecting: false
})

provide('walletConnection', connection)

provide('connectWallet', connectWallet)

provide('disconnectWallet', disconnectWallet)

onBeforeMount(async () => {
    try {
        connection.connecting = true

        const account = await getActiveAccount()

        if (account) {
            connection.address = account.address
        }
    } catch (e) {
        console.log(e)
    } finally {
        connection.connecting = false
    }
})

</script>
