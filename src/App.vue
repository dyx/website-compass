<script setup lang="ts">
import Homepage from './views/Homepage.vue'
import {DataSourceMode, STORAGE_KEY_DATA_SOURCE_MODE, STORAGE_KEY_THEME_MODE, ThemeMode} from './util/consts'

let themeMode = localStorage.getItem(STORAGE_KEY_THEME_MODE)
themeMode = themeMode ? themeMode : ThemeMode.LIGHT
document.documentElement.setAttribute('class', themeMode)
localStorage.setItem(STORAGE_KEY_THEME_MODE, themeMode)

let dataSourceMode = localStorage.getItem(STORAGE_KEY_DATA_SOURCE_MODE)
if (!dataSourceMode) {
  localStorage.setItem(STORAGE_KEY_DATA_SOURCE_MODE, DataSourceMode.DEFAULT)
}
</script>

<template>
  <Homepage/>
</template>

<style scoped>

</style>
