<template>
  <el-container class="home-container">
    <el-header>
      <img src="../assets/timg.jpg" alt="">
      <span>电商后台管理系统</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        name: "Home",
        methods:{
          logout() {
            window.sessionStorage.clear();
            this.$router.push('/login');
          }
        }
    }
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #69abe8;
}
.el-aside {
  background-color: #222D31;
}
.el-main {
  background-color: #eaedf1;
}

</style>
