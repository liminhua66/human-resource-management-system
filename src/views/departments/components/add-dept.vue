<template>
  <!-- 新增部门的弹层 -->
  <el-dialog
    :title="showTitle"
    :visible.sync="dialogVisible"
    :before-close="handleClose"
  >
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      label-width="120px"
      :model="formData"
      :rules="rules"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
          @focus="getEmployeeSimple"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button
          type="primary"
          size="small"
          @click="submitDept"
        >确定</el-button>
        <el-button size="small" @click="handleClose()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getDepartments, addDepartments, updateDepartments } from '@/api/departments'
import { getEmployeeSimple } from '@/api/employees'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    const checkCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat = false
      if (this.formData.id) {
        // 编辑
        // const list = depts.filter(item => item.id !== this.treeNode.id)
        isRepeat = depts.some(
          (item) => item.id !== this.treeNode.id && item.code === value
        )
      } else {
        // 新增
        isRepeat = depts.some((item) => item.code === value)
      }
      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback()
    }

    const checkNameRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      // 编辑的时候校验，对比的是同级的数据，通过pid寻找同级的数据
      if (this.formData.id) {
        isRepeat = depts.some(
          (item) =>
            item.pid === this.treeNode.pid &&
            item.id !== this.treeNode.id &&
            item.name === value
        )
      } else {
        // depts是所有的部门数据
        // 如何去找部门所有的子节点
        isRepeat = depts.some(
          (item) => item.pid === this.treeNode.id && item.name === value
        )
      }
      isRepeat
        ? callback(new Error(`同级部门下已经有${value}的部门了`))
        : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 1, max: 50, message: '1~50个字符', trigger: 'blur' },
          { validator: checkNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入部门编码', trigger: 'blur' },
          { min: 1, max: 50, message: '1~50个字符', trigger: 'blur' },
          { validator: checkCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '请输入部门管理者', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '请输入部门介绍', trigger: 'blur' },
          { min: 1, max: 300, message: '1~300个字符', trigger: 'blur' }
        ]
      },
      peoples: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  created() {
    this.getEmployeeSimple()
  },
  methods: {
    // 关闭添加部门弹层
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.deptForm.resetFields()
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
    },
    // 获取员工简单列表数据
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },
    submitDept() {
      this.$refs.deptForm.validate(async(vali) => {
        // console.log(vali)
        if (vali) {
          // 校验通过
          if (this.formData.id) {
            await updateDepartments({ ...this.formData })
          } else {
            await addDepartments({ ...this.formData, pid: this.treeNode.id })
          }
          this.$message.success(`${this.formData.id ? '编辑' : '新增'}成功`)
          this.$emit('refreshDepts') // 告诉父组件，刷新列表
          this.handleClose()
        }
      })
    }
  }
}
</script>

<style>
</style>
