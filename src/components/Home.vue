<template>
  <el-container class="home-container">
    <!--头部区域-->
    <el-header>
      <div>
        <img src="../assets/timg.jpg" alt="" width="60px" height="60px">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--页面主体区域 左侧菜单，右侧内容-->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    name: "Home",
    data() {
      return {
        // 左侧菜单数据
        menulist:[],
        // 图标数组
        iconsObj: {
          '125': 'el-icon-s-custom',
          '103': 'el-icon-s-check',
          '101': 'el-icon-s-goods',
          '102': 'el-icon-s-order',
          '145': 'el-icon-s-data'
        },
        //是否折叠
        isCollapse: false,
        // 被激活的链接地址
        activePath: ''
      }
    },
    created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods:{
      logout() {
        window.sessionStorage.clear();
        this.$router.push('/login');
      },
      // 获取所有的菜单
      async getMenuList() {
        const {data:res} =await this.$http.get('menus')
        if(res.meta.status !==200) return this.$message.error(res.meta.msg)
        this.menulist =res.data
        console.log(res)
      },
      //点击按钮,切换菜单的折叠菜单与展开
      toggleCollapse() {
        this.isCollapse =!this.isCollapse
      },
      // 保存链接的激活状态
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
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
    display: flex;
    justify-content: space-between;
    padding-left:0;
    align-items: center;
    color: #fff;
    font-size: 20px;

  }
  .el-header div {
    display: flex;
    align-items: center;
  }

  .el-header div span {
    margin-left: 15px;
  }
  .el-header div img {
    border:1px solid #eee;
    border-radius:50%;
  }
  .el-aside {
    background-color: #222D31;
  }

  .el-menu {
    border-right:none;
  }
  .el-main {
    background-color: #eaedf1;
  }
  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.3em;
    cursor: pointer;
  }
</style>
