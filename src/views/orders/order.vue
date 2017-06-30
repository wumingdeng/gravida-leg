<template>
<div>
    <div class="toolbar">
        <el-form :inline="true" :model="filters">
            <el-form-item>
                <el-input v-model="filters.name" placeholder="订单号/手机号/收货人"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" v-on:click="getUsers">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-row type="flex" align="middle" :gutter="20">
      <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
      <el-table-column  width='400' label='商品信息' align='center' >
            <template scope="scope">
                <el-col :span="7" style='padding-top:10px;padding-left:0px;padding-right:20px'><img width='100' :src="scope.row.products[0].smallPic" class="image">
                </el-col>
                <el-col :span="17" style='padding-top:10px;padding-left:0px'>
                    <el-row style='text-align:left'>{{scope.row.products[0].name}}</el-row>
                    <el-row style='text-align:left'><div style='float:left;color:#c0c0c0'>颜色：</div><div style='color:#ff0000;float:left'>{{scope.row.color}}</div><div style='float:left;margin-left:20px'>尺码：</div><div style='color:#ff0000;float:left'>{{scope.row.size}}码</div></el-row>
                    <el-row style='text-align:left'><div style='float:left;color:#c0c0c0'>数量：</div><div style='color:#ff0000;float:left'>{{scope.row.count}}双</div><div style='float:left;margin-left:20px'>类型: </div><div style='color:#ff0000;float:left'>{{scope.row.type}}</div></el-row>
                </el-col>
            </template>
        </el-table-column>
        <el-table-column label='金额' align='center'>
            <template scope="scope">
                <el-row>单价:{{scope.row.products[0].price}}</el-row>
                <el-row style='color:#ff0000'>优惠:{{scope.row.products[0].discount}}</el-row>
                <el-row>合计:{{scope.row.products[0].price-scope.row.products[0].discount}}</el-row>
            </template>
        </el-table-column>
        <el-table-column width='200' label='订单信息' align='center'>
            <template scope="scope">
                <el-row>NO:{{scope.row.id}}</el-row>
                <el-row>{{createdateformatter(scope.row.createtime)}}</el-row>
            </template>
        </el-table-column>
        <el-table-column width='300' label='联系方式' align='center'>
            <template scope="scope">
                <el-row>{{scope.row.contact}} {{scope.row.tel}}</el-row>
                <el-row>{{scope.row.province+" "+scope.row.city+" "+scope.row.area}}</el-row>
                <el-row>{{scope.row.address}}</el-row>
            </template>
        </el-table-column>
      <el-table-column label='操作' align='center'>
            <template scope="scope">
                <el-row>{{statusName[scope.row.status]}}</el-row>
                <el-row>
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
                </el-row>
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
        statusName:[
					'待付款',
					'已付款',
					'未发货',
					'已发货'
				],
        curPage:1,
        pageSize:10,
        total:10,
        tableData:[],
        listLoading: false,
        status:0,
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
            console.log(res)
            if(res.body.ok == -2){
                this.$alert('session过期', '异常', {
                confirmButtonText: '确定'
                });
            }else if(res.body.ok == -1){
                this.$alert('数据库执行失败', '异常', {
                confirmButtonText: '确定'
                });
            }else if(res.body.ok == 1){
                this.$message({
                type: 'success',
                message: '订单状态修改成功!'
                });
                this.$data.tableData.splice(idx,1)
            }
            this.$data.listLoading = false          
        },
        (res)=>{
              this.$data.listLoading = false      
        })
    },
      statusFor(value){
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
      createdateformatter(temptime){
          var unixTimestamp = new Date(temptime*1000 ) ;
            return unixTimestamp.toLocaleString();
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
              status:status
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
          if(status==2){
            this.$prompt('请输入快递单号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                this.$message({
                    type: 'success',
                    message: '你输入的快递单号: ' + value
                });
                this.handleEdit(idx,row)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
          }else{
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
          }
      },
      getUsers(){
          this.$data.listLoading = true
          var postData = {
              offset:0,
              limit:this.$data.pageSize,
              status:this.status,
              v:this.$data.filters.name,
          }
          this.$http.post(g.debugUrl+"getOrdersBylike",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              this.$data.tableData = res.body.d.rows;  
              this.$data.listLoading = false    
          },
          (res)=>{
              this.$data.listLoading = false
          })
      },
      getStatus(path){
          switch(path){
              case "/home":
                status = 0
              break;
              case "/fukuan":
                status = 1
              break;
              case "/weishouhuo":
                status = 2
              break;
              case "/shouhuo":
                status = 3
              break;
              default:
                status = 4
              break
          }
          eventBus.$emit("onselectedOrder",status)
      }
    },
   mounted (){
       this.findByPage()
   },
   watch: {
        '$route' (to, from) {
            
            this.getStatus(this.$route.path)
            this.findByPage()
        }
    }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
