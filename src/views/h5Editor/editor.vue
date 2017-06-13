<template>
    <section>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="姓名"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getConfig">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="20">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
            <el-table-column prop="start" label="开始周数" ></el-table-column>
            <el-table-column prop="end" label="结束周数" ></el-table-column>
            <el-table-column prop='con_diet' label="饮食"></el-table-column>
            <el-table-column prop='con_sug' label="建议"></el-table-column>
            <el-table-column lprop='con_sign' abel="关键词"></el-table-column>
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
            
    </section>
</template>

<script>
    import E from 'wangeditor'
    export default {
      name: 'editor',
      data () {
        return {
            curPage:1,
            pageSize:10,
            total:0,
            listLoading:false,
            tableData:[],
            filters: {
                name: ''
            },  
            formInline: {
                start: '',
                end: ''
            },
            editorContent_1: '',
            editorContent_2: '',
            editorContent_3: '',
            editFormVisible:true,
            curRow:{}
        }
      },
      methods: {
        getContent: function () {
            alert(this.editorContent)
        },
        onSubmit:function(event){
            
        },
        handle_setPageSize(pageSize){
         this.$data.pageSize = pageSize
        },
        handle_setCurPage(currentPage){
            this.$data.curPage = currentPage
        },
        onEdit(idx,row){
          this.$router.push({name:'modify',params: { type: this.$data.type,isModify:1,row:row}})
        },
        getConfig(){
          this.$data.listLoading = true
          var postData = {
              offset:0,
              limit:this.$data.pageSize,
              type:this.$data.type
          }
          console.log(postData)
          this.$http.post(g.debugUrl+"find_config",postData).then((res)=>{
              this.$data.total = res.body.d.count;
              this.$data.tableData = res.body.d.rows;  
              this.$data.listLoading = false    
          },
          (res)=>{
              this.$data.listLoading = false   
          })
        },
        handleAdd(){
           this.$router.push({name:'modify',params: { type: this.$data.type,isModify:0}})
        },
        getStatus(){
            switch(path){
              case "/weight_list":
                this.type = 1
              break;
              case "/gravida_list":
                this.type = 0
              break;
              default:
              break
          }
        }
      },
      mounted() {
        
      },
      watch: {
        '$route' (to, from) {
            this.curPage = 1
            this.pageSize = 10
            this.getStatus(this.$route.path)
            this.getConfig()
        }
    }
    }
</script>

<style scoped>
</style>