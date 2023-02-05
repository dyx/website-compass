<script setup lang="ts">
import Homepage from './Homepage.vue'

let themeMode = localStorage.getItem('THEME_MODE')
themeMode = themeMode ? themeMode : 'light'
document.documentElement.setAttribute('class', themeMode)
localStorage.setItem('THEME_MODE', themeMode)
</script>

<template>
  <Homepage/>
</template>

<style scoped>

</style>
