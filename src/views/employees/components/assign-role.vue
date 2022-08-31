<template>
  <el-dialog title="分配角色" :visible="value" :before-close="handClose">
    <el-checkbox-group v-model="roleIds">
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{
        item.name
      }}</el-checkbox>
    </el-checkbox-group>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button type="primary" size="small" @click="confirmRole">确定</el-button>
        <el-button size="small" @click="handClose()">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserDetailById } from '@/api/user'
import { assignRoles } from '@/api/employees'
export default {
  name: 'HrsaasAssignRole',
  model: { event: 'upadate' },
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleIds: [],
      roleList: []
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.getUserDetailById()
      }
    }
  },
  created() {
    // this.getRoleList()
  },
  methods: {
    handClose() {
      this.$emit('upadate', false)
      this.roleIds = []
    },
    async getRoleList() {
      try {
        const { rows } = await getRoleList()
        this.roleList = rows
      } catch (e) {
        console.log(e)
      }
    },
    async getUserDetailById() {
      const { roleIds } = await getUserDetailById(this.$attrs['user-id'])
      this.roleIds = roleIds || []
    },
    async confirmRole() {
      try {
        await assignRoles({ id: this.$attrs['user-id'], roleIds: this.roleIds })
        this.handClose()
        this.$message.success('添加成功')
      } catch (error) {
        console.log(error)
        this.$message.error('添加失败，请重试')
      }
    }
  }
}
</script>
