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
        <el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
            <el-form :inline="true" :model="formInline" style='margin-left:70px'>
                <el-form-item label="孕周">
                    <el-input v-model="formInline.start" placeholder="起始周"></el-input>
                </el-form-item>
                <el-form-item label="到">
                    <el-input v-model="formInline.end" placeholder="起始周"></el-input>
                </el-form-item>
            </el-form>
            <el-form ref="form" label-width="110px">
                <el-form-item label="关键词">
                    <div id="Elem_1" style="text-align:left"></div>
                </el-form-item>
                <el-form-item label="饮食">
                    <div id="Elem_2" style="text-align:left"></div>
                </el-form-item>
                <el-form-item label="运动">
                    <div id="Elem_3" style="text-align:left"></div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit">保存</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import E from 'wangeditor'
    export default {
      name: 'editor',
      Elem_1:{},
      Elem_2:{},
      Elem_3:{},
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
            editFormVisible:false,
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
          this.$data.editFormVisible = true
		  this.$data.formInline = Object.assign({}, row);
          this.curRow = row
        },
        getConfig(){
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
        },
        handleAdd(){

        }
        
      },
      mounted() {
        Elem_1 = new E('#Elem_1')
        Elem_1.customConfig.onchange = (html) => {
          this.editorContent_1 = html
        }
        Elem_1.create()
        Elem_2 = new E('#Elem_2')
        Elem_2.customConfig.onchange = (html) => {
          this.editorContent_2 = html
        }
        Elem_2.create()
        Elem_3 = new E('#Elem_3')
        Elem_3.customConfig.onchange = (html) => {
          this.editorContent_3 = html
        }
        Elem_3.create()
      }
    }
</script>

<style scoped>
</style>