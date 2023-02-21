<template>
  <div class="demo-collapse">
    <el-collapse accordion v-model="activeName">
      <el-collapse-item
        v-for="(value, key) in mylog"
        :key="key"
        :name="key"
        :title="value.name"
      >
        <el-row :gutter="20">
          <el-col :span="12" class="pointer" @click="copyText(value.url)">
            {{ value.url }}
          </el-col>
          <el-col :span="6" :offset="6">
            <el-button
              type="danger"
              :icon="Delete"
              @dblclick="delProject(value.name)"
              circle
            ></el-button>
            <el-button
              type="primary"
              :icon="Plus"
              @click="typeDrawer = true"
              circle
            ></el-button>
          </el-col>
          <!-- <el-col :span="6">
            <el-button type="primary"
                       @click="openExternal(value.url)">打开链接</el-button>
          </el-col> -->
        </el-row>
        <el-tabs type="border-card" v-if="Object.keys(tabsInfo.lists).length">
          <el-tab-pane v-for="(val, key) in tabsInfo.lists" :key="key">
            <template #label>
              <span
                class="custom-tabs-label"
                :draggable="true"
                @dragstart="dragstart(value.name, key)"
                >{{ key }}</span
              >
            </template>
            <template v-if="val.length === 0">
              <el-button
                type="primary"
                style="float: right"
                :icon="Plus"
                @click="addInfo(key)"
                circle
              ></el-button>
            </template>
            <template v-else>
              <el-row
                :gutter="20"
                v-for="(item, index) in val"
                :key="index"
                :draggable="true"
                @dragstart="dragstart(value.name, key, index)"
              >
                <el-col :span="6">
                  用户名：
                  <span @click="copyText(item.username)" class="pointer">{{
                    item.username
                  }}</span>
                </el-col>
                <el-col :span="6">
                  密码：
                  <span @click="copyText(item.pwd)" class="pointer">{{
                    item.pwd
                  }}</span>
                </el-col>
                <el-col :span="6" v-if="index === 0">
                  <el-button
                    type="primary"
                    :icon="Plus"
                    @click="addInfo(key)"
                    circle
                  ></el-button>
                </el-col>
              </el-row>
            </template>
          </el-tab-pane>
        </el-tabs>
      </el-collapse-item>
    </el-collapse>
    <el-drawer
      v-model="typeDrawer"
      title="添加权限"
      size="50%"
      :with-header="false"
    >
      <div class="demo-drawer__content">
        <el-form :model="form" label-position="left">
          <el-form-item label="权限" :label-width="formLabelWidth">
            <el-input v-model="form.type" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button
            @click="
              () => {
                ;(typeDrawer = false), resetForm()
              }
            "
            >Cancel</el-button
          >
          <el-button type="primary" @click="submit">Submit</el-button>
        </div>
      </div>
    </el-drawer>
    <el-drawer
      v-model="infoDrawer"
      size="50%"
      title="添加账号和密码"
      :with-header="false"
    >
      <div class="demo-drawer__content">
        <el-form :model="infoForm" label-position="left">
          <el-form-item label="用户名" :label-width="infoFormLabelWidth">
            <el-input v-model="infoForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" :label-width="infoFormLabelWidth">
            <el-input v-model="infoForm.pwd" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div class="demo-drawer__footer">
          <el-button
            @click="
              () => {
                ;(infoDrawer = false), resetForm()
              }
            "
            >Cancel</el-button
          >
          <el-button type="primary" @click="submitInfo">Submit</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { setItem, getItem } from '@/utils/storage.js'
import { ElMessage } from 'element-plus'
import { Delete, Plus } from '@element-plus/icons-vue'
// const { shell } = window.electron
const props = defineProps({
  mylog: Object
})
const emit = defineEmits(['del'])
const activeName = ref()
const infoName = ref()
const typeDrawer = ref(false)
const infoDrawer = ref(false)
const typeState = reactive({
  formLabelWidth: '20%',
  form: {
    type: ''
  }
})
const infoState = reactive({
  infoFormLabelWidth: '20%',
  infoForm: {
    username: '',
    pwd: ''
  }
})
let tabsInfo = reactive({
  lists: {}
})
watch(
  () => activeName.value,
  (newVal) => {
    if (newVal) {
      let { name, url, ...data } = getItem('mylog')[newVal]
      tabsInfo.lists = data || {}
    }
  }
)
watch(
  () => props.mylog,
  () => {
    if (activeName.value && getItem('mylog')) {
      let temp = getItem('mylog')[activeName.value]
      if (temp) {
        let { name, url, ...data } = temp
        tabsInfo.lists = data || {}
      } else {
        tabsInfo.lists = {}
      }
    }
  }
)
const addInfo = (key) => {
  infoDrawer.value = true
  infoName.value = key
}

const dragstart = (project, key, index) => {
  emit('del', project, key, index)
}

const delProject = (project) => {
  emit('del', project)
}

const submit = () => {
  if (typeState.form.type) {
    let mylog = getItem('mylog')
    if (!mylog[activeName.value][typeState.form.type]) {
      setItem('mylog', {
        ...mylog,
        [activeName.value]: {
          ...mylog[activeName.value],
          [typeState.form.type]: []
        }
      })
    }
    let { name, url, ...data } = getItem('mylog')[activeName.value]
    tabsInfo.lists = data
    resetForm()
    typeDrawer.value = false
  } else {
    ElMessage('请输入完整信息')
  }
}
const submitInfo = () => {
  //if (infoState.infoForm.username && infoState.infoForm.pwd) {
  if (infoState.infoForm.username) {
    let mylog = getItem('mylog')
    let temp = mylog[activeName.value]
    temp[infoName.value].push(infoState.infoForm)
    setItem('mylog', {
      ...mylog,
      [activeName.value]: temp
    })
    let { name, url, ...data } = getItem('mylog')[activeName.value]
    tabsInfo.lists = data
    resetForm()
    infoDrawer.value = false
  } else {
    ElMessage('请输入完整信息')
  }
}
const copyText = (text) => {
  var tempInput = document.createElement('input')
  tempInput.value = text
  document.body.appendChild(tempInput)
  tempInput.select()
  document.execCommand('Copy')
  tempInput.remove()
}

function resetForm() {
  typeState.form = {
    type: ''
  }
  infoState.infoForm = {
    username: '',
    pwd: ''
  }
}
const { formLabelWidth, form } = toRefs(typeState)
const { infoFormLabelWidth, infoForm } = toRefs(infoState)
</script>

<style lang="scss" scoped>
.pointer {
  cursor: pointer;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
  .el-col {
    display: flex;
    align-items: center;
    span {
      flex: 1;
    }
  }
}
</style>
