<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :current-page="rightsInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="rightsInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "Rights",
    data() {
      return {
        // 获取用户列表的参数对象
        rightsInfo: {
          // 当前的页数
          pagenum: 1,
          // 当前每页显示多少条数据
          pagesize: 5
        },
        //权限列表
        rightsList: [],
        rightsList1: [],
        total: 0
      }
    },
    created() {
      //获取所有的权限
      this.getRightsList()
    },
    methods: {
      //获取权限列表
      async getRightsList() {
        const {data: res} = await this.$http.get('/rights/list')
        if (res.meta.status !== 200) {
          return this.$message.error('获取权限列表失败!')
        }
        this.rightsList1 = res.data
        this.total = res.data.length
        this.rightsList = this.rightsList1.slice(0, this.rightsInfo.pagesize)
        //console.log(this.rightsList)
      },
      // 监听 pagesize 改变的事件
      handleSizeChange(newSize) {
        // console.log(newSize)
        this.rightsInfo.pagesize = newSize
        this.getRightsList()
      },
      // 监听 页码值 改变的事件
      handleCurrentChange(newPage) {
        this.rightsInfo.pagenum = newPage
        let _start = (newPage - 1) * this.rightsInfo.pagesize;
        let _end = newPage * this.rightsInfo.pagesize;
        this.rightsList = this.rightsList1.slice(_start, _end);
      }
    }
  }
</script>

<style scoped>

</style>
