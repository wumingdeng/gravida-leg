<template>
<div>
<el-card class="box-card">
      <h3>订单列表</h3>
      <el-row type="flex" align="middle" :gutter="20" style="padding:20px 0;">
    <el-table
    :data="tableData"
    border
    style="width: 100%">
    <el-table-column
      fixed
      prop="date"
      label="日期"
      width="150">
    </el-table-column>
    <el-table-column
      prop="id"
      label="订单号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="120">
    </el-table-column>
    <el-table-column
      prop="pro_no"
      label="产品号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="addr"
      label="地址"
      width="300">
    </el-table-column>
    <el-table-column
      prop="exp_no"
      label="快递编号"
      width="120">
    </el-table-column>
    <el-table-column
      prop="pay_t"
      label="付款时间"
      width="120">
    </el-table-column>
    <el-table-column
      prop="create_t"
      label="下单时间"
      width="120">
    </el-table-column>
    <el-table-column label="操作" fixed='right'>
      <template scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  </el-row>
      <el-row type="flex" justify="end" style="padding:20px 0; ">
        <el-pagination
          :current-page="1"
          :page-sizes="[100, 200, 300, 400]"
          :page-size="100"
          layout="sizes, prev, pager, next"
          :total="1000"
          @size-change="handle_setPageSize"
          @current-change="handle_setCurPage">
        </el-pagination>
      </el-row>
    </el-card>
</div>
</template>

<script>
import api from "../util/api.js";
import g from "../globals/global.js";
export default {
  data () {
    return {
        _curPage:1,
        _pageSize:100,
        tableData:[]
    }
  },
  methods: {
      handle_setPageSize(pageSize){
         this.$data._pageSize = pageSize
         this.findByPage()
      },
      handle_setCurPage(currentPage){
          this.$data._curPage = currentPage
          this.findByPage()
      },
      findByPage(){
          var postData = {
              offset:(this.$data._curPage-1)*this.$data._pageSize,
              limit:this.$data._curPage*this.$data._pageSize
          }
          this.$http.post(g.debugUrl+"getOrders",postData).then(res=>{
              this.$data.tableData = res.d;  
          },
          res=>{

          })
        console.log("_curPage:"+this.$data._curPage+"  _pageSize:"+this.$data._pageSize)
      }
    // this.$http.get()
  },
   mounted (){
       this.findByPage()
   },
   created (){
       console.log("create")
   }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
