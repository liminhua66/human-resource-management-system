<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <el-row style="height:60px">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">新增角色</el-button>
        </el-row>
        <el-table
          v-loading="loading"
          border
          style="width: 100%"
          :data="list"
        >
          <el-table-column
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="description"
            label="描述"
          />
          <el-table-column
            label="操作"
            width="320"
          >
            <template slot-scope="scope">
              <el-button type="success" size="medium">分配权限</el-button>
              <el-button type="primary" size="medium" @click="editRole(scope.row)">编辑</el-button>
              <el-button type="danger" size="medium" @click="delRole(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row style="height:60px" type="flex" justify="end" align="middle">
          <el-pagination
            background
            layout="total, prev, pager, next, sizes"
            :total="total"
            :current-page.sync="page.page"
            :page-size.sync="page.pagesize"
            :page-sizes="[5, 10, 15, 20]"
            @size-change="changePage"
            @current-change="changeSize"
          />
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="公司信息" name="second">
        <el-alert
          title="公司信息"
          type="info"
        />
        <el-form label-width="120px" style="margin-top:50px">
          <el-form-item label="公司名称">
            <el-input v-model="companyInfo.name" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="公司地址">
            <el-input v-model="companyInfo.companyAddress" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="companyInfo.mailbox" disabled style="width:400px" />
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="companyInfo.remarks" type="textarea" :rows="3" disabled style="width:400px" />
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <role-dialog ref="roleDialog" :dialog-visible.sync="dialogVisible" @refresh="getRoleList" />
  </div>
</template>

<script>
import { getRoleList, deleteRole, getCompanyInfo } from '@/api/setting'
import roleDialog from './components/roleDialog.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'Hrsaas1Index',
  components: { roleDialog },

  data() {
    return {
      activeName: 'first',
      page: {
        page: 1,
        pagesize: 10
      },
      list: [],
      total: 0,
      loading: false,
      dialogVisible: false,
      companyInfo: {}
    }
  },

  computed: {
    ...mapGetters(['companyId'])
  },

  mounted() {
    this.getRoleList()
    this.getCompanyInfo()
  },

  methods: {
    async getRoleList() {
      try {
        this.loading = true
        const res = await getRoleList(this.page)
        // console.log(res)
        this.list = res.rows
        this.total = res.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    changePage() {
      this.getRoleList()
    },
    changeSize() {
      this.getRoleList()
    },
    handleAdd() {
      this.dialogVisible = true
    },
    // 编辑
    editRole(row) {
      this.dialogVisible = true
      this.$refs.roleDialog.roleForm = { ...row }
    },
    // 删除
    async delRole(id) {
      try {
        await this.$confirm('是否删除角色', '提示', { type: 'warning' })
        await deleteRole(id)
        this.$message.success('角色删除成功')
        this.page.page = 1
        this.getRoleList()
      } catch (error) {
        console.log(error)
      }
    },
    async getCompanyInfo() {
      this.companyInfo = await getCompanyInfo(this.companyId)
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    padding: 20px;
  }
</style>
