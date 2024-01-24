<template>
    <div class="bg-primary w-full p-8 pt-20 pb-20 flex">
        <div class="flex gap-6 font-pepe text-xl" style="margin:0 auto;align-items: center;">
        <RouterLink to="/#top"><img src="../../logo.png" class="nav-logo inline"></RouterLink>
        <RouterLink to="/#top" class="hover:underline"> Home</RouterLink>
        <RouterLink to="/dashboard" class="hover:underline"> Dashboard</RouterLink>
        <RouterLink to="/arena" class="hover:underline"> Arena</RouterLink>
        <a href="">Twitter</a>
        <a href="">Discord</a>
        </div>
    </div>
</template>
    
<script setup>
    import { RouterLink } from "vue-router"
</script>