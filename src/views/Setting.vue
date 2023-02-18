<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {
  DataSourceMode,
  STORAGE_KEY_CUSTOM_DATA_SOURCE,
  STORAGE_KEY_DATA_SOURCE_MODE
} from '../util/consts'
import {ElMessage} from "element-plus";

const props = defineProps<{ modelValue?: boolean}>()
const emit = defineEmits(['update:modelValue'])
const visibleRef = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value)
})
const dataSourceRef = ref('')
const customDataSourceRef = ref('')

const handleSubmitClick = () => {

  if (dataSourceRef.value === DataSourceMode.CUSTOM) {
    if (!customDataSourceRef.value || customDataSourceRef.value.trim().length === 0) {
      ElMessage({
        message: '自定义数据源不能为空',
        type: 'error',
        grouping: true
      })
      return
    }

    try {
      const jsonArray = JSON.parse(customDataSourceRef.value)
      if (!(jsonArray instanceof Array)) {
        ElMessage({
          message: '自定义数据源应为Json数组格式',
          type: 'error',
          grouping: true
        })
        return
      }

      if (jsonArray.length === 0) {
        ElMessage({
          message: '自定义数据源应至少包含一个站点',
          type: 'error',
          grouping: true
        })
        return
      }
    }
    catch (e) {
      ElMessage({
        message: '自定义数据源应为Json数组格式',
        type: 'error',
        grouping: true
      })
      return
    }
  }

  localStorage.setItem(STORAGE_KEY_CUSTOM_DATA_SOURCE,
    dataSourceRef.value === DataSourceMode.CUSTOM
      ? customDataSourceRef.value as string
      : '')
  localStorage.setItem(STORAGE_KEY_DATA_SOURCE_MODE, dataSourceRef.value as string)
  visibleRef.value = false
  window.location.reload()
}

watch(visibleRef,  async (newVisible) => {
  if (newVisible) {
    dataSourceRef.value = localStorage.getItem(STORAGE_KEY_DATA_SOURCE_MODE) as string
    customDataSourceRef.value = localStorage.getItem(STORAGE_KEY_CUSTOM_DATA_SOURCE) as string
  }
})

</script>

<template>
  <div class="setting-panel">
    <el-dialog :show-close="false"
               :close-on-click-modal="false"
               :close-on-press-escape="false"
               v-model="visibleRef"
               width="50%">
      <div class="header">
        <el-row>
          <el-col :span="12">
            <svg class="icon-data-source" viewBox="0 0 1024 1024"><path fill="currentColor" d="M832 384H192v448h640V384zM96 320h832V128H96v192zm800 64v480a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V384H64a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h896a32 32 0 0 1 32 32v256a32 32 0 0 1-32 32h-64zM416 512h192a32 32 0 0 1 0 64H416a32 32 0 0 1 0-64z"></path></svg>
            <span>数据源设置</span>
          </el-col>
          <el-col :span="12">
            <el-button circle size="small" style="float: right;margin-left: 8px;" @click="visibleRef=false">
              <template #icon>
                <svg viewBox="0 0 1024 1024" ><path d="M764.288 214.592 512 466.88 259.712 214.592a31.936 31.936 0 0 0-45.12 45.12L466.752 512 214.528 764.224a31.936 31.936 0 1 0 45.12 45.184L512 557.184l252.288 252.288a31.936 31.936 0 0 0 45.12-45.12L557.12 512.064l252.288-252.352a31.936 31.936 0 1 0-45.12-45.184z"></path></svg>
              </template>
            </el-button>
            <el-button circle size="small" style="float: right;" type="primary" @click="handleSubmitClick">
              <template #icon>
                <svg viewBox="0 0 1024 1024"><path d="M406.656 706.944 195.84 496.256a32 32 0 1 0-45.248 45.248l256 256 512-512a32 32 0 0 0-45.248-45.248L406.592 706.944z"></path></svg>
              </template>
            </el-button>
          </el-col>
        </el-row>
      </div>
      <el-radio-group v-model="dataSourceRef" style="margin: 10px 0;">
        <el-radio :label="DataSourceMode.DEFAULT">默认数据源</el-radio>
        <el-radio :label="DataSourceMode.CUSTOM">
          <span>自定义数据源</span>
          <el-tooltip placement="right">
            <svg class="icon-info" viewBox="0 0 1024 1024"><path d="M512 64a448 448 0 1 1 0 896.064A448 448 0 0 1 512 64zm67.2 275.072c33.28 0 60.288-23.104 60.288-57.344s-27.072-57.344-60.288-57.344c-33.28 0-60.16 23.104-60.16 57.344s26.88 57.344 60.16 57.344zM590.912 699.2c0-6.848 2.368-24.64 1.024-34.752l-52.608 60.544c-10.88 11.456-24.512 19.392-30.912 17.28a12.992 12.992 0 0 1-8.256-14.72l87.68-276.992c7.168-35.136-12.544-67.2-54.336-71.296-44.096 0-108.992 44.736-148.48 101.504 0 6.784-1.28 23.68.064 33.792l52.544-60.608c10.88-11.328 23.552-19.328 29.952-17.152a12.8 12.8 0 0 1 7.808 16.128L388.48 728.576c-10.048 32.256 8.96 63.872 55.04 71.04 67.84 0 107.904-43.648 147.456-100.416z"></path></svg>
            <template #content>
              <p>数据格式如：</p>
              <p>[</p>
              <p>&nbsp&nbsp{</p>
              <p>&nbsp&nbsp&nbsp&nbsp"categoryName":&nbsp"网站分类",</p>
              <p>&nbsp&nbsp&nbsp&nbsp"websites":&nbsp[</p>
              <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp{</p>
              <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"name":&nbsp"网站名称",</p>
              <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"link":&nbsp"网站链接",</p>
              <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"description":&nbsp"网站描述"</p>
              <p>&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp}</p>
              <p>&nbsp&nbsp&nbsp&nbsp]</p>
              <p>&nbsp&nbsp}</p>
              <p>]</p>
            </template>
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <el-input input-style="height: calc(70vh - 120px)" resize="none" v-model="customDataSourceRef" :disabled="dataSourceRef!==DataSourceMode.CUSTOM" type="textarea"></el-input>
    </el-dialog>
  </div>
</template>

<style scoped>
.setting-panel {
  --el-border-radius-small: 8px;
}
:deep(.el-dialog__header) {
  display: none;
}
:deep(.el-dialog__body) {
  padding: 16px;
}
.setting-panel .header {
  font-size: 16px;
  height: 24px;
  line-height: 24px;
}
.setting-panel .icon-data-source {
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
  margin-right: 4px;
  fill: var(--el-color-primary)
}
.setting-panel .icon-info {
  width: 16px;
  height: 16px;
  position: relative;
  top: 3px;
  left: 4px;
  fill: var(--el-color-info);
}
</style>
