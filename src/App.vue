<template>
  <WalletProvider>
    <top-nav></top-nav>
    <RouterView class="mt-24"/>
  </WalletProvider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import WalletProvider from './providers/TezosWallet.vue'
import TopNav from './components/TopNav.vue'

// const isDark = useDark()
</script>