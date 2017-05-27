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
                <el-col :span="7" style='padding-top:10px;padding-left:0px;padding-right:20px'><img width='100' :src="scope.row.goods[0].icon" class="image">
                </el-col>
                <el-col :span="17" style='padding-top:10px;padding-left:0px'>
                    <el-row style='text-align:left'>{{scope.row.goods[0].info}}</el-row>
                    <el-row style='text-align:left'><div style='float:left;color:#c0c0c0'>颜色：</div><div style='color:#ff0000;float:left'>{{setColorStr(scope.row.goods_color)}}</div><div style='float:left;margin-left:20px'>尺码：</div><div style='color:#ff0000;float:left'>{{scope.row.goods_size}}码</div></el-row>
                    <el-row style='text-align:left'><div style='float:left;color:#c0c0c0'>数量：</div><div style='color:#ff0000'>{{scope.row.goods_count}}双</div></el-row>
                </el-col>
            </template>
        </el-table-column>
        <el-table-column label='金额' align='center'>
            <template scope="scope">
                <el-row>单价:{{scope.row.goods[0].price}}</el-row>
                <el-row style='color:#ff0000'>优惠:{{scope.row.goods[0].discount}}</el-row>
                <el-row>合计:{{scope.row.goods[0].price-scope.row.goods[0].discount}}</el-row>
            </template>
        </el-table-column>
        <el-table-column width='200' label='订单信息' align='center'>
            <template scope="scope">
                <el-row>NO:{{scope.row.id}}</el-row>
                <el-row>{{scope.row.createdAt.split('T')[0]}} {{scope.row.createdAt.split('T')[1].substring(0,5)}}</el-row>
            </template>
        </el-table-column>
        <el-table-column width='300' label='联系方式' align='center'>
            <template scope="scope">
                <el-row>{{scope.row.custom}} {{scope.row.custom_phone}}</el-row>
                <el-row>{{scope.row.addr_o}}</el-row>
                <el-row>{{scope.row.addr_a}}</el-row>
            </template>
        </el-table-column>
      <el-table-column label='操作' align='center'>
            <template scope="scope">
                <el-row>{{statusFor(scope.row.status)}}</el-row>
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
      setColorStr(color){
        switch(color){
              case 0:
                  return "绿色";
              case 1:
                  return "红色";
              case 2:
                  return "黄色";
              case 3:
                  return "黑色";
              default:
                  return "白色"
           }
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
              status:status
          }
          this.$http.post(g.debugUrl+"getOrders",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              console.log('asdkfjksdkjfk')
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
              case "/":
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
