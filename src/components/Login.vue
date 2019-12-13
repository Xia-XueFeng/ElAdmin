<template>
    <div class="login_container">
      <div class="login_box">
        <!--头像区域-->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt="">
        </div>
        <!--登录表单 ref="loginFormRef" loginFormRef表单的实例对象-->
        <el-form  :model="loginForm" ref="loginFormRef" :rules="loginFormRules" label-width="0px" class="login_form">
          <!--用户名和密码-->
          <el-form-item prop="username">
           <el-input v-model="loginForm.username" prefix-icon="el-icon-s-custom"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password " type="password" prefix-icon="el-icon-lock"></el-input>
          </el-form-item>
          <!--按钮区-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
</template>

<script>
    export default {
      name: "Login",
      data() {
        return {
          //这是登录表单的数据绑定对象
          loginForm:{
            username:'admin',
            password:'123456'
          },
          //表单的验证规则对象
          loginFormRules:{
            //验证用户名是否合法
            username:[
              { required: true, message: '请输入用户名', trigger: 'blur' },
              { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
            password:[
              { required: true, message: '请输入用户名密码', trigger: 'blur' },
              { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
            ]
          }
        }
      },
      methods:{
        //点击重置按钮，清空表单数据
        resetLoginForm() {
          this.$refs.loginFormRef.resetFields()
        },
        login() {
          this.$refs.loginFormRef.validate(async valid=>{
            //先验证
            if(!valid) return;
            //返回值是 promise用 await 和async 异步
            //解构
            const {data : res} =await this.$http.post("login",this.loginForm);
            if(res.meta.status !==200) return this.$message.error('登录失败，用户名或密码错误')
            this.$message.success('登录成功')
            // 1. 将登录成功之后的 token，保存到客户端的 sessionStorage 中
            //   1.1 项目中除了登录之外的其他API接口，必须在登录之后才能访问
            //   1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
            console.log(res)
            window.sessionStorage.setItem("token",res.data.token);
            //2.通过编程式导航跳到后台主页,路由地址是 /home
            this.$router.push("/home")
          });
        }
      }
    }
</script>

<style scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius:3px;
    position: absolute;/*/加上绝对定位才能进行位移 */
    left:50%;
    top: 50%;
    /*进行位移操作，横轴和竖轴*/
    transform: translate(-50%,-50%);
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border:1px solid #eee;
    border-radius:50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
  }
  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .login_form {
    position:absolute;
    bottom: 0;
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
  }
  .btns {
    /*Flex是Flexible Box的缩写，意为”弹性布局”，用来为盒状模型提供最大的灵活*/
    display: flex;
    /*justify-content 用于设置或检索弹性盒子元素在主轴（横轴）方向上的对齐方式。*/
    justify-content: flex-end;
  }
</style>
