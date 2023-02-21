<template>
  <el-row>
    <el-col :span="6">
      <el-button type="primary" :icon="Plus" @click="drawer = true" circle>
      </el-button>
    </el-col>
    <el-col :span="6" :offset="12">
      <el-button
        type="danger"
        :icon="Delete"
        @dblclick="clear"
        circle
      ></el-button>
    </el-col>
  </el-row>
  <Main :mylog="state.mylog" />
  <DrawerInput :drawer="drawer" @close="close" @getLogItem="getLogItem" />
</template>

<script setup>
import Main from './components/main.vue'
import DrawerInput from './components/drawerInput.vue'
import { getItem, clearStorage } from '@/utils/storage.js'
import { Delete, Plus } from '@element-plus/icons-vue'

const drawer = ref(false)
const state = reactive({
  mylog: getItem('mylog') || {}
})
console.log('state.mylog', state.mylog)
const close = () => {
  drawer.value = false
}
const getLogItem = (key) => {
  state.mylog = getItem(key)
}
const clear = () => {
  clearStorage()
  state.mylog = getItem('mylog')
}
// components: {
//   Main, DrawerInput
// }
</script>

<style></style>
