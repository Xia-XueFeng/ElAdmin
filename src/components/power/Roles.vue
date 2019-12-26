<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>

      <!--角色列表区域-->
      <el-table :data="rolelist" border stripe>
        <!--展开列-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom',i1===0 ? 'bdtop':'','vcenter']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
              <!--渲染一级权限-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--渲染二级权限和三级权限-->
              <el-col :span="19">
                <!--通过for循环 嵌套渲染二级权限-->
                <el-row :class="[i2===0 ? '': 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" closable @close="removeRightById(scope.row, item3.id)" v-for="(item3,i3) in item2.children" :key="item3.id">{{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="360px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRoleDialog(scope.row.id)">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
            <el-button size="mini" type="warning" @click="showSetRightDialog(scope.row)" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分配权限的对话框-->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%"
               @close="setRightDialogClosed" >
      <!--树形控件-->
      <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all
               :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
    <!--修改角色的对话框-->
    <el-dialog title="修改角色信息" :visible.sync="eidtRoleDialogVisible"
      width="50%">
      <el-form :model="roleInfo" ref="roleInfoFormRef" label-width="70px">
        <el-form-item label="角色名">
          <el-input v-model="roleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="email">
          <el-input v-model="roleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="eidtRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoleInfo">确 定</el-button>
  </span>
    </el-dialog>
    <!--添加角色的对话框-->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <!-- 内容主体区域 -->
      <el-form :model="addRoleForm" :rules="addRoleFormRules" ref="addRoleFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
  export default {
    name: "Roles",
    data() {
      return {
        //所有的角色列表数据
        rolelist: [],
        //控制分配权限对话框的显示与隐藏
        setRightDialogVisible:false,
        //修改角色对话框的显示与隐藏
        eidtRoleDialogVisible:false,
        //添加角色对话框的显示与隐藏
        addRoleDialogVisible:false,
        //所有权限的数据
        rightslist:[],
        //树形控件绑定的属性对象
        treeProps: {
          label: 'authName',
          children:'children'
        },
        //默认选中的节点Id值数组
        defKeys:[],
        //当前即将分配权限的角色id
        roleId:'',
        //查询到的角色信息
        roleInfo:{},
        //添加角色的表单数据
        addRoleForm:{},
        // 添加角色表单的验证规则对象
        addRoleFormRules: {
          roleName: [
            {required: true, message: '请输入角色名', trigger: 'blur'},
            {
              min: 3,
              max: 10,
              message: '角色名的长度在3~10个字符之间',
              trigger: 'blur'
            }
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {
              min: 2,
              max: 20,
              message: '角色描述的长度在2~20个字符之间',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    created() {
      this.getRolesList()
    },
    methods: {
      //获取所有的角色的列表
      async getRolesList() {
        const {data: res} = await this.$http.get('roles')
        if (res.meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        this.rolelist = res.data
        //console.log(this.rolelist)
      },
      //根据id删除角色权限
      async removeRightById(role,rightId) {
        //弹框提示用户是否要删除
        const confirmResult = await this.$confirm(
          '此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !=='confirm') {
          return this.$message.info('取消了删除！')
        }
        const {data:res} = await  this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        )
        if(res.meta.status !==200) {
          return this.$message.error('删除权限失败！')
        }
        //this.getRolesList()
        role.children = res.data
      },
      //展示分配权限的对话框
      async showSetRightDialog(role) {
        this.roleId = role.id
        //获取所有权限的数据
        //{data : res}解构直接将data拿出来给res
        const {data : res} = await this.$http.get('rights/tree')
        if(res.meta.status !==200) {
          return this.$message.error('获取权限数据失败！')
        }
        //把获取到的权限数据保存到data中
        this.rightslist = res.data
       // const = await this.$http.get
        //递归获取三级节点的Id
        this.getLeafKeys(role,this.defKeys)
        this.setRightDialogVisible = !this.setRightDialogVisible
      },
      //通过递归的形式，获取角色下所有的三级权限的id，并保存到defKeys数组中
      getLeafKeys(node,arr) {
        //如果当前node节点不包含children属性，则是三级节点
        if(!node.children) {
          return arr.push(node.id)
        }
        node.children.forEach(item =>
          this.getLeafKeys(item,arr)
        )
      },
      //监听分配权限对话框的关闭事件
      setRightDialogClosed() {
        this.defKeys= []
      },
      //点击为角色分配权限
      async allotRights() {
        const keys = [
            ...this.$refs.treeRef.getCheckedKeys(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.join(',')
        const {data:res} = await this.$http.post(
          `roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status !==200) {
          return this.$message.error('分配权限失败!')
        }
        this.$message.success('分配权限成功！')
        this.getRolesList()
        this.setRightDialogVisible = false
      },
      //点击修改角色对话框,显示角色信息
      async editRoleDialog(roleId) {
        this.roleId=roleId
        const {data: res }= await this.$http.get(`roles/${this.roleId}`)
        if(res.meta.status!=200) {
          return this.$message.error("获取角色信息失败")
        }
        this.roleInfo=res.data
        this.eidtRoleDialogVisible=true
      },
      //修改角色信息，提交到数据库
      async editRoleInfo(){
        console.log(this.roleInfo.roleId)
        const {data:res} = await this.$http.put('roles/'+this.roleInfo.roleId,
          {
            roleName:this.roleInfo.roleName,
            roleDesc:this.roleInfo.roleDesc
          })
        console.log(res.data)
        console.log(res.meta)
       // debugger
        if(res.meta.status != 200) {
          return this.$message.error('修改角色信息失败！')
        }
        this.getRolesList()
        this.eidtRoleDialogVisible = false
        this.$message.success('修改角色信息成功！')
      },
      //根据角色id删除角色信息
      async removeRoleById(roleId) {
        // 弹框询问用户是否删除数据
        const confirmResult = await this.$confirm(
          '此操作将永久删除该角色, 是否继续?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(err => err)

        // 如果用户确认删除，则返回值为字符串 confirm
        // 如果用户取消了删除，则返回值为字符串 cancel
        // console.log(confirmResult)
        if (confirmResult !== 'confirm') {
          return this.$message.info('已取消删除')
        }
        const {data: res} = await this.$http.delete('roles/' + roleId)
        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败！')
        }
        this.$message.success('删除角色成功！')
        this.getRolesList()
      },
      //添加角色信息
      addRole() {
        this.$refs.addRoleFormRef.validate(async valid=> {
          if (!valid) return
          //发起添加角色信息的数据请求
          const {data:res} = await this.$http.post('roles',this.addRoleForm)
          if (res.meta.status !== 201) {
            this.$message.error('添加角色失败！')
          }
          this.$message.success('添加角色成功！')
          // 隐藏添加角色的对话框
          this.addRoleDialogVisible = false
          // 重新获取角色列表数据
          this.getRolesList()
        })
      },
      addRoleDialogClosed() {

      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdtop {
    border-top: 1px solid #eee;
  }

  .bdbottom {
    border-bottom: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }

</style>
