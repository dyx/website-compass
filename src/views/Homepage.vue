<script setup lang="ts">
import {onBeforeUnmount, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {STORAGE_KEY_THEME_MODE, ThemeMode} from '../util/consts'
import GlobalSearch from "./GlobalSearch.vue";
import api from '../api/api'
import {WebsiteModel} from '../api/model'
import {isMacOs} from "../util/util";
import Setting from "./Setting.vue";

const dataRef = ref([] as WebsiteModel[])
const router = useRouter()
const colors = ['rgb(242,80,66)', 'rgb(255,137,6)', 'rgb(255,216,3)', 'rgb(44,182,125)', 'rgb(139,211,221)', 'rgb(61,169,252)', 'rgb(127,90,240)', 'rgb(245,130,174)', 'rgb(249,188,96)']
const currentNavItemActiveIndexRef = ref(-1)
const navItemActiveIndicatorTopRef = ref('')
const currentThemeModeRef = ref(localStorage.getItem(STORAGE_KEY_THEME_MODE))
const globalSearchVisibleRef = ref(false)
const settingVisibleRef = ref(false)

const getRgb = (index: number) => {
  if (index < 0) return ''
  return colors[index % colors.length]
}
const getRgba = (index: number, opacity: number) => {
  if (index < 0) return ''
  let rgb = colors[index % colors.length].replace('rgb(', '').replace(')', '')
  return `rgba(${rgb},${opacity})`
}
const setNavItemActive = (index: number) => {
  currentNavItemActiveIndexRef.value = index
  navItemActiveIndicatorTopRef.value = (20+index*32) + 'px'
}
const handleNavItemClick = (index: number) => {
  const elements = document.querySelectorAll('.category-panel')
  if (elements && elements.length > 0) {
    window.scroll({
      top: (elements[index] as HTMLElement).offsetTop - 16
    })

    setNavItemActive(index)
  }
}
const handleOpenWebsiteClick = (link: string) => {
  if (link) {
    window.open(link, '_blank')
  }
}
const handleSearchClick = () => {
  globalSearchVisibleRef.value = true
}
const handleChangeThemeClick = () => {
  const themeMode = localStorage.getItem(STORAGE_KEY_THEME_MODE) === ThemeMode.LIGHT ? ThemeMode.DARK : ThemeMode.LIGHT
  document.documentElement.setAttribute('class', themeMode)
  localStorage.setItem(STORAGE_KEY_THEME_MODE, themeMode)
  currentThemeModeRef.value = themeMode
}
const handleSettingClick = () => {
  settingVisibleRef.value = true
}
const handleKeydown = (e: KeyboardEvent) => {
  if (isMacOs()) {
    if (e.metaKey && e.key.toLowerCase() === "k") {
      handleSearchClick()
    }
  }
  else {
    if (e.ctrlKey && e.key.toLowerCase() === "k") {
      handleSearchClick()
    }
  }
}
const handleScroll = () => {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const elements = document.querySelectorAll('.category-panel')
  if (elements && elements.length > 0) {
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      if (element instanceof HTMLElement) {
        if (scrollTop >= element.offsetTop - 120) {
          router.push({hash: `#${element.id}`})

          setNavItemActive(i)
        }
      }
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  window.addEventListener("keydown", handleKeydown);
  handleNavItemClick(0)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('keydown', handleKeydown)
})

api.getAllData().then(res => dataRef.value = res)
</script>

<template>
  <div class="wrapper">
    <div class="main-panel">
      <el-card class="category-panel" v-for="(item, index) in dataRef" :key="index" :id="item.categoryName" :body-style="{background: `radial-gradient(50% 50% at 50% 50%,${getRgba(index, 0.3)} 0,hsla(0,0%,100%,0) 150%)`}">
        <div class="category-title">
          <div class="category-title-indicator" :style="{background: getRgb(index)}"></div>
          <div class="category-title-text">
            {{item.categoryName}}
          </div>
        </div>
        <el-row :gutter="16" class="clear">
          <el-col v-for="(website, windex) in item.websites" :span="6" class="website">
            <el-card shadow="hover">
              <div class="website-head">
                <svg class="website-icon" :style="{fill: getRgb(index)}" viewBox="0 0 1024 1024"><path d="M777.088 748.544c-30.464-21.376-40.832-40.192-76.48-53.792 25.28-60.288 40.192-83.616 42.112-154.88h145.184c-3.904 99.168-45.376 143.872-110.816 208.704zM136.096 539.872h167.2c1.952 71.296 16.864 94.624 42.112 154.88a438.784 438.784 0 0 0-98.496 53.792c-65.472-64.8-106.944-109.536-110.816-208.704z m103.04-259.904a393.44 393.44 0 0 0 96.576 57.696c-19.456 53.792-30.464 90.72-31.744 152.96H136.096c3.232-90.72 46.656-147.776 103.04-210.624z m309.152 209.984v-117.952c47.296-1.28 71.296-10.368 114.08-25.28 18.144 51.2 28.512 84.896 30.464 143.232h-144.512z m104.352 195.104c-40.192-12.96-60.288-20.096-104.352-21.376v-123.776h144.512c-1.952 68.064-16.192 88.128-40.192 145.184z m36.928 57.664c31.744 12.32 39.52 28.512 66.752 47.296a369.6 369.6 0 0 1-182.112 84.896c36.928-37.6 90.72-82.304 115.36-132.224z m-163.296 137.408l22.048-165.92c40.192 1.312 56.384 7.776 92.672 18.784a457.44 457.44 0 0 1-113.408 147.104h-1.312z m-75.84-5.184c-67.392-11.008-130.272-40.832-182.752-84.896a431.52 431.52 0 0 1 88.8-47.296 482.944 482.944 0 0 0 93.984 132.224z m47.296-335.072v123.776c-44.064 1.312-64.16 8.416-104.352 21.376-23.968-57.696-38.24-77.12-40.192-145.184h144.512z m-114.048-193.152c42.784 14.912 66.752 23.328 114.08 25.28v117.952h-144.512c1.952-58.336 12.32-92.032 30.464-143.232z m-37.6-57.024a366.4 366.4 0 0 1-88.128-51.84c53.792-51.84 115.36-91.392 192.48-104.352a479.136 479.136 0 0 0-104.352 156.192z m151.648-161.376v193.792c-44.064-1.28-64.16-9.088-103.68-22.688 29.152-68.704 49.888-127.04 102.4-171.104h1.28z m75.84 4.544a398.88 398.88 0 0 1 206.752 104.352c-29.152 22.048-46.016 37.6-80.352 51.84-25.28-59.616-82.944-112.768-126.368-156.192z m-46.016-4.544a447.584 447.584 0 0 1 124.448 171.104c-39.52 13.6-59.616 21.376-103.712 22.688l-22.048-193.792h1.312z m-31.104 751.168c-46.656-38.88-62.88-88.8-91.392-147.104 36.288-11.68 53.152-17.504 93.312-18.784v165.92h-1.952z m391.456-389.536H742.72c-1.312-61.568-12.32-98.496-31.744-152.32 37.6-15.552 57.024-33.056 88.8-57.696 56.384 62.88 84.896 119.904 88.128 209.984zM512 62.208c-244.32 0-442.016 197.664-442.016 442.016S267.648 946.24 512 946.24s442.016-197.664 442.016-442.016S756.352 62.208 512 62.208z"></path></svg>
                <div class="website-title" @click="handleOpenWebsiteClick(website.link)">
                  {{website.name}}
                </div>
                <div class="clear"></div>
              </div>
              <div class="website-desc-wrapper" v-if="website.description">
                <input :id="`${index}${windex}`" class="website-desc-collapse-checkbox"  type="checkbox"/>
                <div class="website-desc">
                  <label class="website-desc-collapse-btn" :for="`${index}${windex}`"></label>
                  {{website.description}}
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="sidebar-panel">
      <div style="position: fixed">
        <div class="nav-panel">
          <div class="nav-item-active-indicator"
               :style="{opacity: currentNavItemActiveIndexRef>=0?1:0, top: navItemActiveIndicatorTopRef, background: getRgb(currentNavItemActiveIndexRef)}"></div>
          <div class="nav-item"
               v-for="(item, index) in dataRef"
               @click="handleNavItemClick(index)"
               :style="{color: currentNavItemActiveIndexRef === index ? getRgb(index) : 'var(--el-text-color-regular)'}">
            {{item.categoryName}}
          </div>
        </div>
        <div class="function-panel">
          <div class="function-button" style="right: 16px;" @click="handleSearchClick" title="全局搜索">
            <svg class="function-button-icon" viewBox="0 0 1024 1024"><path d="m795.904 750.72 124.992 124.928a32 32 0 0 1-45.248 45.248L750.656 795.904a416 416 0 1 1 45.248-45.248zM480 832a352 352 0 1 0 0-704 352 352 0 0 0 0 704z"></path></svg>
          </div>
          <div class="function-button" style="right: 16px; top: 56px;" @click="handleChangeThemeClick" title="主题切换">
            <svg v-show="currentThemeModeRef==='light'" class="function-button-icon" viewBox="0 0 1024 1024"><path d="M512 831.508c16.264 0 29.792 11.72 32.597 27.176l0.534 5.955v62.23C545.13 945.167 530.298 960 512 960c-16.265 0-29.792-11.72-32.597-27.175l-0.534-5.956v-62.23c0-18.298 14.833-33.13 33.131-33.13z m267.584-97.826l5.197 4.245 44.002 44.002c12.938 12.938 12.938 33.916 0 46.854-11.321 11.321-28.797 12.736-41.656 4.245l-5.198-4.245-44.002-44.002c-12.938-12.938-12.938-33.915 0-46.854 11.321-11.32 28.797-12.736 41.657-4.245z m-493.511 4.246c11.32 11.32 12.736 28.796 4.245 41.656l-4.246 5.197-44.002 44.002c-12.939 12.938-33.916 12.938-46.854 0-11.32-11.321-12.736-28.797-4.245-41.657l4.245-5.197 44.003-44.002c12.938-12.938 33.916-12.938 46.854 0zM512 274.932c130.929 0 237.068 106.14 237.068 237.068 0 130.929-106.14 237.068-237.068 237.068-130.929 0-237.068-106.14-237.068-237.068 0-130.929 106.14-237.068 237.068-237.068z m414.87 203.937c18.297 0 33.13 14.833 33.13 33.131 0 16.264-11.72 29.792-27.175 32.597l-5.956 0.534h-62.23c-18.298 0-33.13-14.833-33.13-33.131 0-16.265 11.72-29.792 27.175-32.597l5.955-0.534h62.23z m-767.509 0c18.298 0 33.13 14.833 33.13 33.131 0 16.264-11.72 29.792-27.175 32.597l-5.955 0.534h-62.23C78.833 545.13 64 530.298 64 512c0-16.265 11.72-29.792 27.175-32.597l5.956-0.534h62.23z m669.422-283.653c11.321 11.32 12.736 28.797 4.246 41.656l-4.246 5.198-44.002 44.002c-12.938 12.939-33.915 12.94-46.853 0-11.322-11.32-12.737-28.796-4.246-41.656l4.245-5.197 44.002-44.003c12.938-12.938 33.915-12.938 46.854 0z m-591.91-4.245l5.197 4.245 44.003 44.003c12.938 12.938 12.938 33.915 0 46.854-11.321 11.32-28.797 12.736-41.657 4.245l-5.197-4.245-44.003-44.003c-12.938-12.938-12.938-33.915 0-46.854 11.321-11.32 28.797-12.736 41.657-4.245zM512 64c16.264 0 29.792 11.72 32.597 27.175l0.534 5.956v62.23c0 18.298-14.833 33.13-33.131 33.13-16.265 0-29.792-11.72-32.597-27.175l-0.534-5.955v-62.23C478.87 78.833 493.702 64 512 64z"></path></svg>
            <svg v-show="currentThemeModeRef==='dark'" class="function-button-icon" viewBox="0 0 1024 1024"><path d="M593.054 120.217C483.656 148.739 402.91 248.212 402.91 366.546c0 140.582 113.962 254.544 254.544 254.544 118.334 0 217.808-80.746 246.328-190.144C909.17 457.12 912 484.23 912 512c0 220.914-179.086 400-400 400S112 732.914 112 512s179.086-400 400-400c27.77 0 54.88 2.83 81.054 8.217z"></path></svg>
          </div>
          <div class="function-button" style="right: 16px; top: 112px;" @click="handleSettingClick" title="数据源设置">
            <svg class="function-button-icon" viewBox="0 0 1024 1024"><path d="M600.704 64a32 32 0 0 1 30.464 22.208l35.2 109.376c14.784 7.232 28.928 15.36 42.432 24.512l112.384-24.192a32 32 0 0 1 34.432 15.36L944.32 364.8a32 32 0 0 1-4.032 37.504l-77.12 85.12a357.12 357.12 0 0 1 0 49.024l77.12 85.248a32 32 0 0 1 4.032 37.504l-88.704 153.6a32 32 0 0 1-34.432 15.296L708.8 803.904c-13.44 9.088-27.648 17.28-42.368 24.512l-35.264 109.376A32 32 0 0 1 600.704 960H423.296a32 32 0 0 1-30.464-22.208L357.696 828.48a351.616 351.616 0 0 1-42.56-24.64l-112.32 24.256a32 32 0 0 1-34.432-15.36L79.68 659.2a32 32 0 0 1 4.032-37.504l77.12-85.248a357.12 357.12 0 0 1 0-48.896l-77.12-85.248A32 32 0 0 1 79.68 364.8l88.704-153.6a32 32 0 0 1 34.432-15.296l112.32 24.256c13.568-9.152 27.776-17.408 42.56-24.64l35.2-109.312A32 32 0 0 1 423.232 64H600.64zm-23.424 64H446.72l-36.352 113.088-24.512 11.968a294.113 294.113 0 0 0-34.816 20.096l-22.656 15.36-116.224-25.088-65.28 113.152 79.68 88.192-1.92 27.136a293.12 293.12 0 0 0 0 40.192l1.92 27.136-79.808 88.192 65.344 113.152 116.224-25.024 22.656 15.296a294.113 294.113 0 0 0 34.816 20.096l24.512 11.968L446.72 896h130.688l36.48-113.152 24.448-11.904a288.282 288.282 0 0 0 34.752-20.096l22.592-15.296 116.288 25.024 65.28-113.152-79.744-88.192 1.92-27.136a293.12 293.12 0 0 0 0-40.256l-1.92-27.136 79.808-88.128-65.344-113.152-116.288 24.96-22.592-15.232a287.616 287.616 0 0 0-34.752-20.096l-24.448-11.904L577.344 128zM512 320a192 192 0 1 1 0 384 192 192 0 0 1 0-384zm0 64a128 128 0 1 0 0 256 128 128 0 0 0 0-256z"></path></svg>
          </div>
        </div>
      </div>
    </div>
  </div>
  <GlobalSearch v-model="globalSearchVisibleRef" :data="dataRef"></GlobalSearch>
  <Setting v-model="settingVisibleRef"></Setting>
</template>

<style scoped>
.wrapper {
  --sidebar-width: 120px;
  --function-height: 168px;
}
.main-panel {
  width: calc(100% - 32px - var(--sidebar-width));
  float: left;
  padding: 16px;
}
.sidebar-panel {
  width: var(--sidebar-width);
  float: left
}
.nav-panel {
  position: relative;
  padding: 16px;
  width: var(--sidebar-width);
  height: calc(100vh - 32px - var(--function-height));
}
.function-panel {
  position: relative;
  width: var(--sidebar-width);
  height: var(--function-height);
  padding-bottom: 16px;
}
.category-panel {
  margin-bottom: 16px;
}
.category-title {
  margin-bottom: 8px;
  height: 24px
}
.category-title-indicator {
  height: 16px;
  width: 8px;
  margin-top: 4px;
  margin-right: 8px;
  float: left;
}
.category-title-text {
  height: 24px;
  float:left;
  line-height: 24px;
  font-size: 20px;
}
.website {
  margin-top: 8px;
}
.website-icon {
  width: 16px;
  height: 16px;
  margin-top: 4px;
  margin-right: 4px;
  float: left;
  font-size: 16px;
}
.website-title {
  height: 24px;
  width: calc(100% - 20px);
  line-height: 24px;
  float: left;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.website-head {
  margin: 8px 0;
}
.nav-item {
  margin-bottom: 8px;
  height: 24px;
  line-height: 24px;
  cursor: pointer;
  font-size: 14px;
}
.nav-item-active-indicator {
  opacity: 0;
  position: absolute;
  border-radius: 4px;
  width: 4px;
  height: 16px;
  top: 20px;
  left: 4px;
  z-index: 0;
  transition: top .5s cubic-bezier(0,1,.5,1),opacity .5s,background-color .5s;
}
.clear {
  clear: both;
}
.function-button {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: var(--el-bg-color-overlay);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  box-shadow: var(--el-box-shadow-lighter);
  cursor: pointer;
}
.function-button-icon {
  width: 20px;
  height: 20px;
  fill: var(--el-text-color-primary);
}
.website-desc-wrapper {
  display: flex;
}
.website-desc {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: justify;
  position: relative;
  line-height: 1.5;
  max-height: 4.5em;
  transition: .3s max-height;
  word-break:break-all;
}
.website-desc::before {
  content: '';
  height: calc(100% - 20px);
  float: right;
}
.website-desc::after {
  content: '';
  width: 999vw;
  height: 999vw;
  position: absolute;
  box-shadow: inset calc(100px - 999vw) calc(22px - 999vw) 0 0 var(--el-bg-color-overlay);
  margin-left: -100px;
}
.website-desc-collapse-checkbox:checked+.website-desc::after{
  content: '';
  display: none;
}
.website-desc-collapse-btn {
  position: relative;
  float: right;
  clear: both;
  margin-left: 16px;
  font-size: 10px;
  padding: 0 8px;
  background: var(--el-text-color-placeholder);
  color: var(--el-fill-color-lighter);
  border-radius: 4px;
  cursor: pointer;
}
.website-desc-collapse-btn::before {
  content: '...';
  color: var(--el-text-color-secondary);
  position: absolute;
  left: -4px;
  transform: translateX(-100%)
}
.website-desc-collapse-checkbox:checked+.website-desc .website-desc-collapse-btn::before{
  visibility: hidden;
}
.website-desc-collapse-btn::after {
  content:'更多'
}
.website-desc-collapse-checkbox:checked+.website-desc .website-desc-collapse-btn::after{
  content:'收起'
}
.website-desc-collapse-checkbox {
  display: none;
}
.website-desc-collapse-checkbox:checked+.website-desc{
  max-height: none;
}
</style>
