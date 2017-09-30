<template>
    <div>
        <div class="toolbar">
            <el-form :inline="true" :model="filters">
                <el-form-item>
                    <el-input v-model="filters.name" placeholder="平台名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="findByPage">查询</el-button>
                </el-form-item>
                 <el-form-item>
                    <el-button type="primary" v-on:click="onAddForm">添加</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-row type="flex" align="middle" :gutter="0">
            <el-table v-loading="listLoading" :data="tableData" style="width: 100%">
                <el-table-column  label='名称' prop="name" align='center'>
                </el-table-column>
                <el-table-column label='ip地址'  prop="ip" align='center'>
                </el-table-column>
                <el-table-column label='端口号'  prop="port" align='center'>
                </el-table-column>
                <el-table-column  label="操作"  align='center'>
                    <template scope="scope">
                        <el-row>
                            <el-button size="small" @click="openFix(scope.$index, scope.row)">修改</el-button>
                            <el-button size="small" @click="onDelete(scope.$index,scope.row.id)">删除</el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row type="flex" justify="end" style="padding:20px 0; ">
            <el-pagination :current-page="curPage" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total" @size-change="handle_setPageSize" @current-change="handle_setCurPage">
            </el-pagination>
        </el-row>
        <el-dialog title="修改信息" :visible.sync="dialogFormVisible">
            <el-form :model="form" label-width="100px">
                <el-form-item label="平台名称" >
                    <el-input v-model="form.name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="端口" >
                    <el-input v-model="form.port" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="ip" >
                    <el-input v-model="form.ip" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleEdit">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from "../../util/api.js";
import g from "../../globals/global.js";
export default {
    data() {
        return {
            dialogFormVisible: false,
            curPage: 1,
            pageSize: 10,
            total: 10,
            tableData: [],
            listLoading: false,
            filters: {
                name: ''
            },
            form:{
                id:'',
                name:'',
                pname:'',
                ip:'',
                pid:''
            }
            ,ipregex:/((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/g,
        }
    },
    methods: {
        onAddForm() {
            this.dialogFormVisible=true
            this.form = {
                id:'',
                name:'',
                ip:'',
                port:'',
            }
        },
        handleEdit() {
            if (this.form.name.toString().trim() === '') {
                this.$alert('请输入平台名称');
                return
            }
            if (this.form.ip.toString().trim()=== '') {
                this.$alert('请输入ip地址');
                return
            }else{
                if (this.form.ip.toString().replace(this.ipregex,'') != '') {
                    this.$alert('请输入正确的ip地址');
                    return
                }
            }
            if (this.form.port.toString().trim()=== '') {
                this.$alert('请输入端口号');
                return
            }else{
                if (this.form.port.toString().replace(window.global.regex.number,'') != '') {
                    this.$alert('端口号必须为数字');
                    return
                }
            }
            this.$data.listLoading = true
            this.$http.post(g.debugUrl + "savePlatform", this.form).then((res) => {
                if (res.body.ok == -2) {
                    this.$alert('session过期', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.err == -1) {
                    this.$alert('数据库执行失败', '异常', {
                        confirmButtonText: '确定'
                    });
                } else if (res.body.ok == 1) {
                    this.$message({
                        type: 'success',
                        message: '平台信息保存成功'
                    })
                    this.form = {
                        id:'',
                        name:'',
                        ip:'',
                        port:'',
                    }
                    this.findByPage()
                } else if (res.body.ok == 0) {
                    this.$alert('参数异常', '异常', {
                        confirmButtonText: '确定'
                    });
                }
                this.$data.listLoading = false
                this.$data.dialogFormVisible = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        },
        openFix(idx,row) {
            this.dialogFormVisible = true
            this.form={
                id:row.id,
                name:row.name,
                ip:row.ip,
                port:row.port,
            }
        },  
        onDelete(idx,_id) {
            this.$confirm('确定删除该平台信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$data.listLoading = true
                    this.$http.post(g.debugUrl + "delPlatform", {id:_id}).then((res) => {
                        if (res.body.ok==1) {
                            this.$message({
                                type: 'info',
                                message: '删除成功'
                            });
                            this.tableData.splice(idx,1)
                        }
                        this.$data.listLoading = false
                    },
                        (res) => {
                            this.$data.listLoading = false
                        })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消修改'
                    });
                });
        },
        handle_setPageSize(pageSize) {
            this.$data.pageSize = pageSize
            this.findByPage()
        },
        handle_setCurPage(currentPage) {
            this.$data.curPage = currentPage
            this.findByPage()
        },
        findByPage() {
            this.$data.listLoading = true
            var postData = {
                offset: (this.$data.curPage - 1) * this.$data.pageSize,
                limit: this.$data.pageSize,
                v:this.filters
            }
            console.log(postData)
            this.$http.post(g.debugUrl + "getPlatforms", postData).then((res) => {
                if (res.body.d) {
                    this.$data.total = res.body.d.count;
                    this.$data.tableData = res.body.d.rows;
                }
                this.$data.listLoading = false
            },
                (res) => {
                    this.$data.listLoading = false
                })
        }
    },
    computed:{
    },
    mounted() {
        this.findByPage()
    },
    watch: {
        '$route'(to, from) {
            this.filters.name = ''
            this.curPage = 1
            this.pageSize = 10
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
