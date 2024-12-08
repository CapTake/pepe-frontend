<template>
    <div class="pepe-bg flex flex-wrap gap-0 aspect-square relative">
        <div v-for="(visible, i) in tiles" :key="i" class="tile h-[6.25%] w-[6.25%] text-xs bg-black bg-opacity-60 border border-slate-600 rounded-sm flex justify-center items-center"
                :class="{'off': !visible}" :style="`animation-delay: ${i * 7}ms;`">
                <span class="id transition-all">{{ i + 1 }}</span>
        </div>
        <div v-for="i in 6" :key="i+'z'" class="tile h-[6.25%] w-[6.25%] text-xs bg-black bg-opacity-60 border border-slate-600 rounded-sm flex justify-center items-center"
                :class="{'off': i > 1000}" :style="`animation-delay: ${250 + i * 7}ms;`">
                <span class="id transition-all">{{ moji[i] }}</span>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
const SUPPLY = 250
const moji = ['🐸', '🐸', '🍆', '🐸', '🐸', '🐢', '♋']
const props = defineProps({
    items: Array
})

const tiles = computed(() => {
    const res = []
    const items = props.items || []
    for(let i = 1; i <= SUPPLY; i++) {
      res.push(items.includes(i))
    }
    return res
})

</script>

<style>
.pepe-bg {
    background-image: url("/pepe-square.webp");
    background-repeat: no-repeat;
    background-size: cover;
}

.tile {
    animation: tilein 0.5s normal forwards ease-in-out;
}

.tile.off {
    border-radius: 50%;
    animation: tileout 1.5s normal forwards ease-in-out;
    background-color: white;
    border: none;
    opacity: 0;
    pointer-events: none;
}

.tile .id {
    opacity: 0;
    transition: all 0.5s ease-out;
    transition-delay: 500ms;
}
.tile.off .id {
    opacity: 1;
    color: black;
}
.tile:hover .id {
    opacity: 1;
    transition-delay: 0ms;
}

@keyframes tilein {
    from {
        opacity: 0;
        transform: scale(0, 0);
    }
    50% {
        opacity: 1;
        transform: scale(1.1, 1.1);
    }
    to {
        transform: scale(1, 1);
    }
}
@keyframes tileout {
    from {
        opacity: 1;
        transform: scale(0.2, 0.2) translateY(-50px);
    }
    50% {
        opacity: 1;
    }
    to {
        opacity: 0;
        transform: scale(2, 2) translateY(-50px);
    }
}
</style>