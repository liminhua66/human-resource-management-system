<template>
  <div>
    <UploadExcel :on-success="success" />
  </div>
</template>

<script>
import { importEmployee } from '@/api/employees'
export default {
  computed: {
    type() {
      return this.$route.query.type
    }
  },
  methods: {
    async success({ results }) {
      if (this.type === 'user') {
        const userRelations = {
          '入职日期': 'timeOfEntry',
          '手机号': 'mobile',
          '姓名': 'username',
          '转正日期': 'correctionTime',
          '工号': 'workNumber'
        }
        const arr = []
        results.forEach(item => {
          const userInfo = {}
          Object.keys(item).forEach(key => {
            userInfo[userRelations[key]] = item[key]
          })
          arr.push(userInfo)
        })
        //   console.log(arr)
        await importEmployee(arr)
      }
      this.$router.back()
    }
  }
}
</script>

<style>

</style>
