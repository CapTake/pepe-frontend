<template>
  <WalletProvider>
    <TZKTWs :contracts="contracts">
      <top-nav></top-nav>
      <RouterView class="pt-32 min-h-screen"/>
      <bot-nav></bot-nav>
    </TZKTWs>
  </WalletProvider>
</template>

<script setup>
import { RouterView } from 'vue-router'
import WalletProvider from './providers/TezosWallet.vue'
import TopNav from './components/TopNav.vue'
import BotNav from './components/BotNav.vue'
import TZKTWs from './providers/TZKTWs.vue'

const contracts = [
  import.meta.env.VITE_CROWDSALE,
  import.meta.env.VITE_NFT,
  import.meta.env.VITE_GAME,
  import.meta.env.VITE_BATTLE_ROYALE,
]

// const isDark = useDark()
</script>

<style>
body {
  margin: 0;
  padding: 0;

}
</style>