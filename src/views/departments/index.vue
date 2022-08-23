<template>
  <div v-loading="loading" class="departments-container">
    <el-card>
      <tree-tools :tree-node="company" :is-root="false" @addDept="addDept" />
    </el-card>
    <el-tree :data="departs" :props="defaultProps" :default-expand-all="true">
      <tree-tools
        slot-scope="{ data }"
        :tree-node="data"
        @addDept="addDept"
        @editDept="editDept"
        @refreshDepts="getDepartments"
      />
    </el-tree>
    <add-dept
      ref="addDept"
      :dialog-visible.sync="dialogVisible"
      :tree-node="currentNode"
      @refreshDepts="getDepartments"
    />
  </div>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils'
import treeTools from './components/tree-tools.vue'
import AddDept from './components/add-dept.vue'
export default {
  name: 'Hrsaas1Index',
  components: { treeTools, AddDept },

  data() {
    return {
      departs: [],
      defaultProps: {
        label: 'name'
      },
      company: { name: '江苏传智播客教育科技股份有限公司', manager: '负责人' },
      dialogVisible: false,
      currentNode: {},
      loading: false
    }
  },

  mounted() {
    this.getDepartments()
  },

  methods: {
    async getDepartments() {
      this.loading = true
      const { depts, companyName, companyManage } = await getDepartments()
      // console.log(res)
      this.departs = tranListToTreeData(depts, '')
      this.company = { name: companyName, manager: companyManage, id: '' }
      this.loading = false
    },
    addDept(node) {
      this.dialogVisible = true
      this.currentNode = node
    },
    editDept(node) {
      this.dialogVisible = true
      this.currentNode = node
      this.$refs.addDept.formData = { ...node }
    }
  }
}
</script>

<style lang="scss">
.departments-container {
  width: 900px;
  margin: 20px auto;
  .el-tree-node__content {
    padding-right: 20px;
  }
}
</style>
