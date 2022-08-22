<template>
  <div>
    <el-dialog
      :title="`${roleForm.id? '编辑':'新增'}角色`"
      width="60%"
      :visible.sync="dialogVisible"
      center
      :before-close="handleClose"
    >
      <el-form
        ref="roleDialogForm"
        :model="roleForm"
        label-width="80px"
      >
        <el-form-item
          prop="name"
          label="角色"
          :rules="[{required:true, message:'请输入角色', trigger:'blur' }]"
        >
          <el-input v-model="roleForm.name" placeholder="请输入角色" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="roleForm.description" placeholder="请输入描述" type="textarea" row="3" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center" align="middle" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="submitRole">确 定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { addRole, updateRole } from '@/api/setting'
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      roleForm: {
        name: '',
        description: ''
      },
      loading: false
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
      this.$refs.roleDialogForm.resetFields()
      this.roleForm = {
        name: '',
        description: ''
      }
    },
    async submitRole() {
      try {
        this.loading = true
        await this.$refs.roleDialogForm.validate()
        this.roleForm.id ? await updateRole(this.roleForm) : await addRole(this.roleForm)
        this.$message.success(`角色${this.roleForm.id ? '修改' : '新增'}成功`)
        this.$emit('refresh')
        this.handleClose()
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
