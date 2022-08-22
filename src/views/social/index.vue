<template>
  <div class="app-container">
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <el-row style="height:60px">
          <el-button type="primary" icon="el-icon-plus" size="small">新增角色</el-button>
        </el-row>
        <el-table
          border
          style="width: 100%"
          :data="[{name:'1231'}]"
        >
          <el-table-column
            type="index"
            label="序号"
            width="180"
          />
          <el-table-column
            prop="name"
            label="角色名称"
            width="180"
          />
          <el-table-column
            prop="address"
            label="描述"
          />
          <el-table-column
            label="操作"
          >
            <el-button type="success" size="medium">分配权限</el-button>
            <el-button type="primary" size="medium">编辑</el-button>
            <el-button type="danger" size="medium">删除</el-button>
          </el-table-column>
        </el-table>
        <el-row style="height:60px" type="flex" justify="end" align="middle">
          <el-pagination
            background
            layout="prev, pager, next"
            :total="1000"
          />
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">公司信息</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getRoleList } from '@/api/setting'
export default {
  name: 'Hrsaas1Index',

  data() {
    return {
      activeName: 'first',
      page: {
        page: 1, pagesize: 10
      },
      list: [],
      total: 0
    }
  },

  async mounted() {
    const res = await getRoleList(this.page)
    // console.log(res)
    this.list = res.rows
    this.total = res.total
  },

  methods: {

  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    padding: 20px;
  }
</style>
