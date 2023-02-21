<template>
  <el-drawer
    v-model="isDrawer"
    title="添加项目"
    size="50%"
    :before-close="close"
  >
    <div class="demo-drawer__content">
      <el-form :model="form" label-position="left">
        <el-form-item label="NAME" :label-width="formLabelWidth">
          <el-input v-model.trim="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="URL" :label-width="formLabelWidth">
          <el-input v-model.trim="form.url" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div class="demo-drawer__footer">
        <el-button @click="close">Cancel</el-button>
        <el-button type="primary" @click="submit">Submit</el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script setup>
import { setItem, getItem } from '@/utils/storage.js'
import { ElMessage } from 'element-plus'
const props = defineProps({
  drawer: Boolean
})
const emit = defineEmits(['close', 'getLogItem'])
const isDrawer = ref(false)
const state = reactive({
  formLabelWidth: '20%',
  form: {
    url: '',
    name: ''
  }
})
watch(
  () => props.drawer,
  (newVal) => {
    isDrawer.value = newVal
  }
)
const close = () => {
  resetForm()
  emit('close')
}
const submit = () => {
  if (state.form.url && state.form.name) {
    setItem('mylog', {
      ...getItem('mylog'),
      [state.form.name]: state.form
    })
    resetForm()
    emit('close')
    emit('getLogItem', 'mylog')
  } else {
    ElMessage('请输入完整信息')
  }
}
function resetForm() {
  state.form = {
    url: '',
    name: ''
  }
}
const { formLabelWidth, form } = toRefs(state)
</script>
