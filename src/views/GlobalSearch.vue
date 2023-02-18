<script setup lang="ts">
import {computed, nextTick, ref, watch} from 'vue'
import {WebsiteItemModel, WebsiteModel} from '../api/model'
import {isMacOs} from '../util/util'

const props = defineProps<{ modelValue?: boolean; data: WebsiteModel[] }>()
const emit = defineEmits(['update:modelValue'])
const visibleRef = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
const keywordRef = ref('')
const tableDataRef = ref([] as WebsiteItemModel[])
const searchInputRef = ref<HTMLInputElement | null>()

const handleKeywordChange = () => {
  const keyword = keywordRef.value
  tableDataRef.value = []
  if (!keyword) {
    return
  }

  const reg = new RegExp(keyword, 'i');
  const replaceStr = `<span style="color: var(--el-color-primary); font-weight: bold;">${keyword}</span>`
  for (const websiteModel of props.data) {
    const websites = websiteModel.websites
    if (websites && websites.length > 0) {
      for (const websiteItemModel of websites) {

        if (websiteItemModel.name.search(reg) >=0
          || (websiteItemModel.description && websiteItemModel.description.search(reg) >=0)) {
          tableDataRef.value.push({
            name: websiteItemModel.name.replace(reg, replaceStr),
            link: websiteItemModel.link,
            description: websiteItemModel.description?.replace(reg, replaceStr),
          })
        }
      }
    }
  }
}
const handleClosed = () => {
  keywordRef.value = ''
  tableDataRef.value = []
}

watch(visibleRef,  async (newVisible) => {
  if (newVisible) {
    await nextTick()
    document.getElementById('searchInputRef')?.focus()
    searchInputRef.value?.focus()
  }
})

</script>

<template>
  <div class="global-search-panel">
    <el-dialog :show-close="false" v-model="visibleRef" width="40%" @closed="handleClosed">
      <el-input clearable
                id="searchInputRef"
                ref="searchInputRef"
                v-model="keywordRef"
                placeholder="搜索网站名称、描述"
                style="height: 40px;"
                @input="handleKeywordChange">
        <template #prefix>
          <svg class="search-icon" viewBox="0 0 1024 1024"><path d="M1005.312 914.752l-198.528-198.464A448 448 0 1 0 0 448a448 448 0 0 0 716.288 358.784l198.4 198.4a64 64 0 1 0 90.624-90.432zM448 767.936A320 320 0 1 1 448 128a320 320 0 0 1 0 640z"></path></svg>
        </template>
      </el-input>
      <el-table border class="search-table" :data="tableDataRef" :show-header="false" max-height="calc(70vh - 68px)">
        <el-table-column>
          <template #default="scope">
            <div class="website-title">
              <el-link :href="scope.row.link" target="_blank" v-html="scope.row.name"></el-link>
            </div>
            <div class="website-description" v-html="scope.row.description">
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="footer">
        <div class="footer-tip" style="margin-right: 16px">
          <span class="footer-tip-shortcut">{{ isMacOs() ? '⌘ K' : 'ctrl K' }}</span>打开全局搜索
        </div>
        <div class="footer-tip"><span class="footer-tip-shortcut">esc</span>关闭全局搜索</div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.global-search-panel {
  --el-border-radius-small: 8px;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  padding: 16px;
}
.global-search-panel .search-icon {
  width: 16px;
  height: 16px;
  fill: var(--el-text-color-primary)
}
.global-search-panel .search-table {
  width: 100%;
  margin-top: 16px;
}
.global-search-panel .website-title {
  font-size: 16px;
}
.global-search-panel .website-description {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}
.global-search-panel .footer {
  margin-top: 16px;
  height: 20px;
  line-height: 20px;
}
.global-search-panel .footer-tip {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  float: left;
}
.global-search-panel .footer-tip-shortcut {
  font-weight: bold;
  margin-right: 4px;
}
</style>
