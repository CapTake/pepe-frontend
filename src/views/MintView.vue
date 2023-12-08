<template>
    <div>
        <MintMap :items="sale.available" class="w-[500px] max-w-full mx-auto sm:rounded-md overflow-hidden" />
        <div v-if="ready" class="py-10">
            <div v-if="soldOut" class="text-center text-accent text-5xl">
                Sold Out!
            </div>
            <div v-else class="flex flex-col gap-5 items-center mx-auto text-center">
                <h1 class="text-3xl sm:text-4xl">Pepe crew onboarding</h1>
                <div class="text-xl">
                    <progress class="progress progress-secondary w-56" :value="minted" :max="SUPPLY"></progress>
                    <div class="text-center">
                        {{ minted }} / {{ SUPPLY }}
                    </div>
                    <div v-if="sale.paused" class="mt-5">
                        <button class="btn btn-wide btn-disabled">Mint is paused</button>
                    </div>
                    <div v-else class="flex justify-center gap-5 sm:gap-8 mt-5">
                        <button @click="mint(1)" class="btn btn-secondary sm:btn-md" :class="{'btn-sm btn-disabled': minting}">
                            <span v-if="minting" class="loading loading-spinner loading-xs md:loading-md"></span>
                            Mint 1</button>
                        <button v-if="sale.perWalletLimit >= 3" @click="mint(3)" class="btn btn-secondary sm:btn-md" :class="{'btn-sm btn-disabled': minting}">
                            <span v-if="minting" class="loading loading-spinner loading-xs md:loading-md"></span>
                            Mint 3</button>
                        <button v-if="sale.perWalletLimit >= 5" @click="mint(5)" class="btn btn-secondary sm:btn-md" :class="{'btn-sm btn-disabled': minting}">
                            <span v-if="minting" class="loading loading-spinner loading-xs md:loading-md"></span>
                            Mint 5</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            Loading...
        </div>
        <SaleAdmin v-if="isAdmin" class="max-w-sm mx-auto" />
    </div>
</template>

<script setup>
import { reactive, ref, onBeforeMount, computed, inject, onBeforeUnmount } from 'vue'
import { useIntervalFn } from '@vueuse/core'
import api from '../utils/tzkt.js'
import SaleAdmin from '../components/SaleAdmin.vue'
import MintMap from '../components/MintMap.vue'
import toast from 'vue3-toastify'

const CROWDSALE = import.meta.env.VITE_CROWDSALE

const SUPPLY = 250

const conn = inject('walletConnection')

const connectWallet = inject('connectWallet')

const ready = ref(false)

const minting = ref(false)

const isAdmin = computed(() => conn.address && sale.admin.includes(conn.address))

const minted = computed(() => (SUPPLY - sale.available.length))

const soldOut = computed(() => minted.value >= SUPPLY)

const sale = reactive({
  admin: [],
  price: 0,
  start: null,
  paused: false,
  wlEnd: null,
  tradein: null,
  wlPrice: 0,
  wlStart: null,
  available: [],
  tradeinPrice: 0,
  perWalletLimit: 0
})

const price = ref(0)

const { pause: stopPricePolling } = useIntervalFn(() => {
  if (!ready.value) return

  const now = Date.now()

  const { price: publicPrice, wlPrice, wlStart, wlEnd, start } = sale

  if ((wlStart?.getTime() || Infinity) < now && (wlEnd?.getTime() || Infinity) > now) {
    price.value = wlPrice
    return
  }

  if ((start?.getTime() || Infinity) < now) {
    price.value = publicPrice
    stopPricePolling()
  }
}, 1000)

const updateState = (state) => {
    const { admin, price, start, paused, wl_end, wl_price, wl_start, available, trade_in, trade_in_price, per_wallet_limit } = state

    sale.admin = admin

    sale.price = Number(price)

    sale.paused = paused

    sale.start = new Date(start)

    sale.wlEnd = new Date(wl_end)

    sale.wlPrice = Number(wl_price)

    sale.wlStart = new Date(wl_start)

    sale.available = available.map(id => Number(id))

    sale.tradeinPrice = Number(trade_in_price)

    sale.tradein = trade_in

    sale.perWalletLimit = Number(per_wallet_limit)

    console.log(sale)
}

const readStorage = async () => {
    try {
        const storage = await api.getStorage(CROWDSALE)

        updateState(storage)

        ready.value = true
    } catch (e) {
        console.error(e)
    }
}

const wssubscribe = inject('subscribe')
const wssunsubscribe = inject('unsubscribe')

const onTransaction = (data) => {
    for (const { target, storage, sender, parameter } of data) {
        if (target?.address === CROWDSALE) {
            updateState(storage)
            if (sender.address === conn.address && parameter?.entrypoint === 'mint') {
                // console.log(`Successfully minted ${parameter.value} token(s)`)
                toast.success(`Successfully minted ${parameter.value} token(s)`, { theme: 'dark' })
            }
        }
    }
}

const mint = async (n) => {
    try {
        if (minting.value) return

        const amount = isAdmin.value ? 0 : price.value * n

        minting.value = true

        if (!conn.address) {
            await connectWallet()
        }

        if (!conn.address) {
            return
        }
    
        const contract = await conn.client.wallet.at(CROWDSALE)

        const op = contract.methods.mint(n).send({ amount, mutez: true, storageLimit: 270 * n })

        await op.confirmation(1)
    
    } catch (e) {
        console.log(e)
    } finally {
        minting.value = false
    }
}

onBeforeMount(async () => {
    await readStorage()
    wssubscribe(onTransaction)
})

onBeforeUnmount(() => {
    wssunsubscribe(onTransaction)
})
</script>
