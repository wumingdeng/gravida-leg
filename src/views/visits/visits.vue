<template>
<div>
<el-card class="box-card">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
			</el-form>
    <el-row type="flex" align="middle" :gutter="20" style="padding:20px 0;">
      <el-table :data="tableData" style="width: 100%">
      <el-table-column fixed prop="createdAt" :formatter="createdateformatter" label="就诊时间" style="width: 15%">
      </el-table-column>
      <el-table-column prop="id" label="就诊号" style="width: 15%">
      </el-table-column>
      <el-table-column prop="patient_no" label="就诊人员编号" style="width: 15%">
      </el-table-column>
      <el-table-column prop="doctor_no" label="医生编号" style="width: 15%">
      </el-table-column>
      <el-table-column prop="content" label="内容" style="width: 50%">
      </el-table-column>
      <el-table-column label="操作" fixed='right'  style="width: 5%">
        <template scope="scope">
          <el-button
            size="small"
            @click="open2(scope.$index, scope.row)">报告</el-button>
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
    </el-card>
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
        doctor_no:0,
        filters: {
					name: ''
				},
    }
  },
  methods: {
      createdateformatter(row, column){
          var value = row.createdAt
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
              limit:this.$data.curPage*this.$data.pageSize,
              dn:this.doctor_no
          }
          this.$http.post(g.debugUrl+"getVisits",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              this.$data.tableData = res.body.d.rows;  
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
              k:"patient_no"
          }
          this.$http.post(g.debugUrl+"getVisitsBylike",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              this.$data.tableData = res.body.d.rows;  
              this.$data.listLoading = false    
          },
          (res)=>{
              this.$data.listLoading = false   
          })
      },
      open2(idx,row){
          var no = row.patient_no
          this.$router.push({ name: '客人报告', params: { no: no }})
      }
    },
    
   mounted (){
      console.log("mounted")
      var user = sessionStorage.getItem('user');
        if (user) {
            user = JSON.parse(user);
            this.doctor_no = user.doctor_no || '';
        }
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
