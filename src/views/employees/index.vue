<template>
  <div class="app-container">
    <PageTools :type="'info'">
      <span slot="before">共{{ total }}条记录</span>
      <template slot="after">
        <el-button size="small" type="warning" @click="$router.push('/import?type=user')">导入</el-button>
        <el-button size="small" type="danger" @click="exportData">导出</el-button>
        <el-button size="small" type="primary" @click="handleAdd">新增员工</el-button>
      </template>
    </PageTools>
    <el-card>
      <el-table border :data="list">
        <el-table-column label="序号" sortable="" type="index" />
        <el-table-column label="姓名" prop="username" />
        <el-table-column label="头像" align="center">
          <template slot-scope="{row}">
            <img
              slot="reference"
              v-imgError="require('@/assets/common/bigUserHeader.png')"
              :src="row.staffPhoto "
              style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
              alt=""
              @click="showQrCode(row.staffPhoto)"
            >
          </template>
        </el-table-column>
        <el-table-column label="工号" prop="workNumber" />
        <el-table-column label="聘用形式" prop="formOfEmployment" :formatter="formatterFormOfEmployment" />
        <el-table-column label="部门" prop="departmentName" />
        <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
          <span slot-scope="{row}">
            {{ row.timeOfEntry | formatDate }}
          </span>
        </el-table-column>
        <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
          <template slot-scope="{ row }">
            <!-- 根据当前状态来确定 是否打开开关 -->
            <el-switch :value="row.enableState === 1" />
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="role(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="deleteEmployee(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <el-pagination
          v-if="total > 0"
          background
          layout="prev, pager, next, sizes, total"
          :page-sizes="[10, 20, 30, 40]"
          :current-page.sync="page.page"
          :page-size.sync="page.size"
          :total="total"
          @current-change="getEmployeeList"
          @size-change="getEmployeeList"
        />
      </el-row>
    </el-card>
    <add-employsee :show-dialog.sync="showDialog" @refresh="getEmployeeList" />
    <!-- 头像二维码弹层 -->
    <el-dialog title="二维码" :visible.sync="showCodeDialog">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 权限 -->
    <assign-role ref="assignRole" v-model="value" :user-id="currentUserId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeNum from '@/api/constant/employees'
import addEmploysee from './components/add-employsee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'
export default {
  name: 'Hrsaas1Index',
  components: { addEmploysee, AssignRole },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10
      },
      total: 0, // 总数
      showDialog: false,
      showCodeDialog: false,
      value: false,
      currentUserId: ''
    }
  },

  mounted() {
    this.getEmployeeList()
  },

  methods: {
    async getEmployeeList() {
      try {
        const { rows, total } = await getEmployeeList(this.page)
        this.list = rows
        this.total = total
        if (total > 0 && rows.length === 0) {
          this.page.page = this.page.page - 1
          this.getEmployeeList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    formatterFormOfEmployment(row, column, cellValue, index) {
      const obj = EmployeeNum.hireType.find(ele => ele.id === cellValue * 1)
      // return obj ? obj.value : '非正式'
      return obj?.value ?? '非正式'
    },
    handleAdd() {
      this.showDialog = true
    },
    // 删除员工
    async deleteEmployee(id) {
      try {
        await this.$confirm('您确定删除该员工吗', { type: 'warning' })
        await delEmployee(id)
        this.getEmployeeList()
        this.$message.success('删除员工成功')
      } catch (error) {
        console.log(error)
        this.$message.fail('删除员工失败')
      }
    },
    // 导出数据
    async exportData() {
      const { rows } = await getEmployeeList({
        page: 1,
        size: 10
      })
      const headers = {
        '姓名': 'username',
        '手机号': 'mobile',
        '入职日期': 'timeOfEntry',
        '聘用形式': 'formOfEmployment',
        '转正日期': 'correctionTime',
        '工号': 'workNumber',
        '部门': 'departmentName'
      }
      // console.log(arr)
      const data = this.fromJson(headers, rows)
      import('@/vendor/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: Object.keys(headers), // 表头 必填
          data, // 具体数据 必填
          filename: 'excel-list', // 非必填
          autoWidth: true, // 非必填
          bookType: 'xlsx', // 非必填
          multiHeader: [['姓名', '主要信息', '', '', '', '', '']],
          merges: ['A1:A2', 'B1:G1']
        })
      })
    },
    fromJson(headers, rows) {
      return rows.map(ele => {
        return Object.values(headers).map(key => {
          if (key === 'timeOfEntry' || key === 'correctionTime') {
            return formatDate(ele[key])
          } else if (key === 'formOfEmployment') {
            const obj = EmployeeNum.hireType.find(obj => obj.id === ele[key])
            return obj?.value || '非正式'
          }
          return ele[key]
        })
      })
    },
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (!url) {
        this.$message.warning('该用户还未上传头像')
        return
      } else {
        this.showCodeDialog = true // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 有一个方法可以在上一次数据更新完毕，页面渲染完毕之后
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        })
      }
    },
    role(id) {
      this.currentUserId = id
      this.value = true
      this.$refs.assignRole.getRoleList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
