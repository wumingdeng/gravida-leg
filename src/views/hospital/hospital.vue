<template>
<div>
    <div class="toolbar">
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input v-model="filters.name" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="getUsers">查询</el-button>
            </el-form-item>
            <el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
        </el-form>
    </div>
    <el-row type="flex" align="middle" :gutter="20">
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
      <el-table-column prop="createdAt" :formatter="createdateformatter" label="创建日期" style="width: 15%">
      </el-table-column>
      <el-table-column prop="name" label="医院名" ></el-table-column>
      <el-table-column prop="host" label="访问地址" ></el-table-column>
      <el-table-column label="管理员账号"><template scope="scope">{{scope.row.admin.username}}</template></el-table-column>
      <el-table-column label="管理员密码"><template scope="scope">{{scope.row.admin.password}}</template></el-table-column>
      <el-table-column label="状态">
        <template scope="scope">
            <el-row>
            {{statusFor(scope.row.statue)}}
            <el-button
                size="small"
                v-if = "scope.row.statue == 1"
                @click="handleDelete(scope.$index, scope.row)">运行</el-button>
            <el-button
                size="small"
                v-else
                @click="handleDelete(scope.$index, scope.row)">关闭</el-button>
            </el-row>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
            <el-button
                size="small"
                @click="onEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination
          :current-page="curPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          layout="sizes, prev, pager, next"
          :total="total"
          @size-change="handle_setPageSize"
          @current-change="handle_setCurPage">
        </el-pagination>
      </el-row>

      <!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="90px" :rules="editFormRules" ref="editForm">
				<el-form-item label="医院名称" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
                <el-form-item label="访问地址" prop="host">
					<el-input v-model="editForm.host"></el-input>
				</el-form-item>
                <el-form-item label="管理员帐号" prop="username">
					<el-input v-model="editForm.username"></el-input>
				</el-form-item>
                <el-form-item label="管理员密码" prop="password">
					<el-input v-model="editForm.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="handleEdit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增医院" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="90px" :rules="addFormRules" ref="addForm">
				<el-form-item label="医院名称" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
                <el-form-item label="访问地址" prop="host">
					<el-input v-model="addForm.host"></el-input>
				</el-form-item>
                <el-form-item label="管理员帐号" prop="username">
					<el-input v-model="addForm.username"></el-input>
				</el-form-item>
                <el-form-item label="管理员密码" prop="password">
					<el-input v-model="addForm.password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
</div>
</template>

<script>
import api from "../../util/api.js";
import g from "../../globals/global.js";
export default {
  data () {
    return {
        curRow:{},
        curPage:1,
        pageSize:10,
        total:10,
        tableData:[],
        listLoading: false,

        editFormVisible:false,
        editLoading: false,
        editFormRules: {
            name: [
                { required: true, message: '请输入医院名称', trigger: 'blur' }
            ]
        },
        //编辑界面数据
        editForm: {
            id: 0,
            name: '',
            host:'',
            username:'',
            password:'',
        },

        addFormVisible: false,//新增界面是否显示
        addLoading: false,
        addFormRules: {
            name: [
                { required: true, message: '请输入医院名称', trigger: 'blur' }
            ]
        },
        //新增界面数据
        addForm: {
            name: '',
            host:'',
            username:'',
            password:'',
        },
        filters: {
            name: ''
        },
    }
  },
  methods: {
      statusFor(value){
           switch(value){
              case 0:
                  return "运行";
              case 1:
                  return "关闭";
              default:
                  return ""
           }
      },
      onEdit(idx,row){
          this.$data.editFormVisible = true
		  this.$data.editForm = Object.assign({}, row);
          this.curRow = row
      },
      handleEdit:function(){
          this.$refs.editForm.validate((valid) => {
            if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.$data.editLoading = true
                    Object.assign(this.curRow, this.$data.editForm);
                    this.$http.post(g.debugUrl+"saveHospitals",this.$data.editForm).then((res)=>{
                        if(res.ok == 1){
                            this.$message({
                                type: 'success',
                                message: '修改成功!'
                            });
                            this.$refs['editForm'].resetFields();
                            this.editFormVisible = false;
                        }
                        this.$data.editLoading = false
                    },
                    (res)=>{
                        this.$data.listLoading = false      
                    })
                });
            }
          })
      },
      handleDelete(idx,row){
          this.$confirm('确认修改状态吗？', '提示', {}).then(() => {
            this.$data.listLoading = true
            this.$http.post(g.debugUrl+"updateHospitalStatue",{id:row.id,st:row.statue}).then((res)=>{
                if(res.ok == 1){
                    this.$message({
                        type: 'success',
                        message: '修改成功!'
                    });
                    if(row.statue == 1){
                        this.$data.tableData[idx].statue = 0
                    }else{
                        this.$data.tableData[idx].statue = 1
                    }
                }else{
                    this.$alert('修改失败', '异常', {
                        confirmButtonText: '确定'
                    });
                }  
                this.$data.listLoading = false          
            },
            (res)=>{
                this.$data.listLoading = false      
            })
        });
      },
      addSubmit: function () {
        this.$refs.addForm.validate((valid) => {
            if (valid) {
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    this.addLoading = true;
                    this.$http.post(g.debugUrl+"saveHospitals",this.$data.addForm).then((res)=>{
                        console.log(res.body.d)
                        var ok = res.body.ok 
                        if(ok == 1){
                            this.addLoading = false;
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                            this.$refs['addForm'].resetFields();
                            this.addFormVisible = false;
                            this.findByPage()
                        }else if(ok == -1){
                            this.$alert('医院名称已存在', '更新失败', {
                                confirmButtonText: '确定'
                            });
                        }else{
                            this.$alert('添加医院失败', '异常', {
                                confirmButtonText: '确定'
                            });
                        }
                    });
                });
            }
        });
    },
    handleAdd: function () {
        this.addFormVisible = true;
        this.$data.addForm = {
            name: '',
            host:'',
            username:'',
            password:''
        };
    },
      createdateformatter(row, column){
          var value = row.createdAt
          if(value){
          var data = value.split('T')[0]
          var time = value.split('T')[1]
          time = time.split('.')[0]
          time = time.substring(0,5)
          return data+" "+time
          }else{
              return ""
          }
      },
      updateformatter(row, column){
          var value = row.updatedAt
          var data = value.split('T')[0]
          var time = value.split('T')[1]
          time = time.split('.')[0]
          time = time.substring(0,5)
          return data+" "+time
      },
      handle_setPageSize(pageSize){
         this.$data.pageSize = pageSize
         this.findByPage()
      },
      handle_setCurPage(currentPage){
          this.$data.curPage = currentPage
          this.findByPage()
      },
      findByPage(){
          this.$data.listLoading = true
          var postData = {
              offset:(this.$data.curPage-1)*this.$data.pageSize,
              limit:this.$data.pageSize,
          }
          this.$http.post(g.debugUrl+"getHospitals",postData,{credentials:true}).then((res)=>{
              if(res.body.d){
                this.$data.total = res.body.d.count;
                this.$data.tableData = res.body.d.rows;  
              }
              this.$data.listLoading = false    
          },
          (res)=>{
              this.$data.listLoading = false   
          })
      },
      getUsers(){
          this.$data.listLoading = true
          var postData = {
              offset:0,
              limit:this.$data.pageSize,
              v:this.$data.filters.name,
          }
          console.log(postData)
          this.$http.post(g.debugUrl+"getHospitalsByName",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              this.$data.tableData = res.body.d.rows;  
              this.$data.listLoading = false    
          },
          (res)=>{
              this.$data.listLoading = false   
          })
      }
    },
    
   mounted (){
      console.log("fukuan_mounted")
       this.findByPage()
   },
   created (){
       console.log("fukuan_create")
   }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
