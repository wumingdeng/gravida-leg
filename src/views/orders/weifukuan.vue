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
    </el-form>
    </div>
    <el-row type="flex" align="middle" :gutter="20">
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
       <el-table-column style="width: 50%" label='宝贝' align='center'>
            <template scope="scope">
                <el-col :span="15"><img src="https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png" class="image">
                </el-col>
                <el-col :span="9">
                    <el-row style='float:left;text-align:left' >香港代购法国老牌珍贵水祛痘神仙水杨酸爽肤水闭口粉刺控油375ml</el-row>
                    <el-row style='float:left;text-align:left;color:#f00' >颜色分类：多功能枕-卡其色</el-row>
                    <el-row style='float:left;text-align:left;color:#f00' >数量：1</el-row>
                </el-col>
            </template>
        </el-table-column>
        <el-table-column style="width: 20%" label='宝贝' align='center'>
            <template scope="scope">
                <el-row>
                    <div style="float:left">{{scope.row.createdAt}}</div>
                </el-row>
                <el-row>
                    <div style="float:left">订单号:{{scope.row.id}}</div>
                </el-row>
            </template>
        </el-table-column>
        <el-table-column style="width: 20%" label='宝贝' align='center'>
            <template scope="scope">
                
            </template>
        </el-table-column>
        <el-table-column style="width: 10%" label='宝贝' align='center'>
            <template scope="scope">
                
            </template>
        </el-table-column>
      <el-table-column label="操作" style="width: 5%">
        <template scope="scope">
          <el-button
            v-if="scope.row.status == 1" 
            size="small"
            @click="open2(scope.$index, scope.row)">备货</el-button>
          <el-button
            v-else-if="scope.row.status == 2" 
            size="small"
            @click="open2(scope.$index, scope.row)">发货</el-button>
          <el-button
            v-else
            size="small"
            >无操作</el-button>
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
</div>
</template>

<script>
import api from "../../util/api.js";
import g from "../../globals/global.js";
export default {
  data () {
    return {
        curPage:1,
        pageSize:10,
        total:10,
        tableData:[],
        listLoading: false,
        filters: {
					name: ''
				},
    }
  },
  methods: {
      handleEdit(idx,row){
        this.$data.listLoading = true
        var pos={
          id:row.id,
          status:++row.status
        }
        this.$http.post(g.debugUrl+"updateOrders",pos).then((res)=>{
              if(res.ok == 1){
                  this.$message({
                    type: 'success',
                    message: '订单状态修改成功!'
                  });
                  row.status = pos.status
              } else{

              }   
              this.$data.listLoading = false          
          },
          (res)=>{
              this.$data.listLoading = false      
          })
      },
      statusFor(row,column){
           var value = row.status
           switch(value){
              case 0:
                  return "未付款";
              case 1:
                  return "已付款";
              case 2:
                  return "未发货";
              case 3:
                  return "已发货";
              default:
                  return ""
           }
      },
      createdateformatter(row, column){
          var value = row.createdAt
          var data = value.split('T')[0]
          var time = value.split('T')[1]
          time = time.split('.')[0]
          time = time.substring(0,5)
          return data+" "+time
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
              status:0
          }
          this.$http.post(g.debugUrl+"getOrders",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              this.$data.tableData = res.body.d.rows;  

              this.$data.listLoading = false    
          },
          (res)=>{
              this.$data.listLoading = false   
          })
      },
      open2(idx,row) {
        this.$confirm('是否修改该订单的状态, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.handleEdit(idx,row)
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消修改'
          });          
        });
      },
      getUsers(){
          this.$data.listLoading = true
          var postData = {
              offset:0,
              limit:this.$data.pageSize,
              v:this.$data.filters.name,
              k:"exp_no"
          }
          this.$http.post(g.debugUrl+"getOrdersBylike",postData).then((res)=>{
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
      console.log("weifukuan:mounted")
       this.findByPage()
   },
   created (){
       console.log("weifukuan:create")
   }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
