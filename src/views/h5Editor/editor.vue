<template>
    <section>
        <div class="toolbar">
            <el-form :inline="true">
                <el-form-item>
                    <el-select v-model="filters_type" placeholder="筛选">
                        <el-option :label="type==0?'关键词':'偏轻'" value="0"></el-option>
                        <el-option :label="type==0?'饮食':'标准'" value="1"></el-option>
                        <el-option :label="type==0?'运动':'偏重'" value="2"></el-option>    
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getConfig">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleAdd">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="pushphone">推送</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="10">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
            <el-table-column prop="minweek" label="开始周数" width='100' ></el-table-column>
            <el-table-column prop="maxweek" label="结束周数" width='100'></el-table-column>
            <el-table-column width='100'
                :show-overflow-tooltip="true"
                :label="type==1?'体重标准':'标签'"
                >
                <template scope="scope">
                    {{weightformatter(scope.row)}}
                </template>
            </el-table-column>
            <el-table-column prop='con_sug' label="管理建议" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column v-if="type==1" prop='con_diet' label="饮食注意" :show-overflow-tooltip="true" ></el-table-column>
            <el-table-column label="操作" width='200'>
                <template scope="scope">
                    <el-button
                        size="small"
                        @click="onEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button
                    size="small"
                    @click="onDel(scope.$index, scope.row.id)">删除</el-button>
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
    import g from "../../globals/global.js";
    export default {
        name: 'editor',
        data () {
            return {
                type:0,
                curPage:1,
                pageSize:10,
                total:0,
                listLoading:false,
                tableData:[],
                filters_type:'',
                filters: {
                    type: ''
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
            pushphone:function(){
                this.$http.get(g.debugUrl+"push_config").then((res)=>{
                    if(res.body.ok == 1){
                        this.$alert('推送成功', '异常', {
                            confirmButtonText: '确定'
                        });
                    }else if(res.body.error){
                        this.$alert('推送失败', '异常', {
                            confirmButtonText: '确定'
                        });
                    }
                    this.$data.listLoading = false    
                },
                (res)=>{
                    this.$alert('推送失败', '异常', {
                        confirmButtonText: '确定'
                    });
                    this.$data.listLoading = false      
                })
            },
            weightformatter(row){
                if(this.$data.type == 0){
                    switch(row.type){
                        case 0:
                            return '关键词';
                        case 1:
                            return '饮食';
                        case 2:
                            return '运动';
                        default:
                            return ''
                    }
                }else{
                    switch(row.type){
                        case 0:
                            return '偏轻';
                        case 1:
                            return '标准';
                        case 2:
                            return '偏重';
                        default:
                            return ''
                    }
                }
            },
            getContent: function () {
                alert(this.editorContent)
            },
            handle_setPageSize(pageSize){
                this.$data.pageSize = pageSize
                this.getConfig()
            },
            handle_setCurPage(currentPage){
                console.log(currentPage)
                this.$data.curPage = currentPage
                this.getConfig()
            },
            onEdit(idx,row){
                this.$router.push({name:'修改配置',params: { type: this.$data.type,isModify:1,row:row}})
            },
            onDel(idx,id){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    this.$data.listLoading = true
                    this.$http.post(g.debugUrl+"del_config",{id:id,type:this.$data.type}).then((res)=>{
                        if(res.body.ok == -2){
                            this.$alert('session过期', '异常', {
                            confirmButtonText: '确定'
                            });
                        }else if(res.body.ok == -1){
                            this.$alert('数据库执行失败', '异常', {
                            confirmButtonText: '确定'
                            });
                        }else{
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.$data.tableData.splice(idx,1)
                        }
                        this.$data.listLoading = false    
                    },
                    (res)=>{
                        this.$data.listLoading = false      
                    })
                });
            },
            getConfig(){
                this.$data.listLoading = true
                var postData = {
                    offset:(this.$data.curPage-1)*this.$data.pageSize,
                    limit:this.$data.pageSize,
                    type:this.$data.type
                }
                if(this.filters_type != ''){
                    postData.ft = this.filters_type
                }
                console.log(postData)
                this.$http.post(g.debugUrl+"find_config",postData).then((res)=>{
                    if(res.body.ok == -2){
                        this.$alert('session过期', '异常', {
                        confirmButtonText: '确定'
                        });
                    }else if(res.body.ok == -1){
                        this.$alert('数据库执行失败', '异常', {
                        confirmButtonText: '确定'
                        });
                    }else{
                        this.$data.total = res.body.d.count;
                        this.$data.tableData = res.body.d.rows;
                    }
                    this.$data.listLoading = false    
                },
                (res)=>{
                    this.$data.listLoading = false   
                })
            },
            handleAdd(){
                this.$router.push({name:'修改配置',params: { type: this.$data.type,isModify:0}})
            },
            getStatus(path){
                switch(path){
                case "/weight_list":
                    this.$data.type = 1
                    break;
                case "/gravida_list":
                    this.$data.type = 0
                    break;
                default:
                    break
            }
            }
        },
        mounted() {
            this.getStatus(this.$route.path)
            this.getConfig()
        },
        watch: {
            '$route' (to, from) {
                this.filters_type = ''
                this.getStatus(to.path)
                this.curPage = 1
                this.pageSize = 10
                this.getConfig()
            }
        }
    }
</script>

<style scoped>
</style>