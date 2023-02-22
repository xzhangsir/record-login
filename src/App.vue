<template>
  <el-row>
    <el-col :span="6">
      <el-button type="primary" :icon="Plus" @click="drawer = true" circle />
    </el-col>
    <el-col :span="6" :offset="12">
      <el-button
        type="danger"
        :icon="Delete"
        :draggable="true"
        @dblclick="clear"
        @dragover="dragover"
        @drop="drop"
        circle
      ></el-button>
    </el-col>
  </el-row>
  <Main :mylog="state.mylog" @del="del" />
  <DrawerInput :drawer="drawer" @close="close" @getLogItem="getLogItem" />
</template>

<script setup>
import Main from './components/main.vue'
import DrawerInput from './components/drawerInput.vue'
import { getItem, clearStorage, setItem } from '@/utils/storage.js'
import { Delete, Plus } from '@element-plus/icons-vue'

const drawer = ref(false)
const state = reactive({
  mylog: getItem('mylog') || {}
})
const currentDelProject = ref()
const currentDelKey = ref()
const currentDelIndex = ref()
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
const dragover = (event) => {
  event.preventDefault()
}
const drop = () => {
  let mylog = getItem('mylog')
  if (currentDelIndex.value === undefined) {
    Reflect.deleteProperty(mylog[currentDelProject.value], currentDelKey.value)
    setItem('mylog', mylog)
    state.mylog = mylog
    return
  }
  if (currentDelKey.value) {
    mylog[currentDelProject.value][currentDelKey.value].splice(
      currentDelIndex.value,
      1
    )
    setItem('mylog', mylog)
    state.mylog = mylog
  }
}
const del = (project, key, index) => {
  if (key === undefined && index === undefined) {
    let mylog = getItem('mylog')
    Reflect.deleteProperty(mylog, project)
    setItem('mylog', mylog)
    state.mylog = mylog
    return
  }
  currentDelProject.value = project
  currentDelKey.value = key
  currentDelIndex.value = index
}
</script>

<style></style>
